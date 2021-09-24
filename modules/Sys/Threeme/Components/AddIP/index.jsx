import React, { Component } from 'react'
import { Modal, Input, Form, Row, Col, Select, Button, Checkbox } from "antd"
import style from './style.less'
import axios from "../../../../../api/axios"
import { tmmAdd } from "../../../../../api/api"
import { connect } from 'react-redux'
import SubmitButton from "../../../../../components/public/TopTags/SubmitButton"
const Option = Select.Option
const { TextArea } = Input;


class AddIp extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }
    componentDidMount() {

    }

    handleSubmit = (type) => {
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {

                
                axios.post(tmmAdd, values, true,null,true).then(res => {
                    this.props.form.resetFields();
                    if (type == "new") {
                        this.props.handleCancel();
                    }

                    //通知表单更新
                    this.props.AddIp(res.data.data)
                })
            }
        });
    }

    render() {
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
        }
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
            <div className={style.main}>
                <Modal
                    mask={false}
                    maskClosable={false}
                    title={intl.get("wsd.i18n.sys.three.addIprule")}
                    visible={this.props.visible}

                    onCancel={this.props.handleCancel}
                    width="800px"
                    footer={
                        <div className="modalbtn">
                            <SubmitButton key={3} onClick={this.handleSubmit.bind(this, "go")} content={intl.get("wsd.global.btn.saveandcontinue")} />
                            <SubmitButton key={2} onClick={this.handleSubmit.bind(this, "new")} type="primary" content={intl.get("wsd.global.btn.preservation")} />
                        </div>
                    }
                >
                    <div >
                        <Form className={style.addip}
                            onSubmit={this.handleSubmit}>
                            <Row >
                                <Col span={11}>
                                    <Form.Item
                                        label={intl.get("wsd.i18n.sys.three.startIP")}
                                        {...formItemLayout}
                                    >
                                        {getFieldDecorator('startIP', {
                                            rules: [{
                                                required: true,
                                                message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.sys.three.startIP'),
                                            }, {
                                                pattern: /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,
                                                message: "IP格式不对",
                                            }],
                                        })(
                                            <Input maxLength={20} />
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col span={11} >
                                    <Form.Item
                                        label={intl.get("wsd.i18n.sys.three.endIP")}
                                        {...formItemLayout}
                                    >
                                        {getFieldDecorator('endIP', {
                                            rules: [{
                                                required: true,
                                                message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.sys.three.endIP'),
                                            }, {
                                                pattern: /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,
                                                message: "IP格式不对",
                                            }],
                                        })(
                                            <Input maxLength={20} />
                                        )}
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row >
                                <Col span={11} >
                                    <Form.Item
                                        label={intl.get("wsd.i18n.sys.three.rule")}
                                        {...formItemLayout}
                                    >
                                        {getFieldDecorator('accessRule', {
                                            rules: [{
                                                required: true,
                                                message: intl.get('wsd.i18n.message.select') + intl.get('wsd.i18n.sys.three.rule'),
                                            }],
                                        })(
                                            <Select
                                            >
                                                <Option value="0">{intl.get("wsd.i18n.sys.three.rule1")}</Option>
                                                <Option value="1">{intl.get("wsd.i18n.sys.three.rule2")}</Option>
                                            </Select>
                                        )}

                                    </Form.Item>
                                </Col>
                                <Col span={11} >
                                    <Form.Item
                                        label="是否生效"
                                        {...formItemLayout}
                                    >
                                        {getFieldDecorator('isEffect', {
                                            rules: [],
                                        })(
                                            <Select >
                                                <Option value={0}>否</Option>
                                                <Option value={1}>是</Option>
                                            </Select>
                                        )}

                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row >
                                <Col span={22}>
                                    <Form.Item
                                        label={intl.get("wsd.i18n.sys.ipt.remark")}
                                        {...formItemLayout1}
                                    >     {getFieldDecorator('remark', {
                                        rules: [],
                                    })(
                                        <TextArea maxLength={66} />
                                    )}

                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                    </div>
                </Modal>
            </div>
        )
    }
}
const AddIps = Form.create()(AddIp);
/* *********** connect链接state及方法 end ************* */
const mapStateToProps = state => {
    return {
        currentLocale: state.localeProviderData,
    }
};


export default connect(mapStateToProps, null)(AddIps);