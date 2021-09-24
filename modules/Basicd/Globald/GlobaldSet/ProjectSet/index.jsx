import React, { Component } from 'react'
import style from './style.less'
import {InputNumber, Form, Row, Col, Input, Button, Icon, Switch, Select, DatePicker } from 'antd';
import axios from "../../../../../api/axios"
import { getBaseSelectTree, getProjectInfo, updateSetProject } from "../../../../../api/api"
const FormItem = Form.Item;
const Option = Select.Option;
class ProjectSet extends Component {
    constructor(props) {
        super(props)
        this.state = {
            initDone: false,
            info: {}
        }
    }

    componentDidMount() {
        axios.get(getProjectInfo).then(res => {
            const { data } = res.data
            if (data) {
                this.setState({
                    info: data
                },()=>{
                    const {info}=this.state
                    this.setState({
                        taskDrtnTypeList1:info.taskDrtnType? [info.taskDrtnType]:null,
                        cpmTypeList1:info.cpmType? [info.cpmType]:null
                    })
                })
            }

        })
    }

    //初始化字典-工期类型
    onTaskDrtnTypeChange = () => {
        const { taskDrtnTypeList } = this.state
        if (!taskDrtnTypeList) {
            axios.get(getBaseSelectTree("plan.project.taskdrtntype")).then(res => {
                if(res.data.data){
                    this.setState({
                        taskDrtnTypeList: res.data.data,
                        taskDrtnTypeList1: null,
                    })
                }
             
            })
        }
    }

    //初始化字典-关键路径
    onCpmTypeChange = () => {
        const { cpmTypeList } = this.props
        if (!cpmTypeList) {
            axios.get(getBaseSelectTree("plan.project.cpmtype")).then(res => {
                if(res.data.data){
                    this.setState({
                        cpmTypeList: res.data.data,
                        cpmTypeList1: null,
                    })
                }
               
            })
        }
    }

    // 提交数据
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                const data = {
                    ...values,
                    enableProjectTeam: values.enableProjectTeam ? 1 : 0,
                    shareWbs: values.shareWbs ? 1 : 0,
                    message: values.message ? 1 : 0
                }
                axios.post(updateSetProject, data, true).then(res => {
                })
            }
        });
    }

    // 初始化渲染
    render() {
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
        const formItemLayout2 = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 14 },
            },
            wrapperCol: {
                xs: { span: 22 },
                sm: { span: 10 },
            },
        };


        const { info } = this.state

        return (
            <div className={style.main}>
                <div className={style.mainScorll}>
                    <Form onSubmit={this.handleSubmit}>
                        <div className={style.content}>
                            <Row >
                                <Col span={15}>
                                    <Form.Item label="工期类型" {...formItemLayout}>
                                        {getFieldDecorator('taskDrtnType', {
                                            initialValue: info.taskDrtnType? info.taskDrtnType.code:null,
                                            rules: [],
                                        })(
                                            // <Select onDropdownVisibleChange={this.onTaskDrtnTypeChange}>
                                            //     {
                                            //         selectData.taskDrtnType.map((v, i) => {
                                            //             return <Option value={v.value} key={i}>{v.title}</Option>
                                            //         })
                                            //     }
                                            // </Select>
                                            <Select onDropdownVisibleChange={this.onTaskDrtnTypeChange}>
                                                {this.state.taskDrtnTypeList1 ? this.state.taskDrtnTypeList1.map(item => {
                                                    return <Option value={item.code} key={item.code}>{item.name}</Option>
                                                }) : this.state.taskDrtnTypeList && this.state.taskDrtnTypeList.map(item => {
                                                    return <Option value={item.value} key={item.value}>{item.title}</Option>
                                                })}
                                            </Select>
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col span={9}>
                                    <Form.Item label="启用项目管理团队" {...formItemLayout2}>
                                        {getFieldDecorator('enableProjectTeam', {
                                            initialValue: (info.enableProjectTeam && info.enableProjectTeam== 1) ? true : false,
                                            valuePropName: 'checked',
                                        })(
                                            <Switch checkedChildren="开" unCheckedChildren="关" />
                                        )}
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row >
                                <Col span={15}>
                                    <Form.Item label="关键路径" {...formItemLayout}>
                                        {getFieldDecorator('cpmType', {
                                             initialValue: info.cpmType? info.cpmType.code:null,
                                            rules: [],
                                        })(
                                            <Select onDropdownVisibleChange={this.onCpmTypeChange}>
                                                {this.state.cpmTypeList1 ? this.state.cpmTypeList1.map(item => {
                                                    return <Option value={item.code} key={item.code}>{item.name}</Option>
                                                }) : this.state.cpmTypeList && this.state.cpmTypeList.map(item => {
                                                    return <Option value={item.value} key={item.value}>{item.title}</Option>
                                                })}
                                            </Select>
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col span={9}>
                                    <Form.Item label="启用WBS内部共享" {...formItemLayout2}>
                                        {getFieldDecorator('shareWbs', {
                                            initialValue: (info.shareWbs && info.shareWbs== 1) ? true : false,
                                            valuePropName: 'checked',
                                        })(
                                            <Switch checkedChildren="开" unCheckedChildren="关" />
                                        )}
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={15}>
                                    <Form.Item label="总浮时<=" {...formItemLayout}>
                                        {getFieldDecorator('cpmFloat', {
                                            initialValue: info.cpmFloat,
                                            rules: [],
                                        })(
                                            <InputNumber min={0} style={{width:"100%"}}/>
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col span={9}>
                                    <Form.Item label="启用消息推送" {...formItemLayout2}>
                                        {getFieldDecorator('message', {
                                            initialValue: (info.message && info.message == 1 )? true : false,
                                            valuePropName: 'checked',
                                        })(
                                            <Switch checkedChildren="开" unCheckedChildren="关" />
                                        )}
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={15}>
                                    <Col span={8} offset={4}>
                                        <Button onClick={this.handleSubmit} type="primary">更新设置</Button>
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

const ProjectSets = Form.create()(ProjectSet);
export default ProjectSets
