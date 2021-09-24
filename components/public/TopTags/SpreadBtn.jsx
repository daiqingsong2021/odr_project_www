/*
 * @Author: wihoo.wanghao
 * @Date: 2019-01-17 11:35:08
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2019-02-28 13:43:18
 */

import React from 'react'
import style from './style.less'
import { Menu, Dropdown, Icon, Spin } from 'antd'

class SpreadBtn extends React.Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }

    render() {
        const menu = (
            <Menu>
                <Menu.Item onClick={this.props.onClickHandle.bind(this, "SpreadBtn")}>
                    <Icon type="down" />全部展开
                    </Menu.Item>
                <Menu.Item onClick={this.props.onClickHandle.bind(this, "SpreadBtn")}>
                    <Icon type="up" />全部收缩
                    </Menu.Item>
                <Menu.Item onClick={this.props.onClickHandle.bind(this, "SpreadBtn")}>
                    <Icon type="down" />展开至第1层
                    </Menu.Item>
                <Menu.Item onClick={this.props.onClickHandle.bind(this, "SpreadBtn")}>
                    <Icon type="down" />展开至第2层
                    </Menu.Item>
                <Menu.Item onClick={this.props.onClickHandle.bind(this, "SpreadBtn")}>
                    <Icon type="down" />展开至第3层
                    </Menu.Item>
                <Menu.Item onClick={this.props.onClickHandle.bind(this, "SpreadBtn")}>
                    <Icon type="down" />展开至第4层
                    </Menu.Item>
                <Menu.Item onClick={this.props.onClickHandle.bind(this, "SpreadBtn")}>
                    <Icon type="down" />展开至第5层
                    </Menu.Item>
                <Menu.Item onClick={this.props.onClickHandle.bind(this, "SpreadBtn")}>
                    <Icon type="down" />展开至第6层
                    </Menu.Item>
                <Menu.Item onClick={this.props.onClickHandle.bind(this, "SpreadBtn")}>
                    <Icon type="down" />展开至第7层
                    </Menu.Item>
            </Menu>
        );
        return (
            <span  className={`topBtnActivity ${style.main}`}>
                <Icon type="drag" />
                <Dropdown overlay={menu}>
                    <a className="ant-dropdown-link" href="#"> 展开 <Icon type="down" /></a>
                </Dropdown>
            </span>
        )
    }
}

export default SpreadBtn
