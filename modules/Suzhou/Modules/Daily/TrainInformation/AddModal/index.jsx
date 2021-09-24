import React from 'react'
import { Modal, Input, Row, Form, Col, DatePicker, Button, Select } from 'antd'
import moment from 'moment'
import style from './style.less'
import { connect } from 'react-redux'
import { changeLocaleProvider } from '@/store/localeProvider/action'
import * as util from '@/utils/util';
import * as dataUtil from '@/utils/dataUtil';
import { addTrainFoundation, checkTrainFoundationIsHave } from '@/modules/Suzhou/api/suzhou-api';
import { getBaseData } from '@/modules/Suzhou/components/Util/util';
import axios from '@/api/axios';
import notificationFun from '@/utils/notificationTip';

const { Item } = Form
const { Option } = Select
class AddModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lineArr: [],
      trainCode:'',
    };
  }
  componentDidMount() {
    getBaseData('line').then(data => { this.setState({ lineArr: data }) })
  }
  //提交
  handleSubmit = (type, e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (err) {
      } else {
        if (type == 'goOn') {
          this.props.form.resetFields()
        } else if (type == 'save') {
          this.props.handleCancel()
        }
        const data = {...values}
        //校验列车编号重复
        axios.get(checkTrainFoundationIsHave + `?trainCode=${data.trainCode}&line=${data.line}`).then(res => {
              if (res.data.data == '0') {
                notificationFun('警告','该线路中列车编号已存在');
              } else {
                const trainFoundationAddForm = data
                axios.post(addTrainFoundation, trainFoundationAddForm, true).then(() => {
                  this.props.success()
                });
              }
            })
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
              <Item label='列车编号' {...formItemLayout}>
                {getFieldDecorator('trainCode', {
                  rules: [
                    {
                      required: true,
                      message: '请输入列车编号',
                    },
                  ],
                })(
                  <Input placeholder="请输入列车编号" />
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