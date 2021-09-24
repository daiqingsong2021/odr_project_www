import React, { Component } from 'react'
import { Table, notification } from 'antd'
import style from './style.less'
import { connect } from 'react-redux'
import { changeLocaleProvider } from '@/store/localeProvider/action'
import RightTags from '@/modules/Suzhou/components/RightTags/index';
import * as util from '@/utils/util';
import * as dataUtil from '@/utils/dataUtil';
import { getSmsHistoryList } from '@/modules/Suzhou/api/suzhou-api';
import axios from '@/api/axios';
import TopTags from './TopTags/index';
import notificationFun from '@/utils/notificationTip';
// 布局
import ExtLayout from "@/components/public/Layout/ExtLayout";
import MainContent from "@/components/public/Layout/MainContent";
import Toolbar from "@/components/public/Layout/Toolbar";
import PublicTable from '@/components/PublicTable'
import { permissionFun, setRightShow } from "@/modules/Suzhou/components/Util/util.js";
import moment from "moment"
import { result } from 'lodash'

class History extends Component {
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
            record: {},
            startTime: '',  //查询开始日期
            endTime: '', //查询结束日期
            line: '',    //线路
            permission: [],  //权限
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
        const { searcher,smsTimeStartTmp,smsTimeEndTmp,seachStart,seachEnd,smsSendStatus } = this.state
        let smsTimeStart ;
        let smsTimeEnd ;
        if(!smsTimeStartTmp && !seachStart){
            //初始化进入页面时查询
            smsTimeStart = dataUtil.Dates().formatTimeString(moment(moment().subtract(7, 'days').format('YYYY-MM-DD'),'YYYY-MM-DD')).substr(0, 10) + ' 00:00:00'           
        }else{
            smsTimeStart = smsTimeStartTmp
        }
        if(!smsTimeEndTmp && !seachEnd){
            //初始化进入页面时查询
            smsTimeEnd = dataUtil.Dates().formatTimeString(moment(moment().format('YYYY-MM-DD'),'YYYY-MM-DD')).substr(0, 10) + ' 23:59:59'
        }else{
            smsTimeEnd = smsTimeEndTmp
        }
        axios.get(getSmsHistoryList(pageSize, currentPageNum), { params: { searcher,smsTimeStart,smsTimeEnd,smsSendStatus } }).then(res => {
            callBack(res.data.data ? res.data.data : [])
            let data = res.data.data;
            if (data) {
                data.forEach(item => {//方式-通道
                    item.sendPersonsendChannel = item.sendPersonStr + '-' + item.sendChannelStr;
                });
            }
            this.setState({
                data,
                total: res.data.total,
                rightData: null,
                selectedRowKeys: [],
            })
        })
    }
    componentDidMount() {
        permissionFun(this.props.menuInfo.menuCode).then(res => {
            this.setState({
                permission: !res.permission ? [] : res.permission
            })
        });
    }
    //删除回调
    delSuccess = (del) => {
        this.table.getData();
    }
    //发布回调
    approveSuccess = () => {
        this.table.getData();
    }
    //更新回调
    updateSuccess = (val) => {
        this.table.getData();
        // this.table.update(this.state.rightData, val)
    }
    //搜索
    search = (smsTimeStartTmp,smsTimeEndTmp,searcher,smsSendStatus) => {
        let seachStart;
        let seachEnd
        if (smsTimeStartTmp) {
            smsTimeStartTmp = dataUtil.Dates().formatTimeString(smsTimeStartTmp).substr(0, 10) + ' 00:00:00';
        }else{
            seachStart = 'searchStart' //用于判断是否通过按钮搜索
        }
        if (smsTimeEndTmp) {
            smsTimeEndTmp = dataUtil.Dates().formatTimeString(smsTimeEndTmp).substr(0, 10) + ' 23:59:59';
        }else{
            seachEnd = 'seachEnd' //用于判断是否通过按钮搜索
        }

        this.setState({
            searcher,
            smsTimeStartTmp,
            smsTimeEndTmp,
            seachStart,
            seachEnd,
            smsSendStatus
        }, () => {
            this.table.getData();
        })
    }
    //设置table的选中行class样式
    setClassName = (record, index) => {
        return record.id === this.state.activeIndex ? 'tableActivty' : '';
    };
    //弹窗 页签
    changeRight = (result, msg) => {
        setRightShow(result, msg).then(res => {
            this.setState({
                ...res,
            })
        })
    }
    //关闭详情页刷新列表
    closeInfo = () => {
        this.table.getData();
    }
    handleCancel = () => {
        this.setState({
            rightTagShow: false,
        })
    }
    render() {
        const columns = [
            {
                title: '发送账号',
                dataIndex: 'smsSendNumber',
                key: 'smsSendNumber',
                render: (text, record) => {
                    return <span onClick={this.changeRight.bind(this, record)} style={{ color: 'rgb(45,182,244)', cursor: 'pointer' }}>{text ? text : ''}</span>
                }
            },
            {
                title: '发送内容',
                dataIndex: 'messageContent',
                key: 'messageContent',
                render: (text, record) => {
                    return <span onClick={this.changeRight.bind(this, record)} style={{ color: 'rgb(45,182,244)', cursor: 'pointer' }}>{text ? text.length>20 ? `${text.slice(0, 20)}...` : text : ''}</span>
                }
            },
            {
                title: '发送数',
                dataIndex: 'sendNum',
                key: 'sendNum',
                render: (text, record) => {
                    return <span >{text ? text : ''}</span>
                }
            },
            {
                title: '接收数',
                dataIndex: 'receiveSuccessNum',
                key: 'receiveSuccessNum',
                render: (text, record) => {
                    return <span style={record.sendNum==record.receiveSuccessNum?{}:{ color: 'rgb(217,0,27)', cursor: 'pointer' }}>{text ? text : '0'}</span>
                }
            },
            {
                title: '方式-通道',
                dataIndex: 'sendPersonsendChannel',
                key: 'sendPersonsendChannel',
                render: (text, record) => {
                    return <span >{text ? text : ''}</span>
                }
            },
            {
                title: '发送状态',
                dataIndex: 'smsSendStatusStr',
                key: 'smsSendStatusStr',
                render: (text, record) => {
                    return <span >{text ? text : ''}</span>
                }
            },
            {
                title: '发送时间',
                dataIndex: 'sendTime',
                key: 'sendTime',
                render: (text, record) => {
                    return <span >{text ? text : ''}</span>
                }
            }
        ];
        const { permission, record } = this.state
        return (
            <ExtLayout renderWidth={({ contentWidth }) => { this.setState({ contentWidth }) }}>
                <Toolbar>
                    <TopTags
                        record={this.state.record}
                        selectedRows={this.state.selectedRows}
                        updateSuccess={this.updateSuccess}
                        delSuccess={this.delSuccess}
                        approveSuccess={this.approveSuccess}
                        search={this.search}
                        searcher={this.state.searcher}
                        bizType={this.props.menuInfo.menuCode}
                        updateImportFile={this.updateImportFile}
                        permission={permission}
                        rightData={this.state.rightData}
                        menuCode={this.props.menuInfo.menuCode}
                        menuId={this.props.menuInfo.id}
                        bizType={this.props.menuInfo.menuCode}
                        rightTagShow={this.state.rightTagShow}
                        handleDouble={this.changeRight}
                        handleCancel={this.handleCancel}
                        closeInfo={this.closeInfo}
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
                <RightTags
                    rightData={this.state.rightData}
                    updateSuccess={this.updateSuccess}
                    groupCode={1}
                    menuCode={this.props.menuInfo.menuCode}
                    menuId={this.props.menuInfo.id}
                    bizType={this.props.menuInfo.menuCode}
                    bizId={this.state.rightData ? this.state.rightData.id : null}
                    fileEditAuth={true}
                    extInfo={{ startContent: "短信历史" }}
                    taskFlag={false}
                    isCheckWf={true}  //流程查看
                    openWorkFlowMenu={this.props.openWorkFlowMenu}
                    isShow={true} //文件权限
                    record={record}
                    permission={permission}
                    rightTagShow={this.state.rightTagShow}
                    handleDouble={this.changeRight}
                    handleCancel={this.handleCancel}
                    closeInfo={this.closeInfo}
                />
            </ExtLayout>
        )
    }
}
export default connect(state => ({
    currentLocale: state.localeProviderData
}), {
    changeLocaleProvider
})(History);