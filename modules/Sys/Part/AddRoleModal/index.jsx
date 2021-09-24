import react, { Component } from 'react'
import { Modal, Form, Input, Select, Button, Col, Row } from 'antd'


import style from "./style.less";
import { connect } from 'react-redux'
import axios from '../../../../api/axios'
import { roleAdd } from '../../../../api/api'
import SubmitButton from "../../../../components/public/TopTags/SubmitButton"
const FormItem = Form.Item
const Option = Select.Option
const { TextArea } = Input

//角色管理-新增角色Modal
class AddRoleModal extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }

    //关闭窗口
    cancel() {
        const { form, onCancel } = this.props
        form.resetFields()
        onCancel()
    }
    //提交
    handleSubmit = (val) => {
       
        this.props.form.validateFieldsAndScroll((err, fieldsValue) => {
            if (!err) {

                axios.post(roleAdd, fieldsValue, true).then(res => {

                    this.props.addSuccess(res.data.data);
                    if (val == 'save') {
                        this.props.handleCancel();
                    } else {
                        // 清空表单项
                        this.props.form.resetFields()
                    }
                })



            }
        })
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
        }
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
                <Modal visible={this.props.visible}
                maskClosable={false}
                mask={false}
                    title='新增角色'
                    footer={
                        <div className="modalbtn">
                            <SubmitButton key={3} onClick={this.handleSubmit.bind(this, 'goOn')} content="保存并继续" />
                            <SubmitButton key={2} onClick={this.handleSubmit.bind(this, 'save')} type="primary" content="保存" />
                        </div>
                    }
                    centered={true}
                    onCancel={this.props.onCancel}
                    width='850px'>
                    <Form>
                        <div className={style.content}>
                            <Row type='flex'>
                                <Col span={12}>
                                {/* 角色名称 */}
                                    <FormItem label={intl.get('wsd.i18n.sys.role.rolename')}
                                        {...formItemLayout}>
                                        {
                                            getFieldDecorator('roleName', {
                                                rules: [
                                                  { required: true, message: '请输入角色名称' },
                                                ],
                                            })(<Input  maxLength={21}/>)
                                        }
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                  {/* 角色代码 */}
                                    <FormItem label="角色代码"
                                        {...formItemLayout}>
                                        {
                                            getFieldDecorator('roleCode', {
                                                rules: [
                                                  { required: true, message: '请输入角色代码' },
                                                 ],
                                            })(<Input maxLength={21} />)
                                        }
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row >
                                <Col span={24}>
                                   {/* 角色描述 */}
                                    <Form.Item label={intl.get('wsd.i18n.sys.role.roledesc')} {...formItemLayout1}>
                                        {getFieldDecorator('roleDesc', {
                                            rules: [],
                                        })(
                                            <TextArea rows={2} maxLength={85}/>
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
const AddRoleModals = Form.create()(AddRoleModal)
export default connect(state => ({
    currentLocale: state.localeProviderData
}))(AddRoleModals)
