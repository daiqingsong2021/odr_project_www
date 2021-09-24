import React, { Component } from 'react'
import style from './style.less'
import { Form, Row, Col, Input, Button, Select, Modal, DatePicker, TreeSelect, InputNumber } from 'antd';
import { } from '../../../../api/api'
import axios from '../../../../api/axios'

import { connect } from 'react-redux'


const Option = Select.Option;
const { TextArea } = Input;
const FormItem = Form.Item;
class RejectModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
           
            info: {},
          
        }
    }

    handleSubmit = (val, e) => {

        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {

            }
        });
    }

 

    render() {
        const { intl } = this.props.currentLocale
        const {
            getFieldDecorator, getFieldsError, getFieldError, isFieldTouched,
        } = this.props.form;
      
        const formItemLayout1 = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 24 },
            },
            wrapperCol: {
                xs: { span: 22 },
                sm: { span: 22 },
            },
        };
        return (
            <div >
               
                    <Modal className={style.main}
                        title={intl.get("wbs.il8n.process.rejecttoactor")} visible={true}
                        onCancel={this.props.handleCancel}

                        width="850px"
                        footer={
                            <div className="modalbtn">
                                <Button key={2} onClick={this.props.handleCancel}  >{intl.get("wsd.global.btn.cancel")}</Button>
                                <Button key={3} onClick={this.handleSubmit} type="primary">{intl.get("wsd.global.btn.sure")}</Button>
                            </div>
                        }
                    >
                        <Form onSubmit={this.handleSubmit} className={style.info}>
                            <div className={style.content}>
                            
                                <Row >
                                    <Col span={24}>
                                        <Form.Item label={intl.get("wbs.il8n.process.cause")} >
                                            {getFieldDecorator('projectTarget', {
                                                rules: [],
                                            })(
                                                <TextArea rows={5} />
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
const RejectModals = Form.create()(RejectModal);
const mapStateToProps = state => {
    return {
        currentLocale: state.localeProviderData,
    }
};


export default connect(mapStateToProps, null)(RejectModals);