import React, { Component } from 'react'
import { Modal, Button, Row, Col, Input, Icon, Select, Form, TreeSelect } from 'antd'
import style from './style.less'
import { connect } from 'react-redux'
import SubmitButton from "../../../../components/public/TopTags/SubmitButton"
import UploadTask from '../UploadTask/index'
import UploadTpl from '../../../../components/public/TopTags/uploadTpl'
import MyIcon from '../../../../components/public/TopTags/MyIcon'
import axios from '../../../../api/axios'
import { getdictTree, docOrgSel, docProjectAdd } from '../../../../api/api'
import * as dataUtil from "../../../../utils/dataUtil"
class UploadDoc extends Component {

    state = {
        initDone: false,
        modalInfo: {
            title: '上传文档'
        },
        inputValue: 0,
        task: false,
        taskData: {},
        fileId: null,
        fileName: '',
        orgSelData: [],
        docclassifyData: [],
        professionData: [],
        secutylevelData: []

    }

    componentDidMount () {
        const userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
        this.setState({
            actuName: userInfo.actuName
        })
    }


    handleSubmit = (val) => {

        this.props.form.validateFieldsAndScroll((err, fieldsValue) => {
            if (!err) {
                const values = {
                    ...fieldsValue,
                    fileId: this.state.fileId,
                    folderId: 'folder' == this.props.data.type ? this.props.data.id : 0,
                    projectId: this.props.projectId,
                    bizId: fieldsValue['bizId'] ? (this.state.taskData.id ? this.state.taskData.id : null) : '',
                    bizType: this.props.bizType
                }
                const { startContent } = this.props;
                let url = dataUtil.spliceUrlParams(docProjectAdd, { startContent });
                axios.post(url, values, true, '上传成功', true).then(res => {
                    this.props.addData(res.data.data);
                    this.setState({
                        fileId: null,
                        fileName: '',
                        taskData: {},
                    })
                    if (val != 'save') {
                        // 清空表单项
                        this.props.form.resetFields()
                    } else {
                        // 关闭弹窗
                        this.props.handleCancel();
                    }
                })
            }
        })
    }
    taskHandleCancel = () => {
        this.setState({
            task: false
        })
    }
    click () {
        this.setState({ task: true })
    }
    handleCancel () {
        this.props.handleCancel('UploadVisible')
    }

    //上传回调
    file = (files) => {
        this.setState({
            fileId: files.response ? (files.response.data ? files.response.data.id : null) : null,
            fileName: files.response ? (files.response.data ? files.response.data.fileName : '') : ''
        })
        this.props.form.resetFields('fileId', [files.response ? (files.response.data ? files.response.data.fileName : '') : ''])
    }

    //任务选择回调
    taskData = (task) => {
        let obj = {
            id: task.id,
            name: task.name,
        }
        this.setState({
            taskData: obj
        })
    }
    //请求下拉列表
    onFocusSelect = (value) => {
        let { orgSelData, docclassifyData, secutylevelData, professionData } = this.state;

        if ((orgSelData.length != 0 && value == 'org') || (docclassifyData.length != 0 && value == 'doc.docclassify') || (secutylevelData.length != 0 && value == 'comm.secutylevel') || (professionData.length != 0 && value == 'doc.profession')) {
            return;
        }

        if (value == 'org') {

            axios.get(docOrgSel(this.props.projectId)).then(res => {
                if (res.data.data) {
                    this.setState({
                        orgSelData: res.data.data
                    })
                }

            })

        }
        axios.get(getdictTree(value)).then(res => {
            if (!res.data.data) {
                return
            }
            if (value == 'doc.docclassify') {
                this.setState({
                    docclassifyData: res.data.data
                })
            } else if (value == 'comm.secutylevel') {
                this.setState({
                    secutylevelData: res.data.data
                })
            } else if (value == 'doc.profession') {
                this.setState({
                    professionData: res.data.data
                })
            }
        })




    }

