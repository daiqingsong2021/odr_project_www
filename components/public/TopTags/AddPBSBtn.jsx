/*
 * @Author: wihoo.wanghao
 * @Date: 2019-01-17 11:35:08
 * @Last Modified by: wihoo.wanghao
 * @Last Modified time: 2019-01-27 15:34:51
 */

import React from 'react'
import style from './style.less'
import { Menu, Dropdown, Icon, Spin } from 'antd'

class AddPBSBtn extends React.Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }

    render() {
        const menu = (
            <Menu>
                    <Menu.Item onClick={this.props.onClickHandle.bind(this,"AddPBSBtn" ,'新增同级PBS',false)}>
                        <a href="#">新增同级PBS</a>
                    </Menu.Item>
                    <Menu.Item onClick={this.props.onClickHandle.bind(this,"AddPBSBtn" , '新增下级PBS',true)}>
                        <a href="#">新增下级PBS</a>
                    </Menu.Item>
            </Menu>
        );
        return (
            <span className={`topBtnActivity ${style.main}`}>
                <Icon type="drag" />
                <Dropdown overlay={menu}>
                    <a className="ant-dropdown-link" href="#"> 新增PBS <Icon type="down" /></a>
                </Dropdown>
            </span>
        )
    }
}

export default AddPBSBtn
