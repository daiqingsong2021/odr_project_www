import React, { Component } from 'react';
import style from './style.less';
import { connect } from 'react-redux';
import {
  Form,
  Row,
  Col,
  Input,
  Button,
  Icon,
  Select,
  DatePicker,
  Modal,
  message,
  Switch,
} from 'antd';
import intl from 'react-intl-universal';
import axios from '../../../../../api/axios';
import { addCoderulebo, updateCoderulebo, checkTableName, findTableFileds, getCoderuleboInfo } from '../../../../../api/api';


const FormItem = Form.Item;
const { TextArea } = Input;
const Option = Select.Option;
export class AddBusinessObject extends Component {
  constructor(props) {
    super(props);
    this.state = {

      info: {},
      tableArray: null//表名
    };
  }
  initTableName = (e) => {
    if (!this.state.tableArray) {
      axios.get(checkTableName).then(res => {
        if(res.data.data){
          this.setState({
            tableArray: res.data.data,
            tableArray1:null
          })
        }
     
      })
    }

  }
  componentDidMount() {
    const { type, data } = this.props

    if (type == "add") {
      this.setState({
        info: {}
      })
      return
    }
    if (type == "modify") {
      axios.get(getCoderuleboInfo(data.id)).then(res1 => {
        this.setState({
          info: res1.data.data
        }, () => {
          const { info } = this.state
          this.setState({
           
            tableArray1: info.tableName ? [info.tableName] : null,
           
          })
          if(info.tableName){
            this.getTableField(info.tableName.id)
          }
        })

       
      })

    }

  }

