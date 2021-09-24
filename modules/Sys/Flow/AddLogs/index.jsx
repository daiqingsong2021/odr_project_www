import React, {Component} from 'react'
import style from './style.less'
import { Modal, Table,Button  } from 'antd';
import intl from 'react-intl-universal'
const locales = {
    "en-US": require('../../../../api/language/en-US.json'),
    "zh-CN": require('../../../../api/language/zh-CN.json')
}



export class FlowWork extends Component {
    constructor (props) {
        super (props)
        this.state = {
            data: [{
                newsName: '报送流程',
                nodeName:'送审',
                joinName: '张三',
                creattime: '',
                czName: '',
                czTime:'',
                czType:'同意',
                view:'ok'
            }]
        }
    }
    

    render () {
        const columns = [
            {
                title: intl.get('wsd.i18n.plan.activitybiz.newsName'),
                dataIndex: 'newsName',
                key: 'newsName',
            },
            {
                title: intl.get('wsd.i18n.plan.activitydefineinfo.nodeName'),
                dataIndex: 'nodeName',
                key: 'nodeName',
            },
            {
                title: intl.get('wsd.i18n.plan.activitybiz.joinName'),
                dataIndex: 'joinName',
                key: 'joinName',
            },
            {
                title: intl.get('wsd.i18n.base.docTem.creattime'),
                dataIndex: 'creattime',
                key: 'creattime',
            },
            {
                title: intl.get('wsd.i18n.plan.activitybiz.czName'),
                dataIndex: 'czName',
                key: 'czName',
            },
            {
                title: intl.get('wsd.i18n.plan.activitybiz.czTime'),
                dataIndex: 'status',
                key: 'status',
            },
            {
                title: intl.get('wsd.i18n.plan.activitybiz.czType'),
                dataIndex: 'logger',
                key: 'logger',
            },
            {
                title: intl.get('wsd.i18n.plan.activitybiz.view'),
                dataIndex: 'view',
                key: 'view',
            },
        ];
        return (
            <div className={style.main}>
                  <Modal
                    title="流程实例日志"
                    footer={null}
                    bodyStyle={{padding:0,minHeight:'300px'}}
                    width="850px"
                    footer={<div className="modalbtn">
                      <Button key={1} onClick={this.props.onCancel}>取消</Button>
                      <Button key={2} onClick={this.handleSubmit} type="primary">保存</Button>
                    </div>}
                    // centered={true}
                    visible={this.props.addLogsShow}
                    onCancel={this.props.onCancel}
                    >
                         <Table 
                    columns={columns} 
                    dataSource={this.state.data} 
                    // rowSelection={rowSelection}
                    pagination={false}
                    rowKey={record => record.newsName}
                    /> 
                
                </Modal>
                
            </div>
        )
    }
}

export default FlowWork
