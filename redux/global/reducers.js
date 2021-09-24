import { actionTypes } from './actions'

export const initialState = {
  collapsed:false
}

function reducer (state = initialState, action) {
  switch (action.type) {
    case actionTypes.CONTROL_COLLAPSED_CLOSE:
      return {
        ...state,
        collapsed:true
      }

    case actionTypes.CONTROL_COLLAPSED_OPEN:
      return {
        ...state,
        collapsed:false
      }
    default:
      return state
  }
}

export default reducer
