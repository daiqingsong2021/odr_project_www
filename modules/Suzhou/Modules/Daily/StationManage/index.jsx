import React, { Component } from 'react'
import { Table, notification, Tabs } from 'antd'
import style from './style.less'
import { connect } from 'react-redux'
import { changeLocaleProvider } from '@/store/localeProvider/action'
import RightTags from '@/modules/Suzhou/components/RightTags/index';
import * as util from '@/utils/util';
import * as dataUtil from '@/utils/dataUtil';
import { queryStationFoundationList } from '@/modules/Suzhou/api/suzhou-api';
import axios from '@/api/axios';
import TopTags from './TopTags/index';
import notificationFun from '@/utils/notificationTip';
// 布局
import ExtLayout from "@/components/public/Layout/ExtLayout";
import MainContent from "@/components/public/Layout/MainContent";
import Toolbar from "@/components/public/Layout/Toolbar";
import PublicTable from '@/components/PublicTable'
import { firstLoad } from "@/modules/Suzhou/components/Util/firstLoad";
import { isChina, columnsCreat, permissionFun, setRightShow } from "@/modules/Suzhou/components/Util/util.js";
const { TabPane } = Tabs;
class StationManage extends Component {
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
            line: '1',    //线路
            stationType: '0',
            permission: [],  //权限
            tabKey: '1'
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
    getList = (callBack) => {
        const { stationType, line } = this.state
        axios.get(queryStationFoundationList, { params: { line, stationType } }).then(res => {
            callBack(res.data.data ? res.data.data : [])
            let data = res.data.data;
            this.setState({
                data,
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
    //radio切换
    radioChange = (e) => {
        this.setState({
            tabKey: e.target.value,
            stationType: e.target.value == '1' ? '0' : (e.target.value == '2' ? '' : '3')
        })
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
        this.setState({
            record: {}
        })
        this.table.getData();
    }
    //发布回调
    approveSuccess = () => {
        this.table.getData();
    }
    //更新回调
    updateSuccess = (val) => {
        this.table.update(this.state.rightData, val)
    }
    //导入更新
    updateImportFile = () => {
        this.table.getData();
    }
    //搜索
    search = (line) => {
        //true ? this.table.recoveryPage(1) : '';
        this.setState({
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
    changeRight = (result, msg) => {
        setRightShow(result, msg).then(res => {
            this.setState({
                ...res,
            })
        })
    }
    render() {
        const columnsGlobal = this.state.tabKey == '1' ? [{
            title: '是否换乘站',
            dataIndex: 'isChangeStationName',
            key: 'isChangeStationName',
            render: (text, record) => {
                return <span >{text ? text : ''}</span>
            }
        }] : (this.state.tabKey == '3' ? [{
            title: '包含站点',
            dataIndex: 'stationRouteDetail',
            key: 'stationRouteDetail',
            render: (text, record) => {
                return <span >{text ? text : ''}</span>
            }
        }]:[{
            title: '关联站点',
            dataIndex: 'relationStationName',
            key: 'relationStationName',
            render: (text, record) => {
                return <span >{text ? text : ''}</span>
            }
        }])
        const columns = [
            // {
            //     title: "序号",
            //     render: (text, record, index) => index + 1
            // },
            {
                title: this.state.tabKey == '3'?'辅线线路编号':'站点编号',
                dataIndex: 'stationCode',
                key: 'stationCode',
                render: (text, record) => {
                    return <span>{text ? text : ''}</span>
                }
            },
            {
                title: this.state.tabKey == '3'?'线路名称':'站点名称',
                dataIndex: 'stationName',
                key: 'stationName',
                render: (text, record) => {
                    return <span >{text ? text : ''}</span>
                }
            },
            {
                title: '站点类型',
                dataIndex: 'stationTypeName',
                key: 'stationTypeName',
                render: (text, record) => {
                    return <span >{text ? text : ''}</span>
                }
            },
            {
                title: '所属线路',
                dataIndex: 'lineName',
                key: 'lineName',
                render: (text, record) => {
                    return <span >{text ? text : ''}</span>
                }
            },
            ...columnsGlobal
        ];
        const { permission, record } = this.state
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
                        tabKey={this.state.tabKey}
                        radioChange={this.radioChange}
                        permission={permission}
                    />
                </Toolbar>
                <MainContent contentWidth={this.state.contentWidth} contentMinWidth={1100}>
                    {this.state.tabKey == '1' && <PublicTable onRef={this.onRef}
                        pagination={false}
                        istile={true}
                        getData={this.getList}
                        columns={columns}
                        rowSelection={true}
                        onChangeCheckBox={this.getSelectedRowKeys}
                        // useCheckBox={true}
                        getRowData={this.getInfo}
                        total={this.state.total}
                        pageSize={10}
                    />}
                    {this.state.tabKey == '2' && <PublicTable onRef={this.onRef}
                        pagination={false}
                        istile={true}
                        getData={this.getList}
                        columns={columns}
                        rowSelection={true}
                        onChangeCheckBox={this.getSelectedRowKeys}
                        // useCheckBox={true}
                        getRowData={this.getInfo}
                        total={this.state.total}
                        pageSize={10}
                    />}
                    {this.state.tabKey == '3' && <PublicTable onRef={this.onRef}
                        pagination={false}
                        istile={true}
                        getData={this.getList}
                        columns={columns}
                        rowSelection={true}
                        onChangeCheckBox={this.getSelectedRowKeys}
                        // useCheckBox={true}
                        getRowData={this.getInfo}
                        total={this.state.total}
                        pageSize={10}
                    />}
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
                    extInfo={{ startContent: "线路管理" }}
                    taskFlag={false}
                    isCheckWf={true}  //流程查看
                    openWorkFlowMenu={this.props.openWorkFlowMenu}
                    isShow={true} //文件权限
                    record={record}
                    permission={permission}
                    rightTagShow={this.state.rightTagShow}
                    handleDouble={this.changeRight}
                />
            </ExtLayout>
        )
    }
}
export default connect(state => ({
    currentLocale: state.localeProviderData
}), {
    changeLocaleProvider
})(StationManage);