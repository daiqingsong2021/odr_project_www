/*
 * @Author: wihoo.wanghao
 * @Date: 2019-01-17 11:35:25
 * @Last Modified by: wihoo.wanghao
 * @Last Modified time: 2019-01-27 15:31:48
 */

import React from 'react'
import { Icon } from 'antd';
import style from './style.less'
class CancelPubTopTags extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <span className={`topBtnActivity ${style.main}`}>
          <Icon type="thunderbolt" />
          <a className="ant-dropdown-link" href="#"> 取消发布</a>
      </span>
    )
  }
}

export default CancelPubTopTags
