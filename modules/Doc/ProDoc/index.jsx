import React, { Component } from 'react'
import SelectProjectBtn from "../../../components/public/SelectBtn/SelectProjectBtn"
import PublicViewButton from "../../../components/public/TopTags/PublicViewButton"
import style from './style.less'
import Collect from './Collect/index'
import Manage from './Manage/index'
import TopTags from './TopTags/index'
import RightTags from '../../../components/public/RightTags/index'
import MyIcon from '../../../components/public/TopTags/MyIcon'
import { connect } from 'react-redux'
import * as util from '../../../utils/util'
import axios from '../../../api/axios'
import TreeTable from '../../../components/PublicTable'
import PageTable from '../../../components/PublicTable'
import { docProjectFolderTree, docProjectList, docProjectDel, docFileInfo, docFavoriteCancelCollection, docGivingList } from '../../../api/api'
import * as dataUtil from "../../../utils/dataUtil";
import ExtLayout from "../../../components/public/Layout/ExtLayout";
import LeftContent from "../../../components/public/Layout/LeftContent";
import MainContent from "../../../components/public/Layout/MainContent";
import Toolbar from "../../../components/public/Layout/Toolbar";


class ProjectDoc extends Component {

  state = {
    collectVisible: false,
    DroVisible: false,
    MangageDocVisible: false,
    rowKey: '',
    rightHide: true,
    rightData: null,
  
    rightList: [],
    projectData: [],
    projectId: null,
    total: 0,
    pageSize: 10,
    currentPage: 1,
    selectedRowKeys: [],
    selectedRows: [],
    collectReact: null,
    selectKey: '',
    contentMenu: [{ name: '管理文件夹', fun: 'folder', type: 'buttom', icon: 'folder', isPublic: false }],
    headerMenu : [{ name: '管理文件夹', fun: 'folder', type: 'buttom', icon: 'folder', isPublic: false }]
  }

  /**
   @method 父组件即可调用子组件方法
   @description 父组件即可调用子组件方法
   */
  onRef = (ref) => {
    this.leftTable = ref
  }
  /**
   @method 父组件即可调用子组件方法
   @description 父组件即可调用子组件方法
   */
  onRefR = (ref) => {
    this.rightTable = ref
  }

  componentDidMount() {

  }

  // 初始化数据
  getLeftDataList = (callback) => {

    dataUtil.CacheOpenProject().getLastOpenProjectByTask((data) => {
      const { projectId, projectName } = data;
      if (projectId) {
        this.setState({
          projectId,
          projectName
        }, () => {
          this.getProjectDocList(callback);
        })
      }else{
        callback([]);
      }
    });
  }

  //打开项目
  initDatas = () => {
    this.leftTable.getData();
  }

  // 获取项目文件夹列表
  getProjectDocList = (callBack) => {
    let { projectId} = this.state;
    this.setState({
      selectedRowKeys: [],
      rightList: [],
      leftRecord:null,
      rightData: null,
      rightHide: true,
    },() => {
      let url = dataUtil.spliceUrlParams(docProjectFolderTree(projectId || 0),{name : this.state.searchValue || "",docSearchType : this.state.selectKey || ""});
      axios.post(url,{}).then(res => {
        const { data } = res.data
        callBack(data ? data : []);
        this.rightTable.getData();
      });
    });
  }

  /**
   * 收藏
   *
   * @param record
   * @param value
   */
  updateFavorite = (record,value) =>{
    this.rightTable.update(record,{...record, isFavorite : value});
  }

