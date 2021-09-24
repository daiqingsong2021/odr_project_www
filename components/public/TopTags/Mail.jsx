import React from 'react'
import style from './style.less'
import { Icon } from 'antd'
import MyIcon from './MyIcon'

class Mail extends React.Component {
    constructor(props) {
      super(props)
    }

    render() {
      return (
        <span  className={`topBtnActivity ${style.main}`} onClick={this.props.onClickHandle.bind(this, 'Mail')}>
           <MyIcon type='icon-fasongyoujian' />
            <a className="ant-dropdown-link" href="#"> 邮件</a>
        </span>
      )
    }
  }

  export default Mail
