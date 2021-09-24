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
} from 'antd';
import style from './style.less';;
import { connect } from 'react-redux';
import SubmitButton from "../../../../components/public/TopTags/SubmitButton"
const { TextArea } = Input;
const Option = Select.Option;
//菜单管理-新增菜单模块
export class PlanDefineAdd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalInfo: {
        title: '新增菜单',
      },
      initDone: false,
      optionData: [],
      menuCode: ''
    };
  }

  componentDidMount() {
    if (this.props.record) {
      this.setState({
        menuCode: this.props.record.menuCode
      })
    }
    this.selectOption()
  }


  //新增提交
  handleSubmit = (val) => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {

        if (val == 'save') {
          // this.props.handleCancel();
          this.props.submit(values, 'save');
        } else {
          this.props.submit(values, 'goOn');
          this.props.form.resetFields();
          this.setState({
            menuCode: this.props.record.menuCode
          })
        }

      }
    });
  };
  //菜单类型选择控制
  selectOption = () => {
    let { record } = this.props;
    if (record) {
      if (record.menuType.id == 1) {
        let data = [{
          value: 2,
          title: '菜单'
        }]
        this.setState({
          optionData: data
        })
      } else if (record.menuType.id == 2) {
        let data = [
          {
            value: 3,
            title: '页签'
          },
          {
            value: 4,
            title: '页签组'
          },
        ]
        this.setState({
          optionData: data
        })
      } else if (record.menuType.id == 4) {
        let data = [{
          value: 3,
          title: '页签'
        }]
        this.setState({
          optionData: data
        })
      } else if (record.menuType.id == 3) {
        let data = []
        this.setState({
          optionData: data
        })
      }

    } else {
      let data = [{
        value: 1,
        title: '组件'
      }]
      this.setState({
        optionData: data
      })

    };
  }

  codeChange = (e) => {


    if (this.props.record) {
      this.setState({
        menuCode: `${this.props.record.menuCode}-${e.target.value}`
      })
    } else {
      this.setState({
        menuCode: e.target.value
      })
    }
  }

  render() {
    const { intl } = this.props.currentLocale
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

        <Modal className={style.main}
          width="850px"
          afterClose={this.props.form.resetFields}
          mask={false}
          maskClosable={false}
          footer={<div className="modalbtn">
            {/* 保存并继续 */}
            <SubmitButton key={1} onClick={this.handleSubmit.bind(this, 'goOn')} content={intl.get('wsd.global.btn.saveandcontinue')} />
            {/* 保存 */}
            <SubmitButton key={2} onClick={this.handleSubmit.bind(this, 'save')} type="primary" content={intl.get('wsd.global.btn.preservation')} />
          </div>}
          centered={true} title={this.state.modalInfo.title} visible={this.props.modalVisible}
          onCancel={this.props.handleCancel}>
          <Form onSubmit={this.handleSubmit} className={style.mainScorll}>
            <div className={style.content}>
              <Row type="flex">
                <Col span={12}>
                  <Form.Item label={intl.get('wsd.i18n.sys.menu.menuname')} {...formItemLayout}>
                    {getFieldDecorator('menuName', {

                      rules: [{
                        required: true,
                        message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.sys.menu.menuname')
                      }],
                    })(
                      <Input maxLength={33} />,
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={intl.get('wsd.i18n.sys.menu.sortnum')} {...formItemLayout}>
                    {getFieldDecorator('sort', {

                      rules: [{
                        required: true,
                        message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.sys.menu.sortnum')
                      }],
                    })(
                      <InputNumber min={1} max={999999} style={{ width: '100%' }} precision={0} step={0} />,
                    )}
                  </Form.Item>
                </Col>

              </Row>
              <Row>
                <Col span={12}>
                  <Form.Item label={intl.get('wsd.i18n.sys.menu.menucode')} {...formItemLayout}>
                    {getFieldDecorator('menuCode', {
                      initialValue: this.state.menuCode,
                      rules: [],
                    })(
                      <Input disabled />,
                    )}
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item label={intl.get('wsd.i18n.sys.menu.shortcode')} {...formItemLayout}>
                    {getFieldDecorator('shortCode', {

                      rules: [{
                        required: true,
                        message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.sys.menu.shortcode')
                      }, {
                        pattern: /^[^\u4e00-\u9fa5]{0,}$/,
                        message: "不包含中文",
                      }],
                    })(
                      <Input onChange={this.codeChange} maxLength={50} />,
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Form.Item label={intl.get('wsd.i18n.sys.menu.image')} {...formItemLayout}>
                    {getFieldDecorator('image', {

                      rules: [{
                        required: true,
                        message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.sys.menu.image')
                      }],
                    })(
                      <Input maxLength={66} />,
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={intl.get('wsd.i18n.sys.menu.url')} {...formItemLayout}>
                    {getFieldDecorator('url', {

                      rules: [{
                        required: true,
                        message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.sys.menu.url')
                      }],
                    })(
                      <Input maxLength={180} />,
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Form.Item label={intl.get('wsd.i18n.sys.menu.internation')} {...formItemLayout}>
                    {getFieldDecorator('i18n', {

                      rules: [{
                        required: true,
                        message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.sys.menu.internation')
                      }],
                    })(
                      <Input maxLength={33} />,
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={intl.get('wsd.i18n.sys.menu.menutype')} {...formItemLayout}>
                    {getFieldDecorator('menuType', {
                      initialValue: this.state.optionData.length > 0 && this.state.optionData[0].value,
                      rules: [],
                    })(
                      <Select  >
                        {
                          this.state.optionData.length && this.state.optionData.map(item => {
                            return (
                              <Option key={item.value} value={item.value}>{item.title}</Option>
                            )
                          })
                        }
                      </Select>
                    )}
                  </Form.Item>
                </Col>

              </Row>
              <Row>
              {this.props.record && this.props.record.menuType.id == 1 &&
                <Col span={12}>

                  <Form.Item label="组名" {...formItemLayout}>
                    {getFieldDecorator('groupName', {

                      rules: [],
                    })(
                      <Input maxLength={33} />,
                    )}
                  </Form.Item>
                </Col>
              }
              </Row>
              <Row>
                <Col span={24}>
                  <Form.Item label={intl.get('wsd.i18n.sys.menu.desc')} {...formItemLayout1}>
                    {getFieldDecorator('menuDesc', {

                      rules: [],
                    })(
                      <TextArea rows={2} maxLength={66} />,
                    )}
                  </Form.Item>
                </Col>
              </Row>

              <Col span={12}>
                <Form.Item label={intl.get('wsd.i18n.sys.menu.active')} {...formItemLayout}>
                  {getFieldDecorator('active', {
                    valuePropName: 'checked',
                    initialValue: true,

                    rules: [],
                  })(
                    <Checkbox>{intl.get('wsd.i18n.sys.menu.activationdesc')}</Checkbox>,
                  )}
                </Form.Item>
              </Col>
              {this.props.record && this.props.record.menuType.id == 1 &&
                <Col span={12}>
                  <Form.Item label={intl.get('wsd.i18n.sys.menu.ismenu')} {...formItemLayout}>
                    {getFieldDecorator('isMenu', {
                      valuePropName: 'checked',

                      initialValue: this.props.record && this.props.record.menuType.id == 1,
                      rules: [],
                    })(
                      <Checkbox>菜单栏显示</Checkbox>,
                    )}
                  </Form.Item>
                </Col>
              }

              <Col span={12}>
                <Form.Item label={intl.get('wsd.i18n.sys.menu.share')} {...formItemLayout}>
                  {getFieldDecorator('share', {
                    valuePropName: 'checked',

                    rules: [],
                  })(
                    <Checkbox>{intl.get('wsd.i18n.sys.menu.isshare')}</Checkbox>,
                  )}
                </Form.Item>
              </Col>


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
