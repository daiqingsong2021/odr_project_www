import React, { Component } from 'react'
import { Table, Icon, notification,Modal, Button } from 'antd'
import style from './style.less'
import PublicButton from "../../../../components/public/TopTags/PublicButton"
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import * as processAction from '../../../../store/process/action';
import axios from "../../../../api/axios"
import { processList, getTaskIdByProcInstId } from "../../../../api/api"
import * as dataUtil from "../../../../utils/dataUtil"
import ProcLog from "../ProcLog"
import PageTable from '../../../../components/PublicTable'
import { baseURL } from '../../../../api/config';
import LabelToolbar from '../../../../components/public/Layout/Labels/Table/LabelToolbar'
import LabelTableLayout from '../../../../components/public/Layout/Labels/Table/LabelTableLayout'
import LabelTable from '../../../../components/public/Layout/Labels/Table/LabelTable'


class FileInfo extends Component {
    constructor(props) {
        super(props)
        this.state = {

            data: []
        }
    }

    getData=(callBack)=>{
      let wokrflowType = this.props.wokrflowType
      let workflowBizIds = this.props.workflowBizIds
      if(wokrflowType){
        if(!workflowBizIds || workflowBizIds.length == 0){
          callBack([])
          this.setState({
            data: []
          })
        }else{
          axios.post(processList(wokrflowType),workflowBizIds).then(res => {
            callBack(res.data.data)
            this.setState({
              data: res.data.data
            })
          })
        }
      }else{
        if (this.props.data.id) {
          const ids = [this.props.data.id]
          axios.post(processList(this.props.bizType),ids).then(res => {
            callBack(res.data.data)
            this.setState({
              data: res.data.data
            })
          })
        }else {
          callBack([])
        }
      }
    }
    onClickHandle = () => {
        //保存流程位置
        if (!this.state.rightData) {
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
        let procInstId = this.state.rightData.procInstId
        if (procInstId) {
            axios.get(getTaskIdByProcInstId(procInstId)).then(res => {
                this.setState({
                    taskId: res.data
                },() => {
                    this.open(procInstId);
                })
            })
        }

    }

    open =(procInstId) =>{
        let taskId = parseInt(this.state.taskId.data)
        if(taskId){
            this.props.openWorkFlowMenu({ taskId, procInstId });
        }else{
            notification.warning(
                {
                    placement: 'bottomRight',
                    bottom: 50,
                    duration: 2,
                    message: '您没有权限查看该流程'
                }
            )
            return
        }
    }

    callback = () => {

    }
    //table表格单行点击回调
    getInfo = (record, index) => {
      this.setState({
        rightData: record
      })

    }
    //显示流程日志
    showProocessLogModal = (record) => {
        this.setState({
            isShowLog: true,
            procInstId: record.procInstId
        })
    }
    closeProocessLogModal = () => {
        this.setState({
            isShowLog: false
        })
    }
    //
    showFlowChartModal = (record) => {
        // window.open("http://39.100.102.69:8081/modeler-display.html?procInstId=" + record.id, "_blank");
      this.setState({
          isShow: true,
          procInstId: record.procInstId
      })
    }
    closeFlowChartModal = () => {
        this.setState({
            isShowFlow: false
        })
    }
    render() {
        const { intl } = this.props.currentLocale
        const columns = [
            {
                title: intl.get('wsd.i18n.base.planTem.name'),
                dataIndex: 'name',
                key: 'name',
                width:"20%",
                render: (text, record) => (
                   <div title ={text}  > <span> <Icon type="eye" onClick={this.showFlowChartModal.bind(this, record)} style={{ marginRight: "5px" }} />{text}</span></div>
                )
            },
            {
                title: intl.get("wbs.il8n.process.starttime"),
                dataIndex: 'startTime',
                key: 'startTime',
                width:"10%",
                render: (text) => dataUtil.Dates().formatDateString(text)
            },
            {
                title: intl.get("wbs.il8n.process.endtime"),
                dataIndex: 'endTime',
                key: 'endTime',
                width:"10%",
                render: (text) => dataUtil.Dates().formatDateString(text)
            },
            {
                title: intl.get("wbs.il8n.process.currentnode"),
                dataIndex: 'activity',
                key: 'activity',
                width:"10%",
            },
            {
                title: intl.get("wbs.il8n.process.waitdoer"),
                dataIndex: 'newUser',
                key: 'newUser',
                width:"10%",
                //render: (text, record) => text ? text.name : null
            },
            {
                title: intl.get("wbs.il8n.process.staytime"),
                dataIndex: 'stayTime',
                key: 'stayTime',
                width:"10%",
            },
            {
                title: intl.get("wsd.i18n.sys.ipt.statusj"),
                dataIndex: 'status',
                key: 'status',
                width:"15%",
                //render: (text, record) =>text? text.name:null
            },
            {
                title: intl.get("wsd.i18n.plan.activitybiz.logger"),
                dataIndex: 'oprate',
                key: 'oprate',
                width:"10%",
                render: (text, record) => (
                    <span>
                        <a href="javascript:;" onClick={this.showProocessLogModal.bind(this, record)}>{intl.get("wbs.il8n.process.look")}</a>
                    </span>
                )
            },
        ];

        return (

          <LabelTableLayout title = {this.props.title} menuCode = {this.props.menuCode}>
            {this.props.isCheckWf &&
            <LabelToolbar>
              <PublicButton afterCallBack={this.onClickHandle} icon="icon-check" title = "查看"  ></PublicButton>
            </LabelToolbar>
            }
            <LabelTable labelWidth = {this.props.labelWidth } contentMinWidth = {400}>
              <PageTable istile={true} onRef={this.onRef}
                         getData={this.getData}
                         columns={columns}
                        //  scroll={{x: 800, y: this.props.height - 100}}
                         getRowData={this.getInfo}
              />
            </LabelTable>
            {
              this.state.isShowLog && (
                <ProcLog visible={true}
                         handleCancel={this.closeProocessLogModal.bind(this)}
                         procInstId={this.state.procInstId}
                />
              )
            }
            {
              this.state.isShow && <Modal centered={true}
                                          title="流程图" visible={true} onCancel={() => this.setState({isShow: false})} mask={false}
                                          maskClosable={false}
                                          width={1100}
                                          bodyStyle={{height: 500, overflow: 'hidden'}}
                                          footer={
                                            <div className="modalbtn">
                                              <Button key={2} onClick={() => this.setState({isShow: false})} type="primary">关闭</Button>
                                            </div>
                                          }
              >
               {/* src={baseURL + "/api/act/modeler/display?procInstId=" + this.state.procInstId}  */}
                <iframe src={baseURL.substr(0,baseURL.lastIndexOf(":")) + ":8784/modeler-display.html?procInstId=" + this.state.procInstId} name="demo" height="100%" width="100%" frameBorder={0}/>
              </Modal>
            }

          </LabelTableLayout>
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
