import React, { Component, Fragment } from 'react';
import { Form, Table, Row, Col, Input, Button, DatePicker, TreeSelect, Select, TimePicker, Divider, InputNumber, Tooltip, Icon } from 'antd';
import { checkAddScheduleCode, trainScheduleAdd, queryStationListByParam, queryStationToStationMileage } from '@/modules/Suzhou/api/suzhou-api';
import { getBaseData } from '@/modules/Suzhou/components/Util/util';
import moment from 'moment'
import axios from '@/api/axios';
import style from './style.less';
import * as dataUtil from "@/utils/dataUtil";
import LabelFormLayout from "@/components/public/Layout/Labels/Form/LabelFormLayout"

const { Item } = Form;
const { TextArea } = Input;
const { Option } = Select
const { SHOW_PARENT } = TreeSelect;
const { RangePicker } = DatePicker
class AddTimeTable1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //当日计划
      dataSource: [{
        id: 1, lineName: '当日计划', trainListNumber: '', passengerMiles: '', emptyMiles: '', allLinePassenageMiles: '', allLineEmptyMiles: '', newLinePassenageMiles: '', newLineEmptyMiles: '',
      }],
      //上行线路
      dataTop1: [{
        id: 2, lineType: 0, typeCode: 'top1', edit: false, rowType: 'title', typeName: '上行完整载客', period: '', startStation: '',
        endStation: '', inStation: '', coloumns: 0, remark: '', mileage: 0, newLineStationMileage: 0, oldLineStationMileage: 0
      }],//lineType:线路类型0：上行，1：下行，type:数据行类型，edit:是否有操作列，rowType:为‘title’时有新增、其他为删除
      dataTop2: [{
        id: 3, lineType: 0, typeCode: 'top2', edit: true, rowType: 'title', typeName: '上行中途载客', period: '', startStation: '', relatinNumber: 0,
        endStation: '', inStation: '', coloumns: 0, remark: '', mileage: 0, newLineStationMileage: 0, oldLineStationMileage: 0
      }],
      dataTop3: [{
        id: 4, lineType: 0, typeCode: 'top3', edit: false, rowType: 'title', typeName: '上行完整载客前空驶', period: '', startStation: '',
        endStation: '', inStation: '', coloumns: 0, remark: '', mileage: 0, newLineStationMileage: 0, oldLineStationMileage: 0
      }],
      dataTop4: [{
        id: 5, lineType: 0, typeCode: 'top4', edit: false, rowType: 'title', typeName: '上行中途载客前空驶', period: '', startStation: '', relatinNumber: 0,
        endStation: '', inStation: '', coloumns: 0, remark: '', mileage: 0, newLineStationMileage: 0, oldLineStationMileage: 0
      }],
      dataTop5: [{
        id: 6, lineType: 0, typeCode: 'top5', edit: false, rowType: 'title', typeName: '上行出段完整空驶', period: '', startStation: '',
        endStation: '', inStation: '', coloumns: 0, remark: '', mileage: 0, newLineStationMileage: 0, oldLineStationMileage: 0
      }],
      dataTop6: [{
        id: 7, lineType: 0, typeCode: 'top6', edit: true, rowType: 'title', typeName: '上行完整空驶', period: '', startStation: '',
        endStation: '', inStation: '', coloumns: 0, remark: '', mileage: 0, newLineStationMileage: 0, oldLineStationMileage: 0
      }],
      //下行线路
      dataDown1: [{
        id: 8, lineType: 1, typeCode: 'down1', edit: false, rowType: 'title', typeName: '下行完整载客', period: '', startStation: '',
        endStation: '', inStation: '', coloumns: 0, remark: '', mileage: 0, newLineStationMileage: 0, oldLineStationMileage: 0
      }],
      dataDown2: [{
        id: 9, lineType: 1, typeCode: 'down2', edit: true, rowType: 'title', typeName: '下行中途载客', period: '', startStation: '', relatinNumber: 1,
        endStation: '', inStation: '', coloumns: 0, remark: '', mileage: 0, newLineStationMileage: 0, oldLineStationMileage: 0
      }],
      dataDown3: [{
        id: 10, lineType: 1, typeCode: 'down3', edit: false, rowType: 'title', typeName: '下行完整载客后空驶', period: '', startStation: '',
        endStation: '', inStation: '', coloumns: 0, remark: '', mileage: 0, newLineStationMileage: 0, oldLineStationMileage: 0
      }],
      dataDown4: [{
        id: 11, lineType: 1, typeCode: 'down4', edit: false, rowType: 'title', typeName: '下行中途载客前空驶', period: '', startStation: '', relatinNumber: 1,
        endStation: '', inStation: '', coloumns: 0, remark: '', mileage: 0, newLineStationMileage: 0, oldLineStationMileage: 0
      }],
      dataDown5: [{
        id: 12, lineType: 1, typeCode: 'down5', edit: true, rowType: 'title', typeName: '下行出段未载客', period: '', startStation: '',
        endStation: '', inStation: '', coloumns: 0, remark: '', mileage: 0, newLineStationMileage: 0, oldLineStationMileage: 0
      }],
      dataDown6: [{
        id: 13, lineType: 1, typeCode: 'down6', edit: true, rowType: 'title', typeName: '下行回段空驶', period: '', startStation: '',
        endStation: '', inStation: '', coloumns: 0, remark: '', mileage: 0, newLineStationMileage: 0, oldLineStationMileage: 0
      }],
      lineArr: [],  //线路表
      startStation: [], //始发站
      endStation: [], //终点站
      mainStationList: [], //正线候选值
      mainStationListReverse: [], //正线候选值倒序
      disabled: false,
      idTemp: 13,
      relatinNumber: 1,
      supStation: [],  //辅助站点
      disChuduan: ['top3', 'top4', 'top5', 'top6', 'down4', 'down5'], //出段需要录入的类型
      disStart: ['top2', 'top5', 'down2', 'down4', 'down5', 'down6'],  //始发站需要录入的类型
      disEnd: ['top2', 'top4', 'down2', 'down4', 'down5', 'down6'],  //终点站需要录入的类型
      disRuduan: ['down3', 'down4', 'down5', 'down6'],//入段需要录入的类型
      disDesc: ['top3', 'top4', 'down3', 'down4'],//列数,备注不需要录入的类型
      disStartCheck: ['top3', 'top4', 'top5', 'top6','down4', 'down5'], //正线起始站不需要校验的类型
      isOk:false, //保存按钮是否置灰
    }
  }

  componentDidMount() {
    const { record, type } = this.props
    getBaseData('line').then(data => { this.setState({ lineArr: data },()=>{
      this.props.form.setFieldsValue({
        line:'1'
      })
      this.selectOnChange(1)
    }) })
    if (type == 'info') {
      this.selectOnChange(record.line.code)
    }
  }
  //获取点击行数据
  getInfo = (record) => {
    const { id } = record;
    this.setState({
      activeIndex: id,
      record: record,
    });
  }
  //如果是修改页面根据已选择线路获取站点
  selectOnChange = (value) => {
    getBaseData(`line${value}.station`).then(data => {
      this.setState(
        {
          line: value,
          startStation: data,
          endStation: data
        }, () => {
          this.getStationFun(this.state.line, '1,2', '', '', (res) => { //获取全部辅助线
            this.setState({
              supStation: res
            })
          })
          this.getStationFun(this.state.line, '0', '', '', (res) => { //获取全部正线
            this.setState({
              mainStationList: [...res],
              mainStationListReverse: [...res.reverse()]
            })
          })
        })
    })
  }
  //获取站点
  getStationFun = (line, stationType, stationCode, startStationCode, callBack) => {
    axios.get(queryStationListByParam + `?line=${line}&stationType=${stationType}&stationCode=${stationCode}&startStationCode=${startStationCode}`).then(res => {
      const data = res.data.data ? res.data.data : []
      callBack(data)
    })
  }
  //获取里程
  getMileageFun = (period, startStation, endStation, inStation, stationDirection, callBack) => {
    axios.get(queryStationToStationMileage + `?line=${this.state.line}&period=${period}&startStation=${startStation}&endStation=${endStation}&inStation=${inStation}&stationDirection=${stationDirection}`).then(res => {
      callBack(res.data.data)
    })
  }
  //始发站校验
  checkstartStation = (rule, value, callBack) => {
    if (this.props.form.getFieldValue('endStation') == value) {
      callBack('始发站点不能与终点站点相同')
    } else {
      callBack()
    }
  }
  //终点站校验
  checkendStation = (rule, value, callBack) => {
    if (this.props.form.getFieldValue('startStation') == value) {
      callBack('终点站点不能与始发站点相同')
    } else {
      callBack()
    }
  }
  //校验名称是否存在
  checkAddScheduleCode = (rule, value, callBack) => {
    if (value) {
      axios.get(checkAddScheduleCode + `?scheduleCode=${value}`).then(res => {
        const isCheckCode = res.data.data
        if (isCheckCode == 'true') {
          callBack('时刻表已存在')
        } else {
          callBack()
        }
      })
    } else {
      callBack()
    }
  }
  //校验最大上线列
  checkOnlineTrain = (rule, value, callBack) => {
    if (value) {
      const plannedOperationColumn = this.props.form.getFieldValue('plannedOperationColumn')
      if (plannedOperationColumn != null && (value > plannedOperationColumn)) {
        callBack('最大上线列不能大于计划列')
      } else {
        callBack()
      }
    } else {
      callBack()
    }
  }
  //校验计划列
  checkPlanTrain = (rule, value, callBack) => {
    if (value) {
      const maxOnlineTrain = this.props.form.getFieldValue('maxOnlineTrain')
      if (maxOnlineTrain != null && (value < maxOnlineTrain)) {
        callBack('计划列不能小于最大上线列')
      } else {
        callBack()
      }
    } else {
      callBack()
    }
  }
  //新增一行
  addFun = (record) => {
    let { idTemp, relatinNumber } = this.state
    switch (record.typeCode) {
      case 'top2':
        let { dataTop2, dataTop4 } = this.state
        idTemp++
        relatinNumber++
        dataTop2.push({
          id: idTemp, lineType: 0, typeCode: 'top2', edit: true, rowType: '', typeName: '', period: '', startStation: '', relatinNumber,
          endStation: '', inStation: '', coloumns: 0, remark: '', mileage: 0, newLineStationMileage: 0, oldLineStationMileage: 0
        })
        idTemp++
        dataTop4.push({
          id: idTemp, lineType: 0, typeCode: 'top4', edit: false, rowType: '', typeName: '', period: '', startStation: '', relatinNumber,
          endStation: '', inStation: '', coloumns: 0, remark: '', mileage: 0, newLineStationMileage: 0, oldLineStationMileage: 0
        })
        this.setState({ dataTop2, dataTop4, idTemp })
        break
      case 'top6':
        let { dataTop6 } = this.state
        idTemp++
        dataTop6.push({
          id: idTemp, lineType: 0, typeCode: 'top6', edit: true, rowType: '', typeName: '', period: '', startStation: '',
          endStation: '', inStation: '', coloumns: 0, remark: '', mileage: 0, newLineStationMileage: 0, oldLineStationMileage: 0
        })
        this.setState({ dataTop6, idTemp })
        break
      case 'down2':
        let { dataDown2, dataDown4 } = this.state
        idTemp++
        relatinNumber++
        dataDown2.push({
          id: idTemp, lineType: 1, typeCode: 'down2', edit: true, rowType: '', typeName: '', period: '', startStation: '', relatinNumber,
          endStation: '', inStation: '', coloumns: 0, remark: '', mileage: 0, newLineStationMileage: 0, oldLineStationMileage: 0
        })
        idTemp++
        dataDown4.push({
          id: idTemp, lineType: 1, typeCode: 'down4', edit: false, rowType: '', typeName: '', period: '', startStation: '', relatinNumber,
          endStation: '', inStation: '', coloumns: 0, remark: '', mileage: 0, newLineStationMileage: 0, oldLineStationMileage: 0
        })
        this.setState({ dataDown2, dataDown4, idTemp })
        break
      case 'down5':
        let { dataDown5 } = this.state
        idTemp++
        dataDown5.push({
          id: idTemp, lineType: 1, typeCode: 'down5', edit: true, rowType: '', typeName: '', period: '', startStation: '',
          endStation: '', inStation: '', coloumns: 0, remark: '', mileage: 0, newLineStationMileage: 0, oldLineStationMileage: 0
        })
        this.setState({ dataDown5, idTemp })
        break
      case 'down6':
        let { dataDown6 } = this.state
        idTemp++
        dataDown6.push({
          id: idTemp, lineType: 1, typeCode: 'down6', edit: true, rowType: '', typeName: '', period: '', startStation: '',
          endStation: '', inStation: '', coloumns: 0, remark: '', mileage: 0, newLineStationMileage: 0, oldLineStationMileage: 0
        })
        this.setState({ dataDown6, idTemp })
        break
      default:
        break
    }
  }
  // 删除一行
  deleteFun = (record) => {
    switch (record.typeCode) {
      case 'top2':
        let { dataTop2, dataTop4 } = this.state
        const indexTop2 = dataTop2.findIndex(item => record.id == item.id)
        dataTop2.splice(indexTop2, 1)
        dataTop4.splice(indexTop2, 1)
        this.setState({ dataTop2, dataTop4 })
        break
      case 'top6':
        let { dataTop6 } = this.state
        dataTop6.splice(dataTop6.findIndex(item => record.id == item.id), 1)
        this.setState({ dataTop6 })
        break
      case 'down2':
        let { dataDown2, dataDown4 } = this.state
        const indexDown2 = dataDown2.findIndex(item => record.id == item.id)
        dataDown2.splice(indexDown2, 1)
        dataDown4.splice(indexDown2, 1)
        this.setState({ dataDown2, dataDown4 })
        break
      case 'down5':
        let { dataDown5 } = this.state
        dataDown5.splice(dataDown5.findIndex(item => record.id == item.id), 1)
        this.setState({ dataDown5 })
        break
      case 'down6':
        let { dataDown6 } = this.state
        dataDown6.splice(dataDown6.findIndex(item => record.id == item.id), 1)
        this.setState({ dataDown6 })
        break
      default:
        break
    }
  }
  //设置当日计划
  setTodayPlanFun = () => {
    const { dataSource, dataTop1, dataTop2, dataTop3, dataTop4, dataTop5, dataTop6, dataDown1, dataDown2, dataDown3, dataDown4, dataDown5, dataDown6 } = this.state
    let trainListNumber = 0,
      passengerMiles = 0,
      emptyMiles = 0,
      allLinePassenageMiles = 0,
      allLineEmptyMiles = 0,
      newLinePassenageMiles = 0,
      newLineEmptyMiles = 0
    dataTop1.map(item => { passengerMiles += Number(item.mileage) ; allLinePassenageMiles += item.oldLineStationMileage * Number(item.coloumns); newLinePassenageMiles += item.newLineStationMileage * Number(item.coloumns) })
    dataTop2.map(item => { passengerMiles += Number(item.mileage) ; allLinePassenageMiles += item.oldLineStationMileage * Number(item.coloumns); newLinePassenageMiles += item.newLineStationMileage * Number(item.coloumns) })
    dataTop3.map(item => { trainListNumber += Number(item.coloumns); emptyMiles += Number(item.mileage) ; allLineEmptyMiles += item.oldLineStationMileage * Number(item.coloumns); newLineEmptyMiles += item.newLineStationMileage * Number(item.coloumns) })
    dataTop4.map(item => { trainListNumber += Number(item.coloumns); emptyMiles += Number(item.mileage) ; allLineEmptyMiles += item.oldLineStationMileage * Number(item.coloumns); newLineEmptyMiles += item.newLineStationMileage * Number(item.coloumns) })
    dataTop5.map(item => { trainListNumber += Number(item.coloumns); emptyMiles += Number(item.mileage) ; allLineEmptyMiles += item.oldLineStationMileage * Number(item.coloumns); newLineEmptyMiles += item.newLineStationMileage * Number(item.coloumns) })
    dataTop6.map(item => { trainListNumber += Number(item.coloumns); emptyMiles += Number(item.mileage) ; allLineEmptyMiles += item.oldLineStationMileage * Number(item.coloumns); newLineEmptyMiles += item.newLineStationMileage * Number(item.coloumns) })
    dataDown1.map(item => { passengerMiles += Number(item.mileage) ; allLinePassenageMiles += item.oldLineStationMileage * Number(item.coloumns); newLinePassenageMiles += item.newLineStationMileage * Number(item.coloumns) })
    dataDown2.map(item => { passengerMiles += Number(item.mileage) ; allLinePassenageMiles += item.oldLineStationMileage * Number(item.coloumns); newLinePassenageMiles += item.newLineStationMileage * Number(item.coloumns) })
    dataDown3.map(item => { trainListNumber += Number(item.coloumns); emptyMiles += Number(item.mileage) ; allLineEmptyMiles += item.oldLineStationMileage * Number(item.coloumns); newLineEmptyMiles += item.newLineStationMileage * Number(item.coloumns) })
    dataDown4.map(item => { trainListNumber += Number(item.coloumns); emptyMiles += Number(item.mileage) ; allLineEmptyMiles += item.oldLineStationMileage * Number(item.coloumns); newLineEmptyMiles += item.newLineStationMileage * Number(item.coloumns) })
    dataDown5.map(item => { trainListNumber += Number(item.coloumns); emptyMiles += Number(item.mileage) ; allLineEmptyMiles += item.oldLineStationMileage * Number(item.coloumns); newLineEmptyMiles += item.newLineStationMileage * Number(item.coloumns) })
    dataDown6.map(item => { trainListNumber += Number(item.coloumns); emptyMiles += Number(item.mileage) ; allLineEmptyMiles += item.oldLineStationMileage * Number(item.coloumns); newLineEmptyMiles += item.newLineStationMileage * Number(item.coloumns) })
    this.setState({
      dataSource: [{
        ...dataSource[0],
        trainListNumber,
        passengerMiles: passengerMiles.toFixed(3),
        emptyMiles: emptyMiles.toFixed(3),
        allLinePassenageMiles: allLinePassenageMiles.toFixed(3),
        allLineEmptyMiles: allLineEmptyMiles.toFixed(3),
        newLinePassenageMiles: newLinePassenageMiles.toFixed(3),
        newLineEmptyMiles: newLineEmptyMiles.toFixed(3)
      }]
    })
  }
  //数据录入
  selectLines = (value, record, dataType) => {
    let { dataTop3, dataTop4, dataDown3, dataDown4 } = this.state
    if(value == undefined){
      value = ''
    }
    switch (record.typeCode) {
      case 'top1':
        let { dataTop1 } = this.state
        const indexTop1 = dataTop1.findIndex(item => record.id == item.id)
        if (dataType == 'Chuduan') {
          dataTop1[indexTop1].period = value
        } else if (dataType == 'StartStation') {
          dataTop1[indexTop1].startStation = value
        } else if (dataType == 'EndStation') {
          dataTop1[indexTop1].endStation = value
        } else if (dataType == 'Ruduan') {
          dataTop1[indexTop1].inStation = value
        } else if (dataType == 'Lines') {
          this.getMileageFun(record.period, record.startStation, record.endStation, record.inStation, '0', (data) => {
            dataTop1[indexTop1].mileage = (data.stationMileage * value).toFixed(3)
            dataTop1[indexTop1].newLineStationMileage = data.newLineStationMileage
            dataTop1[indexTop1].oldLineStationMileage = data.oldLineStationMileage
          })
          dataTop1[indexTop1].coloumns = value
          dataTop3[indexTop1].coloumns = value
        } else if (dataType == 'Desc') {
          dataTop1[indexTop1].remark = value
          dataTop3[indexTop1].remark = value
        }
        this.setState({ dataTop1, dataTop3 }, () => { this.setTodayPlanFun() })
        break
      case 'top2':
        let { dataTop2 } = this.state
        const indexTop2 = dataTop2.findIndex(item => record.id == item.id)
        if (dataType == 'Chuduan') {
          dataTop2[indexTop2].period = value
        } else if (dataType == 'StartStation') {
          dataTop2[indexTop2].startStation = value
        } else if (dataType == 'EndStation') {
          dataTop2[indexTop2].endStation = value
        } else if (dataType == 'Ruduan') {
          dataTop2[indexTop2].inStation = value
        } else if (dataType == 'Lines') {
          this.getMileageFun(record.period, record.startStation, record.endStation, record.inStation, '0', (data) => {
            dataTop2[indexTop2].mileage = (data.stationMileage * value).toFixed(3)
            dataTop2[indexTop2].newLineStationMileage = data.newLineStationMileage
            dataTop2[indexTop2].oldLineStationMileage = data.oldLineStationMileage
          })
          dataTop2[indexTop2].coloumns = value
          dataTop4[indexTop2].coloumns = value
        } else if (dataType == 'Desc') {
          dataTop2[indexTop2].remark = value
          dataTop4[indexTop2].remark = value
        }
        this.setState({ dataTop2, dataTop4 }, () => { this.setTodayPlanFun() })
        break
      case 'top3':
        const indexTop3 = dataTop3.findIndex(item => record.id == item.id)
        if (dataType == 'Chuduan') {
          dataTop3[indexTop3].period = value
        } else if (dataType == 'StartStation') {
          this.getMileageFun(record.period, value, record.endStation, record.inStation, '0', (data) => {
            dataTop3[indexTop3].mileage = (data.stationMileage * Number(record.coloumns)).toFixed(3)
            dataTop3[indexTop3].newLineStationMileage = data.newLineStationMileage
            dataTop3[indexTop3].oldLineStationMileage = data.oldLineStationMileage
          })
          dataTop3[indexTop3].startStation = value
        } else if (dataType == 'EndStation') {
          dataTop3[indexTop3].endStation = value
        } else if (dataType == 'Ruduan') {
          dataTop3[indexTop3].inStation = value
        } else if (dataType == 'Lines') {
          dataTop3[indexTop3].coloumns = value
        } else if (dataType == 'Desc') {
          dataTop3[indexTop3].remark = value
        }
        this.setState({ dataTop3 }, () => { this.setTodayPlanFun() })
        break
      case 'top4':
        const indexTop4 = dataTop4.findIndex(item => record.id == item.id)
        if (dataType == 'Chuduan') {
          dataTop4[indexTop4].period = value
        } else if (dataType == 'StartStation') {
          dataTop4[indexTop4].startStation = value
        } else if (dataType == 'EndStation') {
          this.getMileageFun(record.period, record.startStation, value, record.inStation, '0', (data) => {
            dataTop4[indexTop4].mileage = (data.stationMileage * Number(record.coloumns)).toFixed(3)
            dataTop4[indexTop4].newLineStationMileage = data.newLineStationMileage
            dataTop4[indexTop4].oldLineStationMileage = data.oldLineStationMileage
          })
          dataTop4[indexTop4].endStation = value
        } else if (dataType == 'Ruduan') {
          dataTop4[indexTop4].inStation = value
        } else if (dataType == 'Lines') {
          dataTop4[indexTop4].coloumns = value
        } else if (dataType == 'Desc') {
          dataTop4[indexTop4].remark = value
        }
        this.setState({ dataTop4 }, () => { this.setTodayPlanFun() })
        break
      case 'top5':
        let { dataTop5 } = this.state
        const indexTop5 = dataTop5.findIndex(item => record.id == item.id)
        if (dataType == 'Chuduan') {
          dataTop5[indexTop5].period = value
        } else if (dataType == 'StartStation') {
          dataTop5[indexTop5].startStation = value
        } else if (dataType == 'EndStation') {
          dataTop5[indexTop5].endStation = value
        } else if (dataType == 'Ruduan') {
          dataTop5[indexTop5].inStation = value
        } else if (dataType == 'Lines') {
          this.getMileageFun(record.period, record.startStation, record.endStation, record.inStation, '0', (data) => {
            dataTop5[indexTop5].mileage = (data.stationMileage * value).toFixed(3)
            dataTop5[indexTop5].newLineStationMileage = data.newLineStationMileage
            dataTop5[indexTop5].oldLineStationMileage = data.oldLineStationMileage
          })
          dataTop5[indexTop5].coloumns = value
        } else if (dataType == 'Desc') {
          dataTop5[indexTop5].remark = value
        }
        this.setState({ dataTop5 }, () => { this.setTodayPlanFun() })
        break
      case 'top6':
        let { dataTop6 } = this.state
        const indexTop6 = dataTop6.findIndex(item => record.id == item.id)
        if (dataType == 'Chuduan') {
          dataTop6[indexTop6].period = value
        } else if (dataType == 'StartStation') {
          dataTop6[indexTop6].startStation = value
        } else if (dataType == 'EndStation') {
          dataTop6[indexTop6].endStation = value
        } else if (dataType == 'Ruduan') {
          dataTop6[indexTop6].inStation = value
        } else if (dataType == 'Lines') {
          this.getMileageFun(record.period, record.startStation, record.endStation, record.inStation, '0', (data) => {
            dataTop6[indexTop6].mileage = (data.stationMileage * value).toFixed(3)
            dataTop6[indexTop6].newLineStationMileage = data.newLineStationMileage
            dataTop6[indexTop6].oldLineStationMileage = data.oldLineStationMileage
          })
          dataTop6[indexTop6].coloumns = value
        } else if (dataType == 'Desc') {
          dataTop6[indexTop6].remark = value
        }
        this.setState({ dataTop6 }, () => { this.setTodayPlanFun() })
        break
      case 'down1':
        let { dataDown1 } = this.state
        const indexdown1 = dataDown1.findIndex(item => record.id == item.id)
        if (dataType == 'Chuduan') {
          dataDown1[indexdown1].period = value
        } else if (dataType == 'StartStation') {
          dataDown1[indexdown1].startStation = value
        } else if (dataType == 'EndStation') {
          dataDown1[indexdown1].endStation = value
        } else if (dataType == 'Ruduan') {
          dataDown1[indexdown1].inStation = value
        } else if (dataType == 'Lines') {
          this.getMileageFun(record.period, record.startStation, record.endStation, record.inStation, '1', (data) => {
            dataDown1[indexdown1].mileage = (data.stationMileage * value).toFixed(3)
            dataDown1[indexdown1].newLineStationMileage = data.newLineStationMileage
            dataDown1[indexdown1].oldLineStationMileage = data.oldLineStationMileage
          })
          dataDown1[indexdown1].coloumns = value
          dataDown3[indexdown1].coloumns = value
        } else if (dataType == 'Desc') {
          dataDown1[indexdown1].remark = value
          dataDown3[indexdown1].remark = value
        }
        this.setState({ dataDown1, dataDown3 }, () => { this.setTodayPlanFun() })
        break
      case 'down2':
        let { dataDown2 } = this.state
        const indexdown2 = dataDown2.findIndex(item => record.id == item.id)
        if (dataType == 'Chuduan') {
          dataDown2[indexdown2].period = value
        } else if (dataType == 'StartStation') {
          dataDown2[indexdown2].startStation = value
        } else if (dataType == 'EndStation') {
          dataDown2[indexdown2].endStation = value
        } else if (dataType == 'Ruduan') {
          dataDown2[indexdown2].inStation = value
        } else if (dataType == 'Lines') {
          this.getMileageFun(record.period, record.startStation, record.endStation, record.inStation, '1', (data) => {
            dataDown2[indexdown2].mileage = (data.stationMileage * value).toFixed(3)
            dataDown2[indexdown2].newLineStationMileage = data.newLineStationMileage
            dataDown2[indexdown2].oldLineStationMileage = data.oldLineStationMileage
          })
          dataDown2[indexdown2].coloumns = value
          dataDown4[indexdown2].coloumns = value
        } else if (dataType == 'Desc') {
          dataDown2[indexdown2].remark = value
          dataDown4[indexdown2].remark = value
        }
        this.setState({ dataDown2, dataDown4 }, () => { this.setTodayPlanFun() })
        break
      case 'down3':
        const indexDown3 = dataDown3.findIndex(item => record.id == item.id)
        if (dataType == 'Chuduan') {
          dataDown3[indexDown3].period = value
        } else if (dataType == 'StartStation') {
          dataDown3[indexDown3].startStation = value
        } else if (dataType == 'EndStation') {
          dataDown3[indexDown3].endStation = value
        } else if (dataType == 'Ruduan') {
          this.getMileageFun(record.period, record.startStation, record.endStation, value, '1', (data) => {
            dataDown3[indexDown3].mileage = (data.stationMileage * Number(record.coloumns)).toFixed(3)
            dataDown3[indexDown3].newLineStationMileage = data.newLineStationMileage
            dataDown3[indexDown3].oldLineStationMileage = data.oldLineStationMileage
          })
          dataDown3[indexDown3].inStation = value
        } else if (dataType == 'Lines') {
          dataDown3[indexDown3].coloumns = value
        } else if (dataType == 'Desc') {
          dataDown3[indexDown3].remark = value
        }
        this.setState({ dataDown3 }, () => { this.setTodayPlanFun() })
        break
      case 'down4':
        const indexDown4 = dataDown4.findIndex(item => record.id == item.id)
        if (dataType == 'Chuduan') {
          dataDown4[indexDown4].period = value
        } else if (dataType == 'StartStation') {
          dataDown4[indexDown4].startStation = value
        } else if (dataType == 'EndStation') {
          dataDown4[indexDown4].endStation = value
        } else if (dataType == 'Ruduan') {
          this.getMileageFun(record.period, record.startStation, record.endStation, value, '1', (data) => {
            dataDown4[indexDown4].mileage = (data.stationMileage * Number(record.coloumns)).toFixed(3)
            dataDown4[indexDown4].newLineStationMileage = data.newLineStationMileage
            dataDown4[indexDown4].oldLineStationMileage = data.oldLineStationMileage
          })
          dataDown4[indexDown4].inStation = value
        } else if (dataType == 'Lines') {
          dataDown4[indexDown4].coloumns = value
        } else if (dataType == 'Desc') {
          dataDown4[indexDown4].remark = value
        }
        this.setState({ dataDown4 }, () => { this.setTodayPlanFun() })
        break
      case 'down5':
        let { dataDown5 } = this.state
        const indexDown5 = dataDown5.findIndex(item => record.id == item.id)
        if (dataType == 'Chuduan') {
          dataDown5[indexDown5].period = value
        } else if (dataType == 'StartStation') {
          dataDown5[indexDown5].startStation = value
        } else if (dataType == 'EndStation') {
          dataDown5[indexDown5].endStation = value
        } else if (dataType == 'Ruduan') {
          dataDown5[indexDown5].inStation = value
        } else if (dataType == 'Lines') {
          this.getMileageFun(record.period, record.startStation, record.endStation, record.inStation, '1', (data) => {
            dataDown5[indexDown5].mileage = (data.stationMileage * value).toFixed(3)
            dataDown5[indexDown5].newLineStationMileage = data.newLineStationMileage
            dataDown5[indexDown5].oldLineStationMileage = data.oldLineStationMileage
          })
          dataDown5[indexDown5].coloumns = value
        } else if (dataType == 'Desc') {
          dataDown5[indexDown5].remark = value
        }
        this.setState({ dataDown5 }, () => { this.setTodayPlanFun() })
        break
      case 'down6':
        let { dataDown6 } = this.state
        const indexDown6 = dataDown6.findIndex(item => record.id == item.id)
        if (dataType == 'Chuduan') {
          dataDown6[indexDown6].period = value
        } else if (dataType == 'StartStation') {
          dataDown6[indexDown6].startStation = value
        } else if (dataType == 'EndStation') {
          dataDown6[indexDown6].endStation = value
        } else if (dataType == 'Ruduan') {
          dataDown6[indexDown6].inStation = value
        } else if (dataType == 'Lines') {
          this.getMileageFun(record.period, record.startStation, record.endStation, record.inStation, '1', (data) => {
            dataDown6[indexDown6].mileage = (data.stationMileage * value).toFixed(3)
            dataDown6[indexDown6].newLineStationMileage = data.newLineStationMileage
            dataDown6[indexDown6].oldLineStationMileage = data.oldLineStationMileage
          })
          dataDown6[indexDown6].coloumns = value
        } else if (dataType == 'Desc') {
          dataDown6[indexDown6].remark = value
        }
        this.setState({ dataDown6 }, () => { this.setTodayPlanFun() })
        break
      default:
        break
    }
  }
  //出段校验
  checkChuduan = (data, record) => {
    if (this.state.disStartCheck.indexOf(record.typeCode) > -1 && record.period) {
      this.getStationFun(this.state.line, '1,2', record.period, '', (res) => {
        const dataList = res ? res[0].stationFoundationRelation : []
        if (dataList.findIndex(item => data.value == item.stationCode) > -1) {
          data.callBack()
        } else {
          data.callBack('该站点与出段未关联！')
        }
      })
    } else {
      data.callBack()
    }
  }
  //入段校验
  checkRuduan = (data, record) => {
    if (record.typeCode !== 'down4') {
      this.getStationFun(this.state.line, '', '', record.endStation, (res) => {
        const dataList = res ? res : []
        if (dataList.findIndex(item => data.value == item.stationCode) > -1) {
          data.callBack()
        } else {
          data.callBack('该站点与入段未关联！')
        }
      })
    } else {
      data.callBack()
    }
  }
  //提交
  handleOk = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (err) {
      } else {
        this.setState({ disabled: true,isOk:true })
        const startDriveTime = moment(values.startDriveTime).format('HH:mm:ss')
        const endDriveTime = moment(values.endDriveTime).format('HH:mm:ss')
        const typeCode = `line${values.line}.station`
        let { dataSource, dataTop1, dataTop2, dataTop3, dataTop4, dataTop5, dataTop6,
          dataDown1, dataDown2, dataDown3, dataDown4, dataDown5, dataDown6 } = this.state
        let trainScheduleUpStationForm = [...dataTop1, ...dataTop2, ...dataTop3, ...dataTop4, ...dataTop5, ...dataTop6]
        let trainScheduleDownStationForm = [...dataDown1, ...dataDown2, ...dataDown3, ...dataDown4, ...dataDown5, ...dataDown6]
        const data = {
          line: values.line,
          scheduleCode: values.scheduleCode,
          maxOnlineTrain: values.maxOnlineTrain,
          minDrivingInterval: values.minDrivingInterval,
          standbyTrain: values.standbyTrain,
          plannedOperationColumn: values.plannedOperationColumn,
          startStation: values.startStation,
          endStation: values.endStation,
          startDriveTime,
          endDriveTime,
          typeCode,
          trainScheduleUpStationForm,
          trainScheduleDownStationForm,
          trainListNumber: dataSource[0].trainListNumber,
          passengerMiles: dataSource[0].passengerMiles,
          emptyMiles: dataSource[0].emptyMiles,
          allLinePassenageMiles: dataSource[0].allLinePassenageMiles,
          allLineEmptyMiles: dataSource[0].allLineEmptyMiles,
          newLinePassenageMiles: dataSource[0].newLinePassenageMiles,
          newLineEmptyMiles: dataSource[0].newLineEmptyMiles,
        }
        axios.post(trainScheduleAdd, data, true).then(res => {
          if (res.data.status === 200) {
            this.setState({ disabled: false })
            this.props.success(res.data.data);
            this.props.handleCancel()
          }
        });
      }
    })
  }
  //设置table的选中行class样式
  setClassName = (record, index) => {
    return record.id === this.state.activeIndex ? 'tableActivty' : '';
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    let { lineArr, startStation, endStation, dataSource,
      dataTop1, dataTop2, dataTop3, dataTop4, dataTop5, dataTop6,
      dataDown1, dataDown2, dataDown3, dataDown4, dataDown5, dataDown6 } = this.state
    const { mainStationList, mainStationListReverse } = this.state
    let dataSource1 = [...dataTop1, ...dataTop2, ...dataTop3, ...dataTop4, ...dataTop5, ...dataTop6]
    let dataSource2 = [...dataDown1, ...dataDown2, ...dataDown3, ...dataDown4, ...dataDown5, ...dataDown6]
    const { record, type } = this.props
    //table 1
    const columns = [
      {
        title: '',
        dataIndex: 'lineName',
      },
      {
        title: '列次数',
        dataIndex: 'trainListNumber',
      },
      {
        title: '载客里程',
        dataIndex: 'passengerMiles',
      },
      {
        title: '空驶里程',
        dataIndex: 'emptyMiles',
      },
      {
        title: '既有线载客里程',
        dataIndex: 'allLinePassenageMiles',
      },
      {
        title: '既有线空驶里程',
        dataIndex: 'allLineEmptyMiles',
      },
      {
        title: '新线载客里程',
        dataIndex: 'newLinePassenageMiles',
      },
      {
        title: '新线空驶里程',
        dataIndex: 'newLineEmptyMiles',
      },
    ]
    //table 2,3
    const columns1 = [
      {
        title: '类型',
        dataIndex: 'typeName',
        render: (text, record) => {
          return <span>{text ? text : ''}{(record.typeCode == 'top5' || record.typeCode == 'down6') &&
            record.rowType == 'title' && <Tooltip placement="top"
              title={record.typeCode == 'top5' ? '从车辆段出车，上行方向，行至终点站' : '按下行方向，车辆驶回车辆段'}>
              <Icon type="question-circle" style={{ marginLeft: 5 }} /></Tooltip>}</span>
        }
      },
      {
        title: '出段',
        dataIndex: 'period',
        render: (text, record) => {
          return <span>{this.state.disChuduan.indexOf(record.typeCode) > -1 ? <Item style={{ margin: 0 }}>
            {this.props.form.getFieldDecorator(`period${record.id}`, {
              initialValue: text ? text : '',
              rules: [

              ],
            })(<Select showSearch placeholder="请选择" disabled={false} allowClear
              style={{ width: 150 }}
              onChange={(value, option) => this.selectLines(value, record, 'Chuduan')} filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
              {this.state.supStation.map(item => {
                return <Option key={item.stationCode} stationtype={item.stationType} value={item.stationCode}>{item.stationName}</Option>
              })}
            </Select>)}
          </Item> : text}</span>
        }
      },
      {
        title: '正线起始站',
        dataIndex: 'startStation',
        render: (text, record) => {
          return <span>{record.typeCode !== 'down3' ? <Item style={{ margin: 0 }}>
            {this.props.form.getFieldDecorator(`astartStation${record.id}`, {
              initialValue: text ? text : '',
              rules: [
                {
                  validator: (rule, value, callBack) => { this.checkChuduan({ value, callBack }, record) }
                },
              ],
            })(<Select showSearch placeholder="请选择" disabled={false} allowClear
              style={{ width: 150 }}
              onChange={(value) => this.selectLines(value, record, 'StartStation')} filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
              {record.typeCode.indexOf('top') > -1 ? mainStationList.map(item => {
                return <Option key={item.stationCode} value={item.stationCode}>{item.stationName}</Option>
              }) : mainStationListReverse.map(item => {
                return <Option key={item.stationCode} value={item.stationCode}>{item.stationName}</Option>
              })}
            </Select>)}
          </Item> : text}</span>
        }
      },
      {
        title: '正线终点站',
        dataIndex: 'endStation',
        render: (text, record) => {
          return <span>{record.typeCode !== 'top3' ? <Item style={{ margin: 0 }}>
            {this.props.form.getFieldDecorator(`endStation${record.id}`, {
              initialValue: text ? text : '',
              rules: [

              ],
            })(<Select showSearch placeholder="请选择" disabled={false} allowClear
              style={{ width: 150 }}
              onChange={(value) => this.selectLines(value, record, 'EndStation')} filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
              {record.typeCode.indexOf('top') > -1 ? mainStationList.map((item, index) => {
                return <Option key={item.stationCode} value={item.stationCode} disabled={index < mainStationList.findIndex(value => value.stationCode == record.startStation)+1 ? true : false}>{item.stationName}</Option>
              }) : mainStationListReverse.map((item, index) => {
                return <Option key={item.stationCode} value={item.stationCode} disabled={index < mainStationListReverse.findIndex(value => value.stationCode == record.startStation)+1 ? true : false}>{item.stationName}</Option>
              })}
            </Select>)}
          </Item> : text}</span>
        }
      },
      {
        title: '入段',
        dataIndex: 'inStation',
        render: (text, record) => {
          return <span>{this.state.disRuduan.indexOf(record.typeCode) > -1 ? <Item style={{ margin: 0 }}>
            {this.props.form.getFieldDecorator(`inStation${record.id}`, {
              initialValue: text ? text : '',
              rules: [
                {
                  validator: (rule, value, callBack) => { this.checkRuduan({ value, callBack }, record) }
                },
              ],
            })(<Select showSearch placeholder="请选择" disabled={false} allowClear
              style={{ width: 150 }}
              onChange={(value) => this.selectLines(value, record, 'Ruduan')} filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
              {this.state.supStation.map(item => {
                return <Option key={item.stationCode} value={item.stationCode}>{item.stationName}</Option>
              })}
            </Select>)}
          </Item> : text}</span>
        }
      },
      {
        title: '列数',
        dataIndex: 'coloumns',
        render: (text, record) => {
          return <span>{(this.state.disDesc.indexOf(record.typeCode) < 0) ? <Item style={{ margin: 0 }}>
            {this.props.form.getFieldDecorator(`coloumns${record.id}`, {
              initialValue: text ? text : '',
              rules: [

              ],
            })(<InputNumber onChange={(value) => this.selectLines(value, record, 'Lines')} min={0} style={{ width: 150 }} />)}
          </Item> : text}</span>
        }
      },
      {
        title: '备注',
        dataIndex: 'remark',
        render: (text, record) => {
          return <span>{(this.state.disDesc.indexOf(record.typeCode) < 0) ? <Item style={{ margin: 0 }}>
            {this.props.form.getFieldDecorator(`remark${record.id}`, {
              initialValue: text ? text : '',
              rules: [

              ],
            })(<Input onChange={(e) => this.selectLines(e.target.value, record, 'Desc')} placeholder='请输入' style={{ width: 150 }} disabled={false} />)}
          </Item> : text}</span>
        }
      },
      {
        title: '里程',
        dataIndex: 'mileage',
        render: (text, record) => {
          return <span>{text ? text : ''}</span>
        }
      },
      {
        title: '操作',
        dataIndex: 'operation',
        render: (text, record, index) => {
          return <span>{
            record.edit ?
              (<Fragment>{record.rowType == 'title' && <a onClick={() => this.addFun(record)} style={{ marginRight: 5 }}>新增</a>}
                {record.rowType !== 'title' && <a onClick={() => this.deleteFun(record)}>删除</a>}</Fragment>) : null}
          </span>
        }
      },
    ]
    return (
      <div>
        <div>
          <Form onSubmit={this.handleOk}>
            <div className={style.tipLayout}>
              <div className={style.tipBox}>
                <div className={style.topTags}>
                  <Row key={1} type="flex">
                    <Col span={12} key="line">
                      <Item {...formItemLayout} label="线路">
                        {getFieldDecorator('line', {
                          initialValue: type == 'info' ? record.line : undefined,
                          rules: [
                            {
                              required: true,
                              message: '请选择线路',
                            },
                          ],
                        })(
                          <Select showSearch placeholder="请选择线路" size='small' disabled={true}
                            style={{ width: 150, marginRight: 10 }}
                            onChange={this.selectOnChange} filterOption={(input, option) =>
                              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                            {lineArr.map(item => {
                              return <Option key={item.value} value={item.value}>{item.title}</Option>
                            })}
                          </Select>)}
                      </Item>
                    </Col>
                    <Col span={12} key="scheduleCode">
                      <Item {...formItemLayout1} label="时刻表编码">
                        {getFieldDecorator('scheduleCode', {
                          initialValue: type == 'info' ? record.scheduleCode : null,
                          rules: [
                            {
                              required: true,
                              message: '请输入时刻表编码',
                            },
                            {
                              max: 20,
                              message: '不能超过20个字符',
                            },
                            {
                              validator: this.checkAddScheduleCode
                            },
                          ],
                          validateTrigger: 'onBlur'
                        })(<Input size='small' placeholder='请输入时刻表名称' style={{ width: 150 }} disabled={type == 'add' ? false : true} />)}
                      </Item>
                    </Col>
                  </Row>
                </div>
                <div className={style.topTagsBtn}>
                  <Button disabled={this.state.isOk} type="primary" icon="check" size='small' style={{ marginRight: 10 }} onClick={this.handleOk} >保存</Button>
                </div>
              </div>
            </div>
            <div className={style.mainBody} style={{ height: this.props.height + 20, marginTop: 20, overflow: 'auto', clear: 'both' }}>
              <Row key={2} type="flex">
                <Col span={6} >
                  <Item label="最大上线列车数" {...formItemLayout}>
                    {getFieldDecorator('maxOnlineTrain', {
                      initialValue: type == 'info' ? record.maxOnlineTrain : null,
                      rules: [
                        {
                          required: true,
                          message: '请输入最大上线列车数',
                        },
                        {
                          validator: this.checkOnlineTrain
                        },
                      ],
                    })(<Input placeholder='请输入最大上线列车数' disabled={type == 'add' ? false : true} />)}
                  </Item>
                </Col>
                <Col span={6} key="minDrivingInterval">
                  <Item label="最小行车间隔" {...formItemLayout}>
                    {getFieldDecorator('minDrivingInterval', {
                      initialValue: type == 'info' ? record.minDrivingInterval : null,
                      rules: [
                        {
                          required: true,
                          message: '请输入最小行车间隔',
                        },
                      ],
                    })(<Input placeholder='请输入最小行车间隔' disabled={type == 'add' ? false : true} />)}
                  </Item>
                </Col>
                <Col span={6} key="standbyTrain">
                  <Item label="备用车数" {...formItemLayout}>
                    {getFieldDecorator('standbyTrain', {
                      initialValue: type == 'info' ? record.standbyTrain : null,
                      rules: [
                        {
                          required: true,
                          message: '请输入备用车数',
                        },
                      ]
                    })(<Input placeholder='请输入备用车数' disabled={type == 'add' ? false : true} />)}
                  </Item>
                </Col>
                <Col span={6} key='plannedOperationColumn'>
                  <Item label='计划开行(列)' {...formItemLayout}>
                    {getFieldDecorator("plannedOperationColumn", {
                      initialValue: type == 'info' ? record.plannedOperationColumn : null,
                      rules: [
                        {
                          required: true,
                          message: '请输入计划开行',
                        },
                        {
                          validator: this.checkPlanTrain
                        },
                      ]
                    })(
                      <Input placeholder='请输入计划开行' disabled={type == 'add' ? false : true} />
                    )}
                  </Item>
                </Col>
              </Row>
              <Row key={3}>
                <Col span={6} key="startStation">
                  <Item label="始发站" {...formItemLayout}>
                    {getFieldDecorator('startStation', {
                      initialValue: type == 'info' ? record.startStation : undefined,
                      rules: [
                        {
                          required: true,
                          message: '请选择始发站',
                        },
                        {
                          validator: this.checkstartStation
                        },
                      ]
                    })(<Select showSearch placeholder="请选择始发站" disabled={type == 'add' ? false : true}
                      filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                      {mainStationList.map(item => {
                        return <Option key={item.stationCode} value={item.stationCode}>{item.stationName}</Option>
                      })}
                    </Select>)}
                  </Item>
                </Col>
                <Col span={6} key="endStation">
                  <Item label="终点站" {...formItemLayout}>
                    {getFieldDecorator('endStation', {
                      initialValue: type == 'info' ? record.endStation : undefined,
                      rules: [
                        {
                          required: true,
                          message: '请选择终点站',
                        },
                        {
                          validator: this.checkendStation
                        },
                      ]
                    })(<Select showSearch placeholder="请选择终点站" disabled={type == 'add' ? false : true}
                      filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                      {mainStationList.map(item => {
                        return <Option key={item.stationCode} value={item.stationCode}>{item.stationName}</Option>
                      })}
                    </Select>)}
                  </Item>
                </Col>
                <Col span={6} key="startDriveTime">
                  <Item label="首班车时间" {...formItemLayout}>
                    {getFieldDecorator('startDriveTime', {
                      initialValue: type == 'info' ? moment(record.startDriveTime, 'HH:mm:ss') : null,
                      rules: [
                        {
                          required: true,
                          message: '请选择首班车时间',
                        },
                      ]
                    })(<TimePicker defaultOpenValue={moment('00:00:00', 'HH:mm:ss')} placeholder='首班时间' style={{ width: '100%' }} disabled={type == 'add' ? false : true} />)}
                  </Item>
                </Col>
                <Col span={6} key="endDriveTime">
                  <Item label="末班车时间" {...formItemLayout}>
                    {getFieldDecorator('endDriveTime', {
                      initialValue: type == 'info' ? moment(record.endDriveTime, 'HH:mm:ss') : null,
                      rules: [
                        {
                          required: true,
                          message: '请选择末班车时间',
                        },
                      ]
                    })(<TimePicker defaultOpenValue={moment('00:00:00', 'HH:mm:ss')} placeholder='末班时间' style={{ width: '100%' }} disabled={type == 'add' ? false : true} />)}
                  </Item>
                </Col>
              </Row>
              <Row key={4}>
                <Table
                  rowKey={record => record.id}
                  rowClassName={this.setClassName}
                  bordered
                  size="small"
                  dataSource={dataSource}
                  columns={columns}
                  pagination={false}
                  onRow={(record, index) => {
                    return {
                      onClick: () => {
                        this.getInfo(record, index)
                      },
                    }
                  }}
                />
              </Row>
              <Row key={5}>
                <Divider orientation="left">上行线路</Divider>
                <Table
                  rowKey={record => record.id}
                  rowClassName={this.setClassName}
                  bordered
                  size="small"
                  dataSource={dataSource1}
                  columns={columns1}
                  pagination={false}
                  onRow={(record, index) => {
                    return {
                      onClick: () => {
                        this.getInfo(record, index)
                      },
                    }
                  }}
                />
              </Row>
              <Row key={6}>
                <Divider orientation="left">下行线路</Divider>
                <Table
                  rowKey={record => record.id}
                  rowClassName={this.setClassName}
                  bordered
                  size="small"
                  dataSource={dataSource2}
                  columns={columns1}
                  pagination={false}
                  onRow={(record, index) => {
                    return {
                      onClick: () => {
                        this.getInfo(record, index)
                      },
                    }
                  }}
                />
              </Row>
            </div>
          </Form>
        </div>
      </div>
    );
  }
}

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

const formLayout = {
  labelCol: {
    sm: { span: 4 },
  },
  wrapperCol: {
    sm: { span: 20 },
  },
};

const formItemLayout1 = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 12 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
  },
};

const AddTimeTable = Form.create()(AddTimeTable1);
export default AddTimeTable;