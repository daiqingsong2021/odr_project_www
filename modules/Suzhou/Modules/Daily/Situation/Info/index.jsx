import React, { Component, Fragment } from 'react';
import { Form, Input, Button, Select, InputNumber, Modal, Divider, Table, notification, Spin, Anchor } from 'antd';
import { connect } from 'react-redux';
import moment from 'moment';
import { curdCurrentData } from '../../../../../../store/curdData/action';
import { queryTrafficChildrenList, getInfoClassification, updateTrafficChildrenList, addDailyChangeVersion } from '@/modules/Suzhou/api/suzhou-api'
import axios from '../../../../../../api/axios';
import { getBaseData } from '@/modules/Suzhou/components/Util/util';
import * as dataUtil from "../../../../../../utils/dataUtil"
import style from './style.less';
import EditLogModal from '@/modules/Suzhou/components/EditLogModal/index'
// 布局
import LabelFormLayout from "@/components/public/Layout/Labels/Form/LabelFormLayout"
import LabelFormButton from "@/components/public/Layout/Labels/Form/LabelFormButton"
import { number, string } from 'prop-types';
const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
const { Link } = Anchor
const EditableContext = React.createContext();
//单元格
class EditableCell extends React.Component {
    renderCell = (form) => {
        const {
            editing,
            dataIndex,
            title,
            inputType,
            record,
            index,
            children,
            ...restProps
        } = this.props;
        return (
            <td {...restProps}>
                {editing ? (
                    <Form.Item style={{ margin: 0 }}>
                        {form.getFieldDecorator(dataIndex, {
                            rules: [
                                {
                                    required: true,
                                    message: `请输入${title}!`,
                                },
                            ],
                            initialValue: record[dataIndex],
                        })(<InputNumber min={0} style={{  }} />)}
                    </Form.Item>
                ) : (
                        children
                    )}
            </td>
        );
    };

