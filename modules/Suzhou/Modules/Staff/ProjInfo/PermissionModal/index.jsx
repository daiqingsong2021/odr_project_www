import React, { Component } from 'react';
import style from './style.less';
import { Form, Row, Col, Input, Button, Icon, Select, DatePicker, Modal, Checkbox,InputNumber } from 'antd';
import axios from '../../../../../../api/axios';
import { addPeople,getBaseSelectTree,updatePeople,getPeopleList } from '../../../../api/suzhou-api';
import moment from 'moment';
import { connect } from 'react-redux';
import * as dataUtil from "../../../../../../utils/dataUtil"


const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;
//人员-新增修改Modal
class PermissionModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initDone: false,
      menuId: null,
      funcId: null,
      info: {},
      funcCode: '',
      optionSex:[],
      optionJob:[],
      selectJobFlag:false
    };
  }
  componentDidMount() {
    if (this.props.addOrModify == 'add') {
      this.setState({
        info:{}
      });
      if (this.props.data) {
      }
    } else if (this.props.addOrModify == 'modify') {
      this.setState({
        info: this.props.data
      });
    }
    axios.get(getBaseSelectTree("base.position.type")).then((res)=>{
      this.setState({
        optionJob:res.data.data
      })
    })
  }
  handleSubmit = (val, e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if(!values.bornDate){

      }else{
        values.bornDate = dataUtil.Dates().formatTimeString(values.bornDate).substr(0,10);
      }
      if (!err) {
        if (this.props.addOrModify == 'add') {
          let data = {
            ...values,
            projInfoId:this.props.data.id,
            sectionId:this.props.rightData.sectionId,
            projectId:this.props.rightData.projectId
          }
          axios.post(addPeople, data, true).then(res => {
            this.props.addData(res.data.data)
            if (val == 'save') {
              this.props.handleCancel()
            } else if (val == 'goOn') {
              this.props.form.resetFields();
            }
          })
        } else if (this.props.addOrModify == 'modify') {
          let data={};
          if(this.state.selectJobFlag){
            data = {
              ...values,
              id:this.props.data.id,
              sectionId:this.props.rightData.sectionId,
              projectId:this.props.rightData.projectId
            }
          }else{
            data = {
              ...values,
              id:this.props.data.id,
              sectionId:this.props.rightData.sectionId,
              projectId:this.props.rightData.projectId,
              job:this.props.rightData.jobVo?('code' in this.state.info.jobVo?this.state.info.jobVo.code:''):''
            }
          }
          axios.put(updatePeople, data, true).then(res => {
            this.props.updateSuccess(res.data.data)
            this.props.handleCancel()
          })
        }

      }
    });
  };
  handleCancel = (e) => {
    this.props.handleCancel();
  };
//选择职务
selectJob = (val)=>{
  this.setState({
    selectJobFlag:true
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
      <div className={style.main}>
        <div>
          <Modal title={this.props.title} visible={this.props.visible}
            onCancel={this.handleCancel}
            width="800px"
            footer={<div className="modalbtn">
              {this.props.addOrModify == 'add' ? <Button key={3} onClick={this.handleSubmit.bind(this, 'goOn')}>{intl.get('wsd.global.btn.saveandcontinue')}</Button>
                : <Button key={1} onClick={this.handleCancel}>{intl.get('wsd.global.btn.cancel')}</Button>}
              <Button key={2} onClick={this.handleSubmit.bind(this, 'save')} type="primary">{intl.get('wsd.global.btn.preservation')}</Button>
            </div>}
          >
            <Form onSubmit={this.handleSubmit}>
              <div className={style.content}>
                <Row type="flex">
                  <Col span={12}>
                    <Form.Item label={'姓名'} {...formItemLayout}>
                      {getFieldDecorator('name', {
                        initialValue: this.state.info.name,
                        rules: [{required: true,message: '请输入姓名',}],
                      })(
                        <Input />,
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label={'职务'} {...formItemLayout}>
                      {getFieldDecorator('job', {
                        initialValue:!this.state.info.jobVo?'':('code' in this.state.info.jobVo?this.state.info.jobVo.code.toString():this.state.info.jobVo.name),
                        rules: [{
                          message: '请输入职务'
                        }],
                      })(
                        <Select onSelect={this.selectJob}>
                        {
                          this.state.optionJob.length && this.state.optionJob.map((item,i) => {
                            return (
                              <Option key={item.value} value={item.value}>{item.title}</Option>
                            )
                          })
                        }
                      </Select>,
                      )}
                    </Form.Item>
                  </Col>
                  
                </Row>
                <Row>
                  <Col span={12}>
                    <Form.Item label={'人员分类'} {...formItemLayout}>
                      {getFieldDecorator('type', {
                        
                        initialValue:!this.state.info.type || !this.state.info.type.code?"0":this.state.info.typeVo.code.toString(),
                        rules: [],
                      })(
                        <Select>
                          <Option value="0" key= "0">管理人员</Option>
                          <Option value="1" key= "1">特殊工种</Option>
                          <Option value="2" key= "2">普通人员</Option>
                        </Select>,
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label={'人员类型'} {...formItemLayout}>
                      {getFieldDecorator('peoType', {
                        initialValue:!this.state.info.peoTypeVo || !this.state.info.peoTypeVo.code?"0":this.state.info.peoTypeVo.code.toString(),
                        rules: [],
                      })(
                        <Select>
                          <Option value={'0'} key={'0'}>分包</Option>
                          <Option value={'1'} key={'1'}>自有</Option>
                        </Select>,
                      )}
                    </Form.Item>
                  </Col>
                  
                </Row>
                <Row>
                  <Col span={12}>
                    <Form.Item label={'性别'} {...formItemLayout}>
                      {getFieldDecorator('sex', {
                        initialValue:!this.state.info.sexVo||!this.state.info.sexVo.code?"1":this.state.info.sexVo.code.toString(),
                        rules: [{required: true,message: '请选择性别'}],
                      })(
                        <Select>
                          <Option value={'0'} key={'0'}>女</Option>
                          <Option value={'1'} key={'1'}>男</Option>
                        </Select>,
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label={'出生日期'} {...formItemLayout}>
                      {getFieldDecorator('bornDate', {
                        initialValue:dataUtil.Dates().formatDateMonent( this.state.info.bornDate),
                        rules: [],
                      })(
                        <DatePicker style={{ "width": "100%" }} defaultValue={moment()} dateFormat = 'YYYY-MM-DD'/>,
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <Form.Item label={'联系方式'} {...formItemLayout}>
                      {getFieldDecorator('telPhone', {
                        initialValue: this.state.info.telPhone,
                        rules: [{
                          required: true,
                          message:'请输入正确联系方式',
                          pattern: /^(1[34578]\d{9})|(1[3|4|5|6|7|8|9][0-9]\d{8})|((400)-?(\d{3})-?(\d{4}))$/
                        }],
                      })(
                        <InputNumber style={{width:"100%"}} />,
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label={'身份证号'} {...formItemLayout}>
                      {getFieldDecorator('idCard', {
                        initialValue: this.state.info.idCard,
                        rules: [{
                          required: true,
                          message:'请输入身份证号',
                          pattern:/^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X|x)$/
                        }],
                      })(
                        <Input />,
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <Form.Item label={'累计学时'} {...formItemLayout}>
                      {getFieldDecorator('totalClassHour', {
                        initialValue: this.state.info.totalClassHour,
                        rules: [{
                          message:'请输入累计学时'
                        }],
                      })(
                        <Input disabled />,
                      )}
                    </Form.Item>
                  </Col>
                </Row>
              </div>
            </Form>
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
