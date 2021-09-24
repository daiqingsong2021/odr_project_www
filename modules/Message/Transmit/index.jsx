import React, { Component } from 'react'
import { Row, Col, Form, Input, Select, DatePicker, Button } from 'antd'
import style from './style.less'
import { connect } from 'react-redux'
import RichText from '../../../components/RichText'
import MyIcon from '../../../components/public/TopTags/MyIcon'

import axios from '../../../api/axios'
import { messageView, userAll, messageWrite, messageDraftsAdd } from '../../../api/api'


export class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userAllData: [],
            isNell: false,
            editorHtml: '',
            info: {},

        };
    }

    getData = () => {
        axios.get(messageView(this.props.data.messageId)).then(res => {
            this.setState({
                info: res.data.data,
                editorHtml: res.data.data.content ? res.data.data.content : ''
            })
        })
    }

    componentDidMount() {
        this.getData();
        // this.setState({
        //     info: this.props.data,
        //     editorHtml: this.props.data.content
        // })
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
            editorHtml: '',
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

                let data = {
                    ...values,
                    content: this.state.editorHtml,
                    parentId: this.state.info.id,
                    optType: 2
                }

                if (val == 'send') {

                    axios.post(messageWrite, data, true, '发送成功').then(res => {
                        this.deleteData();
                    })
                } else if (val == 'drafts') {
                    axios.post(messageDraftsAdd, data, true, '发送成功').then(res => {
                        this.deleteData();
                    })
                }

            }
        });

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


        return (
            <div className={style.main} >
                <div className={style.head}>
                    {/* 转发消息 */}
                    <h2> {intl.get('wsd.i18n.doc.message.forwardmessage')} </h2>
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
                                            rules: [],
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
                                        initialValue: this.state.info.title ? this.state.info.title : '',
                                        rules: [],
                                    })(
                                        <Input disabled />,
                                    )}
                                </Form.Item>
                            </Col>

                        </Row>


                    </div>
                </Form>
                <Row>
                    <Col span={2}></Col>
                    <Col span={18} className={style.editor}>

                        <RichText editorHtml={this.editorHtml} isNell={this.state.isNell} succeedDel={this.succeedDel} editorTxtHtml={this.state.editorHtml} />

                    </Col>
                </Row>

                <div className={style.button}>
                    <div>
                        {/* 发送 */}
                        <Button onClick={this.handleSubmit.bind(this, 'send')} > <MyIcon type='icon-fabu' /> {intl.get('wsd.i18n.doc.message.send')}</Button>
                        {/* 删除消息 */}
                        <Button onClick={this.deleteData}> <MyIcon type='icon-delete' /> {intl.get('wsd.i18n.doc.message.delnews')}</Button>
                        {/* 草稿箱 */}
                        <Button onClick={this.handleSubmit.bind(this, 'drafts')}> <MyIcon type='icon-caogaoxiang' /> {intl.get('wsd.i18n.doc.message.drafts')}</Button>

                    </div>

                </div>
            </div>
        )
    }
}


const Indexs = Form.create()(Index);
export default connect(state => ({
    currentLocale: state.localeProviderData
}))(Indexs)
