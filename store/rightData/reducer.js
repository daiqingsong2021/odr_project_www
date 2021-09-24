import * as actionType from './action-type'

let defaultState = {
    title: '', 
    rightTag: [],
    data: {},
}

/**
 * state更新
 * @param {*} state 
 * @param {*} action 
 */
export const rightData = (state = defaultState, action = {}) => {
    switch (action.type) {
        case actionType.SAVECURRENTDATA:
            return {
                ...state,
                ...action
            };
        case actionType.RESETRIGHTCURRENTDATA: 
            return defaultState;
        default:
            return state;
    }
}