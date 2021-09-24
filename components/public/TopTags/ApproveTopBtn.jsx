import React from 'react'
import style from './style.less'
import { Icon } from 'antd'

class ApproveTopBtn extends React.Component {
    constructor(props) {
      super(props)
    }

    render() {
      return (
        <span  className={`topBtnActivity ${style.main}`} onClick={this.props.onClickHandle.bind(this, 'ApproveTopBtn')}>
            <Icon type="file-done" />
            <a className="ant-dropdown-link" href="#"> 进展批准</a>
        </span>
      )
    }
  }

  export default ApproveTopBtn
