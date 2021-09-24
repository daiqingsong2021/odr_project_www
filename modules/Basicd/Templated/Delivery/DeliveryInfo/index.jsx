import React, { Component } from 'react'
import style from './style.less'
import { Form, Row, Col, Input, Button, Icon, Select, DatePicker } from 'antd';
import { connect } from 'react-redux'
import moment from 'moment';
import { getTmpldelvInfoById, getdictTree, updateTmpldelvList } from "../../../../../api/api"
import axios from "../../../../../api/axios"
import * as dataUtil from '../../../../../utils/dataUtil'
import LabelFormLayout from "../../../../../components/public/Layout/Labels/Form/LabelFormLayout"
import LabelFormButton from "../../../../../components/public/Layout/Labels/Form/LabelFormButton"
const { TextArea } = Input;
//交付物模板->基本信息
class BasicdTemplatedDeliveryInfo extends Component {
  constructor(props) {
    super(props)
    this.state = {
      initDone: false,
      info: {

      }
    }
  }
  componentDidMount() {
    axios.get(getTmpldelvInfoById(this.props.data.id)).then(res => {
      this.setState({
        info: res.data.data
      }, () => {
        const { info } = this.state
        this.setState({
          delvProjectTypeList1: info.typeType ? [info.typeType] : null
        })
      })
    })
  }


  //获取项目类型
  getDelvProjectTypeList = () => {
    if (!this.state.delvProjectTypeList) {
      axios.get(getdictTree("delv.project.type")).then(res => {

        if (res.data.data) {
          this.setState({
            delvProjectTypeList: res.data.data,
            delvProjectTypeList1: null
          })
        }
      })
    }
  }
  handleSubmit = (e) => {
    e.preventDefault();

    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let obj = {
          ...values,
          id: this.props.data.id,
          creatTime: dataUtil.Dates().formatTimeString(values.creatTime),
        }
        axios.put(updateTmpldelvList, obj, true).then(res => {
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
    return (
      <LabelFormLayout title={this.props.title} >
        <Form onSubmit={this.handleSubmit}>
          <Row type="flex">
            <Col span={12}>
              <Form.Item label={intl.get('wsd.i18n.base.docTem.doctitle')} {...formItemLayout}>
                {getFieldDecorator('typeTitle', {
                  initialValue: this.state.info.typeTitle,
                  rules: [{
                    required: true,
                    message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.base.docTem.doctitle'),
                  }],
                })(
                  <Input maxLength={66} />
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={intl.get('wsd.i18n.base.docTem.docnum')} {...formItemLayout}>
                {getFieldDecorator('typeNum', {
                  initialValue: this.state.info.typeNum,
                  rules: [{
                    required: true,
                    message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.base.docTem.docnum'),
                  }],
                })(
                  <Input maxLength={33} />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row >
            <Col span={12}>
              <Form.Item label={intl.get('wsd.i18n.base.docTem.docversion')} {...formItemLayout}>
                {getFieldDecorator('typeVersion', {
                  initialValue: this.state.info.typeVersion,
                  rules: [{
                    required: true,
                    message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.base.docTem.docversion'),
                  }],
                })(
                  <Input />
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={intl.get('wsd.i18n.base.docTem.doctype')} {...formItemLayout}>
                {getFieldDecorator('typeType', {
                  initialValue: this.state.info.typeType ? this.state.info.typeType.id : null,
                  rules: [],
                })(
                  <Select onDropdownVisibleChange={this.getDelvProjectTypeList}>
                    {this.state.delvProjectTypeList1 ? this.state.delvProjectTypeList1.map(item => {
                      return <Option value={item.id} key={item.id}>{item.name}</Option>
                    }) : this.state.delvProjectTypeList && this.state.delvProjectTypeList.map(item => {
                      return <Option value={item.value} key={item.value}>{item.title}</Option>
                    })}
                  </Select>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row >

            <Col span={12}>
              <Form.Item label={intl.get('wsd.i18n.base.docTem.creattime')} {...formItemLayout}>
                {getFieldDecorator('creatTime', {
                  initialValue: dataUtil.Dates().formatDateMonent(this.state.info.creatTime),
                  rules: [],
                })(
                  <DatePicker style={{ "width": "100%" }} disabled={true} />
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={intl.get('wsd.i18n.base.docTem.creator')} {...formItemLayout}>
                {getFieldDecorator('creator', {
                  initialValue: this.state.info.creator ? this.state.info.creator.name : null,
                  rules: [],
                })(
                  <Input disabled={true} />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item label={intl.get('wsd.i18n.operate.fdback.remark')} {...formItemLayout2}>
                <div className={style.list}>
                  {getFieldDecorator('typeDesc', {
                    initialValue: this.state.info.typeDesc
                  })(
                    <TextArea maxLength={333} />
                  )}
                </div>
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

const BasicdTemplatedDeliveryInfos = Form.create()(BasicdTemplatedDeliveryInfo);
const mapStateToProps = state => {
  return {
    currentLocale: state.localeProviderData,
  }
};


export default connect(mapStateToProps, null)(BasicdTemplatedDeliveryInfos);
