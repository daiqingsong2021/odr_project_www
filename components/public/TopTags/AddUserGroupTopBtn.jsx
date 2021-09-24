import React from 'react'
import style from './style.less'
import { Icon } from 'antd'

class AddUserGroupTopBtn extends React.Component {
    constructor(props) {
      super(props)
    }

    render() {
      return (
        <span className={`topBtnActivity ${style.main}`} onClick={this.props.onClickHandle.bind(this,"AddUserGroupTopBtn")}>
            <Icon type="usergroup-add" />
            <a className="ant-dropdown-link" href="#"> 批量新增用户</a>
        </span>
      )
    }
  }

  export default AddUserGroupTopBtn
