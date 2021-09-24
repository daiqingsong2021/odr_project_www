import React, {Component} from 'react'
import style from './style.less'
import Router from 'next/router'
import axios from '../../../api/axios';
import { projectMapUserInfo } from '../../../api/api';
import {Spin} from "antd"

class ProjectMap extends Component {

  //Router.push(`http://www.wisdomicloud.com/`)


  constructor(props) {
    super(props)
    this.state = {
      userName:"",
      cityName:"",
      projectMapUrl:"",
      flag:0,
    }
  }

  componentDidMount() {
    axios.post(projectMapUserInfo).then(res => {
      if (res.data.status==200){
        this.setState({
          userName:res.data.data.userName,
          cityName:res.data.data.obsName,
          projectMapUrl:res.data.data.projectMapUrl,
          flag:1,
        })
        if (res.data.data.obsName == '句容市' || res.data.data.obsName=='宝华镇'){
          this.setState({
            flag:2
          })
        }
      }
    })
  }


  render() {
    return (
      <div>
        {
          this.state.flag==0 && (
            <div className={style.main}>
              <Spin tip="Loading..." size="large"/>
            </div>
          )
        }
        {
          (this.state.flag==1)?(
            <iframe style={{frameborder:"0",border:"0" }} src={this.state.projectMapUrl+"/project_map/map_home?cityName="+this.state.cityName+"&userName="+this.state.userName} width={"100%"} height={this.props.height + 50}></iframe>
          ):(
            (this.state.flag==2)?
              <iframe style={{frameborder:"0",border:"0" }} src={this.state.projectMapUrl+"/project_map/cityMap?cityName="+this.state.cityName+"&userName="+this.state.userName} width={"100%"} height={this.props.height + 50}></iframe>
            :''
          )
        }
        {/*<iframe src={"http://www.wisdomicloud.com/"} width={"100%"} height={this.props.height + 50}></iframe>*/}
      </div>
    )
  }
}

/* *********** connect链接state及方法 start ************* */
export default ProjectMap;
/* *********** connect链接state及方法 end ************* */
