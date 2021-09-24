import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import style from './style.less';
import PageTable from '../../../components/PublicTable'
import {Table} from 'antd';
import RightTags from '../../../components/public/RightTags/index';
import axios from "../../../api/axios"
import {getdictTree, getCustomFormList} from "../../../api/api"
import * as dataUtil from '../../../utils/dataUtil'


/**
 * 用户自定义模块
 */
class UserDefine extends Component {
  constructor(props) {
    super(props);
    const {intl} = this.props.currentLocale
    this.state = {
      currentPageNum: 1,
      pageSize: 20,
      record: null,
      loading: false,
      loading1: false,
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
  getListData = (callBack) => {
    // currentPageNum = currentPageNum ? currentPageNum : 1
    // pageSize = pageSize ? pageSize : 20
    // if (this.state.searcher) {
    //     axios.get(getUserInfoList(pageSize, currentPageNum) + "?searcher=" + this.state.searcher, '', '', '', '', false).then(res => {
    //         callBack(res.data.data)
    //         this.setState({
    //             record: null,
    //             selectedRowKeys: [],
    //             selectedRows: [],
    //             data: res.data.data,
    //             total: res.data.total,
    //             pageSize: pageSize,
    //             currentPageNum: currentPageNum,
    //         })
    //     })
    // } else {
    //     axios.get(getUserInfoList(pageSize, currentPageNum), '', '', '', '', false).then(res => {
    //         callBack(res.data.data)
    //         this.setState({
    //             record: null,
    //             selectedRowKeys: [],
    //             selectedRows: [],
    //             data: res.data.data,
    //             total: res.data.total,
    //             pageSize: pageSize,
    //             currentPageNum: currentPageNum,
    //         })
    //     })
    // }
    callBack([])
  }

  /**
   * 获取表名
   */
  getTableNameData = (callBack) => {
    axios.get(getdictTree("base.custom.table")).then(res => {
      if(res.data.data){
        let data=res.data.data
        let newdata=data.map(item=>({id:item.value,...item}))
        callBack(newdata)
      }
     
    })
    callBack([])
  }

  /**
   * 获取表单字段列表
   */
  getFormData = (callBack) => {
    if (this.state.rightRecord) {
      axios.get(getCustomFormList(this.state.rightRecord.value)).then(res => {
        callBack(res.data.data)
      })
    } else {
      callBack([])
    }
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

  setLeftRow = (record) => {
    this.setState({
      rightRecord: record,
      tableName: record.value
    }, () => {
      this.formList.getData()
    })
  }

  /**
   * 删除用户
   * @method deleteData
   * @description 获取用户列表、或者根据搜索值获取用户列表
   * @param {string} record  行数据
   */
  deleteData = () => {
    const {total, selectedRows, pageSize, currentPageNum} = this.state
    let totalPageNum = Math.ceil((total - selectedRows.length) / pageSize);        //计算总页数
    let PageNum = totalPageNum >= currentPageNum ? currentPageNum : totalPageNum   //总页数大于等于 当前页面，当前页数不变 否则 为1
    this.table.getAppointPageData(PageNum, pageSize)
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
      this.table.getAppointPageData(currentPageNum, pageSize)
    })
  }

  /**
   * 验证复选框是否可操作
   * @method checkboxStatus
   * @return {boolean}
   */
  checkboxStatus = (record) => {
    if (record.userType != 1) {
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
    this.formList.update(this.state.record, vaule)
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
  refresh = (data) => {
    const {total, pageSize, currentPageNum} = this.state
    this.setState({
      currentPageNum
    }, () => {
      this.table.recoveryPage(currentPageNum)
      this.table.getAppointPageData(currentPageNum, pageSize)
    })
  }

  render() {
    const {selectedRowKeys} = this.state
    const {intl} = this.props.currentLocale
    const tableColumns = [
      {
        title: "名称",
        dataIndex: 'title',
        key: 'title',
        width: '100%',
      },
    ]
    const columns = [
      {
        title: "字段名",
        dataIndex: 'fieldName',
        key: 'fieldName',
        width: '10%',
      },
      {
        title: "显示名称",
        dataIndex: 'title',
        key: 'title',
        width: '15%',
      },
      {
        title: "数据类型",
        dataIndex: 'dataType',
        key: 'dataType',
        align: 'center',
        width: '8%',
        render: (text, record) => <span>{text ? text.name : ''}</span>
      },
      {
        title: "表单类型",
        dataIndex: 'formType',
        key: 'formType',
        align: 'center',
        width: '10%',
        render: (text, record) => <span>{text ? text.name : ''}</span>
      },
      {
        title: "必填",
        dataIndex: 'required',
        key: 'required',
        align: 'center',
        width: '6%',
        render: (text, record) => <span>{text ? '√' : ''}</span>
      },
      {
        title: "最大长度",
        dataIndex: 'maxLength',
        key: 'maxLength',
        align: 'center',
        width: '10%',
      },
      {
        title: "精度",
        dataIndex: 'precision',
        key: 'precision',
        align: 'center',
        width: '6%',
      },
      {
        title: "格式化字符串",
        dataIndex: 'formatter',
        key: 'formatter',
        width: '15%',
      },
      {
        title: "字典类型",
        dataIndex: 'dictType',
        key: 'dictType',
        width: '15%',
        render: (text, record) => <span>{text ? text.name : ''}</span>
      },
      {
        title: "启用",
        dataIndex: 'enable',
        key: 'enable',
        align: 'center',
        width: '6%',
        render: (text, record) => <span>{text ? '√' : ''}</span>
      },
    ]
    return (
      <div>
        {
          <div>
            <div className={style.main} style={{height: this.props.height + 40}}>
              <div className={style.leftMain}>
                <div style={{minWidth: 'calc(100vw - 60px)', display: "flex", height: "100%"}}>
                  <section style={{width: 250}} className={style.leftBox}>
                    <PageTable 
                               pagination={false}
                               getData={this.getTableNameData}
                               dataSource={this.state.taleLsit}
                               getRowData={this.setLeftRow}
                               columns={tableColumns}
                               closeContentMenu={true}
                               rowSelection={false}
                               loading={this.state.loading}
                               scroll={{x: '100%', y: this.props.height - 100}}
                    />
                  </section>
                  <section style={{width: "calc( 100% - 260px"}} className={style.rightBox}>
                    <PageTable onRef={ref => this.formList = ref}
                               pagination={false}
                               getData={this.getFormData}
                               columns={columns}
                               bordered={false}
                               dataSource={this.state.data}
                               loading={this.state.loading1}
                               scroll={{x: '100%', y: this.props.height - 100}}
                               getRowData={this.getRowData}
                    />
                  </section>
                </div>
              </div>
              <div className={style.rightBox} style={{height: this.props.height}}>
                <RightTags rightTagList={this.state.rightTags}
                           rightData={this.state.record}
                           tableName={this.state.tableName}
                           update={this.updateSuccess} menuCode={this.props.menuInfo.menuCode}/>
              </div>
            </div>
          </div>
        }
      </div>
    );
  }
}

export default connect(state => ({currentLocale: state.localeProviderData}))(UserDefine);

