import React, { Component } from 'react'
import style from './style.less'
import { Form, Row, Col, Input, Button, Icon, Select, DatePicker } from 'antd';
import moment from 'moment';
import { connect } from 'react-redux'
import UploadTpl from '../../../../../components/public/TopTags/uploadTpl'
import LabelFormLayout from "../../../../../components/public/Layout/Labels/Form/LabelFormLayout"
import LabelFormButton from "../../../../../components/public/Layout/Labels/Form/LabelFormButton"
import axios from '../../../../../api/axios'
import { tmpdocInfo, tmpdocUpdate, getdictTree } from '../../../../../api/api'

const FormItem = Form.Item;

class BasicdTemplatedDocDocInfo extends Component {
  constructor(props) {
    super(props)
    this.state = {
      initDone: false,
      info: {},
      docclassifyData: [],
      secutylevelData: [],
      professionData: [],
      biztypeData: [],
      fileId: null,
      fileName: '',

    }
  }

  getData = () => {
    axios.get(tmpdocInfo(this.props.data.id)).then(res => {
      this.setState({
        info: res.data.data,
        fileId: res.data.data.fileId ? res.data.data.fileId.id : null,
        fileName: res.data.data.fileId ? res.data.data.fileId.name : null
      })
    })
  }

  componentDidMount() {
    this.getData();
  }


