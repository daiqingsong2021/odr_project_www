import React, { Component } from 'react'
import style from './style.less'
import { Menu, Icon } from 'antd';

export class RightClickMenu extends Component {
    constructor(props) {
        super(props)
        this.state = {
            roleVisible: false
        }
    }

    

    render() {
        const MenuItems = () => {
                
                return (
                    <Menu>
                         <Menu.Item  onClick={this.props.handleClick.bind(this,"addPbs")}>
                            <Icon type="plus-square"/>
                             新增PBS
                        </Menu.Item>
                        <Menu.Item onClick={this.props.handleClick.bind(this,"addDelv")}>
                            <Icon type="plus-square" />
                            新增交付物
                        </Menu.Item>
                       
                        <Menu.Item onClick={this.props.handleClick.bind(this,"delete")}>
                            <Icon type="delete" />
                            删除
                        </Menu.Item>
                       
                    </Menu>
                )
            


        }
        return (
            <div className={style.main} style={{ left: this.props.x, top: this.props.y}}>
                <div>
                    <MenuItems />
                </div>


            </div>

        )
    }
}

export default RightClickMenu