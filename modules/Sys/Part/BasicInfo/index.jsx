import React, { Component } from 'react'
import style from './style.less'
import LabelFormLayout from "../../../../components/public/Layout/Labels/Form/LabelFormLayout"
import LabelFormButton from "../../../../components/public/Layout/Labels/Form/LabelFormButton"
import { Form, Row, Col, Input, Button, Icon, Select, DatePicker, message } from 'antd';
import { connect } from 'react-redux'

import { roleUpdate2, getRoleInfoById } from '../../../../api/api';
import axios from '../../../../api/axios';

const { TextArea } = Input;
//角色管理-基本信息
class MenuInfo extends Component {
    constructor(props) {
        super(props)
        this.state = {
            info: {}
        }
    }
    //获取基本信息
    getData = (id) => {
        axios.get(getRoleInfoById(id)).then(res => {
            this.setState({
                info: res.data.data,
            });
        });
    };

    componentDidMount() {
        this.props.rightData ? this.getData(this.props.rightData.id) : null;
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                const data = {
                    ...values,
                    id: this.props.rightData.id,
                }
                axios.put(roleUpdate2, data, true).then(res => {
                    this.props.updateSuccess(res.data.data);
                });
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
            <LabelFormLayout title={this.props.title} >
                <Form onSubmit={this.handleSubmit}>
                    <Row type="flex">
                        <Col span={12}>
                            <Form.Item label={intl.get('wsd.i18n.sys.role.rolename')} {...formItemLayout}>
                                {getFieldDecorator('roleName', {
                                    initialValue: this.state.info.roleName ? this.state.info.roleName : '',
                                    rules: [{
                                        required: true,
                                        message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.sys.role.rolename'),
                                    }],
                                })(
                                    <Input maxLength={21} />
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="角色代码" {...formItemLayout}>
                                {getFieldDecorator('roleCode', {
                                    initialValue: this.state.info.roleCode ? this.state.info.roleCode : '',
                                    rules: [{
                                        required: true,
                                        message: intl.get('wsd.i18n.message.enter') + "角色代码",
                                    }],
                                })(
                                    <Input maxLength={21} />
                                )}
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row >
                        <Col span={24}>
                            <Form.Item label={intl.get('wsd.i18n.sys.role.roledesc')} {...formItemLayout1}>
                                {getFieldDecorator('roleDesc', {
                                    initialValue: this.state.info.roleDesc ? this.state.info.roleDesc : '',
                                    rules: [],
                                })(
                                    <TextArea rows={2} maxLength={85} />
                                )}
                            </Form.Item>
                        </Col>
                    </Row>

                </Form>
                <LabelFormButton>
                    <Button className="globalBtn" onClick={this.props.closeRightBox} style={{ marginRight: 20 }}>取消</Button>
                    <Button className="globalBtn" onClick={this.handleSubmit} type="primary">保存</Button>
                </LabelFormButton>
            </LabelFormLayout>

        )
    }
}

const MenuInfos = Form.create()(MenuInfo);
export default connect(state => ({
    currentLocale: state.localeProviderData
}))(MenuInfos);
