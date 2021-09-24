import React from 'react'
import style from './style.less'
import { Icon } from 'antd'

class SelectItem extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <span  className={`topBtnActivity ${style.main}`} onClick={this.props.onClickHandle.bind(this, 'SelectItem')} >
                <Icon type="qrcode" />
                <a className="ant-dropdown-link" href="#"> 选择文件</a>
            </span>
        )
    }
}

export default SelectItem
