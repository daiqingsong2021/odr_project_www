import React, { Component } from 'react'
import { Menu, Dropdown, Icon, Spin, Tooltip } from 'antd';
import style from './style.less'
import dynamic from 'next/dynamic'
class TopTags extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      content: false,
      height: '',
      left: '500',                   //拖拽框left距离,
      rightMenu: [],                //右侧菜单,

    }
  }

  componentDidMount() {
    //初始化css样式
    var h = document.documentElement.clientHeight || document.body.clientHeight;   //浏览器高度，用于设置组件高度
    var w = document.documentElement.clientWidth / 2 || document.body.clientWidth / 2; //右侧弹出框宽度
    this.setState({
      left: w,
      height: h - 200,
      widowsWidth: document.documentElement.clientWidth || document.body.clientWidth,
      rightMenu: this.props.rightTagList
    })
  }

  //打开
  openRightBox = (e, index) => {
    this.props.openRightBox(e, index)

  }
  render() {
    const MyIcon = Icon.createFromIconfontCN({
      scriptUrl: '/static/fonts/rightIcon/iconfont.js', // 在 iconfont.cn 上生成
    });
    return (
      // <div className={style.main} style={{ height: this.state.height }}>
      <div style={{border:"1px solid #f2f2f2",paddingBottom:10}}>

        {this.props.rightTagList && this.props.rightTagList.map((item, index) => {
          return (
            <li key={index} onClick={this.openRightBox.bind(this, item.fielUrl,index)} className={this.props.currentIndex == index ? 'my-icon-activity':'my-icon'}>
              <Tooltip placement="left" title={item.title} overlayStyle={{ backgroundColor: 'white' }}>
                <MyIcon type={item.icon} style={{ fontSize: '18px' }} className='my-icon'/>
              </Tooltip>
            </li>)


        })}

      </div>
    )
  }
}

export default TopTags
