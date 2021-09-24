import React, { Component } from 'react';
import { Row, Col, Table, Icon, Menu, notification } from 'antd';
import intl from 'react-intl-universal';
import style from './style.less';
import Collect from './Collect/index';
import Manage from './Manage/index';
import TopTags from './TopTags/index';
import RightTags from '../../../components/public/RightTags/index';
import MyIcon from '../../../components/public/TopTags/MyIcon';
import { connect } from 'react-redux';
import * as util from '../../../utils/util';
import axios from '../../../api/axios';
import TreeTable from '../../../components/PublicTable';
import PageTable from '../../../components/PublicTable';
import {
  docProjectFolderTree,
  docProjectList,
  docProjectDel,
  docFileInfo,
  docFavoriteCancelCollection,
  getproInfo
} from '../../../api/api';
import { docProjectFolderTree_ } from '../../../api/suzhou-api';
import * as dataUtil from '../../../utils/dataUtil';
import { docProjectSzxm,docGivingList ,getFolderByMenuName,getFolderByMenuCode,getPermission} from '../../Suzhou/api/suzhou-api.js';
import ExtLayout from "../../../components/public/Layout/ExtLayout";
import LeftContent from "../../../components/public/Layout/LeftContent";
import MainContent from "../../../components/public/Layout/MainContent";
import Toolbar from "../../../components/public/Layout/Toolbar";
import SelectSectionBtn from '../../Suzhou/components/SelectBtn/SelectSectionBtn';
import SelectProBtn from '@/modules/Suzhou/components/SelectBtn/SelectProBtn';
import PublicMenuButton from "../../../components/public/TopTags/PublicMenuButton"
import {firstLoad} from "@/modules/Suzhou/components/Util/firstLoad";
class ProjectDoc extends Component {
  state = {
    collectVisible: false,
    DroVisible: false,
    MangageDocVisible: false,
    rowKey: '',
    rightHide: true,
    rightData: null,
    LeftData: [],
    leftData: null,
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
    contentMenu: [
      { name: '管理文件夹', fun: 'folder', type: 'buttom', icon: 'icon-dakai', isPublic: false },
    ],
    sectionId: '',
    currentPageNum: 1,
    permission:[],
    editPermission:'',  //基本信息编辑权限 上传、删、改
    sendPermission:'',  //发布权限
    updatePermission:'',  //升版权限
    dispensePermission:'', //分发权限
    managePermission:'',  //管理文件夹权限
  };

