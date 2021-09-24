import React, { Component } from 'react'
import { Modal, Button, Row, Col, Input, Icon, Select, Form, TreeSelect } from 'antd'
import style from './style.less'
import { connect } from 'react-redux'
import { curdCurrentData } from '../../../../store/curdData/action'
import UploadTask from '../UploadTask/index'
import UploadTpl from '../../../../components/public/TopTags/uploadTpl'
import axios from '../../../../api/axios'
import { getdictTree, docOrgSel, docProjectAdd, docProjectSel, docProjectInfo, docProjectUpdate } from '../../../../api/api'

class UploadDoc extends Component {

    state = {
        inputValue: 0,
        task: false,
        taskData: {},
        fileId: null,
        fileName: '',
        orgSelData: [],
        docclassifyData: [],
        secutylevelData: [],
        professionData: [],
        folderSelData: [],
        data: {},
    }

    getData = () => {
        axios.get(docProjectInfo(this.props.record.docId)).then(res => {
            this.setState({
                data: res.data.data,
                fileName: res.data.data.fileName ? res.data.data.fileName : '',
                fileId: res.data.data.fileId ? res.data.data.fileId : null
            })
        })
    }

    componentDidMount() {
        if (this.props.type === 'modify') {
            this.getData();
        }

        //文件夹
        if (this.state.folderSelData.length == 0 && this.props.projectId) {
            axios.get(docProjectSel(this.props.projectId), {}, null, null, false).then(res => {
                this.setState({
                    folderSelData: res.data.data
                })
            })
        }

        //所属部门
        if (this.state.orgSelData.length == 0 && this.props.projectId) {
            axios.get(docOrgSel(this.props.projectId), {}, null, null, false).then(res => {
                this.setState({
                    orgSelData: res.data.data
                })
            })
        }


    }


    handleSubmit = (val, e) => {
        e.preventDefault()
        this.props.form.validateFieldsAndScroll((err, fieldsValue) => {
            if (!err) {

                if (this.props.type == 'upload') {
                    let values = {
                        ...fieldsValue,
                        fileId: this.state.fileId,
                        projectId: this.props.projectId ? this.props.projectId : null,
                        bizId: this.props.data.id,
                        bizType: this.props.bizType
                    }


                    axios.post(docProjectAdd, values, true, '上传成功').then(res => {
                        this.props.update();
                        // this.props.folderUpdate(res.data.data)
                        if (val == 'save') {
                            // 清空表单项
                            this.props.form.resetFields()
                            this.setState({
                                fileId: null,
                                fileName: '',
                            })
                            // 关闭弹窗
                            this.props.handleCancel('UploadVisible');
                        } else if (val == 'goOn') {

                            // 清空表单项
                            this.props.form.resetFields()
                            this.setState({
                                fileId: null,
                                fileName: '',
                            })

                        }

                    })
                } else {
                    const values = {
                        ...fieldsValue,
                        fileId: this.state.fileId,
                        projectId: this.props.projectId ? this.props.projectId : null,
                        bizId: this.props.data.id,
                        bizType: this.props.bizType,
                        id: this.props.record.docId,
                        folderId: this.state.data.folderId
                    }


                    axios.put(docProjectUpdate, values, true, '修改成功').then(res => {
                        this.props.update();
                        // this.props.folderUpdate(res.data.data)
                        if (val == 'save') {
                            // 清空表单项
                            this.props.form.resetFields()
                            this.setState({
                                fileId: null,
                                fileName: '',
                            })
                            // 关闭弹窗
                            this.props.handleCancel('UploadVisible');
                        } else {

                            // 清空表单项
                            this.props.form.resetFields()
                            this.setState({
                                fileId: null,
                                fileName: '',
                            })

                        }

                    })
                }




            }
        })
    }


