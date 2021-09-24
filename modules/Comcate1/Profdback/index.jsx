import React, { Component } from 'react'
import style from './style.less'
import intl from 'react-intl-universal'
import { Table, Radio, message, Spin, Pagination, notification } from 'antd'
import TopTags from './TopTags/index'
import RightTags from '../../../components/public/RightTags/index'
import dynamic from 'next/dynamic'
import _ from "lodash";
import { queryQuestionComu, questionDelete, querySubmitAuth } from '../../../api/suzhou-api'
import axios from '../../../api/axios'
import { queryQuestionList,deleteQuestion,publishQuestion,forwardQuestion,hangUpQuestion,cancelHangUpQuestion,getPermission,getQuestion} from '../../Suzhou/api/suzhou-api'
import {secIssueList,querySecurityCheckList,secIssueClassList} from '@/api/suzhou-api'
import { connect } from 'react-redux'
import * as dataUtil from "../../../utils/dataUtil";
// import QuestionModal from './QuestionAdd'
import QuestionModal from '../../Components/Labels/ProjectProb/QuestionAdd'
import { queryParams } from '@/modules/Suzhou/components/Util/util';
import notificationFun from '@/utils/notificationTip';
import { firstLoad } from '@/modules/Suzhou/components/Util/firstLoad';
export class ComcateProfdback extends Component {
  constructor(props) {
    super(props)
    this.state = {
      date: new Date(),
      initDone: false,
      pageSize: 10,
      currentPage: 1,
      total: 0,
      columns: [],
      data: [],
      activeIndex: "",
      rightData: null,
      selectedRowKeys: [],
      projectId: null,
      params:{},//搜索
      delEdit:false,//删除按钮
      fabuEdit:false,//发布按钮
      handleEdit:false,//处理按钮
      zhuanfaEdit:false,//转发按钮
      shenheEdit:false,//审核按钮
      guaqiEdit:false,//挂起按钮
      quxiaoguaqiEdit:false,//取消挂起按钮
      permission:[],//角色权限
      // permissionEditBtn:false,
      // permissionReviewBtn:false,
      // permissionHandleBtn:false,
      permissionEditBtn:'',   //编辑权限
      permissionReviewBtn:'',    //审核权限
      permissionHandleBtn:'', //处理权限
    }
  }

