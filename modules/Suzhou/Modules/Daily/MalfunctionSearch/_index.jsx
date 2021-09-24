import React, { Component } from 'react'
import { Radio } from 'antd'
import style from './style.less'
import { connect } from 'react-redux'
import { changeLocaleProvider } from '@/store/localeProvider/action'
import * as util from '@/utils/util';
import * as dataUtil from '@/utils/dataUtil';
import {faultDailyPageList} from '@/modules/Suzhou/api/suzhou-api';
import axios from '@/api/axios';
import TopTags from './TopTags/index';
import notificationFun from '@/utils/notificationTip';
// 布局
import ExtLayout from "@/components/public/Layout/ExtLayout";
import MainContent from "@/components/public/Layout/MainContent";
import Toolbar from "@/components/public/Layout/Toolbar";
import PublicTable from '@/components/PublicTable'
import { isChina, columnsCreat, permissionFun } from "@/modules/Suzhou/components/Util/util.js";

class EnergySearch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedRowKeys: [],
            selectedRows: [],
            pageSize: 10,
            currentPageNum: 1,
            total: '',
            data: [],
            activeIndex: null,
            searcher: {
                startTime:'',
                endTime:'',
                line:''
            }, //搜索
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
        const {searcher} = this.state;
        let line = '';
        if(searcher.line == '全部'){
            line = searcher.treeDataXl[0].children.map(item => item.value).join(',')
        }else{
            line = searcher.line
        }
        console.log(line);
        axios.get(faultDailyPageList(pageSize, currentPageNum)+`?lines=${line}&startTime=${searcher.startTime}&endTime=${searcher.endTime}`).then(res => {
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
    //导入更新
    updateImportFile = () => {
        this.table.getData();
    }
    //搜索
    search = (startTime,endTime,line,treeDataXl) => {
        console.log(startTime,endTime,line,treeDataXl)
        this.table.recoveryPage(1)
        const {  } = this.state;
        this.setState({
            searcher: {startTime,endTime,line,treeDataXl},
        }, () => {
            console.log(this.state.searcher)
            this.table.getData();
        })
    }
    render() {
        const columns = [
            {
                title: '日期',
                dataIndex: 'recordDay',
                key: 'recordDay',
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
                render: (text, record) => {
                    return <span className={style.tdSpan}>{text.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>
                }
            },
            {
                title: '供电',
                dataIndex: 'majorPower',
                key: 'majorPower',
                render: (text, record) => {
                    return <span className={style.tdSpan}>{text.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>
                }
            },
            {
                title: '信号',
                dataIndex: 'majorSignal',
                key: 'majorSignal',
                render: (text, record) => {
                    return <span className={style.tdSpan}>{text.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>
                }
            },
            {
                title: '通信',
                dataIndex: 'majorCommunication',
                key: 'majorCommunication',
                render: (text, record) => {
                    return <span className={style.tdSpan}>{text.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>
                }
            },
            {
                title: '工建',
                dataIndex: 'majorConstruction',
                key: 'majorConstruction',
                render: (text, record) => {
                    return <span className={style.tdSpan}>{text.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>
                }
            },
            {
                title: '机电',
                dataIndex: 'majorMechatronics',
                key: 'majorMechatronics',
                render: (text, record) => {
                    return <span className={style.tdSpan}>{text.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>
                }
            },
            {
                title: 'AFC',
                dataIndex: 'majorAfc',
                key: 'majorAfc',
                render: (text, record) => {
                    return <span className={style.tdSpan}>{text.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>
                }
            },
            {
                title: '其他',
                dataIndex: 'majorOther',
                key: 'majorOther',
                render: (text, record) => {
                    return <span className={style.tdSpan}>{text.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>
                }
            },
            {
                title: '合计',
                dataIndex: 'totalProblem',
                key: 'totalProblem',
                render: (text, record) => {
                    return <span className={style.tdSpan}>{text.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>
                }
            },
            {
                title: '新增问题',
                dataIndex: 'newProblem',
                key: 'newProblem',
            },
            {
                title: '遗留问题',
                dataIndex: 'legacyProblem',
                key: 'legacyProblem',
            }
        ]
        const { height } = this.props
        return (
            <ExtLayout renderWidth={({ contentWidth }) => { this.setState({ contentWidth }) }}>
                <Toolbar>
                    <TopTags
                        record={this.state.record}
                        selectedRows={this.state.selectedRows}
                        search={this.search}
                        updateFlow={this.updateFlow}
                        bizType={this.props.menuInfo.menuCode}
                        updateImportFile={this.updateImportFile}
                    />
                </Toolbar>
                <MainContent contentWidth={document.body.clientWidth} contentMinWidth={1100}>
                        <PublicTable onRef={this.onRef}
                                pagination={true}
                                getData={this.getList}
                                columns={columns}
                                onChangeCheckBox={this.getSelectedRowKeys}
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
})(EnergySearch);