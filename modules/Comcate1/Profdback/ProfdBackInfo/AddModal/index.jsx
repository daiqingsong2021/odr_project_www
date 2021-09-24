import React, { Component } from 'react'
import style from './style.less'
import { Form, Row, Col, Input, Button, Icon, Select, DatePicker, Modal, Table, message, Upload } from 'antd';
import intl from 'react-intl-universal'
import { connect } from 'react-redux'
import UploadTpl from '../../../../../components/public/TopTags/uploadTpl'
import {questionHandleAdd} from '../../../../../api/suzhou-api'
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
      data: [
        // {
        //   key: "[0]",
        //   id: "1",
        //   fileName: "需求计划",
        //   fileType: "word",
        //   oprate: <Icon type="close" />
        // }, {
        //   key: "[1]",
        //   id: "2",
        //   fileName: "需求计划",
        //   fileType: "word",
        //   operate: <Icon type="close" />
        // }
      ],
      fileList: [],
    }
  }

  componentDidMount() {
    let loginUser = JSON.parse(sessionStorage.getItem('userInfo'));
    this.setState({
      width: this.props.width,
      loginUser,
    })
  }



  handleCancel = (e) => {

    this.props.handleCancel()
  }
  handleSubmit = (val, e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let fileIds = [];
        let { fileList } = this.state;
        if (fileList.length) {
          for (let i = 0; i < fileList.length; i++) {
            fileIds.push(fileList[i].id)
          }
        }
        let body = {
          ...values,
          handleTime:dataUtil.Dates().formatTimeString(values.handleTime),
          questionId: this.props.data.id,
          projectId:this.props.projectId,
          fileIds
        }

        let {startContent} = this.props.extInfo  || {};
        let url = dataUtil.spliceUrlParams(questionHandleAdd,{startContent});

        axios.post(url, body, true, '新增成功',true).then(res => {
          this.props.addData(res.data.data)
          if (val == 'save') {
            this.handleCancel();
            this.setState({
              fileList: []
            })
            this.props.refreshData()
          } else {
            this.props.form.resetFields();
            this.setState({
              fileList: []
            })
          }

        })

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
        <Modal title={intl.get('wsd.i18n.comu.profdback.newlyincreased')} visible={this.props.visible}
          onCancel={this.handleCancel}
          mask={false} maskClosable={false}
          width="800px"
          footer={
            <div className="modalbtn">
              {/* 保存并继续 */}
              <Button key={1} onClick={this.handleSubmit.bind(this, 'goOn')}>{intl.get('wsd.global.btn.saveandcontinue')}</Button>
              {/* 保存 */}
              <Button key={2} onClick={this.handleSubmit.bind(this, 'save')} type="primary">{intl.get('wsd.global.btn.preservation')}</Button>
            </div>
          }
        >
          <div className={style.main}>
            <Form onSubmit={this.handleSubmit}>
              <div className={style.content}>

                <Row >
                  <Col span={12}>
                    <Form.Item label={intl.get('wsd.i18n.comu.profdback.handlingtime')} {...formItemLayout}>
                      {/* 处理时间 */}
                      {getFieldDecorator('handleTime', {
                        // initialValue: this.state.info.creatTime,
                        rules: [{
                          required: true,
                          message: intl.get("wsd.i18n.message.enter") + intl.get('wsd.i18n.comu.profdback.handlingtime')
                        }],
                      })(
                        <DatePicker style={{ width: "100%" }} />
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label={intl.get('wsd.i18n.comu.profdback.conductor')} {...formItemLayout}>
                      {/* 处理人 */}
                      {getFieldDecorator('handleUser', {
                        initialValue: this.state.loginUser ? this.state.loginUser.actuName : "",
                        rules: [],
                      })(
                        <Input maxLength={33}/>
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <Form.Item label={intl.get('wsd.i18n.comu.profdback.processingresultdescription')} {...formItemLayout1}>
                      {/* 处理结果说明 */}
                      {getFieldDecorator('handleResult', {
                        // initialValue: this.state.info.remark,
                        rules: [{
                          required: true,
                          message: intl.get("wsd.i18n.message.enter") + intl.get('wsd.i18n.comu.profdback.processingresultdescription')
                        }],
                      })(
                        <TextArea maxLength={666} rows={5} cols={10} />
                      )}
                    </Form.Item>
                  </Col>
                </Row>

              </div>

            </Form>
            <div className={style.Modifytable}>
              <div className={style.tip}>
                <div className={style.upload}>
                  <UploadTpl isBatch={true} file={this.file} />
                </div>
              </div>
              <Table rowKey={record => record.id} columns={columns} dataSource={this.state.fileList} pagination={false} name={this.props.name} />
            </div>
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