  //收藏
  collect(record) {
    if (record.isFavorite) {
      const { startContent } = this.state
      let url = dataUtil.spliceUrlParams(docFavoriteCancelCollection, { startContent });
      axios.deleted(url, { data: [record.id] },true, '取消收藏成功',true).then(res => {
        this.updateFavorite(record,null);
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

  manageHandleCancel = () => {
    // 刷新
    this.leftTable.getData();
    this.setState({
      MangageDocVisible: false
    })
  }


  //右侧表格点击行事件
  getInfo = (record) => {
    this.setState({
      rightData: record

    })
  }
  /**
   * 获取表格数据
   *
   * @returns {null}
   */
  findLeftDataList = () =>{
    return this.leftTable.findDataList();
  }

  //左侧表格点击事件
  getLeftInfo = (record) => {
    const { projectName } = this.state
    this.setState({
      leftRecord: record,
      startContent: "项目【" + projectName + "】,文件夹【" + record.name + "】",
      selectedRowKeys: [],
      rightList: [],
      rightData: null,
    }, () => {
      this.rightTable.getData();
    })

  }
  /**
   * 获取复选框 选中项、选中行数据
   * @method
   * @param {string} selectedRowKeys 复选框选中项
   * @param {string} selectedRows  行数据
   */
  getSelectedRowKeys = (selectedRowKeys, selectedRows) => {
    this.setState({
      selectedRows,
      selectedRowKeys
    })
  }
  //右键操作 管理文件夹
  rightClick = (e) => {
    this.setState({ MangageDocVisible: true })
  }


  RightHide = (v) => {
    this.setState({ rightHide: false })

  }
  rightIconBtn = () => {
    this.setState({ rightHide: true })
  }

  queryDocSearchType = (key) => {

    this.setState({
      selectKey: key
    }, () => {
      this.leftTable.getData();
    })
  }

  //文件夹数据修改
  forceNameUpdate = (data) => {
    this.setState({
      data,
      staticRefresh: true
    }, () => {
      this.leftTable.getData();
    })
  }
  //删除文件夹
  deleteFile = (data) => {
    this.setState({
      data,
      leftRecord: null,
      rightList: [],
      rightData: null,
      selectedRowKeys: [],
      staticRefresh: true
    }, () => {
      this.leftTable.getData();
    })
  }

  /**
   *  获取项目文档列表
   *
   *  @param currentPageNum 当前页签
   *  @param pageSize 每页显示数据
   *  @param callBack 回调方法
   * */
  getRightDataList = (currentPageNum, pageSize, callBack) => {

    let { leftRecord, searchValue, selectKey,projectId } = this.state;
    this.setState({
      selectedRowKeys: [],
      selectedRows: [],
      rightData: null
    },() => {
      if(!leftRecord){
        callBack([]);
        return;
      }
      let url = dataUtil.spliceUrlParams(docProjectList(leftRecord.id, leftRecord.type, leftRecord.type == "project" ? true : false,projectId,pageSize, currentPageNum),{name:searchValue || "",docSearchType : selectKey || "" })
      axios.post(url).then(res => {
        callBack(res.data.data , res.data.total);
      });
    })
  }
 //获取分发列表
 getDocGivingList=(callBack)=>{
  let { leftRecord, searchValue, selectKey,projectId } = this.state;
  let url = dataUtil.spliceUrlParams(docGivingList(leftRecord.id, leftRecord.type, leftRecord.type == "project" ? true : false,projectId),{name:searchValue || "",docSearchType : selectKey || "" })
  axios.post(url).then(res=>{
    callBack(res.data.data)
  })
}

  //删除校验
  deleteVerifyCallBack = () => {
    let { selectedRowKeys, selectedRows } = this.state;
    const { intl } = this.props.currentLocale;
    if (selectedRowKeys.length == 0) {
      dataUtil.message(intl.get('wsd.global.tip.content2'));
      return false
    }
    let flag = selectedRows.findIndex(item => item.status.id != "EDIT")
    if (flag > -1) {
      dataUtil.message("只能删除编制中的文档");
      return false
    }
    return true
  }
  //删除文档
  deleteData = () => {
    let { selectedRowKeys } = this.state;
    const { intl } = this.props.currentLocale;
    if (selectedRowKeys.length) {
      const { startContent } = this.state
      let url = dataUtil.spliceUrlParams(docProjectDel, { startContent });
      axios.deleted(url, { data: selectedRowKeys }, true, '删除成功', true).then(res => {
        this.rightTable.getData()
        this.setState({
          selectedRowKeys: [],
          selectedRows: []
        })
      })
    } else {
      dataUtil.message(intl.get('wsd.global.tip.content1'));
    }
  }

  //下载
  download = () => {
    let { rightData } = this.state;
    const { intl } = this.props.currentLocale;
    if (rightData) {
      const { startContent } = this.state
      let url = dataUtil.spliceUrlParams(docFileInfo(rightData.fileId), { startContent });
      axios.get(url).then(res => {
        if (res.data.data) {
          util.download(res.data.data.fileUrl, res.data.data.fileName, res.data.data.id)
        }
      })
    } else {
      dataUtil.message(intl.get('wsd.global.tip.content1'));
    }
  }

  /**
   * 修改数据
   *
   **/
  rightUpdateData = (newData) =>{
    this.rightTable.updateData(newData);
  }

  /**
   * 刷新
   *
   */
  refreshRight = () =>{
    this.rightTable.getData();
  }

  /**
   *  新增数据
   *
   **/
  rightAddData = (newData) => {
    this.rightTable.addData(newData,"first");
    let {leftRecord} = this.state;
    let docNum = leftRecord.docNum || 0;
    this.leftTable.updateData({...leftRecord,docNum : docNum+1})
  }

  search = (val) => {
    if (!this.state.projectId) {
      dataUtil.message("请选择项目进行操作");
      return;
    }
    this.setState({
      searchValue: val,
    }, () => {
      this.leftTable.getData()
    });
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

  //===========================================================================================


  render() {
    const { intl } = this.props.currentLocale;
    const LeftColumns = [{
      title: intl.get('wsd.i18n.doc.compdoc.foldername'),//文件夹名称
      dataIndex: 'name',
      key: 'name',
      width: '65%',
      render: (text, record) => <span title={text}><MyIcon type={record.type != "project" ? "icon-wenjianjia" : "icon-xiangmu"} className={style.leftTableIcon} />{text}</span>
    }, {
      title: intl.get('wsd.i18n.doc.compdoc.docnumber'),//文档数量
      dataIndex: 'docNum',
      key: 'docNum',
    }];

    const RightColumns = [{
      title: intl.get('wsd.i18n.doc.temp.title'),//文档标题
      dataIndex: 'docTitle',
      key: 'docTitle',
      width: '15%',
      render: (text, record) => <span title={text}> <MyIcon type={record.isFavorite ? "icon-shoucang1" : "icon-shoucang2"} onClick={this.collect.bind(this, record)} className={style.icon} /> <MyIcon
        type="icon-chakan" className={style.icon} onClick={this.eyeClick.bind(this, record)} />{text}</span>
    }, {
      title: intl.get('wsd.i18n.doc.compdoc.docserial'),//文档编号
      dataIndex: 'docNum',
      key: 'docNum',
      width: '10%',
    }, {
      title: intl.get('wsd.i18n.doc.compdoc.docclassify'),//文档类别
      dataIndex: 'docClassify',
      key: 'docClassify',
      width: '10%',
      render: text => text ? text.name : ''
    }, {
      title: intl.get('wsd.i18n.doc.temp.author'),//作者
      dataIndex: 'author',
      key: 'author',
      width: '10%',
    }, {
      title: intl.get('wsd.i18n.doc.temp.versions'),//版本
      dataIndex: 'version',
      key: 'version',
      width: '10%',
    }, {
      title: intl.get('wsd.i18n.plan.feedback.creattime'),//创建时间
      dataIndex: 'creatTime',
      key: 'creatTime',
      width: '15%',
      render: (text) => dataUtil.Dates().formatDateString(text)
    }, {
      title: intl.get('wsd.i18n.doc.compdoc.babelte'),//上传人
      dataIndex: 'creator',
      key: 'creator',
      width: '10%',
      render: text => text ? text.name : ''
    }, {
      title: intl.get('wsd.i18n.doc.compdoc.docstate'),//文档状态
      dataIndex: 'status',
      key: 'status',
      width: '10%',
      render: text => text ? text.name : ''
    }];

    const startContent = "项目【" + this.state.projectName + "】,文件夹【" + (this.state.leftRecord ? this.state.leftRecord.name : null) + ",文档【" + (this.state.rightData ? this.state.rightData.docTitle : null) + "】";

    return (
      <ExtLayout renderWidth={({ contentWidth }) => { this.setState({ contentWidth }) }}>
        <LeftContent width={300}>
          <Toolbar>
            {/*选择项目*/}
            <SelectProjectBtn haveTaskAuth={true} openProject={this.initDatas} />
            {/*全部文档*/}
            <PublicViewButton afterCallBack={this.queryDocSearchType} icon={"icon-wendangleixingshitu"} currentIndex={this.state.selectKey == "" ? 0 : this.state.selectKey == "mine" ? 1 : 2}
              menus={[{ key: "", label: "全部文档", edit: true },
              { key: "mine", label: "我的文档", edit: true },
              { key: "docAuth", label: "传递文档", edit: true }]}
              iconSize={16} iconVerticalAlign={"text-bottom"}
            />
          </Toolbar>
          <TreeTable onRef={this.onRef}
            getData={this.getLeftDataList}
            columns={LeftColumns}
            contentMenu={this.state.contentMenu}
            headerMenu = {this.state.headerMenu}
            getRowData={this.getLeftInfo}
            expanderLevel = {1}
            rightClick={this.rightClick}
          />
        </LeftContent>
        <MainContent contentWidth={this.state.contentWidth} contentMinWidth={600}>
          <PageTable onRef={this.onRefR}
            rowSelection={true}
            pagination={true}
            useCheckBox={true}
            onChangeCheckBox={this.getSelectedRowKeys}
            checkboxStatus = {(item) => { return item.auth != 1 }}
            getData={this.getRightDataList}
            columns={RightColumns}
            getRowData={this.getInfo}
            total={this.state.total}
          />
        </MainContent>

        <Toolbar>
          <TopTags
            projectData={this.state.projectData}
            projectId={this.state.projectId}
            rightUpdateData = {this.rightUpdateData}
            rightAddData = {this.rightAddData }
            leftData={this.state.leftRecord}
            rightData={this.state.rightData}
            deleteData={this.deleteData}
            download={this.download}
            distribute={this.distribute}
            selectedRows={this.state.selectedRows}
            updateSelectedRows={this.updateSelectedRows}
            folderUpdate={this.folderUpdate}
            bizType='task'     
            search={this.search}
            initDatas={this.initDatas}
            startContent={this.state.startContent}
            openWorkFlowMenu={this.props.openWorkFlowMenu}
            selectProjectName={this.state.projectName}
            deleteVerifyCallBack={this.deleteVerifyCallBack}
            refreshRight = {this.refreshRight }
            getDocGivingList={this.getDocGivingList}
          />
        </Toolbar>
        <RightTags rightTagList={this.state.rightTags} rightData={this.state.rightData} rightHide={this.RightHide} rightIconBtn={this.rightIconBtn}
          projectId={this.state.projectId}
          updateData={this.updateData}
          editAuth = {this.state.rightData && this.state.rightData.auth == 1 ? true : false}
          classifyEditAuth = {this.state.rightData && this.state.rightData.auth == 1 ? true : false}
          bizType="projectdoc"
          openWorkFlowMenu={this.props.openWorkFlowMenu}
          callBackBanner={this.props.callBackBanner}
          menuCode={this.props.menuInfo.menuCode}
          menuInfo={this.props.menuInfo}
          startContent={this.state.startContent}
          extInfo={{ startContent }} />
        {/*       
    {!this.state.rightHide &&
          <div className={style.rightIconBtn} onClick={this.rightIconBtn}><Icon type="double-right" /></div>
        } */}
        {/* 收藏 */}

        {this.state.collectVisible && <Collect modalVisible={this.state.collectVisible} handleCancel={this.collectHandleCancel} record={this.state.collectReact}
                                               updateFavorite={this.updateFavorite} startContent={this.state.startContent} />}
        {/* 管理文件夹 */}
        {this.state.MangageDocVisible && <Manage modalVisible={this.state.MangageDocVisible}  deleteFile={this.deleteFile} findLeftDataList = {this.findLeftDataList }
          handleCancel={this.manageHandleCancel} upDate={this.forceNameUpdate} projectId={this.state.projectId} projectName={this.state.projectName} />}
      </ExtLayout>

    )
  }
}


/* *********** connect链接state及方法 start ************* */
export default connect(state => ({
  currentLocale: state.localeProviderData
}))(ProjectDoc);
/* *********** connect链接state及方法 end ************* */
