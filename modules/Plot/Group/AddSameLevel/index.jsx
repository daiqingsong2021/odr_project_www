import React, { Component } from 'react'
import style from './style.less'
import { Form, Row, Col, Input, Select, Modal, TreeSelect } from 'antd';
import SubmitButton from "../../../../components/public/TopTags/SubmitButton"
import { connect } from 'react-redux'
import axios from '../../../../api/axios'
import { epsAdd, orgTree, orgPer, getdictTree } from '../../../../api/api'
const Option = Select.Option;
const { TextArea } = Input;

class AddSameLevel extends Component {
    constructor(props) {
        super(props)
        this.state = {

            info: {},
            orgTree: [],
            orgPer: [],
            orgTreeKey: '',
            selectChange: null,
            secutyLevelList1: [{ value: "1", title: "非密" }]//默认密级
        }
    }

    getData = () => {
        axios.get(orgTree).then(res => {
            this.setState({ orgTree: res.data.data })
        })
    }

    componentDidMount() {
        this.getData();
    }

    handleCancel = (e) => {

        this.props.handleCancel()
    }
    //获取密级
    getSecutyLevelList = () => {
        if (!this.state.secutyLevelList) {
            axios.get(getdictTree("comm.secutylevel")).then(res => {
                if (res.data.data) {
                    this.setState({
                        secutyLevelList: res.data.data,
                        secutyLevelList1: null
                    })
                }
            })
        }

    }
    handleSubmit = (val) => {

        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {

                let data = {
                    ...values,
                    parentId: this.props.data ? this.props.data.id : 0
                }

                axios.post(epsAdd, data, true,null,true).then(res => {
                    this.props.addData(res.data.data)
                    if (val == 'save') {
                        this.props.handleCancel();
                    } else {
                        this.props.form.resetFields();
                        this.setState({ orgPer: [] });
                    }
                })

            }
        });
    }

    change = (v) => {
        axios.get(orgPer(v)).then(res => {
            this.setState({ orgPer: res.data.data })
            // this.props.form.resetFields();
            this.props.form.resetFields(`userId`, []);
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
                <Modal title="新增" visible={true}
                    onCancel={this.handleCancel}
                    width="800px"
                    mask={false}
                    maskClosable={false}
                    footer={
                        <div className="modalbtn">

                            <SubmitButton key={3} onClick={this.handleSubmit.bind(this, 'goOn')} content="保存并继续" />
                            <SubmitButton key={2} onClick={this.handleSubmit.bind(this, 'save')} type="primary" content="保存" />
                        </div>
                    }
                >
                    <Form onSubmit={this.handleSubmit}>
                        <div className={style.content}>
                            <Row type="flex">
                                <Col span={12}>
                                    <Form.Item label={intl.get('wsd.i18n.pre.epsInfo.projectname')} {...formItemLayout}>
                                        {getFieldDecorator('name', {
                                            initialValue: this.state.info.name,
                                            rules: [{
                                                required: true,
                                                message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.pre.epsInfo.projectname'),
                                            }],
                                        })(
                                            <Input maxLength={85}/>
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label={intl.get('wsd.i18n.pre.epsInfo.projectcode')} {...formItemLayout}>
                                        {getFieldDecorator('code', {
                                            initialValue: this.state.info.code,
                                            rules: [{
                                                required: true,
                                                message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.pre.epsInfo.projectcode'),
                                            }],
                                        })(
                                            <Input maxLength={33}/>
                                        )}
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row >
                                <Col span={12}>
                                    <Form.Item label={intl.get('wsd.i18n.pre.epsInfo.iptname')} {...formItemLayout}>
                                        {getFieldDecorator('orgId', {
                                            rules: [{
                                                required: true,
                                                message: intl.get('wsd.i18n.message.select') + intl.get('wsd.i18n.pre.epsInfo.iptname'),
                                            }],
                                        })(
                                            <TreeSelect
                                                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                                treeData={this.state.orgTree}
                                                treeDefaultExpandAll
                                                onChange={this.change}
                                            />
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label={intl.get('wsd.i18n.base.planTemAddTask.username')} {...formItemLayout}>
                                        {getFieldDecorator('userId', {
                                            initialValue: this.state.orgPer.length ? '' : '',
                                            rules: [{
                                                required: false,
                                                message: intl.get('wsd.i18n.message.select') + intl.get('wsd.i18n.base.planTemAddTask.username'),
                                            }],
                                        })(
                                            <Select
                                                allowClear showSearch
                                                optionFilterProp="children"
                                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                            >
                                                {this.state.orgPer.length &&
                                                    this.state.orgPer.map((val) => {
                                                        return (
                                                            <Option key={val.id} value={val.id}>{val.title}</Option>
                                                        )
                                                    })
                                                }
                                            </Select>
                                        )}
                                    </Form.Item>
                                </Col>
                            </Row>
                            {/* <Row>
                                <Col span={12}>
                                    <Form.Item label="密级" {...formItemLayout}>
                                        {getFieldDecorator('secutyLevel', {
                                            initialValue: "1",
                                            rules: [{
                                                required: true,
                                                message: intl.get('wsd.i18n.message.select') + "密级",
                                            }],
                                        })(
                                            <Select onDropdownVisibleChange={this.getSecutyLevelList}>
                                                {this.state.secutyLevelList1 ? this.state.secutyLevelList1.map(item => {
                                                    return <Option value={item.value} key={item.value}>{item.title}</Option>
                                                }) : this.state.secutyLevelList && this.state.secutyLevelList.map(item => {
                                                    return <Option value={item.value} key={item.value}>{item.title}</Option>
                                                })}
                                            </Select>
                                        )}
                                    </Form.Item>
                                </Col>
                            </Row> */}
                            <Row>
                                <Col span={24}>
                                    <Form.Item label={intl.get('wsd.i18n.pre.epsInfo.remark')} {...formItemLayout1}>
                                        {getFieldDecorator('remark', {
                                            initialValue: this.state.info.remark,
                                            rules: [],
                                        })(
                                            <TextArea maxLength={666} rows={2} />
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
const AddSameLevels = Form.create()(AddSameLevel);
export default connect(state => ({
    currentLocale: state.localeProviderData
}))(AddSameLevels);
