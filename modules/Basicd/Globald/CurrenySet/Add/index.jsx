import React, { Component } from 'react'
import style from './style.less'
import { Form, Row, Col, Input, Button, Icon, Select, DatePicker, Upload, message, Modal } from 'antd';
import moment from 'moment';
import emitter from '../../../../../api/ev'
import { connect } from 'react-redux'
import axios from '../../../../../api/axios.js';
import { currencyAdd } from '../../../../../api/api'
import SubmitButton from "../../../../../components/public/TopTags/SubmitButton"
const FormItem = Form.Item;
export class BasicdGlobalCurAdd extends Component {
    constructor(props) {
        super(props)
        this.state = {
            initDone: false,
            info: {}
        }
    }

    componentDidMount() {

    }


    //點擊保存 發起請求  更新貨幣列表
    handleSubmit = (val) => {
     
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                let data = values
                axios.post(currencyAdd, data,true,null,true).then(res => {
                    this.props.addData(res.data.data)
                    
                    if (val == 'save') {
                        
                        this.props.handleCancel();
                    } else {
                        this.props.form.resetFields();
                    }
                })
            }

        });
    }

    render() {

        const { intl } = this.props.currentLocale;

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
        return (
            <div className={style.main}>
                <Modal className={style.formMain} width="850px" centered={true}  mask={false}
                    maskClosable={false}
                    title="新增货币" visible={this.props.modalVisible} onCancel={this.props.handleCancel}
                    footer={
                        <div className='modalbtn'>
                            <SubmitButton key="submit" onClick={this.handleSubmit.bind(this, 'goOn')} content="保存并继续" />
                            <SubmitButton key="submit1" type="primary" onClick={this.handleSubmit.bind(this, 'save')} content="保存" />
                        </div>
                    }>
                    {/*<h2>{intl.get('wbs.add.name')}</h2>*/}
                    <Form onSubmit={this.handleSubmit}>
                        <div className={style.content}>

                            <Row type="flex">

                                <Col span={12}>
                                    <Form.Item label={intl.get('wsd.i18n.base.currency.currcode')} {...formItemLayout}>
                                        {getFieldDecorator('currencyCode', {
                                            initialValue: this.state.info.currencyCode,
                                            rules: [{
                                                required: true,
                                                message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.base.currency.currcode'),
                                            }],
                                        })(
                                            <Input maxLength={33}/>
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label={intl.get('wsd.i18n.base.currency.currname')} {...formItemLayout}>
                                        {getFieldDecorator('currencyName', {
                                            initialValue: this.state.info.currencyName,
                                            rules: [{
                                                required: true,
                                                message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.base.currency.currname'),
                                            }],
                                        })(
                                            <Input maxLength={66}/>
                                        )}
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <Form.Item label={intl.get('wsd.i18n.base.currency.currsymbol')} {...formItemLayout}>
                                        {getFieldDecorator('currencySymbol', {
                                            initialValue: this.state.info.currencySymbol,
                                            rules: [{
                                                required: true,
                                                message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.base.currency.currsymbol'),
                                            }],
                                        })(
                                            <Input maxLength={33}/>
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
const BasicdGlobalCurAdds = Form.create()(BasicdGlobalCurAdd);
export default connect(state => ({
    currentLocale: state.localeProviderData
}))(BasicdGlobalCurAdds)
