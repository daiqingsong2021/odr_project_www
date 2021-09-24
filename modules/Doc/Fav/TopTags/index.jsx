
import React, { Component } from 'react'
import dynamic from 'next/dynamic'
import { Modal, message, Divider, Icon, Popover, Table, Button } from 'antd';
import Search from '../../../../components/public/Search'
import style from './style.less'
import PublicButton from "../../../../components/public/TopTags/PublicButton"

// import UploadDoc from '../Upload/index'
// import Publicd from '../Publicd/index'
// import Upgrade from '../Upgrade/index'


const confirm = Modal.confirm

export class CompDocTop extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modalVisible: false,
            UploadVisible: false,
            PublicdVisible: false,
            UpgradeVisible: false,
            DistributeVisible: false,
            MailVisible: false,
            visible: false,
            roleBtnData: [
                {
                    id: 1,
                    name: 'CancelCollection',
                    aliasName: '取消收藏'
                },
                {
                    id: 2,
                    name: 'DownloadTopBtn',
                    aliasName: '下载'
                },
                
            ],
        }
    }


    // modal取消
    handleCancel = (v) => {
        if(v == 'UploadVisible'){
            this.setState({UploadVisible: false})
        } else if(v == 'PublicdVisible'){
            this.setState({PublicdVisible: false})
        } else if(v == 'UpgradeVisible'){
            this.setState({UpgradeVisible: false})
        } 
    }

    render() {
        let topTags = this.state.roleBtnData.map((v, i) => {
            return dynamic(import('../../../../components/public/TopTags/' + v.name))
        })

        // 显示表单弹窗
        let showFormModal = (name) => {
            let that = this
            // 取消收藏
            if (name === 'CancelCollection') {
               this.props.CancelCollection();
            }

            // 下载
            if (name === 'DownloadTopBtn') {
                this.props.downloadDoc();
            }
         
        }


        return (
            <div className={style.main}>
                <div className={style.search}>
                    <Search search={this.props.search} placeholder="文档标题/文档编号"/>
                </div>
                <div className={style.tabMenu}>
                    {/* {
                        topTags.map((Component, i) => {
                            return <Component key={i} onClickHandle={showFormModal} />
                        })
                    } */}
                     
                        {/*删除*/}
                        <PublicButton content="你确定要取消收藏吗？" title={"取消收藏"} useModel={true} verifyCallBack={this.props.deleteVerifyCallBack} afterCallBack={showFormModal.bind(this, "CancelCollection")} icon={"icon-quxiaoshoucang"} />
                        <PublicButton name={'下载'} title={'下载'} icon={'icon-xiazaiwenjian'} afterCallBack={showFormModal.bind(this, 'DownloadTopBtn')} />
                </div>

            </div>

        )
    }
}

export default CompDocTop
