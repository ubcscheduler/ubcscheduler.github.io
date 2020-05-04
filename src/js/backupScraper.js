import { FETCH_COURSELIST, ADD_COURSE } from '../actions/types';

import Utils from './utils'
import courselist from './courselist'
import { alertCourseInvalid, alertLoading } from '../js/userAlerts';


export const getStaticCourselist = (dispatch) => {
    dispatch({
        type: FETCH_COURSELIST,
        payload: courselist
    })
}

function getActivityIdx(courseObj, section, termString) {
    let sectionActivity = section.activity
    if (sectionActivity === "Waiting List") {
        sectionActivity = "Lecture"
    }
    let activityIdx = courseObj.activity_types[termString].indexOf(sectionActivity)

    if (activityIdx === -1) {
        activityIdx = courseObj.activity_types[termString].length
        courseObj.activity_types[termString].push(sectionActivity)
        courseObj[termString].push([])
    }
    return activityIdx 
}

function addSection(courseObj, section, term, activityIdx) {
    // Duplicate section
    if (courseObj[term][activityIdx].find(s => s.section === section.section)) return
    courseObj[term][activityIdx].push(section)
}

function addSectionToCourse(courseObj, section) {
    let activityIdx1, activityIdx2
    if (section.term === "1") {
        activityIdx1 = getActivityIdx(courseObj, section, "t1")
        addSection(courseObj, section, "t1", activityIdx1)
        
    } else if (section.term === "2") {
        activityIdx2 = getActivityIdx(courseObj, section, "t2")
        addSection(courseObj, section, "t2", activityIdx2)
    } else if (section.term === "1-2") {
        activityIdx1 = getActivityIdx(courseObj, section, "t1")
        activityIdx2 = getActivityIdx(courseObj, section, "t2")
        addSection(courseObj, section, "t1", activityIdx1)
        addSection(courseObj, section, "t2", activityIdx2)
    } else {
        console.log("Term invalid for section", section)
    }
}

 // Don't do anything if section.activity is "Waiting List" "Distance Education" "STT" "Unreleased" or noTimes
function isSectionInvalid(section) {
    return (
        section.activity === "Distance Education" || 
        section.status === "STT" ||
        section.status === "Unreleased" ||
        section.schedule.every(daySchedule => daySchedule === 0))    
}

export const scrapeCourse = (dispatch, course, preprocessCourse) => {
    try {
        course = course.replace("_", " ")
        var courseObj = {
            "code": course,
            "t1" : [],
            "t2": [],
            "activity_types": {t1: [], t2: []}
        }
        let splitCourse = course.split(" ")
        const sessURL = "&sessyr=2020&sesscd=W"
        const courseURL = `https://courses.students.ubc.ca/cs/courseschedule?pname=subjarea&tname=subj-course&dept=${splitCourse[0]}&course=${splitCourse[1]}` + sessURL
        // swal({
        //     title: `Loading ${course}`,
        //     timer: 10000,
        //     onOpen: function() {
        //         swal.showLoading()
        //     }
        // })
        let swal = alertLoading(course)
        fetch('https://cors-anywhere.herokuapp.com/' + courseURL)
        .then(response => response.text())
        .then(text => {
            try {
                let parser = new DOMParser();
                let doc = parser.parseFromString(text, 'text/html')
                let sectionTable = doc.getElementsByClassName('section-summary')[0]

                let tableBody = sectionTable.getElementsByTagName('tbody')[0]

                let rows = tableBody.getElementsByTagName('tr')
                var prevSection = {}
                // tds: status, section activity, term, interval, days, starttime, endtime
                Array.from(rows).forEach(row => {
                    let tds = row.getElementsByTagName('td')
                    let status = tds[0].textContent.trim()
                    let term = tds[3].textContent.trim()
                    let sectionName;
            
                    if (tds[1].getElementsByTagName('a')[0]) {
                        sectionName = tds[1].getElementsByTagName('a')[0].textContent.trim() 
                    } else {
                        // E.g. HIST 346 If section spans two terms
                        if (term !== prevSection.term) {
                            term = "1-2"
                            prevSection.term = "1-2"
                        }
                        sectionName = prevSection.course + " " + prevSection.section
                    }

                    let activity = tds[2].textContent.trim()
                    
                    let days = tds[5].textContent.trim()
                    let startTime = tds[6].textContent.trim()
                    let endTime = tds[7].textContent.trim()
                    let dayArr = Utils.getDayArr(days)
                    let schedule = Utils.getSectionTimeArr(dayArr, startTime, endTime)
                    let section = {
                        course: course,
                        section: sectionName.split(" ")[2],
                        activity: activity,
                        status: status,
                        term: term,
                        instructors: [],
                        schedule: schedule
                    }
                    prevSection = section
                    if (isSectionInvalid(section)) return
                    addSectionToCourse(courseObj, section)
                })
                preprocessCourse(courseObj)
                dispatch({
                    type: ADD_COURSE,
                    payload: courseObj,
                    term: courseObj.term
                })
            } catch (e) {
                alertCourseInvalid(course)
            }
            
        })
        // swal.close()
    } catch (e) {
        alertCourseInvalid(course)
    }
    
}