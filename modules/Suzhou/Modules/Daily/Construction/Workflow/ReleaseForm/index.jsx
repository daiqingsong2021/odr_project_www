import React, { Component } from 'react'
import intl from 'react-intl-universal'
import { Table, notification } from 'antd'
import style from './style.less'
import { connect } from 'react-redux'
import { changeLocaleProvider } from '../../../../../../../store/localeProvider/action'
import RightTags from '@/modules/Suzhou/components/RightTags/index';
import * as util from '../../../../../../../utils/util';
import * as dataUtil from '../../../../../../../utils/dataUtil';
import {constructionDailyListNoPage,getPermission} from '../../../../../api/suzhou-api';
import axios from '../../../../../../../api/axios';
import MyIcon from "../../../../../../../components/public/TopTags/MyIcon";
import { permissionFun,setRightShow } from "@/modules/Suzhou/components/Util/util.js";
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
            rightData: record
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
            axios.get(constructionDailyListNoPage+`?ids=${ids}`).then(res=>{
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
      changeRight=(result,msg)=>{
          console.log(result)
                setRightShow(result,msg).then(res=>{
                    this.setState({
                        ...res,
                        canModifyInit:false,
                        canModifyApproved:false
                    })
                })
            }
    render() {
        const columns = [
            // {
            //     title: "序号",
            //     render: (text, record, index) => index + 1
            // },
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
                title: '周计划',
                dataIndex: 'weeklyPlanConstructionQuantity',
                key: 'weeklyPlanConstructionQuantity',
                render:(text,record)=>{
                    return <span>{record.weeklyActualConstructionQuantity}/{record.weeklyPlanConstructionQuantity}</span>
                }
            },
            {
                title: '日补充',
                dataIndex: 'dailyPlanConstructionQuantity',
                key: 'dailyPlanConstructionQuantity',
                render:(text,record)=>{
                    return <span>{record.dailyActualConstructionQuantity}/{record.dailyPlanConstructionQuantity}</span>
                }
            },
            {
                title: '临补充',
                dataIndex: 'tempPlanConstructionQuantity',
                key: 'tempPlanConstructionQuantity',
                render:(text,record)=>{
                    return <span>{record.tempActualConstructionQuantity}/{record.tempPlanConstructionQuantity}</span>
                }
            },
            {
                title: '抢修施工',
                dataIndex: 'repairPlanConstructionQuantity',
                key: 'repairPlanConstructionQuantity',
                render:(text,record)=>{
                    return <span>{record.repairActualConstructionQuantity}/{record.repairPlanConstructionQuantity}</span>
                }
            },
            {
                title: '计划总数',
                dataIndex: 'totalPlanConstructionQuantity',
                key: 'totalPlanConstructionQuantity',
            },
            {
                title: '完成总数',
                dataIndex: 'totalActualConstructionQuantity',
                key: 'totalActualConstructionQuantity',
            },
            {
                title: '情况说明',
                dataIndex: 'description',
                key: 'description',
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
                {/* <div className={style.rightBox} style={{ height: this.props.height }}> */}
                <RightTags
                        canModifyApproved={this.state.canModifyApproved}
                        canModifyInit={this.state.canModifyInit}
                        fileRelease={true}
                        rightData={this.state.rightData}
                        isCheckWf={true}  //流程查看
                        openWorkFlowMenu = {this.props.openWorkFlowMenu}
                        menuCode = 'DAILYMANAGE-CONSTRUCTIONMANAGE'
                        menuId = {this.props.menuInfo.id}
                        bizType="DAILYMANAGE-CONSTRUCTIONMANAGE"
                        bizId = {this.state.rightData ? this.state.rightData.id : null}
                        fileEditAuth={true}
                        extInfo={{startContent: "施工日况"}}
                        rightTagShow={this.state.rightTagShow}
                        handleDouble={this.changeRight}
                    />
                {/* </div> */}

            </div>
        )
    }
}


/* *********** connect链接state及方法 start ************* */
export default connect(state => ({
    currentLocale: state.localeProviderData
}), {changeLocaleProvider})(Delivery);

