import React, { Component } from 'react'
import { Modal, Tabs, Select, Form, Row, Col, Input, Checkbox, Button, Icon, DatePicker, InputNumber } from 'antd';
import style from './style.less';
import moment from 'moment'
import axios from '../../../../api/axios'
import { roleList, userInfo } from "../../../../api/api";
import { connect } from 'react-redux'
import * as dataUtil from '../../../../utils/dataUtil'
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
        passExpirationDate: null,
        startDate: null,
        endDate: null,
        phone: '',
        email: '',
        status: '',
        sort: '',
      },
      roleData: []
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
  handleSubmit = (val, e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values['id'] = this.state.info.id
        values['flag'] = values['flag'] ? 1 : 0,
        values.birth=dataUtil.Dates().formatTimeString(values.birth),
        values.entryDate=dataUtil.Dates().formatTimeString(values.entryDate),
        values.quitDate=dataUtil.Dates().formatTimeString(values.quitDate),
        this.props.submitBasic(values, val)
        this.props.form.resetFields()
      }
    });
  };
  componentDidMount() {
    // this.loadLocales();
    this.getRoleList();
    if (this.props.submit == 'put') {
      axios.get(userInfo(this.props.selectData.id)).then(res => {
        var roles = []
        if (res.data.data.roles) {
          for (var i = 0; i < res.data.data.roles.length; i++) {
            roles.push(res.data.data.roles[i].id)
          }
          res.data.data.roles = roles
        }
        this.setState({
          info: res.data.data
        })
      })
    }
  }
  getRoleList = () => {
    axios.get(roleList).then(res => {
    if(res.data.data){
      this.setState({
        roleData: res.data.data
      })
    }
    
    })
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
    const formLayout = {
      labelCol: {
        sm: { span: 4 },
      },
      wrapperCol: {
        sm: { span: 20 },
      },
    };
    return (
      <Form onSubmit={this.handleSubmit}>
        <div className={style.content}>
          <Row>
            <Col span={12}>
              <Form.Item label={intl.get('wsd.i18n.sys.user1.name')} {...formItemLayout}>
                {getFieldDecorator('actuName', {
                  initialValue: this.state.info.actuName,
                  rules: [{
                    required: true,
                    message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.sys.user1.name'),
                  }],
                })(
                  <Input />,
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={intl.get('wsd.i18n.sys.user.actuName')} {...formItemLayout}>
                {getFieldDecorator('userName', {
                  initialValue: this.state.info.userName,
                  rules: [{
                    required: true,
                    message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.sys.user.actuName'),
                  }],
                })(
                  <Input />,
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={intl.get('wsd.i18n.sys.user1.actuname')} {...formItemLayout}>
                {getFieldDecorator('roles', {
                  initialValue: this.state.info.roles,
                  rules: [],
                })(
                  <Select
                    mode="multiple"
                  >
                    {
                      this.state.roleData.map((v, i) => {
                        return (<Option key={v.id} value={v.id}>{v.roleName}</Option>)
                      })
                    }
                  </Select>
                )}

              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={intl.get('wsd.i18n.sys.user1.userlevel')} {...formItemLayout}>
                {getFieldDecorator('level', {
                  initialValue: this.state.info.level ? this.state.info.level.code : '0',
                  rules: [{
                    required: true,
                    message: intl.get('wsd.i18n.message.select') + intl.get('wsd.i18n.sys.user1.userlevel'),
                  }],
                })(
                  <Select>
                    <Option value="0">非密</Option>
                    <Option value="1">保密</Option>
                  </Select>,
                )}

              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={intl.get('wsd.i18n.sys.user1.sex')} {...formItemLayout}>
                {getFieldDecorator('sex', {
                  initialValue: this.state.info.sex ? this.state.info.sex.id.toString() : '0',
                  rules: [],
                })(
                  <Select>
                    <Option value="1">男</Option>
                    <Option value="0">女</Option>
                  </Select>,
                )}

              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={intl.get('wsd.i18n.sys.user1.birth')} {...formItemLayout}>
                {getFieldDecorator('birth', {
                  initialValue: dataUtil.Dates().formatDateMonent( this.state.info.birth ) ,
                  rules: [],
                })(
                  <DatePicker style={{ width: '100%' }} />,
                )}

              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={intl.get('wsd.i18n.sys.user1.status')} {...formItemLayout}>
                {getFieldDecorator('staffStatus', {
                  initialValue: this.state.info.staffStatus ? this.state.info.staffStatus.id.toString() : '1',
                  rules: [{
                    required: true,
                    message: intl.get('wsd.i18n.message.select') + intl.get('wsd.i18n.sys.user1.status'),
                  }],
                })(
                  <Select>
                    <Option value="0">离职</Option>
                    <Option value="1">在岗</Option>
                  </Select>,
                )}

              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={intl.get('wsd.i18n.sys.user1.cardType')} {...formItemLayout}>
                {getFieldDecorator('cardType', {
                  initialValue: this.state.info.cardType ? this.state.info.cardType.code : '0',
                  rules: [],
                })(
                  <Select>
                    <Option value="0">身份证</Option>
                    <Option value="1">护照</Option>
                  </Select>,
                )}

              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={intl.get('wsd.i18n.sys.user1.entryDate')} {...formItemLayout}>
                {getFieldDecorator('entryDate', {
                  initialValue:  dataUtil.Dates().formatDateMonent( this.state.info.entryDate) ,
                  rules: [],
                })(
                  <DatePicker style={{ width: '100%' }} />,
                )}

              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={intl.get('wsd.i18n.sys.user1.cardNum')} {...formItemLayout}>
                {getFieldDecorator('cardNum', {
                  initialValue: this.state.info.cardNum,
                  rules: [],
                })(
                  <InputNumber style={{ width: '100%' }} />,
                )}

              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={intl.get('wsd.i18n.sys.user1.leaveDate')}{...formItemLayout}>
                {getFieldDecorator('quitDate', {
                  initialValue:  dataUtil.Dates().formatDateMonent(this.state.info.quitDate) ,
                  rules: [],
                })(
                  <DatePicker style={{ width: '100%' }} />,
                )}

              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={intl.get('wsd.i18n.sys.user1.phone')} {...formItemLayout}>
                {getFieldDecorator('phone', {
                  initialValue: this.state.info.phone,
                  rules: [],
                })(
                  <InputNumber style={{ width: '100%' }} />,
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={intl.get('wsd.i18n.sys.user1.sortnum')} {...formItemLayout}>
                {getFieldDecorator('sort', {
                  initialValue: this.state.info.sort,
                })(
                  <InputNumber style={{ width: '100%' }} />,
                )}

              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={intl.get('wsd.i18n.sys.wfbizvar.userDep')} {...formItemLayout}>
                {getFieldDecorator('parentOrg', {
                  initialValue: this.props.rightData.orgName,
                })(
                  <Input disabled />,
                )}

              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={intl.get('wsd.i18n.sys.user1.flag')} {...formItemLayout}>
                {getFieldDecorator('flag', {
                  initialValue: true,
                  valuePropName: 'checked',
                })(
                  <Checkbox disabled></Checkbox>,
                )}

              </Form.Item>
            </Col>
          </Row>
          <div className="modalbtn" style={{ display: 'flex', justifyContent: 'flex-end' }}>
            {this.props.submit == 'add' ?
              <Button key={2} onClick={this.handleSubmit.bind(this, 'goOn')} >保存并继续</Button> :
              <Button key={1} onClick={this.props.handleCancel} >取消</Button>
            }

            <Button key={3} onClick={this.handleSubmit.bind(this, 'save')} type="primary" >保存</Button>
          </div>
        </div>


      </Form>
    )
  }
}

const Basic1 = Form.create()(Basic);
export default connect(state => ({
  currentLocale: state.localeProviderData
}))(Basic1)
