import React from 'react'
import style from './style.less'
import { Icon } from 'antd'

class ExportTopBtn extends React.Component {
    constructor(props) {
      super(props)
    }

    render() {
      return (
        <span  className={`topBtnActivity ${style.main}`}>
            <Icon type="down-square" />
            <a className="ant-dropdown-link" href="#"> 导出</a>
        </span>
      )
    }
  }

  export default ExportTopBtn
