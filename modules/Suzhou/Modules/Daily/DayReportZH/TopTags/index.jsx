import React, { Component } from 'react';
import dynamic from 'next/dynamic';
import { Select, notification, DatePicker, Button, TreeSelect, Form, Row, Col } from 'antd';
import { connect } from 'react-redux';
import style from './style.less';
import axios from '@/api/axios';
import { generateDailyWorkReportFile , generateCCDailyWorkReportFile, deleteReport } from '@/modules/Suzhou/api/suzhou-api';
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
            line:'',
            reportType:'',
            reviewStatus:''
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
                    deleteArray.push({id:value.id,fileId:value.fileId})
                } else {
                    notificationFun('非新建状态数据不能删除')
                    return false;
                }
            })
            if (deleteArray.length > 0) {
                axios.deleted(deleteReport, { data: deleteArray }, true).then(res => {
                    this.props.delSuccess(deleteArray);
                }).catch(err => {
                });
            }
        }
        //发布审批
        if (name == 'approve') {
            this.setState({
                isShowRelease: true,
                showApprovalVisible: true,
                projectName: "[" + projectName + "]"
            })
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
        const params = {
            ['line' + data.line]: data.line,
            date: data.date,
            description: data.description,
            keys: data.keys
        }
        if(type == 'save'){
            //指挥中心日报
            axios.post(generateCCDailyWorkReportFile, params, true).then(res => {
                // console.log(res)
                if(res.data && res.data.success){
                    this.props.success(res.data.data);
                    this.setState({
                        modalVisible:false
                    })
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
        // console.log(val)
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
    changeReportType = (val) => {
        this.setState({
            reportType: val
        })
    }
    changeReviewStatus = (val) => {
        this.setState({
            reviewStatus: val
        })
    }
    resetSearchParam = () => {
        // console.log(this.props.form)
        this.setState({
            reviewStatus:'',
            startTime:'',
            endTime:'',
            reportType:'',
            line:''
        })
        this.props.form.resetFields();
    }

    render() {
        const { treeDataXl ,startTime,endTime,line,reportType,reviewStatus} = this.state
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
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 8 },
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
                <Row style={{height:'40px'}}>
                {/* <Col span={5} style={{height:'40px'}}>
                    <Form.Item label="日报类型" {...formItemLayout}>
                        {getFieldDecorator('reportType', {
                        initialValue: undefined,
                        })(
                            <Select placeholder="请选择日报类型" size='small' style={{ minWidth: 150, marginRight: 10 }}  allowClear={true} onChange={this.changeReportType}>
                                <Option value="0">运营日报</Option>
                                <Option value="1">指挥中心日报</Option>
                            </Select>)}
                    </Form.Item>
                </Col> */}
                <Col span={6} style={{height:'40px'}}>
                    <Form.Item label="线路" {...formItemLayout0}>
                        {getFieldDecorator('line', {
                        initialValue: undefined,
                        })(
                            <TreeSelect
                                treeData={treeDataXl}
                                showSearch
                                allowClear
                                treeCheckable
                                showCheckedStrategy={SHOW_PARENT}
                                treeDefaultExpandAll
                                size='small'
                                style={{ minWidth: 130, marginRight: 10 }}
                                placeholder="请选择线路"
                                onChange={this.selectOnChange}
                            />)}
                    </Form.Item>
                </Col>
                <Col span={8} style={{height:'40px'}}>
                    <Form.Item label="审批状态" {...formItemLayout}>
                        {getFieldDecorator('reviewStatus', {
                        initialValue: undefined,
                        })(
                            <Select size='small' style={{ minWidth: 150, marginRight: 10 }} placeholder="请选择审批状态" allowClear={true} onChange={this.changeReviewStatus}>
                                <Option value="INIT">新建</Option>
                                <Option value="APPROVAL">审批中</Option>
                                <Option value="REJECT">被驳回</Option>
                                <Option value="APPROVED">已完成</Option>
                            </Select>)}
                    </Form.Item>
                </Col>
                <Col span={8} style={{height:'40px'}}>
                    <Form.Item label="日期范围" {...formItemLayout1}>
                        {getFieldDecorator('date', {
                        initialValue: undefined,
                        })(
                            <RangePicker size='small' style={{ minWidth: 200, marginRight: 10 }} onChange={this.onChange} />)}
                    </Form.Item>
                </Col>
                    </Row>
                    </Form>    
                    <div style={{display:'inline-block',marginTop:'8px',width:'200px'}}><Button type="default" icon="redo" size='small' style={{ marginRight: 10 }} onClick={this.resetSearchParam.bind(this)}>重置</Button>
                        <Button type="primary" icon="search" size='small' onClick={this.props.search.bind(this,startTime,endTime,line,treeDataXl,reportType,reviewStatus)}>搜索</Button></div>
                    
                </div>
                <div className={style.tabMenu}>
                    {permission && permission.indexOf('LIST-ZH_ADD') !== -1 && (
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
                    {permission && permission.indexOf('LIST-ZH_APPROVE') !== -1 && (
                        <PublicButton name={'发布审批'} title={'发布审批'} icon={'icon-fabu'}
                            afterCallBack={this.btnClicks.bind(this, 'approve')}
                            res={'MENU_EDIT'} />)}
                    {permission && permission.indexOf('LIST-ZH_DELETE') !== -1 && (
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
                        proc={{ "bizTypeCode": "processing-ccreport-approve", "title": "指挥中心日报审批流程" }}
                        reflesh={this.updateFlow.bind(this)} />}
                {this.state.showApprovalVisible &&
                    <Approval
                        visible={true}
                        width={"1200px"}
                        proc={{ "bizTypeCode": "processing-ccreport-approve", "title": "指挥中心日报审批流程" }}
                        searcher={this.props.searcher}
                        handleCancel={() => { this.setState({ showApprovalVisible: false }) }}
                        refreshData={this.props.updateFlow}
                        bizType={this.props.bizType}
                    />}
            </div>
        )
    }
}
const TopTagsForm = Form.create()(TopTags);
export default TopTagsForm;