import React from 'react'
import style from './style.less'
import { Icon, Checkbox, Menu, Dropdown } from 'antd'

class WbssTopBtn extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        const { show } = this.props
        const menu = (
            <Menu onClick={this.props.onClickHandle.bind(this, 'WbssTopBtn')}>
                {show && show[0] && <Menu.Item key="1">
                    <Icon type="plus" />新增同级WBS
                </Menu.Item>}
                {show && show[1] && <Menu.Item key="2">
                    <Icon type="plus" />新增下级WBS
                </Menu.Item>}
            </Menu>
        );
        return (
            <span className={`topBtnActivity ${style.main}`}>
                <Icon type="copy" />
                <Dropdown overlay={menu}>
                    <a className="ant-dropdown-link" href="#"> WBS  <Icon type="caret-down" /></a>
                </Dropdown>
            </span>
        )
    }
}

export default WbssTopBtn
