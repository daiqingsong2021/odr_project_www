import React, { Component } from 'react'
import style from './style.less'
import { Form, Row, Col, Input, Button, Icon, Select, DatePicker } from 'antd';
import moment from 'moment';
import { connect } from 'react-redux'
import { currencyInfo, currencyUpdata } from '../../../../../api/api'
import axios from '../../../../../api/axios';
import * as dataUtil from '../../../../../utils/dataUtil'
import LabelFormLayout from "../../../../../components/public/Layout/Labels/Form/LabelFormLayout"
import LabelFormButton from "../../../../../components/public/Layout/Labels/Form/LabelFormButton"
const FormItem = Form.Item;
const { TextArea } = Input;
//文档模板->基本信息
export class BasicdGlobaldCurInfo extends Component {
  constructor(props) {
    super(props)
    this.state = {
      initDone: false,
      info: {},
      rightData: []
    }
  }
  componentDidMount() {
    let currencyid = this.props.rightData.id

    axios.get(currencyInfo(currencyid), {}).then(res => {
      let data = res.data.data
      this.setState({
        rightData: data
      })
    })
  }



  //点击保存，
  handleSubmit = (e) => {
    e.preventDefault();

    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let data = {
          ...values,
          id: this.props.rightData.id,
          creatTime: dataUtil.Dates().formatTimeString(values.creatTime),
        }
        axios.put(currencyUpdata, data, true, '更新成功').then(res => {
          this.props.updateData(res.data.data);

        })

      }

    });
  }

  render() {

    const { intl } = this.props.currentLocale;
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
    const formItemLayout2 = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
    };
    return (
      <LabelFormLayout title={this.props.title} >
        <Form onSubmit={this.handleSubmit}>
          <Row >
            <Col span={12}>
              <Form.Item label={intl.get('wsd.i18n.base.currency.currname')} {...formItemLayout}>
                {getFieldDecorator('currencyName', {
                  initialValue: this.state.rightData.currencyName,
                  rules: [{
                    required: true,
                    message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.base.currency.currname'),
                  }],
                })(
                  <Input maxLength={66} />
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={intl.get('wsd.i18n.base.currency.currcode')} {...formItemLayout}>
                {getFieldDecorator('currencyCode', {
                  initialValue: this.state.rightData.currencyCode,
                  rules: [{
                    required: true,
                    message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.base.currency.currcode'),
                  }],
                })(
                  <Input maxLength={33} />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row> <Col span={12}>
            <Form.Item label={intl.get('wsd.i18n.base.currency.currsymbol')} {...formItemLayout}>
              {getFieldDecorator('currencySymbol', {
                initialValue: this.state.rightData.currencySymbol,
                rules: [{
                  required: true,
                  message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.base.currency.currsymbol'),
                }],
              })(
                <Input maxLength={33} />
              )}
            </Form.Item>
          </Col>
            <Col span={12}>
              <Form.Item label={intl.get('wsd.i18n.base.currency.creattime')} {...formItemLayout}>
                {getFieldDecorator('creatTime', {
                  initialValue: dataUtil.Dates().formatDateMonent(this.state.rightData.creatTime),
                  rules: [],
                })(
                  <DatePicker style={{ width: '100%' }} disabled={true} />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>

            <Col span={12}>
              <Form.Item label={intl.get('wsd.i18n.base.currency.creator')} {...formItemLayout}>
                {getFieldDecorator('creator', {
                  initialValue: this.state.rightData.creator ? this.state.rightData.creator.name : '',
                  rules: [],
                })(
                  <Input disabled={true} />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item label={intl.get('wsd.i18n.base.currency.remark')} {...formItemLayout2}>
                {getFieldDecorator('remark', {
                  initialValue: this.state.rightData.remark,
                  rules: [],
                })(
                  <TextArea rows={2} maxLength={500} />
                )}
              </Form.Item>
            </Col>
          </Row>

        </Form>
        <LabelFormButton>
          <Button onClick={this.props.closeRightBox} style={{ width: "100px", marginRight: "20px" }}>取消</Button>
          <Button onClick={this.handleSubmit} style={{ width: "100px" }} type="primary">保存</Button>
        </LabelFormButton>
      </LabelFormLayout>

    )
  }
}


const BasicdGlobaldCurInfos = Form.create()(BasicdGlobaldCurInfo);
export default connect(state => ({
  currentLocale: state.localeProviderData
}))(BasicdGlobaldCurInfos)