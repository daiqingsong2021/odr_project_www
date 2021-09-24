import React, {Component} from 'react';
import Search from '../../../../../components/public/Search';
import style from './style.less';
import PublicButton from '../../../../../components/public/TopTags/PublicButton'
import {processTaskClaim} from '../../../../../api/api';
import axios from "../../../../../api/axios";
import Agree from '../Agree';
import Reject from '../Reject';
import Terminate from '../Terminate';
import ProcLog from '../../ProcLog';
import {Modal, Button} from "antd"
import {baseURL} from "../../../../../api/config";
import {processCancel} from "../../../../../api/api";
import connect from "react-redux/es/connect/connect";
import {bindActionCreators} from 'redux';
import * as MyToDoAction from "../../../../../store/myToDo/action";

export class PlanDefineTopTags extends Component {

  constructor(props) {
    super(props);
    this.state = {
      agree: false, //同意
      cancel: false, //撤销
      reject: false, //驳回
      terminate: false, //终止
      showAgree: false, //显示同意
      showReject: false, //显示驳回
      showTerminate: false, //显示终止
      nextEnd: false, //是否无后续人工活动
      start:false,//agree为true，且start为true。则 同意按钮变成 再次发起按钮
      end:false,//agree为true，且end 为true。则 同意按钮变成 批准按钮
    };
  }

  componentWillMount() {
    this.processTaskClaim();
  }

  processTaskClaim = () => {
    const {procInstId, taskId} = this.props;
    axios.post(processTaskClaim, {procInstId: procInstId, taskId: taskId}).then(res => {
      const {agree, cancel, reject, terminate,end,start} = res.data.data;
      this.setState({agree, cancel, reject, terminate,end,start},()=>{
        this.props.changeStart(this.state.start && this.state.agree);
      });
    })
  }

  handleCancel = () => {
    let {taskId, procInstId, afterSubmit} = this.props;
    axios.post(processCancel, {taskId, procInstId}, true, null, true).then(res => {
      if (afterSubmit) {
        afterSubmit(res);
      }
      const {taskId, procInstId} = res.data.data
      this.refreshWorkflow(taskId, procInstId);
      this.props.actions.getMytodoList()
    })
  }

  refreshWorkflow = (taskId, procInstId) => {
    if (this.props.openWorkFlowMenu) {
      this.props.openWorkFlowMenu({taskId, procInstId});
    }
  }

  showAgree = () => {
    this.setState({
      showAgree: true
    });
  }

  cancelArgee = () => {
    this.setState({showAgree: false});
  }

  showReject = () => {
    this.setState({showReject: true});
  }

  cancelReject = () => {
    this.setState({showReject: false});
  }

  showTerminate = () => {
    this.setState({showTerminate: true});
  }

  cancelTerminate = () => {
    this.setState({showTerminate: false});
  }

  showProcLog = () => {
    this.setState({showProcLog: true});
  }

  cancelProcLog = () => {
    this.setState({showProcLog: false});
  }

  showProcFigure = () => {
    this.setState({isShow: true})
  }

  render() {
    const {taskId, procInstId} = this.props;
    // console.log(baseURL.substr(0,baseURL.lastIndexOf(":"))+":1400")
    return (
      <div className={style.main}>
        <div className={style.search}>
          <Search search={this.props.search.bind(this)}/>
        </div>
        <div className={style.tabMenu}>
          {/*同意*/}
          {this.state.start?null:(
            <PublicButton name={`${this.state.start == true?'再次发起':(this.state.end == true?'批准':'同意')}`} title={`${this.state.start == true?'再次发起':(this.state.end == true?'批准':'同意')}`} icon={'icon-dkw_shenhetongguo'} show={this.state.agree}
                        afterCallBack={this.showAgree}/>
          )}
          {/*撤回*/}
          <PublicButton name={'撤回'} title={'撤回'} icon={'icon-moren'} show={this.state.cancel}
                        useModel={true} content={"确定撤回吗?"}
                        afterCallBack={this.handleCancel}/>
          {/*驳回*/}
          <PublicButton name={'驳回'} title={'驳回'} icon={'icon-tuihui'} show={this.state.reject}
                        afterCallBack={this.showReject}
          />
          {/*终止*/}
          <PublicButton name={'终止'} title={'终止'} icon={'icon-tuihui'} show={this.state.terminate}
                        afterCallBack={this.showTerminate}
          />
          {/*流程日志*/}
          <PublicButton name={'流程日志'} title={'流程日志'} icon={'icon-check'} show={true}
                        afterCallBack={this.showProcLog}
          />
          {/*流程图*/}
          <PublicButton name={'流程图'} title={'流程图'} icon={'icon-liuchengguanli-'} show={true}
                        afterCallBack={this.showProcFigure}
          />
          {
            this.state.showAgree && (
              <Agree visible={true} type="agree"
                     handleCancel={this.cancelArgee}
                     taskId={taskId}
                     procInstId={procInstId}
                     openWorkFlowMenu={this.props.openWorkFlowMenu}
              />
            )
          }
          {
            this.state.showReject && (
              <Reject visible={true}
                      handleCancel={this.cancelReject}
                      taskId={taskId}
                      procInstId={procInstId}
                      openWorkFlowMenu={this.props.openWorkFlowMenu}
              />
            )
          }
          {
            this.state.showTerminate && (
              <Terminate visible={true}
                      handleCancel={this.cancelTerminate}
                      taskId={taskId}
                      procInstId={procInstId}
                      openWorkFlowMenu={this.props.openWorkFlowMenu}
              />
            )
          }
          {
            this.state.showProcLog && (
              <ProcLog visible={true}
                       handleCancel={this.cancelProcLog}
                       taskId={taskId}
                       procInstId={procInstId}
              />
            )
          }
        </div>
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
            <iframe src={baseURL.substr(0,baseURL.lastIndexOf(":")) + ":8784/modeler-display.html?procInstId=" + this.props.procInstId} name="demo" height="100%" width="100%" frameborder={0}/>
            {/* <iframe src={baseURL + "/api/act/modeler/display?procInstId=" + this.props.procInstId} name="demo" height="100%" width="100%" frameborder={0}/> */}
          </Modal>
        }
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    currentLocale: state.localeProviderData
  }
};

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(Object.assign({}, MyToDoAction), dispatch)
});
export default connect(mapStateToProps, mapDispatchToProps)(PlanDefineTopTags);

