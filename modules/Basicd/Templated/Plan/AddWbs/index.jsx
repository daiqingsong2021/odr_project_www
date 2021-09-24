import React, {Component} from 'react'
import style from './style.less'
import {Form, Row, Col, Input, Button, Icon, Select, InputNumber, Modal, Switch} from 'antd';
import {connect} from 'react-redux'
import SubmitButton from "../../../../../components/public/TopTags/SubmitButton"
import axios from "../../../../../api/axios"
import {getdictTree, addTmpltaskWbs} from "../../../../../api/api"

const FormItem = Form.Item;
const {TextArea} = Input;
const Option = Select.Option

class BasicdTemplatedPlanAddWbs extends Component {
  constructor(props) {
    super(props)
    this.state = {
      info: {}
    }
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
          planQty: values.planQty ? values.planQty : 0,
        }
        if (type == "go") {
          axios.post(addTmpltaskWbs, obj, true, intl.get("wsd.global.btn.newsuccess")).then(res => {
            this.props.form.resetFields();
            this.props.addData(res.data.data, "wbs")
          })
        } else {
          axios.post(addTmpltaskWbs, obj, true, intl.get("wsd.global.btn.newsuccess")).then(res => {
            this.props.form.resetFields();
            this.props.addData(res.data.data, "wbs")
            this.props.handleCancel()
          })
        }
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
    return (
      <div className={style.main}>
        <Modal className={style.formMain} width="850px" centered={true}
               mask={false}
               maskClosable={false}
               title={intl.get("wsd.i18n.base.planTemAddwbs.title")} visible={true} onCancel={this.props.handleCancel}
               footer={
                 <div className="modalbtn">

                   <SubmitButton key={3} onClick={this.handleSubmit.bind(this, "go")} content={intl.get("wsd.global.btn.saveandcontinue")}/>
                   <SubmitButton key={2} onClick={this.handleSubmit.bind(this, "new")} type="primary" content={intl.get("wsd.global.btn.preservation")}/>
                 </div>
               }
        >
          {/* <h2>{intl.get('wbs.add.name')}</h2>*/}
          <Form onSubmit={this.handleSubmit}>
            <div className={style.content}>
              <Row gutter={24} type="flex">
                <Col span={12}>
                  <Form.Item label={intl.get('wsd.i18n.base.planTemAddWBS.name')} {...formItemLayout}>
                    {getFieldDecorator('taskName', {
                      rules: [{
                        required: true,
                        message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.base.planTemAddWBS.name'),
                      }],
                    })(
                      <Input/>
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={intl.get('wsd.i18n.base.planTemAddWBS.code')} {...formItemLayout}>
                    {getFieldDecorator('taskCode', {
                      rules: [{
                        required: true,
                        message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.base.planTemAddWBS.code'),
                      }],
                    })(
                      <Input/>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}> <Col span={12}>
                <Form.Item label={intl.get('wsd.i18n.base.planTemAddWBS.plandrtn')} {...formItemLayout}>
                  {getFieldDecorator('planDrtn', {
                    initialValue: 1,
                    rules: [{
                      required: true,
                      message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.base.planTemAddWBS.plandrtn'),
                    }, {pattern: /^\d+(\.\d+)?$/, message: "非负数"}],
                  })(
                    <InputNumber style={{width: '100%'}} max={999999999999} min={0} 
                                 formatter={value => `${value}天`}
                                 parser={value => value.replace('天', '')}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label={intl.get('wsd.i18n.base.planTemAddWBS.plantype')} {...formItemLayout}>
                  {getFieldDecorator('planType', {})(
                    <Select onDropdownVisibleChange={this.getPlanTypeList}>
                      {this.state.planTypeList && this.state.planTypeList.map(item => {
                        return <Option value={item.value} key={item.value}>{item.title}</Option>
                      })}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              </Row>
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    label={intl.get('wsd.i18n.base.planTemAddWBS.planlevel')} {...formItemLayout}>
                    {getFieldDecorator('planLevel', {})(
                      <Select onDropdownVisibleChange={this.getPlanLevelList}>
                        {this.state.planLevelList && this.state.planLevelList.map(item => {
                          return <Option value={item.value} key={item.value}>{item.title}</Option>
                        })}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}> <Col span={12}>
                <Form.Item label={intl.get('wsd.i18n.base.planTemAddWBS.iswbsfb')} {...formItemLayout}>
                  {getFieldDecorator('isFeedback', {
                    valuePropName: 'checked',
                    initialValue: false,
                    rules: [],
                  })(
                    <Switch checkedChildren={intl.get("wsd.i18n.base.coderulde.open")} unCheckedChildren={intl.get("wsd.i18n.base.coderulde.close")}/>
                  )}
                </Form.Item>
              </Col>
                <Col span={12}>
                  <Form.Item
                    label={intl.get('wsd.i18n.base.planTemAddWBS.isctrl')} {...formItemLayout}>
                    {getFieldDecorator('controlAccount', {
                      valuePropName: 'checked',
                      initialValue: false,
                      rules: [],
                    })(
                      <Switch checkedChildren={intl.get("wsd.i18n.base.coderulde.open")} unCheckedChildren={intl.get("wsd.i18n.base.coderulde.close")}/>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={24}>
                  <Form.Item label={intl.get('wsd.i18n.base.planTemAddWBS.remark')} {...formItemLayout1}>
                    {getFieldDecorator('remark', {})(
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

const BasicdTemplatedPlanAddWbss = Form.create()(BasicdTemplatedPlanAddWbs);
const mapStateToProps = state => {
  return {
    currentLocale: state.localeProviderData,
  }
};
export default connect(mapStateToProps, null)(BasicdTemplatedPlanAddWbss);
