import React, { Component } from 'react';
import {  Modal, Form, Table, Input, Button, Anchor, Select, Divider, DatePicker, InputNumber, Row, Col } from 'antd';
import moment from 'moment';
import style from './style.less';
import intl from 'react-intl-universal';
import { connect } from 'react-redux';
import { curdCurrentData } from '../../../../../../store/curdData/action';
import axios from '../../../../../../api/axios';
import { getTrainScheduleList, checkTrainCreatTime } from '../../../../api/suzhou-api';
import { getBaseData } from '@/modules/Suzhou/components/Util/util';
import MetroModal from '../MetroCodeModal/index'
const { Item } = Form;
const { Link } = Anchor
const { TextArea } = Input;
const Option = Select.Option;
import PublicButton from "../../../../../../components/public/TopTags/PublicButton";
import * as dataUtil from "../../../../../../utils/dataUtil";
import FormItem from 'antd/lib/form/FormItem';

export class AddModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            treeDataZq: [], //当日时刻表数据
            disabled: false,  //默认输入框不可写入
            isCheckTime: false, //日期校验 true为已存在fasle 为不存在
            showMetroModal:false,   //选择车辆modal
            lineArr: [], //线路
            recordTime: '',  //记录日期
            line: '',    //线路
            scheduleId: '', //选择的是时刻表id
            submitData: {   //提交的数据
                data1: [    //table1
                    { id: 1, type: '当日时刻表', number: '', isSelect: true, typeSec: '2-5分钟终到早点列次', numberSec: '' },
                    { id: 2, type: '最大上线列车', number: '', typeSec: '2-5分钟终到晚点列次', numberSec: '' },
                    { id: 3, type: '最小行车间隔(m)', number: '', typeSec: '5-10分钟终到早点列次', numberSec: '' },
                    { id: 4, type: '备用车数', number: '', typeSec: '5-10分钟终到晚点列次', numberSec: '' },
                    { id: 5, type: '计划开行（列）', number: '', typeSec: '10-15分钟终到早点列次', numberSec: '' },
                    { id: 6, type: '区间', number: '', typeSec: '10-15分钟终到晚点列次', numberSec: '' },
                    { id: 7, type: '首末班车时间', number: '', typeSec: '15分钟以上终到早点列次', numberSec: '' },
                    { id: 8, type: '实际开行（列）', number: '', typeSec: '15分钟以上终到晚点列次', numberSec: '' },
                    { id: 9, type: '兑现率', number: '', },
                    { id: 10, type: '准点率', number: '', },
                    { id: 11, type: '终到早点（列）', number: '' },
                    { id: 12, type: '终到准点（列）', number: '' },
                    { id: 13, type: '终到晚点（列）', number: '' }
                ],
                data2: [    //table2
                    { id: 14, type: '加开（列）', number: '', typeSec: '故障清客（列）', numberSec: '' },
                    { id: 15, type: '救援（列）', number: '', typeSec: '运营调整（列）', numberSec: '' },
                    { id: 16, type: '跳停（列）', number: '' },
                    { id: 17, type: '抽线（列）', number: '' },
                    { id: 18, type: '下线（列）', number: '' }
                ],
                data3: [    //table3
                    { id: 19, type: '运营里程', number: '' },
                    { id: 20, type: '载客里程', number: '' },
                    { id: 21, type: '空驶里程', number: '' }
                ],
                data4: [    //table4
                    { id: 22, type: '运用车', number: '' },
                    { id: 23, type: '备用车', number: '' },
                    { id: 24, type: '调试车', number: '' },
                    { id: 25, type: '检修车', number: '' },
                    { id: 26, type: '其他', number: '' }
                ],
            },
        }
    }
    componentDidMount() {
        getBaseData('line').then(data => { this.setState({ lineArr: data }) })
    }
    //获取时刻表数据
    getTrainScheduleList = (line) => {
        axios.get(getTrainScheduleList, { params: { scheduleCode: '', line } }).then(res => {
            let data = res.data.data ? res.data.data : []
            this.setState({
                treeDataZq: data,
            })
        })
    }
    //选择记录日期
    handleDate = (value) => {
        const recordTime = moment(value).format('YYYY-MM-DD')
        this.setState({ recordTime })
    }
    //校验日期
    checkTrainCreatTime = (rule, value, callback) => {
        const recordTime = moment(value).format('YYYY-MM-DD')
        axios.get(checkTrainCreatTime + `?checkCreatTime=${recordTime}`).then(res => {
            const isCheckTime = res.data.data
            this.setState({ isCheckTime })
            if (isCheckTime == 'true') {
                callback('日期已存在')
            } else {
                callback()
            }
        })
    }
    //选择线路
    selectLineFun = (value) => {
        this.setState({ line: value }, () => {
            this.getTrainScheduleList(value)
        })
    }
    //选择时刻表
    handleClock = (value) => {
        const { submitData, treeDataZq } = this.state
        let checkClockData = {}
        treeDataZq.map(item => {
            if (item.id == value) {
                checkClockData = { ...item }
            } else {
                checkClockData = {}
            }
        })
        const data1 = submitData.data1.map((item, index) =>
            index == 1 ? { ...item, number: checkClockData.maxOnlineTrain } :
                (index == 2 ? { ...item, number: checkClockData.minDrivingInterval } :
                    (index == 3 ? { ...item, number: checkClockData.standbyTrain } :
                        (index == 4 ? { ...item, number: checkClockData.plannedOperationColumn } :
                            (index == 5 ? { ...item, number: `${checkClockData.startStation}~${checkClockData.endStation}` } :
                                (index == 6 ? { ...item, number: `${checkClockData.startDriveTime}~${checkClockData.endDriveTime}` } : item)))))
        );
        this.setState({
            submitData: { ...submitData, data1 },
            scheduleId: checkClockData.id,    //选择时刻表的id
            plannedOperationColumn:checkClockData.plannedOperationColumn    //计划开行列
        })
    }
    //选择车辆编号
    addSuccess=(data)=>{
        const { submitData ,checkIndexTable4} = this.state
        const data4 = submitData.data4.map((item, index) =>
            index == checkIndexTable4 ? { ...item, number: data } :item
        );
        this.setState({
            submitData: { ...submitData, data4 },
        })
    }
    //车辆编号showMetroModal
    showMetroFun=(index)=>{
        this.setState({showMetroModal:true,checkIndexTable4:index})
    }
    //关闭车辆编号modal
    handleCancel=()=>{
        this.setState({showMetroModal:false})
    }
    //校验实际开行不能小于晚点、准点、早点之和
    checkTrainSum= async (rule,value,callBack)=>{
        const actualOperatingColumn = Number(this.props.form.getFieldValue('actualOperatingColumn'))
        const startingLateColumn_2_5 = Number(this.props.form.getFieldValue('startingLateColumn_2_5'))
        const endingLateColumn_2_5 = Number(this.props.form.getFieldValue('endingLateColumn_2_5'))
        const startingLateColumn_5_10 = Number(this.props.form.getFieldValue('startingLateColumn_5_10'))
        const endingLateColumn_5_10 = Number(this.props.form.getFieldValue('endingLateColumn_5_10'))
        const startingLateColumn_10_15 = Number(this.props.form.getFieldValue('startingLateColumn_10_15'))
        const endingLateColumn_10_15 = Number(this.props.form.getFieldValue('endingLateColumn_10_15'))
        const startingLateColumn_15 = Number(this.props.form.getFieldValue('startingLateColumn_15'))
        const endingLateColumn_15 = Number(this.props.form.getFieldValue('endingLateColumn_15'))
        const sum = startingLateColumn_2_5 + startingLateColumn_5_10 + startingLateColumn_10_15 + startingLateColumn_15 + 
        endingLateColumn_2_5 + endingLateColumn_5_10 + endingLateColumn_10_15 + endingLateColumn_15 
        if(sum>actualOperatingColumn){
            callBack('实际开行不能小于早点晚点准点之和！')
        }else{
            callBack()
        }
    }
    //数据联动
    setMetroLateFun=(value,record,type)=>{
        const { plannedOperationColumn } = this.state,
            actualOperatingColumn = record.id==8 && type=='one'?value.propertyValue:Number(this.props.form.getFieldValue('actualOperatingColumn')),
            startingLateColumn_2_5 = record.id==1 && type=='two'?value.propertyValue:Number(this.props.form.getFieldValue('startingLateColumn_2_5')),
            endingLateColumn_2_5 = record.id==2 && type=='two'?value.propertyValue:Number(this.props.form.getFieldValue('endingLateColumn_2_5')),
            startingLateColumn_5_10 = record.id==3 && type=='two'?value.propertyValue:Number(this.props.form.getFieldValue('startingLateColumn_5_10')),
            endingLateColumn_5_10 = record.id==4 && type=='two'?value.propertyValue:Number(this.props.form.getFieldValue('endingLateColumn_5_10')),
            startingLateColumn_10_15 = record.id==5 && type=='two'?value.propertyValue:Number(this.props.form.getFieldValue('startingLateColumn_10_15')),
            endingLateColumn_10_15 = record.id==6 && type=='two'?value.propertyValue:Number(this.props.form.getFieldValue('endingLateColumn_10_15')),
            startingLateColumn_15 = record.id==7 && type=='two'?value.propertyValue:Number(this.props.form.getFieldValue('startingLateColumn_15')),
            endingLateColumn_15 = record.id==8 && type=='two'?value.propertyValue:Number(this.props.form.getFieldValue('endingLateColumn_15')),
            startLateSum = startingLateColumn_2_5 + startingLateColumn_5_10 + startingLateColumn_10_15 + startingLateColumn_15,
            endLateSum = endingLateColumn_2_5 + endingLateColumn_5_10 + endingLateColumn_10_15 + endingLateColumn_15, 
            arriveOntimeColumn = actualOperatingColumn-startLateSum-endLateSum, //终到准点
            fulfillmentRate = ((actualOperatingColumn/plannedOperationColumn)*100).toFixed(2), //兑现率
            onTimeRate = ((arriveOntimeColumn/actualOperatingColumn)*100).toFixed(2)  //准点率
            this.props.form.setFieldsValue({
                fulfillmentRate: isNaN(fulfillmentRate)?0:fulfillmentRate, //兑现率
                onTimeRate: isNaN(onTimeRate)?0:onTimeRate,           //准点率
                arriveEarlyColumn: isNaN(startLateSum)?0:startLateSum,    //终到早点
                arriveOntimeColumn:isNaN(arriveOntimeColumn)?0:arriveOntimeColumn,   //终到准点
                arriveLateColumn: isNaN(endLateSum)?0:endLateSum,     //终到晚点
            })
    }
    //提交数据
    handleSubmit = (val, e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (err) {
            } else {
                const recordTime = moment(values.recordTime).format('YYYY-MM-DD')
                const data={...values,recordTime}
                this.props.submit(data, 'save');
            }
        })
    }
    render() {
        const {  lineArr ,showMetroModal} = this.state
        const { intl } = this.props.currentLocale
        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
        const formLayout = {
            labelCol: {
                sm: { span: 4 },
            },
            wrapperCol: {
                sm: { span: 20 },
            },
        };
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
        const columns1 = [
            {
                title: '里程分类',
                dataIndex: 'type',
                key: 'type',
                render: (text, record, index) => {
                    return <span style={index > 0 && index < 7 ? { fontWeight: 'bold' } : null}>{text}</span>
                }
            },
            {
                title: '里程',
                dataIndex: 'number',
                key: 'number',
                render: (text, record, index) => {
                    if (record.isSelect == true) {
                        return <Item {...formItemLayout}>
                            {getFieldDecorator('scheduleId', {
                                rules: [
                                    {
                                        required: true,
                                        message: '不能为空',
                                    },
                                ],
                            })(<Select disabled={this.state.disabled}
                                showSearch
                                allowClear={true}
                                // size='small'
                                style={{ width: '100%' }}
                                placeholder="请选择时刻表"
                                optionFilterProp="children"
                                onChange={this.handleClock}
                                filterOption={(input, option) =>
                                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                {this.state.treeDataZq.map((value, index) => {
                                    return <Option value={value.id} key={index}>{value.scheduleCode}</Option>
                                })}
                            </Select>)}
                        </Item>
                    } else if (index > 6) {
                        return <Item {...formItemLayout}>
                            {getFieldDecorator(index == 7 ? 'actualOperatingColumn' : (index == 8 ? 'fulfillmentRate' :
                                (index == 9 ? 'onTimeRate' : (index == 10 ? 'arriveEarlyColumn' :
                                    (index == 11 ? 'arriveOntimeColumn' : 'arriveLateColumn')))), {
                                rules: [
                                    {
                                        required: true,
                                        message: '不能为空',
                                    },
                                    {
                                        validator: this.checkTrainSum
                                    }
                                ],
                            })(<InputNumber disabled={index !== 7 ? true : this.state.disabled}
                                id={'IdOne' + index}
                                style={{ width: '100%' }}
                                // size='small'
                                onChange={(value) => this.setMetroLateFun({ propertyValue: value }, record,'one')}
                                min={0}
                            />)}
                        </Item>
                    } else {
                        return <Input disabled={index < 7 ? true : this.state.disabled}
                            id={'IdOne' + index}
                            style={{ width: '100%' }}
                            // size='small'
                            min={0}
                            value={text}
                        />
                    }
                }
            },
            {
                title: '里程分类',
                dataIndex: 'typeSec',
                key: 'typeSec',
            },
            {
                title: '里程',
                dataIndex: 'numberSec',
                key: 'numberSec',
                render: (text, record, index) => {
                    if (!record.hasOwnProperty('numberSec')) {
                        return <span />
                    } else {
                        return <Item {...formItemLayout}>
                            {getFieldDecorator(index == 0 ? 'startingLateColumn_2_5' : (index == 1 ? 'endingLateColumn_2_5' :
                                (index == 2 ? 'startingLateColumn_5_10' : (index == 3 ? 'endingLateColumn_5_10' : (index == 4 ? 'startingLateColumn_10_15' :
                                    (index == 5 ? 'endingLateColumn_10_15' : (index == 6 ? 'startingLateColumn_15' : 'endingLateColumn_15')))))), {
                                rules: [
                                    {
                                        required: true,
                                        message: '不能为空',
                                    },
                                    {
                                        validator: this.checkTrainSum
                                    }
                                ],
                            })(<InputNumber disabled={this.state.disabled}
                                id={'IdOnes' + index}
                                style={{ width: '100%' }}
                                // size='small'
                                onChange={(value) => this.setMetroLateFun({ propertyValue: value }, record,'two')}
                                min={0}
                            />)}
                        </Item>
                    }
                }
            }
        ]
        const columns2 = [
            {
                title: '分类',
                dataIndex: 'type',
                key: 'type',
            },
            {
                title: '次',
                dataIndex: 'number',
                key: 'number',
                render: (text, record, index) => {
                    return <Item {...formItemLayout}>
                        {getFieldDecorator(index == 0 ? 'columnJk' : (index == 1 ? 'columnJy' :
                            (index == 2 ? 'columnTt' : (index == 3 ? 'columnCx' : 'columnXx'))), {
                            rules: [
                                {
                                    required: true,
                                    message: '不能为空',
                                },
                            ],
                        })(<InputNumber disabled={this.state.disabled}
                            id={'IdTwo' + index}
                            style={{ width: 150 }}
                            // size='small'
                            min={0}
                        />)}
                    </Item>
                }
            },
            {
                title: '分类',
                dataIndex: 'typeSec',
                key: 'typeSec',
            },
            {
                title: '次',
                dataIndex: 'numberSec',
                key: 'numberSec',
                render: (text, record, index) => {
                    if (!record.hasOwnProperty('numberSec')) {
                        return <span />
                    } else {
                        return <Item {...formItemLayout}>
                            {getFieldDecorator(index == 0 ? 'columnQk' : 'columnYy', {
                                rules: [
                                    {
                                        required: true,
                                        message: '不能为空',
                                    },
                                ],
                            })(<InputNumber disabled={this.state.disabled}
                                id={'IdTwos' + index}
                                style={{ width: 150 }}
                                // size='small'
                                min={0}
                            />)}
                        </Item>
                    }
                }
            }
        ]
        const columns3 = [
            {
                title: '里程分类',
                dataIndex: 'type',
                key: 'type',
            },
            {
                title: '里程',
                dataIndex: 'number',
                key: 'number',
                render: (text, record, index) => {
                    return <Item {...formItemLayout}>
                        {getFieldDecorator(index == 0 ? 'operatingKilometres' : (index == 1 ? 'carryingKilometres' :
                            'deadheadKilometres'), {
                            rules: [
                                {
                                    required: true,
                                    message: '不能为空',
                                },
                            ],
                        })(<InputNumber disabled={this.state.disabled}
                            id={'IdThree' + index}
                            style={{ width: 150 }}
                            // size='small'
                            min={0}
                        />)}
                    </Item>
                }
            }
        ]
        const columns4 = [
            {
                title: '类型',
                dataIndex: 'type',
                key: 'type',
            },
            {
                title: this.state.line? this.state.line+'号线':'',
                dataIndex: 'number',
                key: 'number',
                render: (text, record, index) => {
                    return <Item {...formItemLayout}>
                        {getFieldDecorator(index == 0 ? 'useCar' : (index == 1 ? 'spareCar' :
                            (index == 2 ? 'debugCar' : (index == 3 ? 'inspectionCar' : 'other'))), {
                            initialValue: text,
                            // rules: [
                            //     {
                            //         required: true,
                            //         message: '不能为空',
                            //     },
                            // ],
                        })(
                            <Input disabled={index<4?true:this.state.disabled}
                                title={text}
                                id={'IdFour' + index}
                                style={{ minWidth: 150 }}
                                // size='small'
                                min={0}
                            />
                        )}
                    </Item>
                }
            },
            {
                title: '操作',
                dataIndex: 'action',
                key: 'action',
                render: (text, record, index) => {
                    if(index<4){
                        return <a onClick={this.showMetroFun.bind(this,index)}>选择</a>
                    }else{
                        return <span/>
                    }
                }
            }
        ]
        return (
            <div>
                <Form onSubmit={this.handleSubmit}>
                    <Modal className={style.main}
                        width="850px"
                        afterClose={this.props.form.resetFields}
                        mask={false}
                        maskClosable={false}
                        footer={<div className="modalbtn">
                            {/* 关闭 */}
                            <Button key={1} onClick={this.props.handleCancel}>关闭</Button>
                            {/* 保存 */}
                            <Button key={2} onClick={this.handleSubmit.bind(this, 'save')} type="primary">保存</Button>
                        </div>}
                        centered={true} title={'新增'} visible={this.props.modalVisible}
                        onCancel={this.props.handleCancel}>
                        <div className={style.tipLayout}>
                            <div className={style.tipBox}>
                                <div className={style.topTags}>
                                    <Row type="flex">
                                        <Col span={12}>
                                            <Item label='日期' {...formItemLayout}>
                                                {getFieldDecorator('recordTime', {
                                                    rules: [
                                                        {
                                                            required: true,
                                                            message: '请选择日期',
                                                        },
                                                        {
                                                            validator: this.checkTrainCreatTime
                                                        }
                                                    ],
                                                })(
                                                    <DatePicker size='small' style={{ width: 150, marginRight: 10 }} onChange={this.handleDate} />
                                                )}
                                            </Item>
                                        </Col>
                                        <Col span={12}>
                                            <Item label='线路' {...formItemLayout}>
                                                {getFieldDecorator('line', {
                                                    rules: [
                                                        {
                                                            required: true,
                                                            message: '请选择线路',
                                                        },
                                                    ],
                                                })(
                                                    <Select allowClear showSearch placeholder="请选择线路" size='small' style={{ minWidth: 150, marginRight: 10 }}
                                                        onChange={this.selectLineFun} filterOption={(input, option) =>
                                                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                                                        {lineArr.map(item => {
                                                            return <Option key={item.value} value={item.value}>{item.title}</Option>
                                                        })}
                                                    </Select>
                                                )}
                                            </Item>
                                        </Col>
                                    </Row>
                                </div>
                            </div>
                            <div className={style.anchor} >
                                <Anchor>
                                    <Link href="#info" title="运行" />
                                    <Link href="#payPlan" title="调整" />
                                    <Link href="#invoice" title="里程" />
                                    <Link href="#change" title="使用" />
                                </Anchor>
                            </div>
                        </div>
                        <div className={style.mainBody}>
                            <Divider orientation="left" id='info' style={{ fontWeight: 'bold' }}>列车日常运行情况</Divider>
                            <Table className={style.myTable}
                                rowKey={record => record.id}
                                key={99}
                                size="small"
                                bordered
                                showHeader={false}
                                pagination={false}
                                columns={columns1}
                                dataSource={this.state.submitData.data1}
                                expanderLevel={"ALL"}
                            />
                            <Divider orientation="left" id='payPlan' style={{ fontWeight: 'bold' }}>列车运行调整列次</Divider>
                            <Table className={style.myTable}
                                rowKey={record => record.id}
                                key={999}
                                size="small"
                                bordered
                                showHeader={false}
                                pagination={false}
                                columns={columns2}
                                dataSource={this.state.submitData.data2}
                            />
                            <Divider orientation="left" id='invoice' style={{ fontWeight: 'bold' }}>列车运行里程</Divider>
                            <Table className={style.myTable}
                                rowKey={record => record.id}
                                key={9999}
                                size="small"
                                bordered
                                showHeader={false}
                                pagination={false}
                                columns={columns3}
                                dataSource={this.state.submitData.data3}
                            />
                            <Divider orientation="left" id='change' style={{ fontWeight: 'bold' }}>列车使用情况</Divider>
                            <Table className={style.myTable}
                                rowKey={record => record.id}
                                key={99999}
                                size="small"
                                bordered
                                pagination={false}
                                columns={columns4}
                                dataSource={this.state.submitData.data4}
                            />
                        </div>
                    </Modal>
                </Form>
                {showMetroModal && <MetroModal addSuccess={this.addSuccess} handleCancel={this.handleCancel} modalVisible={showMetroModal}/>}
            </div>
        )
    }
}
const AddModals = Form.create()(AddModal);
export default connect(state => ({
    currentLocale: state.localeProviderData,
}))(AddModals);