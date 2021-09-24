import React, { Component } from 'react'
import { Table, notification } from 'antd'
import style from './style.less'
import { connect } from 'react-redux'
import { changeLocaleProvider } from '@/store/localeProvider/action'
import RightTags from '@/modules/Suzhou/components/RightTags/index';
import * as util from '@/utils/util';
import * as dataUtil from '@/utils/dataUtil';
import { getTrainDailListPage } from '@/modules/Suzhou/api/suzhou-api';
import axios from '@/api/axios';
import TopTags from './TopTags/index';
import notificationFun from '@/utils/notificationTip';
//二级详情页面
import DrivingInfo from './UpdateModal/index'
// 布局
import ExtLayout from "@/components/public/Layout/ExtLayout";
import MainContent from "@/components/public/Layout/MainContent";
import Toolbar from "@/components/public/Layout/Toolbar";
import PublicTable from '@/components/PublicTable'
import { firstLoad } from "@/modules/Suzhou/components/Util/firstLoad";
import { isChina, columnsCreat, permissionFun,setRightShow } from "@/modules/Suzhou/components/Util/util.js";

class Driving extends Component {
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
            searcher: '', //搜索
            startTime:'',  //查询开始日期 
            endTime:'',    //查询结束日期
            line:'',    //线路
            DrivingInfoShow: false,  //详情页展示
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
    getInfo = (record) => {
        console.log(record)
        const { activeIndex } = this.state;
        const { id } = record;
        this.setState({
            activeIndex: id,
            record: record,
            rightData: record
        });
    }
    getList = (currentPageNum, pageSize, callBack) => {
        const { line,endTime,startTime} = this.state;
        // {
        //     id: 10086,
        //     materialCode: '2020-07-01',
        //     materialName: '1号线',
        //     source: '558.12',
        //     specification: '464.12',
        //     unit: '5465.23',
        //     contractAmount: '周宇驰',
        //     supplier: '新建',
        // },
        axios.get(getTrainDailListPage(pageSize, currentPageNum), { params: { startTime,endTime,line } }).then(res => {
            callBack(res.data.data ? res.data.data : [])
            let data = res.data.data;
            this.setState({
                data,
                total: res.data.total,
                rightData: null,
                selectedRowKeys: [],
            })
            if(this.state.addRecord && this.state.addRecord.id){
                console.log(1111)
                console.log(this.state.addRecord)
                this.getInfo(this.state.addRecord)
                this.changeRight(this.state.addRecord,true)
            }

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
        this.setState({
            addRecord:val
        })
        this.table.recoveryPage(1)
        this.table.getData();
        // console.log(this.state.addRecord)
        // this.getInfo(val)
        // this.changeRight(val,true)
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
    approveSuccess = () =>{
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
    //打开详情页面
    openInfo = (record) => {
        this.setState({
            record,
            DrivingInfoShow: true
        })
    }
    
    //关闭详情页面
    handleCancel = () => {
        this.setState({
            DrivingInfoShow: false
        })
    }
     //关闭详情页刷新列表
     closeInfo =() =>{
        this.setState({
            addRecord:{}
        })
        this.table.getData();
    }
    //搜索
    search = (startTime,endTime,line) => {
        this.table.recoveryPage(1)
        this.setState({
            startTime,
            endTime,
            line
        }, () => {
                this.table.getData();
        })
    }
    //设置table的选中行class样式
    setClassName = (record, index) => {
        return record.id === this.state.activeIndex ? 'tableActivty' : '';
    };
    //弹窗 页签
    changeRight=(result,msg)=>{
        console.log(2)
                setRightShow(result,msg).then(res=>{
                this.setState({
                    ...res,
                })
                })
            }
    render() {
        const columns = [
            // {
            //     title: "序号",
            //     width:'10px',
            //     render: (text, record, index) => index + 1
            // },
            {
                title: '日期',
                dataIndex: 'recordTime',
                key: 'recordTime',
                render: (text, record) => {
                    return <span onClick={this.changeRight.bind(this, record)} style={{ color: 'rgb(45,182,244)', cursor: 'pointer' }}>{text}</span>
                }
            },
            {
                title: '线路',
                dataIndex: 'lineName',
                key: 'lineName',
            },
            {
                title: '时刻表编码',
                dataIndex: 'trainScheduleVo.scheduleCode',
                key: 'trainScheduleVo.scheduleCode',
            },
            {
                title: '计划开行(列)',
                dataIndex: 'trainScheduleVo.plannedOperationColumn',
                key: 'trainScheduleVo.plannedOperationColumn',
            },
            {
                title: '实际开行(列)',
                dataIndex: 'actualOperatingColumn',
                key: 'actualOperatingColumn',
            },
            {
                title: '空驶里程(列公里)',
                dataIndex: 'deadheadKilometres',
                key: 'deadheadKilometres',
            },
            {
                title: '载客里程(列公里)',
                dataIndex: 'carryingKilometres',
                key: 'carryingKilometres',
            },
            {
                title: '运营里程(列公里)',
                dataIndex: 'operatingKilometres',
                key: 'operatingKilometres',
            },
            {
                title: '上报人',
                dataIndex: 'createrVo.name',
                key: 'createrVo.name',
            },
            {
                title: '状态',
                dataIndex: 'reviewStatusVo.name',
                key: 'reviewStatusVo.name',
            },
        ];
        const { DrivingInfoShow ,record, permission} = this.state
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
                    {/* {DrivingInfoShow &&
                        <DrivingInfo
                            record={record}
                            permission={permission}
                            success={this.addSuccess}
                            modalVisible={DrivingInfoShow}
                            handleCancel={this.handleCancel}
                        />} */}
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
                    extInfo={{ startContent: "行车日况" }}
                    taskFlag={false}
                    isCheckWf={true}  //流程查看
                    openWorkFlowMenu={this.props.openWorkFlowMenu}
                    isShow={true} //文件权限
                    record={record}
                    permission={permission}
                    rightTagShow={this.state.rightTagShow}
                    handleDouble={this.changeRight}
                    success={this.addSuccess}
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
})(Driving);