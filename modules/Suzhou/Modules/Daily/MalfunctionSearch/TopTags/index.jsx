import React, { Component, Fragment } from 'react';
import dynamic from 'next/dynamic';
import { TreeSelect, Select, DatePicker, Button } from 'antd';
import { connect } from 'react-redux';
import style from './style.less';
import axios from '@/api/axios';
import { getBaseData } from '@/modules/Suzhou/components/Util/util';
import { faultDailyExport } from '@/modules/Suzhou/api/suzhou-api';
import PublicButton from '@/components/public/TopTags/PublicButton';
import notificationFun from '@/utils/notificationTip';
const { Option } = Select;
const { SHOW_PARENT } = TreeSelect;
const { RangePicker } = DatePicker
export class TopTags extends Component {
    constructor(props) {
        super(props);
        this.state = {
            treeDataXl:[],
            startTime: '',
            endTime: '',
            line:''
        }
    }
    componentDidMount() {
        const treeDataXl = [{
            title: '全部',
            value: '全部',
            key: '0',
        }]
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
        const { record, sectionId, selectedRows, projectName, projectId } = this.props;
        //导出
        if (name == 'exportFile') {
            axios.down(faultDailyExport, {}).then((res) => {
            })
        }
    }
    //线路选择
    selectOnChange=(val)=>{
        console.log(val)
        this.setState({
            line:val && val.length ? val.map(item=>item).join(',') : ''
        });
    }
    //range日期选择
    onChange = (val) => {
        this.setState({
            startTime: val.length > 0 ? val[0].format('YYYY-MM-DD') : '',
            endTime: val.length > 0 ? val[1].format('YYYY-MM-DD') : ''
        })
    }
    render() {
        const { treeDataXl ,startTime,endTime,line} = this.state
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
                    {true && (
                        <PublicButton name={'导出'} title={'导出'} icon={'icon-iconziyuan2'}
                            afterCallBack={this.btnClicks.bind(this, 'exportFile')} />)}
                </div>
            </div>
        )
    }
}
export default TopTags;