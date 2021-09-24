import React, { Component } from 'react'
import { Divider, notification } from 'antd';
import Search from '../../../../components/public/Search'

import style from './style.less'
import Approval from '../Workflow/Approval'
import axios from '../../../../api/axios'
import { planDel, prepaRelease } from '../../../../api/api'
import PublicButton from "../../../../components/public/TopTags/PublicButton"
import PublicMenuButton from "../../../../components/public/TopTags/PublicMenuButton"
import TipModal from "../../../Components/TipModal"
export class PlanDefineTopTags extends Component {
    constructor(props) {
        super(props)
        this.state = {
            roleBtnData: [
                {
                    id: 1,
                    name: 'AddTopBtn',
                    aliasName: '新增'
                },
                {
                    id: 2,
                    name: 'DeleteTopBtn',
                    aliasName: '删除'
                },
                {
                    id: 4,
                    name: "PlotPublicTopBtn",
                    aliasName: '发布'
                }
            ],
            showApprovalVisible: false // 显示审批窗口
        }
    }
    //头部操作按键调用函数
    onClickHandle = (name) => {

        // 新增
        if (name == "AddTopBtn") {
            this.props.openAddModal()
        } else if (name == 'DeleteTopBtn') { //删除
            this.props.del(this.props.data.id)

            //直接发布
        } else if (name == 'direct') {
            if (!this.props.data) {
                notification.warning(
                    {
                        placement: 'bottomRight',
                        bottom: 50,
                        duration: 2,
                        message: '未选中数据',
                        description: '请选择数据进行操作'
                    }
                )
                return
            }
           this.setState({
            deleteTip:true
           })

        } else if (name == 'approve') {
            this.setState({ showApprovalVisible: true, title: "发布审批" });
        }
    }
    directRelease=()=>{
        axios.post(prepaRelease(this.props.data.id), {}, true).then(res => {

            this.props.getDataList();
        })
        this.setState({
            deleteTip:false
           })
    }

    search = (val) => {
        this.props.search(val)
    }
    //删除验证
    deleteVerifyCallBack = () => {
       
        if (!this.props.data) {
            notification.warning(
                {
                    placement: 'bottomRight',
                    bottom: 50,
                    duration: 2,
                    message: '未选中数据',
                    description: '请选择数据进行操作'
                }
            )
            return false
        }
        return true
    }
    render() {
        const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
        return (
            <div className={style.main}>
                <div className={style.search}>
                    <Search search={this.search} />
                </div>
                <div className={style.tabMenu}>
                    {/*新增*/}

                    <PublicButton name={'新增'} title={'新增'} icon={'icon-add'} afterCallBack={this.onClickHandle.bind(this, 'AddTopBtn')} />

                    {/*删除*/}
                    <PublicButton title={"删除"} useModel={true} verifyCallBack={this.deleteVerifyCallBack} afterCallBack={this.onClickHandle.bind(this, "DeleteTopBtn")} icon={"icon-delete"}
                        edit={this.props.data && this.props.data.status.id == "EDIT" && this.props.data.creator.id == userInfo.id} />
                    {/*<MoveTDTopBtn onClickHandle={this.onClickHandle} />*/}
                    <Divider type="vertical" />
                    {/*发布*/}
                    <PublicMenuButton title={"发布"} afterCallBack={this.onClickHandle} icon={"icon-fabu"}
                        menus={[{ key: "direct", label: "直接发布", icon: "icon-fabu", edit: this.props.edit },
                        { key: "approve", label: "发布审批", icon: "icon-shenpi1", edit: this.props.edit }]}
                    />

                </div>
                {/* 删除提示 */}
                {this.state.deleteTip && <TipModal title="提示" content="是否发布？" onOk={this.directRelease} onCancel={()=>this.setState({deleteTip:false})} />}
                {this.state.showApprovalVisible &&
                    <Approval
                        visible={true}
                        width={"1200px"}
                        proc={{ "procDefKey": "model_20190513_2687523", "bizTypeCode": "plan-project-approve", "title": "项目立项发布审批" }}
                        projectId={this.props.selectProjectId}
                        handleCancel={() => { this.setState({ showApprovalVisible: false }) }}
                        refreshData={this.props.initDatas}
                    />}
            </div>

        )
    }
}

export default PlanDefineTopTags