    render () {

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
                    title={this.state.modalInfo.title}
                    centered={true}
                    visible={true}
                    onCancel={this.handleCancel.bind(this)}
                    mask={false} maskClosable={false}
                    footer={
                        <div className='modalbtn'>
                            {/* 保存并继续 */}
                            <SubmitButton key="saveAndSubmit" onClick={this.handleSubmit.bind(this, 'goOn')} content={intl.get('wsd.global.btn.saveandcontinue')} />
                            {/* 保存 */}
                            <SubmitButton key="b" type="primary" onClick={this.handleSubmit.bind(this, 'save')} content={intl.get('wsd.global.btn.preservation')} />

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
                                                    initialValue: formData.docTitle,
                                                    rules: [{
                                                        required: true,
                                                        message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.doc.temp.title')
                                                    }],
                                                })(
                                                    <Input maxLength={60} />
                                                )}
                                            </div>
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label={intl.get('wsd.i18n.doc.compdoc.docserial')} {...formItemLayout}>
                                            {/* 文档编号 */}
                                            <div className={style.list}>
                                                {getFieldDecorator('docNum', {
                                                    initialValue: formData.docNum,
                                                    rules: [],
                                                })(
                                                    <Input maxLength={33} />
                                                )}
                                            </div>
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label={intl.get('wsd.i18n.doc.compdoc.docclassify')} {...formItemLayout}>
                                            {/* 文档类别 */}
                                            <div className={style.list}>
                                                {getFieldDecorator('docClassify', {
                                                    initialValue: formData.category,
                                                    rules: [],
                                                })(
                                                    <Select onFocus={this.onFocusSelect.bind(this, 'doc.docclassify')}>
                                                        {
                                                            this.state.docclassifyData.length && this.state.docclassifyData.map(item => {
                                                                return (
                                                                    <Select.Option key={item.value} value={item.value}>{item.title}</Select.Option>
                                                                )
                                                            })
                                                        }
                                                    </Select>
                                                )}
                                            </div>
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label={intl.get('wsd.i18n.doc.projectdoc.commandorg')} {...formItemLayout}>
                                            {/* 所属部门 */}
                                            <div className={style.list}>
                                                {getFieldDecorator('orgId', {
                                                    initialValue: formData.department,
                                                    rules: [],
                                                })(
                                                    <TreeSelect
                                                        onFocus={this.onFocusSelect.bind(this, 'org')}
                                                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                                        treeData={this.state.orgSelData}
                                                        treeDefaultExpandAll
                                                    />
                                                )}
                                            </div>
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label={intl.get('wsd.i18n.sys.user1.userlevel')} {...formItemLayout}>
                                            {/* 密级 */}
                                            <div className={style.list}>
                                                {getFieldDecorator('secutyLevel', {
                                                    initialValue: "1",
                                                    rules: [{
                                                        required: true,
                                                        message: intl.get('wsd.i18n.message.select') + intl.get('wsd.i18n.sys.user1.userlevel')
                                                    }],
                                                })(
                                                    <Select onFocus={this.onFocusSelect.bind(this, 'comm.secutylevel')}>
                                                        {
                                                            this.state.secutylevelData.length > 0 ? this.state.secutylevelData.map(item => {
                                                                return (
                                                                    <Select.Option key={item.value} value={item.value}>{item.title}</Select.Option>
                                                                )
                                                            })
                                                                : <Select.Option key={"1"} value={"1"}>非密</Select.Option>

                                                        }
                                                    </Select>
                                                )}
                                            </div>
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label={intl.get('wsd.i18n.doc.temp.major')} {...formItemLayout}>
                                            {/* 文档专业 */}
                                            <div className={style.list}>
                                                {getFieldDecorator('profession', {
                                                    initialValue: formData.profession,
                                                    rules: [],
                                                })(
                                                    <Select onFocus={this.onFocusSelect.bind(this, 'doc.profession')}>
                                                        {
                                                            this.state.professionData.length && this.state.professionData.map(item => {
                                                                return (
                                                                    <Select.Option key={item.value} value={item.value}>{item.title}</Select.Option>
                                                                )
                                                            })
                                                        }
                                                    </Select>
                                                )}
                                            </div>
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label={intl.get('wsd.i18n.doc.compdoc.docauthor')} {...formItemLayout}>
                                            {/* 文档作者 */}
                                            <div className={style.list}>
                                                {getFieldDecorator('author', {
                                                    initialValue: this.state.actuName,
                                                    rules: [],
                                                })(
                                                    <Input maxLength={9} />
                                                )}
                                            </div>
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label={intl.get('wsd.i18n.doc.projectdoc.task')} {...formItemLayout}>
                                            {/* WBS/任务 */}
                                            <div className={style.list}>
                                                {getFieldDecorator('bizId', {
                                                    initialValue: this.state.taskData.name,

                                                })(
                                                    <Input addonAfter={<MyIcon type="icon-liuchengguanli-" onClick={this.click.bind(this)} />} disabled={true} />
                                                )}
                                            </div>
                                        </Form.Item>
                                    </Col>

                                    <Col span={12}>
                                        <Form.Item label={intl.get('wsd.i18n.plan.fileinfo.filename')} {...formItemLayout}>
                                            {/* 文件名称 */}
                                            <div className={style.list}>
                                                {getFieldDecorator('fileId', {
                                                    initialValue: this.state.fileName,
                                                    rules: [{
                                                        required: true,
                                                        message: intl.get('wsd.i18n.message.select') + intl.get('wsd.i18n.plan.fileinfo.filename')
                                                    }],
                                                })(
                                                    <Input disabled addonAfter={<UploadTpl isBatch={false} file={this.file} />} />
                                                )}
                                            </div>
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label={intl.get('wsd.i18n.doc.temp.versions')} {...formItemLayout}>
                                            {/* 版本 */}
                                            <div className={style.list}>
                                                {getFieldDecorator('version', {
                                                    initialValue: "1.0",
                                                    rules: [{
                                                        required: true,
                                                        message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.doc.temp.versions')
                                                    }],
                                                })(
                                                    <Input maxLength={5} />
                                                )}
                                            </div>
                                        </Form.Item>
                                    </Col>

                                </Row>
                            </div>
                        </Form>

                    </div>

                    {this.state.task && <UploadTask modalVisible={this.state.task} handleCancel={this.taskHandleCancel} projectId={this.props.projectId} taskData={this.taskData} />}
                </Modal>
            </div>
        )
    }

}


const UploadDocs = Form.create()(UploadDoc);
export default connect(state => ({
    currentLocale: state.localeProviderData
}))(UploadDocs);



