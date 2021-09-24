import React, { Component } from 'react';
import dynamic from 'next/dynamic';
import { Button, TreeSelect ,Input ,Select} from 'antd';
import { connect } from 'react-redux';
import style from './style.less';
import axios from '@/api/axios';
import { trainScheduleDelete, trainScheduleAdd } from '@/modules/Suzhou/api/suzhou-api';
import { getBaseData } from '@/modules/Suzhou/components/Util/util';
import PublicButton from '@/components/public/TopTags/PublicButton';
import notificationFun from '@/utils/notificationTip';
import AddModal from '../AddModal'
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
            line:'' //线路
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
                    notificationFun('非新建状态数据不能删除', '时刻表：' + value.scheduleCode + "不能删除")
                    return false;
                }
            })
            if (deleteArray.length > 0) {
                axios.deleted(trainScheduleDelete, { data: deleteArray }, true).then(res => {
                    this.props.delSuccess(deleteArray);
                }).catch(err => {
                });
            }
        }
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
    render() {
        const { lineArr ,scheduleCode,line} = this.state
        const { } = this.props
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
                        <PublicButton name={'新增'} title={'新增'} icon={'icon-add'}
                            afterCallBack={this.btnClicks.bind(this, 'AddTopBtn')}
                            res={'MENU_EDIT'}
                        />
                        <PublicButton name={'删除'} title={'删除'} icon={'icon-shanchu'}
                        useModel={true} edit={true}
                        verifyCallBack={this.hasRecord}
                        afterCallBack={this.btnClicks.bind(this, 'DeleteTopBtn')}
                        content={'你确定要删除吗？'}
                        res={'MENU_EDIT'}
                        />
                </div>
                {/* 新增 */}
                {this.state.modalVisible && <AddModal
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