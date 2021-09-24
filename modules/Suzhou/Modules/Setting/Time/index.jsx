import React, { Component } from 'react';
import { Table, notification } from 'antd';
import style from './style.less';
import { connect } from 'react-redux';
import { changeLocaleProvider } from '@/store/localeProvider/action';
import RightTags from '@/components/public/RightTags/index';
import * as util from '@/utils/util';
import * as dataUtil from '@/utils/dataUtil';
import Release from '@/modules/Components/Release';
import TipModal from '@/modules/Components/TipModal';
import { getTimeTaskList } from '@/modules/Suzhou/api/suzhou-api';
import axios from '@/api/axios';
import MyIcon from '@/components/public/TopTags/MyIcon';
import TopTags from './TopTags/index';
class Time extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rightTags: [],
      activeIndex: '',
      selectedRowKeys: [],
      pageSize: 10,
      currentPageNum: 1,
      total: '',
      stopTopBtnFlag: true,
      restoreTopBtnFlag: true,
      selectedRows: [],
      selectedRowKeys: [],
      data: [],
    };
  }
  getInfo = record => {
    const { activeIndex } = this.state;
    const { id } = record;
    this.setState({
      activeIndex: id,
      record: record,
      rightData: record,
    });
    if (record.jobStatus == '0') {
      this.setState({
        stopTopBtnFlag: false,
        restoreTopBtnFlag: true,
      });
    } else if (record.jobStatus == '1') {
      this.setState({
        stopTopBtnFlag: true,
        restoreTopBtnFlag: false,
      });
    }
  };
  getList = () => {
    axios.get(getTimeTaskList(this.state.pageSize, this.state.currentPageNum)).then(res => {
      const dataMap = util.dataMap(res.data.data);
      var maps = new Object();
      // this.getMaps(res.data,maps);
      this.setState({
        data: res.data.data,
        dataMap: dataMap,
        total: res.data.total,
        // itemMaps:maps
      });
    });
  };
  getMaps = (dats, maps) => {
    if (dats) {
      dats.forEach((item, index, arr) => {
        maps[item.id] = item;
        this.getMaps(item.children, maps);
      });
    }
  };
  componentDidMount() {
    this.getList();
  }
  //设置table的选中行class样式
  setClassName = (record, index) => {
    return record.id === this.state.activeIndex ? 'tableActivty' : '';
  };
  // 新增回调
  addSuccess = (values, type) => {
    this.setState({
      currentPageNum:1
    },()=>{
      this.getList();
    })
  };
  //修改回调
  updateModify = data => {
    let index = this.state.data.findIndex(v => {
      return v.id == data.id;
    });
    this.setState((preState, props) => ({
      data: [...preState.data.slice(0, index), data, ...preState.data.slice(index + 1)],
      record: data,
    }));
  };
  // 删除回调
  delSuccess = data => {
    data.map(item => {
      let index = data.findIndex(v => v.id == item);
      data.splice(index, 1);
    });
    this.setState({
      data,
      selectedRowKeys: [],
    });
    const { total, selectedRows, pageSize, currentPageNum, selectedRowKeys } = this.state;
    let totalPageNum = Math.ceil((total - selectedRows.length) / pageSize); //计算总页数
    let PageNum = totalPageNum >= currentPageNum ? currentPageNum : totalPageNum; //总页数大于等于 当前页面，当前页数不变 否则 为1
    this.setState(
      {
        selectedRowKeys: [],
        selectedRows: [],
        currentPageNum: PageNum,
      },
      () => {
        this.getList();
      }
    );
  };
  //恢复返回
  updateRestore = data => {
    let index = this.state.data.findIndex(v => v.id == data.id);
    this.setState((preState, props) => ({
      data: [...preState.data.slice(0, index), data, ...preState.data.slice(index + 1)],
    }));
    this.getInfo(data);
  };
  // 搜索
  search = val => {
    this.setState({
      currentPageNum:1
    },()=>{
      axios
      .get(getTimeTaskList(this.state.pageSize, this.state.currentPageNum) + `?searcher=${val}`)
      .then(res => {
        const dataMap = util.dataMap(res.data.data);
        var maps = new Object();
        // this.getMaps(res.data,maps);
        this.setState({
          data: res.data.data,
          dataMap: dataMap,
          total: res.data.total,
          // itemMaps:maps
        });
      });
    })
  };
  render() {
    const { data, rightTags, itemMaps } = this.state;
    const { height, record } = this.props;
    const { intl } = this.props.currentLocale;
    const columns = [
      {
        title: '任务名称',
        dataIndex: 'jobName',
        key: 'jobName',
      },
      {
        title: '任务分组',
        dataIndex: 'jobGroup',
        key: 'jobGroup',
      },
      {
        title: '任务描述',
        dataIndex: 'description',
        key: 'description',
      },
      {
        title: '执行类',
        dataIndex: 'beanClass',
        key: 'beanClass',
      },
      {
        title: 'cron表达式',
        dataIndex: 'cronExpression',
        key: 'cronExpression',
      },
      {
        title: '初始参数',
        dataIndex: 'arguments',
        key: 'arguments',
      },
      {
        title: '任务状态',
        dataIndex: 'jobStatus',
        key: 'jobStatus',
        render: (text, record) => {
          return text == '0' ? <span>已停止</span> : <span>运行中</span>;
        },
      },
    ];
    let { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({
          selectedRowKeys,
          selectedRows,
        });
      },
    };
    let pagination = {
      total: this.state.total,
      // hideOnSinglePage: true,
      current: this.state.currentPageNum,
      pageSize: this.state.pageSize,
      showSizeChanger: true,
      size: 'small',
      showQuickJumper: true,
      showTotal: total => `总共${this.state.total}条`,
      onShowSizeChange: (current, size) => {
        this.setState(
          {
            pageSize: size,
            currentPageNum: 1,
          },
          () => {
            this.getList();
          }
        );
      },
      onChange: (page, pageSize) => {
        this.setState(
          {
            currentPageNum: page,
          },
          () => {
            this.getList();
          }
        );
      },
    };
    return (
      <div>
        <TopTags
          record={this.state.record}
          selectedRows={this.state.selectedRows}
          success={this.addSuccess}
          updateModify={this.updateModify}
          delSuccess={this.delSuccess}
          updateRestore={this.updateRestore}
          updateStop={this.updateStop}
          stopTopBtnFlag={this.state.stopTopBtnFlag}
          restoreTopBtnFlag={this.state.restoreTopBtnFlag}
          setClassName={this.setClassName}
          search={this.search}
        />
        <div className={style.main}>
          <div className={style.leftMain} style={{ height: this.props.height }}>
            <div style={{ minWidth: 'calc(100vw - 60px)' }}>
              <Table
                size="small"
                pagination={pagination}
                columns={columns}
                rowKey={record => record.id}
                name={this.props.name}
                dataSource={data}
                rowSelection={rowSelection}
                rowClassName={this.setClassName}
                onRow={(record, index) => {
                  return {
                    onClick: event => {
                      this.getInfo(record, event);
                    },
                  };
                }}
              />
            </div>
          </div>
          {/* <div className={style.rightBox} style={{ height }}>
                        <RightTags
                        rightTagList={rightTags}
                        rightData={this.state.rightData}
                        updateSuccess={this.updateSuccess}
                        menuCode = {this.props.menuInfo.menuCode}
                        groupCode={1}
                        />
                    </div> */}
        </div>
      </div>
    );
  }
}
export default connect(
  state => ({
    currentLocale: state.localeProviderData,
  }),
  {
    changeLocaleProvider,
  }
)(Time);
