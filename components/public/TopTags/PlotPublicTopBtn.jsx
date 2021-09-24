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
                直接发布
                </Menu.Item>
                <Menu.Item key="发布审批" onClick={this.props.onClickHandle.bind(this, 'approve')}>
                发布审批
                </Menu.Item>
            </Menu>
        );
        return (
            <span className={style.main}>
                <Dropdown overlay={menu} onClick={this.props.onClickHandle.bind(this, 'PublicTopBtn')}>
                    <a className="ant-dropdown-link" href="#"> <span className='iconfont'>&#xe660;</span> 发布 <Icon type="down" /></a>
                </Dropdown>
            </span>
        )
    }
  }
  
  export default PublicTopBtn