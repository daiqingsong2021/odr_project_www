import React, { Component } from 'react'
import style from './style.less'
import { Form, Row, Icon, Input, Button, Select, Modal, Popover } from 'antd';



import { connect } from 'react-redux'
import axios from '../../../api/axios'
import { validatePassword,tmmInfo } from '../../../api/api'


const Option = Select.Option;
const { TextArea } = Input;
const FormItem = Form.Item;
class AddSameLevel extends Component {
    constructor(props) {
        super(props)
        this.state = {
            passwordSet:{},
            info: {},
            oldType: "text",
            newType: "text",
            comfirmType: "text",
            check1: true,
            check2: true,
            check3: true,
            visiable: false
        }
    }


    componentDidMount() {
        this.gettmmInfo()
    }
    //获取密码设置
    gettmmInfo = () => {
        axios.get(tmmInfo).then(res => {
            if (res.data.data) {
                this.setState({
                    passwordSet: res.data.data
                })
            }


        })

    }
    handleSubmit = (e) => {

        e.preventDefault();
        let form = this.props.form

        this.props.form.validateFieldsAndScroll((err, values) => {

            if (!err) {

                axios.put(validatePassword, values, true, "修改密码成功").then(res => {
                    this.props.form.resetFields()
                    this.props.handleCancel()
                })
            }

        });
    }
    reSetFiled = () => {
        this.props.form.resetFields()
        this.setState({
            check1: true,
            check2: true,
            check3: true,
        })
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
            //同时包含大小写字母、数字
            let checkRule1 = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/
            let check1 = checkRule1.test(val)

            //密码长度为8-32个字符
            let reg = new RegExp("^.{"+this.state.passwordSet.length+",32}$"); 
            let checkRule2 = /^.{12,32}$/
            let check2 = reg.test(val)

            //包含特殊字符，且不包含空格
            //包含特殊字符
            let SpecialEm = /^(?=.*?[#?!@$%^&*-])/
            let special = SpecialEm.test(val)
            //包含空格
            let isHaveSpace = /^[^ ]+$/
            let check3 = isHaveSpace.test(val) && special
            this.setState({
                check1,
                check2,
                check3,
            })
            if (!val) {
                callback();
                return
            } else if (!check1 || !check2 || !check3) {
                callback("密码格式不对");
                return
            } else if (isFieldTouched("confirmPassWord") && getFieldValue("confirmPassWord") != val) {
                this.props.form.validateFields(['confirmPassWord'], { force: true });
                callback();
            } else if (isFieldTouched("newPassWord") && getFieldValue("newPassWord") != val) {
                callback('两次密码输入不一致');
                return
            } else {
                callback();
                return
            }


        }
        const handleValidator = (rule, val, callback) => {
            if (isFieldTouched("newPassWord") && getFieldValue("newPassWord") != val && val) {
                callback('两次密码输入不一致');
            } else {
                callback();
            }

        }
        const Content = (
            <div>
                <p>{this.state.check1 ? <Icon type="check-circle" style={{ color: "green" }} /> : <Icon type="close-circle" style={{ color: "red" }} />} 同时包含大小写字母、数字</p>
                <p>{this.state.check2 ? <Icon type="check-circle" style={{ color: "green" }} /> : <Icon type="close-circle" style={{ color: "red" }} />} 密码长度为8-32个字符</p>
                <p>{this.state.check3 ? <Icon type="check-circle" style={{ color: "green" }} /> : <Icon type="close-circle" style={{ color: "red" }} />} 包含特殊字符，且不包含空格</p>
            </div>
        )
        return (
            <div >
                <Modal title={this.props.isUpdate? "密码已过期请修改密码":"修改密码"} visible={true}
                    onCancel={this.props.handleCancel}
                    mask={false}
                    maskClosable={false}
                    centered={true}
                    width={800}
                    footer={
                        <div className="modalbtn">
                            <Button key={2} onClick={this.reSetFiled} >重置</Button>
                            <Button key={3} onClick={this.handleSubmit} type="primary">提交</Button>
                        </div>
                    }
                >
                    <Form onSubmit={this.handleSubmit} className={style.main}>
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
                                        <Input type={this.state.oldType} onFocus={e => this.setState({ oldType: "password" })} autoComplete="new-password" />
                                    )}
                                </Form.Item>
                            </Row>
                            <Row>
                                <Form.Item label="新密码" {...formItemLayout} >
                                    {getFieldDecorator('newPassWord', {
                                        rules: [{
                                            required: true,
                                            message: '请输入新密码'
                                        }, {
                                            validator: handleValidatornewPassWord
                                        }]
                                    })(

                                        <Input type={this.state.newType} onFocus={e => this.setState({ newType: "password", visiable: true })} onBlur={() => this.setState({ visiable: false })} autoComplete="new-password" />

                                    )}
                                </Form.Item>
                                {this.state.visiable &&
                                    <div className={style.popover}>
                                        <div>
                                            <h4>密码满足以下要求：</h4>
                                            <p>{this.state.check1 ? <Icon type="check-circle" style={{ color: "green" }} /> : <Icon type="close-circle" style={{ color: "red" }} />} 同时包含大小写字母、数字</p>
                                            <p>{this.state.check2 ? <Icon type="check-circle" style={{ color: "green" }} /> : <Icon type="close-circle" style={{ color: "red" }} />}{"密码长度为"+this.state.passwordSet.length+"-32个字符"}</p>
                                            <p>{this.state.check3 ? <Icon type="check-circle" style={{ color: "green" }} /> : <Icon type="close-circle" style={{ color: "red" }} />} 包含特殊字符，且不包含空格</p>
                                        </div>

                                    </div>
                                }

                            </Row>

                            <Row >

                                <Form.Item label="确认密码" {...formItemLayout} >
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
