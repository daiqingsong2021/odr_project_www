import React from 'react'
import style from './style.less'
import { Icon } from 'antd'

class CancelChangesTopBtn extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { show } = this.props
    return (
      <span>
        {show && <span className={`topBtnActivity ${style.main}`} onClick={this.props.onClickHandle.bind(this, 'CancelChangesTopBtn')}>
          <Icon type="rollback" />
          <a className="ant-dropdown-link" href="#"> 取消变更</a>
        </span>}
      </span>

    )
  }
}

export default CancelChangesTopBtn
