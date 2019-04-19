import { ADD_COURSE, TOGGLE_COURSE_TERM, UPDATE_BREAKS, TOGGLE_LOCK } from '../actions/types';
import swal from 'sweetalert2'

export const alertNoSchedule = (action, newState) => {
    let errorMsg = "No schedules found";
    switch (action.type) {
        case ADD_COURSE:
            errorMsg = `${errorMsg} adding ${action.payload.code} in ${newState.term}`
            break;
        case TOGGLE_COURSE_TERM:
            errorMsg = `${errorMsg} toggling term for ${action.payload.code}`
            break;
        case UPDATE_BREAKS:
            errorMsg = `${errorMsg} updating breaks`
            break;
        case TOGGLE_LOCK:
            errorMsg = `${errorMsg} locking ${action.payload.sectionName}`
            break;
        default:
            errorMsg = `${errorMsg}`
            break;
    }
    swal({
        title: errorMsg,
        type: 'error',
        timer: 1500,
        showConfirmButton: false
    })
}

export const alertCourseInvalid = (code) => {
    let errorMsg = `course: ${code} is unavailable`
    swal({
        title: errorMsg,
        type: 'error',
        timer: 2000,
        showConfirmButton: false
    })
}

export const alertLoading = (course) => {
    swal({
        title: `Loading ${course}`,
        showConfirmButton: false,
        timer: 2000,
        onOpen: function() {
            swal.showLoading()
        }
    }).then(
        function () {},
        // handling the promise rejection
        function (dismiss) {
            if (dismiss === 'timer') {
            console.log('I was closed by the timer')
            }
        }
    )
    return swal
}