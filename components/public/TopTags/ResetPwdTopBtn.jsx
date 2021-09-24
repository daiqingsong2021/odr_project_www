import React from 'react'
import style from './style.less'
import { Icon } from 'antd'

class ResetPwdTopBtn extends React.Component {
    constructor(props) {
      super(props)
    }

    render() {
      return (
        <span  className={`topBtnActivity ${style.main}`} onClick={this.props.onClickHandle.bind(this, 'ResetPwdTopBtn')}>
            <Icon type="lock" />
            <a className="ant-dropdown-link" href="#"> 重置密码</a>
        </span>
      )
    }
  }

  export default ResetPwdTopBtn
