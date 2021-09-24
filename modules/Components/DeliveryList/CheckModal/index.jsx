import React, { Component } from 'react'
import style from './style.less'
import { Button, Icon, Modal, Table } from 'antd';
import { connect } from 'react-redux'
import download from '../../../../utils/download'
import * as util from '../../../../utils/util'
import axios from '../../../../api/axios'
import {fileList, docFileInfo, updateDocFileRelations, deletePlanDelvAssign} from '../../../../api/api'
import * as dataUtil from "../../../../utils/dataUtil";

class MenuInfo extends Component {
    constructor(props) {
        super(props)
        this.state = {
            initDone: false,

            data: []
        }
    }

    getData = () => {
        axios.get(fileList(this.props.record.id, 'delv')).then(res => {
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
        },()=>{
            let ids=this.state.data.map(item=>item.id)
            let {startContent} = this.props.extInfo || {};
            let url = dataUtil.spliceUrlParams(updateDocFileRelations(this.props.record.id, 'delv'),{startContent});
            axios.put(url, ids).then(res => {
                this.props.refresh()
            })
        })

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
        const { intl } = this.props.currentLocale;
    
        let arr = ['html', 'txt', 'jpg', 'jpeg', 'gif', 'png', 'art', 'au', 'aiff', 'xbm', 'pdf','doc','docx','rtf','xls','xlsx','csv'];
        if (record.fileId) {
          let {startContent} = this.props.extInfo || {};
          let url = dataUtil.spliceUrlParams(docFileInfo(record.fileId), { startContent });
          axios.get(url).then(res => {
            if (res.data.data && res.data.data.fileUrl) {
              let type = res.data.data.fileName ? res.data.data.fileName.substring(res.data.data.fileName.lastIndexOf(".")+1) : '';
              if(type){
                type = type.toLowerCase();
              }
              let index = arr.findIndex(item => item == type);
              if (index != -1) {
                if (res.data.data.fileViewUrl && (type == 'doc' ||  type == 'docx' ||  type == 'rtf' ||  type == 'xls' ||  type == 'xlsx' ||  type == 'csv')){
                  window.open(res.data.data.fileViewUrl)
                } else{
                  window.open(res.data.data.fileUrl)
                }
              } else {
                dataUtil.message(intl.get('wsd.global.hint.docwarning'));
              }
            }
          })
        } else {
          dataUtil.message(intl.get('wsd.i18n.doc.compdoc.hinttext'));
        }
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
                >
                    <div className={style.CheckModal} >
                        <div className={style.content}>
                            {
                                this.state.data.map((item, index) => {
                                    return <li key={item.id}>
                                        <span className={style.index}>{index + 1 + "."}</span>
                                        <span className={style.name}>{item.fileName}</span>
                                        <span >{"（" + item.size + "）"}</span>
                                        <div className={style.icon}><Icon onClick={this.eyeClick.bind(this, item)} type="eye" /><Icon type="download" onClick={this.downloadClick.bind(this, item)} />{this.props.closeAuth && <Icon type="close" onClick={this.closeClick.bind(this, item)} />}</div>
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
