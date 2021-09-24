/*
 * @Author: wihoo.wanghao
 * @Date: 2019-01-17 11:35:16
 * @Last Modified by: wihoo.wanghao
 * @Last Modified time: 2019-01-27 15:31:19
 */

import React from 'react'
import { Icon } from 'antd';
import style from './style.less'
class AddDimensionTopBtn extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <span className={`topBtnActivity ${style.main}`} onClick={this.props.onClickHandle.bind(this, 'AddDimensionTopBtn')}>
          <Icon type="windows" />
          <a className="ant-dropdown-link" href="#"> 新增维度</a>
      </span>
    )
  }
}

export default AddDimensionTopBtn
