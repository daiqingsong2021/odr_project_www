import React, { Component } from 'react'
import { Progress, Table, Icon, notification } from 'antd';
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu"
import _ from 'lodash'

import RightTags from '../../../../../components/public/RightTags/index'
import MyTable from "../../../../../components/Table"
import style from './style.less'
import '../../../../../static/css/react-contextmenu.global.css'
import MyIcon from "../../../../../components/public/TopTags/MyIcon"
import { connect } from 'react-redux'
import axios from "../../../../../api/axios"
import { getfeedbackTree, getfeedbackList, feedbackcancleRelease } from "../../../../../api/api"
import * as treeArray from "../../../../../utils/treeArray"
export class PlanFdback extends Component {
    constructor(props) {
        super(props)
        this.state = {
            name: 'planDefine',
            currentPage: 1,
            pageSize: 10,

            data: [],
            width: '',

            activeIndex: null,
            rightData: null,
            rightTags: [
                { icon: 'iconjindujixian', title: '本期进展', fielUrl: 'Plan/Fdback/Progress' },
                { icon: 'iconjiaofuqingdan', title: '交付清单', fielUrl: 'Components/DeliveryList' },
                { icon: 'iconiconziyuan6', title: '资源消耗', fielUrl: 'Plan/Fdback/ResourceF' },
                { icon: 'iconrizhi', title: '进展日志', fielUrl: 'Plan/Components/Log' },
                { icon: 'iconhelp', title: '项目问题', fielUrl: 'Plan/Fdback/ProjectProb' },
              
            ],
            selectArray: [],//选择计划
            type: "tree"
        }
    }
    componentDidMount() {

    }
    //获取树形列表
    getTreeList = (str) => {

        axios.get(getfeedbackTree(str)).then(res => {
            const dataMap = treeArray.dataMap(res.data.data)
            this.setState({
                data: res.data.data,
                dataMap: dataMap
            })
        })
    }
    //获取平铺列表
    getfeedbackList = (str) => {
        axios.get(getfeedbackList(str)).then(res => {
            const dataMap = treeArray.dataMap(res.data.data)
            this.setState({
                data: res.data.data,
                dataMap: dataMap
            })
        })
    }
    //加载数据
    openPlan = (selectArray) => {
        this.setState({
            selectArray: selectArray
        }, () => {
            const { selectArray } = this.state
            let str = selectArray[0].toString()
            selectArray.forEach((item, i) => {
                if (i > 0) {
                    str = str + "," + item
                }

            })
            if (this.state.type == "tree") {
                this.getTreeList(str)
            } else {
                this.getfeedbackList(str)
            }
        })

    }
    //加载数据
    initData = () => {
        const { selectArray } = this.state
        let str = selectArray[0].toString()
        selectArray.forEach((item, i) => {
            if (i > 0) {
                str = str + "," + item
            }

        })
        if (this.state.type == "tree") {
            this.getTreeList(str)
        } else {
            this.getfeedbackList(str)
        }
    }
    //切换数据模式
    toggleTableView = (title) => {

        this.setState({
            type: title
        }, () => {
            //重新加载
            const { selectArray } = this.state
            if (selectArray.length == 0) {
                notification.warning(
                    {
                        placement: 'bottomRight',
                        bottom: 50,
                        duration: 1,
                        message: '警告',
                        description: '没有选择计划！'
                    }
                )
                return
            }

            this.initData()
        })
    }




    getInfo = (record, index) => {
        let id = record.id
        /* *********** 点击表格row执行更新state start ************* */
        if (this.state.activeIndex == id) {
            this.setState({
                rightData: null,
                activeIndex: null
            })
        } else {
            if (record.type == "wbs" || record.type == "task") {
                this.setState({
                    activeIndex: id,
                    rightData: record,
                    rightTags: [
                        { icon: 'iconjindujixian', title: '本期进展', fielUrl: 'Plan/Fdback/Progress' },
                        { icon: 'iconjiaofuqingdan', title: '交付清单', fielUrl: 'Components/DeliveryList' },
                        { icon: 'iconiconziyuan6', title: '资源消耗', fielUrl: 'Plan/Fdback/ResourceF' },
                        { icon: 'iconrizhi', title: '进展日志', fielUrl: 'Plan/Components/Log' },
                        { icon: 'iconhelp', title: '项目问题', fielUrl: 'Plan/Fdback/ProjectProb' },
                     
                    ]
                })
            } else {
                this.setState({
                    activeIndex: id,
                    rightData: record,
                    rightTags: []
                })
            }

        }

    }
    //取消批准
    cancelHandle = () => {
        const { data, dataMap, rightData } = this.state;
        axios.post(feedbackcancleRelease(rightData.id), null, true).then(res => {
            treeArray.modify(data, dataMap, rightData, res.data.data);
            this.setState({
                data,
                dataMap,
                rightData: null,
                activeIndex:null
            });
        })
    }
    //更新
    updateSuccess = (value) => {
        const { data, dataMap, rightData } = this.state;

        treeArray.modify(data, dataMap, rightData, value);

        this.setState({
            data,
            dataMap,
         
        });
    }
    //判断索引相等时添加行的高亮样式	
    setClassName = (record, index) => {
        return record.id === this.state.activeIndex ? 'tableActivty' : "";
    }

    handleRightMenuClick = (e, data) => {
        switch (data.action) {
            case 'refresh':
                alert('刷新')
                break;
            case 'hideShowColumns':
                alert('隐藏/显示列')
                break;
            default:
                break;
        }
    }

