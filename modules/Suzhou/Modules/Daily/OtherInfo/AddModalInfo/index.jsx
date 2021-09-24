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
import EditLogModal from '@/modules/Suzhou/components/EditLogModal/index'
export class AddModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            disabled:true,
            changeButtonShow:true,  //调整按钮
        }
    }
    componentDidMount() {
        console.log(this.props.rightData)
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
      //点击修改日志按钮
      editInfoFun=()=>{
        const { showEditInfoModal } = this.state
        this.setState({
            showEditInfoModal: !showEditInfoModal,
        })
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
                                    <Input placeholder="请输入" disabled={isAdd ? false : this.state.disabled} />
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
                                    <Input placeholder="请输入" disabled={isAdd ? false : this.state.disabled} />
                                // <InputNumber min={0} precision={0} max={!isNaN(Number(getFieldValue('weeklyPlanConstructionQuantity'))) ? Number(getFieldValue('weeklyPlanConstructionQuantity')) : Infinity} placeholder="请输入" disabled={isAdd ? false : this.state.disabled} style={{width:'243px'}}/>
                                )}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row type="flex">
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
                        </Row>
                        <Row type="flex">
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
                        </Row>
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
                                    <Input placeholder="请输入" disabled={isAdd ? false : this.state.disabled} />
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
                                    <Input placeholder="请输入" disabled={isAdd ? false : this.state.disabled} />
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