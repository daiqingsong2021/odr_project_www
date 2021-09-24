import React, { Component } from 'react'
import { Radio } from 'antd'
import style from './style.less'
import { connect } from 'react-redux'
import { changeLocaleProvider } from '@/store/localeProvider/action'
import * as util from '@/utils/util';
import * as dataUtil from '@/utils/dataUtil';
import { } from '@/modules/Suzhou/api/suzhou-api';
import axios from '@/api/axios';
import TopTags from './TopTags/index';
import notificationFun from '@/utils/notificationTip';
// 布局
import PublicTable from '@/components/PublicTable'
import { firstLoad } from "@/modules/Suzhou/components/Util/firstLoad";
import { isChina, columnsCreat, permissionFun } from "@/modules/Suzhou/components/Util/util.js";

class EnergySearch extends Component {
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
            selectSource: '',//来源select
            source: '', //来源
            searcher: '', //搜索
            selectStatus: '', //状态select
            status: '', //状态
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
        const { id } = record;
        this.setState({
            activeIndex: id,
            record: record,
            rightData: record
        });
    }
    getList = (currentPageNum, pageSize, callBack) => {
        const {  } = this.state;
        const data = {
            data: [{
                id: 154544,
                materialCode: '2020-07-22',
                materialName: '星期三',
                source: '2442.545',
                specification: '154546.3',
                unit: '14545',
            }],
            total: 0
        }
        callBack(data.data ? data.data : [])
        this.setState({
            data,
            total: data.total,
            rightData: null,
            selectedRowKeys: [],
        })
        // axios.get(classificationList(pageSize, currentPageNum), { params: { source, searcher, status } }).then(res => {
        //     callBack(res.data.data ? res.data.data : [])
        //     let data = res.data.data;
        //     this.setState({
        //         data,
        //         total: res.data.total,
        //         rightData: null,
        //         selectedRowKeys: [],
        //     })
        // })
    }
    componentDidMount() {
        permissionFun(this.props.menuInfo.menuCode).then(res => {
            this.setState({
                permission: !res.permission ? [] : res.permission
            })
        });
    }
    //导入更新
    updateImportFile = () => {
        this.table.getData();
    }
    //搜索
    search = (val) => {
        this.state.projectId ? this.table.recoveryPage(1) : '';
        const { selectSource, selectStatus } = this.state;
        this.setState({
            searcher: val,
            source: selectSource,
            status: selectStatus
        }, () => {
            if (!this.state.projectId) {
                notificationFun('警告', '请选择项目')
            } else {
                this.table.getData();
            }
        })
    }
    //设置table的选中行class样式
    setClassName = (record, index) => {
        return record.id === this.state.activeIndex ? 'tableActivty' : '';
    };
    render() {
        const columnsGlobal = [
            {
                title: "序号",
                render: (text, record, index) => index + 1
            },
            {
                title: '日期',
                dataIndex: 'materialCode',
                key: 'materialCode',
                render: (text, record) => {
                    return <span>{text}</span>
                }
            },
            {
                title: '星期',
                dataIndex: 'materialName',
                key: 'materialName',
            },
        ];
        const columns = [
            ...columnsGlobal,
            {
                title: '本日进站(人次)',
                dataIndex: 'source',
                key: 'source',
                render: (text, record) => {
                    return <span className={style.tdSpan}>{text.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>
                }
            },
            {
                title: '本日出站(人次)',
                dataIndex: 'specification',
                key: 'specification',
                render: (text, record) => {
                    return <span className={style.tdSpan}>{text.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>
                }
            },
            {
                title: '本日换乘(人次)',
                dataIndex: 'unit',
                key: 'unit',
                render: (text, record) => {
                    return <span className={style.tdSpan}>{text.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>
                }
            }
        ]
        const { height } = this.props
        return (
            <div>
                <TopTags
                    record={this.state.record}
                    selectedRows={this.state.selectedRows}
                    search={this.search}
                    searcher={this.state.search}
                    updateFlow={this.updateFlow}
                    bizType={this.props.menuInfo.menuCode}
                    updateImportFile={this.updateImportFile}
                />
                <div className={style.main}>
                    <div className={style.leftMain} style={{ height }}>
                        <div style={{ minWidth: 'calc(100vw - 60px)' }}>
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
                                bordered
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default connect(state => ({
    currentLocale: state.localeProviderData
}), {
    changeLocaleProvider
})(EnergySearch);