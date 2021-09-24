import React, { Component } from 'react'
import intl from 'react-intl-universal'
import { Modal, Form, Row, Col, Input, Button, Icon, Select, DatePicker } from 'antd'
import style from './style.less'
import SubmitButton from "../../../../components/public/TopTags/SubmitButton"
import { connect } from 'react-redux'

//接口引入
import axios from '../../../../api/axios'
import { iptAdd ,getdictTree} from '../../../../api/api'



const FormItem = Form.Item;
const { TextArea } = Input;
const Option = Select.Option;

class ImportTable extends Component {
    constructor(props) {
        super(props)
        this.state = {
            initDone: false,

            info: ""
        }
    }

    componentDidMount() {
        this.state = {
            info: this.props.data
        }


    }
     //获取等级
     getRoleType = () => {
        if(!this.state.roleTypeList){
            axios.get(getdictTree("sys.org.level")).then(res => {
                if(res.data.data){
                    this.setState({
                        roleTypeList: res.data.data
                    })
                }
               
    
            })
        }
     
    }
    //iptAdd接口
    handleSubmit = (type) => {
       
        this.props.form.validateFieldsAndScroll((err, values) => {

            if (!err) {
                const data = {
                    ...values,
                    iptName: values.iptName,
                    iptCode: values.iptCode,
                    parentId: this.props.data.id,
                    remark: values.remark,
                    level: values.level,
                    sort: values.sort,
                };
                axios.post(iptAdd, data,true,null,true).then(res => {

                    this.props.addSuccess(res.data.data);
                    this.props.form.resetFields()
                    if (type == "new") {
                        this.props.closeNextAgency();
                    }
                })

            }
        });
    }


    handleOk = (e) => {
        this.setState({
            visible: false,
        });
        this.props.closeNextAgency()
    }
    handleCancel = (e) => {

        this.props.closeNextAgency()
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
            <div >

                <Modal title={intl.get("wsd.i18n.sys.ipt.addipt")} visible={true}
                     mask={false}
                     maskClosable={false}
                    className={style.main}
                    onCancel={this.props.closeNextAgency}
                    footer={
                        <div className="modalbtn">
                            <SubmitButton key={3} onClick={this.handleSubmit.bind(this, "go")} content={intl.get("wsd.global.btn.saveandcontinue")} />
                            <SubmitButton key={2} onClick={this.handleSubmit.bind(this, "new")} type="primary" content={intl.get("wsd.global.btn.preservation")} />
                        </div>
                    }
                    width="800px"

                >

                    <Form onSubmit={this.handleSubmit} >
                        <div className={style.content}>
                            <Row type="flex">
                                <Col span={12}>
                                    <Form.Item label={intl.get('wsd.i18n.sys.menu.menuname')} {...formItemLayout}>
                                        {getFieldDecorator('iptName', {

                                            rules: [{
                                                required: true,
                                                message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.sys.menu.menuname'),
                                            }],
                                        })(
                                            <Input maxLength={66}/>
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label={intl.get('wsd.i18n.sys.ipt.iptcodej')} {...formItemLayout}>
                                        {getFieldDecorator('iptCode', {

                                            rules: [{
                                                required: true,
                                                message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.sys.ipt.iptcodej'),
                                            }],
                                        })(
                                            <Input maxLength={33}/>
                                        )}
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row >
                                <Col span={12}>
                                    <Form.Item label={intl.get('wsd.i18n.sys.ipt.parentipt')} {...formItemLayout}>
                                        {getFieldDecorator('parentId', {
                                            initialValue: this.props.data.iptName,
                                            rules: [],
                                        })(
                                            <Input disabled />
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label={intl.get('wsd.i18n.sys.ipt.level')} {...formItemLayout}>
                                        {getFieldDecorator('level', {

                                            rules: [{
                                                required: true,
                                                message: intl.get('wsd.i18n.message.select') + intl.get('wsd.i18n.sys.ipt.level'),
                                            }],
                                        })(
                                            <Select onDropdownVisibleChange={this.getRoleType}>
                                            {this.state.roleTypeList && this.state.roleTypeList.map(item => {
                                                return <Option value={item.value} key={item.value}>{item.title}</Option>
                                            })}
                                        </Select>
                                        )}
                                    </Form.Item>
                                </Col>

                            </Row>


                            <Row>
                                <Col span={24}>
                                    <Form.Item label={intl.get('wsd.i18n.sys.ipt.remark')} {...formItemLayout1}>
                                        {getFieldDecorator('remark', {

                                            rules: [],
                                        })(
                                            <TextArea maxLength={66}/>
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
const ImportTables = Form.create()(ImportTable);
export default connect(state => ({
    currentLocale: state.localeProviderData
}), {

    })(ImportTables);