import React from 'react'
import style from './style.less'
import { Icon } from 'antd'
import MyIcon from "./MyIcon"
class UnlockUserTopBtn extends React.Component {
    constructor(props) {
      super(props)
    }

    render() {
      return (
        <span  className={`topBtnActivity ${style.main}`} onClick={this.props.onClickHandle.bind(this, 'UnlockUserTopBtn')}>
            
            <a className="ant-dropdown-link" href="#"><MyIcon className='my-icon' type="icon-jiesuo"/>解锁用户</a>
        </span>
      )
    }
  }

  export default UnlockUserTopBtn
