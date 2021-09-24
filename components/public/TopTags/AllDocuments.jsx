import React from 'react'
import style from './style.less'
import { Icon, Menu, Dropdown } from 'antd'
import MyIcon from './MyIcon'
class AllDocuments extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            icon: true
        }
    }

    onClickHandle() {

    }

    render() {
        const menu = (
            <Menu>
                <Menu.Item>
                    <a target="_blank" rel="noopener noreferrer" href="javascript:;">全部文档</a>
                </Menu.Item>
                <Menu.Item>
                    <a target="_blank" rel="noopener noreferrer" href="javascript:;">我的文档</a>
                </Menu.Item>
                <Menu.Item>
                    <a target="_blank" rel="noopener noreferrer" href="javascript:;">传递文档</a>
                </Menu.Item>
            </Menu>
        )
        return (
            <span  className={`topBtnActivity ${style.main}`} onClick={this.onClickHandle.bind(this)}>
               <MyIcon type='icon-wendangleixingshitu'  />
                <Dropdown overlay={menu}>
                    <a className="ant-dropdown-link" href="#">
                        全部文档 <Icon type="down" />
                    </a>
                </Dropdown>
            </span>
        )
    }
}

export default AllDocuments
