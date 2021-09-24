import React, { Component } from 'react'
import { Modal, Tabs, Select, Form, Row, Col, Input, Checkbox, Button, Icon, DatePicker } from 'antd';
import style from './style.less';
import { connect } from 'react-redux'

const Option = Select.Option;
const { TextArea } = Input;
const FormItem = Form.Item;
const locales = {
  'en-US': require('../../../../api/language/en-US.json'),
  'zh-CN': require('../../../../api/language/zh-CN.json'),
};
class Basic extends Component {
  constructor(props) {
    super(props)
    this.state = {
      initDone: false,
      info: {
        actuName: '',
        roleName: '',
        userLevel: '',
        sex: '',
        birth: null,
        entryDate: null,
        leaveDate: null,
        startDate: null,
        passExpirationDate: null,
        startDate: null,
        endDate: null,
        phone: '',
        email: '',
        status: '',
        sortNum: '',

      },
    };
  }
  //国际化
  loadLocales() {
    intl.init({
      currentLocale: 'zh-CN',
      locales,
    })
      .then(() => {
        // After loading CLDR locale data, start to render
        this.setState({ initDone: true });
      });
  }
  // 表单提交
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.submitDetail(values)
      }
    });
  };
  componentDidMount() {
    // this.loadLocales();
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
    const formLayout = {
      labelCol: {
        sm: { span: 4 },
      },
      wrapperCol: {
        sm: { span: 20 },
      },
    };
    return (
      <Form onSubmit={this.handleSubmit2}>
        <div className={style.content}>
          <Row>
            <Col span={12}>
              <Form.Item
                label={intl.get('wsd.i18n.sys.user1.officePost')} {...formItemLayout}>
                {getFieldDecorator('officePost', {
                  initialValue: this.state.info.officePost,
                  rules: [{
                    required: true,
                    message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.sys.user1.officePost'),
                  }],
                })(
                  <Input />,
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={intl.get('wsd.i18n.sys.user1.officeEmail')} {...formItemLayout}>
                {getFieldDecorator('officeEmail', {
                  initialValue: this.state.info.officeEmail,
                  rules: [{
                    required: true,
                    message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.sys.user1.officeEmail'),
                  }],
                })(
                  <Input />,
                )}
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label={intl.get('wsd.i18n.sys.user1.faxNum')} {...formItemLayout}>
                {getFieldDecorator('faxNum', {
                  initialValue: this.state.info.faxNum,
                  rules: [{
                    required: true,
                    message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.sys.user1.faxNum'),
                  }],
                })(
                  <Input />,
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={intl.get('wsd.i18n.sys.user1.officePhone')} {...formItemLayout}>
                {getFieldDecorator('officePhone', {
                  initialValue: this.state.info.officePhone,
                  rules: [{
                    required: true,
                    message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.sys.user1.officePhone'),
                  }],
                })(
                  <Input />,
                )}
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label={intl.get('wsd.i18n.sys.user1.qq')} {...formItemLayout}>
                {getFieldDecorator('qq', {
                  initialValue: this.state.info.qq,
                  rules: [{
                    required: true,
                    message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.sys.user1.qq'),
                  }],
                })(
                  <Input />,
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={intl.get('wsd.i18n.sys.user1.familyPhone')} {...formItemLayout}>
                {getFieldDecorator('familyPhone', {
                  initialValue: this.state.info.familyPhone,
                  rules: [{
                    required: true,
                    message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.sys.user1.familyPhone'),
                  }],
                })(
                  <Input />,
                )}
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                label={intl.get('wsd.i18n.sys.user1.familyAddress')} {...formLayout}>
                {getFieldDecorator('familyAddress', {
                  initialValue: this.state.info.familyAddress,
                  rules: [{
                    required: true,
                    message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.sys.user1.familyAddress'),
                  }],
                })(
                  <Input />,
                )}
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label={intl.get('wsd.i18n.sys.user1.officeAddress')}  {...formLayout}>
                {getFieldDecorator('officeAddress', {
                  initialValue: this.state.info.officeAddress,
                  rules: [{
                    required: true,
                    message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.sys.user1.officeAddress'),
                  }],
                })(
                  <Input />,
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={intl.get('wsd.i18n.sys.user1.blog')} {...formItemLayout}>
                {getFieldDecorator('blog', {
                  initialValue: this.state.info.blog,
                  rules: [{
                    required: true,
                    message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.sys.user1.blog'),
                  }],
                })(
                  <Input />,
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={intl.get('wsd.i18n.sys.user1.familyPost')} {...formItemLayout}>
                {getFieldDecorator('familyPost', {
                  initialValue: this.state.info.familyPost,
                  rules: [{
                    required: true,
                    message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.sys.user1.familyPost'),
                  }],
                })(
                  <Input />,
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={intl.get('wsd.i18n.sys.user1.politicalLook')} {...formItemLayout}>
                {getFieldDecorator('politicalLook', {
                  initialValue: this.state.info.politicalLook,
                  rules: [{
                    required: true,
                    message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.sys.user1.politicalLook'),
                  }],
                })(
                  <Select>
                    <Option value="模块1">党员</Option>
                    <Option value="模块2">团员</Option>
                  </Select>,
                )}

              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={intl.get('wsd.i18n.sys.user1.perMailBox')} {...formItemLayout}>
                {getFieldDecorator('perMailBox', {
                  initialValue: this.state.info.perMailBox,
                  rules: [{
                    required: true,
                    message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.sys.user1.perMailBox'),
                  }],
                })(
                  <Input />,
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={intl.get('wsd.i18n.sys.user1.rank')} {...formItemLayout}>
                {getFieldDecorator('rank', {
                  initialValue: this.state.info.rank,
                  rules: [{
                    required: true,
                    message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.sys.user1.rank'),
                  }],
                })(
                  <Select>
                    <Option value="模块1">一级</Option>
                    <Option value="模块2">二级</Option>
                  </Select>,
                )}

              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={intl.get('wsd.i18n.sys.user1.topUps')} {...formItemLayout}>
                {getFieldDecorator('topUps', {
                  initialValue: this.state.info.topUps,
                  rules: [{
                    required: true,
                    message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.sys.user1.topUps'),
                  }],
                })(
                  <Input />,
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={intl.get('wsd.i18n.sys.user1.manageOrg')} {...formItemLayout}>
                {getFieldDecorator('manageOrg', {
                  initialValue: this.state.info.manageOrg,
                  rules: [{
                    required: true,
                    message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.sys.user1.manageOrg'),
                  }],
                })(
                  <Input />,
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={intl.get('wsd.i18n.sys.user1.manageRole')} {...formItemLayout}>
                {getFieldDecorator('manageRole', {
                  initialValue: this.state.info.manageRole,
                  rules: [{
                    required: true,
                    message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.sys.user1.manageRole'),
                  }],
                })(
                  <Input />,
                )}
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label={intl.get('wsd.i18n.sys.user1.describe')} {...formLayout}>
                {getFieldDecorator('describe', {
                  initialValue: this.state.info.describe,
                  rules: [{
                    required: true,
                    message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.sys.user1.describe'),
                  }],
                })(
                  <TextArea />,
                )}
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label={intl.get('wsd.i18n.sys.user1.mark')} {...formLayout}>
                {getFieldDecorator('mark', {
                  initialValue: this.state.info.qq,
                  rules: [{
                    required: true,
                    message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.sys.user1.mark'),
                  }],
                })(
                  <TextArea />,
                )}

              </Form.Item>
            </Col>

          </Row>


        </div>
        <div className="modalbtn" style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button key={1} onClick={this.props.handleCancel} >取消</Button>
          <Button key={2} onClick={this.handleSubmit2} type="primary" >保存</Button>
        </div>
      </Form>
    )
  }
}

const Basic1 = Form.create()(Basic);
export default connect(state => ({
  currentLocale: state.localeProviderData
}))(Basic1)
