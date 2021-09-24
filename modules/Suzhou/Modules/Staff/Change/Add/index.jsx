import React, { Component } from 'react';
import {Modal,Form,Row,Col,Input,Button,Icon,Select,DatePicker,Slider,InputNumber,message,Checkbox,TreeSelect} from 'antd';
import style from './style.less';
import intl from 'react-intl-universal';
import { connect } from 'react-redux';
import { curdCurrentData } from '../../../../../../store/curdData/action';
import axios from '../../../../../../api/axios';
import {getBaseSelectTree,getsectionId,getOrgPeopleList} from '../../../../api/suzhou-api';
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
      selectPeople:[],
      bchanger:'',
      achanger:'',
      projInfoId:'',
      assignFlag:true,
      sectionCode:''
    }
  }
  componentDidMount() {
    if(!this.props.projectId){

    }else{
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
    }
    axios.get(getBaseSelectTree("base.org.type")).then((res)=>{
      this.setState({
        optionCompany:res.data.data
      })
    });
    axios.get(getBaseSelectTree("base.org.classification")).then((res)=>{
      this.setState({
        optionClassification:res.data.data
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
      if (!err) {
        const data={
          ...values,
          achanger:this.state.achanger,
          bchanger:this.state.bchanger,
          projInfoId:this.state.projInfoId
        }
        if (val == 'save') {
          // this.props.handleCancel();
          this.props.submit(data, 'save' );
        } else {
          this.props.submit(values, 'goOn' );
          this.props.form.resetFields();
        }

      }
    });
  };
  onChange = (value, lbale, extra) => {
  };
  onSelect = (selectedKeys, info,e) => {
    this.setState({
      orgName:info.props.orgName,
      changeGw:info.props.positionName,
      bchanger:info.props.name,
      projInfoId:info.props.projInfoId
    })
  }
  onSelectAchanger = (selectedKeys, info,e) => {
    this.setState({
      achanger:info.props.name
    })
  }
  onChangeSection = (value)=>{
    if(value){
      // 人员
      this.props.form.setFieldsValue({
        'bchangerId': '',
      })
      this.setState({
        assignFlag:false,
        orgName:'',
        changeGw:'',
      })
      axios.get(getOrgPeopleList+`?projectId=${this.state.projectId}&sectionIds=${value}&type=0&status=1`).then(res => {
        this.getSelectTreeArr2(res.data.data,{"id":"value","name":"title"});
        this.setState({
          selectPeople: res.data.data
        })
      })
      
    }else{
      this.setState({
        assignFlag:true
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
                    rules: [{required: true,message: '请选择标段名称'}],
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
              <Row type="flex">
              <Col span={12}>
                  <Form.Item label={'变更前人员'} {...formItemLayout}>
                    {getFieldDecorator('bchangerId', {
                      rules: [{required: true,message: '请选择变更前人员'}],
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
                  <Form.Item label={"变更单位"} {...formItemLayout}>
                    {getFieldDecorator('orgName', {
                      initialValue: this.state.orgName,
                      rules: [{required: true,message: '请选择变更单位'}],
                    })(
                      <Input disabled/>,
                    )}
                  </Form.Item>
                </Col>
                
              </Row>
              <Row>
              <Col span={12}>
                  <Form.Item label={'变更职务'} {...formItemLayout}>
                    {getFieldDecorator('changeGw', {
                      initialValue: this.state.changeGw,
                      rules: [
                        {required: true,message: '变更职务不能为空'}
                      ],
                    })(
                      <Input disabled />,
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={'变更后人员'} {...formItemLayout}>
                    {getFieldDecorator('achangerId', {
                      rules: [{required: true,message: '请选择变更后人员'}],
                    })(
                      <TreeSelect
                        showSearch
                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                        allowClear
                        treeDefaultExpandAll
                        treeData={this.state.selectPeople}
                        disabled={this.state.assignFlag}
                        onSelect = {this.onSelectAchanger}
                      >
                      </TreeSelect>,
                    )}
                  </Form.Item>
                </Col>
              </Row>
            <Row>
            <Col span={12} key='changeTime'>
              <Form.Item label='变更日期' {...formItemLayout}>
                {getFieldDecorator("changeTime",{
                  rules: [
                    {
                      required: true,
                      message: '请选择日期',
                    },
                  ]
                })(
                  <DatePicker format='YYYY-MM-DD' style={{width:'100%'}}/>
                )}
              </Form.Item>
            </Col>
          </Row>     
              {/* <Row>
              <Col span={12}>
                  <Form.Item label={'合同编号'} {...formItemLayout}>
                    {getFieldDecorator('contractNumber', {
                    })(
                      <Input/>,
                    )}
                  </Form.Item>
                </Col>
                
              </Row> */}
              <Row>
              <Col span={24}>
                  <Form.Item label={'变更原因'} {...formItemLayout1}>
                    {getFieldDecorator('changeReason', {
                      rules: [],
                    })(
                      <TextArea rows={2} maxLength={666}/>,
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
