import React, { Component } from 'react';
import dynamic from 'next/dynamic';
import { Select, notification, DatePicker, Button } from 'antd';
import { connect } from 'react-redux';
import style from './style.less';
import axios from '@/api/axios';
import {  delTrafficMain , uploadTrafficMainFile ,approvedTraffic} from '@/modules/Suzhou/api/suzhou-api';
import PublicButton from '@/components/public/TopTags/PublicButton';
import notificationFun from '@/utils/notificationTip';
//导入
import UploadDoc from '../../../../components/ImportFileForSitution'
import PublicMenuButton from "@/components/public/TopTags/PublicMenuButton";
//流程
import Release from "../../../../../Components/Release";
import { getReleaseMeetingList } from "../../../../../../api/api"
import Approval from '../Workflow/Approval';
const { Option } = Select;
const { RangePicker } = DatePicker
export class TopTags extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false, //增加修改弹窗
            type: "ADD",
            rangeStartDate: '',
            rangeEndDate: '',
            userId:''
        }
    }
    componentDidMount() {
        let userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
            this.setState({
                userId:userInfo.id,
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
        const { selectedRows, projectName } = this.props;
        //修改
        if (name == 'UpdateBtn') {
            this.setState({
                modalVisible: true,
            });
        }
        //excel导入
        if (name == 'ImportFile') {
            this.setState({
                UploadVisible: true
            })
        }
        //删除
        if (name == 'DeleteTopBtn') {
            const deleteArray = [];
            selectedRows.forEach((value, item) => {
                if (value.statusVo.code == 'INIT') {
                    deleteArray.push({id:value.id,recordTime:value.recordTime})
                } else {
                    notificationFun('非新建状态数据不能删除', '日期为' + value.recordTime + "不能删除")
                    return false;
                }
            })
            if (deleteArray.length > 0) {
                axios.deleted(delTrafficMain, { data: deleteArray }, true).then(res => {
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
                if(value.statusVo.code == 'INIT'){
                    approveArray.push(value.id)
                    notificationFun('提示',"发布成功")
                }else {
                    notificationFun('非新建状态数据不能发布', '日期为' + value.recordTime + "不能发布")
                    return false;
                }
            })
            if(approveArray.length >0){
                axios.get(approvedTraffic+ '?ids=' + approveArray.join(',')).then(res =>{
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
        axios.post(addClassification, data, true).then(res => {
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
    handleCancelImportFile = (v) => {
        this.setState({
            UploadVisible: false
        })
    }
    onChange = (val) => {
        console.log(val)
        this.setState({
            rangeStartDate: val.length > 0 ? val[0].format('YYYY-MM-DD') : '',
            rangeEndDate: val.length > 0 ? val[1].format('YYYY-MM-DD') : ''
        })
    }
    render() {
        const { rangeStartDate, rangeEndDate } = this.state
        const { permission } = this.props
        return (
            <div className={style.main}>
                <div className={style.search}>
                    日期范围：
                    <RangePicker size='small' style={{ width: 200, marginRight: 10 }} onChange={this.onChange} />
                    <Button type="primary" icon="search" size='small' onClick={this.props.search.bind(this, rangeStartDate, rangeEndDate)}>搜索</Button>
                </div>
                <div className={style.tabMenu}>
                    {/* <PublicButton name={'新增'} title={'新增'} icon={'icon-add'}
                            afterCallBack={this.btnClicks.bind(this, 'AddTopBtn')}
                            res={'MENU_EDIT'}
                        /> */}
                    {/* {true && (
                        <PublicButton name={'修改'} title={'修改'} icon={'icon-xiugaibianji'}
                            afterCallBack={this.btnClicks.bind(this, 'UpdateBtn')}
                            res={'MENU_EDIT'}
                        />)} */}
                    {permission.indexOf('SITUATIONMANAGE_SITUATION-ADD')!==-1 && <PublicButton name={'导入'} title={'导入'} icon={'icon-daoru1'}
                        afterCallBack={this.btnClicks.bind(this, 'ImportFile')}
                        res={'MENU_EDIT'}
                    />}
                    {/* {true && (
                        <PublicMenuButton title={"导入"} afterCallBack={this.btnClicks} icon={"icon-iconziyuan1"}
                            menus={[{ key:'ImportFile' , label: "excel导入", icon: "icon-iconziyuan1", },
                            { key: "ImportCont", label: "从合同导入", icon: "icon-iconziyuan1" }]}
                        />)} */}
                    {/* {true && (
                        <PublicButton name={'导出'} title={'导出模版'} icon={'icon-iconziyuan2'}
                            afterCallBack={this.btnClicks.bind(this, 'exportFile')} />)} */}
                    {permission.indexOf('SITUATIONMANAGE_SITUATION-APPROVE')!==-1 && <PublicButton name={'发布'} title={'发布'} icon={'icon-fabu'}
                            afterCallBack={this.btnClicks.bind(this, 'approve')}
                            res={'MENU_EDIT'} />}
                    {permission.indexOf('SITUATIONMANAGE_SITUATION-DEL')!==-1 && <PublicButton name={'删除'} title={'删除'} icon={'icon-shanchu'}
                            useModel={true} edit={true}
                            verifyCallBack={this.hasRecord}
                            afterCallBack={this.btnClicks.bind(this, 'DeleteTopBtn')}
                            content={'你确定要删除吗？'}
                            res={'MENU_EDIT'}
                        />}
                </div>
                {/* excel导入 */}
                {this.state.UploadVisible &&
                    <UploadDoc
                        modalVisible={this.state.UploadVisible}
                        handleOk={this.handleOk}
                        handleCancel={this.handleCancelImportFile}
                        getListData={this.props.updateImportFile}
                        url={`${uploadTrafficMainFile}?userId=${this.state.userId}`}
                    />
                }
                {/* 流程审批 */}
                {this.state.isShowRelease &&
                    <Release
                        projectName={this.props.projectName}
                        firstList={getReleaseMeetingList}
                        handleCancel={this.handleCancelRelease}
                        projectId={this.props.projectId}
                        proc={{ "bizTypeCode": "dc1-trafficDaily-approve", "title": "客运日况发布审批" }}
                        reflesh={this.updateFlow.bind(this)} />}
                {this.state.showApprovalVisible &&
                    <Approval
                        visible={true}
                        width={"1200px"}
                        proc={{ "bizTypeCode": "dc1-trafficDaily-approve", "title": "客运日况发布审批" }}
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