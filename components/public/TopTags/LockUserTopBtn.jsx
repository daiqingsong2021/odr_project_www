import React from 'react'
import style from './style.less'
import { Icon } from 'antd'

class LockUserTopBtn extends React.Component {
    constructor(props) {
      super(props)
    }

    render() {
      return (
        <span  className={`topBtnActivity ${style.main}`} onClick={this.props.onClickHandle.bind(this, 'LockUserTopBtn')}>
            <Icon type="lock" />
            <a className="ant-dropdown-link" href="#"> 锁定用户</a>
        </span>
      )
    }
  }

  export default LockUserTopBtn
