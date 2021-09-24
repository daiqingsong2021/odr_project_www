import React, { Component } from 'react';
import {Modal,Form,Row,Col,Input,Button,Icon,Select,DatePicker,Slider,InputNumber,message,Checkbox,TreeSelect} from 'antd';
import style from './style.less';
import intl from 'react-intl-universal';
import { connect } from 'react-redux';
import { curdCurrentData } from '../../../../../../store/curdData/action';
import axios from '../../../../../../api/axios';
import {getsectionId,getOrgPeopleList,getProjInfoList} from '../../../../api/suzhou-api';
import * as dataUtil from "../../../../../../utils/dataUtil"
import SelectSection from '@/modules/Suzhou/components/SelectSection';
const { TextArea } = Input;
const Option = Select.Option;
const TreeNode = TreeSelect.TreeNode;
//菜单管理-新增菜单模块
export class PlanDefineAdd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalInfo: {
        title: '新增',
      },
      initDone: false,
      optionData: [],
      optionCompany:[],
      optionClassification:[],
      selectSection:[],
      selectOrgName:[],
      projInfoId:'',
      orgName:"",
      assignFlag:true,
      sectionId:'',
      peoEntryTypeFlag:false
    }
  }
  componentDidMount() {
      this.setState({
        projectId:this.props.projectId
      })
      axios.get(getsectionId(this.props.projectId)).then(res=>{
        this.getSelectTreeArr(res.data.data,{"id":"value","name":"title"});
        this.setState({
          selectSection:res.data.data
        },()=>{
          if (this.state.selectSection.length > 0) {
            const { id , code} = this.state.selectSection[0];
            this.props.form.setFieldsValue({ sectionId: id });
            this.setState({
              sectionId: code,
            });
          }
        })
      })
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
      values.entryTime = dataUtil.Dates().formatTimeString(values.entryTime).substr(0,10);
      if (!err) {
        const data={
          ...values,
          projInfoId:this.state.projInfoId,
          orgName:this.state.orgName
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
  //选择标段
  onChangeSection = (value)=>{
    this.setState({peoEntryTypeFlag:false})
    if(value){
      // 人员
      this.props.form.setFieldsValue({
        'orgName': ''
      })
      this.setState({
        assignFlag:false,
      })
      axios.get(getProjInfoList+`?projectId=${this.state.projectId}&sectionIds=${value}`).then(res => {
        this.getSelectTreeArr(res.data.data,{"id":"value","orgName":"title"});
        this.setState({
          selectOrgName: res.data.data
        })
      })
    }else{
      this.setState({
        assignFlag:true
      })
    }
  }
  //选择单位名称
  onChangeOrgName = (selectedKeys, info,e) => {
    if(info.props.orgCategoryVo.code == 5){
      this.setState({
        projInfoId:info.props.id,
        orgName:info.props.orgName,
        peoEntryTypeFlag:false
      })
    }else{
      this.setState({
        projInfoId:info.props.id,
        orgName:info.props.orgName,
        peoEntryTypeFlag:true
      })
    }
    
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
    const treeSelectArry = []
      this.state.menuList && this.state.menuList.map((item,index)=>{  //循环树选择数据
        const tProps = {
            value: this.state.permissions[index],
            treeData: item,
            onChange: this.onChange,
          multiple: true,
            treeCheckable: true,
            dropdownStyle: {maxHeight:"350px"},
            showCheckedStrategy: SHOW_PARENT,
          searchPlaceholder: '请选择'+this.state.headNavsearchPlaceholder[item[0].proid]+'权限列表',
            style: {
                width: 300,
            },
      };
      treeSelectArry.push(tProps)
    })
    
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
                      // initialValue:this.state.info.sectionName,
                      rules: [{required: true,message: '请选择标段名称'}],
                    })(
                       <SelectSection
                          projectId={this.props.projectId}
                          callBack={({ sectionId ,sectionCode}) => {
                            this.onChangeSection(sectionId);
                            this.props.form.setFieldsValue({ sectionId});
                            this.setState({sectionCode})
                          }}
                        />,
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="标段号" {...formItemLayout}>
                      <Input disabled={true} value={this.state.sectionCode} />
                    </Form.Item>
                  </Col>
                
              </Row>
              <Row type="flex">
              <Col span={12}>
                  <Form.Item label={'单位名称'} {...formItemLayout}>
                    {getFieldDecorator('orgName', {
                      rules: [{required: true,message: '请选择单位名称'}],
                    })(
                      <TreeSelect
                        showSearch
                        // value={this.state.value}
                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                        allowClear
                        treeDefaultExpandAll
                        onSelect={this.onChangeOrgName}
                        treeData={this.state.selectOrgName}
                        disabled= {this.state.assignFlag}
                       />,
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={'类别'} {...formItemLayout}>
                    {getFieldDecorator('type', {
                      initialValue:'0',
                      rules: [{required: true,message: '请选择类别'}],
                    })(
                      <Select>
                        <Option key={'0'} value={'0'}>进场</Option>
                        <Option key={'1'} value={'1'}>退场</Option>
                      </Select>,
                    )}
                  </Form.Item>
                </Col>
                
                
              </Row>
              <Row>
                {/* <Col span={12}>
                  <Form.Item label={'进退场人数'} {...formItemLayout}>
                    {getFieldDecorator('peoNums', {
                      rules: [{required: true,message: '请输入进退场人数'}],
                    })(
                      <InputNumber style={{width:'100%'}} />,
                    )}
                  </Form.Item>
                </Col> */}
                <Col span={12} style={{display:this.state.peoEntryTypeFlag?'block':'none'}}>
                  <Form.Item label={"人员分类"} {...formItemLayout}>
                    {getFieldDecorator('peoEntryType', {
                      initialValue:'0',
                    })(
                      <Select>
                        <Option key={'0'} value={'0'}>普通人员</Option>
                        <Option key={'1'} value={'1'}>管理人员</Option>
                      </Select>,
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={'进退场日期'} {...formItemLayout}>
                    {getFieldDecorator('entryTime', {
                      rules: [{required: true,message: '请选择进退场日期'}],
                    })(
                      <DatePicker style={{ "width": "100%" }} dateFormat = 'YYYY-MM-DD'/>,
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