    taskHandleCancel = () => {
        this.setState({
            task: false
        })
    }
    click() {
        this.setState({ task: true })
    }
    handleCancel() {
        this.props.handleCancel()
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
        let { docclassifyData, secutylevelData, professionData } = this.state;
        if (docclassifyData.length && secutylevelData.length && professionData.length) {
            return;
        }

        axios.get(getdictTree(value)).then(res => {
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

    render() {

        const { intl } = this.props.currentLocale;
        let formData = this.state.data;

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
                    title={this.props.ModalTitle}
                    centered={true}
                    visible={true}
                    onCancel={this.handleCancel.bind(this)}
                    mask={false} maskClosable={false}
                    footer={
                        <div className='modalbtn'>
                            {
                                this.props.type == 'modify' ?
                                    <Button key="saveAndSubmit" onClick={this.handleCancel}  >{ intl.get('wsd.global.btn.close') }</Button> //关闭
                                    :
                                    <Button key="saveAndSubmit" onClick={this.handleSubmit.bind(this, 'goOn')}> {intl.get('wsd.global.btn.saveandcontinue')} </Button>  //保存并继续
                            }
                            {/* 保存 */}
                            <Button key="b" type="submit" onClick={this.handleSubmit.bind(this, 'save')} type="primary"> {intl.get('wsd.global.btn.preservation')} </Button>

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
                                                    <Input />
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
                                                    <Input />
                                                )}
                                            </div>
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label={intl.get('wsd.i18n.doc.compdoc.docclassify')} {...formItemLayout}>
                                            {/* 文档类别 */}
                                            <div className={style.list}>
                                                {getFieldDecorator('docClassify', {
                                                    initialValue: formData.docClassify ? formData.docClassify.id : null,
                                                    rules: [],
                                                })(
                                                    <Select onFocus={this.onFocusSelect.bind(this, 'doc.docclassify')}>
                                                        {
                                                            this.state.docclassifyData.length ? this.state.docclassifyData.map(item => {
                                                                return (
                                                                    <Select.Option key={item.value} value={item.value}>{item.title}</Select.Option>
                                                                )
                                                            }) : (
                                                                    formData.docClassify ? (
                                                                        <Select.Option key={formData.docClassify.id} value={formData.docClassify.id}>{formData.docClassify.name}</Select.Option>
                                                                    ) :
                                                                        null
                                                                )
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
                                                    initialValue: formData.org ? formData.org.id : null,
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
                                                    initialValue:  formData.secutyLevel ? formData.secutyLevel.id : 1,
                                                    rules: [{
                                                        required: true,
                                                        message: intl.get('wsd.i18n.message.select') + intl.get('wsd.i18n.sys.user1.userlevel')
                                                    }],
                                                })(
                                                    <Select onFocus={this.onFocusSelect.bind(this, 'comm.secutylevel')}>
                                                        {
                                                            this.state.secutylevelData.length ? this.state.secutylevelData.map(item => {
                                                                return (
                                                                    <Select.Option key={item.value} value={item.value}>{item.title}</Select.Option>
                                                                )
                                                            }) : (
                                                                    formData.secutyLevel ? (
                                                                        <Select.Option key={formData.secutyLevel.id} value={formData.secutyLevel.id}>{formData.secutyLevel.name}</Select.Option>
                                                                    ) : <Select.Option key={1} value={1}>非密</Select.Option>
                                                                )
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
                                                    initialValue: formData.profession ? formData.profession.id : null,
                                                    rules: [],
                                                })(
                                                    <Select onFocus={this.onFocusSelect.bind(this, 'doc.profession')}>
                                                        {
                                                            this.state.professionData.length ? this.state.professionData.map(item => {
                                                                return (
                                                                    <Select.Option key={item.value} value={item.value}>{item.title}</Select.Option>
                                                                )
                                                            }) : (
                                                                    formData.profession ? (
                                                                        <Select.Option key={formData.profession.id} value={formData.profession.id}>{formData.profession.name}</Select.Option>
                                                                    ) : null
                                                                )
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
                                                    initialValue: formData.author,
                                                    rules: [],
                                                })(
                                                    <Input />
                                                )}
                                            </div>
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label={intl.get('wsd.i18n.doc.temp.versions')} {...formItemLayout}>
                                            {/* 版本 */}
                                            <div className={style.list}>
                                                {getFieldDecorator('version', {
                                                    initialValue:  formData.version? formData.version:"1.0",
                                                    rules: [{
                                                        required: true,
                                                        message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.doc.temp.versions')
                                                    }],
                                                })(
                                                    <Input />
                                                )}
                                            </div>
                                        </Form.Item>
                                    </Col>
                                    {
                                        this.props.type == 'upload' ?
                                            <Col span={12} className={style.upload}>
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
                                            </Col> :
                                            <Col span={12} className={style.upload}>
                                                <Form.Item label={intl.get('wsd.i18n.plan.fileinfo.filename')} {...formItemLayout}>
                                                    {/* 文件名称 */}
                                                    <div className={style.list}>
                                                        {getFieldDecorator('fileId', {
                                                            initialValue: this.state.fileName,
                                                            rules: [{
                                                                required: true,
                                                            }],
                                                        })(
                                                            <Input disabled />
                                                        )}
                                                    </div>
                                                </Form.Item>
                                            </Col>
                                    }

                                    {this.props.type === 'upload' ?
                                        <Col span={12}>
                                            <Form.Item label={intl.get('wsd.i18n.doc.temp.folder')} {...formItemLayout}>
                                                {/* 文件夹 */}
                                                <div className={style.list}>
                                                    {getFieldDecorator('folderId', {
                                                        // initialValue: formData.folder ? formData.folder.id : null,
                                                        rules: [],
                                                    })(
                                                        <TreeSelect
                                                            onFocus={this.onFocusSelect.bind(this, 'org')}
                                                            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                                            treeData={this.state.folderSelData}
                                                            treeDefaultExpandAll
                                                        />

                                                    )}
                                                </div>
                                            </Form.Item>
                                        </Col>
                                        :
                                        <Col span={12}>
                                            <Form.Item label={intl.get('wsd.i18n.doc.temp.folder')} {...formItemLayout}>
                                                {/* 文件夹 */}
                                                <div className={style.list}>
                                                    {getFieldDecorator('folderId', {
                                                        initialValue: formData.folderName ? formData.folderName : '',
                                                        rules: [],
                                                    })(
                                                        <Input disabled />

                                                    )}
                                                </div>
                                            </Form.Item>
                                        </Col>
                                    }

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



