import React from 'react'
import style from './style.less'
import { Icon, Menu, Dropdown } from 'antd'

class PublicTopBtn extends React.Component {
    constructor(props) {
      super(props)
    }


    render() {
        const menu = (
            <Menu>
                <Menu.Item key="直接发布" onClick={this.props.onClickHandle.bind(this, 'direct')}>
                  <Icon type="export" />直接发布
                </Menu.Item>
                <Menu.Item key="发布审批" onClick={this.props.onClickHandle.bind(this, 'approve')}>
                  <Icon type="select" />发布审批
                </Menu.Item>
                <Menu.Item key="取消发布" onClick={this.props.onClickHandle.bind(this, 'abolish')}>
                  <Icon type="select" />取消发布
                </Menu.Item>
            </Menu>
        );
        return (
            <span  className={`topBtnActivity ${style.main}`}>
                <Icon type="copy" />
                <Dropdown overlay={menu} onClick={this.props.onClickHandle.bind(this, 'PublicTopBtn')}>
                    <a className="ant-dropdown-link" href="#"> 发布 <Icon type="down" /></a>
                </Dropdown>
            </span>
        )
    }
  }

  export default PublicTopBtn
