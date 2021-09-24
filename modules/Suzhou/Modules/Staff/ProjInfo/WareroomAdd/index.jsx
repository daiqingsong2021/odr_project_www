import React, { Component } from 'react';
import style from './style.less';
import { Form, Row, Col, Input, Button, Icon, Select, DatePicker, Modal, Checkbox,InputNumber } from 'antd';
import axios from '../../../../../../api/axios';
import { addWarnHouse,updateWarnHouse,getPeopleList } from '../../../../api/suzhou-api';
import moment from 'moment';
import { connect } from 'react-redux'


const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;
//人员-新增修改Modal
class WareroomAdd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initDone: false,
      menuId: null,
      funcId: null,
      info: {},
      funcCode: ''
    };
  }
  componentDidMount() {
    if (this.props.addOrModify == 'add') {
      if (this.props.data) {
        
      }
    } else if (this.props.addOrModify == 'modify') {
      this.setState({
        info: this.props.data
      });
      // this.reqfun(this.props.data.id);
    }
  }
  handleSubmit = (val, e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (this.props.addOrModify == 'add') {
          let data = {
            ...values,
            projInfoId:this.props.rightData.id,
            sectionId:this.props.rightData.sectionId,
            projectId:this.props.rightData.projectId
          }
          axios.post(addWarnHouse, data, true).then(res => {
            this.props.addData(res.data.data)
            if (val == 'save') {
              this.props.handleCancel()
            } else if (val == 'goOn') {
              this.props.form.resetFields();
            }
          })
        } else if (this.props.addOrModify == 'modify') {
          let data = {
            ...values,
            id:this.props.data.id
          }
          axios.put(updateWarnHouse, data, true).then(res => {
            this.props.updateSuccess(res.data.data)
            this.props.handleCancel()
          })
        }

      }
    });
  };

  handleCancel = (e) => {
    this.props.handleCancel();
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
    return (
      <div className={style.main}>
        <div>
          <Modal title={this.props.title} visible={this.props.visible}
            onCancel={this.handleCancel}
            width="800px"
            footer={<div className="modalbtn">
              {this.props.addOrModify == 'add' ? <Button key={3} onClick={this.handleSubmit.bind(this, 'goOn')}>{intl.get('wsd.global.btn.saveandcontinue')}</Button>
                : <Button key={1} onClick={this.handleCancel}>{intl.get('wsd.global.btn.cancel')}</Button>}
              <Button key={2} onClick={this.handleSubmit.bind(this, 'save')} type="primary">{intl.get('wsd.global.btn.preservation')}</Button>
            </div>}
          >
            <Form onSubmit={this.handleSubmit}>
              <div className={style.content}>
                <Row type="flex">
                  <Col span={12}>
                    <Form.Item label={'仓库名称'} {...formItemLayout}>
                      {getFieldDecorator('name', {
                        initialValue: this.state.info.name,
                        rules: [{
                          required: true,
                          message:'请输入仓库名称',
                        }],
                      })(
                        <Input />,
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label={'仓库地址'} {...formItemLayout}>
                      {getFieldDecorator('address', {
                        initialValue: this.state.info.address,
                        rules: [{
                          message:'请输入仓库地址'
                        }],
                      })(
                        <Input />,
                      )}
                    </Form.Item>
                  </Col>
                </Row>
              </div>
            </Form>
          </Modal>
        </div>
      </div>
    );
  }
}

const WareroomAdds = Form.create()(WareroomAdd);
export default connect(state => ({
  currentLocale: state.localeProviderData,
}))(WareroomAdds);
