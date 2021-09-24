import React, { Component, Fragment } from 'react';
import { Form, Table, Row, Col, Input, Button, DatePicker, TreeSelect, Select, TimePicker, Divider, InputNumber, Tooltip, Icon } from 'antd';
import { checkAddScheduleCode, updateTrainSchedule, queryStationListByParam, queryStationToStationMileage } from '@/modules/Suzhou/api/suzhou-api';
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
        id: 1, lineName: '当日计划', trainListNumber: '', passengerMiles: '', emptyMiles: '', allLinePassenageMiles: '',
        allLineEmptyMiles: '', newLinePassenageMiles: '', newLineEmptyMiles: '',
      }],
      lineArr: [],  //线路表
      mainStationList: [], //正线候选值
      mainStationListReverse: [], //正线候选值倒序
      disabled: false,
      trainScheduleUpStationVo: [],  //上行数据列表
      trainScheduleDownStationVo: [],  //下行数据列表
      supStation: [],  //辅助站点
      disChuduan: ['top3', 'top4', 'top5', 'top6', 'down4', 'down5'], //出段需要录入的类型
      disStart: ['top2', 'top5', 'down2', 'down4', 'down5', 'down6'],  //始发站需要录入的类型
      disEnd: ['top2', 'top4', 'down2', 'down4', 'down5', 'down6'],  //终点站需要录入的类型
      disRuduan: ['down3', 'down4', 'down5', 'down6'],//入段需要录入的类型
      disDesc: ['top3', 'top4', 'down3', 'down4'],//列数,备注不需要录入的类型
      disStartCheck: ['top3', 'top4', 'top5', 'top6', 'down4','down5'], //正线起始站不需要校验的类型
    }
  }

  componentDidMount() {
    const { record, type } = this.props
    const { dataSource } = this.state
    this.setState({
      dataSource: [{
        ...dataSource[0],
        trainListNumber: record.trainListNumber,
        passengerMiles: record.passengerMiles,
        emptyMiles: record.emptyMiles,
        allLinePassenageMiles: record.allLinePassenageMiles,
        allLineEmptyMiles: record.allLineEmptyMiles,
        newLinePassenageMiles: record.newLinePassenageMiles,
        newLineEmptyMiles: record.newLineEmptyMiles
      }],
      trainScheduleUpStationVo: record.trainScheduleUpStationVo,  //上行数据列表
      trainScheduleDownStationVo: record.trainScheduleDownStationVo,  //下行数据列表
    })
    getBaseData('line').then(data => { this.setState({ lineArr: data }) })
    this.selectOnChange()
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
  selectOnChange = () => {
    this.setState(
      {
        line: this.props.record.line,
      }, () => {
        this.getStationFun(this.props.record.line, '1,2', '', '', (res) => { //获取全部辅助线
          this.setState({
            supStation: res
          })
        })
        this.getStationFun(this.props.record.line, '0', '', '', (res) => { //获取全部正线
          this.setState({
            mainStationList: [...res],
            mainStationListReverse: [...res.reverse()]
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
  //设置当日计划
  setTodayPlanFun = () => {
    const { dataSource, trainScheduleUpStationVo, trainScheduleDownStationVo } = this.state
    let trainListNumber = 0, passengerMiles = 0, emptyMiles = 0, allLinePassenageMiles = 0,
      allLineEmptyMiles = 0, newLinePassenageMiles = 0, newLineEmptyMiles = 0
    trainScheduleUpStationVo.map(item => {
      if (item.typeCode == 'top1') {
        passengerMiles += Number(item.mileage) ;
        allLinePassenageMiles += Number(item.oldLineStationMileage) * Number(item.coloumns);
        newLinePassenageMiles += Number(item.newLineStationMileage) * Number(item.coloumns)
      }

      if (item.typeCode == 'top2') {
        passengerMiles += Number(item.mileage) ;
        allLinePassenageMiles += Number(item.oldLineStationMileage) * Number(item.coloumns);
        newLinePassenageMiles += Number(item.newLineStationMileage) * Number(item.coloumns)
      }

      if (item.typeCode == 'top3') {
        trainListNumber += Number(item.coloumns);
        emptyMiles += Number(item.mileage) ;
        allLineEmptyMiles += Number(item.oldLineStationMileage) * Number(item.coloumns);
        newLineEmptyMiles += Number(item.newLineStationMileage) * Number(item.coloumns)
      }

      if (item.typeCode == 'top4') {
        trainListNumber += Number(item.coloumns);
        emptyMiles += Number(item.mileage) ;
        allLineEmptyMiles += Number(item.oldLineStationMileage) * Number(item.coloumns);
        newLineEmptyMiles += Number(item.newLineStationMileage) * Number(item.coloumns)
      }

      if (item.typeCode == 'top5') {
        trainListNumber += Number(item.coloumns);
        emptyMiles += Number(item.mileage) ;
        allLineEmptyMiles += Number(item.oldLineStationMileage) * Number(item.coloumns);
        newLineEmptyMiles += Number(item.newLineStationMileage) * Number(item.coloumns)
      }

      if (item.typeCode == 'top6') {
        trainListNumber += Number(item.coloumns);
        emptyMiles += Number(item.mileage) ;
        allLineEmptyMiles += Number(item.oldLineStationMileage) * Number(item.coloumns);
        newLineEmptyMiles += Number(item.newLineStationMileage) * Number(item.coloumns)
      }
    })
    trainScheduleDownStationVo.map(item => {
      if (item.typeCode == 'down1') {
        passengerMiles += Number(item.mileage) ;
        allLinePassenageMiles += Number(item.oldLineStationMileage) * Number(item.coloumns);
        newLinePassenageMiles += Number(item.newLineStationMileage) * Number(item.coloumns)
      }

      if (item.typeCode == 'down2') {
        passengerMiles += Number(item.mileage) ;
        allLinePassenageMiles += Number(item.oldLineStationMileage) * Number(item.coloumns);
        newLinePassenageMiles += Number(item.newLineStationMileage) * Number(item.coloumns)
      }

      if (item.typeCode == 'down3') {
        trainListNumber += Number(item.coloumns);
        emptyMiles += Number(item.mileage) ;
        allLineEmptyMiles += Number(item.oldLineStationMileage) * Number(item.coloumns);
        newLineEmptyMiles += Number(item.newLineStationMileage) * Number(item.coloumns)
      }

      if (item.typeCode == 'down4') {
        trainListNumber += Number(item.coloumns);
        emptyMiles += Number(item.mileage) ;
        allLineEmptyMiles += Number(item.oldLineStationMileage) * Number(item.coloumns);
        newLineEmptyMiles += Number(item.newLineStationMileage) * Number(item.coloumns)
      }

      if (item.typeCode == 'down5') {
        trainListNumber += Number(item.coloumns);
        emptyMiles += Number(item.mileage) ;
        allLineEmptyMiles += Number(item.oldLineStationMileage) * Number(item.coloumns);
        newLineEmptyMiles += Number(item.newLineStationMileage) * Number(item.coloumns)
      }

      if (item.typeCode == 'down6') {
        trainListNumber += Number(item.coloumns);
        emptyMiles += Number(item.mileage) ;
        allLineEmptyMiles += Number(item.oldLineStationMileage) * Number(item.coloumns);
        newLineEmptyMiles += Number(item.newLineStationMileage) * Number(item.coloumns)
      }
    })
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
    const { trainScheduleUpStationVo, trainScheduleDownStationVo } = this.state
    if(value == undefined){
      value = ''
    }
    if (record.typeCode.indexOf('top') > -1) {
      const indexTop = trainScheduleUpStationVo.findIndex(item => record.id == item.id) //获取与录入匹配的数据行
      if (dataType == 'Chuduan') {
        trainScheduleUpStationVo[indexTop].period = value
      } else if (dataType == 'StartStation') {
        if (record.typeCode == 'top3') {
          this.getMileageFun(record.period, value, record.endStation, record.inStation, '0', (data) => {  //获取里程方法
            trainScheduleUpStationVo[indexTop].mileage = (data.stationMileage * Number(record.coloumns)).toFixed(3)
            trainScheduleUpStationVo[indexTop].newLineStationMileage = data.newLineStationMileage
            trainScheduleUpStationVo[indexTop].oldLineStationMileage = data.oldLineStationMileage
          })
        }
        trainScheduleUpStationVo[indexTop].startStation = value
      } else if (dataType == 'EndStation') {
        if (record.typeCode == 'top4') {
          this.getMileageFun(record.period, record.startStation, value, record.inStation, '0', (data) => {//获取里程方法
            trainScheduleUpStationVo[indexTop].mileage = (data.stationMileage * Number(record.coloumns)).toFixed(3)
            trainScheduleUpStationVo[indexTop].newLineStationMileage = data.newLineStationMileage
            trainScheduleUpStationVo[indexTop].oldLineStationMileage = data.oldLineStationMileage
          })
        }
        trainScheduleUpStationVo[indexTop].endStation = value
      } else if (dataType == 'Ruduan') {
        
        trainScheduleUpStationVo[indexTop].inStation = value
      } else if (dataType == 'Lines') {
        if (this.state.disDesc.indexOf(record.typeCode) < 0) {
          this.getMileageFun(record.period, record.startStation, record.endStation, record.inStation, '0', (data) => {//获取里程方法
            trainScheduleUpStationVo[indexTop].mileage = (data.stationMileage  * value).toFixed(3)
            trainScheduleUpStationVo[indexTop].newLineStationMileage = data.newLineStationMileage
            trainScheduleUpStationVo[indexTop].oldLineStationMileage = data.oldLineStationMileage
          })
        }
        if (record.typeCode == 'top1') {//获取与录入联动的数据行
          const indexTemp = trainScheduleUpStationVo.findIndex(item => item.typeCode == 'top3' && record.relatinNumber == item.relatinNumber)
          trainScheduleUpStationVo[indexTemp].coloumns = value
        } else if (record.typeCode == 'top2') {
          const indexTemp = trainScheduleUpStationVo.findIndex(item => item.typeCode == 'top4' && record.relatinNumber == item.relatinNumber)
          trainScheduleUpStationVo[indexTemp].coloumns = value
        }
        trainScheduleUpStationVo[indexTop].coloumns = value
      } else if (dataType == 'Desc') {
        if (record.typeCode == 'top1') {//获取与录入联动的数据行
          const indexTemp = trainScheduleUpStationVo.findIndex(item => item.typeCode == 'top3' && record.relatinNumber == item.relatinNumber)
          trainScheduleUpStationVo[indexTemp].remark = value
        } else if (record.typeCode == 'top2') {
          const indexTemp = trainScheduleUpStationVo.findIndex(item => item.typeCode == 'top4' && record.relatinNumber == item.relatinNumber)
          trainScheduleUpStationVo[indexTemp].remark = value
        }
        trainScheduleUpStationVo[indexTop].remark = value
      }
      this.setState({ trainScheduleUpStationVo }, () => { if (dataType == 'Lines') { this.setTodayPlanFun() } })
    } else {
      const indexDown = trainScheduleDownStationVo.findIndex(item => record.id == item.id)//获取与录入匹配的数据行
      if (dataType == 'Chuduan') {
        trainScheduleDownStationVo[indexDown].period = value
      } else if (dataType == 'StartStation') {
        trainScheduleDownStationVo[indexDown].startStation = value
      } else if (dataType == 'EndStation') {
        trainScheduleDownStationVo[indexDown].endStation = value
      } else if (dataType == 'Ruduan') {
        if (record.typeCode == 'down3' || record.typeCode == 'down4') {
          this.getMileageFun(record.period, record.startStation, record.endStation, value, '1', (data) => {//获取里程方法
            trainScheduleUpStationVo[indexTop].mileage = (data.stationMileage * Number(record.coloumns)).toFixed(3)
            trainScheduleUpStationVo[indexTop].newLineStationMileage = data.newLineStationMileage
            trainScheduleUpStationVo[indexTop].oldLineStationMileage = data.oldLineStationMileage
          })
        }
        trainScheduleDownStationVo[indexDown].inStation = value
      } else if (dataType == 'Lines') {
        this.getMileageFun(record.period, record.startStation, record.endStation, record.inStation, '1', (data) => {//获取里程方法
          trainScheduleDownStationVo[indexDown].mileage = (data.stationMileage * value).toFixed(3)
          trainScheduleDownStationVo[indexDown].newLineStationMileage = data.newLineStationMileage
          trainScheduleDownStationVo[indexDown].oldLineStationMileage = data.oldLineStationMileage
        })
        if (record.typeCode == 'down1') {//获取与录入联动的数据行
          const indexTemp = trainScheduleDownStationVo.findIndex(item => item.typeCode == 'down3' && record.relatinNumber == item.relatinNumber)
          trainScheduleDownStationVo[indexTemp].coloumns = value
        } else if (record.typeCode == 'down2') {
          const indexTemp = trainScheduleDownStationVo.findIndex(item => item.typeCode == 'down4' && record.relatinNumber == item.relatinNumber)
          trainScheduleDownStationVo[indexTemp].coloumns = value
        }
        trainScheduleDownStationVo[indexDown].coloumns = value
      } else if (dataType == 'Desc') {
        if (record.typeCode == 'down1') {//获取与录入联动的数据行
          const indexTemp = trainScheduleDownStationVo.findIndex(item => item.typeCode == 'down3' && record.relatinNumber == item.relatinNumber)
          trainScheduleDownStationVo[indexTemp].remark = value
        } else if (record.typeCode == 'down2') {
          const indexTemp = trainScheduleDownStationVo.findIndex(item => item.typeCode == 'down4' && record.relatinNumber == item.relatinNumber)
          trainScheduleDownStationVo[indexTemp].remark = value
        }
        trainScheduleDownStationVo[indexDown].remark = value
      }
      this.setState({ trainScheduleDownStationVo }, () => { if (dataType == 'Lines') { this.setTodayPlanFun() } })
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
        this.setState({ disabled: true })
        const startDriveTime = moment(values.startDriveTime).format('HH:mm:ss')
        const endDriveTime = moment(values.endDriveTime).format('HH:mm:ss')
        const typeCode = `line${values.line}.station`
        const { dataSource, trainScheduleUpStationVo, trainScheduleDownStationVo } = this.state
        const data = {
          id: this.props.record.id,
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
          trainScheduleUpStationForm: trainScheduleUpStationVo,
          trainScheduleDownStationForm: trainScheduleDownStationVo,
          trainListNumber: dataSource[0].trainListNumber,
          passengerMiles: dataSource[0].passengerMiles,
          emptyMiles: dataSource[0].emptyMiles,
          allLinePassenageMiles: dataSource[0].allLinePassenageMiles,
          allLineEmptyMiles: dataSource[0].allLineEmptyMiles,
          newLinePassenageMiles: dataSource[0].newLinePassenageMiles,
          newLineEmptyMiles: dataSource[0].newLineEmptyMiles,
        }
        axios.put(updateTrainSchedule, data, true).then(res => {
          if (res.data.status === 200) {
            this.setState({ disabled: false })
            this.props.success(res.data.data);
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
    const { lineArr, dataSource, mainStationList, mainStationListReverse } = this.state
    const { record } = this.props
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
      // {
      //   title: '操作',
      //   dataIndex: 'operation',
      //   render: (text, record, index) => {
      //     return <span>{
      //       record.edit ?
      //         (<Fragment>{record.rowType == 'title' && <a onClick={() => this.addFun(record)} style={{ marginRight: 5 }}>新增</a>}
      //           {record.rowType !== 'title' && <a onClick={() => this.deleteFun(record)}>删除</a>}</Fragment>) : null}
      //     </span>
      //   }
      // },
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
                          initialValue: record ? record.line : undefined,
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
                          initialValue: record ? record.scheduleCode : null,
                          rules: [
                            {
                              required: true,
                              message: '请输入时刻表编码',
                            },
                            {
                              max: 20,
                              message: '不能超过20个字符',
                            },
                            // {
                            //   validator: this.checkAddScheduleCode
                            // },
                          ],
                          validateTrigger: 'onBlur'
                        })(<Input size='small' placeholder='请输入时刻表名称' style={{ width: 150 }} disabled={true} />)}
                      </Item>
                    </Col>
                  </Row>
                </div>
                <div className={style.topTagsBtn}>
                  <Button type="primary" icon="check" size='small' style={{ marginRight: 10 }} onClick={this.handleOk} >保存</Button>
                </div>
              </div>
            </div>
            <div className={style.mainBody} style={{ height: this.props.height + 20, marginTop: 20, overflow: 'auto', clear: 'both' }}>
              <Row key={2} type="flex">
                <Col span={6} >
                  <Item label="最大上线列车数" {...formItemLayout}>
                    {getFieldDecorator('maxOnlineTrain', {
                      initialValue: record ? record.maxOnlineTrain : null,
                      rules: [
                        {
                          required: true,
                          message: '请输入最大上线列车数',
                        },
                        {
                          validator: this.checkOnlineTrain
                        },
                      ],
                    })(<Input placeholder='请输入最大上线列车数' disabled={false} />)}
                  </Item>
                </Col>
                <Col span={6} key="minDrivingInterval">
                  <Item label="最小行车间隔" {...formItemLayout}>
                    {getFieldDecorator('minDrivingInterval', {
                      initialValue: record ? record.minDrivingInterval : null,
                      rules: [
                        {
                          required: true,
                          message: '请输入最小行车间隔',
                        },
                      ],
                    })(<Input placeholder='请输入最小行车间隔' disabled={false} />)}
                  </Item>
                </Col>
                <Col span={6} key="standbyTrain">
                  <Item label="备用车数" {...formItemLayout}>
                    {getFieldDecorator('standbyTrain', {
                      initialValue: record ? record.standbyTrain : null,
                      rules: [
                        {
                          required: true,
                          message: '请输入备用车数',
                        },
                      ]
                    })(<Input placeholder='请输入备用车数' disabled={false} />)}
                  </Item>
                </Col>
                <Col span={6} key='plannedOperationColumn'>
                  <Item label='计划开行(列)' {...formItemLayout}>
                    {getFieldDecorator("plannedOperationColumn", {
                      initialValue: record ? record.plannedOperationColumn : null,
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
                      <Input placeholder='请输入计划开行' disabled={false} />
                    )}
                  </Item>
                </Col>
              </Row>
              <Row key={3}>
                <Col span={6} key="startStation">
                  <Item label="始发站" {...formItemLayout}>
                    {getFieldDecorator('startStation', {
                      initialValue: record ? record.startStation : undefined,
                      rules: [
                        {
                          required: true,
                          message: '请选择始发站',
                        },
                        {
                          validator: this.checkstartStation
                        },
                      ]
                    })(<Select showSearch placeholder="请选择始发站" disabled={false}
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
                      initialValue: record ? record.endStation : undefined,
                      rules: [
                        {
                          required: true,
                          message: '请选择终点站',
                        },
                        {
                          validator: this.checkendStation
                        },
                      ]
                    })(<Select showSearch placeholder="请选择终点站" disabled={false}
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
                      initialValue: record ? moment(record.startDriveTime, 'HH:mm:ss') : null,
                      rules: [
                        {
                          required: true,
                          message: '请选择首班车时间',
                        },
                      ]
                    })(<TimePicker defaultOpenValue={moment('00:00:00', 'HH:mm:ss')} placeholder='首班时间' style={{ width: '100%' }} disabled={false} />)}
                  </Item>
                </Col>
                <Col span={6} key="endDriveTime">
                  <Item label="末班车时间" {...formItemLayout}>
                    {getFieldDecorator('endDriveTime', {
                      initialValue: record ? moment(record.endDriveTime, 'HH:mm:ss') : null,
                      rules: [
                        {
                          required: true,
                          message: '请选择末班车时间',
                        },
                      ]
                    })(<TimePicker defaultOpenValue={moment('00:00:00', 'HH:mm:ss')} placeholder='末班时间' style={{ width: '100%' }} disabled={false} />)}
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
                  dataSource={this.state.trainScheduleUpStationVo}
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
                  dataSource={this.state.trainScheduleDownStationVo}
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