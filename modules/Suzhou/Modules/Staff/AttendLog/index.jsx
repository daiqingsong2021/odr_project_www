import React, { Component } from 'react'
import { Table, notification,Statistic, Row, Col } from 'antd'
import style from './style.less'
import { connect } from 'react-redux'
import { changeLocaleProvider } from '../../../../../store/localeProvider/action'
import RightTags from '../../../../../components/public/RightTags/index'
import * as util from '../../../../../utils/util';
import * as dataUtil from '../../../../../utils/dataUtil';
import Release from "../../../../Components/Release"
import TipModal from "../../../../Components/TipModal"
import {getSectionKqRecord,getsectionId} from '../../../api/suzhou-api';
import axios from '../../../../../api/axios';
import MyIcon from "../../../../../components/public/TopTags/MyIcon";
import TopTags from './TopTags/index';
import {firstLoad} from "@/modules/Suzhou/components/Util/firstLoad";
import {isChina} from "@/modules/Suzhou/components/Util/util.js";
import notificationFun from '@/utils/notificationTip';
import { getMapSectionData } from '@/modules/Suzhou/components/Util/util';
class SpecialType extends Component {
    constructor(props){
        super(props);
        this.state = {
            rightTags: [],
            selectedRowKeys:[],
            selectedRows:[],
            pageSize:500,
            currentPageNum:1,
            total:'',
            projectId:"",
            sectionId:"",
            search:"",
            projectName:'', //项目名称
            selectSectionId:'',//选择标段
            selectStatus:'',
            selectType :"", //选择人员类型
            type:'0', //人员类型
            selectDate:'', //选择日期
            date:'', //日期
            showDate:'',//显示的日期
            jcrysl:'',//进场人员数量
            qjrs:'',//请假人数
            qqrs:'',//缺勤人数
            cqrs:'',//出勤人数
            selectSection:[],//标段树🌲
            selectDateFlag:false,
        }
    }
    getInfo = (record)=>{
        const { activeIndex } = this.state;
        const { id } = record;
        this.setState({
        activeIndex: id,
            record: record,
            rightData: record
        });
    }
    getList = ()=>{
        const {projectId,sectionId,date,type,search,sectionIds} = this.state;
        let myPaigongdan = JSON.parse(localStorage.getItem("myPaigongdan"));
        let AttenQus = JSON.parse(localStorage.getItem("AttenQus"));
        if(myPaigongdan){
          localStorage.removeItem('myPaigongdan')
          axios.get(getSectionKqRecord(this.state.pageSize,this.state.currentPageNum),{params:{projectId:myPaigongdan.projectId,sectionId:myPaigongdan.sectionId,ryId:myPaigongdan.workerId,date:myPaigongdan.dispatchTime}}).then(res => {
            this.setState({
                total:res.data.data.data.total,
                data: res.data.data.data.data,
                cqrs:res.data.data.cqrs,
                jcrysl:res.data.data.jcrysl,
                qjrs:res.data.data.qjrs,
                qqrs:res.data.data.qqrs,
            });
          });
        }else if(AttenQus){
          localStorage.removeItem('AttenQus')
          axios.get(getSectionKqRecord(this.state.pageSize,this.state.currentPageNum),{params:{projectId:AttenQus.projectId,sectionId:AttenQus.sectionId,type:AttenQus.type}}).then(res => {
            this.setState({
                total:res.data.data.data.total,
                data: res.data.data.data.data,
                cqrs:res.data.data.cqrs,
                jcrysl:res.data.data.jcrysl,
                qjrs:res.data.data.qjrs,
                qqrs:res.data.data.qqrs,
                sectionId:AttenQus.sectionId
            });
          });
        }else{
          axios.get(getSectionKqRecord(this.state.pageSize,this.state.currentPageNum),{params:{projectId,sectionIds,date,type,searcher:search}}).then(res => {
            // console.log(res.data.data.data.data);
            // this.getSelectTreeArr1(res.data.data.data.data,{"id":"value"});
            this.setState({
                total:res.data.data.data.total,
                data: res.data.data.data.data,
                cqrs:res.data.data.cqrs,
                jcrysl:res.data.data.jcrysl,
                qjrs:res.data.data.qjrs,
                qqrs:res.data.data.qqrs,
            });
          });
        }
    }
    // getSelectTreeArr1=(array,keyMap)=>{
    //   if(array){
    //     array.forEach((item,index,arr)=>{
    //       delete item.id
    //       // var obj = item;
    //       // for(var key in obj){
    //       //   var newKey = keyMap[key];
    //       //   if(newKey){
    //       //       obj[newKey] = obj[key]+' ' +obj['checkTime'];
    //       //       delete obj.key;
    //       //   }
    //       // }
    //       this.getSelectTreeArr(item.children,keyMap);
    //     })
    //   }
    // }
    getSelectId=()=>{
      axios.get(getsectionId(this.state.projectId)).then(res=>{
        const { data = [] } = res.data;
        this.setState(() => ({ selectSection: getMapSectionData(data) }))
        this.getSelectTreeArr(res.data.data,{"id":"value","name":"title"});
        this.setState({
          //selectSection:res.data.data,
          defaultSection:!res.data.data?notificationFun('提示','该项目下无标段'):res.data.data[0].id,
          sectionId:!res.data.data?'':res.data.data[0].id,
        },()=>{
          this.getList()
        })
      })
    }
    componentDidMount(){
      var dayTime = new Date();
      dayTime.setTime(dayTime.getTime());
      const dayTimeDay = ((dayTime.getMonth()+1)+'').length==1?('0'+(dayTime.getMonth()+1)):(dayTime.getMonth()+1);
      var date = dayTime.getFullYear()+"-" +dayTimeDay + "-" + dayTime.getDate();
      firstLoad().then(res=>{
        this.setState({
            projectId:res.projectId,
            projectName:res.projectName,
            sectionIds:res.sectionId,
            showDate:date,
            date:date
        },()=>{
          this.getSelectId();
        })
      })
    }
    getSelectTreeArr=(array,keyMap)=>{
      if(array){
        array.forEach((item,index,arr)=>{
          var obj = item;
          for(var key in obj){
            var newKey = keyMap[key];
            if(newKey){
                obj[newKey] = obj[key];
            }
          }
          this.getSelectTreeArr(item.children,keyMap);
        })
      }
    }
   //选择标段
   onChangeSection = (val)=>{
     this.setState({
       selectSectionId:!val?"":val,
       sectionId:!val?"":val,
       sectionIds:!val?"":val.join(','),
     },()=>{
      this.getList();
    })
   }
   //选择日期
   selectDate = (date,dateString)=>{
    this.setState({
        selectDate:!dateString?'':dateString,
        showDate:!dateString?'':dateString,
        selectDateFlag:true
    })
  }
    //人员类型
    selectType = (val)=>{
      this.setState({
        selectType:!val?'':val
      })
    }
    // 搜索
    search = (val) =>{
      const {selectType,selectSectionId,selectDate,date,sectionId,selectDateFlag,type} = this.state;
        this.setState({
            search:isChina(val),
            sectionId:!selectSectionId?sectionId:selectSectionId,
            type:!selectType?type:selectType,
            date:!selectDateFlag?date:selectDate,
            showDate:!selectDateFlag?date:selectDate,
            currentPageNum:1
        },()=>{
          if(!this.state.projectId){
            notification.warning(
              {
                  placement: 'bottomRight',
                  bottom: 50,
                  duration: 1,
                  message: '警告',
                  description: '请选择项目和标段'
              }
            )
          }else{
            this.getList();
          }
        })
    }
    // 选择项目
    openPro = (data1,data2,projectName) =>{
        this.setState({
          projectId:data1[0],
          projectName,
          currentPageNum:1
        },()=>{
          this.getSelectId();
        })
    }
    //设置table的选中行class样式
    setClassName = (record, index) => {
        return record.id === this.state.activeIndex ? 'tableActivty' : '';
    };
    render(){
        const { data, rightTags,itemMaps } = this.state;
        // console.log(data);
        const { height, record } = this.props;
        const { intl } = this.props.currentLocale;
        const columns = [
            {
                title: '姓名',
                dataIndex: 'name',
                key:'name'
            },
            {
                title:'人员类型',
                dataIndex: 'typeName',
                key: 'typeName',
            },
            {
                title: '职务',
                dataIndex: 'jobName',
                key: 'jobName',
            },
            {
                title: '项目名称',
                dataIndex: 'projectName',
                key: 'projectName',
            },
            {
                title:'标段名称',
                dataIndex: 'sectionName',
                key: 'sectionName',
            },
            {
                title: '打卡时间',
                dataIndex: 'checkTime',
                key: 'checkTime',
            },
            {
                title: '打卡地址',
                dataIndex: 'locationAddress',
                key: 'locationAddress',
            },
            {
                title: '打卡方式',
                dataIndex: 'checkType',
                key: 'checkType',
            },
        ];
        let pagination = {
            total: this.state.total,
            // hideOnSinglePage: true,
            current: this.state.currentPageNum,
            pageSize: this.state.pageSize,
            showSizeChanger: true,
            size:"small",
            showQuickJumper: true,
            pageSizeOptions:[500,1000,1500,2000],
            showTotal: total => `总共${this.state.total}条`,
            onShowSizeChange: (current, size) => {
              this.setState({
                pageSize: size,
                currentPageNum: 1
              }, () => {
                this.getList();
              })
            },
            onChange: (page, pageSize) => {
              this.setState({
                currentPageNum: page
              }, () => {
                this.getList();
              })
            }
        }
        let { selectedRowKeys,selectedRows} = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
              this.setState({
                selectedRowKeys,
                selectedRows
              })
            }
        };
        return(
            <div>
                <TopTags
                  projectName = {this.state.projectName}
                  record={this.state.record}
                  onChangeSection = {this.onChangeSection}
                  selectDate={this.selectDate}
                  selectType = {this.selectType}
                  search={this.search}
                  openPro={this.openPro}
                  projectId={this.state.projectId}
                  sectionId = {this.state.sectionId}
                  selectSection = {this.state.selectSection}
                  selectedRows={this.state.selectedRows}
                  showDate={this.state.showDate}
                />
                <div className={style.main} style={{ height: this.props.height }}>
                <div className={style.leftMain}>
                  <div className={style.subMain}>
                      <Row>
                        <Col span={6}>
                          <Statistic title="进场人员数量" value={this.state.jcrysl} />
                        </Col>
                        <Col span={6}>
                          <Statistic title="出勤人数" value={this.state.cqrs} />
                        </Col>
                        <Col span={6}>
                          <Statistic title="请假人数" value={this.state.qjrs} />
                        </Col>
                        <Col span={6}>
                          <Statistic title="缺勤人数" value={this.state.qqrs} />
                        </Col>
                      </Row>
                  </div>
                  <div className={style.subMain} style={{ minWidth: 'calc(100vw - 60px)' }}>
                    <Table
                            size="small"
                            pagination={pagination}
                            columns={columns}
                            rowKey={record => record.id}
                            name={this.props.name}
                            dataSource={data}
                            rowSelection={rowSelection}
                            rowClassName={this.setClassName}
                            // onRow={(record, index) => {
                            // return {
                            //     onClick: (event) => {
                            //         this.getInfo(record, event);
                            //     },
                            //     };
                            // }
                            // }
                        />
                </div>
                </div>
            </div>
        </div>
        )
    }
}
export default connect(state => ({
    currentLocale: state.localeProviderData
}), {
        changeLocaleProvider
    })(SpecialType);