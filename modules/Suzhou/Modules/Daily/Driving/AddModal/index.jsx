import React, { Component } from 'react';
import { Modal, Form, Table, Input, Button, Anchor, Select, Divider, DatePicker, InputNumber, Row, Col, notification } from 'antd';
import moment from 'moment';
import style from './style.less';
import intl from 'react-intl-universal';
import { connect } from 'react-redux';
import { curdCurrentData } from '../../../../../../store/curdData/action';
import axios from '../../../../../../api/axios';
import { getTrainScheduleList, checkTrainCreatTime } from '../../../../api/suzhou-api';
import { getBaseData } from '@/modules/Suzhou/components/Util/util';
import MetroModal from '../MetroCodeModal/index'
import DataEntryModal from '../DataEntryModal/index'
import SelectTimeTable from '../SelectTimeTable/index'
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
            isCheckTime: false, //日期校验 true为已存在fasle 为不存在
            showMetroModal: false,   //选择车辆modal
            lineArr: [], //线路
            recordTime: '',  //记录日期
            line: '',    //线路
            scheduleId: '', //选择的是时刻表id
            useCar: '',
            spareCar: '',
            debugCar: '',
            inspectionCar: '',
            checkList: new Set([]),  //已选择的车辆list
            lineChoose: '',
            useCar1: [],
            spareCar1: [],
            debugCar1: [],
            inspectionCar1: [],
            showDataEntryModal: false,   //显示非正常行驶数据modal
            trainDailyPassageMileAddForm: {},    //非正常行驶数据统计
            trainDailyScheduleUpAddForm: [],    //上行录入数据
            trainDailyScheduleDownAddForm: [],  //下行录入数据
            passengerMiles: 0, //当日计划载客里程
            emptyMiles: 0,    //当日计划空驶里程
            allLinePassenageMiles: 0,//当日计划既有线载客里程
            allLineEmptyMiles: 0,  //当日计划既有线空驶里程
            newLinePassenageMiles: 0,  //当日计划新线载客里程
            newLineEmptyMiles: 0,   //当日计划新线空驶里程
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
    //校验日期、线路
    checkTrainCreatTime = (rule, value, callback) => {
        const line = this.props.form.getFieldValue('line') == null ? '' : this.props.form.getFieldValue('line')
        const recordTime = this.props.form.getFieldValue('recordTime') == null ? '' : moment(this.props.form.getFieldValue('recordTime')).format('YYYY-MM-DD')
        if (line === '' || recordTime === '') {
            callback()
        } else {
            axios.get(checkTrainCreatTime + `?checkCreatTime=${recordTime}&line=${line}`).then(res => {
                const isCheckTime = res.data.data
                this.setState({ isCheckTime })
                if (isCheckTime == 'true') {
                    callback('该线路日期已存在')
                } else {
                    callback()
                }
            })
        }
    }
    //选择线路
    selectLineFun = (value) => {
        this.setState({ line: value }, () => {
            this.getTrainScheduleList(value)
        })
    }
    //选择时刻表
    handleClock = (value) => {
        const { treeDataZq } = this.state
        treeDataZq.map(item => {
            if (item.id == value) {
                this.props.form.setFieldsValue({
                    maxOnlineTrain: item.maxOnlineTrain,   //最大上线数
                    minDrivingInterval: item.minDrivingInterval,   //最小行车间距
                    standbyTrain: item.standbyTrain,   //备用车数
                    plannedOperationColumn: item.plannedOperationColumn,   //计划开行 
                    startStation: item.startStation,   //始发站
                    endStation: item.endStation,   //终点站
                    startDriveTime: item.startDriveTime,   //首班时间
                    endDriveTime: item.endDriveTime    //末班时间
                })
                this.setState({
                    scheduleId: item.id,    //选择时刻表的id
                    plannedOperationColumn: item.plannedOperationColumn,   //计划开行列
                    maxOnlineTrain: item.maxOnlineTrain,   //最大上线数
                    minDrivingInterval: item.minDrivingInterval,   //最小行车间距
                    standbyTrain: item.standbyTrain,   //备用车数
                    plannedOperationColumn: item.plannedOperationColumn,   //计划开行 
                    startStation: item.startStation,   //始发站
                    startStationName: item.startStationName,
                    endStation: item.endStation,   //终点站
                    endStationName: item.endStationName,
                    startDriveTime: item.startDriveTime,   //首班时间
                    endDriveTime: item.endDriveTime,    //末班时间
                    passengerMiles: item.passengerMiles?item.passengerMiles:0, //当日计划载客里程
                    emptyMiles: item.emptyMiles?item.emptyMiles:0,    //当日计划空驶里程
                    allLinePassenageMiles: item.allLinePassenageMiles?item.allLinePassenageMiles:0,//当日计划既有线载客里程
                    allLineEmptyMiles: item.allLineEmptyMiles?item.allLineEmptyMiles:0,  //当日计划既有线空驶里程
                    newLinePassenageMiles: item.newLinePassenageMiles?item.newLinePassenageMiles:0,  //当日计划新线载客里程
                    newLineEmptyMiles: item.newLineEmptyMiles?item.newLineEmptyMiles:0,   //当日计划新线空驶里程
                }, () => { this.setTodayPlanFun() })
            } else {
                return
            }
        })
    }
    //选择车辆编号
    addSuccess = (data, lineAtt) => {
        const { checkIndexTable4 } = this.state
        switch (checkIndexTable4) {
            case '0':
                this.props.form.setFieldsValue({ useCar: data }) //运用车
                this.setState({ useCar: data, useCar1: lineAtt })
                break;
            case '1':
                this.props.form.setFieldsValue({ spareCar: data }) //备用车
                this.setState({ spareCar: data, spareCar1: lineAtt })
                break;
            case '2':
                this.props.form.setFieldsValue({ debugCar: data }) //调试车
                this.setState({ debugCar: data, debugCar1: lineAtt })
                break;
            case '3':
                this.props.form.setFieldsValue({ inspectionCar: data }) //检修车
                this.setState({ inspectionCar: data, inspectionCar1: lineAtt })
                break;
            default:
                break;
        }
    }
    //车辆编号showMetroModal
    showMetroFun = (index) => {
        let { useCar, spareCar, debugCar, inspectionCar, useCar1, spareCar1, debugCar1, inspectionCar1 } = this.state
        switch (index) {
            case '0':
                this.setState({
                    checkList: [...spareCar.split(','), ...debugCar.split(','), ...inspectionCar.split(',')],
                    lineChoose: useCar1
                })
                break;
            case '1':
                this.setState({
                    checkList: [...useCar.split(','), ...debugCar.split(','), ...inspectionCar.split(',')],
                    lineChoose: spareCar1
                })
                break;
            case '2':
                this.setState({
                    checkList: [...useCar.split(','), ...spareCar.split(','), ...inspectionCar.split(',')],
                    lineChoose: debugCar1
                })
                break;
            case '3':
                this.setState({
                    checkList: [...useCar.split(','), ...spareCar.split(','), ...debugCar.split(',')],
                    lineChoose: inspectionCar1
                })
                break;
            default:
                break;
        }
        this.setState({ showMetroModal: true, checkIndexTable4: index })
    }
    //关闭车辆编号modal
    handleCancel = () => {
        this.setState({ showMetroModal: false })
    }
    //校验实际开行不能小于晚点、准点、早点之和
    checkTrainSum = async (rule, value, callBack) => {
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
        if (sum > actualOperatingColumn) {
            callBack('准点列不能小于0，请检查终到早点，终到晚点数据！')
        } else {
            callBack()
        }
    }
    //校验抽线不能大于计划开行
    checkTrainColumnCx = (rule, value, callBack) => {
        const { plannedOperationColumn } = this.state
        if (value > plannedOperationColumn) {
            callBack('抽线列不能大于计划开行列')
        } else {
            callBack()
        }
    }
    //数据联动
    setMetroLateFun = (value, type) => {
        const { plannedOperationColumn } = this.state,
            columnCx = type == 'columnCx' ? value.propertyValue : Number(this.props.form.getFieldValue('columnCx')),
            startingLateColumn_2_5 = type == 'start_2-5' ? value.propertyValue : Number(this.props.form.getFieldValue('startingLateColumn_2_5')),
            endingLateColumn_2_5 = type == 'end_2-5' ? value.propertyValue : Number(this.props.form.getFieldValue('endingLateColumn_2_5')),
            startingLateColumn_5_10 = type == 'start_5-10' ? value.propertyValue : Number(this.props.form.getFieldValue('startingLateColumn_5_10')),
            endingLateColumn_5_10 = type == 'end_5-10' ? value.propertyValue : Number(this.props.form.getFieldValue('endingLateColumn_5_10')),
            startingLateColumn_10_15 = type == 'start_10-15' ? value.propertyValue : Number(this.props.form.getFieldValue('startingLateColumn_10_15')),
            endingLateColumn_10_15 = type == 'end_10-15' ? value.propertyValue : Number(this.props.form.getFieldValue('endingLateColumn_10_15')),
            startingLateColumn_15 = type == 'start_15' ? value.propertyValue : Number(this.props.form.getFieldValue('startingLateColumn_15')),
            endingLateColumn_15 = type == 'end_15' ? value.propertyValue : Number(this.props.form.getFieldValue('endingLateColumn_15')),
            startLateSum = startingLateColumn_2_5 + startingLateColumn_5_10 + startingLateColumn_10_15 + startingLateColumn_15,
            endLateSum = endingLateColumn_2_5 + endingLateColumn_5_10 + endingLateColumn_10_15 + endingLateColumn_15,
            dayLate = startLateSum + endLateSum,    //当日晚点
            actualOperatingColumn = plannedOperationColumn - columnCx,  //实际开行
            arriveOntimeColumn = actualOperatingColumn - startLateSum - endLateSum, //终到准点
            fulfillmentRate = ((actualOperatingColumn / plannedOperationColumn) * 100).toFixed(2), //兑现率
            onTimeRate = ((arriveOntimeColumn / actualOperatingColumn) * 100).toFixed(2)  //准点率
        this.props.form.setFieldsValue({
            actualOperatingColumn: isNaN(actualOperatingColumn) == true || actualOperatingColumn < 0 ? 0 : actualOperatingColumn, //实际开行
            fulfillmentRate: isNaN(fulfillmentRate) == true || fulfillmentRate < 0 ? 0 : fulfillmentRate, //兑现率
            onTimeRate: isNaN(onTimeRate) == true || onTimeRate < 0 ? 0 : onTimeRate,           //准点率
            arriveEarlyColumn: isNaN(startLateSum) == true || startLateSum < 0 ? 0 : startLateSum,    //终到早点
            arriveOntimeColumn: isNaN(arriveOntimeColumn) == true || arriveOntimeColumn < 0 ? 0 : arriveOntimeColumn,   //终到准点
            arriveLateColumn: isNaN(endLateSum) == true || endLateSum < 0 ? 0 : endLateSum,     //终到晚点
            dayLate: isNaN(dayLate) == true || dayLate < 0 ? 0 : dayLate,     //当日晚点（终到早点+终到晚点）
        })
    }
    setOperatFun = (value, type) => {
        const carryingKilometres = type == 'carry' ? value.propertyValue : Number(this.props.form.getFieldValue('carryingKilometres')),
            deadheadKilometres = type == 'deadhead' ? value.propertyValue : Number(this.props.form.getFieldValue('deadheadKilometres'))
        this.props.form.setFieldsValue({
            operatingKilometres: (isNaN(carryingKilometres) ? 0 : carryingKilometres) + (isNaN(deadheadKilometres) ? 0 : deadheadKilometres),
        })
    }
    //显示非正常行驶数据modal
    dataEntryOpen = () => {
        if (this.state.line) {
            this.setState({
                showDataEntryModal: true
            })
        } else {
            notification.warning({
                message: '警告',
                description: '未选择线路！',
                placement: 'bottomRight'
            })
        }
    }
    //关闭非正常行驶数据modal
    dataEntryClose = () => {
        this.setState({
            showDataEntryModal: false
        })
    }
    //计算里程
    setTodayPlanFun = () => {
        const {
            trainDailyScheduleUpAddForm,
            trainDailyScheduleDownAddForm,
            passengerMiles, //当日计划载客里程
            emptyMiles,    //当日计划空驶里程
            allLinePassenageMiles,//当日计划既有线载客里程
            allLineEmptyMiles,  //当日计划既有线空驶里程
            newLinePassenageMiles,  //当日计划新线载客里程
            newLineEmptyMiles,   //当日计划新线空驶里程 
        } = this.state
        let abnormalPassengerMiles = 0, abnormalEmptyMiles = 0, abnormalAllPassenageMiles = 0,
            abnormalAllEmptyMiles = 0, abnormalNewPassenageMiles = 0, abnormalNewEmptyMiles = 0,
            columnJk = 0, columnCx = 0
        trainDailyScheduleUpAddForm.map(item => {
            if (item.typeCode == 'top1') {
                columnJk += item.coloumns
                abnormalPassengerMiles += Number(item.mileage) * Number(item.coloumns);
                abnormalAllPassenageMiles += Number(item.oldLineStationMileage) * Number(item.coloumns);
                abnormalNewPassenageMiles += Number(item.newLineStationMileage) * Number(item.coloumns)
            }
            if (item.typeCode == 'top2') {
                columnCx += item.coloumns
                abnormalPassengerMiles += Number(item.mileage) * Number(item.coloumns);
                abnormalAllPassenageMiles += Number(item.oldLineStationMileage) * Number(item.coloumns);
                abnormalNewPassenageMiles += Number(item.newLineStationMileage) * Number(item.coloumns)
            }
            if (item.typeCode == 'top3') {
                columnJk += item.coloumns
                abnormalEmptyMiles += Number(item.mileage) * Number(item.coloumns);
                abnormalAllEmptyMiles += Number(item.oldLineStationMileage) * Number(item.coloumns);
                abnormalNewEmptyMiles += Number(item.newLineStationMileage) * Number(item.coloumns)
            }
            if (item.typeCode == 'top4') {
                columnCx += item.coloumns
                abnormalEmptyMiles += Number(item.mileage) * Number(item.coloumns);
                abnormalAllEmptyMiles += Number(item.oldLineStationMileage) * Number(item.coloumns);
                abnormalNewEmptyMiles += Number(item.newLineStationMileage) * Number(item.coloumns)
            }
        })
        trainDailyScheduleDownAddForm.map(item => {
            if (item.typeCode == 'down1') {
                columnJk += item.coloumns
                abnormalPassengerMiles += Number(item.mileage) * Number(item.coloumns);
                abnormalAllPassenageMiles += Number(item.oldLineStationMileage) * Number(item.coloumns);
                abnormalNewPassenageMiles += Number(item.newLineStationMileage) * Number(item.coloumns)
            }
            if (item.typeCode == 'down2') {
                columnCx += item.coloumns
                abnormalPassengerMiles += Number(item.mileage) * Number(item.coloumns);
                abnormalAllPassenageMiles += Number(item.oldLineStationMileage) * Number(item.coloumns);
                abnormalNewPassenageMiles += Number(item.newLineStationMileage) * Number(item.coloumns)
            }
            if (item.typeCode == 'down3') {
                columnJk += item.coloumns
                abnormalEmptyMiles += Number(item.mileage) * Number(item.coloumns);
                abnormalAllEmptyMiles += Number(item.oldLineStationMileage) * Number(item.coloumns);
                abnormalNewEmptyMiles += Number(item.newLineStationMileage) * Number(item.coloumns)
            }
            if (item.typeCode == 'down4') {
                columnCx += item.coloumns
                abnormalEmptyMiles += Number(item.mileage) * Number(item.coloumns);
                abnormalAllEmptyMiles += Number(item.oldLineStationMileage) * Number(item.coloumns);
                abnormalNewEmptyMiles += Number(item.newLineStationMileage) * Number(item.coloumns)
            }
        })
        this.props.form.setFieldsValue({
            carryingKilometres: (abnormalPassengerMiles + Number(passengerMiles)).toFixed(3),
            deadheadKilometres: (abnormalEmptyMiles + Number(emptyMiles)).toFixed(3),
            operatingKilometres : (Number((abnormalPassengerMiles + Number(passengerMiles))) +  Number((abnormalEmptyMiles + Number(emptyMiles)))).toFixed(3),
            columnJk,   //加开列根据录入数据计算
            columnCx,   //抽线列根据录入数据计算
        }, () => {
            this.setMetroLateFun({ propertyValue: columnCx }, 'columnCx')
        })
        this.setState({
            trainDailyPassageMileAddForm: {    //非正常行驶数据
                abnormalPassengerMiles: abnormalPassengerMiles.toFixed(3),
                abnormalEmptyMiles: abnormalEmptyMiles.toFixed(3),
                abnormalAllPassenageMiles: abnormalAllPassenageMiles.toFixed(3),
                abnormalAllEmptyMiles: abnormalAllEmptyMiles.toFixed(3),
                abnormalNewPassenageMiles: abnormalNewPassenageMiles.toFixed(3),
                abnormalNewEmptyMiles: abnormalNewEmptyMiles.toFixed(3),
                passengerMiles: (abnormalPassengerMiles + Number(passengerMiles)).toFixed(3),
                emptyMiles: (abnormalEmptyMiles + Number(emptyMiles)).toFixed(3),
                allLinePassenageMiles: (abnormalAllPassenageMiles + Number(allLinePassenageMiles)).toFixed(3),
                allLineEmptyMiles: (abnormalAllEmptyMiles + Number(allLineEmptyMiles)).toFixed(3),
                newLinePassenageMiles: (abnormalNewPassenageMiles + Number(newLinePassenageMiles)).toFixed(3),
                newLineEmptyMiles: (abnormalNewEmptyMiles + Number(newLineEmptyMiles)).toFixed(3)
            }
        })
    }
    //非正常行驶数据录入回调
    dataEntrySuccess = (idTemp, dataTop1, dataTop2, dataTop3, dataTop4, dataDown1, dataDown2, dataDown3, dataDown4) => {
        let dataSource1 = [...dataTop1, ...dataTop2, ...dataTop3, ...dataTop4]
        let dataSource2 = [...dataDown1, ...dataDown2, ...dataDown3, ...dataDown4]
        console.log('1',dataSource1,dataSource2)
        this.setState({
            trainDailyScheduleUpAddForm: dataSource1, //上行数据
            trainDailyScheduleDownAddForm: dataSource2,    //下行数据
            type: 'info',
            idTemp,
            dataTop1, dataTop2, dataTop3, dataTop4, dataDown1, dataDown2, dataDown3, dataDown4
        }, () => {
            this.setTodayPlanFun()
        })
    }
    //提交数据
    handleSubmit = (val, e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (err) {
            } else {
                const { trainDailyScheduleUpAddForm, trainDailyScheduleDownAddForm, trainDailyPassageMileAddForm } = this.state
                const recordTime = moment(values.recordTime).format('YYYY-MM-DD')
                const line = values.line
                const data = {
                    ...values,
                    recordTime,
                    trainDailyScheduleUpAddForm,
                    trainDailyScheduleDownAddForm,
                    trainDailyPassageMileAddForm: {
                        ...trainDailyPassageMileAddForm,
                        line,
                        recordTime
                    }
                }
                this.props.submit(data, 'save');
            }
        })
    }
    render() {
        const { lineArr, showMetroModal } = this.state
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
                sm: { span: 16 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
        };
        const formItemLayout1 = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };

        return (
            <div>
                <div>
                    <Form onSubmit={this.handleSubmit}>
                        {/* <Modal className={style.main}
                        width="1200px"
                        afterClose={this.props.form.resetFields}
                        mask={false}
                        maskClosable={false}
                        footer={<div className="modalbtn"> */}

                        {/* 关闭
                            <Button key={1} onClick={this.props.handleCancel}>关闭</Button>
                            {/* 保存 */}
                        {/*<Button key={2} onClick={this.handleSubmit.bind(this, 'save')} type="primary">保存</Button></div>} 
                            centered={true} title={'新增'} visible={this.props.modalVisible} onCancel={this.props.handleCancel}> */}
                        <div className={style.tipLayout}>
                            <div className={style.tipBox}>
                                <div className={style.topTags}>
                                    <Row type="flex">
                                        <Col span={8}>
                                            <Item label='日期' {...formItemLayout1}>
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
                                        <Col span={8}>
                                            <Item label='线路' {...formItemLayout1}>
                                                {getFieldDecorator('line', {
                                                    rules: [
                                                        {
                                                            required: true,
                                                            message: '请选择线路',
                                                        },
                                                        {
                                                            validator: this.checkTrainCreatTime
                                                        }
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
                                        <Col span={8}>
                                            <Item label='时刻表' {...formItemLayout1}>
                                                {getFieldDecorator('scheduleId', {
                                                    rules: [
                                                        {
                                                            required: true,
                                                            message: '不能为空',
                                                        },
                                                    ],
                                                })(<Select
                                                    dropdownMatchSelectWidth={false}
                                                    size='small'
                                                    showSearch
                                                    allowClear={true}
                                                    style={{ minWidth: 150, }}
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
                                        </Col>
                                    </Row>
                                </div>
                                <div className={style.topTagsBtn}>
                                    <Button type='primary' icon="check" size='small' style={{ marginRight: 30 }} onClick={this.handleSubmit.bind(this, 'save')}>提交</Button>
                                </div>
                            </div>
                            {/* <div className={style.anchor} >
                                <Anchor>
                                    <Link href="#info" title="运行" />
                                    <Link href="#payPlan" title="调整" />
                                    <Link href="#tongji" title="统计" />
                                    <Link href="#invoice" title="里程" />
                                    <Link href="#change" title="使用" />
                                </Anchor>
                            </div> */}
                        </div>
                        <div className={style.mainBody} style={{ height: this.props.height + 60, overflow: 'auto', clear: 'both' }}>
                            
                            
                            {/* <Row>
                                <Col span={8}>
                                    <Item label='时刻表编码' {...formItemLayout}>
                                        {getFieldDecorator('scheduleId', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '不能为空',
                                                },
                                            ],
                                        })(<SelectTimeTable handleClock={this.handleClock} data={this.state.treeDataZq}/>)}
                                    </Item>
                                </Col>
                            </Row> */}

                            {/* <Row>
                                <Col span={6}>
                                    <Item label='最大上线列车数' {...formItemLayout}>
                                        {getFieldDecorator('maxOnlineTrain', {
                                            rules: [],
                                        })(
                                            <Input disabled style={{ width: 100 }} />
                                        )}
                                    </Item>
                                </Col>
                                <Col span={6}>
                                    <Item label='最小行车间隔(m)' {...formItemLayout}>
                                        {getFieldDecorator('minDrivingInterval', {
                                            rules: [],
                                        })(
                                            <Input disabled style={{ width: 100 }} />
                                        )}
                                    </Item>
                                </Col>
                                <Col span={6}>
                                    <Item label='备用车数' {...formItemLayout}>
                                        {getFieldDecorator('standbyTrain', {
                                            rules: [],
                                        })(
                                            <Input disabled style={{ width: 100 }} />
                                        )}
                                    </Item> 
                                </Col>
                                <Col span={6}>
                                    <Item label='始发站' {...formItemLayout}>
                                        {getFieldDecorator('startStation', {
                                            rules: [],
                                        })(
                                            <Input disabled style={{ width: 100 }} />
                                        )}
                                    </Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={6}>
                                    <Item label='终点站' {...formItemLayout}>
                                        {getFieldDecorator('endStation', {
                                            rules: [],
                                        })(
                                            <Input disabled style={{ width: 100 }} />
                                        )}
                                    </Item>
                                </Col>
                                <Col span={6}>
                                    <Item label='计划开行（列）' {...formItemLayout}>
                                        {getFieldDecorator('plannedOperationColumn', {
                                            rules: [],
                                        })(
                                            <Input disabled style={{ width: 100 }} />
                                        )}
                                    </Item>
                                </Col>
                                <Col span={6}>
                                    <Item label='首班时间' {...formItemLayout}>
                                        {getFieldDecorator('startDriveTime', {
                                            rules: [],
                                        })(
                                            <Input disabled style={{ width: 100 }} />
                                        )}
                                    </Item>
                                </Col>
                                <Col span={6}>
                                    <Item label='末班时间' {...formItemLayout}>
                                        {getFieldDecorator('endDriveTime', {
                                            rules: [],
                                        })(
                                            <Input disabled style={{ width: 100 }} />
                                        )}
                                    </Item>
                                </Col>
                            </Row> */}
                            
                            <Divider orientation="left" id='info' style={{ fontWeight: 'bold' }}>当日计划/非正常/实际载客里程</Divider>
                            <Row>
                                <Col span={12} style={{ fontSize: '15px', fontWeight: 'blod', marginLeft: '100px' }}>
                                    当日非正常载客里程：
                                    <Button type="primary" onClick={this.dataEntryOpen}>数据录入</Button>
                                </Col>
                            </Row>
                            
                            <Divider orientation="left" id='info' style={{ fontWeight: 'bold' }}></Divider>
                            <Row>
                                <Col span={6}>
                                    <Item label='2-5分钟终到早点列次' {...formItemLayout}>
                                        {getFieldDecorator('startingLateColumn_2_5', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '不能为空',
                                                },
                                            ],
                                        })(<InputNumber style={{ width: 100 }} min={0}
                                            onChange={(value) => this.setMetroLateFun({ propertyValue: value }, 'start_2-5')}
                                        />)}
                                    </Item>
                                </Col>
                                <Col span={6}>
                                    <Item label='2-5分钟终到晚点列次' {...formItemLayout}>
                                        {getFieldDecorator('endingLateColumn_2_5', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '不能为空',
                                                },
                                            ],
                                        })(<InputNumber style={{ width: 100 }} min={0}
                                            onChange={(value) => this.setMetroLateFun({ propertyValue: value }, 'end_2-5')}
                                        />)}
                                    </Item>
                                </Col>
                                <Col span={6}>
                                    <Item label='5-10分钟终到早点列次' {...formItemLayout}>
                                        {getFieldDecorator('startingLateColumn_5_10', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '不能为空',
                                                },
                                            ],
                                        })(<InputNumber style={{ width: 100 }} min={0}
                                            onChange={(value) => this.setMetroLateFun({ propertyValue: value }, 'start_5-10')}
                                        />)}
                                    </Item>
                                </Col>
                                <Col span={6}>
                                    <Item label='5-10分钟终到晚点列次' {...formItemLayout}>
                                        {getFieldDecorator('endingLateColumn_5_10', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '不能为空',
                                                },
                                            ],
                                        })(<InputNumber style={{ width: 100 }} min={0}
                                            onChange={(value) => this.setMetroLateFun({ propertyValue: value }, 'end_5-10')}
                                        />)}
                                    </Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={6}>
                                    <Item label='10-15分钟终到早点列次' {...formItemLayout}>
                                        {getFieldDecorator('startingLateColumn_10_15', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '不能为空',
                                                },
                                            ],
                                        })(<InputNumber style={{ width: 100 }} min={0}
                                            onChange={(value) => this.setMetroLateFun({ propertyValue: value }, 'start_10-15')}
                                        />)}
                                    </Item>
                                </Col>
                                <Col span={6}>
                                    <Item label='10-15分钟终到晚点列次' {...formItemLayout}>
                                        {getFieldDecorator('endingLateColumn_10_15', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '不能为空',
                                                },
                                            ],
                                        })(<InputNumber style={{ width: 100 }} min={0}
                                            onChange={(value) => this.setMetroLateFun({ propertyValue: value }, 'end_10-15')}
                                        />)}
                                    </Item>
                                </Col>
                                <Col span={6}>
                                    <Item label='15分钟以上终到早点列次' {...formItemLayout}>
                                        {getFieldDecorator('startingLateColumn_15', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '不能为空',
                                                },
                                            ],
                                        })(<InputNumber style={{ width: 100 }} min={0}
                                            onChange={(value) => this.setMetroLateFun({ propertyValue: value }, 'start_15')}
                                        />)}
                                    </Item>
                                </Col>
                                <Col span={6}>
                                    <Item label='15分钟以上终到晚点列次' {...formItemLayout}>
                                        {getFieldDecorator('endingLateColumn_15', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '不能为空',
                                                },
                                            ],
                                        })(<InputNumber style={{ width: 100 }} min={0}
                                            onChange={(value) => this.setMetroLateFun({ propertyValue: value }, 'end_15')}
                                        />)}
                                    </Item>
                                </Col>
                            </Row>
                            <Divider orientation="left" id='payPlan' style={{ fontWeight: 'bold' }}>列车运行调整列次</Divider>
                            <Row>
                                <Col span={6}>
                                    <Item label='加开（列）' {...formItemLayout}>
                                        {getFieldDecorator('columnJk', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '不能为空',
                                                },
                                            ],
                                        })(<InputNumber disabled style={{ width: '100%' }} min={0} />)}
                                    </Item>
                                </Col>
                                <Col span={6}>
                                    <Item label='抽线（列）' {...formItemLayout}>
                                        {getFieldDecorator('columnCx', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '不能为空',
                                                },
                                                {
                                                    validator: this.checkTrainColumnCx
                                                }
                                            ],
                                        })(<InputNumber style={{ width: '100%' }} min={0} disabled
                                            onChange={(value) => this.setMetroLateFun({ propertyValue: value }, 'columnCx')} />)}
                                    </Item>
                                </Col>
                                <Col span={6}>
                                    <Item label='下线（列）' {...formItemLayout}>
                                        {getFieldDecorator('columnXx', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '不能为空',
                                                },
                                            ],
                                        })(<InputNumber style={{ width: '100%' }} min={0} />)}
                                    </Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={6}>
                                    <Item label='清客（故障）' {...formItemLayout}>
                                        {getFieldDecorator('columnQk', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '不能为空',
                                                },
                                            ],
                                        })(<InputNumber style={{ width: '100%' }} min={0} />)}
                                    </Item>
                                </Col>
                                <Col span={6}>
                                    <Item label='清客（运营调整）' {...formItemLayout}>
                                        {getFieldDecorator('columnYy', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '不能为空',
                                                },
                                            ],
                                        })(<InputNumber style={{ width: '100%' }} min={0} />)}
                                    </Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={6}>
                                    <Item label='救援（列）' {...formItemLayout}>
                                        {getFieldDecorator('columnJy', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '不能为空',
                                                },
                                            ],
                                        })(<InputNumber style={{ width: '100%' }} min={0} />)}
                                    </Item>
                                </Col>
                                <Col span={6}>
                                    <Item label='跳停（列）' {...formItemLayout}>
                                        {getFieldDecorator('columnTt', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '不能为空',
                                                },
                                            ],
                                        })(<InputNumber style={{ width: '100%' }} min={0} />)}
                                    </Item>
                                </Col>
                            </Row>
                            <Divider orientation="left" id='change' style={{ fontWeight: 'bold' }}>列车使用情况</Divider>
                            <Row>
                                <Col span={8}>
                                    <Item label='运用车' {...formItemLayout1}>
                                        {getFieldDecorator('useCar', {
                                            initialValue: '',
                                        })(
                                            <Input title={this.state.useCar} disabled style={{ width: '100%' }} addonAfter={<a onClick={this.showMetroFun.bind(this, '0')}>选择</a>} />
                                        )}
                                    </Item>
                                </Col>
                                <Col span={8}>
                                    <Item label='备用车' {...formItemLayout1}>
                                        {getFieldDecorator('spareCar', {
                                            initialValue: '',
                                        })(
                                            <Input title={this.state.spareCar} disabled style={{ width: '100%' }} addonAfter={<a onClick={this.showMetroFun.bind(this, '1')}>选择</a>} />
                                        )}
                                    </Item>
                                </Col>
                                <Col span={8}>
                                    <Item label='调试车' {...formItemLayout1}>
                                        {getFieldDecorator('debugCar', {
                                            initialValue: '',
                                        })(
                                            <Input title={this.state.debugCar} disabled style={{ width: '100%' }} addonAfter={<a onClick={this.showMetroFun.bind(this, '2')}>选择</a>} />
                                        )}
                                    </Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={8}>
                                    <Item label='检修车' {...formItemLayout1}>
                                        {getFieldDecorator('inspectionCar', {
                                            initialValue: '',
                                        })(
                                            <Input title={this.state.inspectionCar} disabled style={{ width: '100%' }} addonAfter={<a onClick={this.showMetroFun.bind(this, '3')}>选择</a>} />
                                        )}
                                    </Item>
                                </Col>
                                <Col span={8}>
                                    <Item label='备注' {...formItemLayout1}>
                                        {getFieldDecorator('other', {
                                            initialValue: '',
                                        })(
                                            <Input.TextArea style={{ width: '100%' }} />
                                        )}
                                    </Item>
                                </Col>
                            </Row>
                            <Divider orientation="left" id='info' style={{ fontWeight: 'bold' }}></Divider>
                            <Row type="flex" justify="center">
                                <Col span={2} style={{ border: "1px solid #D5D5D5", textAlign: 'center' }}>计划开行(列次)</Col>
                                <Col span={2} style={{ borderTop: "1px solid #D5D5D5", borderRight: "1px solid #D5D5D5", textAlign: 'center' }}>{this.state.plannedOperationColumn}</Col>
                                <Col span={2} style={{ borderTop: "1px solid #D5D5D5", borderRight: "1px solid #D5D5D5", textAlign: 'center' }}>最大上线列车车数</Col>
                                <Col span={2} style={{ borderTop: "1px solid #D5D5D5", borderRight: "1px solid #D5D5D5", textAlign: 'center' }}>{this.state.maxOnlineTrain}</Col>
                                <Col span={2} style={{ borderTop: "1px solid #D5D5D5", borderRight: "1px solid #D5D5D5", textAlign: 'center' }}>最小行车间隔(m)</Col>
                                <Col span={2} style={{ borderTop: "1px solid #D5D5D5", borderRight: "1px solid #D5D5D5", textAlign: 'center' }}>{this.state.minDrivingInterval}</Col>
                                <Col span={2} style={{ borderTop: "1px solid #D5D5D5", borderRight: "1px solid #D5D5D5", textAlign: 'center' }}>备用车数</Col>
                                <Col span={2} style={{ borderTop: "1px solid #D5D5D5", borderRight: "1px solid #D5D5D5", textAlign: 'center' }}>{this.state.standbyTrain}</Col>
                            </Row>
                            <Row type="flex" justify="center" >
                                <Col span={2} style={{ borderLeft: "1px solid #D5D5D5", borderRight: "1px solid #D5D5D5", textAlign: 'center', borderBottom: "1px solid #D5D5D5" }}>始发站</Col>
                                <Col span={2} style={{ borderTop: "1px solid #D5D5D5", borderRight: "1px solid #D5D5D5", textAlign: 'center', borderBottom: "1px solid #D5D5D5" }}>{this.state.startStationName}</Col>
                                <Col span={2} style={{ borderTop: "1px solid #D5D5D5", borderRight: "1px solid #D5D5D5", textAlign: 'center', borderBottom: "1px solid #D5D5D5" }}>终点站</Col>
                                <Col span={2} style={{ borderTop: "1px solid #D5D5D5", borderRight: "1px solid #D5D5D5", textAlign: 'center', borderBottom: "1px solid #D5D5D5" }}>{this.state.endStationName}</Col>
                                <Col span={2} style={{ borderTop: "1px solid #D5D5D5", borderRight: "1px solid #D5D5D5", textAlign: 'center', borderBottom: "1px solid #D5D5D5" }}>首班时间</Col>
                                <Col span={2} style={{ borderTop: "1px solid #D5D5D5", borderRight: "1px solid #D5D5D5", textAlign: 'center', borderBottom: "1px solid #D5D5D5" }}>{this.state.startDriveTime}</Col>
                                <Col span={2} style={{ borderTop: "1px solid #D5D5D5", borderRight: "1px solid #D5D5D5", textAlign: 'center', borderBottom: "1px solid #D5D5D5" }}>末班时间</Col>
                                <Col span={2} style={{ borderTop: "1px solid #D5D5D5", borderRight: "1px solid #D5D5D5", textAlign: 'center', borderBottom: "1px solid #D5D5D5" }}>{this.state.endDriveTime}</Col>
                            </Row>
                            <Row type="flex" justify="center" style={{ marginTop: "10px" }}>
                                <Col span={4} style={{ border: "1px solid #D5D5D5" }}></Col>
                                <Col span={2} style={{ borderTop: "1px solid #D5D5D5", borderRight: "1px solid #D5D5D5", textAlign: 'center' }}>载客里程</Col>
                                <Col span={2} style={{ borderTop: "1px solid #D5D5D5", borderRight: "1px solid #D5D5D5", textAlign: 'center' }}>空驶里程</Col>
                                <Col span={2} style={{ borderTop: "1px solid #D5D5D5", borderRight: "1px solid #D5D5D5", textAlign: 'center' }}>既有线载客里程</Col>
                                <Col span={2} style={{ borderTop: "1px solid #D5D5D5", borderRight: "1px solid #D5D5D5", textAlign: 'center' }}>既有线空驶里程</Col>
                                <Col span={2} style={{ borderTop: "1px solid #D5D5D5", borderRight: "1px solid #D5D5D5", textAlign: 'center' }}>新线载客里程</Col>
                                <Col span={2} style={{ borderTop: "1px solid #D5D5D5", borderRight: "1px solid #D5D5D5", textAlign: 'center' }}>新线空驶里程</Col>
                            </Row>
                            <Row type="flex" justify="center" >
                                <Col span={4} style={{ borderLeft: "1px solid #D5D5D5", borderRight: "1px solid #D5D5D5", textAlign: 'center' }}>当日计划</Col>
                                <Col span={2} style={{ borderTop: "1px solid #D5D5D5", borderRight: "1px solid #D5D5D5", textAlign: 'center' }}>{this.state.passengerMiles}</Col>
                                <Col span={2} style={{ borderTop: "1px solid #D5D5D5", borderRight: "1px solid #D5D5D5", textAlign: 'center' }}>{this.state.emptyMiles}</Col>
                                <Col span={2} style={{ borderTop: "1px solid #D5D5D5", borderRight: "1px solid #D5D5D5", textAlign: 'center' }}>{this.state.allLinePassenageMiles}</Col>
                                <Col span={2} style={{ borderTop: "1px solid #D5D5D5", borderRight: "1px solid #D5D5D5", textAlign: 'center' }}>{this.state.allLineEmptyMiles}</Col>
                                <Col span={2} style={{ borderTop: "1px solid #D5D5D5", borderRight: "1px solid #D5D5D5", textAlign: 'center' }}>{this.state.newLinePassenageMiles}</Col>
                                <Col span={2} style={{ borderTop: "1px solid #D5D5D5", borderRight: "1px solid #D5D5D5", textAlign: 'center' }}>{this.state.newLineEmptyMiles}</Col>
                            </Row>
                            <Row type="flex" justify="center" >
                                <Col span={4} style={{ borderTop: "1px solid #D5D5D5", borderLeft: "1px solid #D5D5D5", borderRight: "1px solid #D5D5D5", textAlign: 'center' }}>当日非正常</Col>
                                <Col span={2} style={{ borderTop: "1px solid #D5D5D5", borderRight: "1px solid #D5D5D5", textAlign: 'center' }}>{this.state.trainDailyPassageMileAddForm.abnormalPassengerMiles}</Col>
                                <Col span={2} style={{ borderTop: "1px solid #D5D5D5", borderRight: "1px solid #D5D5D5", textAlign: 'center' }}>{this.state.trainDailyPassageMileAddForm.abnormalEmptyMiles}</Col>
                                <Col span={2} style={{ borderTop: "1px solid #D5D5D5", borderRight: "1px solid #D5D5D5", textAlign: 'center' }}>{this.state.trainDailyPassageMileAddForm.abnormalAllPassenageMiles}</Col>
                                <Col span={2} style={{ borderTop: "1px solid #D5D5D5", borderRight: "1px solid #D5D5D5", textAlign: 'center' }}>{this.state.trainDailyPassageMileAddForm.abnormalAllEmptyMiles}</Col>
                                <Col span={2} style={{ borderTop: "1px solid #D5D5D5", borderRight: "1px solid #D5D5D5", textAlign: 'center' }}>{this.state.trainDailyPassageMileAddForm.abnormalNewPassenageMiles}</Col>
                                <Col span={2} style={{ borderTop: "1px solid #D5D5D5", borderRight: "1px solid #D5D5D5", textAlign: 'center' }}>{this.state.trainDailyPassageMileAddForm.abnormalNewEmptyMiles}</Col>
                            </Row>
                            <Row type="flex" justify="center" >
                                <Col span={4} style={{ border: "1px solid #D5D5D5", textAlign: 'center' }}>当日实际</Col>
                                <Col span={2} style={{ borderTop: "1px solid #D5D5D5", borderRight: "1px solid #D5D5D5", borderBottom: "1px solid #D5D5D5", textAlign: 'center' }}>{this.state.trainDailyPassageMileAddForm.passengerMiles}</Col>
                                <Col span={2} style={{ borderTop: "1px solid #D5D5D5", borderRight: "1px solid #D5D5D5", borderBottom: "1px solid #D5D5D5", textAlign: 'center' }}>{this.state.trainDailyPassageMileAddForm.emptyMiles}</Col>
                                <Col span={2} style={{ borderTop: "1px solid #D5D5D5", borderRight: "1px solid #D5D5D5", borderBottom: "1px solid #D5D5D5", textAlign: 'center' }}>{this.state.trainDailyPassageMileAddForm.allLinePassenageMiles}</Col>
                                <Col span={2} style={{ borderTop: "1px solid #D5D5D5", borderRight: "1px solid #D5D5D5", borderBottom: "1px solid #D5D5D5", textAlign: 'center' }}>{this.state.trainDailyPassageMileAddForm.allLineEmptyMiles}</Col>
                                <Col span={2} style={{ borderTop: "1px solid #D5D5D5", borderRight: "1px solid #D5D5D5", borderBottom: "1px solid #D5D5D5", textAlign: 'center' }}>{this.state.trainDailyPassageMileAddForm.newLinePassenageMiles}</Col>
                                <Col span={2} style={{ borderTop: "1px solid #D5D5D5", borderRight: "1px solid #D5D5D5", borderBottom: "1px solid #D5D5D5", textAlign: 'center' }}>{this.state.trainDailyPassageMileAddForm.newLineEmptyMiles}</Col>
                            </Row>
                            {/* <Divider orientation="left" id='invoice' style={{ fontWeight: 'bold' }}>列车运行里程</Divider> */}
                            
                            <Divider orientation="left" id='info' style={{ fontWeight: 'bold' }}>列车日常运行情况</Divider>
                            <Row>
                                <Col span={6}>
                                    <Item label='计划开行（列）' {...formItemLayout}>
                                        {getFieldDecorator('plannedOperationColumn', {
                                            rules: [],
                                        })(
                                            <InputNumber min={0} disabled style={{ width: '100%' }} />
                                        )}
                                    </Item>
                                </Col>
                                <Col span={6}>
                                    <Item label='实际开行（列）' {...formItemLayout}>
                                        {getFieldDecorator('actualOperatingColumn', {
                                            rules: [

                                            ],
                                        })(
                                            <InputNumber min={0} disabled style={{ width: '100%' }} />
                                        )}
                                    </Item>
                                </Col>
                                <Col span={6}>
                                    <Item label='当日晚点（列）' {...formItemLayout}>
                                        {getFieldDecorator('dayLate', {
                                            rules: [],
                                        })(
                                            <InputNumber min={0} disabled style={{ width: '100%' }} />
                                        )}
                                    </Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={6}>
                                    <Item label='运营里程' {...formItemLayout}>
                                        {getFieldDecorator('operatingKilometres', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '不能为空',
                                                },
                                            ],
                                        })(<InputNumber disabled style={{ width: '100%' }} min={0} />)}
                                    </Item>
                                </Col>
                                <Col span={6}>
                                    <Item label='载客里程' {...formItemLayout}>
                                        {getFieldDecorator('carryingKilometres', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '不能为空',
                                                },
                                            ],
                                        })(<InputNumber style={{ width: '100%' }} min={0} disabled
                                            onChange={(value) => this.setOperatFun({ propertyValue: value }, 'carry')} />)}
                                    </Item>
                                </Col>
                                <Col span={6}>
                                    <Item label='空驶里程' {...formItemLayout}>
                                        {getFieldDecorator('deadheadKilometres', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '不能为空',
                                                },
                                            ],
                                        })(<InputNumber style={{ width: '100%' }} min={0} disabled
                                            onChange={(value) => this.setOperatFun({ propertyValue: value }, 'deadhead')} />)}
                                    </Item>
                                </Col>
                            </Row>
                            <Divider orientation="left" id='tongji' style={{ fontWeight: 'bold' }}>列车运行统计</Divider>
                            <Row>
                                <Col span={6}>
                                    <Item label='兑现率' {...formItemLayout}>
                                        {getFieldDecorator('fulfillmentRate', {
                                            rules: [],
                                        })(
                                            <Input disabled style={{ width: '100%' }} suffix="%" />
                                        )}
                                    </Item>
                                </Col>
                                <Col span={6}>
                                    <Item label='准点率' {...formItemLayout}>
                                        {getFieldDecorator('onTimeRate', {
                                            rules: [],
                                        })(
                                            <Input disabled style={{ width: '100%' }} suffix="%" />
                                        )}
                                    </Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={6}>
                                    <Item label='终到早点（列）' {...formItemLayout}>
                                        {getFieldDecorator('arriveEarlyColumn', {
                                            rules: [],
                                        })(
                                            <InputNumber min={0} disabled style={{ width: '100%' }} />
                                        )}
                                    </Item>
                                </Col>
                                <Col span={6}>
                                    <Item label='终到准点（列）' {...formItemLayout}>
                                        {getFieldDecorator('arriveOntimeColumn', {
                                            rules: [
                                                {
                                                    validator: this.checkTrainSum
                                                }
                                            ],
                                        })(
                                            <InputNumber disabled style={{ width: '100%' }} />
                                        )}
                                    </Item>
                                </Col>
                                <Col span={6}>
                                    <Item label='终到晚点（列）' {...formItemLayout}>
                                        {getFieldDecorator('arriveLateColumn', {
                                            rules: [],
                                        })(
                                            <InputNumber min={0} disabled style={{ width: '100%' }} />
                                        )}
                                    </Item>
                                </Col>
                            </Row>
                        </div>
                        {/* </Modal> */}
                    </Form>
                    {this.state.showDataEntryModal && <DataEntryModal
                        modalVisible={this.state.showDataEntryModal}
                        line={this.state.line}
                        handleCancel={this.dataEntryClose}
                        dataEntrySuccess={this.dataEntrySuccess}
                        type={this.state.type}
                        idTemp={this.state.idTemp}
                        dataTop1={this.state.dataTop1}
                        dataTop2={this.state.dataTop2}
                        dataTop3={this.state.dataTop3}
                        dataTop4={this.state.dataTop4}
                        dataDown1={this.state.dataDown1}
                        dataDown2={this.state.dataDown2}
                        dataDown3={this.state.dataDown3}
                        dataDown4={this.state.dataDown4}
                    />}
                    {showMetroModal && <MetroModal
                        checkList={this.state.checkList}
                        addSuccess={this.addSuccess}
                        handleCancel={this.handleCancel}
                        modalVisible={showMetroModal}
                        line={this.state.line}
                        lineChoose={this.state.lineChoose} />}
                </div>
            </div>
        )
    }
}
const AddModals = Form.create()(AddModal);
export default connect(state => ({
    currentLocale: state.localeProviderData,
}))(AddModals);