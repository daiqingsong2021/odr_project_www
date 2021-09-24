import React, { Component } from 'react';
import { Form, Row, Col, Input, Button, InputNumber, Select, DatePicker, Checkbox, message } from 'antd';
import { connect } from 'react-redux';
import moment from 'moment';
import { curdCurrentData } from '../../../../../../store/curdData/action';
import style from './style.less';
import {getSpecialWorker,getBaseSelectTree,getSwTypeChose,updateSpecialWorker} from '../../../../api/suzhou-api';
import axios from '../../../../../../api/axios';
import * as dataUtil from "../../../../../../utils/dataUtil"
// 布局
import LabelFormLayout from "@/components/public/Layout/Labels/Form/LabelFormLayout"
import LabelFormButton from "@/components/public/Layout/Labels/Form/LabelFormButton"
const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
//菜单管理-基本信息
class MenuInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initDone: false,
      info: {},
      optionWorkType:[], //工种类型
      optionCerttype:[], //证书类别
    };
  }
  //获取菜单基本信息
  getData = (id) => {
    // 请求获取info数据
    axios.get(getSpecialWorker(id)).then(res => {
      this.setState({
        info: res.data.data,
      });
    });
  };
  componentDidMount() {
    this.props.data ? this.getData(this.props.data.id) : null;
    axios.get(getBaseSelectTree("szxm.rygl.certtype")).then((res)=>{
      this.setState({
        optionCerttype:res.data.data
      })
    });
    axios.get(getBaseSelectTree("szxm.rygl.worktype")).then(res=>{
      this.setState({
        optionWorkType:res.data.data
      })
    })
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values.certExpirationTime=dataUtil.Dates().formatTimeString(values.certExpirationTime)
        const data = {
          // ...this.props.data,
          // ...values,
          id:this.props.data.id,
          workType:values.workType.join()
        };
        // 更新菜单
        axios.put(updateSpecialWorker, data, true).then(res => {
          this.props.curdCurrentData({
            data: res.data.data
          });
          this.props.updateSuccess(res.data.data);
          // this.props.closeRightBox();
        });

      }
    });
  };
  // 选择工种类型
  onSelectWorkType = (key,val) => {
    const data={
      ...this.state.info,
      certVerifyUrl:val.props.label.certVerifyUrl,
      certTypeVoList:val.props.label.certTypeVoList
    }
    this.setState({
      info:data,
      warnPeriod:val.props.label.warnPeriod
    })
  }
  render() {
    const {intl} = this.props.currentLocale;
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
    return (
      <LabelFormLayout title={this.props.title}>
        <Form onSubmit={this.handleSubmit} className={style.mainScorll}>
              <Row type="flex">
                <Col span={12}>
                  <Form.Item label={'姓名'} {...formItemLayout}>
                    {getFieldDecorator('name', {
                      initialValue: this.state.info.name,
                      rules: [{ 
                        required: true,
                        message:'请输入姓名',
                      }],
                    })(
                      <Input disabled/>,
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={'单位'} {...formItemLayout}>
                    {getFieldDecorator('orgName', {
                      initialValue: this.state.info.orgName,
                      rules: [{ 
                        required: true ,
                        message:'请输入单位',
                        }],
                    })(
                      <Input disabled/>,
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={'标段号'} {...formItemLayout}>
                    {getFieldDecorator('sectionCode', {
                      initialValue: this.state.info.sectionCode,
                      rules: [{
                        message:'请输入标段号',
                      }],
                    })(
                      <Input disabled/>,
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={'标段名称'} {...formItemLayout}>
                    {getFieldDecorator('sectionName', {
                      initialValue: this.state.info.sectionName,
                      rules: [{
                        message: '请输入标段名称',
                      }],
                    })(
                      <Input disabled />,
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={'联系方式'} {...formItemLayout}>
                    {getFieldDecorator('telPhone', {
                      initialValue: this.state.info.telPhone,
                      rules: [{
                        message: '请输入联系电话',
                      }],
                    })(
                      <InputNumber disabled style={{width:'100%'}} />,
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={'工种类型'} {...formItemLayout}>
                    {getFieldDecorator('workType', {
                      initialValue: this.state.info.workType?this.state.info.workTypeVoList.map((item)=>{
                          return item.code
                      }):[],
                      rules: [{
                        required: true,
                        message: '请选择工种类型'
                      }],
                    })(
                      <Select mode="multiple" disabled = {((this.props.rightData.statusVo &&this.props.rightData.statusVo.code == 'INIT') || (this.props.taskFlag))?false:true}>
                        {
                          this.state.optionWorkType.length && this.state.optionWorkType.map((item,i) => {
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
                  <Form.Item label={'人员状态'} {...formItemLayout}>
                    {getFieldDecorator('peoStatus', {
                      initialValue: !this.state.info.peoStatusVo||this.state.info.peoStatusVo.name?'':this.state.info.peoStatusVo.name,
                      rules: [],
                    })(
                      <Input disabled/>,
                    )}
                  </Form.Item>
                </Col>
              </Row>
              
          </Form>
          <LabelFormButton>
              <Button onClick={this.props.closeRightBox} style={{ width: "100px" }}>取消</Button>
              <Button onClick={this.handleSubmit} style={{ width: "100px", marginLeft: "20px" }} 
              disabled = {((this.props.rightData.statusVo &&this.props.rightData.statusVo.code == 'INIT') || (this.props.taskFlag))?(this.props.permission.indexOf('SPECIALTYPE_EDIT-PERSON-SPECIAL')==-1?true:false):true} type="primary">保存</Button>
          </LabelFormButton>
      </LabelFormLayout>
    );
  }
}

const MenuInfos = Form.create()(MenuInfo);
export default connect(state => ({
  currentLocale: state.localeProviderData
}), {
    curdCurrentData,
  })(MenuInfos);

