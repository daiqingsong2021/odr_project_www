// 新增用户弹窗组件
import React, {Component} from 'react';
import style from './style.less';
import intl from 'react-intl-universal';
import {Modal, Tabs, Select, Form, Row, Col, Input, Checkbox, Button, Icon, DatePicker} from 'antd';
import UserInfo from './../../User/Info';
import {connect} from 'react-redux';
import axios from '../../../../api/axios'
import {addUser, updateUserInfo} from "../../../../api/api";
import {curdCurrentData} from '../../../../store/curdData/action';
import Basic from './basic'
import Detail from './detail'

const TabPane = Tabs.TabPane;
const Option = Select.Option;
const {TextArea} = Input;
const FormItem = Form.Item;
const locales = {
  'en-US': require('../../../../api/language/en-US.json'),
  'zh-CN': require('../../../../api/language/zh-CN.json'),
};

export class AddStaffModel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initDone: false,
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
    this.loadLocales();
  }

  loadLocales() {
    intl.init({
      currentLocale: 'zh-CN',
      locales,
    })
      .then(() => {
        // After loading CLDR locale data, start to render
        this.setState({initDone: true});
      });
  }


  // 点击用户信息
  userInfoFuc = () => {
    this.setState({
      userInfo: !this.state.userInfo,
    });
  };
  //提交基本信息
  submitBasic = (data, type) => {
    data['orgId'] = this.props.rightData.id
    if (this.props.submit == 'add') {
      axios.post(addUser, data).then(res => {
        this.props.addUser(res.data.data, type)
      })
    } else {
      axios.put(updateUserInfo, data).then(res => {
          this.props.updateUser(res.data.data)
      })
    }
  }
  //提交详细信息
  submitDetail = () => {

  }

  render() {
    const {
      getFieldDecorator, getFieldsError, getFieldError, isFieldTouched,
    } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 8},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 16},
      },
    };
    const formLayout = {
      labelCol: {
        sm: {span: 4},
      },
      wrapperCol: {
        sm: {span: 20},
      },
    };
    return (
      <div>
        <Modal title={this.props.title}
               bodyStyle={{padding: '5px'}}
               visible={this.props.staffModelShow}
               onCancel={this.props.onCancel}
               footer={<div className="modalbtn">
               </div>}
               width="850px"
               centered={true}
               className={style.main}
               mask={false}
               maskClosable={false}
        >
          <div className={style.userinfo}>
            {/* <Tabs type="card" tabBarStyle={{position: 'relative', top: '1px'}}> */}
              {/* <TabPane tab="基本信息" key="1"> */}
                <Basic submitBasic={this.submitBasic} submit={this.props.submit} rightData={this.props.rightData} selectData={this.props.selectData} handleCancel={this.props.onCancel}/>
              {/* </TabPane> */}
              {/* <TabPane tab="详细信息" key="2">
                <Detail submitDetail={this.submitDetail} submit={this.props.submit} rightData={this.props.rightData} selectData={this.props.selectData}/>
              </TabPane> */}
            {/* </Tabs> */}
          </div>

        </Modal>
      </div>
    );
  }
}

const AddStaffModels = Form.create()(AddStaffModel);
export default connect(null, {
  curdCurrentData,
})(AddStaffModels);
