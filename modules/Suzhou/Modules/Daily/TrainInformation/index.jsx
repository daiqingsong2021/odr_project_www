import React, { Component } from 'react'
import { Table, notification } from 'antd'
import style from './style.less'
import { connect } from 'react-redux'
import { changeLocaleProvider } from '@/store/localeProvider/action'
import RightTags from '@/modules/Suzhou/components/RightTags/index';
import * as util from '@/utils/util';
import * as dataUtil from '@/utils/dataUtil';
import { queryTrainFoundationList } from '@/modules/Suzhou/api/suzhou-api';
import axios from '@/api/axios';
import TopTags from './TopTags/index';
import notificationFun from '@/utils/notificationTip';

//修改
import EditModal from './EditModal'
// 布局
import ExtLayout from "@/components/public/Layout/ExtLayout";
import MainContent from "@/components/public/Layout/MainContent";
import Toolbar from "@/components/public/Layout/Toolbar";
import PublicTable from '@/components/PublicTable'
import { firstLoad } from "@/modules/Suzhou/components/Util/firstLoad";
import { isChina, columnsCreat, permissionFun, setRightShow } from "@/modules/Suzhou/components/Util/util.js";

class LineManage extends Component {
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
            line: '',    //线路
            permission: [],  //权限
            editModalVisible: false,//修改弹窗
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
        console.log(record)
        this.setState({
            activeIndex: id,
            record: record,
            rightData: record
        });
    }
    //获取主列表数据
    getList = (currentPageNum, pageSize, callBack) => {
        const { line } = this.state
        axios.get(queryTrainFoundationList(pageSize, currentPageNum) + `?line=${line}`).then(res => {
            callBack(res.data.data ? res.data.data : [])
            let data = res.data.data;
            this.setState({
                data,
                rightData: null,
                total: res.data.total,
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
    //打开修改弹窗
    openEditModal = () => {
        this.setState({
            editModalVisible: true
        })
    }
    //关闭修改弹窗
    closeEditModal = () => {
        this.setState({
            editModalVisible: false
        })
    }
    render() {
        const columns = [
            {
                title: '所属线路',
                dataIndex: 'line',
                key: 'line',
                render: (text, record) => {
                    return <span onClick={this.openEditModal.bind(this, record)} style={{ color: 'rgb(45,182,244)', cursor: 'pointer' }}>{text}</span>
                }
            },
            {
                title: '列车编号',
                dataIndex: 'trainCode',
                key: 'trainCode',
            },
        ];
        const { permission, record } = this.state
        return (
            <div>
                <ExtLayout renderWidth={({ contentWidth }) => { this.setState({ contentWidth }) }}>
                    <Toolbar>
                        <TopTags
                            record={this.state.record}
                            selectedRows={this.state.selectedRows}
                            selectedRowKeys={this.state.selectedRowKeys}
                            success={this.addSuccess}
                            delSuccess={this.delSuccess}
                            updateSuccess={this.updateSuccess}
                            search={this.search}
                            searcher={this.state.search}
                            bizType={this.props.menuInfo.menuCode}
                            permission={permission}
                            rightData={this.state.rightData}
                        />
                    </Toolbar>
                    <MainContent contentWidth={this.state.contentWidth} contentMinWidth={1100}>
                        <PublicTable onRef={this.onRef}
                            pagination={true}
                            // istile={true}
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
                {this.state.editModalVisible &&
                    <EditModal
                        editModalVisible={this.state.editModalVisible}
                        updateSuccess={this.updateSuccess}
                        closeEditModal={this.closeEditModal}
                        rightData={this.state.rightData}
                        selectedRows={this.state.selectedRows}
                        delSuccess={this.delSuccess}
                    />

                }
            </div>
        )
    }
}
export default connect(state => ({
    currentLocale: state.localeProviderData
}), {
    changeLocaleProvider
})(LineManage);