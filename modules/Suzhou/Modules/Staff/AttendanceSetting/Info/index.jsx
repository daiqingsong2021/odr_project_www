import React, { Component } from 'react';
import { Form, Row, Col, Input, Button, InputNumber, Select, DatePicker, Checkbox, message,Radio} from 'antd';
import { connect } from 'react-redux';
import moment from 'moment';
import { curdCurrentData } from '../../../../../../store/curdData/action';
import style from './style.less';
import {getKqConfig,updateKqConfig} from '../../../../api/suzhou-api';
import axios from '../../../../../../api/axios';
import * as dataUtil from "../../../../../../utils/dataUtil"
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
      calendarList:[],
    };
  }
  //获取菜单基本信息
  getData = (id) => {
    // 请求获取info数据
    axios.get(getKqConfig(id)).then(res => {
      this.setState({
        info: res.data.data,
      });
    });
    // this.setState({
    //   info:this.props.rightData,
    // });
  };
  componentDidMount() {
    this.props.data ? this.getData(this.props.data.id) : null;
    axios.get('api/base/calendar/list').then(res => {
      if (res.data.data) {
        this.setState({
          calendarList: res.data.data
        })
      }
    })
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const data = {
          ...values,
          id:this.props.data.id,
          type:this.props.data.type,
          sectionId:this.props.data.sectionId
        };
        // 更新菜单
        axios.put(updateKqConfig, data, true).then(res => {
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
  codeChange = (e) => {
    if (this.props.data) {
      let parentId = this.props.data.parentId;

      if(parentId == 0){
        this.setState({
          menuCode: `${e.target.value}`
        })
      }else{
        let parent = this.props.itemMaps[parentId];
        if(parent){
          let parentCode = parent.menuCode;
          this.setState({
            menuCode: `${parentCode }-${e.target.value}`
          })
        }
      }
    }
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
                  <Form.Item label={'标段号'} {...formItemLayout}>
                    {getFieldDecorator('sectionCode', {
                      initialValue: this.state.info.sectionCode,
                      rules: [{ 
                        required: true,
                        message:'请输入姓名',
                      }],
                    })(
                      <Input disabled/>,
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={'标段名称'} {...formItemLayout}>
                    {getFieldDecorator('sectionName', {
                      initialValue: this.state.info.sectionName,
                      rules: [{
                        message:'请输入人员类型',
                      }],
                    })(
                      <Input disabled/>,
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Form.Item label={'管理人员是否考勤'} {...formItemLayout}>
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
                  <Form.Item label={'劳务人员是否考勤'} {...formItemLayout}>
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
              </Row>
              <Row>
                <Col span={12}>
                  <Form.Item label={'考勤日历'} {...formItemLayout}>
                    {getFieldDecorator('calenderId', {
                      initialValue: this.state.info.calenderId?parseInt(this.state.info.calenderId):'',
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
          </Form>
            <LabelFormButton>
              <Button onClick={this.props.closeRightBox} style={{ width: "100px" }}>取消</Button>
              <Button onClick={this.handleSubmit} style={{ width: "100px", marginLeft: "20px" }} 
              disabled={this.props.permission.indexOf('ATTENDANCESETTING_EDIT-ATTENDANCE')==-1?true:false} type="primary">保存</Button>
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

