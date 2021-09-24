import React, { Component, Fragment } from 'react';
import { Modal, Form, notification, Input, Button, Anchor, Select, Divider, DatePicker, InputNumber, Row, Col } from 'antd';
import moment from 'moment';
import style from './style.less';
import _ from 'lodash'
import intl from 'react-intl-universal';
import { connect } from 'react-redux';
import { curdCurrentData } from '../../../../../../store/curdData/action';
import axios from '../../../../../../api/axios';
import { getTrainScheduleList, trainDailUpdate, addDailyChangeVersion, queryTrainList } from '../../../../api/suzhou-api';
import { getBaseData } from '@/modules/Suzhou/components/Util/util';
import MetroModal from '../MetroCodeModal/index'
import DataEntryUpdateModal from '../DataEntryUpdateModal/index'
import EditLogModal from '@/modules/Suzhou/components/EditLogModal/index'
const { Item } = Form;
const { Link } = Anchor
const { TextArea } = Input;
const Option = Select.Option;
import PublicButton from "../../../../../../components/public/TopTags/PublicButton";
import * as dataUtil from "../../../../../../utils/dataUtil";
import FormItem from 'antd/lib/form/FormItem';
import LabelFormLayout from "@/components/public/Layout/Labels/Form/LabelFormLayout"

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
            showMetroModal: false,   //选择车辆modal
            changeButtonShow: true,  //调整按钮
            showEditInfoModal: false,    //修改日志按钮
            lineArr: [], //线路
            recordTime: '',  //记录日期
            line: '',    //线路
            scheduleId: '', //选择的是时刻表id
            record: {},  //修改前数据
            submitShow: 0,
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
            modifyRemark: '',
            showDataEntryModal: false,   //显示非正常行驶数据modal
            trainDailyPassageMileVo: {},    //非正常行驶数据统计
            trainDailyUpSchedule: [],    //上行录入数据
            trainDailyDownSchedule: [],  //下行录入数据
            passengerMiles: 0, //当日计划载客里程
            emptyMiles: 0,    //当日计划空驶里程
            allLinePassenageMiles: 0,//当日计划既有线载客里程
            allLineEmptyMiles: 0,  //当日计划既有线空驶里程
            newLinePassenageMiles: 0,  //当日计划新线载客里程
            newLineEmptyMiles: 0,   //当日计划新线空驶里程
        }
    }
    componentDidMount() {
        const { record } = this.props
        const { trainScheduleVo } = record
        //获取列车信息列表
        axios.get(queryTrainList+`?line=${record.line}`).then(res => {
            let data = res.data.data ? res.data.data : []
                this.setState({
                    metroList: data,
                },()=>{
                    this.setState({
                        record,
                        line: record.line,
                        useCar: record.useCar,
                        spareCar: record.spareCar,
                        debugCar: record.debugCar,
                        inspectionCar: record.inspectionCar,
                        useCar1: this.findMetroIdByCode(record.useCar),
                        spareCar1: this.findMetroIdByCode(record.spareCar),
                        debugCar1: this.findMetroIdByCode(record.debugCar),
                        inspectionCar1: this.findMetroIdByCode(record.inspectionCar),
                        plannedOperationColumn: trainScheduleVo.plannedOperationColumn,  //计划开行
                        trainDailyPassageMileVo: record.trainDailyPassageMileVo,    //非正常行驶数据统计
                        trainDailyUpSchedule: record.trainDailyUpSchedule,    //上行录入数据
                        trainDailyDownSchedule: record.trainDailyDownSchedule,  //下行录入数据
                    })
                })
            })
        
        getBaseData('line').then(data => { this.setState({ lineArr: data }) })
        this.getTrainScheduleList(record.line)
    }
    //根据列车code查询id
    findMetroIdByCode=(params)=>{
        const oldList =  params.split(',')
        let idList = []
        oldList.map(item=>{
            _.findIndex(this.state.metroList,(e)=>{
                if(e.trainCode == item){
                    idList.push(e.id)
                }
            })
        })
        return idList
    }
    //点击调整按钮
    editFun = () => {
        let submitShow = this.state.submitShow
        submitShow++
        this.setState({
            changeButtonShow: false,
            submitShow,
            disabled: false
        }, () => {
            if (this.state.changeButtonShow == false && this.state.submitShow > 1) {
                this.setState({
                    showSubmitModal: true
                })
            }
        })
    }
    //点击修改日志按钮
    editInfoFun = () => {
        const { showEditInfoModal } = this.state
        this.setState({
            showEditInfoModal: !showEditInfoModal,
        })
    }
    //获取时刻表数据
    getTrainScheduleList = (line) => {
        axios.get(getTrainScheduleList, { params: { scheduleCode: '', line } }).then(res => {
            let data = res.data.data ? res.data.data : []
            this.setState({
                treeDataZq: data,
            }, () => {
                this.handleClock(this.props.record.scheduleId)
            })
        })
    }
    //选择时刻表
    handleClock = (value, option) => {
        const { treeDataZq } = this.state
        const { scheduleCode } = this.props.record.trainScheduleVo
        if (option) {
            this.handleTipInfo(option.props.children, scheduleCode, '时刻表编码', '1')
        }
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
                    plannedOperationColumn: item.plannedOperationColumn,    //计划开行列
                    scheduleId: item.id,    //选择时刻表的id
                    maxOnlineTrain: item.maxOnlineTrain,   //最大上线数
                    minDrivingInterval: item.minDrivingInterval,   //最小行车间距
                    standbyTrain: item.standbyTrain,   //备用车数
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
                this.checkUseCar(data)
                this.setState({ useCar: data, useCar1: lineAtt })
                break;
            case '1':
                this.props.form.setFieldsValue({ spareCar: data }) //备用车
                this.checkSpareCar(data)
                this.setState({ spareCar: data, spareCar1: lineAtt })
                break;
            case '2':
                this.props.form.setFieldsValue({ debugCar: data }) //调试车
                this.checkDebugCar(data)
                this.setState({ debugCar: data, debugCar1: lineAtt })
                break;
            case '3':
                this.props.form.setFieldsValue({ inspectionCar: data }) //检修车
                this.checkInspectionCar(data)
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
    //校验抽线不能大于计划开行
    checkTrainColumnCx = (rule, value, callBack) => {
        const { plannedOperationColumn } = this.state
        const { columnCx } = this.props.record
        this.handleTipInfo(value, columnCx, '抽线（列）', '2')
        if (Number(value) > Number(plannedOperationColumn)) {
            callBack('抽线列不能大于计划开行列')
        } else {
            callBack()
        }
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
            operatingKilometres: carryingKilometres + deadheadKilometres,
        })
    }
    //修改信息包含哪几快
    setColType = (colType) => {
        const { tipTitleArr } = this.state
        switch (colType) {
            case '1':
                tipTitleArr.add('1')
                break;
            case '2':
                tipTitleArr.add('2')
                break;
            case '3':
                tipTitleArr.add('3')
                break;
            case '4':
                tipTitleArr.add('4')
                break;
            case '5':
                tipTitleArr.add('5')
                break;
            default:
                break;
        }
        this.setState({
            tipTitleArr
        })
    }
    //保存修改数据
    handleTipInfo = (value, valueBefore, type, colType) => {
        let { tipInfo, tipArr } = this.state
        if (tipArr.indexOf(type) > -1) {
            if (value == valueBefore) {
                tipInfo = tipInfo.filter(item => item.type !== type)
                tipArr = tipArr.filter(item => item !== type)
            } else {
                tipInfo.filter((item, index) => item.type == type ? tipInfo[index].value = value : null)
            }
        } else if (tipArr.indexOf(type) < 0 && value !== valueBefore) {
            tipArr.push(type)
            tipInfo.push({ type, valueBefore, value, colType })
            this.setColType(colType)
        }
        this.setState({
            tipInfo, tipArr
        })
    }
    // checkScheduleId = (rule,value,callBack)=>{
    //     const { scheduleId } = this.props.record
    //     this.handleTipInfo(value,scheduleId,'时刻表编码','1')
    //     callBack()
    // }
    checkStart_25 = (rule, value, callBack) => {
        const { startingLateColumn_2_5 } = this.props.record
        this.handleTipInfo(value, startingLateColumn_2_5, '2-5分钟终到早点列次', '1')
        callBack()
    }
    checkEnd_25 = (rule, value, callBack) => {
        const { endingLateColumn_2_5 } = this.props.record
        this.handleTipInfo(value, endingLateColumn_2_5, '2-5分钟终到晚点列次', '1')
        callBack()
    }
    checkStart_51 = (rule, value, callBack) => {
        const { startingLateColumn_5_10 } = this.props.record
        this.handleTipInfo(value, startingLateColumn_5_10, '5-10分钟终到早点列次', '1')
        callBack()
    }
    checkEnd_51 = (rule, value, callBack) => {
        const { endingLateColumn_5_10 } = this.props.record
        this.handleTipInfo(value, endingLateColumn_5_10, '5-10分钟终到晚点列次', '1')
        callBack()
    }
    checkStart_15 = (rule, value, callBack) => {
        const { startingLateColumn_10_15 } = this.props.record
        this.handleTipInfo(value, startingLateColumn_10_15, '10-15分钟终到早点列次', '1')
        callBack()
    }
    checkEnd_15 = (rule, value, callBack) => {
        const { endingLateColumn_10_15 } = this.props.record
        this.handleTipInfo(value, endingLateColumn_10_15, '10-15分钟终到晚点列次', '1')
        callBack()
    }
    checkStart_5 = (rule, value, callBack) => {
        const { startingLateColumn_15 } = this.props.record
        this.handleTipInfo(value, startingLateColumn_15, '15分钟以上终到早点列次', '1')
        callBack()
    }
    checkEnd_5 = (rule, value, callBack) => {
        const { endingLateColumn_15 } = this.props.record
        this.handleTipInfo(value, endingLateColumn_15, '15分钟以上终到晚点列次', '1')
        callBack()
    }
    checkColumnJk = (rule, value, callBack) => {
        const { columnJk } = this.props.record
        this.handleTipInfo(value, columnJk, '加开（列）', '2')
        callBack()
    }
    checkColumnJy = (rule, value, callBack) => {
        const { columnJy } = this.props.record
        this.handleTipInfo(value, columnJy, '救援（列）', '2')
        callBack()
    }
    checkColumnTt = (rule, value, callBack) => {
        const { columnTt } = this.props.record
        this.handleTipInfo(value, columnTt, '跳停（列）', '2')
        callBack()
    }
    checkColumnXx = (rule, value, callBack) => {
        const { columnXx } = this.props.record
        this.handleTipInfo(value, columnXx, '下线（列）', '2')
        callBack()
    }
    checkColumnQk = (rule, value, callBack) => {
        const { columnQk } = this.props.record
        this.handleTipInfo(value, columnQk, '故障清客（列）', '2')
        callBack()
    }
    checkColumnYy = (rule, value, callBack) => {
        const { columnYy } = this.props.record
        this.handleTipInfo(value, columnYy, '运营调整（列）', '2')
        callBack()
    }
    checkOperat = (rule, value, callBack) => {
        const { operatingKilometres } = this.props.record
        this.handleTipInfo(value, operatingKilometres, '运营里程', '4')
        callBack()
    }
    checkCarry = (rule, value, callBack) => {
        const { carryingKilometres } = this.props.record
        this.handleTipInfo(value, carryingKilometres, '载客里程', '4')
        callBack()
    }
    checkDeadHead = (rule, value, callBack) => {
        const { deadheadKilometres } = this.props.record
        this.handleTipInfo(value, deadheadKilometres, '空驶里程', '4')
        callBack()
    }
    checkUseCar = (value) => {
        const { useCar } = this.props.record
        this.handleTipInfo(value, useCar, '运用车', '5')
    }
    checkSpareCar = (value) => {
        const { spareCar } = this.props.record
        this.handleTipInfo(value, spareCar, '备用车', '5')
    }
    checkDebugCar = (value) => {
        const { debugCar } = this.props.record
        this.handleTipInfo(value, debugCar, '调试车', '5')
    }
    checkInspectionCar = (value) => {
        const { inspectionCar } = this.props.record
        this.handleTipInfo(value, inspectionCar, '检修车', '5')
    }
    checkOther = (rule, value, callBack) => {
        const { other } = this.props.record
        this.handleTipInfo(value, other, '备注', '5')
        callBack()
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
            trainDailyPassageMileVo,
            trainDailyUpSchedule,
            trainDailyDownSchedule,
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
        trainDailyUpSchedule.map(item => {
            if (item.typeCode == 'top1') {
                columnJk += Number(item.coloumns)
                abnormalPassengerMiles += Number(item.mileage) * Number(item.coloumns);
                abnormalAllPassenageMiles += Number(item.oldLineStationMileage) * Number(item.coloumns);
                abnormalNewPassenageMiles += Number(item.newLineStationMileage) * Number(item.coloumns)
            }
            if (item.typeCode == 'top2') {
                columnCx += Number(item.coloumns)
                abnormalPassengerMiles += Number(item.mileage) * Number(item.coloumns);
                abnormalAllPassenageMiles += Number(item.oldLineStationMileage) * Number(item.coloumns);
                abnormalNewPassenageMiles += Number(item.newLineStationMileage) * Number(item.coloumns)
            }
            if (item.typeCode == 'top3') {
                columnJk += Number(item.coloumns)
                abnormalEmptyMiles += Number(item.mileage) * Number(item.coloumns);
                abnormalAllEmptyMiles += Number(item.oldLineStationMileage) * Number(item.coloumns);
                abnormalNewEmptyMiles += Number(item.newLineStationMileage) * Number(item.coloumns)
            }
            if (item.typeCode == 'top4') {
                columnCx += Number(item.coloumns)
                abnormalEmptyMiles += Number(item.mileage) * Number(item.coloumns);
                abnormalAllEmptyMiles += Number(item.oldLineStationMileage) * Number(item.coloumns);
                abnormalNewEmptyMiles += Number(item.newLineStationMileage) * Number(item.coloumns)
            }
        })
        trainDailyDownSchedule.map(item => {
            if (item.typeCode == 'down1') {
                columnJk += Number(item.coloumns)
                abnormalPassengerMiles += Number(item.mileage) * Number(item.coloumns);
                abnormalAllPassenageMiles += Number(item.oldLineStationMileage) * Number(item.coloumns);
                abnormalNewPassenageMiles += Number(item.newLineStationMileage) * Number(item.coloumns)
            }
            if (item.typeCode == 'down2') {
                columnCx += Number(item.coloumns)
                abnormalPassengerMiles += Number(item.mileage) * Number(item.coloumns);
                abnormalAllPassenageMiles += Number(item.oldLineStationMileage) * Number(item.coloumns);
                abnormalNewPassenageMiles += Number(item.newLineStationMileage) * Number(item.coloumns)
            }
            if (item.typeCode == 'down3') {
                columnJk += Number(item.coloumns)
                abnormalEmptyMiles += Number(item.mileage) * Number(item.coloumns);
                abnormalAllEmptyMiles += Number(item.oldLineStationMileage) * Number(item.coloumns);
                abnormalNewEmptyMiles += Number(item.newLineStationMileage) * Number(item.coloumns)
            }
            if (item.typeCode == 'down4') {
                columnCx += Number(item.coloumns)
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
            trainDailyPassageMileVo: {    //非正常行驶数据
                ...trainDailyPassageMileVo,
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
    dataEntrySuccess = (dataSource1, dataSource2) => {
        this.setState({
            trainDailyUpSchedule: dataSource1, //上行数据
            trainDailyDownSchedule: dataSource2,    //下行数据
        }, () => {
            this.setTodayPlanFun()
        })
    }
    //提交数据
    handleSubmit = (val, e) => {
        e.preventDefault();
        this.setState({ showSubmitModal: true })
    }
    //确认提交按钮
    handleSubmitSign = () => {
        let self = this;
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (err) {
                this.setState({ showSubmitModal: false })
            } else {

                let f1 = new Promise((resolve, reject) => {
                    const { trainDailyUpSchedule, trainDailyDownSchedule, trainDailyPassageMileVo } = this.state
                    const recordTime = moment(values.recordTime).format('YYYY-MM-DD')
                    const line = values.line
                    const data = {
                        ...values,
                        recordTime,
                        id: this.props.record.id,
                        trainDailyScheduleUpUpdateForm: trainDailyUpSchedule,
                        trainDailyScheduleDownUpdateForm: trainDailyDownSchedule,
                        trainDailyPassageMileUpdateForm: {
                            ...trainDailyPassageMileVo,
                            line,
                            recordTime
                        }
                    }
                    axios.put(trainDailUpdate, data, true).then(res => {
                        if (res.data.status === 200) {
                            resolve('success')
                        }
                    });
                })

                let f2 = new Promise((resolve, reject) => {
                    const params = {
                        moudleRecordId: this.props.record.id,
                        moudleName: '行车日况',
                        modifyRemark: this.state.modifyRemark,
                        modifyContent: document.getElementById('modifyContent').innerText
                    }
                    axios.post(addDailyChangeVersion, params, true).then(res => {
                        if (res.data.status === 200) {
                            resolve('success')
                            // remarkSuccess = true
                            // this.setState({ showSubmitModal: false })

                        } else {
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

                Promise.all([f1, f2]).then((results) => {
                    // console.log(results)// ["p1 data", ""p2 data""]
                    if (results && results.length && results[0] == 'success' && results[1] == 'success') {
                        // this.props.handleCancel()
                        // this.props.updateSuccess();
                        this.handleCancelClose();
                    } else {
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
                // console.log(updateSuccess,remarkSuccess)
            }
        })
    }
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
        const { tipInfo, lineArr, showMetroModal, changeButtonShow, showEditInfoModal, disabled } = this.state
        const { height, record, permission } = this.props
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
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };
        return (
            <LabelFormLayout>
                <div>
                    <Form onSubmit={this.handleSubmitSign}>
                        <div className={style.tipLayout}>
                            <div className={style.tipBox}>
                                <div className={style.topTags}>
                                    <Row type="flex">
                                        <Col span={8}>
                                            <Item label='日期' {...formItemLayout2}>
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
                                        <Col span={8}>
                                            <Item label='线路' {...formItemLayout2}>
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
                                        <Col span={8}>
                                            <Item label='时刻表' {...formItemLayout2}>
                                                {getFieldDecorator('scheduleId', {
                                                    initialValue: record.scheduleId,
                                                    rules: [
                                                        {
                                                            required: true,
                                                            message: '不能为空',
                                                        },
                                                        // {
                                                        //     validator: this.checkScheduleId
                                                        // }
                                                    ],
                                                })(<Select disabled={disabled}
                                                    showSearch
                                                    dropdownMatchSelectWidth={false}
                                                    size='small'
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
                                    <Button type="primary" icon='profile' size='small' style={{ marginRight: 15 }} onClick={this.editInfoFun}>{record.reviewStatusVo && record.reviewStatusVo.code == 'INIT' ? '修改日志' : '调整日志'}</Button>
                                    {((record.reviewStatusVo.code == 'INIT' && permission.indexOf('DRIVINGMANAGE_DRIVING-EDIT-I') !== -1) || (record.reviewStatusVo.code == 'APPROVED' && permission.indexOf('DRIVINGMANAGE_DRIVING-EDIT-A') !== -1)) && (<Fragment>
                                        <Button type="primary" icon={changeButtonShow ? "edit" : "check"} size='small' style={{ marginRight: 30 }} onClick={this.editFun} >{changeButtonShow ? (record.reviewStatusVo.code == 'INIT' ? '修改' : '调整') : "提交"}</Button></Fragment>)}
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
                        <Modal title="提交修改"
                            visible={this.state.showSubmitModal}
                            onOk={this.handleSubmitSign}
                            onCancel={this.handleCancelClose}
                            width='500px'>
                            <div id='modifyContent'>
                                {tipTitleArr.indexOf('1') > -1 ? <p style={{ fontWeight: 'bold' }}>列车日常运行情况</p> : null}
                                {tipInfo.map((item) => {
                                    if (item.colType == '1') {
                                        return <p style={{ 'marginLeft': '8px' }}>[{item.type}]由{item.valueBefore}修改为<i style={{ color: 'red' }}>{item.value}</i></p>
                                    }
                                })}
                                {tipTitleArr.indexOf('2') > -1 ? <p style={{ fontWeight: 'bold' }}>列车运行调整列次</p> : null}
                                {tipInfo.map((item) => {
                                    if (item.colType == '2') {
                                        return <p style={{ 'marginLeft': '8px' }}>[{item.type}]由{item.valueBefore}修改为<i style={{ color: 'red' }}>{item.value}</i></p>
                                    }
                                })}
                                {tipTitleArr.indexOf('3') > -1 ? <p style={{ fontWeight: 'bold' }}>列车运行统计</p> : null}
                                {tipInfo.map((item) => {
                                    if (item.colType == '3') {
                                        return <p style={{ 'marginLeft': '8px' }}>[{item.type}]由{item.valueBefore}修改为<i style={{ color: 'red' }}>{item.value}</i></p>
                                    }
                                })}
                                {tipTitleArr.indexOf('4') > -1 ? <p style={{ fontWeight: 'bold' }}>列车运行里程</p> : null}
                                {tipInfo.map((item) => {
                                    if (item.colType == '4') {
                                        return <p style={{ 'marginLeft': '8px' }}>[{item.type}]由{item.valueBefore}修改为<i style={{ color: 'red' }}>{item.value}</i></p>
                                    }
                                })}
                                {tipTitleArr.indexOf('5') > -1 ? <p style={{ fontWeight: 'bold' }}>列车使用情况</p> : null}
                                {tipInfo.map((item) => {
                                    if (item.colType == '5') {
                                        return <p style={{ 'marginLeft': '8px' }}>[{item.type}]由{item.valueBefore}修改为<i style={{ color: 'red' }}>{item.value}</i></p>
                                    }
                                })}
                            </div>
                            {tipInfo.length < 1 ? <p style={{ 'marginLeft': '8px' }}>无修改记录</p> : null}
                            <span style={{ 'fontWeight': 'bold', 'verticalAlign': 'top' }}>修改备注：</span><TextArea style={{ width: 400 }} onChange={this.changeRemark.bind(this)} />
                        </Modal>
                        <div className={style.mainBody} style={{ height: height + 60, overflow: 'auto' }}>
                            <Divider orientation="left" id='info' style={{ fontWeight: 'bold' }}>列车日常运行情况</Divider>
                            <Row>
                                <Col span={6}>
                                    <Item label='计划开行（列）' {...formItemLayout}>
                                        {getFieldDecorator('plannedOperationColumn', {
                                            initialValue: record.trainScheduleVo.plannedOperationColumn,
                                            rules: [],
                                        })(
                                            <InputNumber min={0} disabled style={{ width: '100%' }} />
                                        )}
                                    </Item>
                                </Col>
                                <Col span={6}>
                                    <Item label='实际开行（列）' {...formItemLayout}>
                                        {getFieldDecorator('actualOperatingColumn', {
                                            initialValue: record.actualOperatingColumn,
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
                                            initialValue: record.dayLate,
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
                                            initialValue: record.operatingKilometres,
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '不能为空',
                                                },
                                                // {
                                                //     validator: this.checkOperat
                                                // }
                                            ],
                                        })(<InputNumber disabled style={{ width: '100%' }} min={0} />)}
                                    </Item>
                                </Col>
                                <Col span={6}>
                                    <Item label='载客里程' {...formItemLayout}>
                                        {getFieldDecorator('carryingKilometres', {
                                            initialValue: record.carryingKilometres,
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '不能为空',
                                                },
                                                {
                                                    validator: this.checkCarry
                                                }
                                            ],
                                        })(<InputNumber disabled style={{ width: '100%' }} min={0}
                                            onChange={(value) => this.setOperatFun({ propertyValue: value }, 'carry')} />)}
                                    </Item>
                                </Col>
                                <Col span={6}>
                                    <Item label='空驶里程' {...formItemLayout}>
                                        {getFieldDecorator('deadheadKilometres', {
                                            initialValue: record.deadheadKilometres,
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '不能为空',
                                                },
                                                {
                                                    validator: this.checkDeadHead
                                                }
                                            ],
                                        })(<InputNumber disabled style={{ width: '100%' }} min={0}
                                            onChange={(value) => this.setOperatFun({ propertyValue: value }, 'deadhead')} />)}
                                    </Item>
                                </Col>
                            </Row>
                            <Divider orientation="left" id='info' style={{ fontWeight: 'bold' }}></Divider>

                            {/* <Row>
                                <Col span={6}>
                                    <Item label='最大上线列车数' {...formItemLayout}>
                                        {getFieldDecorator('maxOnlineTrain', {
                                            initialValue: record.trainScheduleVo.maxOnlineTrain,
                                            rules: [],
                                        })(
                                            <Input disabled style={{ width: 100 }} />
                                        )}
                                    </Item>
                                </Col>
                                <Col span={6}>
                                    <Item label='最小行车间隔(m)' {...formItemLayout}>
                                        {getFieldDecorator('minDrivingInterval', {
                                            initialValue: record.trainScheduleVo.minDrivingInterval,
                                            rules: [],
                                        })(
                                            <Input disabled style={{ width: 100 }} />
                                        )}
                                    </Item>
                                </Col>
                                <Col span={6}>
                                    <Item label='备用车数' {...formItemLayout}>
                                        {getFieldDecorator('standbyTrain', {
                                            initialValue: record.trainScheduleVo.standbyTrain,
                                            rules: [],
                                        })(
                                            <Input disabled style={{ width: 100 }} />
                                        )}
                                    </Item>
                                </Col>
                                <Col span={6}>
                                    <Item label='始发站' {...formItemLayout}>
                                        {getFieldDecorator('startStation', {
                                            initialValue: record.trainScheduleVo.startStation,
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
                                            initialValue: record.trainScheduleVo.endStation,
                                            rules: [],
                                        })(
                                            <Input disabled style={{ width: 100 }} />
                                        )}
                                    </Item>
                                </Col>
                                <Col span={6}>
                                    <Item label='计划开行（列）' {...formItemLayout}>
                                        {getFieldDecorator('plannedOperationColumn', {
                                            initialValue: record.trainScheduleVo.plannedOperationColumn,
                                            rules: [],
                                        })(
                                            <Input disabled style={{ width: 100 }} />
                                        )}
                                    </Item>
                                </Col>
                                <Col span={6}>
                                    <Item label='首班时间' {...formItemLayout}>
                                        {getFieldDecorator('startDriveTime', {
                                            initialValue: record.trainScheduleVo.startDriveTime,
                                            rules: [],
                                        })(
                                            <Input disabled style={{ width: 100 }} />
                                        )}
                                    </Item>
                                </Col>
                                <Col span={6}>
                                    <Item label='末班时间' {...formItemLayout}>
                                        {getFieldDecorator('endDriveTime', {
                                            initialValue: record.trainScheduleVo.endDriveTime,
                                            rules: [],
                                        })(
                                            <Input disabled style={{ width: 100 }} />
                                        )}
                                    </Item>
                                </Col>
                            </Row> */}
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
                            <Divider orientation="left" id='info' style={{ fontWeight: 'bold' }}>当日计划/非正常/实际载客里程</Divider>
                            <Row>
                                <Col span={12} style={{ fontSize: '15px', fontWeight: 'blod', marginLeft: '100px' }}>
                                    当日非正常载客里程：
                                    <Button type="primary" onClick={this.dataEntryOpen} disabled={this.state.changeButtonShow ? true : false}>数据录入</Button>
                                </Col>
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
                                <Col span={2} style={{ borderTop: "1px solid #D5D5D5", borderRight: "1px solid #D5D5D5", textAlign: 'center' }}>{this.state.trainDailyPassageMileVo.abnormalPassengerMiles}</Col>
                                <Col span={2} style={{ borderTop: "1px solid #D5D5D5", borderRight: "1px solid #D5D5D5", textAlign: 'center' }}>{this.state.trainDailyPassageMileVo.abnormalEmptyMiles}</Col>
                                <Col span={2} style={{ borderTop: "1px solid #D5D5D5", borderRight: "1px solid #D5D5D5", textAlign: 'center' }}>{this.state.trainDailyPassageMileVo.abnormalAllPassenageMiles}</Col>
                                <Col span={2} style={{ borderTop: "1px solid #D5D5D5", borderRight: "1px solid #D5D5D5", textAlign: 'center' }}>{this.state.trainDailyPassageMileVo.abnormalAllEmptyMiles}</Col>
                                <Col span={2} style={{ borderTop: "1px solid #D5D5D5", borderRight: "1px solid #D5D5D5", textAlign: 'center' }}>{this.state.trainDailyPassageMileVo.abnormalNewPassenageMiles}</Col>
                                <Col span={2} style={{ borderTop: "1px solid #D5D5D5", borderRight: "1px solid #D5D5D5", textAlign: 'center' }}>{this.state.trainDailyPassageMileVo.abnormalNewEmptyMiles}</Col>
                            </Row>
                            <Row type="flex" justify="center" >
                                <Col span={4} style={{ border: "1px solid #D5D5D5", textAlign: 'center' }}>当日实际</Col>
                                <Col span={2} style={{ borderTop: "1px solid #D5D5D5", borderRight: "1px solid #D5D5D5", borderBottom: "1px solid #D5D5D5", textAlign: 'center' }}>{this.state.trainDailyPassageMileVo.passengerMiles}</Col>
                                <Col span={2} style={{ borderTop: "1px solid #D5D5D5", borderRight: "1px solid #D5D5D5", borderBottom: "1px solid #D5D5D5", textAlign: 'center' }}>{this.state.trainDailyPassageMileVo.emptyMiles}</Col>
                                <Col span={2} style={{ borderTop: "1px solid #D5D5D5", borderRight: "1px solid #D5D5D5", borderBottom: "1px solid #D5D5D5", textAlign: 'center' }}>{this.state.trainDailyPassageMileVo.allLinePassenageMiles}</Col>
                                <Col span={2} style={{ borderTop: "1px solid #D5D5D5", borderRight: "1px solid #D5D5D5", borderBottom: "1px solid #D5D5D5", textAlign: 'center' }}>{this.state.trainDailyPassageMileVo.allLineEmptyMiles}</Col>
                                <Col span={2} style={{ borderTop: "1px solid #D5D5D5", borderRight: "1px solid #D5D5D5", borderBottom: "1px solid #D5D5D5", textAlign: 'center' }}>{this.state.trainDailyPassageMileVo.newLinePassenageMiles}</Col>
                                <Col span={2} style={{ borderTop: "1px solid #D5D5D5", borderRight: "1px solid #D5D5D5", borderBottom: "1px solid #D5D5D5", textAlign: 'center' }}>{this.state.trainDailyPassageMileVo.newLineEmptyMiles}</Col>
                            </Row>
                            <Divider orientation="left" id='info' style={{ fontWeight: 'bold' }}></Divider>
                            <Row>
                                <Col span={6}>
                                    <Item label='2-5分钟终到早点列次' {...formItemLayout}>
                                        {getFieldDecorator('startingLateColumn_2_5', {
                                            initialValue: record.startingLateColumn_2_5,
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '不能为空',
                                                },
                                                {
                                                    validator: this.checkStart_25
                                                }
                                            ],
                                        })(<InputNumber style={{ width: 100 }} min={0} disabled={disabled}
                                            onChange={(value) => this.setMetroLateFun({ propertyValue: value }, 'start_2-5')}
                                        />)}
                                    </Item>
                                </Col>
                                <Col span={6}>
                                    <Item label='2-5分钟终到晚点列次' {...formItemLayout}>
                                        {getFieldDecorator('endingLateColumn_2_5', {
                                            initialValue: record.endingLateColumn_2_5,
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '不能为空',
                                                },
                                                {
                                                    validator: this.checkEnd_25
                                                }
                                            ],
                                        })(<InputNumber style={{ width: 100 }} min={0} disabled={disabled}
                                            onChange={(value) => this.setMetroLateFun({ propertyValue: value }, 'end_2-5')}
                                        />)}
                                    </Item>
                                </Col>
                                <Col span={6}>
                                    <Item label='5-10分钟终到早点列次' {...formItemLayout}>
                                        {getFieldDecorator('startingLateColumn_5_10', {
                                            initialValue: record.startingLateColumn_5_10,
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '不能为空',
                                                },
                                                {
                                                    validator: this.checkStart_51
                                                }
                                            ],
                                        })(<InputNumber style={{ width: 100 }} min={0} disabled={disabled}
                                            onChange={(value) => this.setMetroLateFun({ propertyValue: value }, 'start_5-10')}
                                        />)}
                                    </Item>
                                </Col>
                                <Col span={6}>
                                    <Item label='5-10分钟终到晚点列次' {...formItemLayout}>
                                        {getFieldDecorator('endingLateColumn_5_10', {
                                            initialValue: record.endingLateColumn_5_10,
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '不能为空',
                                                },
                                                {
                                                    validator: this.checkEnd_51
                                                }
                                            ],
                                        })(<InputNumber style={{ width: 100 }} min={0} disabled={disabled}
                                            onChange={(value) => this.setMetroLateFun({ propertyValue: value }, 'end_5-10')}
                                        />)}
                                    </Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={6}>
                                    <Item label='10-15分钟终到早点列次' {...formItemLayout}>
                                        {getFieldDecorator('startingLateColumn_10_15', {
                                            initialValue: record.startingLateColumn_10_15,
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '不能为空',
                                                },
                                                {
                                                    validator: this.checkStart_15
                                                }
                                            ],
                                        })(<InputNumber style={{ width: 100 }} min={0} disabled={disabled}
                                            onChange={(value) => this.setMetroLateFun({ propertyValue: value }, 'start_10-15')}
                                        />)}
                                    </Item>
                                </Col>
                                <Col span={6}>
                                    <Item label='10-15分钟终到晚点列次' {...formItemLayout}>
                                        {getFieldDecorator('endingLateColumn_10_15', {
                                            initialValue: record.endingLateColumn_10_15,
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '不能为空',
                                                },
                                                {
                                                    validator: this.checkEnd_15
                                                }
                                            ],
                                        })(<InputNumber style={{ width: 100 }} min={0} disabled={disabled}
                                            onChange={(value) => this.setMetroLateFun({ propertyValue: value }, 'end_10-15')}
                                        />)}
                                    </Item>
                                </Col>
                                <Col span={6}>
                                    <Item label='15分钟以上终到早点列次' {...formItemLayout}>
                                        {getFieldDecorator('startingLateColumn_15', {
                                            initialValue: record.startingLateColumn_15,
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '不能为空',
                                                },
                                                {
                                                    validator: this.checkStart_5
                                                }
                                            ],
                                        })(<InputNumber style={{ width: 100 }} min={0} disabled={disabled}
                                            onChange={(value) => this.setMetroLateFun({ propertyValue: value }, 'start_15')}
                                        />)}
                                    </Item>
                                </Col>
                                <Col span={6}>
                                    <Item label='15分钟以上终到晚点列次' {...formItemLayout}>
                                        {getFieldDecorator('endingLateColumn_15', {
                                            initialValue: record.endingLateColumn_15,
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '不能为空',
                                                },
                                                {
                                                    validator: this.checkEnd_5
                                                }
                                            ],
                                        })(<InputNumber style={{ width: 100 }} min={0} disabled={disabled}
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
                                            initialValue: record.columnJk,
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '不能为空',
                                                },
                                                {
                                                    validator: this.checkColumnJk
                                                }
                                            ],
                                        })(<InputNumber disabled style={{ width: '100%' }} min={0} />)}
                                    </Item>
                                </Col>
                                <Col span={6}>
                                    <Item label='抽线（列）' {...formItemLayout}>
                                        {getFieldDecorator('columnCx', {
                                            initialValue: record.columnCx,
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
                                            initialValue: record.columnXx,
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '不能为空',
                                                },
                                                {
                                                    validator: this.checkColumnXx
                                                }
                                            ],
                                        })(<InputNumber disabled={disabled} style={{ width: '100%' }} min={0} />)}
                                    </Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={6}>
                                    <Item label='清客（故障）' {...formItemLayout}>
                                        {getFieldDecorator('columnQk', {
                                            initialValue: record.columnQk,
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '不能为空',
                                                },
                                                {
                                                    validator: this.checkColumnQk
                                                }
                                            ],
                                        })(<InputNumber disabled={disabled} style={{ width: '100%' }} min={0} />)}
                                    </Item>
                                </Col>
                                <Col span={6}>
                                    <Item label='清客（运营调整）' {...formItemLayout}>
                                        {getFieldDecorator('columnYy', {
                                            initialValue: record.columnYy,
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '不能为空',
                                                },
                                                {
                                                    validator: this.checkColumnYy
                                                }
                                            ],
                                        })(<InputNumber disabled={disabled} style={{ width: '100%' }} min={0} />)}
                                    </Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={6}>
                                    <Item label='救援（列）' {...formItemLayout}>
                                        {getFieldDecorator('columnJy', {
                                            initialValue: record.columnJy,
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '不能为空',
                                                },
                                                {
                                                    validator: this.checkColumnJy
                                                }
                                            ],
                                        })(<InputNumber disabled={disabled} style={{ width: '100%' }} min={0} />)}
                                    </Item>
                                </Col>
                                <Col span={6}>
                                    <Item label='跳停（列）' {...formItemLayout}>
                                        {getFieldDecorator('columnTt', {
                                            initialValue: record.columnTt,
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '不能为空',
                                                },
                                                {
                                                    validator: this.checkColumnTt
                                                }
                                            ],
                                        })(<InputNumber disabled={disabled} style={{ width: '100%' }} min={0} />)}
                                    </Item>
                                </Col>
                            </Row>
                            <Divider orientation="left" id='tongji' style={{ fontWeight: 'bold' }}>列车运行统计</Divider>
                            <Row>
                                <Col span={6}>
                                    <Item label='兑现率' {...formItemLayout}>
                                        {getFieldDecorator('fulfillmentRate', {
                                            initialValue: record.fulfillmentRate,
                                            rules: [],
                                        })(
                                            <Input disabled style={{ width: '100%' }} suffix="%" />
                                        )}
                                    </Item>
                                </Col>
                                <Col span={6}>
                                    <Item label='准点率' {...formItemLayout}>
                                        {getFieldDecorator('onTimeRate', {
                                            initialValue: record.onTimeRate,
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
                                            initialValue: record.arriveEarlyColumn,
                                            rules: [],
                                        })(
                                            <InputNumber min={0} disabled style={{ width: '100%' }} />
                                        )}
                                    </Item>
                                </Col>
                                <Col span={6}>
                                    <Item label='终到准点（列）' {...formItemLayout}>
                                        {getFieldDecorator('arriveOntimeColumn', {
                                            initialValue: record.arriveOntimeColumn,
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
                                            initialValue: record.arriveLateColumn,
                                            rules: [],
                                        })(
                                            <InputNumber min={0} disabled style={{ width: '100%' }} />
                                        )}
                                    </Item>
                                </Col>
                            </Row>

                            {/* <Divider orientation="left" id='invoice' style={{ fontWeight: 'bold' }}>列车运行里程</Divider> */}

                            <Divider orientation="left" id='change' style={{ fontWeight: 'bold' }}>列车使用情况</Divider>
                            <Row>
                                <Col span={8}>
                                    <Item label='运用车' {...formItemLayout2}>
                                        {getFieldDecorator('useCar', {
                                            initialValue: record.useCar,
                                        })(
                                            <Input title={this.state.useCar} disabled style={{ width: '100%' }} addonAfter={<a disabled={disabled} onClick={this.showMetroFun.bind(this, '0')}>选择</a>} />
                                        )}
                                    </Item>
                                </Col>
                                <Col span={8}>
                                    <Item label='备用车' {...formItemLayout2}>
                                        {getFieldDecorator('spareCar', {
                                            initialValue: record.spareCar,
                                        })(
                                            <Input title={this.state.spareCar} disabled style={{ width: '100%' }} addonAfter={<a disabled={disabled} onClick={this.showMetroFun.bind(this, '1')}>选择</a>} />
                                        )}
                                    </Item>
                                </Col>
                                <Col span={8}>
                                    <Item label='调试车' {...formItemLayout2}>
                                        {getFieldDecorator('debugCar', {
                                            initialValue: record.debugCar,
                                        })(
                                            <Input title={this.state.debugCar} disabled style={{ width: '100%' }} addonAfter={<a disabled={disabled} onClick={this.showMetroFun.bind(this, '2')}>选择</a>} />
                                        )}
                                    </Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={8}>
                                    <Item label='检修车' {...formItemLayout2}>
                                        {getFieldDecorator('inspectionCar', {
                                            initialValue: record.inspectionCar,
                                        })(
                                            <Input title={this.state.inspectionCar} disabled style={{ width: '100%' }} addonAfter={<a disabled={disabled} onClick={this.showMetroFun.bind(this, '3')}>选择</a>} />
                                        )}
                                    </Item>
                                </Col>
                                <Col span={8}>
                                    <Item label='备注' {...formItemLayout2}>
                                        {getFieldDecorator('other', {
                                            initialValue: record.other,
                                            rules: [
                                                {
                                                    validator: this.checkOther
                                                }
                                            ],
                                        })(
                                            <Input.TextArea disabled={disabled} style={{ width: '100%' }} />
                                        )}
                                    </Item>
                                </Col>
                            </Row>
                        </div>
                        {/* </Modal> */}
                    </Form>
                    {this.state.showDataEntryModal && <DataEntryUpdateModal
                        modalVisible={this.state.showDataEntryModal}
                        line={this.state.line}
                        handleCancel={this.dataEntryClose}
                        dataEntrySuccess={this.dataEntrySuccess}
                        trainDailyPassageMileVo={this.state.trainDailyPassageMileVo}    //非正常行驶数据统计
                        trainDailyUpSchedule={this.state.trainDailyUpSchedule}    //上行录入数据
                        trainDailyDownSchedule={this.state.trainDailyDownSchedule}  //下行录入数据
                    />}
                    {showEditInfoModal && <EditLogModal record={record} handleCancel={this.editInfoFun} modalVisible={showEditInfoModal} />}
                    {showMetroModal && <MetroModal
                        checkList={this.state.checkList}
                        addSuccess={this.addSuccess}
                        handleCancel={this.handleCancel}
                        modalVisible={showMetroModal}
                        line={this.state.line}
                        lineChoose={this.state.lineChoose} />}
                </div>
            </LabelFormLayout>
        )
    }
}
const AddModals = Form.create()(AddModal);
export default connect(state => ({
    currentLocale: state.localeProviderData,
}))(AddModals);