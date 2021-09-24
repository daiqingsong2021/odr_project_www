import React, { Component } from 'react'
import { Button, Icon, Upload, message, notification } from 'antd'
import { connect } from 'react-redux'
import { baseURL } from '../../../api/config'
import MyIcon from './MyIcon'
import axios from "../../../api/axios"
import { getDocInfo } from "../../../api/api"
/**
 *
 * @isBatch 单上传多上传标识符(true: 多上传, false： 单上传)
 * @file 上传成功之后的回调
 * @uploadMax 上传限制
 * @banFileType 禁止文件类型
 */


class UploadTpl extends Component {

    state = {
        file: null,
    }
    componentDidMount() {
        this.getDocInfo()
    }
    // 获取文档全局设置信息
    getDocInfo = () => {
        const { banFileType, uploadMax } = this.props
        if (banFileType && uploadMax) {
            this.setState({
                banFileType,
                uploadMax
            })
        } else {
            axios.get(getDocInfo).then(res => {
                const { data } = res.data
                if (data) {
                    this.setState({
                        banFileType: banFileType ? banFileType : data.banFileType,
                        uploadMax: uploadMax ? uploadMax : data.uploadMax
                    })
                }

            })
        }

    }

    render() {

        const { intl } = this.props.currentLocale;

        const _this = this;
        //多上传配置
        const head = {
            name: 'file',
            action: baseURL + '/api/doc/file/upload' + (this.props.type ? '/' + this.props.type : ''),
            headers: {
                Authorization: sessionStorage.getItem('token')
            },
            onChange(info) {
                if (info.file.status !== 'uploading') {
                    _this.props.file(info.file)
                    _this.setState({
                        file: info.file
                    })
                }
                if (info.file.response) {
                    if (info.file.response.status == 200) {
                        // message.success(`${info.file.name} ${intl.get('wsd.i18n.doc.compdoc.successupload')}`);
                        notification.success(
                            {
                                placement: 'bottomRight',
                                bottom: 50,
                                duration: 2,
                                message: info.file.name,
                                description: intl.get('wsd.i18n.doc.compdoc.successupload')
                            }
                        )
                    } else if (info.file.response.status != 200) {
                        // message.error(`${info.file.name} ${intl.get('wsd.i18n.doc.compdoc.errorupload')}`);
                        notification.warning(
                            {
                                placement: 'bottomRight',
                                bottom: 50,
                                duration: 2,
                                message: info.file.name,
                                description: intl.get('wsd.i18n.doc.compdoc.errorupload')
                            }
                        )
                    }
                }
            },
            beforeUpload(file) {
                //获取文件类型

                const array = file.name.split(".")
                const fileType = array[array.length - 1];
                let beyondSize, isHaveBan
                if (_this.state.banFileType) {
                    isHaveBan = _this.state.banFileType.indexOf(fileType)
                    if (isHaveBan > -1) {
                        notification.warning(
                            {
                                placement: 'bottomRight',
                                bottom: 50,
                                duration: 2,
                                message: "提示",
                                description: "暂不支持此文件格式，禁止上传！"
                            }
                        )
                        return false
                    }

                }
                if (_this.state.uploadMax) {
                    beyondSize = file.size / 1024 / 1024 < _this.state.uploadMax
                    if (!beyondSize) {
                        notification.warning(
                            {
                                placement: 'bottomRight',
                                bottom: 50,
                                duration: 2,
                                message: "提示",
                                description: `上传文件最大${_this.state.uploadMax}MB`
                            }
                        )
                        return false
                    }

                }
                return true
            },
            multiple: true,
            showUploadList: false,
        }


        // 单上传按钮配置函数
        const upload = {
            name: 'file',
            action: baseURL + '/api/doc/file/upload',
            headers: {
                Authorization: sessionStorage.getItem('token')
            },
            onChange(info) {
                if (info.file.status !== 'uploading') {

                    _this.props.file(info.file)
                    _this.setState({
                        file: info.file
                    })
                    // return(
                    //     <Progress percent={info.file.percent} size="small" />
                    // )
                }
                if (info.file.response) {
                    if (info.file.response.status == 200) {
                        // message.success(`${info.file.name} ${intl.get('wsd.i18n.doc.compdoc.successupload')}`);
                        notification.success(
                            {
                                placement: 'bottomRight',
                                bottom: 50,
                                duration: 2,
                                message: info.file.name,
                                description: intl.get('wsd.i18n.doc.compdoc.successupload')
                            }
                        )
                    } else if (info.file.response.status != 200) {
                        // message.error(`${info.file.name} ${intl.get('wsd.i18n.doc.compdoc.errorupload')}`);
                        notification.warning(
                            {
                                placement: 'bottomRight',
                                bottom: 50,
                                duration: 2,
                                message: info.file.name,
                                description: intl.get('wsd.i18n.doc.compdoc.errorupload')
                            }
                        )
                    }
                }

            },
            beforeUpload(file) {
                //获取文件类型

                const array = file.name.split(".")
                const fileType = array[array.length - 1];
                let beyondSize, isHaveBan
                if (_this.state.banFileType) {
                    isHaveBan = _this.state.banFileType.indexOf(fileType)
                    if (isHaveBan > -1) {
                        notification.warning(
                            {
                                placement: 'bottomRight',
                                bottom: 50,
                                duration: 2,
                                message: "提示",
                                description: "暂不支持此文件格式，禁止上传！"
                            }
                        )
                        return false
                    }

                }
                if (_this.state.uploadMax) {
                    beyondSize = file.size / 1024 / 1024 < _this.state.uploadMax
                    if (!beyondSize) {
                        notification.warning(
                            {
                                placement: 'bottomRight',
                                bottom: 50,
                                duration: 2,
                                message: "提示",
                                description: `上传文件最大${_this.state.uploadMax}MB`
                            }
                        )
                        return false
                    }

                }
                return true
            },
            showUploadList: false,
        };


        return (
            <span>
                {
                    this.props.isBatch ?
                        (<Upload {...head} style={{ cursor: 'pointer' }} >
                            <Button style={{ margin: '0' }}>
                                <MyIcon type="icon-shangchuanwenjian" /> 选择文件
                            </Button>
                        </Upload>)
                        :
                        (
                            <Upload {...upload} style={{ cursor: 'pointer' }} >
                                <span>
                                    {intl.get("wsd.global.hint.selectdoc")}
                                </span>
                            </Upload>
                        )
                }
            </span>


        )
    }

}


export default connect(state => ({
    currentLocale: state.localeProviderData
}))(UploadTpl)





