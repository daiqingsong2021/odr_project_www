import React, { Component } from 'react'
import style from './style.less'
import { Form, Row, Col, Input, Button, Icon, Select, DatePicker } from 'antd';
import intl from 'react-intl-universal'
import moment from 'moment';
const locales = {
    "en-US": require('../../../../../api/language/en-US.json'),
    "zh-CN": require('../../../../../api/language/zh-CN.json')
}
const FormItem = Form.Item;
const Option = Select.Option;
let id = 0;
class DocumentSet extends Component {
    constructor(props) {
        super(props)
        this.state = {
            initDone: false,
            info: {
                key: 1,
                id: 1,
                timeWh: 1,
                timeDrtn: 1,
                timeFormat: 1,
            }
        }
    }
    componentDidMount() {
        this.loadLocales();
        this.props.getDocInfo()
    }

    loadLocales() {
        intl.init({
            currentLocale: 'zh-CN',
            locales,
        }).then(() => {
            this.setState({ initDone: true });
        });
    }
    remove = (k) => {
        const { form } = this.props;
        // can use data-binding to get
        const keys = form.getFieldValue('keys');
        // We need at least one passenger
        if (keys.length === 1) {
            return;
        }

        // can use data-binding to set
        form.setFieldsValue({
            keys: keys.filter(key => key !== k),
        });
    }

    add = () => {
        const { form } = this.props;
        const keys = form.getFieldValue('keys');
        const nextKeys = keys.concat(id++);
        form.setFieldsValue({
            keys: nextKeys,
        });
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                const data = {
                    banFileType: Object.values(values.banFileType),
                    uploadMax: values.uploadMax
                }
                this.props.updateSetDoc(data)
            }
        });
    }

    render() {
        const initData = this.props.data
        const {
            getFieldDecorator, getFieldsError, getFieldError, isFieldTouched, getFieldValue
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
        const formItemLayoutWithOutLabel = {
            wrapperCol: {
                xs: { span: 24, offset: 0 },
                sm: { span: 20, offset: 4 },
            },
        };
        getFieldDecorator('keys', { initialValue: initData.banFileType ? initData.banFileType : [] });
        const keys = getFieldValue('keys');
        const formItems = keys.map((k, index) => (
            <Form.Item
                {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                label={index === 0 ? '禁止文件格式' : ''}
                required={false}
                key={k}
            >
                {getFieldDecorator(`banFileType[${k}]`, {
                    validateTrigger: ['onChange', 'onBlur'],
                    initialValue: typeof k == 'string' ? k : '',
                    rules: [{
                        required: true,
                        message: "请输入禁止文件格式",
                    }],
                })(
                    <Input maxLength={10} style={{ width: keys.length > 1 ? 'calc(100% - 45px)' : 'calc(100% - 81px)' }} addonAfter={keys.length > 1 ? <Icon type="minus-circle-o" disabled={keys.length === 1} onClick={() => this.remove(k)} /> : null} />
                )}
            </Form.Item>
        ));
        return (
            <div className={style.main}>
                <div className={style.mainScorll}>
                    <Form onSubmit={this.handleSubmit}>
                        <div className={style.content}>
                            <Row >
                                <Col span={15}>
                                    <Form.Item label="上传文件大小" {...formItemLayout}>
                                        {getFieldDecorator('uploadMax', {
                                            initialValue: initData.uploadMax,
                                            rules: [{
                                                required: true,
                                                message: "请输入文件大小",
                                            },
                                            {pattern:/^(0\.0*[1-9]+[0-9]*$|[1-9]+[0-9]*\.[0-9]*[0-9]$|[1-9]+[0-9]*$)/,message: "文件大小设置为大于0，禁止负数和0"}],
                                        })(
                                            <Input type="number" addonAfter="MB（≤）" />
                                        )}
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={15}>
                                    {formItems}
                                    <Form.Item {...formItemLayoutWithOutLabel}>
                                        <Button type="dashed" style={{ width: 'calc(100% - 81px)' }} block onClick={this.add}>
                                            <Icon type="plus" /> 添加
                                        </Button>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={15}>
                                    <Col span={8} offset={4}>
                                        <Button onClick={this.handleSubmit} type="primary" style={{ width: 100, textAlign: 'center' }}>更新设置</Button>
                                    </Col>
                                </Col>
                            </Row>
                        </div>

                    </Form>
                </div>
            </div>
        )
    }
}

const DocumentSets = Form.create()(DocumentSet);
export default DocumentSets