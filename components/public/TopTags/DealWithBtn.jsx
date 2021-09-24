import React from 'react'
import style from './style.less'
import { Icon } from 'antd'

class DealWithBtn extends React.Component {
    constructor(props) {
      super(props)
    }

    render() {
      return (
        <span  className={`topBtnActivity ${style.main}`} onClick={this.props.onClickHandle.bind(this, 'DealWithBtn')}>
            <Icon type="form" />
            <a className="ant-dropdown-link" href="#"> 处理</a>
        </span>
      )
    }
  }

  export default DealWithBtn