import React, { Component } from 'react'
import { Table, Spin, notification } from 'antd'
import style from './style.less'
import _ from 'lodash'
import TopTags from './TopTags/index'
import RightTags from '../../../components/public/RightTags/index'

import { connect } from 'react-redux'
import axios from '../../../api/axios'
import { wfBizTypeList, wfBizTypeDel } from '../../../api/api'


class TableComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      initDone: false,
      activeIndex: null,
      rightData: null,
      rightTags: [
        { icon: 'iconjibenxinxi', title: '基本信息', fielUrl: 'Sys/Wfbusiness/BasicInfo' },
      ],
      data: []
    }
  }


  getDataList = () => {
    axios.get(wfBizTypeList).then(res => {
      this.setState({
        data: res.data.data
      })
    })
  }

  componentDidMount() {
    this.getDataList();
  }

  getInfo = (record, index) => {
    let id = record.id, records = record

    this.setState({
      activeIndex: id,
      rightData: record,
    })
  }

  //新增
  addData = (newData) => {
    this.setState({
      data: [newData, ...this.state.data]
    })
  }

  //修改
  updateData = (newData) => {
    let { data } = this.state;
    let index = data.findIndex(item => item.id == newData.id);
    data.splice(index, 1, newData);
    this.setState({
      data
    })
  }

  //删除
  deleteData = () => {
    if (this.state.rightData) {
      axios.deleted(wfBizTypeDel(this.state.rightData.id), {}, true, '删除成功').then(res => {
        let {data} = this.state;
        let index = data.findIndex(item=>item.id == this.state.rightData.id);
        data.splice(index, 1);
        this.setState({
          data,
        })
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


  setClassName = (record, index) => {
    //判断索引相等时添加行的高亮样式
    return record.id === this.state.activeIndex ? 'tableActivty' : "";
  }


  render() {
    const { intl } = this.props.currentLocale;
    const columns = [
      {
        title: intl.get('wsd.i18n.sys.wfbusiness.modecode'),
        dataIndex: 'moduleCode',
        key: 'moduleCode',
        width:'20%',
      },
      {
        title: intl.get('wsd.i18n.sys.wfbusiness.wfcode'),
        dataIndex: 'typeCode',
        key: 'typeCode',
        width:'20%',
      },
      {
        title: intl.get('wsd.i18n.sys.wfbusiness.wfname'),
        dataIndex: 'typeName',
        key: 'typeName',
        width:'20%',
      },
      {
        title: intl.get('wsd.i18n.sys.wfbusiness.wfurl'),
        dataIndex: 'url',
        key: 'url',
        width:'20%',
      },
      {
        title: intl.get('wsd.i18n.sys.wfbusiness.wfevents'),
        dataIndex: 'event',
        key: 'event',
        width:'20%',
      },
    ];

    return (
      <div>
        <TopTags addData={this.addData} deleteData={this.deleteData} />
        <div className={style.main}>
          <div className={style.leftMain}>
            <Table columns={columns} dataSource={this.state.data} pagination={false} scroll={{x:'100%',y:this.props.height-40}}
                   size='small'
                   rowClassName={this.setClassName}
                   rowKey={record => record.id}
                   onRow={(record, index) => {
                     return {
                       onClick: (event) => {
                         this.getInfo(record, index)
                       }
                     }
                   }
                   } />
          </div>
          <div className={style.rightBox} style={{ height: this.props.height }}>
            <RightTags rightTagList={this.state.rightTags} rightData={this.state.rightData} updateData={this.updateData}  menuCode = {this.props.menuInfo.menuCode} />
          </div>
        </div>
      </div>
    )
  }
}

/* *********** connect链接state及方法 start ************* */
export default connect(state => ({
  currentLocale: state.localeProviderData
}))(TableComponent);
/* *********** connect链接state及方法 end ************* */
