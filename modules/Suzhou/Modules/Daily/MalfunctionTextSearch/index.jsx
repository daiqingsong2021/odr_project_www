import React, { Component } from 'react'
import { Table, notification } from 'antd'
import style from './style.less'
import { connect } from 'react-redux'
import { changeLocaleProvider } from '@/store/localeProvider/action'
import { getBaseData } from '@/modules/Suzhou/components/Util/util';
import * as util from '@/utils/util';
import * as dataUtil from '@/utils/dataUtil';
import { } from '@/modules/Suzhou/api/suzhou-api';
import axios from '@/api/axios';
import notificationFun from '@/utils/notificationTip';

class MonthReport extends Component {
    constructor(props) {
        super(props);
        this.state = {
            src: ''
        }
    }
    componentDidMount(){
        getBaseData('fr_url').then(data => { this.setState({ src: `http://${data[0].value}/webroot/decision/view/form?viewlet=%25E6%2595%2585%25E9%259A%259C%25E6%2596%2587%25E6%259C%25AC%25E8%25AF%25A6%25E6%2583%2585%25E6%259F%25A5%25E8%25AF%25A2%25E9%25A1%25B5.frm` }) })
        const h = document.documentElement.clientHeight || document.body.clientHeight;   // 浏览器高度，用于设置组件高度
		this.setState({
			height: h - 160,
		});
    }
    render() {
        return (
            <div>
                <iframe className={style.content} style={{height:this.state.height}} frameBorder="0" allowFullScreen src={this.state.src} />
            </div>
        )
    }
}
export default connect(state => ({
    currentLocale: state.localeProviderData
}), {
    changeLocaleProvider
})(MonthReport);