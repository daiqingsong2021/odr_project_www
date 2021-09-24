import React, { Component } from 'react';
import dynamic from 'next/dynamic';
import { Select, notification, DatePicker, Button, TreeSelect } from 'antd';
import { connect } from 'react-redux';
import style from './style.less';
import axios from '@/api/axios';
import { trainDailDelete, trainDailAdd,getTrainDailList,trainDailApprove} from '@/modules/Suzhou/api/suzhou-api';
import PublicButton from '@/components/public/TopTags/PublicButton';
import { getBaseData } from '@/modules/Suzhou/components/Util/util';
import notificationFun from '@/utils/notificationTip';
import AddModal from '../RightTags'
import PublicMenuButton from "@/components/public/TopTags/PublicMenuButton";
import {setRightShow } from "@/modules/Suzhou/components/Util/util.js";
//流程
import Release from "../../../../../Components/Release";
import { getReleaseMeetingList } from "../../../../../../api/api"
import Approval from '../Workflow/Approval';
const { Option } = Select;
const { SHOW_PARENT } = TreeSelect;
const { RangePicker } = DatePicker
export class TopTags extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false, //增加修改弹窗
            type: "ADD",
            lineArr:[],
            startTime:'',
            endTime:'',
            line:''
        }
    }
    componentDidMount() {
        getBaseData('line').then(data => { this.setState({ lineArr: data }) })
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
        //新增
        if (name == 'AddTopBtn') {
            this.setState({
                modalVisible: true,
            });
        }
        //删除
        
        if (name == 'DeleteTopBtn') {
            const deleteArray = [];
            selectedRows.forEach((value, item) => {
                if (value.reviewStatusVo.code == 'INIT') {
                    deleteArray.push(value.id)
                } else {
                    notificationFun('非新建状态数据不能删除', value.lineName + '日期为' + value.recordTime + "不能删除")
                    return false;
                }
            })
            if (deleteArray.length > 0) {
                axios.deleted(trainDailDelete, { data: deleteArray }, true).then(res => {
                    this.props.delSuccess(deleteArray);
                }).catch(err => {
                });
            }
        }
        //发布审批
        if (name == 'approve') {
            // if (false) {
            //     notification.warning(
            //         {
            //             placement: 'bottomRight',
            //             bottom: 50,
            //             duration: 1,
            //             message: '警告',
            //             description: '没有选择项目！'
            //         }
            //     )
            //     return
            // }
            // this.setState({
            //     isShowRelease: true,
            //     showApprovalVisible: true,
            //     projectName: "[" + projectName + "]"
            // })
            const approveArray = [];
            selectedRows.forEach((value,item) => {
                if(value.reviewStatusVo.code == 'INIT'){
                    approveArray.push(value.id)
                    notificationFun('提示',"发布成功")
                }else {
                    notificationFun('非新建状态数据不能发布', value.lineName + '日期为' + value.recordTime + "不能发布")
                    return false;
                }
            })
            if(approveArray.length >0){
                axios.get(trainDailApprove+ '?ids=' + approveArray.join(',')).then(res =>{
                    if(res.data.success){
                        this.props.approveSuccess();
                    }else{
                        notification.error(
                            {
                                placement: 'bottomRight',
                                bottom: 50,
                                duration: 1,
                                message: '警告',
                                description: res.data.message
                            }
                        )
                    }
                    this.props.approveSuccess();
                })
            }
        }
    }
    submit = (values, type) => {
        const data = {
            ...values,
        };
        axios.post(trainDailAdd, data, true).then(res => {
            if (res.data.status === 200) {
                if (type == 'save') {
                    this.handleCancel();
                    
                }
                this.props.success(res.data.data);
            }
        });
    };
    //关闭model
    handleCancel = () => {
        this.setState({
            modalVisible: false,
        })
    };

    //取消审批
    handleCancelRelease = () => {
        this.setState({
            isShowRelease: false
        })
    }
    updateFlow = (projectId, data) => {
        this.props.updateFlow();
    }
    //线路选择
    selectOnChange=(val)=>{
        this.setState({
            line:val.join(',')
        })
    }
    //range日期选择
    onChange = (val) => {
        this.setState({
            startTime: val.length > 0 ? val[0].format('YYYY-MM-DD') : '',
            endTime: val.length > 0 ? val[1].format('YYYY-MM-DD') : ''
        })
    }
    render() {
        const {  line,startTime,endTime,lineArr} = this.state
        const { permission } = this.props
        return (
            <div className={style.main}>
                <div className={style.search}>
                    线路：<Select allowClear showSearch mode='multiple' placeholder="请选择线路" size='small' style={{ minWidth: 150, marginRight: 10 }}
                      onChange={this.selectOnChange} filterOption={(input, option) =>
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                      {lineArr.map(item => {
                        return <Option key={item.value} value={item.value}>{item.title}</Option>
                      })}
                    </Select>
                    日期范围：
                    <RangePicker size='small' style={{ width: 200, marginRight: 10 }} onChange={this.onChange} />
                    <Button type="primary" icon="search" size='small' onClick={this.props.search.bind(this,startTime,endTime,line)}>搜索</Button>
                </div>
                <div className={style.tabMenu}>
                    {permission.indexOf('DRIVINGMANAGE_DRIVING-ADD')!==-1 && (
                        <PublicButton name={'新增'} title={'新增'} icon={'icon-add'}
                            afterCallBack={this.btnClicks.bind(this, 'AddTopBtn')}
                            res={'MENU_EDIT'}
                        />)}
                    {permission.indexOf('DRIVINGMANAGE_DRIVING-APPROVE')!==-1 && (
                        <PublicButton name={'发布'} title={'发布'} icon={'icon-fabu'}
                            afterCallBack={this.btnClicks.bind(this, 'approve')}
                            res={'MENU_EDIT'} />)}
                    {permission.indexOf('DRIVINGMANAGE_DRIVING-DEL')!==-1 && (
                        <PublicButton name={'删除'} title={'删除'} icon={'icon-shanchu'}
                            useModel={true} edit={true}
                            verifyCallBack={this.hasRecord}
                            afterCallBack={this.btnClicks.bind(this, 'DeleteTopBtn')}
                            content={'你确定要删除吗？'}
                            res={'MENU_EDIT'}
                        />)}
                </div>
                {/* 新增 */}
                {this.state.modalVisible && <AddModal
                    record={this.props.record}
                    modalVisible={this.state.modalVisible}
                    success={this.props.success}
                    updateSuccess={this.props.updateSuccess}
                    submit={this.submit.bind(this)}
                    handleCancel={this.handleCancel.bind(this)} 
                    />}
                    
                {/* 流程审批 */}
                {this.state.isShowRelease &&
                    <Release
                        projectName={this.props.projectName}
                        firstList={getTrainDailList}
                        handleCancel={this.handleCancelRelease}
                        projectId={this.props.projectId}
                        proc={{ "bizTypeCode": "dc2-trainDaily-approve", "title": "行车日况发布审批" }}
                        reflesh={this.updateFlow.bind(this)} />}
                {this.state.showApprovalVisible &&
                    <Approval
                        visible={true}
                        width={"1200px"}
                        proc={{ "bizTypeCode": "dc2-trainDaily-approve", "title": "行车日况发布审批" }}
                        projectId={this.props.projectId}
                        sectionId={this.props.sectionId}
                        searcher={this.props.searcher}
                        handleCancel={() => { this.setState({ showApprovalVisible: false }) }}
                        refreshData={this.props.updateFlow}
                        bizType={this.props.bizType}
                    />}
            </div>
        )
    }
}
export default TopTags;