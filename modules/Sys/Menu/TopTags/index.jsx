import React, { Component } from 'react';
import dynamic from 'next/dynamic';
import { Modal, message } from 'antd';
import { connect } from 'react-redux';
import { curdCurrentData } from '../../../../store/curdData/action';
import Search from '../../../../components/public/Search';
import AddForm from '../Add/index';
import style from './style.less';
import axios from '../../../../api/axios';
import { menuAdd, menuDelete, menuSearch } from '../../../../api/api';
import { notification } from 'antd';
import PublicButton from '../../../../components/public/TopTags/PublicButton';

export class PlanDefineTopTags extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      delModalVisible: false,
      noticeData: '',
      planDefineSelectData: [],
      type: '',
    };
  }

  //关闭model
  handleCancel = () => {
    this.setState({
      modalVisible: false,
    });
  };

  //判断是否有选中数据
  hasRecord = () => {
    if (!this.props.record) {
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
      if (this.props.record.built_in == 0) {
        notification.warning(
          {
            placement: 'bottomRight',
            bottom: 50,
            duration: 2,
            message: '内置菜单',
            description: '内置菜单不允许删除',
          },
        );
        return false;
      } else {
        return true;
      }
    }
  };
  btnClicks = (v, type) => {
    const { delSuccess, record } = this.props;
    switch (v) {
      case 'AddTopBtn':
        this.setState({
          modalVisible: true,
          type: 'ADD',
        });
        break;
      case 'DeleteTopBtn':
        if (record) {
          axios.deleted(menuDelete, { data: [record.id] }, true,null,true).then(res => {
            delSuccess();
          }).catch(err => {
          });
        } else {
          notification.warning(
            {
              placement: 'bottomRight',
              bottom: 50,
              duration: 2,
              message: '未选中数据',
              description: '请选择数据进行操作',
            },
          );
        }
        break;
      case 'MoveTDTopBtn':
      default:
        return;
    }
  };

  submit = (values, type) => {
    const data = {
      ...values,
      share: values.share ? 1 : 0,
      hidden: values.hidden ? 1 : 0,
      isMenu: values.isMenu ? 1 : 0,
      active: values.active ? 1 : 0,
      parentId: this.props.record && this.props.record.id ? this.props.record.id : 0,
    };
    axios.post(menuAdd, data, true,null,true).then(res => {

      if (res.data.status === 200) {
        if (type == 'save') {
          this.handleCancel();
        }

        this.props.success(res.data.data);
      }

    });
  };
  render() {
    const { modalVisible } = this.state;

    return (
      <div className={style.main}>

        {this.props.deledit}

        <div className={style.search}>
          <Search search={this.props.search}/>
        </div>
        <div className={style.tabMenu}>
          <PublicButton name={'新增'} title={'新增'} icon={'icon-add'}
                        afterCallBack={this.btnClicks.bind(this, 'AddTopBtn')}
                        res={'MENU_EDIT'}
                        edit={this.props.authedit}
          />
          <PublicButton name={'删除'} title={'删除'} icon={'icon-shanchu'}
                        useModel={true} edit={true}
                        verifyCallBack={this.hasRecord}
                        afterCallBack={this.btnClicks.bind(this, 'DeleteTopBtn')}
                        content={'你确定要删除吗？'}
                        res={'MENU_EDIT'}
          />
        </div>
        {modalVisible && <AddForm
          record={this.props.record}
          modalVisible={modalVisible}
          success={this.props.success}
          submit={this.submit.bind(this)}
          handleCancel={this.handleCancel.bind(this)}/>}
      </div>

    );
  }
}

export default PlanDefineTopTags;

