import React, { Component } from 'react';
import {Modal,notification,Form,Row,Col,Input,Button,Icon,Select,Radio,DatePicker,Slider,InputNumber,message,Checkbox,TreeSelect} from 'antd';
import style from './style.less';
import intl from 'react-intl-universal';
import { connect } from 'react-redux';
import { curdCurrentData } from '../../../../../../store/curdData/action';
import axios from '../../../../../../api/axios';
import {getsectionId,calendarList,getAllKqConfig} from '../../../../api/suzhou-api';
import * as dataUtil from '../../../../../../utils/dataUtil';
const { TextArea } = Input;
const Option = Select.Option;
const TreeNode = TreeSelect.TreeNode;
import SelectSection from '@/modules/Suzhou/components/SelectSection';
//菜单管理-新增菜单模块
export class PlanDefineAdd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalInfo: {
        title: '新增',
      },
      selectSection:[],
      sectionFlag:false,
      calendarList:[] ,
      info:{} ,
      firstSection:'',//默认选择第一个标段
      sectionId:''               
    }
  }
  componentDidMount() {
    this.setState({
      projectId:this.props.projectId
    });
    //标段
    axios.get(getsectionId(this.props.projectId)).then(res=>{
      this.getSelectTreeArr(res.data.data,{"id":"value","name":"title"});
      this.setState({
        selectSection:res.data.data,
        firstSection:!res.data.data?'':res.data.data[0].value,
      })
    });
    //日历
    axios.get('api/base/calendar/list').then(res => {
      if (res.data.data) {
        this.setState({
          calendarList: res.data.data,
          firstCalendar :res.data.data[0]
        })
      }
    });
    if(this.props.type == 'GLOBAL'){
      axios.get(getAllKqConfig).then(res=>{
        this.setState({
          info:res.data.data
        })
      });
    }else if(this.props.type == 'ADD'){
      this.setState({
        info:{}
      })
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
  //新增提交
  handleSubmit = (val, e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      this.state.info.id?values.id = this.state.info.id:'';
      if (!err) {
        const data={
          ...values,
          type:this.props.type == 'ADD'?"1":'0'
        }
        if (val == 'save') {
          this.props.handleCancel();
          this.props.submit(data, 'save' );
        } else {
          // this.props.submit(values, 'goOn' );
          this.props.form.resetFields();
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
    const {type} = this.props;
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
            <Row type="flex">
                <Col span={12} style={{display:type=='ADD'?'none':"block"}}>
                  <Form.Item label={"设置"} {...formItemLayout}>
                    {getFieldDecorator('type', {
                      initialValue: '0',
                      rules: [],
                    })(
                      <Radio.Group disabled>
                        <Radio value={'0'}>全局设置</Radio>
                      </Radio.Group>,
                    )}
                  </Form.Item>
                </Col>
                <Col span={12} style={{display:type=='ADD'?'blcok':"none"}}>
                  <Form.Item label={"设置"} {...formItemLayout}>
                    {getFieldDecorator('type', {
                      initialValue: '1',
                      rules: [],
                    })(
                      <Radio.Group disabled>
                        <Radio value={'1'}>标段设置</Radio>
                      </Radio.Group>
                    )}
                  </Form.Item>
                </Col>
                <Col span={12} style={{display:type=='ADD'?'block':"none"}}>
                  <Form.Item label={'标段名称'} {...formItemLayout}>
                    {getFieldDecorator('sectionId', {
                      initialValue:this.state.firstSection,
                      rules: [],
                    })(
                       <SelectSection
                          projectId={this.props.projectId}
                          callBack={({ sectionId ,sectionCode}) => {
                            // this.onChangeSection(sectionId);
                            this.props.form.setFieldsValue({ sectionId});
                            this.setState({sectionCode})
                          }}
                        />
                    )}
                  </Form.Item>
                </Col>
                <Col span={12} style={{display:type=='ADD'?'block':"none"}}>
                    <Form.Item label="标段号" {...formItemLayout}>
                      <Input disabled={true} value={this.state.sectionCode} />
                    </Form.Item>
                  </Col>
              {/* </Row>
              <Row> */}
                <Col span={12}>
                  <Form.Item label={'管理人员'} {...formItemLayout}>
                    {getFieldDecorator('mangerkq', {
                      initialValue:!this.state.info.mangerKqVo||!this.state.info.mangerKqVo.code?"1":this.state.info.mangerKqVo.code.toString(),
                      rules: [],
                    })(
                      <Radio.Group>
                        <Radio value={'1'}>考勤</Radio>
                        <Radio value={'0'}>不考勤</Radio>
                      </Radio.Group>,
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={'劳务人员'} {...formItemLayout}>
                    {getFieldDecorator('workerkq', {
                      initialValue:!this.state.info.workerKqVo||!this.state.info.workerKqVo.code?"1":this.state.info.workerKqVo.code.toString(),
                      rules: [],
                    })(
                      <Radio.Group>
                        <Radio value={'1'}>考勤</Radio>
                        <Radio value={'0'}>不考勤</Radio>
                      </Radio.Group>,
                    )}
                  </Form.Item>
                </Col>
              {/* </Row>
               <Row > */}
                <Col span={12}>
                  <Form.Item label={'考勤日历'} {...formItemLayout}>
                    {getFieldDecorator('calenderId', {
                      initialValue: this.state.info.calenderVo?parseInt(this.state.info.calenderId):'',
                      rules: [{required: true,message: '请选择考勤日历'}],
                    })(
                      <Select>
                        {
                          this.state.calendarList.length && this.state.calendarList.map((item,i) => {
                            return (
                              <Option key={item.id} value={item.id}>{item.calName}</Option>
                            )
                          })
                        }
                      </Select>,
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
