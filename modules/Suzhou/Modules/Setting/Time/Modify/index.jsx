import React, { Component } from 'react';
import {
  Modal,
  Form,
  Row,
  Col,
  Input,
  Button,
  Icon,
  Select,
  DatePicker,
  Slider,
  InputNumber,
  message,
  Checkbox,
  TreeSelect,
} from 'antd';
import style from './style.less';
import intl from 'react-intl-universal';
import { connect } from 'react-redux';
import { curdCurrentData } from '@/store/curdData/action';
import axios from '@/api/axios';
import { menuAdd, getBaseSelectTree, getsectionId } from '@/api/suzhou-api';
const { TextArea } = Input;
const Option = Select.Option;
const TreeNode = TreeSelect.TreeNode;
//菜单管理-新增菜单模块
export class PlanDefineAdd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalInfo: {
        title: '修改',
      },
      initDone: false,
      info: {},
    };
  }
  componentDidMount() {
    this.props.record ? this.setState({ info: this.props.record }) : null;
  }
  //新增提交
  handleSubmit = (val, e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.update(values, 'goOn');
      }
    });
  };
  onChange = (value, lbale, extra) => {
  };
  render() {
    const { optionCompany } = this.state;
    const { intl } = this.props.currentLocale;
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
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
      <div>
        <Modal
          className={style.main}
          width="850px"
          afterClose={this.props.form.resetFields}
          mask={false}
          maskClosable={false}
          footer={
            <div className="modalbtn">
              {/* 保存并继续 */}
              <Button key={1} onClick={this.handleSubmit.bind(this, 'goOn')}>
                {intl.get('wsd.global.btn.saveandcontinue')}
              </Button>
              {/* 保存 */}
              <Button key={2} onClick={this.handleSubmit.bind(this, 'save')} type="primary">
                {intl.get('wsd.global.btn.preservation')}
              </Button>
            </div>
          }
          centered={true}
          title={this.state.modalInfo.title}
          visible={this.props.Modify}
          onCancel={this.props.handleCancel}
        >
          <Form onSubmit={this.handleSubmit} className={style.mainScorll}>
            <div className={style.content}>
              <Row type="flex">
                <Col span={12}>
                  <Form.Item label={'任务名称'} {...formItemLayout}>
                    {getFieldDecorator('jobName', {
                      initialValue: this.state.info.jobName,
                      rules: [
                        {
                          required: true,
                          message: '请输入任务名称',
                        },
                      ],
                    })(<Input disabled />)}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={'任务分组'} {...formItemLayout}>
                    {getFieldDecorator('jobGroup', {
                      initialValue: this.state.info.jobGroup,
                      rules: [
                        {
                          required: true,
                          message: '请输入任务分组',
                        },
                      ],
                    })(<Input disabled />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Form.Item label={'任务描述'} {...formItemLayout}>
                    {getFieldDecorator('description', {
                      initialValue: this.state.info.description,
                      rules: [{ message: '请输入任务描述' }],
                    })(<Input />)}
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item label={'执行类'} {...formItemLayout}>
                    {getFieldDecorator('beanClass', {
                      initialValue: this.state.info.beanClass,
                      rules: [
                        {
                          required: true,
                          message: '请输入执行类',
                        },
                      ],
                    })(<Input disabled />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Form.Item label={'cron表达式'} {...formItemLayout}>
                    {getFieldDecorator('cronExpression', {
                      initialValue: this.state.info.cronExpression,
                      rules: [
                        {
                          required: true,
                          message: '请输入cron表达式',
                        },
                      ],
                    })(<Input />)}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={'初始参数'} {...formItemLayout}>
                    {getFieldDecorator('arguments', {
                      initialValue: this.state.info.arguments,
                      rules: [
                        {
                          message: '请输入初始参数',
                        },
                      ],
                    })(<Input disabled />)}
                  </Form.Item>
                </Col>
              </Row>
            </div>
          </Form>
        </Modal>
      </div>
    );
  }
}

const PlanDefineAdds = Form.create()(PlanDefineAdd);
export default connect(state => ({
  currentLocale: state.localeProviderData,
}))(PlanDefineAdds);
