import React from 'react'
import style from './style.less'
import { Icon } from 'antd'

class FeedBackBtn extends React.Component {
    constructor(props) {
      super(props)
    }

    render() {
      return (
        <span  className={`topBtnActivity ${style.main}`} onClick={this.props.onClickHandle.bind(this, 'FeedBackBtn')}>
            <Icon type="file-done" />
            <a className="ant-dropdown-link" href="#">反馈</a>
        </span>
      )
    }
  }

  export default FeedBackBtn
