import React, { Component } from 'react';
import style from './style.less';
import { Form, Row, Col, Input, Button, Icon, Select, DatePicker, Modal, Checkbox } from 'antd';
import axios from '../../../../api/axios';
import { funcAdd, funcInfo, funcUpdate } from '../../../../api/api';
import moment from 'moment';
import { connect } from 'react-redux'
import SubmitButton from "../../../../components/public/TopTags/SubmitButton"

const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;
//权限配置-新增修改Modal
class PermissionModal extends Component {
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

  reqfun = (v) => {
    axios.get(funcInfo(v)).then(res => {
      this.setState({
        info: res.data.data[0],
        funcCode: res.data.data[0].funcCode
      })
    })
  }

  componentDidMount() {
    if (this.props.addOrModify == 'add') {
      if (this.props.data) {
        this.setState({
          menuId: this.props.data.id,
          funcCode: this.props.parentData.shortCode

        });
      }
    } else if (this.props.addOrModify == 'modify') {
      this.setState({
        funcId: this.props.data.id
      });
      this.reqfun(this.props.data.id);
    }
  }



  handleSubmit = (val, e) => {
    
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (this.props.addOrModify == 'add') {
          let data = {
            menuId: this.state.menuId,
            funcName: values.funcName,
            funcCode: values.funcCode,
            shortCode : values.shortCode,
            del: values.del == true ? 1 : 0
          }
          axios.post(funcAdd, data, true,null,true).then(res => {
            this.props.addData(res.data.data)
            if (val == 'save') {
              this.props.handleCancel()
            } else if (val == 'goOn') {
              this.props.form.resetFields();
            }
          })
        } else if (this.props.addOrModify == 'modify') {
          let data = {
            id: this.state.funcId,
            funcName: values.funcName,
            funcCode: values.funcCode,
            shortCode : values.shortCode,
            del: values.del == true ? 1 : 0
          }
          axios.put(funcUpdate, data, true,null,true).then(res => {
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

  codeChange = (e) => {
    this.setState({
      funcCode: `${this.props.parentData.shortCode}_${e.target.value}`
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
    return (
      <div className={style.main}>
        <div>
          <Modal title={this.props.title} visible={this.props.visible}
            onCancel={this.handleCancel}
            width="800px"
            footer={<div className="modalbtn">
              {this.props.addOrModify == 'add' ? <SubmitButton key={3} onClick={this.handleSubmit.bind(this, 'goOn')} content={intl.get('wsd.global.btn.saveandcontinue')} />
                : <SubmitButton key={1} onClick={this.handleCancel} content={intl.get('wsd.global.btn.cancel')}/>}
              <SubmitButton key={2} onClick={this.handleSubmit.bind(this, 'save')} type="primary" content={intl.get('wsd.global.btn.preservation')}/>
            </div>}
          >
            <Form onSubmit={this.handleSubmit}>
              <div className={style.content}>
                <Row type="flex">
                  <Col span={12}>
                    <Form.Item label={intl.get('wsd.i18n.sys.menu.menuname')} {...formItemLayout}>
                      {getFieldDecorator('funcName', {
                        initialValue: this.state.info.funcName,
                        rules: [{
                          required: true,
                          message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.sys.menu.menuname'),
                        }],
                      })(
                        <Input maxLength={33}/>,
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label={intl.get('wsd.i18n.sys.menu.menucode')} {...formItemLayout}>
                      {getFieldDecorator('funcCode', {
                        initialValue: this.state.funcCode,
                        rules: [],
                      })(
                        <Input disabled />,
                      )}
                    </Form.Item>
                  </Col>
                </Row>

                <Row>
                  <Col span={12}>
                    <Form.Item label={intl.get('wsd.i18n.sys.menu.shortcode')} {...formItemLayout}>
                      {getFieldDecorator('shortCode', {
                        initialValue: this.state.info.shortCode,
                        rules: [{
                          required: true,
                          message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.sys.menu.shortcode')
                        }],
                      })(
                        <Input onChange={this.codeChange} maxLength={20}/>,
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label={intl.get('wsd.i18n.sys.menu.active')} {...formItemLayout}>
                      {getFieldDecorator('del', {
                        valuePropName: 'checked',
                        initialValue: this.state.info.del ? this.state.info.del.id : false
                      })(
                        <Checkbox></Checkbox>,
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

const PermissionModals = Form.create()(PermissionModal);
export default connect(state => ({
  currentLocale: state.localeProviderData,
}))(PermissionModals);
