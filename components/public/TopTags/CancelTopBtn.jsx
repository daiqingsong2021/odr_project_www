import React from 'react'
import style from './style.less'
import { Icon } from 'antd'

class CancelTopBtn extends React.Component {
    constructor(props) {
      super(props)
    }

    render() {
      return (
        <span className={`topBtnActivity ${style.main}`}>
            <Icon type="fall" />
            <a className="ant-dropdown-link" href="#"> 取消</a>
        </span>
      )
    }
  }

  export default CancelTopBtn
