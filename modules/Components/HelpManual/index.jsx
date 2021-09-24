import React, { Component } from 'react'

import { connect } from 'react-redux';

import { Table, Col, Input, Row, Select } from 'antd';
import MyIcon from "../../../components/public/TopTags/MyIcon"
import style from './style.less';
import axios from "axios"
import { getFileHelp, downHelp } from "../../../api/api"
import * as util from "../../../utils/util"
import * as baseURL from "../../../api/config";
// 创建axios默认请求

class CodeRule extends Component {
    constructor(props) {
        super(props)
        this.state = {
            info: {}
        }
    }

    componentDidMount() {
        axios.get(getFileHelp).then(res => {
            this.setState({
                helpList: res.data.data
            })
        })
    }
    downLoad = (url) => {
        axios.defaults.baseURL = baseURL.baseURL;
        // 配置请求拦截
        axios.interceptors.request.use(config => {
            if (sessionStorage.getItem('token')) {
                config.headers['Authorization'] = sessionStorage.getItem('token');
                config.headers['Content-Type'] = 'application/json';
            }
            return config;
        });
       
        let array = url.split("/")
        axios({
            method: 'get',
            url: downHelp(array[array.length - 1]),
            responseType: 'blob'
        }).then(res => {
            if(res.data.status==500){
                return
            }
          
            let data = new Blob([res.data], { type: "text/plain;charset=UTF-8" });
            let downloadUrl = window.URL.createObjectURL(data);
            let anchor = document.createElement("a");
            anchor.href = downloadUrl;
            //设置文件名
            anchor.download =array[array.length - 1];
            anchor.click();
            window.URL.revokeObjectURL(data);
        })

    }
    render() {
        const { intl } = this.props.currentLocale

        return (
            <div className={style.main} style={{ height: this.props.height + 40 }}>
                <div className={style.back}>
                    <h1>功能介绍</h1>
                    <ul>
                        {this.state.helpList && this.state.helpList.map((item, i) => {
                            return <li key={i}><span><i className={style.icon}></i>{item.name}</span><MyIcon type="icon-xiazai-" style={{ fontSize: 18, verticalAlign: "bottom", color: "#1890ff" }} onClick={this.downLoad.bind(this, item.url)} /></li>
                        })}

                    </ul>


                </div>

            </div>
        )
    }
}
const mapStateToProps = state => {
    return {
        currentLocale: state.localeProviderData,
    }
};


export default connect(mapStateToProps, null)(CodeRule);