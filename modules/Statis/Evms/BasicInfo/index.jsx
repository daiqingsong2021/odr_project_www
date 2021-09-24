import React, { Component } from 'react'
import { Form, Row, Col, Input, Button, Icon, Select, DatePicker, Switch, Slider, InputNumber, TreeSelect } from 'antd';
import intl from 'react-intl-universal'
import moment from 'moment';
import style from './style.less'
import axios from "../../../../api/axios"
import {
  getdictTree,
  getPreparedTreeList,
  getuserauthtree,
  addPlanWbs,
  defineOrgTree,
  defineOrgUserList,
  getBaseSelectTree,
  getWbsInfoById,
  getTaskInfoById,
  calendarList,
  caculateWorkHour,
} from '../../../../api/api';
import * as dataUtil from "../../../../utils/dataUtil"

const FormItem = Form.Item;
const Option = Select.Option
const { TextArea } = Input;

export class PlanPreparedInfo extends Component {

  constructor(props) {
    super(props)
    this.state = {
      oldPlanStartTime: null,
      oldPlanEndTime: null,
      oldPlanDrtn: null,
      initDone: false,
      info: {
        userId: null,
      },
      orgTree: [],
      orgUserList: [],
      planTypeData: [],
      planLevelData: [],
      planTaskTypeData: [],
      planTaskDrtnTypeData: [],
      constraintTypeList: [],
      secutyLevelList1: [{ value: "1", title: "非密" }]//默认密级
    }
  }



  componentDidMount() {
    const { rightData } = this.props
    if (rightData) {
      (rightData[0]['taskType'] == '1' || rightData[0]['taskType'] == '4' || rightData[0]['taskType'] == 0) && this.setState({
        planTaskTypeData: [{ value: 1, title: '作业任务' }, { value: 4, title: '资源任务' }]
      })

      rightData[0]['taskType'] == '2' && this.setState({
        planTaskTypeData: [{ value: 2, title: '开始里程碑' }]
      })

      rightData[0]['taskType'] == '3' && this.setState({
        planTaskTypeData: [{ value: 3, title: '完成里程碑' }]
      })
      switch (rightData[0]['nodeType']) {
        case 'wbs':
          this.getWbsInfoById(rightData[0]['id'])
          break;
        case 'task':
          this.getTaskInfoById(rightData[0]['id'])
          break;
        default:
          this.setState({
            info: rightData[0]
          })
      }
    }
  }
  // 获取WBS信息
  getWbsInfoById = (id) => {
    axios.get(getWbsInfoById(id)).then(res => {
      const { data } = res.data
      this.setState({
        info: { ...data, nodeType: 'wbs' }
      })
    })
  }
  // 获取任务信息
  getTaskInfoById = (id) => {
    axios.get(getTaskInfoById(id)).then(res => {

      const { data } = res.data

      this.setState({
        info: { ...data, nodeType: 'task' }
      })
    })
  }
  //作业类型转换
  getTaskType = (type) => {
    if (type == 1) {
      return "作业任务"
    }
    if (type == 2) {
      return "开始里程碑"
    }
    if (type == 3) {
      return "完成里程碑"
    }
    if (type == 4) {
      return "资源任务"
    }
  }




