import React from 'react'
import style from './style.less'
import { Icon } from 'antd'

class SubmitTopBtn extends React.Component {
    constructor(props) {
      super(props)
    }

    render() {
      return (
        <span  className={`topBtnActivity ${style.main}`} onClick={this.props.onClickHandle.bind(this, "SubmitTopBtn")}>
            <Icon type="file-done" />
            <a className="ant-dropdown-link" href="#"> 提交</a>
        </span>
      )
    }
  }

  export default SubmitTopBtn
