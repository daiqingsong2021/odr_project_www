import React from 'react'
import style from './style.less'
import { Icon } from 'antd'

class ImportFileTopBtn extends React.Component {
    constructor(props) {
      super(props)
    }

    render() {
      return (
        <span  className={`topBtnActivity ${style.main}`}>
            <Icon type="file-add" />
            <a className="ant-dropdown-link" href="#"> 导入文件</a>
        </span>
      )
    }
  }

  export default ImportFileTopBtn
