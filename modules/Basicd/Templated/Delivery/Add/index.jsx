import React, { Component } from 'react'
import style from './style.less'
import { Form, Row, Col, Input, Button, Icon, Select, DatePicker, Modal } from 'antd';
import axios from "../../../../../api/axios"
import { getdictTree,addTmpldelvList } from "../../../../../api/api"
import SubmitButton from "../../../../../components/public/TopTags/SubmitButton"
import { connect } from 'react-redux'
const FormItem = Form.Item;
const { TextArea } = Input;
export class BasicdTemplatedDeliveryAdd extends Component {
    constructor(props) {
        super(props)
        this.state = {

            info: {

            }
        }
    }

   
    //获取项目类型
    getDelvProjectTypeList = () => {
        if (!this.state.delvProjectTypeList) {
            axios.get(getdictTree("delv.project.type")).then(res => {
              
                if (res.data.data) {
                    this.setState({
                        delvProjectTypeList: res.data.data
                    })
                }
            })
        }
    }

    handleSubmit = (type) => {
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                axios.post(addTmpldelvList,values,true,"新增成功").then(res=>{
                    this.props.addData(res.data.data)
                  if(type=="new"){
                    this.props.form.resetFields();
                    this.props.handleCancel()
                  }else{
                    this.props.form.resetFields();
                  }
                })

            }
        });
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
            
                <Modal className={style.formMain} width="850px" centered={true}  mask={false}
               maskClosable={false}
                    title="新增交付模板" visible={true} onCancel={this.props.handleCancel}
                    footer={
                        <div className='modalbtn'>
                            <SubmitButton key="submit" onClick={this.handleSubmit.bind(this,"go")} content={intl.get("wsd.global.btn.saveandcontinue")} />
                            <SubmitButton key="submit1" type="primary" onClick={this.handleSubmit.bind(this,"new")} content={intl.get("wsd.global.btn.preservation")} />
                        </div>
                    }>
                    {/* <h2>{intl.get('wbs.add.name')}</h2>*/}
                    <Form onSubmit={this.handleSubmit}>
                        <div className={style.content}>
                            <Row type="flex">
                                <Col span={12}>
                                    <Form.Item
                                        label={intl.get('wsd.i18n.base.tmpldelv1.delvtitle')} {...formItemLayout}>
                                        {getFieldDecorator('typeTitle', {
                                            rules: [{
                                                required: true,
                                                message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.base.tmpldelv1.delvtitle'),
                                            }],
                                        })(
                                            <Input maxLength={66}/>
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label={intl.get('wsd.i18n.base.tmpldelv1.delvnum')} {...formItemLayout}>
                                        {getFieldDecorator('typeNum', {
                                          
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
                            <Row> <Col span={12}>
                                <Form.Item label={intl.get('wsd.i18n.base.tmpldelv1.delvversion')} {...formItemLayout}>
                                    {getFieldDecorator('typeVersion', {
                                     
                                        rules: [{
                                            required: true,
                                            message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.base.tmpldelv1.delvversion'),
                                        },{
                                            max:10,
                                            message:"文字长度不能超过10个字符"
                                        }],
                                    })(
                                        <Input />
                                    )}
                                </Form.Item>
                            </Col>
                                <Col span={12}>
                                    <Form.Item label={intl.get('wsd.i18n.base.tmpldelv1.delvtype')} {...formItemLayout}>
                                        {getFieldDecorator('typeType', {
                                           
                                           
                                        })(
                                            <Select onDropdownVisibleChange={this.getDelvProjectTypeList}>
                                                {this.state.delvProjectTypeList && this.state.delvProjectTypeList.map(item => {
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
                                        {getFieldDecorator('typeDesc', {
                                          
                                          
                                        })(
                                            <TextArea maxLength={333} rows={2} />
                                        )}
                                    </Form.Item>
                                </Col>
                            </Row>
                        </div>
                    </Form>
                </Modal>
            </div>)
    }
}
const BasicdTemplatedDeliveryAdds = Form.create()(BasicdTemplatedDeliveryAdd);
const mapStateToProps = state => {
    return {
        currentLocale: state.localeProviderData,
    }
};


export default connect(mapStateToProps, null)(BasicdTemplatedDeliveryAdds);
