import React, { Component } from 'react'
import style from './style.less'
import { Modal, Table, Button, notification } from 'antd';
import { connect } from 'react-redux'

import { questionCancelRelease } from '../../../../api/api'
import{questionReleaseList,questionRelease} from '../../../../api/suzhou-api'
import axios from '../../../../api/axios';
import * as dataUtil from "../../../../utils/dataUtil";

import { queryQuestionList,publishQuestion} from '../../../Suzhou/api/suzhou-api'
import { queryParams } from '@/modules/Suzhou/components/Util/util';
import Search from '@/modules/Suzhou//components/Search';


export class PlanPreparedRelease extends Component {
    constructor(props) {
        super(props)
        this.state = {
            initDone: false,
            columns: [],
            selectDataId: [],
            data: [],
            selectedRowKeys: [],
            pageSize: 10,
            currentPage: 1,
        }
    }
    componentDidMount() {
        //获取发布列表
        this.getquestionReleaseList(this.props.params)
    }
    // 获取发布列表
    getquestionReleaseList = (params) => {
        axios.get(queryQuestionList(this.state.pageSize, this.state.currentPage)+queryParams({...params})).then((result) => {
            let data = result.data.data;
            if (data.length != 0) {
                this.setState({
                    data
                })
            }
        })
    }
    handleOk = () => {
        const { intl } = this.props.currentLocale;
        let { selectedRowKeys } = this.state;
        // 当前要操作数据不可以为空
        if (selectedRowKeys.length === 0) {
            notification.warning(
                {
                    placement: 'bottomRight',
                    bottom: 50,
                    duration: 2,
                    message: intl.get('wsd.global.tip.title2'),
                    description: intl.get('wsd.global.tip.content2')
                }
            )
            return;
        };
        // let url = dataUtil.spliceUrlParams(questionRelease,{"startContent": "项目【"+ this.props.projectName +"】"});
        axios.post(publishQuestion, selectedRowKeys, true, intl.get('wsd.i18n.comcate.profdback.releasesuccess'),true).then((result) => {
            this.props.update()
            this.props.handleCancel();
            this.setState({
                selectedRowKeys: []
            })
        }).catch((err) => {
        });

    }

    search = (val) => {
        this.setState({
            ...this.state.params,
            title:val
        },()=>{
            this.getquestionReleaseList(this.state.params);
        })
        
    }

    render() {
        const { intl } = this.props.currentLocale;
        const columns = [
            {
                title: intl.get('wsd.i18n.plan.projectquestion.problemdescription'),//问题描述
                dataIndex: 'title',
                key: 'title',
            },
            {
                title: intl.get('wsd.i18n.plan.activitydefineinfo.projectname'),//项目
                dataIndex: 'project',
                key: 'project',
            },
            {
              title: '问题来源',//问题来源
              dataIndex: 'source',
              key: 'source',
            },
            {
                title: intl.get('wsd.i18n.comu.question.questiontype'),//问题类型
                dataIndex: 'type',
                key: 'type',
                render: text => text ? text.name : ''
            },
            {
                title: intl.get('wsd.i18n.comu.question.questionpriority'),//优先级
                dataIndex: 'priority',
                key: 'priority',
                render: text => text ? text.name : ''
            },
            {
                title: intl.get('wsd.i18n.comu.meetingaction.iptname'),//责任主体
                dataIndex: 'org',
                key: 'org',
                render: text => text ? text.name : ''
            },
            {
                title: intl.get('wsd.i18n.comu.meetingaction.username'),//责任人
                dataIndex: 'user',
                key: 'user',
                render: text => text ? text.name : ''
            }
        ];

        let { selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
                this.setState({
                    selectedRowKeys,
                })
            },

        };
        return (
            <Modal className={style.main} width="850px"
                centered={true}
                title={intl.get('wsd.i18n.comu.profdback.directrelease')}
                visible={this.props.modalVisible}
                onOk={this.handleOk}
                onCancel={this.props.handleCancel}
                bodyStyle={{ padding: 0 }}
                mask={false} maskClosable={false}
                footer={
                    <div className="modalbtn">
                        {/* 关闭 */}
                        <Button key={2} onClick={this.props.handleCancel} > {intl.get('wsd.global.btn.close')} </Button>
                        {/* 保存 */}
                        <Button key={3} onClick={this.handleOk} type="primary"> {'确定'} </Button>
                    </div>
                }
            >
                <div className={style.tableMain}>
                    <div className={style.search}>
                        <Search search={this.search} placeholder={'问题标题'} />
                    </div>
                    <Table rowKey={record => record.id} defaultExpandAllRows={true} pagination={false} name={this.props.name} columns={columns}
                        rowSelection={rowSelection} dataSource={this.state.data} />
                </div>
            </Modal>
        )
    }
}


export default connect(state => ({
    currentLocale: state.localeProviderData
}))(PlanPreparedRelease)
