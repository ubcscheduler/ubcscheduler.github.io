import React, { Component } from 'react';
import { connect } from 'react-redux';

import '../css/components/calendar-container.css';

import CalendarTable from './CalendarTable';
import CalendarBlocks from './CalendarBlocks';

import { updateBreaks } from '../actions/calendarActions';
import { toggleLock } from '../actions/scheduleActions';

class CalendarContainer extends Component {
    constructor(props) {
        super(props)

        this.state = {
            schedules: {t1: [[]], t2: [[]]},
            index: {t1: 0, t2: 0},
            term: "t1",
            breaks: [],
            lockedSections: [],
            tempSection: {}
        }

        
    }


    render() {
        return (
            <div className="calendarsContainer-wrapper">
                <div className="calendarsContainer">

                    <div className={"calendarContainer " + (this.state.term === "t1" ? "calendarContainer--selected" : "")}>
                        <CalendarTable 
                            term="t1" 
                            updateBreaks={this.props.updateBreaks}
                            breaks={this.props.breaks.t1}
                            allBreaks={this.props.breaks}/>
                        <CalendarBlocks 
                            term="t1"
                            schedule={this.state.schedules.t1[this.state.index.t1]}
                            tempSection={this.state.tempSection}
                            toggleLock={this.props.toggleLock}
                            lockedSections={this.state.lockedSections}                          
                        />
                    </div>
                    <div className={"calendarContainer " + (this.state.term === "t2" ? "calendarContainer--selected" : "")}>
                        <CalendarTable 
                            term="t2" 
                            updateBreaks={this.props.updateBreaks}
                            breaks={this.props.breaks.t2}
                            allBreaks={this.props.breaks}/>
                        <CalendarBlocks 
                            term="t2" 
                            schedule={this.state.schedules.t2[this.state.index.t2]}
                            tempSection={this.state.tempSection}
                            toggleLock={this.props.toggleLock}
                            lockedSections={this.state.lockedSections}
                        />
                    </div>
                </div>
            </div>
        )
    }
}

CalendarContainer.getDerivedStateFromProps = (nextProps, prevState) => {
    return {
        schedules: nextProps.schedules,
        index: nextProps.index,
        term: nextProps.term,
        breaks: nextProps.breaks,
        lockedSections: nextProps.lockedSections,
        tempSection: nextProps.tempSection
    }
}

const mapStateToProps = state => ({
    schedules: state.scheduler.schedules,
    index: state.scheduler.index,
    term: state.scheduler.term,    
    breaks: state.scheduler.breaks,
    lockedSections: state.scheduler.lockedSections,
    tempSection: state.course.tempSection,

});

export default connect(mapStateToProps, { updateBreaks, toggleLock })(CalendarContainer)