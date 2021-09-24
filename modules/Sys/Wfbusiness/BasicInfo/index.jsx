import React, { Component } from 'react'
import style from './style.less'
import { Form, Row, Col, Input, Button, Icon, Select, DatePicker } from 'antd';
import { connect } from 'react-redux'

import axios from '../../../../api/axios'
import { wfBizTypeInfo, wfBizTypeUpdate } from '../../../../api/api'

const FormItem = Form.Item;
class MenuInfo extends Component {
    constructor(props) {
        super(props)
        this.state = {
            info: {}
        }
    }

    getDataList = () => {
        axios.get(wfBizTypeInfo(this.props.data.id)).then(res => {
            this.setState({
                info: res.data.data
            })
        })
    }

    componentDidMount() {
        this.getDataList();
    }



    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                let data = {
                    ...values,
                    id: this.props.data.id,
                }

                axios.put(wfBizTypeUpdate, data, {}, '修改成功').then(res=>{
                    this.props.updateData(res.data.data)
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
                sm: { span: 4 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 20 },
            },
        };
        return (
            <div className={style.main}>
                <div className={style.mainHeight}>
                    <h3 className={style.listTitle}>基本信息</h3>
                    <Form onSubmit={this.handleSubmit} className={style.mainScorll}>
                        <div className={style.content}>

                            <Row type="flex">

                                <Col span={24}>
                                    <Form.Item label={intl.get('wsd.i18n.sys.wfbusiness.wfcode')} {...formItemLayout}>
                                        {getFieldDecorator('typeCode', {
                                            initialValue: this.state.info.typeCode,
                                            rules: [{
                                                required: true,
                                                message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.sys.wfbusiness.wfcode'),
                                            }],
                                        })(
                                            <Input />,
                                        )}
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row> <Col span={24}>
                                <Form.Item label={intl.get('wsd.i18n.sys.wfbusiness.wfname')} {...formItemLayout}>
                                    {getFieldDecorator('typeName', {
                                        initialValue: this.state.info.typeName,
                                        rules: [{
                                            required: true,
                                            message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.sys.wfbusiness.wfname'),
                                        }],
                                    })(
                                        <Input />,
                                    )}
                                </Form.Item>
                            </Col>
                                <Col span={24}>
                                    <Form.Item label={intl.get('wsd.i18n.sys.wfbusiness.wfurl')} {...formItemLayout}>
                                        {getFieldDecorator('url', {
                                            initialValue: this.state.info.url,
                                            rules: [],
                                        })(
                                            <Input />,
                                        )}
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row> <Col span={24}>
                                <Form.Item label={intl.get('wsd.i18n.sys.wfbusiness.wfevents')} {...formItemLayout}>
                                    {getFieldDecorator('event', {
                                        initialValue: this.state.info.event,
                                        rules: [],
                                    })(
                                        <Input />,
                                    )}
                                </Form.Item>
                            </Col>
                                <Col span={24}>
                                    <Form.Item label={intl.get('wsd.i18n.sys.wfbusiness.modecode')} {...formItemLayout}>
                                        {getFieldDecorator('moduleCode', {
                                            initialValue: this.state.info.moduleCode,
                                            rules: [],
                                        })(
                                            <Input />,
                                        )}
                                    </Form.Item>
                                </Col>

                            </Row>
                            <Form.Item wrapperCol={{ offset: 4 }}>
                                <Button className="globalBtn" onClick={this.handleSubmit} style={{ marginRight: 20 }}
                                    type="primary">保存</Button>
                                <Button className="globalBtn" onClick={this.props.closeRightBox}>取消</Button>
                            </Form.Item>
                        </div>

                    </Form>
                </div>
            </div>
        )
    }
}
const WfbusinessBasicInfos = Form.create()(MenuInfo);

export default connect(state => ({
    currentLocale: state.localeProviderData
}))(WfbusinessBasicInfos);
// {
//     "wsd.i18n.sys.wfbusiness.modecode": "模块代码",
//         "wsd.i18n.sys.wfbusiness.wfcode": "业务代码",
//             "wsd.i18n.sys.wfbusiness.wfname": "业务名称",
//                 "wsd.i18n.sys.wfbusiness.wfurl": "表单地址",
//                     "wsd.i18n.sys.wfbusiness.wfevents": "流程事件",
//                         "wsd.i18n.sys.wfbusiness.formmodecode": "表单模块代码",
//     }
