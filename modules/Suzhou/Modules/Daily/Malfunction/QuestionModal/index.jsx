import React, { Component } from 'react';
import SubTopTags from "./SubTopTags"
import DealDetail from "../DealDetail"
import axios from '@/api/axios';
import {faultDailyProblemPageList} from '@/modules/Suzhou/api/suzhou-api';
import AddModal from './AddModal';
import QuesAdd from "./QuesAdd"
// 布局
import ExtLayout from "@/components/public/Layout/ExtLayout";
import MainContent from "@/components/public/Layout/MainContent";
import Toolbar from "@/components/public/Layout/Toolbar";
import PublicTable from '@/components/PublicTable'
import { Tooltip } from 'antd';
export class QuestionModal extends Component{
    constructor(props){
        super(props);
        this.state={
            total:0,
            selectedRows:[],
            selectedRowKeys:[],
            dealDetailVisible:false,//处理详情
            addModal:false,
            quesAdd:false
        }
    }
    componentDidMount(){

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
    //获取复选框 选中项、选中行数据
    getSelectedRowKeys = (selectedRowKeys, selectedRows) => {
        this.setState({
            selectedRows,
            selectedRowKeys
        })
    }
    getInfo = (record) => {
        const { activeIndex } = this.state;
        const { id } = record;
        this.setState({
            activeIndex: id,
            record: record,
        });
    }
    getList = (currentPageNum, pageSize, callBack) => {
        axios.get(faultDailyProblemPageList(pageSize, currentPageNum)+`?faultId=${this.props.addInfo.id}`).then(res => {
            callBack(res.data.data ? res.data.data : [])
            let data = res.data.data;
            this.setState({
                data,
                total: res.data.total,
                record: null,
                selectedRowKeys: [],
            })
        })
    }
    //新增回调
    addSuccess=()=>{
        this.table.recoveryPage(1)
        this.table.getData();
    }
    //修改回调
    updateSuccess=(val)=>{
        this.table.update(this.state.record, val)
    }
    //删除
    delSuccess=()=>{
        this.table.getData();
    }
    //查看
    viewDetail=(record)=>{
        this.setState({
            dealDetailVisible:true,
            record:record
        })
    }
    //关闭查看
    cancelDealDetail=()=>{
        this.setState({
            dealDetailVisible:false
        })
    }
    //新增
    addDetail=()=>{
        this.setState({
            title:'新增',
            type:'add',
            addModal:true
        })
    }
    //
    handleCancel=()=>{
        this.setState({
            addModal:false 
        })
    }
    openQuesAdd = (record) => {
        this.setState({
            record:record,
            quesAdd:true,
            title:'修改',
            type:'modify'
        })
    }
    cancelQuestion=()=>{
        this.setState({
            quesAdd:false
        })
    }
    render(){
        const columns=[
            {
                title: '故障描述',
                dataIndex: 'problemDesc',
                key: 'problemDesc',
                ellipsis: true,
                render: (text, record) => {
                return (
                    <Tooltip title={text}>
                        <div className="ellipsis" style={{ float: 'left', maxWidth: '100%' }} onClick={this.openQuesAdd.bind(this,record)}>
                            <a>{text.substring(0,50)}</a>
                        </div>
                    </Tooltip>
                );
               },
            },
            {
                title: '记录人',
                dataIndex: 'recorderName',
                key: 'recorderName',
                
            },
            {
                title: '记录时间',
                dataIndex: 'recordTime',
                key: 'recordTime',
            },
            {
                title: '故障状态',
                dataIndex: 'problemStatusDesc',
                key: 'problemStatusDesc',
            },
            // {
            //     title: '处理详情',
            //     dataIndex: 'detail',
            //     key: 'detail',
            //     render:(text,record)=>{
            //         return(
            //             <div>
            //                <a onClick={this.viewDetail.bind(this,record)}>查看</a>&nbsp;&nbsp;
            //                <a onClick={this.addDetail.bind(this,record)}>新增</a>
            //             </div>
            //         )
            //     }
            // },
        ]
        return(
                <ExtLayout renderWidth={({ contentWidth }) => { this.setState({ contentWidth }) }}>
                    <Toolbar>
                        <SubTopTags
                            record={this.state.record}
                            selectedRows={this.state.selectedRows}
                            selectedRowKeys={this.state.selectedRowKeys}
                            modifyDisabled={this.props.modifyDisabled}
                            addSuccess = {this.addSuccess}
                            updateSuccess={this.updateSuccess}
                            delSuccess={this.delSuccess}
                            addInfo={this.props.addInfo}
                        />
                    </Toolbar>
                    <MainContent contentWidth={this.state.contentWidth} contentMinWidth={1100}>
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
                    </MainContent>
                    {this.state.dealDetailVisible &&(
                        <DealDetail 
                            modalVisible = {this.state.dealDetailVisible}
                            handleCancel={this.cancelDealDetail}
                            problemInfo = {this.state.record}
                            addInfo={this.props.addInfo}
                            modifyDisabled={this.props.modifyDisabled}
                            />
                    )}
                    {this.state.addModal && (
                        <AddModal 
                            modalVisible = {this.state.addModal} 
                            title={this.state.title}
                            type={this.state.type}
                            addSuccess={this.addSuccess}
                            record={this.props.record}
                            handleCancel={this.handleCancel}
                            delSuccess={this.props.delSuccess}
                            problemInfo = {this.state.record}
                            />
                    )}
                    {this.state.quesAdd && (
                    <QuesAdd 
                        modalVisible = {this.state.quesAdd} 
                        title={this.state.title} 
                        type={this.state.type}
                        addSuccess={this.addSuccess}
                        record={this.state.record}
                        addInfo={this.props.addInfo}
                        handleCancel={this.cancelQuestion}
                        updateSuccess={this.updateSuccess}
                        delSuccess={this.delSuccess}
                        />
                )}
                </ExtLayout>
        )
    }
}
export default QuestionModal;