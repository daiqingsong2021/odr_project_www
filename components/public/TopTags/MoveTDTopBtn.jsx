/*
 * @Author: wihoo.wanghao
 * @Date: 2019-01-17 11:35:08
 * @Last Modified by: wihoo.wanghao
 * @Last Modified time: 2019-01-27 15:34:44
 */

import React from 'react'
import style from './style.less'
import { Menu, Dropdown, Icon, Spin } from 'antd'

class MoveTDTopBtn extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const menu = (
      <Menu>
        <Menu.Item>
          <a href="#"><Icon type="arrow-up" /></a>
        </Menu.Item>
        <Menu.Item>
          <a href="#"><Icon type="arrow-down" /></a>
        </Menu.Item>
      </Menu>
    );
    return (
      <span  className={`topBtnActivity ${style.main}`}>
          <span className='iconfont'>&#xe648;</span>
          <Dropdown overlay={menu}>
              <a className="ant-dropdown-link" href="#"> 移动 <Icon type="down" /></a>
          </Dropdown>
      </span>
    )
  }
}

export default MoveTDTopBtn
