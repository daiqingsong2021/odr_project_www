import React from 'react'
import style from './style.less'
import { Icon } from 'antd'

class TileViewTopBtn extends React.Component {
    constructor(props) {
      super(props)
    }

    render() {
      return (
        <span  className={`topBtnActivity ${style.main}`}>
            <Icon type="qrcode" />
            <a className="ant-dropdown-link" href="#"> 平铺视图</a>
        </span>
      )
    }
  }

  export default TileViewTopBtn
