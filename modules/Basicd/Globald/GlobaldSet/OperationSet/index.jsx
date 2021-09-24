import React, { Component } from 'react'
import style from './style.less'
import { Form, Row, Col, Button, InputNumber } from 'antd';
import intl from 'react-intl-universal'
import moment from 'moment';
const FormItem = Form.Item;
import axios from "../../../../../api/axios"
class BasicdOperationSetInfo extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }
    componentDidMount() {
        this.props.getTrainTime()
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                const data = { ...values }
                this.props.updateSetTrainTime(data)
            }
        });
    }

    render() {
        const {
            getFieldDecorator, getFieldsError, getFieldError, isFieldTouched,
        } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 4 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 20 },
            },
        };
        const { data } = this.props
        return (
            <div className={style.main}>
                <div className={style.mainScorll}>
                    <Form onSubmit={this.handleSubmit}>
                        <div className={style.content}>
                            <Row >
                                <Col span={15}>
                                    <Form.Item label='1号线运营时间(天)' {...formItemLayout}>
                                        {getFieldDecorator('line1', {
                                            initialValue: data.line1,
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '不能为空！'
                                                },
                                                {
                                                    pattern: /^([1-9]\d*|0)\d*$/,
                                                    message: '请输入非负整数！'
                                                }
                                            ],
                                        })(
                                            <InputNumber min={0} style={{ width: 'calc(100% - 81px)' }} />
                                        )}
                                    </Form.Item>
                                </Col>
                            </Row>
                            {/* <Row >
                                <Col span={15}>
                                    <Form.Item label='2号线运营时间(天)' {...formItemLayout}>
                                        {getFieldDecorator('line2', {
                                            initialValue: data.line2,
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '不能为空！'
                                                },
                                                {
                                                    pattern: /^([1-9]\d*|0)\d*$/,
                                                    message: '请输入非负整数！'
                                                }
                                            ],
                                        })(
                                            <InputNumber min={0} style={{ width: 'calc(100% - 81px)' }} />
                                        )}
                                    </Form.Item>
                                </Col>
                            </Row> */}
                            <Row >
                                <Col span={15}>
                                    <Form.Item label='3号线运营时间(天)' {...formItemLayout}>
                                        {getFieldDecorator('line3', {
                                            initialValue: data.line3,
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '不能为空！'
                                                },
                                                {
                                                    pattern: /^([1-9]\d*|0)\d*$/,
                                                    message: '请输入非负整数！'
                                                }
                                            ],
                                        })(
                                            <InputNumber min={0} style={{ width: 'calc(100% - 81px)' }} />
                                        )}
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={15}>
                                    <Col span={8} offset={4}>
                                        <Button onClick={this.handleSubmit} type="primary" style={{ width: 100, textAlign: 'center' }}>更新设置</Button>
                                    </Col>
                                </Col>
                            </Row>
                        </div>
                    </Form>
                </div>
            </div>
        )
    }
}

const BasicdOperationSetInfos = Form.create()(BasicdOperationSetInfo);
export default BasicdOperationSetInfos
