import React, { Component } from 'react'
import style from './style.less'
import { Form, Row, Col, Input, Button, Icon, Select, DatePicker, Switch } from 'antd';

import moment from 'moment';
import { connect } from 'react-redux'
import axios from "../../../../../api/axios"
import { updateTmpltaskInfo, getTmpltaskInfo } from "../../../../../api/api"
import LabelFormLayout from "../../../../../components/public/Layout/Labels/Form/LabelFormLayout"
import LabelFormButton from "../../../../../components/public/Layout/Labels/Form/LabelFormButton"
import * as dataUtil from '../../../../../utils/dataUtil'
//计划模板->基本信息
class BasicdTemplatedPlanPlanInfo extends Component {
  constructor(props) {
    super(props)
    this.state = {

      info: {

      }
    }
  }
  componentDidMount() {
    axios.get(getTmpltaskInfo(this.props.data.id)).then(res => {
      this.setState({
        info: res.data.data
      })
    })
  }



  handleSubmit = (e) => {
    e.preventDefault();
    const { intl } = this.props.currentLocale
    this.props.form.validateFieldsAndScroll((err, values) => {

      if (!err) {
        let obj = {
          id: this.props.data.id,
          ...values,
          creatTime: dataUtil.Dates().formatTimeString(values.creatTime),
          isGlobal: values.isGlobal ? 1 : 0
        }
        axios.put(updateTmpltaskInfo, obj, true, intl.get("wsd.global.tip.savesucess")).then(res => {
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

    return (
      <LabelFormLayout title={this.props.title} >
        <Form onSubmit={this.handleSubmit}>

          <Row >
            <Col span={12}>
              <Form.Item label={intl.get('wsd.i18n.base.planTem.name')} {...formItemLayout}>
                {getFieldDecorator('tmplName', {
                  initialValue: this.state.info.tmplName,
                  rules: [{
                    required: true,
                    message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.base.planTem.name'),
                  }],
                })(
                  <Input maxLength={66} />
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="全局" {...formItemLayout}>
                {getFieldDecorator('isGlobal', {
                  initialValue: this.state.info.isGlobal && this.state.info.isGlobal == 1 ? true : null,
                  valuePropName: 'checked',

                })(
                  <Switch checkedChildren={intl.get("wsd.i18n.base.coderulde.open")} unCheckedChildren={intl.get("wsd.i18n.base.coderulde.close")} />
                )}
              </Form.Item>
            </Col>
          </Row>

          <Row >
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

        </Form>
        <LabelFormButton>
          <Button onClick={this.props.closeRightBox} style={{ width: "100px", marginRight: "20px" }}>{intl.get("wsd.global.btn.cancel")}</Button>
          <Button onClick={this.handleSubmit} style={{ width: "100px" }} type="primary">{intl.get("wsd.global.btn.preservation")}</Button>
        </LabelFormButton>
      </LabelFormLayout>

    )
  }
}


const BasicdTemplatedPlanPlanInfos = Form.create()(BasicdTemplatedPlanPlanInfo);

const mapStateToProps = state => {
  return {
    currentLocale: state.localeProviderData,
  }
};


export default connect(mapStateToProps, null)(BasicdTemplatedPlanPlanInfos);