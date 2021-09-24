import React from 'react'
import style from './style.less'
import { Icon, Menu,Dropdown } from 'antd'

class ClosedTopBtn extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const menu = (
      <Menu>
        <Menu.Item onClick={this.props.onClickHandle.bind(this, "ClosedTopBtn", '直接关闭')}>
          <a href="#">直接关闭</a>
        </Menu.Item>
        <Menu.Item onClick={this.props.onClickHandle.bind(this, "ClosedTopBtn", '关闭审批')}>
          <a href="#">关闭审批</a>
        </Menu.Item>
      </Menu>
    );
    return (

      <span className={`topBtnActivity ${style.main}`}>
        <Dropdown overlay={menu}>
          <a className="ant-dropdown-link" href="#"> <span className='iconfont'>&#xe677;</span> 关闭 <Icon type="down" /></a>
        </Dropdown>
      </span>
    )
  }
}

export default ClosedTopBtn
