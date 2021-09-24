import React, { Component } from 'react'
import intl from 'react-intl-universal'
import { Table, notification } from 'antd'
import style from './style.less'
import { connect } from 'react-redux'
import { changeLocaleProvider } from '../../../../../store/localeProvider/action'
import RightTags from '../../../../../components/public/RightTags/index'
import * as util from '../../../../../utils/util';
import * as dataUtil from '../../../../../utils/dataUtil';
import {
    docWfCompList
} from '../../../../../api/api'
import axios from '../../../../../api/axios';
import MyIcon from "../../../../../components/public/TopTags/MyIcon";

class Delivery extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeIndex: [],
            rightData: [],
            data: [],
            initData: [],
            dataMap: [],
            projectData: [],
            taskData: [],
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
        this.getCompDocListByBizs();
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

    //获取问题发布列表
    getCompDocListByBizs = () => {
        const { formDatas } = this.props;
        let ids = dataUtil.Arr().toStringByObjectArr(formDatas, "bizId");
        if (ids && ids.length > 0) {
            axios.get(docWfCompList(ids)).then(res => {
                const { data } = res.data;
                const dataMap = util.dataMap(data);
                this.setState({
                    data: data || [],
                    initData: data || [],
                    dataMap
                })
            })
        }
        else {
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
        const { initData, tableData } = this.state;
        let newData = dataUtil.search(initData, [{ "key": "title", "value": value }], true);
        const dataMap = util.dataMap(newData);
        tableData[0].children = data
        this.setState({
            data: newData,
            dataMap
        });
    }

    render() {
        const columns = [
            {
                title: "文档标题",
                dataIndex: 'docTitle',
                key: 'docTitle'
            },
            {
                title: "文档编号",
                dataIndex: 'docNum',
                key: 'docNum'
            },
            {
                title: "文档密级",
                dataIndex: 'secutyLevel',
                key: 'secutyLevel',
                render: data => data ? data.name : ''
            },
            {
                title: "版本",
                dataIndex: 'version',
                key: 'version'
            },
            {
                title: "创建时间",
                dataIndex: 'creatTime',
                key: 'creatTime',
                render: (text) => dataUtil.Dates().formatDateString(text)
            },
            {
                title: "更新时间",
                dataIndex: 'updateTime',
                key: 'updateTime',
                render: (text) => dataUtil.Dates().formatDateString(text)
            },
            {
                title: "文档状态",
                dataIndex: 'status',
                key: 'status',
                render: data => data && data.name
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
                        rightTagList={this.state.rightTags}
                        rightData={this.state.rightData && this.state.rightData.length > 0 ? this.state.rightData[0] : null}
                        bizType="CompDoc"
                        bizId={this.state.rightData && this.state.rightData.length > 0 ? this.state.rightData[0].id : null}
                        projectId={this.state.projectId}
                        wfeditAuth = "false"
                        wfPubliceditAuth = {false}
                        cprtmEditAuth = {false}
                    />
                </div>
            </div>
        )
    }
}


/* *********** connect链接state及方法 start ************* */
export default connect(state => ({
    currentLocale: state.localeProviderData
}), { changeLocaleProvider })(Delivery);

