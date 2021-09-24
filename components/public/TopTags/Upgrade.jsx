import React from 'react'
import style from './style.less'
import { Icon } from 'antd'
import MyIcon from './MyIcon'
class Upgrade extends React.Component {
    constructor(props) {
      super(props)
    }

    render() {
      return (
        <span  className={`topBtnActivity ${style.main}`} onClick={this.props.onClickHandle.bind(this, 'Upgrade')}>
           <MyIcon type='icon-shengjibanben' className='my-icon'/>
            <a className="ant-dropdown-link" href="#"> 升版</a>
        </span>
      )
    }
  }

  export default Upgrade
