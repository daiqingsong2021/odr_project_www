import React, { Component } from 'react'
import {notification } from 'antd'
import { connect } from 'react-redux'
import TipModal from "../../Components/TipModal"
import TopTags from './TopTags/index'
import RightTags from '../../../components/public/RightTags/index'
import axios from '../../../api/axios'
import { prepaList, planDel } from '../../../api/api'
import AddModal from "./AddModal"
import * as dataUtil from '../../../utils/dataUtil'
import PageTable from '../../../components/PublicTable'
import ExtLayout from "../../../components/public/Layout/ExtLayout";
import MainContent from "../../../components/public/Layout/MainContent";
import Toolbar from "../../../components/public/Layout/Toolbar";


//项目立项
class Approval extends Component {
    constructor(props) {
        super(props)
        this.state = {
            initDone: false,
            activeIndex: "",
            currentPage: 1,
            pageSize: 10,
            currentPageNum: '',
            total: '',
            rightData: null,
            delectData: [],
            rightTags: [
                { icon: 'iconjibenxinxi', title: '基本信息', fielUrl: 'Plot/Approval/InfoForm' },
                { icon: 'iconlianxiren1', title: '联系人信息', fielUrl: 'Plot/Approval/LinkManInfo' },
                { icon: 'icontuandui', title: '协作团队', fielUrl: 'Plot/Approval/TeamInfo' },
                { icon: 'iconwenjian', title: '文件信息', fielUrl: 'Components/FileInfo' },
                { icon: 'iconliuchengxinxi', title: '流程信息', fielUrl: 'MyProcess/ProcessInfo' },
            ],
            data: [],
            initData: [],

            contentMenu: [
                { name: '新增', fun: 'add', type: 'buttom', icon: 'plus-square', isPublic: false },
                { name: '删除', fun: 'delete', type: 'buttom', icon: 'delete', isPublic: false }
            ]
        }
    }
    /**
   * 父组件即可调用子组件方法
   * @method
   * @description 获取用户列表、或者根据搜索值获取用户列表
   * @param {string} record  行数据
   * @return {array} 返回选中用户列表
   */
    onRef = (ref) => {
        this.table = ref
    }
    //获取列表信息
    getDataList = (currentPage,pageSize,callBack) => {
        if (this.state.keywords) {
            const { initData } = this.state;
            let newData = dataUtil.search(initData, [{ "key": "paName|paCode", "value": this.state.keywords }], true);
            callBack(newData)
            return;
        }
        axios.get(prepaList(pageSize, currentPage)).then(res => {
            callBack(res.data.data ? res.data.data : [])
            this.setState({
                data: res.data.data,
                initData: res.data.data,
                total: res.data.total,
                rightData: null
            })
        })
    }

    getInfo = (record, index) => {
        //table点击事件调用函数
        let id = record.id, records = record;
        // 已发布/审批中的立项禁止修改信息。
        let edit = record && record.status && record.status.id == "EDIT" ? true : false;
        this.setState({
            activeIndex: id,
            rightData: records,
            edit: edit
        })

    }



    //新增函数
    addData = (val) => {
        this.table.add(null, val)
    }
    //删除数据函数
    delectData = (v) => {
        axios.deleted(planDel(this.state.rightData.id), {}, true).then(res => {
            this.table.deleted(this.state.rightData)
        })
        this.setState({
            deleteTip: false
        })

    }
    //修改函数
    upData = (data) => {
        this.table.update(this.state.rightData, data)
    }


    //搜索
    search = (value) => {
        this.setState({ keywords: value }, () => {
            this.table.getData();
        });
    }

