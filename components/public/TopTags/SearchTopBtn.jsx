import React from 'react'
import style from './style.less'
import { Icon } from 'antd'

class SearchTopBtn extends React.Component {
    constructor(props) {
      super(props)
    }

    render() {
      return (
        <span  className={`topBtnActivity ${style.main}`}>
            <Icon type="search" />
            <a className="ant-dropdown-link" href="#"> 搜索</a>
        </span>
      )
    }
  }

  export default SearchTopBtn
