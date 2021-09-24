import React, { Component } from 'react'
import style from './style.less'
import { Form, Row, Col, Input, Button, Icon, Select, DatePicker, Upload, message, Modal } from 'antd';
import moment from 'moment';
import { connect } from 'react-redux'
import UploadTpl from '../../../../../components/public/TopTags/uploadTpl'
import SubmitButton from "../../../../../components/public/TopTags/SubmitButton"
import axios from '../../../../../api/axios'
import { getdictTree, tmpdocAdd } from '../../../../../api/api'

const FormItem = Form.Item;
export class BasicdTemplatedDocAdd extends Component {
    constructor(props) {
        super(props)
        this.state = {
            initDone: false,
            info: {},
            docclassifyData: [],
            secutylevelData: [],
            professionData: [],
            biztypeData: [],
            fileName: '',
            fileId: null,
        }
    }

    componentDidMount() {
      let userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
      this.setState({
        author: userInfo.actuName
      })
    }



    handleSubmit = (val) => {
        const { intl } = this.props.currentLocale;
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                let data = {
                    ...values,
                    fileId: this.state.fileId
                }
                // 新增成功
                axios.post(tmpdocAdd, data, true, intl.get('wsd.global.btn.newsuccess')).then(res => {
                    this.props.addData(res.data.data)
                    if (val == 'goOn') {
                        this.props.form.resetFields();

                        this.setState({
                            fileId: null,
                            fileName: ''
                        })
                    } else {
                        this.setState({
                            fileId: null,
                            fileName: ''
                        })
                        this.props.handleCancel();
                    }
                })
            }
        });
    }
    //请求下拉列表
    onFocusSelect = (value) => {
        let { docclassifyData, secutylevelData, professionData, biztypeData } = this.state;
        if (docclassifyData.length && secutylevelData.length && professionData.length && biztypeData.length) {
            return;
        }
        {
            axios.get(getdictTree(value)).then(res => {
                if(res.data.data){
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
                    } else if (value == 'base.tmpldoc.biztype') {
                        this.setState({
                            biztypeData: res.data.data
                        })
                    }
                }
             
            })

        }
    }

    //上传回调
    file = (files) => {
        this.setState({
            fileId: files.response ? (files.response.data ? files.response.data.id : null) : null,
            fileName: files.response ? (files.response.data ? files.response.data.fileName : '') : ''
        })
        this.props.form.resetFields('fileId', [files.response ? (files.response.data ? files.response.data.fileName : '') : '']);
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
        return (
            <div >
                {/* 新增文档模板 */}
                <Modal className={style.main} width="850px" centered={true}
                    title={intl.get('wsd.i18n.sys.basicd.templated.newdocumenttemplate')} visible={this.props.modalVisible} onCancel={this.props.handleCancel}
                    mask={false}
                    maskClosable={false}
                    footer={<div className="modalbtn">
                        {/* 保存并继续 */}
                        <SubmitButton key={1} onClick={this.handleSubmit.bind(this, 'goOn')} content={intl.get('wsd.global.btn.saveandcontinue')} />
                        {/* 保存 */}
                        <SubmitButton key={2} onClick={this.handleSubmit.bind(this, 'save')} type="primary" content={intl.get('wsd.global.btn.preservation')} />
                    </div>}
                >


                    <Form onSubmit={this.handleSubmit}>
                        <div className={style.content}>
                            <Row type="flex">
                                <Col span={12}>
                                    <Form.Item label={intl.get('wsd.i18n.doc.temp.title')} {...formItemLayout}>
                                        {/* 文档标题 */}
                                        <div className={style.list}>
                                            {getFieldDecorator('docTitle', {
                                                // initialValue: formData.docTitle,
                                                rules: [{
                                                    required: true,
                                                    message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.doc.temp.title')
                                                },{
                                                    max:20,
                                                    message: "不能超过20个字符"
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
                                                // initialValue: formData.docNum,
                                                rules: [{
                                                    required: true,
                                                    message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.doc.compdoc.docserial')
                                                },{
                                                    max:20,
                                                    message: "不能超过20个字符"
                                                }],
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
                                                // initialValue: formData.category,
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
                                    <Form.Item label={intl.get('wsd.i18n.sys.user1.userlevel')} {...formItemLayout}>
                                        {/* 密级 */}
                                        <div className={style.list}>
                                            {getFieldDecorator('secutyLevel', {
                                                // initialValue: formData.classification,
                                                rules: [{
                                                    required: true,
                                                    message: intl.get('wsd.i18n.message.select') + intl.get('wsd.i18n.sys.user1.userlevel')
                                                }],
                                            })(
                                                <Select onFocus={this.onFocusSelect.bind(this, 'comm.secutylevel')}>
                                                    {
                                                        this.state.secutylevelData.length && this.state.secutylevelData.map(item => {
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
                                    <Form.Item label={intl.get('wsd.i18n.doc.temp.major')} {...formItemLayout}>
                                        {/* 文档专业 */}
                                        <div className={style.list}>
                                            {getFieldDecorator('profession', {
                                                // initialValue: formData.profession,
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
                                                initialValue: this.state.author,
                                                rules: [],
                                            })(
                                                <Input />
                                            )}
                                        </div>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label={intl.get('wsd.i18n.base.docTem.docobject')} {...formItemLayout}>
                                        {/* 所属业务对象 */}
                                        {getFieldDecorator('docObject', {
                                            // initialValue: this.state.info.docObject,
                                            rules: [],
                                        })(
                                            <Select onFocus={this.onFocusSelect.bind(this, 'base.tmpldoc.biztype')}>
                                                {
                                                    this.state.biztypeData.length && this.state.biztypeData.map(item => {
                                                        return (
                                                            <Select.Option key={item.value} value={item.value}>{item.title}</Select.Option>
                                                        )
                                                    })
                                                }
                                            </Select>
                                        )}
                                    </Form.Item>
                                </Col>

                                <Col span={12}>
                                    <Form.Item label={intl.get('wsd.i18n.plan.fileinfo.filename')} {...formItemLayout}>
                                        {/* 文件名称 */}
                                        <div className={style.list}>
                                            {getFieldDecorator('fileId', {
                                                initialValue: this.state.fileName,
                                                rules: [],
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
                                            {getFieldDecorator('docVersion', {
                                                initialValue: "1.0",
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

                            </Row>
                        </div>
                    </Form>
                </Modal>
            </div>
        )
    }
}
const BasicdTemplatedDocAdds = Form.create()(BasicdTemplatedDocAdd);
export default connect(state => ({
    currentLocale: state.localeProviderData
}))(BasicdTemplatedDocAdds)
