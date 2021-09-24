import React, {Component} from 'react';
import {Table, Icon, Input, Col, DatePicker, Button, Row, Select} from 'antd';
import style from './style.less';
import axios from "../../../api/axios"
import {getMyUnfinishTaskList, wfBizTypeList} from "../../../api/api"

const InputGroup = Input.Group;
const Search = Input.Search;
const {RangePicker} = DatePicker;

const Option = Select.Option
import PubTable from '../../../components/PublicTable'
import MyTable from "../../../components/Table"
import {connect} from 'react-redux';
import * as dataUtil from "../../../utils/dataUtil"

//我的待办
class MyToDoTem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      times: []
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

  getList = (currentPageNum, pageSize, callBack) => {
    const {bizType, startTime, endTime} = this.state
    let obj = {bizType, startTime, endTime}
    axios.post(getMyUnfinishTaskList(pageSize, currentPageNum), obj).then(res => {
      callBack(res.data.data ? res.data.data : [])
      this.setState({
        data: res.data.data,
        total: res.data.total ? res.data.total : this.state.total
      })
    })
  }

  //处理待办
  handleTask = (record) => {
    const {id, procInstId} = record
    this.props.openWorkFlowMenu({taskId: id, procInstId: procInstId});
  }

  //获取流程类型
  getBizType = () => {
    if (!this.state.bizTypeList) {
      axios.get(wfBizTypeList).then(res => {
        if (res.data.data) {
          this.setState({
            bizTypeList: res.data.data
          })
        }
      })
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

  render() {
    //搜索项目
    let findBizType = (value) => {
      this.setState({
        bizType: value
      }, () => {
        this.table.getData()
      })
    }

    let onChangeTime = (times) => {
      this.setState({
        times: times
      })
    }

    let onOpenChangeTime = (status) => {
      if (status) {
        return; //只有关闭时才调用
      }
      if (this.state.times.length == 0) {
        this.setState({
          startTime: null,
          endTime: null
        }, () => {
          this.table.getData()
        })
      } else {
        this.setState({
          startTime: this.state.times[0].format("YYYY-MM-DD"),
          endTime: this.state.times[1].format("YYYY-MM-DD")
        }, () => {
          this.table.getData()
        })
      }
    }

    const columns = [{
      title: '名称',
      dataIndex: 'procInstName',
      width: '30%',
      render:(text) =>{
        return <span title={text}>{text}</span>
      }
    },
      {
        title: '流程发起人',
        dataIndex: 'startUser',
        width: '10%',
        align: 'center',
        render: (text) => {
          if (text) {
            return <span>{text.name}</span>
          } else {
            return null
          }
        }
      },
      {
        title: '送审人',
        dataIndex: 'sender',
        width: '10%',
        align: 'center',
        render: (text) => {
          if (text) {
            return <span>{text.name}</span>
          } else {
            return null
          }
        }
      },
      {
        title: '当前节点',
        dataIndex: 'taskName',
        width: '15%',
        align: 'center',
      },
      {
        title: '开始时间',
        dataIndex: 'createTime',
        sortOrder: 'createTime',
        width: '15%',
        align: 'center',
        sorter: (a, b) => a.createTime - b.createTime,
      },
      {
        title: '操作',
        dataIndex: 'operation',
        width: '15%',
        align: 'left',
        render: (text, record) => <Button type="primary" size="small" onClick={this.handleTask.bind(this, record)}>处理</Button>
      }
    ];

    return (
      <div className={style.main}>
        <div>
          <div className={style.search}>
            <div style={{marginRight: 30}}>
              <label htmlFor="timeSearch">时间段</label>&nbsp;&nbsp;&nbsp;
              <RangePicker
                showTime
                format="YYYY-MM-DD"
                placeholder={['开始时间', '结束时间']}
                onChange={onChangeTime}
                onOpenChange={onOpenChangeTime}
                // onOk={onOk}
                size="small"
                style={{width: 200}}
              />
            </div>
            <div>
              <label htmlFor="process">流程业务</label>&nbsp;&nbsp;&nbsp;
              <Select onDropdownVisibleChange={this.getBizType} style={{width: 180}} placeholder="按流程业务查询" size="small" onChange={findBizType} allowClear>
                {this.state.bizTypeList && this.state.bizTypeList.map(item => {
                  return <Option value={item.typeCode} key={item.typeCode}>{item.typeName}</Option>
                })}
              </Select>
            </div>
          </div>
        </div>
        {/*我的代办*/}
        <PubTable onRef={this.onRef}
                  pagination={true}
                  getData={this.getList}
                  bordered={true}
                  columns={columns}
                  total={this.state.total}
                  scroll={{x: 1100, y: this.props.height - 182}}
                  getRowData={this.getRowData}/>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    currentLocale: state.localeProviderData,
    myTodo: state.myTodo
  }
};

export default connect(mapStateToProps, null)(MyToDoTem);
