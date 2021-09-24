import React, { Component } from 'react'

import { Table, Icon, Select, notification, Checkbox } from 'antd'
import TreeTable from '../../../../../components/PublicTable'
import style from './style.less'
import LabelToolbar from '../../../../../components/public/Layout/Labels/Table/LabelToolbar'
			import LabelTableLayout from '../../../../../components/public/Layout/Labels/Table/LabelTableLayout'
			import LabelTable from '../../../../../components/public/Layout/Labels/Table/LabelTable'
			import LabelTableItem from '../../../../../components/public/Layout/Labels/Table/LabelTableItem'
		  
import PublicButton from '../../../../../components/public/TopTags/PublicButton'
import MyIcon from "../../../../../components/public/TopTags/MyIcon"
import PublicMenuButton from '../../../../../components/public/TopTags/PublicMenuButton'
import * as dataUtil from '../../../../../utils/dataUtil'
import EditDevModal from './EditDevModal'
import { connect } from 'react-redux'
import axios from "../../../../../api/axios"
import { getTmpldelvTree, deleteTmpldelvPbs, deleteTmpldelvDelv } from "../../../../../api/api"

const Option = Select.Option;

class DevSetTem extends Component {
  constructor(props) {
    super(props)
    this.state = {

      distributeType: false,
      title: '',
      visible: false,
      data: [],
      activeIndex: null,
      rightData: null,
      h: document.documentElement.clientHeight || document.body.clientHeight - 190   //浏览器高度，用于设置组件高度
    }
  }

  /**
   * 父组件即可调用子组件方法
   */
  onRef = (ref) => {
    this.table = ref
  }

  getList = (callBack) => {
    axios.get(getTmpldelvTree(this.props.data.id)).then(res => {
      callBack(res.data.data)
      this.setState({
        data: res.data.data
      })
    })
  }

  getRowData = (record) => {
    this.setState({
      rightData: record
    })


  }

  onClickHandle = (name) => {
    const { data, rightData } = this.state;
    if (name == "AddDeliveryBtn") {

      if (!rightData) {
        notification.warning(
          {
            placement: 'bottomRight',
            bottom: 50,
            duration: 1,
            message: '警告',
            description: '请选择PBS或者交付物！'
          }
        )
        return
      }

      if (rightData.type == "delv") {
        notification.warning(
          {
            placement: 'bottomRight',
            bottom: 50,
            duration: 1,
            message: '警告',
            description: '不能再交付物下新增交付物！'
          }
        )
        return
      }
      this.setState({ visible: true, title: "新增交付物", type: "addDelv", selectData: rightData })
    }
    if (name == "ModifyTopBtn") {
      if (!rightData) {
        notification.warning(
          {
            placement: 'bottomRight',
            bottom: 50,
            duration: 1,
            message: '警告',
            description: '没有选择数据！'
          }
        )
        return
      }
      rightData && rightData.type == "delv" ? this.setState({ visible: true, title: "修改交付物", type: "modify", selectData: rightData }) :
          this.setState({ visible: true, title: "修改PBS", type: "modify", selectData: rightData })
    }
    if (name == "DeleteTopBtn") {
     
      if (rightData.type == "delv") {
        axios.deleted(deleteTmpldelvDelv, { data: [rightData.id] }).then(res => {
          this.table.deleted(this.state.rightData);
          this.setState({
            rightData: null,
          });
        })
      }
      if (rightData.type == "pbs") {
        axios.deleted(deleteTmpldelvPbs, { data: [rightData.id] }).then(res => {
          this.table.deleted(this.state.rightData);
          this.setState({
            rightData: null,
          });
        })
      }
    }
  }
  onClickHandle1 = (name) => {
    const { rightData } = this.state
    if (name =="same") {

      this.setState({ visible: true, title: "新增同级PBS", type: "addPbsSame", selectData: rightData })
    }
    if (name == "next") {
      if (!rightData) {
        notification.warning(
          {
            placement: 'bottomRight',
            bottom: 50,
            duration: 1,
            message: '警告',
            description: '没有选择数据！'
          }
        )
        return
      }

      this.setState({ visible: true, title: "新增下级PBS", type: "addPbsNext", selectData: rightData })
    }
  }

