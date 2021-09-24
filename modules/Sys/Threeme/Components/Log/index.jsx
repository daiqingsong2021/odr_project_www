import React, { Component, Fragment } from 'react'
import { Icon, Menu, Layout, DatePicker, Button, Input, Table, Select } from 'antd';
import style from './style.less'
import axios from "../../../../../api/axios"
import { findAcmlog } from "../../../../../api/api"
import { getBaseData } from '@/modules/Suzhou/components/Util/util';
import { connect } from 'react-redux';
import MyTable from "../../../../../components/Table"
import moment from "moment"
const Option = Select.Option
const { TextArea } = Input;
const { MonthPicker, RangePicker } = DatePicker;
const Search = Input.Search;
import * as dataUtil from '../../../../../utils/dataUtil'
class Log extends Component {
    constructor(props) {
        super(props)
        this.state = {
            currentPageNum: 1,
            pageSize: 50,
            data: [],
            thisTime: 1,
            lineArr:[],
            recordTime:'',
            line:''
        }
    }
    componentDidMount() {
        getBaseData('line').then(data => { this.setState({ lineArr: data }) })
        this.getDataList() 
    
    }
    //获取日志分页
    getDataList = () => {
        let url = `?typeFlag=${this.props.typeFlag}&recordTime=${this.state.recordTime}&line=${this.state.line}`
        if (this.state.startTime) {
            if (this.state.thisTime == 4) {
                url = url + `&startTime=${moment().format('YYYY-MM-DD ') + "00:00:00"}&endTime=${moment().format('YYYY-MM-DD ') + "23:59:59"}`
            } else {
                url = url + `&startTime=${this.state.startTime.format('YYYY-MM-DD ') + "00:00:00"}&endTime=${this.state.endTime.format('YYYY-MM-DD ') + "23:59:59"}`
            }

        } else {
            if (this.state.thisTime == 1) {
                url = url + `&startTime=${moment().year(moment().year()).startOf('year').format('YYYY-MM-DD ') + "00:00:00"}&endTime=${moment().year(moment().year()).endOf('year').format('YYYY-MM-DD ') + "23:59:59"}`
            }
            if (this.state.thisTime == 2) {
                url = url + `&startTime=${moment().month(moment().month()).startOf('month').format('YYYY-MM-DD ') + "00:00:00"}&endTime=${moment().month(moment().month()).endOf('month').format('YYYY-MM-DD ') + "23:59:59"}`
            }
            if (this.state.thisTime == 3) {
                url = url + `&startTime=${moment().week(moment().week()).startOf('week').format('YYYY-MM-DD ') + "00:00:00"}&endTime=${moment().week(moment().week()).endOf('week').format('YYYY-MM-DD ') + "23:59:59"}`
            }
            if (this.state.thisTime == 4) {
                url = url + `&startTime=${moment().format('YYYY-MM-DD ') + "00:00:00"}&endTime=${moment().format('YYYY-MM-DD ') + "23:59:59"}`
            }
        }
        if (this.state.searcher) {
            url = url + `&searcher=${this.state.searcher}`
        }
        axios.get(findAcmlog(this.state.pageSize, this.state.currentPageNum) + url).then(res => {
            
            this.setState({
                data: res.data.data
            })
        })
    }
    //选择月
    selectChange = (v) => {
        this.setState({
            thisTime: v
        })
    }
    //选择时间段
    onRangePickerChange = (v) => {
        if (v.length == 0) {
            this.setState({
                startTime: null,
                endTime: null
            })
        }
        if (v.length > 1) {
            this.setState({
                startTime: v[0],
                endTime: v[1]
            })
        }

    }
    //控制日期
    onControl = (current, partial) => {
        //获取本年
        const { thisTime } = this.state
        let startDate, endDate
        if (thisTime == 1) {
            startDate = moment().year(moment().year()).startOf('year').valueOf();
            endDate = moment().year(moment().year()).endOf('year').valueOf();
        }
        if (thisTime == 2) {
            //获取本月 
            startDate = moment().month(moment().month()).startOf('month').valueOf();
            endDate = moment().month(moment().month()).endOf('month').valueOf();
        }
        if (thisTime == 3) {
            //获取本周
            startDate = moment().week(moment().week()).startOf('week').format('YYYY-MM-DD');   //这样是年月日的格式
            endDate = moment().week(moment().week()).endOf('week').valueOf(); //这样是时间戳的格式
        }
        if (thisTime == 4) {
            //获取本日
            startDate = moment().valueOf();
            this.setState({
                startTime: moment(new Date()),
                endTime: moment(new Date())
            })
            return current < moment(new Date(startDate - 24 * 60 * 60 * 1000)) || current > moment(new Date(startDate))
        }

        return current < moment(new Date(startDate)) || current > moment(new Date(endDate))
    }
    //上一页
    toUP = () => {
        const { currentPageNum } = this.state
        const seleEm=document.querySelector(".logtable")
         //滚动条回到顶部
        seleEm.scrollTop=0
        this.setState({
            currentPageNum: currentPageNum - 1
        }, () => {
            this.getDataList()
        })

    }
    //下一页
    toNext = () => {
        const seleEm=document.querySelector(".logtable")
        //滚动条回到顶部
        seleEm.scrollTop=0
        const { currentPageNum } = this.state
        this.setState({
            currentPageNum: currentPageNum + 1
        }, () => {
            this.getDataList()
        })
    }
    render() {
        const { intl } = this.props.currentLocale
        const columns = [
            // {
            //     title: intl.get("wsd.i18n.sys.three.sort"),
            //     dataIndex: 'id',
            //     key: 'id',

            //     title: intl.get("wsd.i18n.sys.three.swname"),
            //     dataIndex: 'applicationName',
            //     key: 'applicationName',
            // },
            // {
            //     title: intl.get("wsd.i18n.sys.three.logtype"),
            //     dataIndex: 'loggerType',
            //     key: 'loggerType',
            // },
            {
                title: '状态',
                dataIndex: 'recordStatusVo.name',
                key: 'recordStatusVo.name',
                render: (text, record) => {
                    return <span >{text?text:''}</span>
                }
            },
            {
                title: '日期',
                dataIndex: 'recordTime',
                key: 'recordTime',
                render: (text, record) => {
                    return <span >{text?text:''}</span>
                }
            },
            {
                title: '线路',
                dataIndex: 'line',
                key: 'line',
                render: (text, record) => {
                    return <span >{text?text + '号线':''}</span>
                }
            },
            {
                title: intl.get("wsd.i18n.sys.three.modename"),
                dataIndex: 'moduleName',
                key: 'moduleName',
            },
            {
                title: intl.get("wsd.i18n.sys.three.opratename"),
                dataIndex: 'operationName',
                key: 'operationName',
            },
            {
                title: intl.get("wsd.i18n.sys.three.oprater"),
                dataIndex: 'operationUser',
                key: 'operationUser',
            },
            {
                title: intl.get("wsd.i18n.sys.three.opratetime"),
                dataIndex: 'creatTime',
                key: 'creatTime',
                // render: (text) => dataUtil.Dates().formatDateString(text)
            },
            {
                title: intl.get("wsd.i18n.sys.three.accessIP"),
                dataIndex: 'ipAddress',
                key: 'ipAddress',
            },
            {
                title: intl.get("wsd.i18n.sys.three.descr"),
                dataIndex: 'operationDesc',
                key: 'operationDesc',
            },
            {
                title: intl.get("wsd.i18n.sys.three.result"),
                dataIndex: 'operationResult',
                key: 'operationResult',
            },
            {
                title: intl.get("wsd.i18n.sys.three.error"),
                dataIndex: 'exception',
                key: 'exception',
            },
        ];
        const columnsAdmin = [
            {
                title: intl.get("wsd.i18n.sys.three.modename"),
                dataIndex: 'moduleName',
                key: 'moduleName',
            },
            {
                title: intl.get("wsd.i18n.sys.three.opratename"),
                dataIndex: 'operationName',
                key: 'operationName',
            },
            {
                title: intl.get("wsd.i18n.sys.three.oprater"),
                dataIndex: 'operationUser',
                key: 'operationUser',
            },
            {
                title: intl.get("wsd.i18n.sys.three.opratetime"),
                dataIndex: 'creatTime',
                key: 'creatTime',
            },
            {
                title: intl.get("wsd.i18n.sys.three.accessIP"),
                dataIndex: 'ipAddress',
                key: 'ipAddress',
            },
            {
                title: intl.get("wsd.i18n.sys.three.descr"),
                dataIndex: 'operationDesc',
                key: 'operationDesc',
            },
            {
                title: intl.get("wsd.i18n.sys.three.result"),
                dataIndex: 'operationResult',
                key: 'operationResult',
            },
            {
                title: intl.get("wsd.i18n.sys.three.error"),
                dataIndex: 'exception',
                key: 'exception',
            },
        ];
        // let pagination = {
        //     total: this.state.total,
        //     // hideOnSinglePage: true,
        //     current: this.state.currentPageNum,
        //     pageSize: this.state.pageSize,
        //     showSizeChanger: true,
        //     showQuickJumper: true,
        //     showTotal: total => `每页${this.state.pageSize},共${this.state.total}条`,
        //     onShowSizeChange: (current, size) => {
        //         this.setState({
        //             pageSize: size,
        //             currentPageNum: 1
        //         }, () => {
        //             this.getDataList()
        //         })
        //     },
        //     onChange: (page, pageSize) => {
        //         this.setState({
        //             currentPageNum: page
        //         }, () => {
        //             this.getDataList()
        //         })
        //     }
        // }
        return (
            <div className={style.main}>
                <div className={style.setroleAuditTitle}>
                    <h4>{intl.get("wsd.i18n.sys.three.loglook")}</h4>
                </div>
                <div className={style.setroleAuditSearchMod}>
                    <div className={style.setroleAuditSearch}>
                        {this.props.typeFlag == 1 && <Fragment>
                        <Select allowClear showSearch placeholder="请选择线路" style={{ minWidth: 150, marginRight: 10 }}
                            onChange={value=>{
                                this.setState({
                                    line: value?value:'',
                                    currentPageNum:1
                                }, () => {
                                    this.getDataList()
                                })}}
                            filterOption={(input, option) =>
                                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                            {this.state.lineArr.map(item => {
                                return <Option key={item.value} value={item.value}>{item.title}</Option>
                            })}
                        </Select>
                        <DatePicker style={{ width: 150, marginRight: 10 }} 
                            onChange={value=>{
                                this.setState({
                                    recordTime: value?moment(value).format('YYYY-MM-DD'):'',
                                    currentPageNum:1
                                }, () => { this.getDataList() })}}/></Fragment>}
                        <RangePicker onChange={this.onRangePickerChange} disabledDate={this.onControl} disabled={this.state.thisTime == 4} value={this.state.thisTime == 4 ? [moment(), moment()] : [this.state.startTime ? this.state.startTime : null, this.state.endTime ? this.state.endTime : null]} />
                        <Select style={{ width: 200, marginRight: 20 }} onChange={this.selectChange} value={this.state.thisTime}>
                            <Option value={1}>{intl.get("wsd.i18n.sys.three.year")}</Option>
                            <Option value={2}>{intl.get("wsd.i18n.sys.three.month")}</Option>
                            <Option value={3}>{intl.get("wsd.i18n.sys.three.week")}</Option>
                            <Option value={4}>{intl.get("wsd.i18n.sys.three.day")}</Option>
                        </Select>
                        {/* <MonthPicker onChange={this.onChange} placeholder="Select month" locale={zhCN}/> */}
                        <Search
                            placeholder={intl.get("wsd.i18n.sys.three.placeholder")}
                            enterButton={intl.get("wsd.i18n.sys.three.placeholderlook")}
                            onSearch={value => {
                                if (!value || value.trim() != "") {
                                    this.setState({
                                        searcher: value,
                                        currentPageNum:1
                                    }, () => {
                                        this.getDataList()
                                    })
                                } else {
                                    this.setState({
                                        currentPageNum:1
                                    },()=>{
                                        this.getDataList()
                                    })
                                   
                                }

                            }}
                            style={{ width: 200 }}
                        />
                    </div>
                    {/* <Button className={style.setroleAuditBtn}>
                        <Icon type="upload" />
                        {intl.get("wsd.i18n.sys.three.export")}
                    </Button> */}
                </div>
                <div>
                    <div style={{ height: this.props.height - 78, overflow: "auto" }}  className="logtable">
                        <Table
                            columns={this.props.typeFlag == 0 ? columnsAdmin : columns}
                           
                            pagination={false}
                            rowKey={record => record.id}
                            dataSource={this.state.data}
                            size="small" />
                        <div style={{padding:"10px 0"}}>
                            <Button size="small" onClick={this.toUP} disabled={this.state.currentPageNum == 1} style={{marginRight:10}}>上一页</Button>
                            <Button size="small" onClick={this.toNext} disabled={this.state.data.length < this.state.pageSize}>下一页</Button>
                        </div>
                    </div>

                </div>

            </div>
        )
    }
}


export default connect(state => ({ currentLocale: state.localeProviderData }))(Log);