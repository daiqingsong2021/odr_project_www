/*
 * @Author: wihoo.wanghao
 * @Date: 2019-01-17 11:35:25
 * @Last Modified by: wihoo.wanghao
 * @Last Modified time: 2019-01-27 15:35:57
 */

import React from 'react'
import { Icon } from 'antd';
import style from './style.less'
class SetDateBtn extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <span  className={`topBtnActivity ${style.main}`} onClick={this.props.onClickHandle.bind(this, 'SetDateBtn')}>
        <Icon type="dashboard" />
          <a className="ant-dropdown-link" href="#"> 设置日期</a>
      </span>
    )
  }
}

export default SetDateBtn
