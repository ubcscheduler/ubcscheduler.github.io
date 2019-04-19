import React, { Component } from 'react';
import { connect } from 'react-redux';
import { jumpTo } from '../actions/calendarActions';

import '../css/components/calendar-index.css';


class CalendarIndex extends Component {
    constructor(props) {
        super(props)
        this.state = {
            position: 1,
            numSchedules: 1,
            schedules: props.schedules,
            index: props.index,
            term: props.term
        }
        this.displayPrev = this.displayPrev.bind(this)
        this.displayNext = this.displayNext.bind(this)
        this.jump = this.jump.bind(this)
        this.updatePosition = this.updatePosition.bind(this)
    }

    displayPrev(e) {
        const numSchedules = this.state.numSchedules
        let newIdx = (this.state.position - 2) % numSchedules
        if (newIdx <= -1) newIdx = numSchedules - 1
        this.props.jumpTo(newIdx)
    }
    displayNext(e) {
        const numSchedules = this.state.numSchedules
        let newIdx = this.state.position % numSchedules
        this.props.jumpTo(newIdx)
    }

    jump(e) {
        // Clip off negative indices and indices larger than numSchedules
        let newIdx = this.state.position - 1;
        if (newIdx >= this.state.numSchedules) {
            newIdx = this.state.numSchedules - 1
        } else if (newIdx < 0) {
            newIdx = 0
        }
        this.props.jumpTo(newIdx) 
    }
    updatePosition(e) {
        this.setState({
            position: e.target.value
        })
    }
    render() {
        return (
            <div className="calendar__index-container">
                <div className="arrow-container">
                    <div className="arrow arrow--left" onClick={this.displayPrev}>
                        <i className="material-icons">&#xE5CB;</i>
                    </div>
                    <div className="calendar__index">
                        <input type="number" placeholder="1" value={this.state.position} className="calendar__index__position" onChange={this.updatePosition}/>
                        <span className="index__break">/</span>
                        <span>{this.state.numSchedules}</span>
                    </div>
                    <div className="arrow arrow--right" onClick={this.displayNext}>
                        <i className="material-icons">&#xE5CC;</i>
                    </div>
                    <div className="index__jump-btn" onClick={this.jump}>Jump</div>
                </div>

            </div>
        )
    }
}
CalendarIndex.getDerivedStateFromProps = (nextProps, prevState) => {
    if (nextProps.schedules === prevState.schedules && nextProps.index === prevState.index && nextProps.term === prevState.term) return prevState

    return {
        position: nextProps.position,
        numSchedules: nextProps.numSchedules,
        schedules: nextProps.schedules,
        index: nextProps.index,
        term: nextProps.term
    }
}


const mapStateToProps = state => ({
    position: state.scheduler.index[state.scheduler.term] + 1,
    numSchedules: state.scheduler.schedules[state.scheduler.term].length,
    schedules: state.scheduler.schedules,
    index: state.scheduler.index,
    term: state.scheduler.term
});

export default connect(mapStateToProps, {jumpTo})(CalendarIndex)