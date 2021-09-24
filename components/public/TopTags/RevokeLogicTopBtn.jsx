import React from 'react'
import style from './style.less'
import { Icon } from 'antd'

class RevokeLogicTopBtn extends React.Component {
    constructor(props) {
      super(props)
    }

    render() {
      return (
        <span  className={`topBtnActivity ${style.main}`} onClick={this.props.onClickHandle.bind(this, 'RevokeLogicTopBtn')}>
            <Icon type="rollback" />
            <a className="ant-dropdown-link" href="#"> 撤销逻辑变更</a>
        </span>
      )
    }
  }

  export default RevokeLogicTopBtn
