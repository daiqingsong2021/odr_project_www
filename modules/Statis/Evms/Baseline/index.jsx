import React, { Component } from 'react'
import style from './style.less'
import { Form, Row, Col, Input, Button, Icon, Select, DatePicker } from 'antd';
import intl from 'react-intl-universal'

import axios from "../../../../api/axios"
import {
    getPlanEvmsBaselineInfo
} from "../../../../api/api"
import * as util from '../../../../utils/util';

const FormItem = Form.Item;
class PlanPreparedBaseline extends Component {
    constructor(props) {
        super(props)
        this.state = {
            initDone: false,
            info: {}
        }
    }

    componentDidMount() {
        this.getPlanEvmsBaselineInfo()
    }

    // 获取Task基线计划
    getPlanEvmsBaselineInfo = () => {
        const { rightData } = this.props
        if (rightData[0]['nodeType'] == 'task' || rightData[0]['nodeType'] == 'wbs') {
            axios.get(getPlanEvmsBaselineInfo(rightData[0]['id'], rightData[0]['defineId'])).then(res => {
                const { data } = res.data
                if(data){
                    this.setState({
                        info: data
                    })
                }
               
            })
        }
    }

    render() {
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
        return (
            <div className={style.main}>
                <h3 className={style.listTitle}>进度基线</h3>
                <Form>
                    <div className={style.content}>
                        <Row gutter={24} type="flex">
                            <Col span={12}>
                                <Form.Item label="计划开始" {...formItemLayout}>
                                    {getFieldDecorator('planStartTime', {
                                        initialValue:  this.state.info.planStartTime ,
                                        rules: [],
                                    })(
                                        <Input disabled />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label="计划完成" {...formItemLayout}>
                                    {getFieldDecorator('planEndTime', {
                                        initialValue: this.state.info.planEndTime,
                                        rules: [],
                                    })(
                                        <Input disabled />
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24} type="flex">
                            <Col span={12}>
                                <Form.Item label="计划工期" {...formItemLayout}>
                                    {getFieldDecorator('planDrtn', {
                                        initialValue: this.state.info.planDrtn ,
                                        rules: [],
                                    })(
                                        <Input disabled />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="实际工期" {...formItemLayout}>
                                    {getFieldDecorator('actDrtn', {
                                        initialValue: this.state.info.actDrtn ,
                                        rules: [],
                                    })(
                                        <Input disabled />
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24} type="flex">
                            <Col span={12}>
                                <Form.Item label="实际开始" {...formItemLayout}>
                                    {getFieldDecorator('actStartTime', {
                                        initialValue:  this.state.info.actStartTime,
                                        rules: [],
                                    })(
                                        <Input disabled />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="实际完成" {...formItemLayout}>
                                    {getFieldDecorator('actEndTime', {
                                        initialValue:  this.state.info.actEndTime,
                                        rules: [],
                                    })(
                                        <Input disabled />
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24} type="flex">
                            <Col span={12}>
                                <Form.Item label="计划数量" {...formItemLayout}>
                                    {getFieldDecorator('planCount', {
                                        initialValue:  this.state.info.planCount,
                                        rules: [],
                                    })(
                                        <Input disabled />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="实际数量" {...formItemLayout}>
                                    {getFieldDecorator('actCount', {
                                        initialValue:  this.state.info.actCount,
                                        rules: [],
                                    })(
                                        <Input disabled />
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24} type="flex">
                            <Col span={12}>
                                <Form.Item label="完成百分比" {...formItemLayout}>
                                    {getFieldDecorator('completePct', {
                                        initialValue:  this.state.info.completePct,
                                        rules: [],
                                    })(
                                        <Input disabled />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="估计完成" {...formItemLayout}>
                                    {getFieldDecorator('planEndTime3', {
                                        initialValue:  this.state.info.planEndTime,
                                        rules: [],
                                    })(
                                        <Input disabled />
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
const PlanPreparedBaselines = Form.create()(PlanPreparedBaseline);
export default PlanPreparedBaselines