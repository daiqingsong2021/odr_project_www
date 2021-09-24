import React, { Component } from 'react';
import dynamic from 'next/dynamic';
import { Select, notification, DatePicker, Button } from 'antd';
import { connect } from 'react-redux';
import style from './style.less';
import axios from '@/api/axios';
import { downEnergyDetailTemplate, uploadEnergyDetailInfo, delLineFoundationList, energyDailyApproved } from '@/modules/Suzhou/api/suzhou-api';
import PublicButton from '@/components/public/TopTags/PublicButton';
import notificationFun from '@/utils/notificationTip';
import { getBaseData } from '@/modules/Suzhou/components/Util/util';
//新增
import AddModal from '../AddModal'
import PublicMenuButton from "@/components/public/TopTags/PublicMenuButton";
import { getReleaseMeetingList } from "../../../../../../api/api"
const { Option } = Select;
const { RangePicker } = DatePicker
export class TopTags extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false, //增加修改弹窗
            type: "ADD",
            uploadUrl: '',
            lineArr: [],
            startTime: '',
            endTime: '',
            line: ''
        }
    }
    componentDidMount() {
        getBaseData('line').then(data => { this.setState({ lineArr: data }) })
    }
    //线路选择
    selectOnChange = (val) => {
        this.setState({
            line: val
        })
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
        const { record, selectedRows, projectName } = this.props;
        if (name == 'AddTopBtn') {
            this.setState({
                modalVisible: true,
            })
        }
        //删除
        if (name == 'DeleteTopBtn') {
            const deleteArray = [];
            selectedRows.forEach((value, item) => {
                deleteArray.push({id:value.id,line:value.line})
            })
            if (deleteArray.length > 0) {
                axios.deleted(delLineFoundationList, { data: deleteArray }, true).then(res => {
                    this.props.delSuccess(deleteArray);
                }).catch(err => {
                });
            }
        }
    }
    //关闭model
    handleCancel = () => {
        this.setState({
            modalVisible: false,
        });
    };
    onChange = (val) => {
        this.setState({
            startTime: val.length > 0 ? val[0].format('YYYY-MM-DD') : '',
            endTime: val.length > 0 ? val[1].format('YYYY-MM-DD') : ''
        })
    }
    render() {
        const { permission } = this.props
        const { lineArr, startTime, endTime, line } = this.state
        return (
            <div className={style.main}>
                <div className={style.search}>
                    {/* 线路：<Select allowClear showSearch placeholder="请选择线路" size='small' style={{ minWidth: 150, marginRight: 10 }}
                        onChange={this.selectOnChange} filterOption={(input, option) =>
                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                        {lineArr.map(item => {
                            return <Option key={item.value} value={item.value}>{item.title}</Option>
                        })}
                    </Select>
                    日期范围：
                    <RangePicker size='small' style={{ width: 200, marginRight: 10 }} onChange={this.onChange} />
                    <Button type="primary" icon="search" size='small' onClick={this.props.search.bind(this, startTime, endTime, line)}>搜索</Button> */}
                </div>
                <div className={style.tabMenu}>
                    {permission.indexOf('LINEMANAGE_ADD') !== -1 &&
                        <PublicButton name={'新增'} title={'新增'} icon={'icon-add'}
                            afterCallBack={this.btnClicks.bind(this, 'AddTopBtn')}
                            res={'MENU_EDIT'}
                        />}
                    {permission.indexOf('LINEMANAGE_ADD') !== -1 &&
                        <PublicButton name={'删除'} title={'删除'} icon={'icon-shanchu'}
                            useModel={true} edit={true}
                            verifyCallBack={this.hasRecord}
                            afterCallBack={this.btnClicks.bind(this, 'DeleteTopBtn')}
                            content={'你确定要删除吗？'}
                            res={'MENU_EDIT'}
                        />}
                </div>
                {/* 新增 */}
                {this.state.modalVisible &&
                    <AddModal
                        modalVisible={this.state.modalVisible}
                        success={this.props.success}
                        handleCancel={this.handleCancel}
                    />
                }
            </div>
        )
    }
}
export default TopTags;