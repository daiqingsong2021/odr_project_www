import React, { Component } from 'react';
import {Modal,Form,Row,Col,Input,Button,Icon,Select,DatePicker,Slider,InputNumber,message,Checkbox,TreeSelect} from 'antd';
import style from './style.less';
import intl from 'react-intl-universal';
import { connect } from 'react-redux';
import { curdCurrentData } from '../../../../../../store/curdData/action';
import axios from '../../../../../../api/axios';
import {getBaseSelectTree,getsectionId} from '../../../../api/suzhou-api';
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
      optionCertCategory:[],
      selectSection:""
    };
  }
  componentDidMount() {
    if(!this.props.projectId){

    }else{
      axios.get(getsectionId(this.props.projectId)).then(res=>{
        this.getSelectTreeArr(res.data.data,{"id":"value","name":"title"});
        this.setState({
          selectSection:res.data.data
        })
      })
    }
    axios.get(getBaseSelectTree("szxm.rygl.certtype")).then((res)=>{
      this.setState({
        optionCertCategory:res.data.data
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
      if (!err) {
        if (val == 'save') {
          // this.props.handleCancel();
          this.props.submit(values, 'save' );
        } else {
          this.props.submit(values, 'goOn' );
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
                  <Form.Item label={"证书名称"} {...formItemLayout}>
                    {getFieldDecorator('certName', {
                      rules: [{
                        required: true,
                        message: '请正确输入证书名称'
                      }],
                    })(
                      <Input />,
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={"查询网址"} {...formItemLayout}>
                    {getFieldDecorator('certVerifyUrl', {
                      rules: [{
                        required: true,
                        message: '请争取输入查询网址'
                      }],
                    })(
                      <Input />
                    )}
                  </Form.Item>
                </Col>

              </Row>
              <Row>
                <Col span={12}>
                  <Form.Item label={"提前预警天数"} {...formItemLayout}>
                    {getFieldDecorator('warnPeriod', {
                      rules:[{
                        required: true,
                        message:'请正确输入提前预警天数',
                        pattern: /^[0-9]*$/
                      }],
                    })(
                      <InputNumber style={{width:"100%"}} />,
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
