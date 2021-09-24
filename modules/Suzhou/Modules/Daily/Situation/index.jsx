import React, { Component } from 'react'
import { Table, notification } from 'antd'
import style from './style.less'
import { connect } from 'react-redux'
import { changeLocaleProvider } from '@/store/localeProvider/action'
import RightTags from '@/modules/Suzhou/components/RightTags/index';
import * as util from '@/utils/util';
import * as dataUtil from '@/utils/dataUtil';
import { queryTrafficMainList } from '@/modules/Suzhou/api/suzhou-api';
import axios from '@/api/axios';
import TopTags from './TopTags/index';
import notificationFun from '@/utils/notificationTip';
//二级页面
import SituationInfo from './Info/index'
// 布局
import ExtLayout from "@/components/public/Layout/ExtLayout";
import MainContent from "@/components/public/Layout/MainContent";
import Toolbar from "@/components/public/Layout/Toolbar";
import PublicTable from '@/components/PublicTable'
import { firstLoad } from "@/modules/Suzhou/components/Util/firstLoad";
import { isChina, columnsCreat, permissionFun,setRightShow } from "@/modules/Suzhou/components/Util/util.js";

class Situation extends Component {
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
            SituationInfoShow: false,   //show详情页
            startTime:'',   //查询开始日期
            endTime:'', //查询结束日期
            record:{},
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
        const { startTime,endTime } = this.state;
        axios.get(queryTrafficMainList(pageSize, currentPageNum), { params: { startTime,endTime } }).then(res => {
            callBack(res.data.data ? res.data.data : [])
            let data = res.data.data;
            this.setState({
                data,
                total: res.data.total,
                rightData: null,
                selectedRows:[],
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
            SituationInfoShow: true
        })
    }
    //关闭详情页面
    handleCancel = () => {
        this.setState({
            SituationInfoShow: false
        })
    }
    //关闭详情页刷新列表
    closeInfo =() =>{
        this.table.getData();
    }
    //搜索
    search = (startDate,endDate) => {
        //true ? this.table.recoveryPage(1) : '';
        const {  } = this.state;
        this.setState({
            startTime:startDate,
            endTime:endDate,
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
            //     align:'center',
            //     width:'10px',
            //     render: (text, record, index) => index + 1
            // },
            {
                title: '日期',
                dataIndex: 'recordTime',
                key: 'recordTime',
                align:'center',
                render: (text, record) => {
                    return <span onClick={this.changeRight.bind(this, record)} style={{ color: 'rgb(45,182,244)', cursor: 'pointer' }}>{text}</span>
                }
            },
            {
                title: '本日客运量(人次)',
                dataIndex: 'trafficVolumeToday',
                key: 'trafficVolumeToday',
                align:'center',
                render: (text, record) => {
                    return <span className={style.tdRight}>{text.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>
                }
            },
            {
                title: '月累计客运量(人次)',
                dataIndex: 'trafficVolumeMonth',
                key: 'trafficVolumeMonth',
                align:'center',
                render: (text, record) => {
                    return <span className={style.tdRight}>{text.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>
                }
            },
            {
                title: '本月日均客运量(人次)',
                dataIndex: 'trafficVolumeMonthAverage',
                key: 'trafficVolumeMonthAverage',
                align:'center',
                render: (text, record) => {
                    return <span className={style.tdRight}>{text.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>
                }
            },
            {
                title: '年累计客运量(人次)',
                dataIndex: 'trafficVolumeYear',
                key: 'trafficVolumeYear',
                align:'center',
                render: (text, record) => {
                    return <span className={style.tdRight}>{text.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>
                }
            },
            {
                title: '年累计日均客运量(人次)',
                dataIndex: 'trafficVolumeYearAverage',
                key: 'trafficVolumeYearAverage',
                align:'center',
                render: (text, record) => {
                    return <span className={style.tdRight}>{text.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>
                }
            },
            {
                title: '上报人',
                dataIndex: 'reportMan',
                key: 'reportMan',
                align:'center',
            },
            {
                title: '状态',
                dataIndex: 'statusVo.name',
                key: 'statusVo.name',
                align:'center',
            },
        ];
        const { SituationInfoShow, record, permission } = this.state
        return (
            <ExtLayout renderWidth={({ contentWidth }) => { this.setState({ contentWidth }) }}>
                <Toolbar>
                    <TopTags
                        record={this.state.record}
                        selectedRows={this.state.selectedRows}
                        success={this.addSuccess}
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
                        // bordered
                        getRowData={this.getInfo}
                        total={this.state.total}
                        pageSize={10}
                    />
                    {/* {SituationInfoShow &&
                        <SituationInfo
                            record={record}
                            permission={permission}
                            SituationInfoShow={SituationInfoShow}
                            handleCancel={this.handleCancel}
                            addSuccess={this.addSuccess}
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
                    extInfo={{ startContent: "客运日况" }}
                    taskFlag={false}
                    isCheckWf={true}  //流程查看
                    openWorkFlowMenu={this.props.openWorkFlowMenu}
                    isShow={true} //文件权限
                    record={record}
                    permission={permission}
                    rightTagShow={this.state.rightTagShow}
                    handleDouble={this.changeRight}
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
})(Situation);