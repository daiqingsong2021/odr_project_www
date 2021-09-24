import React, { Component } from 'react'
import { Modal, Button, Row, Col, Input, Select, Form, TreeSelect } from 'antd'
import style from './style.less'
import { connect } from 'react-redux'
import UploadTpl from '../../../../../components/public/TopTags/uploadTpl'
import axios from '../../../../../api/axios'
import { getdictTree, docOrgSel, docProjectAdd, docProjectSel, docProjectInfo, docProjectUpdate } from '../../../../../api/api'
import {addSubjectScore} from '@/modules/Suzhou/api/suzhou-api'
import * as dataUtil from "../../../../../utils/dataUtil"
import SubmitButton from "../../../../../components/public/TopTags/SubmitButton"
import { docFolderSzxm,docAddSzxm } from '../../../../Suzhou/api/suzhou-api';
class UploadDoc extends Component {

    state = {
        inputValue: 0,
        task: false,
        taskData: {},
        fileId: null,
        fileName: '',
        orgSelData: [],
        folderSelData: [],
        data: {},
    }

    getData = () => {
        axios.get(docProjectInfo(this.props.record.docId)).then(res => {
            this.setState({
                data: res.data.data,
                fileName: res.data.data.fileName ? res.data.data.fileName : '',
                fileId: res.data.data.fileId ? res.data.data.fileId : null
            })
        })
    }

    componentDidMount() {
        const userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
        this.setState({
            actuName:userInfo.actuName
        })
        if (this.props.type === 'modify') {
            this.getData();
        }
      //文件夹
      if (this.state.folderSelData.length == 0 && this.props.projectId) {
        axios.get(docFolderSzxm(this.props.projectId,this.props.menuId), {}, null, null, false).then(res => {

          let list_ = res.data.data || [];
          function _(list){
            if(list){
              for(let i = 0, len = list.length; i < len; i++){

                let {id,children} = list[i];

                if(!children || children.length == 0){
                  return id;
                }
                let r = _(children);
                if(r){
                  return r;
                }
              }
            }
            return null;
          }
          let selectId = _(list_);

          this.setState({
            folderSelData: res.data.data,
            selectId
          })
        })
      }


        //所属部门
      if (this.state.orgSelData.length == 0 && this.props.projectId) {
          axios.get(docOrgSel(this.props.projectId), {}, null, null, false).then(res => {
              this.setState({
                  orgSelData: res.data.data
              })
          })
      }
      this.curentTime();

    }


    handleSubmit = (val) => {
       
        this.props.form.validateFieldsAndScroll((err, fieldsValue) => {
            if (!err) {

                if (this.props.type == 'upload') {
                    let values = {
                        ...fieldsValue,
                        fileId: this.state.fileId,
                        projectId: this.props.projectId ? this.props.projectId : null,
                        bizId: this.props.bizId,
                        bizType: this.props.bizType,
                        secutyLevel:1,
                        sectionId:this.props.sectionId
                    }
                  

                    let {startContent} = this.props.extInfo  || {};
                    let url = dataUtil.spliceUrlParams(docAddSzxm,{startContent});
                    axios.post(url, values, true, '上传成功',true).then(res => {
                        const obj = {
                          projectId:this.props.projectId,
                          sectionId:this.props.sectionId,
                          fileTitle:res.data.data.docTitle,
                          fileId:res.data.data.fileId,
                          uploadFileTime:res.data.data.creatTime,
                          uploador:res.data.data.creator.id,
                          scoreTime:'',
                          raterId:'',
                          sourceType:this.props.bizType,
                          score:''
                        }
                        console.log(obj);
                        if(this.props.isRated){
                          axios.post(addSubjectScore,obj,true).then(res=>{

                          })
                        }
                        this.props.update();
                        if (val == 'save') {
                            // 清空表单项
                            this.props.form.resetFields()
                            this.setState({
                                fileId: null,
                                fileName: '',
                            })
                            // 关闭弹窗
                            this.props.handleCancel('UploadVisible');
                        } else if (val == 'goOn') {

                            // 清空表单项
                            this.props.form.resetFields()
                            this.setState({
                                fileId: null,
                                fileName: '',
                            })

                        }

                    })
                } else {
                    const values = {
                        ...fieldsValue,
                        fileId: this.state.fileId,
                        projectId: this.props.projectId ? this.props.projectId : null,
                        bizId: this.props.bizId,
                        bizType: this.props.bizType,
                        id: this.props.record.docId,
                        folderId: this.state.data.folderId,
                        secutyLevel:1
                    }
                    let {startContent} = this.props.extInfo  || {};
                    let url = dataUtil.spliceUrlParams(docProjectUpdate,{startContent});
                    axios.put(url, values, true, '修改成功',true).then(res => {
                        this.props.update();
                        if (val == 'save') {
                            // 清空表单项
                            this.props.form.resetFields()
                            this.setState({
                                fileId: null,
                                fileName: '',
                            })
                            // 关闭弹窗
                            this.props.handleCancel('UploadVisible');
                        } else {
                            // 清空表单项
                            this.props.form.resetFields()
                            this.setState({
                                fileId: null,
                                fileName: '',
                            })

                        }

                    })
                }
            }
        })
    }
    taskHandleCancel = () => {
        this.setState({
            task: false
        })
    }
    click() {
        this.setState({ task: true })
    }
    handleCancel=()=>{
        this.props.handleCancel()
    }

