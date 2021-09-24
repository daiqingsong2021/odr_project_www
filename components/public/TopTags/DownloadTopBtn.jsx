import React from 'react'
import style from './style.less'
import { Icon } from 'antd'
import MyIcon from './MyIcon'
class DownloadTopBtn extends React.Component {
    constructor(props) {
      super(props)
    }

    render() {
      return (
        <span className={`topBtnActivity ${style.main}`}  onClick={this.props.onClickHandle.bind(this, 'DownloadTopBtn')}>
            <MyIcon type='icon-xiazaiwenjian' className='my-icon'/>
            <a className="ant-dropdown-link" href="#"> 下载</a>
        </span>
      )
    }
  }

  export default DownloadTopBtn
