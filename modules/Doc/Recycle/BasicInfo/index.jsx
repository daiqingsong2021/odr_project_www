import React, { Component } from 'react'
import style from './style.less'
import { Form, Row, Col, Input, Button, Icon, Select, DatePicker } from 'antd';
import { connect } from 'react-redux'
import LabelFormLayout from "../../../../components/public/Layout/Labels/Form/LabelFormLayout"
import LabelFormButton from "../../../../components/public/Layout/Labels/Form/LabelFormButton"
import axios from '../../../../api/axios'
import { docRecyclebinInfo } from '../../../../api/api'

const FormItem = Form.Item;
const { TextArea } = Input;
const Option = Select.Option;
class WfvariableBasicInfo extends Component {
    constructor(props) {
        super(props)
        this.state = {
            initDone: false,
            info: {}
        }
    }

    getData = () => {
        axios.get(docRecyclebinInfo(this.props.data.id)).then(res => {
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
                                {/* 文档标题 */}
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
                                {/* 文档标号 */}
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
                                {/* 所属项目 */}
                                {getFieldDecorator('projectName', {
                                    initialValue: this.props.rightData.projectName,
                                    rules: [],
                                })(
                                    <Input disabled={true} />
                                )}
                            </Form.Item>
                        </Col>
                         <Col span={12}>
                            <Form.Item label={intl.get('wsd.i18n.doc.recycle.sourcefolder')} {...formItemLayout}>
                                {/* 原文件夹 */}
                                {getFieldDecorator('folderName', {
                                    initialValue: this.props.rightData.folderName,
                                    rules: [],
                                })(
                                    <Input disabled={true} />
                                )}
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row >
                      <Col span={12}>
                        <Form.Item label={intl.get('wsd.i18n.doc.compdoc.babelte')} {...formItemLayout}>
                          {/* 上传人 */}
                          {getFieldDecorator('creator', {
                            initialValue: this.props.rightData.creator.name,
                            rules: [],
                          })(
                            <Input disabled={true} />
                          )}
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label={intl.get('wsd.i18n.plan.feedback.creattime')} {...formItemLayout}>
                          {/* 上传时间 */}
                          {getFieldDecorator('creatTime', {
                            initialValue: this.props.rightData.creatTime,
                            rules: [],
                          })(
                            <Input disabled={true} />
                          )}
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                          <Form.Item label={intl.get('wsd.i18n.doc.compdoc.docclassify')} {...formItemLayout}>
                                  {/* 文档类别 */}
                                {getFieldDecorator('docType', {
                                    initialValue: this.state.info.docType,
                                    rules: [],
                                })(
                                    <Input disabled={true} />
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label={intl.get('wsd.i18n.doc.recycle.deletedate')} {...formItemLayout}>
                                {/* 删除日期 */}
                                {getFieldDecorator('delTime', {
                                    initialValue: this.state.info.delTime ? this.state.info.delTime.substr(0, 10) : null,
                                    rules: [],
                                })(
                                    <Input disabled={true} />
                                )}
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <Form.Item label={intl.get('wsd.i18n.sys.ipt.remark')} {...formItemLayout1}>
                                {/* 备注 */}
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
