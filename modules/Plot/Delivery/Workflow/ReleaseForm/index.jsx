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
    getPlanDelvTreeListByDevIds
} from '../../../../../api/api'
import axios from '../../../../../api/axios';
import MyIcon from "../../../../../components/public/TopTags/MyIcon";

class Delivery extends Component {
    constructor(props) {
        super(props)
        this.state = {
            initDone: false,
            activeIndex: [],
            currentPage: 1,
            pageSize: 10,
            group: 1,
            rightData: [],
            data: [],
            initData: [],
            dataMap: [],
            delivType: [],
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
        this.getPlanDelvTreeListByDevIds();
    }

    componentWillUnmount() {
        //销毁全局点击事件
        document.removeEventListener('click', this.closeRight, false);
    }

    // 获取选中的列表项
    getInfo = (record) => {
        let group = record.type == "delv"? 1:-1;
        this.setState({
            activeIndex: [record.id],
            rightData: [record],
            group: group
        })
    }

    // 选中行高亮
    setClassName = (record) => {
        let activeId = this.state.activeIndex.length > 0 ? this.state.activeIndex[0] : -1;
        //判断索引相等时添加行的高亮样式
        return record.id === activeId ? "tableActivty" : "";
    }

    //获取项目交付物列表
    getPlanDelvTreeListByDevIds=()=>{
        const {formDatas } = this.props;
        let ids = dataUtil.Arr().toStringByObjectArr(formDatas,"bizId");
        if(ids && ids.length > 0){
          axios.get(getPlanDelvTreeListByDevIds(ids)).then(res => {
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
        let newData = dataUtil.search(initData, [{ "key": "delvTitle|delvCode", "value": value }], true);
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
                title: intl.get('wsd.i18n.pre.project1.projectname'),
                dataIndex: 'delvTitle',
                key: 'delvTitle',
                render: (text, record) => {
                    let icon = dataUtil.getIcon(record.type);
                    return  <span><MyIcon type={icon} style={{ fontSize: '18px' ,verticalAlign:"middle"}}/> { text} </span>
                }
            },
            {
                title: intl.get('wsd.i18n.pre.project1.projectcode'),
                dataIndex: 'delvCode',
                key: 'delvCode'
            },
            {
                title: intl.get("wsd.i18n.plan.delvList.delvtype"),
                dataIndex: 'type',
                key: 'type',
                render: text => text == 'pbs' ? "PBS" : text == 'delv' ? "交付物":null
            },
            {
                title: "交付物类别",
                dataIndex: 'delvTypeVo',
                key: 'delvTypeVo',
                render: (text, record) => {
                    let ret = text && record.type === "delv" ? text.name : "";
                    return ret;
                }
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
                        menuId = {this.props.menuInfo.id}
                        menuCode={this.props.menuInfo.menuCode}
                        groupCode={this.state.group}
                        rightTagList={this.state.rightTags}
                        rightData={this.state.rightData && this.state.rightData.length > 0 ? this.state.rightData[0] : null}
                        getBaseSelectTree={this.getBaseSelectTree}
                        bizType="delv"
                        bizId = {this.state.rightData && this.state.rightData.length > 0 ? this.state.rightData[0].id : null}
                        fileEditAuth = {false}
                        projectId={this.state.projectId}
                        delivType={this.state.delivType}
                        initFileInfoList={this.getPlanDelvAssignFileList} //初始化文件信息列表
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

