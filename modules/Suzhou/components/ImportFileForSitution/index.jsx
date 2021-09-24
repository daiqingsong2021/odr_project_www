import React, { Component } from 'react'
import { Modal, Button, Table, Icon, Upload, message,notification,Spin,Popconfirm } from 'antd'
import style from './style.less'
import intl from 'react-intl-universal'
import { connect } from 'react-redux'
import { baseURL } from '@/api/config'
import axios from '@/api/axios';
import {dowErrorWb,queryIsHaveTrafficMain} from '../../api/suzhou-api';
import MyIcon from '@/components/public/TopTags/MyIcon'
const locales = {
    'en-US': require('@/api/language/en-US.json'),
    'zh-CN': require('@/api/language/zh-CN.json')
}

class UploadDoc extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading:false,
            disabled:false,
            data: [],
            type: '',
            file:null,
            fileList: [],
            popVisible:false
        }
    }
    state = {
        data: [],
        type: '',
    }
    componentDidMount() {
    }
    handleCancel() {
        this.props.handleCancel();
    }
    //确定导入
    uploadSubmit = (formData,file) => {
        this.setState({
            loading:true,
        })
        axios.post(this.props.url,formData).then((res)=>{
            this.setState({
                loading:false,
                disabled:false,
            })                  
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
                    this.props.getListData()
                    this.props.handleCancel()
                }else if(res.data.status == 1007){
                    //上传失败
                    notification.error(
                        {
                            placement: 'bottomRight',
                            bottom: 50,
                            duration: 2,
                            message: res.data.message,
                            description:file.name
                        }
                        )
                        // axios.down(dowErrorWb+`?errorId=${res.data.message}`,{}).then((res)=>{
                        // })
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
                            fileList: [],
                            formData:null
                        })
                    })
    }
    //导入校验
    handleUpload = () => {
        this.setState({
            disabled:true,
        })
        const { fileList } = this.state
        fileList.forEach(file => {
            const formData = new FormData()
            formData.append('file', file)
            this.setState({formData,file})
            axios.post(queryIsHaveTrafficMain,formData).then((res)=>{
                if(res.data.status == 200 ){
                    if(res.data.data.status == '0'){
                        // this.setState({popVisible:true})
                        notification.warning(
                            {
                                placement: 'bottomRight',
                                bottom: 50,
                                duration: 2,
                                message: "提示",
                                description: file.name + '已经导入，不可重复导入！'
                            }
                            )
                            this.props.handleCancel()
           
                    }else{
                        this.uploadSubmit(formData,file)
                    }
                }else{
                    this.props.handleCancel()
                }
            })
            
        })
    }
    popConfirm=()=>{
        const {formData,file} = this.state
        this.setState({popVisible:false})
        this.uploadSubmit(formData,file)
    }
    popCancel=()=>{
        this.setState({
            popVisible:false,
            disabled:false,
        })
    }
    render() {
        const {fileList } = this.state;
        const { intl } = this.props.currentLocale;
        const _this = this;
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
                fileList: [file]
              }))
              return false
            },
            onChange(info){
                _this.setState({
                    disabled:false,
                    file: info.file
                })
            },
            multiple: false,
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
                            </div>
                            <Button key={1} onClick={this.props.handleCancel}>{'取消'}</Button>
                            <Popconfirm
                                title="该日期数据已存在，是否覆盖？"
                                visible={this.state.popVisible}
                                onConfirm={this.popConfirm}
                                onCancel={this.popCancel}
                                okText="确定"
                                cancelText="取消"
                            >
                                <Button type="primary" disabled={this.state.disabled} onClick={this.handleUpload} > {intl.get('wsd.global.btn.affirm')} </Button>
                            </Popconfirm>
                        </div>
                    }
                >
                    <div className={style.content}>
                        <Spin spinning={this.state.loading} tip="正在上传...">
                            <Upload {...props} style={{ cursor: 'pointer' }} >
                                <Button style={{ margin: '0' }}>
                                    <MyIcon type="icon-shangchuanwenjian" /> 选择文件
                                </Button>
                            </Upload>
                        </Spin>
                    </div>
                </Modal>
            </div>
        )
    }

}


export default connect(state => ({
    currentLocale: state.localeProviderData
}))(UploadDoc)





