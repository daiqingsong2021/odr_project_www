import React, { Component } from 'react';
import dynamic from 'next/dynamic';
import { Select, notification, DatePicker, Button, TreeSelect, Form, Row, Col, Input } from 'antd';
import RightTags from '@/modules/Suzhou/components/RightTags/index';
import { connect } from 'react-redux';
import style from './style.less';
import axios from '@/api/axios';
import { exportHistoryList, delHistoryList,cancelTimingSms } from '@/modules/Suzhou/api/suzhou-api';
import * as dataUtil from '@/utils/dataUtil';
import PublicButton from '@/components/public/TopTags/PublicButton';
import notificationFun from '@/utils/notificationTip';
import PublicMenuButton from "@/components/public/TopTags/PublicMenuButton";
import { getBaseData,setRightShow } from '@/modules/Suzhou/components/Util/util.js';
import moment from "moment"
const { Option } = Select;
const { SHOW_PARENT } = TreeSelect;
const { RangePicker } = DatePicker
export class TopTags extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false, //增加修改弹窗
            type: "ADD",
            optionStatus: [], //状态，来自数据自带呢
            smsTimeStartTmp: '',
            smsTimeEndTmp: '',
            searcher: '',
            smsSendStatusList:[{value:'0',title:'未发送'},{value:'1',title:'已发送'},{value:'2',title:'已撤销'}]
        }
    }
    componentDidMount() {
        this.setState({
            smsTimeStartTmp: moment(moment().subtract(7, 'days').format('YYYY-MM-DD'),'YYYY-MM-DD'),
            smsTimeEndTmp: moment(moment().format('YYYY-MM-DD'),'YYYY-MM-DD'),
        })
    }
    getNowData = () => {
        let formatDate = moment().format('YYYY-MM-DD'); /*格式化时间*/

        return formatDate
    }
    getStartDate = () =>{
        let today = {};
        let _today = moment();
        today.sevenDaysAgo = _today.subtract(7, 'days').format('YYYY-MM-DD'); /*前一天的时间*/
        let formatDate = moment(today.sevenDaysAgo).format('YYYY-MM-DD'); /*格式化时间*/
        return formatDate
    }
    //判断是否有选中数据
    hasRecord = () => {
        if (this.props.selectedRows.length == 0) {
            notificationFun('未选中数据', '请选择数据进行操作');
            return false;
        } else {
            return true
        }
    }
    btnClicks = (name, type) => {
        const { record, selectedRows } = this.props;
        //删除
        if (name == 'DeleteTopBtn') {
            const deleteArray = [];
            try{
                selectedRows.forEach((value, item) => {
                    if(value.smsSendStatus === 0){
                        notificationFun('提示', '请先撤销后再删除未发送的短信记录');
                        throw new Error("ending");
                    }else{
                        deleteArray.push(value.id)
                    }
                })
            }catch(e){
                return
            }
            
            if (deleteArray.length > 0) {
                axios.deleted(delHistoryList, { data: deleteArray }, true).then(res => {
                    this.props.delSuccess(deleteArray);
                }).catch(err => {
                });
            }
        }
        //导出
        if (name == 'exportFile') {
            const { searcher, smsTimeStartTmp, smsTimeEndTmp } = this.state
            let smsTimeStart;
            let smsTimeEnd; 
            if(smsTimeStartTmp!=='' && smsTimeStartTmp!==null){
                smsTimeStart = dataUtil.Dates().formatTimeString(smsTimeStartTmp).substr(0, 10) + ' 00:00:00';
            }else{
                smsTimeStart = smsTimeStartTmp
            }
            if(smsTimeEndTmp !=='' && smsTimeStartTmp!==null){
                smsTimeEnd =  dataUtil.Dates().formatTimeString(smsTimeEndTmp).substr(0, 10) + ' 23:59:59';
            }else{
                smsTimeEnd = smsTimeEndTmp
            }
            axios.down(exportHistoryList+`?searcher=${searcher}&smsTimeStart=${smsTimeStart}&smsTimeEnd=${smsTimeEnd}`, {}).then((res) => {
            })
        }
        //撤销
        if(name == 'sendCancelTopBtn'){
            const cancelArray = [];
            try{
                selectedRows.forEach((item,index)=>{
                    if(item.smsSendStatus===0){
                        //只有未发送状态下才能撤销
                        cancelArray.push(item.id)
                    }else{
                        notificationFun('提示', '只有未发送状态的短信记录才能撤销');
                        throw new Error("ending");
                    }
                })
            }catch(e){
                return
            }
            if (cancelArray.length > 0) {
                let data={
                    cancelArray
                }
                axios.put(cancelTimingSms(2), cancelArray, true).then(res => {
                    this.props.delSuccess(cancelArray);
                }).catch(err => {
                });
            }
        }  
    }

    //输入查询
    inputOnChange = (val) => {
        this.setState({
            searcher: val ? val.target.value : '',
        });
    }
    //range日期选择
    onChange = (val) => {
        this.setState({
            smsTimeStartTmp: val.length > 0 ? val[0] : '',
            smsTimeEndTmp: val.length > 0 ? val[1] : ''
        })
    }
    selectOnChange = (val) => {
        this.setState({
            smsSendStatus:val
        })
    }
    resetSearchParam = () => {
        this.setState({
            smsTimeStartTmp: '',
            smsTimeEndTmp: '',
            searcher: '',
            smsSendStatus:''
        })
        this.props.form.resetFields();
    }

    render() {
        const { smsTimeStartTmp, smsTimeEndTmp, searcher,smsSendStatus } = this.state
        const { getFieldDecorator } = this.props.form;
        const { permission } = this.props;
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
        return (
            <div className={style.main}>
                <div className={style.search}>

                    <Form>
                        <Row style={{ height: '40px' }}>
                            <Col span={7} style={{ height: '40px' }}>
                                <Form.Item label="发送内容:" {...formItemLayout}>
                                    {getFieldDecorator('searcher', {
                                        initialValue: !this.props.searcher ? '' : this.props.searcher,
                                    })(
                                        <Input
                                            allowClear
                                            size='small'
                                            style={{ minWidth: 170, marginRight: 10 }}
                                            placeholder="发送内容关键字查询"
                                            onChange={this.inputOnChange}
                                        />)}
                                </Form.Item>
                            </Col>
                            <Col span={7} style={{ height: '40px' }}>
                                <Form.Item label="发送状态:" {...formItemLayout}>
                                    {getFieldDecorator('smsSendStatus', {
                                        initialValue: !this.props.smsSendStatus ? '' : this.props.smsSendStatus,
                                    })(
                                        <Select
                                                showSearch
                                                allowClear={true}
                                                placeholder="请选择发送状态"
                                                optionFilterProp="children"
                                                required
                                                onChange={this.selectOnChange}
                                                filterOption={(input, option) =>
                                                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                }
                                                size='small'
                                                style={{ minWidth: 170, marginRight: 10 }}
                                            >{this.state.smsSendStatusList && this.state.smsSendStatusList.map(item => {
                                                return (
                                                    <Option value={item.value} key={item.value}>{item.title}</Option>
                                                )
                                            })
                                                }</Select>
                                        )}
                                </Form.Item>
                            </Col>
                            <Col span={9} style={{ height: '40px' }}>
                                <Form.Item label="日期范围:" {...formItemLayout1}>
                                    {getFieldDecorator('date', {
                                        initialValue: [moment(this.getStartDate(), 'YYYY-MM-DD'),this.state.smsTimeEndTmp],
                                    })(
                                        <RangePicker size='small' style={{ minWidth: 200, marginRight: 10,width:'100%' }} onChange={this.onChange} format='YYYY-MM-DD'/>)}
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                    <div style={{ display: 'inline-block', marginTop: '8px', width: '200px' }}><Button type="default" icon="redo" size='small' style={{ marginRight: 10 }} onClick={this.resetSearchParam.bind(this)}>重置</Button>
                        <Button type="primary" icon="search" size='small' onClick={this.props.search.bind(this, smsTimeStartTmp, smsTimeEndTmp, searcher,smsSendStatus)}>搜索</Button></div>

                </div>
                <div className={style.tabMenu}>
                    <PublicButton name={'下载'} title={'下载'} icon={'icon-iconziyuan2'}
                        afterCallBack={this.btnClicks.bind(this, 'exportFile')} />
                    {permission && permission.indexOf('MESSAGEHISTORY_SEND_CANCEL') !== -1 && (
                        <PublicButton name={'撤销'} title={'撤销'} icon={'icon-edit'}
                            verifyCallBack={this.hasRecord}
                            afterCallBack={this.btnClicks.bind(this, 'sendCancelTopBtn')}
                            res={'MENU_EDIT'}
                        />)}
                    {permission && permission.indexOf('MESSAGEHISTORY_DEL_HIS') !== -1 && (
                        <PublicButton name={'删除'} title={'删除'} icon={'icon-shanchu'}
                            useModel={true} edit={true}
                            verifyCallBack={this.hasRecord}
                            afterCallBack={this.btnClicks.bind(this, 'DeleteTopBtn')}
                            content={'你确定要删除吗？'}
                            res={'MENU_EDIT'}
                        />)}
                </div>
            </div>
        )
    }
}
const TopTagsForm = Form.create()(TopTags);
export default TopTagsForm;