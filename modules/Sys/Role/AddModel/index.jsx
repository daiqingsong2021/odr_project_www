import React, { Component } from 'react'
import style from './style.less'
import RoleInfo from './../RoleInfo'
import axios from '../../../../api/axios';
import { roleInfo, roleUpdate, addRole, roleLevel } from '../../../../api/api';
import { connect } from 'react-redux';
import {
  Form, Input, Select, Row, Col, Button, DatePicker, TreeSelect, Modal,
} from 'antd';
import SubmitButton from "../../../../components/public/TopTags/SubmitButton"
const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;
export class RoleAddModel extends Component {
  constructor(props) {
    super(props)
    this.state = {
      title: '新增顶级机构',
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
    }
  }
  
  componentDidMount() {

    const data = this.state.info;

    data.parentOrg = {
      id: this.props.rightData ? this.props.rightData.id : 0,
      name: this.props.rightData ? this.props.rightData.orgName : '组织树',
    };
    this.setState({
      info: data,
    });

    this.getRoleLevel();
  }

  getRoleLevel = () => {
    axios.get(roleLevel).then(res => {
      if(res.data.data){
        this.setState({
          treeLevel: res.data.data,
        });
      }
     
    });

  };
  handleSubmit = (val) => {
 
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        
          values['parentId'] = this.props.rightData ? this.props.rightData.id : 0;
          axios.post(addRole, values, true,"新增成功",true).then(res => {
            this.props.addSuccess(res.data.data);
            if (val === 'save') {
              this.props.unShow();
            } else {
              this.props.form.resetFields();
            }

          });
        

      }
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
        <Modal
          title={this.props.modelTitle}
          visible={this.props.roleVisible}
          onCancel={this.props.handleCancel}
          footer={<div className="modalbtn">
            <SubmitButton key={1} onClick={this.handleSubmit.bind(this, "goOn")} content="保存并继续" />
            <SubmitButton key={2} onClick={this.handleSubmit.bind(this, "save")} type="primary" content="保存" />
          </div>}
          maskClosable={false}
          mask={false}
          width="850px"
          centered={true}
          className={style.addFormInfo}
        >
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
                      <Input maxLength={33}/>,
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
                      <Input maxLength={33}/>,
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
                      <TextArea rows={4} maxLength={66}/>,
                    )}
                  </Form.Item>
                </Col>
              </Row>

            
            </div>
          </Form>
          {/* <RoleInfo addSuccess={this.addSuccess} parentData={this.props.rightData} api={'add'} unShow={this.props.unShow} /> */}
        </Modal>
      </div>
    )
  }
}



const RoleAddModels = Form.create()(RoleAddModel);
export default connect(state => ({
  currentLocale: state.localeProviderData,
}))(RoleAddModels);
