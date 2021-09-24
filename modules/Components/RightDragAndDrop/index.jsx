import React, {Component} from 'react'
import {Menu, Dropdown, Icon, Spin, message} from 'antd';
import style from './style.less'
import dynamic from 'next/dynamic'


import {connect} from 'react-redux'
class TopTags extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
     
      height: '',
      isLoading: true,
      fileUrl: '',
      data: [],                   //左侧模块点击传的参
      rightTagList: [],
      width: '', //组织机构控制右侧宽度
    }

    

  }

 

  componentDidMount() {
    //初始化css样式
    var h = document.documentElement.clientHeight || document.body.clientHeight;   //浏览器高度，用于设置组件高度
    this.setState({
      height: h - 200,
    })
  }

  //关闭
  closeRightBox = () => {
    this.setState({
      content: false
    })
  }
  
  render() {
    var widowsWidth = document.documentElement.clientWidth || document.body.clientWidth
    var id = Math.random().toString(36).substr(2);
    var box;
    var type = false
    var width = document.documentElement.clientWidth *0.75 || document.body.clientWidth *0.75; //右侧弹出框宽度;
    var isLoading = false

    //鼠标拖动时，设置div宽度
    function onmousemove(e) {
      box = document.getElementById(id);
      if (type) {
        let event = e || window.event;
        let target = event.target || event.srcElement;
        if ((widowsWidth - event.clientX ) < 300) {
          box.style.width = 300 + 'px'
        } else {
        
          if (widowsWidth - event.clientX > widowsWidth - 100) {
            box.style.width = widowsWidth - 100 + 'px'
          } else {
            box.style.width = widowsWidth - event.clientX + 'px'
          }
        }
      }
    }

    //鼠标抬起时,移除全局监听事件
    function onmouseup(e) {
      if (type) {
        type = false
        isLoading = false
        window.removeEventListener("mouseup", onmouseup, false);
        window.removeEventListener('mousemove', onmousemove, false);
      }
    }

    //鼠标点下，添加全局监听鼠标事件
    function onmousedown(e) {
      if (!type) {
        window.addEventListener('mouseup', onmouseup);
        window.addEventListener('mousemove', onmousemove);
        let event = e || window.event;
        let target = event.target || event.srcElement;
        let x = event.clientX - target.offsetLeft;
        type = true
        isLoading = true
        e.preventDefault();
      }
    }
    return (
      <div className={style.main} style={{height:this.props.height? this.props.height: this.state.height}}>
       
          <div id={id} className={style.content} style={{width: this.state.width == '' ? width : this.state.width}}>
            <div className={style.border} onMouseDown={onmousedown}>
              <Icon type="caret-left" className={style.leftIcon}/>
              <Icon type="caret-right" className={style.rightIcon}/>
            </div>
            {this.props.children}
          </div>
    
    
      </div>
    )
  }
}

export default connect()(TopTags)
