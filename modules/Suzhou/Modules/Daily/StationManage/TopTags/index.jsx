import React, { Component } from 'react';
import dynamic from 'next/dynamic';
import { Select, notification, DatePicker, Button, Radio } from 'antd';
import { connect } from 'react-redux';
import style from './style.less';
import axios from '@/api/axios';
import { delStationFoundationList,deleteStationRoute } from '@/modules/Suzhou/api/suzhou-api';
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
            lineArr: [],
            stationTypeArr: [],
            line: '1'
        }
    }
    componentDidMount() {
        getBaseData('station.type').then(data => { this.setState({ stationTypeArr: data }) })
        getBaseData('line').then(data => { this.setState({ lineArr: data }) })
    }
    //线路选择
    selectOnChange = (val) => {
        this.setState({
            line: val
        },()=>{
            this.props.search(val)
        })
    }
    //站点类型
    selectStationChange = (val) => {
        this.setState({
            stationType: val
        })
    }
    //判断是否有选中数据
    hasRecord = () => {
        if (!this.props.record.id) {
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
            deleteArray.push(record)
            // selectedRows.forEach((value, item) => {
            //     // if (value.reviewStatusVo.code == 'INIT') {
            //     deleteArray.push(value)
            //     // } else {
            //     //     notificationFun('非新建状态数据不能删除', '日期为' + value.recordTime + "不能删除")
            //     //     return false;
            //     // }
            // })
            if (deleteArray.length > 0) {
                if(record.line == '3'){
                    const ids = []
                    ids.push(record.id)
                    axios.deleted(deleteStationRoute, {data:ids}, true).then(res => {
                        this.props.delSuccess(deleteArray);
                    }).catch(err => {
                        });
                }else{
                    axios.deleted(delStationFoundationList, { data: deleteArray }, true).then(res => {
                        this.props.delSuccess(deleteArray);
                    }).catch(err => {
                        });
                }
            }
        }
    }
    //关闭model
    handleCancel = () => {
        this.setState({
            modalVisible: false,
        });
    };
    render() {
        const { permission } = this.props
        const { lineArr, stationTypeArr, stationType, line } = this.state
        return (
            <div className={style.main}>
                <div className={style.search}>
                    线路：<Select showSearch defaultValue='1' placeholder="请选择线路" size='small' style={{ minWidth: 150, marginRight: 10 }}
                        onChange={this.selectOnChange} filterOption={(input, option) =>
                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                        {lineArr.map(item => {
                            return <Option key={item.value} value={item.value}>{item.title}</Option>
                        })}
                    </Select>
                    {/* 站点类型：<Select allowClear showSearch placeholder="请选择站点类型" size='small' style={{ minWidth: 150, marginRight: 10 }}
                        onChange={this.selectStationChange} filterOption={(input, option) =>
                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                        {stationTypeArr.map(item => {
                            return <Option key={item.value} value={item.value}>{item.title}</Option>
                        })}
                    </Select> */}
                    <Button type="primary" icon="search" size='small' onClick={this.props.search.bind(this, line)}>搜索</Button>
                </div>
                <div className={style.tabMenu}>
                    <Radio.Group name="radiogroup" buttonStyle="solid" value={this.props.tabKey} onChange={this.props.radioChange}>
                        <Radio.Button value='1'>正线站点</Radio.Button>
                        <Radio.Button value='2'>辅助站点</Radio.Button>
                        {this.state.line == '3' && <Radio.Button value='3'>辅线段维护</Radio.Button>}
                    </Radio.Group>
                    {permission.indexOf('STATIONMANAGE_ADD') !== -1 &&
                        <PublicButton name={'新增'} title={'新增'} icon={'icon-add'}
                            afterCallBack={this.btnClicks.bind(this, 'AddTopBtn')}
                            res={'MENU_EDIT'}
                        />}
                    {permission.indexOf('STATIONMANAGE_ADD') !== -1 &&
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
                        tabKey={this.props.tabKey}
                    />
                }
            </div>
        )
    }
}
export default TopTags;