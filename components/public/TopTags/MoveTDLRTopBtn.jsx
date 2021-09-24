/*
 * @Author: wihoo.wanghao
 * @Date: 2019-01-17 11:35:08
 * @Last Modified by: wihoo.wanghao
 * @Last Modified time: 2019-01-27 15:34:16
 */

import React from 'react'
import style from './style.less'
import { Menu, Dropdown, Icon, Spin } from 'antd'

class MoveTDLRTopBtn extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        const menu = (
            <Menu>
                <Menu.Item>
                    <div className={style.main}>
                        <div className={style.moveTDLR}>
                            <a href="#"><Icon type="arrow-up" /></a>
                        </div>
                        <div className={style.moveTDLR}>
                            <a href="#"><Icon type="arrow-left" /></a> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <a href="#"><Icon type="arrow-right" /></a>
                        </div>
                        <div className={style.moveTDLR}>
                            <a href="#"><Icon type="arrow-down" /></a>
                        </div>
                    </div>
                </Menu.Item>
            </Menu>
        );
        return (
            <span  className={`topBtnActivity ${style.main}`}>
                <Icon type="drag" />
                <Dropdown overlay={menu}>
                    <a className="ant-dropdown-link" href="#"> 移动  <Icon type="caret-down" /></a>
                </Dropdown>
            </span>
        )
    }
}

export default MoveTDLRTopBtn
