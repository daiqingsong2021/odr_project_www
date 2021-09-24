import React, { Component } from 'react';
import {Modal,Form,Row,Col,Input,Button,Icon,Select,DatePicker,Slider,InputNumber,message,Checkbox,TreeSelect} from 'antd';
import style from './style.less';
import intl from 'react-intl-universal';
import { connect } from 'react-redux';
import { curdCurrentData } from '../../../../../../store/curdData/action';
import axios from '../../../../../../api/axios';
import { menuAdd,getBaseSelectTree,getsectionId} from '../../../../api/suzhou-api';
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
      info:'',
      sectionId:'',
    };
  }
  componentDidMount() {
    axios.get(getsectionId(this.props.projectId)).then(res=>{
      this.getSelectTreeArr(res.data.data,{"id":"value","name":"title"});
      this.setState({
        selectSection:res.data.data
      })     
      if (this.state.selectSection.length > 0) {
        const { id , code} = this.state.selectSection[0];
        this.props.form.setFieldsValue({ sectionId: id });
        this.setState({
          sectionId: code,
        });
      }
    })
    if(this.props.record){
      this.setState({
        info:this.props.record
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
  //新增提交
  handleSubmit = (val, e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      const data = {
        ...values,
        sectionId:this.props.record.sectionId
      }
      if (!err) {
        if (val == 'save') {
          // this.props.handleCancel();
          this.props.submit(data, 'save' );
        } else {
          this.props.submit(data, 'goOn' );
          this.props.form.resetFields();
        }

      }
    });
  };
  onChange = (value, lbale, extra) => {
  };
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
                    {getFieldDecorator('sectionName', {
                      initialValue:this.state.info.sectionName,
                      rules: [{required: true,message: '请输入标段号'}],
                    })(
                      <TreeSelect
                        showSearch
                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                        allowClear
                        treeDefaultExpandAll
                        treeData={this.state.selectSection}
                        onChange={this.onChange}
                        disabled
                      >
                      </TreeSelect>,
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="标段号" {...formItemLayout}>
                      <Input disabled={true} value={this.state.info.sectionCode} />
                    </Form.Item>
                  </Col>
                
                
              </Row>
              <Row>
              <Col span={12}>
                  <Form.Item label={'单位名称'} {...formItemLayout}>
                    {getFieldDecorator('orgName', {
                      rules: [{
                        required: true,
                        message: '请输入单位名称'
                      }],
                    })(
                      <Input />,
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={'单位类型'} {...formItemLayout}>
                    {getFieldDecorator('orgType', {
                      initialValue:this.state.info.orgTypeVo?this.state.info.orgTypeVo.code.toString():"2",
                      rules:[{required: true, message:'请输入单位类型'}],
                    })(
                      <Select disabled>
                        {
                          this.state.optionCompany.length && this.state.optionCompany.map((item,i) => {
                            return (
                              <Option style={{display:`${item.value==1?'none':'block'}`}} key={item.value} value={item.value}>{item.title}</Option>
                            )
                          })
                        }
                      </Select>,
                    )}
                  </Form.Item>
                </Col>
                
                
              </Row>
              <Row>
              <Col span={12}>
                  <Form.Item label={'单位分类'} {...formItemLayout}>
                    {getFieldDecorator('orgCategory', {
                      initialValue:!this.state.info.orgCategoryVo || !this.state.info.orgCategoryVo.code?"1":this.state.info.orgCategoryVo.code.toString(),
                      rules: [],
                    })(
                      <Select>
                        {
                          this.state.optionClassification.length && this.state.optionClassification.map((item,i) => {
                            return (
                              <Option style={{display:`${item.value==5?'none':'block'}`}} key={item.value} value={item.value}>{item.title}</Option>
                            )
                          })
                        }
                      </Select>,
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={'项目部名称'} {...formItemLayout}>
                    {getFieldDecorator('projUnitName', {
                      rules: [],
                    })(
                      <Input />,
                    )}
                  </Form.Item>
                </Col>
                
              </Row>
              <Row>
              <Col span={12}>
                  <Form.Item label={'法人代表'} {...formItemLayout}>
                    {getFieldDecorator('corporationer', {
                      rules: [],
                    })(
                      <Input />
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={'分管项目部领导'} {...formItemLayout}>
                    {getFieldDecorator('leader', {
                      rules: [],
                    })(
                      <Input />,
                    )}
                  </Form.Item>
                </Col>
                
              </Row>
              <Row>
              <Col span={12}>
                  <Form.Item label={'联系方式'} {...formItemLayout}>
                    {getFieldDecorator('telPhone', {
                      rules: [{
                        message:'请输入正确的联系方式',
                        pattern: /^(1[34578]\d{9})|(1[3|4|5|6|7|8|9][0-9]\d{8})|((400)-?(\d{3})-?(\d{4}))$/
                      }],
                    })(
                      <InputNumber style={{width:"100%"}} />,
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={'技术代表'} {...formItemLayout}>
                    {getFieldDecorator('artisan', {
                      rules: [],
                    })(
                      <Input />,
                    )}
                  </Form.Item>
                </Col>
                
              </Row>
              <Row>
              <Col span={12}>
                  <Form.Item label={'项目部地址'} {...formItemLayout}>
                    {getFieldDecorator('projUnitAddress', {
                      rules: [],
                    })(
                      <Input placeholder="请输入项目部地址" />,
                    )}
                  </Form.Item>
                </Col>
                </Row>
              <Row>
                <Col span={24}>
                  <Form.Item label={'备注'} {...formItemLayout1}>
                    {getFieldDecorator('remark', {
                      rules: [],
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