  componentDidMount() {
    let loginUser = JSON.parse(sessionStorage.getItem('userInfo'));
    this.setState({
      loginUser
    })
    // 初始化数据
    // this.initDatas();   
    let menuCode = this.props.menuInfo.menuCode
    if(menuCode=='CM-ISSUE'){
      this.setState({
        permissionEditBtn:'ISSUE_EDIT_QUEST',   //编辑权限
        permissionReviewBtn:'ISSUE_SH_QUES',    //审核权限
        permissionHandleBtn:'ISSUE_HADLE_QUES', //处理权限
      })
    }else if(menuCode=='SCENE-CONSTRUCTIONQUES'){
      this.setState({
        permissionEditBtn:'CONSTRUCTIONQUES_EDIT_QUEST',   //编辑权限
        permissionReviewBtn:'CONSTRUCTIONQUES_SH_QUES',    //审核权限
        permissionHandleBtn:'CONSTRUCTIONQUES_HADLE_QUES', //处理权限
      })
    }else if(menuCode=='SCENE-CONTROLQUES'){
      this.setState({
        permissionEditBtn:'CONTROLQUES_EDIT_QUEST',   //编辑权限
        permissionReviewBtn:'CONTROLQUES_SH_QUES',    //审核权限
        permissionHandleBtn:'CONTROLQUES_HADLE_QUES', //处理权限
      })
    } 
    if(this.props.type){
        firstLoad().then(res => {
        this.setState(
          {
            projectId: res.projectId,
            projectName: res.projectName,
            sectionIds: res.sectionId,
            params:{projectId: res.projectId,sectionIds: res.sectionId,bizType:menuCode}
          },
          () =>
            this.getQuestionList()
        );
      });
    }else{
      this.getQuestionList()
    }
    
    axios.get(getPermission(menuCode)).then((res)=>{
      let permission = []
      res.data.data.map((item,index)=>{
        permission.push(item.code)
      })
        this.setState({
          permission
        })
    })
  }
  initDatas = () => {
    // dataUtil.CacheOpenProjectByType("comucate").getLastOpenProjectByTask((data) => {
    //   const { projectId, projectName } = data;
    //   if (projectId) {
    //     this.getQuestionListByProject(projectId, data, projectName);
    //   }
    // }, "comucate");
  }
  //获取 获取问题列表
  getQuestionList = () => {
    //首页跳转数据
    let myQuestion = JSON.parse(localStorage.getItem("myQuestion"))
    let leaderQues = JSON.parse(localStorage.getItem("leaderQues"))
    if (myQuestion) {
      console.log(myQuestion);
      localStorage.removeItem('myQuestion')
      this.setState({
        searchValue: myQuestion.title
      }, () => {
        // axios.get(getQuestion(this.props.data.id)).then((res) => {
        //   this.setState({
        //       data: res.data.data,
        //       task: res.data.data.taskName ? res.data.data.taskName : {}
        //   })
        // })
        // if (this.state.projectId) {
          // axios.get(queryQuestionComu(this.state.projectId, this.state.pageSize, this.state.currentPage) + (this.state.searchValue ? "/" + this.state.searchValue : ""), '', null, null, true).then((result) => {
          // axios.get(queryQuestionList(this.state.pageSize, this.state.currentPage)+queryParams({...this.state.params})).then(result=>{
          // 获取到的列表数据
          axios.get(getQuestion(myQuestion.id)).then(result=>{
            let record = result.data.data;
            if (record) {
              // let record = data.find(item =>item.id == myQuestion.id) 
              console.log(record);
                this.setState({
                  // 获取问题列表
                  data:[record],
                  total: 1,
                  topEdit:true
                }, () => {
                  this.getInfo(record)
                })
            }
          })
        // }
      })
    }else if(leaderQues&&leaderQues.pageKey==0){  //首页问题统计跳转时调用
      this.getInfo();
      const {projectId,viewType,status,sectionId,stationId} = leaderQues
      const params = {projectId,viewType,status,sectionId,stationId}
        axios.get(secIssueList(this.state.pageSize, this.state.currentPage),{params}).then(res=>{
          // 获取到的列表数据
          let data = res.data.data;
          this.setState({
            // 获取问题列表
            data,
            total:res.data.total,
          })
        })
    }else if(leaderQues&&leaderQues.pageKey==1){  //首页安全检查跳转时调用
      this.getInfo();
      const {projectId,checkStatus,status} = leaderQues
      const params = {projectId,checkStatus,status}
        axios.get(querySecurityCheckList(this.state.pageSize, this.state.currentPage),{params}).then(res=>{
           // 获取到的列表数据
           let data = res.data.data;
           this.setState({
             // 获取问题列表
             data,
             total:res.data.total,
           })
        })
    }else if(leaderQues&&leaderQues.pageKey==2){    //首页问题分类跳转时调用
      this.getInfo();
      const {projectId,type,status} = leaderQues
      const params = {projectId,type,status}
        axios.get(secIssueClassList(this.state.pageSize, this.state.currentPage),{params}).then(res=>{
           // 获取到的列表数据
           let data = res.data.data;
           this.setState({
             // 获取问题列表
             data,
             total:res.data.total,
           })
        })
    } else {
      this.setState({
        activeIndex: null,
        rightData: null,
        topEdit:true
      }, () => {
        // axios.get('api/szxm/rygl/peopleChange/getPeopleChangeWord?id=662001').then(res=>{
        //   console.log(res);
        // })
        this.getInfo();
        axios.get(queryQuestionList(this.state.pageSize, this.state.currentPage)+queryParams({...this.state.params})).then(res=>{
          // 获取到的列表数据
          let data = res.data.data;
          this.setState({
            // 获取问题列表
            data,
            total: res.data.total,
          })
        })
      })
    }
  }
  // 选择项目会掉
  handleGetProjectId = (...args) => {
    const [projectIds] = args;
    this.setState({ projectId: projectIds[0], params: Object.assign(this.state.params,{projectId: projectIds[0]}) }, () => {
      this.getQuestionList();
    });
  };

