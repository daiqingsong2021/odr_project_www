import React, {Component} from 'react';
import dynamic from 'next/dynamic';
import {Modal, message} from 'antd';
import {connect} from 'react-redux';
import {curdCurrentData} from '../../../../../../store/curdData/action';
import Search from '../../../../components/Search';
import SelectProBtn from '../../../../components/SelectBtn/SelectProBtn';
import SelectSectionBtn from '../../../../components/SelectBtn/SelectSectionBtn';
import AddForm from '../Add/index';
import style from './style.less';
import axios from '../../../../../../api/axios';
import {addSpecialWorkerType,deleteSpecialWorkerType,addCertGl,deleteCertGl} from '../../../../api/suzhou-api';
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
        if(!data1){
          notification.warning(
            {
              placement: 'bottomRight',
              bottom: 50,
              duration: 2,
              message: '未选中数据',
              description: '请选择数据进行操作'
            }
          )
        }else{
          this.setState({
            modalVisible: true,
            type: 'ADD',
          });
        }
        break;
      case 'DeleteTopBtn':
        if (selectedRows) {
          const deleteArray = [];
          selectedRows.forEach((value,item)=>{
            deleteArray.push(value.id)
          })  
          axios.deleted(deleteCertGl, {data:deleteArray}, true).then(res => {
            this.props.delSuccess(deleteArray);
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
      case 'MoveTDTopBtn':
      default:
        return;
    }
  };

  submit = (values, type) => {
    const data = {
      ...values,
      projectId:this.props.data1

    };
    axios.post(addCertGl, data, true).then(res => {
      if (res.data.status === 200) {
        if (type == 'save') {
          this.handleCancel();
        }

        this.props.success(res.data.data);
      }
    });
  };

  openPro(){
  }

  render() {
    const {modalVisible} = this.state;
    const {permission} = this.props
    return (
      <div className={style.main}>

        {this.props.deledit}
        <div>
          
        </div>
        <div className={style.search}>
          <Search search={this.props.search} placeholder={'证书名称'} />
        </div>
        <div className={style.tabMenu}>
          <SelectProBtn  openPro={this.props.openPro} />
          {permission.indexOf('WORKTYPE_EDIT-CERTIFICATE')!==-1 && (
          <PublicButton name={'新增'} title={'新增'} icon={'icon-add'}
                        afterCallBack={this.btnClicks.bind(this,'AddTopBtn')}
                        res={'MENU_EDIT'}
          />)}
          {permission.indexOf('WORKTYPE_EDIT-CERTIFICATE')!==-1 && (
          <PublicButton name={'删除'} title={'删除'} icon={'icon-shanchu'}
                        useModel={true} edit={true}
                        verifyCallBack={this.hasRecord}
                        afterCallBack={this.btnClicks.bind(this,'DeleteTopBtn')}
                        content={'你确定要删除嘛'}
                        res={'MENU_EDIT'}
          />)}
        </div>
        {modalVisible && <AddForm
          record={this.props.record}
          modalVisible={modalVisible}
          success={this.props.success}
          submit={this.submit.bind(this)}
          section={this.props.section}
          projectId = {this.props.data1}
          handleCancel={this.handleCancel.bind(this)}/>}
      </div>

    );
  }
}

export default PlanDefineTopTags;

