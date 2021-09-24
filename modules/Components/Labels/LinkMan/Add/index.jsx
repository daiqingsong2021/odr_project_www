import React, { Component } from 'react'
import style from './style.less'
import { Form, Row, Col, Input, Button, Modal, InputNumber } from 'antd';
import { connect } from 'react-redux'
import axios from '../../../../../api/axios'
import { prepaContactsAdd, prepaContactsById } from '../../../../../api/api'
import * as dataUtil from '../../../../../utils/dataUtil'
import SubmitButton from "../../../../../components/public/TopTags/SubmitButton"
const { TextArea } = Input;
class LinkManAdd extends Component {
    constructor(props) {
        super(props)
        this.state = {
            initDone: false,
            visible: false,
            info: {}
        }
    }

    getData = (id) => {
        axios.get(prepaContactsById(id)).then(res => {
            this.setState({
                info: res.data.data
            })
        })
    }

    componentDidMount() {
        if (this.props.addBiz) {
            // addlinkman
            this.setState({
                width: this.props.width,
                biz: this.props.addBiz,
                visible: this.props.addlinkman
            })
        } else if (this.props.upDataBiz) {
            // modifylinkman
            this.getData(this.props.upDataBiz.id)
            this.setState({
                width: this.props.width,
                biz: this.props.upDataBiz,
                visible: this.props.modifylinkman
            })
        }

    }


    handleSubmit = (val) => {
     
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                let data1 = {
                    ...values,
                    bizId: this.state.biz.id,
                    bizType: this.props.bizType,
                }
                let data2 = {
                    ...values,
                    id: this.state.biz.id,
                }

                let extInfo = this.props.extInfo || {};
                let url = dataUtil.spliceUrlParams(prepaContactsAdd,{"startContent":extInfo.startContent});
                if (this.props.addBiz) {
                    axios.post(url, data1, true).then(res => {
                        this.props.linkAdd(res.data.data);
                        if (val == 'save') {
                            this.handleCancel();
                        } else if (val == 'goOn') {
                            this.props.form.resetFields();
                        }
                    })
                } else if (this.props.upDataBiz) {
                    axios.put(url, data2, true).then(res => {
                        this.props.upData(res.data.data)
                        if (val == 'save') {
                            this.handleCancel();
                        } else if (val == 'goOn') {
                            this.props.form.resetFields();
                        }
                    })
                }



            }
        });
    }
    showModal = () => {
        this.setState({
            visible: true,
        });
    }
    handleOk = (e) => {
        this.setState({
            visible: false,
        });
        this.props.handleCancel()
    }
    handleCancel = (e) => {
        this.setState({
            visible: false,
        });
        this.props.handleCancel()
    }
    render() {
        const { intl } = this.props.currentLocale
        const {
            getFieldDecorator,
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
            <div className={style.main}>
                <div>
                    <Modal title={this.props.title} visible={this.state.visible}
                        onOk={this.handleOk} onCancel={this.handleCancel}
                        mask={false}
                        maskClosable={false}
                        width="800px"
                        footer={
                            <div className="modalbtn">
                                {this.props.opttype === 'modify' ?
                                  <SubmitButton key={3} onClick={this.props.handleCancel} content="取消" />
                                  :
                                  <SubmitButton key={3} onClick={this.handleSubmit.bind(this, 'goOn')} content="保存并继续" />
                                }
                                <SubmitButton key={2} onClick={this.handleSubmit.bind(this, 'save')} type="primary" content="保存" />
                            </div>
                        }
                    >
                        <Form onSubmit={this.handleSubmit}>
                            <div className={style.content}>
                                <Row type="flex">
                                    <Col span={12}>
                                        <Form.Item label={intl.get("wsd.i18n.sys.ipt.username")} {...formItemLayout}>
                                            {/* 联系人 */}
                                            {getFieldDecorator('contactName', {
                                                initialValue: this.state.info.contactName,
                                                rules: [{
                                                    required: true,
                                                    message: intl.get('wsd.i18n.message.enter') + intl.get("wsd.i18n.sys.ipt.username"),
                                                }],
                                            })(
                                                <Input maxLength={66}/>
                                            )}
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label={intl.get("wsd.i18n.plot.approval.unit")} {...formItemLayout}>
                                            {/* 联系单位 */}
                                            {getFieldDecorator('contactUnit', {
                                                initialValue: this.state.info.contactUnit,
                                                rules: [{
                                                    required: true,
                                                    message: intl.get('wsd.i18n.message.enter') + intl.get("wsd.i18n.plot.approval.unit"),
                                                }],
                                            })(
                                                <Input maxLength={66}/>
                                            )}
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row >
                                    <Col span={12}>
                                        <Form.Item label={intl.get("wsd.i18n.sys.ipt.phone")} {...formItemLayout}>
                                            {/* 联系电话 */}
                                            {getFieldDecorator('contactPhone', {
                                                initialValue: this.state.info.contactPhone,
                                                rules: [{
                                                    required: true,
                                                    message: intl.get('wsd.i18n.message.enter') + intl.get("wsd.i18n.sys.ipt.phone"),
                                                },
                                                {
                                                    pattern:/(^1(3\d|47|5((?!4)\d)|7\d|8\d)\d{8,8}$)|(^((0\d{2,3})-?)(\d{7,8})(-(\d{3,}))?$)/,
                                                    message: "联系电话格式不对",
                                                  }],
                                            })(
                                                <Input style={{ width: '100%' }} maxLength={13}/>
                                            )}
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={24}>
                                        <Form.Item label={intl.get('wsd.i18n.rsrc.rsrcrole.remark')} {...formItemLayout1}>
                                            {getFieldDecorator('remark', {
                                                initialValue: this.state.info.remark,
                                                rules: [],
                                            })(
                                                <TextArea rows={2} maxLength={80}/>
                                            )}
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </div>
                        </Form>
                    </Modal>
                </div>
            </div>
        )
    }
}
const LinkModals = Form.create()(LinkManAdd);
export default connect(state => ({
    currentLocale: state.localeProviderData
}))(LinkModals)
