import React, { Component } from 'react'
import intl from 'react-intl-universal'
import { Table, notification } from 'antd'
import style from './style.less'
import { connect } from 'react-redux'
import { changeLocaleProvider } from '../../../../../../../store/localeProvider/action'
import RightTags from '../../../../../../../components/public/RightTags/index';
import * as util from '../../../../../../../utils/util';
import * as dataUtil from '../../../../../../../utils/dataUtil';
import {getFlowFineDailyReports,getPermission} from '../../../../../api/suzhou-api';
import { getBaseData } from '@/modules/Suzhou/components/Util/util';
import axios from '../../../../../../../api/axios';
import MyIcon from "../../../../../../../components/public/TopTags/MyIcon";
import {permissionFun} from "@/modules/Suzhou/components/Util/util.js";
import { docFileInfo} from '../../../../../../../api/api';
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
            axios.get(getFlowFineDailyReports+`?ids=${ids}`).then(res=>{
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
       handleViewFile = (record) => {
        // console.log(record)
        getBaseData('fr_url').then(data => { window.open(`http://${data[0].value}/webroot/decision/view/form?viewlet=%25E8%25BF%2590%25E8%2590%25A5%25E6%2597%25A5%25E6%258A%25A5-%25E5%2588%2597%25E8%25A1%25A8%25E7%2594%259F%25E6%2588%2590.frm&para_record_time=${record.reportName}&line=${record.line}&initMan=${record.initMan?record.initMan:''}&creatTime=${record.creatTime?record.creatTime:''}&reviewor=${record.reviewor?record.reviewor:''}`) })
    }
    render() {
        const columns = [
            {
                title: '日报日期',
                dataIndex: 'reportName',
                key: 'reportName',
                render: (text, record) => {
                    return <span onClick={this.handleViewFile.bind(this,record)} style={{ color: 'rgb(45,182,244)', cursor: 'pointer' }}>{text}</span>
                    // return <span onClick={this.openInfo.bind(this, record)} style={{ color: 'rgb(45,182,244)', cursor: 'pointer' }}>{text}</span>
                }
            },
            // {
            //     title: '日报类型',
            //     dataIndex: 'reportTypeVo.name',
            //     key: 'reportTypeVo.name',
            // },
            {
                title: '生成人',
                dataIndex: 'initMan',
                key: 'initMan',
            },
            {
                title: '生成日期',
                dataIndex: 'creatTime',
                key: 'creatTime',
            },
            {
                title: '线路',
                dataIndex: 'line',
                key: 'line',
                render:(text,record)=>{
                    return <span>{text}号线</span>
                }
            },
            {
                title: '审批状态',
                dataIndex: 'reviewStatusVo.name',
                key: 'reviewStatusVo.name',
            },
            {
                title: '审批人',
                dataIndex: 'reviewor',
                key: 'reviewor',
            },
            {
                title: '日报备注',
                dataIndex: 'description',
                key: 'description',
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

