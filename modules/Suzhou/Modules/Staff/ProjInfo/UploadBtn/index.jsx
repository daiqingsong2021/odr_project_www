import React, { Component } from 'react'
import { Button, Icon, Upload, message, notification } from 'antd'
import { connect } from 'react-redux'
import { baseURL } from '../../../../../../api/config'
import axios from '../../../../../../api/axios'
import {dowErrorWb,uploadPeoEntryDetailFile} from '../../../../api/suzhou-api';
import MyIcon from '../../../../../../components/public/TopTags/MyIcon'

/**
 *
 * @isBatch 单上传多上传标识符(true: 多上传, false： 单上传)
 * @file 上传成功之后的回调
 */


class UploadTpl extends Component {
    constructor(props) {
        super(props);
        this.state = {
            file: null,
            fileList: [],
            uploading: false,
        }
    }
    state = {
        file: null,
    }
    render() {

        const { intl } = this.props.currentLocale;
        const {projectId,sectionId,enTryId} = this.props;
        const _this = this;
        //多上传配置
        const head = {
            name: 'file',
            // action: baseURL + '/api/doc/file/upload'+ (this.props.type ? '/' + this.props.type : '') ,
            action:baseURL+'/' + uploadPeoEntryDetailFile+  `?projectId=${projectId}&sectionId=${sectionId}&enTryId=${enTryId}`,
            headers: {
                Authorization: sessionStorage.getItem('token')
            },
            beforeUpload(file, fileList){
            },
            onChange(info) {
                if (info.file.status !== 'uploading') {
                    _this.props.file(info.file)
                    _this.setState({
                        file: info.file
                    })
                }
                if(info.file.response){
                    if(info.file.response.message == "请求成功！"){
                        //上传成功
                        notification.warning(
                            {
                                placement: 'bottomRight',
                                bottom: 50,
                                duration: 2,
                                message: info.file.name,
                                description: '上传成功'
                            }
                        );
                        // this.props.getListData();
                    }else{
                        //上传失败
                        notification.warning(
                            {
                                placement: 'bottomRight',
                                bottom: 50,
                                duration: 2,
                                message: info.file.name,
                                description: '上传失败'
                            }
                        )
                        axios.down(dowErrorWb+`?errorId=${info.file.response.data}`,{}).then((res)=>{
                        })
                    }
                }
                // if (info.file.response) {
                //     if (info.file.response.status == 200) {
                //         notification.warning(
                //             {
                //                 placement: 'bottomRight',
                //                 bottom: 50,
                //                 duration: 2,
                //                 message: info.file.name,
                //                 description: intl.get('wsd.i18n.doc.compdoc.successupload')
                //             }
                //         )
                //     } else if (info.file.response.status != 200) {
                //         notification.warning(
                //             {
                //                 placement: 'bottomRight',
                //                 bottom: 50,
                //                 duration: 2,
                //                 message: info.file.name,
                //                 description: intl.get('wsd.i18n.doc.compdoc.errorupload')
                //             }
                //         )
                //     }
                // }
            },
            multiple: true,
            showUploadList: false,
        }


        // 单上传按钮配置函数
        const upload = {
            name: 'file',
            // action: baseURL + '/api/doc/file/upload',
            // action: baseURL + dowErrorWb+  '?enTryId=222',
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

        const { uploading, fileList } = this.state;
        const props = {
            onRemove: file => {
                this.setState(state => {
                    const index = state.fileList.indexOf(file);
                    const newFileList = state.fileList.slice();
                    newFileList.splice(index, 1);
                    return {
                        fileList: newFileList,
                    };
                });
            },
            beforeUpload: file => {
                this.setState(state => ({
                    fileList: [ file],
                    successtoUp:true
                }));
                return false;
            },
            fileList,
            showUploadList:false
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
                            <Upload {...props} style={{ cursor: 'pointer' }} >
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





