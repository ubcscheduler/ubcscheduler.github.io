import { FETCH_COURSELIST, ADD_COURSE, ADD_CUSTOM_COURSE, REMOVE_COURSE, TOGGLE_COURSE_TERM, TOGGLE_COURSE, ADD_TEMP, REMOVE_TEMP, FILTER_WAITING_LIST, TOGGLE_INSTRUCTION_WRAP } from '../actions/types';

import { getStaticCourselist, scrapeCourse } from '../js/backupScraper'

import { applyRules } from '../js/fetchCourseRules'

function preprocessCourse(course) {
    course.code = course.code.replace("_", " ")
    course.active = true;
    course.availableTerms = []
    // if every sectionsByActivity is "1-2"
    let everySectionT12 = course.t1.every(sectionsByActivity => 
            sectionsByActivity.every(section => section.term === "1-2")
        )
    if (course.t1.length !== 0 && everySectionT12) {
        course.availableTerms.push("t1-2")
        course.term = "t1-2"
        return
    }

    if (course.t1.length !== 0) {
        course.availableTerms.push("t1")
        course.term = "t1"
    } 

    if (course.t2.length !== 0) {
        course.availableTerms.push("t2")
        if (course.term !== "t1") course.term = "t2"
    }

    applyRules(course)

}

export const fetchCourselist = () => dispatch => {
    // fetch('/api/v1/courselist')
    // .then(res => {
    //     if (res.ok) return res.json()
    //     else throw new Error('Fetch error')
    // })
    // .then(courselist => {            
    //         dispatch({
    //             type: FETCH_COURSELIST,
    //             payload: courselist.list
    //         })
    //     }        
    // ).catch(error => getStaticCourselist(dispatch))
    getStaticCourselist(dispatch)
};


export const addCourse = (courseCode) => dispatch => {
    courseCode = courseCode.replace(" ", "_")
    // fetch(`/api/v1/course/${courseCode}`)
    // .then(res => {
    //     if (res.ok) return res.json()
    //     else throw new Error('Fetch error')
    // })
    // .then(course => {
    //     preprocessCourse(course)
    //     dispatch({
    //         type: ADD_COURSE,
    //         payload: course,
    //         term: course.term
    //     })
    // })
    // .catch(error => scrapeCourse(dispatch, courseCode, preprocessCourse))
    scrapeCourse(dispatch, courseCode, preprocessCourse)
};

export const addCustomCourse = (course) => dispatch => {
    dispatch({
        type: ADD_CUSTOM_COURSE,
        payload: course,
        term: course.term
    })
}

export const removeCourse = (code) => dispatch => {
    dispatch({
        type: REMOVE_COURSE,
        payload: code
    })
};

export const toggleCourseTerm = (code, term) => dispatch => {
    dispatch({
        type: TOGGLE_COURSE_TERM,
        payload: {code: code, term: term},
        term: term
    })
}



export const addTemp = (section) => dispatch => {
    dispatch({
        type: ADD_TEMP,
        payload: section
    })
}

export const removeTemp = () => dispatch => {
    dispatch({
        type: REMOVE_TEMP
    })
}

export const filterWaitingList = (course) => dispatch => {
    dispatch({
        type: FILTER_WAITING_LIST,
        payload: course
    })
}

export const toggleInsructionWrap = (instructionId) => dispatch => {
    dispatch({
        type: TOGGLE_INSTRUCTION_WRAP,
        payload: instructionId
    })
}

export const toggleCourse = (course) => dispatch => {
    dispatch({
        type: TOGGLE_COURSE,
        payload: course
    })
}