    //右击菜单事件处理
    rightClickMenu = (menu) => {
        //新增
        if (menu.fun == "add") {
            this.setState({
                showAddModal: true
            })
        }
        //删除
        if (menu.fun == "delete") {
            // 打开删除提示
            const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
            if (this.state.rightData && this.state.rightData.status.id == "EDIT" && this.state.rightData.creator.id == userInfo.id) {
                this.setState({
                    deleteTip: true
                })
            } else {
                notification.warning(
                    {
                        placement: 'bottomRight',
                        bottom: 50,
                        duration: 2,
                        message: '警告',
                        description: '没有权限删除'
                    }
                )
                return
            }


        }
    }
    initDatas=()=>{
        this.table.getData();
    }
    //打开新增弹框
    openAddModal = () => {
        this.setState({
            showAddModal: true
        })
    }
    //关闭新增弹框
    closeAddModal = () => {
        this.setState({
            showAddModal: false
        })
    }
    //关闭删除提示框
    closeDeleteTipModal = () => {
        this.setState({
            deleteTip: false
        })
    }
    render() {
        const { intl } = this.props.currentLocale;
        const columns = [
            {
                title: intl.get('wsd.i18n.pre.proreview.name'),
                dataIndex: 'paName',
                key: 'paName',
                render: (text, record) => dataUtil.getIconCell("project", text)
            },
            {
                title: intl.get('wsd.i18n.pre.proreview.code'),
                dataIndex: 'paCode',
                key: 'paCode',
            },
            {
                title: intl.get('wsd.i18n.pre.proreview.epsname'),
                dataIndex: 'eps',
                key: 'eps',
                render: (text) => <span>{text.name}</span>
            },
            {
                title: intl.get('wsd.i18n.pre.proreview.iptname'),
                dataIndex: 'org',
                key: 'org',
                render: (text) => <span>{text.name}</span>
            },
            {
                title: intl.get('wsd.i18n.pre.proreview.username'),
                dataIndex: 'user',
                key: 'user',
                render: (text) => <span>{text ? text.name : null}</span>
            },
            {
                title: intl.get('wsd.i18n.pre.proreview.starttime'),
                dataIndex: 'planStartTime',
                key: 'planStartTime',
                render: (text) => dataUtil.Dates().formatDateString(text)
            },
            {
                title: intl.get('wsd.i18n.pre.proreview.endtime'),
                dataIndex: 'planEndTime',
                key: 'planEndTime',
                render: (text) => dataUtil.Dates().formatDateString(text)
            },
            {
                title: intl.get('wsd.i18n.pre.proreview.status'),
                dataIndex: 'status',
                key: 'status',
                render: (text) => <span>{text.name}</span>
            },
        ];

        return (
          <ExtLayout renderWidth = {({contentWidth}) => { this.setState({contentWidth}) }}>
            <Toolbar>
              <TopTags openAddModal={this.openAddModal} edit={this.state.edit} data={this.state.rightData} del={this.delectData} initDatas={this.initDatas} search={this.search} getDataList={this.initDatas}  />
            </Toolbar>
            <MainContent contentWidth = {this.state.contentWidth} contentMinWidth = {1500}>
              {this.state.data &&
              <PageTable onRef={this.onRef}
                         pagination={true}
                         getData={this.getDataList}
                         columns={columns}
                         total={this.state.total}
                         scroll={{ x: 1200, y: this.props.height - 100 }}
                         rightClick={this.rightClickMenu}
                         getRowData={this.getInfo} />
              }
            </MainContent>
            <RightTags
              menuCode={this.props.menuInfo.menuCode}
              groupCode={1}
              rightTagList={this.state.rightTags}
              rightData={this.state.rightData}
              upData={this.upData}
              edit={this.state.edit}
              bizType="prepa"
              bizId={this.state.rightData ? this.state.rightData.id : null}
              projectId={this.state.rightData ? this.state.rightData.id : null}
              extInfo={{
                startContent: "立项【" + (this.state.rightData ? this.state.rightData.paName : null) + "】"
              }}
              projectTeamEditAuth={true}
              menuEdit={true}
              callBackBanner={this.props.callBackBanner}
              menuInfo={this.props.menuInfo}
              openWorkFlowMenu={this.props.openWorkFlowMenu}
              linkManEditAuth={this.state.rightData ? this.state.rightData.status.id == "EDIT" ? true : false : false}
              fileEditAuth={this.state.rightData ? this.state.rightData.status.id == "EDIT" ? true : false : false}
            />
            {/* 新增立项 */}
            {this.state.showAddModal && <AddModal title="新增立项" handleCancel={this.closeAddModal.bind(this)} addData={this.addData}></AddModal>}
            {/* 删除提示 */}
            {this.state.deleteTip && <TipModal onOk={this.delectData} onCancel={this.closeDeleteTipModal} />}
          </ExtLayout>
        )
    }
}


/* *********** connect链接state及方法 start ************* */
export default connect(state => ({
    currentLocale: state.localeProviderData
}), {

    })(Approval);
/* *********** connect链接state及方法 end ************* */