    render() {
        return <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>;
    }
}
//主页面
class SituationInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            info: {},
            activeIndex: '',
            data: [],
            editingKey: '',
            tipArr: [],
            tipTitleArr: [],
            editInfoArr: [],  //修改信息数据
            showSubmitModal: false, //  show提交二级弹框
            submitShow: 0,   //
            changeButtonShow: true,  //show按钮转换
            showEditInfoModal:false,    //修改日志按钮
            spinning: true,
            isSubmit:true, //调整按钮
            lineArr: [],    
            modifyRemark:'',
            columns: [
                {
                    title: '线路',
                    dataIndex: 'lineVo.name',
                    key: 'lineVo.name',
                    editable: false,
                    render: (text, record, index) => {
                        const obj = {
                            children: <span className={style.tdSpan}>{text ? text : ''}</span>,
                            props: {},
                        };
                        if (index == 0) {
                            obj.props.rowSpan = 24;
                        } else if (index > 0 && index < 24) {
                            obj.props.rowSpan = 0;
                        } else if (index == 24) {
                            obj.props.rowSpan = 5;
                        } else if (index > 24 && index < 29) {
                            obj.props.rowSpan = 0;
                        } else if (record.line == '总计') {
                            obj.props.colSpan = 3;
                        }
                        return obj;
                    }
                },
                {
                    title: '车站编号',
                    dataIndex: 'stationNum',
                    key: 'stationNum',
                    editable: false,
                    render: (text, record, index) => {
                        if (record.line == '小计') {
                            return {
                                children: <span className={style.tdSpan}>{record.line}</span>,
                                props: {
                                    colSpan: 2,
                                }
                            }
                        } else if (record.line == '总计') {
                            return {
                                children: <span className={style.tdSpan}>{record.line}</span>,
                                props: {
                                    colSpan: 0,
                                }
                            }
                        } else {
                            return <span>{text}</span>;
                        }
                    }
                },
                {
                    title: '车站名',
                    dataIndex: 'station',
                    key: 'station',
                    editable: false,
                    render: (text, record, index) => {
                        if (record.line !== '1' && record.line !== '3') {
                            return {
                                children: <span className={style.tdSpan}>{record.line}</span>,
                                props: {
                                    colSpan: 0,
                                }
                            }
                        } else {
                            return <span>{text}</span>;
                        }
                    }
                },
                {
                    title: '进站',
                    dataIndex: 'arrivalVolume',
                    key: 'arrivalVolume',
                    editable: true,
                    render: (text, record) => {
                        return <span className={style.tdSpan}>{text ? text.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '0'}</span>
                    }
                },
                {
                    title: '出站',
                    dataIndex: 'outboundVolume',
                    key: 'outboundVolume',
                    editable: true,
                    render: (text, record) => {
                        return <span className={style.tdSpan}>{text ? text.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '0'}</span>
                    }
                },
                {
                    title: '进出站合计',
                    dataIndex: 'totalVolume',
                    key: 'totalVolume',
                    editable: false,
                    render: (text, record) => {
                        return <span className={style.tdSpan}>{text ? text.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '0'}</span>
                    }
                },
            ],  //表格1
            columns1: [
                {
                    title: '统计(人次)',
                    dataIndex: 'lineVo.name',
                    key: 'lineVo.name',
                    editable: false,
                    render: (text, record) => {
                        return <span className={style.tdSpan}>{text ? text : ''}</span>
                    }
                },
                {
                    title: '早高峰客运量(7:00-9:00)',
                    dataIndex: 'morningPeakTrafficVolume',
                    key: 'morningPeakTrafficVolume',
                    editable: true,
                    render: (text, record) => {
                        return <span className={style.tdSpan}>{text ? text.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''}</span>
                    }
                },
                {
                    title: '晚高峰客运量(17:00-19:00)',
                    dataIndex: 'eveningPeakTrafficVolume',
                    key: 'eveningPeakTrafficVolume',
                    editable: true,
                    render: (text, record) => {
                        return <span className={style.tdSpan}>{text ? text.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''}</span>
                    }
                },
                {
                    title: '高峰小时断面客流',
                    editable: true,
                    children: [
                        {
                            title: '上行:(8时~9时西大桥至哈工大)',
                            dataIndex: 'transectUpVolume',
                            key: 'transectUpVolume',
                            editable: true,
                            render: (text, record) => {
                                return <span title={text ? text : ''} className={style.tdSpan}>{text ? text.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''}</span>
                            }
                        },
                        {
                            title: '下行:(17时~18时哈工大至西大桥)',
                            dataIndex: 'transectDownVolume',
                            key: 'transectDownVolume',
                            editable: true,
                            render: (text, record) => {
                                return <span title={text ? text : ''} className={style.tdSpan}>{text ? text.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''}</span>
                            }
                        }
                    ]
                },
            ],  //表格3
            columns2: [
                {
                    title: '线路',
                    dataIndex: 'lineName',
                    key: 'lineName',
                    editable: false,
                    render: (text, record, index) => {
                        const obj = {
                            children: <span className={style.tdSpan}>{text ? text : ''}</span>,
                            props: {},
                        };
                        if (index == 0) {
                            obj.props.rowSpan = 2;
                        } else if (index > 0 && index < 2) {
                            obj.props.rowSpan = 0;
                        } else if (index == 2) {
                            obj.props.rowSpan = 2;
                        } else if (index > 2 && index < 4) {
                            obj.props.rowSpan = 0;
                        } else if (index == 4) {
                            obj.props.rowSpan = 2;
                        } else if (index > 4) {
                            obj.props.rowSpan = 0;
                        }
                        return obj;
                    }
                },
                {
                    title: '类型',
                    dataIndex: 'dataType',
                    key: 'dataType',
                    editable: false,
                    render: (text, record) => {
                        return <span className={style.tdSpan}>{text ? text : ''}</span>
                    }
                },
                {
                    title: '单程票(人次/%)',
                    dataIndex: 'oneWayTicket',
                    key: 'oneWayTicket',
                    editable: true,
                    render: (text, record) => {
                        return <span className={style.tdSpan}>{text ? text.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '0'}</span>
                    }
                },
                {
                    title: '城市通(人次/%)',
                    dataIndex: 'cityAccess',
                    key: 'cityAccess',
                    editable: true,
                    render: (text, record) => {
                        return <span className={style.tdSpan}>{text ? text.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '0'}</span>
                    }
                },
                {
                    title: '工作票(人次/%)',
                    dataIndex: 'workTicket',
                    key: 'workTicket',
                    editable: true,
                    render: (text, record) => {
                        return <span className={style.tdSpan}>{text ? text.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '0'}</span>
                    }
                },
                {
                    title: '计次纪念票(人次/%)',
                    dataIndex: 'countTicket',
                    key: 'countTicket',
                    editable: true,
                    render: (text, record) => {
                        return <span className={style.tdSpan}>{text ? text.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '0'}</span>
                    }
                },
                {
                    title: '储值票(人次/%)',
                    dataIndex: 'storedTicket',
                    key: 'storedTicket',
                    editable: true,
                    render: (text, record) => {
                        return <span className={style.tdSpan}>{text ? text.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '0'}</span>
                    }
                },
                {
                    title: '人脸支付(人次/%)',
                    dataIndex: 'facePay',
                    key: 'facePay',
                    editable: true,
                    render: (text, record) => {
                        return <span className={style.tdSpan}>{text ? text.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '0'}</span>
                    }
                }
            ],  //表格4
            columns3: [
                {
                    title: '线路',
                    dataIndex: 'lineVo.name',
                    key: 'lineVo.name',
                    editable: false,
                    render: (text, record) => {
                        return <span className={style.tdSpan}>{text ? text : '总计'}</span>
                    }
                },
                {
                    title: '本日客运量（人次）',
                    editable: true,
                    children: [
                        {
                            title: '进站',
                            dataIndex: 'arrivalVolume',
                            key: 'arrivalVolume',
                            editable: true,
                            render: (text, record) => {
                                return <span className={style.tdSpan}>{text ? text.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '0'}</span>
                            }
                        },
                        {
                            title: '出站',
                            dataIndex: 'outboundVolume',
                            key: 'outboundVolume',
                            editable: true,
                            render: (text, record) => {
                                return <span className={style.tdSpan}>{text ? text.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '0'}</span>
                            }
                        },
                        {
                            title: '换入',
                            dataIndex: 'transferVolume',
                            key: 'transferVolume',
                            editable: true,
                            render: (text, record) => {
                                return <span className={style.tdSpan}>{text ? text.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '0'}</span>
                            }
                        },
                        {
                            title: '客运量',
                            dataIndex: 'trafficVolume',
                            key: 'trafficVolume',
                            editable: true,
                            render: (text, record) => {
                                return <span className={style.tdSpan}>{text ? text.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '0'}</span>
                            }
                        }
                    ]
                },
                {
                    title: '月累计客运量（万人次）',
                    dataIndex: 'trafficVolumeMonth',
                    key: 'trafficVolumeMonth',
                    editable: false,
                    render: (text, record) => {
                        return <span className={style.tdSpan}>{text ? text.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '0'}</span>
                    }
                },
                {
                    title: '本月日均客运量（万人次）',
                    dataIndex: 'trafficVolumeMonthAverage',
                    key: 'trafficVolumeMonthAverage',
                    editable: false,
                    render: (text, record) => {
                        return <span className={style.tdSpan}>{text ? text.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '0'}</span>
                    }
                },
                {
                    title: '年累计客运量（万人次）',
                    dataIndex: 'trafficVolumeYear',
                    key: 'trafficVolumeYear',
                    editable: false,
                    render: (text, record) => {
                        return <span className={style.tdSpan}>{text ? text.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '0'}</span>
                    }
                },
                {
                    title: '年累计日均客运量（万人次）',
                    dataIndex: 'trafficVolumeYearAverage',
                    key: 'trafficVolumeYearAverage',
                    editable: false,
                    render: (text, record) => {
                        return <span className={style.tdSpan}>{text ? text.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '0'}</span>
                    }
                }
            ]   //表格2
        }
    }
    //table2数据处理
    table2Sum = (data) => {
        let data1 = []
        if (data.length > 0) {
            let data1Arr = [], arrivalVolume1 = 0, outboundVolume1 = 0, totalVolume1 = 0,
                arrivalVolume2 = 0, outboundVolume2 = 0, totalVolume2 = 0, arrivalVolume3 = 0, outboundVolume3 = 0, totalVolume3 = 0
            data.map(item => {
                if (item.line == '1') {
                    data1.push(item)
                    data1Arr.push(item.line)
                    arrivalVolume1 += item.arrivalVolume
                    outboundVolume1 += item.outboundVolume
                    totalVolume1 += item.totalVolume
                } else if (item.line == '3') {
                    data1.push(item)
                    data1Arr.push(item.line)
                    arrivalVolume2 += item.arrivalVolume
                    outboundVolume2 += item.outboundVolume
                    totalVolume2 += item.totalVolume
                }
            })
            arrivalVolume3 = arrivalVolume1 + arrivalVolume2
            outboundVolume3 = outboundVolume1 + outboundVolume2
            totalVolume3 = totalVolume1 + totalVolume2
            const lastIndex1 = data1Arr.lastIndexOf('1')
            const lastIndex2 = data1Arr.lastIndexOf('3')
            data1.splice(lastIndex1 + 1, 0, { line: '小计', id: 1, arrivalVolume: arrivalVolume1, outboundVolume: outboundVolume1, totalVolume: totalVolume1 })
            data1.splice(lastIndex2 + 2, 0, { line: '小计', id: 2, arrivalVolume: arrivalVolume2, outboundVolume: outboundVolume2, totalVolume: totalVolume2 })
            data1.splice(lastIndex2 + 3, 0, { 'lineVo.name': '总计', line: '总计', id: 3, arrivalVolume: arrivalVolume3, outboundVolume: outboundVolume3, totalVolume: totalVolume3 })
        } else {
            data1 = []
        }
        return data1
    }
    //table4数据处理
    table4Sum = (data) => {
        let dataInfo = []
        if (data.length > 0) {
            const { recordTime } = this.state
            let data1 = { dataType: '客运量' },
                data2 = { dataType: '比例' },
                data3 = { dataType: '客运量' },
                data4 = { dataType: '比例' },
                data5 = { dataType: '客运量' },
                data6 = { dataType: '比例' }
            data.map(item => {
                if (item.line == '1') {
                    const newData1 = this.setTicketType(item)
                    const newData2 = this.setRateType(item)
                    data1 = { 'lineName': item.lineVo.name, 'line': item.line, 'recordTime': recordTime, 'id': 111, ...data1, ...newData1 }
                    data2 = { 'lineName': item.lineVo.name, 'line': item.line, 'recordTime': recordTime, 'id': 222, ...data2, ...newData2 }
                } else if (item.line == '3') {
                    const newData1 = this.setTicketType(item)
                    const newData2 = this.setRateType(item)
                    data3 = { 'lineName': item.lineVo.name, 'line': item.line, 'recordTime': recordTime, 'id': 333, ...data3, ...newData1 }
                    data4 = { 'lineName': item.lineVo.name, 'line': item.line, 'recordTime': recordTime, 'id': 444, ...data4, ...newData2 }
                } else {
                    const newData1 = this.setTicketType(item)
                    const newData2 = this.setRateType(item)
                    data5 = { 'lineName': item.lineVo.name, 'line': item.line, 'recordTime': recordTime, 'id': 555, ...data5, ...newData1 }
                    data6 = { 'lineName': item.lineVo.name, 'line': item.line, 'recordTime': recordTime, 'id': 666, ...data6, ...newData2 }
                }
            })
            dataInfo = [data1, data2, data3, data4, data5, data6]
        } else {
            dataInfo = []
        }
        return dataInfo
    }
    //票种比例处理
    setRateType = (item) => {
        let obj = {}
        switch (item.ticketType) {
            case 0:
                obj.oneWayTicket = item.rate
                break;
            case 1:
                obj.cityAccess = item.rate
                break;
            case 2:
                obj.workTicket = item.rate
                break;
            case 3:
                obj.countTicket = item.rate
                break;
            case 4:
                obj.storedTicket = item.rate
                break;
            case 5:
                obj.facePay = item.rate
                break;
        }
        return obj
    }
    //票种客运量处理
    setTicketType = (item) => {
        let obj = {}
        switch (item.ticketType) {
            case 0:
                obj.oneWayTicket = item.trafficVolume
                break;
            case 1:
                obj.cityAccess = item.trafficVolume
                break;
            case 2:
                obj.workTicket = item.trafficVolume
                break;
            case 3:
                obj.countTicket = item.trafficVolume
                break;
            case 4:
                obj.storedTicket = item.trafficVolume
                break;
            case 5:
                obj.facePay = item.trafficVolume
                break;
        }
        return obj
    }
    //获取主数据
    getList = () => {
        const { recordTime } = this.props.record;
        axios.get(queryTrafficChildrenList + `?recordTime=${recordTime}`).then(res => {
            let data = res.data.data[0];
            const data1 = this.table2Sum(data.table2)
            const data3 = this.table4Sum(data.table4)
            const oldData1 = [...data.table1],
                oldData2 = data1,
                oldData3 = [...data.table3],
                oldData4 = data3
            this.setState({
                oldData1,
                oldData2,
                oldData3,
                oldData4,
                data: data.table1,
                data1,
                data2: data.table3,
                data3,
                selectedRowKeys: [],
                isSubmit:false,
                spinning: false,
            })
        })
    }
    changeButton = () => {
        const { columns, columns1, columns2, columns3 } = this.state
        let columnsA1 = [...columns]
        let columnsB1 = [...columns1]
        let columnsC1 = [...columns2]
        let columnsD1 = [...columns3]
        if (this.state.changeButtonShow == true) {
            columnsA1.splice(7, 0, {    //表格1
                title: '操作',
                dataIndex: 'operation',
                width: 120,
                render: (text, record) => {
                    const { editingKey } = this.state;
                    const editable = this.isEditing(record);
                    const type = '1'
                    return editable && record.station ? (
                        <span>
                            <EditableContext.Consumer>
                                {form => (
                                    // <Popconfirm title="确定修改吗?" >
                                    <a type="primary" size='small' onClick={() => this.save(form, record.id, type, record)}
                                        style={{ marginRight: 5 }}
                                    >
                                        保存
                                    </a>
                                    // </Popconfirm>
                                )}
                            </EditableContext.Consumer>
                            <a size='small' onClick={() => this.cancel(record.id)}>取消</a>
                        </span>
                    ) : (
                            editable == false && record.station ?
                                <a type="primary" size='small' disabled={editingKey !== ''} onClick={() => this.edit(record.id)}>
                                    修改
                            </a> : ''
                        );
                }
            })
            columnsB1.splice(5, 0, {    //表格3   
                title: '操作',
                dataIndex: 'operation',
                width: 120,
                render: (text, record) => {
                    const { editingKey } = this.state;
                    const editable = this.isEditing(record);
                    const type = '2'
                    return editable ? (
                        <span>
                            <EditableContext.Consumer>
                                {form => (
                                    <a type="primary" size='small' onClick={() => this.save(form, record.id, type, record)}
                                        style={{ marginRight: 5 }}
                                    >
                                        保存
                                    </a>
                                )}
                            </EditableContext.Consumer>
                            <a size='small' onClick={() => this.cancel(record.id)}>取消</a>
                        </span>
                    ) : (
                            <a type="primary" size='small' disabled={editingKey !== ''} onClick={() => this.edit(record.id)}>
                                修改
                            </a>
                        );
                }
            })
            columnsC1.splice(8, 0, {    //表格4
                title: '操作',  
                dataIndex: 'operation',
                width: 120,
                render: (text, record) => {
                    const { editingKey } = this.state;
                    const editable = this.isEditing(record);
                    const type = '3'
                    return (record.dataType == '客运量' && record.line!='0') ? (editable ? (
                        <span>
                            <EditableContext.Consumer>
                                {form => (
                                    <a type="primary" size='small' onClick={() => this.save(form, record.id, type, record)}
                                        style={{ marginRight: 5 }}
                                    >
                                        保存
                                    </a>
                                )}
                            </EditableContext.Consumer>
                            <a size='small' onClick={() => this.cancel(record.id)}>取消</a>
                        </span>
                    ) : (
                            <a type="primary" size='small' disabled={editingKey !== ''} onClick={() => this.edit(record.id)}>
                                修改
                            </a>
                        )
                    ):''
                }
            })
            columnsD1.splice(7, 0, {    //表格2
                title: '操作',
                dataIndex: 'operation',
                width: 120,
                render: (text, record) => {
                    const { editingKey } = this.state;
                    const editable = this.isEditing(record);
                    const type = '4'
                    return editable && record.line ? (
                        <span>
                            <EditableContext.Consumer>
                                {form => (
                                    <a type="primary" size='small' onClick={() => this.save(form, record.id, type, record)}
                                        style={{ marginRight: 5 }}
                                    >
                                        保存
                                    </a>
                                )}
                            </EditableContext.Consumer>
                            <a size='small' onClick={() => this.cancel(record.id)}>取消</a>
                        </span>
                    ) : (
                            editable == false && record.line ?
                                <a type="primary" size='small' disabled={editingKey !== ''} onClick={() => this.edit(record.id)}>
                                    修改
                            </a> : ''
                        );
                }
            })
            this.setState({
                columns: columnsA1,
                columns1: columnsB1,
                columns2: columnsC1,
                columns3: columnsD1
            })
        }
        let submitShow = this.state.submitShow
        submitShow++
        this.setState({
            changeButtonShow: false,
            submitShow
        }, () => {
            if (this.state.changeButtonShow == false && this.state.submitShow > 1) {
                this.setState({
                    showSubmitModal: true
                })
            }
        })
    }
    //点击修改日志按钮
    editInfoFun=()=>{
        const { showEditInfoModal } = this.state
        this.setState({
            showEditInfoModal: !showEditInfoModal,
        })
    }
    //获取菜单基本信息
    getData = (id) => {
        // 请求获取info数据
        axios.get(getInfoClassification(id)).then(res => {
            this.setState({
                info: res.data.data,
            });
        });
    };
    componentDidMount() {
        getBaseData('line.network').then(data => { this.setState({ lineArr: data }) })
        const { recordTime } = this.props.record
        let tipTitleArr = new Set([])
        // this.props.data ? this.getData(this.props.data.id) : null;
        this.setState({
            recordTime,
            tipTitleArr
        })
        this.getList()
    }
    //提交修改数据
    handleSubmit = (e) => {
        this.setState({
            showSubmitModal: false,
            isSubmit:true,
            spinning: true,
        })
        const { data, data1, data2, data3 } = this.state
        let oldData = [...data1]
        let newData = oldData.filter(item => item.line !== '小计' && item.line !== '总计' ? item : null)
        let datas = [{ table1: data }, { table2: newData }, { table3: data2 }, { table4: data3 }]
        let f1 = new Promise((resolve, reject) => {
            axios.put(updateTrafficChildrenList + `?id=${this.props.record.id}`, datas, true).then(res => {
                if (res.data.status === 200){
                    resolve('success')
                    this.setState({
                        tipArr: [],
                        editInfoArr: [],
                        tipTitleArr: [],
                        changeButtonShow: true,
                    }, () => {
                        // this.props.handleCancel()
                        // this.getList()
                    })
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
        let f2 = new Promise((resolve, reject) => {
            const params = {
                moudleRecordId:this.props.record.id,
                moudleName:'客运日况',
                modifyRemark:this.state.modifyRemark,
                modifyContent:document.getElementById('modifyContent').innerText
            }
            axios.post(addDailyChangeVersion,params,true).then(res => {
                if (res.data.status === 200) {
                    resolve('success')
                    // this.setState({ showSubmitModal: false })
                    // this.props.handleCancel()
                    // this.getList()
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
                // this.props.handleCancel()
                this.setState({ showSubmitModal: false })
                this.getList()
                // this.props.updateSuccess()
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
        // e.preventDefault();
        // this.props.form.validateFieldsAndScroll((err, values) => {
        //     if (!err) {
        //         const data = {
        //             ...values,
        //             id: this.props.rightData.id,
        //         };
        //         // 更新菜单
        //         axios.put(updateClassification, data, true).then(res => {
        //             this.props.updateSuccess(res.data.data);
        //         });

        //     }
        // });
    }
    handleCancel = () => {
        this.setState({
            showSubmitModal: false
        })
    }
    getInfo = (record) => {
        const { id } = record;
        this.setState({
            activeIndex: id,
        });
    }
    setClassName = (record, index) => {
        return record.id === this.state.activeIndex ? 'tableActivty' : '';
    };
    //行是否能修改
    isEditing = record => record.id === this.state.editingKey;
    //取消修改
    cancel = () => {
        this.setState({ editingKey: '' });
    };
    //点击提交按钮
    submit = () => {
        this.setState({
            showSubmitModal: true
        })
    }
    //点击修改按钮
    edit = (id) => {
        this.setState({ editingKey: id });
    }
    //表格2数据联动处理
    dataLinkTable2=(data)=>{
        data[2].arrivalVolume = data[0].arrivalVolume + data[1].arrivalVolume   //到站
        data[2].outboundVolume = data[0].outboundVolume + data[1].outboundVolume    //出站
        data[2].transferVolume = data[0].transferVolume + data[1].transferVolume    //换入
        data[2].trafficVolume = data[0].trafficVolume + data[1].trafficVolume   //客运量
        return data
    }
    //表格4数据联动处理
    dataLinkTable4=(data)=>{
        const dataLine1 = data.filter(item=>item.line == '1' && item.dataType =='客运量')
        const dataLine3 = data.filter(item=>item.line == '3' && item.dataType =='客运量')
        //1号线
        const sumLine1Traffic = dataLine1[0].oneWayTicket + dataLine1[0].cityAccess + dataLine1[0].workTicket + dataLine1[0].countTicket + dataLine1[0].storedTicket + dataLine1[0].facePay
        data[1] = {
            ...data[1],
            oneWayTicket : ((dataLine1[0].oneWayTicket/sumLine1Traffic)*100).toFixed(2),
            cityAccess : ((dataLine1[0].cityAccess/sumLine1Traffic)*100).toFixed(2),
            workTicket : ((dataLine1[0].workTicket/sumLine1Traffic)*100).toFixed(2),
            countTicket : ((dataLine1[0].countTicket/sumLine1Traffic)*100).toFixed(2),
            storedTicket : ((dataLine1[0].storedTicket/sumLine1Traffic)*100).toFixed(2),
            facePay : ((dataLine1[0].facePay/sumLine1Traffic)*100).toFixed(2)}
        //3号线
        const sumLine3Traffic = dataLine3[0].oneWayTicket + dataLine3[0].cityAccess + dataLine3[0].workTicket + dataLine3[0].countTicket + dataLine3[0].storedTicket + dataLine3[0].facePay
        data[3] = {
            ...data[3],
            oneWayTicket : ((dataLine3[0].oneWayTicket/sumLine3Traffic)*100).toFixed(2),
            cityAccess : ((dataLine3[0].cityAccess/sumLine3Traffic)*100).toFixed(2),
            workTicket : ((dataLine3[0].workTicket/sumLine3Traffic)*100).toFixed(2),
            countTicket : ((dataLine3[0].countTicket/sumLine3Traffic)*100).toFixed(2),
            storedTicket : ((dataLine3[0].storedTicket/sumLine3Traffic)*100).toFixed(2),
            facePay : ((dataLine3[0].facePay/sumLine3Traffic)*100).toFixed(2)}
        //线网客运合计
        data[4] = {
            ...data[4],
            oneWayTicket : dataLine1[0].oneWayTicket + dataLine3[0].oneWayTicket,
            cityAccess : dataLine1[0].cityAccess + dataLine3[0].cityAccess,
            workTicket : dataLine1[0].workTicket + dataLine3[0].workTicket,
            countTicket : dataLine1[0].countTicket + dataLine3[0].countTicket,
            storedTicket : dataLine1[0].storedTicket + dataLine3[0].storedTicket,
            facePay : dataLine1[0].facePay + dataLine3[0].facePay}
        const sumNetTraffic = data[4].oneWayTicket + data[4].cityAccess + data[4].workTicket + data[4].countTicket + data[4].storedTicket + data[4].facePay
        data[5] = {
            ...data[5],
            oneWayTicket : ((data[4].oneWayTicket/sumNetTraffic)*100).toFixed(2),
            cityAccess : ((data[4].cityAccess/sumNetTraffic)*100).toFixed(2),
            workTicket : ((data[4].workTicket/sumNetTraffic)*100).toFixed(2),
            countTicket : ((data[4].countTicket/sumNetTraffic)*100).toFixed(2),
            storedTicket : ((data[4].storedTicket/sumNetTraffic)*100).toFixed(2),
            facePay : ((data[4].facePay/sumNetTraffic)*100).toFixed(2)}
        return data
    }
    //保存修改
    save = (form, id, type, record) => {
        const {  tipTitleArr, oldData1, oldData2, oldData3, oldData4 } = this.state
        let {editInfoArr, tipArr} = this.state
        form.validateFields((error, row) => {
            if (error) {
                return;
            }
            if (type == '1') {  //表格1
                const newData = [...this.state.data1];
                const index = newData.findIndex(item => id === item.id);
                if (index > -1) {
                    const item = newData[index];
                    row.totalVolume = row.arrivalVolume + row.outboundVolume
                    newData.splice(index, 1, {
                        ...item,
                        ...row,
                    });
                    let temp = []
                    if(oldData2[index].arrivalVolume!==row.arrivalVolume){
                        temp.push({type:'进站',oldValue:oldData2[index].arrivalVolume,newValue:row.arrivalVolume})
                    }
                    if(oldData2[index].outboundVolume!==row.outboundVolume){
                        temp.push({type:'出站',oldValue:oldData2[index].outboundVolume,newValue:row.outboundVolume})
                    }
                    const editInfo = temp
                    // const editInfo = `[${oldData2[index].lineVo.name}]的[${oldData2[index].station}]进站${oldData2[index].arrivalVolume}改为${row.arrivalVolume}
                    // ,出站${oldData2[index].outboundVolume}改为${row.outboundVolume}`//进出站合计${oldData2[index].totalVolume}改为${row.totalVolume}
                    if (tipArr.indexOf(record.id) > -1) {
                        if(oldData2[index].arrivalVolume==row.arrivalVolume&&oldData2[index].outboundVolume==row.outboundVolume){
                            tipArr = tipArr.filter(item=>item!==record.id)
                            editInfoArr = editInfoArr.filter(item=>item.id!==record.id)
                        }else{
                            editInfoArr.filter((item, index) => item.id == record.id ? editInfoArr[index].value = editInfo : null)
                        }
                    } else if(tipArr.indexOf(record.id) < 0 && (oldData2[index].arrivalVolume!==row.arrivalVolume || oldData2[index].outboundVolume!==row.outboundVolume)){
                        tipArr.push(record.id)
                        editInfoArr.push({ id: record.id, type: 1,name:`${oldData2[index].lineVo.name}的[${oldData2[index].station}]`, value: editInfo })
                        tipTitleArr.add('1')
                    }
                    this.setState({ data1: newData, editingKey: '', tipArr,editInfoArr, tipTitleArr },()=>{
                        this.setState({ data1: this.table2Sum(newData) })
                    });
                } else {
                    newData.push(row);
                    this.setState({ data1: newData, editingKey: '' });
                }
            } else if (type == '2') {   //表格3
                const newData = [...this.state.data2];
                const index = newData.findIndex(item => id === item.id);
                if (index > -1) {
                    const item = newData[index];
                    newData.splice(index, 1, {
                        ...item,
                        ...row,
                    });
                    let temp = []
                    if(oldData3[index].morningPeakTrafficVolume!==row.morningPeakTrafficVolume){
                        temp.push({type:'早高峰客运量',oldValue:oldData3[index].morningPeakTrafficVolume,newValue:row.morningPeakTrafficVolume})
                    }
                    if(oldData3[index].eveningPeakTrafficVolume!==row.eveningPeakTrafficVolume){
                        temp.push({type:'晚高峰客运量',oldValue:oldData3[index].eveningPeakTrafficVolume,newValue:row.eveningPeakTrafficVolume})
                    }
                    if(oldData3[index].transectUpVolume!==row.transectUpVolume){
                        temp.push({type:'断面客流上行',oldValue:oldData3[index].transectUpVolume,newValue:row.transectUpVolume})
                    }
                    if(oldData3[index].transectDownVolume!==row.transectDownVolume){
                        temp.push({type:'断面客流下行',oldValue:oldData3[index].transectDownVolume,newValue:row.transectDownVolume})
                    }
                    const editInfo = temp
                    // const editInfo = `[${oldData3[index].lineVo.name}]的早高峰客运量${oldData3[index].morningPeakTrafficVolume}改为${row.morningPeakTrafficVolume}
                    // ,晚高峰客运量${oldData3[index].eveningPeakTrafficVolume}改为${row.eveningPeakTrafficVolume},断面客流上行${oldData3[index].transectUpVolume}
                    // 下行${oldData3[index].transectDownVolume}改为${row.transectUpVolume}，${row.transectDownVolume}`
                    if (tipArr.indexOf(record.id) > -1) {
                        if(oldData3[index].morningPeakTrafficVolume==row.morningPeakTrafficVolume&&oldData3[index].eveningPeakTrafficVolume==row.eveningPeakTrafficVolume&&
                            oldData3[index].transectUpVolume==row.transectUpVolume&&oldData3[index].transectDownVolume==row.transectDownVolume){
                            tipArr = tipArr.filter(item=>item!==record.id)
                            editInfoArr = editInfoArr.filter(item=>item.id!==record.id)
                        }else{
                            editInfoArr.filter((item, index) => item.id == record.id ? editInfoArr[index].value = editInfo : null)
                        }
                    } else if(tipArr.indexOf(record.id) < 0 &&(oldData3[index].morningPeakTrafficVolume!==row.morningPeakTrafficVolume||oldData3[index].eveningPeakTrafficVolume!==row.eveningPeakTrafficVolume||
                        oldData3[index].transectUpVolume!==row.transectUpVolume||oldData3[index].transectDownVolume!==row.transectDownVolume)){
                        tipArr.push(record.id)
                        editInfoArr.push({ id: record.id, type: 2,name:oldData3[index].lineVo.name, value: editInfo })
                        tipTitleArr.add('2')
                    }
                    this.setState({ data2: newData, editingKey: '',tipArr, editInfoArr, tipTitleArr });
                } else {
                    newData.push(row);
                    this.setState({ data2: newData, editingKey: '' });
                }
            } else if (type == '3') {   //表格4
                const newData = [...this.state.data3];
                const index = newData.findIndex(item => id === item.id);
                if (index > -1) {
                    const item = newData[index];
                    newData.splice(index, 1, {
                        ...item,
                        ...row,
                    });
                    let temp = []
                    if(oldData4[index].oneWayTicket!==row.oneWayTicket){
                        temp.push({type:'单程票',oldValue:oldData4[index].oneWayTicket,newValue:row.oneWayTicket})
                    }
                    if(oldData4[index].cityAccess!==row.cityAccess){
                        temp.push({type:'城市通',oldValue:oldData4[index].cityAccess,newValue:row.cityAccess})
                    }
                    if(oldData4[index].workTicket!==row.workTicket){
                        temp.push({type:'工作票',oldValue:oldData4[index].workTicket,newValue:row.workTicket})
                    }
                    if(oldData4[index].countTicket!==row.countTicket){
                        temp.push({type:'计次纪念票',oldValue:oldData4[index].countTicket,newValue:row.countTicket})
                    }
                    if(oldData4[index].storedTicket!==row.storedTicket){
                        temp.push({type:'储值票',oldValue:oldData4[index].storedTicket,newValue:row.storedTicket})
                    }
                    if(oldData4[index].facePay!==row.facePay){
                        temp.push({type:'人脸支付',oldValue:oldData4[index].facePay,newValue:row.facePay})
                    }
                    const editInfo = temp
                    // const editInfo = `[${oldData4[index].lineName}]的单程票[${oldData4[index].dataType}]${oldData4[index].oneWayTicket}改为${row.oneWayTicket}
                    // ，城市通[${oldData4[index].dataType}]${oldData4[index].cityAccess}改为${row.cityAccess}
                    // ，工作票[${oldData4[index].dataType}]${oldData4[index].workTicket}改为${row.workTicket}
                    // ，计次纪念票[${oldData4[index].dataType}]${oldData4[index].countTicket}改为${row.countTicket}
                    // ，储值票[${oldData4[index].dataType}]${oldData4[index].storedTicket}改为${row.storedTicket}
                    // ，人脸支付[${oldData4[index].dataType}]${oldData4[index].facePay}改为${row.facePay}
                    // `
                    if (tipArr.indexOf(record.id) > -1) {
                        if(oldData4[index].oneWayTicket==row.oneWayTicket&&oldData4[index].cityAccess==row.cityAccess&&
                            oldData4[index].workTicket==row.workTicket&&oldData4[index].countTicket==row.countTicket&&
                            oldData4[index].storedTicket==row.storedTicket&&oldData4[index].facePay==row.facePay){
                            tipArr = tipArr.filter(item=>item!==record.id)
                            editInfoArr = editInfoArr.filter(item=>item.id!==record.id)
                        }else{
                            editInfoArr.filter((item, index) => item.id == record.id ? editInfoArr[index].value = editInfo : null)
                        }
                    } else if(tipArr.indexOf(record.id) < 0 &&(oldData4[index].oneWayTicket!==row.oneWayTicket||oldData4[index].cityAccess!==row.cityAccess||
                        oldData4[index].workTicket!==row.workTicket||oldData4[index].countTicket!==row.countTicket||
                        oldData4[index].storedTicket!==row.storedTicket||oldData4[index].facePay!==row.facePay)){
                        tipArr.push(record.id)
                        editInfoArr.push({ id: record.id, type: 3,name:oldData4[index].lineName, value: editInfo })
                        tipTitleArr.add('3')
                    }
                    this.setState({ data3: newData, editingKey: '', tipArr,editInfoArr, tipTitleArr },()=>{
                        this.setState({ data3: this.dataLinkTable4(newData) })
                        });
                } else {
                    newData.push(row);
                    this.setState({ data3: newData, editingKey: '' });
                }
            } else {    //表格2
                const newData = [...this.state.data];
                const index = newData.findIndex(item => id === item.id);
                if (index > -1) {
                    const item = newData[index];
                    newData.splice(index, 1, {
                        ...item,
                        ...row,
                    });
                    let temp = []
                    if(oldData1[index].arrivalVolume!==row.arrivalVolume){
                        temp.push({type:'进站',oldValue:oldData1[index].arrivalVolume,newValue:row.arrivalVolume})
                    }
                    if(oldData1[index].outboundVolume!==row.outboundVolume){
                        temp.push({type:'出站',oldValue:oldData1[index].outboundVolume,newValue:row.outboundVolume})
                    }
                    if(oldData1[index].transferVolume!==row.transferVolume){
                        temp.push({type:'换入',oldValue:oldData1[index].transferVolume,newValue:row.transferVolume})
                    }
                    if(oldData1[index].trafficVolume!==row.trafficVolume){
                        temp.push({type:'客运量',oldValue:oldData1[index].trafficVolume,newValue:row.trafficVolume})
                    }
                    const editInfo = temp
                    if (tipArr.indexOf(record.id) > -1) {
                        if(oldData1[index].arrivalVolume==row.arrivalVolume&&oldData1[index].outboundVolume==row.outboundVolume&&
                            oldData1[index].transferVolume==row.transferVolume&&oldData1[index].trafficVolume==row.trafficVolume){
                                tipArr = tipArr.filter(item=>item!==record.id)
                                editInfoArr = editInfoArr.filter(item=>item.id!==record.id)
                        }else{
                            editInfoArr.filter((item, index) => item.id == record.id ? editInfoArr[index].value = editInfo : null)
                        }
                    } else if(tipArr.indexOf(record.id) < 0 &&(oldData1[index].arrivalVolume!==row.arrivalVolume||oldData1[index].outboundVolume!==row.outboundVolume||
                        oldData1[index].transferVolume!==row.transferVolume||oldData1[index].trafficVolume!==row.trafficVolume)){
                            tipArr.push(record.id)
                            editInfoArr.push({ id: record.id, type: 4, name:oldData1[index].lineVo.name, value: editInfo })
                            tipTitleArr.add('4')
                    }
                    this.setState({ data: newData, editingKey: '',tipArr, editInfoArr, tipTitleArr },()=>{
                        this.setState({ data: this.dataLinkTable2(newData) })
                        }
                    );
                } else {
                    newData.push(row);
                    this.setState({ data: newData, editingKey: '' });
                }
            }
        });
    }
    changeRemark = (e) => {
        this.setState({
            modifyRemark: e.target.value
        })
        // console.log(e.target.value)
    }
    render() {
        const { intl } = this.props.currentLocale;
        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
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
        const components = {
            body: {
                cell: EditableCell,
            },
        };
        const columnsFun = this.state.columns3.map(col => {
            if (!col.editable) {
                return col;
            } else if (col.children) {
                return {
                    ...col,
                    children: [
                        {
                            ...col.children[0],
                            onCell: record => ({
                                record,
                                inputType: col.dataIndex === 'age' ? 'number' : 'text',
                                dataIndex: col.children[0].dataIndex,
                                title: col.children[0].title,
                                editing: this.isEditing(record),
                            }),
                        },
                        {
                            ...col.children[1],
                            onCell: record => ({
                                record,
                                inputType: col.dataIndex === 'age' ? 'number' : 'text',
                                dataIndex: col.children[1].dataIndex,
                                title: col.children[1].title,
                                editing: this.isEditing(record),
                            }),
                        },
                        {
                            ...col.children[2],
                            onCell: record => ({
                                record,
                                inputType: col.dataIndex === 'age' ? 'number' : 'text',
                                dataIndex: col.children[2].dataIndex,
                                title: col.children[2].title,
                                editing: this.isEditing(record),
                            }),
                        },
                        {
                            ...col.children[3],
                            onCell: record => ({
                                record,
                                inputType: col.dataIndex === 'age' ? 'number' : 'text',
                                dataIndex: col.children[3].dataIndex,
                                title: col.children[3].title,
                                editing: this.isEditing(record),
                            }),
                        }
                    ]

                };
            } else {
                return {
                    ...col,
                    onCell: record => ({
                        record,
                        inputType: col.dataIndex === 'age' ? 'number' : 'text',
                        dataIndex: col.dataIndex,
                        title: col.title,
                        editing: this.isEditing(record),
                    }),
                };
            }
        });
        const columnsFun1 = this.state.columns.map(col => {
            if (!col.editable) {
                return col;
            }
            return {
                ...col,
                onCell: record => ({
                    record,
                    inputType: col.dataIndex === 'age' ? 'number' : 'text',
                    dataIndex: col.dataIndex,
                    title: col.title,
                    editing: this.isEditing(record),
                }),
            };
        });
        const columnsFun2 = this.state.columns1.map(col => {
            if (!col.editable) {
                return col;
            } else if (col.children) {
                return {
                    ...col,
                    children: [
                        {
                            ...col.children[0],
                            onCell: record => ({
                                record,
                                inputType: col.dataIndex === 'age' ? 'number' : 'text',
                                dataIndex: col.children[0].dataIndex,
                                title: col.children[0].title,
                                editing: this.isEditing(record),
                            }),
                        },
                        {
                            ...col.children[1],
                            onCell: record => ({
                                record,
                                inputType: col.dataIndex === 'age' ? 'number' : 'text',
                                dataIndex: col.children[1].dataIndex,
                                title: col.children[1].title,
                                editing: this.isEditing(record),
                            }),
                        }
                    ]
                };
            } else {
                return {
                    ...col,
                    onCell: record => ({
                        record,
                        inputType: col.dataIndex === 'age' ? 'number' : 'text',
                        dataIndex: col.dataIndex,
                        title: col.title,
                        editing: this.isEditing(record),
                    }),
                };
            }
        });
        const columnsFun3 = this.state.columns2.map(col => {
            if (!col.editable) {
                return col;
            } else {
                return {
                    ...col,
                    onCell: record => ({
                        record,
                        inputType: col.dataIndex === 'age' ? 'number' : 'text',
                        dataIndex: col.dataIndex,
                        title: col.title,
                        editing: this.isEditing(record),
                    }),
                };
            }
        });
        const { height,record, permission } = this.props
        const { editInfoArr, changeButtonShow, showEditInfoModal, spinning ,isSubmit} = this.state
        const tipTitleArr = Array.from(this.state.tipTitleArr)
        return (
            // <Modal title="全线网客运量情况" className={style.main}
            //     visible={this.props.SituationInfoShow}
            //     onOk={this.props.handleCancel}
            //     onCancel={this.props.handleCancel}
            //     width='1200px'
            //     footer={[
            //         <Button type="primary" onClick={this.props.handleCancel}>
            //             关闭
            //         </Button>
            //     ]}>
            <LabelFormLayout title=''>
                <Modal title="提交修改"
                    visible={this.state.showSubmitModal}
                    onOk={this.handleSubmit}
                    onCancel={this.handleCancel}
                    width='500px'>
                    <div id='modifyContent'>
                    {tipTitleArr.indexOf('1') > -1 ? <p style={{ fontWeight: 'bold' }}>全线网各车站进出站客运量统计情况(客运量单位：人次)</p> : null}
                    {editInfoArr.map((item) => {
                        if (item.type == 1) {
                            return <p style={{'marginLeft':'8px'}}>{item.name}的{item.value.map((v,index)=>{return <Fragment>[{v.type}]由{v.oldValue}改为<i>{v.newValue}</i></Fragment>})}</p>
                        }
                    })}
                    {tipTitleArr.indexOf('4') > -1 ? <p style={{ fontWeight: 'bold' }}>全线网客运量情况</p> : null}
                    {editInfoArr.map((item) => {
                        if (item.type == 4) {
                        return <p style={{'marginLeft':'8px'}}>{item.name}的{item.value.map((v,index)=>{return <Fragment>[{v.type}]由{v.oldValue}改为<i>{v.newValue}</i></Fragment>})}</p>
                        }
                    })}
                    {tipTitleArr.indexOf('2') > -1 ? <p style={{ fontWeight: 'bold' }}>全线网客运量高峰统计情况</p> : null}
                    {editInfoArr.map((item) => {
                        if (item.type == 2) {
                            return <p style={{'marginLeft':'8px'}}>{item.name}的{item.value.map((v,index)=>{return <Fragment>[{v.type}]由{v.oldValue}改为<i>{v.newValue}</i></Fragment>})}</p>
                        }
                    })}
                    
                    {tipTitleArr.indexOf('3') > -1 ? <p style={{ fontWeight: 'bold' }}>全线网客运量分类统计情况</p> : null}
                    {editInfoArr.map((item) => {
                        if (item.type == 3) {
                            return <p style={{'marginLeft':'8px'}}>{item.name}的{item.value.map((v,index)=>{return <Fragment>[{v.type}]由{v.oldValue}改为<i>{v.newValue}</i></Fragment>})}</p>
                        }
                    })}
                    </div>
                    {editInfoArr.length < 1 ? <p style={{'marginLeft':'8px'}}>无修改记录</p> : null}
                    <span style={{'fontWeight':'bold','verticalAlign':'top'}}>修改备注：</span><TextArea style={{ width: 400 }} onChange={this.changeRemark.bind(this)}/>
                </Modal>
                <div className={style.search} >
                    <div className={style.topTags}>
                        <div className={style.tipBox}>
                            <span className={style.tipSpan}><b>日期：</b>{record.recordTime}</span>
                            <span className={style.tipSpan}><b>线路：</b>1号线，3号线</span>
                        </div>
                        <div>
                        <Button type="primary" icon='profile' size='small' style={{ marginRight: 15 }} onClick={this.editInfoFun}>{record.statusVo.code=='INIT'?'修改日志':'调整日志'}</Button>
                        {((record.statusVo.code == 'INIT' && permission.indexOf('SITUATIONMANAGE_SITUATION-EDIT-I')!==-1) || (record.statusVo.code == 'APPROVED' && permission.indexOf('SITUATIONMANAGE_SITUATION-EDIT-A')!==-1)) && ( <Fragment>
                            <Button disabled={isSubmit} type="primary" icon={changeButtonShow ? "edit" : "check"} size='small' style={{ marginRight: 20 }} onClick={this.changeButton} >{changeButtonShow ? (record.statusVo.code=='INIT'?'修改':'调整') : "提交"}</Button></Fragment>)}
                        </div>
                    </div>
                    {/* <div className={style.anchor} >
                        <Anchor>
                            <Link href="#info" title="车站进出" />
                            <Link href="#payPlan" title="线网客运" />
                            <Link href="#invoice" title="线网高峰" />
                            <Link href="#change" title="分类统计" />
                        </Anchor>
                    </div> */}
                </div>
                <div className={style.mainContent} style={{height:height+60,overflow:'auto'}}>
                    <Spin spinning={spinning}>
                        <Divider orientation="left" id='info' style={{ fontWeight: 'bold' }}>全线网各车站进出站客运量统计情况(客运量单位：人次)</Divider>
                        <EditableContext.Provider value={this.props.form}>
                            <Table components={components}
                                key={99}
                                rowKey={record => record.id}
                                defaultExpandAllRows={true}
                                pagination={false}
                                name={this.props.name}
                                columns={columnsFun1}
                                // rowSelection={false}
                                dataSource={this.state.data1}
                                // rowClassName={this.setClassName}
                                size="small"
                                bordered
                                loading={false}
                                onRow={(record, index) => {
                                    return {
                                        onClick: () => {
                                            this.getInfo(record, index)
                                        },
                                    }
                                }
                                }
                            />
                        </EditableContext.Provider>
                        <Divider orientation="left" id='payPlan' style={{ fontWeight: 'bold' }}>全线网客运量情况</Divider>
                        <EditableContext.Provider value={this.props.form}>
                            <Table components={components}
                                key={9}
                                rowKey={record => record.id}
                                defaultExpandAllRows={true}
                                pagination={false}
                                name={this.props.name}
                                columns={columnsFun}
                                // rowSelection={false}
                                dataSource={this.state.data}
                                // rowClassName={this.setClassName}
                                size="small"
                                bordered
                                loading={false}
                                onRow={(record, index) => {
                                    return {
                                        onClick: () => {
                                            this.getInfo(record, index)
                                        },
                                    }
                                }
                                }
                            />
                        </EditableContext.Provider>
                        <Divider orientation="left" id='invoice' style={{ fontWeight: 'bold' }}>全线网客运量高峰统计情况</Divider>
                        <EditableContext.Provider value={this.props.form}>
                            <Table components={components}
                                key={999}
                                rowKey={record => record.id}
                                defaultExpandAllRows={true}
                                pagination={false}
                                name={this.props.name}
                                columns={columnsFun2}
                                // rowSelection={false}
                                dataSource={this.state.data2}
                                // rowClassName={this.setClassName}
                                size="small"
                                bordered
                                loading={false}
                                onRow={(record, index) => {
                                    return {
                                        onClick: () => {
                                            this.getInfo(record, index)
                                        },
                                    }
                                }
                                }
                            />
                        </EditableContext.Provider>
                        <Divider orientation="left" id='change' style={{ fontWeight: 'bold' }}>全线网客运量分类统计情况</Divider>
                        <EditableContext.Provider value={this.props.form}>
                            <Table components={components}
                                key={9999}
                                rowKey={record => record.id}
                                defaultExpandAllRows={true}
                                pagination={false}
                                name={this.props.name}
                                columns={columnsFun3}
                                // rowSelection={false}
                                dataSource={this.state.data3}
                                // rowClassName={this.setClassName}
                                size="small"
                                bordered
                                loading={false}
                                onRow={(record, index) => {
                                    return {
                                        onClick: () => {
                                            this.getInfo(record, index)
                                        },
                                    }
                                }
                                }
                            />
                        </EditableContext.Provider>
                    </Spin>
                    {showEditInfoModal && <EditLogModal record={record} handleCancel={this.editInfoFun} modalVisible={showEditInfoModal}/>}
                </div>
                </LabelFormLayout>
            //  </Modal> 
        )
    }
}
const SituationInfos = Form.create()(SituationInfo);
export default connect(state => ({
    currentLocale: state.localeProviderData
}), {
    curdCurrentData,
})(SituationInfos);



























//When I WROte THis,ONly GOd and i UNDerStood whAt I was doInG
//NoW goD OnlY knOws