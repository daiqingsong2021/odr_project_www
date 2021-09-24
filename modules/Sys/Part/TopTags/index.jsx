/*
 * @Author: wihoo.wanghao 
 * @Date: 2019-01-17 11:43:11 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2019-04-10 17:23:20
 */

import React, { Component } from 'react'
import AddRoleModal from '../AddRoleModal/index'
import {  notification } from 'antd';
import Search from '../../../../components/public/Search'
import PublicButton from '../../../../components/public/TopTags/PublicButton'
import style from './style.less'
import axios from '../../../../api/axios';
import { roleAdd, roleUpdate, roleDelete } from '../../../../api/api';
//角色管理-顶部按钮
export default class PlanDefineTopTags extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modalVisible: false,
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
    //按钮点击事件
    btnClicks(name) {
        const { delSuccess, selectedRowKeys } = this.props;
        if (name == 'AddTopBtn') {
            this.setState({ modalVisible: true })
        }
        if (name == 'DeleteTopBtn') {
            if (selectedRowKeys.length) {
                axios.deleted(roleDelete, { data: selectedRowKeys }, true).then(res => {
                    // 执行前端删除
                    delSuccess()
                })
            } else {
                notification.warning(
                    {
                        placement: 'bottomRight',
                        bottom: 50,
                        duration: 2,
                        message: '未选中数据',
                        description: '请勾选数据进行操作'
                    }
                )
            }

        }
    }

    handleCancel = () => {
        this.setState({ modalVisible: false })

    }
    //判断是否有选中数据
    hasRecord = () => {
        if (!this.props.selectedRowKeys.length) {
            notification.warning(
                {
                    placement: 'bottomRight',
                    bottom: 50,
                    duration: 2,
                    message: '未选中数据',
                    description: '请选择数据进行操作'
                }
            )
            return false;
        } else {
            return true
        }
    }

    render() {
       
        const { modalVisible } = this.state
        return (
            <div className={style.main}>
                <div className={style.search}>
                    <Search search={this.props.search} />
                </div>
                <div className={style.tabMenu}>
                    <PublicButton name={'新增'} title={'新增'} icon={'icon-add'}
                        afterCallBack={this.btnClicks.bind(this, 'AddTopBtn')}
                        res={'MENU_EDIT'}
                    />
                    <PublicButton name={'删除'} title={'删除'} icon={'icon-shanchu'}
                        useModel={true} edit={true}
                        verifyCallBack={this.hasRecord}
                        afterCallBack={this.btnClicks.bind(this, 'DeleteTopBtn')}
                        content={'你确定要删除吗？'}
                        res={'MENU_EDIT'}
                    />
                </div>

                {modalVisible && <AddRoleModal visible={modalVisible} onCancel={() => this.setState({ modalVisible: false })} handleCancel={this.handleCancel} addSuccess={this.props.addSuccess} />}
            </div>

        )
    }
}
