import { SAVE_SCHEDULE, LOAD_SCHEDULE, REMOVE_SAVE, RESTORE_SAVES_FROM_LOCAL_STORAGE} from '../actions/types';

export const loadSchedule = (save) => dispatch => {
    dispatch({
        type: LOAD_SCHEDULE,
        payload: save
    })
}

export const saveSchedule = () => dispatch => {
    dispatch({
        type: SAVE_SCHEDULE,
    })
}

export const removeSave = (save) => dispatch => {
    dispatch({
        type: REMOVE_SAVE,
        payload: save
    })
}

export const restoreSavesFromLocalStorage = () => dispatch => {
    dispatch({
        type: RESTORE_SAVES_FROM_LOCAL_STORAGE
    })
}