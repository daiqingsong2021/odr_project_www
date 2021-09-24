import React, { Component } from 'react';
import {Modal,Form,Row,Col,Input,Button,Icon,Select,DatePicker,Slider,InputNumber,message,Checkbox,TreeSelect} from 'antd';
import moment from 'moment';
import style from './style.less';
import intl from 'react-intl-universal';
import { connect } from 'react-redux';
import { curdCurrentData } from '../../../../../../store/curdData/action';
import axios from '../../../../../../api/axios';
import {getsectionId,getBaseSelectTree,getOrgPeopleList,getHolidayDay,getOrgName,getHolidayRyzw} from '../../../../api/suzhou-api';
const { TextArea } = Input;
const Option = Select.Option;
const TreeNode = TreeSelect.TreeNode;
import PublicButton from "../../../../../../components/public/TopTags/PublicButton";
import * as dataUtil from "../../../../../../utils/dataUtil"
import SelectSection from '@/modules/Suzhou/components/SelectSection';
export class PlanDefineAdd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalInfo: {
        title: '新增',
      },
      initDone: false,
      selectSection:[],
      assignFlag:true,
      selectSetion:'',
      projectId:"",
      peopleId:[],
      optionType:[],
      startValue: null,
      endValue: null,
      endOpen: false,
      currentSection:'', //选择标段默认第一个标段
      userInfo:{}, //登录用户名，id
      orgName:'', //所属单位
      sectionCode:'',
      ryZw:"",//职务
    };
  }
  componentDidMount() {
      let user = JSON.parse(sessionStorage.getItem('userInfo') || '{}');
      let data = {peopleId:user.id,peopleName:user.actuName}
      this.setState({
        projectId:this.props.projectId,
        userInfo:data,
        peopleName:user.actuName
      })
      axios.get(getOrgName).then(res=>{
        this.setState({
          orgName:res.data.data.orgName
        })
      })
      axios.get(getsectionId(this.props.projectId)).then(res=>{
        this.getSelectTreeArr(res.data.data,{"id":"value","name":"title"});
        if(res.data.data){
          this.setState({
            selectSection:res.data.data,
            selectSetion:res.data.data[0].value,
            currentSection:res.data.data[0].value,
            zwsectionId:res.data.data[0].id,
          },()=>{
            this.initJob();
          })
        }
        if (this.state.selectSection.length > 0) {
          const { id , code} = this.state.selectSection[0];
          this.props.form.setFieldsValue({ sectionId: id });
          this.setState({
            sectionCode: code,
          });
        }
      });
      axios.get(getBaseSelectTree("szxm.rygl.holitype")).then((res)=>{
        this.setState({
          optionType:res.data.data
        })
      });
      
  }
  initJob =()=>{
    if(this.props.YZ_KQGLY){//考勤管理员

    }else{
      axios.get(getHolidayRyzw(this.state.zwsectionId)).then(res=>{
        this.setState({ryZw:res.data.data})
      })
      //选择人员
      axios.get(getOrgPeopleList+`?projectId=${this.state.projectId}&sectionIds=${this.state.zwsectionId}&type=0&status=1`).then(res => {
        this.getSelectTreeArr2(res.data.data,{"id":"value","name":"title"});
        this.setState({
          selectPeople2: res.data.data
        })
      });
    }
  }
  getSelectTreeArr=(array,keyMap)=>{
    if(array){
      array.forEach((item,index,arr)=>{
        var obj = item;
        for(var key in obj){
          var newKey = keyMap[key];
          if(newKey){
              obj[newKey] = obj[key];
          }
        }
        this.getSelectTreeArr(item.children,keyMap);
      })
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
  //新增提交
  handleSubmit = (val, e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      values.startTime = dataUtil.Dates().formatTimeString(values.startTime).substr(0,10);
      values.endTime = dataUtil.Dates().formatTimeString(values.endTime).substr(0,10);
      if (!err) {
        const data = {
          ...values,
          peopleName:this.state.peopleName
        }
        if (val == 'save') {
          this.props.submit(data, 'save' );
        } else {
          this.props.submit(data, 'goOn' );
          this.props.form.resetFields();
        }
      }
    });
  };
  // 选择标段
  onChangeSection = (value,select,info) => {
    if(value){
      this.props.form.setFieldsValue({
        'peopleId': ''
      })
      this.setState({
        assignFlag:false,
        selectSetion:value,
      },()=>{
        this.getHolidayDay();
      })
      //选择人员
      axios.get(getOrgPeopleList+`?projectId=${this.state.projectId}&sectionIds=${value}&type=0&status=1`).then(res => {
        this.getSelectTreeArr2(res.data.data,{"id":"value","name":"title"});
        this.setState({
          selectPeople: res.data.data,
          selectPeople2: res.data.data
        })
      });
      
    }else{
      this.setState({
        assignFlag:true
      })
    }
  };
  //选择人员
  onSelect = (selectedKeys, info,e) => {
    this.setState({
      orgName:info.props.orgName,
      peopleName:info.props.name,
      ryZw:info.props.positionName
    })
  }
  //获取请假天数
  getHolidayDay = ()=>{
    const {selectSetion,startValue,endValue} = this.state;
    if(selectSetion && startValue && endValue){
      const data ={
        startTime:dataUtil.Dates().formatTimeString(startValue).substr(0,10),
        endTime:dataUtil.Dates().formatTimeString(endValue).substr(0,10),
        sectionId:selectSetion,
        projectId:this.props.projectId
      }
      axios.get(getHolidayDay+`?projectId=${this.props.projectId}&sectionId=${selectSetion}&startTime=${dataUtil.Dates().formatTimeString(startValue).substr(0,10)}&endTime=${dataUtil.Dates().formatTimeString(endValue).substr(0,10)}`).then((res)=>{
        if(res.data.status == 200){
          this.setState({
            day:res.data.data
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
    const {optionType} = this.state;
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
      <div>
        <Modal className={style.main}
          width="850px"
          afterClose={this.props.form.resetFields}
          mask={false}
          maskClosable={false}
          footer={<div className="modalbtn">
            {/* 保存并继续 */}
            <Button key={1} onClick={this.handleSubmit.bind(this, 'goOn')}>{intl.get('wsd.global.btn.saveandcontinue')}</Button>
            {/* 保存 */}
            <Button key={2} onClick={this.handleSubmit.bind(this, 'save')} type="primary">{intl.get('wsd.global.btn.preservation')}</Button>
          </div>}
          centered={true} title={this.state.modalInfo.title} visible={this.props.modalVisible}
          onCancel={this.props.handleCancel}>
          <Form onSubmit={this.handleSubmit} className={style.mainScorll}>
            <div className={style.content}>
              {this.props.YZ_KQGLY == false &&
                <Row type="flex">
                  <Col span={12}>
                    <Form.Item label={'选择标段'} {...formItemLayout}>
                      {getFieldDecorator('sectionId', {
                        initialValue: this.state.currentSection,
                        rules: [{required: true,message: '请选择标段名称'}],
                      })(
                        <SelectSection
                          projectId={this.props.projectId}
                          callBack={({ sectionId ,sectionCode}) => {
                            this.props.form.setFieldsValue({ sectionId});
                            this.setState({sectionCode,sectionId})
                          }}
                          disabled
                        />
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label={"请假人员"} {...formItemLayout}>
                      {getFieldDecorator('peopleId', {
                        initialValue:!this.state.userInfo.peopleId?'':this.state.userInfo.peopleId,
                        rules: [{required: true,message: '请选择请假人员'}],
                      })(
                        <Select disabled>
                          <Option key={this.state.userInfo.peopleId} value={this.state.userInfo.peopleId}>{this.state.userInfo.peopleName}</Option>
                        </Select>,
                      )}
                    </Form.Item>
                  </Col>
                </Row>
              }
              {this.props.YZ_KQGLY && 
                <Row type="flex">
                  <Col span={12}>
                    <Form.Item label={'选择标段'} {...formItemLayout}>
                      {getFieldDecorator('sectionId', {
                        rules: [{required: true,message: '请选择标段名称'}],
                      })(
                       
                        <SelectSection
                          projectId={this.props.projectId}
                          callBack={({ sectionId ,sectionCode}) => {
                            this.onChangeSection(sectionId);
                            this.props.form.setFieldsValue({ sectionId});
                            this.setState({sectionId,sectionCode})
                          }}
                        />
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label={"请假人员"} {...formItemLayout}>
                      {getFieldDecorator('peopleId', {
                        rules: [{required: true,message: '请选择请假人员'}],
                      })(
                        <TreeSelect
                          showSearch
                          dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                          allowClear
                          treeDefaultExpandAll
                          treeData={this.state.selectPeople}
                          onSelect= {this.onSelect}
                          disabled={this.state.assignFlag}
                        >
                        </TreeSelect>,
                      )}
                    </Form.Item>
                  </Col>
                </Row>
              }
              <Row>
                <Col span={12}>
                    <Form.Item label="标段号" {...formItemLayout}>
                      <Input disabled={true} value={this.state.sectionCode} />
                    </Form.Item>
                  </Col>
                <Col span={12}>
                  <Form.Item label={'所属单位'} {...formItemLayout}>
                    {getFieldDecorator('orgName', {
                      initialValue: this.state.orgName,
                      rules: [{required: true,message: '请选择所属单位'}],
                    })(
                      <Input disabled/>
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={'开始时间'} {...formItemLayout}>
                    {getFieldDecorator('startTime', {
                      rules: [{required: true,message: '请输入开始时间'}],
                    })(
                      <DatePicker 
                        style={{ "width": "100%" }} 
                        disabledDate={this.disabledStartDate}
                        placeholder="请选择开始时间"
                        // showTime
                        format="YYYY-MM-DD"
                        // value={startValue}
                        onChange={this.onStartChange}
                        onOpenChange={this.handleStartOpenChange} 
                        />,
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={'结束时间'} {...formItemLayout}>
                    {getFieldDecorator('endTime', {
                      rules: [{required: true,message: '请输入结束时间'}],
                    })(
                      <DatePicker 
                        style={{ "width": "100%" }} 
                        disabledDate={this.disabledEndDate}
                        // showTime
                        placeholder="请选择结束时间"
                        format="YYYY-MM-DD"
                        // value={endValue}
                        onChange={this.onEndChange}
                        open={endOpen}
                        onOpenChange={this.handleEndOpenChange}
                        />,
                        
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={'职务'} {...formItemLayout}>
                    {getFieldDecorator('ryZw', {
                      initialValue: this.state.ryZw,
                      rules: [],
                    })(
                      <Input style={{width:"100%"}} disabled />
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={'请假天数'} {...formItemLayout}>
                    {getFieldDecorator('days', {
                      initialValue: this.state.day,
                      rules: [],
                    })(
                      <InputNumber style={{width:"100%"}} disabled />
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={'类别'} {...formItemLayout}>
                    {getFieldDecorator('type', {
                      initialValue:!this.state.optionType[0]?'':this.state.optionType[0].value.toString(),
                      rules: [{required: true,message: '请选择请假类别'}],
                    })(
                      <Select>
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
                      //initialValue:!this.state.optionType[0]?'':this.state.optionType[0].value.toString(),
                      rules: [{required: true,message: '请选择工作交接人'}],
                    })(
                      <TreeSelect
                          showSearch
                          dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                          allowClear
                          treeDefaultExpandAll
                          treeData={this.state.selectPeople2}
                          // onSelect= {this.onSelect}
                          // disabled={this.state.assignFlag}
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
                      rules: [{required: true,message: '请输入请假原因'}],
                    })(
                      <TextArea rows={2} />,
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

const PlanDefineAdds = Form.create()(PlanDefineAdd);
export default connect(state => ({
  currentLocale: state.localeProviderData,
}))(PlanDefineAdds);
