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
import {getFlowPeopleEntryList,getPermission} from '../../../../../api/suzhou-api';
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
        }
    }
    componentDidMount() {
        let menuCode = 'STAFF-ENTRYAEXIT'
        axios.get(getPermission(menuCode)).then((res)=>{
            let permission = []
            res.data.data.map((item,index)=>{
            permission.push(item.code)
            })
            this.setState({
            permission
            })
        })
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
            record:record
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
            axios.get(getFlowPeopleEntryList+`?ids=${ids}`).then(res=>{
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
        console.log(record);
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
                dataIndex: 'code',
                key: 'code',
                sorter: (a, b) => a.code - b.code,
            },
            {
                title:'项目名称',
                dataIndex: 'projectName',
                key: 'projectName',
            },
            {
                title: '标段名称',
                dataIndex: 'sectionName',
                key: 'sectionName',
            },
            {
                title: '类别',
                dataIndex: 'typeVo.name',
                key: 'typeVo.name',
            },
            {
                title:'单位名称',
                dataIndex: 'orgName',
                key: 'orgName',
            },
            {
                title: '人数',
                dataIndex: 'peoNums',
                key: 'peoNums',
            },
            {
                title: '进退场时间',
                dataIndex: 'entryTime',
                key: 'entryTime',
                render:(text,record)=>{
                  return <span>{dataUtil.Dates().formatTimeString(text).substr(0,10)}</span>
                }
            },
            {
                title:'人员类型',
                dataIndex: 'peoEntryTypeVo.name',
                key: 'peoEntryTypeVo.name',
            },
            {
                title:'状态',
                dataIndex: 'statusVo.name',
                key: 'statusVo.name',
            },
            {
              title:'创建人',
              dataIndex: 'creater',
              key: 'creater',
            },
            {
              title:'创建时间',
              dataIndex: 'createTime',
              key: 'createTime',
              render:(text,record)=>{
                return <span>{dataUtil.Dates().formatTimeString(text).substr(0,10)}</span>
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
                        menuCode={this.props.menuInfo.menuCode}
                        rightTagList={this.state.rightTags}
                        rightData={this.state.rightData && this.state.rightData.length > 0 ? this.state.rightData[0] : null}
                        bizType='STAFF-ENTRYAEXIT'
                        bizId = {this.state.rightData && this.state.rightData.length > 0 ? this.state.rightData[0].id : null}
                        projectId={this.state.projectId}
                        menuId = {this.props.menuInfo.id}
                        wfeditAuth = "false"
                        wfPubliceditAuth = {false}

                        fileEditAuth ={false}
                        meetActionEditAuth ={false}
                        permission={this.state.permission}
                        taskFlag={!this.props.start?false:true}
                        fileEditAuth={true}
                        isShow={this.state.permission.indexOf('ENTRYAEXIT_EDIT-FILE-ENTRY')==-1?false:true} //文件权限
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

