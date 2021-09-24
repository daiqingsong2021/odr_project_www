import React, { Component } from 'react'

import style from './style.less'
import SubmitButton from "../../../../../../components/public/TopTags/SubmitButton"
import { Form, Row, Col, Input, Modal, Button, Icon, Select } from 'antd';
import moment from 'moment'
import { connect } from 'react-redux'
import axios from "../../../../../../api/axios"
import { getdictTree, addTmpldelvPbs, addTmpldelvDelv, updateTmpldelvPbs, updateTmpldelvDelv, getTmpldelvPbs, getTmpldelvDelv } from "../../../../../../api/api"
const FormItem = Form.Item;
const TextArea = Input.TextArea;
const Option = Select.Option;
class EditDevModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            info:{}
        }
    }
    handleSubmit = (flag) => {
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                let obj = {
                    ...values,
                    typeId: this.props.typeId
                }
                if (this.props.type.indexOf("add") > -1) {
                    if (this.props.type == "addPbsSame" || this.props.type == "addPbsNext") {
                        if (this.props.type == "addPbsSame") {

                            if (this.props.selectData) {
                                obj.parentId = this.props.selectData.parentId
                            } else {
                                obj.parentId = 0
                            }

                        }
                        if (this.props.type == "addPbsNext") {
                            obj.parentId = this.props.selectData.id
                        }
                        axios.post(addTmpldelvPbs, obj, true, "新增成功").then(res => {
                            if (flag == "new") {
                                this.props.form.resetFields();
                                if(this.props.type == "addPbsNext"){
                                    this.props.addData(res.data.data)
                                }else{
                                    this.props.addSameData(res.data.data)
                                }
                              
                                this.props.handleCancel()
                            } else {
                                this.props.form.resetFields();
                                if(this.props.type == "addPbsNext"){
                                    this.props.addData(res.data.data)
                                }else{
                                    this.props.addSameData(res.data.data)
                                }
                            }

                        })
                        return
                    }

                    if (this.props.type == "addDelv") {
                        obj.parentId = this.props.selectData.id
                        axios.post(addTmpldelvDelv, obj, true, "新增成功").then(res => {
                            if (flag == "new") {
                                this.props.form.resetFields();
                                this.props.addData(res.data.data)
                                this.props.handleCancel()
                            } else {
                                this.props.form.resetFields();
                                this.props.addData(res.data.data)
                            }
                        })
                        return
                    }
                } else {
                    obj.id = this.props.selectData.id
                    if (this.props.selectData.type == "pbs") {

                        axios.put(updateTmpldelvPbs, obj, true, "修改成功").then(res => {
                            this.props.updateData(res.data.data)
                            this.props.form.resetFields();
                            this.props.handleCancel()
                        })
                    } else {
                        axios.put(updateTmpldelvDelv, obj, true, "修改成功").then(res => {
                            this.props.updateData(res.data.data)
                            this.props.form.resetFields();
                            this.props.handleCancel()
                        })
                    }
                }
   
            }

        })

    }
    componentDidMount() {
        if (this.props.type == "modify") {
            if (this.props.selectData.type == "pbs" ) {
                axios.get(getTmpldelvPbs(this.props.selectData.id)).then(res => {
                    this.setState({
                        info: res.data.data
                    }, () => {
                        const { info } = this.state
                        this.setState({
                            delvProjectTypeList1: info.delvType ? [info.delvType] : null
                        })
                    })
                })
            }
            if (this.props.selectData.type == "delv") {
                axios.get(getTmpldelvDelv(this.props.selectData.id)).then(res => {
                    this.setState({
                        info: res.data.data
                    }, () => {
                        const { info } = this.state
                        this.setState({
                            delvProjectTypeList1: info.delvType ? [info.delvType] : null
                        })
                    })
                })
            }
        }
    }
    //获取项目类型
    getDelvProjectTypeList = () => {
        if (!this.state.delvProjectTypeList) {
            axios.get(getdictTree("plan.delv.type")).then(res => {

                if (res.data.data) {
                    this.setState({
                        delvProjectTypeList: res.data.data,
                        delvProjectTypeList1: null
                    })
                }
            })
        }
        // if( !this.props.selectData || this.props.selectData && this.props.selectData.type == "pbs" && this.props.type != "addDelv"){
        //     if (!this.state.delvProjectTypeList) {
        //         axios.get(getdictTree("plan.delv.type")).then(res => {
    
        //             if (res.data.data) {
        //                 this.setState({
        //                     delvProjectTypeList: res.data.data,
        //                     delvProjectTypeList1: null
        //                 })
        //             }
        //         })
        //     }
        // }else{
        //     if (!this.state.delvProjectTypeList) {
        //         axios.get(getdictTree("delv.project.type")).then(res => {
    
        //             if (res.data.data) {
        //                 this.setState({
        //                     delvProjectTypeList: res.data.data,
        //                     delvProjectTypeList1: null
        //                 })
        //             }
        //         })
        //     }
        // }
      
    }
    render() {
        const { intl } = this.props.currentLocale
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
        const formItemLayout1 = {
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
            <div className={style.main}>
                <Modal
                    title={this.props.title}
                    visible={true}
                    onCancel={this.props.handleCancel}
                    mask={false}
                    maskClosable={false}
                    width="850px"
                    centered={true}
                    className={style.addFormInfo}
                    footer={
                        <div className='modalbtn'>
                            {this.props.type.indexOf("add") > -1 ?
                                <>
                                    <SubmitButton key="submit2" type="primary" ghost onClick={this.handleSubmit.bind(this, "go")} content={intl.get("wsd.global.btn.saveandcontinue")} />
                                    <SubmitButton key="submit3" type="primary" onClick={this.handleSubmit.bind(this, "new")} content={intl.get("wsd.global.btn.preservation")} />
                                </> :
                                <>
                                    <SubmitButton key="submit4" onClick={this.props.handleCancel} content={intl.get("wsd.global.btn.cancel")} />
                                    <SubmitButton key="submit5" type="primary" onClick={this.handleSubmit.bind(this,"save")} content={intl.get("wsd.global.btn.preservation")} />
                                </>

                            }
                        </div>
                    }
                >

                    <div className={style.main}>
                        <Form onSubmit={this.handleSubmit}>
                            <div className={style.content}>
                                <Row >
                                    <Col span={12}>
                                        <Form.Item label={intl.get('wsd.i18n.base.tmpldelv1.delvtitle')} {...formItemLayout}>
                                            {getFieldDecorator('delvTitle', {
                                                initialValue: this.state.info.delvTitle,
                                                rules: [{
                                                    required: true,
                                                    message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.base.tmpldelv1.delvtitle'),
                                                }],
                                            })(
                                                <Input maxLength={33}/>
                                            )}
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label={intl.get('wsd.i18n.base.tmpldelv1.delvnum')} {...formItemLayout}>
                                            {getFieldDecorator('delvNum', {
                                                initialValue: this.state.info.delvNum,
                                                rules: [{
                                                    required: true,
                                                    message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.base.tmpldelv1.delvnum'),
                                                }],
                                            })(
                                                <Input maxLength={33}/>
                                            )}
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={12}>
                                        <Form.Item label={intl.get('wsd.i18n.sys.menu.menutype')} {...formItemLayout}>
                                            {getFieldDecorator('delvType', {
                                                initialValue: this.state.info.delvType ? this.state.info.delvType.id : null,

                                            })(
                                                <Select onDropdownVisibleChange={this.getDelvProjectTypeList}>
                                                    {this.state.delvProjectTypeList1 ? this.state.delvProjectTypeList1.map(item => {
                                                        return <Option value={item.id} key={item.id}>{item.name}</Option>
                                                    }) : this.state.delvProjectTypeList && this.state.delvProjectTypeList.map(item => {
                                                        return <Option value={item.value} key={item.value}>{item.title}</Option>
                                                    })}
                                                </Select>
                                            )}
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={24}>
                                        <Form.Item label={intl.get('wsd.i18n.base.tmpldelv1.remark')} {...formItemLayout1}>
                                            {getFieldDecorator('delvDesc', {
                                                initialValue: this.state.info.delvDesc,
                                                rules: [],
                                            })(
                                                <TextArea maxLength={333}/>
                                            )}
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

const EditDevModals = Form.create()(EditDevModal);
const mapStateToProps = state => {
    return {
        currentLocale: state.localeProviderData,
    }
};


export default connect(mapStateToProps, null)(EditDevModals);
