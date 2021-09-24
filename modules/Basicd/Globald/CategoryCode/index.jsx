import React, {Component} from 'react'

import style from './style.less'
import axios from "../../../../api/axios"
import {getClassifylist, getClassifyWf, deleteClassify} from "../../../../api/api"

import RightTags from '../../../../components/public/RightTags'
import {Table, notification, Button} from 'antd'
import {connect} from 'react-redux';

import PublicButton from '../../../../components/public/TopTags/PublicButton'
import AddCategoryCode from "./AddCategoryCode"
import AddCodeValue from "./AddCodeValue"
import MyIcon from '../../../../components/public/TopTags/MyIcon';
import PageTable from '../../../../components/PublicTable'

import ExtLayout from "../../../../components/public/Layout/ExtLayout";
import LeftContent from "../../../../components/public/Layout/LeftContent";
import MainContent from "../../../../components/public/Layout/MainContent";
import Labels from "../../../../components/public/Layout/Labels";
import Toolbar from "../../../../components/public/Layout/Toolbar";
import TopTags from "../../../../components/public/Layout/TopTags";

import Main from "../../../../components/public/Main";


/**
 * 分类码 模块
 *
 */
class CategoryCode extends Component {
  constructor(props) {
    super(props)
    this.state = {
      rightData: null,
      dataMap: [],
      rightDataList: [],
      activeIndex2: null,
      rightTags: [
        {icon: 'iconjibenxinxi', title: '基本信息', fielUrl: 'Basicd/Globald/CategoryCode/CategoryCodeInfo'},
      ],
      expandedRowKeys: [1],
      groupCode: 1
    }
  }

  /**
   * 父组件即可调用子组件方法
   */
  onRef = (ref) => {
    this.table = ref
  }

  /**
   * 父组件即可调用子组件方法
   */
  onRefR = (ref) => {
    this.tableR = ref
  }

  //获取业务对象列表
  getList = (callBack) => {
    axios.get(getClassifyWf).then(res => {
      callBack(res.data.data)
      if(res.data.data){
        this.table.getLineInfo(res.data.data[0])
      }
    });
  };
  getListrightdata = (callBack) => {
    const {leftmenu} = this.state
    axios.get(getClassifylist(leftmenu.boCode)).then(res => {
      callBack(res.data.data?res.data.data:[])
      this.setState({
        rightData:null,
      })

    });
  }

  AddCodeValue = (data) => {
    this.tableR.getData()
  }
  //更新数据
  updateSuccess = (data) => {
    const {rightData} = this.state;
    this.tableR.update(rightData,data)
  }
  onClickHandle = (name) => {
    const {rightDataList, dataMap, rightData} = this.state
    const {intl} = this.props.currentLocale
    if (name == "AddCategoryCodeBtn") {
      this.setState({
        isShowAddCategoryCode: true
      })
      return
    }
    if (name == "AddCodeValueBtn") {
      if (!rightData) {
        notification.warning(
          {
            placement: 'bottomRight',
            bottom: 50,
            duration: 1,
            message: intl.get("wsd.global.tip.title1"),
            description: intl.get("wsd.global.tip.content1")
          }
        )
        return
      }

      this.setState({
        isShowAddCodeValue: true
      })
      return
    }
    if (name == "DeleteTopBtn") {

      if (!rightData) {
        notification.warning(
          {
            placement: 'bottomRight',
            bottom: 50,
            duration: 1,
            message: intl.get("wsd.global.tip.title1"),
            description: intl.get("wsd.global.tip.content1")
          }
        )
        return
      }

      axios.deleted(deleteClassify, {data: [rightData.id]}, true).then(res => {
        this.tableR.deleted(this.state.rightData)
        this.setState({
          rightData: null,
        });
      })
    }
  }
  closeAddCategoryCode = () => {
    this.setState({
      isShowAddCategoryCode: false
    })
  }
  closeAddCodeValue = () => {
    this.setState({
      isShowAddCodeValue: false
    })
  }

  //左侧表格 点击行事件
  getInfo1 = (record, index) => {
    let id = record.id
    /* *********** 点击表格row执行更新state start ************* */
    if (this.state.activeIndex1 == id) {
      return
    }
    this.setState({
      leftmenu: record,
      rightData: null
    }, () => {
      if (this.state.leftmenu) {
        this.tableR.getData()
      }
    })
  }

