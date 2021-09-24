import React, { Component } from 'react'
import style from './style.less'
import { Icon, Select, Input, DatePicker, TreeSelect, Radio, Checkbox, Button, Form, Row, Col, Popover } from 'antd'
import { connect } from 'react-redux'
import moment from "moment"
import { log } from 'util';
import * as dataUtil from "@/utils/dataUtil";
import axios from '@/api/axios';
import {getBaseSelectTree,planProAuthTree,getsectionId} from '../../../Suzhou/api/suzhou-api';
import { getMapData } from '@/modules/Suzhou/components/Util/util';
const { TextArea } = Input;
const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
import notificationFun from '@/utils/notificationTip';
export class Search extends Component {
    constructor(props) {
        super(props)
        this.state = {
            orgTree: [],
            orgUserList: [],
            peoEntryType:null, //人员类型
            type:null, // 类别
            startTime:null, //开始时间
            endTime:null, //结束时间
            status:null, //状态
            optionStatus:[], //状态
            sourceOption:[],//来源
            typeOption:[],//问题类型
            priorityOption:[],//优先级
            selectProject:[],//选择项目
        }
    }
    componentDidMount(){
        axios.get(getBaseSelectTree("comu.question.status")).then((res)=>{
          if(Array.isArray(res.data.data)){
            this.setState({
              optionStatus:res.data.data
            })
          }
        });
        axios.get(getBaseSelectTree("comu.question.biztype")).then((res)=>{
            if(Array.isArray(res.data.data)){
              this.setState({
                sourceOption:res.data.data
              })
            }
        })
        axios.get(getBaseSelectTree("comu.question.type")).then((res)=>{
            if(Array.isArray(res.data.data)){
              this.setState({
                typeOption:res.data.data
              })
            }
        })
        //优先级
        axios.get(getBaseSelectTree("comu.question.priority")).then((res)=>{
            if(Array.isArray(res.data.data)){
              this.setState({
                priorityOption:res.data.data
              })
            }
        })
        //选择项目
        axios.get(planProAuthTree).then(res=>{
            this.props.form.setFieldsValue({ sectionIds:''});
            this.getSelectTreeArr2(res.data.data,{"id":"value","name":"title"});
            this.setState({
                selectProject:res.data.data,
            })
        })
    }
    //选择标段
    getsectionId=(val)=>{
        if(this.state.projectId){
            axios.get(getsectionId(this.state.projectId)).then(res=>{
                if(res.data.data){
                    getMapData(res.data.data);
                }
                this.setState({
                  selectSection:res.data.data,
                })
            })
        }else{
            notificationFun('提示','请先选择项目');
        }
    }
    getSelectTreeArr2=(array,keyMap)=>{
        if(array){
          array.forEach((item,index,arr)=>{
            var obj = item;
            if(obj.type == 'project'){
            }else{
              obj.disabled = true;
            };
            for(var key in obj){
              var newKey = keyMap[key];
              if(newKey){
                  obj[newKey] = obj[key];
              }
            }
            this.getSelectTreeArr2(item.children,keyMap);
          })
        }
    }
    //选择项目
    getProject =(selectedKeys, info,e)=>{
        this.setState({
           projectId:info.props.id 
        })
    }
    change = (e) => {
        this.setState({
            value: e.target.value
        })
    }
    click=()=> {
        if(this.props.search){
            let data = {
                title:this.input.value
            }
            this.props.search(data,'title');
        }
    }
    //气泡显影
    handleClickChange = visible => {
        this.setState({
            clicked: visible,
        });
    };
    treeSelectChange = (value) => {
        this.props.form.setFieldsValue({ userId: null })
    }
    
