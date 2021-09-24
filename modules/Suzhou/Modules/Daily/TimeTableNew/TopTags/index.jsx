import React, { Component } from 'react';
import dynamic from 'next/dynamic';
import { Button, TreeSelect ,Input ,Select,Modal} from 'antd';
import { connect } from 'react-redux';
import style from './style.less';
import axios from '@/api/axios';
import { trainScheduleDelete, trainScheduleAdd,checkIsHave } from '@/modules/Suzhou/api/suzhou-api';
import { getBaseData } from '@/modules/Suzhou/components/Util/util';
import PublicButton from '@/components/public/TopTags/PublicButton';
import PublicMenuButton from "@/components/public/TopTags/PublicMenuButton";
import notificationFun from '@/utils/notificationTip';
import AddModal from '../RightTags'
import { multiply } from 'lodash';
const { SHOW_PARENT } = TreeSelect;
const { Option } = Select
export class TopTags extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false, //增加修改弹窗
            type: "ADD",
            lineArr:[],
            scheduleCode:'', //时刻表名称
            line:'', //线路
            delVisible:false,   //控制删除提示框展示
            deleteArray:[],
            delTextArr:[]
        }
    }
    componentDidMount() {
        const treeDataXl = [{
            title: '全部',
            value: '全部',
            key: '0',
            children: [
                {
                    title: '哈尔滨1号线',
                    value: '哈尔滨1号线',
                    key: '1',
                },
                // {
                //     title: '哈尔滨2号线',
                //     value: '哈尔滨2号线',
                //     key: '2',
                // },
                {
                    title: '哈尔滨3号线',
                    value: '哈尔滨3号线',
                    key: '3',
                }]
        }]
        getBaseData('line').then(data => { this.setState({ lineArr: data }) })
        // axios.get(getBaseSelectTree("base.flow.status")).then((res) => {
        //     if (Array.isArray(res.data.data)) {
        //         this.setState({
        //             optionStatus: res.data.data
        //         })
        //     }
        // });
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
        if (name == 'addLine1' || name == 'addLine3') {
            this.setState({
                modalVisible: true,
                addKey:name
            });
        }
        //删除
        if (name == 'DeleteTopBtn') {
            const deleteArray = [];
            selectedRows.forEach((value, item) => {
                if (value.reviewStatusVo.code == 'INIT') {
                    deleteArray.push(value.id)
                } else {
                    notificationFun('非新建状态数据不能删除', '时刻表：' + value.scheduleCode + "不能删除")
                    return false;
                }
            })
            if (deleteArray.length > 0) {
                axios.post(checkIsHave, deleteArray ).then(res=>{
                    if(res.data.data && res.data.data.length>0){
                        this.setState({
                            deleteArray,
                            delTextArr:res.data.data
                        },()=>{
                            this.setState({delVisible:true})
                        })
                    }else{
                        this.delFunction(deleteArray)
                    }
                })
                
            }
        }
        //下载
        if (name == 'DownloadBtn') {
            if (selectedRows.length == 0) {
                notificationFun('未选中数据', '请选择数据进行操作');
            } else {
                if (selectedRows.length > 1) {
                    notificationFun('提示', '只能选择一条进行文件下载');
                } else {
                    selectedRows.forEach((value, item)=>{
                        this.downloadFile(value,item);
                    })
                }
            }
        }
    }
    delFunction=(deleteArray)=>{
        axios.deleted(trainScheduleDelete, { data: deleteArray }, true).then(res => {
            this.props.delSuccess(deleteArray);
        }).catch(err => {
        });
    }
    downloadFile = (value,item) => {
        getBaseData('fr_url').then(data =>{//
            let scheduleCode = value.scheduleCode;
            scheduleCode = scheduleCode.replace("'", "\\\'");
            const url = `http://${data[0].value}/webroot/decision/view/form?viewlet=%25E7%2594%259F%25E6%2588%2590%25E6%2597%25B6%25E5%2588%25BB%25E8%25A1%25A8.frm&scheduleCode=${encodeURIComponent(encodeURIComponent(scheduleCode))}&line=${value.line}&__filename__=运营时刻表-${value.scheduleCode}&op=export&format=excel`
            // window.location.href = url
            var a = document.createElementNS('http://www.w3.org/1999/xhtml', 'a'); //创建a标签
            // var e = document.createEvent("MouseEvents"); //创建鼠标事件对象
            // e.initEvent("click", false, false); //初始化事件对象
            a.href = url; //设置下载地址
            a.download = "运营时刻表-"+value.scheduleCode;
            a.click();
            // a.dispatchEvent(e); //给指定的元素，执行事件click事件
        })
    }
    // submit = (values, type) => {
    //     const data = {
    //         ...values,
    //     };
    //     axios.post(trainScheduleAdd, data, true).then(res => {
    //         if (res.data.status === 200) {
    //             if (type == 'save') {
    //                 this.handleCancel();
    //             }
    //             this.props.success(res.data.data);
    //         }
    //     });
    // };
    //关闭model
    handleCancel = () => {
        this.setState({
            modalVisible: false,
        });
    };
    //线路选择
    selectOnChange=(val)=>{
        this.setState({
            line:val.join(',')
        })
    }
    //名称搜索
    onChange = (e) => {
        this.setState({
            scheduleCode:e.target.value
        })
    }

    //删除提示modal
    delHandleOk=()=>{
        this.delFunction(this.state.deleteArray)
    }
    delHandleCancel=()=>{
        this.setState({
            deleteArray:[],
            delVisible:false
        })
    }
    render() {
        const { lineArr ,scheduleCode,line} = this.state
        const { permission } = this.props
        return (
            <div className={style.main}>
                <div className={style.search}>
                    线路：
                    <Select allowClear showSearch mode='multiple' placeholder="请选择线路" size='small' style={{ minWidth: 150, marginRight: 10 }}
                      onChange={this.selectOnChange} filterOption={(input, option) =>
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                      {lineArr.map(item => {
                        return <Option key={item.value} value={item.value}>{item.title}</Option>
                      })}
                    </Select>
                    {/* <TreeSelect
                        treeData={lineArr}
                        showSearch
                        allowClear
                        treeCheckable
                        showCheckedStrategy={SHOW_PARENT}
                        treeDefaultExpandAll
                        size='small'
                        style={{ minWidth: 150, marginRight: 10 }}
                        placeholder="请选择线路"
                        onChange={this.selectOnChange}
                    /> */}
                    编码：
                    <Input size='small' placeholder='请输入时刻表编码' style={{ width: 150, marginRight: 10 }} onChange={this.onChange} />
                    <Button type="primary" icon="search" size='small' onClick={this.props.search.bind(this,scheduleCode,line)}>搜索</Button>
                </div>
                <div className={style.tabMenu}>
                        {/* {permission.indexOf('NEWTIMETABLE_ADD')!==-1 && <PublicButton name={'新增'} title={'新增'} icon={'icon-add'}
                            afterCallBack={this.btnClicks.bind(this, 'AddTopBtn')}
                            res={'MENU_EDIT'}
                        />} */}
                        {permission.indexOf('NEWTIMETABLE_ADD')!==-1 && 
                            <PublicMenuButton name={'新增'} title={'新增'} icon={'icon-add'}
                            afterCallBack={this.btnClicks}
                            menus={[{ key: 'addLine1', label: "1号线新增", icon: "icon-add", },
                            { key: "addLine3", label: "3号线新增", icon: "icon-add" }]}
                            />}
                        {permission.indexOf('NEWTIMETABLE_DEL')!==-1 &&
                        <PublicButton name={'删除'} title={'删除'} icon={'icon-shanchu'}
                        useModel={true} edit={true}
                        verifyCallBack={this.hasRecord}
                        afterCallBack={this.btnClicks.bind(this, 'DeleteTopBtn')}
                        content={'你确定要删除吗？'}
                        res={'MENU_EDIT'}
                        />}
                        {permission.indexOf('NEWTIMETABLE_DOWNLOAD')!==-1 &&
                        <PublicButton name={'下载'} title={'下载'} icon={'icon-daoru1'}
                            afterCallBack={this.btnClicks.bind(this, 'DownloadBtn')}
                            res={'MENU_EDIT'}
                        />}
                </div>
                {/* 删除提示 */}
                 <Modal
                        title="提示"
                        visible={this.state.delVisible}
                        onOk={this.delHandleOk}
                        onCancel={this.delHandleCancel}
                    >
                        {(this.state.delTextArr.length > 0) && 
                        this.state.delTextArr.map(value=>{
                            return <p>{value}</p>
                        })}
                        </Modal>
                {/* 新增 */}
                {this.state.modalVisible && <AddModal
                    addKey={this.state.addKey}
                    type='add'
                    record={[]}
                    modalVisible={this.state.modalVisible}
                    success={this.props.success}
                    // submit={this.submit.bind(this)}
                    handleCancel={this.handleCancel.bind(this)} />}
            </div>
        )
    }
}
export default TopTags;