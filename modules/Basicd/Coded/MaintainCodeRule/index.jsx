import React, {Component} from 'react'
import intl from 'react-intl-universal'
import {Table, message, Button} from 'antd'
import style from "./style.less"
import store from "../../../../store"
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as codeRuleAction from '../../../../store/base/codeRule/action';
import TopTags from './TopTags/index'
import axios from '../../../../api/axios';
import {getcoderuletype, deleteCoderuletype} from "../../../../api/api"
import PageTable from '../../../../components/PublicTable'

class MaintainCodeRule extends Component {
  constructor(props) {
    super(props)
    this.state = {

      visible: false,
      title: '',
      activeIndex: null,
      selectedRowKeys: [],
      rightData: null,
      rightTags: [
        {icon: 'iconjibenxinxi', title: '基本信息', fielUrl: 'Sys/Menu/MenuInfo'},
        {icon: 'iconquanxianpeizhi1', title: '权限配置', fielUrl: 'Sys/Menu/Permission'},
      ],
      data: [],
      columns: [],
      rightTag: [],
      id: null,
      h:document.documentElement.clientHeight || document.body.clientHeight-190   //浏览器高度，用于设置组件高度
    }
  }

  /**
   * 父组件即可调用子组件方法
   * @method
   * @description 获取用户列表、或者根据搜索值获取用户列表
   * @param {string} record  行数据
   * @return {array} 返回选中用户列表
   */
  onRef = (ref) => {
    this.table = ref
  }

  //获取列表信息
  getlist = (callBack) => {
    axios.get(getcoderuletype(this.props.codeRule.data.id)).then(res => {
      callBack(res.data.data)
      this.setState((preState, props) => ({
        data: res.data.data,
        id: props.codeRule.data.id
      }))
    })
  }

  /**
   * 验证复选框是否可操作
   * @method checkboxStatus
   * @return {boolean}
   */
  checkboxStatus = (record) => {
    return false
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

  onClickHandle = (name) => {
    if (name == "AddTopBtn") {
      this.setState({
        isShowAddRule: true
      })
      return
    }
    if (name == "AddCodeValueBtn") {
      this.setState({
        isShowAddCodeValue: true
      })
      return
    }
  }
  closeAddRule = () => {
    this.setState({
      isShowAddRule: false
    })
  }
  onClickCheck = () => {
    this.setState({
      isShowCheckModal: true
    })

  }
  closeCheckModal = () => {
    this.setState({
      isShowCheckModal: false
    })
  }


  //点击行
  getRowData = (record) => {
    this.setState({
      rightData: record
    })
  }

  //新增数据
  adddData = (value) => {
    this.table.add(null,value);
  }
  //更新数据
  updateData = (value) => {
    this.table.add(this.state.rightData,value);
  }
  //删除
  deleteData = () => {

    const {data, selectedRowKeys} = this.state
    axios.deleted(deleteCoderuletype, {data: selectedRowKeys}, true).then(res=>{
      this.table.getData();
      this.setState({
        rightData:null,
        selectedRowKeys: []
      })
    })

  }

  render() {
    const {intl} = this.props.currentLocale;
    const columns = [
      {
        title: intl.get('wbs.add.name'), //名称
        dataIndex: 'ruleTypeName',
        key: 'ruleTypeName',
      },
      {
        title: intl.get('wsd.i18n.plan.projectquestion.questiontype'),//类型
        dataIndex: 'attributeTypeVo',
        key: 'attributeTypeVo',
        render: text => text ? text.name : ''
      },
      {
        title: intl.get('wsd.i18n.sys.three.sql'),//SQL
        dataIndex: 'typeSql',
        key: 'typeSql',


      },
      {
        title: intl.get('wsd.i18n.sys.wfbizvar.tablename'),//表名
        dataIndex: 'tableName',
        key: 'tableName',
        render: text => text ? (text.name ? text.name : '') : ''

      },

      {
        title: intl.get('wsd.i18n.sys.wfbizvar.fieldname'),//字段名
        dataIndex: 'columnName',
        key: 'columnName',
        render: text => text ? (text.name ? text.name : '') : ''
      },
      {
        title: intl.get('wsd.i18n.base.preservecoderule.conncolumnname'),//关联字段
        dataIndex: 'foreignKey',
        key: 'foreignKey',

      },
      {
        title: intl.get('wsd.i18n.base.preservecoderule.redirect'),//重定向到字典
        dataIndex: 'redirect',
        key: 'redirect',
        render: (text, record) => {
          if (record.dictBoVo && record.dictBoVo.name && record.dictTypeVo && record.dictTypeVo.name) {
            return record.dictBoVo.name + "-" + record.dictTypeVo.name
          } else if (record.dictBoVo && record.dictBoVo.name && (record.dictTypeVo ? (record.dictTypeVo.name ? false : true) : true)) {
            return record.dictBoVo.name
          } else if (record.dictTypeVo && record.dictTypeVo.name && (record.dictBoVo ? (record.dictBoVo.name ? false : true) : true)) {
            return record.dictTypeVo.name
          }

        }
      },
    ]
    let {selectedRowKeys} = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({
          selectedRowKeys,
        })

      }
    }

    return (
      <div>
        <TopTags data={this.state.rightData}
                 codeRule={this.props.codeRule}
                 updateData={this.updateData}
                 adddData={this.adddData}
                 selectedRowKeys={this.state.selectedRowKeys}
                 deleteData={this.deleteData}/>
        <div className={style.main}>
          <div className={style.leftMain} style={{height: this.props.height}}>
            <PageTable onRef={this.onRef}
                       pagination={false}
                       istile={true}
                       getData={this.getlist}
                       columns={columns}
                       rowSelection={true}
                       onChangeCheckBox={this.getSelectedRowKeys}
                       useCheckBox={true}
                       total={this.state.total}
                       scroll={{x:'100%',y:this.props.height-60}}
                       checkboxStatus={this.checkboxStatus}
                       getRowData={this.getRowData}/>
          </div>

        </div>

      </div>

    )
  }
}


const mapStateToProps = state => {
  return {
    currentLocale: state.localeProviderData,
    codeRule: state.codeRule
  }
};
const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(Object.assign({}, codeRuleAction), dispatch)
});
// export default connect(state => ({ currentLocale: state.localeProviderData }))(CodeRule);
export default connect(mapStateToProps, mapDispatchToProps)(MaintainCodeRule);
