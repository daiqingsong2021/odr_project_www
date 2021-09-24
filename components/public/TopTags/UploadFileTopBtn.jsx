import React from 'react'
import style from './style.less'
import { Icon } from 'antd'

class UploadFileTopBtn extends React.Component {
    constructor(props) {
      super(props)
    }

    render() {
      return (
        <span  className={`topBtnActivity ${style.main}`} onClick={this.props.onClickHandle.bind(this, 'UploadFileTopBtn')} >
           <Icon type="file" />
            <a className="ant-dropdown-link" href="#"> 上传文件</a>
        </span>
      )
    }
  }

  export default UploadFileTopBtn
