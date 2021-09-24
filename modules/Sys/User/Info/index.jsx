import React, { Component } from 'react';
import style from './style.less';
import { Form, Tabs, Row, Col, Input, Checkbox, Button, Icon, Select, DatePicker, TreeSelect } from 'antd';
import { connect } from 'react-redux';
import BasicInfo from "./BasicInfo"
export class UserInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
  
      userInfo: false,  // 控制点击用户信息的显隐
      info: {
        actuName: '',
        roleName: '',
        userLevel: '',
        sex: '',
        birth: null,
        entryDate: null,
        leaveDate: null,
        startDate: null,
        passExpirationDate: null,
        endDate: null,
        phone: '',
        email: '',
        status: '',
        sortNum: '',

      },
    };
  }

  componentDidMount() {
   
   
  }

  

  // 表单提交
  handleSubmit = (e) => {
    e.preventDefault();
    alert(1);
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.curdCurrentData({
          title: localStorage.getItem('name'),
          status: 'update',
          data: values,
        });
      }
    });
  };

  // 点击用户信息
  userInfoFuc = () => {
    this.setState({
      userInfo: !this.state.userInfo,
    });
  };

  render() {
    const { intl } = this.props.currentLocale
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
    const formLayout = {
      labelCol: {
        sm: { span: 4 },
      },
      wrapperCol: {
        sm: { span: 20 },
      },
    };
    return (
      <>
        <BasicInfo data={this.props.data} updateSuccess={this.props.updateSuccess} closeRightBox={this.props.closeRightBox}
            position={this.props.position} positionMap={this.props.positionMap}
            professional={this.props.professional} professionalMap={this.props.professionalMap}
            education={this.props.education} educationMap={this.props.educationMap}
        />
      </>
    );
  }
}

const UserInfos = Form.create()(UserInfo);
export default connect(state => ({ currentLocale: state.localeProviderData }))(UserInfos);


