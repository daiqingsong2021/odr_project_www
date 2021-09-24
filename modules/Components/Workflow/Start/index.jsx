import './style.less'
import React, {Component} from 'react'
import {Modal, Steps, Button, notification} from 'antd';
import '../../../../asserts/antd-custom.less';
import style from "./style.less";
import Participant from '../Participant';
import {processStart, getWorkflowModels} from '../../../../api/api'
import axios from "../../../../api/axios";
import * as dataUtil from "../../../../utils/dataUtil";
import SelectModel from "../SelectModel";

const Step = Steps.Step;


export function StartWorkFlow(WrappedComponent, workflowData) {

  return class Asss extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        step: 1,
        loadParticipant: false,
        selectItems: [],
        assignWorkflow: -1,
        workflowModels: [],
        showSelectModel: false
      }
    }

    componentDidMount() {
      this.setState({visible: this.props.visible});
      this.getModels((data) => {
        if (data && data.length > 0) {
          this.setState({assignWorkflow: 1, workflowModels: data});
        } else {
          // this.setState({ assignWorkflow : 0});
          dataUtil.message("没有定义流程！");
          this.setState({visible: false});
          this.props.handleCancel();
        }
      });
    }

    validate = () => {
      if (this.participant && this.participant.validate && !this.participant.validate()) {
        return false;
      }
      // 获取选择的数据
      let {selectItems} = this.state;
      if (!selectItems || selectItems.length == 0) {
        notification.warning({
          placement: 'bottomRight',
          bottom: 50,
          duration: 2,
          message: '未选中数据',
          description: '请勾选数据进行操作'
        });
        return false;
      }
      return true;
    }

    next = () => {
      if (!this.validate()) {
        return;
      }
      let {workflowModels, procDefKey,selectItems} = this.state;
      let model = {key: procDefKey};
      if (!procDefKey) {
        if (!workflowModels || workflowModels.length == 0) {
          dataUtil.message("没有定义流程！");
          return;
        }

        if (workflowModels.length > 1) {
          this.setState({showSelectModel: true});
          return;
        }
        model = workflowModels[0];
        if(selectItems.length > 1){
          const sectionIds = []
          selectItems.map(item=>{
            if(!item.origData || !item.origData.sectionId){

            }else{
              sectionIds.push(item.origData.sectionId)
            }
          })
          if(sectionIds.length > 1){
            const b = sectionIds[0];
            for(let i = 1;i < sectionIds.length;i++){
              if(b != sectionIds[i]){
                dataUtil.message("只允许批量提交同一标段的数据，您选择的数据包含多个标段，请重新选择。");
                return;
              }
            }
          }
        }
      }
      this.nexting(model);
    }
 
    nexting = (model) => {
      let {key} = (model || {});
      this.setState({step: 2, loadParticipant: true, procDefKey: key});
    }

    previous = () => {
      this.setState({step: 1});
    }

    handleCancel = () => {
      this.setState({visible: false});
      this.props.handleCancel();
    }

    setParticipant = (dat) => {
      let {participant, content} = dat || {}
      this.setState({participant: participant, content: content})
    }

    handleSubmit = () => {
      if (!this.validate()) {
        return;
      }
      if (!this.state.participant || this.state.participant == 0) {
        notification.warning({
          placement: 'bottomRight',
          bottom: 50,
          duration: 2,
          message: '未选中数据',
          description: '请选择审批人'
        });
        return;
      }
      this.submit();
    }

    getSubmitData = (datas) => {
      this.setState({selectItems: datas});
    }

    submit = () => {
      let {proc} = this.props;
      let {selectItems, participant, content, procDefKey} = this.state;
      proc = {...proc, procDefKey};
      let proc_ = {...proc, formData: selectItems, nextActPart: this.getParticipant(participant), comment: content};
      let {afterSubmit} = this.props;
      if (this.participant && this.participant.beforeSubmit) {
        this.participant.beforeSubmit({}, (newSelectItems) => {
          proc_["formData"] = newSelectItems;
          this.start(proc_, afterSubmit);
        });
      } else {
        this.start(proc_, afterSubmit);
      }
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
      axios.post(processStart, proc, true, null, true).then(res => {
        if (afterSubmit) {
          afterSubmit(res);
        }
        if (this.props.refreshData) {
          this.props.refreshData();
        }
        this.handleCancel();
      })
    }

    //
    getModels = (callback) => {
      let {proc} = this.props;
      axios.get(getWorkflowModels(proc.bizTypeCode)).then(res => {
        callback(res.data.data);
      })
    }

    onRef = (ref) => {
      this.participant = ref;
    }

    render() {
      let {width} = this.props.proc || {};
      let {procDefKey} = this.state || {};
      width = width || "1000px";
      return (
        <>
          {
            this.state.assignWorkflow == 1 && this.state.visible && (
              <div className={style.main}>
                <Modal width={width} centered={true} mask={false} bodyStyle={{height: "700px"}}
                       maskClosable={false} title="发布审批" visible={this.state.visible} onCancel={this.handleCancel} footer={
                  <div className="modalbtn">
                    {
                      this.state.step == 1 &&
                      <>
                        <Button key="back" onClick={this.handleCancel}>取消</Button>
                        <Button key="3" type="primary" onClick={this.next}>下一步</Button>
                      </>
                    }
                    {
                      this.state.step == 2 &&
                      <>
                        <Button key="backone" onClick={this.previous}>上一步</Button>
                        <Button key="3" type="primary" onClick={this.handleSubmit}>提交</Button>
                      </>
                    }
                  </div>
                }>
                  <div className={style.steps}>
                    <Steps size="small" current={this.state.step - 1}>
                      <Step title="选择数据"/>
                      <Step title="启动流程"/>
                      <Step title="完成"/>
                    </Steps>
                  </div>
                  <WrappedComponent onRef={this.onRef} {...this.props} getSubmitData={this.getSubmitData} visible={this.state.step == 1}/>
                  {
                    this.state.loadParticipant && (
                      <Participant vars={this.props.proc.vars} bizTypeCode={this.props.proc.bizTypeCode}
                                   formData={this.state.selectItems} procDefKey={procDefKey}
                        visible={this.state.step == 2} setData={this.setParticipant}></Participant>
                    )
                  }
                  {
                    this.state.showSelectModel && (
                      <SelectModel bizTypeCode={this.props.proc.bizTypeCode}
                                   handleCancel={() => {
                                     this.setState({showSelectModel: false});
                                   }}
                                   handleOk={this.nexting}>
                      </SelectModel>
                    )
                  }
                </Modal>
              </div>
            )
          }
        </>
      )
    }
  }
}
