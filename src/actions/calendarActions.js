import { JUMP_TO, TOGGLE_TERM, UPDATE_BREAKS } from '../actions/types';

export const jumpTo = (idx) => dispatch => {
    dispatch({
        type: JUMP_TO,
        payload: idx
    })
}


export const toggleTerm = (term) => dispatch => {
    dispatch({
        type: TOGGLE_TERM,
        payload: term
    })
}

export const updateBreaks = (breakArr, term) => dispatch => {
    dispatch({
        type: UPDATE_BREAKS,
        payload: {
            breakArr: breakArr,
            term: term
        }
    })
}