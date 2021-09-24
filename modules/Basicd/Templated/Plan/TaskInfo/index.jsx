import React, {Component} from 'react'
import style from './style.less'
import {Form, Row, Col, Input, Button, InputNumber, Select, DatePicker, Switch} from 'antd';
import moment from 'moment';
import {connect} from 'react-redux'
import axios from "../../../../../api/axios"
import {getdictTree, getTmpltaskTaskInfo, updateTmpltaskTask} from "../../../../../api/api"
import {getCalendarDefaultInfo}from '../../../../../api/suzhou-api'
import LabelFormLayout from "../../../../../components/public/Layout/Labels/Form/LabelFormLayout"
import LabelFormButton from "../../../../../components/public/Layout/Labels/Form/LabelFormButton"
import * as dataUtil from '../../../../../utils/dataUtil'
const Option = Select.Option
const {TextArea} = Input;

//计划模板->基本信息
class TaskInfo extends Component {
  constructor(props) {
    super(props)
    this.state = {
      initDone: false,
      info: {}
    }
  }

  getDefaultCalendarInfo=()=>{
    axios.get(getCalendarDefaultInfo).then(res=>{
       this.setState({
         dayHrCnt:res.data.data ? res.data.data.dayHrCnt : ''
       })
    })
  }

  componentDidMount() {
    //this.getDefaultCalendarInfo()
    axios.get(getTmpltaskTaskInfo(this.props.data.id)).then(res => {
      this.setState({
        info: res.data.data
      }, () => {
        const {info} = this.state
        this.setState({
          planTypeList1: info.planType ? [info.planType] : null,
          planLevelList1: info.planLevel ? [info.planLevel] : null,
          taskTypeList1: info.taskType ? [info.taskType] : null,
          taskdrtnTypeList1: info.drtnType ? [info.drtnType] : null,
        })
        if (info.taskType && (info.taskType.id == "2" || info.taskType.id == "3")) {
          this.setState({
            isEditable: true
          })
        }
      })
    })
  }

