import React, { Component } from 'react'
import { Table, notification } from 'antd'
import style from './style.less'
import { connect } from 'react-redux'
import { changeLocaleProvider } from '../../../../../store/localeProvider/action'
import RightTags from '../../../../../components/public/RightTags/index'
import * as util from '../../../../../utils/util';
import * as dataUtil from '../../../../../utils/dataUtil';
import {getPeopleEntryList,getPermission} from '../../../api/suzhou-api';
import axios from '../../../../../api/axios';
import MyIcon from "../../../../../components/public/TopTags/MyIcon";
import TopTags from './TopTags/index';
import {firstLoad} from "@/modules/Suzhou/components/Util/firstLoad";
import {permissionFun} from "@/modules/Suzhou/components/Util/util.js";

//布局
import ExtLayout from "@/components/public/Layout/ExtLayout";
import MainContent from "@/components/public/Layout/MainContent";
import Toolbar from "@/components/public/Layout/Toolbar";
import PublicTable from '@/components/PublicTable'
class EntryAexit extends Component {
    constructor(props){
        super(props);
        this.state = {
            rightTags: [],
            selectedRowKeys:[],
            selectedRows:[],
            pageSize:10,
            currentPageNum:1,
            total:'',
            search:"",
            type:'', //进退场类别
            peoEntryType:'', //人员类型
            status:'', //状态
            startTime:'',//开始时间
            endTime:'',//结束时间
            projectName:'', //项目名称
            sectionId:'',
            code:"" ,//编号
            permission:[]
        }
    }
    /**
        * 父组件即可调用子组件方法
        * @method
        * @description 获取用户列表、或者根据搜索值获取用户列表
        * @param {string} record  行数据
        * @return {array} 返回选中用户列表
        */
      onRef = (ref) => {
        this.table = ref
    }
    /**
     * 获取复选框 选中项、选中行数据
     * @method updateSuccess
     * @param {string} selectedRowKeys 复选框选中项
     * @param {string} selectedRows  行数据
     */
    getSelectedRowKeys = (selectedRowKeys, selectedRows) => {
        this.setState({
            selectedRows,
            selectedRowKeys
        })
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
    getList= (currentPageNum, pageSize, callBack) =>{
      axios.get(getPeopleEntryList(pageSize,currentPageNum)+`?projectId=${this.state.projectId}&sectionIds=${this.state.sectionId}&type=${this.state.type}&peoEntryType=${this.state.peoEntryType}&status=${this.state.status}&startTime=${this.state.startTime}&endTime=${this.state.endTime}&code=${this.state.code}`).then(res=>{
        callBack(!res.data.data ?[]: res.data.data)
          let data = res.data.data;
          this.setState({
              data,
              total: res.data.total,
              rightData: null,
              selectedRowKeys: [],
          })
      })
    }
    componentDidMount(){
      // let menuCode = 'STAFF-ENTRYAEXIT'
      // axios.get(getPermission(menuCode)).then((res)=>{
      //   let permission = []
      //   res.data.data.map((item,index)=>{
      //     permission.push(item.code)
      //   })
      //   this.setState({
      //     permission
      //   })
      // })
      permissionFun(this.props.menuInfo.menuCode).then(res=>{
        this.setState({
            permission:!res.permission?[]:res.permission
        })
      });
      firstLoad().then(res=>{
        this.setState({
            projectId:res.projectId,
            projectName:res.projectName,
            sectionId:res.sectionId
        })
      })
    }
    // 新增回调
    addSuccess = (value,type)=>{
        this.table.recoveryPage(1);
        this.table.getData();
    }
    // 删除回调
    delSuccess = (del) =>{
      // const {total,selectedRows,pageSize,currentPageNum,type,peoEntryType,status,startTime,endTime,code} = this.state
      // let totalPageNum = Math.ceil((total - del.length) / pageSize);        //计算总页数
      // let PageNum = totalPageNum >= currentPageNum ? currentPageNum : totalPageNum   //总页数大于等于 当前页面，当前页数不变 否则 为1
      // this.setState({
      //     selectedRows:[],
      //     currentPageNum:PageNum,
      //     activeIndex:null,
      //     record: null,
      //     rightData: null
      // },()=>{
      //     this.getList(this.state.projectId,this.state.sectionId,type,peoEntryType,status,startTime,endTime,code);
      // })
      this.table.getData();
    }
    // 搜索
    search = (val,type) =>{
      if(this.state.projectId){
        this.table.recoveryPage(1);
        if(type == 'Code'){
          this.setState({
            code:!val.code?'':val.code,
            // currentPageNum:1
          },()=>{
            this.table.getData();
            // this.getList(this.state.projectId,this.state.sectionId,this.state.type,this.state.peoEntryType,this.state.status,this.state.startTime,this.state.endTime,val.code)
          })
        }else{
          this.setState({
            type:!val.type?'':val.type,
            peoEntryType:!val.peoEntryType?'':val.peoEntryType,
            status:!val.status?'':val.status,
            startTime:!val.startTime?'':val.startTime,
            endTime:!val.endTime?'':val.endTime,
            code:!val.code?'':val.code,
            // currentPageNum:1
          },()=>{
            this.table.getData();
            // this.getList(this.state.projectId,this.state.sectionId,this.state.type,this.state.peoEntryType,this.state.status,this.state.startTime,this.state.endTime,this.state.code);
          })
        }
       
      }else{
        notification.warning(
          {
              placement: 'bottomRight',
              bottom: 50,
              duration: 1,
              message: '警告',
              description: '请选择项目'
          }
        )
        return
      }
    }
    // 选择项目
    openPro = (data1,data2,projectName) =>{
        !this.state.projectId?'':this.table.recoveryPage(1);
        this.setState({
          projectId:data1[0],
          projectName,
        },()=>{
          this.table.getData();
        })
    }
    // 选择标段
    openSection=(sectionId,section)=>{
      this.table.recoveryPage(1);
      const {projectId} = this.state;
      this.setState({
        sectionId:sectionId,
        section:section,
      },()=>{
        this.table.getData();
      })
    }
    // 更新回调
    updateSuccess = (v) =>{
        this.table.update(this.state.rightData, v)
    }
    //新增人员回调
    addPerson = (v) => {
      // const {projectId,sectionId,type,peoEntryType,status,startTime,endTime,code} = this.state;
      // this.getList(projectId,sectionId,type,peoEntryType,status,startTime,endTime,code);
      // this.table.recoveryPage(1);
      this.table.getData();
    }
    //发布流程回调
    updateFlow = (v)=>{
      // const {projectId,sectionId,type,peoEntryType,status,startTime,endTime,code} = this.state;
      // this.getList(projectId,sectionId,type,peoEntryType,status,startTime,endTime,code);
      this.table.getData();
    }
    render(){
        const { data, rightTags,itemMaps } = this.state;
        const { height, record } = this.props;
        const { intl } = this.props.currentLocale;
        const columns = [
            {
                title: '编号',
                dataIndex: 'code',
                key: 'code',
                sorter: (a, b) => a.code - b.code,
            },
            // {
            //     title:'项目名称',
            //     dataIndex: 'projectName',
            //     key: 'projectName',
            // },
            {
              title: '标段号',
              dataIndex: 'sectionCode',
              key: 'sectionCode',
            },
            {
                title: '标段名称',
                dataIndex: 'sectionName',
                key: 'sectionName',
            },           
            {
                title:'单位名称',
                dataIndex: 'orgName',
                key: 'orgName',
            },
            {
                title: '类别',
                dataIndex: 'typeVo.name',
                key: 'typeVo.name',
            },
            {
                title:'人员分类',
                dataIndex: 'peoEntryTypeVo.name',
                key: 'peoEntryTypeVo.name',
            },
            {
                title: '人数',
                dataIndex: 'peoNums',
                key: 'peoNums',
            },
            {
                title: '进退场日期',
                dataIndex: 'entryTime',
                key: 'entryTime',
                render:(text,record)=>{
                  return <span>{dataUtil.Dates().formatTimeString(text).substr(0,10)}</span>
              }
            },            
            {
                title:'状态',
                dataIndex: 'statusVo.name',
                key: 'statusVo.name',
            },
            {
              title:'创建人',
              dataIndex: 'creater',
              key: 'creater',
            },
            {
              title:'创建日期',
              dataIndex: 'createTime',
              key: 'createTime',
              render:(text,record)=>{
                return <span>{dataUtil.Dates().formatTimeString(text).substr(0,10)}</span>
              }
            }
        ];
        const {projectId,sectionId,type,peoEntryType,status,startTime,endTime,code} = this.state;
        let pagination = {
            total: this.state.total,
            // hideOnSinglePage: true,
            current: this.state.currentPageNum,
            pageSize: this.state.pageSize,
            showSizeChanger: true,
            size:"small",
            showQuickJumper: true,
            showTotal: total => `总共${this.state.total}条`,
            onShowSizeChange: (current, size) => {
              this.setState({
                pageSize: size,
                currentPageNum: 1
              }, () => {
                this.getList(projectId,sectionId,type,peoEntryType,status,startTime,endTime,code);
              })
            },
            onChange: (page, pageSize) => {
              this.setState({
                currentPageNum: page
              }, () => {
                this.getList(projectId,sectionId,type,peoEntryType,status,startTime,endTime,code);
              })
            }
        }
        let { selectedRowKeys,selectedRows} = this.state;
        const rowSelection = {
            selectedRowKeys,
            selectedRows,
            onChange: (selectedRowKeys, selectedRows) => {
              this.setState({
                selectedRowKeys,
                selectedRows
              })
            }
        };
        return(
          <ExtLayout renderWidth={({ contentWidth }) => { this.setState({ contentWidth }) }}>
              <Toolbar>
                  <TopTags
                      projectName = {this.state.projectName}
                      record={this.state.record}
                      selectedRows={this.state.selectedRows}
                      success={this.addSuccess}
                      delSuccess={this.delSuccess}
                      search={this.search}
                      openPro={this.openPro}
                      openSection={this.openSection}
                      data1={this.state.projectId}
                      sectionId = {this.state.sectionId}
                      type = {this.state.type}
                      peoEntryType = {this.state.peoEntryType}
                      status = {this.state.status}
                      startTime = {this.state.startTime}
                      endTime = {this.state.endTime}
                      rightData={this.state.rightData}
                      updateFlow = {this.updateFlow}
                      permission={this.state.permission}
                      rightData={this.state.rightData}
                      bizType={this.props.menuInfo.menuCode}
                      />
              </Toolbar>
              <MainContent contentWidth={this.state.contentWidth} contentMinWidth={1100}>
              {this.state.projectId && (
                <PublicTable onRef={this.onRef}
                            pagination={true}
                            getData={this.getList}
                            columns={columns}
                            rowSelection={true}
                            onChangeCheckBox={this.getSelectedRowKeys}
                            useCheckBox={true} 
                            getRowData={this.getInfo}
                            total={this.state.total}
                            pageSize={10}
                            />
                    
              )}
              </MainContent>
              <RightTags
                    addPerson={this.addPerson}
                    rightTagList={rightTags}
                    rightData={this.state.rightData}
                    itemMaps = {itemMaps}
                    updateSuccess={this.updateSuccess}
                    menuCode = {this.props.menuInfo.menuCode}
                    groupCode={1}
                    projectId={this.state.projectId}
                    sectionId={this.state.sectionId}
                    menuId = {this.props.menuInfo.id}
                    bizType={this.props.menuInfo.menuCode}
                    bizId = {this.state.rightData ? this.state.rightData.id : null}
                    fileEditAuth={true}
                    extInfo={{
                        startContent: "人员进退场"
                    }}
                    taskFlag = {false}
                    isCheckWf={true}  //流程查看
                    openWorkFlowMenu = {this.props.openWorkFlowMenu}
                    isShow={this.state.permission.indexOf('ENTRYAEXIT_EDIT-FILE-ENTRY')==-1?false:true} //文件权限
                    permission={this.state.permission}
                    />
          </ExtLayout>
        )
    }
}
export default connect(state => ({
    currentLocale: state.localeProviderData
}), {
        changeLocaleProvider
    })(EntryAexit);