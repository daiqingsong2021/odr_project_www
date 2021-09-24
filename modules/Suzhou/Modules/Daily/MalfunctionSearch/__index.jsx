import React, { Component } from 'react'
import { Table, notification } from 'antd'
import style from './style.less'
import { connect } from 'react-redux'
import { changeLocaleProvider } from '@/store/localeProvider/action'
import * as util from '@/utils/util';
import * as dataUtil from '@/utils/dataUtil';
import { } from '@/modules/Suzhou/api/suzhou-api';
import axios from '@/api/axios';
import notificationFun from '@/utils/notificationTip';

class SitutionTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            src: 'http://192.168.2.68:8011/webroot/decision/view/form?viewlet=%25E6%2595%2585%25E9%259A%259C%25E6%2597%25A5%25E5%2586%25B5%25E6%259F%25A5%25E8%25AF%25A2.frm'
        }
    }
    
    render() {
        return (
            <div>
                <iframe className={style.content} frameBorder="0" allowFullScreen src={this.state.src} />
            </div>
        )
    }
}
export default connect(state => ({
    currentLocale: state.localeProviderData
}), {
    changeLocaleProvider
})(SitutionTable);