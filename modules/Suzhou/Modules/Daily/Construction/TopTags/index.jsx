import React, { Component } from 'react';
import dynamic from 'next/dynamic';
import { Select, notification, DatePicker, Button, TreeSelect } from 'antd';
import { connect } from 'react-redux';
import style from './style.less';
import axios from '@/api/axios';
import { checkAddConstructionDaily,addConstructionDaily,delConstructionDaily,approvedConstructionDaily,synConstructionDaily } from '@/modules/Suzhou/api/suzhou-api';
import PublicButton from '@/components/public/TopTags/PublicButton';
import notificationFun from '@/utils/notificationTip';
import AddModal from '../RightTags'
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
        const { record, selectedRows, projectName } = this.props;
        //同步
        if(name == 'SyncBtn'){
            axios.post(synConstructionDaily).then(()=>{
                notificationFun('提示', '同步成功！');
                this.props.updateFlow()
            }).catch(()=>{
                notificationFun('提示', '同步失败，请重试！');
            })
        }
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
                    notificationFun('非新建状态数据不能删除')
                    return false;
                }
            })
            if (deleteArray.length > 0) {
                axios.deleted(delConstructionDaily, { data: deleteArray }, true).then(res => {
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
                if (value.reviewStatusVo.code == 'INIT') {
                    approveArray.push(value.id)
                    notificationFun('提示',"发布成功")
                } else {
                    notificationFun('非新建状态数据不能发布')
                    return false;
                }
            })
            if (approveArray.length > 0) {
                axios.get(approvedConstructionDaily + '?ids=' + approveArray.join(',')).then(res => {
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
    submit = (values, type) => {
        const data = {
            ...values,
        };
        if(type == 'save'){
            axios.get(checkAddConstructionDaily+`?recordTime=${data.recordTime}&line=${data.line}`).then(res => {
                if (res.data && res.data.success && res.data.data == 'false') {
                    axios.post(addConstructionDaily, data, true).then(res => {
                        console.log(res)
                        if(res.data && res.data.success){
                            this.setState({
                                modalVisible:false
                            })
                            this.props.success(res.data.data);
                        }else{
                            notification.error(
                                {
                                placement: 'bottomRight',
                                bottom: 50,
                                duration: 2,
                                message: '出错了',
                                description: '抱歉，网络开小差了，请稍后重试'
                                }
                            )
                        }
                    })
                }else{
                    if(res.data && res.data.success && res.data.data == 'true'){
                        notification.warning(
                            {
                                placement: 'bottomRight',
                                bottom: 50,
                                duration: 1,
                                message: '提示',
                                description: '请勿重复添加！'
                            }
                        )
                    }else{
                        notification.error(
                            {
                            placement: 'bottomRight',
                            bottom: 50,
                            duration: 2,
                            message: '出错了',
                            description: '抱歉，网络开小差了，请稍后重试'
                            }
                        )
                    }
                    
                }
            });
        }
    };
    //关闭model
    handleCancel = () => {
        this.setState({
            modalVisible: false,
        });
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
        console.log(val)
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
        const { permission } = this.props
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
                    {(permission && permission.indexOf('CONSTRUCTIONMANAGE_CONSTRUCTION-ADD')!=-1) && (
                        <PublicButton name={'新增'} title={'新增'} icon={'icon-add'}
                            afterCallBack={this.btnClicks.bind(this, 'AddTopBtn')}
                            res={'MENU_EDIT'}
                        />)}
                        {/* <PublicButton name={'修改'} title={'修改'} icon={'icon-xiugaibianji'}
                            afterCallBack={this.btnClicks.bind(this, 'UpdateBtn')}
                            res={'MENU_EDIT'}
                        />
                        <PublicMenuButton title={"导入"} afterCallBack={this.btnClicks} icon={"icon-daoru1"}
                            menus={[{ key: "ImportFile", label: "excel导入", icon: "icon-iconziyuan1", },
                            { key: "ImportCont", label: "从合同导入", icon: "icon-iconziyuan1" }]}
                        />
                        <PublicButton name={'导出'} title={'导出模版'} icon={'icon-iconziyuan2'}
                            afterCallBack={this.btnClicks.bind(this, 'exportFile')} /> */}
                    {/* {(permission && permission.indexOf('CONSTRUCTIONMANAGE_CONSTRUCTION-APPROVE')!=-1) && (
                        <PublicButton name={'发布审批'} title={'发布审批'} icon={'icon-fabu'}
                            afterCallBack={this.btnClicks.bind(this, 'approve')}
                            res={'MENU_EDIT'} />)} */}
                        {(permission && permission.indexOf('CONSTRUCTIONMANAGE_CONSTRUCTION-APPROVE')!=-1) && (
                        <PublicButton name={'发布'} title={'发布'} icon={'icon-fabu'}
                            afterCallBack={this.btnClicks.bind(this, 'approveDirectly')}
                            res={'MENU_EDIT'} />)}
                    {(permission && permission.indexOf('CONSTRUCTIONMANAGE_CONSTRUCTION-DEL')!=-1) && (
                        <PublicButton name={'删除'} title={'删除'} icon={'icon-shanchu'}
                            useModel={true} edit={true}
                            verifyCallBack={this.hasRecord}
                            afterCallBack={this.btnClicks.bind(this, 'DeleteTopBtn')}
                            content={'你确定要删除吗？'}
                            res={'MENU_EDIT'}
                        />)}
                    {(permission && permission.indexOf('CONSTRUCTIONMANAGE_CONSTRUCTION-ADD')!=-1) && (
                        <PublicButton name={'同步'} title={'同步'} icon={'icon-xiugaibianji'}
                            afterCallBack={this.btnClicks.bind(this, 'SyncBtn')}
                            res={'MENU_EDIT'}
                        />)}
                </div>
                {/* 新增 */}
                {this.state.modalVisible && <AddModal
                    isAdd={true}
                    record={this.props.record}
                    modalVisible={this.state.modalVisible}
                    success={this.props.success}
                    submit={this.submit.bind(this)}
                    sectionId={this.props.sectionId}
                    projectId={this.props.projectId}
                    handleCancel={this.handleCancel.bind(this)} />}
                {/* 流程审批 */}
                {this.state.isShowRelease &&
                    <Release
                        firstList={getReleaseMeetingList}	
                        proc={{ "bizTypeCode": "dc4-constructionDaily-approve", "title": "施工日况审批流程" }}
                        reflesh={this.updateFlow.bind(this)} />}
                {this.state.showApprovalVisible &&
                    <Approval
                        visible={true}
                        width={"1200px"}
                        proc={{ "bizTypeCode": "dc4-constructionDaily-approve", "title": "施工日况审批流程" }}
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