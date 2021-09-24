import React, { Component } from 'react'
import style from './style.less'
import { Icon, Table, Checkbox, Input } from 'antd'
import intl from 'react-intl-universal'

const locales = {
    "en-US": require('../../../../api/language/en-US.json'),
    "zh-CN": require('../../../../api/language/zh-CN.json')
}



export class FlowSetUp extends Component {
    constructor(props) {
        super(props)
        this.state = {
            initDone: false,
            addShow: false,  // 控制新增弹窗
            data: [{
                id:1,
                nodeName: '业务变量名称',
                edit: <span><Checkbox></Checkbox></span>,
                detele: <span><Checkbox></Checkbox></span>,
                end: <span><Checkbox></Checkbox></span>,
                doSth: <span><Checkbox></Checkbox></span>,
                agency: <span><Checkbox></Checkbox></span>,
                remind: <span><Checkbox></Checkbox></span>,
                data: <span><Checkbox></Checkbox></span>,
                subName: <span><Input /></span>,
                join: <span><Input /></span>,
                default: <span><Input /></span>,
                appoint: <span><Input /></span>,
            }]
        }
    }

    componentDidMount() {
        this.loadLocales();
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
    addModelShow = () => {
        this.setState({
            addShow: true
        })
    }
    onCancel = () => {
        this.setState({
            addShow: false
        })
    }

    render() {
        const columns = [
            {
                title: intl.get('wsd.i18n.plan.activitydefineinfo.nodeName'),
                dataIndex: 'nodeName',
                key: 'nodeName',
            },
            {
                title: intl.get('wsd.i18n.plan.activitydefineinfo.edit'),
                dataIndex: 'edit',
                key: 'edit',
            },
            {
                title: intl.get('wsd.i18n.plan.activitydefineinfo.detele'),
                dataIndex: 'detele',
                key: 'detele',
            },
            {
                title: intl.get('wsd.i18n.plan.activitydefineinfo.end'),
                dataIndex: 'end',
                key: 'end',
            },
            {
                title: intl.get('wsd.i18n.plan.activitydefineinfo.doSth'),
                dataIndex: 'doSth',
                key: 'doSth',
            },
            {
                title: intl.get('wsd.i18n.plan.activitydefineinfo.agency'),
                dataIndex: 'agency',
                key: 'agency',
            },
            {
                title: intl.get('wsd.i18n.plan.activitydefineinfo.remind'),
                dataIndex: 'remind',
                key: 'remind',
            },
            {
                title: intl.get('wsd.i18n.plan.activitydefineinfo.data'),
                dataIndex: 'data',
                key: 'data',
            },
            {
                title: intl.get('wsd.i18n.plan.activitydefineinfo.subName'),
                dataIndex: 'subName',
                key: 'subName',
            },
            {
                title: intl.get('wsd.i18n.plan.activitydefineinfo.join'),
                dataIndex: 'join',
                key: 'join',
            },
            {
                title: intl.get('wsd.i18n.plan.activitydefineinfo.default'),
                dataIndex: 'default',
                key: 'default',
            },
            {
                title: intl.get('wsd.i18n.plan.activitydefineinfo.appoint'),
                dataIndex: 'appoint',
                key: 'appoint',
            }
        ];

        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
            },
            onSelect: (record, selected, selectedRows) => {
            },
            onSelectAll: (selected, selectedRows, changeRows) => {
            },
        };

        return (
            <div className={style.main}>

                {this.state.initDone &&
                     <div className={style.mainHeight}>
                        <h3 className={style.listTitle}>流程设置</h3>
                        <div className={style.mainScorll} >
                        <Table
                            columns={columns}
                            dataSource={this.state.data}
                            // rowSelection={rowSelection}
                            pagination={false}

                            rowKey={record => record.id}
                        />
                        </div>
                        
                    </div>}
            </div>
        )
    }
}

export default FlowSetUp
