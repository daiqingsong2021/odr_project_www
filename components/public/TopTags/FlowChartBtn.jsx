/*
 * @Author: wihoo.wanghao
 * @Date: 2019-01-17 11:35:16
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2019-02-22 13:49:06
 */

import React from 'react'
import { Icon } from 'antd';
import style from './style.less'
import MyIcon from "./MyIcon"
class FlowChartBtn extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <span  className={`topBtnActivity ${style.main}`} onClick={this.props.onClickHandle.bind(this, 'FlowChartBtn')}>
         <MyIcon type="icon-design-preparat" style={{fontSize:18,verticalAlign:"middle"}} />
          <a href="#"> 流程图</a>
      </span>
    )
  }
}

export default FlowChartBtn
