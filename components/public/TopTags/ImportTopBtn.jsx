import React from 'react'
import style from './style.less'
import { Menu, Dropdown, Icon, Spin } from 'antd'

class ImportTopBtn extends React.Component {
  constructor(props) {
    super(props)
  }
  onClickHandle = (value) => {

    this.props.onClickHandle('ImportTopBtn', value)
  }
  render() {
    const menu = (
      <Menu>
        <Menu.Item onClick={this.onClickHandle.bind(this, '从组织导入')}>
          <a href="#">从组织导入</a>
        </Menu.Item>
        {/* <Menu.Item onClick={this.onClickHandle.bind(this, '从组织导入')}>
          <a href="#">从IPT导入</a>
        </Menu.Item>
        <Menu.Item onClick={this.onClickHandle.bind(this, '从组织导入')}>
          <a href="#">从其他项目导入</a>
        </Menu.Item> */}
      </Menu>
    );
    return (

      <span  className={`topBtnActivity ${style.main}`}>
        <Icon type="to-top" />
        <Dropdown overlay={menu}>
          <a className="ant-dropdown-link" href="#"> 导入<Icon type="down" /></a>
        </Dropdown>
      </span>
    )
  }
}

export default ImportTopBtn
