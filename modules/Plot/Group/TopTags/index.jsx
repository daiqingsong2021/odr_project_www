/*
 * @Author: wihoo.wanghao 
 * @Date: 2019-01-17 11:43:11 
 * @Last Modified by: wihoo.wanghao
 * @Last Modified time: 2019-01-17 15:04:28
 */

import React, { Component } from 'react'
import dynamic from 'next/dynamic'
import Search from '../../../../components/public/Search'
import style from './style.less'
import AddSameLevel from "../AddSameLevel"
import { notification } from 'antd'
import axios from '../../../../api/axios'
import { epsDel } from '../../../../api/api'
import PublicButton from "../../../../components/public/TopTags/PublicButton"
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
                }
            ]
        }
    }
    onClickHandle = (name,e) => {
     
        // 新增
        if (name == 'AddTopBtn') {
           this.props.openAddModal()

        }

        //删除
        if (name == "DeleteTopBtn") {
            this.props.delData()
        }
    }
    
     //删除验证
     deleteVerifyCallBack = () => {
       if(this.state.rightClickShow){
           return false
       }
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
                    <Search search={this.props.search}/>
                </div>
                <div className={style.tabMenu}>
                    {/*新增*/}

                    <PublicButton name={'新增'} title={'新增'} icon={'icon-add'} afterCallBack={this.onClickHandle.bind(this, 'AddTopBtn')} />

                    {/*删除*/}
                    <PublicButton title={"删除"} useModel={true} verifyCallBack={this.deleteVerifyCallBack} afterCallBack={this.onClickHandle.bind(this, "DeleteTopBtn")} icon={"icon-delete"} />
                </div>
                {this.state.addSameLevel && <AddSameLevel handleCancel={this.closeAddSameLevel.bind(this)} visible={this.state.addSameLevel}
                    data={this.props.data} addData={this.props.addData} />}
            </div>

        )
    }
}

export default PlanDefineTopTags
