import React, { Component } from 'react'
import { Modal, Form, Row, Col, Input, notification, Button } from 'antd';
import style from './style.less'
import { connect } from 'react-redux'
import axios from "../../../../api/axios"
import { getActivityModelsNewModel, assignBussiNewModel } from "../../../../api/api"
import {baseURL} from "../../../../api/config";
const { TextArea } = Input;
const FormItem = Form.Item;
export class SysFlowAdd extends Component {
    constructor(props) {
        super(props)
        this.state = {

            info: {

            }

        }
    }

    componentDidMount() {

    }



    handleSubmit = (val,e) => {
        const { rightData } = this.props
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                let obj = {
                    ...values,
                    parentId: rightData.id
                }
                if (val == 'save') {
                    axios.post(getActivityModelsNewModel, obj, true, null, true).then(res => {
                        if (res.data.data) {
                            //绑定业务参数
                            this.props.addSuccess(res.data.data)
                            this.props.handleCancel()
                        } else {
                            notification.warning(
                                {
                                    placement: 'bottomRight',
                                    bottom: 50,
                                    duration: 2,
                                    message: '创建流程模版失败!',
                                    description: '请重新创建流程模版!'
                                }
                            )
                        }
                    })
                  } else if (val == 'goEdit') {
                    axios.post(getActivityModelsNewModel, obj, true, null, true).then(res => {
                        if (res.data.data) {
                            //绑定业务参数
                            this.props.addSuccess(res.data.data)
                            this.props.handleCancel()
                            //编辑
                            const url = baseURL + "/api/act/modeler?modelId=" + res.data.data.id;
                            window.open(url, "_blank");
                        } else {
                            notification.warning(
                                {
                                    placement: 'bottomRight',
                                    bottom: 50,
                                    duration: 2,
                                    message: '创建流程模版失败!',
                                    description: '请重新创建流程模版!'
                                }
                            )
                        }
                    })
                  }
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
        };
        const formLayout = {
            labelCol: {
                sm: { span: 4 },
            },
            wrapperCol: {
                sm: { span: 20 },
            },
        }
        return (
            <div >

                <Modal className={style.main}
                    width="850px"
                    okText="确定"
                    cancelText="取消"
                    footer={<div className="modalbtn">
                        {/* 保存并编辑 */}
                        <Button key="1" onClick={this.handleSubmit.bind(this, 'goEdit')}> 保存并编辑 </Button>
                        {/* 保存 */}
                        <Button key="2" type="primary" onClick={this.handleSubmit.bind(this, 'save')}> {intl.get('wsd.global.btn.preservation')} </Button>
                    </div>}
                    centered={true}
                    title="新增流程定义"
                    visible={true}
                    mask={false}
                    maskClosable={false}
                    onCancel={this.props.handleCancel}>
                    <Form onSubmit={this.handleSubmit}>
                        <div className={style.content}>
                            <Row type="flex">
                                <Col span={24}>
                                    <Form.Item label="标题" {...formLayout}>
                                        {getFieldDecorator('modelTitle', {
                                            // initialValue: this.state.info.bizmodule,
                                            rules: [{
                                                required: true,
                                                message: intl.get('wsd.i18n.message.enter') + "标题",
                                            }],
                                        })(
                                            <Input />
                                        )}
                                    </Form.Item>
                                </Col>

                                <Col span={24}>
                                    <Form.Item label="描述" {...formLayout}>
                                        {getFieldDecorator('modelDesc', {
                                            // initialValue: this.state.info.category,
                                            rules: [{
                                                required: false,
                                                message: intl.get('wsd.i18n.message.enter') + "描述",
                                            }],
                                        })(
                                            <TextArea />
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
const SysFlowAdds = Form.create()(SysFlowAdd);
export default connect(state => ({
    currentLocale: state.localeProviderData
}), {

    })(SysFlowAdds);
