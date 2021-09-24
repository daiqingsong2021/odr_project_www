import React, { Component } from 'react';
import {Modal,Form,Row,Col,Input,Button,Icon,Select,DatePicker,Slider,InputNumber,message,Checkbox,TreeSelect} from 'antd';
import moment from 'moment';
import style from './style.less';
import intl from 'react-intl-universal';
import { connect } from 'react-redux';
import { curdCurrentData } from '../../../../../../store/curdData/action';
import axios from '../../../../../../api/axios';
import {getsectionId,getSwTypeChose,getBaseSelectTree,getOrgPeopleList} from '../../../../api/suzhou-api';
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
      jobTypeOption:[],
      assignFlag:true,
      projectId:"",
      optionCertCategory:[],
      peopleId:[],
      peopleInfo:'',
      warnPeriod:'',
      orkTypeName:'',
      workTypeId:'',
      sectionCode:''
    };
  }
  componentDidMount() {
      this.setState({
        projectId:this.props.projectId
      })
      axios.get(getsectionId(this.props.projectId)).then(res=>{
        this.getSelectTreeArr(res.data.data,{"id":"value","name":"title"});
        this.setState({
          selectSection:res.data.data
        })
        if (this.state.selectSection.length > 0) {
          const { id , code} = this.state.selectSection[0];
          this.props.form.setFieldsValue({ sectionId: id });
          this.setState({
            sectionCode: code,
          });
        }
      })
    axios.get(getBaseSelectTree("szxm.rygl.certtype")).then((res)=>{
      this.setState({
        optionCertCategory:res.data.data
      })
    });
    axios.get(getBaseSelectTree("szxm.rygl.worktype")).then((res)=>{
      this.setState({
        jobTypeOption:res.data.data
      })
    });
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
      if (!err) {
        const data = {
          ...values,
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
  onChangeSection = (value)=> {
    if(value){
      this.props.form.setFieldsValue({
        'peopleId': ''
      })
      this.setState({
        assignFlag:false,
        peopleInfo:'',
        selectPeople:[],
        // sectionCode:info.triggerNode.props.code
      },()=>{
        //选择人员
        axios.get(getOrgPeopleList+`?projectId=${this.state.projectId}&sectionIds=${value}&type=1`).then(res => {
          this.getSelectTreeArr2(res.data.data,{"id":"value","name":"title"});
          this.setState({
            selectPeople: res.data.data
          })
        })
      })
    }else{
      this.setState({
        assignFlag:true
      })
    }
  };
  //选择人员
  onSelect = (selectedKeys, info,e) => {
    this.setState({
      peopleInfo:info.props
    })
  }
  render() {
    const {optionCompany} = this.state;
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
    const dateFormat = "YYYY-MM-DD";
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
                <Col span={12}>
                  <Form.Item label={'选择标段'} {...formItemLayout}>
                    {getFieldDecorator('sectionId', {
                      rules: [{
                        required: true,
                        message: '请选择标段名称'
                      }],
                    })(
                       <SelectSection
                          projectId={this.props.projectId}
                          callBack={({ sectionId ,sectionCode}) => {
                            this.onChangeSection(sectionId);
                            this.props.form.setFieldsValue({ sectionId});
                            this.setState({sectionCode})
                          }}
                        />
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="标段号" {...formItemLayout}>
                      <Input disabled={true} value={this.state.sectionCode} />
                    </Form.Item>
                  </Col>
              </Row>
              <Row>
              <Col span={12}>
                  <Form.Item label={"选择人员"} {...formItemLayout}>
                    {getFieldDecorator('peopleId', {
                      rules: [{
                        required: true,
                        message: '请选择人员'
                      }],
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
                <Col span={12}>
                  <Form.Item label={'单位'} {...formItemLayout}>
                    {getFieldDecorator('orgName', {
                      initialValue:this.state.peopleInfo.orgName,
                      rules: [{
                        required: true,
                        message: '请输入单位'
                      }],
                    })(
                      <Input disabled />,
                    )}
                  </Form.Item>
                </Col>
                
              </Row>
              <Row>
              <Col span={12}>
                  <Form.Item label={'工种类型'} {...formItemLayout}>
                    {getFieldDecorator('workType', {
                      rules: [
                        {required: true,message:'请输入工种类型'}
                      ],
                    })(
                      <Select mode="multiple">
                        {
                          this.state.jobTypeOption.length && this.state.jobTypeOption.map((item,i) => {
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
