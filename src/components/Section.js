import React, { Component } from 'react'

import '../css/components/section.css';


export default class Section extends Component {
    constructor(props) {
        super(props)

        this.addTemp = this.addTemp.bind(this)
        this.removeTemp = this.removeTemp.bind(this)
        this.toggleLock = this.toggleLock.bind(this)
    }

    addTemp(e) {
        if (!this.sectionActive()) this.props.addTemp(this.props.section)
    }
    removeTemp(e) {
        this.props.removeTemp()
    }
    toggleLock(e) {
        this.props.toggleLock(this.props.section.course + " " + this.props.section.section, this.props.term)
        e.stopPropagation()
    }

    sectionActive() {
        const sectionName = this.props.section.course + " " + this.props.section.section
        return this.props.combinedTermSchedule.find(section => (section.course + " " + section.section) === sectionName)
        
    }
    render() {
        return (
            <div
                className={"course__button course__section " + (this.sectionActive() ? "course__button--selected" : "")} 
                onMouseOver={this.addTemp}
                onMouseOut={this.removeTemp}
                onClick={this.toggleLock}>
                {this.props.section.section}
            </div>
        )
    }
}


