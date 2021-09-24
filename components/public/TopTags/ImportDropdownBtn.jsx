/*
 * @Author: wihoo.wanghao
 * @Date: 2019-01-17 11:35:08
 * @Last Modified by: wihoo.wanghao
 * @Last Modified time: 2019-01-27 15:34:51
 */

import React from 'react'
import style from './style.less'
import { Menu, Dropdown, Icon, Spin } from 'antd'

class ImportDropdownBtn extends React.Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }

    render() {
        const menu = (
            <Menu>
                    <Menu.Item onClick={this.props.onClickHandle.bind(this,"ImportDropdownBtn" ,'组织机构导入')}>
                        <a href="#">组织机构导入</a>
                    </Menu.Item>
                    <Menu.Item onClick={this.props.onClickHandle.bind(this,"ImportDropdownBtn" , 'IPT导入')}>
                        <a href="#">IPT导入</a>
                    </Menu.Item>
                    <Menu.Item onClick={this.props.onClickHandle.bind(this,"ImportDropdownBtn" , '其他项目导入')}>
                        <a href="#">其他项目导入</a>
                    </Menu.Item>
            </Menu>
        );
        return (
            <span  className={`topBtnActivity ${style.main}`}>
                <span className='iconfont'>&#xe66e;</span>
                <Dropdown overlay={menu}>
                    <a className="ant-dropdown-link" href="#"> 导入 <Icon type="down" /></a>
                </Dropdown>
            </span>
        )
    }
}

export default ImportDropdownBtn
