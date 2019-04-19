import React, { Component } from 'react'
import SearchTool from './SearchTool';
import CourseContainer from './CourseContainer';

import '../css/components/control.css';


export default class Control extends Component {
    render() {
        return (
            <div className="tool__container tool__container--control">
                <SearchTool />
                <div className="course-container-header">:: COURSES ::</div>
                <CourseContainer />
            </div>
        )
    }
}
