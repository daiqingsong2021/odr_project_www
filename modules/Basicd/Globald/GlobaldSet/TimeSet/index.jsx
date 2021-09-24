import React, { Component } from 'react'
import style from './style.less'
import { Form, Row, Col, Input, Button, Icon, Select, DatePicker } from 'antd';
import intl from 'react-intl-universal'
import moment from 'moment';
const FormItem = Form.Item;
const Option = Select.Option;
import axios from "../../../../../api/axios"
import {getBaseSelectTree, getTimeInfo, updateSetTime} from "../../../../../api/api"
class BasicdGlobaldTimeInfo extends Component {
    constructor(props) {
        super(props)
        this.state = {
            initDone: false,
            info: {}
        }
    }
    componentDidMount() {
        axios.get(getTimeInfo).then(res => {
            const { data } = res.data
            if(data){
                this.setState({
                    info: data
                },()=>{
                    const {info}=this.state
                    this.setState({
                        timeUnitList1:info.timeUnit?[info.timeUnit]:null,
                        drtnUnitList1:info.drtnUnit?[info.drtnUnit]:null,
                        dateFormatList1:info.dateFormat?[info.dateFormat]:null,
                    })
                })
            }
         
        })
    }

    // 初始化字典-工时单位
    onTimeTypeChange = () => {
      
        const { timeUnitList } = this.props
        if (!timeUnitList) {
            axios.get(getBaseSelectTree("plan.project.timeunit")).then(res => {
                if(res.data.data){
                    this.setState({
                        timeUnitList: res.data.data,
                        timeUnitList1: null,
                    })
                }
               
            })
        }
    }

    // 初始化字典-工期单位
    onDateTypeChange = () => {
      
        const { drtnUnitList } = this.props
        if (!drtnUnitList) {
            axios.get(getBaseSelectTree("plan.project.drtnunit")).then(res => {
                if(res.data.data){
                    this.setState({
                        drtnUnitList: res.data.data,
                        drtnUnitList1: null,
                    })
                }
                
            })
        }
    }

    // 初始化字典-日期格式
    onDateFormateChange = () => {
      
        const { dateFormatList } = this.props
        if (!dateFormatList) {
            axios.get(getBaseSelectTree("base.date.formate")).then(res => {
                if(res.data.data){
                    this.setState({
                        dateFormatList: res.data.data,
                        dateFormatList1: null,
                    })
                }
               
            })
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                const data = { ...values }
                axios.post(updateSetTime, data, true).then(res => {
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
                sm: { span: 4 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 20 },
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
                                    <Form.Item label={intl.get('wsd.i18n.base.time.timewh')} {...formItemLayout}>
                                        {getFieldDecorator('timeUnit', {
                                            initialValue: info.timeUnit?info.timeUnit.code:null,
                                            rules: [],
                                        })(
                                            <Select onDropdownVisibleChange={this.onTimeTypeChange}>
                                            {this.state.timeUnitList1 ? this.state.timeUnitList1.map(item => {
                                                return <Option value={item.code} key={item.code}>{item.name}</Option>
                                            }) : this.state.timeUnitList && this.state.timeUnitList.map(item => {
                                                return <Option value={item.value} key={item.value}>{item.title}</Option>
                                            })}
                                        </Select>
                                        )}
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row >
                                <Col span={15}>
                                    <Form.Item label={intl.get('wsd.i18n.base.time.timedrtn')} {...formItemLayout}>
                                        {getFieldDecorator('drtnUnit', {
                                                 initialValue: info.drtnUnit?info.drtnUnit.code:null,
                                            rules: [],
                                        })(
                                            <Select onDropdownVisibleChange={this.onDateTypeChange}>
                                                {this.state.drtnUnitList1 ? this.state.drtnUnitList1.map(item => {
                                                    return <Option value={item.code} key={item.code}>{item.name}</Option>
                                                }) : this.state.drtnUnitList && this.state.drtnUnitList.map(item => {
                                                    return <Option value={item.value} key={item.value}>{item.title}</Option>
                                                })}
                                            </Select>
                                        )}
                                    </Form.Item>
                                </Col>

                            </Row>
                            <Row>
                                <Col span={15}>
                                    <Form.Item label={intl.get('wsd.i18n.base.time.timeformat')} {...formItemLayout}>
                                        {getFieldDecorator('dateFormat', {
                                                 initialValue: info.dateFormat?info.dateFormat.code:null,
                                            rules: [],
                                        })(
                                            <Select onDropdownVisibleChange={this.onDateFormateChange}>
                                            {this.state.dateFormatList1 ? this.state.dateFormatList1.map(item => {
                                                return <Option value={item.code} key={item.code}>{item.name}</Option>
                                            }) : this.state.dateFormatList && this.state.dateFormatList.map(item => {
                                                return <Option value={item.value} key={item.value}>{item.title}</Option>
                                            })}
                                        </Select>
                                        )}
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

const BasicdGlobaldTimeInfos = Form.create()(BasicdGlobaldTimeInfo);
export default BasicdGlobaldTimeInfos
