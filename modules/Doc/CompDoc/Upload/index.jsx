import React, { Component } from 'react'
import { Modal, Button, Row, Col, Input, Icon, Select, Form, Upload, message, InputNumber, TreeSelect } from 'antd'
import style from './style.less'
import { connect } from 'react-redux'
import SubmitButton from "../../../../components/public/TopTags/SubmitButton"
import DisUser from '../../../Components/Window/SelectUser'
import UploadTpl from '../../../../components/public/TopTags/uploadTpl'
import axios from '../../../../api/axios'
import { getdictTree, docCorpAdd } from '../../../../api/api'
import { docMainOrg, docProjectAdd, docProjectSel, docProjectInfo, docProjectUpdate } from '../../../../api/api'



class UploadDoc extends Component {

    state = {
        modalInfo: {
            title: '上传文档'
        },
        inputValue: 0,
        task: false,
        fileName: '',
        disUserData: [],
        disUserDataStr: '',
        selectData: null,
        fileId: null,
        treeSelectData: [],
        docclassifyData: [],
        professionData: [],
        secutylevelData: [],
        docOrgSel: [],
        data: {},
    }

    componentDidMount() {
        const userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
        this.setState({
            actuName:userInfo.actuName
        })

      //所属部门
      axios.get(docMainOrg(userInfo.id), {}, null, null, false).then(res => {
        this.setState({
          mainOrg: res.data.data ? res.data.data.id : null,
          mainOrgName: res.data.data ? res.data.data.orgName : null,
        })
      })
      this.curentTime();
    }


    onChange = (value) => {
        this.setState({
            inputValue: value,
        });
    }

