import React, { Component } from 'react'
import { Table, notification } from 'antd'
import style from './style.less'
import { connect } from 'react-redux'
import { changeLocaleProvider } from '@/store/localeProvider/action'
import RightTags from '@/components/public/RightTags/index'
import * as util from '@/utils/util';
import * as dataUtil from '@/utils/dataUtil';
import {faultDailyPageList} from '@/modules/Suzhou/api/suzhou-api';
import axios from '@/api/axios';
import TopTags from './TopTags/index';
import notificationFun from '@/utils/notificationTip';
//二级详情页面
import AddModal from './AddModal/index'
// 布局
import ExtLayout from "@/components/public/Layout/ExtLayout";
import MainContent from "@/components/public/Layout/MainContent";
import Toolbar from "@/components/public/Layout/Toolbar";
import PublicTable from '@/components/PublicTable'
import { firstLoad } from "@/modules/Suzhou/components/Util/firstLoad";
import { isChina, columnsCreat, permissionFun } from "@/modules/Suzhou/components/Util/util.js";
import { constructionDailyList, constructionDailyDetail,updateConstructionDaily } from '@/modules/Suzhou/api/suzhou-api';
import { thresholdFreedmanDiaconis } from 'd3'
class Driving extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedRowKeys: [],
            pageSize: 10,
            currentPageNum: 1,
            total: 0,
            selectedRows: [],
            data: [],
            activeIndex: null,
            searcher: {
                startTime:'',
                endTime:'',
                line:''
            }, //搜索
            status: '', //状态
            addModalShow: false,  //详情页展示
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
            rightData: record
        });
    }
    getList = (currentPageNum, pageSize, callBack) => {
        const {searcher} = this.state;
        axios.get(faultDailyPageList(pageSize, currentPageNum)+`?lines=${searcher.line}&startTime=${searcher.startTime}&endTime=${searcher.endTime}`).then(res => {
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
    approveSuccess = () => {
        this.table.getData();
    }
    //更新回调
    updateSuccess = (val) => {
        this.table.getData();
        this.openInfo(val)
    }
    //导入更新
    updateImportFile = () => {
        this.table.getData();
    }
    //打开详情页面
    openInfo = (record) => {
        console.log(123,record)
        if(record.status == 'INIT'){
            this.setState({
                infoId:record.id,
                addModalShow: true,
                addOrModify:'modify',
                rightData:record,
                modifyDisabled:this.state.permission.indexOf('MALFUNCTIONMANAGE_MAILFUNCTION_EDIT_I')!==-1?false:true,//可修改
            });
        }else if(record.status == 'APPROVED'){
            this.setState({
                infoId:record.id,
                addModalShow: true,
                addOrModify:'modify',
                rightData:record,
                modifyDisabled:this.state.permission.indexOf('MALFUNCTIONMANAGE_MAILFUNCTION_EDIT_A')!==-1?false:true,//可修改
            });
        }else{
            this.setState({
                infoId:record.id,
                addModalShow: true,
                addOrModify:'modify',
                rightData:record,
                modifyDisabled:true
            });
        }
    }
    //关闭详情页面
    handleCancel = () => {
        this.setState({
            addModalShow: false
        })
        this.table.getData();
    }
    //搜索
    search = (startTime,endTime,line,treeDataXl) => {
        this.table.recoveryPage(1)
        if(line == '全部'){
            line = treeDataXl[0].children.map(item => item.value).join(',')
        }
        const {  } = this.state;
        this.setState({
            searcher: {startTime,endTime,line,treeDataXl},
        }, () => {
            this.table.getData();
        })
    }
    render() {
        const columns = [
            {
                title: '日期',
                dataIndex: 'recordDay',
                key: 'recordDay',
                render: (text, record) => {
                    return <span onClick={this.openInfo.bind(this, record)} style={{ color: 'rgb(45,182,244)', cursor: 'pointer' }}>{text}</span>
                }
            },
            {
                title: '线路',
                dataIndex: 'lineName',
                key: 'lineName',
            },
            {
                title: '车辆',
                dataIndex: 'majorVehicle',
                key: 'majorVehicle',
            },
            {
                title: '供电',
                dataIndex: 'majorPower',
                key: 'majorPower',
            },
            {
                title: '信号',
                dataIndex: 'majorSignal',
                key: 'majorSignal',
            },
            {
                title: '通信',
                dataIndex: 'majorCommunication',
                key: 'majorCommunication',
            },
            {
                title: '工建',
                dataIndex: 'majorConstruction',
                key: 'majorConstruction',
            },
            {
                title: '机电',
                dataIndex: 'majorMechatronics',
                key: 'majorMechatronics',
            },
            {
                title: 'AFC',
                dataIndex: 'majorAfc',
                key: 'majorAfc',
            },
            {
                title: '其他',
                dataIndex: 'majorOther',
                key: 'majorOther',
            },
            {
                title: '新增故障',
                dataIndex: 'newProblem',
                key: 'newProblem',
            },
            {
                title: '遗留故障',
                dataIndex: 'legacyProblem',
                key: 'legacyProblem',
            },
            {
                title: '状态',
                dataIndex: 'statusDesc',
                key: 'statusDesc',
            }
        ];
        const { addModalShow,constructionDailyDetailData } = this.state
        console.log(this.state.rightData);
        return (
            <ExtLayout renderWidth={({ contentWidth }) => { this.setState({ contentWidth }) }}>
                <Toolbar>
                    <TopTags
                        rightData={this.state.rightData}
                        selectedRows={this.state.selectedRows}
                        success={this.addSuccess}
                        delSuccess={this.delSuccess}
                        approveSuccess={this.approveSuccess}
                        search={this.search}
                        searcher={this.state.searcher}
                        updateFlow={this.updateFlow}
                        bizType={this.props.menuInfo.menuCode}
                        updateImportFile={this.updateImportFile}
                        permission={this.state.permission}
                    />
                </Toolbar>
                <MainContent contentWidth={document.body.clientWidth} contentMinWidth={1100}>
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
                    {/* 修改 */}
                    {addModalShow && <AddModal
                        rightData={this.state.rightData}
                        addModalShow={this.state.addModalShow}
                        handleCancel={this.handleCancel.bind(this)} 
                        addOrModify={this.state.addOrModify}
                        updateSuccess={this.updateSuccess}
                        menuCode={this.props.menuInfo.menuCode}
                        menuId={this.props.menuInfo.id}
                        bizType={this.props.menuInfo.menuCode}
                        bizId={this.state.rightData ? this.state.rightData.id : null}
                        fileEditAuth={true}
                        extInfo={{ startContent: "故障日况" }}
                        taskFlag={false}
                        isCheckWf={true}  //流程查看
                        openWorkFlowMenu={this.props.openWorkFlowMenu}
                        modifyDisabled={this.state.modifyDisabled}
                        openInfo={this.openInfo}
                        />}
                </MainContent>
                {/* <RightTags
                    rightData={this.state.rightData}
                    // updateSuccess={this.updateSuccess}
                    groupCode={1}
                    menuCode={this.props.menuInfo.menuCode}
                    menuId={this.props.menuInfo.id}
                    bizType={this.props.menuInfo.menuCode}
                    bizId={this.state.rightData ? this.state.rightData.id : null}
                    fileEditAuth={true}
                    extInfo={{ startContent: "故障日况" }}
                    taskFlag={false}
                    isCheckWf={true}  //流程查看
                    openWorkFlowMenu={this.props.openWorkFlowMenu}
                /> */}
            </ExtLayout>
        )
    }
}
export default connect(state => ({
    currentLocale: state.localeProviderData
}), {
    changeLocaleProvider
})(Driving);