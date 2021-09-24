import React, {Component} from 'react';
import dynamic from 'next/dynamic';
import {Modal, message} from 'antd';
import {connect} from 'react-redux';
import {curdCurrentData} from '../../../../../../store/curdData/action';
import Search from '../../../../components//Search';
import SelectProBtn from '../../../../components/SelectBtn/SelectProBtn';
import SelectSectionBtn from '../../../../components/SelectBtn/SelectSectionBtn';
import AddForm from '../Add/index';
import style from './style.less';
import axios from '../../../../../../api/axios';
import {addKqConfig,deleteKqConfig,saveAllKqConfig} from '../../../../api/suzhou-api';
import {notification} from 'antd'
import PublicButton from '../../../../../../components/public/TopTags/PublicButton'
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
  hasRecord=()=>{
    if(this.props.selectedRows.length == 0){
      notification.warning(
        {
          placement: 'bottomRight',
          bottom: 50,
          duration: 2,
          message: '未选中数据',
          description: '请选择数据进行操作'
        }
      )
      return false;
    }else {
      return true
    }
  }
  btnClicks = (v, type) => {
    const {delSuccess, record,section,data1,selectedRows} = this.props;
    switch (v) {
      case 'AddTopBtn':
        if(data1){
          this.setState({
            modalVisible: true,
            type: 'ADD',
          });
        }else{
          notification.warning(
            {
              placement: 'bottomRight',
              bottom: 50,
              duration: 2,
              message: '未选中数据',
              description: '请选择数据进行操作'
            }
          )
        }
        break;
      case 'AddGlobalBtn':
          if(data1){
            this.setState({
              modalVisible: true,
              type: 'GLOBAL',
            });
          }else{
            notification.warning(
              {
                placement: 'bottomRight',
                bottom: 50,
                duration: 2,
                message: '未选中数据',
                description: '请选择数据进行操作'
              }
            )
          }
          break;
      case 'DeleteTopBtn':
        if (selectedRows) {
            const deleteArray = [];
            selectedRows.forEach((value,item)=>{
              deleteArray.push(value.id)
            })  
            axios.deleted(deleteKqConfig, {data:deleteArray}, true).then(res => {
              delSuccess(deleteArray);
            }).catch(err => {
            });
        } else {
          notification.warning(
            {
              placement: 'bottomRight',
              bottom: 50,
              duration: 2,
              message: '未选中数据',
              description: '请选择数据进行操作'
            }
          )
        }
        break;
      default:
        return;
    }
  };

  submit = (values, type) => {
    const data = {
      ...values,
      projectId:this.props.data1
    };
    if(this.state.type == 'ADD'){
      axios.post(addKqConfig, data, true).then(res => {
        if (res.data.status === 200) {
          if (type == 'save') {
            this.handleCancel();
          }
          this.props.success(res.data.data);
        }
      });
    }else if(this.state.type == 'GLOBAL'){
      delete(data["sectionId"]);
      axios.put(saveAllKqConfig,data,true).then(res => {
        if (res.data.status === 200) {
          if (type == 'save') {
            this.handleCancel();
          }
          this.props.success(res.data.data);
        }
      });
    }
    
  };
  render() {
    const {modalVisible} = this.state;
    const{permission} =this.props
    return (
      <div className={style.main}>

        {this.props.deledit}
        <div>
          
        </div>
        <div className={style.tabMenu}>
          <SelectProBtn  openPro={this.props.openPro} />
          <SelectSectionBtn openSection={this.props.openSection} data1={this.props.data1} />
          {permission.indexOf('ATTENDANCESETTING_EDIT-ATTENDANCE')!==-1 && (
          <PublicButton name={'新增'} title={'新增'} icon={'icon-add'}
                        afterCallBack={this.btnClicks.bind(this,'AddTopBtn')}
                        res={'MENU_EDIT'}
          />)}
          {permission.indexOf('ATTENDANCESETTING_EDIT-ATTENDANCE')!==-1 && (
          <PublicButton name={'删除'} title={'删除'} icon={'icon-shanchu'}
                        useModel={true} edit={true}
                        verifyCallBack={this.hasRecord}
                        afterCallBack={this.btnClicks.bind(this,'DeleteTopBtn')}
                        content={'你确定要删除嘛'}
                        res={'MENU_EDIT'}
          />)}
          {permission.indexOf('ATTENDANCESETTING_GLOBAL-ATTENDACNE')!==-1 && (
          <PublicButton name={'全局配置'} title={'全局配置'} icon={'iconset'}
                        afterCallBack={this.btnClicks.bind(this,'AddGlobalBtn')}
                        res={'MENU_EDIT'}
          />)}
        </div>
        {modalVisible && <AddForm
          record={this.props.record}
          modalVisible={modalVisible}
          success={this.props.success}
          submit={this.submit.bind(this)}
          section={this.props.section}
          type = {this.state.type}
          projectId={this.props.data1}
          handleCancel={this.handleCancel.bind(this)}/>}
      </div>

    );
  }
}

export default PlanDefineTopTags;

