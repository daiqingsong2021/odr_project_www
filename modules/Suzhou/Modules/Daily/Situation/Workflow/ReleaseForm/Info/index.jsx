import React, { Component, Fragment } from 'react';
import { Form, InputNumber, Divider, Table, Spin, Anchor } from 'antd';
import { connect } from 'react-redux';
import moment from 'moment';
import { curdCurrentData } from '@/store/curdData/action';
import { queryTrafficChildrenList, updateTrafficChildrenList } from '@/modules/Suzhou/api/suzhou-api'
import axios from '@/api/axios';
import { getBaseData } from '@/modules/Suzhou/components/Util/util';
import * as dataUtil from "@/utils/dataUtil"
import style from './style.less';
// 布局
import LabelFormLayout from "@/components/public/Layout/Labels/Form/LabelFormLayout"
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
            spinning: true,
            lineArr: [],    
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
                spinning: false,
            })
        })
    }
    componentDidMount() {
        getBaseData('line.network').then(data => { this.setState({ lineArr: data }) })
        const { recordTime } = this.props.record
        this.setState({
            recordTime,
        })
        this.getList()
    }
    //提交修改数据
    handleSubmit = (e) => {
        this.setState({
            spinning: true,
        })
        const { data, data1, data2, data3 } = this.state
        let oldData = [...data1]
        let newData = oldData.filter(item => item.line !== '小计' && item.line !== '总计' ? item : null)
        let datas = [{ table1: data }, { table2: newData }, { table3: data2 }, { table4: data3 }]
        axios.put(updateTrafficChildrenList + `?id=${this.props.record.id}`, datas, true).then(res => {
            this.getList()
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
        const { height,record } = this.props
        const { spinning } = this.state
        return (
            <LabelFormLayout title=''>
                <div className={style.search} >
                    <div className={style.topTags}>
                        <div className={style.tipBox}>
                            <span className={style.tipSpan}><b>日期：</b>{record.recordTime}</span>
                            <span className={style.tipSpan}><b>线路：</b>1号线，3号线</span>
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
                <div className={style.mainContent} style={{height:height+40,overflow:'auto'}}>
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
                </div>
                </LabelFormLayout>
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