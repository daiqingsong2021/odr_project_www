import React, {Component} from 'react'
import style from './style.less'

import { Modal, Button,Form, Row, Col, Input,  Icon, Select, DatePicker } from 'antd';
import intl from 'react-intl-universal'
import { connect } from 'react-redux'
import { curdCurrentData } from '../../../../store/curdData/action'
const FormItem = Form.Item;
const { TextArea } = Input;
const locales = {
    "en-US": require('../../../../api/language/en-US.json'),
    "zh-CN": require('../../../../api/language/zh-CN.json')
}
export class WfAdd extends Component {
    constructor (props) {
        super (props)
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
            width: this.props.width
        })
    }

    loadLocales() {
        intl.init({
                currentLocale: 'zh-CN',
                locales,
            })
            .then(() => {
                // After loading CLDR locale data, start to render
                this.setState({initDone: true});
            });
    }
    handleSubmit = (e) => {
        e.preventDefault()
        this.props.form.validateFieldsAndScroll((err, fieldsValue) => {
            if (!err) {
                
                // emitter.emit('noticeUpdateEvents', { status: 'add', data: values })
                this.props.curdCurrentData({
                    title: localStorage.getItem('name'),
                    status: 'add',
                    data: fieldsValue
                })
             
            }
        })
    }
    render () {
        const {
            getFieldDecorator, getFieldsError, getFieldError, isFieldTouched,
            } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 8},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 16},
            },
        };
        const formItemLayout1 = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 4},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 20},
            },
        };
        return (
            <div >
                <Modal
                    title={this.props.modelTitle}
                    className={style.main}
                    visible={this.props.modalVisible}
                    onCancel={this.props.handleCancel}
                    footer= {null}
                    width="850px"
                    centered={true}
                    footer={<div className="modalbtn">
                      <Button key={1} onClick={this.props.handleCancel}>取消</Button>
                      <Button key={2} onClick={this.handleSubmit} type="primary">保存</Button>
                    </div>}
                >
                      <Form onSubmit={this.handleSubmit}>
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
                                        <Input/>
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
                                        <Input/>
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row > <Col span={12}>
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
                                        <Input/>
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row > <Col span={12}>
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
                                        <Input/>
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row > <Col span={12}>
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
                        <Row > <Col span={24}>
                            <Form.Item label={intl.get('wsd.i18n.sys.wfbizvar.sql')} {...formItemLayout1}>
                                {getFieldDecorator('sql', {
                                    initialValue: this.state.info.fieldType,
                                    rules: [{
                                        required: true,
                                        message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.sys.wfbizvar.sql'),
                                    }],
                                })(
                                    <TextArea rows={2} cols={10} />
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



const WfAdds= Form.create()(WfAdd);
export default connect(null, {
    curdCurrentData
})(WfAdds);
