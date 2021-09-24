import React, { Component } from 'react';
import dynamic from 'next/dynamic';
import style from './style.less';
import Search from '../../../../components/public/Search';
import PublicButton from '../../../../components/public/TopTags/PublicButton';
import AddInfoModel from '../AddInfoModel'; // 新增用户弹窗
import BatchAddModel from '../BatchAddModel'; //批量新增用户
import { notification } from 'antd';
import axios from '../../../../api/axios';
import { connect } from 'react-redux';

export class SysUserTopTags extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,  // 控制新增用户弹窗
      batchVisible: false,   // 控制批量新增用户弹窗
      loginUser: null,
      roleBtnData: [
        {
          id: 1,
          name: 'AddUserTopBtn',
          aliasName: '新增用户',
        },
        {
          id: 2,
          name: 'AddUserGroupTopBtn',
          aliasName: '批量新增用户',
        },
        {
          id: 3,
          name: 'ResetPwdTopBtn',
          aliasName: '重置密码',
        },
        {
          id: 4,
          name: 'LockUserTopBtn',
          aliasName: '锁定用户',
        },
        {
          id: 5,
          name: 'UnlockUserTopBtn',
          aliasName: '解锁用户',
        },
        {
          id: 6,
          name: 'DeleteTopBtn',
          aliasName: '删除',
        },

      ],
    };
  }

  componentDidMount() {
    let loginUser = JSON.parse(sessionStorage.getItem('userInfo'));
    this.setState({
      loginUser,
    });
  }


  // 批量新增Model取消
  cancelBacth = () => {
    this.setState({
      batchVisible: false,
    });
  };

  onClickHandle = (name) => {
    const { intl } = this.props.currentLocale;
    if (name == 'AddUserTopBtn') {
      this.setState({
        modalVisible: true,
      });
      return;
    }
    if (name == 'AddUserGroupTopBtn') {
      this.setState({
        batchVisible: true,
      });
      return;
    }
    if (this.props.data.length == 0) {
      notification.warning(
        {
          placement: 'bottomRight',
          bottom: 50,
          duration: 1,
          message: "提示",
          description: "请勾选数据进行操作",
        },
      );
      return;
    } else {
      let idArray = this.props.data.map(item => item.id);
      if (name == 'ResetPwdTopBtn') {
        axios.post('api/sys/user/reset/password', idArray, true).then(res => {
          this.props.refresh([]);
        });
        return;
      }
      if (name == 'LockUserTopBtn') {

        let idArray = [];
        this.props.data.forEach(item => {
          if (item.status.id == 1) {
            idArray.push(item.id);
          }
        });

        if (idArray.length == 0) {
          notification.error(
            {
              placement: 'bottomRight',
              bottom: 50,
              duration: 1,
              message: intl.get('wsd.global.tip.title2'),
              description: intl.get('wsd.global.tip.title3'),
            },
          );
          return;
        }
        axios.post('api/sys/user/lock', idArray, true).then(res => {

          this.props.refresh([]);
        });
        return;
      }
      if (name == 'UnlockUserTopBtn') {
        let idArray = [];
        this.props.data.forEach(item => {
          if (item.status.id == 0) {
            idArray.push(item.id);
          }
        });
        if (idArray.length == 0) {
          notification.error(
            {
              placement: 'bottomRight',
              bottom: 50,
              duration: 1,
              message: intl.get('wsd.global.tip.title2'),
              description: intl.get('wsd.global.tip.title4'),
            },
          );
          return;
        }
        axios.post('api/sys/user/unlock', idArray, true).then(res => {

          this.props.refresh([]);
        });
        return;
      }
      if (name == 'DeleteTopBtn') {
        let idArray = this.props.data.map(item => item.id);
        axios.deleted('api/sys/user/delete', { data: idArray }, true).then(res => {

          this.props.deleteData();
        });
        return;
      }
    }

  };

  //判断是否有选中数据
  hasRecord = () => {
    if (!this.props.data.length) {
      notification.warning(
        {
          placement: 'bottomRight',
          bottom: 50,
          duration: 2,
          message: '未选中数据',
          description: '请选择数据进行操作',
        },
      );
      return false;
    } else {
      return true;
    }
  };

  render() {
    const { intl } = this.props.currentLocale;


    return (
      <div className={style.main}>
        <div className={style.search}>
          <Search placeholder = {"姓名/用户名"} search={this.props.search}/>
        </div>
        <div className={style.tabMenu}>
          <PublicButton name={'新增用户'} title={'新增用户'} icon={'icon-zengjiayuangong'}
                        afterCallBack={this.onClickHandle.bind(this, 'AddUserTopBtn')}
                        res={'MENU_EDIT'}
                        position={this.props.position} positionMap={this.props.positionMap}
                        professional={this.props.professional} professionalMap={this.props.professionalMap}
                        edit={this.state.loginUser != null ? (this.state.loginUser.userType == '3' ? false : true) : false}
          />
          <PublicButton name={'批量新增用户'} title={'批量新增用户'} icon={'icon-piliangzengjiayuangong'}
                        afterCallBack={this.onClickHandle.bind(this, 'AddUserGroupTopBtn')}
                        res={'MENU_EDIT'}
                        position={this.props.position} positionMap={this.props.positionMap}
                        professional={this.props.professional} professionalMap={this.props.professionalMap}
                        edit={this.state.loginUser != null ? (this.state.loginUser.userType == '3' ? false : true) : false}
          />
          <PublicButton name={'重置密码'} title={'重置密码'} icon={'icon-zhongzhimima'}
                        afterCallBack={this.onClickHandle.bind(this, 'ResetPwdTopBtn')}
                        res={'MENU_EDIT'}
                        edit={this.state.loginUser != null ? (this.state.loginUser.userType == '3' ? false : true) : false}
          />
          <PublicButton name={'锁定用户'} title={'锁定用户'} icon={'icon-suo4'}
                        afterCallBack={this.onClickHandle.bind(this, 'LockUserTopBtn')}
                        res={'MENU_EDIT'}
                        edit={this.state.loginUser != null ? (this.state.loginUser.userType == '3' ? false : true) : false}
          />
          <PublicButton name={'解锁用户'} title={'解锁用户'} icon={'icon-suokai'}
                        afterCallBack={this.onClickHandle.bind(this, 'UnlockUserTopBtn')}
                        res={'MENU_EDIT'}
                        edit={this.state.loginUser != null ? (this.state.loginUser.userType == '3' ? false : true) : false}
          />
          <PublicButton name={'删除'} title={'删除'} icon={'icon-shanchu'}
                        useModel={true} edit={true}
                        verifyCallBack={this.hasRecord}
                        afterCallBack={this.onClickHandle.bind(this, 'DeleteTopBtn')}
                        content={'你确定要删除吗？'}
                        res={'MENU_EDIT'}
                        edit={this.state.loginUser != null ? (this.state.loginUser.userType == '3' ? false : true) : false}
          />
        </div>

        {/* 新增用户 */}
        {this.state.modalVisible && <AddInfoModel handleOk={this.handleOk}
                        position={this.props.position}
                        professional={this.props.professional}
                        handleCancel={() => this.setState({ modalVisible: false })}
                        addBasicUser={this.props.addBasicUser}/>}


        {/* 批量新增用户 */}
        {this.state.batchVisible &&
        <BatchAddModel cancelBacth={this.cancelBacth} refresh={this.props.refresh}
                        position={this.props.position}
                        professional={this.props.professional}
        />
        }

      </div>
    );
  }
}


const mapStateToProps = state => {
  return {
    currentLocale: state.localeProviderData,
  };
};


export default connect(mapStateToProps, null)(SysUserTopTags);
