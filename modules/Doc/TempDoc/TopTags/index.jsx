
import React, { Component } from 'react'
import dynamic from 'next/dynamic'
import { Modal, message, Divider, notification } from 'antd';
import Search from '../../../../components/public/Search'
import style from './style.less'
import UploadDoc from '../Upload/index'
import CompleteMessage from '../CompleteMessage/index'
import axios from '../../../../api/axios'
import { docTempDel } from '../../../../api/api'
import { connect } from 'react-redux'
import PublicButton from "../../../../components/public/TopTags/PublicButton"
const confirm = Modal.confirm

export class DocTempDoc extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modalVisible: false,
            UploadVisible: false,
            ComMessageVidible: false,
            roleBtnData: [
                {
                    id: 1,
                    name: 'UploadTopBtn',
                    aliasName: '上传'
                },
                {
                    id: 2,
                    name: 'CompleteMessage',
                    aliasName: '完善信息'
                },
                {
                    id: 3,
                    name: 'DeleteTopBtn',
                    aliasName: '删除'
                },
                {
                    id: 4,
                    name: 'DownloadTopBtn',
                    aliasName: '下载'
                }
            ],
            planDefineSelectData: []
        }
    }


    // modal取消
    handleCancel = (v) => {
        if (v === 'UploadVisible') {
            this.setState({
                UploadVisible: false
            })
        } else if (v === 'ComMessageVidible') {
            this.setState({
                ComMessageVidible: false
            })
        }
    }
    //删除验证
    deleteVerifyCallBack=()=>{
        const { intl } = this.props.currentLocale;
        if (this.props.dataArr.length==0){
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
      

        // 显示表单弹窗
        let showFormModal = (name) => {
            const { intl } = this.props.currentLocale;
            let that = this
            // 新增
            if (name === 'AddTopBtn') {
                this.setState({
                    modalVisible: true
                })
            }

            // 删除
            if (name === 'DeleteTopBtn') {
                if (this.props.dataArr.length) {

                    axios.deleted(docTempDel, { data: this.props.dataArr }, true).then(res => {
                        this.props.delData()
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

            if (name === 'UploadTopBtn') {
                this.setState({
                    UploadVisible: true
                })
            }

            if (name === 'CompleteMessage') {
                if (this.props.dataArr.length) {
                    this.setState({
                        ComMessageVidible: true
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
            //下载
            if (name == 'DownloadTopBtn') {
                this.props.download()
            }
        }

        return (
            <div className={style.main}>
                <div className={style.search}>
                    <Search search={this.props.search} placeholder="文件名称"/>
                </div>
                <div className={style.tabMenu}>
                   
                    {/*上传*/}
                    <PublicButton name={'上传'} title={'上传'} icon={'icon-shangchuanwenjian'} afterCallBack={showFormModal.bind(this, 'UploadTopBtn')} />
                    {/*完善信息*/}
                    <PublicButton name={'完善信息'} title={'完善信息'} icon={'icon-xiugaibianji'} afterCallBack={showFormModal.bind(this, 'CompleteMessage')} />
                    {/*删除*/}
                    <PublicButton title={"删除"} useModel={true} verifyCallBack={this.deleteVerifyCallBack} afterCallBack={showFormModal.bind(this, "DeleteTopBtn")} icon={"icon-delete"} />
                    <Divider type="vertical" /> 
                    {/*下载*/}
                    <PublicButton name={'下载'} title={'下载'} icon={'icon-xiazaiwenjian'} afterCallBack={showFormModal.bind(this, 'DownloadTopBtn')} />
                </div>

                {/* 上传文件 */}
                {this.state.UploadVisible &&
                    <UploadDoc modalVisible={this.state.UploadVisible} handleOk={this.handleOk} handleCancel={this.handleCancel}
                        getDataList={this.props.getDataList}
                    />
                }
                {/* 完善信息 */}
                {this.state.ComMessageVidible &&
                    <CompleteMessage modalVisible={this.state.ComMessageVidible} handleOk={this.handleOk} update={this.props.update}
                        handleCancel={this.handleCancel} dataArr={this.props.dataArr} getDataList={this.props.getDataList} />
                }
            </div>

        )
    }
}

export default connect(state => ({
    currentLocale: state.localeProviderData
}))(DocTempDoc)
