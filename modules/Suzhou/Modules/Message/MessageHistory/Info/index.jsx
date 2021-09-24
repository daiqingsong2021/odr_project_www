import React, { Component } from 'react'
import { Table, notification } from 'antd'
import style from './style.less'
import { connect } from 'react-redux'
import { changeLocaleProvider } from '@/store/localeProvider/action'
// import RightTags from '@/modules/Suzhou/components/RightTags/index';
import * as util from '@/utils/util';
import * as dataUtil from '@/utils/dataUtil';
import { getSmsHistoryDetailsList } from '@/modules/Suzhou/api/suzhou-api';
import axios from '@/api/axios';
import TopTags from './TopTags/index';
import notificationFun from '@/utils/notificationTip';
//二级页面
// import EnergyInfo from './Info/index'
// 布局
import ExtLayout from "@/components/public/Layout/ExtLayout";
import MainContent from "@/components/public/Layout/MainContent";
import Toolbar from "@/components/public/Layout/Toolbar";
import PublicTable from '@/components/PublicTable'
import { firstLoad } from "@/modules/Suzhou/components/Util/firstLoad";
import { isChina, columnsCreat, permissionFun,setRightShow } from "@/modules/Suzhou/components/Util/util.js";

class Energy extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedRowKeys: [],
            pageSize: 10,
            currentPageNum: 1,
            total: '',
            selectedRows: [],
            data: [],
            activeIndex: null,
            status: '', //状态
            EnergyInfoShow: false,   //show详情页
            record: {},
            startTime:'' ,  //查询开始日期
            endTime:'', //查询结束日期
            line:'',    //线路
            permission:[],  //权限
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
    //获取复选框 选中项、选中行数据
    getSelectedRowKeys = (selectedRowKeys, selectedRows) => {
        this.setState({
            selectedRows,
            selectedRowKeys
        })
    }
    //获取点击行数据
    getInfo = (record) => {
        const { activeIndex } = this.state;
        const { id } = record;
        this.setState({
            activeIndex: id,
            record: record,
            rightData: record
        });
    }
    //获取主列表数据
    getList = (currentPageNum, pageSize, callBack) => {
        const { searcher,sendStatus,receiveStatus } = this.state
        const taskId =  this.props.rightData.id
        axios.get(getSmsHistoryDetailsList(pageSize, currentPageNum), { params: { taskId,searcher,sendStatus,receiveStatus} }).then(res => {
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
    componentDidMount() {
    }
    //搜索
    search = (searcher,sendStatus,receiveStatus) => {
        this.setState({
            searcher,
            sendStatus,
            receiveStatus,
        }, () => {
            this.table.getData();
        })
    }
    //设置table的选中行class样式
    setClassName = (record, index) => {
        return record.id === this.state.activeIndex ? 'tableActivty' : '';
    };
         //关闭详情页刷新列表
    closeInfo =() =>{
        this.table.getData();
    }
    render() {
        const columns = [
            {
                title: '发送账号',
                dataIndex: 'smsSendNumber',
                key: 'smsSendNumber',
                render: (text, record) => {
                    return <span>{text?text:''}</span>
                }
            },
            {
                title: '接收账号',
                dataIndex: 'targetNumber',
                key: 'targetNumber',
                render: (text, record) => {
                    return <span >{text?text:''}</span>
                }
            },
            {
                title: '发送状态',
                dataIndex: 'sendStatusStr',
                key: 'sendStatusStr',
                render: (text, record) => {
                    return <span >{text?text:''}</span>
                }
            },
            {
                title: '接收状态',
                dataIndex: 'receiveStatusStr',
                key: 'receiveStatusStr',
                render: (text, record) => {
                    return <span style={record.receiveStatusStr&&record.receiveStatusStr=='失败'?{color: 'rgb(217,0,27)', cursor: 'pointer'}:{}}>{text?text:''}</span>
                }
            },
            {
                title: '发送时间',
                dataIndex: 'smsSendTime',
                key: 'smsSendTime',
                render: (text, record) => {
                    return <span >{text?text:''}</span>
                }
            },
        ];
        const { EnergyInfoShow, permission,record } = this.state
        return (
            <ExtLayout renderWidth={({ contentWidth }) => { this.setState({ contentWidth }) }}>
                <Toolbar>
                    <TopTags
                        record={this.state.record}
                        selectedRows={this.state.selectedRows}
                        search={this.search}
                        searcher={this.state.search}
                    />
                </Toolbar>
                <MainContent contentWidth={this.state.contentWidth} contentMinWidth={1100}>
                    <PublicTable onRef={this.onRef}
                        pagination={true}
                        getData={this.getList}
                        columns={columns}
                        rowSelection={true}
                        onChangeCheckBox={this.getSelectedRowKeys}
                        useCheckBox={false}
                        getRowData={this.getInfo}
                        total={this.state.total}
                        pageSize={10}
                    />
                </MainContent>

            </ExtLayout>
        )
    }
}
export default connect(state => ({
    currentLocale: state.localeProviderData
}), {
    changeLocaleProvider
})(Energy);