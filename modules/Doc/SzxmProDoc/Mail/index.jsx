import React, { Component } from 'react'
import { Modal, Button, Row, Col, Input, Icon, Select, Form, Checkbox, Table } from 'antd'
import style from './style.less'
import { connect } from 'react-redux'
import RichText from '../Distribute/RichText/index'
import axios from '../../../../api/axios'
import { userAll, docEmail } from '../../../../api/api'
import SubmitButton from "../../../../components/public/TopTags/SubmitButton"



class Mail extends Component {

    state = {

        inputValue: 0,

        RightData: [],
        userAllData: [],
        editorHtmlData: [],
    }

    componentDidMount() {
        this.setState({
            RightData: this.props.selectedRows
        })

    }

    handleCancel() {
        this.props.handleCancel('MailVisible')
    }


    //富文本回调
    editorHtml = (html) => {

        this.setState({ editorHtmlData: html })
    }

    //表格取消事件
    closeClick = (record) => {

        let { RightData } = this.state;
        let index = RightData.findIndex(item => item.id == record.id)
        RightData.splice(index, 1);
        this.setState({
            RightData,
        })

    }

    //下拉框数据请求
    selectFocus = (name) => {
        let { userAllData } = this.state;
        if (userAllData.length) {
            return;
        }
        if (name == 'recvUser') {
            axios.get(userAll).then(res => {

                this.setState({
                    userAllData: res.data.data
                })
            })
        }
    }


    handleSubmit = () => {
        this.props.form.validateFieldsAndScroll((err, fieldsValue) => {
            if (!err) {

                let { RightData } = this.state;
                let data = [];
                for (let i = 0; i < RightData.length; i++) {
                    data.push(RightData[i].folderId)
                }
                this.props.updateSelectedRows(RightData)
             
                const values = {
                    ...fieldsValue,
                    fileIds: data,
                    content: this.state.editorHtmlData
                }

             
                axios.post(docEmail, values, true, '邮件已发送').then(res=>{
                   
                })

                // // 清空表单项
                // this.props.form.resetFields()
                // // 关闭弹窗
                // this.handleCancel()
            }
        })
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

        const RightColumns = [{
            title: intl.get('wsd.i18n.doc.temp.title'),//文档标题
            dataIndex: 'docTitle',
            key: 'docTitle',
        }, {
            title: intl.get('wsd.i18n.doc.temp.versions'),//版本
            dataIndex: 'version',
            key: 'version',
        }, {
            title: '',
            dataIndex: 'close',
            key: 'close',
            render: (text, record) => <Icon type="close" onClick={this.closeClick.bind(this, record)} />
        }];

        return (
            <div>
                <Modal
                    className={style.main}
                    width="850px"
                    title={intl.get('wsd.i18n.doc.projectdoc.mail')}
                    centered={true}
                    visible={this.props.modalVisible}
                    onCancel={this.handleCancel.bind(this)}
                    mask={false} maskClosable={false}
                    footer={
                        <div className='modalbtn'>
                            <SubmitButton key="b" type="submit" onClick={this.handleCancel.bind(this)} content="关闭" />
                            <SubmitButton key="saveAndSubmit" type="primary" onClick={this.handleSubmit} content="发送" />
                        </div>
                    }
                >

                    <div className={style.content}>
                        <Form onSubmit={this.handleSubmit}>
                            <div className={style.content}>
                                <Row type="flex">
                                    <Col span={24}>
                                        <Form.Item label={intl.get('wsd.i18n.doc.projectdoc.recipient')} {...formItemLayout2}>
                                            {/* 接收人 */}
                                            <div className={style.list}>
                                                {getFieldDecorator('receiveUser', {
                                                    initialValue: formData.receiveUser,
                                                    rules: [],
                                                })(
                                                    <Select mode="multiple" style={{ width: '100%' }} onFocus={this.selectFocus.bind(this, 'recvUser')}
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
                                    <Col span={24}>
                                        <Form.Item label={intl.get('wsd.i18n.doc.projectdoc.copyto')} {...formItemLayout2}>
                                            {/* 抄送 */}
                                            <div className={style.list}>
                                                {getFieldDecorator('copyUser', {
                                                    initialValue: formData.docNum,
                                                    rules: [],
                                                })(
                                                    <Select mode="multiple" style={{ width: '100%' }} onFocus={this.selectFocus.bind(this, 'recvUser')}
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
                                    <Col span={24}>
                                        <Form.Item label={intl.get('wsd.i18n.doc.projectdoc.blindcarboncopy')} {...formItemLayout2}>
                                            {/* 密送 */}
                                            <div className={style.list}>
                                                {getFieldDecorator('secretUser', {
                                                    initialValue: formData.secretUser,
                                                    rules: [],
                                                })(
                                                    <Select mode="multiple" style={{ width: '100%' }} onFocus={this.selectFocus.bind(this, 'recvUser')}
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
                                    <Col span={24}>
                                        <Form.Item label={intl.get('wsd.i18n.doc.projectdoc.theme')} {...formItemLayout2}>
                                            {/* 主题 */}
                                            <div className={style.list}>
                                                {getFieldDecorator('theme', {
                                                    initialValue: formData.theme,
                                                    rules: [],
                                                })(
                                                    <Input />
                                                )}
                                            </div>
                                        </Form.Item>
                                    </Col>

                                    <Col span={24}>
                                        <Form.Item label={intl.get('wsd.i18n.doc.projectdoc.doc')} {...formItemLayout2}>
                                            {/* 文档 */}
                                            <div className={style.list}>

                                                <Table rowKey={record => record.id} columns={RightColumns} pagination={false}
                                                    dataSource={this.state.RightData} size='small' />

                                            </div>
                                        </Form.Item>
                                    </Col>


                                    <Col span={24}>
                                        <Form.Item label={intl.get('wsd.i18n.doc.projectdoc.information')} {...formItemLayout2}>
                                            {/* 消息 */}
                                            <div className={style.richText}>
                                                <RichText editorHtml={this.editorHtml} />
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


const Mails = Form.create()(Mail);
export default connect(state => ({
    currentLocale: state.localeProviderData
}))(Mails);



