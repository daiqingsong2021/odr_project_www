import React, { Component } from 'react';
import style from './style.less';
import { Form, Tabs, Row, Col, Input, Checkbox, Button, Icon, Select, DatePicker, TreeSelect, InputNumber, Modal } from 'antd';
import axios from "../../../../api/axios"
import { connect } from 'react-redux';
import SubmitButton from "../../../../components/public/TopTags/SubmitButton"
import * as dataUtil from '../../../../utils/dataUtil';
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
      secutylevellist1: [{ value: "1", title: "非密" }]
    };
  }

  componentDidMount() {

    let userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
    this.setState({
      userInfo
    })
    axios.get("api/sys/org/select/tree").then(res => {
      this.setState({
        orglist: res.data.data
      })
    })


  }


  //获取角色
  getRole = () => {
    if (!this.state.rolelist) {
      axios.get("api/sys/role/list").then(res => {
        if (res.data.data) {
          this.setState({
            rolelist: res.data.data
          })
        }

      })
    }
  }
  //获取密级
  getSecuty = () => {
    if (!this.state.secutylevellist) {
      axios.get("api/base/dict/comm.secutylevel/select/tree").then(res => {
        if (res.data.data) {
          this.setState({
            secutylevellist: res.data.data,
            secutylevellist1: null
          })
        }
      })
    }
  }
  //获取证件
  getcardtype = () => {
    if (!this.state.cardtypelist) {
      axios.get("api/base/dict/sys.user.cardtype/select/tree").then(res => {
        if (res.data.data) {
          this.setState({
            cardtypelist: res.data.data
          })
        }
      })
    }
  }

  //在岗状态处理
  changeStatus = (v) => {
    if (v == 1) {
      this.setState({
        quitDate: null,
        isSetLeavedate: true
      })
    } else {
      this.setState({
        isSetLeavedate: false
      })
    }
  }

  //取消关闭
  closeModal = () => {
    this.props.form.resetFields();
    this.props.closeBasicModal()
  }
  // 表单提交
  handleSubmit = (type) => {
  
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let professional = values['professional'];
        values['professional'] = dataUtil.Arr().toString(professional);
        axios.post("api/sys/user/add", values, true).then(res => {
          this.props.form.resetFields();
          if (type == "new") {
            this.props.handleCancel()
          }
          this.props.addBasicUser(res.data.data)
        })
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
          title={intl.get("wsd.i18n.sys.user.adduser")}
          visible={true}
          onCancel={this.props.handleCancel}
          bodyStyle={{ padding: '5px' }}
          centered={true}
          footer={<div className="modalbtn">
            <SubmitButton key={1} onClick={this.handleSubmit.bind(this, "go")} content="保存并继续" />
            <SubmitButton key={2} onClick={this.handleSubmit.bind(this, "new")} type="primary" content="保存" />
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

                        rules: [{
                          required: true,
                          message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.sys.user1.name'),
                        }],
                      })(
                        <Input maxLength={21}/>,
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label={intl.get('wsd.i18n.sys.user.actuname')} {...formItemLayout}>
                      {getFieldDecorator('userName', {

                        rules: [{
                          required: true,
                          message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.sys.user.actuname'),
                        }],
                      })(
                        <Input maxLength={21}/>,
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <Form.Item
                      label={intl.get('wsd.i18n.sys.user1.userlevel')} {...formItemLayout}>
                      {getFieldDecorator('level', {
                        initialValue: "1",
                        rules: [{
                          required: true,
                          message: intl.get('wsd.i18n.message.select') + intl.get('wsd.i18n.sys.user1.userlevel'),
                        }],
                      })(
                        <Select onDropdownVisibleChange={this.getSecuty} disabled={this.state.userInfo != null ? (this.state.userInfo.isOpen == 1 ? true : false) : false} >
                          {this.state.secutylevellist1 ? this.state.secutylevellist1.map(item => {
                            return <Option value={item.value} key={item.value}>{item.title}</Option>
                          }) : this.state.secutylevellist && this.state.secutylevellist.map(item => {
                            return <Option value={item.value} key={item.value}>{item.title}</Option>
                          })}
                        </Select>
                      )}

                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label={intl.get('wsd.i18n.sys.user1.sex')} {...formItemLayout}>
                      {getFieldDecorator('sex', {
                        initialValue: 1,
                        rules: [],
                      })(
                        <Select>
                          <Option value={1}>{intl.get("wsd.i18n.sys.user.male")}</Option>
                          <Option value={0}>{intl.get("wsd.i18n.sys.user.female")}</Option>
                        </Select>,
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <Form.Item label={intl.get('wsd.i18n.sys.user.staffStatues')}
                      {...formItemLayout}>
                      {getFieldDecorator('staffStatus', {
                        initialValue: 1,
                        rules: [{
                          required: true,
                          message: intl.get('wsd.i18n.message.select') + intl.get('wsd.i18n.sys.user.staffStatues'),
                        }],
                      })(
                        <Select >
                          <Option value={1}>{intl.get("wsd.i18n.sys.user.staffStatues1")}</Option>
                          <Option value={0}>{intl.get("wsd.i18n.sys.user.staffStatues2")}</Option>
                        </Select>,
                      )}

                    </Form.Item>
                  </Col>
                  {/* <Col span={12}>
                    <Form.Item label={intl.get('wsd.i18n.sys.user1.birth')} {...formItemLayout}>
                      {getFieldDecorator('birth', {

                        rules: [],
                      })(
                        <DatePicker placeholder="" style={{ width: '100%' }} />,

                      )}

                    </Form.Item>
                  </Col> */}
                  <Col span={12}>
                    <Form.Item label={intl.get('wsd.i18n.sys.user1.email')} {...formItemLayout}>
                      {getFieldDecorator('email', {

                        rules: [{
                          pattern: /^[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+){0,4}@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+){0,4}$/,
                          message: "邮箱格式不对",
                        }],
                      })(
                        <Input maxLength={85}/>,
                      )}
                    </Form.Item>
                  </Col>
                </Row>

                {/* <Row>
                  <Col span={12}>
                    <Form.Item
                      label={intl.get('wsd.i18n.sys.user1.cardType')} {...formItemLayout}>
                      {getFieldDecorator('cardType', {

                        rules: [],
                      })(
                        <Select onDropdownVisibleChange={this.getcardtype}>
                          {this.state.cardtypelist && this.state.cardtypelist.map(item => {
                            return <Option value={item.value} key={item.value}>{item.title}</Option>
                          })}
                        </Select>
                      )}

                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label={intl.get('wsd.i18n.sys.user1.cardNum')} {...formItemLayout}>
                      {getFieldDecorator('cardNum', {

                        rules: [],
                      })(
                        <Input />,
                      )}

                    </Form.Item>
                  </Col>
                </Row> */}

                {/* <Row>
                  <Col span={12}>
                    <Form.Item
                      label={intl.get('wsd.i18n.sys.user1.entryDate')} {...formItemLayout}>
                      {getFieldDecorator('entryDate', {

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
                        initialValue: this.state.quitDate,
                        rules: [],
                      })(
                        <DatePicker placeholder=""
                                    style={{ width: '100%' }}
                                    disabled={this.state.isSetLeavedate} />,
                      )}

                    </Form.Item>
                  </Col>
                </Row> */}

                <Row>
                  <Col span={12}>
                    <Form.Item label="职务" {...formItemLayout}>
                      {getFieldDecorator('position', {
                        initialValue: '',
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
                        initialValue: [],
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
                    <Form.Item label={intl.get('wsd.i18n.doc.projectdoc.commandorg')}
                      {...formItemLayout}>
                      {getFieldDecorator('orgId', {
                        // initialValue: this.state.info.org ? this.state.info.org.id : null,
                        rules: [{required:true,
                          message: intl.get('wsd.i18n.message.select') + intl.get('wsd.i18n.doc.projectdoc.commandorg'),
                        }],
                      })(
                        <TreeSelect
                          showSearch
                          style={{ width: "100%" }}
                          treeData={this.state.orglist}
                          allowClear
                          treeDefaultExpandAll
                          onChange={this.onChange}
                        />

                      )}

                    </Form.Item>
                  </Col>
                  {/* {this.state.userInfo.isOpen == 0 && (


                    <Col span={12}>
                      <Form.Item
                        label={intl.get('wsd.i18n.sys.user1.actuname')} {...formItemLayout}>
                        {getFieldDecorator('roles', {

                          rules: [{
                            required: true,
                            message: intl.get('wsd.i18n.message.select') + intl.get('wsd.i18n.sys.user1.actuname'),
                          }],
                        })(
                          <Select mode="multiple" onDropdownVisibleChange={this.getRole}>
                            {this.state.rolelist && this.state.rolelist.map(item => {
                              return <Option value={item.id} key={id}>{item.roleName}</Option>
                            })}
                          </Select>,
                        )}
                      </Form.Item>
                    </Col>

                  )} */}
                   <Col span={12}>
                      <Form.Item
                        label={intl.get('wsd.i18n.sys.user.secrect')} {...formItemLayout}>
                        {getFieldDecorator('password', {

                          rules: [{
                            required: true,
                            message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.sys.user.secrect'),
                          }],
                        })(
                          <Input maxLength={85}/>,
                        )}
                      </Form.Item>
                    </Col>
                </Row>
{/*  */}


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
