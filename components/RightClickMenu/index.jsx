import React, {Component} from 'react'
import style from './style.less'
import {Menu, Icon} from 'antd';

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
        <Menu style={{height:105,lineHeight:'35px'}}>
          <Menu.Item onClick={this.props.handleClick.bind(this, "deleteCurrent")} disabled={this.props.rightClickData.id==1?true:false} style={{height:35,lineHeight:'35px',marginBottom:0}}>
            <Icon type="close" />
            关闭当前
          </Menu.Item>
          <Menu.Item onClick={this.props.handleClick.bind(this, "deleteOther")} style={{height:35,lineHeight:'35px',marginBottom:0}}>
            <Icon type="close" />
            关闭其他
          </Menu.Item>
          <Menu.Item onClick={this.props.handleClick.bind(this, "refresh")} style={{height:35,lineHeight:'35px',marginBottom:0}}>
            <Icon type="reload"/>
            重新加载
          </Menu.Item>
        </Menu>
      )
    }
    return (
      <div className={style.main} style={{left: this.props.x, top: this.props.y}}>
        <div>
          <MenuItems/>
        </div>
      </div>

    )
  }
}

export default RightClickMenu
