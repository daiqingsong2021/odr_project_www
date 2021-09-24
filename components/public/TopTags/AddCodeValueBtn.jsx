/*
 * @Author: wihoo.wanghao
 * @Date: 2019-01-17 11:35:16
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2019-02-28 11:45:45
 */

import React from 'react'
import { Icon } from 'antd';
import style from './style.less'
class AddCodeValueBtn extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <span className={`topBtnActivity ${style.main}`} onClick={this.props.onClickHandle.bind(this, 'AddCodeValueBtn')}>
          <Icon type="plus-circle" />
          <a className="ant-dropdown-link" href="#"> 新增码值</a>
      </span>
    )
  }
}

export default AddCodeValueBtn
