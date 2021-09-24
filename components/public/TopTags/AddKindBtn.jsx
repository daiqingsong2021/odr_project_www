/*
 * @Author: wihoo.wanghao
 * @Date: 2019-01-17 11:35:08
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2019-02-23 14:48:19
 */

import React from 'react'
import style from './style.less'
import { Menu, Dropdown, Icon, Spin } from 'antd'

class AddKindBtn extends React.Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }

    render() {
        const menu = (
            <Menu>
                    <Menu.Item onClick={this.props.onClickHandle.bind(this,"AddKindBtn" ,'same')}>
                        <a href="#">新增同级</a>
                    </Menu.Item>
                    <Menu.Item onClick={this.props.onClickHandle.bind(this,"AddKindBtn" , 'next')}>
                        <a href="#">新增下级</a>
                    </Menu.Item>
            </Menu>
        );
        return (
            <span className={`topBtnActivity ${style.main}`}>
                <Icon type="drag" />
                <Dropdown overlay={menu}>
                    <a className="ant-dropdown-link" href="#"> 新增类别 <Icon type="down" /></a>
                </Dropdown>
            </span>
        )
    }
}

export default AddKindBtn
