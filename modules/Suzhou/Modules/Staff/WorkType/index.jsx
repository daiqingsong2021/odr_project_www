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
import {getBaseSelectTree,getCertGlList,getPermission} from '../../../api/suzhou-api';
import axios from '../../../../../api/axios';
import MyIcon from "../../../../../components/public/TopTags/MyIcon";
import TopTags from './TopTags/index';
// 布局
import ExtLayout from "@/components/public/Layout/ExtLayout";
import MainContent from "@/components/public/Layout/MainContent";
import Toolbar from "@/components/public/Layout/Toolbar";
import PublicTable from '@/components/PublicTable'
import {firstLoad} from "@/modules/Suzhou/components/Util/firstLoad";
import {isChina,permissionFun} from "@/modules/Suzhou/components/Util/util.js";

class WorkType extends Component {
    constructor(props){
        super(props);
        this.state={
            projectId:"",
            search:"",
            selectedRowKeys:[],
            selectedRows:[],
            total:'',
            data:[],
            pageSize:10,
            currentPageNum:1,
            projectName:"",
            certName:'',
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
        axios.get(getCertGlList(pageSize,currentPageNum)+`?projectId=${this.state.projectId}&certName=${this.state.certName}`).then(res=>{
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
        // let menuCode = 'STAFF-WORKTYPE'
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
    // 搜索
    search = (val)=>{
        this.table.recoveryPage(1);
        this.setState({
            certName: isChina(val)
        }, () => {
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
                return 
            }else{
                this.table.getData();
            }
        })
    }
    // 新增
    addSuccess = (values,type)=>{
        this.table.recoveryPage(1);
        this.table.getData();
    }
    // 删除回调
    delSuccess = () =>{
        this.table.getData();
    }
    updateSuccess = (v) => {
        this.table.update(this.state.rightData, v)
    };
    // 选择项目
    openPro = (data1,data2,projectName) =>{
        this.table.recoveryPage(1);
        this.setState({
            projectId:data1[0],
            projectName
        },()=>{
            this.table.getData()
        })
    }
    //设置table的选中行class样式
    setClassName = (record, index) => {
        return record.id === this.state.activeIndex ? 'tableActivty' : '';
    };
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
    render(){
        const { data, rightTags,itemMaps } = this.state;
        const {record } = this.props;
        const columns = [
            {
                title: '证书名称',
                dataIndex: 'certName',
                key: 'certName',
            },
            {
                title: '查询网址',
                dataIndex: 'certVerifyUrl',
                key: 'certVerifyUrl',
                render:(text,record) =>{
                    const url = `http://${text}`;
                    return <a target="_blank" href= {url}>{text}</a>
                }
            },
          {
            title: '提前预警天数',
            dataIndex: 'warnPeriod',
            key: 'warnPeriod',
          },
        ];
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
                        selectedRows={this.state.selectedRows}
                        success={this.addSuccess}
                        delSuccess={this.delSuccess}
                        search={this.search}
                        openPro={this.openPro}
                        data1={this.state.projectId}
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
                    menuCode = {this.props.menuInfo.menuCode}
                    updateSuccess={this.updateSuccess}
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
    })(WorkType);