import React, {Component} from 'react'
import style from './style.less'
import dynamic from 'next/dynamic'
import {Menu, Dropdown, Icon, Spin} from 'antd';

// 主窗口组件
class Main extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      mainHeight: '', //盒子高度
    }
  }

  componentDidMount() {
    //初始化css样式
    var h = document.documentElement.clientHeight || document.body.clientHeight;   //浏览器高度，用于设置组件高度
    this.setState({
      mainHeight: h - 190,
    })
  }

  render() {
    //左侧菜单组件
    const Main = dynamic(import('../../../modules/' + this.props.menuInfo.url + '/index'), {
      loading: () => <Spin size="small"/>
    })
    return (

      <div className={style.pcontent}>
        <Main {...this.props} height={this.state.mainHeight}/>
      </div>
    )
  }
}

export default Main
