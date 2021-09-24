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

class SituationSearch extends Component {
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
            checkType: '1'
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
                contractAmount1: '14554',
                contractAmount2: '516511',
                contractAmount3: '14564',
                contractAmount4: '100001',
                contractAmount5: '0.001',
                contractAmount6: '146456',
                //一
                source: '2442.545',
                specification: '154546.3',
                unit: '14545',
                //二
                contractAmount: '1号线',
                source1: '17577',
                specification1: '1567',
                unit1: '17567',
                //三
                contractAmount7: '1号线',
                contractAmount8: '哈尔滨南站',
                source2: '17567',
                specification2: '176577',
                unit2: '17657',
                //四
                contractAmount9: '单程票',
                contractAmount99: '1号线',
                contractAmount999: '177677',
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
    //tabs切换回调
    switchTab = (e) => {
        this.setState({
            checkType: e.target.value
        }, () => {
            this.table.getData()
        })
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
        const columnsGlobal2 = [
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
        const columnsGlobal = [
            {
                title: '本月累计客运量(万人次)',
                dataIndex: 'contractAmount1',
                key: 'contractAmount1',
                render: (text, record) => {
                    return <span className={style.tdSpan}>{text.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>
                }
            },
            {
                title: '本月日均客运量(万人次)',
                dataIndex: 'contractAmount2',
                key: 'contractAmount2',
                render: (text, record) => {
                    return <span className={style.tdSpan}>{text.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>
                }
            },
            {
                title: '年累计客运量(万人次)',
                dataIndex: 'contractAmount3',
                key: 'contractAmount3',
                render: (text, record) => {
                    return <span className={style.tdSpan}>{text.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>
                }
            },
            {
                title: '年日均客运量(万人次)',
                dataIndex: 'contractAmount4',
                key: 'contractAmount4',
                render: (text, record) => {
                    return <span className={style.tdSpan}>{text.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>
                }
            },
            {
                title: '开通至今累计客运量(万人次)',
                dataIndex: 'contractAmount5',
                key: 'contractAmount5',
                render: (text, record) => {
                    return <span className={style.tdSpan}>{text.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>
                }
            },
            {
                title: '开通至今日均客运量(万人次)',
                dataIndex: 'contractAmount6',
                key: 'contractAmount6',
                render: (text, record) => {
                    return <span className={style.tdSpan}>{text.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>
                }
            }
        ]
        const columns1 = [
            ...columnsGlobal2,
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
            },
            ...columnsGlobal
        ]
        const columns2 = [
            ...columnsGlobal2,
            {
                title: '线路',
                dataIndex: 'contractAmount',
                key: 'contractAmount',
            },
            {
                title: '本日进站(人次)',
                dataIndex: 'source1',
                key: 'source1',
                render: (text, record) => {
                    return <span className={style.tdSpan}>{text.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>
                }
            },
            {
                title: '本日出站(人次)',
                dataIndex: 'specification1',
                key: 'specification1',
                render: (text, record) => {
                    return <span className={style.tdSpan}>{text.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>
                }
            },
            {
                title: '本日换乘(人次)',
                dataIndex: 'unit1',
                key: 'unit1',
                render: (text, record) => {
                    return <span className={style.tdSpan}>{text.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>
                }
            },
            ...columnsGlobal
        ]
        const columns3 = [
            ...columnsGlobal2,
            {
                title: '线路',
                dataIndex: 'contractAmount7',
                key: 'contractAmount7',
            },
            {
                title: '站点',
                dataIndex: 'contractAmount8',
                key: 'contractAmount8',
            },
            {
                title: '本日进站(人次)',
                dataIndex: 'source2',
                key: 'source2',
                render: (text, record) => {
                    return <span className={style.tdSpan}>{text.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>
                }
            },
            {
                title: '本日出站(人次)',
                dataIndex: 'specification2',
                key: 'specification2',
                render: (text, record) => {
                    return <span className={style.tdSpan}>{text.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>
                }
            },
            {
                title: '本日累计客运量(人次)',
                dataIndex: 'unit2',
                key: 'unit2',
                render: (text, record) => {
                    return <span className={style.tdSpan}>{text.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>
                }
            },
            ...columnsGlobal
        ]
        const columns4 = [
            ...columnsGlobal2,
            {
                title: '票种',
                dataIndex: 'contractAmount9',
                key: 'contractAmount9',
            },
            {
                title: '线路',
                dataIndex: 'contractAmount99',
                key: 'contractAmount99',
            },
            {
                title: '本日客运量(人次)',
                dataIndex: 'contractAmount999',
                key: 'contractAmount999',
                render: (text, record) => {
                    return <span className={style.tdSpan}>{text.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>
                }
            },
            ...columnsGlobal
        ]
        const { checkType } = this.state
        const { height } = this.props
        return (
            <div>
                <Radio.Group defaultValue="1" buttonStyle="solid" style={{ margin: 10 }} onChange={this.switchTab}>
                    <Radio.Button value="1" key='1'>线网客流</Radio.Button>
                    <Radio.Button value="2" key='2'>线路客流</Radio.Button>
                    <Radio.Button value="3" key='3'>各车站客流</Radio.Button>
                    <Radio.Button value="4" key='4'>各票卡客流</Radio.Button>
                </Radio.Group>
                <TopTags
                    record={this.state.record}
                    selectedRows={this.state.selectedRows}
                    search={this.search}
                    searcher={this.state.search}
                    updateFlow={this.updateFlow}
                    bizType={this.props.menuInfo.menuCode}
                    updateImportFile={this.updateImportFile}
                    checkType={this.state.checkType}
                />
                <div className={style.main}>
                    <div className={style.leftMain} style={{ height }}>
                        <div style={{ minWidth: 'calc(100vw - 60px)' }}>
                            {checkType == '1' && <PublicTable onRef={this.onRef}
                                pagination={true}
                                getData={this.getList}
                                columns={columns1}
                                rowSelection={true}
                                onChangeCheckBox={this.getSelectedRowKeys}
                                useCheckBox={true}
                                getRowData={this.getInfo}
                                total={this.state.total}
                                pageSize={10}
                                bordered
                            />}
                            {checkType == '2' && <PublicTable onRef={this.onRef}
                                pagination={true}
                                getData={this.getList}
                                columns={columns2}
                                rowSelection={true}
                                onChangeCheckBox={this.getSelectedRowKeys}
                                useCheckBox={true}
                                getRowData={this.getInfo}
                                total={this.state.total}
                                pageSize={10}
                                bordered
                            />}
                            {checkType == '3' && <PublicTable onRef={this.onRef}
                                pagination={true}
                                getData={this.getList}
                                columns={columns3}
                                rowSelection={true}
                                onChangeCheckBox={this.getSelectedRowKeys}
                                useCheckBox={true}
                                getRowData={this.getInfo}
                                total={this.state.total}
                                pageSize={10}
                                bordered
                            />}
                            {checkType == '4' && <PublicTable onRef={this.onRef}
                                pagination={true}
                                getData={this.getList}
                                columns={columns4}
                                rowSelection={true}
                                onChangeCheckBox={this.getSelectedRowKeys}
                                useCheckBox={true}
                                getRowData={this.getInfo}
                                total={this.state.total}
                                pageSize={10}
                                bordered
                            />}
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
})(SituationSearch);