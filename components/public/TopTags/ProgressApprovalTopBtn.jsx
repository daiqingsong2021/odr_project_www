/*
 * @Author: wihoo.wanghao
 * @Date: 2019-01-17 11:35:25
 * @Last Modified by: wihoo.wanghao
 * @Last Modified time: 2019-03-06 14:27:03
 */

import React from 'react'
import { Icon } from 'antd';
import style from './style.less'
class ProgressApprovalTopBtn extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <span  className={`topBtnActivity ${style.main}`} onClick={this.props.onClickHandle.bind(this, 'ProgressApprovalTopBtn')}>
                <Icon type="highlight" />
                <a className="ant-dropdown-link" href="#"> 进展审批</a>
            </span>
        )
    }
}

export default ProgressApprovalTopBtn
