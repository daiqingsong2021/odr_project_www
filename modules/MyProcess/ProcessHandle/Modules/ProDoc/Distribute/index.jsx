import React, { Component } from 'react'
import { Modal, Button, Row, Col, Input, Icon, Select, Form, Checkbox, Table, DatePicker } from 'antd'
import style from './style.less'
import { connect } from 'react-redux'
import RichText from './RichText/index'
import axios from '../../../../../../api/axios'
import { getdictTree, userAll, docOutgivings } from '../../../../../../api/api'



class Distribute extends Component {

    state = {
        initDone: false,
  
        inputValue: 0,

        RightData: [],

        userAllData: [],
        newstypeData: [],
        claimdealtypeData: [],
        editorHtmlData: '',
    }

    componentDidMount() {
        this.setState({
            RightData: this.props.selectedRows
        })

    }


    handleSubmit = (e) => {
        e.preventDefault()
        this.props.form.validateFieldsAndScroll((err, fieldsValue) => {
            if (!err) {

                let { RightData } = this.state;
                let data = [];
                for (let i = 0; i < RightData.length; i++) {
                    data.push(RightData[i].fileId)
                }
                this.props.updateSelectedRows(RightData)
                

                const values = {
                    ...fieldsValue,
                    claimDealTime: fieldsValue['claimDealTime'] ? fieldsValue['claimDealTime'].format('YYYY-MM-DD') : null,
                    fileIds: data,
                    content: this.state.editorHtmlData
                }


                axios.post(docOutgivings, values, true, '分发成功').then(res=>{
                    ;
                })

                // // 清空表单项
                // this.props.form.resetFields()
                // // 关闭弹窗
                // this.handleCancel()
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
        this.props.handleCancel('DistributeVisible')
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
        let { userAllData, newstypeData, claimdealtypeData } = this.state;
        if (userAllData.length && newstypeData.length && claimdealtypeData.length) {
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
                
                if (name == 'news.newstype') {
                    this.setState({
                        newstypeData: res.data.data
                    })
                } else if (name == 'news.claimdealtype') {
                    this.setState({
                        claimdealtypeData: res.data.data
                    })
                }

            })
        }
    }

    render() {
        const { intl } = this.props.currentLocale;
        let formData = {}

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
                    title={intl.get('wsd.i18n.doc.projectdoc.docdistribute')}
                    centered={true}
                    visible={this.props.modalVisible}
                    onCancel={this.handleCancel.bind(this)}
                    footer={
                        <div className='modalbtn'>
                            <Button key="b" type="submit" onClick={this.handleCancel.bind(this)} >关闭</Button>
                            <Button key="saveAndSubmit" type="primary" onClick={this.handleSubmit} >发送</Button>
                        </div>
                    }
                >

                    <div className={style.content}>
                        <Form onSubmit={this.handleSubmit} >
                            <div className={style.content}>
                                <Row type="flex">
                                    <Col span={24}>
                                        <Form.Item label={intl.get('wsd.i18n.doc.projectdoc.recipient')} {...formItemLayout2}>
                                            {/* 接收人 */}
                                            <div className={style.list}>
                                                {getFieldDecorator('recvUser', {
                                                    initialValue: formData.recvUser,
                                                    rules: [{
                                                        required: true,
                                                    }],
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
                                                {getFieldDecorator('title', {
                                                    initialValue: formData.title,
                                                    rules: [{
                                                        required: true,
                                                    }],
                                                })(
                                                    <Input />
                                                )}
                                            </div>
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item label={intl.get('wsd.i18n.doc.projectdoc.authorityofdistribution')} {...formItemLayout2}>
                                            {/* 分配权限 */}
                                            <div className={style.list}>
                                                {getFieldDecorator('outGivingAuth', {
                                                    initialValue: []

                                                })(
                                                    <Checkbox.Group style={{ width: "100%", marginTop: '10px' }}>
                                                        <Row>
                                                            <Col span={4}><Checkbox value="onlineLookup">{intl.get('wsd.i18n.doc.projectdoc.onlinepreview')}</Checkbox></Col>
                                                            <Col span={3}><Checkbox value="upgrad"> {intl.get('wsd.i18n.doc.projectdoc.updateversion')} </Checkbox></Col>
                                                            <Col span={3}><Checkbox value="cover"> {intl.get('wsd.i18n.doc.projectdoc.cover')} </Checkbox></Col>
                                                            <Col span={3}><Checkbox value="download"> {intl.get('wsd.i18n.doc.projectdoc.download')} </Checkbox></Col>
                                                            <Col span={3}><Checkbox value="outgiving"> {intl.get('wsd.i18n.doc.projectdoc.distribute')} </Checkbox></Col>
                                                            <Col span={3}><Checkbox value="mail"> {intl.get('wsd.i18n.doc.projectdoc.mail')} </Checkbox></Col>
                                                            <Col span={4}><Checkbox value="relevance"> {intl.get('wsd.i18n.doc.projectdoc.associateddocument')} </Checkbox></Col>
                                                        </Row>
                                                    </Checkbox.Group>
                                                )}
                                            </div>
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label={intl.get('wsd.i18n.doc.projectdoc.needreply')} {...formItemLayout}>
                                            {/* 需要回复 */}
                                            <div className={style.list}>
                                                {getFieldDecorator('claimDealType', {
                                                    initialValue: formData.claimDealType,
                                                    rules: [],
                                                })(
                                                    <Select onFocus={this.selectFocus.bind(this, 'news.claimdealtype')}>
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
                                    <Col span={12}>
                                        <Form.Item label={intl.get('wsd.i18n.doc.projectdoc.time')} {...formItemLayout}>
                                            {/* 时间 */}
                                            <div className={style.list}>
                                                {getFieldDecorator('claimDealTime', {
                                                    initialValue: formData.claimDealTime,
                                                    rules: [],
                                                })(
                                                    <DatePicker style={{ width: '100%' }} />
                                                )}
                                            </div>
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label={intl.get('wsd.i18n.plan.projectquestion.questiontype')} {...formItemLayout}>
                                            {/* 类型 */}
                                            <div className={style.list}>
                                                {getFieldDecorator('newsType', {
                                                    initialValue: formData.newsType,
                                                    rules: [],
                                                })(
                                                    <Select onFocus={this.selectFocus.bind(this, 'news.newstype')}>
                                                        {this.state.newstypeData.length && this.state.newstypeData.map(item => {
                                                            return (
                                                                <Select.Option key={item.value} value={item.value}>{item.title}</Select.Option>
                                                            )
                                                        })}
                                                    </Select>
                                                )}
                                            </div>
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item label={intl.get('wsd.i18n.doc.projectdoc.doc')} {...formItemLayout2}>
                                            {/* 文档 */}
                                            <div className={style.list}>

                                                <Table rowKey={record => record.id} columns={RightColumns} pagination={false}
                                                    dataSource={this.state.RightData} />

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


const Distributes = Form.create()(Distribute);
export default connect(state => ({
    currentLocale: state.localeProviderData
}))(Distributes);



