import React, { Component } from 'react'
import { Row, Col, Table, Icon, notification } from 'antd'
import style from './style.less'
import Collect from './Collect/index'
import TopTags from './TopTags/index'
import RightTags from '../../../components/public/RightTags/index'
import Manage from './Manage/index'
import MyIcon from '../../../components/public/TopTags/MyIcon'
import { connect } from 'react-redux'
import * as dataUtil from "../../../utils/dataUtil"
import * as util from '../../../utils/util'
import axios from '../../../api/axios'
import TreeTable from '../../../components/PublicTable'
import PageTable from '../../../components/PublicTable'
import { docCompFolderList, docCompList, docCompDel, docFileInfo, docFavoriteCancelCollection } from '../../../api/api'
import {docCorpFolderTree_} from '../../../api/suzhou-api'
import ExtLayout from "../../../components/public/Layout/ExtLayout";
import LeftContent from "../../../components/public/Layout/LeftContent";
import MainContent from "../../../components/public/Layout/MainContent";
import Labels from "../../../components/public/Layout/Labels";
import Toolbar from "../../../components/public/Layout/Toolbar";
import {getFolderByMenuId,getPermission} from '../../Suzhou/api/suzhou-api.js';

/**
 企业文档
 */
class CompDoc extends Component {

  state = {
    collectVisible: false,
    DroVisible: false,
    rightHide: true,
    pageSize: 10,
    currentPage: 1,
    expandedRowKeys: [],
    rowKey: '',
    rightData: null,
    LeftData: [],
    RightData: [],
    leftRecord: null,
    selectedRowKeys: [],
    total: 0,
    collectReact: null,
    searchVal: null,
    contentMenu: [{ name: '管理文件夹', fun: 'folder', type: 'buttom', icon: 'icon-dakai', isPublic: false }],
    headerMenu: [{ name: '管理文件夹', fun: 'folder', type: 'buttom', icon: 'folder', isPublic: false }],
    cprtmEditAuth:false,
    permission:[],
    editPermission:'',  //基本信息编辑权限 上传、删、改
    sendPermission:'',  //发布权限
    updatePermission:'',  //升版权限
    managePermission:'',  //管理文件夹权限
    rangePermission:'', //发布范围权限
  }

  componentDidMount() {
    let menuCode = this.props.menuInfo.menuCode
    axios.get(getPermission(menuCode)).then((res)=>{
      let permission = []
      res.data.data.map((item,index)=>{
        permission.push(item.code)
      })
      this.setState({
        permission
      })
      if(menuCode=='QUALITY-KNOWLEDGE'){
        this.setState({
          editPermission:'KNOWLEDGE_EDIT-MASSKNOWLEDGE',  
          sendPermission:'KNOWLEDGE_RELEASE-MASSKNOWLEDG',   
          updatePermission:'KNOWLEDGE_UPDATE-VERSION-KNO',  
        })
      }else if(menuCode=='DM-CORP'){
        this.setState({
          editPermission:'CORP_EDIT_DOC_CORP',  
          sendPermission:'CORP_RELEASE-DOC-CORP',   
          updatePermission:'CORP_UPGRADE_VER_CORP', 
          managePermission:'CORP_MANAGE_FOLDERS_CORP', 
          rangePermission:'CORP_RELEASE-RANGE-CORP', 
        })
      }
    })
    const userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
    this.setState({
      actuName:userInfo.actuName,
      userId:userInfo.id
    })
  }
  /**
   @method 父组件即可调用子组件方法
   @description 父组件即可调用子组件方法
   */
  onRef = (ref) => {
    this.table = ref
  }
  /**
   @method 父组件即可调用子组件方法
   @description 父组件即可调用子组件方法
   */
  onRefR = (ref) => {
    this.tableR = ref
  }

  //请求左边文件夹列表
  getFolderList = (callBack) => {
    //静态刷新
    if (this.state.staticRefresh) {
      callBack(this.state.LeftData)
      this.setState({ staticRefresh: false })
      return
    }
    if(this.props.menuInfo.menuCode.indexOf('QUALITY') != -1){
      axios.post(getFolderByMenuId(this.props.menuInfo.id) + `?name=${this.state.searchVal ? this.state.searchVal : ''}`).then(res => {
        callBack(res.data.data);
        if (res.data.data) {
          this.table.getLineInfo(res.data.data[0])
        }
  
      })
    }else{
      axios.post(docCorpFolderTree_ + `?name=${this.state.searchVal ? this.state.searchVal : ''}`).then(res => {
        callBack(res.data.data);
        if (res.data.data) {
          this.table.getLineInfo(res.data.data[0])
        }
  
      })
    }
  }

