import React, { Component } from 'react'
import style from './style.less'
import { Form, Row, Col, Input, Button, InputNumber, Select, DatePicker, Switch } from 'antd';
import { connect } from 'react-redux'
import moment from 'moment';
import axios from "../../../../../api/axios"
import { getdictTree, getTmpltaskWbsInfo, updateTmpltaskWbsInfo } from "../../../../../api/api"
import {getCalendarDefaultInfo}from '../../../../../api/suzhou-api'
import LabelFormLayout from "../../../../../components/public/Layout/Labels/Form/LabelFormLayout"
import LabelFormButton from "../../../../../components/public/Layout/Labels/Form/LabelFormButton"
const Option = Select.Option
const { TextArea } = Input;
import * as dataUtil from '../../../../../utils/dataUtil'

//计划模板->基本信息
class WbsInfo extends Component {
  constructor(props) {
    super(props)
    this.state = {
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

  //获取计划类型
  getPlanTypeList = () => {
    if (!this.state.planTypeList) {
      axios.get(getdictTree("plan.define.plantype")).then(res => {
        if (res.data.data) {
          this.setState({
            planTypeList: res.data.data,
            planTypeList1: null
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
            planLevelList: res.data.data,
            planLevelList1: null
          })
        }
      })
    }
  }

  componentDidMount() {
  //  this.getDefaultCalendarInfo()
    axios.get(getTmpltaskWbsInfo(this.props.data.id)).then(res => {
      this.setState({
        info: res.data.data
      }, () => {
        const { info } = this.state
        this.setState({
          planTypeList1: info.planType ? [info.planType] : null,
          planLevelList1: info.planLevel ? [info.planLevel] : null,
        })
      })
    })
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { intl } = this.props.currentLocale
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let obj = {
          ...values,
          isFeedback: values.isFeedback ? 1 : 0,
          creatTime: dataUtil.Dates().formatTimeString(values.creatTime),
          controlAccount: values.controlAccount ? 1 : 0,
          id: this.props.data.id,
          planQty: values.planQty ? values.planQty : 0,
        }
        axios.put(updateTmpltaskWbsInfo, obj, true, intl.get("wsd.global.tip.savesucess")).then(res => {
          this.props.updateSuccess(res.data.data)
        })
      }
    });
  }

  render() {
    const { intl } = this.props.currentLocale
    const {
      getFieldDecorator, getFieldsError, getFieldError, isFieldTouched,
    } = this.props.form;
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
    const formItemLayout1 = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
    };
    let dayHrCnt = this.state.dayHrCnt
    return (
      <LabelFormLayout title={this.props.title} >
        <Form onSubmit={this.handleSubmit}>

          <Row type="flex">
            <Col span={12}>
              <Form.Item label={intl.get('wsd.i18n.base.planTem.name')} {...formItemLayout}>
                {getFieldDecorator('taskName', {
                  initialValue: this.state.info.taskName,
                  rules: [{
                    required: true,
                    message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.base.planTem.name'),
                  }],
                })(
                  <Input />
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={intl.get("wsd.i18n.plan.feedback.code")} {...formItemLayout}>
                {getFieldDecorator('taskCode', {
                  initialValue: this.state.info.taskCode,
                  rules: [{
                    required: true,
                    message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.plan.feedback.code'),
                  }],
                })(
                  <Input />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item label={intl.get("wsd.i18n.plan.feedback.plandrtn")} {...formItemLayout}>
                {getFieldDecorator('planDrtn', {
                  initialValue: this.state.info.planDrtn ,
                  rules: [{
                    required: true,
                    message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.plan.feedback.plandrtn'),
                  }, { pattern: /^\d+(\.\d+)?$/, message: "非负数" }],
                })(
                  <InputNumber style={{ width: '100%' }} max={999999999999} min={0}
                    formatter={value => `${value}天`}
                    parser={value => value.replace('天', '')}
                  />
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={intl.get("wsd.i18n.plan.feedback.plantype")} {...formItemLayout}>
                {getFieldDecorator('planType', {
                  initialValue: this.state.info.planType ? this.state.info.planType.id : null,

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
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item label={intl.get("wsd.i18n.plan.feedback.planlevel")} {...formItemLayout}>
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
              <Form.Item label={intl.get('wsd.i18n.base.planTemAddWBS.iswbsfb')} {...formItemLayout}>
                {getFieldDecorator('isFeedback', {
                  initialValue: this.state.info.isFeedback && this.state.info.isFeedback == 1 ? true : false,
                  valuePropName: 'checked',
                  rules: [],
                })(
                  <Switch checkedChildren={intl.get("wsd.i18n.base.coderulde.open")} unCheckedChildren={intl.get("wsd.i18n.base.coderulde.close")} />
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={intl.get("wsd.i18n.plan.feedback.controlaccount")} {...formItemLayout}>
                {getFieldDecorator('controlAccount', {
                  initialValue: this.state.info.controlAccount && this.state.info.controlAccount == 1 ? true : false,
                  valuePropName: 'checked',
                  rules: [],
                })(
                  <Switch checkedChildren={intl.get("wsd.i18n.base.coderulde.open")} unCheckedChildren={intl.get("wsd.i18n.base.coderulde.close")} />
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
                  <Input disabled />
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={intl.get('wsd.i18n.base.planTem.creattime')} {...formItemLayout}>
                {getFieldDecorator('creatTime', {
                  initialValue: dataUtil.Dates().formatDateMonent(this.state.info.creatTime),
                  rules: [],
                })(
                  <DatePicker style={{ "width": "100%" }} disabled />
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
                  <TextArea rows={2} />
                )}
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <LabelFormButton>
          <Button onClick={this.props.closeRightBox} style={{ width: "100px", marginRight: "20px" }}>{intl.get("wsd.global.btn.cancel")}</Button>
          <Button onClick={this.handleSubmit} style={{ width: "100px" }} type="primary">{intl.get("wsd.global.btn.preservation")}</Button>
        </LabelFormButton>
      </LabelFormLayout>

    )
  }
}

const WbsInfos = Form.create()(WbsInfo);
const mapStateToProps = state => {
  return {
    currentLocale: state.localeProviderData,
  }
};
export default connect(mapStateToProps, null)(WbsInfos);
