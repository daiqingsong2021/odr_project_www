import React, { Component, Fragment } from 'react'
import { Table, Spin } from 'antd'
import style from './style.less'
import { connect } from 'react-redux'
import { changeLocaleProvider } from '@/store/localeProvider/action'
import * as util from '@/utils/util';
import * as dataUtil from '@/utils/dataUtil';
import { getDailyDetailPageList } from '@/modules/Suzhou/api/suzhou-api';
import axios from '@/api/axios';
import notificationFun from '@/utils/notificationTip';
import LabelFormLayout from "@/components/public/Layout/Labels/Form/LabelFormLayout"

class Energy extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: '线路',
        dataIndex: 'lineName',
        width: '10%',
      },
      {
        title: '线路分期',
        dataIndex: 'linePeriod',
        width: '10%',
      },
      {
        title: '统计类型',
        dataIndex: 'powerTypeVo.name',
        width: '10%',
      },
      {
        title: '车站/变电所',
        dataIndex: 'subStation',
        width: '10%',
      },
      {
        title: '电表',
        dataIndex: 'switchgear',
        width: '10%',
      },
      {
        title: '耗电量',
        dataIndex: 'powerConsumption',
        width: '15%',
      },
      {
        title: '备注',
        dataIndex: 'description',
        width: '25%',
      }
    ];
    this.state = {
      dataSource: [],
      pageSize: 10,
      currentPageNum: 1,
      dailyId: '', //主表id
      activeIndex: '',
      record: '',
      rightData: '',
      loading: false,
    };
  }
  componentDidMount() {
    this.setState({
      dailyId: this.props.record.id
    }, () => {
      this.getList()
    })
  }
  //获取主数据
  getList = () => {
    this.setState({ loading: true })
    const { dailyId, pageSize, currentPageNum } = this.state
    axios.get(getDailyDetailPageList(dailyId, pageSize, currentPageNum)).then(res => {
      let data = res.data.data;
      this.setState({
        loading: false,
        dataSource: data,
        total: res.data.total,
        rightData: null,
        selectedRowKeys: [],
      })
    })
  }
  //获取点击行数据
  getInfo = (record) => {
    const { activeIndex } = this.state;
    const { id } = record;
    this.setState({
      activeIndex: id,
      record: record,
      rightData: record
    });
  }
  //设置table的选中行class样式
  setClassName = (record, index) => {
    return record.id === this.state.activeIndex ? 'tableActivty' : '';
  };
  render() {
    const { dataSource } = this.state;
    const { height, record } = this.props
    let pagination = {  //分页
      total: this.state.total,
      // hideOnSinglePage: true,
      size: "small",
      current: this.state.currentPageNum,
      pageSize: this.state.pageSize,
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => `总共${total}条`,
      onShowSizeChange: (current, size) => {
        this.setState({
          pageSize: size,
          currentPageNum: 1
        }, () => {
          this.getList()
        })
      },
      onChange: (page, pageSize) => {
        this.setState({
          currentPageNum: page
        }, () => {
          this.getList()
        })
      }
    }
    return (
        <LabelFormLayout title=''>
          <Spin spinning={this.state.loading}>
            <div>
              <div className={style.search} style={{ background: 'white', position: 'sticky', top: -15, zIndex: 999 }}>
                <div className={style.tipBox}>
                  <span className={style.tipSpan}><b>日期：</b>{record.recordTime ? record.recordTime.substring(0, 10) : ''}</span>
                  <span className={style.tipSpan}><b>线路：</b>{record.lineName ? record.lineName : ''}</span>
                  <span className={style.tipSpan}><b>填报人：</b>{record.createVo ? record.createVo.name : ''}</span>
                  <span className={style.tipSpan}><b>填报时间：</b>{record.creatTime ? record.creatTime : ''}</span>
                  <span className={style.tipSpan}><b>审核人：</b>{record.reviewerVo.name ? record.reviewerVo.name : '暂无'}</span>
                  <span className={style.tipSpan}><b>审核时间：</b>{record.reviewTime ? record.reviewTime : '暂无'}</span>
                  <span className={style.tipSpan}><b>状态：</b>{record.reviewStatusVo ? record.reviewStatusVo.name : ''}</span>
                </div>
                <div>
                
                </div>
              </div>
              <div style={{height:height+40,overflow:'auto'}}>
              <Table
                rowKey={record => record.id}
                rowClassName={this.setClassName}
                bordered
                dataSource={dataSource}
                columns={this.columns}
                size='small'
                pagination={pagination}
                onRow={(record, index) => {
                  return {
                    onClick: () => {
                      this.getInfo(record, index)
                    },
                  }
                }}
              />
              </div>
            </div>
          </Spin>
        </LabelFormLayout>
    );
  }
}
export default connect(state => ({
  currentLocale: state.localeProviderData
}), {
  changeLocaleProvider
})(Energy);