  //请求右边文档列表
  getRightList = (currentPageNum, pageSize, callBack) => {
    let { leftRecord } = this.state;
    let id = leftRecord ? leftRecord.id : null;
    if (id) {
      axios.get(docCompList(id, pageSize, currentPageNum) + `?name=${this.state.searchVal ? this.state.searchVal : ''}`).then(res => {
        callBack(res.data.data)
        this.setState({
          RightData: res.data.data,
          total: res.data.total,
          searchVal: "",
        })
      })
    } else {
      callBack([])
    }

  }


  //收藏
  collect = (record) => {
    if (record.isFavorite) {
      axios.deleted(docFavoriteCancelCollection, { data: [record.id] }, true, null, true).then(res => {
        this.tableR.getData();
      })
    } else {
      this.setState({ collectVisible: true, collectReact: record })
    }

  }

  collectHandleCancel = () => {
    this.setState({
      collectVisible: false
    })
  }

  leftGetInfo = (record) => {
    this.setState({
      leftRecord: record,
      selectedRowKeys: [],
      RightData: [],
      rightData: null,
    }, () => {
      if (record) {
          this.setState({
            folderId : record.id,
          })
      }
      this.tableR.getData()
    })
  }

  getInfo = (record) => {
    this.setState({
      rightData: record
    },()=>{
      if (record.creator.id == this.state.userId){
        this.setState({
          cprtmEditAuth: true
        })
      }
    })
  }

  manageHandleCancel = () => {
    this.setState({
      MangageDocVisible: false
    })
  }


  RightHide = (v) => {
    this.setState({ rightHide: false })

  }
  rightIconBtn = () => {
    this.setState({ rightHide: true })
  }
  DropHandleCancel = (v, id) => {
    if (!this.state.LeftData) {
      this.setState({ MangageDocVisible: true })
    }
  }
  rightClick = (e) => {
    this.setState({ MangageDocVisible: true })
  }


  //文件夹名称修改
  forceNameUpdate = (LeftData) => {
    this.setState({
      LeftData,
      staticRefresh: true
    }, () => {
      this.table.getData();
    })

  }

  //删除文件夹
  deleteFile = data => {
    this.setState({
      data,
      leftRecord: null,
      rightList: [],
      rightData: null,
      selectedRowKeys: [],
    });
  };

  //刷新右侧列表
  updateData = () => {
    this.tableR.getData()
  }
  //删除验证
  deleteVerifyCallBack = () => {
    let { selectedRowKeys, selectedRows } = this.state;
    let { intl } = this.props.currentLocale;
    if (selectedRowKeys == 0) {

      notification.warning(
        {
          placement: 'bottomRight',
          bottom: 50,
          duration: 2,
          message: intl.get('wsd.global.tip.title2'),
          description: intl.get('wsd.global.tip.content2')
        }
      )
      return false
    }
    let flag = selectedRows.findIndex(item => item.status.id != "EDIT")
    if (flag > -1) {
      notification.warning(
        {
          placement: 'bottomRight',
          bottom: 50,
          duration: 2,
          message: "提示",
          description: "只能删除编制中的文档"
        }
      )
      return false
    }
    return true

  }

  //文档列表删除
  delete = () => {
    let { selectedRowKeys, rightData, leftRecord } = this.state;
    let { intl } = this.props.currentLocale;
    axios.deleted(docCompDel, { data: selectedRowKeys }, true, intl.get('wsd.global.btn.successfullydelete'), true).then(res => {
      this.table.update(leftRecord, res.data.data);
      this.tableR.getData()
      let index = rightData ? selectedRowKeys.findIndex(item => item == rightData.id) : -1;
      this.setState({
        selectedRowKeys: [],
        selectedRows: [],
        rightData: index != -1 ? null : rightData
      })
    })
  }

  //上传后文档列表操作
  addList = (newData) => {


    let data = newData.docCorpFolderTreeVo;
    let { LeftData, leftRecord } = this.state;
    this.table.update(leftRecord, newData.docCorpFolderTreeVo)
    this.tableR.getData()
  }

