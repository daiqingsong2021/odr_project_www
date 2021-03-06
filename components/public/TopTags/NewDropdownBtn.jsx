/*
 * @Author: wihoo.wanghao
 * @Date: 2019-01-17 11:35:08
 * @Last Modified by: wihoo.wanghao
 * @Last Modified time: 2019-01-27 15:34:51
 */

import React from 'react'
import style from './style.less'
import { Menu, Dropdown, Icon, Spin } from 'antd'

class NewDropdownBtn extends React.Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }

    render() {
        const menu = (
            <Menu>
                    <Menu.Item onClick={this.props.onClickHandle.bind(this,"NewDropdownBtn",'same')}>
                        <a href="#">新增同级</a>
                    </Menu.Item>
                    <Menu.Item onClick={this.props.onClickHandle.bind(this,"NewDropdownBtn", 'down')}>
                        <a href="#">新增下级</a>
                    </Menu.Item>
            </Menu>
        );
        return (
            <span  className={`topBtnActivity ${style.main}`}>
                <Icon type="drag" />
                <Dropdown overlay={menu}>
                    <a className="ant-dropdown-link" href="#"> 新增 <Icon type="down" /></a>
                </Dropdown>
            </span>
        )
    }
}

export default NewDropdownBtn
