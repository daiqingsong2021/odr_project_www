import React, { Component } from 'react'
import style from './style.less'
import { Form, Row, Col, Input, Button, Icon, Select, DatePicker } from 'antd';
import intl from 'react-intl-universal'
import { connect } from 'react-redux'
import { curdCurrentData } from '../../../../store/curdData/action'
const locales = {
    "en-US": require('../../../../api/language/en-US.json'),
    "zh-CN": require('../../../../api/language/zh-CN.json')
}
const FormItem = Form.Item;
const { TextArea } = Input;
const Option = Select.Option;
class WfvariableBasicInfo extends Component {
    constructor(props) {
        super(props)
        this.state = {
            initDone: false,
            info: {
                title: 1,
                xpath: 1,
                tableName: 1,
                tableTitle: 1,
                fieldName: 1,
                fieldTitle: 1,
                fieldType: 1,
            }
        }
    }

    componentDidMount() {
        this.loadLocales();
        this.setState({
            width: this.props.width,
            info: this.props.data
        })
    }

    loadLocales() {
        intl.init({
            currentLocale: 'zh-CN',
            locales,
        })
            .then(() => {
                // After loading CLDR locale data, start to render
                this.setState({ initDone: true });
            });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        alert(1)
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.props.curdCurrentData({
                    title: localStorage.getItem('name'),
                    status: 'update',
                    data: values
                })
            }
        });
    }

    render() {
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
                {this.state.initDone &&
                    <div className={style.mainHeight}>
                        <h3 className={style.listTitle}>基本信息</h3>
                        <div className={style.mainScorll}>
                        <Form onSubmit={this.handleSubmit} >
                            <div className={style.content}>
                                <Row  type="flex">
                                    <Col span={12}>
                                        <Form.Item label={intl.get('wsd.i18n.sys.wfbizvar.title')} {...formItemLayout}>
                                            {getFieldDecorator('title', {
                                                initialValue: this.state.info.title,
                                                rules: [{
                                                    required: true,
                                                    message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.sys.wfbizvar.title'),
                                                }],
                                            })(
                                                <Input />
                                            )}
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label={intl.get('wsd.i18n.sys.wfbizvar.xpath')} {...formItemLayout}>
                                            {getFieldDecorator('xpath', {
                                                initialValue: this.state.info.xpath,
                                                rules: [{
                                                    required: true,
                                                    message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.sys.wfbizvar.xpath'),
                                                }],
                                            })(
                                                <Input />
                                            )}
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row >                                                        <Col span={12}>
                                    <Form.Item label={intl.get('wsd.i18n.sys.wfbizvar.tablename')} {...formItemLayout}>
                                        {getFieldDecorator('tableName', {
                                            initialValue: this.state.info.tableName,
                                            rules: [],
                                        })(
                                            <Select>
                                                <Option value="模块1">模块1</Option>
                                            </Select>
                                        )}
                                    </Form.Item>
                                </Col>
                                    <Col span={12}>
                                        <Form.Item label={intl.get('wsd.i18n.sys.wfbizvar.tabletitle')} {...formItemLayout}>
                                            {getFieldDecorator('tableTitle', {
                                                initialValue: this.state.info.tableTitle,
                                                rules: [],
                                            })(
                                                <Input />
                                            )}
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row >                                                        <Col span={12}>
                                    <Form.Item label={intl.get('wsd.i18n.sys.wfbizvar.fieldname')} {...formItemLayout}>
                                        {getFieldDecorator('fieldName', {
                                            initialValue: this.state.info.fieldName,
                                            rules: [],
                                        })(
                                            <Select>
                                                <Option value="模块1">模块1</Option>
                                            </Select>
                                        )}
                                    </Form.Item>
                                </Col>
                                    <Col span={12}>
                                        <Form.Item label={intl.get('wsd.i18n.sys.wfbizvar.fieldtitle')} {...formItemLayout}>
                                            {getFieldDecorator('fieldTitle', {
                                                initialValue: this.state.info.fieldTitle,
                                                rules: [],
                                            })(
                                                <Input />
                                            )}
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row >                                 <Col span={12}>
                                    <Form.Item label={intl.get('wsd.i18n.sys.wfbizvar.fieldtype')} {...formItemLayout}>
                                        {getFieldDecorator('fieldType', {
                                            initialValue: this.state.info.fieldType,
                                            rules: [],
                                        })(
                                            <Select>
                                                <Option value="模块1">模块1</Option>
                                            </Select>
                                        )}
                                    </Form.Item>
                                </Col>
                                </Row>
                                <Row>
                                    <Col span={24}>
                                        <Form.Item label={intl.get('wsd.i18n.sys.wfbizvar.fieldsql')} {...formItemLayout1}>
                                            {getFieldDecorator('fieldsql', {
                                                initialValue: this.state.info.fieldsql,
                                                rules: [{
                                                    required: true,
                                                    message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.sys.wfbizvar.fieldsql'),
                                                }],
                                            })(
                                                <TextArea rows={2} />
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
                       
                    </div>}
            </div>
        )
    }
}
const WfvariableBasicInfos = Form.create()(WfvariableBasicInfo);
export default connect(null, {
    curdCurrentData
})(WfvariableBasicInfos);
// {
//               "wsd.i18n.sys.wfbizvar.title" : "流程业务变量",
//             "wsd.i18n.sys.wfbizvar.xpath" : "xpath",
//             "wsd.i18n.sys.wfbizvar.tablename" : "表名",
//             "wsd.i18n.sys.wfbizvar.tabletitle" : "表显示名称",
//             "wsd.i18n.sys.wfbizvar.fieldname" : "字段名",
//             "wsd.i18n.sys.wfbizvar.fieldtitle" : "字段显示名称",
//             "wsd.i18n.sys.wfbizvar.fieldtype" : "字段类型",
//     }
