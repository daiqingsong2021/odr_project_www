import React from 'react'
import style from './style.less'
import { Icon } from 'antd'

class ApprovalTopBtn extends React.Component {
    constructor(props) {
      super(props)
    }

    render() {
      return (
        <span  className={`topBtnActivity ${style.main}`}  onClick={this.props.onClickHandle.bind(this, 'ApprovalTopBtn')}>
            <Icon type="solution" />
            <a className="ant-dropdown-link" href="#"> 进展审批</a>
        </span>
      )
    }
  }

  export default ApprovalTopBtn
