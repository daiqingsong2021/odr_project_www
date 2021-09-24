import React, {Component} from 'react'
import style from './style.less'
import {Form, Row, Col, Input, Button, Checkbox, Select, DatePicker, InputNumber} from 'antd';
import * as dateUtil from '../../../../utils/dataUtil'
import {connect} from 'react-redux'
import axios from '../../../../api/axios'
import {getdictTree, getCustomFiledInfo, updatecustomForm, defineOrgTree, dictTypeList, getDigitDirBoList} from '../../../../api/api'
const { Option, OptGroup } = Select;
const {TextArea} = Input;
const FormItem = Form.Item;

class MenuInfo extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dictTypeRequired: false,
      info: {},
    }
  }

  componentDidMount() {
    axios.get(getCustomFiledInfo(this.props.tableName, this.props.rightData.fieldName)).then(res => {
      if (res.data.data) {
        this.setState({
          dictTypeRequired : res.data.data.formType ? "TreeSelect,Select,Checkbox,Radio".indexOf(res.data.data.formType.id) >= 0 : false,
          info: res.data.data
        })
      }
    })
  }

  //获取数据类型
  getDataTypeList = () => {
    if (!this.state.dataTypeList) {
      axios.get(getdictTree("base.custom.data.type")).then(res => {
        if (res.data.data) {
          this.setState({
            dataTypeList: res.data.data
          })
        }
      })
    }
  }

  //获取表单类型
  getFormTypeList = () => {
    if (!this.state.formTypeList) {
      axios.get(getdictTree("base.custom.form.type")).then(res => {
        if (res.data.data) {
          this.setState({
            formTypeList: res.data.data
          })
        }
      })
    }
  }

  changeFormTypeList = (v) => {
    let required = "TreeSelect,Select,Checkbox,Radio".indexOf(v) >= 0;
    if (required != this.state.dictTypeRequired) {
      this.setState({
        dictTypeRequired: required
      })
    }
  }

  getDictTypeList = () => {
    if (!this.state.boList) {
      axios.get(getDigitDirBoList).then(res => {
        const boList = res.data.data
        axios.get(dictTypeList).then(res => {
          const data = res.data.data
          this.setState({
            boList : boList,
            dictTypeList: data,
          })
        })
      })
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let obj = {
          ...values,
          required: values.required ? 1 : 0,
          enable: values.enable ? 1 : 0,
          tableName: this.props.tableName,
        }
        axios.post(updatecustomForm, obj, true, null, true).then(res => {
          this.props.update(res.data.data)
        })
      }
    });
  }

  render() {
    const {intl} = this.props.currentLocale
    const {
      getFieldDecorator, getFieldsError, getFieldError, isFieldTouched,
    } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 8},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 16},
      },
    };
    const formItemLayout1 = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 4},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 20},
      },
    };
    return (
      <div className={style.main}>
        <div className={style.mainHeight}>
          <h3 className={style.listTitle}>基本信息</h3>
          <div className={style.mainScorll}>
            <Form onSubmit={this.handleSubmit}>
              <div className={style.content}>
                <Row type="flex">
                  <Col span={12}>
                    <Form.Item label="字段名" {...formItemLayout}>
                      {getFieldDecorator('fieldName', {
                        initialValue: this.state.info.fieldName,
                        rules: [{
                          required: true,
                          message: intl.get('wsd.i18n.message.enter') + "字段名",
                        }],
                      })(
                        <Input disabled={true}/>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="显示名称" {...formItemLayout}>
                      {getFieldDecorator('title', {
                        initialValue: this.state.info.title,
                        rules: [{
                          required: true,
                          message: intl.get('wsd.i18n.message.enter') + "显示名称",
                        }],
                      })(
                        <Input maxLength={33}/>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="数据类型" {...formItemLayout}>
                      {getFieldDecorator('dataType', {
                        initialValue: this.state.info.dataType ? this.state.info.dataType.id : null,
                        rules: [{
                          required: true,
                          message: intl.get('wsd.i18n.message.enter') + "数据类型",
                        }],
                      })(
                        <Select onFocus={this.getDataTypeList}>
                          {
                            this.state.dataTypeList ? this.state.dataTypeList.map((v, i) => {
                              return <Option value={v.value} key={i}>{v.title}</Option>
                            }) : this.state.info.dataType && <Option value={this.state.info.dataType.id}>{this.state.info.dataType.name}</Option>
                          }
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="国际化" {...formItemLayout}>
                      {getFieldDecorator('i18nCode', {
                        initialValue: this.state.info.i18nCode,
                        rules: [{
                          required: false,
                          message: intl.get('wsd.i18n.message.enter') + "国际化",
                        }],
                      })(
                        <Input maxLength={50}/>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="表单类型" {...formItemLayout}>
                      {getFieldDecorator('formType', {
                        initialValue: this.state.info.formType ? this.state.info.formType.id : null,
                        rules: [{
                          required: true,
                          message: intl.get('wsd.i18n.message.enter') + "表单类型",
                        }],
                      })(
                        <Select onFocus={this.getFormTypeList} onChange={this.changeFormTypeList}>
                          {
                            this.state.formTypeList ? this.state.formTypeList.map((v, i) => {
                              return <Option value={v.value} key={i}>{v.title}</Option>
                            }) : this.state.info.formType && <Option value={this.state.info.formType.id}>{this.state.info.formType.name}</Option>
                          }
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="格式化字符串" {...formItemLayout}>
                      {getFieldDecorator('formatter', {
                        initialValue: this.state.info.creatTime,
                        rules: [],
                      })(
                        <Input maxLength={33}/>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="字典类型" {...formItemLayout}>
                      {getFieldDecorator('dictType', {
                        initialValue: this.state.info.dictType ? this.state.info.dictType.id : null,
                        rules: [{
                          required: this.state.dictTypeRequired,
                          message: intl.get('wsd.i18n.message.enter') + "表单类型",
                        }],
                      })(
                        <Select onFocus={this.getDictTypeList}>
                          {
                            this.state.boList ? this.state.boList.map((g, j) => {
                              return(<OptGroup label={g.boName}>
                                {
                                  this.state.dictTypeList.map((v, i) => {
                                    return g.boCode == v.boCode && <Option value={v.typeCode} key={i}>{v.typeName}</Option>
                                  })
                                }
                              </OptGroup>)
                            }) : this.state.info.dictType && <Option value={this.state.info.dictType.id}>{this.state.info.dictType.name}</Option>
                          }
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="必填" {...formItemLayout}>
                      {getFieldDecorator('required', {
                        valuePropName: 'checked',
                        initialValue: this.state.info.required ? true : false,
                        rules: [],
                      })(
                        <Checkbox/>,
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="最大长度" {...formItemLayout}>
                      {getFieldDecorator('maxLength', {
                        initialValue: this.state.info.maxLength,
                        rules: [],
                      })(
                        <InputNumber style={{width: "100%"}} max={100} min={0} precision={0} step={1}/>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="精度" {...formItemLayout}>
                      {getFieldDecorator('precision', {
                        initialValue: this.state.info.precision,
                        rules: [],
                      })(
                        <InputNumber style={{width: "100%"}} max={6} min={0} precision={0} step={1}/>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="横跨的列数" {...formItemLayout}>
                      {getFieldDecorator('colspan', {
                        initialValue: this.state.info.colspan,
                        rules: [],
                      })(
                        <InputNumber style={{width: "100%"}} max={2} min={1} precision={0} step={1}/>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="横跨的行数" {...formItemLayout}>
                      {getFieldDecorator('rowspan', {
                        initialValue: this.state.info.rowspan,
                        rules: [],
                      })(
                        <InputNumber style={{width: "100%"}} max={50} min={1} step={0} precision={0}/>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="排序号" {...formItemLayout}>
                      {getFieldDecorator('sort', {
                        initialValue: this.state.info.sort,
                        rules: [],
                      })(
                        <InputNumber style={{width: "100%"}} max={2000000000} precision={0} step={0}/>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="启用" {...formItemLayout}>
                      {getFieldDecorator('enable', {
                        valuePropName: 'checked',
                        initialValue: this.state.info.enable ? true : false,
                        rules: [],
                      })(
                        <Checkbox/>,
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <Form.Item label="备注" {...formItemLayout1}>
                      {getFieldDecorator('remark', {
                        initialValue: this.state.info.remark,
                      })(
                        <TextArea rows={4} maxLength={160}/>,
                      )}
                    </Form.Item>
                  </Col>
                </Row>
              </div>
            </Form>
          </div>
          <div className={style.mybtn}>
            <Row>
              <Col span={24}>
                <Col offset={4}>
                  <Button onClick={this.props.closeRightBox} style={{width: "100px", marginRight: "20px"}}>取消</Button>
                  <Button onClick={this.handleSubmit} style={{width: "100px"}} type="primary">保存</Button>
                </Col>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    )
  }
}

const MenuInfos = Form.create()(MenuInfo);
export default connect(state => ({
  currentLocale: state.localeProviderData
}), {})(MenuInfos);
