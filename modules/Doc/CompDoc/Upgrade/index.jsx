import React, { Component } from 'react'
import { Modal, Button, Row, Col, Input, Icon, Select, Form, Upload, InputNumber, message } from 'antd'
import style from './style.less'
import { connect } from 'react-redux'
import { baseURL } from '../../../../api/config'
import UploadTpl from '../../../../components/public/TopTags/uploadTpl'
import SubmitButton from "../../../../components/public/TopTags/SubmitButton"
import axios from '../../../../api/axios'
import { docCorpInfo, docCompPromote } from '../../../../api/api'

const { TextArea } = Input;

class UploadDoc extends Component {

    state = {
        modalInfo: {
            title: ''
        },
        inputValue: 0,
        fileName: '',
        fileId: null,
        info: {},

    }

    getData = () => {
        axios.get(docCorpInfo(this.props.rightData.id)).then(res => {
            this.setState({
                info: res.data.data
            })
        })

    }

    componentDidMount() {
        this.getData();
    }


    handleSubmit = () => {
      
        this.props.form.validateFieldsAndScroll((err, fieldsValue) => {
            if (!err) {
                const values = {
                    ...fieldsValue,
                    fileId: this.state.fileId,
                    docId: this.props.rightData.id,
                    secutyLevel:1
                }

               
                axios.put(docCompPromote, values, true, '升版成功').then(res => {
                 
                    this.props.update(res.data.data)
                    // 清空表单项
                    this.props.form.resetFields()
                    this.setState({
                        fileName: '',
                        fileId: null
                    })
                    // 关闭弹窗
                    this.props.handleCancel('UpgradeVisible')
                })


            }
        })
    }

    onChange = (value) => {
        this.setState({
            inputValue: value,
        });
    }

    file = (files) => {
        this.setState({
            fileId: files.response ? (files.response.data ? files.response.data.id : null) : null,
            fileName: files.response ? (files.response.data ? files.response.data.fileName : '') : ''
        })
        this.props.form.resetFields('fileId', [files.response ? (files.response.data ? files.response.data.fileName : '') : ''])
    }



    handleCancel() {
        this.props.handleCancel('UpgradeVisible')
    }

    render() {

        const { intl } = this.props.currentLocale;
        let formData = {}

        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form
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
        const formItemLayout2 = {
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
            <div>

                <Modal
                    className={style.main}
                    width="850px"
                    title={intl.get('wsd.i18n.doc.compdoc.doclitreedition')}
                    centered={true}
                    visible={this.props.modalVisible}
                    onCancel={this.handleCancel.bind(this)}
                    mask={false} maskClosable={false}
                    footer={
                        <div className='modalbtn'>
                            <SubmitButton key="b" type="submit" onClick={this.handleCancel.bind(this)} content="取消" />
                            <SubmitButton key="saveAndSubmit" onClick={this.handleSubmit} type="primary" content="保存" />
                        </div>
                    }
                >

                    <div className={style.content}>
                        <Form>
                            <div className={style.content}>
                                <Row type="flex">
                                    <Col span={12}>
                                        <Form.Item label={intl.get('wsd.i18n.doc.temp.title')} {...formItemLayout}>
                                            {/* 文档标题 */}
                                            <div className={style.list}>
                                                {getFieldDecorator('docTitle', {
                                                    initialValue: this.state.info.docTitle,
                                                    rules: [{
                                                        required: true,
                                                        message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.doc.temp.title')
                                                    }],
                                                })(
                                                    <Input disabled={true} />
                                                )}
                                            </div>
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label={intl.get('wsd.i18n.doc.compdoc.docserial')} {...formItemLayout}>
                                            {/* 文档编号 */}
                                            <div className={style.list}>
                                                {getFieldDecorator('docNum', {
                                                    initialValue: this.state.info.docNum,
                                                    rules: [{
                                                        required: true,
                                                        message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.doc.compdoc.docserial')
                                                    }],
                                                })(
                                                    <Input disabled={true} />
                                                )}
                                            </div>
                                        </Form.Item>
                                    </Col>
                                    {/*<Col span={12}>*/}
                                    {/*    <Form.Item label={intl.get('wsd.i18n.sys.user1.userlevel')} {...formItemLayout}>*/}
                                    {/*        /!* 密级 *!/*/}
                                    {/*        <div className={style.list}>*/}
                                    {/*            {getFieldDecorator('secutyLevel', {*/}
                                    {/*                initialValue: this.state.info.secutyLevel ? this.state.info.secutyLevel.name : null,*/}
                                    {/*                rules: [],*/}
                                    {/*            })(*/}
                                    {/*                <Input disabled={true} />*/}
                                    {/*            )}*/}
                                    {/*        </div>*/}
                                    {/*    </Form.Item>*/}
                                    {/*</Col>*/}
                                    <Col span={12}>
                                        <Form.Item label={intl.get('wsd.i18n.doc.compdoc.docauthor')} {...formItemLayout}>
                                            {/* 文档作者 */}
                                            <div className={style.list}>
                                                {getFieldDecorator('author', {
                                                    initialValue: this.state.info.author,
                                                    rules: [],
                                                })(
                                                    <Input disabled={true} />
                                                )}
                                            </div>
                                        </Form.Item>
                                    </Col>


                                    <Col span={12}>
                                        <Form.Item label={intl.get('wsd.i18n.doc.temp.versions')} {...formItemLayout}>
                                            {/* 版本 */}
                                            <div className={style.list}>
                                                {getFieldDecorator('version', {
                                                    initialValue: this.state.info.version,
                                                    rules: [],
                                                })(
                                                    <Input maxLength={6}/>
                                                )}
                                            </div>
                                        </Form.Item>
                                    </Col>

                                    <Col span={12} className={style.upload}>
                                        <Form.Item label={intl.get('wsd.i18n.plan.fileinfo.filename')} {...formItemLayout}>
                                            {/* 文件名称 */}
                                            <div className={style.list}>
                                                {getFieldDecorator('fileId', {
                                                    initialValue: this.state.fileName,
                                                    rules: [{
                                                        required: true,
                                                        message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.plan.fileinfo.filename')
                                                    }],
                                                })(
                                                    <Input disabled addonAfter={<UploadTpl isBatch={false} file={this.file} />} />
                                                )}
                                            </div>
                                        </Form.Item>
                                    </Col>

                                </Row>
                            </div>
                        </Form>

                    </div>

                </Modal>
            </div>
        )
    }

}


const UploadDocs = Form.create()(UploadDoc);
export default connect(state => ({
    currentLocale: state.localeProviderData,
}))(UploadDocs);



