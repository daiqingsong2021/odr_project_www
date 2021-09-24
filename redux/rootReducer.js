import { combineReducers } from 'redux'

import global from './global/reducers'
import clock from './clock/reducers'
import count from './count/reducers'
import placeholder from './placeholder/reducers'

export default combineReducers({
  global,
  clock,
  count,
  placeholder
})