  //右侧表格点击行事件
  getRowData = (record) => {
    this.setState({
      rightData: record,
      groupCode: record.classifyType == 1 ? 1 : 2
    })
  }
  onSelect = (value) => {
    this.setState({
      value,
      selectedValue: value,
    });
  }

  //判断是否有选中数据
  hasRecord = () => {
    if (!this.state.rightData) {
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
    } else {
      return true
    }
  }

  render() {
    const {intl} = this.props.currentLocale
    const columns1 = [
      {
        title: intl.get("wsd.i18n.base.docTem.docobject1"),
        dataIndex: 'boName',
        key: 'boName',
      },
    ]
    const columns2 = [
      {
        title: intl.get("wsd.i18n.plan.activitydefineinfo.category"),
        dataIndex: 'classifyCode',
        key: 'classifyCode',
        width:'50%',
        render: (text, record) => {
          if (record.classifyType == 1) {
            return <span><MyIcon type="icon-fenleima" style={{fontSize: 18, verticalAlign: "middle"}}/>{text}</span>
          }
          if (record.classifyType == 2) {
            return <span><MyIcon type="icon-fenleima-mazhi"
                                 style={{fontSize: 18, verticalAlign: "middle"}}/>{text}</span>
          }
        }
      },
      {
        title: intl.get("wsd.i18n.plan.activitydefine.remark"),
        dataIndex: 'classifyName',
        key: 'classifyName',
      },

    ]

    return (

      <ExtLayout renderWidth = {({contentWidth}) => { this.setState({contentWidth}) }}>
        <LeftContent width = {200}>
          <PageTable onRef={this.onRef}
                     pagination={false}
                     getData={this.getList}
                     columns={columns1}
                     getRowData={this.getInfo1}/>
        </LeftContent>
        <MainContent contentWidth = {this.state.contentWidth} contentMinWidth = {600}>
          {
            this.state.leftmenu && (
              <PageTable onRef={this.onRefR}
                         pagination={false}
                         getData={this.getListrightdata}
                         columns={columns2}
                         getRowData={this.getRowData}/>
            )
          }
        </MainContent>

        <Toolbar>
          <TopTags>
            {/* <AddCategoryCodeBtn onClickHandle={this.onClickHandle} /> */}
            <PublicButton name={'新增分类码'} title={'新增分类码'} icon={'icon-add'}
                          afterCallBack={this.onClickHandle.bind(this, 'AddCategoryCodeBtn')}
                          res={'MENU_EDIT'}
            />
            {/* <AddCodeValueBtn onClickHandle={this.onClickHandle} /> */}
            <PublicButton name={'新增码值'} title={'新增码值'} icon={'icon-add'}
                          afterCallBack={this.onClickHandle.bind(this, 'AddCodeValueBtn')}
                          res={'MENU_EDIT'}
            />
            {/* <DeleteTopBtn onClickHandle={this.onClickHandle} /> */}
            <PublicButton name={'删除'} title={'删除'} icon={'icon-shanchu'}
                          useModel={true} edit={true}
                          verifyCallBack={this.hasRecord}
                          afterCallBack={this.onClickHandle.bind(this, 'DeleteTopBtn')}
                          content={'你确定要删除吗？'}
                          res={'MENU_EDIT'}
            />
          </TopTags>
        </Toolbar>

        <RightTags rightTagList={this.state.rightTags} rightData={this.state.rightData}
                   updateSuccess={this.updateSuccess} menuCode={this.props.menuInfo.menuCode}
                   groupCode={this.state.groupCode}/>


        <AddCategoryCode
          visible={this.state.isShowAddCategoryCode}
          AddClassifyName={this.AddCodeValue}
          boCode={this.state.leftmenu ? this.state.leftmenu.boCode : null}
          handleCancel={this.closeAddCategoryCode.bind(this)}/>

        <AddCodeValue
          data={this.state.rightData}
          visible={this.state.isShowAddCodeValue}
          AddCodeValue={this.AddCodeValue}
          boCode={this.state.leftmenu ? this.state.leftmenu.boCode : null}
          handleCancel={this.closeAddCodeValue.bind(this)}/>

      </ExtLayout>
    )
  }
}


export default connect(state =>
  ({
    currentLocale: state.localeProviderData,
  }))(CategoryCode);
