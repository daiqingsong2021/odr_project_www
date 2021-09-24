import React from 'react'
import style from './style.less'
import { Icon } from 'antd'

class MaintRuleTypeTopBtn extends React.Component {
    constructor(props) {
      super(props)
    }

    render() {
      return (
        <span  className={`topBtnActivity ${style.main}`}  onClick={this.props.onClickHandle.bind(this, 'MaintRuleTypeTopBtn')}>
           <Icon type="tool" />
            <a className="ant-dropdown-link" href="#"> 维护规则类型</a>
        </span>
      )
    }
  }

  export default MaintRuleTypeTopBtn
