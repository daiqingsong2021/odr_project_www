/*
 * @Author: wihoo.wanghao
 * @Date: 2019-01-17 11:35:08
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2019-01-27 15:28:51
 */

import React from 'react'
import style from './style.less'
import { Menu, Dropdown, Icon, Radio, Checkbox } from 'antd'
import MyIcon from "./MyIcon"
class TreeViewTopBtn extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            title: "tree",
            name:"树形模式"
        }
    }
    onClickHandle=(title)=>{
 
        this.setState({
            title:title
        },()=>{
        
         
            if(this.state.title=="tile"){
                this.setState({
                    name:"列表模式"
                },()=>{
                  this.props.onClickHandle(title)
                })
            }
            if(this.state.title=="tree"){
                this.setState({
                    name:"树形模式"
                },()=>{
                  this.props.onClickHandle(title)
                })
            }
          
        })

      
    }
    render() {
        const menu = (
            <Menu>
                    <Menu.Item >
                        <a href="#" onClick={this.onClickHandle.bind(this, 'tree')}><Radio  checked={this.state.title=="tree"}/> 树形模式</a>
                    </Menu.Item >
                    <Menu.Item >
                        <a href="#"onClick={this.onClickHandle.bind(this, 'tile')}><Radio checked={this.state.title=="tile"}/> 列表模式</a>
                    </Menu.Item>
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

export default TreeViewTopBtn


