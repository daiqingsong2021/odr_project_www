import React, { Component } from 'react'
import { Row, Col, Form, Input, Select, DatePicker, Button } from 'antd'
import style from './style.less'
import { connect } from 'react-redux'
import RichText from '../../../components/RichText'
import MyIcon from '../../../components/public/TopTags/MyIcon'

import axios from '../../../api/axios'
import { getdictTree, userAll, messageWrite, messageDraftsAdd } from '../../../api/api'


export class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            claimdealtypeData: [],
            isNell: false,
            editorHtml: '',
            timeDisplay: 'none',
            claimDealTimeRequired: false,
        };
    }


    componentDidMount() {

    }

    //下拉框数据请求
    selectFocus = (name) => {
        let { claimdealtypeData } = this.state;
        if (claimdealtypeData.length) {
            return;
        }

        axios.get(getdictTree(name)).then(res => {
            if (name == 'sys.message.reply.type') {
                this.setState({
                    claimdealtypeData: res.data.data
                })
            }

        })

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
            isNell: true
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
                    claimDealTime: values['claimDealTime'] ? values['claimDealTime'].format('YYYY-MM-DD') : null,
                    content: this.state.editorHtml,
                    parentId: this.props.data.messageId,
                    optType: 1,
                    recvUser: this.props.data.sendUser ? [this.props.data.sendUser.id] : []
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
                    {/* 回复消息 */}
                    <h2> {intl.get('wsd.i18n.doc.message.replymessage')} </h2>
                </div>

                <Form onSubmit={this.handleSubmit} >
                    <div className={style.content}>
                        <Row type="flex">
                            <Col span={20}>
                                <Form.Item label={intl.get('wsd.i18n.doc.projectdoc.recipient')} {...formItemLayout}>
                                    {getFieldDecorator('recvUser', {
                                        initialValue: this.props.data.sendUser ? this.props.data.sendUser.name : '',
                                        rules: [],
                                    })(
                                        <Input disabled />,
                                    )}
                                </Form.Item>
                            </Col>

                        </Row>
                        <Row>
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

                        <RichText editorHtml={this.editorHtml} isNell={this.state.isNell} succeedDel={this.succeedDel} />

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
