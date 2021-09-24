import React, { Component, Fragment } from 'react';
import dynamic from 'next/dynamic';
import { TreeSelect, Select, DatePicker, Button } from 'antd';
import { connect } from 'react-redux';
import style from './style.less';
import axios from '@/api/axios';
import { getBaseData } from '@/modules/Suzhou/components/Util/util';
import { dowClassification } from '@/modules/Suzhou/api/suzhou-api';
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
            treeDataZd:[],
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
                // }
            ]
        }]
        const treeDataZd = [{
            title: '全部',
            value: '全部',
            key: '0',
            children: [
                {
                    title: '哈尔滨南站',
                    value: '哈尔滨南站',
                    key: '1',
                },
                {
                    title: '哈达',
                    value: '哈达',
                    key: '2',
                },
                {
                    title: '医大二院',
                    value: '医大二院',
                    key: '3',
                },
                {
                    title: '黑龙江大学',
                    value: '黑龙江大学',
                    key: '4',
                },
                {
                    title: '理工大学',
                    value: '理工大学',
                    key: '5',
                },
                {
                    title: '学府路',
                    value: '学府路',
                    key: '6',
                }]
        }]
        this.setState({
            treeDataXl,
            treeDataZd,
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
        const { record, sectionId, selectedRows, projectName, projectId } = this.props;
        //导出
        if (name == 'exportFile') {
            axios.down(dowClassification, {}).then((res) => {
            })
        }
    }
    onChange = () => {

    }
    render() {
        const { treeDataXl, treeDataZd } = this.state
        return (
            <div className={style.main}>
                <div className={style.search}>
                    日期范围：
                    <RangePicker size='small' style={{ width: 200, marginRight: 10 }} onChange={this.onChange} />
                    <Button type="primary" icon="search" size='small' onClick={this.props.search}>搜索</Button>
                </div>
                <div className={style.tabMenu}>
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
                    //onChange={this.selectOnChange}
                    />
                    站点：<TreeSelect
                        treeData={treeDataZd}
                        showSearch
                        allowClear
                        treeCheckable
                        showCheckedStrategy={SHOW_PARENT}
                        treeDefaultExpandAll
                        size='small'
                        className={style.selectBox}
                        style={{ minWidth: 150, marginRight: 10 }}
                        placeholder="请选择站点"
                    //onChange={this.selectOnChange}
                    />
                    {true && (
                        <PublicButton name={'导出'} title={'导出'} icon={'icon-iconziyuan2'}
                            afterCallBack={this.btnClicks.bind(this, 'exportFile')} />)}
                </div>
            </div>
        )
    }
}
export default TopTags;