import React from 'react'
import style from './style.less'
import { Icon } from 'antd'

class AddUserTopBtn extends React.Component {
    constructor(props) {
      super(props)
    }

    render() {
      return (
        <span  className={`topBtnActivity ${style.main}`} onClick={this.props.onClickHandle.bind(this,"AddUserTopBtn")}>
            <Icon type="user-add" />
            <a className="ant-dropdown-link" href="#"> 新增用户</a>
        </span>
      )
    }
  }

  export default AddUserTopBtn