  /**
   @method 父组件即可调用子组件方法
   @description 父组件即可调用子组件方法
   */
  onRef = ref => {
    this.leftTable = ref;
  };
  /**
   @method 父组件即可调用子组件方法
   @description 父组件即可调用子组件方法
   */
  onRefR = ref => {
    this.rightTable = ref;
  };

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
      if(menuCode=='DM-PROJECT'){
        this.setState({
          editPermission:'PROJECT_EDIT_DOC_PROJECT',  
          sendPermission:'PROJECT_RELEASE_DOC_PROJECT',   
          updatePermission:'PROJECT_UPGRADE_VER_PROJECT',
          dispensePermission:'PROJECT_DISPENSE_DOC_PROJECT', 
          managePermission:'PROJECT_MANAGE_FOLDERS_PRO' 
        })
      }else if(menuCode=='QUALITY-QFILES'){
        this.setState({
          editPermission:'QFILES_EDIT-RULE-DOC',  
          sendPermission:'QFILES_RELEASE-RULE-DOC',   
          updatePermission:'QFILES_UPDATE-VERSION-RULE',
          dispensePermission:'QFILES_DISTRIBUTE-RULEDOC', 
        })
      }else if(menuCode=='QUALITY-QFILES1'){
        this.setState({
          editPermission:'QFILES1_EDIT-ORG-DESIGN',  
          sendPermission:'QFILES1_RELEASE-ORG-DESIGN',   
          updatePermission:'QFILES1_UPDATE-VERSION-ORGDE',
          dispensePermission:'QFILES1_DISTRIBUTE-ORGDESIGN', 
        })
      }else if(menuCode=='QUALITY-QFILES2'){
        this.setState({
          editPermission:'QFILES2_EDIT-TECH-PREP',  
          sendPermission:'QFILES2_RELEASE-TECH-PREP',   
          updatePermission:'QFILES2_UPDATE-VER-TECH-PREP',
          dispensePermission:'QFILES2_DISTRIBUTE-TECH-PREP', 
        })
      }else if(menuCode=='QUALITY-QFILES3'){
        this.setState({
          editPermission:'QFILES3_EDIT-CONSTRUCTION',  
          sendPermission:'QFILES3_RELEASE-CONSTRUCTION',   
          updatePermission:'QFILES3_UPDATE-VERCONSTRUCT',
          dispensePermission:'QFILES3_DISTRIBUTE-CONSTRUCT', 
        })
      }else if(menuCode=='QUALITY-QFILES4'){
        this.setState({
          editPermission:'QFILES4_EDIT-TECHDISCLOSURE',  
          sendPermission:'QFILES4_RELEASE-TECHDISCLOSE',   
          updatePermission:'QFILES4_UPDATE-VER-TECH',
          dispensePermission:'QFILES4_DISTRIBUTE-TECHLINE', 
        })
      }else if(menuCode=='QUALITY-QFILES5'){
        this.setState({
          editPermission:'QFILES5_EDIT-MATERIALREPORT',  
          sendPermission:'QFILES5_RELEASE-MATERIAL',   
          updatePermission:'QFILES5_UPDATE-VERMATERIAL',
          dispensePermission:'QFILES5_DISTRIBUTE-MATERIAL', 
        })
      }else if(menuCode=='QUALITY-QFILES6'){
        this.setState({
          editPermission:'QFILES6_EDIT-TPI-MATERIAL',  
          sendPermission:'QFILES6_RELEASE-TPIMATERIAL',   
          updatePermission:'QFILES6_UPDATE-VER-TPI',
          dispensePermission:'QFILES6_DISTRIBUTE-TPI', 
        })
      }else if(menuCode=='QUALITY-QFILES7'){
        this.setState({
          editPermission:'QFILES7_EDIT-TEMPLETACCEPT',  
          sendPermission:'QFILES7_RELEASE-TEMPLET',   
          updatePermission:'QFILES7_UPDATE-VERTEMPLET',
          dispensePermission:'QFILES7_DISTRIBUTE-TEMPLET', 
        })
      }else if(menuCode=='QUALITY-QFILES8'){
        this.setState({
          editPermission:'QFILES8_EDIT-PRO-ACCEPTANCE',  
          sendPermission:'QFILES8_RELEASE-PROACCEPT',   
          updatePermission:'QFILES8_UPDATE-VERPROJECT',
          dispensePermission:'QFILES8_DISTRIBUTE-PROACCEPT', 
        })
      }else if(menuCode=='QUALITY-QFILES9'){
        this.setState({
          editPermission:'QFILES9_EDIT-PROJECTOVER',  
          sendPermission:'QFILES9_RELEASE-PROJECTOVER',   
          updatePermission:'QFILES9_UPDATE-VERPRO-OVER',
          dispensePermission:'QFILES9_DISTRIBUTE-PRO-OVER', 
        })
      }else if(menuCode=='QUALITY-QFILES10'){
        this.setState({
          editPermission:'QFILES10_EDIT-PRE-TRIAL',  
          sendPermission:'QFILES10_RELEASE-PRE-TRIAL',   
          updatePermission:'QFILES10_UPD-VER-PRE-TRIAL',
          dispensePermission:'QFILES10_DISTRIBUTE-PRE-TRIAL', 
        })
      }
    })
    this.initDatas();
  }
  // 初始化数据
  initDatas = () => {
    firstLoad().then(data => {
      const { projectId, projectName } = data;
      if (projectId) {
        this.setState(
          {
            projectId,
            projectName,
          },
          () => {
            //标段
            dataUtil.Favorites().list('lastOpenSection', res => {
              if (!res.data.data) {
                //收藏  无标段
                this.setState(
                  {
                    sectionId: 0,
                  },
                  () => {
                    this.rightTable.getData();
                  }
                );
              } else {
                //收藏  有标段
                this.setState(
                  {
                    sectionId: res.data.data,
                  },
                  () => {
                    this.rightTable.getData();
                  }
                );
                sessionStorage.setItem(
                  'lastOpenSection',
                  JSON.stringify({ sectionId: res.data.data })
                );
                return;
              }
            });
          }
        );
      }
    });
  };

  //打开项目
  openProject = (data1,data2,projectName) => {
    this.setState(
      {
        projectId:data1[0],
        projectName,
        sectionId: 0,
      },
      () => {
        this.leftTable.getData();
        sessionStorage.setItem('lastOpenSection', '');
        const addArr = [{ bizType: 'lastOpenSection', bizs: [] }];
        dataUtil.Favorites().listRest(addArr);
      }
    );
  };
  //打开标段
  openSection = sectionId => {
    const { projectId } = this.state;
    this.setState(
      {
        sectionId: sectionId.length > 0 ? sectionId : 0,
      },
      () => {
        this.rightTable.getData();
        // this.getDataList(this.state.currentPageNum, this.state.pageSize, () => {});
      }
    );
  };

  /**
     * 获取表格数据
     *
     * @returns {null}
     */
  findLeftDataList = () => {
    return this.leftTable.findDataList();
  }

  // 获取项目文件夹列表
  getLeftDataList = (callback) => {
    firstLoad().then((data) => {
      const { projectId, projectName } = data;
      if (projectId) {
        this.setState({
          projectId,
          projectName
        }, () => {
          this.props.menuInfo.menuCode.indexOf('QUALITY') != -1?this.getQualityDoc(callback):this.getProjectDocList(callback);
        })
      } else {
        callback([]);
      }
    });
  };
  //质量模块文件夹列表
  getQualityDoc = callBack => {
  let { projectId } = this.state;
  console.log(this.props.menuInfo.menuCode);
  axios.get(getproInfo(projectId)).then(res => {
    if (res.data.data) {
      axios.post(
        getFolderByMenuCode(projectId, this.props.menuInfo.menuCode) +
            `?name=${this.state.searchValue ? this.state.searchValue : ''}&docSearchType=${
              this.state.selectKey ? this.state.selectKey : ''
            }`
        )
        .then(res => {
          const { data } = res.data;
          callBack(data ? data : []);
          if (res.data.data && res.data.data.length > 0) {
            this.rightTable.getLineInfo(data[0]);
            this.setState({
              data,
            });
          } else {
            this.setState({
              data,
            });
          }
        });
    } else {
      callBack([]);
    }
  });
  };
  // 获取项目文件夹列表
  getProjectDocList = (callBack) => {
    let { projectId } = this.state;
    axios.get(getproInfo(projectId)).then(res => {
      if (res.data.data) {
        axios.post(docProjectFolderTree_(projectId) + `?name=${this.state.searchValue ? this.state.searchValue : ''}&docSearchType=${
          this.state.selectKey ? this.state.selectKey : ''}`).then(res => {
            const { data } = res.data;
            callBack(data ? data : []);
            if (res.data.data && res.data.data.length > 0) {
              this.rightTable.getLineInfo(data[0]);
              this.setState({
                data,
              });
            } else {
              this.setState({
                data,
              });
            }
          });
      } else {
        callBack([]);
      }
    });
  }

  //收藏
  collect(record) {
    if (record.isFavorite) {
      const { startContent } = this.state;
      let url = dataUtil.spliceUrlParams(docFavoriteCancelCollection, { startContent });
      axios.deleted(url, { data: [record.id] }).then(res => {
        this.update();
      });
    } else {
      this.setState({ collectVisible: true, collectReact: record });
    }
  }

  collectHandleCancel = () => {
    this.setState({
      collectVisible: false,
    });
  };

  manageHandleCancel = () => {
    // 刷新
    this.leftTable.getData();
    this.setState({
      MangageDocVisible: false,
    });
  };

  //右侧表格点击行事件
  getInfo = record => {
    this.setState({
      rightData: record,
    });
  };

  //左侧表格点击事件
  getLeftInfo = record => {
    const { projectName } = this.state;
    this.setState(
      {
        leftRecord: record,
        startContent: '项目【' + projectName + '】,文件夹【' + record.name + '】',
        selectedRowKeys: [],
        rightList: [],
        rightData: null,
      },
      () => {
        let folderId = 0;
        if (record && record.type == 'folder') {
            folderId = record.id;
        }
        this.setState({
          folderId : folderId,
        })
        this.rightTable.getData();
      }
    );
  };
  /**
   * 获取复选框 选中项、选中行数据
   * @method
   * @param {string} selectedRowKeys 复选框选中项
   * @param {string} selectedRows  行数据
   */
  getSelectedRowKeys = (selectedRowKeys, selectedRows) => {
    this.setState({
      selectedRows,
      selectedRowKeys,
    });
  };
  //右键操作 管理文件夹
  rightClick = e => {
    this.setState({ MangageDocVisible: true });
  };

  RightHide = v => {
    this.setState({ rightHide: false });
  };
  rightIconBtn = () => {
    this.setState({ rightHide: true });
  };

  queryDocSearchType = key => {

    this.setState(
      {
        selectKey: key,
      },
      () => {
        this.leftTable.getData();
      }
    );
  };

  //文件夹数据修改
  forceNameUpdate = newdata => {
    this.setState(
      {
        newdata,
        isStaticRefresh: true,
      },
      () => {
        this.leftTable.getData();
      }
    );
  };
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
  //获取项目文档列表
  getDataList = (currentPageNum, pageSize, callBack) => {
    let { leftRecord, searchValue, selectKey, projectId } = this.state;
    let flag = 'false';
    let folderId = 0;
    if (leftRecord && leftRecord.type == 'project') {
      flag = 'true';
    } else if (leftRecord) {
      folderId = leftRecord.id;
    }

    if (leftRecord) {
      let url = dataUtil.spliceUrlParams(docProjectSzxm(
        projectId,
        folderId,
        leftRecord.type,
        flag,
        pageSize,
        currentPageNum,
        this.state.sectionId ? this.state.sectionId : 0
      ),{name:searchValue || "",docSearchType : selectKey || "" })
      axios.post(url).then(res => {
          callBack(res.data.data);
          this.setState({
            rightList: res.data.data,
            total: res.data.total,
            selectedRowKeys: [],
            rightData: null,
            tableData: res.data.data,
          });
        });
    } else {
      callBack([]);
    }
  };

  //刷新项目文档列表列表
  update = () => {
    if (this.state.rightList.length || this.state.leftRecord) {
      this.rightTable.getData();
    }
  };

  //修改文档列表
  updateData = newData => {
    let { rightList, rightData } = this.state;
    this.rightTable.update(rightData, newData);
  };

   //获取分发列表
 getDocGivingList=(callBack)=>{
  let { leftRecord, searchValue, selectKey,projectId } = this.state;
  let url = dataUtil.spliceUrlParams(docGivingList(leftRecord.id, leftRecord.type, leftRecord.type == "project" ? true : false,projectId,this.state.sectionId ? this.state.sectionId : 0),{name:searchValue || "",docSearchType : selectKey || "" })
  axios.post(url).then(res=>{
    callBack(res.data.data)
  })
}
  //删除校验
  deleteVerifyCallBack = () => {
    let { selectedRowKeys, rightData } = this.state;
    const { intl } = this.props.currentLocale;
    if (selectedRowKeys.length == 0) {
      notification.warning({
        placement: 'bottomRight',
        bottom: 50,
        duration: 2,
        message: intl.get('wsd.global.tip.title2'),
        description: intl.get('wsd.global.tip.content2'),
      });
      return false;
    } else {
      return true;
    }
  };
  //删除文档
  deleteData = () => {
    let { selectedRowKeys, rightList } = this.state;
    const { intl } = this.props.currentLocale;
    if (selectedRowKeys.length) {
      const { startContent } = this.state;
      let url = dataUtil.spliceUrlParams(docProjectDel, { startContent });
      axios.deleted(url, { data: selectedRowKeys }, true, '删除成功', true).then(res => {
        this.rightTable.getData();
      });
    } else {
      notification.warning({
        placement: 'bottomRight',
        bottom: 50,
        duration: 2,
        message: intl.get('wsd.global.tip.title2'),
        description: intl.get('wsd.global.tip.content1'),
      });
    }
  };

  //下载
  download = () => {
    let { rightData } = this.state;
    const { intl } = this.props.currentLocale;
    if (rightData) {
      const { startContent } = this.state;
      let url = dataUtil.spliceUrlParams(docFileInfo(rightData.fileId), { startContent });
      axios.get(url).then(res => {
        if (res.data.data) {
          util.download(res.data.data.fileUrl, res.data.data.fileName, res.data.data.id);
        }
      });
    } else {
      notification.warning({
        placement: 'bottomRight',
        bottom: 50,
        duration: 2,
        message: intl.get('wsd.global.tip.title2'),
        description: intl.get('wsd.global.tip.content1'),
      });
    }
  };

  distribute = () => {
    this.rightTable.getData();
  };

  //  //分发回调
  updateSelectedRows = newData => {
    this.rightTable.getData();
  };

  //上传之后回调
  folderUpdate = newData => {
    this.rightTable.getData();
    this.leftTable.update(this.state.leftRecord, newData.docProjectFolderTreeVo);
  };

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

  search = val => {
    if (this.state.projectId) {
      this.setState(
        {
          searchValue: val,
        },
        () => {
          this.findLeftDataList(this.state.projectId);
          this.rightTable.getData();
        }
      );
    } else {
      notification.warning({
        placement: 'bottomRight',
        bottom: 50,
        duration: 2,
        message: '未选中数据',
        description: '请选择项目进行操作',
      });
    }
  };
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
  wordType = () => {
  };
  //===========================================================================================

  render() {
    const { intl } = this.props.currentLocale;
    const LeftColumns = [{
      title: intl.get('wsd.i18n.doc.compdoc.foldername'),//文件夹名称
      dataIndex: 'name',
      key: 'name',
      width: '80%',
      render: (text, record) => <span title={text}><MyIcon type={record.type != "project" ? "icon-wenjianjia" : "icon-xiangmu"} className={style.leftTableIcon} />{text}</span>
    },
    // {
    //   title: " ",//文档数量
    //   dataIndex: 'docNum',
    //   key: 'docNum',
    // }
    ];

    const RightColumns = [{
      title: intl.get('wsd.i18n.doc.temp.title'),//文档标题
      dataIndex: 'docTitle',
      key: 'docTitle',
      width: '15%',
      render: (text, record) => <span title={text}> <MyIcon type={record.isFavorite ? "icon-shoucang1" : "icon-shoucang2"} onClick={this.collect.bind(this, record)} className={style.icon} /> <MyIcon
        type="icon-chakan" className={style.icon} onClick={this.eyeClick.bind(this, record)} />{text}</span>
    },
    {
      title: '所属标段', //标段名称
      dataIndex: 'section',
      key: 'section',
      width: '200px',
      render: text => (text ? text.name : ''),
    }, {
      title: intl.get('wsd.i18n.doc.compdoc.docserial'),//文档编号
      dataIndex: 'docNum',
      key: 'docNum',
      width: '10%',
    },  {
      title: intl.get('wsd.i18n.doc.temp.versions'),//版本
      dataIndex: 'version',
      key: 'version',
      width: '10%',
    },{
        title: intl.get('wsd.i18n.doc.compdoc.babelte'),//上传人
        dataIndex: 'creator',
        key: 'creator',
        width: '10%',
        render: text => text ? text.name : ''
      }, {
      title: intl.get('wsd.i18n.plan.feedback.creattime'),//上传时间
      dataIndex: 'creatTime',
      key: 'creatTime',
      width: '15%',
      render: (text) => dataUtil.Dates().formatDateString(text)
    }, {
      title: intl.get('wsd.i18n.doc.compdoc.docstate'),//文档状态
      dataIndex: 'status',
      key: 'status',
      width: '10%',
      render: text => text ? text.name : ''
    }];

    const startContent =
      '项目【' +
      this.state.projectName +
      '】,文件夹【' +
      (this.state.leftRecord ? this.state.leftRecord.name : null) +
      ',文档【' +
      (this.state.rightData ? this.state.rightData.docTitle : null) +
      '】';
    return (
      <ExtLayout renderWidth={({ contentWidth }) => { this.setState({ contentWidth }) }}>
        <LeftContent width={300}>
          <Toolbar>
            {/*选择项目*/}
            <SelectProBtn openPro={this.openProject}/>
            {/* 选择标段 */}
            <SelectSectionBtn openSection={this.openSection} data1={this.state.projectId} />
            {/*全部文档*/}
            {/*<PublicMenuButton title={"全部文档"} afterCallBack={this.queryDocSearchType} icon={"icon-wendangleixingshitu"} currentIndex={this.state.selectKey == "" ? 0 : this.state.selectKey == "mine" ? 1 : 2}*/}
            {/*  menus={[*/}
            {/*  { key: "mine", label: "我的文档", edit: true },*/}
            {/*  { key: "docAuth", label: "传递文档", edit: true }]}*/}
            {/*  iconSize={16} iconVerticalAlign={"text-bottom"}*/}
            {/*/>*/}
          </Toolbar>
          <TreeTable
            onRef={this.onRef}
            expanderLevel={"ALL"}
            getData={this.getLeftDataList}
            columns={LeftColumns}
            contentMenu={this.props.menuInfo.menuCode.indexOf('QUALITY') != -1?null:(this.state.permission.indexOf(this.state.managePermission)!==-1 ?this.state.contentMenu:null)}
            scroll={{ x: '100%', y: this.props.height - 100 }}
            getRowData={this.getLeftInfo}
            rightClick={this.rightClick}
          />
        </LeftContent>
        <MainContent contentWidth={this.state.contentWidth} contentMinWidth={600}>
          <PageTable
            onRef={this.onRefR}
            rowSelection={true}
            pagination={true}
            useCheckBox={true}
            dataSource={this.state.rightList}
            onChangeCheckBox={this.getSelectedRowKeys}
            checkboxStatus = {(item) => { return item.auth != 1 }}
            getData={this.getDataList}
            columns={RightColumns}
            scroll={{ x: '1500px', y: this.props.height - 100 }}
            getRowData={this.getInfo}
            total={this.state.total}
          />
        </MainContent>
        <Toolbar> <TopTags
          folderId={this.state.folderId}
          sectionIds={this.state.sectionId}
          projectData={this.state.projectData}
          projectId={this.state.projectId}
          openProject={this.openProject}
          openSection={this.openSection}
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
          bizType="task"
          wordType={this.wordType}
          search={this.search}
          initDatas={this.initDatas}
          startContent={this.state.startContent}
          openWorkFlowMenu={this.props.openWorkFlowMenu}
          selectProjectName={this.state.projectName}
          deleteVerifyCallBack={this.deleteVerifyCallBack}
          refreshRight = {this.refreshRight }
          getDocGivingList={this.getDocGivingList}
          permission={this.state.permission} 
          editPermission={this.state.editPermission}  
          sendPermission={this.state.sendPermission} 
          updatePermission={this.state.updatePermission}
          dispensePermission={this.state.dispensePermission}
        /></Toolbar>
        <RightTags
          rightTagList={this.state.rightTags}
          rightData={this.state.rightData}
          rightHide={this.RightHide}
          rightIconBtn={this.rightIconBtn}
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
          extInfo={{ startContent }}
          permission={this.state.permission} 
          editPermission={this.state.editPermission}
        />
        {/* 收藏 */}

        {this.state.collectVisible && (
          <Collect
            modalVisible={this.state.collectVisible}
            handleCancel={this.collectHandleCancel}
            record={this.state.collectReact}
            update={this.update}
            startContent={this.state.startContent}
          />
        )}
        {/* 管理文件夹 */}
        {/* <Manage modalVisible={this.state.MangageDocVisible} handleCancel={this.manageHandleCancel} /> */}
        {this.state.MangageDocVisible && (
          <Manage
            modalVisible={this.state.MangageDocVisible}
            data={this.state.data}
            deleteFile={this.deleteFile}
            findLeftDataList={this.findLeftDataList}
            handleCancel={this.manageHandleCancel}
            upDate={this.forceNameUpdate}
            projectId={this.state.projectId}
            projectName={this.state.projectName}
          />
        )}
      </ExtLayout>
    )
  }
}

/* *********** connect链接state及方法 start ************* */
export default connect(state => ({
  currentLocale: state.localeProviderData,
}))(ProjectDoc);
/* *********** connect链接state及方法 end ************* */
