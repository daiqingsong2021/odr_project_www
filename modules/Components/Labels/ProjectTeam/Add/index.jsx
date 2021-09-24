import React, { Component } from 'react'
import style from './style.less'
import { Form, Row, Col, Input, Button, Modal } from 'antd';
import { connect } from 'react-redux'
import axios from '../../../../../api/axios'
import {prepaProjectteamAdd, prepaProjectteamUpdata, prepaProjectteamUserTreeAdd} from '../../../../../api/api'
import * as dataUtil from "../../../../../utils/dataUtil";
import SubmitButton from "../../../../../components/public/TopTags/SubmitButton"
//新增项目团队弹框
class AddTeam extends Component {
    constructor(props) {
        super(props)
        this.state = {
            visible : true,
            addRecord: null,
            modifyRecord: null,
            data: null,
            info: {
            }
        }
    }

    getData = () => {
        axios.get(prepaProjectteamUpdata(this.props.record.id)).then(res=>{
            this.setState({
                info: res.data.data
            })
        })
    }

    componentDidMount() {
        //判断是新增表单还是修改表单
        if (this.props.title == '新增部门') {
            this.setState({
                addRecord: this.props.record ? this.props.record.id : 0
            })
        } else if (this.props.title == '修改部门') {

            this.getData()
            this.setState({
                modifyRecord: this.props.record
            })
        }
    }


    showModal = () => {
        this.setState({
            visible: true,
        });
    }
    handleOk = (e) => {
        this.setState({
            visible: false,
        });
        this.props.handleCancel()
    }
    handleCancel = (e) => {
        this.props.handleCancel()
    }
    handleSubmit = (val) => {
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                if (this.props.title == '新增部门') {
                    let data = {
                        ...values,
                        parentId: this.state.addRecord,
                        bizType: this.props.bizType,
                        bizId: this.props.bizId
                    }
                    let extInfo = this.props.extInfo || {};
                    let url = dataUtil.spliceUrlParams(prepaProjectteamAdd,{"startContent":extInfo.startContent});
                    axios.post(url, data,true).then(res => {
                     
                        this.props.addData(res.data.data,val)
                        if (val == 'save') {
                            this.props.handleCancel()
                        } else if (val == 'goOn') {
                            this.props.form.resetFields()
                        }
                    })
                } else if (this.props.title == '修改部门') {
                    let data = {
                        ...values,
                        id:this.state.modifyRecord.id
                    }
                    let extInfo = this.props.extInfo || {};
                    let url = dataUtil.spliceUrlParams(prepaProjectteamAdd,{"startContent":extInfo.startContent});
                    axios.put(url, data, true).then(res=>{
                        this.props.upData(res.data.data,val);
                        this.props.handleCancel();
                    })
                }

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
                <Modal className={style.main}
                    title={this.props.title} visible={this.props.visible}
                    onOk={this.handleOk} onCancel={this.props.handleCancel}
                    mask={false}
                    maskClosable={false}
                    width="850px"
                    footer={
                        <div className="modalbtn">
                            {this.props.opttype === 'modify' ?
                                <SubmitButton key={3} onClick={this.props.handleCancel} content="取消" />
                                :
                                <SubmitButton key={3} onClick={this.handleSubmit.bind(this, 'goOn')} content="保存并继续" />
                            }
                            <SubmitButton key={2} onClick={this.handleSubmit.bind(this, 'save')} type="primary" content="保存" />
                        </div>
                    }
                >
                    <Form onSubmit={this.handleSubmit} className={style.info}>
                        <div className={style.content}>
                            <Row type="flex">
                                <Col span={12}>
                                    <Form.Item label={intl.get('wsd.i18n.plan.prepa.teamName')} {...formItemLayout}>
                                        {getFieldDecorator('teamName', {
                                            initialValue: this.state.info.teamName,
                                            rules: [{
                                                required: true,
                                                message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.plan.prepa.teamName'),
                                            }],
                                        })(
                                            <Input maxLength={66}/>
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label={intl.get('wsd.i18n.plan.prepa.teamCode')} {...formItemLayout}>
                                        {getFieldDecorator('teamCode', {
                                            initialValue: this.state.info.teamCode,
                                            rules: [{
                                                required: true,
                                                message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.plan.prepa.teamCode'),
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
const AddTeams = Form.create()(AddTeam);
export default connect(state => ({
    currentLocale: state.localeProviderData
}))(AddTeams)
