import React, { Component } from 'react';
import dynamic from 'next/dynamic';
import { Select, notification, DatePicker, Button, Input,Col,Form } from 'antd';
import { connect } from 'react-redux';
import style from './style.less';
import axios from '@/api/axios';
import PublicButton from '@/components/public/TopTags/PublicButton';
import notificationFun from '@/utils/notificationTip';
import { getBaseData } from '@/modules/Suzhou/components/Util/util';
const { Option } = Select;
const { RangePicker } = DatePicker
export class TopTags extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false, //增加修改弹窗
            type: "ADD",
        }
    }
    componentDidMount() {
        
    }

    onChange = (val) => {
        this.setState({
            searcher:val?val.target.value : '',
        })
    }
    changeSendStatus = (val) => {
        this.setState({
            sendStatus:val,
        })
    }
    changeReviewStatus = (val) => {
        this.setState({
            receiveStatus:val,
        })
    }
    render() {
        const formItemLayout0 = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
        };
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 10 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 10 },
            },
        };
        const formItemLayout1 = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };
        const { getFieldDecorator } = this.props.form;
        const { permission } = this.props
        const { searcher,sendStatus,receiveStatus } = this.state
        return (
            <div className={style.main}>
                <div className={style.search}>
                    接受账号：
                    {/* <RangePicker size='small' style={{ width: 200, marginRight: 10 }} onChange={this.onChange} /> */}
                    <Input allowClear size='small' style={{ width: 200, marginRight: 10 }} onChange={this.onChange} placeholder='请输入接受账号关键字'/>
                    发送状态：
                    <Select size='small' style={{ minWidth: 150, marginRight: 10 }} placeholder="请选择发送状态" allowClear={true} onChange={this.changeSendStatus}>
                        <Option value="1">成功</Option>
                        <Option value="0">失败</Option>
                    </Select>
                    接收状态：
                    <Select size='small' style={{ minWidth: 150, marginRight: 10 }} placeholder="请选择接收状态" allowClear={true} onChange={this.changeReviewStatus}>
                        <Option value="1">成功</Option>
                        <Option value="0">失败</Option>
                        <Option value="2">未知</Option>
                    </Select>
                    <Button type="primary" icon="search" size='small' onClick={this.props.search.bind(this, searcher,sendStatus,receiveStatus)}>搜索</Button>
                </div>
                <div className={style.tabMenu}>
                    
                </div>
                
            </div>
        )
    }
}
const TopTagsForm = Form.create()(TopTags);
export default TopTagsForm;