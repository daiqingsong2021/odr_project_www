import React from 'react'
import style from './style.less'
import { Icon } from 'antd'

class CopyTopBtn extends React.Component {
    constructor(props) {
      super(props)
    }

    render() {
      return (
        <span  className={`topBtnActivity ${style.main}`} onClick={this.props.onClickHandle.bind(this, 'CopyTopBtn')}>
            <span className="iconfont">&#xe676;</span>
            <a className="ant-dropdown-link" href="#"> 复制</a>
        </span>
      )
    }
  }

  export default CopyTopBtn
