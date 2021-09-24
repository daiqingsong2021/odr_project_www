import React, { Component } from 'react';
import dynamic from 'next/dynamic';
import { Select, notification, DatePicker, Button ,Input } from 'antd';
import { connect } from 'react-redux';
import style from './style.less';
import axios from '@/api/axios';
import { downEnergyDetailTemplate, uploadEnergyDetailInfo, delTrainFoundationList, energyDailyApproved } from '@/modules/Suzhou/api/suzhou-api';
import PublicButton from '@/components/public/TopTags/PublicButton';
import notificationFun from '@/utils/notificationTip';
import { getBaseData } from '@/modules/Suzhou/components/Util/util';
//新增
import AddModal from '../AddModal'
//修改
import EditModal from '../EditModal'
import PublicMenuButton from "@/components/public/TopTags/PublicMenuButton";
import { contractLaborOfflineadd, contractLaborpaygz, getReleaseMeetingList } from "../../../../../../api/api"
const { Option } = Select;
const { RangePicker } = DatePicker
export class TopTags extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false, //增加弹窗
            editModalVisible:false,//修改弹窗
            type: "ADD",
            uploadUrl: '',
            lineArr: [],
            line: '',
            linecode:'',
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
        if(name == 'EditTopBtn') {
            const {rightData} = this.props
            if (rightData || selectedRows){
                if(selectedRows.length>1){
                    notificationFun("警告","只能选择一条数据！")
                }else{
                    this.setState({
                        editModalVisible: true,
                    })
                }
                
             }
             else{
                notificationFun("提示","请选择数据！")
             }
        }
           
        //删除
        if (name == 'DeleteTopBtn') {
            const {selectedRowKeys} = this.props
            if (selectedRowKeys.length > 0) {
                axios.deleted(delTrainFoundationList, { data:selectedRowKeys}, true).then(res => {
                    this.props.delSuccess();
                }).catch(err => {
                });
            }
            else{
                notificationFun("提示","请选择数据！")
            }
        }
    }
    //关闭model
    handleCancel = () => {
        this.setState({
            modalVisible: false,
            editModalVisible:false
        });
    };
    onChange = ({target:{value}}) => {
        console.log(22,value)
        this.setState({
            linecode:value
        })
    }
    //重置
    clearData = () => {
        console.log(11)
        this.setState({
            linecode:'',
            line:''
        },()=>{
            this.props.search('');
        })
    }
    render() {
        const { permission } = this.props
        const { lineArr, startTime, endTime, line } = this.state
        return (
            <div className={style.main}>
                <div className={style.search}>
                    {/* <Input 
                      placeholder="请输入列车编号" 
                      size='small' 
                      value={this.state.linecode} 
                      style={{ minWidth: 150, marginRight: 10 }} 
                      onChange={this.onChange}
                    /> */}
                    线路：
                    <Select 
                      placeholder="请选择线路"
                      allowClear 
                      showSearch 
                      size='small' 
                      value={line}
                      style={{ minWidth: 150, marginRight: 10 }}
                        onChange={this.selectOnChange} 
                        filterOption={(input, option) =>
                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                        {lineArr.map(item => {
                            return <Option key={item.value} value={item.value}>{item.title}</Option>
                        })}
                    </Select>
                    <Button type="primary" icon="search" size='small' style={{ marginRight: 10 }} onClick={this.props.search.bind(this,line)}>搜索</Button>
                    <Button type="primary" size='small' onClick={this.clearData}>重置</Button>
                </div>
                <div className={style.tabMenu}>
                    {permission.indexOf('TRAININFORMATION_ADD') !== -1 &&
                        <PublicButton name={'新增'} title={'新增'} icon={'icon-add'}
                            afterCallBack={this.btnClicks.bind(this, 'AddTopBtn')}
                            res={'MENU_EDIT'}
                        />}
                    {/* {permission.indexOf('TRAININFORMATION_EDIT') !== -1 &&
                     <PublicButton name={'修改'} title={'修改'} icon={'icon-edit'}
                     afterCallBack={this.btnClicks.bind(this, 'EditTopBtn')}
                     res={'MENU_EDIT'}
                 />} */}
                    {permission.indexOf('TRAININFORMATION_DEL') !== -1 &&
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
                 {/* 修改 */}
                 {this.state.editModalVisible &&
                    <EditModal
                        editModalVisible={this.state.editModalVisible}
                        updateSuccess={this.props.updateSuccess}
                        handleCancel={this.handleCancel}
                        rightData={this.props.rightData}
                        selectedRows={this.props.selectedRows}
                        delSuccess={this.props.delSuccess}
                    />
                }
            </div>
        )
    }
}
export default TopTags;