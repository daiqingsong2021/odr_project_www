import React, { Component } from 'react';
import { Table, Icon, Input, Col, DatePicker, Button } from 'antd';
import style from './style.less';
const InputGroup = Input.Group;
const Search = Input.Search;
import axios from "../../../api/axios"
import { connect } from 'react-redux';
import PubTable from '../../../components/PublicTable'

import { getMyMessageList } from "../../../api/api"
import { bindActionCreators } from 'redux';
const { RangePicker } = DatePicker;
import MyTable from "../../../components/Table"
import * as dataUtil from "../../../utils/dataUtil"
//我的消息
export class MessageTem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 1,
      pageSize: 10,
      data: [],
      total: 1
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
    const {  title, planStartTime, planEndTime } = this.state
    let obj = {
      title,
      planStartTime,
      planEndTime
    }
    axios.post(getMyMessageList(pageSize, currentPageNum), obj).then(res => {
      callBack(res.data.data ? res.data.data : [])

      this.setState({
        data: res.data.data,
        total: res.data.total
      })
    })
  }
 
  componentWillReceiveProps(newProps){
    if(newProps.unReadmessage!=this.props.unReadmessage){
      this.table.getData()
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

  //处理消息
  handleTask = (record) => {
  
    // let data = [...this.state.data]
    // let index = data.findIndex(item=>item.id == record.id)
    // data.splice(index, 1)
    // let total = this.state.total
    // this.setState({
    //   total: total - 1,
    //   data
    // }, () => {
     
    // })
    localStorage.setItem("openMessage", JSON.stringify(record))
    this.props.callBackBanner({ menuName: '我的消息', url: "Message", id: 262, parentId: 0 }, true);
  }
  render() {
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
          planStartTime: null,
          planEndTime: null
        }, () => {
          this.table.getData()
        })
      } else {
        this.setState({
          planStartTime: times[0].format("YYYY-MM-DD"),
          planEndTime: times[1].format("YYYY-MM-DD")
        }, () => {
          this.table.getData()
        })
      }
    }
    const columns3 = [
      {
        title: '状态',
        dataIndex: 'realStatus',
        key: "realStatus",
        width:'5%',
        align: 'center',
        render: text => text ? text.name : null,
      }, {
        title: '标题',
        dataIndex: 'title',
        key: "title",
        width:'20%',
      },
      {
        title: '消息类型',
        key: "type",
        width:'10%',
        align: 'center',
        dataIndex: 'type',
        render: text => text ? text.name : null,
      },
      {
        title: '接收人',
        dataIndex: 'recvUser',
        width:'10%',
        align: 'center',
        key: "recvUser",
        render: text => text ? text.name : null,
      },
      {
        title: '发送人',
        dataIndex: 'sendUser',
        width:'10%',
        align: 'center',
        render: text => text ? text.name : null,
        key: "sendUser",
      },
      {
        title: '发送时间',
        dataIndex: 'sendTime',
        width:'15%',
        align: 'center',
        render: text => text ? text.substr(0, 10) : null,
        key: "sendTime",
        sortOrder: 'sendTime',
        sorter: (a, b) => a.sendTime - b.sendTime,
      },
      {
        title: '需要回复',
        dataIndex: 'claimDealType',
        key: "claimDealType",
        width:'20%',
        align: 'center',
        render: text => text ? text.name : null,
      },
      {
        title: '操作',
        dataIndex: 'msgoperation',
        width:'10%',
        align: 'left',
        render: (text, record) => <Button type="primary" size="small" onClick={this.handleTask.bind(this, record)}>查看</Button>
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
        <div className={style.search}>

          <div style={{marginRight:30}}>
            <label htmlFor="keyword">标题</label>&nbsp;&nbsp;&nbsp;
                                    <Input
              placeholder="按标题名称关键字查询"
              style={{ width: 180 }}
              size="small"
              onBlur={findPropject}
            />
          </div>

          <div >
            <label htmlFor="timeSearch">时间段</label>&nbsp;&nbsp;&nbsp;
                                    <RangePicker
              showTime
              format="YYYY-MM-DD "
              placeholder={['开始时间', '结束时间']}
              size="small"
              onChange={onChangeTime}
              style={{ width: 200 }}
            />
          </div>
        </div>
        {/*我的消息*/}
      
        <PubTable onRef={this.onRef}
          pagination={true}
          getData={this.getList}
          bordered={true}
          columns={columns3}
          total={this.state.total}
          scroll={{ x: 1400, y: this.props.height-182  }}
          getRowData={this.getRowData} />
      </div>



    )
  }
}


const mapStateToProps = state => {
  return {
    currentLocale: state.localeProviderData,
    unReadmessage: state.unReadmessage
  }
};

export default connect(mapStateToProps, null)(MessageTem);