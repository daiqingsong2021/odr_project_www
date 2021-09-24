import React, { Component } from 'react'
import style from './style.less'
import { Form, Row, Col, Input, Button, Icon, Select, Divider, Upload, notification, Modal, InputNumber } from 'antd';
import { connect } from 'react-redux';
import moment from "moment"
import axios from "../../../../../api/axios"
import { calendarInfo, calendarweekdaysupdate, getTimeInfo } from "../../../../../api/api"
export class StandardSetModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: true,

            startindex: 0,//标记星期几位置
            daytime: 0,
            weektime: 0,
            array: [], //渲染数据
            copyarray: null, //复制数据
            // dayHrCnt: 0,//一天时间
            // weekHrCnt: 0,//一周时间
            // monthHrCnt: 0,
            // yearHrCnt: 0,
            calendars: {}
        }
    }

    componentDidMount() {
        this.getData()
    }
    //获取数据
    getData = () => {

        axios.get(calendarInfo(this.props.data.id)).then(res => {

            this.setState({
                calendars: res.data.data
            }, () => {
                const { calendars } = this.state
                this.setState({
                    dayHrCnt: calendars.dayHrCnt,
                    weekHrCnt: calendars.weekHrCnt,
                    monthHrCnt: calendars.monthHrCnt,
                    yearHrCnt: calendars.yearHrCnt,
                    calName: calendars.calName,
                })
                //初始化
                this.initlData()
            })
        })
    }
    //计算时间
    countTime = () => {
        let time = 0;
        let weekHrCnt = 0;
        if (this.state.calendars.weekDays[this.state.startindex].workingTimes) {
            this.state.calendars.weekDays[this.state.startindex].workingTimes.forEach(itemx => {
                //获取开始小时
                let fromTime = parseInt(itemx.fromTime.substr(0, 2))
                //获取开始分钟
                let fromTimeminutes = itemx.fromTime.substr(3, 2)
                //获取结束小时
                let toTime = parseInt(itemx.toTime.substr(0, 2))
                //获取结束分钟
                let toTimeminutes = itemx.toTime.substr(3, 2)
                let start = fromTime
                let end = (toTime == fromTime && toTimeminutes == "00") ? toTime + 1 : toTime
                if (fromTimeminutes == "30") {
                    start += 0.5
                }
                if (toTimeminutes == "30") {
                    end += 0.5
                }
                let temple = end - start
                time += temple
            })
        }
        this.state.calendars.weekDays.forEach(item => {
            let temptime = 0
            if (item.workingTimes) {
                item.workingTimes.forEach(value => {
                    //获取开始小时
                    let fromTime = parseInt(value.fromTime.substr(0, 2))
                    //获取开始分钟
                    let fromTimeminutes = value.fromTime.substr(3, 2)
                    //获取结束小时
                    let toTime = parseInt(value.toTime.substr(0, 2))
                    //获取结束分钟
                    let toTimeminutes = value.toTime.substr(3, 2)
                    let start = fromTime
                    let end = (toTime == fromTime && toTimeminutes == "00") ? toTime + 1 : toTime
                    if (fromTimeminutes == "30") {
                        start += 0.5
                    }
                    if (toTimeminutes == "30") {
                        end += 0.5
                    }
                    let temple = end - start
                    temptime += temple
                })
            }

            weekHrCnt += temptime
        })
        let monthtime = weekHrCnt * 30
        let yeartime = monthtime * 12
        this.setState({
            dayHrCnt: time,
            weekHrCnt,
            monthHrCnt: monthtime,
            yearHrCnt: yeartime,
        })

    }
    handleInput = (type, value) => {
        if (type == "dayHrCnt") {
            this.setState({
                dayHrCnt: value
            })
        }
        if (type == "weekHrCnt") {
            this.setState({
                weekHrCnt: value
            })
        }
        if (type == "monthHrCnt") {
            this.setState({
                monthHrCnt: value
            })
        }
        if (type == "yearHrCnt") {
            this.setState({
                yearHrCnt: value
            })
        }
        if(type=="calName"){
            this.setState({
                calName: value.currentTarget.value
            })
        }
    }
    handleOk = (e) => {
        let data = {
            id: this.state.calendars.id,
            weekDays: this.state.calendars.weekDays,
            dayHrCnt: this.state.dayHrCnt,
            weekHrCnt: this.state.weekHrCnt,
            monthHrCnt: this.state.monthHrCnt,
            yearHrCnt: this.state.yearHrCnt,
            calName:this.state.calName
        }
        axios.put(calendarweekdaysupdate, data, true).then(res => {
            this.props.refreshRight((new Date()).getTime())
            this.props.refresh(this.state.calendars.id,this.state.calName)
        })

        this.props.handleCancel()
    }
    handleCancel = (e) => {

        this.props.handleCancel()
    }

    //初始化函数，将日期数据转化可视化数组
    initlData = () => {
        let array = []
        //用一个长度为24的数组渲染时间表格，one代表00~30前半个小时 ，two代表30~00后半个小时
        for (let i = 0; i < 24; i++) {
            array.push({
                flow: i,
                unit: {
                    one: false,
                    two: false
                }
            })
        }

        if (this.state.calendars.weekDays[this.state.startindex]) {
            //遍历当前当天工作时间
            if (this.state.calendars.weekDays[this.state.startindex].workingTimes) {
                this.state.calendars.weekDays[this.state.startindex].workingTimes.forEach(itemx => {
                    let fromTime = parseInt(itemx.fromTime.substr(0, 2))
                    let fromTimeminutes = itemx.fromTime.substr(3, 2)
                    let toTime = parseInt(itemx.toTime.substr(0, 2))
                    let toTimeminutes = itemx.toTime.substr(3, 2)
                    let end = toTime;
                    if (toTimeminutes == "30") {
                        end++
                    }
                    let i = fromTime
                    do {
                        //开始时间渲染
                        if (i == fromTime && i != toTime) {
                            if (fromTimeminutes == "00") {
                                array[i].unit.one = true;
                                if (i < toTime) {
                                    array[i].unit.two = true;
                                }
                            }
                            if (fromTimeminutes == "30") {
                                array[i].unit.two = true;
                            }
                        }
                        //中间时间段填充
                        if (i > fromTime && i < toTime) {
                            array[i].unit.one = true;
                            array[i].unit.two = true;
                        }
                        //结尾时间
                        if (i == toTime && i > fromTime) {
                            if (toTimeminutes == "00") {
                                array[i].unit.one = true;
                                array[i].unit.two = true;
                            }
                            if (toTimeminutes == "30") {
                                array[i].unit.one = true;
                            }
                        }
                        //半小时，一小时判断
                        if (i == fromTime && i == toTime) {
                            if (fromTimeminutes == "00" && toTimeminutes == "00") {
                                array[i].unit.one = true;
                                array[i].unit.two = true;
                            }
                            if (fromTimeminutes == "00" && toTimeminutes == "30") {
                                array[i].unit.one = true;
                            }
                            if (fromTimeminutes == "30" && toTimeminutes == "00") {
                                array[i].unit.two = true;
                            }
                        }
                        i++
                    }
                    while (i < end)
                })

            }

        }
        this.setState({
            array: array
        }, () => {
            // this.countTime()
        })
    }
    //切换星期函数
    handleClickWeek = (index) => {

        this.setState({
            startindex: index
        }, () => {
            //初始渲染数据
            this.initlData()

        })

    }
    //数组转化时间格式
    ArrayToTime = () => {

        const { calendars, startindex, array } = this.state
        let workingTimes = [];
        let flag = true;
        let start, end

        array.forEach((value, index, array) => {
            if (flag) {

                if (value.unit.one) {
                    flag = false;
                    if (index >= 10) {
                        start = index + ":00:00"
                    } else {
                        start = "0" + index + ":00:00"
                    }
                    //半小时
                    if (!value.unit.two) {
                        if (index >= 10) {
                            end = index + ":30:00"
                        } else {
                            end = "0" + index + ":30:00"
                        }
                        workingTimes.push(
                            {
                                fromTime: start,
                                toTime: end
                            }
                        )
                        flag = true
                    }
                    //一小时
                    if (value.unit.two && (index + 1 < array.length) && (!array[index + 1].unit.one) || value.unit.two && (index + 1 == array.length)) {
                        if (index + 1 >= 10) {
                            end = index + 1 + ":00:00"
                        } else {
                            end = "0" + (index + 1) + ":00:00"
                        }
                        workingTimes.push(
                            {
                                fromTime: start,
                                toTime: end
                            }
                        )
                        flag = true
                    }
                }
                if (value.unit.two && !value.unit.one) {
                    flag = false;
                    if (index >= 10) {
                        start = index + ":30:00"
                    } else {
                        start = "0" + index + ":30:00"
                    }
                    //半小时
                    if ((index + 1 < array.length) && !array[index + 1].unit.one || (index + 1 == array.length)) {
                        if (index + 1 >= 10) {
                            end = index + 1 + ":00:00"
                        } else {
                            end = "0" + (index + 1) + ":00:00"
                        }
                        workingTimes.push(
                            {
                                fromTime: start,
                                toTime: end
                            }
                        )
                        flag = true
                    }
                }
            }
            if (!flag) {
                if (!value.unit.one && index - 1 > 0 && array[index - 1].unit.two) {
                    if (index + 1 >= 10) {
                        end = index + ":00:00"
                    } else {
                        end = "0" + index + ":00:00"
                    }
                    workingTimes.push(
                        {
                            fromTime: start,
                            toTime: end
                        }
                    )
                    flag = true
                }
                if (!value.unit.two && value.unit.one) {
                    if (index + 1 >= 10) {
                        end = index + ":30:00"
                    } else {
                        end = "0" + index + ":30:00"
                    }
                    workingTimes.push(
                        {
                            fromTime: start,
                            toTime: end
                        }
                    )
                    flag = true
                }
            }


        })
        calendars.weekDays[startindex].workingTimes = workingTimes
        if (workingTimes.length == 0) {
            calendars.weekDays[startindex].dayWorking = 0
        } else {
            calendars.weekDays[startindex].dayWorking = 1
        }

        this.setState({
            calendars: calendars
        }, () => {
            // this.countTime()
        })
    }
    changeColor(index, lr) {
        const { array } = this.state
        //判断是前半段时间还是后半段时间点击触发
        let oneOrTwo = "one"
        if (lr == "two") {
            oneOrTwo = "two"
        }
        if (array[index].unit[oneOrTwo]) {
            array[index].unit[oneOrTwo] = false;
            this.setState({
                array: array
            }, () => {

                this.ArrayToTime()
            })
        } else {
            array[index].unit[oneOrTwo] = true;
            this.setState({
                array: array
            }, () => {
                this.ArrayToTime()
            })
        }
    }
    //复制
    copytime = () => {
        const { intl } = this.props.currentLocale
        const { array } = this.state
        this.setState({
            copyarray: array
        }, () => {
            notification.success(
                {
                    placement: 'bottomRight',
                    bottom: 50,
                    duration: 2,
                    message: intl.get('wsd.i18n.sys.basicd.templated.reminder'),
                    description: intl.get('wsd.i18n.sys.basicd.templated.copy') + intl.get('wsd.i18n.sys.basicd.templated.succeed')
                }
            )
        })
    }
    //粘贴
    pastetime = () => {
        const { intl } = this.props.currentLocale
        const { copyarray } = this.state
        if(copyarray){
            this.setState({
                array: copyarray
            }, () => {
                this.ArrayToTime()
                notification.success(
                    {
                        placement: 'bottomRight',
                        bottom: 50,
                        duration: 2,
                        message: intl.get('wsd.i18n.sys.basicd.templated.reminder'),
                        description: intl.get('wsd.i18n.sys.basicd.templated.paste') + intl.get('wsd.i18n.sys.basicd.templated.succeed')
                    }
                )
            })
        }else{
            notification.warning(
                {
                    placement: 'bottomRight',
                    bottom: 50,
                    duration: 2,
                    message:"提示",
                    description: "请先选择复制"
                }
            )
        }
        
    }
    render() {
        const { intl } = this.props.currentLocale;
        const week = ["日", "一", "二", "三", "四", "五", "六"]


        return (
            <div>

                <Modal className={style.main} width="850px"
                    centered={true}
                    // 标准周设置
                    title={intl.get('wsd.i18n.sys.basicd.templated.standardweeklysetting')}
                    visible={true}
                    onCancel={this.props.handleCancel}
                    footer={
                        <div className='modalbtn'>
                            {/* 取消 */}
                            <Button key="submit" onClick={this.props.handleCancel}>{intl.get('wsd.global.btn.cancel')}</Button>
                            {/* 保存 */}
                            <Button key="submit1" type="primary" onClick={this.handleOk}>{intl.get('wsd.global.btn.preservation')}</Button>
                        </div>
                    }>
                    <div >
                        <div className={style.hint}>
                            {/* 标准 */}
                            <div className={style.icon1}><a>{intl.get('wsd.i18n.sys.basicd.templated.standard')}:</a><div className={style.color}></div></div>
                            {/* 非工作 */}
                            <div className={style.icon2}><a>{intl.get('wsd.i18n.sys.basicd.templated.nonworking')}:</a><div className={style.color1}></div></div>
                        </div>
                        <div className={style.standardset}>

                            <div className={style.week}>
                                {/* 星期 */}
                                <span>{intl.get('wsd.i18n.sys.basicd.templated.week')}：</span>
                                <div className={style.weeklist}>
                                    {week.map((item, i) => <li key={i} className={this.state.startindex == i ? style.current : ""} onClick={this.handleClickWeek.bind(this, i)}>{item}</li>)}
                                </div>
                            </div>
                            <div className={style.content}>
                                <li className={style.first}><div><span className={style.firstH}>(h)</span>:00-:30 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:30-:60(min)</div></li>
                                {this.state.array &&
                                    this.state.array.map((item, index) => {
                                        if (index < 12) {
                                            return <li key={index}>
                                                <div className={style.number}>{index}：</div>
                                                <div className={item.unit.one ? style.contentchild1 : style.contentchild} onClick={this.changeColor.bind(this, index, "one")}></div>
                                                <div className={item.unit.two ? style.contentchild1 : style.contentchild} onClick={this.changeColor.bind(this, index, "two")}></div>
                                            </li>
                                        }

                                    })
                                }
                            </div>
                            <div className={style.content}>
                                <li className={style.first}><div><span className={style.firstH}>(h)</span>:00-:30 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:30-:60(min)</div></li>
                                {this.state.array &&
                                    this.state.array.map((item, index) => {
                                        if (index >= 12) {
                                            return <li key={index}>
                                                <div className={style.number}>{index}：</div>
                                                <div className={item.unit.one ? style.contentchild1 : style.contentchild} onClick={this.changeColor.bind(this, index, "one")}></div>
                                                <div className={item.unit.two ? style.contentchild1 : style.contentchild} onClick={this.changeColor.bind(this, index, "two")}></div>
                                            </li>
                                        }
                                    })
                                }
                            </div>
                            <div className={style.btn}>
                                <Button onClick={this.copytime}>{intl.get('wsd.i18n.sys.basicd.templated.copy')}</Button>
                                <br />
                                <Button onClick={this.pastetime}>{intl.get('wsd.i18n.sys.basicd.templated.paste')}</Button>
                            </div>
                        </div>
                        <Divider />

                        <div className={style.resultt}>
                            <div className={style.lesad}>
                                <span >日历名称：<Input style={{width:180}} value={this.state.calName} onChange={this.handleInput.bind(this, "calName")} maxLength={33}/></span>
                            </div>
                            <div>
                                <div className={style.formitem}><InputNumber min={0} value={this.state.dayHrCnt} onChange={this.handleInput.bind(this, "dayHrCnt")} />{intl.get('wsd.i18n.sys.basicd.templated.hour')}/{intl.get('wsd.i18n.sys.basicd.templated.sky')}</div>
                                <div className={style.formitem}><InputNumber min={0} value={this.state.weekHrCnt} onChange={this.handleInput.bind(this, "weekHrCnt")} />{intl.get('wsd.i18n.sys.basicd.templated.hour')}/{intl.get('wsd.i18n.sys.basicd.templated.complete')}</div>
                                <br />
                                <div className={style.formitem}><InputNumber min={0} value={this.state.monthHrCnt} onChange={this.handleInput.bind(this, "monthHrCnt")} />{intl.get('wsd.i18n.sys.basicd.templated.hour')}/{intl.get('wsd.i18n.sys.basicd.templated.month')}</div>
                                <div className={style.formitem}><InputNumber min={0} value={this.state.yearHrCnt} onChange={this.handleInput.bind(this, "yearHrCnt")} />{intl.get('wsd.i18n.sys.basicd.templated.hour')}/{intl.get('wsd.i18n.sys.basicd.templated.annual')}</div>
                            </div>

                        </div>


                    </div>
                </Modal>

            </div>
        )
    }
}

export default connect(state =>
    ({
        currentLocale: state.localeProviderData,
    }))(StandardSetModal);