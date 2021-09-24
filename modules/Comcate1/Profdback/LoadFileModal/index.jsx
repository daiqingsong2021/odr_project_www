import React, {Component} from 'react'
import {Modal, Form, Input, Select, Button, Col, Row, DatePicker, Upload, Icon} from 'antd'
import styles from './index.less'
import emitter from '../../../../api/ev'
import intl from "react-intl-universal";
const FormItem = Form.Item
const Option = Select.Option
const {TextArea} = Input
const locales = {
    "en-US": require('../../../../api/language/en-US'),
    "zh-CN": require('../../../../api/language/zh-CN.json')
}


export default class LoadFileModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            initDone: false,
        }
    }

    loadLocales() {
        intl.init({
            currentLocale: 'zh-CN',
            locales,
        })
            .then(() => {
                // After loading CLDR locale data, start to render
                this.setState({initDone: true})
            })
    }

    normFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    }

    handleSaveFiles(){
        const {form} = this.props
        form.validateFields((err, values) => {
            if (err) {
                return
            } else {
                emitter.emit('noticeUpdateEvents', {status: 'add', data: values})
            }
            form.resetFields()
        })
    }

    handleSave(){
        const{onCancel} = this.props
        this.handleSaveFiles()
        onCancel()
    }

    handleCancel(){
        const {form, onCancel} = this.props
        form.resetFields()
        onCancel()
    }

    render() {
        const {visible, selectedFile, form, onCancel} = this.props
        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 8},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 16},
            },
        }
        const {getFieldDecorator} = form
        return (
            <div className={styles.main}>
                <Modal title={selectedFile && selectedFile.length > 0 ? '修改文件' : '上传文件'}
                       visible={visible}
                       footer={null}
                       centered={true}
                       onCancel={onCancel}
                       width='850px'>
                    <Form>
                        <div>
                            <Row gutter={24} type='flex'>
                                <Col span={11}>
                                    <FormItem label='文件名称'{...formItemLayout}>
                                        {
                                            getFieldDecorator('filename', {
                                                initialValue: selectedFile && selectedFile.length > 0 ? selectedFile[0].filename:void [0],
                                                rules: [{required: true, message: '请输入文件名称'}],
                                            })(<Input/>)
                                        }
                                    </FormItem>
                                </Col>

                                <Col span={11}>
                                    <FormItem label='版本号'{...formItemLayout} >
                                        {
                                            getFieldDecorator('version',{
                                                initialValue: selectedFile && selectedFile.length > 0 ? selectedFile[0].version:void [0],
                                            })
                                            (<Select allowClear={true}>
                                                <Option key='0' value='A1203'>A1203</Option>
                                                <Option key='1' value='A1204'>A1204</Option>
                                                <Option key='2' value='A1205'>A1205</Option>
                                            </Select>)
                                        }
                                    </FormItem>
                                </Col>

                                <Col span={11}>
                                    <FormItem label='上传时间' creator
                                              {...formItemLayout}>
                                        {
                                            getFieldDecorator('uptime',)
                                            (<DatePicker style={{width: '231px'}}/>)
                                        }
                                    </FormItem>
                                </Col>

                                <Col span={11}>
                                    <FormItem label='上传人' creator
                                              {...formItemLayout}>
                                        {
                                            getFieldDecorator('creator',{
                                                initialValue: selectedFile && selectedFile.length > 0 ? selectedFile[0].creator:void [0],
                                            })(<Input/>)
                                        }
                                    </FormItem>
                                </Col>

                            </Row>
                            <FormItem label='附件'{...formItemLayout}
                                      style={{marginRight: '35px', marginLeft: '-214px'}}>
                                {getFieldDecorator('upload', {
                                    valuePropName: 'fileList',
                                    getValueFromEvent: this.normFile,
                                })(
                                    <Upload name="logo" action="/upload.do" listType="picture">
                                        <Button>
                                            <Icon type="upload"/> 上传
                                        </Button>
                                    </Upload>
                                )}
                            </FormItem>

                            <FormItem label='备注'
                                      {...formItemLayout}
                                      style={{marginRight: '35px', marginLeft: '-214px'}}>
                                {
                                    getFieldDecorator('remark',{
                                        initialValue: selectedFile && selectedFile.length > 0 ? selectedFile[0].remark:void [0],
                                    })
                                    (<TextArea rows={2}/>)
                                }
                            </FormItem>

                            {
                                selectedFile && selectedFile.length > 0 ?  <div className={styles.twoButtons}>
                                    <Button onClick={() => this.handleCancel()}>
                                        取消
                                    </Button>
                                    <Button type='primary' style={{marginLeft: '15px'}}
                                            onClick={() => this.handleSave()}>
                                        保存
                                    </Button>
                                </div> : <div className={styles.twoButtons}>
                                    <Button onClick={() => this.handleSaveFiles()}>
                                        取消
                                    </Button>
                                    <Button type='primary' style={{marginLeft: '15px'}}
                                            onClick={() => this.handleSave()}>
                                        保存
                                    </Button>
                                </div>
                            }
                        </div>

                    </Form>
                </Modal>
            </div>
        )
    }
}
LoadFileModal = Form.create()(LoadFileModal);