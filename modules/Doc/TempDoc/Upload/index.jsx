import React, { Component } from 'react'
import { Modal, Button, Table, Icon, Upload, message } from 'antd'
import style from './style.less'
import intl from 'react-intl-universal'
import { connect } from 'react-redux'
import { baseURL } from '../../../../api/config'
import UploadTpl from '../../../../components/public/TopTags/uploadTpl'
import { getDocInfo } from "../../../../api/api"
import axios from "../../../../api/axios"
class UploadDoc extends Component {

    state = {

        data: [],
        type: '',
    }

    componentDidMount() {
        this.getDocInfo()
    }
    // 获取文档全局设置信息
    getDocInfo = () => {
        axios.get(getDocInfo).then(res => {
            const { data } = res.data
            if (data) {
                this.setState({
                    banFileType: data.banFileType,
                    uploadMax: data.uploadMax
                })
            }

        })
    }

    handleCancel() {
        this.props.getDataList();
        this.props.handleCancel('UploadVisible')
    }

    //上传的回调
    file = (files) => {
        if (files.response && files.response.data) {
            let obj = {
                fileName: files.response.data.fileName.split('.')[0],
                size: files.response.data.size,
                type: files.response.data.fileName.split('.')[1],
                isSucceed: files.response.status
            }
            this.setState({
                data: [obj, ...this.state.data]
            })
        } else {

            let obj = {
                fileName: files.name.split('.')[0],
                type: files.name.split('.')[1],
                isSucceed: 404
            }
            this.setState({
                data: [obj, ...this.state.data]
            })

        }

    }



    render() {
        const { intl } = this.props.currentLocale;
        const columns = [{
            title: intl.get("wsd.i18n.plan.fileinfo.filename"),//文件名称
            dataIndex: 'fileName',

        }, {
            title: intl.get('wsd.i18n.plan.fileinfo.filetype'),//文件类型
            dataIndex: 'type',

        }, {
            title: intl.get("wsd.i18n.doc.compdoc.docsize"),//文件大小
            dataIndex: 'size',
        }, {
            title: '',
            dataIndex: 'isSucceed',
            render: (text, record) => <Icon type={text == 200 ? "check" : "close"} style={{color:text == 200 ? "green" : "red"}} />
        }];


        return (
            <div>
                <Modal
                    className={style.main}
                    width="850px"
                    title={intl.get('wsd.i18n.doc.tempdoc.uploaddoc')}
                    centered={true}
                    visible={this.props.modalVisible}
                    onCancel={this.handleCancel.bind(this)}
                    mask={false} maskClosable={false}
                    footer={
                        <div className='modalbtn'>

                            <div className={style.bottext}>
                                {/* 上传按钮 */}
                                <UploadTpl isBatch={true} file={this.file} type='temp' banFileType={this.state.banFileType} uploadMax={this.state.uploadMax} />
                                <span className={style.remark}> {`备注:单个文件大小不超过${this.state.uploadMax}M，上传多个文件大小总共不超过1G`} </span>
                            </div>
                            <Button type="primary" onClick={this.handleCancel.bind(this)} > {intl.get('wsd.global.btn.affirm')} </Button>
                        </div>
                    }
                >

                    <div className={style.content}>

                        <Table rowKey={record => record.id} columns={columns} dataSource={this.state.data} size="small" pagination={false}
                            onRow={(record) => {
                                return {
                                    onClick: (event) => {

                                    }
                                }
                            }}
                        />


                    </div>


                </Modal>
            </div>
        )
    }

}


export default connect(state => ({
    currentLocale: state.localeProviderData
}))(UploadDoc)