  //获取计划类型
  getPlanTypeList = () => {
    if (!this.state.planTypeList) {
      axios.get(getdictTree("plan.define.plantype")).then(res => {
        this.setState({
          planTypeList: res.data.data,
          planTypeList1: null
        })

      })
    }

  }
  //获取计划级别
  getPlanLevelList = () => {
    if (!this.state.planLevelList) {
      axios.get(getdictTree("plan.task.planlevel")).then(res => {
        if (res.data.data) {
          this.setState({
            planLevelList: res.data.data,
            planLevelList1: null
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
            taskTypeList: res.data.data,
            taskTypeList1: null,
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
            taskdrtnTypeList: res.data.data,
            taskdrtnTypeList1: null
          })
        }
      })
    }
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

  handleSubmit = (e) => {
    e.preventDefault();
    const {intl} = this.props.currentLocale
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let obj = {
          ...values,
          id: this.props.data.id,
          creatTime: dataUtil.Dates().formatTimeString(values.creatTime),
          planDrtn: values.planDrtn ? values.planDrtn : 0,
          planQty: values.planQty ? values.planQty : 0,
        }
        axios.put(updateTmpltaskTask, obj, true, intl.get("wsd.global.tip.savesucess")).then(res => {
          this.props.updateSuccess(res.data.data)
        })
      }
    });
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
    let dayHrCnt = this.state.dayHrCnt
    return (
      <LabelFormLayout title = {this.props.title} >
				<Form onSubmit={this.handleSubmit}>
				
        <Row type="flex">
                  <Col span={12}>
                    <Form.Item label={intl.get('wsd.i18n.base.planTem.name')} {...formItemLayout}>
                      {getFieldDecorator('taskName', {
                        initialValue: this.state.info.taskName,
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
                    <Form.Item label={intl.get('wsd.i18n.base.planTemAddTask.code')} {...formItemLayout}>
                      {getFieldDecorator('taskCode', {
                        initialValue: this.state.info.taskCode,
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
                  <Col span={12}>
                    <Form.Item label={intl.get('wsd.i18n.base.planTemAddTask.jobtype')} {...formItemLayout}>
                      {getFieldDecorator('taskType', {
                        initialValue: this.state.info.taskType ? this.state.info.taskType.id : null,
                        rules: [{
                          required: true,
                          message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.base.planTemAddTask.jobtype'),
                        }],
                      })(
                        <Select onDropdownVisibleChange={this.getTaskTypeList} onChange={this.changeTaskType}>
                          {this.state.taskTypeList1 ? this.state.taskTypeList1.map(item => {
                            return <Option value={item.id} key={item.id}>{item.name}</Option>
                          }) : this.state.taskTypeList && this.state.taskTypeList.map(item => {
                            return <Option value={item.value} key={item.value}>{item.title}</Option>
                          })}
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label={intl.get('wsd.i18n.base.planTemAddTask.drtntype')} {...formItemLayout}>
                      {getFieldDecorator('drtnType', {
                        initialValue: this.state.info.drtnType ? this.state.info.drtnType.id : null,
                        rules: [],
                      })(
                        <Select onDropdownVisibleChange={this.getTaskdrtnType} disabled={this.state.isEditable}>
                          {this.state.taskdrtnTypeList1 ? this.state.taskdrtnTypeList1.map(item => {
                            return <Option value={item.id} key={item.id}>{item.name}</Option>
                          }) : this.state.taskdrtnTypeList && this.state.taskdrtnTypeList.map(item => {
                            return <Option value={item.value} key={item.value}>{item.title}</Option>
                          })}
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                </Row>
               
                <Row>
                  <Col span={12}>
                    <Form.Item label={intl.get('wsd.i18n.base.planTemAddTask.plantype')} {...formItemLayout}>
                      {getFieldDecorator('planType', {
                        initialValue: this.state.info.planType ? this.state.info.planType.id : null,
                        rules: [],
                      })(
                        <Select onDropdownVisibleChange={this.getPlanTypeList}>
                          {this.state.planTypeList1 ? this.state.planTypeList1.map(item => {
                            return <Option value={item.id} key={item.id}>{item.name}</Option>
                          }) : this.state.planTypeList && this.state.planTypeList.map(item => {
                            return <Option value={item.value} key={item.value}>{item.title}</Option>
                          })}
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label={intl.get('wsd.i18n.base.planTemAddTask.planlevel')} {...formItemLayout}>
                      {getFieldDecorator('planLevel', {
                        initialValue: this.state.info.planLevel ? this.state.info.planLevel.id : null,
                        rules: [],
                      })(
                        <Select onDropdownVisibleChange={this.getPlanLevelList}>
                          {this.state.planLevelList1 ? this.state.planLevelList1.map(item => {
                            return <Option value={item.id} key={item.id}>{item.name}</Option>
                          }) : this.state.planLevelList && this.state.planLevelList.map(item => {
                            return <Option value={item.value} key={item.value}>{item.title}</Option>
                          })}
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <Form.Item label={intl.get('wsd.i18n.base.planTemAddTask.plandrtn')}  {...formItemLayout}>
                      {getFieldDecorator('planDrtn', {
                        initialValue: this.state.info.planDrtn,
                        rules: this.state.isEditable ? [] : [{
                          required: true,
                          message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.base.planTemAddTask.plandrtn'),
                        }, {pattern: /^\d+(\.\d+)?$/, message: "非负数"}],
                      })(
                        <InputNumber style={{width: '100%'}} max={999999999999} min={0}
                                     formatter={value => `${value}天`}
                                     parser={value => value.replace('天', '')}
                                     disabled={this.state.isEditable}
                        />
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <Form.Item label={intl.get('wsd.i18n.base.planTem.creator')} {...formItemLayout}>
                      {getFieldDecorator('creator', {
                        initialValue: this.state.info.creator ? this.state.info.creator.name : null,
                        rules: [],
                      })(
                        <Input disabled/>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label={intl.get('wsd.i18n.base.planTem.creattime')} {...formItemLayout}>
                      {getFieldDecorator('creatTime', {
                        initialValue: dataUtil.Dates().formatDateMonent(this.state.info.creatTime),
                        rules: [],
                      })(
                        <DatePicker style={{"width": "100%"}} disabled/>
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <Form.Item label={intl.get('wsd.i18n.rsrc.rsrcrole.remark')} {...formItemLayout1}>
                      {getFieldDecorator('remark', {
                        initialValue: this.state.info.remark,
                        rules: [],
                      })(
                        <TextArea rows={2}/>
                      )}
                    </Form.Item>
                  </Col>
                </Row>
				</Form>
				<LabelFormButton>
        <Button onClick={this.props.closeRightBox} style={{width: "100px", marginRight: "20px"}}>{intl.get("wsd.global.btn.cancel")}</Button>
                  <Button onClick={this.handleSubmit} style={{width: "100px"}} type="primary">{intl.get("wsd.global.btn.preservation")}</Button>
				</LabelFormButton>
			</LabelFormLayout>
     
    )
  }
}

const TaskInfos = Form.create()(TaskInfo);
const mapStateToProps = state => {
  return {
    currentLocale: state.localeProviderData,
  }
};
export default connect(mapStateToProps, null)(TaskInfos);
