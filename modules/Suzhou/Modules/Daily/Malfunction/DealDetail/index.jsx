import React, { Component } from 'react';
import {Modal} from 'antd'
import style from './style.less'
import TopTags from "./TopTags"
import axios from '@/api/axios';
import {faultDailyProblemDealPageList} from '@/modules/Suzhou/api/suzhou-api';
import { Tooltip } from 'antd';
// 布局
import ExtLayout from "@/components/public/Layout/ExtLayout";
import MainContent from "@/components/public/Layout/MainContent";
import Toolbar from "@/components/public/Layout/Toolbar";
import PublicTable from '@/components/PublicTable'
export class DealDetail extends Component{
    constructor(props){
        super(props);
        this.state={
            total:0,
            selectedRows:[],
            selectedRowKeys:[],
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
        axios.get(faultDailyProblemDealPageList(pageSize, currentPageNum)+`?problemId=${this.props.problemInfo.id}`).then(res => {
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
    //删除
    delSuccess=()=>{
        this.table.getData();
    }
    render(){
        const columns=[
            {
                title: '处理详情',
                dataIndex: 'dealDetail',
                key: 'dealDetail',
                render: (text, record) => {
                    return (
                        <Tooltip title={text}>
                            <div className="ellipsis" style={{ float: 'left', maxWidth: '100%' }}>
                                {text.substring(0, 10)}
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
        ]
        return(
            <Modal className={style.main}
                width="850px"
                mask={false}
                maskClosable={false}
                footer={null}
                centered={true} title={'处理详情'} visible={this.props.modalVisible}
                onCancel={this.props.handleCancel}>
                    <ExtLayout renderWidth={({ contentWidth }) => { this.setState({ contentWidth }) }}>
                        <Toolbar>
                            <TopTags
                                record={this.state.record}
                                selectedRows={this.state.selectedRows}
                                selectedRowKeys={this.state.selectedRowKeys}
                                // addSuccess = {this.addSuccess}
                                delSuccess={this.delSuccess}
                                problemInfo={this.props.problemInfo}
                                addInfo={this.props.addInfo}
                                modifyDisabled={this.props.modifyDisabled}
                            />
                        </Toolbar>
                        <MainContent contentWidth={850} contentMinWidth={700}>
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
                    </ExtLayout>
            </Modal>
        )
    }
}
export default DealDetail;