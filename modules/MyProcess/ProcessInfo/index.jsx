import React, { Component } from 'react'

import { Table, Icon,notification} from 'antd'
import style from './style.less'
import ProcessDealBtn from "../../../components/public/TopTags/ProcessDealBtn"
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import * as processAction from '../../../store/process/action';
import ProcessLogModal from "./ProcessLogModal"
import FlowChartModal from "./FlowChartModal"
import axios from "../../../api/axios"
import {processList} from "../../../api/api"
import * as dataUtil from "../../../utils/dataUtil"
class FileInfo extends Component {
    constructor(props) {
        super(props)
        this.state = {
       
            data: []
        }
    }

    componentDidMount() {
        if(this.props.data.id){
            axios.get(processList(this.props.data.id,this.props.bizType)).then(res=>{
                this.setState({
                    data:res.data.data
                })
            })
        }
    }

    
    onClickHandle = (name) => {
        const { intl } = this.props.currentLocale
     
        if(this.props.menuInfo){
            //保存流程位置
            if(!this.state.rightData){
                notification.warning(
                    {
                        placement: 'bottomRight',
                        bottom: 50,
                        duration: 2,
                        message: '未选中数据',
                        description: '请选择数据进行操作'
                    }
                )
                return
            }
            this.props.actions.saveProcessUrl({address:this.props.menuInfo.url,formId:this.state.rightData.id})
            this.props.callBackBanner({ menuName: intl.get("wbs.il8n.process.processhandle"), url: "MyProcess/ProcessHandle", id: 345, parentId: 0 });
        }
        
    }
    callback = () => {

    }
    //table表格单行点击回调
    getInfo = (record, index) => {

        let id = record.id, records = record
        if (this.state.activeIndex == id) {

            this.setState({
                activeIndex: null,
                rightData: null
            })
        } else {
            this.setState({
                activeIndex: id,
                rightData: record
            })
        }

    }

    setClassName = (record, index) => {
        //判断索引相等时添加行的高亮样式
        return record.id === this.state.activeIndex ? "tableActivty" : "";
    }
    //显示流程日志
    showProocessLogModal=(record)=>{
        this.setState({
            isShowLog:true,
            logId:record.id
        })
    }
    closeProocessLogModal=()=>{
        this.setState({
            isShowLog:false
        })
    }
    //
    showFlowChartModal=(record)=>{
        // this.setState({
        //     isShowFlow:true
        // })
        window.open("http://127.0.0.1:8081/modeler-display.html?procInstId="+record.id, "_blank");
    }
    closeFlowChartModal=()=>{
        this.setState({
            isShowFlow:false
        })
    }
    render() {
        const { intl } = this.props.currentLocale
        const columns = [
            {
                title: intl.get('wsd.i18n.base.planTem.name'),
                dataIndex: 'name',
                key: 'name',
                render: (text, record) => (
                    <span> <Icon type="eye" onClick={this.showFlowChartModal.bind(this,record)} style={{marginRight:"5px"}}/>{text}</span>
                  )
            },
            {
                title: intl.get("wbs.il8n.process.starttime"),
                dataIndex: 'startTime',
                key: 'startTime',
                render: (text) =>  dataUtil.Dates().formatDateString(text)
            },
            {
                title:  intl.get("wbs.il8n.process.endtime"),
                dataIndex: 'endTime',
                key: 'endTime',
                render: (text) =>  dataUtil.Dates().formatDateString(text)
            },
            {
                title:  intl.get("wbs.il8n.process.currentnode"),
                dataIndex: 'activity',
                key: 'activity',
            },
            {
                title:  intl.get("wbs.il8n.process.waitdoer"),
                dataIndex: 'creator',
                key: 'creator',
                render: (text, record) =>text? text.name:null
            },
            {
                title:  intl.get("wbs.il8n.process.staytime"),
                dataIndex: 'stayTime',
                key: 'stayTime',
            },
            {
                title:  intl.get("wsd.i18n.sys.ipt.statusj"),
                dataIndex: 'status',
                key: 'status',
                //render: (text, record) =>text? text.name:null
            },
            {
                title: intl.get("wsd.i18n.plan.activitybiz.logger"),
                dataIndex: 'oprate',
                key: 'oprate',
                render: (text, record) => (
                    <span>
                      <a href="javascript:;" onClick={this.showProocessLogModal.bind(this,record)}>{intl.get("wbs.il8n.process.look")}</a>
                    </span>
                  )
            },
        ];
        
        return (
            <div className={style.main}>
         
                    <div className={style.mainHeight}>
                        <h3 className={style.listTitle}>{intl.get("wbs.il8n.process.processinfo")}</h3>
                        <div className={style.rightTopTogs}>
                            <ProcessDealBtn onClickHandle={this.onClickHandle.bind(this)}></ProcessDealBtn>
                        </div>
                        <div className={style.mainScorll} >
                        <Table columns={columns} dataSource={this.state.data} pagination={false} name={this.props.name}  
                        size="small"
                         rowClassName={this.setClassName}
                         onRow={(record, index) => {
                             return {
                                 onClick: (event) => {
                                     this.getInfo(record, index)
                                 }
                             }
                         }
                         }
                     />
                        </div>
                       
                        {this.state.isShowLog && <ProcessLogModal handleCancel={this.closeProocessLogModal.bind(this)} id={this.state.logId}></ProcessLogModal>}
                        {this.state.isShowFlow && <FlowChartModal handleCancel={this.closeFlowChartModal.bind(this)} index={3}></FlowChartModal>}
                    </div>
            </div>
        )
    }
}


const mapStateToProps = state => {
    return {
        currentLocale: state.localeProviderData,
    }
};

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(Object.assign({}, processAction), dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(FileInfo);
