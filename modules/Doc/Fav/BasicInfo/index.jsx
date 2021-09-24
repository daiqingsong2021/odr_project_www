import React, { Component } from 'react'
import style from './style.less'
import { Form, Row, Col, Input, Button, Icon, Select, DatePicker } from 'antd';
import { connect } from 'react-redux'
import LabelFormLayout from "../../../../components/public/Layout/Labels/Form/LabelFormLayout"
import LabelFormButton from "../../../../components/public/Layout/Labels/Form/LabelFormButton"

import axios from '../../../../api/axios'
import { docProjectInfo } from '../../../../api/api'

const FormItem = Form.Item;
const { TextArea } = Input;
const Option = Select.Option;
class WfvariableBasicInfo extends Component {
    constructor(props) {
        super(props)
        this.state = {
            info: {}
        }
    }

    getData = () => {
        axios.get(docProjectInfo(this.props.data.docId)).then(res => {
            this.setState({
                info: res.data.data
            })
        })
    }
    componentDidMount() {
        this.getData();
    }



    handleSubmit = (e) => {
        e.preventDefault();
        alert(1)
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.props.curdCurrentData({
                    title: localStorage.getItem('name'),
                    status: 'update',
                    data: values
                })
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
                            <Form.Item label={intl.get('wsd.i18n.doc.temp.title')} {...formItemLayout}>
                                {getFieldDecorator('docTitle', {
                                    initialValue: this.state.info.docTitle,
                                    rules: [],
                                })(
                                    <Input disabled={true} />
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label={intl.get('wsd.i18n.doc.compdoc.docserial')} {...formItemLayout}>
                                {getFieldDecorator('docNum', {
                                    initialValue: this.state.info.docNum,
                                    rules: [],
                                })(
                                    <Input disabled={true} />
                                )}
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row >
                        <Col span={12}>
                            <Form.Item label={intl.get('wsd.i18n.comu.meeting.projectname')} {...formItemLayout}>
                                {getFieldDecorator('projectName', {
                                    initialValue: this.props.rightData.projectName,
                                    rules: [],
                                })(
                                    <Input disabled={true} />
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item label={intl.get('wsd.i18n.doc.compdoc.docauthor')} {...formItemLayout}>
                            {getFieldDecorator('author', {
                              initialValue: this.state.info.author,
                              rules: [],
                            })(
                              <Input disabled={true} />
                            )}
                          </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                          <Form.Item label={intl.get('wsd.i18n.doc.temp.versions')} {...formItemLayout}>
                            {getFieldDecorator('version', {
                              initialValue: this.state.info.version,
                              rules: [],
                            })(
                              <Input disabled={true} />
                            )}
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item label={intl.get('wsd.i18n.doc.compdoc.docstate')} {...formItemLayout}>
                            {getFieldDecorator('status', {
                              initialValue: this.props.rightData.status ? this.props.rightData.status.name : null,
                              rules: [],
                            })(
                              <Input disabled={true} />
                            )}
                          </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <Form.Item label={intl.get('wsd.i18n.operate.fdback.remark')} {...formItemLayout1}>
                                {getFieldDecorator('remark', {
                                    initialValue: this.state.info.remark,
                                    rules: [],
                                })(
                                    <TextArea rows={2} disabled={true} />
                                )}
                            </Form.Item>
                        </Col>
                    </Row>


                </Form>
                <LabelFormButton>
                    <Button onClick={this.props.closeRightBox} style={{ width: "100px" }}>关闭</Button>
                </LabelFormButton>
            </LabelFormLayout>

        )
    }
}
const WfvariableBasicInfos = Form.create()(WfvariableBasicInfo);
export default connect(state => ({
    currentLocale: state.localeProviderData
}))(WfvariableBasicInfos);
