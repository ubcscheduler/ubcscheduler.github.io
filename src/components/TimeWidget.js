import React, { Component } from 'react'

import '../css/components/time-widget.css';

export default class TimeWidget extends Component {
    render() {
        return (
            <div className="timewidget">
                <div className="time-widget__terms">
                    <div className={"btn btn--blue time-widget__term " + (this.props.term === "t1" ? "btn--blue--selected" : "")} onClick={this.props.toggleTerm("t1")}>Term 1</div>
                    <div className={"btn btn--blue time-widget__term " + (this.props.term === "t2" ? "btn--blue--selected" : "")} onClick={this.props.toggleTerm("t2")}>Term 2</div>
                </div>
                <div className="time-widget__days">
                    <div className={"panel__btn time-widget__day " + (this.props.days[0] ? "time-widget__btn--selected" : "")} onClick={this.props.toggleDay(0)}>Mon</div>
                    <div className={"panel__btn time-widget__day " + (this.props.days[1] ? "time-widget__btn--selected" : "")} onClick={this.props.toggleDay(1)}>Tue</div>
                    <div className={"panel__btn time-widget__day " + (this.props.days[2] ? "time-widget__btn--selected" : "")} onClick={this.props.toggleDay(2)}>Wed</div>
                    <div className={"panel__btn time-widget__day " + (this.props.days[3] ? "time-widget__btn--selected" : "")} onClick={this.props.toggleDay(3)}>Thu</div>
                    <div className={"panel__btn time-widget__day " + (this.props.days[4] ? "time-widget__btn--selected" : "")} onClick={this.props.toggleDay(4)}>Fri</div>
                </div>
                <div className="time-widget__input-container">
                    <input type="time"
                        className="time-widget__input"
                        id={this.props.startTimeInputId}
                        value={this.props.startTime}
                        onChange={this.props.onStartChange} />
                    <span className="time-widget__span">to</span>
                    <input type="time"
                        className="time-widget__input"
                        id={this.props.endTimeInputId}
                        value={this.props.endTime}
                        onChange={this.props.onEndChange} />
                </div>
                <div className="btn btn-icon btn--blue time-widget__add-btn" onClick={this.props.addTime}>
                    <i className="material-icons">add</i>
                    <span>time</span>
                </div>
            </div>
    )
    }
}
