import React, { Component } from 'react';
import style from './style.less';
import { Form, Row, Col, Input, Button, Icon, Select, DatePicker, Modal, Checkbox } from 'antd';
import axios from '../../../../api/axios';
import { i18nAdd, i18nInfo} from '../../../../api/api';
import moment from 'moment';
import { connect } from 'react-redux'


const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;

class I18nModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initDone: false,
      menuId: null,
      info: {},
      code: '',
    };
  }

  componentDidMount() {
      if (this.props.data) {
        this.setState({
          menuId: this.props.data.id,
          code: this.props.parentData.shortCode,

        });
      }
      if(this.props.modalType=="modify"){
        axios.get(i18nInfo(this.props))
      }
  }



  handleSubmit = (val, e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
          let data = {
            menuId: this.state.menuId,
            code: values.code,
            shortCode : values.shortCode,
            i18nRelationForms : [
              {i18nCode: "zh_CN",
               i18nValue: values.zh_CN},
              {i18nCode: "en_US",
                i18nValue: values.en_US},
            ]
          }
          axios.post(i18nAdd, data, true).then(res => {
            this.props.addData(res.data.data)
            if (val == 'save') {
              this.props.handleCancel()
            } else if (val == 'goOn') {
              this.props.form.resetFields();
            }
          })
      }
    });
  };

  handleCancel = (e) => {

    this.props.handleCancel();
  };

  codeChange = (e) => {
    this.setState({
      code: `${this.props.parentData.shortCode}_${e.target.value}`
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
              <Button key={3} onClick={this.handleSubmit.bind(this, 'goOn')}>{intl.get('wsd.global.btn.saveandcontinue')}</Button>
              <Button key={2} onClick={this.handleSubmit.bind(this, 'save')} type="primary">{intl.get('wsd.global.btn.preservation')}</Button>
            </div>}
          >
            <Form onSubmit={this.handleSubmit}>
              <div className={style.content}>
                <Row type="flex">
                  <Col span={12}>
                    <Form.Item label={intl.get('wsd.i18n.sys.menu.menucode')} {...formItemLayout}>
                      {getFieldDecorator('code', {
                        initialValue: this.state.code,
                        rules: [],
                      })(
                        <Input disabled />,
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label={intl.get('wsd.i18n.sys.menu.shortcode')} {...formItemLayout}>
                      {getFieldDecorator('shortCode', {
                        initialValue: this.state.info.shortCode,
                        rules: [{
                          required: true,
                          message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.sys.menu.shortcode')
                        },{
                          pattern:/^[^\u4e00-\u9fa5]{0,}$/,
                          message: "不包含中文",
                        }],
                      })(
                        <Input onChange={this.codeChange} maxLength={33}/>,
                      )}
                    </Form.Item>
                  </Col>
                </Row>

                <Row>
                  <Col span={12}>
                    <Form.Item label={'中文'} {...formItemLayout}>
                      {getFieldDecorator('zh_CN', {
                        initialValue: this.state.info.zh_CN,
                        rules: [{
                          required: true,
                          message: intl.get('wsd.i18n.message.enter') + '中文'
                        },
                        {
                          pattern:/^[\u4e00-\u9fa5]+$/,
                          message: "只包含中文",
                        }],
                      })(
                        <Input maxLength={33}/>,
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label={'英文'} {...formItemLayout}>
                      {getFieldDecorator('en_US', {
                        initialValue: this.state.info.en_US,
                        rules: [{
                          required: true,
                          message: intl.get('wsd.i18n.message.enter') + '英文'
                        },
                        {
                          pattern:/^[a-zA-Z]+$/,
                          message: "只包含英文",
                        }],
                      })(
                        <Input maxLength={33}/>,
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

const I18nModals = Form.create()(I18nModal);
export default connect(state => ({
  currentLocale: state.localeProviderData,
}))(I18nModals);
