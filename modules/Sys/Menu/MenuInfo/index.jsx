import React, { Component } from 'react';
import { Form, Row, Col, Input, Button, InputNumber, Select, DatePicker, Checkbox, message } from 'antd';
import { connect } from 'react-redux';
import moment from 'moment';
import { curdCurrentData } from '../../../../store/curdData/action';
import style from './style.less';
import { menuUpdate, menuGetById } from '../../../../api/api';
import axios from '../../../../api/axios';
import * as dataUtil from '../../../../utils/dataUtil'
import LabelFormLayout from "../../../../components/public/Layout/Labels/Form/LabelFormLayout"
import LabelFormButton from "../../../../components/public/Layout/Labels/Form/LabelFormButton"
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
    };
  }
  //获取菜单基本信息
  getData = (id) => {
    axios.get(menuGetById(id)).then(res => {

      this.setState({
        info: res.data.data,
        menucode: res.data.data.menuCode.substr(0, res.data.data.menuCode.length - res.data.data.shortCode.length)
      });
    });
  };

  componentDidMount() {
    this.props.data ? this.getData(this.props.data.id) : null;
    // let menuCode = this.props.data ?  this.props.data.menuCode : "";
    // this.setState({menuCode : menuCode});
  }

  handleSubmit = (e) => {
    e.preventDefault();

    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const data = {
          ...this.props.data,
          ...values,
          creatTime: dataUtil.Dates().formatTimeString(values.creatTime),
          lastUpdTime: dataUtil.Dates().formatTimeString(values.lastUpdTime),
          share: values.share ? 1 : 0,
          hidden: values.hidden ? 1 : 0,
          isMenu: values.isMenu ? 1 : 0,
          active: values.active ? 1 : 0,
        };

        // 更新菜单
        axios.put(menuUpdate, data, true, null, true).then(res => {

          // message.success('修改成功');
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
  // 代码改变，修改父节点编码
  codeChange = (e) => {
    const { menucode } = this.state
    this.props.form.setFieldsValue({ menuCode: menucode + e.target.value })
  }
  render() {
    const { intl } = this.props.currentLocale;
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
      <LabelFormLayout title={this.props.title} >
        <Form onSubmit={this.handleSubmit}>
          <Row type="flex">
            <Col span={12}>
              <Form.Item label={intl.get('wsd.i18n.sys.menu.menuname')} {...formItemLayout}>
                {getFieldDecorator('menuName', {
                  initialValue: this.state.info.menuName,
                  rules: [{
                    required: true,
                    message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.sys.menu.menuname')
                  }],
                })(
                  <Input maxLength={33} />,
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={intl.get('wsd.i18n.sys.menu.sortnum')} {...formItemLayout}>
                {getFieldDecorator('sort', {
                  initialValue: this.state.info.sort,
                  rules: [{
                    required: true,
                    message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.sys.menu.sortnum')
                  }],
                })(
                  <InputNumber min={1} max={999999} style={{ width: '100%' }} precision={0} step={0} />,
                )}
              </Form.Item>
            </Col>

          </Row>
          <Row>
            <Col span={12}>
              <Form.Item label={intl.get('wsd.i18n.sys.menu.menucode')} {...formItemLayout}>
                {getFieldDecorator('menuCode', {
                  initialValue: this.state.info.menuCode,
                  rules: [],
                })(
                  <Input disabled />,
                )}
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label={intl.get('wsd.i18n.sys.menu.shortcode')} {...formItemLayout}>
                {getFieldDecorator('shortCode', {
                  initialValue: this.state.info.shortCode,
                  rules: [{
                    required: true,
                    message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.sys.menu.shortcode')
                  },
                  {
                    pattern: /^[^\u4e00-\u9fa5]{0,}$/,
                    message: "不包含中文",
                  }],
                })(
                  <Input onChange={this.codeChange.bind(this)} maxLength={50} />,
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item label={intl.get('wsd.i18n.sys.menu.image')} {...formItemLayout}>
                {getFieldDecorator('image', {
                  initialValue: this.state.info.image,
                  rules: [{
                    required: true,
                    message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.sys.menu.image')
                  }],
                })(
                  <Input maxLength={66} />,
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={intl.get('wsd.i18n.sys.menu.url')} {...formItemLayout}>
                {getFieldDecorator('url', {
                  initialValue: this.state.info.url,
                  rules: [{
                    required: true,
                    message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.sys.menu.url')
                  }],
                })(
                  <Input maxLength={180} />,
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item label={intl.get('wsd.i18n.sys.menu.internation')} {...formItemLayout}>
                {getFieldDecorator('i18n', {
                  initialValue: this.state.info.i18n,
                  rules: [{
                    required: true,
                    message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.sys.menu.internation')
                  }],
                })(
                  <Input maxLength={33} />,
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={intl.get('wsd.i18n.sys.menu.menutype')} {...formItemLayout}>
                {getFieldDecorator('menuType', {
                  initialValue: this.state.info.menuType ? this.state.info.menuType.id : null,
                  rules: [{
                    required: true,
                    message: intl.get('wsd.i18n.message.select') + intl.get('wsd.i18n.sys.menu.menutype')
                  }],
                })(
                  <Select disabled>
                    <Option value={1}>组件</Option>
                    <Option value={2}>菜单</Option>
                    <Option value={4}>页签组</Option>
                    <Option value={3}>页签</Option>
                  </Select>,
                )}
              </Form.Item>
            </Col>

          </Row>
          <Row>
            <Col span={12}>
              <Form.Item label={intl.get('wsd.i18n.sys.menu.creattime')} {...formItemLayout}>
                {getFieldDecorator('creatTime', {
                  initialValue: dataUtil.Dates().formatDateMonent(this.state.info.creatTime),
                  rules: [],
                })(
                  <DatePicker style={{ width: '100%' }} disabled />,
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={intl.get('wsd.i18n.sys.menu.lastuptime')} {...formItemLayout}>
                {getFieldDecorator('lastUpdTime', {
                  initialValue: dataUtil.Dates().formatDateMonent(this.state.info.lastUpdTime),
                  rules: [],
                })(
                  <DatePicker style={{ width: '100%' }} disabled />,
                )}
              </Form.Item>
            </Col>

          </Row>
          <Row>
            <Col span={12}>
              <Form.Item label={intl.get('wsd.i18n.plan.plandefine.creator')} {...formItemLayout}>
                {/* 创建人 */}
                {getFieldDecorator('creator', {
                  initialValue: this.state.info.creator,
                  rules: [],
                })(
                  <Input disabled />
                )}
              </Form.Item>
            </Col>
            {this.props.data.menuType.id == 2 &&
            <Col span={12}>
              <Form.Item label="组名" {...formItemLayout}>
                {getFieldDecorator('groupName', {
                  initialValue: this.state.info.groupName,
                  rules: [],
                })(
                  <Input maxLength={33} />,
                )}
              </Form.Item>
            </Col>
            }
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item label={intl.get('wsd.i18n.sys.menu.desc')} {...formItemLayout1}>
                {getFieldDecorator('menuDesc', {
                  initialValue: this.state.info.menuDesc,
                  rules: [],
                })(
                  <TextArea rows={2} maxLength={66} />,
                )}
              </Form.Item>
            </Col>
          </Row>

          <Col span={12}>
            <Form.Item label={intl.get('wsd.i18n.sys.menu.active')} {...formItemLayout}>
              {getFieldDecorator('active', {
                valuePropName: 'checked',
                initialValue: this.state.info.active,

                rules: [],
              })(
                <Checkbox>{intl.get('wsd.i18n.sys.menu.activationdesc')}</Checkbox>,
              )}
            </Form.Item>
          </Col>
          {this.props.data.menuType.id == 2 &&
            <Col span={12}>
              <Form.Item label={intl.get('wsd.i18n.sys.menu.ismenu')} {...formItemLayout}>
                {getFieldDecorator('isMenu', {
                  valuePropName: 'checked',
                  initialValue: this.state.info.isMenu,

                  rules: [],
                })(
                  <Checkbox>菜单栏显示</Checkbox>,
                )}
              </Form.Item>
            </Col>
          }

          <Col span={12}>
            <Form.Item label={intl.get('wsd.i18n.sys.menu.share')} {...formItemLayout}>
              {getFieldDecorator('share', {
                valuePropName: 'checked',
                initialValue: this.state.info.share,
                rules: [],
              })(
                <Checkbox>{intl.get('wsd.i18n.sys.menu.isshare')}</Checkbox>,
              )}
            </Form.Item>
          </Col>

        </Form>
        <LabelFormButton>
          <Button className="globalBtn" onClick={this.props.closeRightBox} style={{ marginRight: 20 }}>取消</Button>
          <Button className="globalBtn" onClick={this.handleSubmit} type="primary">保存</Button>

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
// {
//             "wsd.i18n.sys.menu.menuname":"名称",
//             "wsd.i18n.sys.menu.menucode":"代码",
//             "wsd.i18n.sys.menu.sortnum":"排序编号",
//             "wsd.i18n.sys.menu.shortcode":"简码",
//             "wsd.i18n.sys.menu.url":"地址",
//             "wsd.i18n.sys.menu.image":"图标",
//             "wsd.i18n.sys.menu.menutype":"类型",
//             "wsd.i18n.sys.menu.hidden":"隐藏",
//             "wsd.i18n.sys.menu.internation":"国际化",
//             "wsd.i18n.sys.menu.ismenu":"菜单",
//             "wsd.i18n.sys.menu.active":"激活",
//     }
