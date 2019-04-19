import React, { Component } from 'react'

import '../css/components/side-panel.css';

import InstructionWrap from './InstructionWrap';
import Control from './Control';
import BreakForm from './BreakForm';
import CreateCourseForm from './CreateCourseForm';
import Register from './Register';

export default class SidePanel extends Component {
    render() {
        return (
            <div className="side-panel">
                <div className="side-panel__contents">
                    <InstructionWrap
                        contentComponent={<Control />}
                        instructionId="control"
                        instructionType="Add Courses + Lock Sections"
                        instruction="Add courses by selecting from the auto-complete options. If a course is not listed, try entering a course and pressing enter. Lock/Unlock sections from the course widget or right-clicking on the calendar"
                    />
                    <InstructionWrap
                        contentComponent={<BreakForm />}
                        instructionId="breaks"
                        instructionType="Breaks"
                        instruction="Add breaks from the widget or by dragging on the calendar" />
                    <InstructionWrap
                        contentComponent={<CreateCourseForm />}
                        instructionId="customcourses"
                        instructionType="Custom courses"
                        instruction="Create a custom course here for Standard Timetables or courses not found" />
                    <InstructionWrap
                        contentComponent={<Register />}
                        instructionId="register"
                        instructionType="Register"
                        instruction="Follow each of the links and add them to your ssc!" />
                </div>
            </div>
        )
    }
}
