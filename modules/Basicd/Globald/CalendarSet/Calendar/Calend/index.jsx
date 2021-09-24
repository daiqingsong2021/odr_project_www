import React, { Component } from 'react'
import Link from 'next/link'
import { Input } from 'antd';
import style from './style.less'
import Router from 'next/router'
import { connect } from 'react-redux'

function group(array, subGroupLength) {
    let index = 0;
    let newArray = [];
    while (index < array.length) {
        newArray.push(array.slice(index, index += subGroupLength));
    }
    return newArray;
}

class Calend extends Component {
    constructor(props) {
        super(props)
        this.state = {
            bagcolor: '#bfbfc4',
            color: '#cde1f5',
            year: 0,
            kg: 0,
            kg2: [],
            mouth: [],
            exceptionData: [],
            onemouth: [],
            mouth2: [],
            mouth3: [],
            mouth4: [],
            mouth5: [],
            mouth6: [],
            mouth7: [],
            mouth8: [],
            mouth9: [],
            mouth10: [],
            mouth11: [],
            mouth12: [],
            selectedItem: '',
        }
    }

    exceptions = (data) => {
        let newData = []
        data.map((item, i) => {
            let aa = item.fromDate.split('-').splice(1, 2)  //时间处理
            let newData2 = []
            aa.map((val) => {
                newData2.push(parseInt(val))
            })
            newData.push(newData2)
        })
        this.setState({
            exceptionData: newData
        })
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.exceptionData) {
            this.exceptions(nextProps.exceptionData)
            // this.setState({
            //     exceptionData: nextProps.exceptionData
            // })
        }
        let year = nextProps.year
        this.setState({
            year: year
        })
        let kg = nextProps.weekTime
        let kg2 = nextProps.weekTime2
        this.setState({
            kg2: kg2
        }, function () {
            var aa = []; var a2 = []; var a3 = []; var a4 = []; var a5 = []; var a6 = []; var a7 = []; var a8 = []; var a9 = []; var a10 = []; var a11 = []; var a12 = [];
            //1月
            for (let i = 1; i <= this.state.kg2[0]; i++) {
                aa.push('')
            }
            for (let j = 1; j <= 31; j++) {
                aa.push(j)
            }
            let last1 = 7 - aa.length % 7
            for (let l = 1; l <= last1; l++) {
                aa.push('')
            }
            let groupedArray = group(aa, 7);
            // let bb = []
            // for (let k = 0; k < groupedArray.length; k++) {
            //     bb.push(group(groupedArray[k], 1))
            // }
            // this.setState({
            //     onemouth: bb
            // })
            //2月
            for (let i = 1; i <= this.state.kg2[1]; i++) {
                a2.push('')
            }
            if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
                for (let j = 1; j <= 29; j++) {
                    a2.push(j)
                }
            } else {
                for (let j = 1; j <= 28; j++) {
                    a2.push(j)
                }
            }
            let last2 = 7 - a2.length % 7
            for (let l = 1; l <= last2; l++) {
                a2.push('')
            }
            let groupedArray2 = group(a2, 7);
            let b2 = []
            for (let k = 0; k < groupedArray2.length; k++) {
                b2.push(group(groupedArray2[k], 1))
            }
            // this.setState({
            //     mouth2: b2
            // })
            //3月
            for (let i = 1; i <= this.state.kg2[2]; i++) {
                a3.push('')
            }
            for (let j = 1; j <= 31; j++) {
                a3.push(j)
            }
            let last3 = 7 - a3.length % 7
            for (let l = 1; l <= last3; l++) {
                a3.push('')
            }
            let groupedArray3 = group(a3, 7);
            let b3 = []
            for (let k = 0; k < groupedArray3.length; k++) {
                b3.push(group(groupedArray3[k], 1))
            }
            // this.setState({
            //     mouth3: b3
            // })
            //4月
            for (let i = 1; i <= this.state.kg2[3]; i++) {
                a4.push('')
            }
            for (let j = 1; j <= 30; j++) {
                a4.push(j)
            }
            let last4 = 7 - a4.length % 7
            for (let l = 1; l <= last4; l++) {
                a4.push('')
            }
            let groupedArray4 = group(a4, 7);
            let b4 = []
            for (let k = 0; k < groupedArray4.length; k++) {
                b4.push(group(groupedArray4[k], 1))
            }
            // this.setState({
            //     mouth4: b4
            // })
            //5月
            for (let i = 1; i <= this.state.kg2[4]; i++) {
                a5.push('')
            }
            for (let j = 1; j <= 31; j++) {
                a5.push(j)
            }
            let last5 = 7 - a5.length % 7
            for (let l = 1; l <= last5; l++) {
                a5.push('')
            }
            let groupedArray5 = group(a5, 7);
            let b5 = []
            for (let k = 0; k < groupedArray5.length; k++) {
                b5.push(group(groupedArray5[k], 1))
            }
            // this.setState({
            //     mouth5: b5
            // })
            //6月
            for (let i = 1; i <= this.state.kg2[5]; i++) {
                a6.push('')
            }
            for (let j = 1; j <= 30; j++) {
                a6.push(j)
            }
            let last6 = 7 - a6.length % 7
            for (let l = 1; l <= last6; l++) {
                a6.push('')
            }
            let groupedArray6 = group(a6, 7);
            let b6 = []
            for (let k = 0; k < groupedArray6.length; k++) {
                b6.push(group(groupedArray6[k], 1))
            }
            // this.setState({
            //     mouth6: b6
            // })
            //7月
            for (let i = 1; i <= this.state.kg2[6]; i++) {
                a7.push('')
            }
            for (let j = 1; j <= 31; j++) {
                a7.push(j)
            }
            let last7 = 7 - a7.length % 7
            for (let l = 1; l <= last7; l++) {
                a7.push('')
            }
            let groupedArray7 = group(a7, 7);
            let b7 = []
            for (let k = 0; k < groupedArray7.length; k++) {
                b7.push(group(groupedArray7[k], 1))
            }
            // this.setState({
            //     mouth7: b7
            // })
            //8月
            for (let i = 1; i <= this.state.kg2[7]; i++) {
                a8.push('')
            }
            for (let j = 1; j <= 31; j++) {
                a8.push(j)
            }
            let last8 = 7 - a8.length % 7
            for (let l = 1; l <= last8; l++) {
                a8.push('')
            }
            let groupedArray8 = group(a8, 7);
            let b8 = []
            for (let k = 0; k < groupedArray8.length; k++) {
                b8.push(group(groupedArray8[k], 1))
            }
            // this.setState({
            //     mouth8: b8
            // })
            //9月
            for (let i = 1; i <= this.state.kg2[8]; i++) {
                a9.push('')
            }
            for (let j = 1; j <= 30; j++) {
                a9.push(j)
            }
            let last9 = 7 - a9.length % 7
            for (let l = 1; l <= last9; l++) {
                a9.push('')
            }
            let groupedArray9 = group(a9, 7);
            let b9 = []
            for (let k = 0; k < groupedArray9.length; k++) {
                b9.push(group(groupedArray9[k], 1))
            }
            // this.setState({
            //     mouth9: b9
            // })
            //10月
            for (let i = 1; i <= this.state.kg2[9]; i++) {
                a10.push('')
            }
            for (let j = 1; j <= 31; j++) {
                a10.push(j)
            }
            let last10 = 7 - a10.length % 7
            for (let l = 1; l <= last10; l++) {
                a10.push('')
            }
            let groupedArray10 = group(a10, 7);
            let b10 = []
            for (let k = 0; k < groupedArray10.length; k++) {
                b10.push(group(groupedArray10[k], 1))
            }
            // this.setState({
            //     mouth10: b10
            // })
            //11月
            for (let i = 1; i <= this.state.kg2[10]; i++) {
                a11.push('')
            }
            for (let j = 1; j <= 30; j++) {
                a11.push(j)
            }
            let last11 = 7 - a11.length % 7
            for (let l = 1; l <= last11; l++) {
                a11.push('')
            }
            let groupedArray11 = group(a11, 7);
            let b11 = []
            for (let k = 0; k < groupedArray11.length; k++) {
                b11.push(group(groupedArray11[k], 1))
            }
            // this.setState({
            //     mouth11: b11
            // })
            //12月
            for (let i = 1; i <= this.state.kg2[11]; i++) {
                a12.push('')
            }
            for (let j = 1; j <= 31; j++) {
                a12.push(j)
            }
            let last12 = 7 - a12.length % 7
            for (let l = 1; l <= last12; l++) {
                a12.push('')
            }
            let groupedArray12 = group(a12, 7);
            let b12 = []
            for (let k = 0; k < groupedArray12.length; k++) {
                b12.push(group(groupedArray12[k], 1))
            }
            // this.setState({
            //     mouth12: b12
            // })

            let data = [
                [...groupedArray],
                [...groupedArray2],
                [...groupedArray3],
                [...groupedArray4],
                [...groupedArray5],
                [...groupedArray6],
                [...groupedArray7],
                [...groupedArray8],
                [...groupedArray9],
                [...groupedArray10],
                [...groupedArray11],
                [...groupedArray12],
            ]
            this.setState({
                mouth: data
            })

        })
    }
    changeColor(v) {
        if(v==this.state.selectedItem){
            this.setState({
                selectedItem: '',
            })
            this.props.cancelCilick()
            return 
        }
      
        this.setState({
            selectedItem: v
        })

        let date = v.split('-');
        for (let i = 0; i < date.length; i++) {
            if (date[i] < 10) {
                date[i] = '0' + date[i]
            }
        }
        let newDate = date.join('-');
        this.props.clickDate(newDate, v);


    }
    render() {
        const {intl} = this.props.currentLocale;
        return (
            <div className={style.acmhj}>
                {this.state.mouth.map((item, index) => {
                    return (
                        <div className={style.data} key={index}>
                            <table>
                                <tbody>
                                    <tr>
                                        <td colSpan={7} className={style.day} height={24} align='center'>{index + 1} {intl.get('wsd.i18n.sys.basicd.templated.month')} </td>
                                    </tr>
                                    <tr className={style.trcontent}>
                                        <td>日</td><td>一</td><td>二</td><td>三</td><td>四</td><td>五</td><td>六</td>
                                    </tr>
                                    {
                                        item.map((val, i) => {
                                            return <tr key={i} className={style.trcontent}>
                                                {
                                                    val.map((childitem, childindex) => {

                                                        let date = `${this.state.year}-${index + 1}-${childitem}`
                                                        let aaa = this.props.newExceptionData.findIndex(item => item == date);

                                                        return childitem == '' ? (
                                                            <td key={childindex} >{childitem}</td>
                                                        ) : (
                                                                this.props.weekDaysData.length ? (this.props.weekDaysData[childindex].dayWorking ?
                                                                    (<td key={childindex} onClick={this.changeColor.bind(this, date)} onDoubleClick={this.props.cancelExceptionData.bind(this,date)}
                                                                        style={aaa >= 0 ? { backgroundColor: '#ffa531' } : (this.state.selectedItem == date ? { backgroundColor: '#edecec' } : { backgroundColor: '#cee2f6' })}>{childitem}</td>)
                                                                    :
                                                                    (<td key={childindex} onClick={this.changeColor.bind(this, date)} onDoubleClick={this.props.cancelExceptionData.bind(this,date)}
                                                                        style={aaa >= 0 ? { backgroundColor: '#ffa531' } : (this.state.selectedItem == date ? { backgroundColor: '#edecec' } : { backgroundColor: '#bfbfc4' })}>{childitem}</td>)
                                                                ) : <td key={childindex} onClick={this.changeColor.bind(this, date)} onDoubleClick={this.props.cancelExceptionData.bind(this,date)}
                                                                    style={aaa >= 0 ? { backgroundColor: '#ffa531' } : (this.state.selectedItem == date ? { backgroundColor: '#edecec' } : { backgroundColor: '#cee2f6' })}>{childitem}</td>

                                                            )
                                                    })
                                                }
                                            </tr>
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                    )
                })}

            </div>
        )
    }
}
export default connect(state=>({
    currentLocale: state.localeProviderData
}))(Calend)

