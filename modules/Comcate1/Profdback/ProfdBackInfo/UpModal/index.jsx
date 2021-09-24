import React, { Component } from 'react'
import style from './style.less'
import { Form, Row, Col, Input, Button, Icon, Select, DatePicker, Modal, Table, message, Upload, TreeSelect } from 'antd';
import intl from 'react-intl-universal'
import { connect } from 'react-redux'
import UploadTpl from '../../../../../components/public/TopTags/uploadTpl'
import { orgTree, defineOrgUserList } from '../../../../../api/api'
import { submitToNextUser, submitToQueCreator, rejectQueHandle, confirmQueHandle } from '../../../../../api/suzhou-api'
import axios from '../../../../../api/axios'
import MyIcon from '../../../../../components/public/TopTags/MyIcon';
import * as dataUtil from "../../../../../utils/dataUtil"
const locales = {
  "en-US": require('../../../../../api/language/en-US.json'),
  "zh-CN": require('../../../../../api/language/zh-CN.json')
}
const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;
class EditModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      initDone: false,
      visible: true,
      info: {
        fileName: 1,
        fileVersion: 1,
        creatTime: null,
        creator: 1,
        remark: 1,
      },
      data: [],
      fileList: [],
      orgTree: [],
      orgUserList: [props.rightData ? {id:props.rightData.creator.id,title:props.rightData.creator.name} : ''],
    }
  }

  componentDidMount() {
    let loginUser = JSON.parse(sessionStorage.getItem('userInfo'));
    
    this.setState({
      width: this.props.width,
      loginUser,
    })
  }


  treeSelect = () => {
    if (this.state.orgTree.length !== 0) {
      return;
    }
    axios.get(orgTree, {}, null, null, false).then(res => {
      if (res.data.data) {
        this.setState({
          orgTree: res.data.data
        })
      }
    })
  }

  treeSelectChange = (val) => {

    this.props.form.setFieldsValue({ ["userId"]: null });
    if (val) {
      axios.get(defineOrgUserList(val), {}, null, null, false).then(res => {
        this.setState({
          orgUserList: res.data.data
        })
      })
    } else {
      this.setState({
        orgUserList: []
      })
    }
  }

  //关闭弹窗
  handleCancel = (e) => {
    this.props.handleCancel()
  }



  handleSubmit = (val, e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (val == 'submit') {
          let nextUserId = values['nextUserId']
          axios.post(nextUserId ? submitToNextUser(nextUserId, this.props.record.id) : submitToQueCreator(this.props.record.id), null, true, '操作成功', true).then(res => {
            this.handleCancel();
            this.props.setSubmitAuth();
            this.props.refreshData();
          })
        } else if (val == 'cancle') {
          this.handleCancel();
        } else if (val == 'confirm' || val == 'reject') {
          let fileIds = [];
          let { fileList } = this.state;
          if (fileList.length) {
            for (let i = 0; i < fileList.length; i++) {
              fileIds.push(fileList[i].id)
            }
          }
          if (val == 'reject') {
            let nextUserId = this.props.rightData.user.id
            values['nextUserId'] = nextUserId
          }
          if(val == 'confirm' && !values['nextUserId']){
            values['nextUserId'] = this.props.rightData.creator.id
          }
          let body = {
            ...values,
            handledId: this.props.latestHandleId,
            fileIds
          }
          axios.post(val == 'confirm' ? confirmQueHandle : rejectQueHandle, body, true, '操作成功', true).then(res => {
            this.handleCancel();
            this.props.setSubmitAuth();
            this.props.refreshData();
            if(res.data.data){
              this.props.updateData(res.data.data)
            }
          })
        }
      }
    });
  }

  //上传回调
  file = (files) => {
    let { fileList } = this.state;
    if (files.response && files.response.data) {
      let file = files.response.data;
      let name = file.fileName.split('.')[0];
      let type = file.fileName.split('.')[1];
      let obj = {
        id: file.id,
        name,
        type
      }
      fileList.push(obj)
    }
    this.setState({
      fileList,
    })
  }

  //上传列表控制
  operateClick = (record) => {
    let { fileList } = this.state;
    let index = fileList.findIndex(item => item.id == record.id);
    fileList.splice(index, 1);
    this.setState({
      fileList
    })
  }

  render() {
    let formData = {}
    const { intl } = this.props.currentLocale;
    const {
      getFieldDecorator, getFieldsError, getFieldError, isFieldTouched,
    } = this.props.form;
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
    const formItemLayout1 = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
    };
    const columns = [
      {
        title: intl.get('wsd.i18n.plan.fileinfo.filename'),
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: intl.get('wsd.i18n.plan.fileinfo.filetype'),
        dataIndex: 'type',
        key: 'type',
      },
      {
        title: "",
        dataIndex: 'operate',
        key: 'operate',
        render: (text, record) => <MyIcon type='icon-exit' onClick={this.operateClick.bind(this, record)} />
      }
    ]
    return (
      <div >
        <Modal title={"提交"} visible={this.props.visible}
          onCancel={this.handleCancel}
          mask={false} maskClosable={false}
          width="800px"
          footer={this.props.handleEditAuth ?
            <div className="modalbtn">
              {/* 提交 */}
              <Button key={1} onClick={this.handleSubmit.bind(this, 'submit')} type="primary">{'提交'}</Button>
              {/* 取消 */}
              <Button key={2} onClick={this.handleSubmit.bind(this, 'cancle')} >{'取消'}</Button>
            </div> :
            <div className="modalbtn">
              {/* 确认 */}
              <Button key={1} onClick={this.handleSubmit.bind(this, 'confirm')} type="primary">{'确认'}</Button>
              {/* 驳回 */}
              <Button key={2} onClick={this.handleSubmit.bind(this, 'reject')} type="primary">{'驳回'}</Button>
            </div>
          }
        >
          <div className={style.main}>
            <Form onSubmit={this.handleSubmit}>
              <div className={style.content}>
                {!this.props.iscreatorAuth &&(
                  <Row >
                  <Col span={12}>
                    <Form.Item label={intl.get('wsd.i18n.plan.plandefine.orgname')} {...formItemLayout}>
                      <div className={style.list}>
                        {getFieldDecorator('orgId', {
                          initialValue:'',
                          rules: [{
                          }],
                        })(
                          <TreeSelect
                            allowClear
                            showSearch
                            treeNodeFilterProp="title"
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                            treeData={this.state.orgTree}
                            placeholder="请选择"
                            treeDefaultExpandAll
                            onFocus={this.treeSelect}
                            onChange={this.treeSelectChange}
                          />
                        )}
                      </div>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label={intl.get('wsd.i18n.plan.plandefine.username')} {...formItemLayout}>
                      <div className={style.list}>
                        {getFieldDecorator('nextUserId', {
                          initialValue: this.props.rightData.creator ? this.props.rightData.creator.id : '',
                          rules: [
                            {required: true,
                            message: intl.get('wsd.i18n.plan.plandefine.username') + intl.get('wsd.i18n.plan.plandefine.username')}
                          ],
                        })(
                          <Select
                            allowClear
                            showSearch
                            optionFilterProp="children"
                            filterOption={(input, option) => option.props.children[1].toLowerCase().indexOf(input.toLowerCase()) >= 0}
                          >
                            {this.state.orgUserList.map(item => {
                              return (
                                <Option key={item.id} value={item.id}> {item.title} </Option>
                              )
                            })}
                          </Select>
                        )}
                      </div>
                    </Form.Item>
                  </Col>
                </Row>
                )}
                {!this.props.handleEditAuth && (
                  <Row>
                    <Col span={24}>
                      <Form.Item label={intl.get('wsd.i18n.comu.profdback.processingresultdescription')} {...formItemLayout1}>
                        {/* 处理结果说明 */}
                        {getFieldDecorator('desc', {
                          // initialValue: this.state.info.remark,
                          rules: [{}],
                        })(
                          <TextArea maxLength={666} rows={5} cols={10} />
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                )}
              </div>
            </Form>
            {!this.props.handleEditAuth && (
              <div className={style.Modifytable}>
                <div className={style.tip}>
                  <div className={style.upload}>
                    <UploadTpl isBatch={true} file={this.file} />
                  </div>
                </div>
                <Table rowKey={record => record.id} columns={columns} dataSource={this.state.fileList} pagination={false} name={this.props.name} />
              </div>
            )}
          </div>
        </Modal>
      </div>
    )
  }
}
const EditModals = Form.create()(EditModal);
export default connect(state => ({
  currentLocale: state.localeProviderData
}))(EditModals)
