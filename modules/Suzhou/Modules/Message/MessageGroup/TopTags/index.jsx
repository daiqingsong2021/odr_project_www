import React, { Component } from 'react';
import dynamic from 'next/dynamic';
import { Select, notification, DatePicker, Button, Input } from 'antd';
import { connect } from 'react-redux';
import style from './style.less';
import axios from '@/api/axios';
import { expSmsGroupTemplate, updateSmsGroupStatus, delSmsGroup } from '@/modules/Suzhou/api/suzhou-api';
import PublicButton from '@/components/public/TopTags/PublicButton';
import notificationFun from '@/utils/notificationTip';
import { getBaseData } from '@/modules/Suzhou/components/Util/util';
//导入
import UploadDoc from '../ImportFile'
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
            line: '',
            groupName: '',
        }
    }
    componentDidMount() {

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
        //导入群组成员
        if (name == 'AddTopBtn') {
            const updateData = {}
            updateData.type = 'add'
            this.setState({
                updateData,
                UploadVisible: true,
            })
        }
        if (name === 'UpdateTopBtn') {
            if (selectedRows.length === 1) {
                const updateData = {}
                updateData.groupName = selectedRows[0].groupName;
                updateData.id = selectedRows[0].id;
                updateData.type = 'update'
                this.setState({
                    updateData,
                    UploadVisible: true,
                })
            } else if (selectedRows.length > 1) {
                notificationFun('提示', '请勿选择多条数据')
            } else {
                notificationFun('未选中数据', '请选择数据进行操作')
            }
        }
        // if(name === 'UpdateStatusTopBtn'){
        //     if (selectedRows.length === 1) {
        //         let status;
        //         if(selectedRows[0].status === 'NORMAL'){
        //             status = 'SUSPEND'
        //         }else if(selectedRows[0].status === 'SUSPEND'){
        //             status = 'NORMAL'
        //         }
        //         axios.put(updateSmsGroupStatus+`?id=${selectedRows[0].id}&status=${status}` ,{}, true).then(res => {
        //             if (res.data && res.data.success) {
        //                 this.props.updateSuccess();
        //             } else {
        //                 notification.error(
        //                     {
        //                         placement: 'bottomRight',
        //                         bottom: 50,
        //                         duration: 2,
        //                         message: '出错了',
        //                         description: '抱歉，网络开小差了，请稍后重试'
        //                     }
        //                 )
        //             }
        //         })
        //     } else if (selectedRows.length > 1) {
        //         notificationFun('提示', '请勿选择多条数据')
        //     } else {
        //         notificationFun('未选中数据', '请选择数据进行操作')
        //     }
        // }
        //删除
        if (name == 'DeleteTopBtn') {
            if (selectedRows) {
                const deleteArray = [];
                selectedRows.forEach((value, item) => {
                    if(value.status === 'SUSPEND'){
                        deleteArray.push(value.id)
                    }else{
                        notificationFun('提示', '启用状态下无法删除')
                    }
                })
                if (deleteArray.length > 0) {
                    axios.deleted(delSmsGroup, { data: deleteArray }, true).then(res => {
                        this.props.delSuccess(deleteArray);
                    }).catch(err => {
                    });
                }
            } else {
                notificationFun('未选中数据', '请选择数据进行操作')
            }

        }
        //导出群组模板
        if (name == 'ExportGroupTemplate') {
            axios.down(expSmsGroupTemplate, {}).then((res) => {
            })
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
    updateFlow = (data) => {
        this.props.updateFlow();
    }
    handleCancelImportFile = (v) => {
        this.setState({
            UploadVisible: false
        })
    }
    onChange = (val) => {
        this.setState({
            groupName: val ? val.target.value : '',
        })
    }
    render() {
        const { permission } = this.props
        const { groupName } = this.state
        return (
            <div className={style.main}>
                <div className={style.search}>
                    群组名称：
                    <Input size='small' style={{ width: 200, marginRight: 10 }} onChange={this.onChange} />
                    <Button type="primary" icon="search" size='small' onClick={this.props.search.bind(this, groupName)}>搜索</Button>
                </div>
                <div className={style.tabMenu}>
                    {permission.indexOf('SMSGROUP_ADD') !== -1 &&
                        <PublicButton name={'新增'} title={'新增'} icon={'icon-add'}
                            afterCallBack={this.btnClicks.bind(this, 'AddTopBtn')}
                            res={'MENU_EDIT'}
                        />}
                    <PublicButton title={"模板下载"} afterCallBack={this.btnClicks.bind(this, 'ExportGroupTemplate')} icon={"icon-iconziyuan2"}
                    />
                    {permission.indexOf('SMSGROUP_UPD') !== -1 &&
                        <PublicButton name={'修改'} title={'修改'} icon={'icon-edit'}
                            edit={true}
                            verifyCallBack={this.hasRecord}
                            afterCallBack={this.btnClicks.bind(this, 'UpdateTopBtn')}
                            res={'MENU_EDIT'}
                        />}
                    {/* {permission.indexOf('SMSGROUP_CHANGESTATUS') !== -1 && 
                        <PublicButton name={'启用'} title={'启用'} icon={'icon-edit'}
                            show={this.props.rightData && (this.props.rightData.status == 'SUSPEND') ? true : false}
                            verifyCallBack={this.hasRecord}
                            afterCallBack={this.btnClicks.bind(this, 'UpdateStatusTopBtn')}
                            res={'MENU_EDIT'}
                        />}
                    {permission.indexOf('SMSGROUP_CHANGESTATUS') !== -1 && 
                        <PublicButton name={'停用'} title={'停用'} icon={'icon-edit'}
                            show={this.props.rightData && (this.props.rightData.status == 'NORMAL') ? true : false}
                            verifyCallBack={this.hasRecord}
                            afterCallBack={this.btnClicks.bind(this, 'UpdateStatusTopBtn')}
                            res={'MENU_EDIT'}
                        />}     */}
                    {permission.indexOf('SMSGROUP_DEL') !== -1 &&
                        <PublicButton name={'删除'} title={'删除'} icon={'icon-shanchu'}
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
                        updateData={this.state.updateData}
                    />
                }
            </div>
        )
    }
}
export default TopTags;