    //上传回调
    file = (files) => {
        this.setState({
            fileId: files.response ? (files.response.data ? files.response.data.id : null) : null,
            fileName: files.response ? (files.response.data ? files.response.data.fileName : '') : ''
        })
        this.props.form.resetFields('fileId', [files.response ? (files.response.data ? files.response.data.fileName : '') : ''])
       
        this.props.form.setFieldsValue({docTitle:files.response ? (files.response.data ? files.response.data.fileName : '') : ''})
       
         
        
    }

    //任务选择回调
    taskData = (task) => {
        let obj = {
            id: task.id,
            name: task.name,
        }
        this.setState({
            taskData: obj
        })
    }


      //  生成时间戳编码
      curentTime = () => {
          let now = new Date();
          let year = now.getFullYear();       //年
          let month = now.getMonth() + 1;     //月
          let day = now.getDate();            //日
          let hh = now.getHours();            //时
          let mm = now.getMinutes();          //分
          let ss = now.getSeconds();           //秒
          let clock = year + "";
          if(month < 10){
            clock += "0";
          }
          clock += month + "";
          if(day < 10)  {
            clock += "0";
          }
          clock += day + "";
          if(hh < 10) {
            clock += "0";
          }
          clock += hh + "";
          if(mm < 10){
            clock += '0';
          }
          clock += mm + "";
          if(ss < 10){
            clock += '0';
          }
          clock += ss;
          this.setState({
            clock : clock
          })
      }



