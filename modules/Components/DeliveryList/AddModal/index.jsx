import React, { Component } from 'react'
import style from './style.less'
import { Form, Row, Col, Input, Button, Icon,TreeSelect, Select, DatePicker, Modal, InputNumber } from 'antd';
import intl from 'react-intl-universal'
import moment from 'moment';
import '../../../../asserts/antd-custom.less'
import * as dataUtil from '../../../../utils/dataUtil';
import axios from "../../../../api/axios"
import {
    getBaseSelectTree,
    getPbsSelectTree,
} from "../../../../api/api"

const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;
class MenuInfo extends Component {
    constructor(props) {
        super(props)
        this.state = {
            initDone: false,
            visible: true,
            info: {},
            docData: [],
            pbsSelectData: [],
            
        }
    }

    showModal = () => {
        this.setState({
            visible: true,
        });
    }

    handleCancel = (e) => {
        this.props.handleCancel()
    }

    handleSubmit = (type, e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.props.addPlanDelvAssign(values)
                if (!type) {
                    this.props.handleCancel()
                }
                this.props.form.resetFields();
            }
        });
    }

    // 获取下拉框字典
    getBaseSelectTree = (typeCode) => {
        axios.get(getBaseSelectTree(typeCode)).then(res => {
            const { data } = res.data
            // 初始化字典-文档类型
            if (typeCode == 'plan.delv.type') {
                this.setState({
                    docData: data
                })
            }
        })
    }
    // 获取下拉计划级别
    getPlanLevelList = () => {
        if (!this.state.dataplanlevelList) {
            axios.get(getBaseSelectTree("plan.task.planlevel")).then(res => {
                const { data } = res.data
                if (data) {
                    this.setState({
                        planlevelList: data
                    })
                }
            })
        }

    }

    //初始化字典-文档类型
    onDocDataChange = () => {
        const { docData } = this.state
        if (!docData.length > 0) {
            this.getBaseSelectTree('plan.delv.type')
        }
    }

    //获取PBS下拉
    getPbsSelectData = () => {
        const { pbsSelectData } = this.state
        let { rightData } = this.props
        const { selectData } = this.state
        Array.isArray(rightData) ? null : rightData = [rightData]
        if (!pbsSelectData.length > 0) {
            axios.get(getPbsSelectTree(rightData[0]['projectId'])).then(res => {
                const { data } = res.data
                this.setState({
                    pbsSelectData: data || []
                })
            })
        }
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

        const rightData = this.props.rightData ? Array.isArray(this.props.rightData) ? this.props.rightData[0] : this.props.rightData : null
        return (
            <div className={style.main}>
                <Modal title="新增交付清单" visible={true} onCancel={this.props.handleCancel} width="800px"
                    footer={
                        <div className="modalbtn">
                            <Button key="1" onClick={this.handleSubmit.bind(this, true)}>保存并继续</Button>
                            <Button key="2" type="primary" onClick={this.handleSubmit.bind(this, false)}>保存</Button>
                        </div>
                    }>
                    <Form onSubmit={this.handleSubmit}>
                        <div className={style.content}>
                            <Row type="flex">
                                <Col span={12}>
                                    <Form.Item label={intl.get('wsd.i18n.plan.delvList.delvname')} {...formItemLayout}>
                                        {getFieldDecorator('delvTitle', {
                                            initialValue: this.state.info.delvTitle,
                                            rules: [{
                                                required: true,
                                                message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.plan.delvList.delvname'),
                                            }],
                                        })(
                                            <Input />
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label={intl.get('wsd.i18n.plan.delvList.delvcode')} {...formItemLayout}>
                                        {getFieldDecorator('delvCode', {
                                            initialValue: this.state.info.delvCode,
                                            rules: [{
                                                required: true,
                                                message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.plan.delvList.delvcode'),
                                            }],
                                        })(
                                            <Input />
                                        )}
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <Form.Item label={intl.get('wsd.i18n.plan.delvList.plandelvnum')} {...formItemLayout}>
                                        {getFieldDecorator('delvNum', {
                                            initialValue: this.state.info.delvNum,
                                            rules: [],
                                        })(
                                            <InputNumber style={{ width: "100%" }} />
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label={intl.get('wsd.i18n.plan.delvList.delvtype')} {...formItemLayout}>
                                        {getFieldDecorator('delvType', {
                                            initialValue: this.state.info.delvType,
                                            rules: [],
                                        })(
                                            <Select onFocus={this.onDocDataChange}>
                                                {
                                                    this.state.docData.map((v, i) => {
                                                        return <Option value={v.value} key={i}>{v.title}</Option>
                                                    })
                                                }
                                            </Select>
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label="PBS" {...formItemLayout}>
                                        {getFieldDecorator('parentId', {
                                            initialValue: this.state.info.parentId,
                                            rules: [],
                                        })(
                                            // <Select onFocus={this.getPbsSelectData}>
                                            //     {
                                            //         this.state.pbsSelectData.map((v, i) => {
                                            //             return <Option value={v.value} key={i}>{v.title}</Option>
                                            //         })
                                            //     }
                                            // </Select>
                                              <TreeSelect
                                              style={{width: "100%"}}
                                              dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
                                              treeData={this.state.pbsSelectData}
                                              treeDefaultExpandAll
                                              onFocus={this.getPbsSelectData}
                                            />
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label="计划级别" {...formItemLayout}>
                                        {getFieldDecorator('planLevel', {

                                            rules: [],
                                        })(
                                            <Select onDropdownVisibleChange={this.getPlanLevelList}>
                                                {
                                                    this.state.planlevelList && this.state.planlevelList.map((v, i) => {
                                                        return <Option value={v.value} key={i}>{v.title}</Option>
                                                    })
                                                }
                                            </Select>
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label="计划开始时间" {...formItemLayout}>
                                        {getFieldDecorator('planStartTime', {
                                            initialValue: dataUtil.Dates().formatTimeMonent(rightData.planStartTime),
                                            rules: [],
                                        })(
                                            <DatePicker style={{ width: "100%" }} format={this.props.projSet.dateFormat}
                                                showTime={{ format: 'HH:mm', defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                                            />
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label="计划完成时间" {...formItemLayout}>
                                        {getFieldDecorator('planEndTime', {
                                            initialValue: dataUtil.Dates().formatTimeMonent(rightData.planEndTime),
                                            rules: [],
                                        })(
                                            <DatePicker style={{ width: "100%" }} format={this.props.projSet.dateFormat}
                                            showTime={{ format: 'HH:mm', defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                                        />
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
const MenuInfos = Form.create()(MenuInfo);
export default MenuInfos
