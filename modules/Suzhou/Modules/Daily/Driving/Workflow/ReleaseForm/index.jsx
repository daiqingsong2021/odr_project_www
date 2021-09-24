import React, { Component } from 'react'
import intl from 'react-intl-universal'
import { Table, notification } from 'antd'
import style from './style.less'
import { connect } from 'react-redux'
import { changeLocaleProvider } from '../../../../../../../store/localeProvider/action'
import RightTags from '@/modules/Suzhou/components/RightTags/index';
import * as util from '../../../../../../../utils/util';
import * as dataUtil from '../../../../../../../utils/dataUtil';
import {getTrainDailList,getPermission} from '../../../../../api/suzhou-api';
import axios from '../../../../../../../api/axios';
import MyIcon from "../../../../../../../components/public/TopTags/MyIcon";
import {permissionFun,setRightShow} from "@/modules/Suzhou/components/Util/util.js";

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
            permission:[]
        }
    }
    componentDidMount() {
        // let menuCode = 'MATERIEL-SORT'
        //     axios.get(getPermission(menuCode)).then((res)=>{
        //     let permission = []
        //     res.data.data.map((item,index)=>{
        //         permission.push(item.code)
        //     })
        //     this.setState({
        //         permission
        //     })
        // })
        permissionFun('MATERIEL-SORT').then(res=>{
            this.setState({
                permission:!res.permission?[]:res.permission
            })
          });
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
            record
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
            axios.get(getTrainDailList+`?ids=${ids}`).then(res=>{
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
    updateSuccess = data => {
        this.setState({
          rightData: {  ...data },
          data: this.state.data.map(item => (item.id === data.id ? { ...item, ...data } : item)),
        });
      };
      //弹窗 页签
    changeRight=(result,msg)=>{
                setRightShow(result,msg).then(res=>{
                this.setState({
                    ...res,
                })
                })
            }
    render() {
        const columns = [
            {
                title: "序号",
                render: (text, record, index) => index + 1
            },
            {
                title: '日期',
                dataIndex: 'recordTime',
                key: 'recordTime',
                render: (text, record) => {
                    return <span onClick={this.changeRight.bind(this, record)} style={{ color: 'rgb(45,182,244)', cursor: 'pointer' }}>{text}</span>
                }
            },
            {
                title: '线路',
                dataIndex: 'lineName',
                key: 'lineName',
            },
            {
                title: '时刻表编码',
                dataIndex: 'trainScheduleVo.scheduleCode',
                key: 'trainScheduleVo.scheduleCode',
            },
            {
                title: '计划开行(列)',
                dataIndex: 'trainScheduleVo.plannedOperationColumn',
                key: 'trainScheduleVo.plannedOperationColumn',
            },
            {
                title: '实际开行(列)',
                dataIndex: 'actualOperatingColumn',
                key: 'actualOperatingColumn',
            },
            {
                title: '空驶里程(列公里)',
                dataIndex: 'deadheadKilometres',
                key: 'deadheadKilometres',
            },
            {
                title: '载客里程(列公里)',
                dataIndex: 'carryingKilometres',
                key: 'carryingKilometres',
            },
            {
                title: '运营里程(列公里)',
                dataIndex: 'operatingKilometres',
                key: 'operatingKilometres',
            },
            {
                title: '上报人',
                dataIndex: 'createrVo.name',
                key: 'createrVo.name',
            },
            {
                title: '状态',
                dataIndex: 'reviewStatusVo.name',
                key: 'reviewStatusVo.name',
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
                        bizType={this.props.proc.formDatas[0].bizType}
                        bizId = {this.state.rightData && this.state.rightData.length > 0 ? this.state.rightData[0].id : null}
                        projectId={this.state.projectId}
                        menuId = {this.props.menuInfo.id}
                        wfeditAuth = "false"
                        wfPubliceditAuth = {false}
                        fileEditAuth ={false}
                        meetActionEditAuth ={false}
                        taskFlag={!this.props.start?false:true}
                        updateSuccess={this.updateSuccess}
                        isShow={this.state.permission.indexOf('SORT_FILE-MATERIEL-SORT')==-1?false:true} //文件权限
                        permission={this.state.permission}
                        record={this.state.record}
                        rightTagShow={this.state.rightTagShow}
                        handleDouble={this.changeRight}
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