  //搜索被分配字段
  searchAssignColumnName=(value)=>{
    const {tableField}=this.state
    let array=[]
    tableField.forEach(v=>{
      let flag=v.title.toLowerCase().indexOf(value.toLowerCase())
      if(flag>-1){
        array.push(v)
      }
    })
    this.setState({
      tableField3:array
    })
  }
  //获取字段
  getTableField=(v)=>{
   
    // const {info}=this.state
    // if(!v){
    //   v=info.tableName.id
    //   if(this.state.tableField){
    //     return 
    //   }
    // }
    axios.get(findTableFileds(v)).then(res => {
      if(res.data.data){
        this.setState({
          tableField: res.data.data,
          tableField1: res.data.data,
          tableField2: res.data.data,
          tableField3: res.data.data,
        })
      }
     
    })
  }
  onchangeTable = (v) => {
    this.props.form.setFieldsValue({ codeColumnName: null })
    this.props.form.setFieldsValue({ seqScope: null })
    this.props.form.setFieldsValue({ assignColumnName: null })
    this.getTableField(v)
  }
  handleSubmit = e => {
    e.preventDefault();
    const { type, data } = this.props
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        //新增
        if (type == "add") {
          let info = {
            // ...data,
            ...values
          }
          axios.post(addCoderulebo, info, true).then(res => {
            this.props.addCoderulebo(res.data.data)
            this.props.form.resetFields();
            this.props.handleCancel()
          })
          return
        }
        //修改
        if (type == "modify") {
          let info = {
            ...data,
            ...values
          }
          axios.put(updateCoderulebo, info, true).then(res => {
            this.props.updateCoderulebo(res.data.data)
            this.props.handleCancel()
          })
        }
      }
    });
  };

  render() {
    const { intl } = this.props.currentLocale
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

    return (
      <div className={style.main}>
        {/* <h2>{intl.get('wbs.add.name')}</h2>*/}
        <Modal
          className={style.formMain}
          width="850px"
          mask={false}
          maskClosable={false}
          centered={true}
          title={this.props.title}
          visible={true}
          onCancel={this.props.handleCancel}
          footer={
            <div className="modalbtn">
              {this.props.type == "add" &&
                <div>
                  <Button key="submit1" onClick={this.handleSubmit}>
                    {intl.get("wsd.global.btn.saveandcontinue")}
                  </Button>
                  <Button key="submit2" type="primary" onClick={this.handleSubmit}>
                    {intl.get("wsd.global.btn.preservation")}
                  </Button>
                </div>
              }
              {this.props.type == "modify" &&
                <div>
                  <Button key="submit1" onClick={this.props.handleCancel}>
                    {intl.get("wsd.global.btn.cancel")}
                  </Button>
                  <Button key="submit2" type="primary" onClick={this.handleSubmit}>
                    {intl.get("wsd.global.btn.preservation")}
                  </Button>
                </div>
              }
            </div>
          }
        >
          <Form onSubmit={this.handleSubmit}>
            <div className={style.content}>
              <Row>
                <Col span={12}>
                  <Form.Item label={intl.get("wsd.i18n.sys.menu.menucode")} {...formItemLayout}>
                    {getFieldDecorator('boCode', {
                      initialValue: this.state.info.boCode ? this.state.info.boCode : null,
                      rules: [
                        {
                          required: true,
                          message:
                            intl.get('wsd.i18n.message.enter') +
                            intl.get('wsd.i18n.sys.menu.menucode'),
                        },
                      ],
                    })(<Input maxLength={10}/>)}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={intl.get("wsd.i18n.sys.menu.menuname")} {...formItemLayout}>
                    {getFieldDecorator('boName', {
                      initialValue: this.state.info.boName ? this.state.info.boName : null,
                      rules: [
                        {
                          required: true,
                          message:
                            intl.get('wsd.i18n.message.enter') +
                            intl.get('wsd.i18n.sys.menu.menuname'),
                        },
                      ],
                    })(<Input maxLength={21}/>)}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Form.Item label={intl.get("wsd.i18n.sys.wfbizvar.tablename")} {...formItemLayout}>
                    {getFieldDecorator('tableName', {
                      initialValue: this.state.info.tableName ? this.state.info.tableName.id : null,
                      rules: [
                        {
                          required: true,
                          message:
                            intl.get('wsd.i18n.message.enter') +
                            intl.get('wsd.i18n.sys.wfbizvar.tablename'),
                        },
                      ],
                    })(
                      <Select onChange={this.onchangeTable} onDropdownVisibleChange={this.initTableName} showSearch optionFilterPro="children">
                        {this.state.tableArray1 ? this.state.tableArray1.map(item => {
                          return <Option value={item.id} key={item.id}>{item.name}</Option>
                        }) : this.state.tableArray && this.state.tableArray.map(item => {
                          return <Option value={item.value} key={item.value}>{item.title}</Option>
                        })}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={intl.get("wsd.i18n.base.coderulde.param")} {...formItemLayout}>
                    {getFieldDecorator('codeColumnName', {
                      initialValue: this.state.info.codeColumnName ? this.state.info.codeColumnName.id : null,
                      rules: [{
                        required: true,
                        message:
                          intl.get('wsd.i18n.message.enter') +
                          intl.get('wsd.i18n.base.coderulde.param'),
                      }],
                    })(
                      <Select showSearch optionFilterPro="children">
                        { this.state.tableField1 && this.state.tableField1.map(item => {
                          return <Option value={item.value} key={item.value}>{item.title}</Option>
                        })}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Form.Item label={intl.get("wsd.i18n.base.coderulde.numberrange")} {...formItemLayout}>
                    {getFieldDecorator('seqScope', {
                      initialValue: this.state.info.seqScope ? this.state.info.seqScope.id : null,
                      rules: [
                        {
                          required: true,
                          message:
                            intl.get('wsd.i18n.message.enter') +
                            intl.get('wsd.i18n.base.coderulde.numberrange'),
                        },
                      ],
                    })(
                      <Select showSearch optionFilterPro="children">
                        { this.state.tableField2 && this.state.tableField2.map(item => {
                          return <Option value={item.value} key={item.value}>{item.title}</Option>
                        })}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={intl.get("wsd.i18n.base.coderulde.assignparam")} {...formItemLayout}>
                    {getFieldDecorator('assignColumnName', {
                      initialValue: this.state.info.assignColumnName ? this.state.info.assignColumnName.id : null,
                      rules: [{
                        required: true,
                        message:
                          intl.get('wsd.i18n.message.enter') +
                          intl.get('wsd.i18n.base.coderulde.assignparam'),
                      }],
                    })(
                      <Select showSearch  onSearch={this.searchAssignColumnName} optionFilterPro="children">
                        { this.state.tableField3 && this.state.tableField3.map(item => {
                          return <Option value={item.value} key={item.value}>{item.title}</Option>
                        })}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </div>
          </Form>
        </Modal>
      </div>
    );
  }
}
const AddBusinessObjects = Form.create()(AddBusinessObject);

export default connect(state => ({ currentLocale: state.localeProviderData }))(AddBusinessObjects);