  //新增同级
  addSameData = (value) => {
    this.table.add(null, value)
  }
  //新增
  addData = (value) => {
    this.table.add(this.state.rightData, value)
  }
  //修改
  updateData = (value) => {
    this.table.update(this.state.rightData, value)
  }
  handleCancel = (e) => {
    this.setState({ visible: false })
  }
  //删除前校验
  hasRecord=()=>{
    const {rightData}=this.state
    if (!rightData) {
      notification.warning(
        {
          placement: 'bottomRight',
          bottom: 50,
          duration: 1,
          message: '警告',
          description: '没有选择数据！'
        }
      )
      return false
    }else{
      return true
    }
  }
  render() {
    const { intl } = this.props.currentLocale

    const columns = [
      {
        title: intl.get('wsd.i18n.plan.delvList.delvname'),
        dataIndex: 'delvTitle',
        key: 'delvTitle',
        width: '20%',
        render: (text, record) => {

          if (record.type == "delv") {
            return <span><MyIcon type="icon-jiaofuwu1" style={{ fontSize: '18px', verticalAlign: "middle" }} />&nbsp;{text}</span>
          } else {
            return <span><MyIcon type="icon-PBS"
              style={{ fontSize: '18px', verticalAlign: "middle" }} />&nbsp;{text}</span>
          }
        }
      },
      {
        title: intl.get('wsd.i18n.base.docTem.docnum'),
        dataIndex: 'delvNum',
        key: 'delvNum',
        width: '20%',
      },
      {
        title: intl.get('wsd.i18n.plan.projectquestion.questiontype'),
        dataIndex: 'delvType',
        key: 'delvType',
        width: '20%',
        render: (text) => {
          if (text) {
            return <span>{text.name}</span>
          } else {
            return ""
          }
        }
      },
      {
        title: intl.get('wsd.i18n.plan.plandefine.creator'),
        dataIndex: 'creator',
        key: 'creator',
        width: '20%',
        render: (text) => {
          if (text) {
            return <span>{text.name}</span>
          } else {
            return "--"
          }
        }
      },
      {
        title: intl.get('wsd.i18n.sys.menu.creattime'),
        dataIndex: 'creatTime',
        key: 'creatTime',
        render: (text) => dataUtil.Dates().formatDateString(text)
      }
    ]


    return (
      <LabelTableLayout title = {this.props.title} menuCode = {this.props.menuCode}>
      <LabelToolbar>
      <PublicMenuButton title={"新增PBS"} afterCallBack={this.onClickHandle1}
                        icon={"icon-Icon-daoru"}
                        menus={[
                          { key: "same", label: "新增同级PBS", edit: true},
                          { key: "next", label: "新增下级PBS", edit: true},
                        ]}
                    />
            <PublicButton name={'新增交付物'} title={'新增交付物'} icon={'icon-add'}
              afterCallBack={this.onClickHandle.bind(this, 'AddDeliveryBtn')}
              res={'MENU_EDIT'}
            />
             <PublicButton name={'修改'} title={'修改'} icon={'icon-edit'}
              afterCallBack={this.onClickHandle.bind(this, 'ModifyTopBtn')}
              res={'MENU_EDIT'}
            />
            <PublicButton name={'删除'} title={'删除'} icon={'icon-delete'}
              useModel={true} edit={true}
              verifyCallBack={this.hasRecord}
              afterCallBack={this.onClickHandle.bind(this, 'DeleteTopBtn')}
              content={'你确定要删除吗？'}
              res={'MENU_EDIT'}
            />
      </LabelToolbar>
      <LabelTable labelWidth = {this.props.labelWidth } contentMinWidth = {1000}>
      <TreeTable onRef={this.onRef}
              pagination={false}
              getData={this.getList}
              columns={columns}
          
              getRowData={this.getRowData} />
      </LabelTable>
      
      {this.state.visible &&
          <EditDevModal
            type={this.state.type}
            title={this.state.title}
            selectData={this.state.selectData}
            typeId={this.props.data.id}
            addSameData={this.addSameData}
            handleCancel={this.handleCancel}
            addData={this.addData}
            updateData={this.updateData}
          />}
      
        </LabelTableLayout>
      
    )
  }
}

const mapStateToProps = state => {
  return {
    currentLocale: state.localeProviderData,
  }
};


export default connect(mapStateToProps, null)(DevSetTem);
