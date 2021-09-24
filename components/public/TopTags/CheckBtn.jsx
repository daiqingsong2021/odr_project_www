/*
 * @Author: wihoo.wanghao
 * @Date: 2019-01-17 11:35:16
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2019-02-28 15:02:48
 */

import React from 'react'
import { Icon } from 'antd';
import style from './style.less'
class CheckBtn extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <span  className={`topBtnActivity ${style.main}`} onClick={this.props.onClickHandle.bind(this, 'CheckBtn')}>
          <Icon type="experiment" />
          <a className="ant-dropdown-link" href="#"> 校验</a>
      </span>
    )
  }
}

export default CheckBtn
