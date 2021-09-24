import React, { Component } from 'react'
import { Modal, Button, Table, Icon, Upload, message, notification, Spin, Form, Row, Col, Input } from 'antd'
import style from './style.less'
import intl from 'react-intl-universal'
import { connect } from 'react-redux'
import { baseURL } from '@/api/config'
// import UploadTpl from 'UploadBtn/';
import axios from '@/api/axios';
import {uploadSmsGroup,expSmsGroupDetail,smsGroupUpdate} from '../../../../api/suzhou-api';
import MyIcon from '@/components/public/TopTags/MyIcon'
import * as dataUtil from "@/utils/dataUtil"
import notificationFun from '@/utils/notificationTip';
const locales = {
    'en-US': require('@/api/language/en-US.json'),
    'zh-CN': require('@/api/language/zh-CN.json')
}

class UploadDoc extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            disabled: false,
            data: [],
            type: '',
            file: null,
            fileList: [],
        }
    }
    state = {
        data: [],
        type: '',
    }
    componentDidMount() {
        this.setState({
            groupName:this.props.updateData.groupName,
            type:this.props.updateData.type,
            id:this.props.updateData.id
        })
    }
    handleCancel() {
        this.props.handleCancel();
    }

    handleUpload = () => {
        const { type,id,fileList } = this.state
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.setState({
                    loading: true,
                    disabled: true,
                })
                let URL = uploadSmsGroup(values.groupName)
                if(type === 'update' ){
                    URL = smsGroupUpdate(id,values.groupName)
                    if(fileList.length>0){
                        //修改文件
                        this.uploadFile(fileList,URL)
                    }else{
                        //只修改群组名称
                        axios.post(URL).then((res) => {
                            if(res.data.status === 200){
                                this.props.getListData();
                                this.props.handleCancel();
                            }
                        })
                    }
                }else{
                    if(fileList.length<=0){
                        notificationFun('提示', '未上传文件')
                        return
                    }
                    this.uploadFile(fileList,URL)
                }
            }
        });

    }
    uploadFile = (fileList,URL)=>{
        fileList.forEach(file => {
            const formData = new FormData()
            formData.append('file', file)
            axios.post(URL, formData).then((res) => {
                this.setState({
                    loading: false,
                    disabled: false,
                })
                if (res.data.message == "请求成功！") {
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
                    this.props.form.resetFields();
                    this.props.handleCancel()
                } else if (res.data.status == 1007) {
                    dataUtil.errorConfirm('提示',res.data.message)
                    this.props.form.resetFields();
                    this.props.handleCancel()
                } else {
                    dataUtil.errorConfirm('提示',res.data.message)
                    this.props.form.resetFields();
                    this.props.handleCancel()
                }
                this.setState({
                    fileList: []
                })
            })
        })
    }
    
    handleSubmit = () => {
    }
    expSmsGroupDetail = ()=>{
        axios.down(expSmsGroupDetail(this.props.updateData.id), {}).then((res) => {
        })
    }
    render() {
        const { fileList } = this.state;
        const { intl } = this.props.currentLocale;
        const { getFieldDecorator } = this.props.form;

        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 10 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 12 },
            },
        };
        const formItemLayout1 = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 5 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 18 },
            },
        };
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
                    fileList: [...state.fileList, file]
                }))
                return false
            },
            onChange(info) {
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
                    title={'导入群组成员'}
                    centered={true}
                    visible={this.props.modalVisible}
                    onCancel={this.props.handleCancel}
                    mask={false} maskClosable={false}
                    footer={
                        <div className='modalbtn'>

                            <div className={style.bottext}>

                            </div>
                            <Button key={1} onClick={this.props.handleCancel}>{'取消'}</Button>
                            <Button type="primary" disabled={this.state.disabled} onClick={this.handleUpload} > {intl.get('wsd.global.btn.affirm')} </Button>
                        </div>
                    }
                >

                    <div className={style.content}>
                        <Form onSubmit={this.handleSubmit}>
                            <Row type="flex">
                                <Col span={24}>
                                    <Form.Item label="选择文件：" {...formItemLayout1}>
                                        <Spin spinning={this.state.loading} tip="正在上传...">
                                            <Upload {...props} style={{ cursor: 'pointer' }} >
                                                <Button style={{ margin: '0' }}>
                                                    <MyIcon type="icon-shangchuanwenjian" /> 选择文件
                                                </Button>
                                            </Upload>
                                        </Spin>
                                        {this.props.updateData.type === 'update' && <span onClick={this.expSmsGroupDetail} style={{ color: 'rgb(45,182,244)', cursor: 'pointer' }}>当前群组成员下载</span>}
                                    </Form.Item>
                                </Col>
                                {/* <Col span={24}>
                                    <Form.Item label="    " {...formItemLayout1}>
                                        <span>下载</span>
                                    </Form.Item>
                                </Col> */}
                                <Col span={24}>
                                    <Form.Item label="群组名称：" {...formItemLayout1}>
                                        {getFieldDecorator('groupName', {
                                            initialValue: this.state.groupName,
                                            rules: [{ required: true, message: '请输入群组名称' }],
                                        })(
                                            <Input placeholder="请输入" maxLength={20} />
                                        )}
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                    </div>
                </Modal>
            </div>
        )
    }

}

const UploadDocs = Form.create()(UploadDoc);
export default connect(state => ({
    currentLocale: state.localeProviderData
}))(UploadDocs)





