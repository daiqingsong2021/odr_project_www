import React, { Component } from 'react'
import style from './style.less'
import { Form, Row, Col, Input, Button, Modal } from 'antd';
import SubmitButton from "../../../../../components/public/TopTags/SubmitButton"
const FormItem = Form.Item;
import axios from "../../../../../api/axios"
import { addDigitDirBo } from '../../../../../api/api';
import { connect } from 'react-redux'

class Add extends Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            initDone: false,
        }
    }
    handleOk = (e) => {
        this.setState({
            visible: false,
        });
        this.props.handleCancel()
    }
   
  
    
    handleSubmit = (type) => {
       
        this.props.form.validateFieldsAndScroll((err, values) => {
            let data = {
                ...values,
                boCode: this.props.boCode ? this.props.boCode : null
            }
            if (!err) {
              axios.post(addDigitDirBo, data,true,"新增成功",true).then(res => {
                if(type=="save"){
                  // 清空表单项
                  this.props.form.resetFields();
                  this.props.onCancel();
                }else{
                  this.props.form.resetFields();
                }
                this.props.handleClick(res.data.data)
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
                <Modal
                    title={this.props.title}
                    visible={true}
                    onCancel={this.props.onCancel}
                    width="850px"
                    centered={true}
                    className={style.addFormInfo}
                    mask={false}
                    maskClosable={false}
                    footer={
                        <div className='modalbtn'>
                            <SubmitButton key="submit2" onClick={this.handleSubmit.bind(this, 'go')} content="保存并继续" />
                            <SubmitButton key="submit3" type="primary" onClick={this.handleSubmit.bind(this, 'save')} content="保存" />
                        </div>
                    }
                >
                    <Form onSubmit={this.handleSubmit}>
                        <div className={style.content}>
                            <Row type="flex">
                                <Col span={12}>
                                    <Form.Item label={intl.get('wsd.i18n.base.digitdir.digitname')} {...formItemLayout}>
                                        {getFieldDecorator('typeName', {
                                            rules: [{
                                                required: true,
                                                message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.base.digitdir.digitname'),
                                            }],
                                        })(
                                            <Input maxLength={66}/>
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label={intl.get('wsd.i18n.base.digitdir.digitcode')} {...formItemLayout}>
                                        {getFieldDecorator('typeCode', {
                                            rules: [{
                                                required: true,
                                                message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.base.digitdir.digitcode'),
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

const Adds = Form.create()(Add);
/* *********** connect链接state及方法 start ************* */
export default connect(state => ({
    currentLocale: state.localeProviderData
}))(Adds);
/* *********** connect链接state及方法 end ************* */