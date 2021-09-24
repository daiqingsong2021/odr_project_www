import React from 'react'
import style from './style.less'
import { Icon, Menu, Popover } from 'antd'

class SelectBussPlanTopBtn extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <span  className={`topBtnActivity ${style.main}`}>
                <Popover content={this.props.popoverContent} placement="bottom">
                    <Icon type="appstore" />
                    <a className="ant-dropdown-link" href="#"> 选择经营计划 <Icon type="down" /></a>
                </Popover>
            </span>
        )
    }
}

export default SelectBussPlanTopBtn
