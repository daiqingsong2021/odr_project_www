/*
 * @Author: wihoo.wanghao
 * @Date: 2019-01-17 11:35:08
 * @Last Modified by: wihoo.wanghao
 * @Last Modified time: 2019-01-27 15:35:04
 */

import React from 'react'
import style from './style.less'
import { Menu, Dropdown, Icon, Spin } from 'antd'

class PerEquBtn extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            title: "人力资源视图"
        }
    }
    onClickHandle=(title)=>{
        this.setState({
            title:title
        })

        this.props.onClickHandle('PerEquBtn',title)
    }
    render() {
        const menu = (
            <Menu>
                {
                    !(this.state.title == "人力资源视图") &&
                    <Menu.Item onClick={this.onClickHandle.bind(this, '人力资源视图')}>
                        <a href="#">人力资源视图</a>
                    </Menu.Item>
                }
                {
                    !(this.state.title == "设备资源视图") &&
                    <Menu.Item onClick={this.onClickHandle.bind(this, '设备资源视图')}>
                        <a href="#">设备资源视图</a>
                    </Menu.Item >
                }


            </Menu>
        );
        return (
            <span  className={`topBtnActivity ${style.main}`}>
                <Icon type="drag" />
                <Dropdown overlay={menu}>
                    <a className="ant-dropdown-link" href="#"> {this.state.title} <Icon type="down" /></a>
                </Dropdown>
            </span>
        )
    }
}

export default PerEquBtn
