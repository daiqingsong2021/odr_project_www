import React from 'react'
import style from './style.less'
import { Icon } from 'antd'

class RevokeTopBtn extends React.Component {
    constructor(props) {
      super(props)
    }

    render() {
      return (
        <span  className={`topBtnActivity ${style.main}`}>
            <Icon type="rollback" />
            <a className="ant-dropdown-link" href="#"> 撤销</a>
        </span>
      )
    }
  }

  export default RevokeTopBtn
