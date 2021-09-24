import React, { Component } from 'react';
import style from './style.less';
import { Form, Tabs, Row, Col, Input, Checkbox, Button, Icon, Select, DatePicker, TreeSelect, InputNumber, Modal } from 'antd';
import axios from "../../../../../api/axios"
import { orgTree, roleList, userInfo } from "../../../../../api/api"
import { connect } from 'react-redux';
import SubmitButton from "../../../../../components/public/TopTags/SubmitButton"
import * as dataUtil from "../../../../../utils/dataUtil"
const TabPane = Tabs.TabPane;
const Option = Select.Option;
const { TextArea } = Input;
const FormItem = Form.Item;
const TreeNode = TreeSelect.TreeNode;


export class PlanPrepared extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initDone: false,
      quitDate: null,
      isSetLeavedate: false,//离职日期可编辑
      userInfo: false,  // 用户信息
      secutylevellist1: [{ value: "1", title: "非密" }],
      info: {}
    };
  }

  componentDidMount() {

    let userInfo1 = JSON.parse(sessionStorage.getItem('userInfo'))
    this.setState({
      loginUser: userInfo1
    })
    axios.get(orgTree).then(res => {
      this.setState({
        orglist: res.data.data
      })
    })
    axios.get(userInfo(this.props.selectData.id)).then(res => {
      this.setState({
        info: res.data.data,
      }, () => {
        const { info } = this.state;
        this.setState({
          secutylevellist1: info.level ? [{ value: info.level.code, title: info.level.name }] : null,
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
    if (!this.state.secutylevellist) {
      axios.get('api/base/dict/comm.secutylevel/select/tree').then(res => {
        this.setState({
          secutylevellist: res.data.data,
          secutylevellist1: null,
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

  //取消关闭
  closeModal = () => {
    this.props.form.resetFields();
    this.props.closeBasicModal()
  }
  // 表单提交
  handleSubmit = (e) => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      let professional = values['professional'];
      values['professional'] = dataUtil.Arr().toString(professional);
      values['roles'] = this.state.rolelist ? this.state.info.roles.map(item => item.id) : values['roles']
      let id = this.props.selectData.id;
      let data = {
        ...values,
        orgId: this.props.rightData.id,
        flag: values.flag ? 1 : 0,
        id,
        birth: dataUtil.Dates().formatTimeString(values.birth),
        entryDate: dataUtil.Dates().formatTimeString(values.entryDate),
        quitDate: dataUtil.Dates().formatTimeString(values.quitDate),
        //roles: this.state.info.roles ? this.state.info.roles.map(item=>item.id) : []
      };

      if (!err) {
        axios.put('api/sys/user/update', data, true).then(res => {
          this.props.updateUser(res.data.data);
          this.props.handleCancel()
        });
      }
    });
  };



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
      <div>
        <Modal width="850px"
          className={style.main}
          mask={false}
          maskClosable={false}
          title="修改用户"
          visible={true}
          onCancel={this.props.handleCancel}
          bodyStyle={{ padding: '5px' }}
          centered={true}
          footer={<div className="modalbtn">
            <SubmitButton key={1} onClick={this.props.handleCancel} content="取消" />
            <SubmitButton key={2} onClick={this.handleSubmit} type="primary" content="保存" />
          </div>}
        // footer={null}
        >
          <div className={style.userFromInfo}>

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
                  {/* <Col span={12}>
                    <Form.Item
                      label={intl.get('wsd.i18n.sys.user1.userlevel')} {...formItemLayout}>
                      {getFieldDecorator('level', {
                        initialValue: this.state.info.level ? this.state.info.level.code : null,
                        rules: [{
                          required: true,
                          message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.sys.user1.userlevel'),
                        }],
                      })(
                        <Select onDropdownVisibleChange={this.getSecuty}
                          disabled={this.state.loginUser != null ? (this.state.loginUser.isOpen == 1 ? true : false) : false}>
                          {this.state.secutylevellist ? this.state.secutylevellist.map(item => {
                            return <Option value={item.value} key={item.value}>{item.title}</Option>;
                          }) : this.state.secutylevellist1 && this.state.secutylevellist1.map(item => {
                            return <Option value={item.value} key={item.value}>{item.title}</Option>;
                          })}
                        </Select>,
                      )}

                    </Form.Item>
                  </Col> */}
                   <Col span={12}>
                    <Form.Item label={intl.get('wsd.i18n.doc.projectdoc.commandorg')}
                      {...formItemLayout}>
                      {getFieldDecorator('orgId', {
                        initialValue: this.props.rightData.orgName,

                      })(
                        <Input disabled />
                      )}

                    </Form.Item>
                  </Col>
                </Row>
                <Row>
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
                  <Col span={12}>
                    <Form.Item label={intl.get('wsd.i18n.sys.user.sortNum')} {...formItemLayout}>
                      {getFieldDecorator('sort', {
                        initialValue: this.state.info.sort,
                        rules: [],
                      })(
                        <InputNumber style={{ width: '100%' }} step={0} max={999999} precision={0} />,
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
                          message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.sys.user.staffStatues'),
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
                        rules: [{
                          pattern: /^1(3\d|47|5((?!4)\d)|7\d|8\d)\d{8,8}$/,
                          message: "手机号格式不对",
                        },{
                          required: true,
                          message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.sys.user1.phone'),
                        }],
                      })(
                        <Input maxLength={20} />,
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
                        rules: [],
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
              </div>
            </Form>
          </div>

        </Modal>
      </div>
    );
  }
}


const PlanPreparedS = Form.create()(PlanPrepared);
const mapStateToProps = state => {
  return {
    currentLocale: state.localeProviderData,
  }
};


export default connect(mapStateToProps, null)(PlanPreparedS);
