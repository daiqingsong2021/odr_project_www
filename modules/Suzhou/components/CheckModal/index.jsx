import React, { Component } from 'react'
import style from './style.less'
import { Button, Icon, Modal, Table, notification } from 'antd';
import { connect } from 'react-redux'
import download from '../../../../utils/download'
import * as util from '../../../../utils/util'
import axios from '../../../../api/axios'
import { fileList, docFileInfo } from '../../../../api/api';
import {deleteDocFile}  from '../../api/suzhou-api';
import * as docUtil from "@/utils/DocUtil";

class MenuInfo extends Component {
    constructor(props) {
        super(props)
        this.state = {
            initDone: false,

            data: []
        }
    }

    getData = () => {
        axios.get(fileList(this.props.record.id, this.props.menuCode)).then(res => {
            this.setState({
                data: res.data.data
            })
        })
    }

    componentDidMount() {
        this.getData();
        this.setState({
            width: this.props.width
        })
    }



    handleOk = (e) => {
        this.props.handleCancel()
    }
    handleCancel = (e) => {

        this.props.handleCancel()
    }

    //取消
    closeClick = (record) => {
        let { data } = this.state;
        let index = data.findIndex(item => item.id == record.id);
        data.splice(index, 1);
        this.setState({
            data
        })
        axios.deleted(deleteDocFile, {data: [record.id]}, true).then(res => {
            if(res.data.status == 200){
                this.getData();
                if(this.props.delDoc){
                    this.props.delDoc();
                }
            }
          }).catch(err => {

          });
    }
    //单下载
    downloadClick = (record) => {
        util.download(record.fileUrl, record.fileName,record.id)
        
    }

    //全部下载
    allDownloadClick = () => {
        let { data } = this.state;
        if (data.length) {
            data.map(item => {
                axios.get(docFileInfo(item.id), {}, null, null, false).then(res => {
                    let data = res.data.data
                    util.download(data.fileUrl, data.fileName,data.id)

                })

            })


        }
    }
    eyeClick = (record) => {
        docUtil.File(record.id).onlineView();
    }
    render() {

        const { intl } = this.props.currentLocale;


        return (
            <div className={style.main} >
                {/* 附件明细 */}
                <Modal title={`${intl.get('wsd.i18n.comcate.profdback.attachmentdetail')}(${this.state.data.length})`} visible={this.props.visible}
                    onCancel={this.handleCancel}
                    width="600px"
                    footer={null}
                    mask={false} maskClosable={false}
                >
                    <div className={style.CheckModal} >
                        <div className={style.content}>
                            {
                                this.state.data.map((item, index) => {
                                    return <li key={item.id}>
                                        <span className={style.index}>{index + 1 + "."}</span>
                                        <span className={style.name}>{item.fileName}</span>
                                        <span >{"（" + item.size + "）"}</span>
                                        <div className={style.icon}>
                                        <Icon onClick={this.eyeClick.bind(this, item)} type="eye" style={{ cursor: 'pointer' }} />
                                        <Icon type="download" onClick={this.downloadClick.bind(this, item)} style={{ cursor: 'pointer' }} />

                                        <Icon type="close" onClick={this.closeClick.bind(this, item)} style={{display:`${this.props.deleteFlag == 'hide'?'none':'inline'}`,cursor: 'pointer'}} />
                                        </div>
                                    </li>
                                })
                            }
                        </div>
                        <div className={style.button} onClick={this.allDownloadClick}><a href="#"><Icon type="download" /> {intl.get('wsd.i18n.comcate.profdback.everything')} </a></div>
                    </div>
                </Modal>



            </div>
        )
    }
}

export default connect(state => ({
    currentLocale: state.localeProviderData
}))(MenuInfo)
