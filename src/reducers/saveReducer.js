import { SAVE_SCHEDULE, LOAD_SCHEDULE, REMOVE_SAVE, RESTORE_SAVES_FROM_LOCAL_STORAGE} from '../actions/types';
import swal from 'sweetalert2'

const initialState = {
    saves: [],
    nextId: 1
};

function getNextId(saves) {
    let nextId = 1;
    while(saves.find(save => save.id === nextId)) {
        nextId++
    }
    return nextId
}

export default function (state = initialState, action) {
    let errorMsg, newSaves, saveString;
    switch (action.type) {
        case SAVE_SCHEDULE:
            let save = action.payload
            if (save.courses.length === 0) {
                errorMsg = "No courses to save..."
                swal({
                    title: errorMsg,
                    type: 'error',
                    timer: 1500,
                    showConfirmButton: false
                })
                return state;
            }
            state.saves.push(save)
            saveString = JSON.stringify(state.saves)
            
            window.localStorage.setItem('saves', saveString)
            newSaves = JSON.parse(saveString)

            return {
                saves: newSaves,
                nextId: getNextId(newSaves)
            }
        case LOAD_SCHEDULE:
            newSaves = [...state.saves]
            newSaves.forEach(save => save.selected = false)
            //TODO:: Might have to search by id then set to true
            action.payload.selected = true;
            return {
                ...state,
                saves: newSaves,
            };
        case REMOVE_SAVE:
            newSaves = state.saves.filter(save => save.id !== action.payload.id)
            
            saveString = JSON.stringify(newSaves)
            window.localStorage.setItem('saves', saveString)
            
            return {
                ...state,
                saves: newSaves
            }
        case RESTORE_SAVES_FROM_LOCAL_STORAGE:
            newSaves = JSON.parse(window.localStorage.getItem('saves'))
            if (!newSaves) return state
            return {
                ...state,
                saves: newSaves,
                nextId: getNextId(newSaves)
            }
        default:
            return state;
    }

}
