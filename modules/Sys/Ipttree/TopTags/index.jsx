/*
 * @Author: wihoo.wanghao
 * @Date: 2019-01-17 11:43:11
 * @Last Modified by: wihoo.wanghao
 * @Last Modified time: 2019-01-17 15:04:28
 */

import React, { Component } from 'react'

import Search from '../../../../components/public/Search'
import style from './style.less'
import PublicButton from '../../../../components/public/TopTags/PublicButton'
import { notification } from "antd"
import { connect } from 'react-redux'
//顶部按钮模块
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
            ]
        }
    }
    // modal取消
    handleCancel = () => {
        this.setState({
            modalVisible: false
        })
    }
    onClickHandle = (value) => {
        const { data } = this.props
        if (!data) {
            const { intl } = this.props.currentLocale
            notification.warning(
                {
                    placement: 'bottomRight',
                    bottom: 50,
                    duration: 1,
                    message: intl.get("wsd.global.tip.title1"),
                    description: intl.get("wsd.global.tip.content1")
                }
            )
            return
        }
        this.props.onClickHandle(value)
    }
    //判断是否有选中数据
    hasRecord = () => {
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
            return false;
        } else {
            return true
        }
    }

    render() {


        return (
            <div className={style.main}>
                <div className={style.search}>
                    <Search search={this.props.search} />
                </div>
                <div className={style.tabMenu}>
                    <PublicButton name={'新增'} title={'新增'} icon={'icon-add'}
                        verifyCallBack={this.hasRecord}
                        afterCallBack={this.onClickHandle.bind(this, 'AddTopBtn')}
                        res={'MENU_EDIT'}
                    />
                    <PublicButton name={'删除'} title={'删除'} icon={'icon-shanchu'}
                        useModel={true} edit={true}
                        verifyCallBack={this.hasRecord}
                        afterCallBack={this.onClickHandle.bind(this, 'DeleteTopBtn')}
                        content={'你确定要删除吗？'}
                        res={'MENU_EDIT'}
                    />
                </div>


            </div>

        )
    }
}


const mapStateToProps = state => {
    return {
        currentLocale: state.localeProviderData,
    }
};


export default connect(mapStateToProps, null)(PlanDefineTopTags);
