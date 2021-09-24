import React, { Component } from 'react'
import dynamic from 'next/dynamic'
import Search from '../../../../../components/public/Search'
import { notification } from 'antd'
import style from './style.less'
import AddCalendar from "../AddCalendar"
import { connect } from 'react-redux'
import PublicButton from '../../../../../components/public/TopTags/PublicButton'
import axios from '../../../../../api/axios'
import { calendarCopy, calendarDel, calendarAdd } from '../../../../../api/api'

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
                    name: 'CopyTopBtn',
                    aliasName: '复制'
                },
                {
                    id: 3,
                    name: 'DeleteTopBtn',
                    aliasName: '删除'
                },
            ],
            modalVisible: false,
        }
    }
    handleCancel = (v) => {
        this.setState({
            modalVisible: false
        }, () => {
            this.props.calendarAdd(v)
        })

    }

    showFormModal = (name) => {
        const { intl } = this.props.currentLocale;
        // 新增文档模板按钮
        if (name === 'AddTopBtn') {
            // '新增成功'
            axios.post(calendarAdd, {}, true, intl.get('wsd.global.btn.newsuccess')).then(res => {
                this.props.calendarAdd(res.data.data)
            })

        } else if (name === 'CopyTopBtn') {
            if (this.props.copy) {
                axios.post(calendarCopy(this.props.copy.id), {}, true).then(res => {
                    res.data ? this.props.calendarAdd(res.data.data) : null
                })
            } else {
                notification.warning(
                    {
                        placement: 'bottomRight',
                        bottom: 50,
                        duration: 2,
                        message: intl.get('wsd.global.tip.title2'),
                        description: '请选择数据进行操作'
                    }
                )
            }

        } else if (name === 'DeleteTopBtn') {

            // if (this.props.copy) {    //判断是否点击选择单行删除
            //     this.props.calendarDel.push(this.props.copy.id)
            // }

            if (this.props.selectedRowKeys.length) { //判断多选删除
                // '删除成功'
                axios.deleted(calendarDel, { data: this.props.selectedRowKeys }, true, intl.get("wsd.global.btn.successfullydelete"), false).then(res => {
                    this.props.del(this.props.selectedRowKeys)
                })
            } else {
                notification.warning(
                    {
                        placement: 'bottomRight',
                        bottom: 50,
                        duration: 2,
                        message: intl.get('wsd.global.tip.title2'),
                        description: intl.get('wsd.global.tip.content2')
                    }
                )
            }

        }
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

        return (
            <div className={style.main}>
               
                <div className={style.tabMenu}>

                    <PublicButton
                        name={'新增'} title={'新增'} icon={'icon-add'}
                        afterCallBack={this.showFormModal.bind(this, 'AddTopBtn')}
                        res={'MENU_EDIT'}
                    />
                    <PublicButton
                        name={'复制'} title={'复制'} icon={'icon-fuzhi'}
                        afterCallBack={this.showFormModal.bind(this, 'CopyTopBtn')}
                        res={'MENU_EDIT'}
                    />
                    <PublicButton name={'删除'} title={'删除'} icon={'icon-shanchu'}
                        useModel={true} edit={this.props.editAuth}
                        verifyCallBack={this.hasRecord}
                        afterCallBack={this.showFormModal.bind(this, 'DeleteTopBtn')}
                        content={'你确定要删除吗？'}
                        res={'MENU_EDIT'}
                    />

                </div>
                <AddCalendar visible={this.state.modalVisible} handleCancel={this.handleCancel.bind(this)} />

            </div>

        )
    }
}

export default connect(state => ({
    currentLocale: state.localeProviderData
}))(PlanDefineTopTags)
