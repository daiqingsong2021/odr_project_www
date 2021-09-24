import React from 'react'
import style from './style.less'
import { Icon } from 'antd'

class ReleaseTopBtn extends React.Component {
    constructor(props) {
      super(props)
    }

    render() {
      return (
        <span  className={`topBtnActivity ${style.main}`} onClick={this.props.onClickHandle.bind(this, 'ReleaseTopBtn')}>
            <Icon type="download" />
            <a className="ant-dropdown-link" href="javascript:void(0)"> 确认</a>
        </span>
      )
    }
  }

  export default ReleaseTopBtn
