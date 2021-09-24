import React, { Component } from 'react'
import style from './style.less'
import { Form, Row, Col, Input, Button, Icon, Select, Switch, Modal, message } from 'antd';
import { connect } from 'react-redux';

import axios from '../../../../../api/axios';
import { ruleAdd } from "../../../../../api/api"



const FormItem = Form.Item;
const { TextArea } = Input;
const Option = Select.Option
class AddRule extends Component {

    constructor(props) {
        super(props)
        this.state = {
            initDone: false,
            info: {

            }
        }
    }

    componentDidMount() {

    }



    handleSubmit = (e) => {
        e.preventDefault();

        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {

                let data = {
                    ...values,
                    defaultFlag: values.defaultFlag ? 1 : 0,
                    modified: values.modified ? 1 : 0,
                    ruleBoId: this.props.ruleBoId
                }
                axios.post(ruleAdd, data, true)
                    .then(res => {
                        //通知表格新增
                        this.props.form.resetFields();
                        this.props.AddRule(res.data.data)
                        this.props.handleCancel()
                    })
            }
        });
    }
    handleSubmit1 = (e) => {
        e.preventDefault();

        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {

                let data = {
                    ...values,
                    defaultFlag: values.defaultFlag ? 1 : 0,
                    modified: values.modified ? 1 : 0,
                    ruleBoId: this.props.ruleBoId
                }
                axios.post(ruleAdd, data, true)
                    .then(res => {
                        //通知表格新增
                        this.props.AddRule(res.data.data)
                        this.props.form.resetFields();
                    })
            }
        });
    }
    render() {
        // const { inputType,indefaultFlag } =this.props
        const { intl } = this.props.currentLocale
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
                {/* <h2>{intl.get('wbs.add.name')}</h2>*/}
                <Modal
                    className={style.formMain}
                    width="450px"
                    mask={false}
                    maskClosable={false}
                    centered={true}
                    title={intl.get("wsd.i18n.base.coderulde.addRule")}
                    visible={true} onCancel={this.props.handleCancel}
                    footer={
                        <div className='modalbtn'>
                            <Button key="submit1" onClick={this.handleSubmit1}>{intl.get("wsd.global.btn.saveandcontinue")}</Button>
                            <Button key="submit2" type="primary" onClick={this.handleSubmit}>{intl.get("wsd.global.btn.preservation")}</Button>
                        </div>
                    }>
                    <Form onSubmit={this.handleSubmit}>
                        <div className={style.content}>
                            <Row  >
                                <Col span={24}>
                                    <Form.Item
                                        label={intl.get("wsd.i18n.base.planTemAddWBS.name")} {...formItemLayout}>
                                        {getFieldDecorator('ruleName', {
                                            initialValue: intl.get("wsd.i18n.base.coderulde.default"),
                                            rules: [{
                                                required: true,
                                                message:
                                                    intl.get('wsd.i18n.message.enter') +
                                                    intl.get('wsd.i18n.base.planTemAddWBS.name'),
                                            }],
                                        })(
                                            <Input maxLength={21}/>
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Form.Item
                                        label={intl.get("wsd.i18n.base.coderulde.default")} {...formItemLayout}>
                                        {getFieldDecorator('defaultFlag', {
                                            valuePropName: 'checked',
                                            initialValue: true,
                                            rules: [],
                                        })(
                                            <Switch checkedChildren={intl.get("wsd.i18n.base.coderulde.open")} unCheckedChildren={intl.get("wsd.i18n.base.coderulde.close")} />
                                        )}
                                    </Form.Item>
                                </Col>

                                <Col span={24}>
                                    <Form.Item
                                        label={intl.get("wsd.i18n.base.coderulde.modified")} {...formItemLayout}>
                                        {getFieldDecorator('modified', {
                                            valuePropName: 'checked',
                                            initialValue: true,
                                            rules: [],
                                        })(
                                            <Switch checkedChildren={intl.get("wsd.i18n.base.coderulde.open")} unCheckedChildren={intl.get("wsd.i18n.base.coderulde.close")} />
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
const AddRules = Form.create()(AddRule);
export default connect(state => ({ currentLocale: state.localeProviderData }))(AddRules);
