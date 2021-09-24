import React, { Component } from 'react'
import { Table, notification } from 'antd'
import style from './style.less'
import { connect } from 'react-redux'
import { changeLocaleProvider } from '../../../../../store/localeProvider/action'
import RightTags from '../../../../../components/public/RightTags/index'
import * as util from '../../../../../utils/util';
import * as dataUtil from '../../../../../utils/dataUtil';
import Release from "../../../../Components/Release"
import TipModal from "../../../../Components/TipModal"
import {getBaseSelectTree, prepaProjectteamAdd,getPeopleChangeList,getsectionId,getPermission,getPeopleChangeWord} from '../../../api/suzhou-api';
import axios from '../../../../../api/axios';
import MyIcon from "../../../../../components/public/TopTags/MyIcon";
import { docFileInfo } from '@/api/api';
import TopTags from './TopTags/index';
import {firstLoad} from "@/modules/Suzhou/components/Util/firstLoad";
import {isChina,permissionFun} from "@/modules/Suzhou/components/Util/util.js";
// 布局
import ExtLayout from "@/components/public/Layout/ExtLayout";
import MainContent from "@/components/public/Layout/MainContent";
import Toolbar from "@/components/public/Layout/Toolbar";
import PublicTable from '@/components/PublicTable'

class SpecialType extends Component {
    constructor(props){
        super(props);
        this.state = {
            rightTags: [],
            selectedRowKeys:[],
            selectedRows:[],
            pageSize:10,
            currentPageNum:1,
            total:'',
            projectId:"",
            sectionId:"",
            search:"",
            projectName:'', //项目名称
            status:'', //状态
            selectStatus:'',
            permission:[],
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
    // getList = (projectId,sectionIds,searcher,status)=>{
    //     axios.get(getPeopleChangeList(this.state.pageSize,this.state.currentPageNum)+`?projectId=${projectId}&sectionIds=${sectionIds}&searcher=${searcher}&status=${status}`).then(res => {
    //         const dataMap = util.dataMap(res.data.data);
    //         var maps = new Object();
    //         // this.getMaps(res.data,maps);
    //         this.setState({
    //             total:res.data.total,
    //           data: res.data.data,
    //           dataMap:dataMap
    //           // itemMaps:maps
    //         });
    //     });
    // }
    // getMaps = (dats,maps) => {
    //     if(dats){
    //       dats.forEach((item,index,arr) => {
    //         maps[item.id] = item;
    //         this.getMaps(item.children,maps);
    //       })
    //     }
    // }
    getList= (currentPageNum, pageSize, callBack) =>{
      axios.get(getPeopleChangeList(pageSize,currentPageNum)+`?projectId=${this.state.projectId}&sectionIds=${this.state.sectionId}&searcher=${this.state.search}&status=${this.state.status}`).then(res=>{
          callBack(res.data.data ? res.data.data : [])
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
      // let menuCode = 'STAFF-CHANGE'
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
      // const {total,selectedRows,pageSize,currentPageNum} = this.state
      // let totalPageNum = Math.ceil((total - del.length) / pageSize);        //计算总页数
      // let PageNum = totalPageNum >= currentPageNum ? currentPageNum : totalPageNum   //总页数大于等于 当前页面，当前页数不变 否则 为1
      // this.setState({
      //     selectedRows:[],
      //     currentPageNum:PageNum,
      //     activeIndex:null,
      //     record: null,
      //     rightData: null
      // },()=>{
      //     this.getList(this.state.projectId,this.state.sectionId,this.state.search,this.state.status);
      // })
      this.table.getData();
    }
    //状态
    selectStatue = (val)=>{
      this.setState({
        selectStatus:!val?'':val
      })
    }
    // 搜索
    search = (val) =>{
        this.state.projectId?this.table.recoveryPage(1):'';
        const {selectStatus} = this.state;
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
          this.setState({
            search:isChina(val),
            status:selectStatus,
          },()=>{
            this.table.getData();
            // this.getList(this.state.projectId,this.state.sectionId,isChina(val),selectStatus);
          })
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
    getIds = (dats,idArr) => {
      if(dats){
        dats.forEach((item,index,arr) => {
          idArr.push(item.id);
          this.getIds(item.children,idArr)
        });
      }
    };
    // 选择标段
    openSection=(sectionId,section)=>{
      this.table.recoveryPage(1);
      const {projectId} = this.state;
      this.setState({
        sectionId:sectionId,
        section:section
      },()=>{
        this.table.getData();
      })
    }
    // 更新回调
    updateSuccess = (v) =>{
        this.table.update(this.state.rightData, v)
    }
    //发布流程回调
    updateFlow = (v)=>{
      // const {projectId,sectionId,search,status} = this.state;
      // this.getList(projectId,sectionId,search,status);
      this.table.getData();
    }
      //点击显示查看
    viewDetail = (record) => {
      axios.view(getPeopleChangeWord+`?id=${record.id}`).then(res=>{})
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
              title: '变更日期',
              dataIndex: 'changeTime',
              key: 'changeTime',
            },
            {
                title: '变更单位',
                dataIndex: 'orgName',
                key: 'orgName',
            },
            {
                title:'被更前人员',
                dataIndex: 'bchanger',
                key: 'bchanger',
            },
            {
                title: '变更职务',
                dataIndex: 'changeGw',
                key: 'changeGw',
            },
            {
                title: '变更后人员',
                dataIndex: 'achanger',
                key: 'achanger',
            },
            // {
            //     title:'合同编号',
            //     dataIndex: 'contractNumber',
            //     key: 'contractNumber',
            // },
            {
                title:'状态',
                dataIndex: 'statusVo.name',
                key: 'statusVo.name',
            },
            {
              title: "创建人",
              dataIndex: 'creater',
              key: 'creater',
            },
            {
                title: "创建日期",
                dataIndex: 'createTime',
                key: 'createTime',        
            },
            {
              title: "审批预览",
              width: 80,
              render: (text, record) => {
                return <a onClick={this.viewDetail.bind(this, record)} style={{ cursor: 'pointer' }}>预览</a>
              }
            }
        ];
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
                this.getList(this.state.projectId,this.state.sectionId,this.state.search,this.state.status);
              })
            },
            onChange: (page, pageSize) => {
              this.setState({
                currentPageNum: page
              }, () => {
                this.getList(this.state.projectId,this.state.sectionId,this.state.search,this.state.status);
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
          <ExtLayout renderWidth={({ contentWidth }) => { this.setState({ contentWidth }) }}>
            <Toolbar>
                <TopTags
                  projectName = {this.state.projectName}
                  record={this.state.record}
                  success={this.addSuccess}
                  delSuccess={this.delSuccess}
                  search={this.search}
                  selectStatue = {this.selectStatue}
                  openPro={this.openPro}
                  openSection={this.openSection}
                  data1={this.state.projectId}
                  sectionId = {this.state.sectionId}
                  selectedRows={this.state.selectedRows}
                  updateFlow = {this.updateFlow}
                  searcher = {this.state.search}
                  bizType={this.props.menuInfo.menuCode}
                  permission={this.state.permission}
                  rightData={this.state.rightData}
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
                        startContent: "人员变更"
                    }}
                    taskFlag = {false}
                    isCheckWf={true}  //流程查看
                    openWorkFlowMenu = {this.props.openWorkFlowMenu}
                    isShow={this.state.permission.indexOf('CHANGE_EDIT-FILE-CHANGE')==-1?false:true} //文件权限
                    permission={this.state.permission}
                    />
          </ExtLayout>)
    }
}
export default connect(state => ({
    currentLocale: state.localeProviderData
}), {
        changeLocaleProvider
    })(SpecialType);