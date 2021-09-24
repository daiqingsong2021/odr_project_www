/*
 * @Author: wihoo.wanghao
 * @Date: 2019-01-17 11:35:16
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2019-02-28 11:01:21
 */

import React from 'react'
import { Icon } from 'antd';
import style from './style.less'
class AddSameBtn extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <span className={`topBtnActivity ${style.main}`} onClick={this.props.onClickHandle.bind(this, 'AddSameBtn')}>
          <Icon type="plus-circle" />
          <a className="ant-dropdown-link" href="#"> 新增同级</a>
      </span>
    )
  }
}

export default AddSameBtn
