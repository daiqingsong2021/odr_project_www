/*
 * @Author: wihoo.wanghao
 * @Date: 2019-01-17 11:35:25
 * @Last Modified by: wihoo.wanghao
 * @Last Modified time: 2019-01-27 15:34:55
 */

import React from 'react'
import { Icon } from 'antd';
import style from './style.less'
class OpenProjectBtn extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <span  className={`topBtnActivity ${style.main}`} onClick={this.props.onClickHandle.bind(this, 'OpenProjectBtn')}>
          <Icon type="delete" />
          <a className="ant-dropdown-link" href="#"> 打开项目</a>
      </span>
    )
  }
}

export default OpenProjectBtn
