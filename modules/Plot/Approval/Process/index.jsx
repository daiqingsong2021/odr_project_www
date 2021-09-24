import React, { Component } from 'react'
import intl from 'react-intl-universal'
import { Table, Spin,Icon} from 'antd'
import style from './style.less'
import ProcessDealBtn from "../../../../components/public/TopTags/ProcessDealBtn"

import dynamic from 'next/dynamic'
const locales = {
    "en-US": require('../../../../api/language/en-US.json'),
    "zh-CN": require('../../../../api/language/zh-CN.json')
}
class FileInfo extends Component {
    constructor(props) {
        super(props)
        this.state = {
            initDone: false,
            data: [],
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
    //显示流程日志
    showProocessLogModal=()=>{
        this.setState({
            isShowLog:true
        })
    }
    closeProocessLogModal=()=>{
        this.setState({
            isShowLog:false
        })
    }
    //
    showFlowChartModal=()=>{
        this.setState({
            isShowFlow:true
        })
    }
    closeFlowChartModal=()=>{
        this.setState({
            isShowFlow:false
        })
    }
    render() {
        const ProcessLogModal = dynamic(import('./ProcessLogModal/index'), {
            loading: () => <Spin size="small" />
        })
        const FlowChartModal = dynamic(import('./FlowChartModal/index'), {
            loading: () => <Spin size="small" />
        })
        const columns = [
            {
                title: intl.get('wsd.i18n.base.planTem.name'),
                dataIndex: 'filename',
                key: 'filename',
                render: (text, record) => (
                    <span> <Icon type="eye" onClick={this.showFlowChartModal.bind(this.record)} style={{marginRight:"5px"}}/>{text}</span>
                  )
            },
            {
                title: "开始时间",
                dataIndex: 'starttime',
                key: 'starttime',
            },
            {
                title: "完成时间",
                dataIndex: 'endtime',
                key: 'endtime',
            },
            {
                title: "当前所属节点",
                dataIndex: 'nodename',
                key: 'nodename',
            },
            {
                title: "待办人",
                dataIndex: 'agent',
                key: 'agent',
            },
            {
                title: "停留时间",
                dataIndex: 'executor',
                key: 'executor',
            },
            {
                title: "状态",
                dataIndex: 'status',
                key: 'status',
            },
            {
                title: "日志",
                dataIndex: 'oprate',
                key: 'oprate',
                render: (text, record) => (
                    <span>
                      <a href="javascript:;" onClick={this.showProocessLogModal.bind(this,record)}>查看</a>
                    </span>
                  )
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
        return (
            <div className={style.main}>
                {this.state.initDone &&
                    <div className={style.mainHeight}>
                        <h3 className={style.listTitle}>流程信息</h3>
                        <div className={style.rightTopTogs}>
                            <ProcessDealBtn onClickHandle={this.onClickHandle.bind(this)}></ProcessDealBtn>
                        </div>
                        <div className={style.mainScorll} >
                        <Table columns={columns} dataSource={this.state.data} pagination={false} name={this.props.name} rowSelection={rowSelection} />
                        </div>
                       
                        {this.state.isShowLog && <ProcessLogModal handleCancel={this.closeProocessLogModal.bind(this)}></ProcessLogModal>}
                        {this.state.isShowFlow && <FlowChartModal handleCancel={this.closeFlowChartModal.bind(this)} index={3}></FlowChartModal>}
                    </div>}
            </div>
        )
    }
}

export default FileInfo
