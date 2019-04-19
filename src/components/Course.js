import React, { Component } from 'react'

import ColorManager from '../js/colorManager'

import '../css/components/course.css';

import Section from './Section'

export default class Course extends Component {
    constructor(props) {
        super(props)
        let color = ColorManager.add(props.course.code)
        if (!color) color = 'rgba(82, 165, 255, 0.6)';
        this.state = {
            course: props.course,
            color: color,
            waitlists: {t1: [], t2: []},
            isFilteringWaitingList: {t1: false, t2: false},
            combinedTermSchedule: []
        }
        this.toggleCourse = this.toggleCourse.bind(this)
        this.removeCourse = this.removeCourse.bind(this)
        this.toggleCourseTerm = this.toggleCourseTerm.bind(this)
        this.filterWaitingList = this.filterWaitingList.bind(this)
    }

    filterWaitingListHelper(newState, term) {
        const lectureIdx = this.state.course.activity_types[term].indexOf('Lecture')
        if (this.state.isFilteringWaitingList[term]) {
            
            newState.course[term][lectureIdx] = this.state.course[term][lectureIdx].concat(this.state.waitlists[term])
            newState.waitlists[term] = []
            newState.isFilteringWaitingList[term] = false
            
        } else {
            newState.waitlists[term] = this.state.course[term][lectureIdx].filter(section => section.activity === 'Waiting List')
            newState.course[term][lectureIdx] = this.state.course[term][lectureIdx].filter(section => section.activity !== 'Waiting List')
            newState.isFilteringWaitingList[term] = true
        }
        this.setState(newState)
    }

    filterWaitingList(e) {
        const term = this.state.course.term
        
        let newState = {...this.state}
        
        if (term === "t1-2") {
            this.filterWaitingListHelper(newState, "t1")
            this.filterWaitingListHelper(newState, "t2")
        } else {
            this.filterWaitingListHelper(newState, term)
        }
         
        this.props.filterWaitingList(newState.course)  
        e.stopPropagation()      
    }

    toggleCourse(e) {
        this.props.toggleCourse(this.state.course)
        e.stopPropagation()
    }

    removeCourse(e) {
        ColorManager.remove(this.state.course.code)
        this.props.removeCourse(this.state.course.code);
        e.stopPropagation();
    }

    toggleCourseTerm = (term) => e => {
        if (this.state.course.term !== term) {
            this.props.toggleCourseTerm(this.state.course.code, term)
        }
        e.stopPropagation();
    }

    sectionsByTermJSX(term) {
        return this.state.course[term].map((sectionsByActivity, i) => (
            <div className="course__sections" key={this.state.course.code + "_sections_" + i}>
                <div className="course__sections__activity">{this.state.course.activity_types[term][i]}</div>
                {

                    sectionsByActivity.map(section => (
                        <Section
                            key={this.state.course.code + "_sections_" + section.section}
                            section={section}
                            addTemp={this.props.addTemp}
                            removeTemp={this.props.removeTemp}
                            toggleLock={this.props.toggleLock}
                            combinedTermSchedule={this.props.combinedTermSchedule}
                            term={term}
                        />
                    ))
                }
            </div>
        ));
    }

    render() {
        const courseStyle = {
            'backgroundColor': this.state.color
        }
        let courseExtra;
        if (this.state.course.active) {
            courseExtra = (
                <div className="course__extra">
                    <div className="course__term-container">
                        {this.state.course.availableTerms.map(term => (
                            <div key={"course__term"+this.state.course.code+term}
                                className={"course__button course__term " + (this.state.course.term === term ? "course__term--selected" : "")} 
                                onClick={this.toggleCourseTerm(term)}>Term {term.substring(1)}</div>
                        ))}                        
                    </div>
                    <div className={"course__container " + (this.state.course.term === "t1" || this.state.course.term === "t1-2" ? "course__container--active" : "")}>
                        {this.sectionsByTermJSX("t1")}
                    </div>
                    <div className={"course__container " + (this.state.course.term === "t2" ? "course__container--active" : "")}>
                        {this.sectionsByTermJSX("t2")}
                    </div>
                    <div className={"course__button course__waitlist-filter " + (this.state.isFilteringWaitingList[this.state.course.term] ? "course__button--selected" : "")}
                         onClick={this.filterWaitingList}>
                         {(this.state.isFilteringWaitingList[this.state.course.term] ? "Unfilter Waitlist" : "Filter Waitlist")}
                    </div>
                </div>
            )
        }
        return (
            <div className={'remove-btn-parent course ' + (this.state.course.active ? "course--active" : "")} style={courseStyle} onClick={this.toggleCourse}>
                <div className="remove-btn" onClick={this.removeCourse}>
                    <i className="material-icons">&#xE5CD;</i>
                </div>
                <div className="course__code">{this.state.course.code}</div>
                {courseExtra}
            </div>
        )
    }
}

Course.getDerivedStateFromProps = (nextProps, prevState) => {
    return {
        ...prevState,
        combinedTermSchedule: nextProps.combinedTermSchedule,
        course: nextProps.course
    }
}