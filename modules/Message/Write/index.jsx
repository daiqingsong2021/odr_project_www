import React, { Component } from 'react'
import { Row, Col, Form, Input, Select, DatePicker, Button, Upload, notification, Icon } from 'antd'
import style from './style.less'
import { connect } from 'react-redux'
import RichText from '../../../components/RichText'
import MyIcon from '../../../components/public/TopTags/MyIcon'
import { baseURL } from '../../../api/config'

import axios from '../../../api/axios'
import { getdictTree, userAll, messageWrite, messageDraftsAdd, messageView, messageFileList } from '../../../api/api'



export class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userAllData: [],
            claimdealtypeData: [],
            isNell: false,
            timeDisplay: 'none',
            editorHtml: '',
            claimDealTimeRequired: false,
            fileList: [],
            info: {},
            editorTxtHtml: null,

        };
    }



    componentDidMount() {


    }

    //下拉框数据请求
    selectFocus = (name) => {
        let { userAllData, claimdealtypeData } = this.state;
        if (userAllData.length && claimdealtypeData.length) {
            return;
        }
        if (name == 'recvUser') {
            axios.get(userAll).then(res => {
                this.setState({
                    userAllData: res.data.data
                })
            })
        } else {
            axios.get(getdictTree(name)).then(res => {
                if (name == 'sys.message.reply.type') {
                    this.setState({
                        claimdealtypeData: res.data.data
                    })
                }

            })
        }
    }

    //富文本回调
    editorHtml = (html) => {
        this.setState({
            editorHtml: html
        })
    }
    //删除消息
    deleteData = () => {
        this.props.form.resetFields();
        this.setState({
            isNell: true,
            timeDisplay: 'none',
        })
    }
    //富文本清空成功回调
    succeedDel = () => {
        this.setState({
            isNell: false
        })
    }
    //发送
    handleSubmit = (val, e) => {
        e.preventDefault();

        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {

                let fileIds = [];
                let { fileList } = this.state;
                if (fileList.length) {
                    for (let i = 0; i < fileList.length; i++) {
                        fileIds.push(fileList[i].response.data.id)
                    }
                }

                let data = {
                    ...values,
                    claimDealTime: values['claimDealTime'] ? values['claimDealTime'].format('YYYY-MM-DD') : null,
                    content: this.state.editorHtml,
                    fileIds,
                    optType: 0,
                    parentId: 0
                }

                if (val == 'send') {

                    axios.post(messageWrite, data, true, '发送成功').then(res => {
                        this.deleteData();
                        this.setState({
                            fileList: []
                        })
                    })
                } else if (val == 'drafts') {
                    axios.post(messageDraftsAdd, data, true, '发送成功').then(res => {
                        this.deleteData();
                        this.setState({
                            fileList: []
                        })
                    })
                }

            }
        });

    }
    //需要回复onChange
    claimDealTypeChange = (value) => {
        if (value) {
            this.setState({
                timeDisplay: 'block',
                claimDealTimeRequired: true,
            })
        } else {
            this.setState({
                timeDisplay: 'none',
                claimDealTimeRequired: false,
            })
        }

    }

    handleChange = (fileList) => {
        this.setState({ fileList })
    }

    render() {

        const { intl } = this.props.currentLocale;

        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 3 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 20 },
            },
        };
        const formItemLayout2 = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 18 },
            },
        };
        const _this = this;
        const props = {
            name: 'file',
            action: baseURL + '/api/doc/file/upload',
            headers: {
                Authorization: sessionStorage.getItem('token')
            },
            onChange(info) {

                _this.handleChange(info.fileList)

                // if (info.file.status !== 'uploading') {
                //     // _this.props.file(info.file)
                //     _this.setState({
                //         fileList: info.fileList
                //     })
                // }

                if (info.file.status === 'done') {
                    notification.warning(
                        {
                            placement: 'bottomRight',
                            bottom: 50,
                            duration: 2,
                            message: info.file.name,
                            description: intl.get('wsd.i18n.doc.compdoc.successupload')
                        }
                    )
                } else if (info.file.status === 'error') {
                    notification.warning(
                        {
                            placement: 'bottomRight',
                            bottom: 50,
                            duration: 2,
                            message: info.file.name,
                            description: intl.get('wsd.i18n.doc.compdoc.errorupload')
                        }
                    )
                }

            },
            multiple: true,
        };


        return (
            <div className={style.main} >
                <div className={style.head}>
                    {/* 修改消息 */}
                    <h2> {intl.get('wsd.i18n.doc.message.modifymessage')} </h2>
                </div>

                <Form onSubmit={this.handleSubmit} >
                    <div className={style.content}>
                        <Row type="flex">
                            <Col span={20}>
                                <Form.Item label={intl.get('wsd.i18n.doc.projectdoc.recipient')} {...formItemLayout}>
                                    {/* 接收人 */}
                                    <div className={style.list}>
                                        {getFieldDecorator('recvUser', {
                                            // initialValue: formData.recvUser,
                                            rules: [{
                                                required: true,
                                                message: intl.get('wsd.i18n.message.select') + intl.get('wsd.i18n.doc.projectdoc.recipient')
                                            }],
                                        })(
                                            <Select mode="multiple" style={{ width: '100%' }} onFocus={this.selectFocus.bind(this, 'recvUser')}
                                                optionFilterProp="children"
                                            >
                                                {this.state.userAllData.length && this.state.userAllData.map(item => {
                                                    return (
                                                        <Select.Option key={item.id} value={item.id}>{item.actuName}</Select.Option>
                                                    )
                                                })}

                                            </Select>
                                        )}
                                    </div>
                                </Form.Item>
                            </Col>
                            <Col span={20}>
                                <Form.Item label={intl.get('wsd.i18n.base.tmpldelv.delvtitle')} {...formItemLayout}>
                                    {getFieldDecorator('title', {
                                        // initialValue: this.state.info.sort,
                                        rules: [],
                                    })(
                                        <Input />,
                                    )}
                                </Form.Item>
                            </Col>

                        </Row>
                        <Row>
                            <Col span={10}>
                                <Form.Item label={intl.get('wsd.i18n.doc.projectdoc.needreply')} {...formItemLayout2}>
                                    {/* 需要回复 */}
                                    <div className={style.list}>
                                        {getFieldDecorator('claimDealType', {
                                            // initialValue: formData.claimDealType,
                                            rules: [],
                                        })(
                                            <Select onFocus={this.selectFocus.bind(this, 'sys.message.reply.type')} onChange={this.claimDealTypeChange} allowClear={true}>
                                                {this.state.claimdealtypeData.length && this.state.claimdealtypeData.map(item => {
                                                    return (
                                                        <Select.Option key={item.value} value={item.value}>{item.title}</Select.Option>
                                                    )
                                                })}
                                            </Select>
                                        )}
                                    </div>
                                </Form.Item>
                            </Col>

                            <Col span={10} className={style.time}>
                                <Form.Item  {...formItemLayout} style={{ display: this.state.timeDisplay }} >
                                    {/* 时间 */}
                                    <div className={style.list}>
                                        {getFieldDecorator('claimDealTime', {
                                            // initialValue: formData.claimDealTime,
                                            rules: [{
                                                required: this.state.claimDealTimeRequired,
                                                message: intl.get('wsd.i18n.message.select') + intl.get('wsd.i18n.doc.projectdoc.time')
                                            }],
                                        })(
                                            <DatePicker style={{ width: '100%' }} />
                                        )}
                                    </div>
                                </Form.Item>
                            </Col>
                        </Row>

                    </div>
                </Form>
                <Row>
                    <Col span={2}></Col>
                    <Col span={18} className={style.editor}>

                        <RichText editorHtml={this.editorHtml} isNell={this.state.isNell} succeedDel={this.succeedDel} editorTxtHtml={this.state.editorTxtHtml} />

                    </Col>
                </Row>

                <Row>
                    <Col span={2}></Col>
                    <Col span={18} >

                        <div className={style.button}>
                            <div className={style.upload}>
                                <Upload {...props} fileList={this.state.fileList} >
                                    <Button>
                                        <Icon type="upload" /> {intl.get('wsd.i18n.doc.message.attachmentuploading')}
                                    </Button>
                                </Upload>
                            </div>
                            <div className={style.buttons}>
                                {/* 发送 */}
                                <Button onClick={this.handleSubmit.bind(this, 'send')} > <MyIcon type='icon-fabu' /> {intl.get('wsd.i18n.doc.message.send')}</Button>
                                {/* 删除消息 */}
                                <Button onClick={this.deleteData}> <MyIcon type='icon-delete' /> {intl.get('wsd.i18n.doc.message.delnews')}</Button>
                                {/* 草稿箱 */}
                                <Button onClick={this.handleSubmit.bind(this, 'drafts')}> <MyIcon type='icon-caogaoxiang' /> {intl.get('wsd.i18n.doc.message.drafts')}</Button>

                            </div>

                        </div>

                    </Col>
                </Row>


            </div>
        )
    }
}


const Indexs = Form.create()(Index);
export default connect(state => ({
    currentLocale: state.localeProviderData
}))(Indexs)
