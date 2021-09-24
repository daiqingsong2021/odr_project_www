import React, { Component } from 'react'
import style from './style.less'
import { Form, Row, Col, Input, Button, Icon, Select, DatePicker, Modal, InputNumber, Switch } from 'antd';
import axios from "../../../../../api/axios"
import { baseDigitDir, coderulecell, addCoderulecell, getcoderuletype, updateCoderulecell } from "../../../../../api/api"
import { connect } from 'react-redux';
const FormItem = Form.Item;
const { TextArea } = Input;
const Option = Select.Option
class CheckModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selectValue: "ATTRIBUTE",
            info: {}
        }
    }
    getInfo = () => {
        axios.get(coderulecell(this.props.ruleId, this.props.position)).then(res => {
            this.setState({
                info: res.data.data
            }, () => {
                this.setState(preState => ({
                    selectValue: preState.info.ruleTypeVo.id
                }))
            })
        })
    }
    componentDidMount() {
        if (this.props.type == "modify") {
            this.getInfo()
        }

        axios.get("api/base/dict/base.coderule.connector/select/tree").then(res => {
            if (res.data.data) {
                this.setState({
                    digitDir: res.data.data
                })
            }

        })
        axios.get(getcoderuletype(this.props.boId)).then(res => {
            if (res.data.data) {
                this.setState({
                    coderuletype: res.data.data
                })
            }
        })
    }



    handleSubmit = (e) => {
        e.preventDefault();
        const { intl } = this.props.currentLocale
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                const { selectValue, coderuletype } = this.state
                let data
                //根据类型处理数据
                //固定值
                if (selectValue == "FIXED_VALUE") {
                    data = {
                        ...values,
                        position: this.props.position,
                        ruleId: this.props.ruleId,
                        ruleCellName: "固定值-" + values.cellValue
                    }
                    // delete data.cellValue
                }
                //流水号
                if (selectValue == "SEQUENCE") {

                    data = {
                        ...values,
                        position: this.props.position,
                        ruleId: this.props.ruleId,
                        ruleCellName: "流水号",
                        ruleTypeId: values.cellValue
                    }
                }
                //属性
                if (selectValue == "ATTRIBUTE") {
                    let index = coderuletype.findIndex(item => item.id == values.cellValue)
                    let name = coderuletype[index].ruleTypeName

                    data = {
                        ...values,
                        position: this.props.position,
                        ruleId: this.props.ruleId,
                        ruleCellName: name,
                        ruleTypeId: values.cellValue
                    }
                    delete data.cellValue
                }
                if (this.props.type == "add") {
                    axios.post(addCoderulecell, data, true).then(res => {
                        this.props.updateNode(res.data.data)
                        this.props.form.resetFields();
                        this.props.handleCancel()
                    })
                    return
                }
                if (this.props.type == "modify") {
                    data.id = this.state.info.id
                    axios.put(updateCoderulecell, data, true).then(res => {
                        this.props.updateNode(res.data.data)
                        this.props.handleCancel()
                    })
                }
            }
        });
    }

    onSelect = (value) => {
        this.setState({
            selectValue: value
        })
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

        return (
            <div className={style.main}>
                {/* <h2>{intl.get('wbs.add.name')}</h2>*/}
                <Modal
                    className={style.formMain}
                    width="850px"
                    mask={false}
                    maskClosable={false}
                    centered={true}
                    title={`${intl.get("wsd.i18n.base.coderulde.node")}${this.props.position}${intl.get("wsd.i18n.base.coderulde.period")}`}
                    visible={true} onCancel={this.props.handleCancel}
                    footer={
                        <div className='modalbtn'>
                            <Button key="submit1" onClick={this.props.handleCancel}>{intl.get("wsd.global.btn.cancel")}</Button>
                            <Button key="submit2" type="primary" onClick={this.handleSubmit}>{intl.get("wsd.global.btn.preservation")}</Button>
                        </div>
                    }>
                    {this.state.selectValue == "ATTRIBUTE" &&
                        <Form onSubmit={this.handleSubmit}>
                            <div className={style.content}>
                                <Row  >
                                    <Col span={12}>
                                        <Form.Item
                                            label={intl.get("wsd.i18n.base.coderulde.type")} {...formItemLayout}>
                                            {getFieldDecorator('ruleType', {
                                                initialValue: this.state.selectValue,
                                                rules: [],
                                            })(
                                                <Select onSelect={this.onSelect}>
                                                    <Option value="ATTRIBUTE">{intl.get("wsd.i18n.base.coderulde.attribute")}</Option>
                                                    <Option value="FIXED_VALUE">{intl.get("wsd.i18n.base.coderulde. fixedvalue")}</Option>
                                                    <Option value="SEQUENCE">{intl.get("wsd.i18n.base.coderulde.serialnumber")}</Option>
                                                </Select>
                                            )}
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            label={intl.get("wsd.i18n.base.coderulde.value")} {...formItemLayout}>
                                            {getFieldDecorator('cellValue', {
                                                initialValue: this.state.info.ruleTypeIdVo ? this.state.info.ruleTypeIdVo.id : null,
                                                rules: [],
                                            })(
                                                <Select >
                                                    {this.state.coderuletype && this.state.coderuletype.map(item => {
                                                        return <Option value={item.id} key={item.id}>{item.ruleTypeName}</Option>
                                                    })}
                                                </Select>
                                            )}
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row  >
                                    <Col span={12}>
                                        <Form.Item
                                            label={intl.get("wsd.i18n.base.coderulde.fixedlength")} {...formItemLayout}>
                                            {getFieldDecorator('maxLength', {
                                                initialValue: this.state.info.maxLength,
                                                rules: [],
                                            })(
                                                <InputNumber maxLength={20} style={{ width: "100%" }} />

                                            )}
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        {/* { 填充字符} */}
                                        <Form.Item
                                            label={intl.get("wsd.i18n.base.coderulde.fillcharacter")} {...formItemLayout}>
                                            {getFieldDecorator('fillChar', {
                                                initialValue: this.state.info.fillChar,
                                                rules: [{
                                                    max: 1,
                                                    message: intl.get('wsd.i18n.message.maxlength'),
                                                }],
                                            })(
                                                <Input />
                                            )}
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row  >
                                    <Col span={12}>
                                        {/* { 连接符} */}
                                        <Form.Item
                                            label={intl.get("wsd.i18n.base.coderulde.connector")} {...formItemLayout}>
                                            {getFieldDecorator('connector', {
                                                initialValue: this.state.info.connectorVo ? this.state.info.connectorVo.id : null,
                                                rules: [],
                                            })(
                                                <Select>
                                                    {this.state.digitDir && this.state.digitDir.map(item => {
                                                        return <Option value={item.value} key={item.value}>{item.title}</Option>
                                                    })}
                                                </Select>
                                            )}
                                        </Form.Item>
                                    </Col>

                                </Row>
                            </div>

                        </Form>
                    }
                    {this.state.selectValue == "FIXED_VALUE" &&
                        <Form onSubmit={this.handleSubmit}>
                            <div className={style.content}>
                                <Row  >
                                    {/* { 类型} */}
                                    <Col span={12}>
                                        <Form.Item
                                            label={intl.get("wsd.i18n.base.coderulde.type")} {...formItemLayout}>
                                            {getFieldDecorator('ruleType', {
                                                initialValue: this.state.selectValue,
                                                rules: [],
                                            })(
                                                <Select onSelect={this.onSelect}>
                                                    <Option value="ATTRIBUTE">{intl.get("wsd.i18n.base.coderulde.attribute")}</Option>
                                                    <Option value="FIXED_VALUE">{intl.get("wsd.i18n.base.coderulde. fixedvalue")}</Option>
                                                    <Option value="SEQUENCE">{intl.get("wsd.i18n.base.coderulde.serialnumber")}</Option>
                                                </Select>
                                            )}
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        {/* { 值} */}
                                        <Form.Item
                                            label={intl.get("wsd.i18n.base.coderulde.value")} {...formItemLayout}>
                                            {getFieldDecorator('cellValue', {
                                                initialValue: this.state.info.cellValue,
                                                rules: [{
                                                    required: true,
                                                    message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.base.coderulde.value'),
                                                }],
                                            })(
                                                <Input maxLength={22}/>
                                            )}
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row  >
                                    {/* { 固定长度} */}
                                    <Col span={12}>
                                        <Form.Item
                                            label={intl.get("wsd.i18n.base.coderulde.fixedlength")} {...formItemLayout}>
                                            {getFieldDecorator('maxLength', {
                                                initialValue: this.state.info.maxLength,
                                                rules: [],
                                            })(
                                                <InputNumber maxLength={20} style={{ width: "100%" }} />

                                            )}
                                        </Form.Item>
                                    </Col>
                                    {/* { 填充字符} */}
                                    <Col span={12}>
                                        <Form.Item
                                            label={intl.get("wsd.i18n.base.coderulde.fillcharacter")} {...formItemLayout}>
                                            {getFieldDecorator('fillChar', {
                                                initialValue: this.state.info.fillChar,
                                                rules: [{
                                                    max: 1,
                                                    message: intl.get('wsd.i18n.message.maxlength'),
                                                }],
                                            })(
                                                <Input />
                                            )}
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row  >
                                    <Col span={12}>
                                        {/* { 连接符} */}
                                        <Form.Item
                                            label={intl.get("wsd.i18n.base.coderulde.connector")} {...formItemLayout}>
                                            {getFieldDecorator('connector', {
                                                initialValue: this.state.info.connectorVo ? this.state.info.connectorVo.id : null,
                                                rules: [],
                                            })(
                                                <Select>
                                                    {this.state.digitDir && this.state.digitDir.map(item => {
                                                        return <Option value={item.value} key={item.value}>{item.title}</Option>
                                                    })}
                                                </Select>
                                            )}
                                        </Form.Item>
                                    </Col>

                                </Row>
                            </div>

                        </Form>
                    }
                    {this.state.selectValue == "SEQUENCE" &&
                        <Form onSubmit={this.handleSubmit}>
                            <div className={style.content}>
                                <Row  >
                                    <Col span={12}>
                                        {/* { 类型} */}
                                        <Form.Item
                                            label={intl.get("wsd.i18n.base.coderulde.type")} {...formItemLayout}>
                                            {getFieldDecorator('ruleType', {
                                                initialValue: this.state.selectValue,
                                                rules: [],
                                            })(
                                                <Select onSelect={this.onSelect}>
                                                    <Option value="ATTRIBUTE">{intl.get("wsd.i18n.base.coderulde.attribute")}</Option>
                                                    <Option value="FIXED_VALUE">{intl.get("wsd.i18n.base.coderulde. fixedvalue")}</Option>
                                                    <Option value="SEQUENCE">{intl.get("wsd.i18n.base.coderulde.serialnumber")}</Option>
                                                </Select>
                                            )}
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        {/* { 连接符} */}
                                        <Form.Item
                                            label={intl.get("wsd.i18n.base.coderulde.connector")} {...formItemLayout}>
                                            {getFieldDecorator('connector', {
                                                initialValue: this.state.info.connectorVo ? this.state.info.connectorVo.id : null,
                                                rules: [],
                                            })(
                                                <Select>
                                                    {this.state.digitDir && this.state.digitDir.map(item => {
                                                        return <Option value={item.value} key={item.value}>{item.title}</Option>
                                                    })}
                                                </Select>
                                            )}
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row  >
                                    {/* { 固定长度} */}
                                    <Col span={12}>
                                        <Form.Item
                                            label={intl.get("wsd.i18n.base.coderulde.fixedlength")} {...formItemLayout}>
                                            {getFieldDecorator('maxLength', {
                                                initialValue: this.state.info.maxLength,
                                                rules: [],
                                            })(
                                                <InputNumber max={20} style={{ width: "100%" }} />

                                            )}
                                        </Form.Item>
                                    </Col>
                                    {/* { 填充字符} */}
                                    <Col span={12}>
                                        <Form.Item
                                            label={intl.get("wsd.i18n.base.coderulde.fillcharacter")} {...formItemLayout}>
                                            {getFieldDecorator('fillChar', {
                                                initialValue: this.state.info.fillChar,
                                                rules: [{
                                                    max: 1,
                                                    message: intl.get('wsd.i18n.message.maxlength'),
                                                }],
                                            })(
                                                <Input />
                                            )}
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row  >
                                    {/* 流水号最小号 */}
                                    <Col span={12}>
                                        <Form.Item
                                            label={intl.get("wsd.i18n.base.coderulde.minnumber")} {...formItemLayout}>
                                            {getFieldDecorator('seqMinValue', {
                                                initialValue: this.state.info.seqMinValue,
                                                rules: [{
                                                    required: true,
                                                    message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.base.coderulde.minnumber'),
                                                },
                                                {
                                                    pattern: /^[1-9]{1}[0-9]*$/,
                                                    message: intl.get('wsd.i18n.base.coderulde.isnumber')
                                                }],
                                            })(
                                                <InputNumber style={{ width: "100%" }} />
                                            )}
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        {/* 流水号步长 */}
                                        <Form.Item
                                            label={intl.get("wsd.i18n.base.coderulde.numbersteps")} {...formItemLayout}>
                                            {getFieldDecorator('seqSteep', {
                                                initialValue: this.state.info.seqSteep,
                                                rules: [{
                                                    required: true,
                                                    message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.base.coderulde.numbersteps'),
                                                },
                                                {
                                                    pattern: /^[1-9]{1}[0-9]*$/,
                                                    message: intl.get('wsd.i18n.base.coderulde.isnumber')
                                                }],
                                            })(
                                                <Input />
                                            )}
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </div>

                        </Form>
                    }
                </Modal>
            </div >
        )
    }
}
const CheckModals = Form.create()(CheckModal);
export default connect(state => ({ currentLocale: state.localeProviderData }))(CheckModals);
