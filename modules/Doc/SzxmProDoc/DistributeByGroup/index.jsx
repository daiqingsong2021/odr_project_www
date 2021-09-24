import React, { Component } from 'react'
import { Modal, Button, Row, Col, Input, Icon, Select, Form, Checkbox, Table, DatePicker } from 'antd'
import style from './style.less'
import { connect } from 'react-redux'
import RichText from './RichText/index'
import axios from '../../../../api/axios'
import { getdictTree, docOutgivingsByGroup, docGivingList, queryDocUserGroup } from '../../../../api/api';
import * as dataUtil from "../../../../utils/dataUtil"
import SubmitButton from "../../../../components/public/TopTags/SubmitButton"
import PageTable from "../../../../components/PublicTable"
class Distribute extends Component {

    state = {
        initDone: false,

        inputValue: 0,

        RightData: [],

        groupData: [],
        newstypeData: [],
        claimdealtypeData: [],
        editorHtmlData: '',
        step: 1,
        selectedRows: [],
        selectedRowKeys:[]
    }


    nextStep = () => {
        let { selectedRows } = this.state;
        if (selectedRows.length == 0) {
            dataUtil.message("请勾选数据进行操作")
            return
        } else {
            this.setState({
                step: 2
            })
        }
    }
    handleSubmit = () => {

        this.props.form.validateFieldsAndScroll((err, fieldsValue) => {
            if (!err) {
                let { selectedRows } = this.state;
                if (selectedRows.length == 0) {
                    dataUtil.message("请选择分发的文档")
                    return
                }
                let data = [];
                for (let i = 0; i < selectedRows.length; i++) {
                    data.push(selectedRows[i].fileId)
                }
                const values = {
                    ...fieldsValue,
                    claimDealTime: fieldsValue['claimDealTime'] ? fieldsValue['claimDealTime'].format('YYYY-MM-DD') : null,
                    fileIds: data,
                    content: this.state.editorHtmlData,
                }


                const { startContent } = this.props
                let url = dataUtil.spliceUrlParams(docOutgivingsByGroup, { startContent });
                axios.post(url, values, true, '分发成功', true).then(res => {
                   
                    // 清空表单项
                    this.props.form.resetFields()
                    // 关闭弹窗
                    this.handleCancel()
                })


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

    
    /**
       @method 父组件即可调用子组件方法
       @description 父组件即可调用子组件方法
       */
    onRefR = (ref) => {
        this.rightTable = ref
    }
    /**
     * 获取复选框 选中项、选中行数据
     * @method
     * @param {string} selectedRowKeys 复选框选中项
     * @param {string} selectedRows  行数据
     */
    getSelectedRowKeys = (selectedRowKeys, selectedRows) => {
        this.setState({
            selectedRows,
            selectedRowKeys
        })
    }
    //右侧表格点击行事件
    getInfo = (record) => {
        this.setState({
            rightData: record

        })
    }
    //下拉框数据请求
    selectFocus = (name) => {
        let { groupData, newstypeData, claimdealtypeData } = this.state;
        if (groupData.length && newstypeData.length && claimdealtypeData.length) {
            return;
        }
        if (name == 'groupName') {
            axios.get(queryDocUserGroup).then(res => {
                this.setState({
                    groupData: res.data.data
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
        const columns = [{
            title: intl.get('wsd.i18n.doc.temp.title'),//文档标题
            dataIndex: 'docTitle',
            key: 'docTitle',
            width: '15%',
            render: (text, record) => <span title={text}>{text}</span>
        }, {
            title: intl.get('wsd.i18n.doc.compdoc.docserial'),//文档编号
            dataIndex: 'docNum',
            key: 'docNum',
            width: '15%',
        },
        //   {
        //     title: intl.get('wsd.i18n.doc.compdoc.docclassify'),//文档类别
        //     dataIndex: 'docClassify',
        //     key: 'docClassify',
        //     width: '10%',
        //     render: text => text ? text.name : ''
        // },
          {
            title: intl.get('wsd.i18n.doc.temp.author'),//作者
            dataIndex: 'author',
            key: 'author',
            width: '12%',
        }, {
            title: intl.get('wsd.i18n.doc.temp.versions'),//版本
            dataIndex: 'version',
            key: 'version',
            width: '10%',
        }, {
            title: intl.get('wsd.i18n.plan.feedback.creattime'),//创建时间
            dataIndex: 'creatTime',
            key: 'creatTime',
            width: '15%',
            render: (text) => dataUtil.Dates().formatDateString(text)
        }, {
            title: intl.get('wsd.i18n.doc.compdoc.babelte'),//上传人
            dataIndex: 'creator',
            key: 'creator',
            width: '12%',
            render: text => text ? text.name : ''
        }, {
            title: intl.get('wsd.i18n.doc.compdoc.docstate'),//文档状态
            dataIndex: 'status',
            key: 'status',
            render: text => text ? text.name : ''
        }];
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
                    width={950}
                    title={intl.get('wsd.i18n.doc.projectdoc.docdistribute')}
                    centered={true}
                    visible={this.props.modalVisible}
                    onCancel={this.handleCancel.bind(this)}
                    mask={false} maskClosable={false}
                    footer={
                        <div className='modalbtn'>
                            {this.state.step == 1 ?
                                <SubmitButton key="b" type="primary" onClick={this.nextStep} content="下一步" />
                                : <>
                                    <SubmitButton key="b" onClick={()=>this.setState({ step: 1 })} content="上一步" />
                                    <SubmitButton key="saveAndSubmit" type="primary" onClick={this.handleSubmit} content="发送" />
                                </>
                            }

                        </div>
                    }
                >

                    <div style={{ minHeight:300 }} style={{display:this.state.step==1? null:"none"}}>
                        <PageTable onRef={this.onRefR}
                            rowSelection={true}
                            pagination={false}
                            useCheckBox={true}
                            onChangeCheckBox={this.getSelectedRowKeys}
                            getData={this.props.getDocGivingList}
                            columns={columns}
                            getRowData={this.getInfo}
                            scroll={{ y: 400 ,x:"100%"}}
                        />
                    </div>

                    <div className={style.content}  style={{display:this.state.step==2? null:"none"}}>
                        <Form onSubmit={this.handleSubmit} >
                            <div className={style.content}>
                                <Row type="flex">
                                    <Col span={24}>
                                        <Form.Item label={'分发组'} {...formItemLayout2}>
                                            {/* 分发组 */}
                                            <div className={style.list} id='groupName'>
                                                {getFieldDecorator('groupIds', {
                                                    initialValue: formData.groupName,
                                                    rules: [{
                                                        required: true,
                                                        message: intl.get('wsd.i18n.message.enter') + '分发组'
                                                    }],
                                                })(
                                                    <Select mode="multiple" getPopupContainer={() => document.getElementById('groupIds')} style={{ width: '100%' }} onFocus={this.selectFocus.bind(this, 'groupName')}
                                                        optionFilterProp="children"
                                                    >
                                                        {this.state.groupData.length && this.state.groupData.map(item => {
                                                            return (
                                                                <Select.Option key={item.id} value={item.id}>{item.groupName}</Select.Option>
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
                                            <div className={style.list} id='theme'>
                                                {getFieldDecorator('title', {
                                                    initialValue: formData.title,
                                                    rules: [{
                                                        required: true,
                                                        message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.doc.projectdoc.theme')
                                                    }],
                                                })(
                                                    <Input />
                                                )}
                                            </div>
                                        </Form.Item>
                                    </Col>

                                    <Col span={12}>
                                        <Form.Item label={intl.get('wsd.i18n.doc.projectdoc.needreply')} {...formItemLayout}>
                                            {/* 需要回复 */}
                                            <div className={style.list} id='needreply'>
                                                {getFieldDecorator('claimDealType', {
                                                    initialValue: formData.claimDealType,
                                                    rules: [],
                                                })(
                                                    <Select getPopupContainer={() => document.getElementById('needreply')} onFocus={this.selectFocus.bind(this, 'news.claimdealtype')}
                                                            dropdownStyle={{zIndex:10020}}>
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
                                            <div className={style.list} id='time'>
                                                {getFieldDecorator('claimDealTime', {
                                                    initialValue: formData.claimDealTime,
                                                    rules: [],
                                                })(
                                                    <DatePicker getPopupContainer={() => document.getElementById('time')} style={{ width: '100%' }} />
                                                )}
                                            </div>
                                        </Form.Item>
                                    </Col>
                                    {/*<Col span={12}>*/}
                                    {/*    <Form.Item label={intl.get('wsd.i18n.plan.projectquestion.questiontype')} {...formItemLayout}>*/}
                                    {/*        /!* 类型 *!/*/}
                                    {/*        <div className={style.list} id='questiontype'>*/}
                                    {/*            {getFieldDecorator('newsType', {*/}
                                    {/*                initialValue: formData.newsType,*/}
                                    {/*                rules: [],*/}
                                    {/*            })(*/}
                                    {/*                <Select getPopupContainer={() => document.getElementById('questiontype')} onFocus={this.selectFocus.bind(this, 'news.newstype')}>*/}
                                    {/*                    {this.state.newstypeData.length && this.state.newstypeData.map(item => {*/}
                                    {/*                        return (*/}
                                    {/*                            <Select.Option key={item.value} value={item.value}>{item.title}</Select.Option>*/}
                                    {/*                        )*/}
                                    {/*                    })}*/}
                                    {/*                </Select>*/}
                                    {/*            )}*/}
                                    {/*        </div>*/}
                                    {/*    </Form.Item>*/}
                                    {/*</Col>*/}


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