  //选择标段
  handleOpenSection = sectionIds => {
    this.setState(
      { 
        sectionId:sectionIds,
        params:Object.assign(this.state.params,{sectionIds: sectionIds.join(',')})
      },
      () => {
        this.getQuestionList();
      }
    );
  };
  //删除验证
  deleteVerifyCallBack = () => {
    let { rightData } = this.state;
    if (!rightData) {
      notification.warning(
        {
          placement: 'bottomRight',
          bottom: 50,
          duration: 2,
          message: '警告',
          description: '请选择要操作的数据'
        }
      )
      return false
    }
    return true
  }
  /**
   * 删除问题
   */
  deleteQuestion = () => {
    //要删除的问题id
    let { rightData } = this.state;
    if (rightData) {
      if (rightData.statusVo.code == '0') {
        // let url = dataUtil.spliceUrlParams(questionDelete, { "startContent": "项目【" + this.state.projectName + "】" });
        axios.deleted(deleteQuestion, { data: [rightData.id] }, true, '删除成功').then((res) => {
          this.getQuestionList();
          this.setState({
            selectedRowKeys: [],
            rightData:null
          },()=>{
            this.getInfo();
          })
        })
      } else {
        notification.warning(
          {
            placement: 'bottomRight',
            bottom: 50,
            duration: 2,
            message: '警告',
            description: '只能删除新建中的问题'
          }
        )
      }

    } else {
      notification.warning(
        {
          placement: 'bottomRight',
          bottom: 50,
          duration: 2,
          message: '警告',
          description: '请选择要删除的问题'
        }
      )
    }
  }
  // 发布审批
  directQuestion=()=>{
    let { rightData } = this.state;
    if (rightData) {
      if (rightData.statusVo.code == '0') {
        axios.post(publishQuestion(rightData.id), {}, true)
        .then((res) => {
          this.getQuestionList();
          this.setState({
            selectedRowKeys: []
          })
        })
      } else {
        notification.warning(
          {
            placement: 'bottomRight',
            bottom: 50,
            duration: 2,
            message: '警告',
            description: '只能发布新建中的问题'
          }
        )
      }

    } else {
      notification.warning(
        {
          placement: 'bottomRight',
          bottom: 50,
          duration: 2,
          message: '警告',
          description: '请选择要发布的问题'
        }
      )
    }
  }
  //挂起
  hangUpQuestion=()=>{
    let { rightData } = this.state;
    if (rightData) {
      if (rightData.statusVo.code == '1' || rightData.statusVo.code == '2') {
        axios.post(hangUpQuestion(rightData.id), {}, true).then((res) => {
          this.getQuestionList();
          this.getInfo();
        })
      } else {
        notification.warning(
          {
            placement: 'bottomRight',
            bottom: 50,
            duration: 2,
            message: '警告',
            description: '只能挂起待处理或待审核的问题'
          }
        )
      }

    } else {
      notification.warning(
        {
          placement: 'bottomRight',
          bottom: 50,
          duration: 2,
          message: '警告',
          description: '请选择要挂起的问题'
        }
      )
    }
  }
  //取消挂起
  cancelHangUpQuestion=()=>{
    let { rightData } = this.state;
    if (rightData) {
      if (rightData.statusVo.code == '4') {
        axios.post(cancelHangUpQuestion(rightData.id), {}, true).then((res) => {
          this.getQuestionList();
          this.getInfo();
        })
      } else {
        notification.warning(
          {
            placement: 'bottomRight',
            bottom: 50,
            duration: 2,
            message: '警告',
            description: '只能取消挂起状态的问题'
          }
        )
      }

    } else {
      notification.warning(
        {
          placement: 'bottomRight',
          bottom: 50,
          duration: 2,
          message: '警告',
          description: '请选择要取消挂起的问题'
        }
      )
    }
  }
  //新增
  addData = () => {
    this.getQuestionList();
  }
  getInfo = (record, index) => {
    let submitAuth = false;
    if(!record){
      this.setState({
        activeIndex: null,
        rightData: null,
        loginUserEdit:false,
        handleEdit:false,//处理按钮 1待处理
        delEdit :false,//删除按钮 0新建
        fabuEdit:false,//发布按钮
        zhuanfaEdit:false,//转发按钮
        shenheEdit:false,//审核按钮 2待审核
        guaqiEdit:false,//挂起按钮
        quxiaoguaqiEdit:false,//取消挂起按钮 4挂起
      })
    }else{
      let id = record.id;
      this.setState({
        activeIndex: id,
        rightData: record,
        loginUserEdit:this.state.loginUser.id == record.currentUserVo.id ?true:false,
        handleEdit:(this.state.loginUser.id == record.currentUserVo.id ?true:false) && (record.statusVo.code == 1),//处理按钮 1待处理
        delEdit :(this.state.loginUser.id == record.createrVo.id ?true:false) && (record.statusVo.code == 0),//删除按钮 0新建
        fabuEdit:(this.state.loginUser.id == record.createrVo.id ?true:false) && (record.statusVo.code == 0),//发布按钮
        zhuanfaEdit:(this.state.loginUser.id == record.currentUserVo.id ?true:false) && (record.statusVo.code == 1),//转发按钮
        shenheEdit:(this.state.loginUser.id == record.currentUserVo.id ?true:false) && (record.statusVo.code == 2),//审核按钮 2待审核
        guaqiEdit:(this.state.loginUser.id == record.createrVo.id ?true:false) && (record.statusVo.code == 1 || record.statusVo.code == 2),//挂起按钮
        quxiaoguaqiEdit:(this.state.loginUser.id == record.createrVo.id ?true:false) && (record.statusVo.code == 4),//取消挂起按钮 4挂起
      })
    }
    // axios.get(querySubmitAuth(id)).then((res) => {
    //   submitAuth = res.data.data
    //   this.setState({
    //     activeIndex: id,
    //     rightData: record,
    //     handleEditAuth: record.user.id == this.state.loginUser.id ? true : false && (record.status.id == 'INHAND' || record.status.id == 'RELEASE'),
    //     submitAuth,
    //     isloginUserAuth: record.user.id == this.state.loginUser.id ? true : false,
    //     iscreatorAuth: record.creator.id == this.state.loginUser.id ? true : false
    //   })
    // })

  }
  setClassName = (record, index) => {
    //判断索引相等时添加行的高亮样式
    return record.id === this.state.activeIndex ? 'tableActivty' : "";
  };
  closeApprovalModal = () => { this.setState({ addApproval: false }) }
  closeReleaseModal = () => { this.setState({ addRelease: false }) }

