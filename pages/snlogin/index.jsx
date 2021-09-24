import "babel-polyfill";
import React, {Component} from 'react'
import style from './index.less'
import axios from '../../api/axios'
import router from 'next/router'
import LoginTpl from "../../components/Login/index";    //登录模块
import {getToken, getUserInfo} from "../../api/api";     //
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as sysMenuAction from '../../store/sysMenu/action';
import * as localAction from '../../store/localeProvider/action';
import {message, notification, Spin} from "antd"
import MyIcon from '../../components/public/TopTags/MyIcon';
import {baseURL} from "@/api/config";

//登录页面
class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      language: "zh-CN"
    }
  }
  componentDidMount() {
    this.getLoginByUrl();  
  }
  getLoginByUrl = () => {
    const token = router.query.token
    if (token) {
      sessionStorage.setItem('token', token)       //token存储到sessionStorage
      //待办流程
      if(router.query.taskId && router.query.procInstId){
        const obj={taskId:router.query.taskId,procInstId:router.query.procInstId,type:router.query.type};
        localStorage.setItem('workflow', JSON.stringify(obj))
      }
      this.props.actions.getSysMenu().then(res => {                  //获取用户信息、我的项目、菜单
        if (res.isUpdatePwd == 1) {
          this.setState({
            isShowPasswordSet: true,//打开修改密码
            token: token//临时token
          })
        } else {
          sessionStorage.setItem('userInfo', JSON.stringify(res))
          const url = router.query.url;
          if(url){
            router.push(url)
          }else{
            router.push('/home');
          }
        }
      })
    }
  }
  render() {
    return (
      <div className={style.main}>
        <Spin tip="Loading..." size="large" spinning={true}/>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    currentLocale: state.localeProviderData,
  }
};
const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(Object.assign({}, sysMenuAction, localAction), dispatch)
});
export default connect(mapStateToProps, mapDispatchToProps)(Login);
