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
import {getBaseSelectTree, prepaProjectteamAdd,getKqConfigList,getSpecialWorkerList,getPermission} from '../../../api/suzhou-api';
import axios from '../../../../../api/axios';
import MyIcon from "../../../../../components/public/TopTags/MyIcon";
import TopTags from './TopTags/index';
import {firstLoad} from "@/modules/Suzhou/components/Util/firstLoad";
import {permissionFun} from "@/modules/Suzhou/components/Util/util.js";

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
            pageSize:10,
            currentPageNum:1,
            total:'',
            selectedRows:[],
            projectId:'',
            sectionId:'',
            search:"",
            data:[],
            projectName:'', //项目名称
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
        axios.get(getKqConfigList(pageSize,currentPageNum)+`?projectId=${this.state.projectId}&sectionIds=${this.state.sectionId}`).then(res=>{
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
    // getList = (projectId,sectionIds)=>{
    //     axios.get(getKqConfigList(this.state.pageSize,this.state.currentPageNum)+`?projectId=${projectId}&sectionIds=${sectionIds}`).then(res => {
    //         const dataMap = util.dataMap(res.data.data);
    //         var maps = new Object();
    //         this.setState({
    //           data: res.data.data,
    //           dataMap:dataMap,
    //           total:res.data.total
    //         });
    //     });
    // }
    componentDidMount(){
        // let menuCode = 'STAFF-ATTENDANCESETTING'
        // axios.get(getPermission(menuCode)).then((res)=>{
        //     let permission = []
        //     res.data.data.map((item,index)=>{
        //     permission.push(item.code)
        //     })
        //     this.setState({
        //     permission
        //     })
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
        // this.setState({
        //     currentPageNum:1
        // },()=>{
        //     this.getList(this.state.projectId,this.state.sectionId);
        // })
        this.table.recoveryPage(1);
        this.table.getData();
    }
    // 删除回调
    delSuccess = () =>{
        // const {total,selectedRows,pageSize,currentPageNum} = this.state
        // let totalPageNum = Math.ceil((total - selectedRows.length) / pageSize);        //计算总页数
        // let PageNum = totalPageNum >= currentPageNum ? currentPageNum : totalPageNum   //总页数大于等于 当前页面，当前页数不变 否则 为1
        // this.setState({
        //     selectedRows:[],
        //     currentPageNum:PageNum,
        //     activeIndex:null,
        //     record: null,
        //     rightData: null
        // },()=>{
        //     this.getList(this.state.projectId,this.state.sectionId);
        // })
        this.table.getData();
    }
    // 选择项目
    openPro = (data1,data2,projectName) =>{
        this.setState({
            projectId:data1[0],
            projectName,
            sectionId:''
        },()=>{
            this.table.getData();
        })
    }
    // 选择标段
    openSection = (sectionId,section)=>{
        const {projectId} = this.state;
        this.setState({
            sectionId:sectionId,
            section:section,
            currentPageNum:1
        },()=>{
            // this.getList(projectId,sectionId);
            this.table.getData();
        })
    }
    // 更新回调
    updateSuccess = (v) =>{
        // this.getList(this.state.projectId,this.state.sectionId);
        this.table.update(this.state.rightData, v)
    }
    
    render(){
        const { data, rightTags,itemMaps } = this.state;
        const { height, record } = this.props;
        const { intl } = this.props.currentLocale;
        const columns = [
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
                title: '管理人员是否考勤',
                dataIndex: 'mangerKqVo.name',
                key: 'mangerKqVo.name',
            },
            {
                title: '劳务人员是否考勤',
                dataIndex: 'workerKqVo.name',
                key: 'workerKqVo.name',
            },
            {
                title:'考勤日历',
                dataIndex: 'calenderVo.name',
                key: 'calenderVo.name',
            },
            // {
            //     title: '请假原因',
            //     dataIndex: '',
            //     key: '',
            // },
            // {
            //     title: '请假人员',
            //     dataIndex: '',
            //     key: '',
            // },
            // {
            //     title:'状态',
            //     dataIndex: 'statusVo.name',
            //     key: 'statusVo.name',
            // }
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
                this.getList(this.state.projectId,this.state.sectionId);
              })
            },
            onChange: (page, pageSize) => {
              this.setState({
                currentPageNum: page
              }, () => {
                this.getList(this.state.projectId,this.state.sectionId);
              })
            }
          }
        let { selectedRowKeys,selectedRows} = this.state;
        const rowSelection = {
            selectedRows,
            selectedRowKeys,
            onChange: (selectedRowKeys,selectedRows) => {
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
                            permission={this.state.permission}
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
    })(SpecialType);