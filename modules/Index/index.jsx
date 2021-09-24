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

class DrivingTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            src: ''
        }
    }
    componentDidMount(){
        getBaseData('fr_url').then(data => { this.setState({ src: `http://${data[0].value}/webroot/decision/view/form?viewlet=%25E8%25BF%2590%25E8%2590%25A5%25E6%2597%25A5%25E6%258A%25A5%25E9%25A6%2596%25E9%25A1%25B5-%25E6%25A8%25A1%25E6%259D%25BFzll.frm` }) })
        const h = document.documentElement.clientHeight || document.body.clientHeight;   // 浏览器高度，用于设置组件高度
		this.setState({
			height: h - 160,
		});
    }
    render() {
        console.log(this.state)
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
})(DrivingTable);