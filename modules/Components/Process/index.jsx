import React, { Component } from 'react'
import intl from 'react-intl-universal'
import { Table, Tabs } from 'antd'
import style from './style.less'
const TabPane = Tabs.TabPane;
const locales = {
    "en-US": require('../../../api/language/en-US.json'),
    "zh-CN": require('../../../api/language/zh-CN.json')
}
class Process extends Component {
    constructor(props) {
        super(props)
        this.state = {
            initDone: false,
            data: [
                {
                    key: "121",
                    filename: "筑享云产品开发项目",
                    starttime: "2018-12-21",
                    endtime: "2019-11-21",
                    nodename: "计划员审核",
                    agent: "--",
                    executor: "王胜平",
                    status: "已审批",
                    oprate: "查看（1）"
                },
                {
                    key: "12211",
                    filename: "ACM产品开发项目",
                    starttime: "2018-12-21",
                    endtime: "2019-11-21",
                    nodename: "计划员审核",
                    agent: "--",
                    executor: "何文",
                    status: "已审批",
                    oprate: "查看（5）"
                }

            ]
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
    onClickHandle = () => {

    }
    callback = () => {

    }
    render() {
        const columns = [
            {
                title: intl.get('wsd.i18n.base.planTem.name'),
                dataIndex: 'filename',
                key: 'filename',
            },
            {
                title: "计划开始时间",
                dataIndex: 'starttime',
                key: 'starttime',
            },
            {
                title: "计划完成时间",
                dataIndex: 'endtime',
                key: 'endtime',
            },
            {
                title: "节点名称",
                dataIndex: 'nodename',
                key: 'nodename',
            },
            {
                title: "节点名称",
                dataIndex: 'enclosure',
                key: 'enclosure',
            },
            {
                title: "代办人",
                dataIndex: 'agent',
                key: 'agent',
            },
            {
                title: "执行人",
                dataIndex: 'executor',
                key: 'executor',
            },
            {
                title: "状态",
                dataIndex: 'status',
                key: 'status',
            },
            {
                title: "操作",
                dataIndex: 'oprate',
                key: 'oprate',
            },


        ];

        return (
            <div className={style.main}>
                {this.state.initDone &&
                    <div >
                        <h3 className={style.listTitle}>审批流程</h3>
                        <div className={style.rightTopTogs}>
                            <Tabs defaultActiveKey="1" onChange={this.callback} type="card"
                                tabBarStyle={{ position: "relative", top: "1px" }}>
                                <TabPane tab="已办事项" key="1">
                                    <Table columns={columns} defaultExpandAllRows={true} scroll={{ x: true }} dataSource={this.state.data} pagination={false} name={this.props.name} />
                                </TabPane>
                                <TabPane tab="待办事项" key="2">
                                    <Table columns={columns} defaultExpandAllRows={true} scroll={{ x: true }} dataSource={this.state.data} pagination={false} name={this.props.name} />
                                </TabPane>

                            </Tabs>
                        </div>
                    </div>}
            </div>
        )
    }
}

export default Process
