import { ADD_COURSE, ADD_CUSTOM_COURSE, REMOVE_COURSE, TOGGLE_COURSE_TERM, UPDATE_BREAKS, TOGGLE_LOCK, FILTER_WAITING_LIST} from '../actions/types'

import schedule from './scheduler'

/** Scheduling middleware to automatically schedule when: 
 *   ADD_COURSE, LOCK_SECTION, ADD_BREAK, MODIFY_COURSE
 */
const schedulerMiddleware = (store) => (next) => (action) => {
    let state = store.getState()
    let courses;
    action.prevSchedules = state.scheduler.schedules
    action.prevIndex = state.scheduler.index
    switch (action.type) {
      case ADD_CUSTOM_COURSE:
      case ADD_COURSE:
        courses = [...state.course.courses]
        let idx = state.course.courses.findIndex(element => {
          return element.code === action.payload.code
        });
        if (idx === -1) {
          courses.push(action.payload)
          action.schedules = schedule(courses, state.scheduler.breaks, state.scheduler.lockedSections)
        } else {
          action.schedules = state.scheduler.schedules
        }
        break;   
      case REMOVE_COURSE:
        courses = [...state.course.courses].filter(course => course.code !== action.payload)
        action.schedules = schedule(courses, state.scheduler.breaks, state.scheduler.lockedSections)
        break;
      case TOGGLE_COURSE_TERM: 
        courses = [...state.course.courses]
        courses.forEach(e => {
          if (e.code === action.payload.code) {
            e.term = action.payload.term
          }
        })
        action.schedules = schedule(courses, state.scheduler.breaks, state.scheduler.lockedSections)
        action.newCourses = courses
        break;
      case UPDATE_BREAKS:
        courses = [...state.course.courses]
        let newBreaks = {
            ...state.scheduler.breaks
        }
        newBreaks[action.payload.term] = action.payload.breakArr
        action.schedules = schedule(state.course.courses, newBreaks, state.scheduler.lockedSections)
        action.newBreaks = newBreaks
        action.term = action.payload.term
        action.courses = courses
        break;
      case TOGGLE_LOCK:
        let newLockedSections;
        let sectionToLock = action.payload.sectionName
        if (state.scheduler.lockedSections.includes(sectionToLock)) {
            // Unlock
            newLockedSections = state.scheduler.lockedSections.filter(s => s !== sectionToLock)
        } else {
            // Lock
            let newSectionSplit = sectionToLock.split(" ")
            // Remove lockedSections of the same course type
            newLockedSections = state.scheduler.lockedSections.filter(section => {
              let sectionSplit = section.split(" ")
              return !(sectionSplit[0] === newSectionSplit[0] && sectionSplit[1] === newSectionSplit[1] && sectionSplit[2][0] === newSectionSplit[2][0])
            })          
 
            newLockedSections.push(sectionToLock)
        }
        action.term = action.payload.term
        action.newLockedSections = newLockedSections
        action.schedules = schedule(state.course.courses, state.scheduler.breaks, newLockedSections)
        break;
      case FILTER_WAITING_LIST:
        //Replace course with the same code as action.payload
        let newCourses = [...state.course.courses]
        const courseIdx = newCourses.findIndex(course => course.code === action.payload.code)
        newCourses[courseIdx] = action.payload
        action.newCourses = newCourses
        action.schedules = schedule(newCourses, state.scheduler.breaks, state.scheduler.lockedSections)
        break;
      default:
        break;
    }
  
    next(action)
  }

export default schedulerMiddleware