  render() {
    const { rightData } = this.props;
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const formItemLayout2 = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 22 },
        sm: { span: 20 },
      },
    };


    const { planTypeData, planLevelData, planTaskTypeData, planTaskDrtnTypeData } = this.state
    return (
      <div className={style.main}>
        <h3 className={style.listTitle}>基本信息</h3>
        <div className={style.mainScorll}>
          {rightData && (<Form onSubmit={this.handleSubmit}>
            <div className={style.content}>
              <Row type="flex">
                <Col span={12}>
                  <Form.Item label={intl.get('wsd.i18n.plan.plandefine.planname')} {...formItemLayout}>
                    {getFieldDecorator('taskName', {
                      initialValue: this.state.info.taskName || this.state.info.name,
                      rules: [{
                        required: true,
                        message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.plan.plandefine.planname'),
                      }],
                    })(
                      <Input disabled />
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={intl.get('wsd.i18n.plan.plandefine.plancode')} {...formItemLayout}>
                    {getFieldDecorator('taskCode', {
                      initialValue: this.state.info.taskCode || this.state.info.code,
                      rules: [{
                        required: true,
                        message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.plan.plandefine.plancode'),
                      }],
                    })(
                      <Input disabled />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Form.Item label={intl.get('wsd.i18n.plan.plandefine.orgname')} {...formItemLayout}>
                    {getFieldDecorator('orgId', {
                      initialValue: this.state.info.org ? this.state.info.org.name : '',
                      rules: [{
                        required: true,
                        message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.plan.plandefine.orgname')
                      }],
                    })(
                      <Input disabled />
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={intl.get('wsd.i18n.plan.plandefine.username')} {...formItemLayout}>
                    {getFieldDecorator('userId', {
                      initialValue: this.state.info.user ? this.state.info.user.name : '',
                      rules: [],
                    })(
                      <Input disabled />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Form.Item label={intl.get('wsd.i18n.plan.plandefine.planstarttime')} {...formItemLayout}>
                    {getFieldDecorator('planStartTime', {
                      initialValue: this.state.info.planStartTime ? this.state.info.planStartTime.substr(0, 10) : null,
                      rules: [{
                        required: this.state.info.taskType != 3,
                        message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.plan.plandefine.planstarttime'),
                      }],
                    })(
                      <Input disabled />
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={intl.get('wsd.i18n.plan.plandefine.planendtime')} {...formItemLayout}>
                    {getFieldDecorator('planEndTime', {
                      initialValue: this.state.info.planEndTime ? this.state.info.planEndTime.substr(0, 10) : null,
                      rules: [{
                        required: this.state.info.taskType != 2,
                        message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.plan.plandefine.planendtime'),
                      }],
                    })(
                      <Input disabled />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>

                <Col span={12}>
                  <Form.Item label="计划工期" {...formItemLayout}>
                    {getFieldDecorator('planDrtn', {
                      initialValue: this.state.info.planDrtn,
                      rules: [{
                        required: this.state.info.taskType != 2 && this.state.info.taskType != 3,
                        message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.plan.plandefine.planstarttime'),
                      }],
                    })(
                      <Input disabled />
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="计划工时" {...formItemLayout}>
                    {getFieldDecorator('planQty', {
                      initialValue: this.state.info.planQty,
                      rules: [{
                        required: this.state.info.taskType != 2 && this.state.info.taskType != 3,
                        message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.plan.plandefine.planendtime'),
                      }],
                    })(
                      <Input disabled />
                    )}
                  </Form.Item>
                </Col>

              </Row>


              <Row>
                <Col span={12}>
                  <Form.Item label={intl.get('wsd.i18n.plan.plandefine.plantype')} {...formItemLayout}>
                    {getFieldDecorator('planType', {
                      initialValue: this.state.info.planType ? this.state.info.planType.name : '',
                      rules: [],
                    })(
                      <Input disabled />
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="计划级别" {...formItemLayout}>
                    {getFieldDecorator('planLevel', {
                      initialValue: this.state.info.planLevel ? this.state.info.planLevel.name : '',
                      rules: [],
                    })(
                      <Input disabled />
                    )}
                  </Form.Item>
                </Col>
              </Row>

              {/* WBS特有 */}
              {rightData[0]['nodeType'] == 'wbs' && (<Row>
                <Col span={12}>
                  <Form.Item label={intl.get('wsd.i18n.base.planTemAddWBS.iswbsfb')} {...formItemLayout}>
                    {getFieldDecorator('isFeedback', {
                      initialValue: this.state.info.isFeedback == 1 ? true : false,
                      valuePropName: 'checked',
                    })(
                      <Switch checkedChildren="开" unCheckedChildren="关" disabled />
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label={intl.get('wsd.i18n.base.planTemAddWBS.isctrl')} {...formItemLayout}>
                    {getFieldDecorator('controlAccount', {
                      initialValue: this.state.info.controlAccount == 1 ? true : false,
                      valuePropName: 'checked',
                    })(
                      <Switch checkedChildren="开" unCheckedChildren="关" disabled />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              )}
              {/* 任务特有 */}
              {rightData[0]['nodeType'] == 'task' && (<Row>
                <Col span={12}>
                  <Form.Item label="作业类型" {...formItemLayout}>
                    {getFieldDecorator('taskType', {
                      initialValue: this.getTaskType(this.state.info.taskType),
                      rules: [],
                    })(
                      <Input disabled />
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="工期类型" {...formItemLayout}>
                    {getFieldDecorator('drtnType', {
                      initialValue: this.state.info.drtnType ? this.state.info.drtnType.name : '',
                      rules: [],
                    })(
                      <Input disabled />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              )}


              <Row>
                <Col span={12}>
                  <Form.Item label="创建人" {...formItemLayout}>
                    {getFieldDecorator('creator', {
                      initialValue: this.state.info.creator ? this.state.info.creator.name : '',
                      rules: [],
                    })(
                      <Input disabled />
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="创建日期" {...formItemLayout}>
                    {getFieldDecorator('creatTime', {
                      initialValue: this.state.info.creatTime ? this.state.info.creatTime.substr(0, 10) : null,
                      rules: [],
                    })(
                      <Input disabled />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Form.Item label="发布人" {...formItemLayout}>
                    {getFieldDecorator('releaser', {
                      initialValue: this.state.info.releaseUser ? this.state.info.releaseUser.name : '',
                      rules: [],
                    })(
                      <Input disabled />
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="发布日期" {...formItemLayout}>
                    {getFieldDecorator('releaseTime', {
                      initialValue: this.state.info.releaseTime ? this.state.info.releaseTime.substr(0, 10) : null,
                      rules: [],
                    })(
                      <Input disabled />
                    )}
                  </Form.Item>
                </Col>

              </Row>
              <Row>
                <Col span={24}>
                  <Form.Item label={intl.get('wsd.i18n.plan.plandefine.remark')} {...formItemLayout2}>
                    {getFieldDecorator('remark', {
                      initialValue: this.state.info.remark,
                    })(
                      <TextArea disabled />
                    )}
                  </Form.Item>
                </Col>
              </Row>

            </div>
          </Form>
          )}
        </div>

      </div>
    )
  }
}

const PlanPreparedInfos = Form.create()(PlanPreparedInfo)
export default PlanPreparedInfos
