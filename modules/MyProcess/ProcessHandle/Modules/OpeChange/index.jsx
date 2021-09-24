import React, { Component } from 'react'

import { Table, notification } from 'antd'
import moment from 'moment'
import style from './style.less'
import RightTags from '../../../../../components/public/RightTags'
// 引入redux方法
import { connect } from 'react-redux'

import * as util from '../../../../../utils/util';

export class OperatePrepared extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeIndex: '',
            columns: [],
            data: [
                {
                    id: 1,
                    name: '2019年经营目标',
                    code: 'XM',
                    planStartTime: '2018-08-12',
                    planEndTime: '2018-09-12',
                    orgName: '研发部',
                    userName: '孙博宇',
                    planResource: '--',
                    status: '--',
                    remark: '--',
                    type: 2, //1是维度 2 指标 3任务
                    children: [
                        {
                            id: 1001,
                            name: '型号',
                            code: 'ZGYF',
                            planStartTime: '2018-08-12',
                            planEndTime: '2018-09-12',
                            orgName: '研发部',
                            userName: '孙博宇',
                            planResource: '--',
                            status: '--',
                            remark: '--',
                            type: 2, //1是维度 2 指标 3任务
                        },
                        {
                            id: 1002,
                            name: '管理',
                            code: 'XM.1',
                            planStartTime: '2018-08-12',
                            planEndTime: '2018-09-12',
                            orgName: '研发部',
                            userName: '孙博宇',
                            planResource: '--',
                            status: '--',
                            remark: '--',
                            type: 2, //1是维度 2 指标 3任务
                            children: [
                                {
                                    id: 1002001,
                                    name: '指标1',
                                    code: 'A1007',
                                    planStartTime: '2018-08-12',
                                    planEndTime: '2018-09-12',
                                    orgName: '研发部',
                                    userName: '孙博宇',
                                    planResource: '--',
                                    status: '编制中',
                                    remark: '--',
                                    type: 3, //1是维度 2 指标 3任务
                                }
                            ]
                        }
                    ]
                },

            ],
            rightTags: [
                { icon: 'iconjibenxinxi', title: '基本信息', fielUrl: 'Operate/OpeChange/Edit' },
                { icon: 'iconwenjian', title: '文件信息', fielUrl: 'Components/FileInfo' },
                { icon: 'iconbiangengxinxi', title: '变更记录', fielUrl: 'Plan/Prepared/ChangeInfo' },
            ],
            dataMap: [],
            activeIndex: [],
            rightData: null
        }
    }

    setClassName = (record, index) => {
        //判断索引相等时添加行的高亮样式
        return record.id === this.state.activeIndex ? `${style['clickRowStyl']}` : "";
    }

    getInfo = (record, index) => {
        let currentIndex = this.state.activeIndex.findIndex(item => item == record.id)
        if (currentIndex > -1) {
            this.setState((preState, props) => {
                preState.activeIndex.splice(currentIndex, 1)
                preState.rightData.splice(currentIndex, 1)
                return {
                    activeIndex: preState.activeIndex,
                    rightData: null
                }
            })
        } else {
            this.setState({
                activeIndex: [record.id],
                rightData: [record]
            })
        }
    }

    // modal取消
    handleCancel = () => {
        this.setState({
            modalVisible: false
        })
    }

    componentDidMount() {
        const { data } = this.state
        const dataMap = util.dataMap(data);
        this.setState({
            data,
            dataMap
        })
    }

    // 新增经营计划变更
    addPlanChange = (ndata) => {
        const { data, dataMap, rightData, activeIndex } = this.state;
        const newData = {
            ...ndata,
            id: Math.floor(Math.random() * 900) + 100,
            parentId: activeIndex.length > 0 ? activeIndex[0] : 0
        }
        util.create(data, dataMap, rightData[0], newData);
        notification.success(
            {
                placement: 'bottomRight',
                bottom: 50,
                duration: 2,
                message: '操作提醒',
                description: '新增成功！'
            }
        )
        this.setState({
            data,
            dataMap,
            rightData: [],
            activeIndex: [],
        });
    }

    // 删除经营计划变更
    deletePlanChange = () => {
        const { data, dataMap, rightData } = this.state;
        util.deleted(data, dataMap, rightData[0]);
        notification.success(
            {
                placement: 'bottomRight',
                bottom: 50,
                duration: 2,
                message: '操作提醒',
                description: '删除成功！'
            }
        )
        this.setState({
            data,
            rightData: [],
            activeIndex: []
        });
    }

    // 修改经营计划变更
    updatePlanChange = (ndata) => {
        const { data, dataMap, rightData } = this.state;
        util.modify(data, dataMap, rightData[0], ndata);
        notification.success(
            {
                placement: 'bottomRight',
                bottom: 50,
                duration: 2,
                message: '操作提醒',
                description: '操作成功！'
            }
        )

        this.setState({
            data,
            dataMap
        })
    }

    render() {
        const { intl } = this.props.currentLocale
        const {activeIndex} = this.state
        const rowSelection = {
            selectedRowKeys: activeIndex,
            onChange: (selectedRowKeys, selectedRows) => { },
            onSelect: (record, selected, selectedRows) => {
                this.setState({
                    selectData: selectedRows
                })
            },
            onSelectAll: (selected, selectedRows, changeRows) => { },
        };

        const columns = [
            {
                title: intl.get('wsd.i18n.operate.prepared.name'),
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: intl.get('wsd.i18n.operate.prepared.code'),
                dataIndex: 'code',
                key: 'code',
            },
            {
                title: intl.get('wsd.i18n.operate.prepared.planstarttime'),
                dataIndex: 'planStartTime',
                key: 'planStartTime',
            },
            {
                title: intl.get('wsd.i18n.operate.prepared.planendtime'),
                dataIndex: 'planEndTime',
                key: 'planEndTime',
            },
            {
                title: intl.get('wsd.i18n.operate.prepared.orgName'),
                dataIndex: 'orgName',
                key: 'orgName',
            },
            {
                title: intl.get('wsd.i18n.operate.prepared.userName'),
                dataIndex: 'userName',
                key: 'userName',
            },
            {
                title: intl.get('wsd.i18n.operate.prepared.planresource'),
                dataIndex: 'planResource',
                key: 'planResource',
            },
            {
                title: intl.get('wsd.i18n.operate.prepared.status'),
                dataIndex: 'status',
                key: 'status',
            },
            {
                title: intl.get('wsd.i18n.operate.prepared.remark'),
                dataIndex: 'remark',
                key: 'remark',
            }
        ]

        return (
            <div>
                <div className={style.main}>
                    <div className={style.leftMain} style={{ height: this.props.height }}>
                        {this.state.data &&
                            <Table rowKey={record => record.id} defaultExpandAllRows={true} pagination={false}
                                name={this.props.name} columns={columns} rowSelection={rowSelection}
                                dataSource={this.state.data} rowClassName={this.setClassName} onRow={(record, index) => {
                                    return {
                                        onClick: (event) => {
                                            this.getInfo(record, index)
                                        }
                                    }
                                }
                                }
                            />
                        }
                    </div>
                    <div className={style.rightBox} style={{ height: this.props.height }}>
                        <RightTags
                            rightTagList={this.state.rightTags}
                            rightData={this.state.rightData}
                            updatePlanChange={this.updatePlanChange}
                        />
                    </div>
                </div>

            </div>

        )
    }
}


const mapStateToProps = state => {
    return {
        currentLocale: state.localeProviderData,
        
    }
};


export default connect(mapStateToProps, null)(OperatePrepared);