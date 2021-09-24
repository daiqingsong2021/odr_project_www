import React, { Component } from 'react';
import { Modal, Form, Row, Col, Input, Button, Icon, Select, Divider, DatePicker, Descriptions, TreeSelect,Tabs } from 'antd';
import moment from 'moment';
import style from './style.less';
import intl from 'react-intl-universal';
import { connect } from 'react-redux';
import { curdCurrentData } from '../../../../../../../store/curdData/action';
import axios from '@/api/axios';
import {faultDailyProblemDealAdd} from '@/modules/Suzhou/api/suzhou-api';

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

    }
     //新增提交
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err && this.props.type == 'add') {
                const data={
                    ...values,
                    problemId:this.props.problemInfo.id
                }
                console.log(data)
                axios.post(faultDailyProblemDealAdd, data, true).then(res => {
                    if (res.data.status === 200) {
                        this.props.addSuccess();
                        this.props.handleCancel();
                    }
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
                sm: { span: 5 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 19 },
            },
        };
        return(
            <Modal className={style.main}
                    width="500px"
                    afterClose={this.props.form.resetFields}
                    mask={false}
                    maskClosable={false}
                    footer={<div className="modalbtn">
                        {/* 取消 */}
                        <Button key={1} onClick={this.props.handleCancel}>取消</Button>
                        {/* 保存 */}
                        <Button key={2} onClick={this.handleSubmit.bind(this)} type="primary">{intl.get('wsd.global.btn.preservation')}</Button>
                    </div>}
                    centered={true} title='新增' visible={this.props.modalVisible}
                    onCancel={this.props.handleCancel}>
                    <Form onSubmit={this.handleSubmit}>
                        <Row type="flex">
                            <Col span={24}>
                                <Form.Item label="处理详情" {...formItemLayout1}>
                                {getFieldDecorator('dealDetail', {
                                    rules: [{required: true,message: '请输入处理详情'}],
                                })(
                                    <TextArea placeholder="请输入" style={{height:'100px'}}/>
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