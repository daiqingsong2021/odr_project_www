import * as actionType from './action-type'

let defaultState = null

/**
 * 记录流程位置
 * @param {*} state 
 * @param {*} action 
 */
export default function(state = defaultState, action = null) {
    switch (action.type) {
        case actionType.SAVEPROCESSURL:
            return action.data
        default:
            return state;
    }
}