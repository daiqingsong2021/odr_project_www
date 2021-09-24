import React, { Component } from 'react'
import { Modal, Form, Row, Col, Input, Button, Icon, notification } from 'antd';
import style from './style.less'
import { connect } from 'react-redux'
import SubmitButton from "../../../../../../components/public/TopTags/SubmitButton"
const FormItem = Form.Item;


class Add extends Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            initDone: false,
            info: {
                gbCode: 1,
                gbName: 1,
                remark: 1,
            }
        }
    }

    componentDidMount() {
    }



    // 提交表单
    handleSubmit = (val) => {
        this.props.form.validateFieldsAndScroll((err, fieldsValue) => {
            if (!err) {

                let data = {
                    ...fieldsValue,
                    parentId: this.props.record ? this.props.record.id : 0,
                    typeCode: this.props.currentLData ? this.props.currentLData.typeCode : '',
                    remark: fieldsValue['dictName']
                }
                this.props.updateDictTableData(data);
                if (val == 'save') {
                    // 清空表单项
                    this.props.form.resetFields()
                    // 关闭弹窗
                    this.props.handleCancel();
                } else {
                    // 清空表单项
                    this.props.form.resetFields()

                }
            }
        })
    }



    render() {
        const { intl } = this.props.currentLocale;
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
                <Modal
                    title={this.props.title}
                    visible={this.props.visible}
                    onCancel={this.props.handleCancel}
                    footer={null}
                    width="850px"
                    centered={true}
                    mask={false}
                    maskClosable={false}
                    className={style.addFormInfo}
                    footer={
                        <div className='modalbtn'>

                            <SubmitButton key="1" onClick={this.handleSubmit.bind(this, 'goOn')} content="保存并继续" />
                            <SubmitButton key="2" type="primary" onClick={this.handleSubmit.bind(this, 'save')} content="保存" />

                        </div>
                    }
                >
                    <Form onSubmit={this.handleSubmit}>
                        <div className={style.content}>
                            <Row type="flex">
                                <Col span={11}>
                                    <Form.Item label={intl.get('wsd.i18n.doc.basicd.codevalue')} {...formItemLayout}>
                                        {getFieldDecorator('dictCode', {
                                            initialValue: this.state.info.dictCode,
                                            rules: [{
                                                required: true,
                                                message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.doc.basicd.codevalue'),
                                            }],
                                        })(
                                            <Input maxLength={33}/>
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col span={11}>
                                    <Form.Item label={intl.get('wsd.i18n.base.gbtype.remark')} {...formItemLayout}>
                                        {getFieldDecorator('dictName', {
                                            initialValue: this.state.info.dictName,
                                            rules: [{
                                                required: true,
                                                message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.base.gbtype.remark'),
                                            }],
                                        })(
                                            <Input maxLength={33}/>
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


const Adds = Form.create()(Add);
export default connect(state => ({
    currentLocale: state.localeProviderData
}))(Adds)