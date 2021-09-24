import React from 'react'
import style from './style.less'
import { Menu, Dropdown, Icon, Spin } from 'antd'
import emitter from '../../../api/ev'

class AddPBSBtn1 extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }
  handleClick=(e)=>{
  }
    render() {
        const menu = (
            <Menu onClick={this.handleClick}>
                    <Menu.Item  key="1" onClick={this.props.onClickHandle.bind(this,"AddPBSBtn" ,'same')}>
                        <a href="#">新增同级PBS</a>
                    </Menu.Item>
                    <Menu.Item  key="2" onClick={this.props.onClickHandle.bind(this,"AddPBSBtn" , 'next')}>
                        <a href="#">新增下级PBS</a>
                    </Menu.Item>
            </Menu>
        );
        return (
            <span className={`topBtnActivity ${style.main}`}>
                <Icon type="drag" />
                <Dropdown overlay={menu}>
                    <a className="ant-dropdown-link" href="#"> 新增PBS<Icon type="down" /></a>
                </Dropdown>
            </span>
        )
    }
}

export default AddPBSBtn1
