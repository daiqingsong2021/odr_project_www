import React, { Component } from 'react'
import { Table, notification } from 'antd'
import style from './style.less'

import { connect } from 'react-redux'
import axios from '../../../../api/axios'
import {getPlanTaskrsrcList, cprtmDel, cprtmAdd} from '../../../../api/api'
import MyIcon from "../../../../components/public/TopTags/MyIcon";
import * as dataUtil from "../../../../utils/dataUtil"

class TeamInfo extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            selectedRowKeys: [],
        }
    }
 
    componentDidMount() {
        this.getPlanTaskrsrcList()
    }
      // 获取资源计划列表
      getPlanTaskrsrcList = () => {
        const { rightData } = this.props
        if (rightData && (rightData[0]['nodeType'] == 'wbs' || rightData[0]['nodeType'] == 'task')) {
            axios.get(getPlanTaskrsrcList(rightData[0]['id'])).then(res => {
                const { data } = res.data
                this.setState({
                    data
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
                    title: intl.get('wsd.i18n.plan.rsrcPlan.rsrcname'),
                    dataIndex: 'rsrcName',
                    key: 'rsrcName',
                },
                {
                    title: intl.get('wsd.i18n.plan.rsrcPlan.rsrccode'),
                    dataIndex: 'rsrcCode',
                    key: 'rsrcCode',
                },
                {
                    title: intl.get('wsd.i18n.plan.rsrcPlan.unit'),
                    dataIndex: 'unit',
                    key: 'unit',
                },
                {
                    title: "单位最大用量(h)",
                    dataIndex: 'maxUnit',
                    key: 'maxUnit',
                },
                {
                    title: "预算用量(h)",
                    dataIndex: 'budgetQty',
                    key: 'budgetQty',
                    editable: true,
                    render: (text, record) => <div className="editable-row-text">{text}</div>
                },
                {
                    title: "预算单价(￥)",
                    dataIndex: 'budgetUnit',
                    key: 'budgetUnit',
                    editable: true,
                    render: (text, record) => <div className="editable-row-text">{text}</div>
                },
                {
                    title: "预算成本(￥)",
                    dataIndex: 'budgetCost',
                    key: 'budgetCost',
                    editable: true,
                    render: (text, record) => <div className="editable-row-text">{text}</div>
                },
                {
                    title: "计划开始时间",
                    dataIndex: 'planStartTime',
                    key: 'planStartTime',
                    width: 120,
                    editable: true,
                    render: (text, record) => <div className="editable-row-text">{dataUtil.Dates().formatDateString(text)}</div>
                },
                {
                    title: "计划完成时间",
                    dataIndex: 'planEndTime',
                    key: 'planEndTime',
                    width: 120,
                    editable: true,
                    render: (text, record) => <div className="editable-row-text">{dataUtil.Dates().formatDateString(text)}</div>
                },
                {
                    title: intl.get('wsd.i18n.plan.rsrcPlan.actstarttime'),
                    dataIndex: 'actStartTime',
                    key: 'actStartTime',
                    render: (text) =>  dataUtil.Dates().formatDateString(text)
                },
                {
                    title: intl.get('wsd.i18n.plan.rsrcPlan.actendtime'),
                    dataIndex: 'actEndTime',
                    key: 'actEndTime',
                    render: (text) =>  dataUtil.Dates().formatDateString(text)
                },
                {
                    title: intl.get('wsd.i18n.plan.rsrcPlan.actamount'),
                    dataIndex: 'actQty',
                    key: 'actQty',
                },
                {
                    title: intl.get('wsd.i18n.plan.rsrcPlan.actunitprice'),
                    dataIndex: 'actUnit',
                    key: 'actUnit',
                },
                {
                    title: intl.get('wsd.i18n.plan.rsrcPlan.actcost'),
                    dataIndex: 'actCost',
                    key: 'actCost',
                }

        ];
       
        return (
            <div className={style.main}>
                <h3 className={style.listTitle}>资源计划</h3>
             
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
                                  },
                                  onDoubleClick: (event) => {
                                      event.currentTarget.getElementsByClassName("ant-checkbox-wrapper")[0].click();
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
