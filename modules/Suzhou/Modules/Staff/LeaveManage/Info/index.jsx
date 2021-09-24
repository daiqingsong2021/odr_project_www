import React, { Component } from 'react';
import { Form,TreeSelect, Row, Col, Input, Button, InputNumber, Select, DatePicker, Checkbox, message } from 'antd';
import { connect } from 'react-redux';
import moment from 'moment';
import { curdCurrentData } from '../../../../../../store/curdData/action';
import style from './style.less';
import {getBaseSelectTree,updateHoliday,getOrgPeopleList,getHolidayDay,getHoliday} from '../../../../api/suzhou-api';
import axios from '../../../../../../api/axios';
import * as dataUtil from "../../../../../../utils/dataUtil"

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
      optionType:[], //请假类别
      peopleId:'',
      startValue: null,
      endValue: null,
      endOpen: false,
    };
  }
  //获取菜单基本信息
  getData = (id) => {
    // 请求获取info数据
    axios.get(getHoliday(id)).then(res => {
      this.setState({
        info: res.data.data,
        startValue:res.data.data.startTime,
        endValue:res.data.data.endTime
      });
    });
  };
  componentDidMount() {
    this.props.data ? this.getData(this.props.data.id): null;
    if(!this.props.projectId){

    }else{
      //获取人员
      axios.get(getOrgPeopleList+`?projectId=${this.props.projectId}&sectionIds=${this.props.rightData.sectionId}&type=0&status=1`).then(res => {
        this.getSelectTreeArr2(res.data.data,{"id":"value","name":"title"});
        this.setState({
          selectPeople: res.data.data,
          selectPeople2: res.data.data
        })
      });
      axios.get(getBaseSelectTree("szxm.rygl.holitype")).then((res)=>{
        this.setState({
          optionType:res.data.data
        })
      });
    }
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
        values.startTime=dataUtil.Dates().formatTimeString(values.startTime).substr(0,10);
        values.endTime=dataUtil.Dates().formatTimeString(values.endTime).substr(0,10);
        const data = {
          ...values,
          id:this.props.data.id,
          peopleName:this.state.info.peopleName,
          peopleId:this.props.data.peopleId,
          agentId:values.agentId==this.state.info.changeName?this.state.info.agentId:values.agentId
        };
        // 更新
        axios.put(updateHoliday, data, true).then(res => {
          this.props.curdCurrentData({
            data: res.data.data
          });
          this.props.updateSuccess(res.data.data);
          // this.props.closeRightBox();
        });

      }
    });
  };
  //请假人员
  onSelect = (selectedKeys, info,e) => {
    const data = {
      ...this.state.info,
      orgName:info.props.orgName,
      peopleName:info.props.name
    };
    this.props.data.peopleId = info.props.id
    this.setState({
      info:data,
      
    })
  }
  //获取请假天数
  getHolidayDay = ()=>{
    const {startValue,endValue} = this.state;
    const selectSetion = this.props.rightData.sectionId;
    if(selectSetion && startValue && endValue){
      const data ={
        startTime:dataUtil.Dates().formatTimeString(startValue).substr(0,10),
        endTime:dataUtil.Dates().formatTimeString(endValue).substr(0,10),
        sectionId:selectSetion,
        projectId:this.props.projectId
      }
      axios.get(getHolidayDay+`?projectId=${this.props.projectId}&sectionId=${selectSetion}&startTime=${dataUtil.Dates().formatTimeString(startValue).substr(0,10)}&endTime=${dataUtil.Dates().formatTimeString(endValue).substr(0,10)}`).then((res)=>{
        if(res.data.status == 200){
          const data={
            ...this.state.info,
            days:res.data.data,
          }
          this.setState({
            info:data
          })
        }
      })
    }else{

    }
  }
  //时间
  disabledStartDate = startValue => {
    const { endValue } = this.state;
    if (!startValue || !endValue) {
      return false;
    }
    return startValue.valueOf() > endValue.valueOf();
  };
  disabledEndDate = endValue => {
    const { startValue } = this.state;
    if (!endValue || !startValue) {
      return false;
    }
    return endValue.valueOf() <= startValue.valueOf();
  };
  onChange = (field, value) => {
    this.setState({
      [field]: value,
    },()=>{
      this.getHolidayDay();
    });
  };
  onStartChange = value => {
    this.onChange('startValue', value);
  };
  onEndChange = value => {
    this.onChange('endValue', value);
  };
  handleStartOpenChange = open => {
    if (!open) {
      this.setState({ endOpen: true });
    }
  };
  handleEndOpenChange = open => {
    this.setState({ endOpen: open });
  };
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
    const { startValue, endValue, endOpen } = this.state;
    return (
      <div className={style.main}>
        <div className={style.mainHeight}>
          <h3 className={style.listTitle}>基本信息</h3>
          <Form onSubmit={this.handleSubmit} className={style.mainScorll}>
            <div className={style.content}>
              <Row type="flex">
                <Col span={12}>
                  <Form.Item label={'编号'} {...formItemLayout}>
                    {getFieldDecorator('serialId', {
                      initialValue: this.state.info.serialId,
                      rules: [{required: true,message:'请输入编号'}],
                    })(
                      <Input disabled/>,
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={'标段号'} {...formItemLayout}>
                    {getFieldDecorator('sectionCode', {
                      initialValue: this.state.info.sectionCode,
                      rules: [{required: true,message:'请输入标段号'}],
                    })(
                      <Input disabled/>,
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={'标段名称'} {...formItemLayout}>
                    {getFieldDecorator('sectionName', {
                      initialValue: this.state.info.sectionName,
                      rules: [{required: true ,message:'请输入标段号'}],
                    })(
                      <Input disabled/>,
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={'请假人员'} {...formItemLayout}>
                    {getFieldDecorator('peopleId', {
                      initialValue: this.state.info.peopleName,
                      rules: [{required: true ,message: '请输入请假人员'}],
                    })(
                      <TreeSelect
                        showSearch
                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                        allowClear
                        treeDefaultExpandAll
                        treeData={this.state.selectPeople}
                        onSelect= {this.onSelect}
                        // disabled = {this.props.rightData.statusVo &&this.props.rightData.statusVo.code == 'INIT'?false:true}
                        disabled
                      >
                      </TreeSelect>,
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={'所属单位'} {...formItemLayout}>
                    {getFieldDecorator('orgName', {
                      initialValue: this.state.info.orgName,
                      rules: [{required: true ,message: '请输入所属单位'}],
                    })(
                      <Input disabled/>,
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={'职务'} {...formItemLayout}>
                    {getFieldDecorator('ryZw', {
                      initialValue:(!this.state.info || !this.state.info.ryZw)?"":this.state.info.ryZw,
                    })(
                      <Input disabled/>,
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={'开始时间'} {...formItemLayout}>
                    {getFieldDecorator('startTime', {
                      initialValue:dataUtil.Dates().formatDateMonent( this.state.info.startTime),
                      rules: [{required: true ,message: '请输入开始时间'}],
                    })(
                      <DatePicker 
                        style={{ "width": "100%" }} 
                        disabledDate={this.disabledStartDate}
                        // showTime
                        format="YYYY-MM-DD"
                        // value={startValue}
                        placeholder="Start"
                        onChange={this.onStartChange}
                        onOpenChange={this.handleStartOpenChange} 
                        disabled = {((this.props.rightData.statusVo &&this.props.rightData.statusVo.code == 'INIT') || (this.props.taskFlag))?false:true}
                      />,
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={'结束时间'} {...formItemLayout}>
                    {getFieldDecorator('endTime', {
                      initialValue:dataUtil.Dates().formatDateMonent( this.state.info.endTime),
                      rules: [{required: true ,message: '请输入结束时间'}],
                    })(
                      <DatePicker 
                        style={{ "width": "100%" }} 
                        disabledDate={this.disabledEndDate}
                        // showTime
                        format="YYYY-MM-DD"
                        // value={endValue}
                        placeholder="End"
                        onChange={this.onEndChange}
                        open={endOpen}
                        onOpenChange={this.handleEndOpenChange}
                        disabled = {((this.props.rightData.statusVo &&this.props.rightData.statusVo.code == 'INIT') || (this.props.taskFlag))?false:true}
                        />,
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={'请假天数'} {...formItemLayout}>
                    {getFieldDecorator('days', {
                      initialValue: this.state.info.days,
                      rules: [],
                    })(
                      <Input disabled />,
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={'类别'} {...formItemLayout}>
                    {getFieldDecorator('type', {
                      initialValue:!this.state.info.typeVo||!this.state.info.typeVo.code?'1':this.state.info.typeVo.code.toString(),
                      rules: [{required: true ,message: '请输入类别'}],
                    })(
                      <Select disabled = {((this.props.rightData.statusVo &&this.props.rightData.statusVo.code == 'INIT') || (this.props.taskFlag))?false:true}>
                      {
                          this.state.optionType.length && this.state.optionType.map((item,i) => {
                            return (
                              <Option key={item.value} value={item.value}>{item.title}</Option>
                            )
                          })
                        }
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={'工作交接人'} {...formItemLayout}>
                    {getFieldDecorator('agentId', {
                      initialValue:(!this.state.info || !this.state.info.changeName)?'':this.state.info.changeName,
                      rules: [{required: true,message: '请选择工作交接人'}],
                    })(
                      <TreeSelect
                          showSearch
                          dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                          allowClear
                          treeDefaultExpandAll
                          treeData={this.state.selectPeople2}
                        >
                      </TreeSelect>,
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <Form.Item label={'请假原因'} {...formItemLayout1}>
                    {getFieldDecorator('reason', {
                      initialValue: this.state.info.reason,
                      rules: [{required: true ,message: '请输入请假原因'}],
                    })(
                      <TextArea rows={2} disabled = {((this.props.rightData.statusVo &&this.props.rightData.statusVo.code == 'INIT') || (this.props.taskFlag))?false:true} />,
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item wrapperCol={{ offset: 4 }}>
                <Button
                  className="globalBtn"
                  onClick={this.handleSubmit}
                  style={{ marginRight: 20 }}
                  type="primary"
                  disabled = {((this.props.rightData.statusVo &&this.props.rightData.statusVo.code == 'INIT') || (this.props.taskFlag))?(this.props.permission.indexOf('LEAVEMANAGE_EDIT-LEAVE-MANAGE')==-1?true:false):true}
                >保存
                </Button>
                <Button className="globalBtn" onClick={this.props.closeRightBox}>取消</Button>
              </Form.Item>
            </div>

          </Form>
        </div>
      </div>
    );
  }
}

const MenuInfos = Form.create()(MenuInfo);
export default connect(state => ({
  currentLocale: state.localeProviderData
}), {
    curdCurrentData,
  })(MenuInfos);