    //保存视图
    handleSubmit = (val, e) => { 
        //   e.preventDefault();
          this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                if(!values.searchTime || !values.searchTime.length){
                    values.startTime = "";
                    values.endTime = "";
                }else{
                    values.startTime = dataUtil.Dates().formatTimeString(values.searchTime[0]).substr(0,10);
                    values.endTime = dataUtil.Dates().formatTimeString(values.searchTime[1]).substr(0,10);
                }
                
                this.setState({
                    clicked: false,
                  },()=>{
                    this.props.search(values);
                });
                
            }
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
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 18 },
            },
        };
        const formLayout = {
            labelCol: {
                sm: { span: 4 },
            },
            wrapperCol: {
                sm: { span: 20 },
            },
        }
        const content = (
            <Form onSubmit={this.handleSubmit} style={{ width: 380 }} className={style.formstyle}>
                <div className={style.content}>
                    <Row >
                        {!this.props.type && <Col span={24}>
                            <Form.Item label="问题来源" {...formItemLayout}>
                                {getFieldDecorator('bizType', {
                                })( 
                                    
                                    <Select allowClear 
                                            style={{width:'100%', marginRight: 10 }}
                                            // defaultValue="INIT" 
                                            size="small">
                                        {
                                            this.state.sourceOption.length && this.state.sourceOption.map((item,i) => {
                                            return (
                                                <Option key={item.value} value={item.value}>{item.title}</Option>
                                            )
                                            })
                                        }
                                    </Select>
                                )}
                            </Form.Item>
                        </Col>}
                        <Col span={24}>
                            <Form.Item label="问题类型" {...formItemLayout}>
                                {getFieldDecorator('type', {
                                })( 
                                    <Select allowClear 
                                            style={{width:'100%', marginRight: 10 }}
                                            // defaultValue="INIT" 
                                            size="small">
                                        {
                                            this.state.typeOption.length && this.state.typeOption.map((item,i) => {
                                            return (
                                                <Option key={item.value} value={item.value}>{item.title}</Option>
                                            )
                                            })
                                        }
                                    </Select>
                                )}
                            </Form.Item>
                        </Col>
                        {!this.props.type && <Col span={24}>
                            <Form.Item label="所属项目" {...formItemLayout} >
                                {getFieldDecorator('projectId', {
                                })(
                                    <TreeSelect
                                        treeDefaultExpandAll
                                        treeData={this.state.selectProject}
                                        // style={{marginRight:'10px'}}
                                        onSelect = {this.getProject}
                                    />
                                )}
                            </Form.Item>
                        </Col>}
                        {!this.props.type && <Col span={24}>
                            <Form.Item label="所属标段"  {...formItemLayout}>
                                {getFieldDecorator('sectionIds', {
                                })(
                                    <TreeSelect
                                        treeDefaultExpandAll
                                        treeData={this.state.selectSection}
                                        style={{marginRight:'10px'}}
                                        onFocus={this.getsectionId.bind(this)}
                                    />
                                )}
                            </Form.Item>
                        </Col>}
                        <Col span={24}>
                            <Form.Item label="状态" {...formItemLayout}>
                                {getFieldDecorator('status', {
                                })(
                                    <Select allowClear 
                                            style={{width:'100%', marginRight: 10 }}
                                            // defaultValue="INIT" 
                                            size="small">
                                        {
                                            this.state.optionStatus.length && this.state.optionStatus.map((item,i) => {
                                            return (
                                                <Option key={item.value} value={item.value}>{item.title}</Option>
                                            )
                                            })
                                        }
                                    </Select>
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item label="问题标题" {...formItemLayout}>
                                {getFieldDecorator('title', {
                                })(
                                    <Input style={{padding:0,height:'22px'}} />
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item label="创建时间"  {...formItemLayout}>
                                {getFieldDecorator('searchTime', {
                                })(
                                    <RangePicker
                                    style={{width:'100%'}}
                                        format="YYYY-MM-DD "
                                        placeholder={['开始时间', '结束时间']}
                                        size="small"
                                        // onChange = {this.onChangeTime}
                                    />
                                )}
                            </Form.Item>
                        </Col>
                        {/* <Col span={24}>
                            <Form.Item label="优先级"  {...formItemLayout}>
                                {getFieldDecorator('priority', {
                                })(
                                    <Select allowClear 
                                            style={{width:'100%', marginRight: 10 }}
                                            size="small">
                                        {
                                            this.state.priorityOption.length && this.state.priorityOption.map((item,i) => {
                                            return (
                                                <Option key={item.value} value={item.value}>{item.title}</Option>
                                            )
                                            })
                                        }
                                    </Select>
                                )}
                            </Form.Item>
                        </Col> */}
                    </Row>
                    <Row>
                        <Col span={24}>
                            <Col span={12} offset={12}>
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <Button style={{ width: 88 }} onClick={()=> this.props.form.resetFields()}>重置</Button>
                                    <Button type="primary" onClick={this.handleSubmit.bind(this)}>搜索</Button>
                                </div>
                            </Col>
                        </Col>
                    </Row>
                </div>
            </Form>
        )
        return (
            <div className={style.main}>
                <span>
                    <Icon type="search" className={style.icon} />
                    <input type="text" placeholder="问题标题" ref={input => this.input = input} />
                </span>
                <span onClick={this.click.bind(this)} className={style.search}>搜索</span>
                <Popover placement="bottomRight" content={content} trigger="click"
                    visible={this.state.clicked}
                    onVisibleChange={this.handleClickChange}>
                    <Icon type={this.state.clicked?"align-right":"unordered-list" } style={{fontSize:16,marginLeft:5,verticalAlign: "sub"}}/>
                </Popover>
            </div>
        )
    }
}
const Searchs = Form.create()(Search);
export default connect(state => ({
    currentLocale: state.localeProviderData
}), {

    })(Searchs);
