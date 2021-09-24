import React, {Component} from 'react';
import dynamic from 'next/dynamic';
import {Modal, message,Select} from 'antd';
import {connect} from 'react-redux';
import {curdCurrentData} from '../../../../../../store/curdData/action';
import Search from '../../../../components/Search';
import SelectProBtn from '../../../../components/SelectBtn/SelectProBtn';
import SelectSectionBtn from '../../../../components/SelectBtn/SelectSectionBtn';
import AddForm from '../Add/index';
import style from './style.less';
import axios from '../../../../../../api/axios';
import {addSpecialWorker,deleteSpecialWorker,getBaseSelectTree} from '../../../../api/suzhou-api';
import {notification} from 'antd'
import PublicButton from '../../../../../../components/public/TopTags/PublicButton';
//流程
import Release from "../../../../../Components/Release";
import { getReleaseMeetingList } from "../../../../../../api/api"
import Approval from '../Workflow/Approval';
const { Option } = Select;
export class PlanDefineTopTags extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      delModalVisible: false,
      noticeData: '',
      planDefineSelectData: [],
      type: '',
      isShowRelease:false ,//流程公用
      showApprovalVisible:false,//发布审批
      projectName:"",
      optionStatus:[],//状态
    };
  }
  componentDidMount(){
    axios.get(getBaseSelectTree("base.flow.status")).then((res)=>{
      if(Array.isArray(res.data.data)){
        this.setState({
          optionStatus:res.data.data
        })
      }
    });
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
    const {record,section,data1,selectedRows,projectName} = this.props;
    const projectId = this.props.data1;
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
              if(value.statusVo.code == 'INIT'){
                deleteArray.push(value.id)
              }else{
                notification.warning(
                  {
                    placement: 'bottomRight',
                    bottom: 50,
                    duration: 2,
                    message: '非新建状态数据不能删除',
                    description: '姓名为'+value.name+"不能删除"
                  }
                );
                return false;
              }
            })  
            if(deleteArray.length > 0){
              axios.deleted(deleteSpecialWorker, {data:deleteArray}, true).then(res => {
                this.props.delSuccess(deleteArray);
              }).catch(err => {
              });
            }
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
      //发布审批
      case 'approve':
        if (!projectId) {
          notification.warning(
            {
              placement: 'bottomRight',
              bottom: 50,
              duration: 1,
              message: '警告',
              description: '没有选择项目！'
            }
          )
          return
        }
        this.setState({
          isShowRelease: true,
          showApprovalVisible:true,
          projectName: "["+projectName+"]"
        })
        return
      break;
      default:
        return;
    }
  };

  submit = (values, type) => {
    const data = {
      ...values,
      workType:values.workType.join(),
      projectId:this.props.data1
    };
    axios.post(addSpecialWorker, data, true).then(res => {
      if (res.data.status === 200) {
        if (type == 'save') {
          this.handleCancel();
        }
        this.props.success(res.data.data);
      }
    });
  };
  //取消审批
  handleCancelRelease = () => {
    this.setState({
        isShowRelease: false
    })
  }
  updateFlow = (projectId, data) => {
    this.props.updateFlow();
  }
  render() {
    const {modalVisible} = this.state;
    const {permission} = this.props
    return (
      <div className={style.main}>
        <div className={style.search}>
          状态：
          <Select allowClear 
                  onChange={this.props.selectStatue}
                  style={{width:'100px', marginRight: 10 }}
                  size="small">
                  {
                    this.state.optionStatus.length && this.state.optionStatus.map((item,i) => {
                      return (
                        <Option key={item.value} value={item.value}>{item.title}</Option>
                      )
                    })
                  }
          </Select>
          <Search search={this.props.search} placeholder={'姓名/联系方式'} />
        </div>
        <div className={style.tabMenu}>
          <SelectProBtn  openPro={this.props.openPro} />
          <SelectSectionBtn openSection={this.props.openSection} data1={this.props.data1} />
          {permission.indexOf('SPECIALTYPE_EDIT-PERSON-SPECIAL')!==-1 && (
          <PublicButton name={'新增'} title={'新增'} icon={'icon-add'}
                        afterCallBack={this.btnClicks.bind(this,'AddTopBtn')}
                        res={'MENU_EDIT'}
          />)}
          {permission.indexOf('SPECIALTYPE_RELEASE-AUDIT-SPECIA')!==-1 && (
          <PublicButton name={'发布审批'} title={'发布审批'} icon={'icon-fabu'}
                        afterCallBack={this.btnClicks.bind(this,'approve')}
                        res={'MENU_EDIT'} />)}
          {permission.indexOf('SPECIALTYPE_EDIT-PERSON-SPECIAL')!==-1 && (
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
          projectId={this.props.data1}
          handleCancel={this.handleCancel.bind(this)}/>}
          {/* 流程审批 */}
        {this.state.isShowRelease && 
          <Release 
          projectName = {this.props.projectName} 
          firstList={getReleaseMeetingList} 
          handleCancel={this.handleCancelRelease} 
          projectId={this.props.data1} 
          proc={{  "bizTypeCode": "szxm-specialWork-approve", "title": this.state.projectName+"人员特殊工种发布审批" }}
          reflesh={this.updateFlow.bind(this)} />}
        {this.state.showApprovalVisible &&
          <Approval
              visible={true}
              width={"1200px"}
              proc={{  "bizTypeCode": "szxm-specialWork-approve", "title": this.state.projectName+"人员特殊工种发布审批" }}
              projectId={this.props.data1}
              sectionId = {this.props.sectionId}
              searcher= {this.props.searcher}
              handleCancel={() => { this.setState({ showApprovalVisible: false }) }}
              refreshData={this.props.updateFlow}
              bizType={this.props.bizType}
          />}
      </div>

    );
  }
}

export default PlanDefineTopTags;

