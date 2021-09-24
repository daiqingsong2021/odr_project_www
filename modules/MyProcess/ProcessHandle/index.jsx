import React, { Component } from 'react'
import { Table, Icon, Input, Row, Col, DatePicker, Tabs, Select } from 'antd'
import style from './style.less'
import { connect } from 'react-redux'
import ProcessLogModal from "../ProcessInfo/ProcessLogModal"
import FlowChartModal from "../ProcessInfo/FlowChartModal"
import Approval from "./Modules/Approval"
import CompDoc from "./Modules/CompDoc"
import OpePrepared from "./Modules/OpePrepared"
import OpeChange from "./Modules/OpeChange"
import OpeFdback from "./Modules/OpeFdback"
import ProDoc from "./Modules/ProDoc"
import Prepared from "./Modules/Prepared"
import Fdback from "./Modules/Fdback"
import Meeting from "./Modules/Meeting"
import RejectModal from "./RejectModal"
import TurnDSponTopModal from "./TurnDSponTopModal"
import Submit from  "./Submit"
import dynamic from 'next/dynamic'
export class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            roleBtnData: [
                {
                    id: 1,
                    name: 'SubmitTopBtn',
                    aliasName: '提交'
                },
                {
                    id: 2,
                    name: 'DeleteProcessBtn',
                    aliasName: '删除流程'
                },
                {
                    id: 3,
                    name: 'RejectBtn',
                    aliasName: '驳回'
                },
                {
                    id: 4,
                    name: 'TurnDSponTopBtn',
                    aliasName: '驳回到发起人'
                },
                {
                    id: 5,
                    name: 'FlowChartBtn',
                    aliasName: '流程图'
                },
                {
                    id: 6,
                    name: 'ApprovalLogTopBtn',
                    aliasName: '审批日志'
                },
            ],
        };
    }
    componentDidMount() {
        const processUrl = localStorage.getItem("processUrl")

        this.setState({
            processUrl: processUrl
        })
    }
    onClickHandle = (name) => {
        
        //提交
        if (name == "SubmitTopBtn") {
            this.setState({
                isSubmit: true
            })
            return
        }
        //驳回
        if (name == "RejectBtn") {
            this.setState({
                isShowReject: true
            })
            return
        }
        //驳回到发起人
        if (name == "TurnDSponTopBtn") {
            this.setState({
                isShowTurnDSponTopModal: true
            })
            return
        }
        //流程图
        if (name == "FlowChartBtn") {
            this.setState({
                isShowFlow: true
            })
            return
        }
        //审批日志
        if (name == "ApprovalLogTopBtn") {
            this.setState({
                isShowLog: true
            })
            return
        }
    }
    //关闭提交
    closeSubmit=()=>{
        this.setState({
            isSubmit:false
        })
    }
    //关闭驳回
    closeRejectModal = () => {
        this.setState({
            isShowReject: false
        })
    }
    //关闭驳回到发起人
    closeTurnDSponTopModal = () => {
        this.setState({
            isShowTurnDSponTopModal: false
        })
        return
    }
    //关闭审批日志
    closeProocessLogModal = () => {
        this.setState({
            isShowLog: false
        })
    }
    //关闭流程图
    closeFlowChartModal = () => {
        this.setState({
            isShowFlow: false
        })
    }


    render() {
        const array = this.props.process.address.split("/")
        const { intl } = this.props.currentLocale
        const processName = array[array.length - 1]
        let topTags = this.state.roleBtnData.map((v, i) => {
            return dynamic(import('../../../components/public/TopTags/' + v.name))
        })
        // let MyProcess = dynamic(import("./Modules/" + array[array.length - 1]))
        return (
            <div className={style.main} style={{ height: this.props.height }}>
                <section className={style.funBtn}>
                    {
                        topTags.map((Component, key) => {
                            return <Component key={key} onClickHandle={this.onClickHandle} />
                        })
                    }
                </section>
                {processName == "Approval" && <Approval callBackBanner={this.props.callBackBanner}  projectId={this.props.process.formId}/>}
                {processName == "OpeChange" && <OpeChange callBackBanner={this.props.callBackBanner}  projectId={this.props.process.formId}/>}
                {processName == "OpeFdback" && <OpeFdback callBackBanner={this.props.callBackBanner}  projectId={this.props.process.formId}/>}
                {processName == "OpePrepared" && <OpePrepared callBackBanner={this.props.callBackBanner} projectId={this.props.process.formId}/>}
                {processName == "CompDoc" && <CompDoc callBackBanner={this.props.callBackBanner} />}
                {processName== "ProDoc" &&  <ProDoc   callBackBanner={this.props.callBackBanner} />} 
                {processName== "Prepared" &&  <Prepared   callBackBanner={this.props.callBackBanner}  projectId={this.props.process.formId}/>} 
                {processName== "Fdback" &&  <Fdback   callBackBanner={this.props.callBackBanner}  projectId={this.props.process.formId}/>} 
                {processName== "Meeting" &&  <Meeting   callBackBanner={this.props.callBackBanner}  projectId={this.props.process.formId}/>} 
                {this.state.isSubmit && <Submit handleCancel={this.closeSubmit} />}
                {this.state.isShowReject && <RejectModal handleCancel={this.closeRejectModal} />}
                {this.state.isShowTurnDSponTopModal && <TurnDSponTopModal handleCancel={this.closeTurnDSponTopModal} />}
                {this.state.isShowLog && <ProcessLogModal handleCancel={this.closeProocessLogModal} />}
                {this.state.isShowFlow && <FlowChartModal handleCancel={this.closeFlowChartModal} />}
            </div>

        )
    }
}


const mapStateToProps = state => {
    return {
        currentLocale: state.localeProviderData,
        process: state.process
    }
};


export default connect(mapStateToProps, null)(Index);