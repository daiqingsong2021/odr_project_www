import React, { Component } from 'react';
import { Form, Row, Col, Input,Icon, Button, InputNumber, Select, DatePicker, Checkbox, message } from 'antd';
import { connect } from 'react-redux';
import moment from 'moment';
import { curdCurrentData } from '../../../../../../store/curdData/action';
import style from './style.less';
import { menuUpdate, menuGetById,updatePorjInfo,getProjInfo,getBaseSelectTree} from '../../../../api/suzhou-api';
import axios from '../../../../../../api/axios';
import MapAdd from '@/modules/Suzhou/components/Map'
import MyIcon from "@/components/public/TopTags/MyIcon"
const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
//菜单管理-基本信息
class MenuInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initDone: false,
      isShowMap:false,
      info: {},
      optionClassification:[],
      optionCompany:[]
      
    };
  }
  //获取菜单基本信息
  getData = (id) => {
    // 请求获取info数据
    axios.get(getProjInfo(id)).then(res => {
      this.setState({
        info: res.data.data,
      });
    });
  };
  componentDidMount() {
    this.props.data ? this.getData(this.props.data.id) : null;
    let menuCode = this.props.data ?  this.props.data.menuCode : "";
    this.setState({menuCode : menuCode});
    axios.get(getBaseSelectTree("base.org.type")).then((res)=>{
      this.setState({
        optionCompany:res.data.data
      })
    });
    axios.get(getBaseSelectTree("base.org.classification")).then((res)=>{
      this.setState({
        optionClassification:res.data.data
      });
    })
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
        axios.put(updatePorjInfo, data, true).then(res => {
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
  //查看地图
  viewMap = (val)=>{
    this.setState({
      isShowMap: true,
      address:this.input.props.value
    });
  }
  //关闭地图
  closeMapAdd=(v)=>{
    this.setState({
      isShowMap:false
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
      <div className={style.main}>
        <div className={style.mainHeight}>
          <h3 className={style.listTitle}>基本信息</h3>
          <Form onSubmit={this.handleSubmit} className={style.mainScorll}>
            <div className={style.content}>
              <Row type="flex">
                <Col span={12}>
                  <Form.Item label={'标段号'} {...formItemLayout}>
                    {getFieldDecorator('sectionCode', {
                      initialValue: this.state.info.sectionCode,
                      rules: [],
                    })(
                      <Input disabled />,
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={'单位名称'} {...formItemLayout}>
                    {getFieldDecorator('orgName', {
                      initialValue: this.state.info.orgName,
                      rules: [{ required: true ,message:"请输入单位名称"}],
                    })(
                      <Input disabled = {this.state.info.parentId == 0? true :false} />,
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Form.Item label={'单位类型'} {...formItemLayout}>
                    {getFieldDecorator('orgType', {
                      initialValue:!this.state.info.orgTypeVo || !this.state.info.orgTypeVo.code?"":this.state.info.orgTypeVo.code.toString(),
                      rules: [{ required: true }],
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
                <Col span={12}>
                  <Form.Item label={'单位分类'} {...formItemLayout}>
                    {getFieldDecorator('orgCategory', {
                      initialValue:!this.state.info.orgCategoryVo || !this.state.info.orgCategoryVo.code?"":this.state.info.orgCategoryVo.code.toString(),
                      rules: [],
                    })(
                      <Select disabled = {this.state.info.parentId == 0? true :false}>
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
              </Row>
              <Row>
                <Col span={12}>
                  <Form.Item label={'标段名称'} {...formItemLayout}>
                    {getFieldDecorator('sectionName', {
                      initialValue: this.state.info.sectionName,
                      rules: [],
                    })(
                      <Input disabled />,
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={'标段类型'} {...formItemLayout}>
                    {getFieldDecorator('sectionType', {
                      initialValue: this.state.info.sectionType,
                      rules: [],
                    })(
                      <Input disabled />,
                    )}
                  </Form.Item>
                </Col>

              </Row>
              <Row>
                <Col span={12}>
                  <Form.Item label={'项目部名称'} {...formItemLayout}>
                    {getFieldDecorator('projUnitName', {
                      initialValue: this.state.info.projUnitName,
                      rules: [],
                    })(
                      <Input />,
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={'法人代表'} {...formItemLayout}>
                    {getFieldDecorator('corporationer', {
                      initialValue: this.state.info.corporationer,
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
                      initialValue: this.state.info.projUnitAddress,
                      rules: [],
                    })(
                      <Input suffix={!this.state.info.projUnitAddress?null:<MyIcon type="icon-gongsi"  onClick={this.viewMap.bind(this)}  style={{ color: 'rgba(0,0,0,.25)',fontSize:18 }} />} ref={input => this.input = input}/>
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={'分管项目部领导'} {...formItemLayout}>
                    {getFieldDecorator('leader', {
                      initialValue: this.state.info.leader,
                      rules: [],
                    })(
                      <Input />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Form.Item label={'责任人电话'} {...formItemLayout}>
                    {getFieldDecorator('telPhone', {
                      initialValue: this.state.info.telPhone,
                      rules: [],
                    })(
                      <InputNumber style={{width:"100%"}} />
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={'技术代表'} {...formItemLayout}>
                    {getFieldDecorator('artisan', {
                      initialValue: this.state.info.artisan,
                      rules: [],
                    })(
                      <Input />
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}></Col>
              </Row>
              <Row>
                <Col span={24}>
                  <Form.Item label={'备注'} {...formItemLayout1}>
                    {getFieldDecorator('remark', {
                      initialValue: this.state.info.remark,
                      rules: [],
                    })(
                      <TextArea rows={2} />,
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item wrapperCol={{ offset: 4 }}>
                <Button
                  className="globalBtn"
                  onClick={this.handleSubmit}
                  style={{ marginRight: 20 }}
                  type="primary"
                  disabled={this.props.permission.indexOf('PROJINFO_EDIT-BASIC-INFO')==-1}
                >保存
                </Button>
                <Button className="globalBtn" onClick={this.props.closeRightBox}>取消</Button>
              </Form.Item>
            </div>

          </Form>
          {/* 显示地图 */}
          {this.state.isShowMap && 
            <MapAdd 
              modalVisible = {this.state.isShowMap}
              address = {this.state.address}
              title={'位置'}
              handleCancel = {this.closeMapAdd}
            />
          }
        </div>
      </div>
    );
  }
}

const MenuInfos = Form.create()(MenuInfo);
export default connect(state => ({
  currentLocale: state.localeProviderData
}), {
    curdCurrentData,
  })(MenuInfos);

