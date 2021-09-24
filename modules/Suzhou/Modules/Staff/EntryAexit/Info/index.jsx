import React, { Component } from 'react';
import { Form, Row, Col, Input, Button, InputNumber, Select, DatePicker, Checkbox, message,TreeSelect } from 'antd';
import { connect } from 'react-redux';
import moment from 'moment';
import { curdCurrentData } from '../../../../../../store/curdData/action';
import style from './style.less';
import { updatePeopleEntry,getPeopleEntry} from '../../../../api/suzhou-api';
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
      projectId:'',
      sectionId:''
    };
  }
  //获取基本信息
  getData = (id) => {
    // 请求获取info数据
    axios.get(getPeopleEntry(id)).then(res => {
      this.setState({
        info: res.data.data,
        projectId:res.data.data.projectId,
        sectionId:res.data.data.sectionId,
        achanger:res.data.data.achanger,
        bchanger:res.data.data.bchanger
      });
    });
  };

  componentDidMount() {
    this.props.data ? this.getData(this.props.data.id) : null;
  }
  getSelectTreeArr2=(array,keyMap)=>{
    if(array){
      array.forEach((item,index,arr)=>{
        var obj = item;
        if(obj.type == 'people'){
        }else{
          obj.disabled = true;
        };
        for(var key in obj){
          var newKey = keyMap[key];
          if(newKey){
              obj[newKey] = obj[key];
          }
        }
        this.getSelectTreeArr2(item.children,keyMap);
      })
    }
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values.entryTime=dataUtil.Dates().formatTimeString(values.entryTime).substr(0,10);
        const data = {
          ...values,
          id:this.props.data.id,
        };
        // 更新菜单
        axios.put(updatePeopleEntry, data, true).then(res => {
          this.props.curdCurrentData({
            title: localStorage.getItem('name'),
            status: 'update',
            data: res.data.data
          });
          this.props.updateSuccess(res.data.data);
          // this.props.closeRightBox();
        });

      }
    });
  };
  //选择  变更人员
  onSelect = (selectedKeys, info,e) => {
    const data = {
      ...this.state.info,
      orgName:info.props.orgName,
      changeGw:info.props.positionName,
      bchanger:info.props.name,
      projInfoId:info.props.projInfoId
    }
    this.setState({
      info,
      bchanger:info.props.name
    })
  }
  //选择 变更后人员
  onSelectAchanger = (selectedKeys, info,e) => {
    const data={
      achanger:info.props.name
    }
    this.setState({
      info,
      achanger:info.props.name
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
                  <Form.Item label={'进退场编号'} {...formItemLayout}>
                    {getFieldDecorator('code', {
                      initialValue: this.state.info.code,
                      rules: [{required: true}],
                    })(
                      <Input disabled />,
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={'单位名称'} {...formItemLayout}>
                    {getFieldDecorator('orgName', {
                      initialValue: this.state.info.orgName,
                      rules: [{required: true}],
                    })(
                      <Input disabled/>,
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={'标段号'} {...formItemLayout}>
                    {getFieldDecorator('sectionCode', {
                      initialValue: this.state.info.sectionCode,
                      rules: [{required: true}],
                    })(
                      <Input disabled/>,
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={'标段名称'} {...formItemLayout}>
                    {getFieldDecorator('sectionName', {
                      initialValue: this.state.info.sectionName,
                      rules: [{required: true}],
                    })(
                      <Input disabled/>,
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={'类别'} {...formItemLayout}>
                    {getFieldDecorator('type', {
                      initialValue: this.state.info.typeVo? this.state.info.typeVo.code.toString():'',
                      rules: [{required: true}],
                    })(
                      <Select disabled>
                        <Option key={'0'} value={'0'}>进场</Option>
                        <Option key={'1'} value={'1'}>退场</Option>
                      </Select>,
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={'人员分类'} {...formItemLayout}>
                    {getFieldDecorator('peoEntryType', {
                      initialValue: this.state.info.peoEntryTypeVo?this.state.info.peoEntryTypeVo.code.toString():'',
                      rules: [{required: true}],
                    })(
                      <Select disabled = {((this.props.rightData.statusVo &&this.props.rightData.statusVo.code == 'INIT') || this.props.taskFlag)?false:true}>
                        <Option key={'0'} value={'0'}>普通人员</Option>
                        <Option key={'1'} value={'1'}>管理人员</Option>
                      </Select>,
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={'人数'} {...formItemLayout}>
                    {getFieldDecorator('peoNums', {
                      initialValue: this.state.info.peoNums,
                      rules: [{required: true}],
                    })(
                      <InputNumber style={{width:'100%'}} disabled />,
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={'进退场日期'} {...formItemLayout}>
                    {getFieldDecorator('entryTime', {
                      initialValue:dataUtil.Dates().formatDateMonent( this.state.info.entryTime),
                      rules: [{required: true}],
                    })(
                      <DatePicker style={{ width: '100%' }}  disabled = {((this.props.rightData.statusVo &&this.props.rightData.statusVo.code == 'INIT') ||this.props.taskFlag)?false:true} />,
                    )}
                  </Form.Item>
                </Col>
              </Row>
          </Form>
        <LabelFormButton>
              <Button onClick={this.props.closeRightBox} style={{ width: "100px" }}>取消</Button>
              <Button onClick={this.handleSubmit} style={{ width: "100px", marginLeft: "20px" }} 
              disabled = {((this.props.rightData.statusVo &&this.props.rightData.statusVo.code == 'INIT') || ( this.props.taskFlag))?(this.props.permission.indexOf('ENTRYAEXIT_EDIT_PERSON-ENTRY')==-1?true:false):true} type="primary">保存</Button>
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

