import React from 'react'
import style from './style.less'
import { Icon } from 'antd'
import MyIcon from './MyIcon'
class CompleteMessage extends React.Component {
    constructor(props) {
      super(props)
    }

    render() {
      return (
        <span className={`topBtnActivity ${style.main}`} onClick={this.props.onClickHandle.bind(this, 'CompleteMessage')}>
           <MyIcon type='icon-bianji2' className='my-icon'/>
            <a className="ant-dropdown-link" href="#"> 完善信息</a>
        </span>
      )
    }
  }

  export default CompleteMessage
