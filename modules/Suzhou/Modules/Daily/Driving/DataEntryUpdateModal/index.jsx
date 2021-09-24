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
            trainDailyUpSchedule: [],  //上行录入数据
            trainDailyDownSchedule: [], //下行录入数据
            mainStationList: [], //正线候选值
            mainStationListReverse: [], //正线候选值倒序
            supStation: [],  //辅助站点
            disChuduan: ['top3', 'top4', 'down3', 'down4'], //出段需要录入的类型
            disStart: ['top1', 'top2', 'top3', 'top4', 'down1', 'down2', 'down3', 'down4'],  //始发站需要录入的类型
            disEnd: ['top1', 'top2', 'top3', 'top4', 'down1', 'down2', 'down3', 'down4'],  //终点站需要录入的类型
            disRuduan: ['top3', 'top4', 'down3', 'down4'],//入段需要录入的类型
            disDesc: [],//列数,备注不需要录入的类型
        }
    }
    componentDidMount() {
        const { line, trainDailyUpSchedule, trainDailyDownSchedule } = this.props
        this.selectOnChange(line)
        this.setState({
            trainDailyUpSchedule,  //上行录入数据
            trainDailyDownSchedule, //下行录入数据
        })
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

    //数据录入
    selectLines = (value, record, dataType) => {
        if(value == undefined){
            value = ''
        }
        let { trainDailyUpSchedule, trainDailyDownSchedule } = this.state
        if (record.typeCode.indexOf('top') > -1) {
            const indexTop = trainDailyUpSchedule.findIndex(item => record.id == item.id)
            if (dataType == 'Chuduan') {
                trainDailyUpSchedule[indexTop].period = value
            } else if (dataType == 'StartStation') {
                trainDailyUpSchedule[indexTop].startStation = value
            } else if (dataType == 'EndStation') {
                trainDailyUpSchedule[indexTop].endStation = value
            } else if (dataType == 'Ruduan') {
                trainDailyUpSchedule[indexTop].inStation = value
            } else if (dataType == 'Lines') {
                this.getMileageFun(record.period, record.startStation, record.endStation, record.inStation, '0', (data) => {
                    trainDailyUpSchedule[indexTop].mileage = data.stationMileage
                    trainDailyUpSchedule[indexTop].newLineStationMileage = data.newLineStationMileage
                    trainDailyUpSchedule[indexTop].oldLineStationMileage = data.oldLineStationMileage
                })
                trainDailyUpSchedule[indexTop].coloumns = value
            } else if (dataType == 'Desc') {
                trainDailyUpSchedule[indexTop].remark = value
            }
            this.setState({ trainDailyUpSchedule })
        } else {
            const indexDown = trainDailyDownSchedule.findIndex(item => record.id == item.id)
            if (dataType == 'Chuduan') {
                trainDailyDownSchedule[indexDown].period = value
            } else if (dataType == 'StartStation') {
                trainDailyDownSchedule[indexDown].startStation = value
            } else if (dataType == 'EndStation') {
                trainDailyDownSchedule[indexDown].endStation = value
            } else if (dataType == 'Ruduan') {
                trainDailyDownSchedule[indexDown].inStation = value
            } else if (dataType == 'Lines') {
                this.getMileageFun(record.period, record.startStation, record.endStation, record.inStation, '1', (data) => {
                    trainDailyDownSchedule[indexDown].mileage = data.stationMileage
                    trainDailyDownSchedule[indexDown].newLineStationMileage = data.newLineStationMileage
                    trainDailyDownSchedule[indexDown].oldLineStationMileage = data.oldLineStationMileage
                })
                trainDailyDownSchedule[indexDown].coloumns = value
            } else if (dataType == 'Desc') {
                trainDailyDownSchedule[indexDown].remark = value
            }
            this.setState({ trainDailyDownSchedule })
        }
    }
    //出段校验
    checkChuduan = (data, record) => {
        if (data.value) {
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
        } else {
            data.callBack()
        }
    }
    //入段校验
    checkRuduan = (data, record) => {
        if (data.value) {
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
    //提交数据
    handleSubmit = (val, e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (err) {
            } else {
                const { trainDailyUpSchedule, trainDailyDownSchedule } = this.state
                this.props.dataEntrySuccess(trainDailyUpSchedule, trainDailyDownSchedule)
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
        const { mainStationList, mainStationListReverse, trainDailyUpSchedule, trainDailyDownSchedule } = this.state
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
            // {
            //     title: '操作',
            //     dataIndex: 'operation',
            //     render: (text, record, index) => {
            //         return <span>{
            //             record.edit ?
            //                 (<Fragment>{record.rowType == 'title' && <a onClick={() => this.addFun(record)} style={{ marginRight: 5 }}>新增</a>}
            //                     {record.rowType !== 'title' && <a onClick={() => this.deleteFun(record)}>删除</a>}</Fragment>) : null}
            //         </span>
            //     }
            // },
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
                            dataSource={trainDailyUpSchedule}
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
                            dataSource={trainDailyDownSchedule}
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