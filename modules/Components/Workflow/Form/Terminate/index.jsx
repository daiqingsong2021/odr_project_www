import React from 'react'
import {Modal, Button, notification, Input, Select, Icon} from 'antd';
import '../../../../../asserts/antd-custom.less';
import style from "./style.less";
import {processTerminate} from '../../../../../api/api'
import axios from "../../../../../api/axios";
import connect from "react-redux/es/connect/connect";
import ExtButton from '../../../../../components/public/TopTags/ExtButton'
import {bindActionCreators} from 'redux';
import * as MyToDoAction from "../../../../../store/myToDo/action"

const Option = Select.Option;
const {TextArea} = Input;

class Terminate extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      content: null,
    }
  }

  componentDidMount() {
    this.setState({visible: this.props.visible});
  }

  handleCancel = () => {
    this.setState({visible: false});
    this.props.handleCancel();
  }

  handleSubmit = () => {
    this.submit();
  }

  submit = () => {
    let {taskId, procInstId, afterSubmit} = this.props;
    let {content} = this.state;
    this.start({taskId, procInstId, comment: content}, afterSubmit);
  }

  start = (proc, afterSubmit) => {
    axios.post(processTerminate, proc, true, null, true).then(res => {
      if (afterSubmit) {
        afterSubmit(res);
      }
      this.refreshWorkflow();
      this.handleCancel();
      this.props.actions.getMytodoList()
    })
  }

  setContent = (obj) => {
    let text = obj.currentTarget.value;
    this.setState({content: text});
  }

  handleChange = (value) => {
    this.setState({activityId: value});
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
        <Modal width="750px" centered={true} mask={false} bodyStyle={{height: "300px"}}
               maskClosable={false} title="终止流程" visible={this.state.visible} onCancel={this.handleCancel} footer={
          <div className="modalbtn">
            <ExtButton key="cancel" onClick={this.handleCancel}>取消</ExtButton>
            <ExtButton key="submit" onClick={this.handleSubmit} useModel={false} type="primary">提交</ExtButton>
          </div>
        }>
          <div style={{marginTop: '15px'}}>
            <p>终止原因：</p>
            <TextArea onBlur={this.setContent} defaultValue="" rows={8}/>
          </div>
        </Modal>
        {
          this.state.rejectModel && (
            <Modal
              width={350}
              title={this.state.title}
              visible={true}
              onOk={this.submit}
              onCancel={() => {
                this.setState({rejectModel: false})
              }}
              mask={false}
              maskClosable={false}
            >
              <p style={{textAlign: 'center', fontSize: 18, paddingTop: 10, paddingBottom: 10}}>
                <Icon type="warning"
                      style={{
                        fontSize: 30,
                        color: '#faad14'
                      }}
                /> &nbsp;{this.state.content ? this.state.content : '确认终止流程吗？'}
              </p>
            </Modal>
          )
        }
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
export default connect(mapStateToProps, mapDispatchToProps)(Terminate);
