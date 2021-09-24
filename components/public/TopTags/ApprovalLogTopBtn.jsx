import React from 'react'
import style from './style.less'
import { Icon } from 'antd'

class ApprovalLogTopBtn extends React.Component {
    constructor(props) {
      super(props)
    }

    render() {
      return (
        <span  className={`topBtnActivity ${style.main}`}  onClick={this.props.onClickHandle.bind(this, 'ApprovalLogTopBtn')}>
            <Icon type="file-search" />
            <a className="ant-dropdown-link" href="#"> 审批日志</a>
        </span>
      )
    }
  }

  export default ApprovalLogTopBtn