    render() {
        const { intl } = this.props.currentLocale
        const columns = [
            {
                title: intl.get('wsd.i18n.plan.feedback.name'),
                dataIndex: 'name',
                key: 'name',
                width: 240,
                render: (text, record) => {
                    if (record.type == "eps") {
                        return <span><MyIcon type="icon-xiangmuqun" style={{ fontSize: '18px' }} />{text}</span>
                    }
                    if (record.type == "project") {
                        return <span><MyIcon type="icon-xiangmu" style={{ fontSize: '18px' }} /> {text}</span>
                    }
                    if (record.type == "define") {
                        return <span><MyIcon type="icon-jihua1" style={{ fontSize: '18px' }} /> {text}</span>
                    }
                    if (record.type == "wbs") {
                        return <span><MyIcon type="icon-WBS" style={{ fontSize: '18px' }} /> {text}</span>
                    }
                    if (record.type == "task") {
                        return <span><MyIcon type="icon-renwu1" style={{ fontSize: '18px' }} /> {text}</span>
                    }
                }
                // render: text => (
                //     <ContextMenuTrigger id="planFdback__rightContextMenu">
                //         <div style={{width: '100%'}}>
                //             {text}
                //         </div>
                //     </ContextMenuTrigger>
                // )
            },
            {
                title: '申请完成%',
                dataIndex: 'applyPct',
                render: text => {
                    if (text) {
                        return <Progress percent={text} className={style.myProgress} strokeWidth={10} />
                    } else {
                        return "--"
                    }
                }

            },
            {
                title: '批准完成%',
                dataIndex: 'approvePct',
                key: 'approvePct',
                render: text => {
                    if (text) {
                        return <Progress percent={text} className={style.myProgress} strokeWidth={10} />
                    } else {
                        return "--"
                    }
                }
            },
            {
                title: intl.get('wsd.i18n.plan.feedback.plantype'),
                dataIndex: 'planType',
                key: 'planType',
                render: (text) => {
                    if (text) {
                        return <span>{text.name}</span>
                    } else {
                        return null
                    }
                }
            },
            {
                title: intl.get('wsd.i18n.plan.feedback.iptname'),
                dataIndex: 'org',
                key: 'org',
                render: (text) => {
                    if (text) {
                        return <span>{text.name}</span>
                    } else {
                        return null
                    }
                }
            },
            {
                title: intl.get('wsd.i18n.plan.feedback.username'),
                dataIndex: 'user',
                key: 'user',
                render: (text) => {
                    if (text) {
                        return <span>{text.name}</span>
                    } else {
                        return null
                    }
                }
            },
            {
                title: intl.get('wsd.i18n.plan.feedback.planstarttime'),
                dataIndex: 'planStartTime',
                key: 'planStartTime',
            },
            {
                title: intl.get('wsd.i18n.plan.feedback.planendtime'),
                dataIndex: 'planEndTime',
                key: 'planEndTime',
            },

            {
                title: '实际开始时间',
                dataIndex: 'actStartTime',
                key: 'actStartTime'
            },
            {
                title: '实际完成时间',
                dataIndex: 'actEndTime',
                key: 'actEndTime'
            },
            {
                title: intl.get('wsd.i18n.plan.feedback.status'), //计划状态
                dataIndex: 'progressStatus',
                key: 'progressStatus',
                render: (text) => {
                    if (text) {
                        return <span>{text.name}</span>
                    } else {
                        return null
                    }
                }
            },
        ]


        let pagination = {
            total: this.state.data.length,
            // hideOnSinglePage: true,
            current: this.state.currentPage,
            pageSize: this.state.pageSize,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: total => `每页${this.state.pageSize}/共${Math.ceil(this.state.data.length / this.state.pageSize)}页`,
            onChange: (page, pageSize) => {
                this.setState({
                    currentPage: page
                })
            }
        }

        return (
            <div>
              
                <div className={style.main}>
                    <div className={style.leftMain} style={{ height: this.props.height }}>
                        <div style={{ minWidth: 'calc(100vw - 60px)' }}>

                            <MyTable rowKey={record => record.id}
                                defaultExpandAllRows={true}
                                pagination={false}
                                name={this.props.name}
                                columns={columns}
                                dataSource={this.state.data}
                                rowClassName={this.setClassName}
                                onRow={(record, index) => {
                                    return {
                                        onClick: (event) => {
                                            this.getInfo(record, index)
                                        }
                                    }
                                }
                                } />
                        </div>
                    </div>
                    <div className={style.rightBox} style={{ height: this.props.height }}>
                        <RightTags rightTagList={this.state.rightTags} rightData={this.state.rightData} updateSuccess={this.updateSuccess} callBackBanner={this.props.callBackBanner} menuInfo={this.props.menuInfo}/>
                    </div>
                </div>
                <ContextMenu id="planFdback__rightContextMenu">
                    <MenuItem data={{ action: 'refresh' }} onClick={this.handleRightMenuClick}><Icon type="sync" /> 刷新</MenuItem>
                    <MenuItem data={{ action: 'hideShowColumns' }} onClick={this.handleRightMenuClick}><Icon type="menu-unfold" /> 隐藏/显示列</MenuItem>
                </ContextMenu>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        currentLocale: state.localeProviderData,
    }
};


export default connect(mapStateToProps, null)(PlanFdback);