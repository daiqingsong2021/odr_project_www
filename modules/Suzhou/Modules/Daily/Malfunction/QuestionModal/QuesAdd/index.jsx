import React, { Component } from 'react';
import { Modal, Form, Row, Col, Input, Button, Icon, Select, Divider, DatePicker, Descriptions, TreeSelect,Tabs } from 'antd';
import moment from 'moment';
import style from './style.less';
import intl from 'react-intl-universal';
import { connect } from 'react-redux';
import { curdCurrentData } from '../../../../../../../store/curdData/action';
import axios from '@/api/axios';
import {faultDailyProblemAdd,faultDailyProblemUpdate} from '@/modules/Suzhou/api/suzhou-api';

const { TextArea } = Input;
const Option = Select.Option;
export class AddModal extends Component {
    constructor(props){
        super(props);
        this.state={
            info:{}
        }
    }
    componentDidMount(){
        this.props.type == 'modify'?this.setState({info:this.props.record}):null
    }
     //新增提交
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err && this.props.type == 'add') {
                const data={
                    ...values,
                    faultId:this.props.addInfo.id
                }
                console.log(data)
                axios.post(faultDailyProblemAdd, data, true).then(res => {
                    if (res.data.status === 200) {
                        this.props.addSuccess();
                        this.props.handleCancel();
                    }
                });
            }
            if(!err && this.props.type == 'modify'){
                const data={
                    ...values,
                    id:this.props.record.id
                }
                console.log(data);
                axios.put(faultDailyProblemUpdate, data, true).then(res => {
                    this.props.updateSuccess(res.data.data);
                    this.props.handleCancel();
                });
            }
        });
    };
    render(){
        const { intl } = this.props.currentLocale
        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
        const formItemLayout1 = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 3 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 21 },
            },
        };
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 18 },
            },
        };
        return(
            <Modal className={style.main}
                    width="850px"
                    afterClose={this.props.form.resetFields}
                    mask={false}
                    maskClosable={false}
                    footer={<div className="modalbtn">
                        {/* 取消 */}
                        <Button key={1} onClick={this.props.handleCancel}>取消</Button>
                        {/* 保存 */}
                        <Button key={2} onClick={this.handleSubmit.bind(this)} type="primary">{intl.get('wsd.global.btn.preservation')}</Button>
                    </div>}
                    centered={true} title={this.props.title} visible={this.props.modalVisible}
                    onCancel={this.props.handleCancel}>
                    <Form onSubmit={this.handleSubmit}>
                        <Row type="flex">
                            <Col span={24}>
                                <Form.Item label="故障描述" {...formItemLayout1}>
                                {getFieldDecorator('problemDesc', {
                                    initialValue: this.state.info.problemDesc,
                                    rules: [{required: true,message: '请选择故障描述'}],
                                })(
                                    <TextArea placeholder="请输入" style={{height:'115px'}}/>
                                )}
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item label="故障原因" {...formItemLayout1}>
                                {getFieldDecorator('problemReason', {
                                    initialValue: this.state.info.problemReason,
                                    rules: [{required: true,message: '请选择故障原因'}],
                                })(
                                    <TextArea placeholder="请输入(不能超过100个字)" style={{height:'60px'}} maxLength="100" />
                                )}
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item label="故障处理进度" {...formItemLayout1}>
                                {getFieldDecorator('dealDetail', {
                                    initialValue: this.state.info.dealDetail,
                                    rules: [],
                                })(
                                    <TextArea placeholder="请输入" style={{height:'115px'}} maxLength={400}/>
                                )}
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="故障状态" {...formItemLayout}>
                                {getFieldDecorator('problemStatus', {
                                    initialValue: this.props.type == 'modify' ? this.state.info.problemStatus : 'INIT',
                                    rules: [{required: true,message: '请选择故障状态'}],
                                })(
                                    <Select >
                                        <Option key='INIT' value="INIT">正在调查中</Option>
                                        <Option key='DEALING' value="DEALING">处理中</Option>
                                        <Option key='HANDUP' value="HANDUP">挂起</Option>
                                        <Option key='DEALED' value="DEALED">处理完成</Option>
                                        {/* <Option key='NODEAL' value="NODEAL">暂不处理</Option> */}
                                    </Select>,
                                )}
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item label="备注" {...formItemLayout1}>
                                {getFieldDecorator('remark', {
                                    initialValue: this.state.info.remark == null ? null:this.state.info.remark,
                                })(
                                    <TextArea placeholder="请输入(不能超过100个字)" style={{height:'60px'}} maxLength="100" />
                                )}
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>

                </Modal>
        )
    }
}
const AddModals = Form.create()(AddModal);
export default connect(state => ({
    currentLocale: state.localeProviderData,
}))(AddModals);