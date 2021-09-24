import React, { Component } from 'react'
import intl from 'react-intl-universal'
import { Table, notification } from 'antd'
import style from './style.less'
import { connect } from 'react-redux'
import { changeLocaleProvider } from '../../../../../../../store/localeProvider/action'
import RightTags from '../../../../../../../components/public/RightTags/index'
import * as util from '../../../../../../../utils/util';
import * as dataUtil from '../../../../../../../utils/dataUtil';
import {meetingWfList} from '../../../../../../../api/api'
import {getFlowHolidayList,getPermission} from '../../../../../api/suzhou-api';
import axios from '../../../../../../../api/axios';
import MyIcon from "../../../../../../../components/public/TopTags/MyIcon";

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
            projectId: null,
            permission:[],
            projectId:''
        }
    }
    componentDidMount() {
        //监听全局点击事件
        document.addEventListener('click', this.closeRight);
        // 初始化数据
        this.initDatas();
        let menuCode = 'STAFF-LEAVEMANAGE'
        axios.get(getPermission(menuCode)).then((res)=>{
            let permission = []
            res.data.data.map((item,index)=>{
            permission.push(item.code)
            })
            this.setState({
            permission
            })
        })
    }

    /**
     * 初始化数据
     *
     */
    initDatas = () => {
        this.getComuMeetListByBizs();
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
            record:record,
            projectId:!record.projectId?'':record.projectId
        })
    }

    // 选中行高亮
    setClassName = (record) => {
        let activeId = this.state.activeIndex.length > 0 ? this.state.activeIndex[0] : -1;
        //判断索引相等时添加行的高亮样式
        return record.id === activeId ? "tableActivty" : "";
    }

    //获取发布列表
    getComuMeetListByBizs=()=>{
        const {formDatas} = this.props;
        let ids = dataUtil.Arr().toStringByObjectArr(formDatas,"bizId");
        if(ids && ids.length > 0){
            axios.get(getFlowHolidayList+`?ids=${ids}`).then(res=>{
                const { data } = res.data;
                const dataMap = util.dataMap(data);
                this.setState({
                  data: data || [],
                  initData: data || [],
                  dataMap
                })
            });
        }
         else{
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
        let newData = dataUtil.search(initData, [{ "key": "title", "value": value }], true);
        const dataMap = util.dataMap(newData);
        tableData[0].children=data
        this.setState({
            data: newData ,
            dataMap
        });
    }
    // 更新回调
    updateSuccess = (v) =>{
        const { data, dataMap ,record} = this.state;
        util.modify(data, dataMap, record, v);
        this.setState({
            data,
            dataMap
        });
    }
    render() {
        const columns = [
            {
                title: '编号',
                dataIndex: 'serialId',
                key: 'serialId',
            },
            {
                title:"项目名称",
                dataIndex: 'projectName',
                key: 'projectName',
            },
            {
                title:"标段名称",
                dataIndex: 'sectionName',
                key: 'sectionName',
            },
            {
                title: '请假人员',
                dataIndex: 'peopleName',
                key: 'peopleName',
            },
            {
                title: '所属单位',
                dataIndex: 'orgName',
                key: 'orgName',
            },
            {
                title:'开始时间',
                dataIndex: 'startTime',
                key: 'startTime',
                render:(text,record)=>{
                    return <span>{dataUtil.Dates().formatTimeString(text).substr(0,10)}</span>
                }
            },
            {
                title: '结束时间',
                dataIndex: 'endTime',
                key: 'endTime',
                render:(text,record)=>{
                    return <span>{dataUtil.Dates().formatTimeString(text).substr(0,10)}</span>
                }
            },
            {
                title: '天数',
                dataIndex: 'days',
                key: 'days',
            },
            {
                title:'类别',
                dataIndex: 'typeVo.name',
                key: 'typeVo.name',
            },
            {
                title: '请假原因',
                dataIndex: 'reason',
                key: 'reason',
            },
            {
                title:'状态',
                dataIndex: 'statusVo.name',
                key: 'statusVo.name',
            },
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
                        bizType={this.props.menuInfo.menuCode}
                        bizId = {this.state.rightData && this.state.rightData.length > 0 ? this.state.rightData[0].id : null}
                        projectId={this.state.projectId}
                        menuId = {this.props.menuInfo.id}
                        wfeditAuth = "false"
                        wfPubliceditAuth = {false}
                        fileEditAuth ={false}
                        meetActionEditAuth ={false}

                        taskFlag={!this.props.start?false:true}
                        permission={this.state.permission}
                        projectId={this.state.projectId}
                        updateSuccess={this.updateSuccess}
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

