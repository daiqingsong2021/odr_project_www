import React from 'react'
import style from './style.less'
import { Icon } from 'antd'

class DistributionBtn extends React.Component {
    constructor(props) {
      super(props)
    }

    render() {
      return (
        <span  className={`topBtnActivity ${style.main}`} onClick={this.props.onClickHandle.bind(this, 'DistributionBtn')}>
           <Icon type="usergroup-delete" />
            <a className="ant-dropdown-link" href="#"> 分配</a>
        </span>
      )
    }
  }

  export default DistributionBtn
