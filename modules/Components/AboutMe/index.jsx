import React, { Component } from 'react'
import style from './style.less'
import { Form, Row, Col, Input, Button, notification, Modal, TreeSelect } from 'antd';
import { connect } from 'react-redux'
import MyIcon from "../../../components/public/TopTags/MyIcon"
const { TextArea } = Input;
class AddSameLevel extends Component {
    constructor(props) {
        super(props)
        this.state = {
            registrationCode:"48353-78GHS-HHJKB-HKHGJ-GHJKK-GHJKJ 48353-78GHS-HHJKB-HKHGJ-GHJKK-GHJKJ 48353-78GHS-HHJKB-HKHGJ-GHJKK-GHJKJ"

        }
    }
    copyText=()=>{
        let target=document.getElementById("registrationCode")
        target.select(); // 选择对象
        document.execCommand("Copy"); // 执行浏览器复制命令
        notification.success(
            {
              placement: 'bottomRight',
              bottom: 50,
              duration: 2,
              message: '提示',
              description: '复制成功'
            }
          )
    }
    render() {
        const { intl } = this.props.currentLocale
        return (
            <div >
                <Modal title="关于" visible={true}
                    onCancel={this.props.handleCancel}
                    maskStyle={{ backgroundColor: "#cccccc" }}
                    centered={true}
                    footer={null}
                    bodyStyle={{ padding: "0 !important" }}
                    className={style.main}
                >
                    <main>
                        <header><img src="/static/images/logo1.png" style={{width:40,height:40,verticalAlign: -11}}/><span style={{fontSize:20}}>南京维斯德软件有限公司</span></header>
                        <p><span>产品：</span>敏捷协同管理平台</p>
                        <p><span>版本号：</span>v1.1.0</p>
                        <p><span>注册码：</span><TextArea id="registrationCode" rows={2} readOnly value={this.state.registrationCode}/><a href="#" style={{marginLeft:40}} onClick={this.copyText}>复制</a></p>
                        <p><span>有效期：</span>2019-04-22~2019-12-23</p>
                        <p className={style.lg}><span>许可类型：</span>临时许可<a>重新注册许可</a></p>
                        <p><span>授权使用：</span>南京维斯德软件有限公司内部使用</p>
                    </main>
                    <footer>版权所有，翻版必究</footer>
                </Modal>

            </div>
        )
    }
}
const AddSameLevels = Form.create()(AddSameLevel);
export default connect(state => ({
    currentLocale: state.localeProviderData
}))(AddSameLevels);