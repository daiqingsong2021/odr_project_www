import React, { Component } from 'react';
import { Table, Row, Input, Col, DatePicker, Button } from 'antd';
import style from './style.less';
const InputGroup = Input.Group;
const Search = Input.Search;
import moment from "moment"
const { RangePicker } = DatePicker;
import axios from "../../../api/axios"
import {queryQuestionList,getProcessIngQuestionList,getReviewIngQuestionList} from '../../../api/suzhou-api'
import MyTable from "../../../components/Table"
import PubTable from '../../../components/PublicTable'

import * as dataUtil from "../../../utils/dataUtil"
//我的问题
class MyQuestionTem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 1,
      pageSize: 10,
      data: [],
      selectParam: 1,
      project:'',
      title:'',
      startTime:'',
      endTime:''
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
    let loginUser = JSON.parse(sessionStorage.getItem('userInfo'));
    const {project, title, startTime, endTime, selectParam } = this.state;
    let params = {
      project,
      title,
      startTime,
      endTime,
    }
    if (selectParam == 1) {
      let params = {
        project,
        title,
        startTime,
        endTime,
        status:'1,2',
        currentUserId:loginUser.id
      }
      axios.get(queryQuestionList(pageSize, currentPageNum), {params}).then(res => {
        callBack(res.data.data ? res.data.data : [])  
        this.setState({
          data: res.data.data,
          total: res.data.total
        })
      })
    }
    if (selectParam == 2) {
      axios.get(getProcessIngQuestionList(pageSize, currentPageNum), {params}).then(res => {
        callBack(res.data.data ? res.data.data : [])
        this.setState({
          data: res.data.data,
          total: res.data.total
        })
      })
    }
    if (selectParam == 3) {
      axios.get(getReviewIngQuestionList(pageSize, currentPageNum), {params}).then(res => {
        callBack(res.data.data ? res.data.data : [])
        this.setState({
          data: res.data.data,
          total: res.data.total
        })
      })
    }

  }
  //查看问题
  handleTask = (record) => {
    const { projectId, name } = record
    localStorage.setItem("myQuestion", JSON.stringify(record))
    dataUtil.CacheOpenProjectByType("comucate").addLastOpenProject(projectId, name, () => {
      this.props.openMenuByMenuCode("CM-ISSUE", true);
    },"comucate");
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
  //改变
  selectHandle = (value) => {
    this.setState({ selectParam: value }, () => {
      this.table.getData()

    })
  }
  render() {
    let onChange = () => {

    }
    //搜索项目
    let findPropject = (e) => {
      this.setState({
        title: e.currentTarget.value
      }, () => {
        this.table.getData()
      })
    }
    let onChangeTime = (times) => {
      if (times.length == 0) {
        this.setState({
          startTime: null,
          endTime: null
        }, () => {
          this.table.getData()
        })
      } else {
        this.setState({
          startTime: times[0].format("YYYY-MM-DD"),
          endTime: times[1].format("YYYY-MM-DD")
        }, () => {
          this.table.getData()
        })
      }
    }
    const { selectParam } = this.state
    const columns5 = [
      {
        title:'项目名称',
        dataIndex: 'projectName',
        key: 'projectName',
        render(text, record) {
          return <span title={text}>{text}</span>
          }
      },
      {
        title:'标段名称',
        dataIndex: 'sectionName',
        align: 'center',
        key: 'sectionName',
        render(text, record) {
          return <span title={text}>{text}</span>
          }
      },
      {
        title: '问题标题',
        dataIndex: 'title',
        align: 'center',
        key: 'title',
        render(text, record) {
          return <span title={text}>{text}</span>
          }
      },     
      {
        title: '问题类型',
        dataIndex: 'typeVo',
        key: 'typeVo',
        align: 'center',
        render(text, record) {
          return <span title={text ? text.name : null}>{text ? text.name : null}</span>
          }
      },
      // {
      //   title: '优先级',
      //   dataIndex: 'priorityVo',
      //   key: 'priorityVo',
      //   align: 'center',
      //   render(text, record) {
      //     return <span title={text ? text.name : null}>{text ? text.name : null}</span>
      //     }
      // },
      {
        title: '责任主体',
        dataIndex: 'orgVo',
        align: 'center',
        key: 'orgVo',
        render(text, record) {
          return <span title={text ? text.name : null}>{text ? text.name : null}</span>
          }
      },
      {
        title: '责任人',
        dataIndex: 'userVo',
        key: 'userVo',
        align: 'center',
        render(text, record) {
          return <span title={text ? text.name : null}>{text ? text.name : null}</span>
          }
      },
      {
        title: '当前处理人',
        dataIndex: 'currentUserVo',
        key: 'currentUserVo',
        align: 'center',
        render(text, record) {
          return <span title={text ? text.name : null}>{text ? text.name : null}</span>
          }
      },
      {
        title: '当前处理人所属组织',
        dataIndex: 'currentUserOrgVo',
        key: 'currentUserOrgVo',
        align: 'center',
        width:'10%',
        render(text, record) {
          return <span title={text ? text.name : null}>{text ? text.name : null}</span>
          }
      },
      {
        title: '提出人',
        dataIndex: 'createrVo',
        key: 'createrVo',
        align: 'center',
        render(text, record) {
          return <span title={text ? text.name : null}>{text ? text.name : null}</span>
          }
      },
      {
        title: '提出时间',
        dataIndex: 'createTime',
        key: 'createTime',
        sortOrder: 'createTime',
        align: 'center',
        sorter: (a, b) => a.createTime - b.createTime,
        render(text, record) {
          return <span title={text ? text.substr(0, 10) : null}>{text ? text.substr(0, 10) : null}</span>
          }
      },
      {
        title: '要求处理时间',
        dataIndex: 'handleTime',
        key: 'handleTime',
        sortOrder: 'handleTime',
        align: 'center',
        sorter: (a, b) => a.handleTime - b.handleTime,
        render(text, record) {
          return <span title={text ? text.substr(0, 10) : null}>{text ? text.substr(0, 10) : null}</span>
          }
      },
      {
        title: '状态',
        dataIndex: 'statusVo',
        align: 'center',
        key: 'statusVo',
        render(text, record) {
          return <span title={text ? text.name : null}>{text ? text.name : null}</span>
          }
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        width: '7%',
        align: 'center',
        render: (text, record) =>{
          if(record.statusVo.code == '1'){//处理
              return(
                <Button type="primary" size="small" onClick={this.handleTask.bind(this, record)}>处理</Button>
              )
          }else if(record.statusVo.code == '2'){//审核
            return(
              <Button type="primary" size="small" onClick={this.handleTask.bind(this, record)}>审核</Button>
            )
          }else{
            return(
              <Button type="primary" size="small" onClick={this.handleTask.bind(this, record)}>操作</Button>
            )
          }
        } 
      }
    ];
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
      },
      getCheckboxProps: record => ({
        disabled: record.name === 'Disabled User', // Column configuration not to be checked
        name: record.name,
      }),
    };
    return (
      <div className={style.main}>
        {/*我的消息*/}
        <div className={style.headerstyle}>

          <div style={{ marginRight: 30 }}>
            <div className={style.selectParamstyle}>
              <span onClick={this.selectHandle.bind(this, 1)} className={selectParam == 1 ? "my-link" : "topBtnActivity"}>全部</span>&nbsp;&nbsp;&nbsp;
              <span onClick={this.selectHandle.bind(this, 2)} className={selectParam == 2 ? "my-link" : "topBtnActivity"}>待我处理</span>&nbsp;&nbsp;&nbsp;
              <span onClick={this.selectHandle.bind(this, 3)} className={selectParam == 3 ? "my-link" : "topBtnActivity"}>待我审核</span>&nbsp;&nbsp;&nbsp;
          </div>

          </div>
          <div style={{ marginRight: 30 }}>
            <label htmlFor="keyword">标题&nbsp;&nbsp;</label>
            <Input
              placeholder="按问题标题关键字查询"
              style={{ width: 180 }}
              size="small"
              onBlur={findPropject}
            />
          </div>
          <div style={{ marginRight: 30 }}>
            <label htmlFor="timeSearch">时间段</label>&nbsp;&nbsp;&nbsp;
                                        <RangePicker
              showTime
              format="YYYY-MM-DD"
              placeholder={['开始时间', '结束时间']}
              onChange={onChangeTime}
              // onOk={onOk}
              size="small"
              style={{ width: 200 }}
            />
          </div>


        </div>
        <PubTable onRef={this.onRef}
          pagination={true}
          getData={this.getList}
          bordered={true}
          columns={columns5}
          total={this.state.total}
          scroll={{ x: 1500, y: this.props.height - 182 }}
          getRowData={this.getRowData} />


      </div>



    )
  }
}

export default MyQuestionTem
