import React from 'react'
import style from './style.less'
import { Icon } from 'antd'

class ProScheduleTopBtn extends React.Component {
    constructor(props) {
      super(props)
    }

    render() {
      return (
        <span  className={`topBtnActivity ${style.main}`}>
           <Icon type="bar-chart" />
            <a className="ant-dropdown-link" href="#"> 流程进度</a>
        </span>
      )
    }
  }

  export default ProScheduleTopBtn
