/*
 * @Author: wihoo.wanghao
 * @Date: 2019-01-17 11:35:25
 * @Last Modified by: wihoo.wanghao
 * @Last Modified time: 2019-03-05 16:39:24
 */

import React from 'react'
import { Icon } from 'antd';
import style from './style.less'
class ChangeReviewTopBtn extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <span className={`topBtnActivity ${style.main}`} onClick={this.props.onClickHandle.bind(this, 'ChangeReviewTopBtn')}>
                <Icon type="highlight" />
                <a className="ant-dropdown-link" href="#"> 变更送审</a>
            </span>
        )
    }
}

export default ChangeReviewTopBtn
