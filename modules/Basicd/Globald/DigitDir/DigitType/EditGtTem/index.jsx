import React, {Component} from 'react'
import style from './style.less'
import {Form, Row, Col, Input, Button, Icon} from 'antd';
import intl from 'react-intl-universal'
import moment from 'moment'
const FormItem = Form.Item;
const locales = {
    "en-US": require('../../../../../../api/language/en-US.json'),
    "zh-CN": require('../../../../../../api/language/zh-CN.json')
}
class EditGtTable extends Component {
    constructor(props) {
        super(props)
        this.state = {
            initDone: false,
            visible:false,
            info: {
                gbCode:1,
                gbName:1,
                remark:1,
            }
        }
    }

    componentDidMount() {
        this.loadLocales();
        this.setState({
                          width: this.props.width
                      })
    }

    loadLocales() {
        intl.init({
                      currentLocale: 'zh-CN',
                      locales,
                  })
          .then(() => {
              // After loading CLDR locale data, start to render
              this.setState({initDone: true});
          });
    }

    /*handleSubmit = (e) => {
        e.preventDefault();
        alert(1)
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
            }
        });
    }*/

    render() {
        const {
          getFieldDecorator, getFieldsError, getFieldError, isFieldTouched,
          } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 8},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 16},
            },
        };
        return (
          <div className={style.main}>
              <Form onSubmit={this.handleSubmit}>
                  <div className={style.content}>
                      <Row  type="flex">
                          <Col span={11}>
                              <Form.Item label={intl.get('wsd.i18n.base.gbtype.gbcode')} {...formItemLayout}>
                                  {getFieldDecorator('gbCode', {
                                      initialValue: this.state.info.gbCode,
                                      rules: [{
                                          required: true,
                                          message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.base.gbtype.gbcode'),
                                      }],
                                  })(
                                    <Input/>
                                  )}
                              </Form.Item>
                          </Col>
                          <Col span={11}>
                              <Form.Item label={intl.get('wsd.i18n.base.gbtype.gbname')} {...formItemLayout}>
                                  {getFieldDecorator('gbName', {
                                      initialValue: this.state.info.gbName,
                                      rules: [{
                                          required: true,
                                          message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.base.gbtype.gbname'),
                                      }],
                                  })(
                                    <Input/>
                                  )}
                              </Form.Item>
                          </Col>
                      </Row>

                  </div>

              </Form>
          </div>
        )
    }
}
const EditGtTables = Form.create()(EditGtTable);
export default EditGtTables


