import React from 'react'
import { Icon } from 'antd';
import style from './style.less'
class AddTopBtn extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <span className={`topBtnActivity ${style.main}`} onClick={this.props.onClickHandle.bind(this, 'AddTopBtn')}>
                <Icon type="plus-circle" />
                <a className="ant-dropdown-link" href="#"> 新增</a>
            </span>
        )
    }
}
