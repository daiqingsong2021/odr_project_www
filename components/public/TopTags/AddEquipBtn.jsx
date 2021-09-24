/*
 * @Author: wihoo.wanghao
 * @Date: 2019-01-17 11:35:16
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2019-02-23 14:51:08
 */

import React from 'react'
import { Icon } from 'antd';
import style from './style.less'
class AddEquipBtn extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <span className={`topBtnActivity ${style.main}`} onClick={this.props.onClickHandle.bind(this, 'AddEquipBtn')}>
          <Icon type="plus-circle" />
          <a className="ant-dropdown-link" href="#"> 新增设备</a>
      </span>
    )
  }
}

export default AddEquipBtn
