import React, { Component } from 'react';
import { connect } from 'react-redux';
import swal from 'sweetalert2'

import '../css/components/break-form.css';

import TimeWidget from './TimeWidget'

import Utils from '../js/utils';
import { updateBreaks } from '../actions/calendarActions'


class BreakForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      startTime: "08:00",
      endTime: "08:30",
      term: "t1",
      days: [false, false, false, false, false],
      renderedBreaks: { t1: [], t2: [] },
      breaks: { t1: [0, 0, 0, 0, 0], t2: [0, 0, 0, 0, 0] }
    }

    this.onStartChange = this.onStartChange.bind(this)
    this.onEndChange = this.onEndChange.bind(this)
    this.toggleDay = this.toggleDay.bind(this)
    this.toggleTerm = this.toggleTerm.bind(this)
    this.addTime = this.addTime.bind(this)
    this.removeBreak = this.removeBreak.bind(this)
  }

  onStartChange(e) {
    this.setState({ "startTime": e.target.value })
  }
  onEndChange(e) {
    this.setState({ "endTime": e.target.value })
  }

  toggleDay = (dayIdx) => (e) => {
    let newDays = [...this.state.days]
    newDays[dayIdx] = !newDays[dayIdx]
    this.setState({ "days": newDays })
    e.stopPropagation()
  }

  toggleTerm = (term) => (e) => {
    if (this.state.term !== term) this.setState({ "term": term })
    e.stopPropagation()
  }

  addTime(e) {
    const term = this.state.term
    const startTime = document.getElementById("breakform__start-time").value
    const endTime = document.getElementById("breakform__end-time").value
    if (!Utils.validateTimeRange(startTime, endTime)) return
    const breakTime = Utils.stringTimeToInt(startTime, endTime)

    const days = this.state.days
    // If all days are false, return
    if (days.every((day, i) => {
      return day === false
    })) {
      swal({
        title: "No day selected",
        type: 'warning',
        timer: 1500,
        showConfirmButton: false
      })
      return
    }

    let newBreakArr = this.state.breaks[term].map((dayBreak, i) => {
      if (days[i]) {
        return dayBreak | breakTime
      } else {
        return dayBreak
      }
    })
    this.props.updateBreaks(newBreakArr, term)
    e.stopPropagation()
  }

  removeBreak = (renderedBreak) => (e) => {
    const term = this.state.term
    const breakTimeToRemove = Utils.stringTimeToInt(renderedBreak.startTime, renderedBreak.endTime)
    let newBreakArr = [...this.state.breaks[term]]
    newBreakArr[renderedBreak.dayIdx] &= ~breakTimeToRemove
    this.props.updateBreaks(newBreakArr, term)
    e.stopPropagation()
  }

  renderedBreaksByTermJSX(term) {
    return this.state.renderedBreaks[term].map((renderedBreak, i) => (
      <div className="panel__data" key={"panel__data" + this.state.term + i}>
        <span className="panel__data__component">{renderedBreak.day}</span>
        <span className="panel__data__component">{renderedBreak.startTime}</span>
        <span className="panel__data__component">to</span>
        <span className="panel__data__component">{renderedBreak.endTime}</span>
        <div className="panel__data__remove-btn" onClick={this.removeBreak(renderedBreak)}>
          <i className="material-icons">&#xE5CD;</i>
        </div>
      </div>
    ));
  }

  render() {
    return (
      <div className="tool__container tool__container--breakform">
        <TimeWidget term={this.state.term}
                    days={this.state.days}
                    startTime={this.state.startTime}
                    endTime={this.state.endTime}
                    toggleTerm={this.toggleTerm}
                    toggleDay={this.toggleDay}
                    onStartChange={this.onStartChange}
                    onEndChange={this.onEndChange}
                    addTime={this.addTime} 
                    startTimeInputId="breakform__start-time"
                    endTimeInputId="breakform__end-time"/>
        <div className="side-panel__data-container">
          <div className="panel__header panel__header--breakform">::Current Breaks::</div>
          <div className={"panel__data-container " + (this.state.term === "t1" ? "panel__data-container--selected" : "")}>
            {this.renderedBreaksByTermJSX("t1")}
          </div>
          <div className={"panel__data-container " + (this.state.term === "t2" ? "panel__data-container--selected" : "")}>
            {this.renderedBreaksByTermJSX("t2")}
          </div>
        </div>
      </div>
    )
  }
}


function getRenderedBreaksByTerm(breakArr) {
  let renderedBreaks = []
  breakArr.forEach((dayBreak, dayIdx) => {
    let inBreak = false
    let prevIStart = 0

    for (let i = 0; i < 32; i++) {
      let isIthBitOne = (((dayBreak >> i) & 1) === 1)
      //Just fininshed a break segment
      if (inBreak && !isIthBitOne) {
        renderedBreaks.push({
          dayIdx: dayIdx,
          day: Utils.getDay(dayIdx),
          startTime: Utils.intToTime(prevIStart),
          endTime: Utils.intToTime(i)
        })
        inBreak = false
      }
      // Just starting a break segment
      else if (!inBreak && isIthBitOne) {
        prevIStart = i
        inBreak = true
      }
    }
  })
  return renderedBreaks
}

BreakForm.getDerivedStateFromProps = (nextProps, prevState) => {
  let newRenderedBreaks;
  if (nextProps.breaks === prevState.breaks) {
    newRenderedBreaks = prevState.renderedBreaks
  } else {
    newRenderedBreaks = {
      t1: getRenderedBreaksByTerm(nextProps.breaks.t1),
      t2: getRenderedBreaksByTerm(nextProps.breaks.t2)
    }
  }
  return {
    startTime: prevState.startTime,
    endTime: prevState.endTime,
    term: prevState.term,
    days: prevState.days,
    renderedBreaks: newRenderedBreaks,
    breaks: nextProps.breaks
  }
}



const mapStateToProps = state => ({
  breaks: state.scheduler.breaks
});

export default connect(mapStateToProps, { updateBreaks })(BreakForm)