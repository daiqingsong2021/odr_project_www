import React, { Fragment, Component } from 'react';
import { Modal, Form, Table, Divider, Input, Button, Select, InputNumber } from 'antd';
import moment from 'moment';
import _ from 'lodash'
import style from './style.less';
import intl from 'react-intl-universal';
import { connect } from 'react-redux';
import { curdCurrentData } from '../../../../../../store/curdData/action';
import axios from '../../../../../../api/axios';
import { queryStationListByParam, queryStationToStationMileage } from '../../../../api/suzhou-api';
import { getBaseData } from '@/modules/Suzhou/components/Util/util';
const { Item } = Form;
const Option = Select.Option;
import PublicButton from "../../../../../../components/public/TopTags/PublicButton";
import * as dataUtil from "../../../../../../utils/dataUtil";
import FormItem from 'antd/lib/form/FormItem';

export class AddModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            //上行线路
            dataTop1: [{
                id: 1, lineType: 0, typeCode: 'top1', edit: true, rowType: 'title', typeName: '载客加开列次', period: '', startStation: '',
                endStation: '', inStation: '', coloumns: 0, remark: '', mileage: 0, newLineStationMileage: 0, oldLineStationMileage: 0
            }],//lineType:线路类型0：上行，1：下行，type:数据行类型，edit:是否有操作列，rowType:为‘title’时有新增、其他为删除
            dataTop2: [{
                id: 2, lineType: 0, typeCode: 'top2', edit: true, rowType: 'title', typeName: '载客抽线列次', period: '', startStation: '', relatinNumber: 0,
                endStation: '', inStation: '', coloumns: 0, remark: '', mileage: 0, newLineStationMileage: 0, oldLineStationMileage: 0
            }],
            dataTop3: [{
                id: 3, lineType: 0, typeCode: 'top3', edit: true, rowType: 'title', typeName: '空驶加开列次', period: '', startStation: '',
                endStation: '', inStation: '', coloumns: 0, remark: '', mileage: 0, newLineStationMileage: 0, oldLineStationMileage: 0
            }],
            dataTop4: [{
                id: 4, lineType: 0, typeCode: 'top4', edit: true, rowType: 'title', typeName: '空驶抽线列次', period: '', startStation: '', relatinNumber: 0,
                endStation: '', inStation: '', coloumns: 0, remark: '', mileage: 0, newLineStationMileage: 0, oldLineStationMileage: 0
            }],
            //下行线路
            dataDown1: [{
                id: 5, lineType: 1, typeCode: 'down1', edit: true, rowType: 'title', typeName: '载客加开列次', period: '', startStation: '',
                endStation: '', inStation: '', coloumns: 0, remark: '', mileage: 0, newLineStationMileage: 0, oldLineStationMileage: 0
            }],
            dataDown2: [{
                id: 6, lineType: 1, typeCode: 'down2', edit: true, rowType: 'title', typeName: '载客抽线列次', period: '', startStation: '', relatinNumber: 1,
                endStation: '', inStation: '', coloumns: 0, remark: '', mileage: 0, newLineStationMileage: 0, oldLineStationMileage: 0
            }],
            dataDown3: [{
                id: 7, lineType: 1, typeCode: 'down3', edit: true, rowType: 'title', typeName: '空驶加开列次', period: '', startStation: '',
                endStation: '', inStation: '', coloumns: 0, remark: '', mileage: 0, newLineStationMileage: 0, oldLineStationMileage: 0
            }],
            dataDown4: [{
                id: 8, lineType: 1, typeCode: 'down4', edit: true, rowType: 'title', typeName: '空驶抽线列次', period: '', startStation: '', relatinNumber: 1,
                endStation: '', inStation: '', coloumns: 0, remark: '', mileage: 0, newLineStationMileage: 0, oldLineStationMileage: 0
            }],
            mainStationList: [], //正线候选值
            mainStationListReverse: [], //正线候选值倒序
            idTemp: 8,
            supStation: [],  //辅助站点
            disChuduan: ['top3', 'top4', 'down3', 'down4'], //出段需要录入的类型
            disStart: ['top1', 'top2', 'top3', 'top4', 'down1', 'down2', 'down3', 'down4'],  //始发站需要录入的类型
            disEnd: ['top1', 'top2', 'top3', 'top4', 'down1', 'down2', 'down3', 'down4'],  //终点站需要录入的类型
            disRuduan: ['top3', 'top4', 'down3', 'down4'],//入段需要录入的类型
            disDesc: [],//列数,备注不需要录入的类型
        }
    }
    componentDidMount() {
        const { line } = this.props
        this.selectOnChange(line)
        if (this.props.type == 'info') {
            const { idTemp, dataTop1, dataTop2, dataTop3, dataTop4, dataDown1, dataDown2, dataDown3, dataDown4 } = this.props
            this.setState({
                idTemp, dataTop1, dataTop2, dataTop3, dataTop4, dataDown1, dataDown2, dataDown3, dataDown4
            })
        }
    }
    getInfo = (record) => {
        this.setState({
            activeIndex: record.id
        })
    }
    //如果是修改页面根据已选择线路获取站点
    selectOnChange = (value) => {
        this.setState(
            {
                line: value,
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
    //新增一行
    addFun = (record) => {
        let { idTemp } = this.state
        switch (record.typeCode) {
            case 'top1':
                let { dataTop1 } = this.state
                idTemp++
                dataTop1.push({
                    id: idTemp, lineType: 0, typeCode: 'top1', edit: true, rowType: '', typeName: '', period: '', startStation: '',
                    endStation: '', inStation: '', coloumns: 0, remark: '', mileage: 0, newLineStationMileage: 0, oldLineStationMileage: 0
                })
                this.setState({ dataTop1, idTemp })
                break
            case 'top2':
                let { dataTop2 } = this.state
                idTemp++
                dataTop2.push({
                    id: idTemp, lineType: 0, typeCode: 'top2', edit: true, rowType: '', typeName: '', period: '', startStation: '',
                    endStation: '', inStation: '', coloumns: 0, remark: '', mileage: 0, newLineStationMileage: 0, oldLineStationMileage: 0
                })
                this.setState({ dataTop2, idTemp })
                break
            case 'top3':
                let { dataTop3 } = this.state
                idTemp++
                dataTop3.push({
                    id: idTemp, lineType: 0, typeCode: 'top3', edit: true, rowType: '', typeName: '', period: '', startStation: '',
                    endStation: '', inStation: '', coloumns: 0, remark: '', mileage: 0, newLineStationMileage: 0, oldLineStationMileage: 0
                })
                this.setState({ dataTop3, idTemp })
                break
            case 'top4':
                let { dataTop4 } = this.state
                idTemp++
                dataTop4.push({
                    id: idTemp, lineType: 0, typeCode: 'top4', edit: true, rowType: '', typeName: '', period: '', startStation: '',
                    endStation: '', inStation: '', coloumns: 0, remark: '', mileage: 0, newLineStationMileage: 0, oldLineStationMileage: 0
                })
                this.setState({ dataTop4, idTemp })
                break
            case 'down1':
                let { dataDown1 } = this.state
                idTemp++
                dataDown1.push({
                    id: idTemp, lineType: 1, typeCode: 'down1', edit: true, rowType: '', typeName: '', period: '', startStation: '',
                    endStation: '', inStation: '', coloumns: 0, remark: '', mileage: 0, newLineStationMileage: 0, oldLineStationMileage: 0
                })
                this.setState({ dataDown1, idTemp })
                break
            case 'down2':
                let { dataDown2 } = this.state
                idTemp++
                dataDown2.push({
                    id: idTemp, lineType: 1, typeCode: 'down2', edit: true, rowType: '', typeName: '', period: '', startStation: '',
                    endStation: '', inStation: '', coloumns: 0, remark: '', mileage: 0, newLineStationMileage: 0, oldLineStationMileage: 0
                })
                this.setState({ dataDown2, idTemp })
                break
            case 'down3':
                let { dataDown3 } = this.state
                idTemp++
                dataDown3.push({
                    id: idTemp, lineType: 1, typeCode: 'down3', edit: true, rowType: '', typeName: '', period: '', startStation: '',
                    endStation: '', inStation: '', coloumns: 0, remark: '', mileage: 0, newLineStationMileage: 0, oldLineStationMileage: 0
                })
                this.setState({ dataDown3, idTemp })
                break
            case 'down4':
                let { dataDown4 } = this.state
                idTemp++
                dataDown4.push({
                    id: idTemp, lineType: 1, typeCode: 'down4', edit: true, rowType: '', typeName: '', period: '', startStation: '',
                    endStation: '', inStation: '', coloumns: 0, remark: '', mileage: 0, newLineStationMileage: 0, oldLineStationMileage: 0
                })
                this.setState({ dataDown4, idTemp })
                break
            default:
                break
        }
    }
    // 删除一行
    deleteFun = (record) => {
        switch (record.typeCode) {
            case 'top1':
                let { dataTop1 } = this.state
                const indexTop1 = dataTop1.findIndex(item => record.id == item.id)
                dataTop1.splice(indexTop1, 1)
                this.setState({ dataTop1 })
                break
            case 'top2':
                let { dataTop2 } = this.state
                const indexTop2 = dataTop2.findIndex(item => record.id == item.id)
                dataTop2.splice(indexTop2, 1)
                this.setState({ dataTop2 })
                break
            case 'top3':
                let { dataTop3 } = this.state
                const indexTop3 = dataTop3.findIndex(item => record.id == item.id)
                dataTop3.splice(indexTop3, 1)
                this.setState({ dataTop3 })
                break
            case 'top4':
                let { dataTop4 } = this.state
                const indexTop4 = dataTop4.findIndex(item => record.id == item.id)
                dataTop4.splice(indexTop4, 1)
                this.setState({ dataTop4 })
                break
            case 'down1':
                let { dataDown1 } = this.state
                const indexDown1 = dataDown1.findIndex(item => record.id == item.id)
                dataDown1.splice(indexDown1, 1)
                this.setState({ dataDown1 })
                break
            case 'down2':
                let { dataDown2 } = this.state
                const indexDown2 = dataDown2.findIndex(item => record.id == item.id)
                dataDown2.splice(indexDown2, 1)
                this.setState({ dataDown2 })
                break
            case 'down3':
                let { dataDown3 } = this.state
                const indexDown3 = dataDown3.findIndex(item => record.id == item.id)
                dataDown3.splice(indexDown3, 1)
                this.setState({ dataDown3 })
                break
            case 'down4':
                let { dataDown4 } = this.state
                const indexDown4 = dataDown4.findIndex(item => record.id == item.id)
                dataDown4.splice(indexDown4, 1)
                this.setState({ dataDown4 })
                break
            default:
                break
        }
    }
    //数据录入
    selectLines = (value, record, dataType) => {
        if(value == undefined){
            value = ''
        }
        let { dataTop3, dataTop4, dataDown3, dataDown4 } = this.state
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
                        dataTop1[indexTop1].mileage = data.stationMileage
                        dataTop1[indexTop1].newLineStationMileage = data.newLineStationMileage
                        dataTop1[indexTop1].oldLineStationMileage = data.oldLineStationMileage
                    })
                    dataTop1[indexTop1].coloumns = value
                } else if (dataType == 'Desc') {
                    dataTop1[indexTop1].remark = value
                }
                this.setState({ dataTop1 })
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
                        dataTop2[indexTop2].mileage = data.stationMileage
                        dataTop2[indexTop2].newLineStationMileage = data.newLineStationMileage
                        dataTop2[indexTop2].oldLineStationMileage = data.oldLineStationMileage
                    })
                    dataTop2[indexTop2].coloumns = value
                } else if (dataType == 'Desc') {
                    dataTop2[indexTop2].remark = value
                }
                this.setState({ dataTop2 })
                break
            case 'top3':
                const indexTop3 = dataTop3.findIndex(item => record.id == item.id)
                if (dataType == 'Chuduan') {
                    dataTop3[indexTop3].period = value
                } else if (dataType == 'StartStation') {
                    dataTop3[indexTop3].startStation = value
                } else if (dataType == 'EndStation') {
                    dataTop3[indexTop3].endStation = value
                } else if (dataType == 'Ruduan') {
                    dataTop3[indexTop3].inStation = value
                } else if (dataType == 'Lines') {
                    this.getMileageFun(record.period, record.startStation, record.endStation, record.inStation, '0', (data) => {
                        dataTop3[indexTop3].mileage = data.stationMileage
                        dataTop3[indexTop3].newLineStationMileage = data.newLineStationMileage
                        dataTop3[indexTop3].oldLineStationMileage = data.oldLineStationMileage
                    })
                    dataTop3[indexTop3].coloumns = value
                } else if (dataType == 'Desc') {
                    dataTop3[indexTop3].remark = value
                }
                this.setState({ dataTop3 })
                break
            case 'top4':
                const indexTop4 = dataTop4.findIndex(item => record.id == item.id)
                if (dataType == 'Chuduan') {
                    dataTop4[indexTop4].period = value
                } else if (dataType == 'StartStation') {
                    dataTop4[indexTop4].startStation = value
                } else if (dataType == 'EndStation') {
                    dataTop4[indexTop4].endStation = value
                } else if (dataType == 'Ruduan') {
                    dataTop4[indexTop4].inStation = value
                } else if (dataType == 'Lines') {
                    this.getMileageFun(record.period, record.startStation, record.endStation, record.inStation, '0', (data) => {
                        dataTop4[indexTop4].mileage = data.stationMileage
                        dataTop4[indexTop4].newLineStationMileage = data.newLineStationMileage
                        dataTop4[indexTop4].oldLineStationMileage = data.oldLineStationMileage
                    })
                    dataTop4[indexTop4].coloumns = value
                } else if (dataType == 'Desc') {
                    dataTop4[indexTop4].remark = value
                }
                this.setState({ dataTop4 })
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
                        dataDown1[indexdown1].mileage = data.stationMileage
                        dataDown1[indexdown1].newLineStationMileage = data.newLineStationMileage
                        dataDown1[indexdown1].oldLineStationMileage = data.oldLineStationMileage
                    })
                    dataDown1[indexdown1].coloumns = value
                } else if (dataType == 'Desc') {
                    dataDown1[indexdown1].remark = value
                }
                this.setState({ dataDown1 })
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
                        dataDown2[indexdown2].mileage = data.stationMileage
                        dataDown2[indexdown2].newLineStationMileage = data.newLineStationMileage
                        dataDown2[indexdown2].oldLineStationMileage = data.oldLineStationMileage
                    })
                    dataDown2[indexdown2].coloumns = value
                } else if (dataType == 'Desc') {
                    dataDown2[indexdown2].remark = value
                }
                this.setState({ dataDown2 })
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
                    dataDown3[indexDown3].inStation = value
                } else if (dataType == 'Lines') {
                    this.getMileageFun(record.period, record.startStation, record.endStation, record.inStation, '1', (data) => {
                        dataDown3[indexDown3].mileage = data.stationMileage
                        dataDown3[indexDown3].newLineStationMileage = data.newLineStationMileage
                        dataDown3[indexDown3].oldLineStationMileage = data.oldLineStationMileage
                    })
                    dataDown3[indexDown3].coloumns = value
                } else if (dataType == 'Desc') {
                    dataDown3[indexDown3].remark = value
                }
                this.setState({ dataDown3 })
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
                    dataDown4[indexDown4].inStation = value
                } else if (dataType == 'Lines') {
                    this.getMileageFun(record.period, record.startStation, record.endStation, record.inStation, '1', (data) => {
                        dataDown4[indexDown4].mileage = data.stationMileage
                        dataDown4[indexDown4].newLineStationMileage = data.newLineStationMileage
                        dataDown4[indexDown4].oldLineStationMileage = data.oldLineStationMileage
                    })
                    dataDown4[indexDown4].coloumns = value
                } else if (dataType == 'Desc') {
                    dataDown4[indexDown4].remark = value
                }
                this.setState({ dataDown4 })
                break
            default:
                break
        }
    }
    //出段校验
    checkChuduan = (data, record) => {
        if(data.value){
            if (this.state.disChuduan.indexOf(record.typeCode) > -1 && record.period) {
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
        }else{
            data.callBack()
        }
    }
    //入段校验
    checkRuduan = (data, record) => {
        if(data.value){
            this.getStationFun(this.state.line, '', '', record.endStation, (res) => {
                const dataList = res ? res : []
                if (dataList.findIndex(item => data.value == item.stationCode) > -1) {
                    data.callBack()
                } else {
                    data.callBack('该站点与入段未关联！')
                }
            })
        }else{
            data.callBack() 
        }
    }
    //提交数据
    handleSubmit = (val, e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (err) {
            } else {
                const { idTemp, dataTop1, dataTop2, dataTop3, dataTop4, dataDown1, dataDown2, dataDown3, dataDown4 } = this.state
                let dataSource1 = [...dataTop1, ...dataTop2, ...dataTop3, ...dataTop4]
                let dataSource2 = [...dataDown1, ...dataDown2, ...dataDown3, ...dataDown4]
                this.props.dataEntrySuccess(idTemp, dataTop1, dataTop2, dataTop3, dataTop4, dataDown1, dataDown2, dataDown3, dataDown4)
                this.props.handleCancel()
            }
        })
    }
    setClassName = (record) => {
        //判断索引相等时添加行的高亮样式
        return record.id === this.state.activeIndex ? 'tableActivty' : "";
    }
    render() {
        const { intl } = this.props.currentLocale
        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
        let { dataTop1, dataTop2, dataTop3, dataTop4, dataDown1, dataDown2, dataDown3, dataDown4, } = this.state
        const { mainStationList, mainStationListReverse } = this.state
        let dataSource1 = [...dataTop1, ...dataTop2, ...dataTop3, ...dataTop4]
        let dataSource2 = [...dataDown1, ...dataDown2, ...dataDown3, ...dataDown4]
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
                title: '类型',
                dataIndex: 'typeName',
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
                    return <Item style={{ margin: 0 }}>
                        {this.props.form.getFieldDecorator(`startStation${record.id}`, {
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
                    </Item>
                }
            },
            {
                title: '正线终点站',
                dataIndex: 'endStation',
                render: (text, record) => {
                    return <Item style={{ margin: 0 }}>
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
                    </Item>
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
                    return <Item style={{ margin: 0 }}>
                        {this.props.form.getFieldDecorator(`coloumns${record.id}`, {
                            initialValue: text ? text : 0,
                            rules: [

                            ],
                        })(<InputNumber onChange={(value) => this.selectLines(value, record, 'Lines')} min={0} style={{ width: 150 }} />)}
                    </Item>
                }
            },
            {
                title: '备注',
                dataIndex: 'remark',
                render: (text, record) => {
                    return <Item style={{ margin: 0 }}>
                        {this.props.form.getFieldDecorator(`remark${record.id}`, {
                            initialValue: text ? text : '',
                            rules: [

                            ],
                        })(<Input onChange={(e) => this.selectLines(e.target.value, record, 'Desc')} placeholder='请输入' style={{ width: 150 }} disabled={false} />)}
                    </Item>
                }
            },
            // {
            //     title: '里程',
            //     dataIndex: 'mileage',
            //     render: (text, record) => {
            //         return <span>{text ? text : ''}</span>
            //     }
            // },
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
            <Modal className={style.main}
                width="70%"
                afterClose={this.props.form.resetFields}
                mask={false}
                maskClosable={false}
                footer={<div className="modalbtn">
                    {/* 关闭 */}
                    <Button key={1} onClick={this.props.handleCancel}>关闭</Button>
                    {/* 保存 */}
                    <Button key={2} onClick={this.handleSubmit.bind(this, 'save')} type="primary">保存</Button>
                </div>}
                centered={true} title={'非正常行驶数据录入'} visible={this.props.modalVisible}
                onCancel={this.props.handleCancel}>
                <div className={style.mainBody}>
                    <Form onSubmit={this.handleSubmit}>
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
                    </Form>
                </div>
            </Modal>
        )
    }
}
const AddModals = Form.create()(AddModal);
export default connect(state => ({
    currentLocale: state.localeProviderData,
}))(AddModals);