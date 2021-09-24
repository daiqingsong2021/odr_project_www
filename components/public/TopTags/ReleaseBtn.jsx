/*
 * @Author: wihoo.wanghao
 * @Date: 2019-01-17 11:35:25
 * @Last Modified by: wihoo.wanghao
 * @Last Modified time: 2019-01-27 15:35:18
 */

import React from 'react'
import { Icon } from 'antd';
import style from './style.less'
class ReleaseBtn extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <span className={`topBtnActivity ${style.main}`} onClick={this.props.onClickHandle.bind(this, 'ReleaseBtn')}>
          <Icon type="delete" />
          <a className="ant-dropdown-link" href="#"> 释放</a>
      </span>
    )
  }
}

export default ReleaseBtn
