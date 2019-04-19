import React, { Component } from 'react'

import '../css/components/block-section.css';

import ColorManager from '../js/colorManager'
import BreakDragHelper from '../js/breakDragHelper'
import UTILS from '../js/utils'

export default class BlockSection extends Component {

  getStart(schedule) {
    for (let i = 0; i < 32; i++) {
      if ((schedule >> i) & 1) {
        return i;
      }
    }
  }

  getHeight(schedule, start) {
    for (let i = start; i < 32; i++) {
      if (!((schedule >> i) & 1)) {
        return i - start;
      }
    }
  }

  getStyle(schedule) {
    const BLOCK_HEIGHT = 25
    // const schedule = this.props.schedule

    let top = this.getStart(schedule)
    let height = this.getHeight(schedule, top)
    height *= BLOCK_HEIGHT
    top *= BLOCK_HEIGHT

    let course = this.props.name.split(" ")
    course = course[0] + " " + course[1]

    let color;
    if (this.props.temp) {
      color = ColorManager.getTemp()
    } else {
      color = ColorManager.get(course)
    }
    return {
      'top': top + 'px',
      'height': height + 'px',
      'backgroundColor': color
    }
  }

  // Propagates mousedown and mouseover to block underneath
  triggerLower(e) {
    //Skip if not left click
    if (e.button !== 0) {
      return false;
    }
    const mouseX = e.pageX
    const mouseY = e.pageY
    let lowerElement;
    if (!document.elementsFromPoint) document.elementsFromPoint = UTILS.elementsFromPoint

    lowerElement = document.elementsFromPoint(mouseX, mouseY).find((element) => {
      return element.classList.contains("calendar__block")
    });

    if (!lowerElement) return;
    let event
    const parentElement = e.target
    switch (e.type) {
      case "mousedown":
        event = new MouseEvent('mousedown', {
          bubbles: true,
        });
        parentElement.style.pointerEvents = 'none'
        BreakDragHelper.addForegroundElement(parentElement)
        lowerElement.dispatchEvent(event)
        break;
      case "mouseover":
        if (BreakDragHelper.getMousedown()) {
          parentElement.style.pointerEvents = 'none'
          BreakDragHelper.addForegroundElement(parentElement)
          event = new MouseEvent('mouseover', {
            bubbles: true,
          });
          lowerElement.dispatchEvent(event)
        }
        break;
      default:
        break;
    }
  }

  toggleLock(e) {
    
    e.preventDefault()
    if (this.props.temp) return
    //e.preventDefault()
    const sectionName = e.currentTarget.attributes["data-section"].value
    this.props.toggleLock(sectionName, this.props.term)
    e.stopPropagation()

  }

  //Helper function that returns an int where the start bit to the end - 1 bit is set to 1
  getBitSchedule(start,end) {
    let intSchedule = 0;
    for (var i = start; i < end; i++) {
        intSchedule |= (1 << i)
    }
    return intSchedule
  }

  //If a section has disjoint times, then split the schedule into parts where the ^ of each section is equal to the original
  getSchedules(schedule) {
    let schedules = []

    let inBreak = false
    let prevIStart = 0

    for (let i = 0; i < 32; i++) {
      let isIthBitOne = (((schedule >> i) & 1) === 1)
      //Just fininshed a break segment
      if (inBreak && !isIthBitOne) {
        schedules.push(this.getBitSchedule(prevIStart, i))
        inBreak = false
      }
      // Just starting a break segment
      else if (!inBreak && isIthBitOne) {
        prevIStart = i
        inBreak = true
      }
    }

    return schedules
  }

  mapSectionToDivs() {
    let schedules = this.getSchedules(this.props.schedule)
    return schedules.map((schedule, i) => {
      let blockStyle = this.getStyle(schedule)
      return (
        <div  key={"block__section " + this.props.name + i }
              className={"block__section " + (this.props.lockedSections && this.props.lockedSections.includes(this.props.name) ? "block__section--locked" : "")}
          style={blockStyle}
          onMouseDown={this.triggerLower}
          onMouseOver={this.triggerLower}
          onContextMenu={this.toggleLock.bind(this)}
          data-section={this.props.name}>
          <span>{this.props.name}</span>
          <div className="block__section__lock">
            <i className="material-icons">&#xE897;</i>
          </div>
        </div>
      )
    })
  }

  render() {
    return (
      <React.Fragment>
        {this.mapSectionToDivs()}
      </React.Fragment>
    )
  }
}
