import React, { Component } from 'react';
import dynamic from 'next/dynamic';
import { Select, notification, DatePicker, Button, TreeSelect } from 'antd';
import { connect } from 'react-redux';
import style from './style.less';
import axios from '@/api/axios';
import {faultDailyDel,approvedFaultDaily} from '@/modules/Suzhou/api/suzhou-api';
import PublicButton from '@/components/public/TopTags/PublicButton';
import notificationFun from '@/utils/notificationTip';
import AddModal from '../AddModal'
import PublicMenuButton from "@/components/public/TopTags/PublicMenuButton";
//流程
import Release from "../../../../../Components/Release";
import { getReleaseMeetingList } from "../../../../../../api/api"
import Approval from '../Workflow/Approval';
import { getBaseData } from '@/modules/Suzhou/components/Util/util';
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
            startTime: '',
            endTime: '',
            line:''
        }
    }
    componentDidMount() {
        let treeDataXl = [{
            title: '全部',
            value: '全部',
            key: '0',
            children: []
        }]
        // this.setState({
        //     treeDataXl
        // })
        getBaseData("line").then((res) => {
            if (Array.isArray(res)) {
                treeDataXl[0].children = res;
                this.setState({
                    treeDataXl
                })
            }
        });
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
        const { rightData, selectedRows, projectName } = this.props;
        //新增
        if (name == 'AddTopBtn') {
            this.setState({
                modalVisible: true,
                addOrModify:'add'
            });
        }
        //删除
        if (name == 'DeleteTopBtn') {
            const deleteArray = [];
            selectedRows.forEach((value, item) => {
                if (value.status == 'INIT' || value.status == 'REJECT') { //新建和被驳回状态可删除
                    deleteArray.push(value.id)
                } else {
                    notificationFun('审批中或已完成数据不能删除')
                    return false;
                }
            })
            if (deleteArray.length > 0) {
                axios.deleted(faultDailyDel, { data: deleteArray }, true).then(res => {
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
            this.setState({
                isShowRelease: true,
                showApprovalVisible: true,
                projectName: "[" + projectName + "]"
            })
        }
        if (name=='approveDirectly'){
            const approveArray = [];
            selectedRows.forEach((value, item) => {
                if (value.status == 'INIT') {
                    approveArray.push(value.id)
                    notificationFun('提示',"发布成功")
                } else {
                    notificationFun('非新建状态数据不能发布')
                    return false;
                }
            })
            if (approveArray.length > 0) {
                axios.get(approvedFaultDaily + '?ids=' + approveArray.join(',')).then(res => {
                    if(res.data.success){
                        this.props.approveSuccess()
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
                    this.props.approveSuccess()
                })
            }
        }
        //导出
        if (name == 'exportFile') {
            axios.down(dowClassification, {}).then((res) => {
            })
        }
    }
    //关闭model
    handleCancel = () => {
        this.setState({
            modalVisible: false,
        });
        this.props.success();
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
            line:val && val.length ? val.map(item=>item).join(',') : ''
        });
        // this.props.refreshList(this.state.xl,this.state.startTime,this.state.endTime)
    }
    //range日期选择
    onChange = (val) => {
        this.setState({
            startTime: val.length > 0 ? val[0].format('YYYY-MM-DD') : '',
            endTime: val.length > 0 ? val[1].format('YYYY-MM-DD') : ''
        })
        // this.props.refreshList(this.state.xl,this.state.startTime,this.state.endTime)
    }
    render() {
        const { treeDataXl ,startTime,endTime,line} = this.state
        const { } = this.props
        return (
            <div className={style.main}>
                <div className={style.search}>
                    线路：<TreeSelect
                        treeData={treeDataXl}
                        showSearch
                        allowClear
                        treeCheckable
                        showCheckedStrategy={SHOW_PARENT}
                        treeDefaultExpandAll
                        size='small'
                        style={{ minWidth: 150, marginRight: 10 }}
                        placeholder="请选择线路"
                        onChange={this.selectOnChange}
                    />
                    日期范围：
                    <RangePicker size='small' style={{ width: 200, marginRight: 10 }} onChange={this.onChange} />
                    <Button type="primary" icon="search" size='small' onClick={this.props.search.bind(this,startTime,endTime,line,treeDataXl)}>搜索</Button>
                </div>
                <div className={style.tabMenu}>
                    {this.props.permission.indexOf('MALFUNCTIONMANAGE_MAILFUNCTION_ADD')!==-1 && (
                        <PublicButton name={'新增'} title={'新增'} icon={'icon-add'}
                            afterCallBack={this.btnClicks.bind(this, 'AddTopBtn')}
                            res={'MENU_EDIT'}
                        />)}
                    {/* {this.props.permission.indexOf('MALFUNCTIONMANAGE_MAILFUNCTION_RELEASE')!==-1 && (
                        <PublicButton name={'发布审批'} title={'发布审批'} icon={'icon-fabu'}
                            afterCallBack={this.btnClicks.bind(this, 'approve')}
                            res={'MENU_EDIT'} />)} */}
                    {this.props.permission.indexOf('MALFUNCTIONMANAGE_MAILFUNCTION_RELEASE')!==-1 && (
                        <PublicButton name={'发布'} title={'发布'} icon={'icon-fabu'}
                            afterCallBack={this.btnClicks.bind(this, 'approveDirectly')}
                            res={'MENU_EDIT'} />)}
                    {this.props.permission.indexOf('MALFUNCTIONMANAGE_MAILFUNCTION_DEL')!==-1  && (
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
                    rightData={this.props.rightData}
                    addOrModify={this.state.addOrModify}
                    modifyDisabled={false} //可修改
                    // modalVisible={this.state.modalVisible}
                    success={this.props.success}
                    handleCancel={this.handleCancel.bind(this)} />}
                {/* 流程审批 */}
                {this.state.isShowRelease &&
                    <Release
                        firstList={getReleaseMeetingList}	
                        proc={{ "bizTypeCode": "dc5-faultDaily-approve", "title": "故障日况审批流程" }}
                        reflesh={this.updateFlow.bind(this)} />}
                {this.state.showApprovalVisible &&
                    <Approval
                        visible={true}
                        width={"1200px"}
                        proc={{ "bizTypeCode": "dc5-faultDaily-approve", "title": "故障日况审批流程" }}
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