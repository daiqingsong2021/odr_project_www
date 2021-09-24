import React, { Component } from 'react'
import Link from 'next/link'
import { Input,notification } from 'antd';
import style from './style.less'
import Router from 'next/router'
import Calend from './Calend'
import { connect } from 'react-redux'
import axios from '../../../../../api/axios'
import { calendarDefInfo, calendarInfo, calendarExceptionsUpdate,cancleCalendarExceptions } from '../../../../../api/api'
import { totalmem } from 'os';
import TipModal from "../../../../Components/TipModal"

//日历
class Acm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            bagcolor: '#bfbfc4',
            defualtTime: '',
            weekTime: '',
            weekTime2: [],
            right: [],
            time: [],
            weekDaysData: [],
            exceptionData: [],
            newExceptionData: [],
            newDate: '',
            data: []
        }
    }

    //获取数据
    getData = () => {
        if (this.state.recordId) {
            axios.get(calendarInfo(this.state.recordId)).then(res => {
                if (res.data) {
                    let data = res.data.data;
                    this.dataProcessing(data)
                }
            })
        } else {
            axios.get(calendarDefInfo).then(res => {
                if (res.data) {
                    let data = res.data.data;
                    this.dataProcessing(data)
                }
            })
        }
    }

    dataProcessing = (data) => {

        //重置右侧每日时间安排表数据
        let right = [];
        for (let i = 0; i < 24; i++) {
            right.push([false, false]);
        }

        let newExceptionData = [];
        if (data.exceptions) {
            for (let i = 0; i < data.exceptions.length; i++) {
                let date = data.exceptions[i].fromDate.split('-');
                let newDate = [];
                for (let j = 0; j < date.length; j++) {
                    newDate.push(parseInt(date[j]));
                }
                newDate = newDate.join('-');
                newExceptionData.push(newDate);
            }
        }
        this.setState({
            weekDaysData: data.weekDays,
            exceptionData: data.exceptions,
            newExceptionData,
            data,
            right
        })


    }

    componentDidMount() {

        let firstaa = []
        for (let i = 1; i <= 12; i++) {
            var ss = '2019-' + i + '-1';
            firstaa.push("0123456".charAt(new Date(ss).getDay()))
        }
        this.setState({
            weekTime2: firstaa
        })
        var s = '2019-1-1';
        this.setState({
            weekTime: "0123456".charAt(new Date(s).getDay())
        })
        this.setState({
            defualtTime: new Date().getFullYear(),
        })

        //创造右侧每日时间安排表数据
        let right = [];
        for (let i = 0; i < 24; i++) {
            right.push([false, false]);
        }
        this.setState({ right })
    }

    //生命周期函数-更改props时调用
    componentWillReceiveProps(nextProps) {


        if (nextProps.data) {
          
            if (nextProps.data.id !== this.state.recordId) {
          
                this.setState({
                    recordId: nextProps.data.id
                }, () => {
                    this.getData();
                })
            }else{
                
                this.getData();
            }
        } else {
            this.getData();
           
        }


    }


    changeColor(index, num) {

        let { right } = this.state;

        right[index][num] = right[index][num] ? false : true;

        this.setState({
            right
        })


    }
    changeNumb(e) {
        //校验正整数
        let pattern=/^[1-9]\d*$/
        if(!pattern.test(e.target.value)){
            return
        }else{
            this.setState({
                defualtTime: e.target.value
            }, function () {
                var s = this.state.defualtTime + '-1-1';
                let aa = []
                for (let i = 1; i <= 12; i++) {
                    var ss = this.state.defualtTime + '-' + i + '-1';
                    aa.push("0123456".charAt(new Date(ss).getDay()))
                }
                this.setState({
                    weekTime2: aa
                })
                this.setState({
                    weekTime: "0123456".charAt(new Date(s).getDay())
                })
            })
        }
       
    }
    keep() {
        let { right } = this.state;
        let workingTimes = [];  //保存工作的时间节点
        let dayWorking = 1;     //保存当天是否工作

        /*============ 下方声明 循环使用到 没有实际意义 ======================== */
        let data = {};
        let bbb = {};
        let aaa = {
            fromTime: 1,
            toTime: 1
        }
        /* =============================================================== */

        for (let i = 0; i < right.length; i++) {

            if (right[i][0] == true && right[i][1] == false && (i ? right[i - 1][1] == false : true)) { //  1点到1点半
                data = {
                    fromTime: `${i < 10 ? '0' + i : i}:00:00`,
                    toTime: `${i < 10 ? '0' + i : i}:30:00`
                }
                workingTimes.push(data)
                continue

            } else if (right[i][0] == false && right[i][1] == true && (i == 23 ? true : (right[i + 1][0] == false))) { // 1点半到2点
                data = {
                    fromTime: `${i < 10 ? '0' + i : i}:30:00`,
                    toTime: `${i < 10 ? (i + 1 < 10 ? '0' + (i + 1) : i + 1) : (i == 23 ? '00' : i + 1)}:00:00`
                }
                workingTimes.push(data)
                continue

            } else if (right[i][0] == false && right[i][1] == true && (i < 23 ? (right[i + 1][0] == true && right[i + 1][1] == false) : true)) { //1点半到2点半
                data = {
                    fromTime: `${i < 10 ? '0' + i : i}:30:00`,
                    toTime: `${i < 23 ? (i + 1 < 10 ? '0' + (i + 1) : i + 1) : '00'}:${i < 23 ? '30' : '00'}:00`
                }
                workingTimes.push(data)
                continue

            } else if (right[i][0] == true && right[i][1] == true && (i < 23 ? (right[i + 1][0] == false) : true) && (i ? (right[i - 1][1] == false) : true)) {    //1点到2点
                data = {
                    fromTime: `${i < 10 ? '0' + i : i}:00:00`,
                    toTime: `${i < 23 ? (i + 1 < 10 ? '0' + (i + 1) : i + 1) : '00'}:00:00`
                }
                workingTimes.push(data)
                continue

            } else {

                if (right[i][0] == true && right[i][1] == true) {

                    if ((i < 23 ? true : false) && right[i + 1][0] == false && right[i + 1][1] == false) { //判断是否小于23点 并判断当前是不是连续时间的结束节点
                        if (aaa.toTime == 1) {
                            aaa.toTime = `${i < 23 ? (i + 1 < 10 ? '0' + (i + 1) : i + 1) : '00'}:00:00`;
                            bbb = { ...aaa };   // 把保存开始时间和结束时间的对象赋值给新的对象
                            workingTimes.push(bbb); // 新增到数组中
                            aaa.fromTime = 1;
                            aaa.toTime = 1;
                            continue
                        }
                    }

                    if ((i < 23 ? true : false) && right[i + 1][0] == true && right[i + 1][1] == false) {
                        if (aaa.toTime == 1) {
                            aaa.toTime = `${i < 23 ? (i + 1 < 10 ? '0' + (i + 1) : i + 1) : '00'}:30:00`;
                            bbb = { ...aaa };
                            workingTimes.push(bbb);
                            aaa.fromTime = 1;
                            aaa.toTime = 1;
                            continue
                        }
                    }

                    if ((i < 23 ? true : false) && right[i + 1][0] == false) {
                        if (aaa.toTime == 1) {
                            aaa.toTime = `${i < 23 ? (i + 1 < 10 ? '0' + (i + 1) : i + 1) : '00'}:00:00`;
                            bbb = { ...aaa };
                            workingTimes.push(bbb);
                            aaa.fromTime = 1;
                            aaa.toTime = 1;
                            continue
                        }
                    }

                    if (i == 23 && right[i - 1][0] == true && right[i - 1][1] == true) {    // 当时23点的节点时 判断上一时间节点到本时间节点是否连续
                        if (aaa.toTime == 1) {
                            aaa.toTime = `${i < 23 ? (i + 1 < 10 ? '0' + (i + 1) : i + 1) : '00'}:00:00`;
                            bbb = { ...aaa };
                            workingTimes.push(bbb);
                            aaa.fromTime = 1;
                            aaa.toTime = 1;
                            continue
                        }
                    }


                }
                if (right[i][0] == false && right[i][1] == true && (i < 23 ? (right[i + 1][0] == true && right[i + 1][1] == true) : false)) {   //工作时间从  8点半开始
                    if (aaa.fromTime == 1) {
                        aaa.fromTime = `${i < 10 ? '0' + i : i}:30:00`
                        continue
                    }
                }
                if (right[i][0] == true && right[i][1] == true && (i < 23 ? (right[i + 1][0] == true && right[i + 1][1] == true) : false) && (i ? (right[i - 1][1] == false) : true)) {//工作时间从  8点开始
                    if (aaa.fromTime == 1) {
                        aaa.fromTime = `${i < 10 ? '0' + i : i}:00:00`
                        continue
                    }
                }

            }


        }


        if (workingTimes.length) {     //根据工作时间节点，判断当天是否工作
            dayWorking = 1
        } else {
            dayWorking = 0
        }

        let dayType = new Date(this.state.newDate).getDay(); //周几

        //返回后台的数据

        let body = {
            id: this.state.data.id,
            exceptions: [
                {
                    name: this.state.newDate,
                    dayWorking,
                    dayType: dayType + 1,
                    fromDate: this.state.newDate,
                    toDate: this.state.newDate,
                    workingTimes,
                }
            ]
        }

        if (this.state.newDate) {

            axios.put(calendarExceptionsUpdate, body, true).then(res => {
                this.getData();
            })


        }else{
            notification.warning(
                {
                    placement: 'bottomRight',
                    bottom: 50,
                    duration: 2,
                    message: '提示',
                    description: '请选择日历进行操作'
                }
            )
            return false;
        }



    }

    //例外时间安排处理函数
    exceptionFun = (arr) => {
        let { right } = this.state;

        //重置例外表格
        for (let i = 0; i < 24; i++) {
            right[i][0] = false;
            right[i][1] = false;
        }

        for (let i = 0; i < arr.length; i++) {
            //处理开始时间和结束时间
            let fromTime = arr[i].fromTime.split(':').splice(0, 2);
            let toTime = arr[i].toTime.split(':').splice(0, 2);

            fromTime[0] = parseInt(fromTime[0])
            fromTime[1] = parseInt(fromTime[1])
            toTime[0] = parseInt(toTime[0])
            toTime[1] = parseInt(toTime[1])


            if (fromTime[0] == toTime[0]) { // 是否在同一个小时内
                if (fromTime[1] < toTime[1]) {
                    right[fromTime[0]][0] = true
                }
            } else if (fromTime[0] + 1 == toTime[0] || (fromTime[0] == 23 && toTime[0] == 0)) {//是不是相邻的两个时间段
                if (fromTime[1] < toTime[1]) {  //是不是这个一个半小时
                    right[fromTime[0]][0] = true
                    right[fromTime[0]][1] = true
                    right[toTime[0]][0] = true
                } else if (fromTime[1] == 0 && toTime[1] == 0) { //是不是一个整小时
                    right[fromTime[0]][0] = true
                    right[fromTime[0]][1] = true
                } else if (fromTime[1] == 30 && toTime[1] == 30) { //例如 一点半到两点半
                    right[fromTime[0]][1] = true
                    right[toTime[0]][0] = true
                } else if (fromTime[1] == 30 && toTime[1] == 0) {
                    right[fromTime[0]][1] = true
                }
            } else {
                if (fromTime[1] == 30) { //例如 一点半开始
                    right[fromTime[0]][1] = true  //设置 一点的后半段
                    if (toTime[1] == 30) {  // 例如 四点半结束
                        right[toTime[0]][0] = true  //设置 四点前半段
                        for (let j = fromTime[0] + 1; j < toTime[0]; j++) { //从两点开始循环 四点结束
                            right[j][0] = true
                            right[j][1] = true
                        }
                    } else {    // 四点结束
                        for (let j = fromTime[0] + 1; j < toTime[0]; j++) {
                            right[j][0] = true
                            right[j][1] = true
                        }
                    }
                } else {    //一点开始
                    if (toTime[1] == 30) {  //四点半结束
                        right[toTime[0]][0] = true  //设置四点前半段
                        for (let j = fromTime[0]; j < toTime[0]; j++) {
                            right[j][0] = true
                            right[j][1] = true
                        }
                    } else {
                        for (let j = fromTime[0]; j < toTime[0]; j++) {
                            right[j][0] = true
                            right[j][1] = true
                        }
                    }
                }
            }
        }
        this.setState(
            right
        )
    }
    //取消选中日历
    cancelCilick=()=>{
        let { right } = this.state;

        //重置例外表格
        for (let i = 0; i < 24; i++) {
            right[i][0] = false;
            right[i][1] = false;
        }
        this.setState({  newDate:null ,right})
    }
    clickDate = (newDate, date) => {
        let { exceptionData, newExceptionData, weekDaysData } = this.state;

        if (newExceptionData.find(val => val == date)) { //是否为例外时间

            for (let i = 0; i < exceptionData.length; i++) {  //遍历例外集合
                let data = exceptionData[i];
                if (newDate == data.fromDate) {   //点击的日期是否为与当前例外日期相匹配
                    if (data.dayWorking) {  //是否有工作安排

                        this.exceptionFun(data.workingTimes)
                        this.setState({ newDate })
                    } else {
                        let right = [];
                        for (let i = 0; i < 24; i++) {
                            right.push([false, false]);
                        }
                        this.setState({ right, newDate })
                    }
                }

            }

        } else {
            let week = new Date(newDate).getDay();  //获取星期几
            if (weekDaysData && weekDaysData[week] && weekDaysData[week].dayWorking) {

                this.exceptionFun(weekDaysData[week].workingTimes)
                this.setState({ newDate })
            } else {
                let right = [];
                for (let i = 0; i < 24; i++) {
                    right.push([false, false]);
                }
                this.setState({ right, newDate })
            }
        }






    }
    //取消例外提示
    cancelExceptionData=(date)=>{
        const { exceptionData} = this.state;
        let arr = date.split('-');
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] < 10) {
              
                arr[i] = '0' + arr[i]
            }
        }
        let newDate = arr.join('-');
        let i=exceptionData.findIndex(item=>item.fromDate==newDate)
        if(i>-1){
            this.setState({
                cancelDate:newDate,
                cancleTip:true
            })
        }
    }
    //取消列外
    deleteExceptionData=()=>{
        const {cancelDate}=this.state
        this.setState({cancleTip:false})
        axios.put(cancleCalendarExceptions(this.state.data.id,cancelDate),{}).then(res=>{
            this.getData();
        })
        
    }
    render() {
        const { intl } = this.props.currentLocale;
        
        return (
            <div className={style.main}>
                <div className={style.head}>
                    <h3 className={style.listTitle}>{intl.get('wsd.i18n.sys.basicd.templated.preferences')}</h3>
                    <div className={style.csdc}>
                        {/* 年份 */}
                        <a>{intl.get('wsd.i18n.operate.define.year')}:</a><Input onChange={this.changeNumb.bind(this)} value={this.state.defualtTime} type="number" className={style.userName}  />
                        {/* 标准 */}
                        <a>{intl.get('wsd.i18n.sys.basicd.templated.standard')}:</a><div className={style.color}></div>
                        {/* 非工作 */}
                        <a>{intl.get('wsd.i18n.sys.basicd.templated.nonworking')}:</a><div className={style.color1}></div>
                        {/* 例外 */}
                        <a>{intl.get('wsd.i18n.sys.basicd.templated.exception')}:</a><div className={style.color}></div>
                    </div>

                </div>
                <div className={style.wrapper1190}>
                    <div className={style.left}>

                        <div className={style.center}>
                            <Calend year={this.state.defualtTime} weekTime={this.state.weekTime} weekTime2={this.state.weekTime2} exceptionData={this.state.exceptionData} cancelExceptionData={this.cancelExceptionData}
                                newExceptionData={this.state.newExceptionData} clickDate={this.clickDate} weekDaysData={this.state.weekDaysData} cancelCilick={this.cancelCilick} />
                        </div>
                        {/* 取消例外提示 */}
                        {this.state.cancleTip && <TipModal onOk={this.deleteExceptionData} onCancel={()=>this.setState({cancleTip:false})} title={"取消例外"} content="是否取消例外?" />}
                    </div>
                    <div className={style.right}>
                        <div className={style.content}>
                            <li className={style.first}><div><span className={style.firstH}>(h)</span>:00-:30 &nbsp;&nbsp;&nbsp;:30-:60(min)</div></li>
                            {
                                this.state.right.map((item, index) => {
                                    return <li key={index}>
                                        <div className={style.number}>{index}：</div>
                                        <div className={style.contentchild} id={1} style={item[0] ? { backgroundColor: '#cee2f6' } : { backgroundColor: '#bfbfc4' }}
                                            onClick={this.changeColor.bind(this, index, 0)}></div>
                                        <div className={style.contentchild} id={2} style={item[1] ? { backgroundColor: '#cee2f6' } : { backgroundColor: '#bfbfc4' }}
                                            onClick={this.changeColor.bind(this, index, 1)}></div>
                                    </li>
                                })
                            }
                        </div>
                        {/* 保存 */}
                        <button className={style.keep} onClick={this.keep.bind(this)}>{intl.get('wsd.global.btn.preservation')}</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(state => ({
    currentLocale: state.localeProviderData
}))(Acm)

