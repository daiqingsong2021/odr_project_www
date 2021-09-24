import React, { Component } from 'react'
import { Modal, Button, Table, Icon, Upload, message,notification } from 'antd'
import style from './style.less'
import intl from 'react-intl-universal'
import { connect } from 'react-redux'
import { baseURL } from '../../../../../../api/config'
import UploadTpl from '../UploadBtn';
import axios from '../../../../../../api/axios';
import {dowErrorWb,uploadPeoEntryDetailFile} from '../../../../api/suzhou-api';
import MyIcon from '../../../../../../components/public/TopTags/MyIcon'

const locales = {
    'en-US': require('../../../../../../api/language/en-US.json'),
    'zh-CN': require('../../../../../../api/language/zh-CN.json')
}



class UploadDoc extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            type: '',
            file:null,
            fileList: [],
        }
    }
    state = {
        data: [],
        type: '',
    }
    componentDidMount() {
    }
    handleCancel() {
        // this.props.getDataList();
        this.props.handleCancel();
        // this.props.handleCancel('UploadVisible')
    }

    //上传的回调
    // file = (files) => {
    //     if(files.response && files.response.data){
            
    //     }else{
    //         let obj={
    //             fileName:files.originFileObj.name.split('.')[0],
    //             type:files.originFileObj.name.split('.')[1],
    //             isSucceed: files.response.status,
    //             size: files.response.size
    //         }
    //         this.setState({
    //             data:[obj,...this.state.data]
    //         })
    //     }
        // if (files.response && files.response.data) {
        //     let obj = {
        //         fileName: files.response.data.fileName.split('.')[0],
        //         size: files.response.data.size,
        //         type: files.response.data.fileName.split('.')[1],
        //         isSucceed: files.response.status
        //     }
        //     this.setState({
        //         data: [obj, ...this.state.data]
        //     })
        // } else {

        //     let obj = {
        //         fileName: files.name.split('.')[0],
        //         type: files.name.split('.')[1],
        //         isSucceed: files.response.status
        //     }
        //     this.setState({
        //         data: [obj, ...this.state.data]
        //     })

        // }

    // }
    
    handleUpload = () => {
        const { fileList } = this.state
        fileList.forEach(file => {
            const formData = new FormData()
            formData.append('file', file)
            axios.post(uploadPeoEntryDetailFile+  `?projectId=${this.props.projectId}&sectionId=${this.props.sectionId}&enTryId=${this.props.enTryId}`,formData).then((res)=>{                  
                if(res.data.message == "请求成功！"){
                    //上传成功
                    notification.success(
                        {
                            placement: 'bottomRight',
                            bottom: 50,
                            duration: 2,
                            message: '上传成功',
                            description: file.name
                        }
                        );
                        this.props.getListData1()
                        this.props.handleCancel()
                    }else if(res.data.status == 1007){
                        //上传失败
                        notification.error(
                            {
                                placement: 'bottomRight',
                                bottom: 50,
                                duration: 2,
                                message: '错误',
                                description:file.name
                            }
                            )
                            axios.down(dowErrorWb+`?errorId=${res.data.message}`,{}).then((res)=>{
                            })
                            this.props.getListData1()
                            this.props.handleCancel()
                        }else{
                            notification.warning(
                                {
                                    placement: 'bottomRight',
                                    bottom: 50,
                                    duration: 2,
                                    message: res.data.message,
                                    description: file.name
                                }
                                )
                                this.props.handleCancel()
                            }
                            this.setState({
                                fileList: []
                            })
                        })
                })
        }
    render() {
        const {fileList } = this.state;
        const { intl } = this.props.currentLocale;
        // const columns = [{
        //     title: intl.get("wsd.i18n.plan.fileinfo.filename"),//文件名称
        //     dataIndex: 'fileName',
            
        // }, {
        //     title: intl.get('wsd.i18n.plan.fileinfo.filetype'),//文件类型
        //     dataIndex: 'type',

        // },{
        //     title: '',
        //     dataIndex: 'isSucceed',
        //     render: (text, record) => <Icon type={ text == 200 ? "check" : "close"} />
        // }];
        const _this = this;
        // const head = {
        //     name: 'file',
        //     // action: baseURL + '/api/doc/file/upload'+ (this.props.type ? '/' + this.props.type : '') ,
        //     action:baseURL+'/' + uploadPeoEntryDetailFile+  `?projectId=${this.props.projectId}&sectionId=${this.props.sectionId}&enTryId=${this.props.enTryId}`,
        //     headers: {
        //         Authorization: sessionStorage.getItem('token')
        //     },
        //     beforeUpload(file, fileList){
        //     },
        //     onChange(info) {
        //         if (info.file.status !== 'uploading') {
        //             _this.file(info.file)
        //             _this.setState({
        //                 file: info.file
        //             })
        //         }
        //         if(info.file.response){
        //             if(info.file.response.message == "请求成功！"){
        //                 //上传成功
        //                 notification.warning(
        //                     {
        //                         placement: 'bottomRight',
        //                         bottom: 50,
        //                         duration: 2,
        //                         message: info.file.name,
        //                         description: '上传成功'
        //                     }
        //                 );
        //                 _this.props.getListData1();
        //                 //_this.props.handleCancel();
        //             }else if(info.file.response.status == 1007){
        //                 //上传失败
        //                 notification.warning(
        //                     {
        //                         placement: 'bottomRight',
        //                         bottom: 50,
        //                         duration: 2,
        //                         message: info.file.name,
        //                         description:info.file.response.message
        //                     }
        //                 )
        //                 axios.down(dowErrorWb+`?errorId=${info.file.response.message}`,{}).then((res)=>{
        //                 });
        //                 _this.props.handleCancel();
        //             }else{
        //                 notification.warning(
        //                     {
        //                         placement: 'bottomRight',
        //                         bottom: 50,
        //                         duration: 2,
        //                         message: info.file.name,
        //                         description:info.file.response.message
        //                     }
        //                 )
        //                 _this.props.handleCancel();
        //             }
        //         }
        //     },
        //     multiple: true,
        //     showUploadList: false,
        // }
        const props = {
            onRemove: file => {
              _this.setState(state => {
                const index = state.fileList.indexOf(file)
                const newFileList = state.fileList.slice()
                newFileList.splice(index, 1)
                return {
                  fileList: newFileList
                }
              })
            },
            beforeUpload: file => {
              _this.setState(state => ({
                fileList: [...state.fileList, file]
              }))
              return false
            },
            onChange(info){
                _this.setState({
                    file: info.file
                })
            },
            multiple: true,
            fileList,
          }
        return (
            <div>
                <Modal
                    className={style.main}
                    width="650px"
                    title={'导入模版'}
                    centered={true}
                    visible={this.props.modalVisible}
                    onCancel={this.props.handleCancel}
                    mask={false} maskClosable={false}
                    footer={
                        <div className='modalbtn'>

                            <div className={style.bottext}>
                                {/* 上传按钮 */}
                                {/* <UploadTpl isBatch={true} file={this.file} type='temp'
                                getListData={this.props.getListData}
                                enTryId={this.props.enTryId}
                                projectId={this.props.projectId}
                                sectionId={this.props.sectionId} /> */}

                                {/* <Upload {...head} style={{ cursor: 'pointer' }} >
                                    <Button style={{ margin: '0' }}>
                                        <MyIcon type="icon-shangchuanwenjian" /> 选择文件
                                    </Button>
                                </Upload> */}
                            </div>
                            <Button key={1} onClick={this.props.handleCancel}>{'取消'}</Button>
                            <Button type="primary" onClick={this.handleUpload} > {intl.get('wsd.global.btn.affirm')} </Button>
                        </div>
                    }
                >

                    <div className={style.content}>

                        {/* <Table rowKey={record => record.id} columns={columns} dataSource={this.state.data} size="small" pagination={false}
                            onRow={(record) => {
                                return {
                                    onClick: (event) => {

                                    }
                                }
                            }}
                        /> */}
                        <Upload {...props} style={{ cursor: 'pointer' }} >
                            <Button style={{ margin: '0' }}>
                                <MyIcon type="icon-shangchuanwenjian" /> 选择文件
                            </Button>
                        </Upload>

                    </div>


                </Modal>
            </div>
        )
    }

}


export default connect(state => ({
    currentLocale: state.localeProviderData
}))(UploadDoc)





