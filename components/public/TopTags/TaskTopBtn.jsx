import React from 'react'
import style from './style.less'
import { Icon } from 'antd'

class TaskTopBtn extends React.Component {
    constructor(props) {
      super(props)
    }

    render() {
      return (
        <span  className={`topBtnActivity ${style.main}`} onClick={this.props.onClickHandle.bind(this, 'TaskTopBtn')}>
            <Icon type="minus" />
            <a className="ant-dropdown-link" href="#"> 任务</a>
        </span>
      )
    }
  }

  export default TaskTopBtn
