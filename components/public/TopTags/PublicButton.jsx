/*
 * @Author: haifeng
 * @Date: 2019-04-26 11:35:25
 * @Last Modified by: haifeng
 * @Last Modified time: 2019-04-26 11:32:40
 */

import React from 'react';
import {Icon, Popconfirm, Modal} from 'antd';
import style from './style.less';
import MyIcon from './MyIcon'

const confirm = Modal.confirm;

//按钮组件
//edit {Boolean} 按钮是否可操作 默认true
//title {string} 按钮名称、提示框标题
//icon  {string} 按钮图标名称
//beforeCallBack {string} 操作之前处理
//useModel  {Boolean} 是否使用提示框功能 默认fasle
//verifyCallBack {fun} 是否需要验证 默认false 用于删除等提示框
//content {sting}  Moldel提示框文字
//afterCallBack (string) 操作之后处理
class PublicButton extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      ...this.initProps(this.props),
      visible: false,     //提示窗口显示状态 默认隐藏
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
      content: props.content ? props.content : '您确定要删除吗?',
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

  //提示窗口 确认按钮操作
  handleOk = () => {
    this.setState({
      visible: !this.state.visible
    })
    this.props.afterCallBack();
  }
  handleClick = () => {
    this.props.afterCallBack();
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
      show ?(
        //不可操作状态下，无点击事件
        this.state.edit === false ? (
            <span className={style.main}>
           <span>
             <MyIcon type={this.state.icon}/>
             <span> {this.state.title}</span>
          </span>
      </span>
          )
          :
          (
            //使用model情况下
            this.state.useModel ? (
              <span className={`topBtnActivity ${style.main}`}>
           <span onClick={this.showMdel}>
             <MyIcon type={this.state.icon}/>
             <a className="ant-dropdown-link" href="#"> {this.state.title}</a>
          </span>
           <Modal
             width={350}
             title={this.state.title}
             visible={this.state.visible}
             onOk={this.handleOk}
             onCancel={this.showMdel}
             mask={false}
             centered={true}
             maskClosable={false}
           >
          <p style={{textAlign: 'center', fontSize: 18, paddingTop: 10, paddingBottom: 10}}>
            <Icon type="warning"
                  style={{
                    fontSize: 30,
                    color: '#faad14'
                  }}/> &nbsp;{this.state.content ? this.state.content : '确认要继续操作此项吗？'}
          </p>
        </Modal>
      </span>
            ) : (
              //不使用model 情况下
              <span className={`topBtnActivity ${style.main}`}>
               <span onClick={this.handleClick}>
                 <MyIcon type={this.state.icon}/>
                 <a className="ant-dropdown-link" href="#"> {this.state.title}</a>
              </span>
            </span>
            )
          )
      ):(
        <span></span>
      )
    );
  }
}

export default PublicButton;
