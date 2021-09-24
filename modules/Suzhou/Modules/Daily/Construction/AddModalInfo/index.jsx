import React, { Component } from 'react';
import { Modal, Form, Row, Col, Input,notification, Button, Icon, Select, Divider, DatePicker, Descriptions, TreeSelect } from 'antd';
import moment from 'moment';
import style from './style.less';
import intl from 'react-intl-universal';
import { connect } from 'react-redux';
import { curdCurrentData } from '../../../../../../store/curdData/action';
import axios from '../../../../../../api/axios';
import { addDailyChangeVersion,updateConstructionDaily } from '../../../../api/suzhou-api';
const { TextArea } = Input;
const Option = Select.Option;
const TreeNode = TreeSelect.TreeNode;
import PublicButton from "../../../../../../components/public/TopTags/PublicButton";
import * as dataUtil from "../../../../../../utils/dataUtil";
import { getSelectTreeArr } from "@/modules/Suzhou/components/Util/firstLoad";
import SelectSection from '@/modules/Suzhou/components/SelectSection';
import { getBaseData } from '@/modules/Suzhou/components/Util/util';
import EditLogModal from '@/modules/Suzhou/components/EditLogModal/index'
export class AddModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            disabled:true,
            changeButtonShow:true,  //调整按钮
            showSubmitModal:false,
            modifyRemark:'',
            WeeklyPlanQuantityValue:0,
            RepairPlanQuantityValue:0,
            WeeklyActualQuantityValue:0,
            repairActualQuantityvalue:0

        }
    }
    componentDidMount() {
        // console.log(this.props.rightData)
        const {rightData} = this.props
        this.setState({
            WeeklyPlanQuantityValue:rightData.weeklyPlanConstructionQuantity,//周计划施工数
            RepairPlanQuantityValue:rightData.repairPlanConstructionQuantity,//抢修施工计划完成数
            WeeklyActualQuantityValue:rightData.weeklyActualConstructionQuantity,//周计划实际完成数
            repairActualQuantityvalue:rightData.repairActualConstructionQuantity,//抢修施工实际完成数
        })
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

    // handleSubmitSign = () => { console.log(this.state.submitData) }
    handleCancelClose = () => {
        this.setState({ showSubmitModal: false })
    }
      //新增提交
  handleSubmit = (val) => {
    // e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, fieldsValue) => {
        // console.log(fieldsValue)
    //   values.entryTime = dataUtil.Dates().formatTimeString(values.entryTime).substr(0,10);
      if (!err) {
        const data={
          ...fieldsValue,
          recordTime: val == 'save' ? fieldsValue['recordTime'].format('YYYY-MM-DD') : fieldsValue['recordTime'],
        }
        // console.log(data,this.props)
        if (val == 'save') {
            // this.props.submit(data, 'save');
        }
        if (val == 'update') {
            const valueBefore = this.props.rightData//修改前数据
            const valueAfter = fieldsValue
            // console.log(22,valueAfter,valueBefore)
            this.compareData(valueBefore,valueAfter);
            this.setState({
                valueAfter,
                showSubmitModal:true
            })
            
        }
      }
    });
  };
  submit = (values, type) => {
    const data = {
        ...values,
        id:this.props.id
    };
    
    if(type == 'update'){
        // console.log(12323)
        axios.post(updateConstructionDaily, data, true).then(res => {
            // console.log(res)
            if(res.data && res.data.success){
                // this.handleCancel()
                // this.addSuccess()
            }else{
                notification.error(
                    {
                    placement: 'bottomRight',
                    bottom: 50,
                    duration: 2,
                    message: '出错了',
                    description: '抱歉，网络开小差了，请稍后重试'
                    }
                )
            }
        })
    }
};
   //this.props.addOrModify == 'modify'，提交按钮
   handleSubmitSign=()=>{
    let data=this.state.valueAfter;
    this.submit(data, 'update')
    const params = {
        moudleRecordId:this.props.rightData.id,
        moudleName:'施工日况',
        modifyRemark:this.state.modifyRemark,
        modifyContent:document.getElementById('modifyContent').innerText
    }
    axios.post(addDailyChangeVersion,params,true).then(res => {
        if (res.data.status === 200) {
            this.setState({ showSubmitModal: false })
            // this.props.handleCancel()
            // this.props.updateSuccess(res.data.data);
        }else{
            notification.error(
                {
                  placement: 'bottomRight',
                  bottom: 50,
                  duration: 2,
                  message: '出错了',
                  description: res.data.msg
                }
              )
        }
    })
    // this.setState({
    //     showSubmitModal:false
    // })
}
compareData=(valueBefore,valueAfter)=>{
    console.log(valueAfter,valueBefore)
    if(valueBefore.weeklyPlanConstructionQuantity==valueAfter.weeklyPlanConstructionQuantity//周计划施工数
        &&valueBefore.weeklyActualConstructionQuantity==valueAfter.weeklyActualConstructionQuantity//周计划实际完成数
        &&valueBefore.tempPlanConstructionQuantity==valueAfter.tempPlanConstructionQuantity//抢修施工计划完成数
        &&valueBefore.tempActualConstructionQuantity==valueAfter.tempActualConstructionQuantity//抢修施工实际完成数
        &&valueBefore.totalPlanConstructionQuantity==valueAfter.totalPlanConstructionQuantity//计划施工数
        &&valueBefore.totalActualConstructionQuantity==valueAfter.totalActualConstructionQuantity//计划施工实际完成数
        &&valueBefore.description==valueAfter.description//情况说明
        ){
        const titleTip = '无修改记录'
        this.setState({
            titleTip
        })
     }
        //周计划施工数
        if(valueBefore.weeklyPlanConstructionQuantity!=valueAfter.weeklyPlanConstructionQuantity)
        {
            const titleTip1 = '周计划施工数'+'由'+valueBefore.weeklyPlanConstructionQuantity+'改为'+valueAfter.weeklyPlanConstructionQuantity
            this.setState({
                titleTip1
            })
        }
        //周计划实际完成数
        if(valueBefore.weeklyActualConstructionQuantity!=valueAfter.weeklyActualConstructionQuantity)
        {
            const titleTip2 = '周计划实际完成数'+'由'+valueBefore.weeklyActualConstructionQuantity+'改为'+valueAfter.weeklyActualConstructionQuantity
            this.setState({
                titleTip2
            })
        }
        // //日补充计划施工数
        // if(valueBefore.dailyPlanConstructionQuantity!=valueAfter.dailyPlanConstructionQuantity )
        // {
        //     const titleTip3 = '日补充计划施工数'+'由'+valueBefore.dailyPlanConstructionQuantity+'改为'+valueAfter.dailyPlanConstructionQuantity
        //     this.setState({
        //         titleTip3
        //     })
        // }
        // //日补充计划实际完成数
        // if(valueBefore.dailyActualConstructionQuantity!=valueAfter.dailyActualConstructionQuantity )
        // {
        //     const titleTip4 = '日补充计划实际完成数'+'由'+valueBefore.dailyActualConstructionQuantity+'改为'+valueAfter.dailyActualConstructionQuantity
        //     this.setState({
        //         titleTip4
        //     })
        // }
        // //临时补修计划施工数
        // if(valueBefore.tempPlanConstructionQuantity!=valueAfter.tempPlanConstructionQuantity )
        // {
        //     const titleTip5 = '临时补修计划施工数'+'由'+valueBefore.tempPlanConstructionQuantity+'改为'+valueAfter.tempPlanConstructionQuantity
        //     this.setState({
        //         titleTip5
        //     })
        // }
        // //临时补修实际完成数
        // if(valueBefore.tempActualConstructionQuantity!=valueAfter.tempActualConstructionQuantity)
        // {
        //     const titleTip6 = '临时补修实际完成数'+'由'+valueBefore.repairActualConstructionQuantity+'改为'+valueAfter.repairActualConstructionQuantity
        //     this.setState({
        //         titleTip6
        //     })
        // }
        //抢修施工计划完成数
        if(valueBefore.repairPlanConstructionQuantity!=valueAfter.repairPlanConstructionQuantity)
        {
            const titleTip7 = '抢修施工计划完成数'+'由'+valueBefore.repairPlanConstructionQuantity+'改为'+valueAfter.repairPlanConstructionQuantity
            this.setState({
                titleTip7                
            })
        }
        //抢修施工实际完成数
        if(valueBefore.repairActualConstructionQuantity!=valueAfter.repairActualConstructionQuantity)
        {
            const titleTip8 = '抢修施工实际完成数'+'由'+valueBefore.repairActualConstructionQuantity+'改为'+valueAfter.repairActualConstructionQuantity
            this.setState({
                titleTip8
            })
        }
        //计划施工数
        if(valueBefore.totalPlanConstructionQuantity!=valueAfter.totalPlanConstructionQuantity)
        {
            const titleTip10 = '抢修施工计划完成数'+'由'+valueBefore.totalPlanConstructionQuantity+'改为'+valueAfter.totalPlanConstructionQuantity
            this.setState({
                titleTip10              
            })
        }
        //抢修施工实际完成数
        if(valueBefore.totalActualConstructionQuantity!=valueAfter.totalActualConstructionQuantity)
        {
            const titleTip11 = '抢修施工实际完成数'+'由'+valueBefore.totalActualConstructionQuantity+'改为'+valueAfter.totalActualConstructionQuantity
            this.setState({
                titleTip11
            })
        }
         //情况说明
         if(valueBefore.description!=valueAfter.description)
         {
            //  if(valueBefore.description==''){
            //     const titleTip9 = '情况说明'+'由'+'无'+'改为'+valueAfter.description
            //     this.setState({
            //         titleTip9
            //     })
            //  }
            //  else{
            //     const titleTip9 = '情况说明'+'由'+valueBefore.description+'改为'+valueAfter.description
            //     this.setState({
            //         titleTip9
            //     })
            //  }
             const descriptionBefore = valueBefore.description == '' ? '无':valueBefore.description
             const descriptionAfter = valueAfter.description == '' ? '无':valueAfter.description
             const titleTip9 = '情况说明'+'由'+descriptionBefore+'改为'+descriptionAfter
             this.setState({
                titleTip9
            })
         }
}
  editFun = () => {
    this.setState({
        disabled: false,
        changeButtonShow: false,
    })
  }
      //点击修改日志按钮
      editInfoFun=()=>{
        const { showEditInfoModal } = this.state
        this.setState({
            showEditInfoModal: !showEditInfoModal,
        })
    }
     //
     handleCancelClose = () => {
        this.setState({ showSubmitModal: false })
    }
    changeRemark = (e) => {
        this.setState({
            modifyRemark: e.target.value
        })
        // console.log(e.target.value)
    }
    
  //计算计划施工数 = 周计划施工数 + 抢修施工计划完成数
  //计算计划施工实际完成数 = 周计划实际完成数 + 抢修施工实际完成数
  
  //获取周计划施工数
  getWeeklyPlanQuantityValue = ({target: { value }}) =>{
    //   console.log(44,value)
    const {WeeklyActualQuantityValue,RepairPlanQuantityValue,repairActualQuantityvalue} = this.state
    this.setState({
        WeeklyPlanQuantityValue: value
    },()=>{
            this.props.form.setFieldsValue({
                totalPlanConstructionQuantity: Number(this.state.WeeklyPlanQuantityValue) + Number(RepairPlanQuantityValue),//计划施工数
            })
        
    })
}
  //获取周计划实际完成数
  getWeeklyActualQuantityValue = ({target: { value }}) =>{
    const {WeeklyPlanQuantityValue,RepairPlanQuantityValue,repairActualQuantityvalue} = this.state
    this.setState({
        WeeklyActualQuantityValue: value
    },()=>{
       
            this.props.form.setFieldsValue({
                totalActualConstructionQuantity: Number(this.state.WeeklyActualQuantityValue) + Number(repairActualQuantityvalue)//计划施工实际完成数
            })
        
    })
}
  //获取抢修施工计划完成数
  getRepairPlanQuantityValue = ({target: { value }}) =>{
    const {WeeklyPlanQuantityValue,WeeklyActualQuantityValue,repairActualQuantityvalue} = this.state
    this.setState({
        RepairPlanQuantityValue: value
    },()=>{
      
            this.props.form.setFieldsValue({
                totalPlanConstructionQuantity: Number(WeeklyPlanQuantityValue) + Number(this.state.RepairPlanQuantityValue),//计划施工数
            })
        
    })
}

  //获取抢修施工实际完成数
  getPlanAndActualQuantity = ({target: { value }}) =>{
    const {WeeklyPlanQuantityValue,WeeklyActualQuantityValue,RepairPlanQuantityValue} = this.state
    this.setState({
        repairActualQuantityvalue: value
    },()=>{
       
            this.props.form.setFieldsValue({
                totalActualConstructionQuantity: Number(WeeklyActualQuantityValue) + Number(this.state.repairActualQuantityvalue)//计划施工实际完成数
            })
        
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
        const { isAdd, rightData,canModifyApproved,canModifyInit } = this.props;
        const { changeButtonShow, showEditInfoModal } = this.state;
        return (
            <div style={{marginTop:'10px'}}>
                {/* <Modal className={style.main} */}
                    {/* width="1000px" */}
                    {/* afterClose={this.props.form.resetFields} */}
                    {/* mask={false} */}
                    {/* maskClosable={false} */}
                    {/* footer={<div className="modalbtn"> */}
                        {/* 取消 */}
                        {/* <Button key={1} onClick={this.props.handleCancel}>取消</Button> */}
                        {/* 保存 */}
                        {/* {isAdd && <Button key={2} onClick={this.handleSubmit.bind(this, 'save')} type="primary">保存</Button>} */}
                        {/* {!isAdd && <Button key={2} onClick={this.handleSubmit.bind(this, 'update')} type="primary">更新</Button>} */}
                    {/* </div>} */}
                    {/* centered={true} title={!isAdd ? '查看' : '新增'} visible={this.props.modalVisible} */}
                    {/* onCancel={this.props.handleCancel}> */}
                    {canModifyApproved && changeButtonShow && <div style={{float:'right',display:'inline-block'}}><Button type="primary" icon= "edit" size='small' onClick={this.editFun} style={{ marginRight: 10 }}>调整</Button></div>}
                    {canModifyInit && changeButtonShow && <div style={{float:'right',display:'inline-block'}}><Button type="primary" icon= "edit" size='small' onClick={this.editFun} style={{ marginRight: 10 }}>修改</Button></div>}
                    {(canModifyApproved || canModifyInit) && !changeButtonShow && <div style={{float:'right',display:'inline-block'}}><Button type="primary" icon="check" size='small' onClick={this.handleSubmit.bind(this, 'update')} style={{ marginRight: 10 }}>提交</Button></div>}
                    <div style={{float:'right',display:'inline-block'}}><Button type="primary" icon='profile' size='small' style={{ marginRight: 15 }} onClick={this.editInfoFun}>{rightData && rightData.reviewStatusVo.code=='INIT'?'修改日志':'调整日志'}</Button></div>
                    <div style={{clear:'both'}}></div>
                    <div style={{marginBottom:10,marginTop:20,padding:'0 70px'}}><Descriptions column={4}>
                        <Descriptions.Item label="日期">{rightData && rightData.recordTime || ''}</Descriptions.Item>
                        <Descriptions.Item label="线路">{rightData && rightData.lineName || ''}</Descriptions.Item>
                        <Descriptions.Item label="填报人">{rightData && rightData.createVo && rightData.createVo.name || ''}</Descriptions.Item>
                        <Descriptions.Item label="填报时间">{rightData && rightData.creatTime || ''}</Descriptions.Item>
                        <Descriptions.Item label="审核人">{rightData && rightData.reviewerVo && rightData.reviewerVo.name || ''}</Descriptions.Item>
                        <Descriptions.Item label="审核时间">{rightData && rightData.reviewerTime || ''}</Descriptions.Item>
                    </Descriptions></div>
                    <Form>
                    <Modal title="提交修改"
                        visible={this.state.showSubmitModal}
                        onOk={this.handleSubmitSign.bind(this)}
                        onCancel={this.handleCancelClose}
                        width='500px'>
                        <div id='modifyContent'>
                            {this.state.titleTip&&<p>{this.state.titleTip}</p>}   
                            {this.state.titleTip1&&<p>{this.state.titleTip1}</p>} 
                            {this.state.titleTip2&&<p>{this.state.titleTip2}</p>} 
                            {/* {this.state.titleTip3&&<p>{this.state.titleTip3}</p>} 
                            {this.state.titleTip4&&<p>{this.state.titleTip4}</p>} 
                            {this.state.titleTip5&&<p>{this.state.titleTip5}</p>} 
                            {this.state.titleTip6&&<p>{this.state.titleTip6}</p>}  */}
                            {this.state.titleTip7&&<p>{this.state.titleTip7}</p>} 
                            {this.state.titleTip8&&<p>{this.state.titleTip8}</p>} 
                            {this.state.titleTip9&&<p>{this.state.titleTip9}</p>} 
                            {this.state.titleTip10&&<p>{this.state.titleTip10}</p>} 
                            {this.state.titleTip11&&<p>{this.state.titleTip11}</p>} 
                        </div>
                        <span style={{'fontWeight':'bold','verticalAlign':'top'}}>修改备注：</span><TextArea style={{ width: 400 }} onChange={this.changeRemark.bind(this)}/>
                    </Modal>
                    <div>
                        <Row type="flex">
                            <Col span={12}>
                                <Form.Item label="周计划施工数" {...formItemLayout}>
                                {getFieldDecorator('weeklyPlanConstructionQuantity', {
                                initialValue:rightData && rightData.weeklyPlanConstructionQuantity || '',
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
                                initialValue:rightData && rightData.weeklyActualConstructionQuantity || '',
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
                                initialValue:rightData && rightData.dailyPlanConstructionQuantity || '',
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
                                initialValue:rightData && rightData.dailyActualConstructionQuantity || '',
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
                                initialValue:rightData && rightData.tempPlanConstructionQuantity || '',
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
                                initialValue:rightData && rightData.tempActualConstructionQuantity || '',
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
                                initialValue:rightData && rightData.repairPlanConstructionQuantity || '',
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
                                initialValue:rightData && rightData.repairActualConstructionQuantity || '',
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
                                initialValue:rightData && rightData.totalPlanConstructionQuantity || '',
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
                                initialValue:rightData && rightData.totalActualConstructionQuantity || '',
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
                                initialValue:rightData && rightData.description || '',
                                rules: [],
                                })(
                                    <TextArea placeholder="请输入" disabled={isAdd ? false : this.state.disabled} />
                                )}
                                </Form.Item>
                            </Col>
                        </Row>
                        </div>
                    </Form>
                    {showEditInfoModal && <EditLogModal record={rightData} handleCancel={this.editInfoFun} modalVisible={showEditInfoModal}/>}                            
                {/* </Modal> */}
            </div>
        )
    }
}
const AddModals = Form.create()(AddModal);
export default connect(state => ({
    currentLocale: state.localeProviderData,
}))(AddModals);