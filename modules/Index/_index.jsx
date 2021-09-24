import React, { Component } from 'react'
import { Table, Icon, Input, Row, Col, DatePicker, Button, Select ,Badge } from 'antd'
import style from './style.less'
import MessageTem from './MessageTem'
import MyQuestionTem from './MyQuestionTem'
import MyToDoTem from './MyToDoTem'
import MyIcon from "../../components/public/TopTags/MyIcon"
import DataOverview from './DataOverview'
import axios from "@/api/axios"
import { getMyMessageList,getMyUnfinishTaskList } from "@/api/api"
const Search = Input.Search
const { RangePicker } = DatePicker
const Option = Select.Option;
function onChange(value, dateString) {
}
function onOk(value) {
}
export class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tabs: [
                // { tabName: "我的任务", id: 1, iconType: "icon-daiban" },
                { tabName: "数据概览", id: 1, iconType: "icon-daiban" },
                { tabName: "我的待办", id: 2, iconType: "icon-xiaoxi" },
                { tabName: "我的消息", id: 3, iconType: "icon-39" },
                //{ tabName: "我的预警", id: 4, iconType: "icon-weibiaoti--" },
                // { tabName: "我的问题", id: 5, iconType: "icon-wenti" },
               // { tabName: "我的行动项", id: 6, iconType: "icon-hangdongxiang" }
            ],
            currentIndex: 1,
            mainHeight: '', //盒子高度
            mainLeftWidth: '',  //left盒子宽度
            menu2:0,
            menu3:0,
        };
    }

    tabChoiced = (id) => {
        this.getListMyToDo()
        this.getListMessage()
        //tab切换到方法
        this.setState({
            currentIndex: id,
        });
    };

    componentDidMount() {
        //初始化css样式
        var h = document.documentElement.clientHeight || document.body.clientHeight - 55;   //浏览器高度，用于设置组件高度
        var w = document.documentElement.offsetWidth || document.body.offsetWidth;
        this.setState({
            mainHeight: h - 160,
            mainLeftWidth: w - 55
        })
        this.getListMyToDo()
        this.getListMessage()
    }
    getListMyToDo = () => {
        let obj = {bizType:'', startTime:'', endTime:''}
        axios.post(getMyUnfinishTaskList(10,1), obj).then(res => {
            const total = res.data.total
            this.setState({
                menu2:total
            })
        })
      }
    getListMessage = () => {
      let obj = {title:'',planStartTime:'',planEndTime:''}
      axios.post(getMyMessageList(10, 1), obj).then(res => {
        const total = res.data.total
        this.setState({
            menu3:total
        })
      })
    }

    render() {
        var _this = this;
        var isTable1Show = this.state.currentIndex == 1 ? 'block' : 'none';
        var isTable2Show = this.state.currentIndex == 2 ? 'block' : 'none';
        var isTable3Show = this.state.currentIndex == 3 ? 'block' : 'none';
        var isTable4Show = this.state.currentIndex == 4 ? 'block' : 'none';
        var isTable5Show = this.state.currentIndex == 5 ? 'block' : 'none';
        var isTable6Show = this.state.currentIndex == 6 ? 'block' : 'none';
        var tabList = this.state.tabs.map(function (res, index) {
            var tabStyle = res.id == this.state.currentIndex ? 'homeActivity' : null;
            return <Badge count={index==0?0:(index==1?this.state.menu2:(index==2?this.state.menu3:0))} dot><li key={index} onClick={this.tabChoiced.bind(_this, res.id)} className={tabStyle}><MyIcon type={res.iconType}
                style={{ fontSize: 40, color: '#fff' }} />
                <span className={index.title}>{res.tabName}</span>
            </li></Badge>
        }.bind(_this));

        return (
            <div className={style.main} style={{ height: this.state.mainHeight +10}}>
                <ul className={style.itemlist}>
                    {tabList}
                </ul>
                {
                    this.state.mainHeight && (
                        <div className={style.rightMain} style={{ height: this.state.mainHeight -20}}>
                        {/*我的任务TaskTem */}
                        {/*数据概览 */}
                        {this.state.currentIndex == 1 &&                             
                                    <DataOverview openWorkFlowMenu = {this.props.openWorkFlowMenu } callBackBanner={this.props.callBackBanner} height={this.state.mainHeight}/>  
                        }
                        {/*我的代办*/}
                        {this.state.currentIndex == 2 &&                             
                                    <MyToDoTem openWorkFlowMenu = {this.props.openWorkFlowMenu } callBackBanner={this.props.callBackBanner} height={this.state.mainHeight}/>  
                        }
                        {/*我的消息*/}
                        {this.state.currentIndex == 3 &&   <MessageTem openMenuByMenuCode={this.props.openMenuByMenuCode}
                        callBackBanner={this.props.callBackBanner} height={this.state.mainHeight}/>  }
                        {/*我的预警MyWarnTem*/}
                        {/*我的问题*/}
                        {/* {this.state.currentIndex == 5 &&
    
                            <MyQuestionTem openMenuByMenuCode={this.props.openMenuByMenuCode} height={this.state.mainHeight}/>
    
                        } */}
                        {/*我的行动MyActionTem*/}
                        {/*领导首页LeaderPage LeaderPagePeople*/}
                          </div>
                          
                    )

                }
               
              

            </div>

        )
    }
}

export default Index
