import React, {Component} from 'react';   //react引用
import {message} from 'antd';             //antd组件引用
import style from './index.less';        //css文件
import router from 'next/router';         //next路由

//登录模块
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: '',    //用户名
      password: '',    //密码
    }
  }
  //获取input内容，设置用户名、密码value
  getInputValue = (type, e) => {
    if(type =='userName'){
      this.setState({
        userName: e.target.value ? e.target.value : ''
      })
    }else {
      this.setState({
        password: e.target.value ? e.target.value : ''
      })
    }
  }
  //提交登录   发送事件callBackLogin(data)
  loginSubmit = () => {
    var data={}
    const { search } = location
    const paramsString = search.substring(1)
    const searchParams = new URLSearchParams(paramsString)
    const name = searchParams.get('name')
    const userName = searchParams.get('userName')
    const uid = searchParams.get('uid')
    const phone_number = searchParams.get('phone_number')
    if(uid != null && uid != ""){
      data.userName = userName
      data.password = 'Njert123!'
      data.name =  decodeURI(decodeURI(name))
      data.uid = uid
      data.phone_number = phone_number
      this.props.callBackLogin(data);
    }else{
      router.push('http://192.168.43.250:12000/ssoLogin')
    }
   
  }

  componentDidMount(){
    this.loginSubmit()
}

  handleEnterKey=(e)=>{
    if(e.keyCode===13){
      this.loginSubmit()
    }
  }
  
  render() {
    return (
      <div className={style.main} onKeyDown={this.handleEnterKey}>
        <div className={style.loginItem}>
          <input type='text' name='userName' placeholder="请输入用户名" onChange={this.getInputValue.bind(this, 'userName')}/>
        </div>
        <div className={style.loginItem}>
          {/*<input placeholder="请输入密码"  name="password" autoComplete="new-password" type="password"  onChange={this.getInputValue.bind(this, 'password')}/>*/}
          <input placeholder="请输入密码" type="password"  onChange={this.getInputValue.bind(this, 'password')}/>
        </div>
        <div className={style.loginSub} onClick={this.loginSubmit} ><div>登录2</div></div>
      </div>
    )
  }
}

export default Login
