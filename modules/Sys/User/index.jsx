import React, {Component, Fragment} from 'react';

import {connect} from 'react-redux';

import style from './style.less';
import PageTable from '../../../components/PublicTable'
import {Table} from 'antd';
import TopTags from './TopTags/index';
import RightTags from '../../../components/public/RightTags/index';
import ExtLayout from "../../../components/public/Layout/ExtLayout";
import MainContent from "../../../components/public/Layout/MainContent";
import Toolbar from "../../../components/public/Layout/Toolbar";

import axios from "../../../api/axios"
import {getUserInfoList,getBaseSelectTree} from "../../../api/api"
/* *********** 引入redux及redux方法 end ************* */
import * as dataUtil from '../../../utils/dataUtil'


/**
 * 用户管理 模块
 * @class SysUser
 */
class SysUser extends Component {
  constructor(props) {
    super(props);
    const {intl} = this.props.currentLocale
    this.state = {
      currentPageNum: 1,
      pageSize: 20,
      record: null,
      loading: false,
      rightTags: [
        {icon: 'iconyuangongliebiao', title: intl.get("wbs.add.basicInfo"), fielUrl: 'Sys/User/Info'},
      ],
      selectedRowKeys: [],
      selectedRows: [],
      data: [],
    };

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

  /**
   * 搜索
   * @method search
   * @description 根据搜索值查询相关联用户集合，如果value 为空 默认按分页查询全部。重置table组件分页的当前页位置
   * @param {string} value  搜索值
   * @function {function} this.table.recoveryPage()  重置table组件的数据 、例如 分页、复选框值、选中行值
   * @return {array} 返回用户列表
   */
  search = (value) => {
    this.setState({
      searcher: value != null || value.trim() != "" ? value : null,
      currentPageNum: 1,
    }, () => {
      this.table.getAppointPageData(this.state.currentPageNum, this.state.pageSize)
    })
  }

  /**
   * 获取用户列表
   * @method getListData
   * @description 获取用户列表、或者根据搜索值获取用户列表
   * @param {string} currentPageNum  当前页
   * @param {string} pageSize  每页条数
   * @return {array} 返回用户列表
   */
  getListData = (currentPageNum, pageSize,callBack) => {
     currentPageNum = currentPageNum ? currentPageNum :1
    pageSize = pageSize ? pageSize :20
    if (this.state.searcher) {
      axios.get(getUserInfoList(pageSize, currentPageNum) + "?searcher=" + this.state.searcher, '', '', '', '', false).then(res => {
        callBack(res.data.data)
        this.setState({
          record: null,
          selectedRowKeys: [],
          selectedRows: [],
          data: res.data.data,
          total: res.data.total,
          pageSize: pageSize,
          currentPageNum: currentPageNum,
        })
      })
    } else {
      axios.get(getUserInfoList(pageSize, currentPageNum), '', '', '', '', false).then(res => {
        callBack(res.data.data)
        this.setState({
          record: null,
          selectedRowKeys: [],
          selectedRows: [],
          data: res.data.data,
          total: res.data.total,
          pageSize: pageSize,
          currentPageNum: currentPageNum,
        })
      })
    }

  }

  
  // 获取下拉框值
  getBaseSelectTree = (typeCode) => {
    axios.get(getBaseSelectTree(typeCode)).then(res => {
      const { data } = res.data;
      let map = {};
      for(let index in data){
        map[data[index].value] = data[index].title;
      }
      //职位
      if (typeCode == "base.position.type"){
        this.setState({
          position: data,
          positionMap:map
        })
      }else if (typeCode == "base.professional.type"){ //专业
        this.setState({
          professional: data,
          professionalMap:map
        })
      }else if (typeCode == "base.education.type") {
        this.setState({
          education: data,
          educationMap: map
        })
      }
    })
  }

  componentDidMount() {
    this.getBaseSelectTree("base.position.type");//职务
    this.getBaseSelectTree("base.professional.type");//专业
    this.getBaseSelectTree("base.education.type");//学历
  }

  /**
   * 获取选中集合、复选框
   * @method getListData
   * @description 获取用户列表、或者根据搜索值获取用户列表
   * @param {string} record  行数据
   * @return {array} 返回选中用户列表
   */
  getRowData = (record) => {
    this.setState({
      record
    })
  };

  /**
   * 删除用户
   * @method deleteData
   * @description 获取用户列表、或者根据搜索值获取用户列表
   * @param {string} record  行数据
   */
  deleteData = () => {
    const {total,selectedRows,pageSize,currentPageNum} = this.state
    let totalPageNum = Math.ceil((total - selectedRows.length) / pageSize);        //计算总页数
    let PageNum = totalPageNum >= currentPageNum ? currentPageNum : totalPageNum   //总页数大于等于 当前页面，当前页数不变 否则 为1
    this.table.getAppointPageData(PageNum,pageSize)
  }


  /**
   * 新增用户
   * @method addBasicUser
   * @description 计算总条数，直接获取最后一页数据,并且重置table的分页
   * @return {array} 返回用户列表
   */
  addBasicUser = () => {
    const {data, total, pageSize} = this.state
    let currentPageNum = Math.ceil((total + 1) / pageSize)
    this.setState({
      currentPageNum
    }, () => {
      this.table.getAppointPageData(currentPageNum,pageSize)
    })
  }


  /**
   * 验证复选框是否可操作
   * @method checkboxStatus
   * @return {boolean}
   */
  checkboxStatus = (record) => {
    if (record.userType && record.userType != 1) {
      return true
    } else {
      return false
    }
  }

  /**
   * 修改基本信息
   * @method updateSuccess
   */
  updateSuccess = (vaule) => {
    this.table.update(this.state.record,vaule)
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

  /**
   * 刷新当前页面数据
   * @method refresh
   * @param {array} data  被操作数据集合
   */
  refresh=(data)=>{
    const {total, pageSize,currentPageNum} = this.state
    this.setState({
      currentPageNum
    }, () => {
      this.table.recoveryPage(currentPageNum)
      this.table.getAppointPageData(currentPageNum,pageSize)
    })
  }
  render() {
    const {selectedRowKeys} = this.state
    const {intl} = this.props.currentLocale
    const columns = [
      {
        title: intl.get('wsd.i18n.sys.user.username'),
        dataIndex: 'actuName',
        key: 'actuName',
        width: 160,
        render:text=><span title={text}>{text}</span>
      }, {
        title: intl.get('wsd.i18n.sys.user.actuName'),
        dataIndex: 'userName',
        key: 'userName',
        width: 160,
        render:text=><span title={text}>{text}</span>
      },
      {
        title: intl.get('wsd.i18n.sys.user.sex'),
        dataIndex: 'sex',
        key: 'sex',
        width:100,
        render: (text) => {
          if (text) {
            return <span>{text.name}</span>
          } else {
            return null
          }
        }
      },
      {
        title: intl.get('wsd.i18n.sys.user.staffStatus'),
        dataIndex: 'staffStatus',
        key: 'staffStatus',
        width: 100,
        render: (text) => {
          if (text) {
            return <span>{text.name}</span>
          } else {
            return null
          }
        }
      },
      {
        title: intl.get('wsd.i18n.sys.user.status'),
        dataIndex: 'status',
        width: 100,
        key: 'status',
        render: (text) => {
          if (text) {
            return <span>{text.name}</span>
          } else {
            return null
          }
        }
      },
      {
        title: intl.get('wsd.i18n.sys.user.sortNum'),
        dataIndex: 'sortNum',
        key: 'sortNum',
        width: 100
      },
      {
        title: intl.get('wsd.i18n.sys.user.lastuptime'),
        dataIndex: 'lastloginTime',
        key: 'lastloginTime',
        width: 100,
        render: (text) => dataUtil.Dates().formatDateString(text)
      },
      {
        title: intl.get('wsd.i18n.sys.user.visitNum'),
        dataIndex: 'visits',
        key: 'visits',
        width:100,
        render: (text) =>text? text:0
      },
      {
        title: "职务",
        dataIndex: 'position',
        key: 'position',
        width:100,
        render: (text, record) => {
          let ret = '';
          if (text && this.state.positionMap)
          {
            let ec5 = text.split(',');
            ec5.map((item,index)=>{
              ret = ret == '' ? this.state.positionMap[item] : ret + ',' + this.state.positionMap[item];
            },this)
          }
          return <span title={ret}>{ret}</span>;
        }
      },
      {
        title: intl.get('wsd.i18n.sys.user.rolename'),
        dataIndex: 'retRole',
        key: 'retRole',
        width: 200,
        render:text=><span title={text}>{text}</span>
      },
      {
        title: "专业",
        dataIndex: 'professional',
        key: 'professional',
        width:100,
        render: (text, record) => {
          let ret = '';
          if (text && this.state.professionalMap)
          {
            let ec5 = text.split(',');
            ec5.map((item,index)=>{
              ret = ret == '' ? this.state.professionalMap[item] : ret + ',' + this.state.professionalMap[item];
            },this)
          }
          return ret;
        }
      }

    ]
    return (
      <ExtLayout renderWidth = {({contentWidth}) => { this.setState({contentWidth}) }}>
      <Toolbar>
      <TopTags addBasicUser={this.addBasicUser} data={this.state.selectedRows} deleteData={this.deleteData}
                     refresh={this.refresh}  rightData={this.state.record}
                     position={this.state.position} positionMap={this.state.positionMap}
                     professional={this.state.professional} professionalMap={this.state.professionalMap}
                     search={this.search}/>
      </Toolbar>
      <MainContent contentWidth = {this.state.contentWidth} contentMinWidth = {1500}>
      <PageTable onRef={this.onRef}
                            pagination={true}
                            getData={this.getListData}
                            columns={columns}
                            rowSelection={true}
                       
                            onChangeCheckBox={this.getSelectedRowKeys}
                            useCheckBox={true}
                            total={this.state.total}
                            scroll={{x: 1200, y: this.props.height - 100}}
                            checkboxStatus={this.checkboxStatus}
                            getRowData={this.getRowData}/>
      </MainContent>
      <RightTags rightTagList={this.state.rightTags}
                           rightData={this.state.record}
                           position={this.state.position} positionMap={this.state.positionMap}
                           professional={this.state.professional} professionalMap={this.state.professionalMap}
                           education={this.state.education} educationMap={this.state.educationMap}
                           updateSuccess={this.updateSuccess} menuCode={this.props.menuInfo.menuCode}/>

    </ExtLayout>
     

    );
  }
}

export default connect(state => ({currentLocale: state.localeProviderData}))(SysUser);

