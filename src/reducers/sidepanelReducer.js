import { TOGGLE_INSTRUCTION_WRAP } from '../actions/types';

const initialState = {
    expandedInstructions: {
        control: true,
        breaks: false,
        customcourses: false,
        register: false
    }
};


export default function (state = initialState, action) {
    switch (action.type) {
        case TOGGLE_INSTRUCTION_WRAP:
            const instructionId = action.payload
            
            let newExpandedInstructions = {...state.expandedInstructions}
            const newState = !newExpandedInstructions[instructionId]
            if (newState) {
                for (let id in newExpandedInstructions) {
                    newExpandedInstructions[id] = false;
                }
            }
            newExpandedInstructions[instructionId] = newState
            return {
                ...state,
                expandedInstructions: newExpandedInstructions
            };
        default:
            return state;
    }
}
