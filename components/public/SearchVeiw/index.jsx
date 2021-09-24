import React, { Component } from 'react'
import style from './style.less'
import { Icon, Select, Input, DatePicker, TreeSelect, Radio, Checkbox, Button, Form, Row, Col, Popover, Modal } from 'antd'
import { connect } from 'react-redux'
import moment from "moment"
import { defineOrgTree, defineOrgUserList, getViewInfo, updateView, saveView } from "../../../api/api"
import axios from "../../../api/axios"
import * as dataUtil from "../../../utils/dataUtil"
const { TextArea } = Input;
const FormItem = Form.Item;
const { Option } = Select;
export class Search extends Component {
    constructor(props) {
        super(props)
        this.state = {
            orgTree: [],
            orgUserList: [],
            info: {},
        }
    }
    componentDidMount() {
        if (this.props.onRef) {
            this.props.onRef(this);
        }

    }

    //获取视图详情
    getFormData = () => {
        axios.get(getViewInfo(this.props.viewBtn.state.selectId)).then(res => {
            const data = res.data.data
            if (data) {
                const info = data.viewContent ? JSON.parse(data.viewContent) : {}
                if (info.orgId) {
                    this.defineOrgUserList(info.orgId)
                    // 根据责任主体id获取责任人列表
                        axios.get(defineOrgUserList(info.orgId)).then(res => {
                            this.setState({
                                orgUserList: res.data.data || []
                            },()=>{
                                this.setState({
                                    data,
                                    info
                                })
                            })
                        })          
                }else{
                    this.setState({
                        data,
                        info
                    })
                }
            }

        })
    }
    change = (e) => {
        this.setState({
            value: e.target.value
        })
    }

