import React, { Component } from 'react'
import style from './style.less'
import { Form, Row, Col, Input, Button, Icon, Select, DatePicker, InputNumber } from 'antd';
import LabelFormLayout from "../../../../components/public/Layout/Labels/Form/LabelFormLayout"
import LabelFormButton from "../../../../components/public/Layout/Labels/Form/LabelFormButton"
import { connect } from 'react-redux'


//接口引入
import axios from '../../../../api/axios';
import { iptUpdate, iptInfo, getdictTree } from '../../../../api/api'

const FormItem = Form.Item;
const { TextArea } = Input;
const Option = Select.Option;
class AgencyInfo extends Component {
    constructor(props) {
        super(props)
        this.state = {

            info: {}
        }
    }

    componentDidMount() {

        axios.get(iptInfo(this.props.data.id)).then(res => {
            this.setState({
                info: res.data.data
            }, () => {
                const { info } = this.state
                this.setState({
                    roleTypeList1: info.level ? [info.level] : null
                })
            })
        })
    }



    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            const data = {
                ...values,
                id: this.state.info.id,
                iptName: values.iptName,
                iptCode: values.iptCode,
                parentId: values.parentId,
                remark: values.remark,
                level: values.level,


            };
            if (!err) {
                //updata保存接口
                axios.put(iptUpdate, data, true, null, true).then(res => {
                    const data = {
                        ...this.props.data,
                        ...values,
                    };
                    // this.props.closeRightBox();
                    this.props.updateSuccess(res.data.data);
                })
            }



        });
    }
    //获取等级
    getRoleType = () => {
        if (!this.state.roleTypeList) {
            axios.get(getdictTree("sys.org.level")).then(res => {
                if (res.data.data) {
                    this.setState({
                        roleTypeList: res.data.data,
                        roleTypeList1: null
                    })

                }

            })
        }

    }
    render() {
        const { intl } = this.props.currentLocale
        //用于数据的交互反馈
        const {
            getFieldDecorator, getFieldsError, getFieldError, isFieldTouched,
        } = this.props.form;
        //表单布局
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
                            <Form.Item label={intl.get('wsd.i18n.sys.menu.menuname')} {...formItemLayout}>
                                {getFieldDecorator('iptName', {
                                    initialValue: this.state.info.iptName,//子节点初始值
                                    //校验规则
                                    rules: [{
                                        required: true,
                                        message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.sys.menu.menuname'),
                                    }],
                                })(
                                    <Input maxLength={66} />
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label={intl.get('wsd.i18n.sys.ipt.iptcodej')} {...formItemLayout}>
                                {getFieldDecorator('iptCode', {
                                    initialValue: this.state.info.iptCode,
                                    rules: [{
                                        required: true,
                                        message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.sys.ipt.iptcodej'),
                                    }],
                                })(
                                    <Input maxLength={33} />
                                )}
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row >
                        <Col span={12}>
                            <Form.Item label={intl.get('wsd.i18n.sys.ipt.parentipt')} {...formItemLayout}>
                                {getFieldDecorator('parentId', {
                                    initialValue: this.state.info.parent ? this.state.info.parent.name : null,
                                    rules: [],
                                })(
                                    <Input disabled />
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label={intl.get('wsd.i18n.sys.ipt.level')} {...formItemLayout}>
                                {getFieldDecorator('level', {
                                    initialValue: this.state.info.level ? this.state.info.level.code : null,
                                    rules: [{
                                        required: true,
                                        message: intl.get('wsd.i18n.message.select') + intl.get('wsd.i18n.sys.ipt.level'),
                                    }],
                                })(
                                    <Select onDropdownVisibleChange={this.getRoleType}>
                                        {this.state.roleTypeList1 ? this.state.roleTypeList1.map(item => {
                                            return <Option value={item.code} key={item.code}>{item.name}</Option>
                                        }) : this.state.roleTypeList && this.state.roleTypeList.map(item => {
                                            return <Option value={item.value} key={item.value}>{item.title}</Option>
                                        })}
                                    </Select>
                                )}
                            </Form.Item>
                        </Col>

                    </Row>


                    <Row>
                        <Col span={24}>
                            <Form.Item label={intl.get('wsd.i18n.sys.ipt.remark')} {...formItemLayout1}>
                                {getFieldDecorator('remark', {
                                    initialValue: this.state.info.remark,
                                    rules: [],
                                })(
                                    <TextArea maxLength={66} />
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
const AgencyInfos = Form.create()(AgencyInfo);
export default connect(state => ({
    currentLocale: state.localeProviderData
}), {

    })(AgencyInfos);
