import React, { Component } from 'react'
import { Input, Table, Icon, Modal, Form, Button, notification } from 'antd'

import style from './style.less'
import ExtLayout from "../../../components/public/Layout/ExtLayout";
import LeftContent from "../../../components/public/Layout/LeftContent";
import MainContent from "../../../components/public/Layout/MainContent";
import Labels from "../../../components/public/Layout/Labels";
import Toolbar from "../../../components/public/Layout/Toolbar";
import { connect } from 'react-redux'
import MyIcon from '../../../components/public/TopTags/MyIcon'
import TopTags from './TopTags/index'
import RightTags from '../../../components/public/RightTags/index'
import TreeTable from '../../../components/PublicTable'
import PageTable from '../../../components/PublicTable'
import * as dataUtil from "../../../utils/dataUtil"
import * as util from '../../../utils/util'
import axios from '../../../api/axios'
import { docFavoriteTree, docFavoriteUpdate, docFavoriteAdd, docFavoriteDel, docFavoriteList, docFavoriteCancelCollection, docFileInfo } from '../../../api/api'

class ProjectDoc extends Component {

  state = {
    activeIndex: null,
    activeLeftIndex: null,
    collectVisible: false,
    X: 0,
    Y: 0,
    rightHide: true,
    rightData: null,
    rightTags: [
      { icon: 'iconjibenxinxi', title: '基本信息', fielUrl: 'Doc/Fav/BasicInfo' },
    ],
    leftRecord: null,
    leftData: null,
    LeftData: [],
    RightData: [],
    selectedRowKeys: [],
    clickId: null,
    dataMap: [],
    pageSize: 10,
    currentPage: 1,
    total: 0,
    searchVal: null,
    contentMenu: [
      { name: '修改', fun: 'modify', type: 'buttom', icon: 'hdd', isPublic: false },
      { name: '删除', fun: 'delete', type: 'buttom', icon: 'delete', isPublic: false },
      { name: '新增', fun: 'add', type: 'buttom', icon: 'plus-circle', isPublic: false }
    ]
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

  getLeftData = (callBack) => {
    axios.get(docFavoriteTree + `?name=${this.state.searchVal ? this.state.searchVal : ''}`).then(res => {
      callBack(res.data.data)
      if (res.data.data) {
        this.table.getLineInfo(res.data.data[0])
        this.setState({
          LeftData: res.data.data,
        })
      }

    })
  }

  //获取右侧数据
  getRightList = (currentPageNum, pageSize, callBack) => {
    axios.get(docFavoriteList(this.state.leftRecord.id, pageSize, currentPageNum) + `?name=${this.state.searchVal ? this.state.searchVal : ''}`).then(res => {
      callBack(res.data.data);
      this.setState({
        RightData: res.data.data,
        total: res.data.total,
        selectedRowKeys: [],
        rightData: null,
      })
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

  //右侧表格点击行事件
  getInfo = (record) => {
    this.setState({
      rightData: record
    })

  }

  //左侧表格点击行事件
  getLeftInfo = (record) => {
    this.setState({
      leftRecord: record,
      RightData: [],
      selectedRowKeys: [],
      searchVal: '',
      rightData: null,
    }, () => {
      this.tableR.getData();
    })
  }



  //右击弹窗的回调
  clickRightMenu = (value) => {
    if (value.fun == "modify") {
      this.DropHandleCancel()
      this.setState({
        clickId: this.state.leftRecord ? this.state.leftRecord.id : null,
      })

      return
    }
    if (value.fun == "delete") {
      this.DropHandleCancel()
      this.deleteFolder(this.state.leftRecord);
      return
    }
    if (value.fun == "add") {
      this.DropHandleCancel()
      this.addFolder(this.state.leftRecord);
      return
    }

  }

  RightHide = (v) => {
    this.setState({ rightHide: false })

  }
  rightIconBtn = () => {
    this.setState({ rightHide: true })
  }


  //表格 修改名称 input输入框失去焦点事件
  inputBlur = (record, e) => {
    let data = {
      id: record.id,
      name: e.target.value
    }
    axios.put(docFavoriteUpdate, data, true, '修改成功', true).then(res => {
      record.name = res.data.data.name;
      this.table.update(record, res.data.data);
    })

    this.setState({ clickId: null });
  }

  //表格 新建文件夹
  addFolder = (record) => {
    let data = {
      parentId: record ? record.id : 0,
      name: this.props.currentLocale.intl.get("wsd.global.btn.newfolder") //新建文件夹
    }

    axios.post(docFavoriteAdd, data, true, '新增成功', true).then(res => {

      if (record) {
        this.table.add(this.state.leftRecord, res.data.data)
        this.setState({
          clickId: res.data.data.id
        })
      } else {
        this.table.add(null, res.data.data)
        this.setState({
          clickId: res.data.data.id
        })
      }
    })
  }

  //表格 删除文件夹
  deleteFolder = (record) => {
    if (record) {
      axios.deleted(docFavoriteDel(record.id), {}, true).then(res => {
        this.table.deleted(this.state.leftRecord)
      })
    }

  }
  //取消收藏验证
  deleteVerifyCallBack = () => {
    let { selectedRowKeys, rightData } = this.state;
    if (selectedRowKeys.length == 0) {
      notification.warning(
        {
          placement: 'bottomRight',
          bottom: 50,
          duration: 2,
          message: '未选中数据',
          description: '请勾选数据进行操作'
        }
      )
      return false
    } else {
      return true
    }
  }
  //取消收藏
  CancelCollection = () => {
    let { selectedRows, rightData } = this.state;

    if (selectedRows.length) {
      let docIds = selectedRows.map(item => item.docId)
      axios.deleted(docFavoriteCancelCollection, { data: docIds }, true, '取消收藏成功').then(res => {

        this.tableR.getData();
      })

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
  }

  //下载文档
  downloadDoc = () => {
    const { intl } = this.props.currentLocale;
    let { rightData } = this.state;
    if (rightData) {
      if (rightData.fileId) {
        axios.get(docFileInfo(rightData.fileId)).then(res => {
          if (res.data.data) {
            util.download(res.data.data.fileUrl,res.data.data.fileName,res.data.data.id)
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
          message: '未选中数据',
          description: '请选择数据进行操作'
        }
      )

    }

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

  //搜索
  search = (val) => {
    this.setState({
      searchVal: val
    }, () => {
      this.tableR.getData();
    })
  }


  render() {
    const { intl } = this.props.currentLocale;

    const LeftColumns = [{
      title: intl.get('wsd.i18n.doc.compdoc.foldername'),//文件夹名称
      dataIndex: 'name',
      key: 'name',
      editable: true,
      width: '99%',
      render: (text, record) => {
        if (record.id == this.state.clickId) {
          return (

            <Input defaultValue={text} onBlur={this.inputBlur.bind(this, record)} style={{ width: '80%' }} autoFocus='autofocus' maxLength={33} />

          )
        } else {
          return (<span><MyIcon type="icon-wenjianjia" className={style.leftTableIcon} />{text}</span>)
        }
      }
    }];

    const RightColumns = [{
      title: intl.get('wsd.i18n.doc.temp.title'),//文档标题
      dataIndex: 'docTitle',
      key: 'docTitle',
      width: "15%",
      render: (text, record) => <span> <Icon type="eye" onClick={this.eyeClick.bind(this, record)} className={style.icon} />{text}</span>
    }, {
      title: intl.get('wsd.i18n.doc.compdoc.docserial'),//文档编号
      dataIndex: 'docNum',
      key: 'docNum',
      width: "10%",
    },  {
      title: intl.get('wsd.i18n.comu.meeting.projectname'),//所属项目
      dataIndex: 'projectName',
      key: 'projectName',
      width: "10%",
    }, {
      title: intl.get('wsd.i18n.doc.compdoc.docauthor'),//文档作者
      dataIndex: 'author',
      key: 'author',
      width: "10%",
    }, {
      title: intl.get('wsd.i18n.doc.temp.versions'),//版本
      dataIndex: 'version',
      key: 'version',
      width: "10%",
    }, {
      title: intl.get('wsd.i18n.doc.compdoc.docstate'),//文档状态
      dataIndex: 'status',
      key: 'status',
      width: "10%",
      render: text => text ? text.name : ''
    }];



    return (
      <ExtLayout renderWidth={({ contentWidth }) => { this.setState({ contentWidth }) }}>
        <LeftContent width={300}>
          <TreeTable onRef={this.onRef}
            getData={this.getLeftData}
            columns={LeftColumns}
            contentMenu={this.state.contentMenu}
            scroll={{ x: '100%', y: this.props.height - 100 }}
            getRowData={this.getLeftInfo}
            rightClick={this.clickRightMenu}
          />
        </LeftContent>
        <MainContent contentWidth={this.state.contentWidth} contentMinWidth={600}>
          {this.state.leftRecord && (
            <PageTable onRef={this.onRefR}
              rowSelection={true}
              pagination={true}
              useCheckBox={true}
              onChangeCheckBox={this.getSelectedRowKeys}
              getData={this.getRightList}
              columns={RightColumns}
              scroll={{ x: '100%', y: this.props.height - 100 }}
              getRowData={this.getInfo}
              total={this.state.total}
            />
          )}
        </MainContent>

        <Toolbar>
          <TopTags
            CancelCollection={this.CancelCollection}
            downloadDoc={this.downloadDoc}
            search={this.search}
            deleteVerifyCallBack={this.deleteVerifyCallBack}
          />
        </Toolbar>
        <RightTags rightTagList={this.state.rightTags}
          rightData={this.state.rightData}
          rightHide={this.RightHide}
          rightIconBtn={this.rightIconBtn}
          menuCode={this.props.menuInfo.menuCode}
        />
        {/*       
      {!this.state.rightHide &&
            <div className={style.rightIconBtn} onClick={this.rightIconBtn}><Icon type="double-right" /></div>
          } */}
      </ExtLayout>

    )
  }
}


/* *********** connect链接state及方法 start ************* */
export default connect(state => ({
  currentLocale: state.localeProviderData
}))(ProjectDoc);
/* *********** connect链接state及方法 end ************* */
