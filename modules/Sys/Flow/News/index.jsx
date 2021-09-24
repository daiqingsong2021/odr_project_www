import React, { Component } from 'react'
import style from './style.less'
import { Icon, Table } from 'antd'
import intl from 'react-intl-universal'
import AddLogs from './../AddLogs/'
import ViewBtn from '../../../../components/public/TopTags/ViewBtn' //视图按钮
import ModifyTopBtn from '../../../../components/public/TopTags/ModifyTopBtn' //修改按钮
const locales = {
    "en-US": require('../../../../api/language/en-US.json'),
    "zh-CN": require('../../../../api/language/zh-CN.json')
}



export class FlowNews extends Component {
    constructor(props) {
        super(props)
        this.state = {
            initDone: false,
            addLogsShow: false,  // 控制新增弹窗
            data: [{
                wfname: '报送流程',
                starttime: '2018-1-27',
                endtime: '2019-1-27',
                releasename: '',
                nodeing: '结束',
                status: '完成',
                logger: <span><a onClick={this.seeLogs}>查看</a></span>,
            }]
        }
    }

    componentDidMount() {
        this.loadLocales();
    }
    seeLogs = () => {

    }
    loadLocales() {
        intl.init({
            currentLocale: 'zh-CN',
            locales,
        })
            .then(() => {
                // After loading CLDR locale data, start to render
                this.setState({ initDone: true });
            });
    }

    // 设置新增用户弹窗的显示和隐藏
    seeLogs = () => {
        this.setState({
            addLogsShow: true
        })
    }
    onCancel = () => {
        this.setState({
            addLogsShow: false
        })
    }

    render() {
        const columns = [
            {
                title: intl.get('wsd.i18n.plan.activitybiz.wfname'),
                dataIndex: 'wfname',
                key: 'wfname',
            },
            {
                title: intl.get('wsd.i18n.plan.activitybiz.starttime'),
                dataIndex: 'startTime',
                key: 'startTime',
            },
            {
                title: intl.get('wsd.i18n.plan.activitybiz.endtime'),
                dataIndex: 'endTime',
                key: 'endTime',
            },
            {
                title: intl.get('wsd.i18n.plan.activitybiz.releasename'),
                dataIndex: 'releaseName',
                key: 'releaseName',
            },
            {
                title: intl.get('wsd.i18n.plan.activitybiz.nodeing'),
                dataIndex: 'nodeing',
                key: 'nodeing',
            },
            {
                title: intl.get('wsd.i18n.plan.activitybiz.status'),
                dataIndex: 'status',
                key: 'status',
            },
            {
                title: intl.get('wsd.i18n.plan.activitybiz.logger'),
                dataIndex: 'logger',
                key: 'logger',
            },
        ];

        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
            },
            onSelect: (record, selected, selectedRows) => {
            },
            onSelectAll: (selected, selectedRows, changeRows) => {
            },
        };
        const showFormModal = (name, e) => {

        }
        return (
            <div className={style.main}>

                {this.state.initDone && 
                <div className={style.mainHeight}>
                    <h3 className={style.listTitle}>流程实例</h3>
                    <div className={style.rightTopTogs}>
                        <ViewBtn onClickHandle={showFormModal} />
                        <ModifyTopBtn onClickHandle={showFormModal} />
                    </div>
                    <div className={style.mainScorll} >
                    <Table
                        columns={columns}
                        dataSource={this.state.data}
                        rowSelection={rowSelection}
                      
                        pagination={false}
                        rowKey={record => record.wfname}
                    />
                    </div>
                    
                </div>}
                <AddLogs addLogsShow={this.state.addLogsShow} onCancel={this.onCancel} />
            </div>
        )
    }
}

export default FlowNews