    //上传保存
    handleSubmit = (val) => {
        
        this.props.form.validateFieldsAndScroll((err, fieldsValue) => {
            if (!err) {
                const values = {
                    ...fieldsValue,
                    fileId: this.state.fileId,
                    scope: this.state.disUserData,
                    folderId: this.props.data.id,
                    orgId: this.state.mainOrg,
                    secutyLevel:1
                }
                axios.post(docCorpAdd, values, true).then(res => {
                  
                    this.props.addList(res.data.data)
                    this.props.form.resetFields()
                    if (val == 'save') {    //判断是保存还是保存并继续
                        // this.handleCancel.bind(this)
                        this.props.handleCancel('UploadVisible')
                        this.setState({
                            disUserDataStr: '',
                            fileName: '',
                            fileId: null,
                        })

                    } else {
                        // 清空表单项
                        this.props.form.resetFields()
                        this.setState({
                            disUserDataStr: '',
                            fileName: '',
                            fileId: null,
                        })

                    }
                })


                // 关闭弹窗
                // this.props.handleCancel('UploadVisible')
                // this.handleCancel.bind(this)
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
    handleCancel() {
        this.props.handleCancel('UploadVisible')
    }

    //发布范围 分配用户的回调函数
    disUserData = (val) => {
        let str = [];
        let data = [];
        val.map(item => {
            str.push(item.name)
            let obj = {
                id: item.id,
                type: item.type
            }
            data.push(obj)
        })
        str = str.join(',')
        this.setState({
            disUserData: data,
            disUserDataStr: str
        })

    }

    //密级 select onFocus事件 请求下拉列表数据
    selectFocus = () => {
        axios.get(getdictTree('comm.secutylevel')).then(res => {
           if(res.data.data){
            this.setState({
                selectData: res.data.data
            })
           }
           
        })
    }


  //请求下拉列表
  onFocusSelect = (value) => {
    let {docclassifyData, secutylevelData, professionData } = this.state;

    if ((docclassifyData.length != 0 && value == 'doc.docclassify') || (secutylevelData.length != 0 && value == 'comm.secutylevel') || (professionData.length != 0 && value == 'doc.profession')) {
      return;
    }

    // if (value == 'org') {
    //   axios.get(docOrgSel(this.props.data.projectId)).then(res => {
    //     if (res.data.data) {
    //       this.setState({
    //         orgSelData: res.data.data
    //       })
    //     }
    //
    //   })
    // }
    axios.get(getdictTree(value)).then(res => {
      if(!res.data.data){
        return
      }
      if (value == 'doc.docclassify') {
        this.setState({
          docclassifyData: res.data.data
        })
      } else if (value == 'comm.secutylevel') {
        this.setState({
          secutylevelData: res.data.data
        })
      } else if (value == 'doc.profession') {
        this.setState({
          professionData: res.data.data
        })
      }
    })




  }


    //文档类型 请求下拉列表数据
    treeSelectFocus = () => {
        axios.get(getdictTree('doc.docclassify')).then(res => {
            this.setState({
                treeSelectData: res.data.data
            })
        })
    }

    /*file = (files) => {
        this.setState({
            fileId: files.response ? (files.response.data ? files.response.data.id : null) : null,
            fileName: files.response ? (files.response.data ? files.response.data.fileName : '') : ''
        })
        this.props.form.resetFields('fileId', [files.response ? (files.response.data ? files.response.data.fileName : '') : ''])
    }*/

  //上传回调
  file = (files) => {
    this.setState({
      fileId: files.response ? (files.response.data ? files.response.data.id : null) : null,
      fileName: files.response ? (files.response.data ? files.response.data.fileName : '') : ''
    })
    this.props.form.resetFields('fileId', [files.response ? (files.response.data ? files.response.data.fileName : '') : ''])

    this.props.form.setFieldsValue({ docTitle: files.response ? (files.response.data ? files.response.data.fileName : '') : '' })
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

        const formData = {}

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
                    title={this.state.modalInfo.title}
                    centered={true}
                    visible={true}
                    onCancel={this.handleCancel.bind(this)}
                    mask={false} maskClosable={false}
                    footer={
                        <div className='modalbtn'>
                            <SubmitButton key="goOn" onClick={this.handleSubmit.bind(this, 'goOn')} content="保存并继续" />
                            <SubmitButton key="save" onClick={this.handleSubmit.bind(this, 'save')} type="primary" content="保存" />

                        </div>
                    }
                >

                    <div className={style.content}>
                        <Form>
                            <div className={style.content}>
                                <Row type="flex">
                                  {
                                    this.props.type == 'upload' ?
                                      <Col span={12} className={style.upload}>
                                        <Form.Item label={intl.get('wsd.i18n.plan.fileinfo.filename')} {...formItemLayout}>

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

                                          <div className={style.list}>
                                            {getFieldDecorator('fileId', {
                                              initialValue: this.state.fileName,
                                              rules: [],
                                            })(
                                              <Input disabled addonAfter={<UploadTpl isBatch={false} file={this.file} />}/>
                                            )}
                                          </div>
                                        </Form.Item>
                                      </Col>
                                  }
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
                                          <Input maxLength={66} />
                                        )}
                                      </div>
                                    </Form.Item>
                                  </Col>
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
                                            <Input maxLength={30}/>
                                          )}
                                        </div>
                                      </Form.Item>

                                    </Col>
                                    <Col span={12}>
                                      <Form.Item label={intl.get('wsd.i18n.doc.temp.folder')} {...formItemLayout}>
                                        {/* 文件夹 */}
                                        <div className={style.list}>
                                          {getFieldDecorator('folderId', {
                                            initialValue: this.props.data.name,
                                            rules: [],
                                          })(
                                           <Input disabled/>
                                          )}
                                        </div>
                                      </Form.Item>
                                    </Col>

                                    {/*<Col span={12}>*/}
                                    {/*  <Form.Item label={intl.get('wsd.i18n.sys.user1.userlevel')} {...formItemLayout}>*/}
                                    {/*    /!* 密级 *!/*/}
                                    {/*    <div className={style.list}>*/}
                                    {/*      {getFieldDecorator('secutyLevel', {*/}
                                    {/*        initialValue:  formData.secutyLevel ? formData.secutyLevel.id : 1,*/}
                                    {/*        rules: [{*/}
                                    {/*          required: true,*/}
                                    {/*          message: intl.get('wsd.i18n.message.select') + intl.get('wsd.i18n.sys.user1.userlevel')*/}
                                    {/*        }],*/}
                                    {/*      })(*/}
                                    {/*        <Select onFocus={this.onFocusSelect.bind(this, 'comm.secutylevel')}>*/}
                                    {/*          {*/}
                                    {/*            this.state.secutylevelData.length ? this.state.secutylevelData.map(item => {*/}
                                    {/*              return (*/}
                                    {/*                <Select.Option key={item.value} value={item.value}>{item.title}</Select.Option>*/}
                                    {/*              )*/}
                                    {/*            }) : (*/}
                                    {/*              formData.secutyLevel ? (*/}
                                    {/*                <Select.Option key={formData.secutyLevel.id} value={formData.secutyLevel.id}>{formData.secutyLevel.name}</Select.Option>*/}
                                    {/*              ) : <Select.Option key={1} value={1}>非密</Select.Option>*/}
                                    {/*            )*/}
                                    {/*          }*/}
                                    {/*        </Select>*/}
                                    {/*      )}*/}
                                    {/*    </div>*/}
                                    {/*  </Form.Item>*/}
                                    {/*</Col>*/}
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
                                                    initialValue: "1.0",

                                                })(
                                                    <Input maxLength={5}/>
                                                )}
                                            </div>
                                        </Form.Item>
                                    </Col>

                                  {/*<Col span={12}>*/}
                                  {/*  <Form.Item label={intl.get('wsd.i18n.doc.projectdoc.commandorg')} {...formItemLayout}>*/}
                                  {/*    /!* 所属部门 *!/*/}
                                  {/*    <div className={style.list}>*/}
                                  {/*      {getFieldDecorator('orgId', {*/}
                                  {/*        initialValue: this.state.mainOrgName ? this.state.mainOrgName : null,*/}
                                  {/*        rules: [],*/}
                                  {/*      })(*/}
                                  {/*        <Input disabled maxLength={9}/>*/}
                                  {/*      )}*/}
                                  {/*    </div>*/}
                                  {/*  </Form.Item>*/}
                                  {/*</Col>*/}
                                  {/*<Col span={12}>*/}
                                  {/*  <Form.Item label={intl.get('wsd.i18n.doc.compdoc.docclassify')} {...formItemLayout}>*/}
                                  {/*    /!* 文档类别 *!/*/}
                                  {/*    <div className={style.list}>*/}
                                  {/*      {getFieldDecorator('docClassify', {*/}
                                  {/*        initialValue: formData.docClassify ? formData.docClassify.id : null,*/}
                                  {/*        rules: [],*/}
                                  {/*      })(*/}
                                  {/*        <Select onFocus={this.onFocusSelect.bind(this, 'doc.docclassify')}>*/}
                                  {/*          {*/}
                                  {/*            this.state.docclassifyData.length ? this.state.docclassifyData.map(item => {*/}
                                  {/*              return (*/}
                                  {/*                <Select.Option key={item.value} value={item.value}>{item.title}</Select.Option>*/}
                                  {/*              )*/}
                                  {/*            }) : (*/}
                                  {/*              formData.docClassify ? (*/}
                                  {/*                  <Select.Option key={formData.docClassify.id} value={formData.docClassify.id}>{formData.docClassify.name}</Select.Option>*/}
                                  {/*                ) :*/}
                                  {/*                null*/}
                                  {/*            )*/}
                                  {/*          }*/}
                                  {/*        </Select>*/}
                                  {/*      )}*/}
                                  {/*    </div>*/}
                                  {/*  </Form.Item>*/}
                                  {/*</Col>*/}
                                  {/*<Col span={12}>*/}
                                  {/*  <Form.Item label={intl.get('wsd.i18n.doc.temp.major')} {...formItemLayout}>*/}
                                  {/*    /!*文档专业*!/*/}
                                  {/*    <div className={style.list}>*/}
                                  {/*      {getFieldDecorator('profession', {*/}
                                  {/*        initialValue: formData.profession ? formData.profession.id : null,*/}
                                  {/*        rules: [],*/}
                                  {/*      })(*/}
                                  {/*        <Select onFocus={this.onFocusSelect.bind(this, 'doc.profession')}>*/}
                                  {/*          {*/}
                                  {/*            this.state.professionData.length ? this.state.professionData.map(item => {*/}
                                  {/*              return (*/}
                                  {/*                <Select.Option key={item.value} value={item.value}>{item.title}</Select.Option>*/}
                                  {/*              )*/}
                                  {/*            }) : (*/}
                                  {/*              formData.profession ? (*/}
                                  {/*                <Select.Option key={formData.profession.id} value={formData.profession.id}>{formData.profession.name}</Select.Option>*/}
                                  {/*              ) : null*/}
                                  {/*            )*/}
                                  {/*          }*/}
                                  {/*        </Select>*/}
                                  {/*      )}*/}
                                  {/*    </div>*/}
                                  {/*  </Form.Item>*/}
                                  {/*</Col>*/}



                                </Row>
                            </div>
                        </Form>

                    </div>

                    {this.state.task && <DisUser visible={this.state.task} handleCancel={this.taskHandleCancel} handleOk={this.disUserData} />}
                </Modal>

            </div >
        )
    }

}


const UploadDocs = Form.create()(UploadDoc);
export default connect(state => ({
    currentLocale: state.localeProviderData,
}))(UploadDocs);



