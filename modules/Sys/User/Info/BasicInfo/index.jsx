import React, { Component } from 'react';
import style from './style.less';
import { Form, Tabs, Row, Col, Input, Checkbox, Button, Icon, Select, DatePicker, TreeSelect, InputNumber } from 'antd';
import { getUserInfoById } from '../../../../../api/api';
import axios from '../../../../../api/axios';
import { connect } from 'react-redux';
import * as dataUtil from '../../../../../utils/dataUtil';
import LabelFormLayout from "../../../../../components/public/Layout/Labels/Form/LabelFormLayout"
import LabelFormButton from "../../../../../components/public/Layout/Labels/Form/LabelFormButton"
const Option = Select.Option;
const { TextArea } = Input;
const FormItem = Form.Item;
const TreeNode = TreeSelect.TreeNode;

export class UserInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loginUser: null, //当前登录用户信息
      userInfo: false,  // 控制点击用户信息的显隐
      info: {},
    };
  }

  componentDidMount() {
    let loginUser = JSON.parse(sessionStorage.getItem('userInfo'));
    this.setState({
      loginUser,
    });

    axios.get('api/sys/org/select/tree').then(res => {
      this.setState({
        orglist: res.data.data,
      });
    });
    axios.get(getUserInfoById(this.props.data.id)).then(res => {
      this.setState({
        info: res.data.data,
      }, () => {
        const { info } = this.state;
        this.setState({
          secutylevellist: info.level ? [{ value: info.level.code, title: info.level.name }] : null,
          cardtypelist: info.cardType ? [{ value: info.cardType.code, title: info.cardType.name }] : null,
          rolelist: info.roles ? info.roles.map(item => ({ id: item.id, roleDesc: item.roleName })) : null,
        });
      });
    });

  }

  //获取角色
  getRole = () => {
    if (!this.state.rolelist1) {
      axios.get('api/sys/role/list').then(res => {
        this.setState({
          rolelist1: res.data.data,
          rolelist: null,
        });
        this.props.form.setFieldsValue({
          roles:[]
        })
      });
    }
  };
  //获取密级
  getSecuty = () => {
    if (!this.state.secutylevellist1) {
      axios.get('api/base/dict/comm.secutylevel/select/tree').then(res => {
        this.setState({
          secutylevellist1: res.data.data,
          secutylevellist: null,
        });
      });
    }
  };
  //获取证件
  getcardtype = () => {
    if (!this.state.cardtypelist1) {
      axios.get('api/base/dict/sys.user.cardtype/select/tree').then(res => {
        this.setState({
          cardtypelist1: res.data.data,
          cardtypelist: null,
        });
      });
    }
  };


  // 表单提交
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      let professional = values['professional'];
      //values['roles'] = this.state.info.roles ? this.state.info.roles.map(item => item.id) : []
      //let roles = values['roles'];
      values['professional'] = dataUtil.Arr().toString(professional);
      //values['roles'] = dataUtil.Arr().toString(roles);
      values['roles'] = this.state.rolelist ? this.state.info.roles.map(item => item.id) : values['roles']
      let id = this.props.data.id;
      let data = {
        ...values,
        orgId: parseInt(values.orgId),
        id,
        birth: dataUtil.Dates().formatTimeString(values.birth),
        entryDate: dataUtil.Dates().formatTimeString(values.entryDate),
        quitDate: dataUtil.Dates().formatTimeString(values.quitDate),
      };
      if (!err) {
        axios.put('api/sys/user/update', data, true).then(res => {
          this.props.updateSuccess(res.data.data);
          // this.props.closeRightBox();
        });
      }
    });
  };

  // 点击用户信息
  userInfoFuc = () => {
    this.setState({
      userInfo: !this.state.userInfo,
    });
  };

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
      <LabelFormLayout title={this.props.title} >
        <Form onSubmit={this.handleSubmit}>
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
                  <Input maxLength={21} />,
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
                  <Input maxLength={21} />,
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item
                label={intl.get('wsd.i18n.sys.user1.sex')} {...formItemLayout}>
                {getFieldDecorator('sex', {
                  initialValue: this.state.info.sex ? this.state.info.sex.id : null,
                  rules: [],
                })(
                  <Select>
                    <Option value={1}>{intl.get('wsd.i18n.sys.user.male')}</Option>
                    <Option value={0}>{intl.get('wsd.i18n.sys.user.female')}</Option>
                  </Select>,
                )}

              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={intl.get('wsd.i18n.sys.user1.birth')} {...formItemLayout}>
                {getFieldDecorator('birth', {
                  initialValue: dataUtil.Dates().formatDateMonent(this.state.info.birth),
                  rules: [],
                })(
                  <DatePicker style={{ width: '100%' }} />,
                )}

              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item label={intl.get('wsd.i18n.doc.projectdoc.commandorg')}
                {...formItemLayout}>
                {getFieldDecorator('orgId', {
                  initialValue: this.state.info.org ? this.state.info.org.id : null,
                  rules: [{
                    required: true,
                    message: intl.get('wsd.i18n.message.select') + intl.get('wsd.i18n.doc.projectdoc.commandorg'),
                  }],
                })(
                  <TreeSelect
                    showSearch
                    style={{ width: '100%' }}

                    treeData={this.state.orglist}


                    allowClear
                    treeDefaultExpandAll
                    onChange={this.onChange}
                  />,
                )}

              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={intl.get('wsd.i18n.sys.user.sortNum')} {...formItemLayout}>
                {getFieldDecorator('sort', {
                  initialValue: this.state.info.sort,
                  rules: [],
                })(
                  <InputNumber style={{ width: '100%' }} precision={0} step={0} max={999999} />,
                )}

              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item label={intl.get('wsd.i18n.sys.user.staffStatues')}
                {...formItemLayout}>
                {getFieldDecorator('staffStatus', {
                  initialValue: this.state.info.staffStatus ? this.state.info.staffStatus.id : null,
                  rules: [{
                    required: true,
                    message: intl.get('wsd.i18n.message.select') + intl.get('wsd.i18n.sys.user.staffStatues'),
                  }],
                })(
                  <Select>
                    <Option value={1}>{intl.get('wsd.i18n.sys.user.staffStatues1')}</Option>
                    <Option value={0}>{intl.get('wsd.i18n.sys.user.staffStatues2')}</Option>
                  </Select>,
                )}

              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={intl.get('wsd.i18n.sys.user1.phone')} {...formItemLayout}>
                {getFieldDecorator('phone', {
                  initialValue: this.state.info.phone,
                  rules: [
                    // {
                    // pattern: /^1(3\d|47|5((?!4)\d)|7\d|8\d)\d{8,8}$/,
                    // message: "手机号格式不对",
                    // }, 
                    {
                    required: true,
                    message: intl.get('wsd.i18n.message.select') + intl.get('wsd.i18n.sys.user1.phone'),
                  }],
                })(
                  <Input maxLength={11} />,
                )}

              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col span={12}>
              <Form.Item
                label={intl.get('wsd.i18n.sys.user1.entryDate')} {...formItemLayout}>
                {getFieldDecorator('entryDate', {
                  initialValue: dataUtil.Dates().formatDateMonent(this.state.info.entryDate),
                  rules: [],
                })(
                  <DatePicker placeholder=""
                    style={{ width: '100%' }} />,
                )}

              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={intl.get('wsd.i18n.sys.user1.leaveDate')}{...formItemLayout}>
                {getFieldDecorator('quitDate', {
                  initialValue: dataUtil.Dates().formatDateMonent(this.state.info.quitDate),
                  rules: [],
                })(
                  <DatePicker placeholder=""
                    style={{ width: '100%' }}
                  />,
                )}

              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item
                label={intl.get('wsd.i18n.sys.user1.cardType')} {...formItemLayout}>
                {getFieldDecorator('cardType', {
                  initialValue: this.state.info.cardType ? this.state.info.cardType.code : null,
                  rules: [{
                    required: true,
                    message: intl.get('wsd.i18n.message.select') + intl.get('wsd.i18n.sys.user1.cardType'),
                  }],
                })(
                  <Select onDropdownVisibleChange={this.getcardtype}>
                    {this.state.cardtypelist ? this.state.cardtypelist.map(item => {
                      return <Option value={item.value} key={item.value}>{item.title}</Option>;
                    }) : this.state.cardtypelist1 && this.state.cardtypelist1.map(item => {
                      return <Option value={item.value} key={item.value}>{item.title}</Option>;
                    })}
                    {/* {} */}
                  </Select>,
                )}

              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label={intl.get('wsd.i18n.sys.user1.cardNum')} {...formItemLayout}>
                {getFieldDecorator('cardNum', {
                  initialValue: this.state.info.cardNum,
                  rules: [{
                    required: true,
                    message: intl.get('wsd.i18n.message.select') + intl.get('wsd.i18n.sys.user1.cardNum'),
                  }],
                })(
                  <Input maxLength={20} />,
                )}

              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col span={12}>
              <Form.Item label="职务" {...formItemLayout}>
                {getFieldDecorator('position', {
                  initialValue: this.state.info.position,
                  rules: [],
                })(
                  <Select>
                    {
                      this.props.position && this.props.position.map((v, i) => {
                        return <Option value={v.value} key={i}>{v.title}</Option>
                      })
                    }
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="专业" {...formItemLayout}>
                {getFieldDecorator('professional', {
                  initialValue: this.state.info.professional ? this.state.info.professional.split(',').map(item => item) : [],
                  rules: [],
                })(
                  <Select mode="multiple">
                    {
                      this.props.professional && this.props.professional.map((v, i) => {
                        return <Option value={v.value} key={i}>{v.title}</Option>
                      })
                    }
                  </Select>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item
                label={intl.get('wsd.i18n.sys.user1.actuname')} {...formItemLayout}>
                {getFieldDecorator('roles', {
                  initialValue: this.state.info.roles ? this.state.info.roles.map(item => item.roleName) : [],
                  rules: [{
                    required: this.state.loginUser != null ? (this.state.loginUser.isOpen == 1 ? false : true) : true,
                    message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.sys.user1.actuname'),
                  }],
                })(
                  <Select mode="multiple" onDropdownVisibleChange={this.getRole}
                    disabled={this.state.loginUser != null ? (this.state.loginUser.isOpen == 1 ? true : false) : false}>
                    {this.state.rolelist ? this.state.rolelist.map(item => {
                      return <Option value={item.id} key={id}>{item.roleDesc}</Option>;
                    }) : this.state.rolelist1 && this.state.rolelist1.map(item => {
                      return <Option value={item.id} key={id}>{item.roleName}</Option>;
                    })}
                  </Select>,
                  //<Input disabled />
                )}

              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="学历" {...formItemLayout}>
                {getFieldDecorator('education', {
                  initialValue: this.state.info.education,
                  rules: [],
                })(
                  <Select>
                    {
                      this.props.education && this.props.education.map((v, i) => {
                        return <Option value={v.value} key={i}>{v.title}</Option>
                      })
                    }
                  </Select>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item label={intl.get('wsd.i18n.sys.user1.email')} {...formItemLayout}>
                {getFieldDecorator('email', {
                  initialValue: this.state.info.email,
                  rules: [{
                    pattern: /^[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+){0,4}@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+){0,4}$/,
                    message: "邮箱格式不对",
                  }],
                })(
                  <Input maxLength={85} />,
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={intl.get('wsd.i18n.sys.user1.flag')} {...formItemLayout}>
                {getFieldDecorator('flag', {
                  valuePropName: 'checked',
                  initialValue: true,
                  rules: [],
                })(
                  <Checkbox></Checkbox>,
                )}

              </Form.Item>
            </Col>
          </Row>

        </Form>
        <LabelFormButton>
          <Button className="globalBtn" onClick={this.props.closeRightBox} style={{ marginRight: 20 }}>取消</Button>
          <Button className="globalBtn" onClick={this.handleSubmit} type="primary"
            disabled={this.state.info.userType == null ? true : (this.state.loginUser.userType == '3' || this.state.info.userType != '1')}
          >保存</Button>
        </LabelFormButton>
      </LabelFormLayout>

    );
  }
}

const UserInfos = Form.create()(UserInfo);
export default connect(state => ({ currentLocale: state.localeProviderData }))(UserInfos);
