import React from 'react'
import style from './style.less'
import { Icon, Menu, Dropdown } from 'antd'

class ToolTopBtn extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        const menu = (
            <Menu onClick={this.props.onClickHandle.bind(this, 'ToolTopBtn')}>
                <Menu.Item key="1">
                    <Icon type="ellipsis" />进度计算
                </Menu.Item>
                <Menu.Item key="2">
                    <Icon type="setting" />横道设置
                </Menu.Item>
                <Menu.Item key="3">
                    <Icon type="select" />导入计划模板
                </Menu.Item>
                <Menu.Item key="4">
                    <Icon type="export" />导出Excel计划
                </Menu.Item>
                <Menu.Item key="5">
                    <Icon type="export" />导出Project计划
                </Menu.Item>
                <Menu.Item key="6">
                    <Icon type="save" />保存为计划模板
                </Menu.Item>
            </Menu>
        );
        return (
            <span  className={`topBtnActivity ${style.main}`}>
                <Icon type="tool" />
                <Dropdown overlay={menu}>
                    <a className="ant-dropdown-link" href="#"> 工具 <Icon type="down" /></a>
                </Dropdown>
            </span>
        )
    }
}

export default ToolTopBtn
