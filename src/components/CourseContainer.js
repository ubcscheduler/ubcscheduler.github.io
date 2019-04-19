import React, { Component } from 'react';
import { connect } from 'react-redux';


import '../css/components/course-container.css';

import { removeCourse, toggleCourseTerm, addTemp, removeTemp, filterWaitingList, toggleCourse } from '../actions/panelActions';
import { toggleLock } from '../actions/scheduleActions';
import Course from './Course.js'



class CourseContainer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            courses: [],
            combinedTermSchedule: []
        }
    }
    render() {
        const courseElements = this.state.courses.map((course, i) => {
            return (
                <Course 
                    key={course.code + " element"} 
                    course={course} 
                    toggleCourseTerm={this.props.toggleCourseTerm}
                    removeCourse={this.props.removeCourse}
                    addTemp={this.props.addTemp}
                    removeTemp={this.props.removeTemp}
                    toggleLock={this.props.toggleLock}
                    filterWaitingList={this.props.filterWaitingList}
                    toggleCourse={this.props.toggleCourse}
                    combinedTermSchedule={this.state.combinedTermSchedule}
                />
            )
        });

        return (
            <div className="course-container">
                {courseElements}
            </div>
        )
    }
}



CourseContainer.getDerivedStateFromProps = (nextProps, prevState)=>  {
    const t1Schedule = nextProps.schedules.t1[nextProps.index.t1]
    const t2Schedule = nextProps.schedules.t2[nextProps.index.t2]
    let combinedTermSchedule = [...t1Schedule, ...t2Schedule]
    return {
        courses: nextProps.courses,
        combinedTermSchedule: combinedTermSchedule
    }
}

const mapStateToProps = state => ({
    courses: state.course.courses,
    schedules: state.scheduler.schedules,
    index: state.scheduler.index
});

export default connect(mapStateToProps, { removeCourse, toggleCourseTerm, addTemp, removeTemp, toggleLock, filterWaitingList, toggleCourse })(CourseContainer)