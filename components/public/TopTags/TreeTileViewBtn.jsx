/*
 * @Author: wihoo.wanghao
 * @Date: 2019-01-17 11:35:08
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2019-01-27 15:28:51
 */

import React from 'react'
import style from './style.less'
import { Menu, Dropdown, Icon, Spin } from 'antd'

class TreeTileViewBtn extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            title: "tile",
            name:"平铺视图"
        }
    }
    onClickHandle=(title)=>{
        this.setState({
            title:title
        },()=>{
            if(title=="tile"){
                this.setState({
                    name:"平铺视图"
                })
            }
            if(title=="tree"){
                this.setState({
                    name:"树状视图"
                })
            }
        })

        this.props.onClickHandle('TreeTileViewBtn',title)
    }
    render() {
        const menu = (
            <Menu>
                {
                    !(this.state.title == "tile") &&
                    <Menu.Item onClick={this.onClickHandle.bind(this, 'tile')}>
                        <a href="#">平铺视图</a>
                    </Menu.Item>
                }
                {
                    !(this.state.title == "tree") &&
                    <Menu.Item onClick={this.onClickHandle.bind(this, 'tree')}>
                        <a href="#">树状视图</a>
                    </Menu.Item >
                }
            </Menu>
        );
        return (
            <span  className={`topBtnActivity ${style.main}`}>
                <Icon type="drag" />
                <Dropdown overlay={menu}>
                    <a className="ant-dropdown-link" href="#"> {this.state.name} <Icon type="down" /></a>
                </Dropdown>
            </span>
        )
    }
}

export default TreeTileViewBtn
