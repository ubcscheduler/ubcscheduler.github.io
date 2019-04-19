import { LOAD_SCHEDULE, ADD_COURSE, TOGGLE_COURSE_TERM, JUMP_TO, REMOVE_COURSE, TOGGLE_TERM, UPDATE_BREAKS, TOGGLE_LOCK, ADD_CUSTOM_COURSE, FILTER_WAITING_LIST } from '../actions/types';
import { alertNoSchedule } from '../js/userAlerts';

const initialState = {
    schedules: {t1:[[]], t2:[[]]},
    index: {t1: 0, t2: 0},
    tempIndex: 0,
    term: "t1",
    breaks: {
        "t1": [0,0,0,0,0],
        "t2": [0,0,0,0,0]
    },
    lockedSections: [],
    customNumber: 1
}

function mergeBreaks(break1, break2) {
    let mergedBreaks = [0,0,0,0,0]
    for (let i = 0; i < 5; i++) {
        mergedBreaks[i] = break1[i] & break2[i]
    }
    return mergedBreaks
}

function isScheduleEmpty(schedules, term) {
    // if schedules.term looks like [[]]
    if (schedules[term].length === 1 && schedules[term][0].length === 0) {
        return true
    } else {
        return false
    }
}

function termCourseExists(courses, term) {
    let termCourse = courses.find(course => course.term === term || course.term === 't1-2')
    if (termCourse) return true
    else return false
}

function handleAlerts(prevState, newState, action) {
    switch (action.type) {
        // If a schedule for a term is not empty, return newState
        case ADD_CUSTOM_COURSE:
        case ADD_COURSE:
        case TOGGLE_COURSE_TERM:
            let emptySchedule;
            if (action.term === "t1-2") {
                emptySchedule = isScheduleEmpty(newState.schedules, "t1") || isScheduleEmpty(newState.schedules, "t2")
            } else {
                emptySchedule = isScheduleEmpty(newState.schedules, action.term)
            }     
            if (emptySchedule) break;
            return newState
        // These actions only care about the current term
        case UPDATE_BREAKS:
            // Merge old breaks and newState.breaks to take the less constrained option
            if (isScheduleEmpty(newState.schedules, action.term) && termCourseExists(action.courses, action.term)) {
                let lessConstrainedBreaks = {}
                lessConstrainedBreaks.t1 = mergeBreaks(prevState.breaks.t1, newState.breaks.t1)
                lessConstrainedBreaks.t2 = mergeBreaks(prevState.breaks.t2, newState.breaks.t2)
                prevState = {...prevState}
                prevState.breaks = lessConstrainedBreaks
                break;
            }
            return newState;
        case TOGGLE_LOCK:
            if (isScheduleEmpty(newState.schedules, action.term)) break;
            return newState;
        default: 
            return newState;
    }
    // Only errors get this far
    alertNoSchedule(action, newState)
    return prevState
}

//TODO: Add break, lock section
export default function(state = initialState, action) {
    let newState;
    switch (action.type) {
        case ADD_CUSTOM_COURSE:
            newState = {
                ...state,
                schedules: action.schedules,
                index: {t1: 0, t2: 0},
                customNumber: (state.customNumber+1)%100
            }
            break;
        case REMOVE_COURSE:   
            return {
                ...state,
                schedules: action.schedules,
                index: {t1: 0, t2: 0}
            }
        case FILTER_WAITING_LIST:
        case ADD_COURSE:        
        case TOGGLE_COURSE_TERM:
            newState = {
                ...state,
                schedules: action.schedules,
                index: {t1: 0, t2: 0}
            }
            break;
        case JUMP_TO:
            let newIdx = {...state.index}
            newIdx[state.term] = action.payload
            newState = {
                ...state,
                index: newIdx
            }
            break;
        case TOGGLE_TERM:
            newState = {
                ...state,
                term: action.payload
            }
            break;
        case UPDATE_BREAKS:
            //Preprocessed in middleware
            newState = {
                ...state,
                schedules: action.schedules,
                index: {t1: 0, t2: 0},
                breaks: action.newBreaks
            }
            break;
        case TOGGLE_LOCK:
            // Preprocessed in middleware
            
            newState = {
                ...state,
                schedules: action.schedules,
                index: {t1: 0, t2: 0},
                lockedSections : action.newLockedSections,
            }
            break;
        case LOAD_SCHEDULE:
            newState = {
                schedules: action.schedules,
                index: action.index,
                term: action.term,
                breaks: action.breaks,
                lockedSections: action.lockedSections,
                customNumber: action.customNumber                
            }
            break;
        default:
            newState = state
            return state;
    }

    newState = handleAlerts(state, newState, action);
    return newState
}

