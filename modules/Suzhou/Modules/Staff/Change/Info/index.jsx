import React, { Component } from 'react';
import { Form, Row, Col, Input, Button, InputNumber, Select, DatePicker, Checkbox, message,TreeSelect } from 'antd';
import { connect } from 'react-redux';
import moment from 'moment';
import { curdCurrentData } from '../../../../../../store/curdData/action';
import style from './style.less';
import { updatePeopleChange,getPeopleChange,getBaseSelectTree,getOrgPeopleList} from '../../../../api/suzhou-api';
import axios from '../../../../../../api/axios';
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
    axios.get(getPeopleChange(id)).then(res => {
      this.setState({
        info: res.data.data,
        projectId:res.data.data.projectId,
        sectionId:res.data.data.sectionId,
        achangerId:res.data.data.achangerId,
        bchangerId:res.data.data.bchangerId
      });
      axios.get(getOrgPeopleList+`?projectId=${res.data.data.projectId}&sectionIds=${res.data.data.sectionId}&type=0&status=1`).then(res => {
        this.getSelectTreeArr2(res.data.data,{"id":"value","name":"title"});
        this.setState({
          selectPeople: res.data.data
        })
      })
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
        const data = {
          ...values,
          projInfoId:this.props.data.projInfoId,
          sectionId:this.props.data.sectionId,
          id:this.props.data.id,
          achanger:this.state.info.achanger,
          bchanger:this.state.info.bchanger,
          bchangerId:this.props.data.bchangerId,
          achangerId:this.props.data.achangerId,
        };
        // 更新菜单
        axios.put(updatePeopleChange, data, true).then(res => {
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
    };
    this.props.data.bchangerId = info.props.id;
    this.props.data.projInfoId = info.props.projInfoId
    this.setState({
      info:data,
    })
  }
  //选择 变更后人员
  onSelectAchanger = (selectedKeys, info,e) => {
    const data={
      ...this.state.info,
      achanger:info.props.name
    }
    this.props.data.achangerId = info.props.id
    this.setState({
      info:data,
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
                  <Form.Item label={'标段名称'} {...formItemLayout}>
                    {getFieldDecorator('sectionName', {
                      initialValue: this.state.info.sectionName,
                      rules: [],
                    })(
                      <Input disabled/>,
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={'变更前人员'} {...formItemLayout}>
                    {getFieldDecorator('bchangerId', {
                      initialValue: this.state.info.bchanger,
                      rules: [],
                    })(
                      <TreeSelect
                        showSearch
                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                        allowClear
                        treeDefaultExpandAll
                        treeData={this.state.selectPeople}
                        onSelect= {this.onSelect}
                        disabled = {((this.props.rightData.statusVo &&this.props.rightData.statusVo.code == 'INIT') || ( this.props.taskFlag))?false:true}
                      >
                      </TreeSelect>,
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Form.Item label={'变更单位'} {...formItemLayout}>
                    {getFieldDecorator('orgName', {
                      initialValue: this.state.info.orgName,
                      rules: [{ required: true }],
                    })(
                      <Input disabled/>,
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={'变更职务'} {...formItemLayout}>
                    {getFieldDecorator('changeGw', {
                      initialValue: this.state.info.changeGw,
                      rules: [],
                    })(
                      <Input disabled />,
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Form.Item label={'变更后人员'} {...formItemLayout}>
                    {getFieldDecorator('achangerId', {
                      initialValue: this.state.info.achanger,
                      rules: [],
                    })(
                      <TreeSelect
                        showSearch
                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                        allowClear
                        treeDefaultExpandAll
                        treeData={this.state.selectPeople}
                        onSelect = {this.onSelectAchanger}
                        disabled = {((this.props.rightData.statusVo &&this.props.rightData.statusVo.code == 'INIT') || (this.props.taskFlag))?false:true}
                      >
                      </TreeSelect>,
                    )}
                  </Form.Item>
                </Col>
                <Col span={12} key='changeTime'>
                  <Form.Item label='变更日期' {...formItemLayout}>
                    {getFieldDecorator("changeTime",{
                      initialValue: this.state.info.changeTime,
                      rules: [
                        {
                          required: true,
                          message: '请选择日期',
                        },
                      ]
                    })(
                      <Input disabled/>
                    )}
                  </Form.Item>
                </Col>
                {/* <Col span={12}>
                  <Form.Item label={'合同编号'} {...formItemLayout}>
                    {getFieldDecorator('contractNumber', {
                      initialValue: this.state.info.contractNumber,
                      rules: [],
                    })(
                      <Input disabled = {((this.props.rightData.statusVo &&this.props.rightData.statusVo.code == 'INIT') || (this.props.taskFlag))?false:true} />,
                    )}
                  </Form.Item>
                </Col> */}
              </Row>
              <Row>
                <Col span={24}>
                  <Form.Item label={'变更原因'} {...formItemLayout1}>
                    {getFieldDecorator('changeReason', {
                      initialValue: this.state.info.changeReason,
                      rules: [],
                    })(
                      <TextArea rows={2} maxLength={666}  disabled = {((this.props.rightData.statusVo &&this.props.rightData.statusVo.code == 'INIT') || (this.props.taskFlag))?false:true}/>,
                    )}
                  </Form.Item>
                </Col>
              </Row>
          </Form>
          <LabelFormButton>
              <Button onClick={this.props.closeRightBox} style={{ width: "100px" }}>取消</Button>
              <Button onClick={this.handleSubmit} style={{ width: "100px", marginLeft: "20px" }} 
              disabled = {((this.props.rightData.statusVo &&this.props.rightData.statusVo.code == 'INIT') || (this.props.taskFlag))?(this.props.permission.indexOf('CHANGE_EDIT-PERSON-CHANGE')==-1?true:false):true} type="primary">保存</Button>
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