  //修改
  updateData = (newData) => {
    // let { data } = this.state;
    // let index = data.findIndex(item => item.id == newData.id);
    // data.splice(index, 1, newData);
    // this.setState({
    //   data
    // })
    this.getQuestionList();
  }
  //问题详情
  viewDetail = (record) => {
    this.setState({
      isShowModal: true,
      addOrModify: 'add',
      modalTitle: '问题跟踪',
      checkRecord: record
    });
  }
  //关闭权限弹框modal
  closeDebugAdd = () => {
    this.setState({
      isShowModal: false
    });
  };
  //搜索
  search = (val) => {
    this.setState({
      params: Object.assign(this.state.params,val)
    }, () => {
      this.getQuestionList();
    })
  }

  setSubmitAuth = () => {
    this.setState({
      submitAuth: false
    })
  }

  render() {
    const { intl } = this.props.currentLocale;

    const columns = [
      {
        title: intl.get('wsd.i18n.comu.question.title'),
        dataIndex: 'title',
        key: 'title',
      },
      {
        title:'项目名称',//项目
        dataIndex: 'projectName',
        key: 'projectName',
      },
      {
        title:'标段名称',//
        dataIndex: 'sectionName',
        key: 'sectionName',
      },
      {
        title: '问题来源',//问题来源
        dataIndex: 'bizTypeVo',
        key: 'bizTypeVo',
        render : text => text ? text.name : ''
      },
      {
        title: intl.get('wsd.i18n.comu.question.questiontype'),//问题类型
        dataIndex: 'typeVo',
        key: 'typeVo',
        render: text => text ? text.name : ''
      },
      // {
      //   title: intl.get('wsd.i18n.comu.question.questionpriority'),//优先级
      //   dataIndex: 'priority',
      //   key: 'priority',
      //   render: text => text ? text.name : ''
      // },
      {
        title: intl.get('wsd.i18n.comu.meetingaction.iptname'),//责任主体
        dataIndex: 'orgVo',
        key: 'orgVo',
        render: text => text ? text.name : ''
      },
      {
        title: intl.get('wsd.i18n.comu.meetingaction.username'),//责任人
        dataIndex: 'userVo',
        key: 'userVo',
        render: text => text ? text.name : ''
      },
      {
        title:'当前处理人',//
        dataIndex: 'currentUserVo',
        key: 'currentUserVo',
        render: text => text ? text.name : ''
      },
      {
        title:'当前处理人所属组织',//
        dataIndex: 'currentUserOrgVo',
        key: 'currentUserOrgVo',
        render: text => text ? text.name : ''
      },
      {
        title: intl.get('wsd.i18n.plan.projectquestion.dealtime'),//要求处理日期
        dataIndex: 'handleTime',
        key: 'handleTime',
        render: (text) => dataUtil.Dates().formatDateString(text)
      },
      {
        title: intl.get('wsd.i18n.plan.projectquestion.introducer'),//提出人
        dataIndex: 'createrVo',
        key: 'createrVo',
        render: text => text ? text.name : ''
      },
      {
        title:'提出人所属组织',//
        dataIndex: 'createrOrgVo',
        key: 'createrOrgVo',
        render: text => text ? text.name : ''
      },
      {
        title: intl.get('wsd.i18n.plan.projectquestion.applytime'),//提出日期
        dataIndex: 'createTime',
        key: 'createTime',
        render: (text) => dataUtil.Dates().formatDateString(text)
      }, {
        title: intl.get('wsd.i18n.plan.projectquestion.solvetime'),//解决日期
        dataIndex: 'endTime',
        key: 'endTime',
        render: (text) => dataUtil.Dates().formatDateString(text)
      }, {
        title: intl.get('wsd.i18n.base.planTem.status'),//状态
        dataIndex: 'statusVo',
        key: 'stastatusVotus',
        render: (text) => {

          if (text) {
            return text.name

          }
        }
      }, 
      {
        title: "问题详情",
        width: 80,
        render: (text, record) => {
          return <a onClick={this.viewDetail.bind(this, record)} style={{ cursor: 'pointer' }}>详情</a>
        }
      }
    ];

    let { selectedRowKeys } = this.state
    const rowSelection = {
      selectedRowKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({
          selectedRowKeys,
        })
      },

    };
    const ApplyModal = dynamic(
      import
        ('./ApplyModal/index'), {
      loading: () => <Spin size="small" />
    }
    )
    let pagination = {
      total: this.state.total,
      // hideOnSinglePage: true,
      current: this.state.currentPage,
      pageSize: this.state.pageSize,
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => `总共${this.state.total}条`,
      onShowSizeChange: (current, size) => {
        this.setState({
          pageSize: size,
          currentPage: 1
        }, () => {
          this.getQuestionList()
        })
      },
      onChange: (page, pageSize) => {
        this.setState({
          currentPage: page
        }, () => {
          this.getQuestionList()
        })
      }
    }
    let startContent = "项目【" + this.state.projectName + "】,问题管理【" + (this.state.rightData ? this.state.rightData.title : null) + "】";
    return (
      <div>
        <TopTags 
          deleteQuestion={this.deleteQuestion}
          projectId={this.state.projectId}
          projectName={this.state.projectName}
          sectionId={this.state.sectionId}
          addData={this.addData}
          update={this.getQuestionList}
          search={this.search}
          deleteVerifyCallBack={this.deleteVerifyCallBack}
          initDatas={this.initDatas}
          loginUserId={this.state.loginUser ? this.state.loginUser.id : ''}
          iscreatorAuth={this.state.iscreatorAuth}
          rightData={this.state.rightData}
          // topEdit={this.state.topEdit}
          delEdit={this.state.delEdit}//删除按钮
          fabuEdit={this.state.fabuEdit}//发布按钮
          handleEdit={this.state.handleEdit}//处理按钮
          zhuanfaEdit={this.state.zhuanfaEdit}//转发按钮
          shenheEdit={this.state.shenheEdit}//审核按钮
          guaqiEdit={this.state.guaqiEdit}//挂起按钮
          quxiaoguaqiEdit={this.state.quxiaoguaqiEdit}//取消挂起按钮
          params = {this.state.params}
          directQuestion = {this.directQuestion}
          hangUpQuestion = {this.hangUpQuestion}
          cancelHangUpQuestion = {this.cancelHangUpQuestion}

          permissionEditBtn = {this.state.permissionEditBtn} //编辑权限
          permissionReviewBtn={this.state.permissionReviewBtn}//审核权限
          permissionHandleBtn={this.state.permissionHandleBtn}//处理权限
          permission = {this.state.permission}
          type={this.props.type}
          handleOpenSection={this.handleOpenSection}
          handleGetProjectId={this.handleGetProjectId}
        />

        <div className={style.main}>
          <div className={style.leftMain} style={{ height: this.props.height }}>
            <div style={{ minWidth: 'calc(100vw - 60px)' }}>

              <Table columns={columns}
                size='small'
                // rowSelection={rowSelection}
                dataSource={this.state.data}
                pagination={pagination}
                rowClassName={(record) => this.setClassName(record)}
                rowKey={record => record.id}
                onRow={(record, index) => {
                  return {
                    onClick: (event) => {
                      this.getInfo(record, index)
                    }
                  }
                }}
                scroll={{x:'1800px'}}
              />
            </div>
            {this.state.addApproval && <ApplyModal handleCancel={this.closeApprovalModal} title={this.state.title} />}
            {this.state.addRelease && <ApplyModal handleCancel={this.closeReleaseModal} title={this.state.title} />}
          </div>
          <div className={style.rightBox} style={{ height: this.props.height }}>
            <RightTags rightTagList={this.state.rightTags} rightData={this.state.rightData} projectId={this.state.projectId}
              menuId={this.props.menuInfo.id}
              menuCode={this.props.menuInfo.menuCode}
              updateData={this.updateData}
              bizType='question'
              bizId={this.state.rightData ? this.state.rightData.id : null}
              fileEditAuth={true}
              handleEditAuth={this.state.handleEditAuth}
              submitAuth={this.state.submitAuth}
              setSubmitAuth={this.setSubmitAuth}
              projectName={this.state.projectName}
              isloginUserAuth={this.state.isloginUserAuth}
              loginUser  = {this.state.loginUser}
              iscreatorAuth={this.state.iscreatorAuth}
              extInfo={{
                startContent
              }}
              permissionEditBtn = {this.state.permissionEditBtn} //编辑权限
              permissionReviewBtn={this.state.permissionReviewBtn}//审核权限
              permissionHandleBtn={this.state.permissionHandleBtn}//处理权限
              permission = {this.state.permission}
              type={this.props.type}
            />
          </div>
          {/* 问题跟踪 */}
          {this.state.isShowModal &&
            <QuestionModal
              visible={this.state.isShowModal}
              handleCancel={this.closeDebugAdd.bind(this)}
              title={this.state.modalTitle}
              addOrModify={this.state.addOrModify}
              data={this.state.checkRecord}
              parentData={this.props.data}
              rightData={this.props.rightData}
              menuCode={this.props.menuCode}
              updateSuccess={this.updateSuccess} addData={this.addData}
            />}
        </div>

      </div>

    )
  }
}

export default connect(state => ({
  currentLocale: state.localeProviderData
}))(ComcateProfdback);
