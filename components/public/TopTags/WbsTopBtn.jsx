import React from 'react'
import style from './style.less'
import { Icon } from 'antd'

class WbsTopBtn extends React.Component {
    constructor(props) {
      super(props)
    }

    render() {
      return (
        <span  className={`topBtnActivity ${style.main}`} onClick={this.props.onClickHandle.bind(this, 'WbsTopBtn')}>
            <Icon type="qrcode" />
            <a className="ant-dropdown-link" href="#"> WBS</a>
        </span>
      )
    }
  }

  export default WbsTopBtn
