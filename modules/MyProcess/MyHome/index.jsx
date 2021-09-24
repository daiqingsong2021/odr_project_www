import React, {Component} from 'react'
import {Table} from 'antd'
import style from './style.less'
import {connect} from 'react-redux'
import DealWithBtn from "../../../components/public/TopTags/DealWithBtn"
import SearchViewBtn from "../../../components/public/TopTags/SearchViewBtn"
import Search from "../../../components/public/Search"
import * as dataUtil from '../../../utils/dataUtil'
import {getMyUnfinishTaskList, getMyFinishTaskList, getMyMineTaskList} from "../../../api/api"
import axios from "../../../api/axios"
import PageTable from '../../../components/PublicTable';

export class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeKey: 1,
      data: [],
      total: 0,
      title: "",
    };
  }

  /**
   * 父组件即可调用子组件方法
   */
  onRef = (ref) => {
    const {activeKey} = this.state;
    if (activeKey == 1) {
      this.table1 = ref
    } else if (activeKey == 2) {
      this.table2 = ref
    } else if (activeKey == 3) {
      this.table3 = ref
    }
  }

  onChange = (activeKey) => {
    this.setState({
      activeKey, total: 0
    }, () => {
      if (activeKey == 1) {
        this.table1.getData();
      } else if (activeKey == 2) {
        this.table2.getData();
      } else if (activeKey == 3) {
        this.table3.getData();
      }
    })
  }

  search = (keyword) => {
    this.setState({
      keyword, total: 0
    }, () => {
      const {activeKey} = this.state
      if (activeKey == 1) {
        this.table1.getData();
      } else if (activeKey == 2) {
        this.table2.getData();
      } else if (activeKey == 3) {
        this.table3.getData();
      }
    })
  }

  onClickHandle = () => {
    const {rightData, activeKey} = this.state;
    if (!rightData) {
      dataUtil.message("请选择数据后操作");
      return;
    }
    if (activeKey == 3) {
      this.props.openWorkFlowMenu({taskId: 0, procInstId: rightData.id});
    } else {
      this.props.openWorkFlowMenu({taskId: rightData.id, procInstId: rightData.procInstId});
    }
  }

  getInfo = (record, index) => {
    this.setState({
      activeIndex: record.id,
      rightData: record
    })
  }

  componentWillReceiveProps(newProps) {
    if (newProps.activeKey == 1) {
      this.table1.getData();
    }
  }

  //获取我的待办
  getMyUnfinishTaskList = (currentPage, pageSize, callBack) => {
    //获取我的待办
    const {keyword} = this.state
    axios.post(getMyUnfinishTaskList(pageSize, currentPage), {keyword}).then(res => {
      callBack(res.data.data ? res.data.data : [])
      this.setState({
        data: res.data.data,
        total: res.data.total ? res.data.total : this.state.total
      })
    })
  }

  //获取我的已办
  getMyFinishTaskList = (currentPage, pageSize, callBack) => {
    //获取我的已办
    const {keyword} = this.state
    axios.post(getMyFinishTaskList(pageSize, currentPage), {keyword}).then(res => {
      callBack(res.data.data ? res.data.data : [])
      this.setState({
        data: res.data.data,
        total: res.data.total ? res.data.total : this.state.total
      })
    })
  }

  //获取我发起的
  getMyMineTaskList = (currentPage, pageSize, callBack) => {
    //获取我的发起
    const {keyword} = this.state
    axios.post(getMyMineTaskList(pageSize, currentPage), {keyword}).then(res => {
      callBack(res.data.data ? res.data.data : [])
      this.setState({
        data: res.data.data,
        total: res.data.total ? res.data.total : this.state.total
      })
    })
  }

  render() {
    const {intl} = this.props.currentLocale
    const columns = [
      {
        title: "名称",
        dataIndex: 'procInstName',
        key: 'procInstName',
        width: '30%',
      },
      {
        title: "流程发起人",
        dataIndex: 'startUser',
        key: 'startUser',
        width: '17%',
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
        title: "送审人",
        dataIndex: 'sender',
        key: 'sender',
        width: '17%',
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
        title: "当前节点",
        dataIndex: 'taskName',
        key: 'taskName',
        align: 'center',
        width: '16%',
      },
      {
        title: "开始时间",
        dataIndex: 'createTime',
        key: 'createTime',
        align: 'center',
        width: '20%',
      }
    ];

    const columns0 = [...columns, {
      title: intl.get('wbs.il8n.process.endtime'),
      dataIndex: 'endTime',
      key: 'endTime',
      align: 'center',
      width: '15%',
    },
    {
      title: "流程状态",
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      width: '10%',
    }]

    const columns1 = [
      {
        title: intl.get('wsd.i18n.sys.menu.menuname'),
        dataIndex: 'procInstName',
        key: 'procInstName',
        width: '30%',
      },
      {
        title: intl.get('wbs.il8n.process.starttime'),
        dataIndex: 'createTime',
        key: 'createTime',
        width: '15%',
        align: 'center',
      },
      {
        title: intl.get('wbs.il8n.process.endtime'),
        dataIndex: 'endTime',
        key: 'endTime',
        width: '15%',
        align: 'center',
      },
      {
        title: intl.get('wbs.il8n.process.originator'),
        dataIndex: 'startUser',
        key: 'startUser',
        width: '15%',
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
        title: "当前节点",
        dataIndex: 'taskName',
        key: 'taskName',
        width: '15%',
        align: 'center',
      },
      {
        title: "流程状态",
        dataIndex: 'status',
        key: 'status',
        align: 'center',
      },
    ];
    return (
      <div className={style.main} style={{height: this.props.height}}>
        <div className={style.back}>
          <section className={style.tabsList}>
            <p onClick={this.onChange.bind(this, 1)}><span className={this.state.activeKey == 1 ? "my-link" : null}>{intl.get("wbs.il8n.process.waitdo")}</span></p>
            <p onClick={this.onChange.bind(this, 2)}><span className={this.state.activeKey == 2 ? "my-link" : null}>{intl.get("wbs.il8n.process.hasdone")}</span></p>
            <p onClick={this.onChange.bind(this, 3)}><span className={this.state.activeKey == 3 ? "my-link" : null}>{intl.get("wbs.il8n.process.launch")}</span></p>
          </section>
          <div className={style.function}>
            {this.state.activeKey != 1 ? <SearchViewBtn onClickHandle={this.onClickHandle}/> : <DealWithBtn onClickHandle={this.onClickHandle}/>}
            <Search placeholder={"名称"} search={this.search}/>
          </div>
          <div>
            <div style={{minWidth: 'calc(100vw - 60px)'}}>
              {this.state.activeKey == 1 && (<PageTable onRef={this.onRef}
                                                        pagination={true}
                                                        getData={this.getMyUnfinishTaskList}
                                                        columns={columns}
                                                        rowSelection={true}
                                                        total={this.state.total}
                                                        scroll={{x: 1200, y: this.props.height - 200}}
                                                        getRowData={this.getInfo}/>
              )}
              {this.state.activeKey == 2 && (<PageTable onRef={this.onRef}
                                                        pagination={true}
                                                        getData={this.getMyFinishTaskList}
                                                        columns={columns0}
                                                        rowSelection={true}
                                                        total={this.state.total}
                                                        scroll={{x: 1200, y: this.props.height - 200}}
                                                        getRowData={this.getInfo}/>
              )}
              {this.state.activeKey == 3 && (<PageTable onRef={this.onRef}
                                                        pagination={true}
                                                        getData={this.getMyMineTaskList}
                                                        columns={columns1}
                                                        rowSelection={true}
                                                        total={this.state.total}
                                                        scroll={{x: 1200, y: this.props.height - 200}}
                                                        getRowData={this.getInfo}/>
              )}
            </div>
          </div>
        </div>
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

export default connect(mapStateToProps, null)(Index);
