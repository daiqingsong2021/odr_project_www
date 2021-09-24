import React, { Component } from 'react'
import style from './style.less'
import { Form, Row, Col, Input, Table, Icon, Select } from 'antd'
import intl from 'react-intl-universal'
import moment from 'moment'
import ProcessDealBtn from '../../../../components/public/TopTags/ProScheduleTopBtn'
import ProcessLogModal from './ProcessLogModal/index'

import { connect } from 'react-redux'
import { curdCurrentData } from '../../../../store/curdData/action'

const locales = {
    "en-US": require('../../../../api/language/en-US.json'),
    "zh-CN": require('../../../../api/language/zh-CN.json')
}
const FormItem = Form.Item;
const Option = Select.Option
const { TextArea } = Input;
class MenuInfo extends Component {
    constructor(props) {
        super(props)
        this.state = {
            initDone: false,                 //国际化初始化状态
            info: {},                        //基本信息
            ProcessVisible: false,
            columns: [{
                title: '名称',
                dataIndex: 'name',
                key: 'name',
                render: text => <span> <Icon type="eye" className={style.icon} />{text}</span>
            }, {
                title: '开始时间',
                dataIndex: 'time',
                key: 'time',
            }, {
                title: '完成时间',
                dataIndex: 'updateTime',
                key: 'updateTime',
            }, {
                title: '当前所属节点',
                dataIndex: 'theHeir',
                key: 'theHeir',
            }, {
                title: '待办人停留时间',
                dataIndex: 'docState',
                key: 'docState',
            }, {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
            }, {
                title: '日志',
                dataIndex: 'jou',
                key: 'jou',
                render: (text, record, index) => <a href="javascript:;" onClick={this.logModal.bind(this, record, index)}>{text}</a>
            }],
            data: [{
                key: '1',
                updateTime: '2019-01-11',
                theHeir: '计划员审核',
                docState: '王胜平--',
                name: 'EC00620-pmis.xls',
                time: '2019-01-11',
                creator: '任正华',
                status: '已完成',
                jou: '查看'
            }]
        }
    }

    logModal = (record, index)=>{
        this.setState({ProcessVisible: true})
    }

    componentDidMount() {
        this.loadLocales();
        this.setState({
            info: this.props.data
        })
    }

    loadLocales() {
        intl.init({
            currentLocale: 'zh-CN',
            locales,
        }).then(() => {
            this.setState({ initDone: true });
        });
    }

    rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
        },

    }

    handleCancel=()=>{
        this.setState({ProcessVisible: false});
    }

    render() {

        return (
            <div className={style.main}>
                {this.state.initDone && (
                    <div className={style.mainHeight}>
                        <h3 className={style.listTitle}>流程处理</h3>
                        <div className={style.mainScorll}>
                            <ProcessDealBtn />
                            <Table rowKey={record => record.key} rowSelection={this.rowSelection} columns={this.state.columns} dataSource={this.state.data}
                                pagination={false}
                            />

                        </div>
                    </div>
                )}
                <ProcessLogModal handleCancel={this.handleCancel} ProcessVisible={this.state.ProcessVisible} />
            </div>
        )
    }
}

export default connect(store=>({
    currentLocale: store.localeProviderData.currentLocale
}), {
    curdCurrentData
})(MenuInfo);