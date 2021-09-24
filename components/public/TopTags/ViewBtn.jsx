import React from 'react'
import { Icon } from 'antd';
import style from './style.less'
class AddTopBtn extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <span  className={`topBtnActivity ${style.main}`} onClick={this.props.onClickHandle.bind(this, 'ViewBtn')}>
          <Icon type="qrcode" />
          <a className="ant-dropdown-link" href="#"> 视图</a>
      </span>
    )
  }
}

export default AddTopBtn
