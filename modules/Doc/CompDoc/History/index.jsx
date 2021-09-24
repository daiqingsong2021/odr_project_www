import React, { Component } from 'react'
import style from './style.less'
import { Form, Input, Button, Icon, Select, Table, notification } from 'antd';
import moment from 'moment';
import MyIcon from '../../../../components/public/TopTags/MyIcon'
import Collect from '../Collect/index'
import PublicTable from '../../../../components/PublicTable'
import { connect } from 'react-redux'
import axios from '../../../../api/axios'
import { docCompHistoryList, docFileInfo } from '../../../../api/api'
import * as util from '../../../../utils/util'
import PublicButton from "../../../../components/public/TopTags/PublicButton"
import * as dataUtil from "../../../../utils/dataUtil"
import LabelToolbar from '../../../../components/public/Layout/Labels/Table/LabelToolbar'
import LabelTableLayout from '../../../../components/public/Layout/Labels/Table/LabelTableLayout'
import LabelTable from '../../../../components/public/Layout/Labels/Table/LabelTable'
import LabelTableItem from '../../../../components/public/Layout/Labels/Table/LabelTableItem'
class MenuInfo extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],                        //基本信息
      selectedRowKeys: [],
      activeIndex: null,
      record: null,
      collectReact: null,
      collectVisible: false,

    }
  }

  /**
   @method 父组件即可调用子组件方法
   @description 父组件即可调用子组件方法
   */
  onRef = (ref) => {
    this.table = ref
  }

  getList = (callBack) => {
    axios.get(docCompHistoryList(this.props.data.id)).then(res => {

      callBack(res.data.data)
      this.setState({
        data: res.data.data
      })
    })
  }


  getInfo = (record) => {
    this.setState({
      record
    })
  }


  clickHandle = (name) => {
    //下载
    if (name == 'DownloadTopBtn') {
      let { record } = this.state
      if (record) {
        axios.get(docFileInfo(record.id)).then(res => {
          if (res.data.data) {
            util.download(res.data.data.fileUrl, res.data.data.fileName, res.data.data.id)
          }
        })


      }
    }

  }
  eyeClick = (record) => {
    const { intl } = this.props.currentLocale;

    let arr = ['html', 'txt', 'jpg', 'jpeg', 'gif', 'png', 'art', 'au', 'aiff', 'xbm', 'pdf','doc','docx','rtf','xls','xlsx','csv'];
    if (record.id) {
      const { startContent } = this.props
      let url = dataUtil.spliceUrlParams(docFileInfo(record.id), { startContent });
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

  //收藏
  collect = (record) => {
    this.setState({ collectVisible: true, collectReact: record })
  }

  collectHandleCancel = () => {
    this.setState({
      collectVisible: false
    })
  }


  render() {
    const { intl } = this.props.currentLocale;
    const RightColumns = [{
      title: intl.get('wsd.i18n.doc.compdoc.docname'),//文档名称
      dataIndex: 'fileName',
      key: 'fileName',
      width: 200,
      render: (text, record) => <span>
        <MyIcon type="icon-chakan" className={style.icon} onClick={this.eyeClick.bind(this, record)} />
        {text}
      </span>
    }, {
      title: intl.get('wsd.i18n.doc.temp.versions'),//版本
      dataIndex: 'version',
      key: 'version',
      width: 100,
    }, {
      title: intl.get('wsd.i18n.doc.compdoc.docsize'),//文件大小
      dataIndex: 'size',
      key: 'size',
      width: 100,
    }, {
      title: intl.get('wsd.i18n.doc.compdoc.babelte'),//上传人
      dataIndex: 'creator',
      key: 'creator',
      width: 100,
      render: text => text ? text.name : ''
    }, {
      title: intl.get('wsd.i18n.plan.fileinfo.creattime'),//上传时间
      dataIndex: 'createTime',
      key: 'createTime',
      render: (text) => dataUtil.Dates().formatDateString(text)
    }];

    let { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({
          selectedRowKeys
        })
      },

    }

    return (
      <LabelTableLayout title={this.props.title}  menuCode = {this.props.menuCode} >
        <LabelToolbar>
          <PublicButton edit={this.props.wfPubliceditAuth} afterCallBack={this.clickHandle.bind(this, "DownloadTopBtn")} title={"下载"} icon={"icon-xiazaiwenjian"} />
        </LabelToolbar>
        <LabelTable labelWidth={this.props.labelWidth} contentMinWidth={1000}>

          <PublicTable onRef={this.onRef}
            pagination={false}
            getData={this.getList}
            columns={RightColumns}
            closeContentMenu={true}
            scroll={{ x: 800, y: this.props.height - 100 }}
            getRowData={this.getInfo}
            total={this.state.total}
          />
        </LabelTable>

        {/* 文档收藏 */}
        {this.state.collectVisible && <Collect modalVisible={this.state.collectVisible} handleCancel={this.collectHandleCancel} record={this.state.collectReact}
          update={this.getData()} />}

      </LabelTableLayout>

    )
  }
}

const MenuInfos = Form.create()(MenuInfo);
export default connect(state => ({
  currentLocale: state.localeProviderData,
}))(MenuInfos);
