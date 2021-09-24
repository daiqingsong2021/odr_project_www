/*
 * @Author: wihoo.wanghao 
 * @Date: 2019-01-17 11:43:11 
 * @Last Modified by: wihoo.wanghao
 * @Last Modified time: 2019-03-28 18:38:45
 */

import React, { Component } from 'react'
import { Divider, notification } from 'antd';
import PublicButton from "../../../../components/public/TopTags/PublicButton"
import PublicMenuButton from "../../../../components/public/TopTags/PublicMenuButton"
import SelectProjectBtn from "../../../../components/public/SelectBtn/SelectProjectBtn"
import Search from '../../../../components/public/Search'
import style from './style.less'
export class PlanDefineTopTags extends Component {
    constructor(props) {
        super(props)
        this.state = {
            roleBtnData: []
        }
    }

    //点击验证
    deleteVerifyCallBack = () => {
        const { projectId, activeIndex } = this.props
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
        } else {
            return true
        }
    }
    render() {

        return (
            <div className={style.main}>
                <div className={style.search}>
                    <Search search={this.props.search.bind(this)} />
                </div>
                <div className={style.tabMenu}>
                    <SelectProjectBtn haveTaskAuth = {false} openProject={this.props.openProject }/>
                     {/*新增PBS*/}
                     <PublicButton name={'新增PBS'} title={'新增PBS'} icon={'icon-PBS-copy'} afterCallBack={this.props.onClickHandleAdd.bind(this, 'AddPBSNextBtn')} edit={this.props.data && this.props.data.type=="delv"? false:true}/>
                    {/*新增交付物*/}
                    <PublicButton name={'新增交付物'} title={'新增交付物'} icon={'icon-jiaofuwu1-copy'} afterCallBack={this.props.onClickHandleAdd.bind(this, 'AddDeliveryBtn')} edit={this.props.data && this.props.data.type=="delv"? false:true}/>
                    {/*删除*/}
                    <PublicButton title={"删除"} useModel={true} verifyCallBack={this.deleteVerifyCallBack} afterCallBack={this.props.deletePlanDelv.bind(this, "DeleteTopBtn")} icon={"icon-delete"} edit={this.props.data && this.props.data.type=="project" || this.props.editAuth == false || this.props.pbsAuthEdit == true? false:true}/>
                    {/*导入*/}
                    <PublicButton title={"导入"} edit={this.props.data && this.props.data.type=="delv" || !this.props.data ? false:true} afterCallBack={this.props.onClickHandle.bind(this, "ImportBtn")} icon={'icon-daoru'}/>
                    <Divider type="vertical" />

                    {/*完成*/}
                    {/* <PublicButton name={'完成'} title={'完成'} icon={'icon-chuli'} afterCallBack={this.onClickHandle.bind(this, 'CompleteBtn')} /> */}
                    {/*发布*/}
                    <PublicMenuButton title={"发布"} afterCallBack={this.props.onClickHandleRelease} icon={"icon-fabu"}
                        menus={[{ key: "direct", label: "直接发布", icon: "icon-fabu", edit: true },
                        { key: "approve", label: "发布审批", icon: "icon-shenpi1", edit: true },
                        { key: "abolish", label: "取消发布", icon: "icon-mianfeiquxiao", edit: true }]}
                    />

                </div>
              
            </div>

        )
    }
}

export default PlanDefineTopTags
