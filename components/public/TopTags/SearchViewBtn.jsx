import React from 'react'
import style from './style.less'
import { Icon } from 'antd'

class SearchViewBtn extends React.Component {
    constructor(props) {
      super(props)
    }

    render() {
      return (
        <span  className={`topBtnActivity ${style.main}`} onClick={this.props.onClickHandle.bind(this, 'SearchViewBtn')}>
           <Icon type="file-search" />
            <a className="ant-dropdown-link" href="#"> 查看</a>
        </span>
      )
    }
  }

  export default SearchViewBtn