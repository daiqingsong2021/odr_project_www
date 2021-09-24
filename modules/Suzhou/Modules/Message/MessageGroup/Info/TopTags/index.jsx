import React, { Component } from 'react';
import dynamic from 'next/dynamic';
import { Select, notification, DatePicker, Button, Input } from 'antd';
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
            personName:val?val.target.value : '',
        })
    }
    render() {
        const { permission } = this.props
        const { personName } = this.state
        return (
            <div className={style.main}>
                <div className={style.search}>
                    姓名：
                    {/* <RangePicker size='small' style={{ width: 200, marginRight: 10 }} onChange={this.onChange} /> */}
                    <Input size='small' style={{ width: 200, marginRight: 10 }} onChange={this.onChange} placeholder='请输入姓名关键字'/>
                    <Button type="primary" icon="search" size='small' onClick={this.props.search.bind(this, personName)}>搜索</Button>
                </div>
                <div className={style.tabMenu}>
                    
                </div>
                
            </div>
        )
    }
}
export default TopTags;