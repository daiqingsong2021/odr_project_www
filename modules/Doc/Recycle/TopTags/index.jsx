/*
 * @Author: wihoo.wanghao 
 * @Date: 2019-01-17 11:43:11 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2019-01-26 11:09:01
 */
import React, { Component } from 'react'
import dynamic from 'next/dynamic'
import Search from '../../../../components/public/Search'
import style from './style.less'
import PublicButton from "../../../../components/public/TopTags/PublicButton"
export class PlanDefineTopTags extends Component {
    constructor(props) {
        super(props)
        this.state = {
            roleBtnData: [
                {
                    id: 1,
                    name: 'BackBtn',
                    aliasName: '还原'
                },
                {
                    id: 2,
                    name: 'DeleteTopBtn',
                    aliasName: '删除'
                }

            ],
            modalVisible: false,
            modelTitle: '',
        }
    }
    // modal取消
    handleCancel = () => {
        this.setState({
            modalVisible: false
        })
    }
    //
    handleOk = () => {
        this.setState({
            modalVisible: true
        })
    }
    onClickHandle = (value) => {
        if (value == 'BackBtn') {
            this.props.back();
        }
        if (value == 'DeleteTopBtn') {
            this.props.delete();
        }

    }
    render() {
        let topTags = this.state.roleBtnData.map((v, i) => {
            return dynamic(import('../../../../components/public/TopTags/' + v.name))
        })


        return (
            <div className={style.main}>
                <div className={style.search}>
                    <Search search={this.props.search} placeholder="文档标题"/>
                </div>
                <div className={style.tabMenu}>
                   
                    {/*还原*/}

                    <PublicButton content="你确定要还原吗？" name={'还原'} title={'还原'} icon={'icon-huanyuan'} useModel={true} afterCallBack={this.onClickHandle.bind(this, 'BackBtn')} verifyCallBack={this.props.recyleVerifyCallBack}/>

                    {/*删除*/}
                    <PublicButton title={"删除"} useModel={true} verifyCallBack={this.props.deleteVerifyCallBack} afterCallBack={this.onClickHandle.bind(this, "DeleteTopBtn")} icon={"icon-delete"} />
                </div>

            </div>

        )
    }
}

export default PlanDefineTopTags
