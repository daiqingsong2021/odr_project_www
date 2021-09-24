/*
 * @Author: haifeng
 * @Date: 2019-04-26 11:35:25
 * @Last Modified by: haifeng
 * @Last Modified time: 2019-04-26 11:32:40
 */

import React from 'react';
import {Button} from 'antd';
import {Confirm} from "../Modal/Confirm";

//按钮组件
//edit {Boolean} 按钮是否可操作 默认true
//title {string} 按钮名称、提示框标题
//icon  {string} 按钮图标名称
//beforeCallBack {string} 操作之前处理
//useModel  {Boolean} 是否使用提示框功能 默认fasle
//verifyCallBack {fun} 是否需要验证 默认false 用于删除等提示框
//content {sting}  Moldel提示框文字
//afterCallBack (string) 操作之后处理
class ExtButton extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      ...this.initProps(this.props),
      visible: false,     //提示窗口显示状态 默认隐藏
      showConfirm: false
    }
  }

  componentWillReceiveProps(newProps, state) {
    this.setState(this.initProps(newProps));
  }

  initProps = (props) =>{
    return {
      edit: props.edit == undefined ? true : (props.edit || false),
      title: props.title ? props.title : '',
      icon: props.icon ? props.icon : '',
      beforeCallBack: props.beforeCallBack ? props.beforeCallBack : false,
      verifyCallBack: props.verifyCallBack ? props.verifyCallBack : false,
      useModel: props.useModel ? true : false,
      content: props.content ? props.content : '确认要继续操作此项吗?',
      afterCallBack: props.afterCallBack ? props.afterCallBack : '',
      show: true
    }
  }

  //关闭/打开 警告提示窗口,判断提示框显示时，是否需要验证操作
  showMdel = () => {
    if (!this.props.verifyCallBack || this.props.verifyCallBack()) {
      this.setState({
        visible: !this.state.visible
      })
    }
  }

  componentDidMount() {
  }

  handleClick = () => {
    if(this.state.useModel){
      this.setState({
        showConfirm: true
      })
    }else{
      this.onClick_();
    }
  }

  onClick_ = ()=>{
    if(this.props.onClick){
      this.props.onClick();
    }
    if(this.props.afterCallBack){
      this.props.afterCallBack();
    }
  }

  getShow = () =>{

    let show = this.props.show == undefined || this.props.show == null ? this.state.show : this.props.show;
    let userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
    // 判断res是否存在 权限列表中，存在放行 或者 未赋予按钮res 一律放行
    if ( this.state.show && userInfo.funcCodes && this.props.res && userInfo.funcCodes.indexOf(this.props.res)>-1 ) {
      show = true;
    }
    return show;
  }

  //
  render() {
    const show = this.getShow();
    return (
      <>
        <Button {...this.props } onClick={this.handleClick } show = {show} disabled = {!this.state.edit }></Button>
        {
          this.state.showConfirm && (
            <Confirm visible = {this.state.showConfirm } handleOk = {this.onClick_} content = {this.state.content } handleCancel = {() => {this.setState({"showConfirm" : false })}} />
          )
        }

      </>
    )
  }
}

export default ExtButton;
