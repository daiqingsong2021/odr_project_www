import React, { Component } from 'react'
import { Table, notification } from 'antd'
import style from './style.less'
import { connect } from 'react-redux'
import { changeLocaleProvider } from '@/store/localeProvider/action'
import RightTags from '@/modules/Suzhou/components/RightTags/index';
import * as util from '@/utils/util';
import * as dataUtil from '@/utils/dataUtil';
import { getSmsGroupList,updateSmsGroupStatus } from '@/modules/Suzhou/api/suzhou-api';
import axios from '@/api/axios';
import TopTags from './TopTags/index';
import notificationFun from '@/utils/notificationTip';
// 布局
import ExtLayout from "@/components/public/Layout/ExtLayout";
import MainContent from "@/components/public/Layout/MainContent";
import Toolbar from "@/components/public/Layout/Toolbar";
import PublicTable from '@/components/PublicTable'
import { isChina, columnsCreat, permissionFun, setRightShow } from "@/modules/Suzhou/components/Util/util.js";
import { result } from 'lodash'
import UploadDoc from './ImportFile'

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
        const { searcher } = this.state
        axios.get(getSmsGroupList(pageSize, currentPageNum), { params: { searcher } }).then(res => {
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
        permissionFun(this.props.menuInfo.menuCode).then(res => {
            this.setState({
                permission: !res.permission ? [] : res.permission
            })
        });
    }
    //增加回调
    addSuccess = (val) => {
        this.table.recoveryPage(1)
        this.table.getData();
    }
    //流程审批回调
    updateFlow = () => {
        this.table.getData();
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
    //导入更新
    updateImportFile = () => {
        this.table.getData();
    }

    //关闭详情页面
    handleCancel = () => {
       
    }
    //搜索
    search = (searcher) => {
        //true ? this.table.recoveryPage(1) : '';
        this.setState({
            searcher
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
    updateGroup = (result,msg) => {
        //点击修改事件
        const updateData = {}
        updateData.groupName = result.groupName;
        updateData.id = result.id;
        updateData.type = 'update'
        this.setState({
            updateData,
            UploadVisible: true,
        })
    }
    handleCancelImportFile = (v) => {
        this.setState({
            UploadVisible: false
        })
    }
    //关闭详情页刷新列表
    closeInfo = () => {
        this.table.getData();
    }
    changeStatus = (record,e) =>{
        let status;
        if(record.status === 'NORMAL'){
            status = 'SUSPEND'
        }else if(record.status === 'SUSPEND'){
            status = 'NORMAL'
        }
        axios.put(updateSmsGroupStatus+`?id=${record.id}&status=${status}` ,{}, true).then(res => {
            if (res.data && res.data.success) {
                this.table.getData();
            } else {
                notification.error(
                    {
                        placement: 'bottomRight',
                        bottom: 50,
                        duration: 2,
                        message: '出错了',
                        description: '抱歉，网络开小差了，请稍后重试'
                    }
                )
            }
        })
    }
    render() {
        const columns = [
            {
                title: '群组编号',
                dataIndex: 'groupCode',
                key: 'groupCode',
                render: (text, record) => {
                    return <span onClick={this.changeRight.bind(this, record)} style={{ color: 'rgb(45,182,244)', cursor: 'pointer' }}>{text ? text : ''}</span>
                }
            },
            {
                title: '群组名称',
                dataIndex: 'groupName',
                key: 'groupName',
                render: (text, record) => {
                    return <span >{text ? text : ''}</span>
                }
            },
            {
                title: '群组人数',
                dataIndex: 'groupNumber',
                key: 'groupNumber',
                render: (text, record) => {
                    return <span >{text ? text : ''}</span>
                }
            },
            {
                title: '状态',
                dataIndex: 'statusDesc',
                key: 'statusDesc',
                render: (text, record) => {
                    return <span >{text ? text : ''}</span>
                }
            },
            {
                title: '操作',
                dataIndex: 'operate',
                key: 'operate',
                render: (text, record) => {
                    return <span onClick={this.changeStatus.bind(this, record)} style={{ color: 'rgb(45,182,244)', cursor: 'pointer' }}>{record.status==="NORMAL" ? '停用' : '启用'}</span>
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
                        success={this.addSuccess}
                        updateSuccess={this.updateSuccess}
                        delSuccess={this.delSuccess}
                        approveSuccess={this.approveSuccess}
                        search={this.search}
                        searcher={this.state.search}
                        updateFlow={this.updateFlow}
                        bizType={this.props.menuInfo.menuCode}
                        updateImportFile={this.updateImportFile}
                        permission={permission}
                        rightData={this.state.rightData}
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
                    extInfo={{ startContent: "群组详情" }}
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
                {this.state.UploadVisible &&
                    <UploadDoc
                        modalVisible={this.state.UploadVisible}
                        handleOk={this.handleOk}
                        handleCancel={this.handleCancelImportFile}
                        getListData={this.props.updateImportFile}
                        updateData={this.state.updateData}
                    />
                }
            </ExtLayout>
        )
    }
}
export default connect(state => ({
    currentLocale: state.localeProviderData
}), {
    changeLocaleProvider
})(Energy);