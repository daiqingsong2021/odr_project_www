import React, { Component } from 'react'
import style from './index.less'
import axios from '../../api/axios'
import router from 'next/router'
import LoginTpl from "../../components/Login/index";    //登录模块
import { getToken, getUserInfo } from "../../api/api";     //
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as sysMenuAction from '../../store/sysMenu/action';
import * as localAction from '../../store/localeProvider/action';
import PassWordSet from "../../modules/Components/PassWordSet"
import { message, notification } from "antd"
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
  //回调监听 提交登录接口
  callBackLogin = (data) => {
    axios.post(getToken, data).then(res1 => {                 //获取token
      sessionStorage.clear();
      sessionStorage.setItem('token', res1.data.data)       //token存储到sessionStorage
      this.props.actions.getSysMenu().then(res => {                  //获取用户信息、我的项目、菜单
        // if(!res.userCode || res.userCode.indexOf('UVU') != -1){
          
        // }else{
        //   notification.warning(
        //     {
        //       placement: 'bottomRight',
        //       bottom: 50,
        //       duration: 2,
        //       message: '提示',
        //       description: '内部用户从门户或单点登录链接访问'
        //     }
        //   )
        //   return
        // }
        if (res.isUpdatePwd == 1) {
          this.setState({
            isShowPasswordSet: true,//打开修改密
          })
        } else {
          notification.success(
            {
              placement: 'bottomRight',
              bottom: 50,
              duration: 2,
              message: '提示',
              description: '登录成功'
            }
          )

          sessionStorage.setItem('userInfo', JSON.stringify(res))
          router.push('/home')
        }

      })
    })

  }
  //语言切换
  changeLanguage = (language) => {
    this.setState({ language }, () => {
      localStorage.setItem("acmlanguage", language)
      this.props.actions.initLocaleProvider(language)
    })
  }
  componentDidMount() {
    sessionStorage.clear();
    let language = localStorage.getItem("acmlanguage")
    if (language == null) {

      this.setState({ language }, () => {
        this.props.actions.initLocaleProvider("zh-CN")
        localStorage.setItem("acmlanguage", "zh-CN")
      })
    } else {

      this.setState({ language }, () => {
        this.props.actions.initLocaleProvider(language)
      })

    }  
  }
  render() {
    return (
      <div className={style.main}>

          <div className={style.logo}>
              <img src="/static/images/heb/heb_banner.png" style={{width:'100%',height:'100%'}} />
          </div>
        <div className={style.mmp}>
          <div className={style.loginBox}>
            {/* <img src="/static/images/hgd.png" alt="" style={{position:"absolute",width:265,left:43,top:10}}/> */}
            {/* <p className={style.language}><span onClick={this.changeLanguage.bind(this, "zh-CN")} className={this.state.language == "zh-CN" ? style.currentColor : null} >中文</span>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;<span onClick={this.changeLanguage.bind(this, "en-US")} className={this.state.language == "en-US" ? style.currentColor : null}>English</span></p> */}
            {/* <div className={style.logo}> */}
            {/* <img src="/static/images/suzhou/1.png" style={{width:'320px'}} /> */}
              {/* <img src="/static/images/GanttView.png" style={{width:270}}/> */}
              {/* <img src="/static/images/wasdd.png" style={{width:270}}/> */}
            {/* </div> */}
            <div className={style.loginForm}>
              <div className={style.loginTitle}>
                <div className={style.logoh}>
                  <h1 style={{'textAlign':'center'}}>用户登录</h1>
                  {/* <span>Agile Cooperation Management</span> */}
                </div>
                {/* <MyIcon type="icon-jimi" style={{fontSize:42,marginTop:10}}/> */}
              </div>


              {/*登录模块*/}
              <LoginTpl callBackLogin={this.callBackLogin} />
              {/* <div className={style.loginTips}><a href={`/api/szxm/sologin`}>内部用户登录请点击这里<MyIcon type="iconyaoshi" style={{fontSize:16}}/></a></div> */}
            </div>
          </div>
      </div>
        <style global jsx>{`
          body {
            background:#f4fafe url('/static/images/heb/heb_bg.png') no-repeat ;
            background-size:100% 100%;
          }
    `}</style>
      {this.state.isShowPasswordSet && <PassWordSet handleCancel={() => this.setState({ isShowPasswordSet: false })} isUpdate={true} />}
      </div>
    )
  }
}
// export default Login

const mapStateToProps = state => {
  return {
    currentLocale: state.localeProviderData,
    // menuData: state.menuData,
    // record:state.sysMenu.record,
  }
};
const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(Object.assign({}, sysMenuAction, localAction), dispatch)
});
export default connect(mapStateToProps, mapDispatchToProps)(Login);
