import React, {Component} from 'react'
import style from './style.less'
import {Form, Row, Col, Input, Button, Icon, Select, InputNumber, Modal, message, Switch} from 'antd';
import SubmitButton from "../../../../../components/public/TopTags/SubmitButton"
import {connect} from 'react-redux'
import axios from "../../../../../api/axios"
import {getdictTree, addTmpltaskTask} from "../../../../../api/api"

const FormItem = Form.Item;
const {TextArea} = Input;
const Option = Select.Option

export class BasicdTemplatedPlanAddTask extends Component {
  constructor(props) {
    super(props)
    this.state = {
      initDone: false,
      info: {}
    }
  }

  componentDidMount() {
    this.getTaskTypeList()
  }

  //获取计划类型
  getPlanTypeList = () => {
    if (!this.state.planTypeList) {
      axios.get(getdictTree("plan.define.plantype")).then(res => {
        if (res.data.data) {
          this.setState({
            planTypeList: res.data.data
          })
        }
      })
    }
  }

  //获取计划级别
  getPlanLevelList = () => {
    if (!this.state.planLevelList) {
      axios.get(getdictTree("plan.task.planlevel")).then(res => {
        if (res.data.data) {
          this.setState({
            planLevelList: res.data.data
          })
        }
      })
    }
  }

  //获取作业类型
  getTaskTypeList = () => {
    if (!this.state.taskTypeList) {
      axios.get(getdictTree("plan.project.tasktype")).then(res => {
        if (res.data.data) {
          this.setState({
            taskTypeList: res.data.data
          })
        }
      })
    }
  }

  //获取工期类型
  getTaskdrtnType = () => {
    if (!this.state.taskdrtnTypeList) {
      axios.get(getdictTree("plan.project.taskdrtntype")).then(res => {
        if (res.data.data) {
          this.setState({
            taskdrtnTypeList: res.data.data
          })
        }
      })
    }
  }

  handleSubmit = (type) => {
    const {intl} = this.props.currentLocale
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let obj = {
          ...values,
          isFeedback: values.isFeedback ? 1 : 0,
          controlAccount: values.controlAccount ? 1 : 0,
          parentId: this.props.data.type == "tmpl" ? 0 : this.props.data.id,
          tmplId: this.props.data.type == "tmpl" ? this.props.data.id : this.props.data.tmplId,
          planDrtn: values.planDrtn ? values.planDrtn : 0,
          planQty: values.planQty ? values.planQty : 0,
          taskType:1
        }
        if (type == "go") {
          axios.post(addTmpltaskTask, obj, true, intl.get("wsd.global.btn.newsuccess")).then(res => {
            this.props.form.resetFields();
            this.props.addData(res.data.data, "task")
          })
        } else {
          axios.post(addTmpltaskTask, obj, true, intl.get("wsd.global.btn.newsuccess")).then(res => {
            this.props.form.resetFields();
            this.props.addData(res.data.data, "task")
            this.props.handleCancel()
          })
        }
      }
    });
  }

  //更改作业类型
  changeTaskType = (value) => {
    if (value == "2" || value == "3") {
      this.props.form.setFieldsValue({planDrtn: null, planQty: null, drtnType: null,})
      this.setState({
        isEditable: true
      })
    } else {
      this.setState({
        isEditable: false
      })
    }
  }

  render() {
    const {intl} = this.props.currentLocale
    const {
      getFieldDecorator, getFieldsError, getFieldError, isFieldTouched,
    } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 8},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 16},
      },
    };
    const formItemLayout1 = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 4},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 20},
      },
    };
    return (
      <div className={style.main}>
        {/* <h2>{intl.get('wbs.add.name')}</h2>*/}
        <Modal
          className={style.formMain}
          width="850px"
          mask={false}
          maskClosable={false}
          centered={true}
          title={this.props.taskTitle}
          visible={true} onCancel={this.props.handleCancel}
          footer={
            <div className="modalbtn">
              <SubmitButton key={3} onClick={this.handleSubmit.bind(this, "go")} content={intl.get("wsd.global.btn.saveandcontinue")}/>
              <SubmitButton key={2} onClick={this.handleSubmit.bind(this, "new")} type="primary" content={intl.get("wsd.global.btn.preservation")}/>
            </div>
          }>
          <Form onSubmit={this.handleSubmit}>
            <div className={style.content}>
              <Row type="flex">
                <Col span={12}>
                  <Form.Item
                    label={intl.get('wsd.i18n.base.planTemAddTask.name')} {...formItemLayout}>
                    {getFieldDecorator('taskName', {
                      rules: [{
                        required: true,
                        message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.base.planTemAddTask.name'),
                      }],
                    })(
                      <Input/>
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label={intl.get('wsd.i18n.base.planTemAddTask.code')} {...formItemLayout}>
                    {getFieldDecorator('taskCode', {
                      rules: [{
                        required: true,
                        message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.base.planTemAddTask.code'),
                      }],
                    })(
                      <Input/>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <Form.Item
                    label={intl.get('wsd.i18n.base.planTemAddTask.remark')} {...formItemLayout1}>
                    {getFieldDecorator('remark', {
                      rules: [],
                    })(
                      <TextArea rows={2}/>
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </div>
          </Form>
        </Modal>
      </div>
    )
  }
}

const BasicdTemplatedPlanAddTasks = Form.create()(BasicdTemplatedPlanAddTask);
const mapStateToProps = state => {
  return {
    currentLocale: state.localeProviderData,
  }
};
export default connect(mapStateToProps, null)(BasicdTemplatedPlanAddTasks);
