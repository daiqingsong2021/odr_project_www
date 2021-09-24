import React from 'react'
import style from './style.less'
import { Icon } from 'antd'

class ReportedTopBtn extends React.Component {
    constructor(props) {
      super(props)
    }

    render() {
      return (
        <span  className={`topBtnActivity ${style.main}`} onClick={this.props.onClickHandle.bind(this, 'ReportedTopBtn')}>
            <Icon type="to-top" />
            <a className="ant-dropdown-link" href="#"> 上报</a>
        </span>
      )
    }
  }

  export default ReportedTopBtn
