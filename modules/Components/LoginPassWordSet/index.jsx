import React, { Component } from 'react'
import style from './style.less'
import { Form, Row, Col, Input, Button, Select, Modal, notification } from 'antd';

import { baseURL } from "../../../api/config";

import { connect } from 'react-redux'
import axios from 'axios'
import { validatePassword } from '../../../api/api'

const Option = Select.Option;
const { TextArea } = Input;
const FormItem = Form.Item;
class AddSameLevel extends Component {
    constructor(props) {
        super(props)
        this.state = {

            info: {},
            oldType: "text",
            newType: "text",
            comfirmType: "text"
        }
    }


    componentDidMount() {

    }

    handleSubmit = (e) => {

        // 创建axios默认请求
        axios.defaults.baseURL = baseURL;
        // 配置超时时间
        axios.defaults.timeout = 100000;
        // 配置请求拦截
        axios.interceptors.request.use(config => {
            // config.headers['Access-Control-Allow-Methods'] = 'POST, GET, OPTIONS, PUT,DELETE'
            if (this.props.token) {
                config.headers['Authorization'] = this.props.token;
                config.headers['Content-Type'] = 'application/json';
            }
            return config;
        });
        // // 添加响应拦截器
        // axios.interceptors.response.use(
        //   function (response) {
        //     return response;
        //   },
        //   function (error) {
        //     // 对响应错误 统一格式提示
        //     notification.error(
        //       {
        //         placement: 'bottomRight',
        //         bottom: 50,
        //         duration: 2,
        //         message: '出错了',
        //         description: '服务器大叔任性了，请稍后再试'
        //       }
        //     )
        //     return Promise.reject(error);
        //   }
        // );
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                
                axios.put(validatePassword, values, true, "修改密码成功").then(res => {
                    this.props.form.resetFields()
                    this.props.handleCancel()
                })
            }
        });
    }

    render() {
        const { intl } = this.props.currentLocale
        const {
            getFieldDecorator, getFieldsError, getFieldError, isFieldTouched, getFieldValue
        } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };
        const handleValidatornewPassWord = (rule, val, callback) => {
            if (!val) {
                callback();
            }

            if (isFieldTouched("confirmPassWord") && getFieldValue("confirmPassWord") != val) {
                this.props.form.validateFields(['confirmPassWord'], { force: true });
            }
            callback();
        }
        const handleValidator = (rule, val, callback) => {

            if (!val) {
                callback();
            }

            if (isFieldTouched("newPassWord") && getFieldValue("newPassWord") != val) {
                callback('两次密码输入不一致');
            }
            callback();
        }
        return (
            <div className={style.main}>
                <Modal title="密码已过期请修改密码" visible={true}
                    onCancel={this.props.handleCancel}
                    mask={false}
                    maskClosable={false}
                    centered={true}
                    footer={
                        <div className="modalbtn">
                            <Button key={2} onClick={e => this.props.form.resetFields()} >重置</Button>
                            <Button key={3} onClick={this.handleSubmit} type="primary">提交</Button>
                        </div>
                    }
                >
                    <Form onSubmit={this.handleSubmit}>
                        <div className={style.content}>
                            <Row >

                                <Form.Item label="旧密码" {...formItemLayout}>
                                    {getFieldDecorator('oldPassWord', {
                                        initialValue: this.state.info.name,
                                        rules: [{
                                            required: true,
                                            message: '请输入旧密码'
                                        }]
                                    })(
                                        <Input type={this.state.oldType} onFocus={e => this.setState({ oldType: "password" })} />
                                    )}
                                </Form.Item>
                            </Row>
                            <Row>
                                <Form.Item label="新密码" {...formItemLayout}>
                                    {getFieldDecorator('newPassWord', {
                                        rules: [{
                                            required: true,
                                            message: '请输入新密码'
                                        }, {
                                            validator: handleValidatornewPassWord
                                        }]
                                    })(
                                        <Input type={this.state.newType} onFocus={e => this.setState({ newType: "password" })} />
                                    )}
                                </Form.Item>

                            </Row>

                            <Row >

                                <Form.Item label="确认密码" {...formItemLayout}>
                                    {getFieldDecorator('confirmPassWord', {
                                        rules: [{
                                            required: true,
                                            message: '请输入确认密码'
                                        }, {
                                            validator: handleValidator
                                        }]
                                    })(
                                        <Input type={this.state.comfirmType} onFocus={e => this.setState({ comfirmType: "password" })} />
                                    )}
                                </Form.Item>


                            </Row>

                        </div>

                    </Form>
                </Modal>

            </div>
        )
    }
}
const AddSameLevels = Form.create()(AddSameLevel);
export default connect(state => ({
    currentLocale: state.localeProviderData
}))(AddSameLevels);