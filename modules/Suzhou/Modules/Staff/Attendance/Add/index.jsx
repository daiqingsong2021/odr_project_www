import React, { Component } from 'react';
import {
  Modal,
  Form,
  Row,
  Col,
  Input,
  Button,
  Icon,
  Select,
  Radio,
  DatePicker,
  Slider,
  InputNumber,
  message,
  Checkbox,
  TreeSelect,
} from 'antd';
import style from './style.less';
import intl from 'react-intl-universal';
import { connect } from 'react-redux';
import { curdCurrentData } from '@/store/curdData/action';
import axios from '@/api/axios';
import { getsectionId, calendarList } from '@/modules/Suzhou/api/suzhou-api';
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
      selectSection: '',
      sectionFlag: false,
      calendarList: [],
    };
  }
  componentDidMount() {
    const lastOpenProject = JSON.parse(localStorage.getItem('lastOpenProject') || '{}');
    if (!lastOpenProject.projectId) {
    } else {
      this.setState({
        projectId: lastOpenProject.projectId,
      });
      axios.get(getsectionId(lastOpenProject.projectId)).then(res => {
        this.getSelectTreeArr(res.data.data, { id: 'value', name: 'title' });
        this.setState({
          selectSection: res.data.data,
        });
      });
    }
    axios.get('api/base/calendar/list').then(res => {
      if (res.data.data) {
        this.setState({
          calendarList: res.data.data,
        });
      }
    });
  }
  getSelectTreeArr = (array, keyMap) => {
    if (array) {
      array.forEach((item, index, arr) => {
        var obj = item;
        for (var key in obj) {
          var newKey = keyMap[key];
          if (newKey) {
            obj[newKey] = obj[key];
          }
        }
        this.getSelectTreeArr(item.children, keyMap);
      });
    }
  };
  //新增提交
  handleSubmit = (val, e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const data = {
          ...values,
        };
        if (val == 'save') {
          // this.props.handleCancel();
          // this.props.submit(data, 'save' );
        } else {
          // this.props.submit(values, 'goOn' );
          this.props.form.resetFields();
        }
      }
    });
  };
  onChange = (value, lbale, extra) => {};
  onChangeSection = (val, info, e) => {
    this.setState({
      sectionName: info.props.title,
    });
  };
  onChangeSetting = e => {
    if (e.target.value == '2') {
      this.setState({
        sectionFlag: true,
      });
    } else {
      this.setState({
        sectionFlag: false,
      });
    }
  };
  render() {
    const { intl } = this.props.currentLocale;
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
        <Modal
          className={style.main}
          width="850px"
          afterClose={this.props.form.resetFields}
          mask={false}
          maskClosable={false}
          footer={
            <div className="modalbtn">
              {/* 保存并继续 */}
              <Button key={1} onClick={this.handleSubmit.bind(this, 'goOn')}>
                {intl.get('wsd.global.btn.saveandcontinue')}
              </Button>
              {/* 保存 */}
              <Button key={2} onClick={this.handleSubmit.bind(this, 'save')} type="primary">
                {intl.get('wsd.global.btn.preservation')}
              </Button>
            </div>
          }
          centered={true}
          title={this.state.modalInfo.title}
          visible={this.props.modalVisible}
          onCancel={this.props.handleCancel}
        >
          <Form onSubmit={this.handleSubmit} className={style.mainScorll}>
            <div className={style.content}>
              <Row type="flex">
                <Col span={12}>
                  <Form.Item label={'设置'} {...formItemLayout}>
                    {getFieldDecorator('name1', {
                      initialValue: '1',
                      rules: [{ required: true, message: '请选择变更单位' }],
                    })(
                      <Radio.Group onChange={this.onChangeSetting}>
                        <Radio value={'1'}>全局设置</Radio>
                        <Radio value={'2'}>标段设置</Radio>
                      </Radio.Group>
                    )}
                  </Form.Item>
                </Col>
                <Col span={12} style={{ display: this.state.sectionFlag ? 'block' : 'none' }}>
                  <Form.Item label={'标段名称'} {...formItemLayout}>
                    {getFieldDecorator('sectionId', {
                      rules: [{ required: true, message: '请选择标段名称' }],
                    })(
                      <TreeSelect
                        showSearch
                        value={this.state.value}
                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                        allowClear
                        treeDefaultExpandAll
                        onSelect={this.onChangeSection}
                        treeData={this.state.selectSection}
                      />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Form.Item label={'管理人员'} {...formItemLayout}>
                    {getFieldDecorator('name2', {
                      initialValue: '1',
                      rules: [{ required: true, message: '请输入变更岗位' }],
                    })(
                      <Radio.Group>
                        <Radio value={'1'}>考勤</Radio>
                        <Radio value={'2'}>不考勤</Radio>
                      </Radio.Group>
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={'劳务人员'} {...formItemLayout}>
                    {getFieldDecorator('name3', {
                      initialValue: '1',
                      rules: [{ required: true, message: '请选择变更后人员' }],
                    })(
                      <Radio.Group>
                        <Radio value={'1'}>考勤</Radio>
                        <Radio value={'2'}>不考勤</Radio>
                      </Radio.Group>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Form.Item label={'考勤日历'} {...formItemLayout}>
                    {getFieldDecorator('name4', {
                      rules: [{ required: true, message: '请选择考勤日历' }],
                    })(
                      <Select>
                        {this.state.calendarList.length &&
                          this.state.calendarList.map((item, i) => {
                            return (
                              <Option key={item.id} value={item.id}>
                                {item.calName}
                              </Option>
                            );
                          })}
                      </Select>
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