    click() {
        if (this.props.search) {
            this.props.search(this.input.value)
        }

    }
    //气泡显影
    handleClickChange = visible => {
        this.setState({
            clicked: visible,
        }, () => {

            if (visible && !this.state.data) {
                if (this.state.orgTree.length == 0) {
                    axios.get(defineOrgTree(this.props.projectId)).then(res => {
                        const { data } = res.data
                        this.setState({
                            orgTree: data ? data : [],
                        }, () => {
                            this.getFormData()
                        })
                    })
                } else {
                    this.getFormData()
                }
            }
        });
    };
    treeSelectChange = (value) => {
        this.props.form.setFieldsValue({ userId: null })
    }
    //选择时间范围
    selectTimeRange = (e) => {
        let range = e.target.value
        if (range == 1) {
            //获取本周
            const startDate = moment().week(moment().week()).startOf('week').format('YYYY-MM-DD');
            const endDate = moment().week(moment().week()).endOf('week').format('YYYY-MM-DD');
            this.setState({
                timeRangeStr: startDate + "至" + endDate
            })
        }
        if (range == 2) {
            //获取本月 
            const startDate = moment().month(moment().month()).startOf('month').format('YYYY-MM-DD');
            const endDate = moment().month(moment().month()).endOf('month').format('YYYY-MM-DD');
            this.setState({
                timeRangeStr: startDate + "至" + endDate
            })
        }
        if (range == 3) {
            //获取本月 
            const startDate = moment().quarter(moment().quarter()).startOf('quarter').format('YYYY-MM-DD');
            const endDate = moment().quarter(moment().quarter()).endOf('quarter').format('YYYY-MM-DD');
            this.setState({
                timeRangeStr: startDate + "至" + endDate
            })
        }
        if (range == 4) {
            //获取本年
            const startDate = moment().year(moment().year()).startOf('year').format('YYYY-MM-DD');
            const endDate = moment().year(moment().year()).endOf('year').format('YYYY-MM-DD');
            this.setState({
                timeRangeStr: startDate + "至" + endDate
            })
        }
    }
    //保存视图
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                const formData = {
                    ...values,
                    planStartTime: dataUtil.Dates().formatDateString(values.planStartTime),
                    planEndTime: dataUtil.Dates().formatDateString(values.planEndTime),
                    startTime: dataUtil.Dates().formatDateString(values.startTime),
                    endTime: dataUtil.Dates().formatDateString(values.endTime),
                }
                const { data } = this.state
                data.viewContent = JSON.stringify(formData)
                axios.put(updateView, data, true, null, true).then(res => {

                })
            }
        })
    }
    //另存为视图
    saveView = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                if (!this.state.viewName || this.state.viewName.trim() == "") {
                    dataUtil.message("请填写视图名称")
                }
                const formData = {
                    ...values,
                    planStartTime: dataUtil.Dates().formatDateString(values.planStartTime),
                    planEndTime: dataUtil.Dates().formatDateString(values.planEndTime),
                    startTime: dataUtil.Dates().formatDateString(values.startTime),
                    endTime: dataUtil.Dates().formatDateString(values.endTime),
                }
                let obj = {
                    viewContent: JSON.stringify(formData),
                    viewName: this.state.viewName,
                    bizType: this.props.bizType
                }

                axios.post(saveView, obj, true, null, true).then(res => {
                    const list = this.props.viewBtn.state.list || []
                    list.push(res.data.data)
                    this.props.viewBtn.setList(list)
                    this.setState({ clicked1: false })
                })
            }
        })
    }
    // 获取责任主体列表
    defineOrgTree = () => {
        if (this.state.orgTree.length == 0) {
            axios.get(defineOrgTree(this.props.projectId)).then(res => {
                const { data } = res.data
                this.setState({
                    orgTree: data ? data : [],
                })
            })
        }
    }
    changeDefineOrg = (orgId) => {
        this.props.form.setFieldsValue({ userId: null })
        this.defineOrgUserList(orgId)
    }

    render() {
        const { intl } = this.props.currentLocale
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
                sm: { span: 16 },
            },
        };
        const formLayout = {
            labelCol: {
                sm: { span: 4 },
            },
            wrapperCol: {
                sm: { span: 20 },
            }
        }
        const content2 = (<div>
            <p>视图名称：<Input style={{ width: 150 }} onChange={e => this.setState({ viewName: e.currentTarget.value })} /></p>
            <div align="right"><Button type="primary" onClick={this.saveView}>保存</Button></div>
        </div>)
        const content = (
            <Form onSubmit={this.handleSubmit} style={{ width: 480 }} className={style.formstyle}>
                <div className={style.content}>
                    <Row >
                        <Col span={24}>
                            <Form.Item label="名称/代码" >
                                {getFieldDecorator('nameOrCode', {
                                    initialValue: this.state.info.nameOrCode,
                                })(
                                    <Input />
                                )}
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <Form.Item label="责任主体" >
                                {getFieldDecorator('orgId', {
                                    initialValue: this.state.info.orgId,
                                })(
                                    <TreeSelect
                                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                        treeData={this.state.orgTree}
                                        placeholder="请选择"
                                        treeDefaultExpandAll
                                        onChange={this.changeDefineOrg}
                                    />
                                )}
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <Form.Item label="责任人" >
                                {getFieldDecorator('userId', {
                                    initialValue: this.state.info.userId,
                                })(
                                    <Select>
                                        {this.state.orgUserList && this.state.orgUserList.map(item => {
                                            return (
                                                <Option key={item.id} value={item.value}> {item.title} </Option>
                                            )
                                        })
                                        }
                                    </Select>
                                )}
                            </Form.Item>
                        </Col>
                    </Row>
                    <h5>计划开始：</h5>
                    <Row>
                        <Col span={11}>
                            <Form.Item >
                                {getFieldDecorator('planStartTime', {
                                    initialValue: dataUtil.Dates().formatDateMonent(this.state.info.planStartTime),
                                })(
                                    <DatePicker style={{ width: "100%" }} />
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={11} offset={2}>
                            <Form.Item >
                                {getFieldDecorator('startTime', {
                                    initialValue: dataUtil.Dates().formatDateMonent(this.state.info.startTime),
                                })(
                                    <DatePicker style={{ width: "100%" }} />
                                )}
                            </Form.Item>
                        </Col>
                    </Row>
                    <h5>计划完成：</h5>
                    <Row>
                        <Col span={11}>
                            <Form.Item >
                                {getFieldDecorator('planEndTime', {
                                    initialValue: dataUtil.Dates().formatDateMonent(this.state.info.planEndTime),
                                })(
                                    <DatePicker style={{ width: "100%" }} />
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={11} offset={2}>
                            <Form.Item >
                                {getFieldDecorator('endTime', {
                                    initialValue: dataUtil.Dates().formatDateMonent(this.state.info.endTime),
                                })(
                                    <DatePicker style={{ width: "100%" }} />
                                )}
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row type="flex">
                        <Col span={24}>
                            <Form.Item label="计划完成" {...formItemLayout}>
                                {getFieldDecorator('planEndType', {
                                    initialValue: this.state.info.planEndType,
                                })(
                                    <Radio.Group style={{ width: '100%' }} onChange={this.selectTimeRange}>
                                        <Row className={style.timeOrange}>
                                            <Col span={6}><Radio value={"week"}>本周</Radio></Col>
                                            <Col span={6}><Radio value={"month"}>本月</Radio></Col>
                                            <Col span={6}><Radio value={"quarter"}>本季</Radio></Col>
                                            <Col span={6}><Radio value={"year"}>本年</Radio></Col>
                                            <span className={style.timeStr}>{this.state.timeRangeStr}</span>
                                        </Row>
                                    </Radio.Group>
                                )}
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <Form.Item label="空值" {...formItemLayout}>
                                {getFieldDecorator('emptyValues', {
                                    initialValue: this.state.info.emptyValues,
                                })(
                                    <Checkbox.Group style={{ width: '100%' }}>
                                        <Row type="flex" align="middle">
                                            <Col span={6}><Checkbox value={"wbs"}>WBS</Checkbox></Col>
                                            <Col span={6}><Checkbox value={"delv"}>交付物</Checkbox></Col>
                                            <Col span={6}><Checkbox value={"user"}>责任人</Checkbox></Col>
                                            <Col span={6}><Checkbox value={"rsrc"}>资源</Checkbox></Col>
                                        </Row>
                                    </Checkbox.Group>
                                )}
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row >
                        <Col span={24}>
                            <Form.Item label="反馈状态" {...formItemLayout}>
                                {getFieldDecorator('feedbackStatus', {
                                    initialValue: this.state.info.feedbackStatus,
                                })(
                                    <Checkbox.Group style={{ width: '100%' }}>
                                        <Row type="flex" align="middle">
                                            <Col span={6}><Checkbox value={0}>未开始</Checkbox></Col>
                                            <Col span={6}><Checkbox value={1}>进行中</Checkbox></Col>
                                            <Col span={6}><Checkbox value={2}>已完成</Checkbox></Col>
                                        </Row>
                                    </Checkbox.Group>
                                )}
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <Form.Item label="计划状态" {...formItemLayout}>
                                {getFieldDecorator('planStatus', {
                                    initialValue: this.state.info.planStatus,
                                })(
                                    <Checkbox.Group style={{ width: '100%' }}>
                                        <Row type="flex" align="middle">
                                            <Col span={6}> <Checkbox value={"EDTT"}>编制中</Checkbox></Col>
                                            <Col span={6}><Checkbox value={"APPROVAL"}>审批中</Checkbox></Col>
                                            <Col span={6}><Checkbox value={"RELEASE"}>已发布</Checkbox></Col>
                                        </Row>
                                    </Checkbox.Group>
                                )}
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row>
                        <Col span={24}>
                            <Form.Item label="子节点" {...formItemLayout}>
                                {getFieldDecorator('childNode', {
                                    initialValue: this.state.info.childNode ? this.state.info.childNode : false,
                                })(
                                    <Radio.Group style={{ width: '100%' }}>
                                        <Row type="flex" align="middle">
                                            <Col span={6}><Radio value={true}>包含</Radio></Col>
                                            <Col span={6}><Radio value={false}>不包含</Radio></Col>
                                        </Row>
                                    </Radio.Group>
                                )}
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <Form.Item label="模糊查询" {...formItemLayout}>
                                {getFieldDecorator('fuzzySearch', {
                                    initialValue: this.state.info.fuzzySearch ? this.state.info.fuzzySearch : true,
                                })(
                                    <Radio.Group style={{ width: '100%' }} type="flex" align="middle">
                                        <Row>
                                            <Col span={6}><Radio value={true}>是</Radio></Col>
                                            <Col span={6}><Radio value={false}>否</Radio></Col>
                                        </Row>
                                    </Radio.Group>
                                )}
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <Col span={20} offset={4}>
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <Button style={{ width: 88 }} >搜索</Button>
                                    <Button style={{ width: 88 }} onClick={() => this.props.form.resetFields()}>重置</Button>
                                    <Popover placement="topRight" title={"另存为视图"} content={content2}
                                        visible={this.state.clicked1 && this.state.clicked}
                                        onVisibleChange={(clicked1) => this.setState({ clicked1 })}
                                        trigger="click">
                                        <Button>另存视图</Button>
                                    </Popover>
                                    <Button type="primary" onClick={this.handleSubmit}>保存视图</Button>
                                </div>
                            </Col >
                        </Col>
                    </Row>
                </div>
            </Form>
        )
        return (
            <div className={style.main}>
                <span>
                    <Icon type="search" className={style.icon} />
                    <input type="text" placeholder="代码/名称" ref={input => this.input = input} />
                </span>
                <span onClick={this.click.bind(this)} className={style.search}>搜索</span>
                <Popover placement="bottomRight" content={content} trigger="click"
                    visible={this.state.clicked}
                    onVisibleChange={this.handleClickChange}>
                    <Icon type={this.state.clicked ? "align-right" : "unordered-list"} style={{ fontSize: 16, marginLeft: 5, verticalAlign: "sub" }} />
                </Popover>
            </div>
        )
    }
}
const Searchs = Form.create()(Search);
export default connect(state => ({
    currentLocale: state.localeProviderData
}), {})(Searchs);
