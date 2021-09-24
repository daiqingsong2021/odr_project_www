import React from 'react'
import style from './style.less'
import { Icon, Checkbox,Menu, Dropdown } from 'antd'

class SelectPlanTopBtn extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        const menu = (
            <Menu>
                <Menu.Item>
                    <Checkbox>产品需求计划</Checkbox>
                </Menu.Item>
                <Menu.Item>
                    <Checkbox>产品需求计划</Checkbox>
                </Menu.Item>
            </Menu>
        );
        return (
            <span  className={`topBtnActivity ${style.main}`}>
                <Icon type="drag" />
                <Dropdown overlay={menu}>
                    <a className="ant-dropdown-link" href="#"> 选择计划 <Icon type="down" /></a>
                </Dropdown>
            </span>
        )
    }
}

export default SelectPlanTopBtn
