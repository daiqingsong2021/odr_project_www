import React, { Component } from 'react';
import style from './style.less';
import {Table,Upload,notification, Form, Row, Col, Input, Button, Icon, Select, DatePicker, Modal, Checkbox,InputNumber } from 'antd';
import axios from '../../../../../../api/axios';
import { dowErrorWb,getPeopleList } from '../../../../api/suzhou-api';
import moment from 'moment';
import { baseURL } from '../../../../../../api/config'
import { connect } from 'react-redux';
import * as dataUtil from "../../../../../../utils/dataUtil";
import PublicButton from '../../../../../../components/public/TopTags/PublicButton';
import MyIcon from '../../../../../../components/public/TopTags/MyIcon'



const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;
//人员-新增修改Modal
class PermissionModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            info: {},
            file: null,
            fileList: [],
            selectedRowKeys:[],
            uploading: false,
            data:[{id:"111",'aa':"xx",'bb':'bb',"cc":'cc'},{id:'222','aa':"xx1",'bb':'bb1',"cc":'cc1'}],
            personData:'', //选择操作的人员
            actuName:null, //用户
        };
    }
    componentDidMount() {
        const userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
        this.setState({
            actuName:userInfo.actuName,
            personData:this.props.personData
        })
    }
    //删除验证
    deleteVerifyCallBack=()=>{
        let { selectedRowKeys, data } = this.state;
        if (selectedRowKeys.length==0) {
        notification.warning(
            {
            placement: 'bottomRight',
            bottom: 50,
            duration: 2,
            message: '未选中数据',
            description: '请勾选数据进行操作'
            }
        )
        return false
        }else{
        return true
        }
    }
    getInfo = (record, index) => {
        this.setState({
            rightData: record,
        })
    };
    getList = (callBack) => {
    }
  onClickHandle = (name) => {
    if(name == 'DeleteTopBtn'){
        let {selectedRowKeys} = this.state;
        if(selectedRowKeys.length == 0){
            notification.warning(
                {
                  placement: 'bottomRight',
                  bottom: 50,
                  duration: 2,
                  message: '未选中数据',
                  description: '请选择数据进行操作'
                }
              )
        }else{
            // axios.deleted(deletePeople, { data: selectedRowKeys }, true).then(res => {
            // //删除
            // const {total,selectedRows,pageSize,currentPageNum} = this.state
            // let totalPageNum = Math.ceil((total - selectedRows.length) / pageSize);        //计算总页数
            // let PageNum = totalPageNum >= currentPageNum ? currentPageNum : totalPageNum   //总页数大于等于 当前页面，当前页数不变 否则 为1
            // this.setState({
            //     selectedRows:[],
            //     selectedRowKeys:[],
            //     currentPageNum:PageNum
            // },()=>{
            //     this.getListData();
            // })
        }
    }
    if(name == 'download'){
        let {selectedRowKeys} = this.state;
        if(selectedRowKeys.length == 0){
            notification.warning(
                {
                  placement: 'bottomRight',
                  bottom: 50,
                  duration: 2,
                  message: '未选中数据',
                  description: '请选择数据进行操作'
                }
              )
        }else if(selectedRowKeys.length == 1){
            
        }else{
            notification.warning(
                {
                  placement: 'bottomRight',
                  bottom: 50,
                  duration: 2,
                  message: '提示',
                  description: '请选择一个文件进行下载'
                }
              )
        }
    }
  }

  handleSubmit = (val, e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
    });
  };

    handleCancel = (e) => {

        this.props.handleCancel();
    };
    //上传回调
    file = (files) => {
        if(files.response && files.response.data){
            
        }else{
            // let obj={
            //     fileName:files.originFileObj.name.split('.')[0],
            //     type:files.originFileObj.name.split('.')[1],
            //     isSucceed: files.response.status,
            //     size: files.response.size
            // }
            // this.setState({
            //     data:[obj,...this.state.data]
            // })
        }
    }
  render() {
    const { intl } = this.props.currentLocale;
    const columns = [
        {
            title:'文档标题',
            dataIndex: 'aa',
            key: 'aa',
        },
        {
            title:'上传人',
            dataIndex: 'bb',
            key: 'bb',
        },
        {
            title:'上传时间',
            dataIndex: 'cc',
            key: 'cc',
        },
    ]
    const { selectedRowKeys } = this.state
        const rowSelection = {
            selectedRowKeys,
            onChange: (selectedRowKeys) => {
                this.setState({
                    selectedRowKeys: selectedRowKeys
                })
            }
        };
        // 上传
        const _this = this;
        const head = {
            name: 'file',
            action:baseURL+'/' + 'api/szxm/rygl/projInfo/uploadPeopleFile'+  `?projectId=${this.props.projectId}&sectionId=${this.props.sectionId}&projInfoId=${this.props.enTryId}`,
            action:baseURL+'/' + 'api/szxm/rygl/projInfo/uploadPeopleFile'+`?projectId=12&sectionId=12&projInfoId=12`,
            headers: {
                Authorization: sessionStorage.getItem('token')
            },
            beforeUpload(file, fileList){
            },
            onChange(info) {
                if (info.file.status !== 'uploading') {
                    _this.file(info.file)
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
                        axios.down(dowErrorWb+`?errorId=${info.file.response.message}`,{}).then((res)=>{
                        })
                    }
                }
            },
            multiple: true,
            showUploadList: false,
        }
    return (
        <div className={style.main}>

        <div className={style.mainHeight}>
            <Modal title={this.props.title} visible={this.props.visible}
                onCancel={this.handleCancel}
                width="800px"
                footer={<div className="modalbtn">
                {this.props.addOrModify == 'add' ? <Button key={3} onClick={this.handleSubmit.bind(this, 'goOn')}>{intl.get('wsd.global.btn.saveandcontinue')}</Button>
                    : <Button key={1} onClick={this.handleCancel}>{intl.get('wsd.global.btn.cancel')}</Button>}
                <Button key={2} onClick={this.handleSubmit.bind(this, 'save')} type="primary">{intl.get('wsd.global.btn.preservation')}</Button>
                </div>}
            >
            <div className={style.rightTopTogs}>
                {/*上传*/}
                <Upload {...head} style={{ cursor: 'pointer' }} >
                        <MyIcon type="icon-shangchuanwenjian" />上传
                </Upload>
                {/* <PublicButton name={'上传'} title={'上传'} icon={'icon-shangchuanwenjian'} afterCallBack={this.onClickHandle.bind(this, 'UploadTopBtn')} /> */}
                {/*删除*/}
                <PublicButton title={"删除"} useModel={true} verifyCallBack={this.deleteVerifyCallBack} afterCallBack={this.onClickHandle.bind(this, "DeleteTopBtn")} icon={"icon-delete"} />
                {/*下载*/}
                <PublicButton name={'下载'} title={'下载'} edit={this.props.wfPubliceditAuth} icon={'icon-xiazaiwenjian'} afterCallBack={this.onClickHandle.bind(this, "download")}  />
            </div>
            <div className={style.mainScorll} id="checkid">
                <Table 
                    className={style.table} 
                    rowKey={record => record.id} 
                    columns={columns} 
                    dataSource={this.state.data} 
                    name={this.props.name}
                    size='small'
                    pagination={false}
                    rowSelection={rowSelection}
                />
            </div>
            </Modal>
        </div>
    </div>
    );
  }
}

const PermissionModals = Form.create()(PermissionModal);
export default connect(state => ({
  currentLocale: state.localeProviderData,
}))(PermissionModals);
