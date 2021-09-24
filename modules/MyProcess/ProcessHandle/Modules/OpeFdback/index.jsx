import React, { Component } from 'react'
import intl from 'react-intl-universal'

import { Table, Progress, notification } from 'antd'

import style from './style.less'

import RightTags from '../../../../../components/public/RightTags'
// 引入redux方法
import { connect } from 'react-redux'
import * as util from '../../../../../utils/util';

const data1 = [
    {
        id: 1,
        type: '指标',
        parentPath: '--',
        name: '指标1',
        planStartTime: '2018-08-10',
        planEndTime: '2018-12-11',
        orgName: '研发部',
        userName: '孙博宇',
        complete: 80,
        actualStart: '2018-08-10',
        actualCompletion: '2018-12-11',
        completionRatio: 80,
        progressEvaluation: 1,
        feedbackTime: '2018-12-11',
        currentCompletion: '123213',
        causeanAlysis: 'rererew',
        suggestion: 'sadas',
        remark: '--',
        children: [
            {
                id: 2,
                type: '任务1',
                parentPath: '--',
                name: '指标1',
                planStartTime: '2018-08-10',
                planEndTime: '2018-12-11',
                orgName: '研发部',
                userName: '孙博宇',
                complete: 30,
                actualStart: '2018-08-10',
                actualCompletion: '2018-12-11',
                completionRatio: 80,
                progressEvaluation: 1,
                feedbackTime: '2018-12-11',
                currentCompletion: '123213',
                causeanAlysis: 'rererew',
                suggestion: 'sadas',
                remark: '--',
            }
        ]
    }
]

const data2 = [
    {
        id: 1,
        type: '指标',
        parentPath: '--',
        name: '指标1',
        planStartTime: '2018-08-10',
        planEndTime: '2018-12-11',
        orgName: '研发部',
        userName: '孙博宇',
        complete: 80,
        actualStart: '2018-08-11',
        actualCompletion: '2018-12-12',
        completionRatio: 80,
        progressEvaluation: '1',
        feedbackTime: '2018-12-11',
        currentCompletion: '123213',
        causeanAlysis: 'rererew',
        suggestion: 'sadas',
        remark: '--'
    },
    {
        id: 2,
        type: '任务1',
        parentPath: '--',
        name: '指标1',
        planStartTime: '2018-08-10',
        planEndTime: '2018-12-11',
        orgName: '研发部',
        userName: '孙博宇',
        complete: 30,
        actualStart: '2018-08-10',
        actualCompletion: '2018-12-11',
        completionRatio: 30,
        progressEvaluation: '1',
        feedbackTime: '2018-12-11',
        currentCompletion: '123213',
        causeanAlysis: 'rererew',
        suggestion: 'sadas',
        remark: '--',
    }
]

export class OperateFdback extends Component {
    constructor(props) {
        super(props)
        this.state = {
            rightTags: [
                { icon: 'iconjindujixian', title: '进展填报', fielUrl: 'Operate/OpeFdback/Progress' },
                { icon: 'iconrizhi', title: '反馈记录', fielUrl: 'Operate/OpeFdback/Record' },
                { icon: 'iconliuchengxinxi', title: '流程信息', fielUrl: 'MyProcess/ProcessInfo' },
            ],
            columns: [],
            data: data2,
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

    componentDidMount() {
        const { data } = this.state
        const dataMap = util.dataMap(data);
        this.setState({
            data,
            dataMap
        })
    }

    // 新增经营计划反馈
    addPlanFdback = (ndata) => {
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

    // 删除经营计划反馈
    deletePlanFdback = () => {
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

    // 修改经营计划反馈
    updatePlanFdback = (ndata) => {
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

    // modal取消
    handleCancel = () => {
        this.setState({
            modalVisible: false
        })
    }

    toggleTableView = (title) => {
        this.setState({
            data: title == 'tree' ? data1 : data2
        })
    }

    render() {
        const { intl } = this.props.currentLocale
        const { activeIndex } = this.state
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
                title: intl.get('wsd.i18n.operate.fdback.type'),
                dataIndex: 'type',
                key: 'type',
            },
            {
                title: intl.get('wsd.i18n.operate.fdback.parentpath'),
                dataIndex: 'parentPath',
                key: 'parentPath',
            },
            {
                title: intl.get('wsd.i18n.operate.fdback.name'),
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: intl.get('wsd.i18n.operate.fdback.planstarttime'),
                dataIndex: 'planStartTime',
                key: 'planStartTime',
            },
            {
                title: intl.get('wsd.i18n.operate.fdback.planendtime'),
                dataIndex: 'planEndTime',
                key: 'planEndTime',
            },
            {
                title: intl.get('wsd.i18n.operate.fdback.orgname'),
                dataIndex: 'orgName',
                key: 'orgName',
            },
            {
                title: intl.get('wsd.i18n.operate.fdback.username'),
                dataIndex: 'userName',
                key: 'remark',
            },
            {
                title: intl.get('wsd.i18n.operate.fdback.complete'),
                dataIndex: 'complete',
                key: 'complete',
                render: text => (
                    <Progress percent={text} />
                )
            }
        ]

        return (
            <div>
             
                <div className={style.main}>
                    <div className={style.leftMain} style={{ height: this.props.height }}>
                        <Table rowKey={record => record.id} defaultExpandAllRows={true} pagination={false}
                            name={this.props.name} columns={columns} rowSelection={rowSelection}
                            dataSource={this.state.data} rowClassName={this.setClassName} onRow={(record, index) => {
                                return {
                                    onClick: (event) => {
                                        this.getInfo(record, index)
                                    }
                                }
                            }
                            } />
                    </div>
                    <div className={style.rightBox} style={{ height: this.props.height }}>
                        <RightTags
                         rightTagList={this.state.rightTags} 
                         rightData={this.state.rightData} 
                         updatePlanFdback={this.updatePlanFdback} 
                         callBackBanner={this.props.callBackBanner}
                         menuInfo={this.props.menuInfo}
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
        processUrl: state.process
    }
};


export default connect(mapStateToProps, null)(OperateFdback);