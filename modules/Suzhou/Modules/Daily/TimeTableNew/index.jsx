import React, { Component } from 'react'
import { Table, notification } from 'antd'
import style from './style.less'
import { connect } from 'react-redux'
import { changeLocaleProvider } from '@/store/localeProvider/action'
import RightTags from '@/modules/Suzhou/components/RightTags/index';
import * as util from '@/utils/util';
import * as dataUtil from '@/utils/dataUtil';
import { checkAddScheduleName, getTrainScheduleListPage } from '@/modules/Suzhou/api/suzhou-api';
import axios from '@/api/axios';
import TopTags from './TopTags/index';
import notificationFun from '@/utils/notificationTip';
//二级详情页面
import TimeTableInfo from './AddModal/index'
// 布局
import ExtLayout from "@/components/public/Layout/ExtLayout";
import MainContent from "@/components/public/Layout/MainContent";
import Toolbar from "@/components/public/Layout/Toolbar";
import PublicTable from '@/components/PublicTable'
import { firstLoad } from "@/modules/Suzhou/components/Util/firstLoad";
import { isChina, columnsCreat, permissionFun, setRightShow } from "@/modules/Suzhou/components/Util/util.js";

class TimeTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedRowKeys: [],
            pageSize: 10,
            currentPageNum: 1,
            total: '',
            selectedRows: [],
            data: [],
            record: [],
            activeIndex: null,
            scheduleCode: '',    //时刻表编码
            line:'',    //线路
            TimeTableInfoShow: false,  //控制详情页展示
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
        const { activeIndex } = this.state;
        const { id } = record;
        this.setState({
            activeIndex: id,
            record: record,
            rightData: record
        });
    }
    getList = (currentPageNum, pageSize, callBack) => {
        const { scheduleCode, line } = this.state;
        const data = {
            data: [
                {
                    id: 10086,
                    materialCode: '时刻表一',
                    materialName: 20,
                    source: 500,
                    specification: 21,
                    unit: 50,
                    contractAmount: '周宇驰',
                    supplier: '2020-07-28 12:23:55',
                    supplierSec: '是'
                },
                {
                    id: 10087,
                    materialCode: '时刻表二',
                    materialName: 24,
                    source: 800,
                    specification: 28,
                    unit: 80,
                    contractAmount: '姓柯帆',
                    supplier: '2020-07-28 12:23:55',
                    supplierSec: '否'
                }
            ],
            total: 1
        }
        // callBack(data.data ? data.data : [])
        // this.setState({
        //     data,
        //     total: data.total,
        //     rightData: null,
        //     selectedRowKeys: [],
        // })
        axios.get(getTrainScheduleListPage(pageSize, currentPageNum),{params:{scheduleCode,line}}  ).then(res => {
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
    //删除回调
    delSuccess = (del) => {
        this.table.getData();
    }
    //更新回调
    updateSuccess = (val) => {
        this.table.update(this.state.rightData, val)
    }
    //打开详情页面
    openInfo = (record) => {
        this.setState({
            record,
            TimeTableInfoShow: true
        })
    }
    //关闭详情页面
    handleCancel = () => {
        this.setState({
            TimeTableInfoShow: false
        })
    }
    //搜索
    search = (scheduleCode, line) => {
        //true ? this.table.recoveryPage(1) : '';
        this.setState({
            scheduleCode,
            line,
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
    render() {
        const columns = [
            {
                title: "序号",
                render: (text, record, index) => index + 1
            },
            {
                title: '线路',
                dataIndex: 'lineName',
                key: 'lineName',
                render: (text, record) => {
                    return <span>{text ? text : ''}</span>
                }
            },
            {
                title: '时刻表编码',
                dataIndex: 'scheduleCode',
                key: 'scheduleCode',
                render: (text, record) => {
                    return <span onClick={this.changeRight.bind(this, record)} style={{ color: 'rgb(45,182,244)', cursor: 'pointer' }}>{text ? text : ''}</span>
                }
            },
            {
                title: '最大上线列车数',
                dataIndex: 'maxOnlineTrain',
                key: 'maxOnlineTrain',
                render: (text, record) => {
                    return <span className={style.tdSpan}>{text}</span>
                }
            },
            {
                title: '最小行车间距（单位：m）',
                dataIndex: 'minDrivingInterval',
                key: 'minDrivingInterval',
                render: (text, record) => {
                    return <span className={style.tdSpan}>{text.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>
                }
            },
            {
                title: '计划开行（列）',
                dataIndex: 'plannedOperationColumn',
                key: 'plannedOperationColumn',
                render: (text, record) => {
                    return <span className={style.tdSpan}>{text}</span>
                }
            },
            {
                title: '备用车数',
                dataIndex: 'standbyTrain',
                key: 'standbyTrain',
                render: (text, record) => {
                    return <span className={style.tdSpan}>{text}</span>
                }
            },
            {
                title: '区间',
                dataIndex: 'startStation',
                key: 'startStation',
                render: (text, record) => {
                    return <span className={style.tdSpan}>{text ? record.startStationName + '~' + record.endStationName : ''}</span>
                }
            },
            {
                title: '首末班车时间',
                dataIndex: 'startDriveTime',
                key: 'startDriveTime',
                render: (text, record) => {
                    return <span className={style.tdSpan}>{text ? text + '~' + record.endDriveTime : ''}</span>
                }
            },
            {
                title: '创建人',
                dataIndex: 'createrVo.name',
                key: 'createrVo.name',
            },
            {
                title: '创建时间',
                dataIndex: 'creatTime',
                key: 'creatTime',
            },
        ];
        const { TimeTableInfoShow, record, permission } = this.state
        return (
            <ExtLayout renderWidth={({ contentWidth }) => { this.setState({ contentWidth }) }}>
                <Toolbar>
                    <TopTags
                        record={this.state.record}
                        selectedRows={this.state.selectedRows}
                        success={this.addSuccess}
                        delSuccess={this.delSuccess}
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
                    {TimeTableInfoShow &&
                        <TimeTableInfo
                            record={record}
                            type='info'
                            modalVisible={TimeTableInfoShow}
                            handleCancel={this.handleCancel}
                        />}
                </MainContent>
                <RightTags
                    rightData={this.state.rightData}
                    record={record}
                    success={this.addSuccess}
                    updateSuccess={this.updateSuccess}
                    groupCode={1}
                    menuCode={this.props.menuInfo.menuCode}
                    menuId={this.props.menuInfo.id}
                    bizType={this.props.menuInfo.menuCode}
                    bizId={this.state.rightData ? this.state.rightData.id : null}
                    fileEditAuth={true}
                    extInfo={{ startContent: "时刻表管理" }}
                    taskFlag={false}
                    isCheckWf={true}  //流程查看
                    openWorkFlowMenu={this.props.openWorkFlowMenu}
                    isShow={true} //文件权限
                    rightTagShow={this.state.rightTagShow}
                    handleDouble={this.changeRight}
                    permission={permission}
                />
            </ExtLayout>
        )
    }
}
export default connect(state => ({
    currentLocale: state.localeProviderData
}), {
    changeLocaleProvider
})(TimeTable);