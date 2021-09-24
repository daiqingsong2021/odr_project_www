/*
 * @Author: wihoo.wanghao
 * @Date: 2019-01-17 11:35:16
 * @Last Modified by: wihoo.wanghao
 * @Last Modified time: 2019-01-27 15:31:19
 */

import React from 'react'
import { Icon } from 'antd';
import style from './style.less'
class AddIndexTopBtn extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <span className={`topBtnActivity ${style.main}`} onClick={this.props.onClickHandle.bind(this, 'AddIndexTopBtn')}>
          <Icon type="border-inner" />
          <a className="ant-dropdown-link" href="#"> 新增指标</a>
      </span>
    )
  }
}

export default AddIndexTopBtn
