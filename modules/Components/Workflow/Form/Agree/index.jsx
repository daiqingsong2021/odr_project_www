import React from 'react'
import {Modal, notification} from 'antd';
import '../../../../../asserts/antd-custom.less';
import style from "./style.less";
import Participant from '../../Participant';
import {processTaskComplete, getFormDataListByProcInstId} from '../../../../../api/api'
import axios from "../../../../../api/axios";
import connect from "react-redux/es/connect/connect";
import * as MyToDoAction from "../../../../../store/myToDo/action"
import ExtButton from '../../../../../components/public/TopTags/ExtButton'
import {bindActionCreators} from 'redux';

class Agree extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    this.setState({
      visible: this.props.visible,
      height: "300px"
    });
  }

  handleCancel = () => {
    this.setState({visible: false});
    this.props.handleCancel();
  }

  setParticipant = (dat) => {
    let {validateParticipant, participant, content} = dat || {}
    let height = validateParticipant ? "420px" : "300px"
    this.setState({height: height, validateParticipant: validateParticipant, participant: participant, content: content})
  }

  handleSubmit = () => {
    if (this.state.validateParticipant && (!this.state.participant || this.state.participant == 0)) {
      notification.warning({
        placement: 'bottomRight',
        bottom: 50,
        duration: 2,
        message: '未选中数据',
        description: '请选择后继参与者'
      });
      return;
    }
    this.submit();
  }

  submit = () => {
    let {taskId, procInstId, afterSubmit} = this.props;
    let {participant, content} = this.state;
    this.start({taskId, procInstId, comment: content, nextActPart: this.getParticipant(participant)}, afterSubmit);
  }

  getParticipant = (participant) => {
    let _activitys = [];
    if(participant && participant.length > 0){
      let activitys = {};
      for(let i = 0; i < participant.length; i++){
        activitys[participant[i].activityId] = ({id : participant[i].activityId, name: participant[i].activityName, candidateUsers: []})
      }
      for(let a in activitys){
        for(let i = 0; i < participant.length; i++) {
          if(activitys[a].id == participant[i].activityId && participant[i].type == "user"){
            activitys[a].candidateUsers.push({id: participant[i].id, code: participant[i].code, name: participant[i].name})
          }
        }
        _activitys.push(activitys[a])
      }
    }
    return _activitys;
  }

  start = (proc, afterSubmit) => {
    axios.post(processTaskComplete, proc, true, null, true).then(res => {
      if (afterSubmit) {
        afterSubmit(res);
      }
      this.refreshWorkflow();
      this.handleCancel();
      this.props.actions.getMytodoList()
    })
  }

  refreshWorkflow = () => {
    let {taskId, procInstId} = this.props;
    if (this.props.openWorkFlowMenu) {
      this.props.openWorkFlowMenu({taskId, procInstId});
    }
  }

  render() {
    return (
      <div className={style.main}>
        <Modal width="1000px" centered={true} mask={false} bodyStyle={{height: this.state.height}}
               maskClosable={false} title="同意" visible={this.state.visible} onCancel={this.handleCancel} footer={
          <div className="modalbtn">
            <ExtButton key="cancel" onClick={this.handleCancel}>取消</ExtButton>
            <ExtButton key="submit" onClick={this.handleSubmit} useModel={false} type="primary">提交</ExtButton>
          </div>
        }>
          <Participant {...this.props} setData={this.setParticipant}></Participant>
        </Modal>
      </div>
    )
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
export default connect(mapStateToProps, mapDispatchToProps)(Agree);
