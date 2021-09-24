import React, { Component } from 'react'
import style from './style.less'
import { Form, Row, Col, Input, Button, Icon, Select, DatePicker, Modal, message, Switch } from 'antd';
import intl from 'react-intl-universal'
import { connect } from 'react-redux'
import axios from '../../../../../api/axios'
import { calendarAdd } from '../../../../../api/api'


const locales = {
    "en-US": require('../../../../../api/language/en-US.json'),
    "zh-CN": require('../../../../../api/language/zh-CN.json')
}
const FormItem = Form.Item;
const { TextArea } = Input;
const Option = Select.Option
class AddCalendar extends Component {
    constructor(props) {
        super(props)
        this.state = {
            initDone: false,
            info: {

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
                this.setState({ initDone: true });
            });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                var data = {
                    calName: values.calName,
                    isDefault: values.isDefault ? 1 : 0
                }
                axios.post(calendarAdd, data, true).then(res => {
                    res.data ? this.props.handleCancel(res.data.data) : null
                })
            }
        });
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
                <Modal
                    className={style.formMain}
                    width="850px"
                    forceRender={true}
                    centered={true}
                    title={intl.get('wsd.i18n.sys.basicd.templated.newcalendar')}
                    visible={this.props.visible} onCancel={this.props.handleCancel}
                    footer={
                        <div className='modalbtn'>
                            <Button key="submit1" onClick={this.props.handleCancel}>取消</Button>
                            <Button key="submit2" type="primary" onClick={this.handleSubmit}>保存</Button>
                        </div>
                    }>
                    <Form onSubmit={this.handleSubmit}>
                        <div className={style.content}>
                            <Row  >
                                <Col span={12}>
                                    <Form.Item
                                        label="日历名称" {...formItemLayout}>
                                        {getFieldDecorator('calName', {

                                            rules: [{
                                                required: true,

                                            }],
                                        })(
                                            <Input />
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label="全局默认" {...formItemLayout}>
                                        {getFieldDecorator('isDefault', {
                                            rules: [{
                                                required: true,
                                            }],
                                        })(
                                            <Switch />
                                        )}
                                    </Form.Item>
                                </Col>
                            </Row>

                        </div>

                    </Form>
                </Modal>
            </div>
        )
    }
}
const AddCalendars = Form.create()(AddCalendar);
export default connect(state => ({
    currentLocale: state.localeProviderData
}))(AddCalendars)