  //刷新右侧数据
  refreshData = () => {
    this.tableR.getData()
  }
  //下载
  downloadDoc = () => {
    const { intl } = this.props.currentLocale;
    let { rightData } = this.state;
    if (rightData) {
      if (rightData.fileId) {
        axios.get(docFileInfo(rightData.fileId)).then(res => {
          if (res.data.data) {
            util.download(res.data.data.fileUrl, res.data.data.fileName, res.data.data.id)
          }
        })
      } else {
        notification.warning(
          {
            placement: 'bottomRight',
            bottom: 50,
            duration: 2,
            message: intl.get('wsd.i18n.doc.compdoc.hint'),
            description: intl.get('wsd.i18n.doc.compdoc.hinttext')
          }
        )
      }
    } else {

      notification.warning(
        {
          placement: 'bottomRight',
          bottom: 50,
          duration: 2,
          message: intl.get('wsd.global.tip.title2'),
          description: intl.get('wsd.global.tip.content1')
        }
      )

    }

  }

  //右击事件
  contextMenuModul = (event) => {
    event.preventDefault()

    this.setState({ DroVisible: true, X: event.clientX, Y: event.clientY - 110 })


  }


  eyeClick = (record) => {
    const { intl } = this.props.currentLocale;

    let arr = ['html', 'txt', 'jpg', 'jpeg', 'gif', 'png', 'art', 'au', 'aiff', 'xbm', 'pdf','doc','docx','rtf','xls','xlsx','csv'];
    if (record.fileId) {
      const { startContent } = this.state
      let url = dataUtil.spliceUrlParams(docFileInfo(record.fileId), { startContent });
      axios.get(url).then(res => {
        if (res.data.data && res.data.data.fileUrl) {
          let type = res.data.data.fileName ? res.data.data.fileName.substring(res.data.data.fileName.lastIndexOf(".")+1) : '';
          if(type){
            type = type.toLowerCase();
          }
          let index = arr.findIndex(item => item == type);
          if (index != -1) {
            if (res.data.data.fileViewUrl && (type == 'doc' ||  type == 'docx' ||  type == 'rtf' ||  type == 'xls' ||  type == 'xlsx' ||  type == 'csv')){
              window.open(res.data.data.fileViewUrl)
            } else{
              window.open(res.data.data.fileUrl)
            }
          } else {
            dataUtil.message(intl.get('wsd.global.hint.docwarning'));
          }
        }
      })
    } else {
      dataUtil.message(intl.get('wsd.i18n.doc.compdoc.hinttext'));
    }
  }






  /**
   * 获取复选框 选中项、选中行数据
   * @method updateSuccess
   * @param {string} selectedRowKeys 复选框选中项
   * @param {string} selectedRows  行数据
   */
  getSelectedRowKeys = (selectedRowKeys, selectedRows) => {
    this.setState({
      selectedRows,
      selectedRowKeys
    })
  }

  search = (val) => {
    this.setState({
      searchVal: val
    }, () => {

      this.tableR.getData()
    })
  }

