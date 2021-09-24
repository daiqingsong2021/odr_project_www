import React, { Component } from 'react'
import intl from 'react-intl-universal'
import { Table, notification } from 'antd'
import style from './style.less'
import { connect } from 'react-redux'
import { changeLocaleProvider } from '../../../../../store/localeProvider/action'
import RightTags from '../../../../../components/public/RightTags/index'
import * as util from '../../../../../utils/util';
import * as dataUtil from '../../../../../utils/dataUtil';
import {prepaWfList} from '../../../../../api/api'
import axios from '../../../../../api/axios';
import MyIcon from "../../../../../components/public/TopTags/MyIcon";

class Delivery extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeIndex: [],
            rightData: [],
            group: 1,
            data: [],
            initData: [],
            dataMap: [],
            projectData: [],
            projectId: null
        }
    }
    componentDidMount() {
        //监听全局点击事件
        document.addEventListener('click', this.closeRight);
        // 初始化数据
        this.initDatas();
    }

    /**
     * 初始化数据
     *
     */
    initDatas = () => {
        this.getPlanPrepaListByByBizs();
    }

    componentWillUnmount() {
        //销毁全局点击事件
        document.removeEventListener('click', this.closeRight, false);
    }

    // 获取选中的列表项
    getInfo = (record) => {
        this.setState({
            activeIndex: [record.id],
            rightData: [record],
        })
    }

    // 选中行高亮
    setClassName = (record) => {
        let activeId = this.state.activeIndex.length > 0 ? this.state.activeIndex[0] : -1;
        //判断索引相等时添加行的高亮样式
        return record.id === activeId ? "tableActivty" : "";
    }

    //获取项目立项列表
    getPlanPrepaListByByBizs=()=>{
        const {formDatas} = this.props;
        let ids = dataUtil.Arr().toStringByObjectArr(formDatas,"bizId");
        if(ids && ids.length > 0){
            axios.get(prepaWfList(ids)).then(res => {
                const { data } = res.data;
                const dataMap = util.dataMap(data);
                this.setState({
                  data: data || [],
                  initData: data || [],
                  dataMap
                })
              })
        }else{
          this.setState({
            data: [],
            initData: [],
            dataMap: {}
          })
        }
    }
    /**
     * 查询条件
     *
     * @param value
     */
    search = (value) => {
        const { initData ,tableData} = this.state;
        let newData = dataUtil.search(initData, [{ "key": "paName|paCode", "value": value }], true);
        const dataMap = util.dataMap(newData);
        tableData[0].children=data
        this.setState({
            data: newData ,
            dataMap
        });
    }

    render() {
        const columns = [
            {
                title: intl.get('wsd.i18n.plan.feedback.name'),
                dataIndex: 'paName',
                key: 'paName',
                render: (text, record) => dataUtil.getIconCell(record.nodeType,text,record.taskType)
            },
            {
                title: intl.get('wsd.i18n.pre.project1.projectcode'),
                dataIndex: 'paCode',
                key: 'paCode'
            },
            {
                title: intl.get("wsd.i18n.pre.proreview.epsname"),
                dataIndex: 'epsName',
                key: 'epsName',
            },
            {
                title: intl.get('wsd.i18n.pre.proreview.iptname'),
                dataIndex: 'org',
                key: 'org',
                render: data => data && data.name
            },
            {
                title: intl.get('wsd.i18n.pre.proreview.username'),
                dataIndex: 'user',
                key: 'user',
                render: data => data && data.name
            },
            {
                title: intl.get('wsd.i18n.operate.prepared.planstarttime'),
                dataIndex: 'planStartTime',
                key: 'planStartTime',
                render: (text) =>  dataUtil.Dates().formatDateString(text)
            },
            {
                title: intl.get('wsd.i18n.operate.prepared.planendtime'),
                dataIndex: 'planEndTime',
                key: 'planEndTime',
                render: (text) =>  dataUtil.Dates().formatDateString(text)
            },
            {
                title: intl.get("wsd.i18n.pre.project1.totalBudget"),
                dataIndex: 'totalBudget',
                key: 'totalBudget',
            },
            {
                title: intl.get('wsd.i18n.pre.proreview.creator'),
                dataIndex: 'creator',
                key: 'creator',
                render: data => data && data.name
            },
            {
                title: intl.get('wsd.i18n.pre.proreview.creattime'),
                dataIndex: 'creatTime',
                key: 'creatTime',
                render: (text) =>  dataUtil.Dates().formatDateString(text)
            }
        ];

        return (
            <div className={style.main}>
                <div className={style.leftMain} style={{ height: this.props.height }}>
                    <div style={{ minWidth: 'calc(100vw - 60px)' }}>
                        <Table className={style.Infotable1}
                            columns={columns}
                            pagination={false}
                            dataSource={this.state.data}
                            rowClassName={this.setClassName}
                            rowKey={record => record.id}
                            defaultExpandAllRows={true}
                            size={"small"}
                            onRow={(record, index) => {
                                return {
                                    onClick: () => {
                                        this.getInfo(record, index)
                                    }
                                }
                            }} />
                    </div>
                </div>
                <div className={style.rightBox} style={{ height: this.props.height }}>
                    <RightTags
                        menuCode={this.props.menuInfo.menuCode}
                        groupCode={this.state.group}
                        rightTagList={this.state.rightTags}
                        rightData={this.state.rightData && this.state.rightData.length > 0 ? this.state.rightData[0] : null}
                        getBaseSelectTree={this.getBaseSelectTree}
                        bizType="prepa"
                        bizId = {this.state.rightData && this.state.rightData.length > 0 ? this.state.rightData[0].id : null}
                        fileEditAuth = {false}
                        projectId={this.state.projectId}
                        wfeditAuth = "false"
                        wfPubliceditAuth = {false}
                        projectTeamEditAuth = {false}
                        linkManEditAuth={false}
                        fileEditAuth={false}
                        menuEdit={false}
                    />
                </div>
            </div>
        )
    }
}


/* *********** connect链接state及方法 start ************* */
export default connect(state => ({
    currentLocale: state.localeProviderData
}), {changeLocaleProvider})(Delivery);

