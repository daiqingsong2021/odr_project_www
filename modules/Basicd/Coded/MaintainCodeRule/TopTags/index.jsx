import React, { Component } from 'react'
import dynamic from 'next/dynamic'
import Search from '../../../../../components/public/Search'
import { notification } from 'antd';
import style from './style.less'
import AddOrModifyModal from "../ShowAddOrModifyModal"
import PublicButton from "../../../../../components/public/TopTags/PublicButton"
import { connect } from 'react-redux'
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
                    name: 'ModifyTopBtn',
                    aliasName: '修改'
                },
                {
                    id: 3,
                    name: 'DeleteTopBtn',
                    aliasName: '删除'
                },
            ]
        }
    }
    onClickHandle = (name) => {
        const { intl } = this.props.currentLocale;
        if (name == "AddTopBtn") {
            this.setState({
                isShowAddOrModifyModal: true,
                modalTitle: intl.get('wsd.i18n.sys.basicd.templated.newruletype'),//新增规则类型
                type: "add"
            })
            return
        }
        if (name == "ModifyTopBtn") {

            if (this.props.data) {
                let vlaue = this.props.data
                this.setState({
                    isShowAddOrModifyModal: true,
                    modalTitle: intl.get('wsd.i18n.sys.basicd.templated.modifyruletype'),
                    type: "modify",
                    selectData: vlaue
                })
                return
            } else {
                notification.warning(
                    {
                        placement: 'bottomRight',
                        bottom: 50,
                        duration: 2,
                        message: intl.get('wsd.global.tip.title2'),
                        description: intl.get('wsd.global.tip.content1')
                    }
                )
            }

        }
        if (name == "DeleteTopBtn") {
            if (this.props.selectedRowKeys.length == 0) {
                notification.warning(
                    {
                        placement: 'bottomRight',
                        bottom: 50,
                        duration: 2,
                        message: intl.get('wsd.global.tip.title2'),
                        description: intl.get('wsd.global.tip.content2')
                    }
                )
                return
            }

            this.props.deleteData()
        }
    }
    closeAddOrModifyModal = () => {
        this.setState({
            isShowAddOrModifyModal: false,

        })
    }
    deleteVerifyCallBack=()=>{
        const { intl } = this.props.currentLocale;
        if (this.props.selectedRowKeys.length == 0) {
            notification.warning(
                {
                    placement: 'bottomRight',
                    bottom: 50,
                    duration: 2,
                    message: intl.get('wsd.global.tip.title2'),
                    description: intl.get('wsd.global.tip.content2')
                }
            )
            return false
        }else{
            return true
        }

    }
    render() {
        // let topTags = this.state.roleBtnData.map((v, i) => {
        //     return dynamic(import('../../../../../components/public/TopTags/' + v.name))
        // })



        return (
            <div className={style.main}>
                <div className={style.tabMenu}>
                    {/* {
                        topTags.map((Component, key) => {
                            return <Component key={key} onClickHandle={this.onClickHandle.bind(this)} />
                        })
                    } */}
                    {/*新增*/}
                    <PublicButton name={'新增'} title={'新增'} icon={'icon-add'} afterCallBack={this.onClickHandle.bind(this, 'AddTopBtn')} />
                    {/*修改*/}
                    <PublicButton name={'修改'} title={'修改'} icon={'icon-xiugaibianji'} afterCallBack={this.onClickHandle.bind(this, 'ModifyTopBtn')} />
                    {/*删除*/}
                    <PublicButton title={"删除"} useModel={true} content={'你确定要删除吗？'} verifyCallBack={this.deleteVerifyCallBack} afterCallBack={this.onClickHandle.bind(this, "DeleteTopBtn")} icon={"icon-delete"} />
                </div>
                {this.state.isShowAddOrModifyModal &&
                    <AddOrModifyModal
                        adddData={this.props.adddData}
                        updateData={this.props.updateData}
                        codeRule={this.props.codeRule}
                        title={this.state.modalTitle}
                        type={this.state.type}
                        selectData={this.state.selectData}
                        handleCancel={this.closeAddOrModifyModal.bind(this)}
                        visible={this.state.isShowAddOrModifyModal} />}

            </div>

        )
    }
}

export default connect(state => ({
    currentLocale: state.localeProviderData,
}))(PlanDefineTopTags)