  render() {

    const { intl } = this.props.currentLocale;

    const LeftColumns = [{
      title: intl.get("wsd.i18n.doc.compdoc.foldername"),//文件夹名称
      dataIndex: 'name',
      key: 'name',
      width: '80%',
      render: text => <span><MyIcon type="icon-wenjianjia" className={style.leftTableIcon} />{text}</span>
    },
    // {
    //
    //   title: " ",//文档数量
    //   dataIndex: 'docNum',
    //   key: 'docNum',
    //
    // }
    ];


    const RightColumns = [{
      title: intl.get('wsd.i18n.doc.temp.title'), //文档标题
      dataIndex: 'docTitle',
      key: 'docTitle',
      width: '20%',
      render: (text, record) => <span>
        <MyIcon type={record.isFavorite ? "icon-shoucang1" : "icon-shoucang2"}
          onClick={this.collect.bind(this, record)}
          className={style.icon} /> <MyIcon
          type="icon-chakan" className={style.icon} onClick={this.eyeClick.bind(this, record)} />{text}</span>
    }, {
      title: intl.get("wsd.i18n.doc.compdoc.docserial"),//文档编号
      dataIndex: 'docNum',
      key: 'docNum',
      width: '10%',
    },  {
      title: intl.get("wsd.i18n.doc.temp.versions"),//版本
      dataIndex: 'version',
      key: 'version',
      width: '10%',
    }, {
      title: intl.get("wsd.i18n.contract.contractchange.fileinfopersonal"),//上传人
      dataIndex: 'creator',
      key: 'creator',
      width: '10%',
      render: text => text ? text.name : ''
    }, {
      title: intl.get("wsd.i18n.plan.feedback.creattime"),//上传时间
      dataIndex: 'creatTime',
      key: 'creatTime',
      width: '10%',
      render: (text) => dataUtil.Dates().formatDateString(text)
    },
    // {
    //   title: intl.get("wsd.i18n.plan.baseline.lastupdtime"),//更新时间
    //   dataIndex: 'lastUpdTime',
    //   key: 'lastUpdTime',
    //   width: '10%',
    //   render: (text) => dataUtil.Dates().formatDateString(text)
    // },
    {
      title: intl.get("wsd.i18n.doc.compdoc.docstate"),//文档状态
      dataIndex: 'status',
      key: 'status',
      render: text => text ? text.name : ''
    }];
    return (
      <ExtLayout renderWidth={({ contentWidth }) => { this.setState({ contentWidth }) }}>
        <LeftContent width={300}>
          <TreeTable onRef={this.onRef}
            expanderLevel={"ALL"}
            getData={this.getFolderList}
            columns={LeftColumns}
            contentMenu={this.props.menuInfo.menuCode.indexOf('QUALITY') != -1?null:(this.state.permission.indexOf(this.state.managePermission)!==-1 ?this.state.contentMenu:null)}
            scroll={{ x: '100%', y: this.props.height - 100 }}
            getRowData={this.leftGetInfo}
            rightClick={this.rightClick}
            headerMenu = {this.state.headerMenu}
          />
        </LeftContent>
        <MainContent contentWidth={this.state.contentWidth} contentMinWidth={600}>
          <PageTable onRef={this.onRefR}
            rowSelection={true}
            pagination={true}
            useCheckBox={true}
            onChangeCheckBox={this.getSelectedRowKeys}
            getData={this.getRightList}
            checkboxStatus = {(item) => { return item.status.id != "EDIT" }}
            columns={RightColumns}
            scroll={{ x: '100%', y: this.props.height - 100 }}
            getRowData={this.getInfo}
            total={this.state.total}
          />
        </MainContent>

        <Toolbar>
          <TopTags leftRecord={this.state.leftRecord} getRightList={this.refreshData} rightData={this.state.rightData}
            folderId={this.state.folderId}
            update={this.updateData}
            editAuth={this.state.cprtmEditAuth}
            delete={this.delete} addList={this.addList} download={this.downloadDoc} search={this.search}
            deleteVerifyCallBack={this.deleteVerifyCallBack}  startContent={this.state.startContent}
            permission={this.state.permission} editPermission={this.state.editPermission}  
            sendPermission={this.state.sendPermission} updatePermission={this.state.updatePermission}             
          />
        </Toolbar>
        <RightTags rightTagList={this.state.rightTags} rightData={this.state.rightData} rightHide={this.RightHide}
          rightIconBtn={this.rightIconBtn}
          menuCode={this.props.menuInfo.menuCode}
          updateData={this.updateData} callBackBanner={this.props.callBackBanner}
          menuCode={this.props.menuInfo.menuCode}
          bizType={'corp'}
          wokrflowType={'compdoc'}
          workflowBizIds={[this.state.rightData ? this.state.rightData.id : null]}
          bizId = {this.state.rightData ? this.state.rightData.id : null}
          cprtmEditAuth={this.state.cprtmEditAuth}
          openWorkFlowMenu={this.props.openWorkFlowMenu}
          menuInfo={this.props.menuInfo} 
          permission={this.state.permission}
          editPermission={this.state.editPermission}
          rangePermission={this.state.rangePermission}/>
        {/* 文档收藏 */}
        {this.state.collectVisible &&
          <Collect modalVisible={this.state.collectVisible} handleCancel={this.collectHandleCancel}
            record={this.state.collectReact}
            update={this.refreshData} />}
        {/* 管理文件夹 */}
        {this.state.MangageDocVisible &&
          <Manage modalVisible={this.state.MangageDocVisible} handleCancel={this.manageHandleCancel} searchVal={this.state.searchVal}deleteFile={this.deleteFile}
            upDate={this.forceNameUpdate} getFolderList={this.getFolderList}/>}

      </ExtLayout>
     
          // {!this.state.rightHide &&
          //   <div className={style.rightIconBtn} onClick={this.rightIconBtn}><Icon type="double-right" /></div>
          // }
          
    )
  }
}


/* *********** connect链接state及方法 start ************* */
export default connect(state => ({
  currentLocale: state.localeProviderData,
}))(CompDoc);
/* *********** connect链接state及方法 end ************* */
