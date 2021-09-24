import React, { Component } from 'react';
import style from './style.less';
import { Form, Row, Col, Input, Button, Icon, Select, DatePicker, Modal, Checkbox,InputNumber } from 'antd';
import axios from '../../../../../../api/axios';
import { addPeopleEntryDetail,getBaseSelectTree,updatePeopleEntryDetail } from '../../../../api/suzhou-api';
import moment from 'moment';
import { connect } from 'react-redux';
import * as dataUtil from "../../../../../../utils/dataUtil"


const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;
//人员-新增修改Modal
class AddModal extends Component {
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
      firstJob:'',
      typeOption:[],//人员分类
      defaultType:'',//默认人员分类
      // selectJobFlag:false
    };
  }
  componentDidMount() {
    if (this.props.addOrModify == 'add') {
      
    } else if (this.props.addOrModify == 'modify') {
      this.setState({
        info: this.props.data
      });
    }
    const orgCode =  this.props.rightData?this.props.rightData.orgTypeVo.code:'';
    axios.get(getBaseSelectTree("base.position.type")).then((res)=>{
      const newJob = []
      res.data.data.map((item,i)=>{
        if(item.value){
          if(orgCode == item.value.match(/(\S*)-/)[1]){
            item.orgFlag = item.value.match(/(\S*)-/)[1];
            newJob.push(item);
          }
        }
      })
      if(newJob.length > 0){
        this.setState({
          optionJob:newJob,
          firstJob:newJob[0].value
        })
      }
    });
    axios.get(getBaseSelectTree('szxm.rygl.peopleType')).then(res=>{
      const newArr = []
      if(this.props.rightData.orgCategoryVo.code == 5){
        res.data.data.map((item,i)=>{
          if(item.value == 4 || item.value == 3){
            newArr.push(item);
          }
        })
        this.setState({
          typeOption:newArr,
          defaultType:'4'
        })
      }else{
        if(this.props.rightData.peoEntryTypeVo.code == 1){
          res.data.data.map((item,i)=>{
            if(item.value == 0){
              newArr.push(item);
            }
          })
          this.setState({
            typeOption:newArr,
            defaultType:'0'
          })
        }else{
          res.data.data.map((item,i)=>{
            if(item.value == 1 || item.value == 2){
              newArr.push(item);
            }
          })
          this.setState({
            typeOption:newArr,
            defaultType:'2'
          })
        }
      } 
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
            enTryId:this.props.rightData.id,
            sectionId:this.props.rightData.sectionId,
            projectId:this.props.rightData.projectId,
            peoType:this.props.rightData.orgCategoryVo.code == 5?'0':'1'
          }
          axios.post(addPeopleEntryDetail, data, true).then(res => {
            this.props.addData(res.data.data)
            if (val == 'save') {
              this.props.handleCancel()
            } else if (val == 'goOn') {
              this.props.form.resetFields();
            }
          })
        } else if (this.props.addOrModify == 'modify') {
          let data = {
            ...values,
            enTryId:this.props.rightData.id,
            id:this.props.data.id,
            sectionId:this.props.rightData.sectionId,
            projectId:this.props.rightData.projectId
          }
          axios.put(updatePeopleEntryDetail, data, true).then(res => {
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
// selectJob = (val)=>{
//   this.setState({
//     selectJobFlag:true
//   })
// }
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
                        initialValue:!this.state.info.jobVo || !this.state.info.jobVo.code?this.state.firstJob:this.state.info.jobVo.code.toString(),
                      })(
                        <Select allowClear>
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
                  <Col span={12}>
                    <Form.Item label={'人员分类'} {...formItemLayout}>
                      {getFieldDecorator('type', {
                        initialValue:!this.state.info.typeVo||!this.state.info.typeVo.code?this.state.defaultType:this.state.info.typeVo.code.toString(),
                      })(
                        <Select>
                          {this.state.typeOption && this.state.typeOption.map((item,i)=>{
                            return(
                              <Option key={item.value} value={item.value}>{item.title}</Option>
                            )
                          })}
                        </Select>,
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={12} style={{display:this.props.addOrModify == 'add'?'none':'block'}}>
                    <Form.Item label={'人员类型'} {...formItemLayout}>
                      {getFieldDecorator('peoType', {
                        initialValue:!this.state.info.peoTypeVo ||!this.state.info.peoTypeVo.code?"0":this.state.info.peoTypeVo.code.toString(),
                      })(
                        <Select disabled>
                          <Option value={'0'} key={'0'}>分包</Option>
                          <Option value={'1'} key={'1'}>自有</Option>
                        </Select>,
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label={'性别'} {...formItemLayout}>
                      {getFieldDecorator('sex', {
                        initialValue:!this.state.info.sexVo|| !this.state.info.sexVo.code?"1":this.state.info.sexVo.code.toString(),
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
                        <DatePicker style={{ "width": "100%" }} dateFormat = 'YYYY-MM-DD'/>,
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label={'联系方式'} {...formItemLayout}>
                      {getFieldDecorator('telPhone', {
                        initialValue: this.state.info.telPhone,
                        rules: [{
                          required: true,
                          message:'请输入正确联系方式',
                          pattern: /^(1[345789]\d{9})|(1[3|4|5|6|7|8|9][0-9]\d{8})|((400)-?(\d{3})-?(\d{4}))$/
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
                  <Col span={12}>
                    <Form.Item label={'培训成绩'} {...formItemLayout}>
                      {getFieldDecorator('score', {
                        initialValue: this.state.info.score,
                        rules: [{
                          required: true,
                          message:'请输入培训成绩',
                        }],
                      })(
                        <InputNumber style={{width:'100%'}} max={100} min={0} />,
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label={'学时'} {...formItemLayout}>
                      {getFieldDecorator('classHour', {
                        initialValue: this.state.info.classHour,
                        rules: [{
                          required: true,
                          message:'请输入学时',
                        }],
                      })(
                        <InputNumber style={{width:'100%'}} max={999} min={0} />,
                      )}
                    </Form.Item>
                  </Col>
                <Col span={12}>
                    <Form.Item label={'工资卡号'} {...formItemLayout}>
                      {getFieldDecorator('gzkh', {
                        initialValue: this.state.info.gzkh,
                        rules: [],
                      })(
                        <InputNumber style={{width:'100%'}} />,
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

const AddModals = Form.create()(AddModal);
export default connect(state => ({
  currentLocale: state.localeProviderData,
}))(AddModals);
