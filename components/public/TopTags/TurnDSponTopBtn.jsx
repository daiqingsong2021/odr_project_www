import React from 'react'
import style from './style.less'
import { Icon } from 'antd'
import MyIcon from "./MyIcon"
class TurnDSponTopBtn extends React.Component {
    constructor(props) {
      super(props)
    }

    render() {
      return (
        <span  className={`topBtnActivity ${style.main}`} onClick={this.props.onClickHandle.bind(this, 'TurnDSponTopBtn')}>
            <MyIcon type="icon-tuihui" style={{fontSize:18,verticalAlign:"middle"}} />
            <a className="ant-dropdown-link" href="#"> 驳回到发起人</a>
        </span>
      )
    }
  }

  export default TurnDSponTopBtn
