import React from 'react'
import style from './style.less'
import { Icon, Menu, Popover } from 'antd'

class BussPlanViewTopBtn extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <span  className={`topBtnActivity ${style.main}`}>
                <Icon type="appstore" />
                <a className="ant-dropdown-link" href="#"> 经营计划视图 <Icon type="down" /></a>
            </span>
        )
    }
}

export default BussPlanViewTopBtn
