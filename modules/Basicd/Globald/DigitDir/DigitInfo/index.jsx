import React, { Component } from 'react'
import style from './style.less'
import { Form, Row, Col, Input, Button, Icon, Select, DatePicker, notification } from 'antd';
import intl from 'react-intl-universal'
import moment from 'moment';
import axios from "../../../../../api/axios"
import * as dataUtil from '../../../../../utils/dataUtil'
//api
import { getInfoByBoId, updateDigitDirBo } from '../../../../../api/api'
import LabelFormLayout from "../../../../../components/public/Layout/Labels/Form/LabelFormLayout"
import LabelFormButton from "../../../../../components/public/Layout/Labels/Form/LabelFormButton"
const FormItem = Form.Item;
class DigitInfoForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            initDone: false,
            info: {
                id: 1,
                digitName: 1,
                digitCode: 1,
                boName: 1,
                boCode: 1,
                creator: 'zbj',
                creatTime: 1,
            }
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                let data = {
                    ...this.state.info,
                    ...values,
                    creatTime: dataUtil.Dates().formatTimeString(values.creatTime),
                }
                axios.put(updateDigitDirBo, data).then(res => {
                    this.props.submitData(res.data.data)
                    notification.success(
                        {
                            placement: 'bottomRight',
                            bottom: 50,
                            duration: 2,
                            message: '操作提醒',
                            description: intl.get("wsd.i18n.comcate.profdback.updatesuccessfully")
                        }
                    )
                })
            }
        });
    }
    componentDidMount() {
        this.getdata()
    }
    getdata = () => {
        axios.get(getInfoByBoId(this.props.data.id)).then(res => {
            this.setState({
                info: res.data.data
            })
        })
    }
    render() {
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
            <LabelFormLayout title={this.props.title} >
                <Form onSubmit={this.handleSubmit}>
                    <Row type="flex">
                        <Col span={12}>
                            <Form.Item label={intl.get('wsd.i18n.base.digitdir.digitname')} {...formItemLayout}>
                                {getFieldDecorator('typeName', {
                                    initialValue: this.state.info.typeName,
                                    rules: [{
                                        required: true,
                                        message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.base.digitdir.digitname'),
                                    }],
                                })(
                                    <Input maxLength={66} />
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="字典类型代码" {...formItemLayout}>
                                {getFieldDecorator('typeCode', {
                                    initialValue: this.state.info.typeCode,
                                    rules: [{
                                        required: true,
                                        message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.base.digitdir.digitcode'),
                                    }],
                                })(
                                    <Input maxLength={33} />
                                )}
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row> <Col span={12}>
                        <Form.Item label={intl.get('wsd.i18n.base.digitdir.creator')} {...formItemLayout}>
                            {getFieldDecorator('creator', {
                                initialValue: this.state.info.creator ? this.state.info.creator.name : '',
                                rules: [],
                            })(
                                <Input disabled />
                            )}
                        </Form.Item>
                    </Col>
                        <Col span={12}>
                            <Form.Item label={intl.get('wsd.i18n.base.digitdir.creattime')} {...formItemLayout}>
                                {getFieldDecorator('creatTime', {
                                    initialValue: dataUtil.Dates().formatDateMonent(this.state.info.creatTime),
                                    rules: [],
                                })(
                                    <DatePicker style={{ width: '100%' }} disabled />
                                )}
                            </Form.Item>
                        </Col>
                    </Row>

                </Form>
                <LabelFormButton>
                    <Button onClick={this.props.closeRightBox} style={{ width: "100px", marginRight: "20px" }}>取消</Button>
                    <Button disabled={this.props.editAuth} onClick={this.handleSubmit} style={{ width: "100px" }} type="primary">保存</Button>
                </LabelFormButton>
            </LabelFormLayout>

        )
    }
}
const DigitInfoForms = Form.create()(DigitInfoForm);
export default DigitInfoForms
