import React, { Component } from 'react';
import { Modal, Button, Row, Col, Input, Icon, Select, Form, TreeSelect } from 'antd';
import style from './style.less';
import { connect } from 'react-redux';
import { curdCurrentData } from '../../../../store/curdData/action';
import UploadTask from '../UploadTask/index';
import UploadTpl from '../../../../components/public/TopTags/uploadTpl';
import MyIcon from '../../../../components/public/TopTags/MyIcon';
import axios from '../../../../api/axios';
import { getdictTree, docOrgSel, docProjectAdd } from '../../../../api/api';
import * as dataUtil from '../../../../utils/dataUtil';
import { getsectionId } from '@/api/suzhou-api';
import { docAddSzxm } from '@/modules/Suzhou/api/suzhou-api';

class UploadDoc extends Component {
  state = {
    initDone: false,
    modalInfo: {
      title: '上传文档',
    },
    inputValue: 0,
    task: false,
    taskData: {},
    fileId: null,
    fileName: '',
    orgSelData: [],
    docclassifyData: [],
    professionData: [],
    secutylevelData: [],
    treeData: [],
  };

  componentDidMount() {
    const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
    this.setState({
      actuName: userInfo.actuName,
    });
    this.curentTime();
  }

  getSectionIdTree = () => {
    // 选择标段
    axios.get(getsectionId(this.props.projectId)).then(res => {
      const { data } = res.data;
      this.setState(() => ({ treeData: this.treeFunMap(data) }));
    });
  };
  treeFunMap = arr => {
      if(arr){
        for (let i = 0; i < arr.length; i++) {
            arr[i].title = arr[i].name;
            arr[i].value = arr[i].id;
            if (arr[i].children) {
              this.treeFunMap(arr[i].children);
            }
          }
      }
    return arr;
  };
  handleSubmit = (val, e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, fieldsValue) => {
      if (!err) {
        const values = {
          ...fieldsValue,
          fileId: this.state.fileId,
          folderId: 'folder' == this.props.data.type ? this.props.data.id : 0,
          projectId: this.props.projectId,
          bizId: fieldsValue['bizId']
            ? this.state.taskData.id
              ? this.state.taskData.id
              : null
            : '',
          bizType: this.props.bizType,
          secutyLevel:1
        };

        const { startContent } = this.props;
        let url = dataUtil.spliceUrlParams(docAddSzxm, { startContent });
        axios.post(url, values, true, '上传成功', true).then(res => {
          this.props.addData(res.data.data);
          if (val == 'save') {
            // 清空表单项
            this.props.form.resetFields();
            this.setState({
              fileId: null,
              fileName: '',
              taskData: {},
            });
            // 关闭弹窗
            this.props.handleCancel('UploadVisible');
          } else {
            // 清空表单项
            this.props.form.resetFields();
            this.setState({
              fileId: null,
              fileName: '',
              taskData: {},
            });
          }
        });
      }
    });
  };

  taskHandleCancel = () => {
    this.setState({
      task: false,
    });
  };
  click() {
    this.setState({ task: true });
  }
  handleCancel() {
    this.props.handleCancel('UploadVisible');
  }

  //上传回调
  /*file = files => {
    this.setState({
      fileId: files.response ? (files.response.data ? files.response.data.id : null) : null,
      fileName: files.response ? (files.response.data ? files.response.data.fileName : '') : '',
    });
    this.props.form.resetFields('fileId', [
      files.response ? (files.response.data ? files.response.data.fileName : '') : '',
    ]);
  };*/

  //上传回调
  file = (files) => {
    this.setState({
      fileId: files.response ? (files.response.data ? files.response.data.id : null) : null,
      fileName: files.response ? (files.response.data ? files.response.data.fileName : '') : ''
    })
    this.props.form.resetFields('fileId', [files.response ? (files.response.data ? files.response.data.fileName : '') : ''])

    this.props.form.setFieldsValue({ docTitle: files.response ? (files.response.data ? files.response.data.fileName : '') : '' })
  }


  //任务选择回调
  taskData = task => {
    let obj = {
      id: task.id,
      name: task.name,
    };
    this.setState({
      taskData: obj,
    });
  };
  //请求下拉列表
  onFocusSelect = value => {
    let { orgSelData, docclassifyData, secutylevelData, professionData } = this.state;

    if (
      (orgSelData.length != 0 && value == 'org') ||
      (docclassifyData.length != 0 && value == 'doc.docclassify') ||
      (secutylevelData.length != 0 && value == 'comm.secutylevel') ||
      (professionData.length != 0 && value == 'doc.profession')
    ) {
      return;
    }

    if (value == 'org') {
      axios.get(docOrgSel(this.props.projectId)).then(res => {
        if (res.data.data) {
          this.setState({
            orgSelData: res.data.data,
          });
        }
      });
    }
    axios.get(getdictTree(value)).then(res => {
      if (!res.data.data) {
        return;
      }
      if (value == 'doc.docclassify') {
        this.setState({
          docclassifyData: res.data.data,
        });
      } else if (value == 'comm.secutylevel') {
        this.setState({
          secutylevelData: res.data.data,
        });
      } else if (value == 'doc.profession') {
        this.setState({
          professionData: res.data.data,
        });
      }
    });
  };

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
    let formData = {};

    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
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
          mask={false}
          maskClosable={false}
          footer={
            <div className="modalbtn">
              {/* 保存并继续 */}
              <Button key="saveAndSubmit" onClick={this.handleSubmit.bind(this, 'goOn')}>
                {' '}
                {intl.get('wsd.global.btn.saveandcontinue')}{' '}
              </Button>
              {/* 保存 */}
              <Button key="b" type="primary" onClick={this.handleSubmit.bind(this, 'save')}>
                {' '}
                {intl.get('wsd.global.btn.preservation')}{' '}
              </Button>
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
                        <Form.Item label={intl.get("wsd.i18n.plan.fileinfo.filename")} {...formItemLayout}>

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
                        <Form.Item label={intl.get("wsd.i18n.plan.fileinfo.filename")} {...formItemLayout}>

                          {/* 文件名称 */}
                          <div className={style.list}>
                            {getFieldDecorator('fileId', {
                              initialValue: this.state.fileName,
                              rules: [{
                                required: true,
                                message: intl.get('wsd.i18n.message.select') + intl.get('wsd.i18n.plan.fileinfo.filename')
                              }],
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
                    <Form.Item
                      label={intl.get('wsd.i18n.doc.compdoc.docauthor')}
                      {...formItemLayout}
                    >
                      {/* 文档作者 */}
                      <div className={style.list}>
                        {getFieldDecorator('author', {
                          initialValue: this.state.actuName,
                          rules: [],
                        })(<Input />)}
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
                {/*  <Col span={12}>*/}
                {/*    <Form.Item label={intl.get('wsd.i18n.doc.compdoc.docclassify')} {...formItemLayout}>*/}
                {/*      /!* 文档类别 *!/*/}
                {/*      <div className={style.list}>*/}
                {/*        {getFieldDecorator('docClassify', {*/}
                {/*          initialValue: formData.docClassify ? formData.docClassify.id : null,*/}
                {/*          rules: [],*/}
                {/*        })(*/}
                {/*          <Select onFocus={this.onFocusSelect.bind(this, 'doc.docclassify')}>*/}
                {/*            {*/}
                {/*              this.state.docclassifyData.length ? this.state.docclassifyData.map(item => {*/}
                {/*                return (*/}
                {/*                  <Select.Option key={item.value} value={item.value}>{item.title}</Select.Option>*/}
                {/*                )*/}
                {/*              }) : (*/}
                {/*                formData.docClassify ? (*/}
                {/*                    <Select.Option key={formData.docClassify.id} value={formData.docClassify.id}>{formData.docClassify.name}</Select.Option>*/}
                {/*                  ) :*/}
                {/*                  null*/}
                {/*              )*/}
                {/*            }*/}
                {/*          </Select>*/}
                {/*        )}*/}
                {/*      </div>*/}
                {/*    </Form.Item>*/}
                {/*  </Col>*/}


                {/*  <Col span={12}>*/}
                {/*    <Form.Item label={intl.get('wsd.i18n.doc.temp.major')} {...formItemLayout}>*/}
                {/*      /!*文档专业*!/*/}
                {/*      <div className={style.list}>*/}
                {/*        {getFieldDecorator('profession', {*/}
                {/*          initialValue: formData.profession ? formData.profession.id : null,*/}
                {/*          rules: [],*/}
                {/*        })(*/}
                {/*          <Select onFocus={this.onFocusSelect.bind(this, 'doc.profession')}>*/}
                {/*            {*/}
                {/*              this.state.professionData.length ? this.state.professionData.map(item => {*/}
                {/*                return (*/}
                {/*                  <Select.Option key={item.value} value={item.value}>{item.title}</Select.Option>*/}
                {/*                )*/}
                {/*              }) : (*/}
                {/*                formData.profession ? (*/}
                {/*                  <Select.Option key={formData.profession.id} value={formData.profession.id}>{formData.profession.name}</Select.Option>*/}
                {/*                ) : null*/}
                {/*              )*/}
                {/*            }*/}
                {/*          </Select>*/}
                {/*        )}*/}
                {/*      </div>*/}
                {/*    </Form.Item>*/}
                {/*  </Col>*/}
                </Row>
                <Row>
                  <Col span={12}>
                    <Form.Item
                      label={intl.get('wsd.i18n.doc.projectdoc.commandorg')}
                      {...formItemLayout}
                    >
                      {/* 所属部门 */}
                      <div className={style.list}>
                        {getFieldDecorator('orgId', {
                          initialValue: formData.department,
                          rules: [],
                        })(
                          <TreeSelect
                            onFocus={this.onFocusSelect.bind(this, 'org')}
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                            treeData={this.state.orgSelData}
                            treeDefaultExpandAll
                          />
                        )}
                      </div>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="所属标段" {...formItemLayout}>
                      {getFieldDecorator('sectionId', {
                        rules: [
                          {
                            required: true,
                            message: '请选择标段',
                          },
                        ],
                      })(
                        <TreeSelect
                          dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                          allowClear
                          placeholder="请选择标段"
                          onFocus={this.getSectionIdTree}
                          // onChange={this.onChange}
                          treeData={this.state.treeData}
                        />
                      )}
                    </Form.Item>
                  </Col>
                </Row>
              </div>
            </Form>
          </div>

          {this.state.task && (
            <UploadTask
              modalVisible={this.state.task}
              handleCancel={this.taskHandleCancel}
              projectId={this.props.projectId}
              taskData={this.taskData}
            />
          )}
        </Modal>
      </div>
    );
  }
}

const UploadDocs = Form.create()(UploadDoc);
export default connect(state => ({
  currentLocale: state.localeProviderData,
}))(UploadDocs);
