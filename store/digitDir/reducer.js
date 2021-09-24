const QUERY_LIST = 'QUERY_LIST';
const QUERY_DATA_LIST = 'QUERY_DATA_LIST';

import axios from '../../api/axios';

const defaultState = {
  data: [],
  dataList: []
};

/**
 * CURD数据state更新
 * @param {*} state
 * @param {*} action
 */
const digitDir = (state = defaultState, action = {}) => {
  switch (action.type) {
    case QUERY_LIST:
      return {
        ...state, ...action.payload,
      };
    case QUERY_DATA_LIST:
      return {
        ...state, ...action.payload,
      };
    default:
      return state;
  }
};

export function queryList(value) {
  return dispatch => {
    axios.get('api/base/digitDirBo/1/listxx').then(res => {
      dispatch(save({ data: res.data.data }));
      dispatch(queryDataList(res.data.data[0].boCode));
      // return Promise.resolve()
    });
  };
}

// export function queryList() {
//   return { type: QUERY_LIST };
// }

export function queryDataList(value) {
  // return { type: QUERY_DATA_LIST };
  return dispatch => {
    axios.get(`api/base/dictType/${value}/list`).then(res => {
      dispatch(save({ dataList: res.data.data }));
    });
  };
}

function save(data) {
  return { type: QUERY_LIST, payload: data };
}

export default digitDir;
