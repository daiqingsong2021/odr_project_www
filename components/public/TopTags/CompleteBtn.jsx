/*
 * @Author: wihoo.wanghao
 * @Date: 2019-01-17 11:35:08
 * @Last Modified by: wihoo.wanghao
 * @Last Modified time: 2019-01-27 15:34:51
 */

import React from 'react'
import style from './style.less'
import { Menu, Dropdown, Icon, Spin } from 'antd'

class CompleteBtn extends React.Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }

    render() {

        return (
            <span className={`topBtnActivity ${style.main}`}>
                <Icon type="drag" />

                    <a className="ant-dropdown-link" href="#"> 完成 <Icon type="down" /></a>

            </span>
        )
    }
}

export default CompleteBtn
