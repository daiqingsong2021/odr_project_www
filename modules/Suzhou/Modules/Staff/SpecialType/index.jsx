import React, { Component } from 'react'
import { Table, notification } from 'antd'
import style from './style.less'
import { connect } from 'react-redux'
import { changeLocaleProvider } from '../../../../../store/localeProvider/action'
import RightTags from '../../../../../components/public/RightTags/index'
import * as util from '../../../../../utils/util';
import * as dataUtil from '../../../../../utils/dataUtil';
import {getSpecialWorkerList,getPermission} from '../../../api/suzhou-api';
import axios from '../../../../../api/axios';
import TopTags from './TopTags/index';
// 布局
import ExtLayout from "@/components/public/Layout/ExtLayout";
import MainContent from "@/components/public/Layout/MainContent";
import Toolbar from "@/components/public/Layout/Toolbar";
import PublicTable from '@/components/PublicTable'
import {firstLoad} from "@/modules/Suzhou/components/Util/firstLoad";
import {isChina,permissionFun} from "@/modules/Suzhou/components/Util/util.js";

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
            projectName:"",
            status:'', //状态
            selectStatus:'',
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
        axios.get(getSpecialWorkerList(pageSize,currentPageNum)+`?projectId=${this.state.projectId}&sectionIds=${this.state.sectionId}&searcher=${this.state.search}&status=${this.state.status}`).then(res=>{
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
        // let menuCode = 'STAFF-SPECIALTYPE'
        // axios.get(getPermission(menuCode)).then((res)=>{
        //     let permission = []
        //     res.data.data.map((item,index)=>{
        //         permission.push(item.code)
        //     })
        //     this.setState({
        //         permission
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
        this.table.recoveryPage(1);
        this.table.getData();
    }
    // 删除回调
    delSuccess = (del) =>{
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
        this.setState({
            search:isChina(val),
            status:selectStatus
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
                this.table.getData();
            }
        })
        
    }
    // 选择项目
    openPro = (data1,data2,projectName) =>{
        !this.state.projectId?'':this.table.recoveryPage(1);
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
        this.table.getData();
    }
    //设置table的选中行class样式
    setClassName = (record, index) => {
        return record.id === this.state.activeIndex ? 'tableActivty' : '';
    };
    render(){
        const { data, rightTags,itemMaps } = this.state;
        const { record } = this.props;
        const columns = [
            {
                title: '姓名',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title:'单位',
                dataIndex: 'orgName',
                key: 'orgName',
            },
            {
                title: '联系方式',
                dataIndex: 'telPhone',
                key: 'telPhone',
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
                title: '工种类型',
                dataIndex: 'workTypeVoList',
                key: 'workTypeVoList',
                render:(text,record)=>{
                    const arr = [];
                    text.map((item)=>{
                        return arr.push(item.name)
                    })
                    return arr.join();
                }
            },
            {
                title:'证书预警数',
                dataIndex: 'warnNums',
                key: 'warnNums',
            },
            {
                title:'证书过期数',
                dataIndex: 'ddateNums',
                key: 'ddateNums',
            },
            {
                title:'状态',
                dataIndex: 'statusVo.name',
                key: 'statusVo.name',
            },
            {
                title:'人员状态',
                dataIndex: 'peoStatusVo.name',
                key: 'peoStatusVo.name',
            }
        ];
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
                        selectStatue = {this.selectStatue}
                        openPro={this.openPro}
                        openSection={this.openSection}
                        data1={this.state.projectId}
                        sectionId = {this.state.sectionId}
                        updateFlow = {this.updateFlow}
                        searcher = {this.state.search}
                        bizType={this.props.menuInfo.menuCode}
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
                    bizType={this.props.menuInfo.menuCode}
                    projectId ={this.state.projectId}
                    groupCode={1}
                    taskFlag = {false}
                    isCheckWf={true}  //流程查看
                    openWorkFlowMenu = {this.props.openWorkFlowMenu}
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