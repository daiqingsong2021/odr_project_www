import React, { Component } from 'react';
import style from './style.less';
import {
  Form, Input, Select, Row, Col, Button, DatePicker, TreeSelect, InputNumber,
} from 'antd';
import moment from 'moment';
import { connect } from 'react-redux';
import axios from '../../../../api/axios';
import { roleInfo, roleUpdate, addRole, roleLevel } from '../../../../api/api';
import * as dataUtil from '../../../../utils/dataUtil'

const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;

export class RoleInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initDone: false,
      info: {
        orgId: '',
        orgName: '',       // 机构名称
        orgCode: '',      // 机构代码
        parentOrg: '',   // 上级机构
        orgType: '',     // 机构类型
        grade: '',       // 机构等级
        status: '',       // 机构状态
        sortNum: '',     // 排列顺序
        local: '',       // 所属地域
        orgAddress: '',  // 机构地址
        postCode: '',     // 邮编
        userName: '',    // 联系人
        phone: '',       // 联系电话
        email: '',        // 电子邮箱
        webUrl: '',       // 网站地址
        validDate: '',    // 生效日期
        loseDate: null,     // 失效日期
        remark: '',      // 备注
      },
      treeLevel: [],
    };
  }

  componentDidMount() {
    if (this.props.rightData) {
      this.getRoleInfo();
    } else {
      const data = this.state.info;
      data.parentOrg = {
        id: this.props.parentData ? this.props.parentData.id : 0,
        name: this.props.parentData ? this.props.parentData.orgName : '组织树',
      };
      this.setState({
        info: data,
      });
    }
    this.getRoleLevel();
  }

  getRoleInfo = () => {
    axios.get(roleInfo(this.props.rightData.id)).then(res => {
      if (res.data.data) {
        this.setState({
          info: res.data.data,
        });
      }
    });
  };
  getRoleLevel = () => {
    axios.get(roleLevel).then(res => {
      if (res.data.data) {
        this.setState({
          treeLevel: res.data.data,
        });
      }
    });

  };


  handleSubmit = (val, e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (this.props.rightData) {
          values['id'] = this.props.rightData.id;
          values.effectDate = dataUtil.Dates().formatTimeString(values.effectDate),
            values.invalidDate = dataUtil.Dates().formatTimeString(values.invalidDate),
            axios.put(roleUpdate, values, true).then(res => {
              const data = {
                ...this.props.rightData,
                ...values,
              };
              this.props.updateSuccess(data);
            });
        } else {
          values['parentId'] = this.props.parentData ? this.props.parentData.id : 0;
          values.effectDate = dataUtil.Dates().formatTimeString(values.effectDate),
            values.invalidDate = dataUtil.Dates().formatTimeString(values.invalidDate),
            axios.post(addRole, values, true).then(res => {
              this.props.addSuccess(res.data.data);
              if (val === 'save') {
                this.props.unShow();
              } else {
                this.props.form.resetFields();
              }

            });
        }

      }
    });
  };
  onChange = (value, lbale, extra) => {
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
    return (
      <div className={style.main}>
        <div className={style.mainHeight}>
          {this.props.api == 'add' ? '' : <h3 className={style.listTitle}>基本信息</h3>}
          <div className={style.mainScorll}>
            <Form onSubmit={this.handleSubmit}>
              <div className={style.content}>
                <Row type="flex">
                  <Col span={12}>
                    <Form.Item label={intl.get('wsd.i18n.sys.org.orgname')} {...formItemLayout}>
                      {getFieldDecorator('orgName', {
                        initialValue: this.state.info.orgName,
                        rules: [{
                          required: true,
                          message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.sys.org.orgname'),
                        }],
                      })(
                        <Input maxLength={66} />,
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label={intl.get('wsd.i18n.sys.org.orgcode')} {...formItemLayout}>
                      {getFieldDecorator('orgCode', {
                        initialValue: this.state.info.orgCode,
                        rules: [{
                          required: true,
                          message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.sys.org.orgcode'),
                        }],
                      })(
                        <Input maxLength={33} />,
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <Form.Item label={intl.get('wsd.i18n.sys.org.parentorg')} {...formItemLayout}>
                      {getFieldDecorator('parentOrg', {
                        initialValue: this.state.info.parentOrg.name ? this.state.info.parentOrg.name : '组织树',
                      })(
                        <Input disabled={true} />,
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label={intl.get('wsd.i18n.sys.org.orgtype')} {...formItemLayout}>
                      {getFieldDecorator('orgType', {
                        initialValue: this.state.info.orgType ? this.state.info.orgType.id.toString() : '0',
                        rules: [{
                          required: true,
                          message: intl.get('wsd.i18n.message.select') + intl.get('wsd.i18n.sys.org.orgtype'),
                        }],
                      })(
                        <Select>
                          <Option value="0">公司</Option>
                          <Option value="1">部门</Option>
                        </Select>,
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <Form.Item label={intl.get('wsd.i18n.sys.org.grade')} {...formItemLayout}>
                      {getFieldDecorator('orgLevel', {
                        initialValue: this.state.info.orgLevel ? this.state.info.orgLevel.code : '',
                        rules: [{
                          required: true,
                          message: intl.get('wsd.i18n.message.select') + intl.get('wsd.i18n.sys.org.grade'),
                        }],
                      })(
                        <TreeSelect
                          dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                          treeData={this.state.treeLevel}
                          placeholder="Please select"
                          treeDefaultExpandAll
                          onSelect={this.onChange}
                        />,
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label={intl.get('wsd.i18n.sys.org.status')} {...formItemLayout}>
                      {getFieldDecorator('status', {
                        initialValue: this.state.info.status ? this.state.info.status.code : '1',
                        rules: [{
                          required: true,
                          message: intl.get('wsd.i18n.message.select') + intl.get('wsd.i18n.sys.org.status'),
                        }],
                      })(
                        <Select>
                          <Option value="1">有效</Option>
                          <Option value="0">无效</Option>
                        </Select>,
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                {this.props.api != 'add' && (
                  <Row>
                    <Col span={12}>
                      <Form.Item label={intl.get('wsd.i18n.sys.org.orgAddress')} {...formItemLayout}>
                        {getFieldDecorator('orgAddress', {
                          initialValue: this.state.info.orgAddress,
                          rules: [{
                            // required: true,
                            // message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.sys.org.orgAddress'),
                          }],
                        })(
                          <Input maxLength={66} />,
                        )}
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label={intl.get('wsd.i18n.sys.org.postCode')} {...formItemLayout}>
                        {getFieldDecorator('zipCode', {
                          initialValue: this.state.info.zipCode,
                          rules: [{
                            pattern: /[1-9]\d{5}(?!\d)/,
                            message: "邮编格式不对",
                          }],
                        })(
                          <InputNumber style={{ width: "100%" }} max={9999999999999} min={0} step={0} />,
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                )}
                {this.props.api != 'add' && (
                  <Row>
                    <Col span={12}>
                      <Form.Item label={intl.get('wsd.i18n.sys.org.username')} {...formItemLayout}>
                        {getFieldDecorator('orgContract', {
                          initialValue: this.state.info.orgContract,
                          rules: [{
                            // required: true,
                            // message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.sys.org.username'),
                          }],
                        })(
                          <Input ma={6} />,
                        )}
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label={intl.get('wsd.i18n.sys.org.phone')} {...formItemLayout}>
                        {getFieldDecorator('contractNum', {
                          initialValue: this.state.info.contractNum,
                          rules: [{
                            pattern: /(^1(3\d|47|5((?!4)\d)|7\d|8\d)\d{8,8}$)|(^((0\d{2,3})-?)(\d{7,8})(-(\d{3,}))?$)/,
                            message: "联系电话格式不对",
                          }],
                        })(
                          <Input maxLength={13} />,
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                )}
                {this.props.api != 'add' && (
                  <Row>
                    <Col span={12}>
                      <Form.Item label={intl.get('wsd.i18n.sys.ipt.email')} {...formItemLayout}>
                        {getFieldDecorator('orgEmail', {
                          initialValue: this.state.info.orgEmail,
                          rules: [{
                            pattern: /^[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+){0,4}@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+){0,4}$/,
                            message: "邮箱格式不对",
                          }],
                        })(
                          <Input maxLength={33} />,
                        )}
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label={intl.get('wsd.i18n.sys.ipt.ipaddress')} {...formItemLayout}>
                        {getFieldDecorator('webAddress', {
                          initialValue: this.state.info.webAddress,
                          rules: [],
                        })(
                          <Input maxLength={66} />,
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                )}
                {this.props.api != 'add' && (
                  <Row>
                    <Col span={12}>
                      <Form.Item label={intl.get('wsd.i18n.sys.org.validDate')} {...formItemLayout}>
                        {getFieldDecorator('effectDate', {
                          initialValue: dataUtil.Dates().formatDateMonent(this.state.info.effectDate),
                        })(
                          <DatePicker style={{ width: '100%' }} />,
                        )}
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label={intl.get('wsd.i18n.sys.org.loseDate')} {...formItemLayout}>
                        {getFieldDecorator('invalidDate', {
                          initialValue: dataUtil.Dates().formatDateMonent(this.state.info.invalidDate),
                        })(
                          <DatePicker style={{ width: '100%' }} />,
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                )}
                {this.props.api != 'add' && (
                  <Row>
                    <Col span={12}>
                      <Form.Item label={intl.get('wsd.i18n.sys.org.local')} {...formItemLayout}>
                        {getFieldDecorator('grogLoc', {
                          initialValue: this.state.info.grogLoc,
                          rules: [{
                            // required: true,
                            // message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.sys.org.local'),
                          }],
                        })(
                          <Input maxLength={66} />,
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                )}
                <Row>
                  <Col span={24}>
                    <Form.Item label={intl.get('wsd.i18n.sys.org.remark')} {...formItemLayout1}>
                      {getFieldDecorator('remark', {
                        initialValue: this.state.info.remark,
                        rules: [{
                          // required: true,
                          // message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.sys.org.remark'),
                        }],
                      })(
                        <TextArea rows={4} maxLength={66} />,
                      )}
                    </Form.Item>
                  </Col>
                </Row>


              </div>
            </Form>
          </div>
          <div className={style.mybtn}>
            <Form.Item wrapperCol={{ offset: 4 }} className={this.props.api == 'add' ? style.rightBtn : null}>
              <div>
                {this.props.api == 'add' ? null :
                  <Button className="globalBtn" onClick={this.props.closeRightBox}  style={{ marginRight: 20 }}>取消</Button>}
                {this.props.api == 'add' ?
                  <Button className="globalBtn" onClick={this.handleSubmit.bind(this, 'goOn')}
                    style={{ marginRight: 20 }}
                  >保存并继续</Button> : null}
                <Button className="globalBtn" onClick={this.handleSubmit.bind(this, 'save')}
                 
                  type="primary">保存</Button>

              </div>

            </Form.Item>
          </div>
        </div>

      </div>
    );
  }
}

const RoleInfos = Form.create()(RoleInfo);
export default connect(state => ({
  currentLocale: state.localeProviderData,
}))(RoleInfos);

