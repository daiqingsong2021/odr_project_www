import React, { Component } from 'react'
import { Table, notification } from 'antd'
import style from './style.less'

import { connect } from 'react-redux'
import axios from '../../../../api/axios'
import {getPlanTaskPredList, getPlanTaskFollowList, cprtmAdd} from '../../../../api/api'
import MyIcon from "../../../../components/public/TopTags/MyIcon";
import * as dataUtil from "../../../../utils/dataUtil"

class TeamInfo extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            activeStyle: 1,
        }
    }
 
    componentDidMount() {
        this.getPlanTaskPredList()
    }

    // 获取紧前任务列表
    getPlanTaskPredList = () => {
        const { rightData } = this.props
        if (rightData && (rightData[0]['nodeType'] == 'wbs' || rightData[0]['nodeType'] == 'task')) {
            axios.get(getPlanTaskPredList(rightData[0]['id'])).then(res => {
                const { data } = res.data
                this.setState({
                    data,
                    activeStyle: 1
                })
            })
        } else {
            notification.warning(
                {
                    placement: 'bottomRight',
                    bottom: 50,
                    duration: 2,
                    message: '数据类型不符合',
                    description: '所选择的数据类型为task，wbs'
                }
            )
        }
    }

    // 获取后续任务列表
    getPlanTaskFollowList = () => {
        const { rightData } = this.props
        if (rightData && (rightData[0]['nodeType'] == 'wbs' || rightData[0]['nodeType'] == 'task')) {
            axios.get(getPlanTaskFollowList(rightData[0]['id'])).then(res => {
                const { data } = res.data
                this.setState({
                    data,
                    activeStyle: 2
                })
            })
        }
    }
    setClassName = (record, index) => {
        //判断索引相等时添加行的高亮样式
        return record.id === this.state.activeIndex ? "tableActivty" : "";
    }
    getInfo = (record, index) => {
        this.setState({
            activeIndex: record.id
        })
    }

  
    render() {
        const { intl } = this.props.currentLocale;
        const columns = [
            {
                title: "名称",
                dataIndex: 'taskName',
                key: 'taskName',
            },
            {
                title: "代码",
                dataIndex: 'taskCode',
                key: 'taskCode',
            },
            {
                title: "所属计划",
                dataIndex: 'defineName',
                key: 'defineName',
            },
            {
                title: "计划开始",
                dataIndex: 'planStartTime',
                key: 'planStartTime',
                render: (text) =>  dataUtil.Dates().formatDateString(text)
            },
            {
                title: "计划完成",
                dataIndex: 'planEndTime',
                key: 'planEndTime',
                render: (text) =>  dataUtil.Dates().formatDateString(text)
            },
            {
                title: intl.get('wsd.i18n.plan.subTask.iptname'),
                dataIndex: 'org',
                key: 'org',
                render: data => data && data.name
            },
            {
                title: intl.get('wsd.i18n.plan.subTask.username'),
                dataIndex: 'user',
                key: 'user',
                render: data => data && data.name
            },
            {
                title: intl.get('wsd.i18n.plan.subTask.relationtype'),
                dataIndex: 'relationType',
                key: 'relationType',
                editable: true,
                render: (text, record) => <div className="editable-row-text">{text}</div>
            },
            {
                title: "延时",
                dataIndex: 'lagNum',
                key: 'lagNum',
                editable: true,
                render: (text, record) => <div className="editable-row-text">{text}</div>
            }
        ];
        
        return (
            <div className={style.main}>
                <h3 className={style.listTitle}>逻辑关系</h3>
                <div className={style.tabsToggle}>
                    <a href="javascript:void(0)" onClick={this.getPlanTaskPredList} className={this.state.activeStyle == 1 ? style.active : ''}>紧前任务</a>
                    <a href="javascript:void(0)" onClick={this.getPlanTaskFollowList} className={this.state.activeStyle == 2 ? style.active : ''}>后续任务</a>
                </div>
                <div className={style.mainScorll}>
                    <Table
                        rowKey={record => record.id}
                        className={style.table}
                        columns={columns}
                        dataSource={this.state.data}
                        pagination={false}
                        size='small'
                        name={this.props.name}
                        rowClassName={this.setClassName}
                        
                        onRow={(record, index) => {
                              return {
                                  onClick: () => {
                                      this.getInfo(record, index)
                                  }
                              }
                          }
                        }
                    />
                </div>
            </div>
        )
    }
}

export default connect(state => ({
    currentLocale: state.localeProviderData
}))(TeamInfo)
