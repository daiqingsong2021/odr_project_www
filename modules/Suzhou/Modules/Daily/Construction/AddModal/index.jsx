import React, { Component } from 'react';
import { Modal, Form, Row, Col, Input,InputNumber, Button, Icon, Select, Divider, DatePicker, Descriptions, TreeSelect } from 'antd';
import moment from 'moment';
import style from './style.less';
import intl from 'react-intl-universal';
import { connect } from 'react-redux';
import { curdCurrentData } from '../../../../../../store/curdData/action';
import axios from '../../../../../../api/axios';
import { getsectionId, getBaseSelectTree } from '../../../../api/suzhou-api';
const { TextArea } = Input;
const Option = Select.Option;
const TreeNode = TreeSelect.TreeNode;
import PublicButton from "../../../../../../components/public/TopTags/PublicButton";
import * as dataUtil from "../../../../../../utils/dataUtil";
import { getSelectTreeArr } from "@/modules/Suzhou/components/Util/firstLoad";
import SelectSection from '@/modules/Suzhou/components/SelectSection';
import { getBaseData } from '@/modules/Suzhou/components/Util/util';

export class AddModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            disabled:true,
            changeButtonShow:true,  //调整按钮
        }
    }
    componentDidMount() {
     getBaseData('line').then(data => { 
        if(data && data.length){
            this.setState({
                lineList:data
            })
        }
     })
    }
    //选择日期
    handleDate = () => { }

    handleSubmitSign = () => { console.log(this.state.submitData) }
    handleCancelClose = () => {
        this.setState({ showSubmitModal: false })
    }
      //新增提交
  handleSubmit = (val) => {
    // e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, fieldsValue) => {
        
    //   values.entryTime = dataUtil.Dates().formatTimeString(values.entryTime).substr(0,10);
      if (!err) {
        const data={
          ...fieldsValue,
          recordTime: val == 'save' ? fieldsValue['recordTime'].format('YYYY-MM-DD') : fieldsValue['recordTime'],
        }
        console.log(data,this.props)
        if (val == 'save') {
            this.props.submit(data, 'save');
        }
        if (val == 'update') {
            this.props.submit(data, 'update');
        }
      }
    });
  };
  editFun = () => {
    this.setState({
        disabled: false,
        changeButtonShow: false,
    })
  }
 
  //计算计划施工数 = 周计划施工数 + 抢修施工计划完成数
  //计算计划施工实际完成数 = 周计划实际完成数 + 抢修施工实际完成数
  
  //获取周计划施工数
  getWeeklyPlanQuantityValue = ({target: { value }}) =>{
    const {WeeklyActualQuantityValue,RepairPlanQuantityValue,repairActualQuantityvalue} = this.state
    this.setState({
        WeeklyPlanQuantityValue: value
    },()=>{
        if(!this.state.WeeklyPlanQuantityValue||!RepairPlanQuantityValue){

        }else{
            this.props.form.setFieldsValue({
                totalPlanConstructionQuantity: Number(this.state.WeeklyPlanQuantityValue) + Number(RepairPlanQuantityValue),//计划施工数
            })
        }
    })
}
  //获取周计划实际完成数
  getWeeklyActualQuantityValue = ({target: { value }}) =>{
    const {WeeklyPlanQuantityValue,RepairPlanQuantityValue,repairActualQuantityvalue} = this.state
    this.setState({
        WeeklyActualQuantityValue: value
    },()=>{
        if(!this.state.WeeklyActualQuantityValue||!repairActualQuantityvalue){

        }else{
            this.props.form.setFieldsValue({
                totalActualConstructionQuantity: Number(this.state.WeeklyActualQuantityValue) + Number(repairActualQuantityvalue)//计划施工实际完成数
            })
        }
    })
}
  //获取抢修施工计划完成数
  getRepairPlanQuantityValue = ({target: { value }}) =>{
    const {WeeklyPlanQuantityValue,WeeklyActualQuantityValue,repairActualQuantityvalue} = this.state
    this.setState({
        RepairPlanQuantityValue: value
    },()=>{
        if(!WeeklyPlanQuantityValue||!this.state.RepairPlanQuantityValue){

        }else{
            this.props.form.setFieldsValue({
                totalPlanConstructionQuantity: Number(WeeklyPlanQuantityValue) + Number(this.state.RepairPlanQuantityValue),//计划施工数
            })
        }
    })
}

  //获取抢修施工实际完成数
  getPlanAndActualQuantity = ({target: { value }}) =>{
    const {WeeklyPlanQuantityValue,WeeklyActualQuantityValue,RepairPlanQuantityValue} = this.state
    this.setState({
        repairActualQuantityvalue: value
    },()=>{
        if(!WeeklyActualQuantityValue||!this.state.repairActualQuantityvalue){

        }else{
            this.props.form.setFieldsValue({
                totalActualConstructionQuantity: Number(WeeklyActualQuantityValue) + Number(this.state.repairActualQuantityvalue)//计划施工实际完成数
            })
        }
    }
    )
  }
    render() {
        const { intl } = this.props.currentLocale
        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched ,getFieldValue} = this.props.form;
        const formItemLayout0 = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 18 },
            },
        };
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 10 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 12 },
            },
        };
        const formItemLayout1 = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 5 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 18 },
            },
        };
        const { isAdd, constructionDailyDetailData,canModify } = this.props;
        const { changeButtonShow } = this.state;
        return (
            <div> 
               <div >
                   <div className={style.topTagsBtn}>
                        <Button type='primary' icon="check" size='small' style={{ marginRight: 30,marginTop:10,marginBottom:10}} onClick={this.handleSubmit.bind(this, 'save')}>提交</Button>
                    </div>
                <Form onSubmit={this.handleSubmit}>
                    <div>
                        <Row type="flex">
                        <Col span={12}>
                        <Form.Item label="日期" {...formItemLayout}>
                            {getFieldDecorator('recordTime', {
                            rules: [{required: true,message: '请选择日期'}],
                            })(
                                <DatePicker  style={{ width: '100%'}} format='YYYY-MM-DD' />
                            )}
                        
                        </Form.Item>
                        </Col>
                        <Col span={12}>
                        <Form.Item label="线路" {...formItemLayout}>
                            {getFieldDecorator('line', {
                            rules: [{required: true,message: '请选择线路'}],
                            })(
                                <Select
                                showSearch
                                // mode='multiple'
                                allowClear={true}
                                placeholder="请选择线路"
                                optionFilterProp="children"
                                required
                                //onChange={this.selectOnChange}
                                // onFocus={onFocus}
                                // onBlur={onBlur}
                                //onSearch={onSearch}
                                filterOption={(input, option) =>
                                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            >
                            {this.state.lineList && this.state.lineList.map(item => {
                                            return (
                                                <Option value={item.value} key={item.value}>{item.title}</Option>
                                            )
                                        })
                                        }
                            </Select>
                            )}
                        </Form.Item>
                        </Col>
                        </Row>
                        <Row type="flex">
                            <Col span={12}>
                                <Form.Item label="周计划施工数" {...formItemLayout}>
                                {getFieldDecorator('weeklyPlanConstructionQuantity', {
                                initialValue:constructionDailyDetailData && constructionDailyDetailData.weeklyPlanConstructionQuantity || '',
                                rules: [{required: true,message: '请输入周计划施工数'}],
                                getValueFromEvent: (event) => {
                                    return (event.target.value.length < 2)?event.target.value.replace(/[^0-9]/g,''):event.target.value.replace(/\D/g,'')
                                },
                                })(
                                    <Input placeholder="请输入" disabled={isAdd ? false : this.state.disabled} onChange={this.getWeeklyPlanQuantityValue}/>
                                // <InputNumber min={0} precision={0} placeholder="请输入" disabled={isAdd ? false : this.state.disabled} style={{width:'243px'}}/>
                                )}
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="周计划实际完成数" {...formItemLayout}>
                                {getFieldDecorator('weeklyActualConstructionQuantity', {
                                initialValue:constructionDailyDetailData && constructionDailyDetailData.weeklyActualConstructionQuantity || '',
                                rules: [{required: true,message: '请输入周计划实际完成数'}],
                                getValueFromEvent: (event) => {
                                    return (event.target.value.length < 2)?event.target.value.replace(/[^0-9]/g,''):event.target.value.replace(/\D/g,'')
                                },
                                })(
                                    <Input placeholder="请输入" disabled={isAdd ? false : this.state.disabled} onChange={this.getWeeklyActualQuantityValue}/>
                                // <InputNumber min={0} precision={0} max={!isNaN(Number(getFieldValue('weeklyPlanConstructionQuantity'))) ? Number(getFieldValue('weeklyPlanConstructionQuantity')) : Infinity} placeholder="请输入" disabled={isAdd ? false : this.state.disabled} style={{width:'243px'}}/>
                                )}
                                </Form.Item>
                            </Col>
                        </Row>
                        {/* <Row type="flex">
                            <Col span={12}>
                                <Form.Item label="日补充计划施工数" {...formItemLayout}>
                                {getFieldDecorator('dailyPlanConstructionQuantity', {
                                initialValue:constructionDailyDetailData && constructionDailyDetailData.dailyPlanConstructionQuantity || '',
                                rules: [{required: true,message: '请输入日补充计划施工数'}],
                                getValueFromEvent: (event) => {
                                    return (event.target.value.length < 2)?event.target.value.replace(/[^0-9]/g,''):event.target.value.replace(/\D/g,'')
                                },
                                })(
                                    <Input placeholder="请输入" disabled={isAdd ? false : this.state.disabled} />
                                // <InputNumber min={0} precision={0} placeholder="请输入" disabled={isAdd ? false : this.state.disabled} style={{width:'243px'}}/>
                                )}
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="日补充计划实际完成数" {...formItemLayout}>
                                {getFieldDecorator('dailyActualConstructionQuantity', {
                                initialValue:constructionDailyDetailData && constructionDailyDetailData.dailyActualConstructionQuantity || '',
                                rules: [{required: true,message: '请输入日补充计划实际完成数'}],
                                getValueFromEvent: (event) => {
                                    return (event.target.value.length < 2)?event.target.value.replace(/[^0-9]/g,''):event.target.value.replace(/\D/g,'')
                                },
                                })(
                                    <Input placeholder="请输入" disabled={isAdd ? false : this.state.disabled} />
                                // <InputNumber min={0} precision={0} max={!isNaN(Number(getFieldValue('dailyPlanConstructionQuantity'))) ? Number(getFieldValue('dailyPlanConstructionQuantity')) : Infinity} placeholder="请输入" disabled={isAdd ? false : this.state.disabled} style={{width:'243px'}}/>
                                )}
                                </Form.Item>
                            </Col>
                        </Row> */}
                        {/* <Row type="flex">
                            <Col span={12}>
                                <Form.Item label="临时补修计划施工数" {...formItemLayout}>
                                {getFieldDecorator('tempPlanConstructionQuantity', {
                                initialValue:constructionDailyDetailData && constructionDailyDetailData.tempPlanConstructionQuantity || '',
                                rules: [{required: true,message: '请输入临时补修计划施工数'}],
                                getValueFromEvent: (event) => {
                                    return (event.target.value.length < 2)?event.target.value.replace(/[^0-9]/g,''):event.target.value.replace(/\D/g,'')
                                },
                                })(
                                    <Input placeholder="请输入" disabled={isAdd ? false : this.state.disabled} />
                                // <InputNumber min={0} precision={0} placeholder="请输入" disabled={isAdd ? false : this.state.disabled} style={{width:'243px'}}/>
                                )}
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="临时补修实际完成数" {...formItemLayout}>
                                {getFieldDecorator('tempActualConstructionQuantity', {
                                initialValue:constructionDailyDetailData && constructionDailyDetailData.tempActualConstructionQuantity || '',
                                rules: [{required: true,message: '请输入临时补修实际完成数'}],
                                getValueFromEvent: (event) => {
                                    return (event.target.value.length < 2)?event.target.value.replace(/[^0-9]/g,''):event.target.value.replace(/\D/g,'')
                                },
                                })(
                                    <Input placeholder="请输入" disabled={isAdd ? false : this.state.disabled} />
                                // <InputNumber min={0} precision={0} max={!isNaN(Number(getFieldValue('tempPlanConstructionQuantity'))) ? Number(getFieldValue('tempPlanConstructionQuantity')) : Infinity} placeholder="请输入" disabled={isAdd ? false : this.state.disabled} style={{width:'243px'}}/>
                                )}
                                </Form.Item>
                            </Col>
                        </Row> */}
                        <Row type="flex">
                            <Col span={12}>
                                <Form.Item label="抢修施工计划完成数" {...formItemLayout}>
                                {getFieldDecorator('repairPlanConstructionQuantity', {
                                initialValue:constructionDailyDetailData && constructionDailyDetailData.repairPlanConstructionQuantity || '',
                                rules: [{required: true,message: '请输入抢修施工数'}],
                                getValueFromEvent: (event) => {
                                    return (event.target.value.length < 2)?event.target.value.replace(/[^0-9]/g,''):event.target.value.replace(/\D/g,'')
                                },
                                })(
                                    <Input placeholder="请输入" disabled={isAdd ? false : this.state.disabled} onChange={this.getRepairPlanQuantityValue}/>
                                // <InputNumber min={0} precision={0} placeholder="请输入" disabled={isAdd ? false : this.state.disabled} style={{width:'243px'}}/>
                                )}
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="抢修施工实际完成数" {...formItemLayout}>
                                {getFieldDecorator('repairActualConstructionQuantity', {
                                initialValue:constructionDailyDetailData && constructionDailyDetailData.repairActualConstructionQuantity || '',
                                rules: [{required: true,message: '请输入抢修施工实际完成数'}],
                                getValueFromEvent: (event) => {
                                    return (event.target.value.length < 2)?event.target.value.replace(/[^0-9]/g,''):event.target.value.replace(/\D/g,'')
                                },
                                })(
                                    <Input placeholder="请输入" disabled={isAdd ? false : this.state.disabled} onChange={this.getPlanAndActualQuantity}/>
                                // <InputNumber min={0} precision={0} max={!isNaN(Number(getFieldValue('repairPlanConstructionQuantity'))) ? Number(getFieldValue('repairPlanConstructionQuantity')) : Infinity} placeholder="请输入" disabled={isAdd ? false : this.state.disabled} style={{width:'243px'}}/>
                                )}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row type="flex">
                            <Col span={12}>
                                <Form.Item label="计划施工数" {...formItemLayout}>
                                {getFieldDecorator('totalPlanConstructionQuantity', {
                                // initialValue:constructionDailyDetailData && constructionDailyDetailData.repairPlanConstructionQuantity || '',
                                rules: [{required: true,message: '请输入计划施工数'}],
                                getValueFromEvent: (event) => {
                                    return (event.target.value.length < 2)?event.target.value.replace(/[^0-9]/g,''):event.target.value.replace(/\D/g,'')
                                },
                                })(
                                    <Input placeholder="请输入" disabled />
                                // <InputNumber min={0} precision={0} placeholder="请输入" disabled={isAdd ? false : this.state.disabled} style={{width:'243px'}}/>
                                )}
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="计划施工实际完成数" {...formItemLayout}>
                                {getFieldDecorator('totalActualConstructionQuantity', {
                                // initialValue:constructionDailyDetailData && constructionDailyDetailData.repairActualConstructionQuantity || '',
                                rules: [{required: true,message: '请输入计划施工实际完成数'}],
                                getValueFromEvent: (event) => {
                                    return (event.target.value.length < 2)?event.target.value.replace(/[^0-9]/g,''):event.target.value.replace(/\D/g,'')
                                },
                                })(
                                    <Input placeholder="请输入" disabled />
                                // <InputNumber min={0} precision={0} max={!isNaN(Number(getFieldValue('repairPlanConstructionQuantity'))) ? Number(getFieldValue('repairPlanConstructionQuantity')) : Infinity} placeholder="请输入" disabled={isAdd ? false : this.state.disabled} style={{width:'243px'}}/>
                                )}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row type="flex">
                            <Col span={24}>
                                <Form.Item label="情况说明" {...formItemLayout1}>
                                {getFieldDecorator('description', {
                                initialValue:constructionDailyDetailData && constructionDailyDetailData.description || '',
                                rules: [],
                                })(
                                    <TextArea placeholder="请输入" disabled={isAdd ? false : this.state.disabled} />
                                )}
                                </Form.Item>
                            </Col>
                        </Row>
                        </div>
                    </Form>
                </div>
            </div>
        )
    }
}
const AddModals = Form.create()(AddModal);
export default connect(state => ({
    currentLocale: state.localeProviderData,
}))(AddModals);