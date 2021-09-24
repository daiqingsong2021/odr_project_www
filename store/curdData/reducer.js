import * as actionType from './action-type'

let defaultState = {
    title: '', 
    status: '',
    data: []
}

/**
 * CURD数据state更新
 * @param {*} state 
 * @param {*} action 
 */
export const curdData = (state = defaultState, action = {}) => {
    switch (action.type) {
        case actionType.CURDCURRENTDATA:
            return {
                ...state,
                ...action
            };
        case actionType.RESETCURRENTDATA:
            return defaultState;
        default:
            return state;
    }
}