import React, { Component } from 'react'
import style from './style.less'
import { Form, Row, Col, Input, Button, Select, Modal,InputNumber } from 'antd';
import intl from 'react-intl-universal'
import moment from 'moment';
import { connect } from 'react-redux'
import {addPlanPbs, addPlanDelv, deletePlanDelv} from "../../../../api/api"
import axios from "../../../../api/axios"
import * as dataUtil from '../../../../utils/dataUtil';
import SubmitButton from "../../../../components/public/TopTags/SubmitButton"
const Option = Select.Option;
const { TextArea } = Input;
const FormItem = Form.Item;
class AddSameLevel extends Component {
    constructor(props) {
        super(props)
        this.state = {
            initDone: false,
            info: {}
        }
    }

    handleCancel = (e) => {
        this.props.handleCancel()
    }

    // 点击下拉框
    onDelivTypeChange = () => {
        const { delivType, getBaseSelectTree } = this.props
        if (!delivType.length > 0) {
            getBaseSelectTree('plan.delv.type')
        }
    }

    handleSubmit = (bo) => {
      
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                const ndata = { ...values }
                const {rightData,projectId}=this.props
                ndata.projectId = projectId;
                //新增交付物
                if (this.props.addtype == 'adddelv') {
                    let url = dataUtil.spliceUrlParams(addPlanDelv,{"startContent":"项目【"+this.props.projectName+"】"});
                    ndata.parentId =rightData.type=="project"? 0 : rightData.id
                    axios.post(url , ndata,true,null,true).then(res => {
                        this.props.addPlanDelv(res.data.data)
                        if (!bo) {
                            this.props.handleCancel()
                        } else {
                            this.props.form.resetFields();
                        }
                    })
                }
              
                //新增下级PBS
                if (this.props.addtype == 'nextpbs') {
                    if (rightData && rightData.type=="pbs") {
                        ndata.parentId = rightData.id
                    } else {
                        ndata.parentId = 0
                    }
                    let url = dataUtil.spliceUrlParams(addPlanPbs,{"startContent":"项目【"+this.props.projectName+"】"});
                    axios.post(url, ndata,true,null,true).then(res => {
                        this.props.addPlanPbs(res.data.data)
                        if (!bo) {
                            this.props.handleCancel()
                        } else {
                            this.props.form.resetFields();
                        }
                    })
                   
                }


               
            }
        });
    }

    render() {
        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
        const { delivType } = this.props
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

                <Modal title={this.props.title} visible={true} mask={false}
                    maskClosable={false} onCancel={this.props.handleCancel} width="800px" footer={
                        <div className="modalbtn">
                            <SubmitButton key={3} onClick={this.handleSubmit.bind(this, true)} content="保存并继续" />
                            <SubmitButton key={2} onClick={this.handleSubmit.bind(this, false)} type="primary" content="保存" />
                        </div>
                    }
                >
                    <Form onSubmit={this.handleSubmit}>
                        <div className={style.content}>
                            <Row type="flex">
                                <Col span={12}>
                                    <Form.Item label="名称" {...formItemLayout}>
                                        {getFieldDecorator('delvTitle', {
                                            initialValue: this.state.info.delvTitle,
                                            rules: [{
                                                required: true,
                                                message: intl.get('wsd.i18n.message.enter') + "名称",
                                            }],
                                        })(
                                            <Input maxLength={66}/>
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label={intl.get('wsd.i18n.pre.epsInfo.projectcode')} {...formItemLayout}>
                                        {getFieldDecorator('delvCode', {
                                            initialValue: this.state.info.delvCode,
                                            rules: [{
                                                required: true,
                                                message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.pre.epsInfo.projectcode'),
                                            }],
                                        })(
                                            <Input maxLength={66}/>
                                        )}
                                    </Form.Item>
                                </Col>
                            </Row>
                            {
                                this.props.addtype == 'adddelv' && <Row type="flex">
                                    <Col span={12}>
                                        <Form.Item label="计划交付数量" {...formItemLayout}>
                                            {getFieldDecorator('delvNum', {
                                                initialValue: this.state.info.delvNum,
                                                rules: [],
                                            })(
                                                <InputNumber min={0} max={100} style={{width:"100%"}} />
                                            )}
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label="类别" {...formItemLayout}>
                                            {getFieldDecorator('delvType', {
                                                initialValue: this.state.info.delvType,
                                                rules: [],
                                            })(
                                                <Select onFocus={this.onDelivTypeChange}>
                                                    {
                                                        this.props.delivType.map((v, i) => {
                                                            return <Option value={v.value} key={i}>{v.title}</Option>
                                                        })
                                                    }
                                                </Select>
                                            )}
                                        </Form.Item>
                                    </Col>
                                </Row>
                            }
                            <Row >
                                <Col span={24}>
                                    <Form.Item label={intl.get('wsd.i18n.plan.activitydefine.remark')} {...formItemLayout1}>
                                        {getFieldDecorator('remark', {
                                            initialValue: this.state.info.remark,
                                            rules: [],
                                        })(
                                            <TextArea rows={2} maxLength={85}/>
                                        )}
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
const AddSameLevels = Form.create()(AddSameLevel);
export default connect(state => ({
    currentLocale: state.localeProviderData
}), {

    })(AddSameLevels);
