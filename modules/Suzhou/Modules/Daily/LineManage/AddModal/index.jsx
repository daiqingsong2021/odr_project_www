import React from 'react'
import { Modal, Input, Row, Form, Col, DatePicker, Button, Select } from 'antd'
import moment from 'moment'
import style from './style.less'
import { connect } from 'react-redux'
import { changeLocaleProvider } from '@/store/localeProvider/action'
import * as util from '@/utils/util';
import * as dataUtil from '@/utils/dataUtil';
import { addLineFoundationList, checkLineFoundationIsHave } from '@/modules/Suzhou/api/suzhou-api';
import { getBaseData } from '@/modules/Suzhou/components/Util/util';
import axios from '@/api/axios';
import notificationFun from '@/utils/notificationTip';

const { Item } = Form
const { Option } = Select
class AddModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lineArr: []
    };
  }
  componentDidMount() {
    getBaseData('line').then(data => { this.setState({ lineArr: data }) })
  }
  //校验线路重复
  checkLine = (rule, value, callBack) => {
    axios.get(checkLineFoundationIsHave + `?line=${value}`).then(res => {
      if (res.data.data == '0') {
        callBack('该线路已存在！')
      } else {
        callBack()
      }
    })
  }
  //提交
  handleSubmit = (type, e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (err) {
      } else {
        // const operationTime = moment(values.operationTime).format('YYYY-MM-DD')
        // const saftOperationTime = moment(values.saftOperationTime).format('YYYY-MM-DD')
        const data = [{ ...values }]
        if (type == 'goOn') {
          this.props.form.resetFields()
        } else if (type == 'save') {
          this.props.handleCancel()
        }
        axios.post(addLineFoundationList, data, true).then(() => {
          this.props.success()
        });
      }
    })
  }
  render() {
    const { lineArr } = this.state;
    const { } = this.props
    const { getFieldDecorator } = this.props.form;
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
    return (
      <Modal title="新增线路"
        visible={this.props.modalVisible}
        onOk={this.handleSubmit}
        onCancel={this.props.handleCancel}
        width='500px'
        mask={false}
        maskClosable={false}
        footer={[
          <Button key={1} onClick={this.handleSubmit.bind(this, 'goOn')}>
            保存并继续
            </Button>,
          <Button key={2} onClick={this.handleSubmit.bind(this, 'save')} type="primary">
            保存
            </Button>
        ]}>
        <Form onSubmit={this.handleSubmit}>
          <Row type="flex">
            <Col span={24}>
              <Item label='线路编号' {...formItemLayout}>
                {getFieldDecorator('lineCode', {
                  rules: [
                    {
                      required: true,
                      message: '请输入线路编号',
                    },
                  ],
                })(
                  <Input placeholder="请输入线路编号" />
                )}
              </Item>
            </Col>
            <Col span={24}>
              <Item label='线路名称' {...formItemLayout}>
                {getFieldDecorator('line', {
                  rules: [
                    {
                      required: true,
                      message: '请输入线路名称',
                    },
                    {
                      validator: this.checkLine
                    }
                  ],
                })(<Select showSearch placeholder="请选择" style={{ width: '100%' }}
                  filterOption={(input, option) =>
                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                  {lineArr.map(item => {
                    return <Option key={item.value} value={item.value}>{item.title}</Option>
                  })}
                </Select>)}
              </Item>
            </Col>
            <Col span={24}>
              <Item label='投入运营日期' {...formItemLayout}>
                {getFieldDecorator('operationTime', {
                  rules: [
                    {
                      required: true,
                      message: '请选择日期',
                    },
                  ],
                })(
                  <DatePicker style={{ width: '100%' }} placeholder="请选择日期" />
                )}
              </Item>
            </Col>
            <Col span={24}>
              <Item label='安全运行起始日期' {...formItemLayout}>
                {getFieldDecorator('saftOperationTime', {
                  rules: [
                    {
                      required: true,
                      message: '请选择日期',
                    },
                  ],
                })(
                  <DatePicker style={{ width: '100%' }} placeholder="请选择日期" />
                )}
              </Item>
            </Col>
            <Col span={24}>
              <Item label='运营公司' {...formItemLayout}>
                {getFieldDecorator('company', {
                  rules: [
                    {
                      required: true,
                      message: '请输入运营公司',
                    },
                  ],
                })(
                  <Input placeholder="请输入运营公司" />
                )}
              </Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
}
const AddModals = Form.create()(AddModal);
export default connect(state => ({
  currentLocale: state.localeProviderData
}), {
  changeLocaleProvider
})(AddModals);