import React from 'react'
import style from './style.less'
import { Icon } from 'antd'
import MyIcon from './MyIcon'
class UploadTopBtn extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <span className={`topBtnActivity ${style.main}`} onClick={this.props.onClickHandle.bind(this, 'UploadTopBtn')}>
        <MyIcon type='icon-shangchuanwenjian' className='my-icon'/>
        <a className="ant-dropdown-link" href="#"> 上传</a>
      </span>
    )
  }
}

export default UploadTopBtn
