import { SAVE_SCHEDULE, LOAD_SCHEDULE} from '../actions/types'

import schedule from './scheduler'

const saveMiddleware = (store) => (next) => (action) => {
    let state = store.getState()
    let save;
    switch (action.type) {
      case SAVE_SCHEDULE:
        save = {
            courses: state.course.courses,
            index: state.scheduler.index,
            term: state.scheduler.term,
            breaks: state.scheduler.breaks,
            lockedSections: state.scheduler.lockedSections,
            customNumber: state.scheduler.customNumber,
            id: state.save.nextId,
            selected: false
        }
        action.payload = save
        break; 
      case LOAD_SCHEDULE: 
        save = action.payload
        action.courses = save.courses
        action.index = save.index
        action.term = save.term
        action.breaks = save.breaks
        action.lockedSections = save.lockedSections
        action.customNumber = save.customNumber
        action.schedules = schedule(action.courses, action.breaks, action.lockedSections)
        break;
      default:
        break;
    }
  
    next(action)
  }

export default saveMiddleware