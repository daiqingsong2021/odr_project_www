import React, {Component} from 'react';
import Search from '../../../../components/public/Search';
import AddForm from '../AddModel/index';
import style from './style.less';
import axios from '../../../../api/axios';
import {wfAssignAdd,getActivityModelsNewModel,assignBussiNewModel,releaseBussiNewModel,deleteBussiNewModel} from '../../../../api/api';
import {notification} from 'antd'
import PublicButton from '../../../../components/public/TopTags/PublicButton'
import * as dataUtil from '../../../../utils/dataUtil'
import TipModal from "../../../Components/TipModal"
import {baseURL} from "../../../../api/config";
export class WfAssignTopTags extends Component {
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

  
  //判断是否有选中数据
  hasRecord=()=>{
    if(!this.props.rightData){
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
    }else if(this.props.rightData.type == "bussi"){
      notification.warning(
        {
          placement: 'bottomRight',
          bottom: 50,
          duration: 2,
          message: '提示',
          description: '请选择流程!'
        }
      )
      return false;
    }else {
      return true
    }
  }
 

  submit = (values, type) => {
    const data = {
      ...values,
      share: values.share ? 1 : 0,
      hidden: values.hidden ? 1 : 0,
      isMenu: values.isMenu ? 1 : 0,
      active: values.active ? 1 : 0,
      parentId: this.props.record && this.props.record.id ? this.props.record.id : 0,
    };
    axios.post(wfAssignAdd, data, true).then(res => {

      if (res.data.status === 200) {
        if (type == 'save') {
          this.handleCancel();
        }

        this.props.success(res.data.data);
      }

    });
  };
  handleAddTopbtn=()=>{
    const { rightData } = this.props;
    if(rightData && rightData.type == "bussi"){
      this.setState({modalVisible:true})
    }else{
      dataUtil.message("请选择一条业务进行操作")
    }
     
  }

  updateActivityProc =() =>{
    const { rightData } = this.props;
    // console.log(baseURL.substr(0,baseURL.lastIndexOf(":")));
    if(rightData && rightData.type == "activiti"){
      window.open(baseURL.substr(0,baseURL.lastIndexOf(":")) +":8784/modeler.html?modelId="+rightData.id, "_blank");
      // const url = baseURL.substr(0,baseURL.indexOf(":")) + ":8784/api/act/modeler?modelId=" + rightData.id;
      // window.open(url, "_blank");
    }else{
      notification.warning(
        {
          placement: 'bottomRight',
          bottom: 50,
          duration: 2,
          message: '请选择流程!',
          description: '请选择流程!'
        }
      )
    }
  }

  releaseActivityProc =() =>{
    const { rightData } = this.props;
    if(rightData && rightData.type == "activiti"){
      axios.post(releaseBussiNewModel(rightData.id)).then(res => {
        if(res.data.data && res.data.data.status == "已发布"){
          notification.success(
            {
              placement: 'bottomRight',
              bottom: 50,
              duration: 2,
              message: '发布成功!',
              description: '发布成功!'
            }
          )
          this.props.update(res.data.data)
        }else{
          notification.warning(
            {
              placement: 'bottomRight',
              bottom: 50,
              duration: 2,
              message: '提示',
              description: '流程发布失败，请检查该流程!'
            }
          )
        }
      })
    }else{
      notification.warning(
        {
          placement: 'bottomRight',
          bottom: 50,
          duration: 2,
          message: '请选择流程!',
          description: '请选择流程!'
        }
      )
    }
  }

  deleteActivityProc =() =>{
    const { rightData } = this.props;
   
      axios.post(deleteBussiNewModel(rightData.id)).then(res => {
        if(res.data.data && res.data.data == "success"){
          notification.warning(
            {
              placement: 'bottomRight',
              bottom: 50,
              duration: 2,
              message: '删除成功!',
              description: '删除成功!'
            }
          )
          this.props.deleteData()
        }
      })
   
  }
  deletpre=()=>{
    const { rightData } = this.props;
    if(rightData.status=="已发布"){
      this.setState({deleteTip:true})
    }else{
      this.deleteActivityProc()
    }
  }
  render() {
    const {modalVisible} = this.state;

    return (
      <div className={style.main}>

        {this.props.deledit}

        <div className={style.search}>
          <Search search={this.search}/>
        </div>
        <div className={style.tabMenu}>
          <PublicButton name={'新增'} title={'新增'} icon={'icon-add'} show = {true} edit = {this.props.addEdit}
                        afterCallBack = {this.handleAddTopbtn}
          />
          <PublicButton name={'修改'} title={'修改'} icon={'icon-xiugaibianji'} show = {true} edit = {this.props.releaseEdit}
              afterCallBack = {this.updateActivityProc}
          />
          <PublicButton name={'发布'} title={'发布'} icon={'icon-shenpi1'} show = {true} edit = {this.props.releaseEdit}
              afterCallBack = {this.releaseActivityProc}
          />
          <PublicButton name={'删除'} title={'删除'} icon={'icon-shanchu'} show = {true} edit = {this.props.deleteEdit}
                        useModel={true}
                        verifyCallBack={this.hasRecord}
                        afterCallBack={this.deletpre}
                        content={'你确定要删除吗？'}
          />
        </div>
        {modalVisible && <AddForm
          rightData={this.props.rightData}
          addSuccess={this.props.addSuccess}
          submit={this.submit.bind(this)}
          handleCancel={()=>this.setState({modalVisible:false})}/>}
          {this.state.deleteTip&& <TipModal title="警告" content="该流程已发布，确定删除吗？"
           onOk={()=>{
             this.setState({
              deleteTip:false
             })
             this.deleteActivityProc()}
            } 
           onCancel={()=>this.setState({deleteTip:false})}/>}
      </div>

    );
  }
}

export default WfAssignTopTags;

