import React from 'react'
import { Table, Button, Spin } from 'antd'
import style from './style.less'
import { connect } from 'react-redux'
import { changeLocaleProvider } from '@/store/localeProvider/action'
import * as util from '@/utils/util';
import * as dataUtil from '@/utils/dataUtil';
import { queryStationFoundationList, updateStationFoundationList } from '@/modules/Suzhou/api/suzhou-api';
import axios from '@/api/axios';
import notificationFun from '@/utils/notificationTip';
import LabelFormLayout from "@/components/public/Layout/Labels/Form/LabelFormLayout"

class Info extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      pageSize: 10,
      currentPageNum: 1,
      activeIndex: '',
      record: '',
      rightData: '',
      loading: false,
    };
  }
  componentDidMount() {
    this.getList()
  }
  //获取主数据
  getList = () => {
    this.setState({ loading: true })
    const { line } = this.props.rightData
    axios.get(queryStationFoundationList, { params: { line, stationType: '0' } }).then(res => {
      let data = res.data.data;
      this.setState({
        loading: false,
        oldData: data,
        dataSource: data,
        total: data.length ? data.length : 0,
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

  //提交
  handleSubmit = () => {
    this.setState({ loading: true })
    const { dataSource } = this.state
    if(!dataSource){
      notificationFun("提示","无新增数据")
      this.getList()
    }
    else{
      console.log(11,dataSource)
      dataSource.map((item, index) => {
        item.stationNum = index + 1
      })
      axios.put(updateStationFoundationList, dataSource, true).then(res => {
        this.getList()
      })
    }
  }
  //排序
  bubbleSort = (index, type) => {
    const { oldData } = this.state
    let arr = oldData
    if (type == 'up') {
      let temp = arr[index];        // 元素交换
      arr[index] = arr[index - 1];
      arr[index - 1] = temp;
      this.setState({
        dataSource: arr
      })
    } else {
      let temp = arr[index];        // 元素交换
      arr[index] = arr[index + 1];
      arr[index + 1] = temp;
      this.setState({
        dataSource: arr
      })
    }
  }
  //设置table的选中行class样式
  setClassName = (record, index) => {
    return record.id === this.state.activeIndex ? 'tableActivty' : '';
  };
  render() {
    const { dataSource } = this.state;
    const { height, record, permission } = this.props
    const columns = [
      {
        title: '上行线顺序',
        dataIndex: 'stationNum',
        key: 'stationNum',
        render: (text, record, index) => {
          return <span>{index + 1}</span>
        }
      },
      {
        title: '站点编号',
        dataIndex: 'stationCode',
        key: 'stationCode',
        render: (text, record) => {
          return <span>{text ? text : ''}</span>
        }
      },
      {
        title: '站点名称',
        dataIndex: 'stationName',
        key: 'stationName',
        render: (text, record) => {
          return <span >{text ? text : ''}</span>
        }
      },
      {
        title: '所属线路',
        dataIndex: 'lineName',
        key: 'lineName',
        render: (text, record) => {
          return <span >{text ? text : ''}</span>
        }
      },
      {
        title: '操作',
        dataIndex: 'x',
        width: '10%',
        render: (text, record, index) => {
          return <div>
            <Button shape='circle' icon="arrow-up" disabled={index == 0 ? true : false} style={{ marginLeft: 10, marginRight: 10 }} onClick={this.bubbleSort.bind(this, index, 'up')}></Button>
            <Button shape='circle' icon="arrow-down" disabled={index == this.state.total - 1 ? true : false} onClick={this.bubbleSort.bind(this, index, 'down')}></Button>
          </div>
        }
      },
    ];
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
                <span className={style.tipSpan}><b>线路：</b>{record.lineName ? record.lineName : ''}</span>
              </div>
              <div>
                {permission.indexOf('LINEMANAGE_TURNING') !== -1 &&
                  <Button type="primary" icon="check" size='small' style={{ marginRight: 10 }} onClick={this.handleSubmit} >保存</Button>}
              </div>
            </div>
            <div style={{ height: height + 30, overflow: 'auto' }}>
              <Table
                rowKey={record => record.id}
                // rowClassName={this.setClassName}
                bordered
                size="small"
                dataSource={dataSource}
                columns={columns}
                pagination={false}
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
})(Info);