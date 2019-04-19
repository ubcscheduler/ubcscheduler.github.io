import { TOGGLE_LOCK } from '../actions/types';

export const toggleLock = (sectionName, term) => dispatch => {
    dispatch({
        type: TOGGLE_LOCK,
        payload: {
            sectionName: sectionName,
            term: term
        }
    })
}