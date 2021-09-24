import React, { Component } from 'react';
import { Modal, Form, Table, Input, Button, Anchor, Select, Divider, DatePicker, InputNumber, Row, Col } from 'antd';
import moment from 'moment';
import style from './style.less';
import intl from 'react-intl-universal';
import { connect } from 'react-redux';
import { curdCurrentData } from '../../../../../../store/curdData/action';
import axios from '../../../../../../api/axios';
import { getTrainScheduleList ,trainDailUpdate} from '../../../../api/suzhou-api';
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
            disabled: true,  //默认输入框不可写入
            tipArr: [], //
            tipInfo: [], //修改信息
            tipTitleArr: new Set([]),   //修改信息标题
            showSubmitModal: false,  //tip模板show
            showMetroModal:false,   //选择车辆modal
            lineArr: [], //线路
            recordTime: '',  //记录日期
            line: '',    //线路
            scheduleId: '', //选择的是时刻表id
            record: {},  //修改前数据
            submitData: {   //提交的数据
                data1: [    //table1
                    
                ],
                data2: [    //table2
                    
                ],
                data3: [    //table3
                    
                ],
                data4: [    //table4
                    
                ],
            },
        }
    }
    componentDidMount() {
        const { record } = this.props
        const { trainScheduleVo } = record
        this.setState({ record,
            plannedOperationColumn:trainScheduleVo.plannedOperationColumn,  //计划开行
            submitData: {   //提交的数据
                data1: [    //table1
                    { id: 1, type: '当日时刻表', number: record.scheduleId, isSelect: true, typeSec: '2-5分钟终到早点列次', numberSec: record.startingLateColumn_2_5 },
                    { id: 2, type: '最大上线列车', number: trainScheduleVo.maxOnlineTrain, typeSec: '2-5分钟终到晚点列次', numberSec: record.endingLateColumn_2_5 },
                    { id: 3, type: '最小行车间隔(m)', number: trainScheduleVo.minDrivingInterval, typeSec: '5-10分钟终到早点列次', numberSec: record.startingLateColumn_5_10 },
                    { id: 4, type: '备用车数', number: trainScheduleVo.standbyTrain, typeSec: '5-10分钟终到晚点列次', numberSec: record.endingLateColumn_5_10 },
                    { id: 5, type: '计划开行（列）', number: trainScheduleVo.plannedOperationColumn, typeSec: '10-15分钟终到早点列次', numberSec: record.startingLateColumn_10_15 },
                    { id: 6, type: '区间', number: trainScheduleVo.startStation+'~'+trainScheduleVo.endStation, typeSec: '10-15分钟终到晚点列次', numberSec: record.endingLateColumn_10_15 },
                    { id: 7, type: '首末班车时间', number: trainScheduleVo.startDriveTime+'~'+trainScheduleVo.endDriveTime, typeSec: '15分钟以上终到早点列次', numberSec: record.startingLateColumn_15 },
                    { id: 8, type: '实际开行（列）', number: record.actualOperatingColumn, typeSec: '15分钟以上终到晚点列次', numberSec: record.endingLateColumn_15 },
                    { id: 9, type: '兑现率', number: record.fulfillmentRate, },
                    { id: 10, type: '准点率', number: record.onTimeRate, },
                    { id: 11, type: '终到早点（列）', number: record.arriveEarlyColumn },
                    { id: 12, type: '终到准点（列）', number: record.arriveOntimeColumn },
                    { id: 13, type: '终到晚点（列）', number: record.arriveLateColumn }
                ],
                data2: [    //table2
                    { id: 14, type: '加开（列）', number: record.columnJk, typeSec: '故障清客（列）', numberSec: record.columnQk },
                    { id: 15, type: '救援（列）', number: record.columnJy, typeSec: '运营调整（列）', numberSec: record.columnYy },
                    { id: 16, type: '跳停（列）', number: record.columnTt },
                    { id: 17, type: '抽线（列）', number: record.columnCx },
                    { id: 18, type: '下线（列）', number: record.columnXx }
                ],
                data3: [    //table3
                    { id: 19, type: '运营里程', number: record.operatingKilometres },
                    { id: 20, type: '载客里程', number: record.carryingKilometres },
                    { id: 21, type: '空驶里程', number: record.deadheadKilometres }
                ],
                data4: [    //table4
                    { id: 22, type: '运用车', number: record.useCar },
                    { id: 23, type: '备用车', number: record.spareCar },
                    { id: 24, type: '调试车', number: record.debugCar },
                    { id: 25, type: '检修车', number: record.inspectionCar },
                    { id: 26, type: '其他', number: record.other }
                ],
            },})
        getBaseData('line').then(data => { this.setState({ lineArr: data }) })
        this.getTrainScheduleList(record.line)
    }
    //点击调整按钮
    editFun = () => {
        this.setState({
            disabled: false
        })
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
            scheduleId: checkClockData.id    //选择时刻表的id
        })
    }
    //修改信息包含哪几快
    setColType = (colType) => {
        const { tipTitleArr } = this.state
        switch (colType) {
            case 1:
                tipTitleArr.add('1')
                break;
            case 2:
                tipTitleArr.add('2')
                break;
            case 3:
                tipTitleArr.add('3')
                break;
            case 4:
                tipTitleArr.add('4')
                break;
        }
        this.setState({
            tipTitleArr
        })
    }
    //保存修改数据
    handleTipInfo = (value, record, key) => {
        const { tipInfo, tipArr } = this.state
        if (key.rowType == 1 && record.number !== value.propertyValue) {
            if (tipArr.indexOf(record.type) > -1) {
                tipInfo.filter((item, index) => item.type == record.type ? tipInfo[index].value = value.propertyValue : null)
            } else {
                tipArr.push(record.type)
                tipInfo.push({ type: record.type, valueBefore: record.number, value: value.propertyValue, titleType: key.colType })
                this.setColType(key.colType)
            }
        } else if (key.rowType == 2 && record.numberSec !== value.propertyValue) {
            if (tipArr.indexOf(record.typeSec) > -1) {
                tipInfo.filter((item, index) => item.type == record.typeSec ? tipInfo[index].value = value.propertyValue : null)
            } else {
                tipArr.push(record.typeSec)
                tipInfo.push({ type: record.typeSec, valueBefore: record.numberSec, value: value.propertyValue, titleType: key.colType })
                this.setColType(key.colType)
            }
        }
        this.setState({
            tipInfo, tipArr
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
    setDataLink= (value,record,type)=>{
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
            endLateSum = endingLateColumn_2_5 + endingLateColumn_5_10 + endingLateColumn_10_15 + endingLateColumn_15 ,
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
    //输入单元格内数据回调
    handleChangeOne = (value, record, index) => {
        const { submitData } = this.state
        this.handleTipInfo(value, record, key = { rowType: 1, colType: 1 })
        const data1 = submitData.data1.map((item, key) => item.id == record.id ? { ...item, number: value.propertyValue } : item)
        this.setState({
            submitData: { ...submitData, data1 }
        })
        this.setDataLink(value, record,'one')
    }
    handleChangeTwo = (value, record) => {
        const { submitData } = this.state
        this.handleTipInfo(value, record, key = { rowType: 2, colType: 1 })
        const data1 = submitData.data1.map((item, key) => item.id == record.id ? { ...item, numberSec: value.propertyValue } : item);
        this.setState({
            submitData: { ...submitData, data1 }
        })
        this.setDataLink(value, record,'two')
    }
    handleChangeThree = (value, record) => {
        const { submitData } = this.state
        this.handleTipInfo(value, record, key = { rowType: 1, colType: 2 })
        const data2 = submitData.data2.map((item, key) => item.id == record.id ? { ...item, number: value.propertyValue } : item);
        this.setState({
            submitData: { ...submitData, data2 }
        })
    }
    handleChangeFour = (value, record) => {
        const { submitData } = this.state
        this.handleTipInfo(value, record, key = { rowType: 2, colType: 2 })
        const data2 = submitData.data2.map((item, key) => item.id == record.id ? { ...item, numberSec: value.propertyValue } : item);
        this.setState({
            submitData: { ...submitData, data2 }
        })
    }
    handleChangeFive = (value, record) => {
        const { submitData } = this.state
        this.handleTipInfo(value, record, key = { rowType: 1, colType: 3 })
        const data3 = submitData.data3.map((item, key) => item.id == record.id ? { ...item, number: value.propertyValue } : item);
        this.setState({
            submitData: { ...submitData, data3 }
        })
    }
    handleChangeSix = (value, record) => {
        const { submitData } = this.state
        this.handleTipInfo(value, record, key = { rowType: 1, colType: 4 })
        const data4 = submitData.data4.map((item, key) => item.id == record.id ? { ...item, number: value.propertyValue } : item);
        this.setState({
            submitData: { ...submitData, data4 }
        })
    }
    //提交数据
    handleSubmit = (val, e) => {
        e.preventDefault();
        this.setState({ showSubmitModal: true })
    }
    //确认提交按钮
    handleSubmitSign = () => {
        this.props.form.validateFields((err, values) => {
            if (err) {
            } else {
                const recordTime = moment(values.recordTime).format('YYYY-MM-DD')
                const data = { ...values, recordTime ,id:this.props.record.id}
                axios.put(trainDailUpdate, data, true).then(res => {
                    if (res.data.status === 200) {
                        this.setState({ showSubmitModal: false })
                        this.props.handleCancel()
                        this.props.success(res.data.data);
                    }
                });
            }
        })
    }
    handleCancelClose = () => {
        this.setState({ showSubmitModal: false })
    }
    render() {
        const { tipInfo, lineArr, record ,showMetroModal} = this.state
        const rightInfo = {...record}
        const tipTitleArr = Array.from(this.state.tipTitleArr)
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
                                initialValue:text,
                                rules: [
                                    {
                                        required: true,
                                        message: '不能为空',
                                    },
                                ],
                            })(<Select disabled={this.state.disabled}
                                showSearch
                                allowClear={true}
                                size='small'
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
                                        initialValue:text,
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
                                size='small'
                                min={0}
                                onChange={(value) => this.handleChangeOne({ propertyValue: value }, record, index)}
                            />)}
                        </Item>
                    } else {
                        return <Input disabled={index < 7 ? true : this.state.disabled}
                            id={'IdOne' + index}
                            style={{ width: '100%' }}
                            size='small'
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
                                initialValue: text,
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
                                size='small'
                                min={0}
                                onChange={(value) => this.handleChangeTwo({ propertyValue: value }, record)}
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
                            initialValue: text,
                            rules: [
                                {
                                    required: true,
                                    message: '不能为空',
                                },
                            ],
                        })(<InputNumber disabled={this.state.disabled}
                            id={'IdTwo' + index}
                            style={{ width: 150 }}
                            oninput="value=value.replace(/^d*(?:.d{0,2})?$/g,'')"
                            size='small'
                            min={0}
                            onChange={(value) => this.handleChangeThree({ propertyValue: value }, record)}
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
                                initialValue: text,
                                rules: [
                                    {
                                        required: true,
                                        message: '不能为空',
                                    },
                                ],
                            })(<InputNumber disabled={this.state.disabled}
                                id={'IdTwos' + index}
                                style={{ width: 150 }}
                                size='small'
                                min={0}
                                onChange={(value) => this.handleChangeFour({ propertyValue: value }, record)}
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
                            initialValue: text,
                            rules: [
                                {
                                    required: true,
                                    message: '不能为空',
                                },
                            ],
                        })(<InputNumber disabled={this.state.disabled}
                            id={'IdThree' + index}
                            style={{ width: 150 }}
                            size='small'
                            min={0}
                            onChange={(value) => this.handleChangeFive({ propertyValue: value }, record)}
                        />)}
                    </Item>
                }
            }
        ]
        const columns4 = [
            {
                title: '线路',
                dataIndex: 'type',
                key: 'type',
            },
            {
                title: rightInfo.lineName,
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
                                style={{ width: 150 }}
                                size='small'
                                min={0}
                                onChange={(e) => this.handleChangeSix({ propertyValue: e.target.value }, record)}
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
                        centered={true} title={'修改'} visible={this.props.modalVisible}
                        onCancel={this.props.handleCancel}>
                        <div className={style.tipLayout}>
                            <div className={style.tipBox}>
                                <div className={style.topTags}>
                                    <Row type="flex">
                                        <Col span={12}>
                                            <Item label='日期' {...formItemLayout}>
                                                {getFieldDecorator('recordTime', {
                                                    initialValue: record ? moment(record.recordTime, 'YYYY-MM-DD') : null,
                                                    rules: [
                                                        {
                                                            required: true,
                                                            message: '请选择日期',
                                                        },
                                                    ],
                                                })(
                                                    <DatePicker disabled size='small' style={{ width: 150, marginRight: 10 }} />
                                                )}
                                            </Item>
                                        </Col>
                                        <Col span={12}>
                                            <Item label='线路' {...formItemLayout}>
                                                {getFieldDecorator('line', {
                                                    initialValue: record ? record.line : null,
                                                    rules: [
                                                        {
                                                            required: true,
                                                            message: '请选择线路',
                                                        },
                                                    ],
                                                })(
                                                    <Select disabled allowClear showSearch placeholder="请选择线路" size='small' style={{ minWidth: 150, marginRight: 10 }}
                                                        filterOption={(input, option) =>
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
                                <Button type="primary" icon="edit" size='small' onClick={this.editFun} style={{ marginRight: 30 }}>修改</Button>
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
                        <Modal title="提交修改"
                            visible={this.state.showSubmitModal}
                            onOk={this.handleSubmitSign}
                            onCancel={this.handleCancelClose}
                            width='500px'>
                            {tipTitleArr.indexOf('1') > -1 ? <p style={{ fontWeight: 'bold' }}>列车日常运行情况</p> : null}
                            {tipInfo.map((item) => {
                                if (item.titleType == 1) {
                                    return <p>&nbsp;&nbsp;[{item.type}]由&nbsp;&nbsp;{item.valueBefore}&nbsp;&nbsp;修改为<i style={{ color: 'red' }}>{item.value}</i></p>
                                }
                            })}
                            {tipTitleArr.indexOf('2') > -1 ? <p style={{ fontWeight: 'bold' }}>列车运行调整列次</p> : null}
                            {tipInfo.map((item) => {
                                if (item.titleType == 2) {
                                    return <p>&nbsp;&nbsp;[{item.type}]由&nbsp;&nbsp;{item.valueBefore}&nbsp;&nbsp;修改为<i style={{ color: 'red' }}>{item.value}</i></p>
                                }
                            })}
                            {tipTitleArr.indexOf('3') > -1 ? <p style={{ fontWeight: 'bold' }}>列车运行里程</p> : null}
                            {tipInfo.map((item) => {
                                if (item.titleType == 3) {
                                    return <p>&nbsp;&nbsp;[{item.type}]由&nbsp;&nbsp;{item.valueBefore}&nbsp;&nbsp;修改为<i style={{ color: 'red' }}>{item.value}</i></p>
                                }
                            })}
                            {tipTitleArr.indexOf('4') > -1 ? <p style={{ fontWeight: 'bold' }}>列车使用情况</p> : null}
                            {tipInfo.map((item) => {
                                if (item.titleType == 4) {
                                    return <p>&nbsp;&nbsp;[{item.type}]由&nbsp;&nbsp;{item.valueBefore}&nbsp;&nbsp;修改为<i style={{ color: 'red' }}>{item.value}</i></p>
                                }
                            })}
                            {tipInfo.length < 1 ? <p>&nbsp;&nbsp;无修改记录</p> : null}
                        </Modal>
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