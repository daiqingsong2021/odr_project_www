import React, { Component } from 'react'
import style from './style.less'
import { Form, Row, Col, Input, Button, Icon, Select, DatePicker, Modal, Table } from 'antd';
import intl from 'react-intl-universal'
import emitter from '../../../../api/ev';
import moment from 'moment';

const locales = {
    "en-US": require('../../../../api/language/en-US.json'),
    "zh-CN": require('../../../../api/language/zh-CN.json')
}
const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;
class MenuInfo extends Component {
    constructor(props) {
        super(props)
        this.state = {
            initDone: false,
            visible: true,
            info: {
                fileName: 1,
                fileVersion: 1,
                creatTime: null,
                creator: 1,
                remark: 1,
            },
            data: [
                {
                    key: "[0]",
                    id: "1",
                    fileName: "需求计划",
                    fileType: "word",
                    
                }, {
                    key: "[1]",
                    id: "2",
                    fileName: "需求计划",
                    fileType: "word",
                   
                }
            ]
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
                this.setState({ initDone: true });
            });
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
        this.setState({
            visible: false,
        });
        this.props.handleCancel()
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.handleCancel()
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
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
        const columns = [
            {
                title: intl.get('wsd.i18n.plan.fileinfo.filename'),
                dataIndex: 'fileName',
                width:"60%",
                key: 'fileName',
            },
            {
                title: intl.get('wsd.i18n.plan.fileinfo.filetype'),
                dataIndex: 'fileType',
                width:"30%",
                key: 'fileType',
            },
            {
                title: "",
                dataIndex: 'operate',
                key: 'operate',
                width:"10%",
                render: (text, record) => (
                    <Icon type="close" />
                  )
            }
        ]
        return (
            <div >
                {this.state.initDone &&
                    <Modal title={this.props.title} visible={this.state.visible}
                        onOk={this.handleOk} onCancel={this.handleCancel}
                        okText="确定"
                        cancelText="取消"
                        width="800px"
                        footer={ 
                            <div className="modalbtn">
                            <Button key={2}  onClick={this.handleSubmit} type="primary" ghost>保存</Button>
                            <Button key={3} onClick={this.handleSubmit} type="primary">保存并继续</Button>
                            </div>
                        }
                    >
                        <div className={style.main}>
                            <Form onSubmit={this.handleSubmit}>
                                <div className={style.content}>
                                    <Row  type="flex">
                                        <Col span={12}>
                                            <Form.Item label={intl.get('wsd.i18n.plan.fileinfo.filename')} {...formItemLayout}>
                                                {getFieldDecorator('fileName', {
                                                    initialValue: this.state.info.fileName,
                                                    rules: [{
                                                        required: true,
                                                        message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.plan.fileinfo.filename'),
                                                    }],
                                                })(
                                                    <Input />
                                                )}
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item label={intl.get('wsd.i18n.plan.fileinfo.fileversion')} {...formItemLayout}>
                                                {getFieldDecorator('fileVersion', {
                                                    initialValue: this.state.info.fileVersion,
                                                    rules: [],
                                                })(
                                                    <Select>
                                                        <Option value="A203">A203</Option>
                                                        <Option value="A201">A201</Option>

                                                    </Select>
                                                )}
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row >                                                                     <Col span={12}>
                                        <Form.Item label={intl.get('wsd.i18n.plan.fileinfo.creattime')} {...formItemLayout}>
                                            {getFieldDecorator('creatTime', {
                                                initialValue: this.state.info.creatTime,
                                                rules: [],
                                            })(
                                                <DatePicker style={{ width: "100%" }} />
                                            )}
                                        </Form.Item>
                                    </Col>
                                        <Col span={12}>
                                            <Form.Item label={intl.get('wsd.i18n.plan.fileinfo.creator')} {...formItemLayout}>
                                                {getFieldDecorator('creator', {
                                                    initialValue: this.state.info.creator,
                                                    rules: [],
                                                })(
                                                    <Input />
                                                )}
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span={24}>
                                            <Form.Item label={intl.get('wsd.i18n.plan.fileinfo.remark')} {...formItemLayout1}>
                                                {getFieldDecorator('remark', {
                                                    initialValue: this.state.info.remark,
                                                    rules: [],
                                                })(
                                                    <TextArea rows={2} />
                                                )}
                                            </Form.Item>
                                        </Col>
                                    </Row>

                                </div>

                            </Form>
                            <div className={style.Modifytable}>
                                <div className={style.tip}>
                                    <p><Icon type="unlock" />选择文件</p>
                                </div>
                                <Table columns={columns} dataSource={this.state.data} pagination={false} name={this.props.name} />
                            </div>
                        </div>
                    </Modal>
                }
            </div>
        )
    }
}
const MenuInfos = Form.create()(MenuInfo);
export default MenuInfos
// {
//               "wsd.i18n.plan.fileinfo.filename" : "文件名称",
//             "wsd.i18n.plan.fileinfo.fileversion" : "版本号",
//             "wsd.i18n.plan.fileinfo.creattime" : "创建时间",
//             "wsd.i18n.plan.fileinfo.creator" : "创建人",
//             "wsd.i18n.plan.fileinfo.remark" : "备注",
//     }
