import React, { Component } from 'react'
import { Modal, Button, Row, Col, Input, Icon, Select, Form } from 'antd'
import style from './style.less'
import { connect } from 'react-redux'
import UploadTpl from '../../../../components/public/TopTags/uploadTpl'
import axios from '../../../../api/axios'
import { docProjectInfo, docProjectPromote } from '../../../../api/api'
import * as dataUtil from "../../../../utils/dataUtil"
import SubmitButton from "../../../../components/public/TopTags/SubmitButton"

const { TextArea } = Input;

class UploadDoc extends Component {

    state = {
        initDone: false,
        modalInfo: {
            title: '文档升版'
        },
        inputValue: 0,
        info: {},
        fileName: '',
        fileId: null,

    }

    getData = () => {
        axios.get(docProjectInfo(this.props.rightData.id)).then(res => {
            this.setState({
                info: res.data.data
            })
        })
    }

    componentDidMount() {
        this.getData();
    }

    
    handleCancel() {
        this.props.handleCancel('UpgradeVisible')
    }

    //升版保存事件
    handleSubmit = () => {
        
        this.props.form.validateFieldsAndScroll((err, fieldsValue) => {
            if (!err) {
                const values = {
                    docId: this.props.rightData.id,
                    fileId: this.state.fileId,
                    version: fieldsValue['version'],
                    secutyLevel:1
                }
                const {startContent}=this.props
                let url = dataUtil.spliceUrlParams(docProjectPromote,{startContent});
                axios.put(url, values, true, '升版成功',true).then(res => {
                    this.props.rightUpdateData(res.data.data);
                    // 清空表单项
                    this.props.form.resetFields()
                    this.setState({
                        fileName: '',
                        fileId: null,
                    })
                    // 关闭弹窗
                    this.handleCancel();
                })
            }
        })
    }

    onChange = (value) => {
        this.setState({
            inputValue: value,
        });
    }


    //上传文档回调
    file = (files) => {
        this.setState({
            fileId: files.response ? (files.response.data ? files.response.data.id : null) : null,
            fileName: files.response ? (files.response.data ? files.response.data.fileName : '') : ''
        })
        this.props.form.resetFields('fileId', [files.response ? (files.response.data ? files.response.data.fileName : '') : ''])
    }

    render() {
        const { intl } = this.props.currentLocale;

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
                    title={this.state.modalInfo.title}
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
                                    {/*                initialValue: this.state.info.secutyLevel ? this.state.info.secutyLevel.name : '',*/}
                                    {/*                rules: [],*/}
                                    {/*            })(*/}
                                    {/*                <Input disabled={true} />*/}
                                    {/*            )}*/}
                                    {/*        </div>*/}
                                    {/*    </Form.Item>*/}
                                    {/*</Col>*/}
                                    <Col span={12}>
                                        <Form.Item label={intl.get("wsd.i18n.doc.temp.author")} {...formItemLayout}>
                                            {/* 作者 */}
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
                                    {/*<Col span={12}>*/}
                                    {/*    <Form.Item label={intl.get('wsd.i18n.doc.projectdoc.commandorg')} {...formItemLayout}>*/}
                                    {/*        /!* 所属部门 *!/*/}
                                    {/*        <div className={style.list}>*/}
                                    {/*            {getFieldDecorator('org', {*/}
                                    {/*                initialValue: this.state.info.org ? this.state.info.org.name : '',*/}
                                    {/*                rules: [],*/}
                                    {/*            })(*/}
                                    {/*                <Input disabled={true} />*/}
                                    {/*            )}*/}
                                    {/*        </div>*/}
                                    {/*    </Form.Item>*/}
                                    {/*</Col>*/}

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
                                          <Input addonAfter={<UploadTpl isBatch={false} file={this.file} />} />
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
    currentLocale: state.localeProviderData
}))(UploadDocs);



