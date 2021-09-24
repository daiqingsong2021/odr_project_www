import React, { Component } from 'react';
import { Form, Row, Col, Input, Button, InputNumber, Select, DatePicker, Checkbox, message } from 'antd';
import { connect } from 'react-redux';
import moment from 'moment';
import { curdCurrentData } from '../../../../../../store/curdData/action';
import style from './style.less';
import {getBaseSelectTree,getCertGl,updateCertGl} from '../../../../api/suzhou-api';
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
      optionCerttype:[],
    };
  }
  //获取菜单基本信息
  getData = (id) => {
    axios.get(getCertGl(id)).then(res => {
      this.setState({
        info: res.data.data,
      });
    });
  };
  componentDidMount() {
    this.props.data ? this.getData(this.props.data.id) : null;
    axios.get(getBaseSelectTree("szxm.rygl.certtype")).then((res)=>{
      this.setState({
        optionCerttype:res.data.data
      })
    });
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const data = {
          ...values,
          id:this.props.data.id
        };
        // 更新菜单
        axios.put(updateCertGl, data, true).then(res => {
          this.props.curdCurrentData({
            data: res.data.data
          });
          this.props.updateSuccess(res.data.data);
          // this.props.closeRightBox();
        });
      }
    });
  };
  // 代码改变，修改父节点编码
  
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
      <LabelFormLayout title="基本信息">
      <Form onSubmit={this.handleSubmit} className={style.mainScorll}>
              <Row type="flex">
                <Col span={12}>
                  <Form.Item label={'证书名称'} {...formItemLayout}>
                    {getFieldDecorator('certName', {
                      initialValue: this.state.info.certName,
                      rules: [{ required: true ,message:"请输入证书名称"}],
                    })(
                      <Input />,
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={"查询网址"} {...formItemLayout}>
                    {getFieldDecorator('certVerifyUrl', {
                      initialValue: this.state.info.certVerifyUrl,
                      rules: [],
                    })(
                      <Input />,
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Form.Item label={'提前预警天数'} {...formItemLayout}>
                    {getFieldDecorator('warnPeriod', {
                      initialValue: this.state.info.warnPeriod,
                      rules: [{ required: true ,message:"请输入提前预警天数"}],
                    })(
                      <InputNumber style={{width:"100%"}} />,
                    )}
                  </Form.Item>
                </Col>
              </Row>
          </Form>
          <LabelFormButton>
              <Button onClick={this.props.closeRightBox} style={{ width: "100px" }}>取消</Button>
              <Button onClick={this.handleSubmit} style={{ width: "100px", marginLeft: "20px" }} 
              disabled={this.props.permission.indexOf('WORKTYPE_EDIT-CERTIFICATE')==-1?true:false} type="primary">保存</Button>
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

