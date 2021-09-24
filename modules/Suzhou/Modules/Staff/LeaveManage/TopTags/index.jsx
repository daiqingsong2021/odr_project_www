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
import {addHoliday,deleteHoliday,getBaseSelectTree} from '../../../../api/suzhou-api';
import {notification} from 'antd'
import PublicButton from '../../../../../../components/public/TopTags/PublicButton';
//流程
import ReleaseModal from '../ReleaseModal/index';
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
      optionStatus:[], //状态
      releaseModal:false, //直接发布
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
    const {delSuccess, record,section,data1,selectedRows,projectName} = this.props;
    const projectId = this.props.data1;
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
              description: '请先选择项目进行操作'
            }
          )
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
                    description: '编号为'+value.serialId+"不能删除"
                  }
                );
                return false;
              }
            }) 
            if(deleteArray.length > 0){
              axios.deleted(deleteHoliday, {data:deleteArray}, true).then(res => {
                delSuccess(deleteArray);
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
        //直接发布
        case 'release':
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
            releaseModal: true,
            isShowRelease: false,
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
      projectId:this.props.data1
    };
    axios.post(addHoliday, data, true).then(res => {
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
    //取消直接发布
    handleCancelReleaseModal = () =>{
      this.setState({
        releaseModal: false
    })
    }
    updateFlow = (projectId, data) => {
      this.props.updateFlow();
    }
  render() {
    const {modalVisible,releaseModal} = this.state;
    const {permission,rightData} = this.props;
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
          <Search search={this.props.search} placeholder={'请假人员/请假编号'} />
        </div>
        <div className={style.tabMenu}>
          <SelectProBtn  openPro={this.props.openPro} />
          <SelectSectionBtn openSection={this.props.openSection} data1={this.props.data1} />
          {permission.indexOf('LEAVEMANAGE_EDIT-LEAVE-MANAGE')!==-1 && (
          <PublicButton name={'新增'} title={'新增'} icon={'icon-add'}
                        afterCallBack={this.btnClicks.bind(this,'AddTopBtn')}
                        res={'MENU_EDIT'}
          />)}
          {permission.indexOf('LEAVEMANAGE_RELEASE-APPROVELEAVE')!==-1 && (
          <PublicButton name={'发布审批'} title={'发布审批'} icon={'icon-fabu'}
                        afterCallBack={this.btnClicks.bind(this,'approve')}
                        show={this.props.rightData && this.props.rightData.statusVo.code == 'INIT' ?true:false}
                        res={'MENU_EDIT'} />)}
          {(permission.indexOf('LEAVEMANAGE_DIRECT-RELEASE-LEAVE')!==-1)&&
          <PublicButton name={'直接发布'} title={'直接发布'} icon={'icon-fabu'}
                        afterCallBack={this.btnClicks.bind(this,'release')}
                        res={'MENU_EDIT'} />
          }
          {permission.indexOf('LEAVEMANAGE_EDIT-LEAVE-MANAGE')!==-1 && (
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
          YZ_KQGLY = {this.props.YZ_KQGLY}
          success={this.props.success}
          submit={this.submit.bind(this)}
          section={this.props.section}
          projectId = {this.props.data1}
          addSuccess = {this.props.addSuccess}
          handleCancel={this.handleCancel.bind(this)}/>}
        {/* 直接发布 */}
        {this.state.releaseModal && <ReleaseModal
            releaseModal = {releaseModal}
            projectName = {this.props.projectName} 
            projectId={this.props.data1} 
            sectionId = {this.props.sectionId}
            searcher = {this.props.searcher}
            updateReleaseModal = {this.props.updateReleaseModal}
            handleCancel = {this.handleCancelReleaseModal.bind(this)}
        />}
          {/* 流程审批 */}
        {this.state.isShowRelease && 
          <Release 
          projectName = {this.props.projectName} 
          firstList={getReleaseMeetingList} 
          handleCancel={this.handleCancelRelease} 
          projectId={this.props.data1} 
          proc={{  "bizTypeCode": "szxm-peopleHoliday-approve", "title": this.state.projectName+"请假发布审批" }}
          reflesh={this.updateFlow.bind(this)} />}
        {this.state.showApprovalVisible &&
          <Approval
              visible={true}
              width={"1200px"}
              proc={{ 
                'vars':{
                  ryZw:(!this.props.rightData||!this.props.rightData.ryZw)?'':this.props.rightData.ryZw,
                  days:(!this.props.rightData||!this.props.rightData.days)?'':this.props.rightData.days
                  },
                 "bizTypeCode": "szxm-peopleHoliday-approve", "title": this.state.projectName+"请假发布审批" ,
                 'remark':`请假类型:${rightData?rightData.typeVo.name:''},请假天数:${rightData?rightData.days:''},请假事由:${rightData?rightData.reason:''}`}}
              projectId={this.props.data1}
              sectionId = {this.props.sectionId}
              searcher = {this.props.searcher}
              handleCancel={() => { this.setState({ showApprovalVisible: false }) }}
              refreshData={this.props.updateFlow}
              bizType={this.props.bizType}
              parentData={this.props.rightData}
          />}
      </div>

    );
  }
}

export default PlanDefineTopTags;