  handleSubmit = (e) => {
    e.preventDefault();
    const { intl } = this.props.currentLocale;
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let data = {
          ...values,
          id: this.props.data.id,
          fileId: this.state.fileId,
          creatTime: values['creatTime'] ? values['creatTime'].format('YYYY-MM-DD') : null
        }

        axios.put(tmpdocUpdate, data, true, intl.get('wsd.i18n.comcate.profdback.updatesuccessfully')).then(res => {
          this.props.updateData(res.data.data)
        })


      }
    });
  }

  //请求下拉列表
  onFocusSelect = (value) => {
    let { docclassifyData, secutylevelData, professionData, biztypeData } = this.state;
    if (docclassifyData.length && secutylevelData.length && professionData.length && biztypeData.length) {
      return;
    }
    {
      axios.get(getdictTree(value)).then(res => {
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
        } else if (value == 'base.tmpldoc.biztype') {
          this.setState({
            biztypeData: res.data.data
          })
        }
      })

    }
  }

  //上传回调
  file = (files) => {
    this.setState({
      fileId: files.response ? (files.response.data ? files.response.data.id : null) : null,
      fileName: files.response ? (files.response.data ? files.response.data.fileName : '') : ''
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

    return (
      <LabelFormLayout title={this.props.title} >
        <Form onSubmit={this.handleSubmit}>

          <Row type="flex">
            <Col span={12}>
              <Form.Item label={intl.get('wsd.i18n.doc.temp.title')} {...formItemLayout}>
                {/* 文档标题 */}
                <div className={style.list}>
                  {getFieldDecorator('docTitle', {
                    initialValue: this.state.info.docTitle,
                    rules: [{
                      required: true,
                      message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.doc.temp.title')
                    }],
                  })(
                    <Input />
                  )}
                </div>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={intl.get('wsd.i18n.doc.compdoc.docserial')} {...formItemLayout}>
                {/* 文档编号 */}
                <div className={style.list}>
                  {getFieldDecorator('docNum', {
                    initialValue: this.state.info.docNum,
                    rules: [{
                      required: true,
                      message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.doc.compdoc.docserial')
                    }],
                  })(
                    <Input />
                  )}
                </div>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={intl.get('wsd.i18n.doc.compdoc.docclassify')} {...formItemLayout}>
                {/* 文档类别 */}
                <div className={style.list}>
                  {getFieldDecorator('docClassify', {
                    initialValue: this.state.info.docClassify ? this.state.info.docClassify.id : null,
                    rules: [],
                  })(
                    <Select onFocus={this.onFocusSelect.bind(this, 'doc.docclassify')}>
                      {
                        this.state.docclassifyData.length ? this.state.docclassifyData.map(item => {
                          return (
                            <Select.Option key={item.value} value={item.value}>{item.title}</Select.Option>
                          )
                        }) : (
                            this.state.info.docClassify ? (<Select.Option key={this.state.info.docClassify.id} value={this.state.info.docClassify.id}>{this.state.info.docClassify.name}</Select.Option>) : null
                          )
                      }
                    </Select>
                  )}
                </div>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label={intl.get('wsd.i18n.sys.user1.userlevel')} {...formItemLayout}>
                {/* 密级 */}
                <div className={style.list}>
                  {getFieldDecorator('secutyLevel', {
                    initialValue: this.state.info.secutyLevel ? this.state.info.secutyLevel.id : null,
                    rules: [{
                      required: true,
                      message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.sys.user1.userlevel')
                    }],
                  })(
                    <Select onFocus={this.onFocusSelect.bind(this, 'comm.secutylevel')}>
                      {
                        this.state.secutylevelData.length ? this.state.secutylevelData.map(item => {
                          return (
                            <Select.Option key={item.value} value={item.value}>{item.title}</Select.Option>
                          )
                        }) : (
                            this.state.info.secutyLevel ? (
                              <Select.Option key={this.state.info.secutyLevel.id} value={this.state.info.secutyLevel.id}>{this.state.info.secutyLevel.name}</Select.Option>
                            ) : null
                          )
                      }
                    </Select>
                  )}
                </div>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={intl.get('wsd.i18n.doc.temp.major')} {...formItemLayout}>
                {/* 文档专业 */}
                <div className={style.list}>
                  {getFieldDecorator('profession', {
                    initialValue: this.state.info.profession ? this.state.info.profession.id : null,
                    rules: [],
                  })(
                    <Select onFocus={this.onFocusSelect.bind(this, 'doc.profession')}>
                      {
                        this.state.professionData.length ? this.state.professionData.map(item => {
                          return (
                            <Select.Option key={item.value} value={item.value}>{item.title}</Select.Option>
                          )
                        }) : (
                            this.state.info.profession ? (<Select.Option key={this.state.info.profession.id} value={this.state.info.profession.id}>{this.state.info.profession.name}</Select.Option>) : null
                          )
                      }
                    </Select>
                  )}
                </div>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={intl.get('wsd.i18n.doc.compdoc.docauthor')} {...formItemLayout}>
                {/* 文档作者 */}
                <div className={style.list}>
                  {getFieldDecorator('author', {
                    initialValue: this.state.info.author,
                    rules: [],
                  })(
                    <Input />
                  )}
                </div>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={intl.get('wsd.i18n.base.docTem.docobject')} {...formItemLayout}>
                {/* 所属业务对象 */}
                {getFieldDecorator('docObject', {
                  initialValue: this.state.info.docObject ? this.state.info.docObject.id : null,
                  rules: [],
                })(
                  <Select onFocus={this.onFocusSelect.bind(this, 'base.tmpldoc.biztype')}>
                    {
                      this.state.biztypeData.length ? this.state.biztypeData.map(item => {
                        return (
                          <Select.Option key={item.value} value={item.value}>{item.title}</Select.Option>
                        )
                      }) : (
                          this.state.info.docObject ? (
                            <Select.Option key={this.state.info.docObject.id} value={this.state.info.docObject.id}>{this.state.info.docObject.name}</Select.Option>
                          ) : null
                        )
                    }
                  </Select>
                )}
              </Form.Item>
            </Col>

            <Col span={12} className={style.disabled} >
              <Form.Item label={intl.get('wsd.i18n.plan.fileinfo.filename')} {...formItemLayout}>
                {/* 文件名称 */}
                <div className={style.list}>
                  {getFieldDecorator('fileId', {
                    initialValue: this.state.fileName,
                    rules: [],
                  })(
                    <Input disabled addonAfter={<UploadTpl isBatch={false} file={this.file} />} />
                  )}
                </div>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={intl.get('wsd.i18n.doc.temp.versions')} {...formItemLayout}>
                {/* 版本 */}
                <div className={style.list}>
                  {getFieldDecorator('docVersion', {
                    initialValue: this.state.info.docVersion,
                    rules: [{
                      required: true,
                      message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.doc.temp.versions')
                    }],
                  })(
                    <Input />
                  )}
                </div>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label={intl.get('wsd.i18n.base.docTem.creator')} {...formItemLayout}>
                {getFieldDecorator('creator', {
                  initialValue: this.state.info.creator ? this.state.info.creator.name : '',
                  rules: [],
                })(
                  <Input disabled />
                )}
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label={intl.get('wsd.i18n.base.docTem.creattime')} {...formItemLayout}>
                {getFieldDecorator('creatTime', {
                  initialValue: this.state.info.creatTime ? moment(this.state.info.creatTime) : null,
                  rules: [],
                })(
                  <DatePicker style={{ "width": "100%" }} disabled />
                )}
              </Form.Item>
            </Col>

          </Row>
        </Form>
        <LabelFormButton>
          {/* 取消 */}
          <Button onClick={this.props.closeRightBox} style={{ width: "100px", marginRight: "20px" }}> {intl.get('wsd.global.btn.cancel')} </Button>
          {/* 保存 */}
          <Button onClick={this.handleSubmit} style={{ width: "100px" }} type="primary"> {intl.get('wsd.global.btn.preservation')} </Button>
        </LabelFormButton>
      </LabelFormLayout>

    )
  }
}

const BasicdTemplatedDocDocInfos = Form.create()(BasicdTemplatedDocDocInfo);
export default connect(state => ({
  currentLocale: state.localeProviderData
}))(BasicdTemplatedDocDocInfos)