  render() {
        const { intl } = this.props.currentLocale;
        let formData = this.state.data;

        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };
        const formItemLayout2 = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 4 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 20 },
            },
        };

        return (
            <div>
                <Modal
                    className={style.main}
                    width="850px"
                    title={this.props.ModalTitle}
                    centered={true}
                    visible={true}
                    onCancel={this.handleCancel.bind(this)}
                    mask={false} maskClosable={false}
                    footer={
                        <div className='modalbtn'>
                            {
                                this.props.type == 'modify' ?
                                    <SubmitButton key="saveAndSubmit" onClick={this.handleCancel}  content={ "取消" } /> 
                                    :
                                    <SubmitButton key="saveAndSubmit" onClick={this.handleSubmit.bind(this, 'goOn')} content={intl.get('wsd.global.btn.saveandcontinue')} />  //保存并继续
                            }
                            {/* 保存 */}
                            <SubmitButton key="b" type="submit" onClick={this.handleSubmit.bind(this, 'save')} type="primary" content={intl.get('wsd.global.btn.preservation')} />

                        </div>
                    }
                >

                    <div className={style.content}>
                        <Form>
                            <div className={style.content}>
                                <Row type="flex">
                                    {this.props.type == 'upload' ?
                                            <Col span={12} className={style.upload}>
                                                <Form.Item label={intl.get('wsd.i18n.plan.fileinfo.filename')} {...formItemLayout}>
                                                    {/* 文件名称 */}
                                                    <div className={style.list}>
                                                        {getFieldDecorator('fileId', {
                                                            initialValue: this.state.fileName,
                                                            rules: [{
                                                                required: true,
                                                                message: intl.get('wsd.i18n.message.select') + intl.get('wsd.i18n.plan.fileinfo.filename')
                                                            }],
                                                        })(
                                                            <Input disabled addonAfter={<UploadTpl isBatch={false} file={this.file} />} />
                                                        )}
                                                    </div>
                                                </Form.Item>
                                            </Col> :
                                            <Col span={12} className={style.upload}>
                                                <Form.Item label={intl.get('wsd.i18n.plan.fileinfo.filename')} {...formItemLayout}>
                                                    {/* 文件名称 */}
                                                    <div className={style.list}>
                                                        {getFieldDecorator('fileId', {
                                                            initialValue: this.state.fileName,
                                                            rules: [{
                                                                required: true,
                                                            }],
                                                        })(
                                                            <Input disabled />
                                                        )}
                                                    </div>
                                                </Form.Item>
                                            </Col>
                                    }
                                    {this.props.type === 'upload' ?
                                    <Col span={12}>
                                      <Form.Item label={intl.get('wsd.i18n.doc.temp.title')} {...formItemLayout}>
                                        {/* 文档标题 */}
                                        <div className={style.list}>
                                          {getFieldDecorator('docTitle', {
                                            initialValue: formData.docTitle,
                                            rules: [{
                                              required: true,
                                              message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.doc.temp.title')
                                            }],
                                          })(
                                            <Input maxLength={66}/>
                                          )}
                                        </div>
                                      </Form.Item>
                                    </Col>
                                    :
                                      <Col span={12}>
                                        <Form.Item label={intl.get('wsd.i18n.doc.temp.title')} {...formItemLayout}>
                                          {/* 文档标题 */}
                                          <div className={style.list}>
                                            {getFieldDecorator('docTitle', {
                                              initialValue: formData.docTitle,
                                              rules: [{
                                                required: true,
                                                message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.doc.temp.title')
                                              }],
                                            })(
                                              <Input maxLength={66}/>
                                            )}
                                          </div>
                                        </Form.Item>
                                      </Col>
                                }
                                    <Col span={12}>
                                      <Form.Item label={intl.get('wsd.i18n.doc.compdoc.docserial')} {...formItemLayout}>
                                        {/* 文档编号 */}
                                        <div className={style.list}>
                                          {getFieldDecorator('docNum', {
                                            initialValue: this.state.clock,
                                            rules: [{
                                              required: true,
                                              message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.doc.compdoc.docserial')
                                            }],
                                          })(
                                            <Input maxLength={33}/>
                                          )}
                                        </div>
                                      </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                      <Form.Item label={intl.get('wsd.i18n.doc.temp.folder')} {...formItemLayout}>
                                        {/* 文件夹 */}
                                        <div className={style.list}>
                                          {getFieldDecorator('folderId', {
                                            initialValue: this.state.selectId,
                                            rules: [{
                                              required: true,
                                              message: intl.get('wsd.i18n.message.select') + intl.get('wsd.i18n.doc.temp.folder')
                                            }],
                                          })(
                                            <TreeSelect
                                              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                              treeData={this.state.folderSelData}
                                              treeDefaultExpandAll
                                            />
                                          )}
                                        </div>
                                      </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                      <Form.Item label={intl.get('wsd.i18n.doc.compdoc.docauthor')} {...formItemLayout}>
                                        {/* 文档作者 */}
                                        <div className={style.list}>
                                          {getFieldDecorator('author', {
                                            initialValue: formData.author? formData.author:this.state.actuName,
                                            rules: [],
                                          })(
                                            <Input  maxLength={9}/>
                                          )}
                                        </div>
                                      </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label={intl.get('wsd.i18n.doc.temp.versions')} {...formItemLayout}>
                                            {/* 版本 */}
                                            <div className={style.list}>
                                                {getFieldDecorator('version', {
                                                    initialValue:  formData.version? formData.version:"1.0",
                                                    rules: [{
                                                        required: true,
                                                        message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.doc.temp.versions')
                                                    }],
                                                })(
                                                    <Input   maxLength={33}/>
                                                )}
                                            </div>
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </div>
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
}))(UploadDocs);



