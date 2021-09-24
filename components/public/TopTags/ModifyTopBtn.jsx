import React from 'react'
import style from './style.less'
import { Icon } from 'antd'

class ModifyTopBtn extends React.Component {
    constructor(props) {
      super(props)
    }

    render() {
      return (
        <span  className={`topBtnActivity ${style.main}`}
            onClick={this.props.onClickHandle.bind(this, 'ModifyTopBtn')}
        >
            <Icon type="form" />
            <a className="ant-dropdown-link" href="#"> 修改</a>
        </span>
      )
    }
  }

  export default ModifyTopBtn
