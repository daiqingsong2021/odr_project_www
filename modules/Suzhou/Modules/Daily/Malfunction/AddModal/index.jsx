import React, { Component } from 'react';
import { Modal, Form, Row, Col, Input, Button, Icon, Select, Divider, DatePicker, Descriptions, TreeSelect, Tabs } from 'antd';
import moment from 'moment';
import style from './style.less';
import intl from 'react-intl-universal';
import { connect } from 'react-redux';
import { curdCurrentData } from '../../../../../../store/curdData/action';
import axios from '../../../../../../api/axios';
import {faultDailyAdd,faultDailyUpdate,addDailyChangeVersion} from '@/modules/Suzhou/api/suzhou-api';
const { TextArea } = Input;
const Option = Select.Option;
const TreeNode = TreeSelect.TreeNode;
import PublicButton from "../../../../../../components/public/TopTags/PublicButton";
import * as dataUtil from "../../../../../../utils/dataUtil";
import { getSelectTreeArr } from "@/modules/Suzhou/components/Util/firstLoad";
import SelectSection from '@/modules/Suzhou/components/SelectSection';
const { TabPane } = Tabs;
import { getBaseData } from '@/modules/Suzhou/components/Util/util';
import QuestionModal from '../QuestionModal';
import WorkflowInfo from '@/modules/Components/Workflow/ProcLabel'
// import EditLogModal from '@/modules/Suzhou/components/EditLogModalMal/index'
import EditLogModal from '@/modules/Suzhou/components/EditLogModal/index'
export class AddModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            disabled:true,
            lineArr:[],//线路
            tabVisible:true,//true 不能点
            addInfo:{},//新增的数据
            height:0,
            disabledFormEdit:false,
            isSubmitBtn:false,
            changeKey:'1',//页签自动跳转
            submitShow:0,
            showSubmitModal:false,
            modifyRemark:''
        }
    }
    componentDidMount() {
        // 初始化css样式
        const h = document.documentElement.clientHeight || document.body.clientHeight;   // 浏览器高度，用于设置组件高度
        this.setState({
            height: h - 290,
        });
        getBaseData("line").then((res) => {
            if (Array.isArray(res)) {
                this.setState({
                    lineArr: res
                })
            }
        });
        this.props.addOrModify == 'modify'?this.setState({tabVisible:false,addInfo:this.props.rightData,disabledFormEdit:true}):null;
        if(this.props.addOrModify == 'modify'){
            this.props.rightData.statusVo = this.props.rightData.status
        }
    }
    //选择日期
    handleDate = () => { }

    //新增提交
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            values.recordDay = values.recordDay ? moment(values.recordDay).format('YYYY-MM-DD') : values.recordDay;
            if (!err && this.props.addOrModify == 'add') {
                const data = {
                    ...values,
                }
                console.log(data)
                axios.post(faultDailyAdd, data, true).then(res => {
                    if (res.data.status === 200) {
                        this.setState({
                            addInfo: res.data.data,
                            tabVisible: false,
                            changeKey: '2',

                        })
                        //   this.props.success(res.data.data);
                    }
                });
            }
            if (!err && this.props.addOrModify == 'modify') {
                const valueBefore = this.props.rightData//修改前数据
                const valueAfter = values
                this.compareData(valueBefore, valueAfter);
                this.setState({
                    valueAfter,
                    showSubmitModal: true
                })
            }

        });
    };
    //this.props.addOrModify == 'modify'，提交按钮
    handleSubmitSign=()=>{
        let data=this.state.valueAfter;
        data.id=this.props.rightData.id;
        let f1 = new Promise((resolve, reject) => {
            axios.put(faultDailyUpdate,data,true).then(res=>{
                if(res.data.status === 200){
                    this.setState({
                        addInfo:res.data.data,
                        changeKey:'1',
                        // showSubmitModal:false,
                        addModalShow:false,
                        isSubmitBtn:false
                    })
                    resolve('success')
                    // this.props.updateSuccess(res.data.data);
                }
                
            })
        })
        let f2 = new Promise((resolve, reject) => {
            const params = {
                moudleRecordId:this.props.rightData.id,
                moudleName:'故障日况',
                modifyRemark:this.state.modifyRemark,
                modifyContent:document.getElementById('modifyContent').innerText
            }
            axios.post(addDailyChangeVersion,params,true).then(res => {
                if (res.data.status === 200) {
                    resolve('success')
                    // this.setState({ showSubmitModal: false })
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
        })
        Promise.all([f1, f2]).then( (results) => {
            // console.log(results)// ["p1 data", ""p2 data""]
            if(results && results.length > 1 && results[0] == 'success' && results[1] == 'success'){
                this.setState({ showSubmitModal: false,isSubmitBtn:true })
                // this.props.handleCancel()
                console.log(23,this.props.rightData)
                // this.props.openInfo(this.props.rightData)
                // this.props.updateSuccess(this.props.rightData);
                this.props.openInfo(this.props.rightData)
            }else{
                notification.error(
                    {
                      placement: 'bottomRight',
                      bottom: 50,
                      duration: 2,
                      message: '出错了',
                      description: '出错了'
                    }
                  )
            }
        })


    }
    compareData = (valueBefore, valueAfter) => {
        console.log(valueAfter, valueBefore)
        if (valueBefore.majorVehicle == valueAfter.majorVehicle//车辆
            && valueBefore.majorPower == valueAfter.majorPower//供电
            && valueBefore.majorSignal == valueAfter.majorSignal//信号
            && valueBefore.majorCommunication == valueAfter.majorCommunication//通信
            && valueBefore.majorConstruction == valueAfter.majorConstruction//工建
            && valueBefore.majorMechatronics == valueAfter.majorMechatronics //机电
            && valueBefore.majorAfc == valueAfter.majorAfc//AFC
            && valueBefore.majorOther == valueAfter.majorOther//其他
        ) {
            const titleTip = '无修改记录'
            this.setState({
                titleTip
            })
        }
        //车辆
        if (valueBefore.majorVehicle != valueAfter.majorVehicle) {
            const titleTip1 = '车辆' + '由' + valueBefore.majorVehicle + '改为' + valueAfter.majorVehicle
            this.setState({
                titleTip1
            })
        }
        //供电
        if (valueBefore.majorPower != valueAfter.majorPower) {
            const titleTip2 = '供电' + '由' + valueBefore.majorPower + '改为' + valueAfter.majorPower
            this.setState({
                titleTip2
            })
        }
        //信号
        if (valueBefore.majorSignal != valueAfter.majorSignal) {
            const titleTip3 = '信号' + '由' + valueBefore.majorSignal + '改为' + valueAfter.majorSignal
            this.setState({
                titleTip3
            })
        }
        //通信
        if (valueBefore.majorCommunication != valueAfter.majorCommunication) {
            const titleTip4 = '通信' + '由' + valueBefore.majorCommunication + '改为' + valueAfter.majorCommunication
            this.setState({
                titleTip4
            })
        }
        //工建
        if (valueBefore.majorConstruction != valueAfter.majorConstruction) {
            const titleTip5 = '工建' + '由' + valueBefore.majorConstruction + '改为' + valueAfter.majorConstruction
            this.setState({
                titleTip5
            })
        }
        //机电
        if (valueBefore.majorMechatronics != valueAfter.majorMechatronics) {
            const titleTip6 = '机电' + '由' + valueBefore.majorMechatronics + '改为' + valueAfter.majorMechatronics
            this.setState({
                titleTip6
            })
        }
        //AFC
        if (valueBefore.majorAfc != valueAfter.majorAfc) {
            const titleTip7 = 'AFC' + '由' + valueBefore.majorAfc + '改为' + valueAfter.majorAfc
            this.setState({
                titleTip7
            })
        }
        //其他
        if (valueBefore.majorOther != valueAfter.majorOther) {
            const titleTip8 = '其他' + '由' + valueBefore.majorOther + '改为' + valueAfter.majorOther
            this.setState({
                titleTip8
            })
        }
    }
    //点击调整按钮
    editFun = () => {
        this.setState({
            disabledFormEdit: false,
            isSubmitBtn: true,
        })
    }
    //点击修改日志按钮
    editInfoFun = () => {
        const { showEditInfoModal } = this.state
        this.setState({
            showEditInfoModal: !showEditInfoModal,
        })
    }
    //切换标签页
    changeTap = (activeKey) => {
        this.setState({
            changeKey: activeKey
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
    render() {
        const { intl } = this.props.currentLocale
        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
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
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 18 },
            },
        };
        const formItemLayout1 = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 3 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 21 },
            },
        };
        const { isAdd, addOrModify } = this.props;
        console.log(this.props.modifyDisabled)
        console.log(this.props.rightData)
        console.log(!this.props.rightData ||!this.props.rightData.status|| this.props.rightData.status !='INIT')
        const { addInfo, showEditInfoModal, disabledFormEdit } = this.state;
        return (
            <div>
                <div className={style.main} style={{ top: this.props.flowRight ? '40px' : '0' }} data-contentwidth={'100%'} id={this.props.menuCode + "-LabelsGroup"}>
                    <div id={id} className={style.content} style={{ width: '100%', height: this.props.height ? parseInt(this.props.height) + 50 + 'px' : this.state.height + 190 }}>
                        <div className={style.subTags}>
                            {/* <div className={style.content}  style={{ width: '100%' ,height: this.props.height ? parseInt(this.props.height) +10 +'px' : this.state.height+110}}> */}
                                <div className={style.rightClose} onClick={this.props.handleCancel}>
                                    <Icon type="close" />
                                </div>
                                <Tabs defaultActiveKey="1" activeKey={this.state.changeKey} onChange={this.changeTap}>
                                    <TabPane tab="基本信息" key="1">
                                        <div style={{textAlign:'right',marginBottom:'10px',marginTop:'10px'}}>
                                            {this.props.addOrModify == 'modify' && <Button type="primary" icon='profile' size='small' style={{ marginRight: 15 }} onClick={this.editInfoFun}> {this.props.rightData &&this.props.rightData.status&&this.props.rightData.status =='INIT'?'修改日志':'调整日志'}</Button>}
                                            {this.props.addOrModify == 'add' &&(
                                                <Button key={2} size='small' onClick={this.handleSubmit.bind(this)} type="primary" disabled={this.props.modifyDisabled}>{intl.get('wsd.global.btn.preservation')}</Button>
                                            )}
                                            {this.props.addOrModify == 'modify' && this.props.rightData&& this.props.rightData.status =='INIT' && !this.state.isSubmitBtn && (
                                                <Button key={2} size='small' onClick={this.editFun.bind(this)} type="primary" disabled={this.props.modifyDisabled}>修改</Button>
                                            )}
                                            {this.props.addOrModify == 'modify'&& this.props.rightData && this.props.rightData.status =='APPROVED' && !this.state.isSubmitBtn && (
                                                <Button key={2} size='small' onClick={this.editFun.bind(this)} type="primary" disabled={this.props.modifyDisabled}>调整</Button>
                                            )}
                                            {this.state.isSubmitBtn && <Button key={2} size='small' onClick={this.handleSubmit} type="primary" disabled={this.props.modifyDisabled}>提交</Button>}
                                        </div>
                                        <Form onSubmit={this.handleSubmit}>
                                        <Modal title="提交修改"
                                                visible={this.state.showSubmitModal}
                                                onOk={this.handleSubmitSign.bind(this)}
                                                onCancel={this.handleCancelClose}
                                                width='500px'>
                                                <div id='modifyContent'>
                                                {this.state.titleTip&&<p>{this.state.titleTip}</p>}   
                                                {this.state.titleTip1&&<p>{this.state.titleTip1}</p>} 
                                                {this.state.titleTip2&&<p>{this.state.titleTip2}</p>} 
                                                {this.state.titleTip3&&<p>{this.state.titleTip3}</p>} 
                                                {this.state.titleTip4&&<p>{this.state.titleTip4}</p>} 
                                                {this.state.titleTip5&&<p>{this.state.titleTip5}</p>} 
                                                {this.state.titleTip6&&<p>{this.state.titleTip6}</p>} 
                                                {this.state.titleTip7&&<p>{this.state.titleTip7}</p>} 
                                                {this.state.titleTip8&&<p>{this.state.titleTip8}</p>} 
                                                </div>
                                                <span style={{'fontWeight':'bold','verticalAlign':'top'}}>修改备注：</span><TextArea style={{ width: 400 }} onChange={this.changeRemark.bind(this)}/>
                                        </Modal>
                                        <Row type="flex">
                                            <Col span={12}>
                                                <Form.Item label="日期" {...formItemLayout0}>
                                                    {getFieldDecorator('recordDay', {
                                                        initialValue: dataUtil.Dates().formatDateMonent(addInfo.recordDay),
                                                        rules: [{ required: true, message: '请选择日期' }],
                                                    })(
                                                        <DatePicker style={{ width: '100%' }} onChange={this.handleDate} disabled={addOrModify == 'modify' ? true : false} />
                                                    )}

                                                </Form.Item>
                                            </Col>
                                            <Col span={12}>
                                                <Form.Item label="线路" {...formItemLayout0}>
                                                    {getFieldDecorator('line', {
                                                        initialValue: !addInfo.line ? null : addInfo.line.toString(),
                                                        rules: [{ required: true, message: '请选择线路' }],
                                                    })(
                                                        <Select
                                                            disabled={addOrModify == 'modify' ? true : false}
                                                            showSearch
                                                            allowClear={true}
                                                            placeholder="请选择线路"
                                                            optionFilterProp="children"
                                                            required
                                                            filterOption={(input, option) =>
                                                                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                            }
                                                        >
                                                            {this.state.lineArr.length && this.state.lineArr.map(item => {
                                                                return (
                                                                    <Option value={item.value} key={item.value}>{item.title}</Option>
                                                                )
                                                            })}
                                                        </Select>
                                                    )}
                                                </Form.Item>
                                            </Col>
                                            <Col span={12}>
                                                <Form.Item label="车辆" {...formItemLayout}>
                                                    {getFieldDecorator('majorVehicle', {
                                                        initialValue: addInfo.majorVehicle,
                                                        rules: [{ required: true, message: '请输入车辆' }],
                                                        getValueFromEvent: (event) => {
                                                            return (event.target.value.length < 2) ? event.target.value.replace(/\D/g, '') : event.target.value.replace(/[^1-9]/g, '')
                                                        },
                                                    })(
                                                        <Input placeholder="请输入" disabled={disabledFormEdit} />
                                                    )}
                                                </Form.Item>
                                            </Col>
                                            <Col span={12}>
                                                <Form.Item label="供电" {...formItemLayout}>
                                                    {getFieldDecorator('majorPower', {
                                                        initialValue: addInfo.majorPower,
                                                        rules: [{ required: true, message: '请输入供电' }],
                                                        getValueFromEvent: (event) => {
                                                            return (event.target.value.length < 2) ? event.target.value.replace(/\D/g, '') : event.target.value.replace(/[^1-9]/g, '')
                                                        },
                                                    })(
                                                        <Input placeholder="请输入" disabled={disabledFormEdit} />
                                                    )}
                                                </Form.Item>
                                            </Col>
                                            <Col span={12}>
                                                <Form.Item label="信号" {...formItemLayout}>
                                                    {getFieldDecorator('majorSignal', {
                                                        initialValue: addInfo.majorSignal,
                                                        rules: [{ required: true, message: '请输入信号' }],
                                                        getValueFromEvent: (event) => {
                                                            return (event.target.value.length < 2) ? event.target.value.replace(/\D/g, '') : event.target.value.replace(/[^1-9]/g, '')
                                                        },
                                                    })(
                                                        <Input placeholder="请输入" disabled={disabledFormEdit} />
                                                    )}
                                                </Form.Item>
                                            </Col>
                                            <Col span={12}>
                                                <Form.Item label="通信" {...formItemLayout}>
                                                    {getFieldDecorator('majorCommunication', {
                                                        initialValue: addInfo.majorCommunication,
                                                        rules: [{ required: true, message: '请输入通信' }],
                                                        getValueFromEvent: (event) => {
                                                            return (event.target.value.length < 2) ? event.target.value.replace(/\D/g, '') : event.target.value.replace(/[^1-9]/g, '')
                                                        },
                                                    })(
                                                        <Input placeholder="请输入" disabled={disabledFormEdit} />
                                                    )}
                                                </Form.Item>
                                            </Col>
                                            <Col span={12}>
                                                <Form.Item label="工建" {...formItemLayout}>
                                                    {getFieldDecorator('majorConstruction', {
                                                        initialValue: addInfo.majorConstruction,
                                                        rules: [{ required: true, message: '请输入工建' }],
                                                        getValueFromEvent: (event) => {
                                                            return (event.target.value.length < 2) ? event.target.value.replace(/\D/g, '') : event.target.value.replace(/[^1-9]/g, '')
                                                        },
                                                    })(
                                                        <Input placeholder="请输入" disabled={disabledFormEdit} />
                                                    )}
                                                </Form.Item>
                                            </Col>
                                            <Col span={12}>
                                                <Form.Item label="机电" {...formItemLayout}>
                                                    {getFieldDecorator('majorMechatronics', {
                                                        initialValue: addInfo.majorMechatronics,
                                                        rules: [{ required: true, message: '请输入机电' }],
                                                        getValueFromEvent: (event) => {
                                                            return (event.target.value.length < 2) ? event.target.value.replace(/\D/g, '') : event.target.value.replace(/[^1-9]/g, '')
                                                        },
                                                    })(
                                                        <Input placeholder="请输入" disabled={disabledFormEdit} />
                                                    )}
                                                </Form.Item>
                                            </Col>
                                            <Col span={12}>
                                                <Form.Item label="AFC" {...formItemLayout}>
                                                    {getFieldDecorator('majorAfc', {
                                                        initialValue: addInfo.majorAfc,
                                                        rules: [{ required: true, message: '请输入AFC' }],
                                                        getValueFromEvent: (event) => {
                                                            return (event.target.value.length < 2) ? event.target.value.replace(/\D/g, '') : event.target.value.replace(/[^1-9]/g, '')
                                                        },
                                                    })(
                                                        <Input placeholder="请输入" disabled={disabledFormEdit} />
                                                    )}
                                                </Form.Item>
                                            </Col>
                                            <Col span={12}>
                                                <Form.Item label="其他" {...formItemLayout}>
                                                    {getFieldDecorator('majorOther', {
                                                        initialValue: addInfo.majorOther,
                                                        rules: [{ required: true, message: '请输入其他' }],
                                                        getValueFromEvent: (event) => {
                                                            return (event.target.value.length < 2) ? event.target.value.replace(/\D/g, '') : event.target.value.replace(/[^1-9]/g, '')
                                                        },
                                                    })(
                                                        <Input placeholder="请输入" disabled={disabledFormEdit} />
                                                    )}
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        {/* <Row>
                                                <Col span={24}>
                                                        <div className="modalbtn" style={{textAlign:"right"}}>
                                                        <Button key={1} onClick={this.props.handleCancel}>取消</Button>
                                                        {this.props.addOrModify == 'add' &&(
                                                            <Button key={2} onClick={this.handleSubmit.bind(this)} type="primary" disabled={this.props.modifyDisabled}>{intl.get('wsd.global.btn.preservation')}</Button>
                                                        )}
                                                        {this.props.addOrModify == 'modify' && this.props.rightData.status =='INIT'&&(
                                                            <Button key={2} onClick={this.handleSubmit.bind(this)} type="primary" disabled={this.props.modifyDisabled}>修改</Button>
                                                        )}
                                                        {this.props.addOrModify == 'modify' && this.props.rightData.status =='APPROVED'&&(
                                                            <Button key={2} onClick={this.handleSubmit.bind(this)} type="primary" disabled={this.props.modifyDisabled}>调整</Button>
                                                        )}
                                                    </div>
                                                    
                                                </Col>
                                            </Row> */}
                                    </Form>
                                </TabPane>
                                <TabPane tab="故障及处理详情" disabled={this.state.tabVisible} key="2">

                                    <QuestionModal
                                        addInfo={this.state.addInfo}
                                        modifyDisabled={this.props.modifyDisabled}
                                    />

                                </TabPane>
                                {/* {this.props.addOrModify == 'add' ? null : (
                                    <TabPane tab="流程信息" key="3">
                                        <WorkflowInfo
                                            {...this.props}
                                            menuCode={this.props.menuCode}
                                            menuId={this.props.menuId}
                                            bizId={this.props.bizId}
                                            bizType={this.props.bizType}
                                            fileEditAuth={this.props.fileEditAuth}
                                            extInfo={{ startContent: "故障日况" }}
                                            taskFlag={this.props.taskFlag}
                                            isCheckWf={this.props.isCheckWf}  //流程查看
                                            openWorkFlowMenu={this.props.openWorkFlowMenu}
                                            data={this.props.rightData}
                                        // closeRightBox={this.closeRightBox}
                                        // currentTitle={this.state.currentTitle}
                                        // submitData={this.props.submitData}
                                        // changeFileUrl={this.changeFileUrl}
                                        // 所有方法属性往组件透传
                                        // title = {this.state.currentTitle }
                                        // height = {this.state.height}
                                        // labelWidth = {labelWidth }
                                        />
                                    </TabPane>
                                )} */}
                            </Tabs>
                        </div>
                    </div>
                </div>
                {showEditInfoModal && <EditLogModal record={this.props.rightData} handleCancel={this.editInfoFun} modalVisible={showEditInfoModal} />}
            </div>
        )
    }
}
const AddModals = Form.create()(AddModal);
export default connect(state => ({
    currentLocale: state.localeProviderData,
}))(AddModals);