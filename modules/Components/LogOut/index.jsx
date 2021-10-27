import React, { Component } from 'react'
import style from './style.less'
import { Form, Row, Col, Input, Button, Select, Modal, TreeSelect } from 'antd';
import { connect } from 'react-redux'
import MyIcon from '../../../components/public/TopTags/MyIcon';
import router from 'next/router'
const Option = Select.Option;
const { TextArea } = Input;
const FormItem = Form.Item;
class LogOut extends Component {
    constructor(props) {
        super(props)
        this.state = {

            info: {},

        }
    }


    componentDidMount() {

    }


    handleSubmit=()=>{
        sessionStorage.setItem('userInfo',null)
        sessionStorage.setItem('token',null) 
        router.push('http://192.168.43.250:12000/logout')
    }
    render() {
        const { intl } = this.props.currentLocale
        const {
            getFieldDecorator, getFieldsError, getFieldError, isFieldTouched, getFieldValue
        } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };
        
        return (
            <div className={style.main}>
                <Modal title="注销用户" visible={true}
                    onCancel={this.props.handleCancel}
                    maskStyle={{ backgroundColor: "#cccccc" }}
                    centered={true}
                    width={350}
                    footer={
                        <div >
                            <Button key={2} onClick={e => this.props.handleCancel()} >取消</Button>
                            <Button key={3} onClick={this.handleSubmit} type="primary">确定</Button>
                        </div>
                    }
                >
                  <p className={style.main}>
                      <MyIcon type="icon-guanyuwomen1" style={{fontSize:50,verticalAlign:"middle",marginRight:10}}/>是否退出登录？
                  </p>
                  
                </Modal>

            </div>
        )
    }
}
const LogOuts = Form.create()(LogOut);
export default connect(state => ({
    currentLocale: state.localeProviderData
}))(LogOuts);