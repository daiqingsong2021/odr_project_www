import React from 'react'
import style from './style.less'
import { Icon } from 'antd'

class BackTopBtn extends React.Component {
    constructor(props) {
      super(props)
    }

    render() {
      return (
        <span  className={`topBtnActivity ${style.main}`}>
           <Icon type="rollback" />
            <a className="ant-dropdown-link" href="#"> 返回</a>
        </span>
      )
    }
  }

  export default BackTopBtn
