import React, { Component } from 'react'
import style from './style.less'
import { Form, Row, Col, Input, Button, Modal } from 'antd';
import intl from 'react-intl-universal'
const FormItem = Form.Item;
import axios from "../../../../../../api/axios"

const locales = {
    "en-US": require('../../../../../../api/language/en-US.json'),
    "zh-CN": require('../../../../../../api/language/zh-CN.json')
}
class Add extends Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            initDone: false,
        }
    }
    handleOk = (e) => {
        this.setState({
            visible: false,
        });
        this.props.handleCancel()
    }
    handleCancel = (e) => {
        this.setState({ visible: false, }, () => { });
        this.props.onCancel();
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
        }).then(() => {
            // After loading CLDR locale data, start to render
            this.setState({ initDone: true });
        });
    }
    handleSubmit = (type, e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            let data = {
                ...values,
                boCode: this.props.boCode ? this.props.boCode : null
            }
            if (!err) {
                this.props.handleClick(values)
                // 清空表单项
                this.props.form.resetFields()
                if (type == 'save') {
                    this.props.onCancel()
                }
            }
        });
    }
    render() {
        const flag = this.props.title;
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
                    title={this.props.title}
                    visible={this.props.visible}
                    onCancel={this.handleCancel}
                    footer={null}
                    width="850px"
                    centered={true}
                    className={style.addFormInfo}
                    footer={
                        <div className='modalbtn'>
                            <Button key="submit2" onClick={this.handleSubmit.bind(this, 'go')}>保存并继续</Button>
                            <Button key="submit3" type="primary" onClick={this.handleSubmit.bind(this, 'save')}>保存</Button>
                        </div>
                    }
                >
                    <Form onSubmit={this.handleSubmit}>
                        <div className={style.content}>
                            <Row type="flex">
                                <Col span={12}>
                                    <Form.Item label={intl.get('wsd.i18n.base.digitdir.digitname')} {...formItemLayout}>
                                        {getFieldDecorator('typeName', {
                                            rules: [{
                                                required: true,
                                                message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.base.digitdir.digitname'),
                                            }],
                                        })(
                                            <Input />
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label={intl.get('wsd.i18n.base.digitdir.digitcode')} {...formItemLayout}>
                                        {getFieldDecorator('typeCode', {
                                            rules: [{
                                                required: true,
                                                message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.base.digitdir.digitcode'),
                                            }],
                                        })(
                                            <Input />
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



const Adds = Form.create()(Add);
export default Adds