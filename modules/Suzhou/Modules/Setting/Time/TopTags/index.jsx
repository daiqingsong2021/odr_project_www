import React, { Component } from 'react';
import dynamic from 'next/dynamic';
import { Modal, message } from 'antd';
import { connect } from 'react-redux';
import { curdCurrentData } from '@/store/curdData/action';
import Search from '@/modules/Suzhou/components/Search';
import style from './style.less';
import AddForm from '../Add/index';
import Modify from '../Modify/index';
import axios from '@/api/axios';
import {
  addTimeTask,
  deleteTimeTask,
  resumeTimeTask,
  pauseTimeTask,
  triggerTimeTask,
  updateTimeTask,
} from '@/modules/Suzhou/api/suzhou-api';
import { notification } from 'antd';
import PublicButton from '@/components/public/TopTags/PublicButton';

export class TimeTopTags extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      modifyModal: false, //修改弹窗
    };
  }
  //关闭model
  handleCancel = () => {
    this.setState({
      modalVisible: false,
    });
  };
  //关闭修改
  handleCancelModify = () => {
    this.setState({
      modifyModal: false,
    });
  };
  //判断是否有选中数据
  hasRecord = () => {
    if (this.props.selectedRows.length == 0) {
      notification.warning({
        placement: 'bottomRight',
        bottom: 50,
        duration: 2,
        message: '未选中数据',
        description: '请选择数据进行操作',
      });
      return false;
    } else {
      return true;
    }
  };
  //判断选中唯一
  hasRecordOnly = () => {
    if (!this.props.record) {
      notification.warning({
        placement: 'bottomRight',
        bottom: 50,
        duration: 2,
        message: '未选中数据',
        description: '请选择数据进行操作',
      });
      return false;
    } else {
      return true;
    }
  };
  btnClicks = (v, type) => {
    const { delSuccess, selectedRows, record } = this.props;
    switch (v) {
      case 'AddTopBtn':
        this.setState({
          modalVisible: true,
          type: 'ADD',
        });
        break;
      case 'ModifyTopBtn':
        if (this.props.record) {
          this.setState({
            modifyModal: true,
          });
        } else {
          notification.warning({
            placement: 'bottomRight',
            bottom: 50,
            duration: 2,
            message: '未选中数据',
            description: '请选择数据进行操作',
          });
        }
        break;
      case 'DeleteTopBtn':
        if (selectedRows) {
          const deleteArray = [];
          selectedRows.forEach((value, item) => {
            deleteArray.push(value.id);
          });
          axios
            .deleted(deleteTimeTask, { data: deleteArray }, true)
            .then(res => {
              this.props.delSuccess(deleteArray);
            })
            .catch(err => {});
        } else {
          notification.warning({
            placement: 'bottomRight',
            bottom: 50,
            duration: 2,
            message: '未选中数据',
            description: '请选择数据进行操作',
          });
        }
        break;
      case 'stopTopBtn':
        if (record) {
          axios
            .post(pauseTimeTask(record.id))
            .then(res => {
              record.jobStatus = '0';
              notification.success({
                placement: 'bottomRight',
                bottom: 50,
                duration: 2,
                message: '操作提醒',
                description: '暂停成功',
              });
              this.props.updateRestore(record);
            })
            .catch(err => {});
        } else {
          notification.warning({
            placement: 'bottomRight',
            bottom: 50,
            duration: 2,
            message: '未选中数据',
            description: '请选择数据进行操作',
          });
        }
        break;
      case 'restoreTopBtn':
        if (record) {
          axios
            .post(resumeTimeTask(record.id))
            .then(res => {
              record.jobStatus = '1';
              notification.success({
                placement: 'bottomRight',
                bottom: 50,
                duration: 2,
                message: '操作提醒',
                description: '恢复成功',
              });
              this.props.updateRestore(record);
            })
            .catch(err => {});
        } else {
          notification.warning({
            placement: 'bottomRight',
            bottom: 50,
            duration: 2,
            message: '未选中数据',
            description: '请选择数据进行操作',
          });
        }
        break;
      case 'runTopBtn':
        if (record) {
          axios
            .post(triggerTimeTask(record.id))
            .then(res => {
              notification.success({
                placement: 'bottomRight',
                bottom: 50,
                duration: 2,
                message: '操作提醒',
                description: '执行成功',
              });
              this.props.updateRestore(record);
            })
            .catch(err => {});
        } else {
          notification.warning({
            placement: 'bottomRight',
            bottom: 50,
            duration: 2,
            message: '未选中数据',
            description: '请选择数据进行操作',
          });
        }
        break;
      default:
        return;
    }
  };
  submit = (values, type) => {
    const data = {
      ...values,
    };
    axios.post(addTimeTask, data, true).then(res => {
      if (res.data.status === 200) {
        if (type == 'save') {
          this.handleCancel();
        }
        this.props.success(res.data.data);
      }
    });
  };
  //修改回调
  update = values => {
    const data = { ...values, id: this.props.record.id };
    axios.post(updateTimeTask, data, true).then(res => {
      if (res.data.status === 200) {
        this.handleCancelModify();
        this.props.updateModify(res.data.data);
      }
    });
  };
  componentDidMount() {}
  render() {
    const { modalVisible, stopTopBtnFlag, modifyModal } = this.state;
    return (
      <div className={style.main}>
        <div className={style.search}>
          <Search search={this.props.search} placeholder={'名称／分组'} />
        </div>
        <div className={style.tabMenu}>
          <PublicButton
            name={'新增'}
            title={'新增'}
            icon={'icon-add'}
            afterCallBack={this.btnClicks.bind(this, 'AddTopBtn')}
            res={'MENU_EDIT'}
          />
          <PublicButton
            name={'修改'}
            title={'修改'}
            icon={'icon-xiugaibianji'}
            afterCallBack={this.btnClicks.bind(this, 'ModifyTopBtn')}
          />
          <PublicButton
            name={'删除'}
            title={'删除'}
            icon={'icon-shanchu'}
            useModel={true}
            edit={true}
            verifyCallBack={this.hasRecord}
            afterCallBack={this.btnClicks.bind(this, 'DeleteTopBtn')}
            content={'你确定要删除吗'}
            res={'MENU_EDIT'}
          />
          <PublicButton
            name={'暂停'}
            title={'暂停'}
            icon={'icon-exit'}
            useModel={true}
            edit={this.props.stopTopBtnFlag}
            verifyCallBack={this.hasRecordOnly}
            afterCallBack={this.btnClicks.bind(this, 'stopTopBtn')}
            content={'你确定要暂停吗'}
            res={'MENU_EDIT'}
          />
          <PublicButton
            name={'恢复'}
            title={'恢复'}
            icon={'icon-zhengque'}
            useModel={true}
            edit={this.props.restoreTopBtnFlag}
            verifyCallBack={this.hasRecordOnly}
            afterCallBack={this.btnClicks.bind(this, 'restoreTopBtn')}
            content={'你确定要恢复吗'}
            res={'MENU_EDIT'}
          />
          <PublicButton
            name={'执行'}
            title={'执行'}
            icon={'icon-fabu2'}
            useModel={true}
            edit={true}
            verifyCallBack={this.hasRecordOnly}
            afterCallBack={this.btnClicks.bind(this, 'runTopBtn')}
            content={'你确定要执行吗'}
            res={'MENU_EDIT'}
          />
        </div>
        {modalVisible && (
          <AddForm
            record={this.props.record}
            modalVisible={modalVisible}
            success={this.props.success}
            submit={this.submit.bind(this)}
            section={this.props.section}
            handleCancel={this.handleCancel.bind(this)}
          />
        )}
        {modifyModal && (
          <Modify
            record={this.props.record}
            Modify={modifyModal}
            success={this.props.success}
            update={this.update.bind(this)}
            section={this.props.section}
            handleCancel={this.handleCancelModify.bind(this)}
          />
        )}
      </div>
    );
  }
}
export default TimeTopTags;
