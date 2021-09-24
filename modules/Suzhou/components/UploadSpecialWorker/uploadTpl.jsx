import React, { Component } from 'react'
import { Button, Icon, Upload, message, notification } from 'antd'
import { connect } from 'react-redux'
import { baseURL } from '../../../../api/config'
import MyIcon from '../../../../components/public/TopTags/MyIcon';


/**
 *
 * @isBatch 单上传多上传标识符(true: 多上传, false： 单上传)
 * @file 上传成功之后的回调
 */


class UploadTpl extends Component {

    state = {
        file: null,
    }


    render() {

        const { intl } = this.props.currentLocale;

        const _this = this;
        //多上传配置
        const head = {
            name: 'file',
            action: baseURL + '/api/szxm/rygl/specialWorker/uploadSpecialWorkCert'+ (this.props.type ? '/' + this.props.type : '') ,
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
                        notification.warning(
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
                        notification.warning(
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
            showUploadList: false,
        };


        return (
            <span>
                {
                    this.props.isBatch ?
                        (<Upload {...head} style={{ cursor: 'pointer' }} >
                            <Button style={{ margin: '0' }} disabled={this.props.editFlag}>
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




