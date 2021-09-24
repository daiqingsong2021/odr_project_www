import React, { Component } from 'react'
import style from './style.less'
import { Table, Radio } from 'antd'
import TopTags from './TopTags/index'
import RightTags from '../../../../components/public/RightTags/index'
import TreeTable from '../../../../components/PublicTable'
/* *********** 引入redux及redux方法 start ************* */
import { connect } from 'react-redux'
import { getTmpltaskTree, deleteTmpltask, deleteTmpltaskWbs, deleteTmpltaskTask } from "../../../../api/api"
import {getCalendarDefaultInfo}from '../../../../api/suzhou-api'
import axios from "../../../../api/axios"
import MyIcon from "../../../../components/public/TopTags/MyIcon"
import * as dataUtil from "../../../../utils/dataUtil"
import ExtLayout from "../../../../components/public/Layout/ExtLayout";
import MainContent from "../../../../components/public/Layout/MainContent";
import Toolbar from "../../../../components/public/Layout/Toolbar";
export class BasicdTemplated extends Component {
  constructor(props) {
    super(props)
    this.state = {
      initDone: false,
      columns: [],
      rightData: null,
      activeIndex: null,

      data: [],
      groupCode: 1,
    }
  }


  componentDidMount(){
   // this.getDefaultCalendarInfo()
  }

   getDefaultCalendarInfo(){
     axios.get(getCalendarDefaultInfo).then(res=>{
        this.setState({
          dayHrCnt:res.data.data ? res.data.data.dayHrCnt : ''
        })
     })
   }

  /**
   * 父组件即可调用子组件方法
   */
  onRef = (ref) => {
    this.table = ref
  }

  search = (value) => {
    const { data } = this.state
    let searchData = dataUtil.search(data, [{ "key": "taskName", "value": value }], true);
    this.setState({
      searchData
    }, () => {
      this.table.getData()
    })
  }

  getList = (callBack) => {
    const { searchData } = this.state
    if (searchData) {
      callBack(searchData)
      this.setState({ searchData: null })
    } else {
      axios.get(getTmpltaskTree).then(res => {
        callBack(res.data.data)
        if (res.data.data) {
          this.setState({
            data: res.data.data,
          })
        }
      })
    }
  }

  //新增
  addData = (value, type) => {
    const { data, rightData } = this.state;
    if (type == "tmpl") {
      value.taskName = value.tmplName
      this.table.add(null, value)
      this.setState({
        data,
      });
      return
    }
    if (type == "wbs" || type == "task") {
      this.table.add(rightData, value)
      this.setState({
        data
      });
    }
  }

  //删除
  deleteData = () => {
    const { data, rightData } = this.state;
    if (rightData.type == "tmpl") {
      axios.deleted(deleteTmpltask(this.state.rightData.id), true, "删除成功").then(res => {
        this.table.deleted(rightData)
        this.setState({
          rightData: null,
        });
      })
    }
    if (rightData.type == "wbs") {
      axios.deleted(deleteTmpltaskWbs(this.state.rightData.id), true, "删除成功").then(res => {
        this.table.deleted(rightData)
        this.setState({
          rightData: null,
        });
      })
    }
    if (rightData.type == "task") {
      axios.deleted(deleteTmpltaskTask(this.state.rightData.id), true, "删除成功").then(res => {
        this.table.deleted(rightData)
        this.setState({
          rightData: null,
        });
      })
    }
  }

  //修改
  updateSuccess = (value) => {
    const { rightData } = this.state;
    if (value.type == "tmpl") {
      value.taskName = value.tmplName
    }
    this.table.update(rightData, value)
  }

  getRowData = (record) => {
    let id = record.id
    let type = record.type
    let groupCode = 1
    if (record.type == "wbs") {
      groupCode = 2
    } else if (record.type == "task") {
      groupCode = 3
    }
    this.setState({
      activeIndex: id + type,
      rightData: record,
      groupCode
    })
  };

  render() {
    const { intl } = this.props.currentLocale
    const columns = [
      {
        title: intl.get('wsd.i18n.base.planTem.name'),
        dataIndex: 'taskName',
        key: 'taskName',
        width: 400,
        render: (text, record) => {
          if (record.type == "tmpl") {
            return <span><MyIcon type="icon-xiangmu" style={{ fontSize: '18px', verticalAlign: "middle" }} />&nbsp;{text}</span>
          }
          else if (record.type == "wbs") {
            return <span><MyIcon type="icon-WBS" style={{ fontSize: '18px', verticalAlign: "middle" }} />&nbsp;{text}</span>
          }
          else if (record.type == "task") {
            // if (record.taskType.id == '2' || record.taskType.id == '3') {
            //   return <span><MyIcon type="icon-lichengbei" style={{ fontSize: '18px', verticalAlign: "middle" }} />&nbsp;{text}</span>
            // } else {
              return <span><MyIcon type="icon-renwu1" style={{ fontSize: '18px', verticalAlign: "middle" }} />&nbsp;{text}</span>
            //}
          } else {
            return
          }
        }
      },
      {
        title: intl.get('wsd.i18n.base.planTemAddWBS.code'),
        dataIndex: 'taskCode',
        key: 'taskCode',
        width: 200
      },
      {
        title: intl.get('wsd.i18n.plan.feedback.plandrtn'),
        dataIndex: 'planDrtn',
        key: 'planDrtn',
        width: 150,
        render: (text) => {
          if (text) {
            return <span>{text+'天'}</span>
          } else {
            return "--"
          }
        }
      },
      {
        title: intl.get('wsd.i18n.plan.plandefine.plantype'),
        dataIndex: 'planType',
        key: 'planType',
        width: 150,
        render: (text) => {
          if (text) {
            return <span>{text.name}</span>
          } else {
            return "--"
          }
        }
      },
      {
        title: intl.get('wsd.i18n.plan.feedback.planlevel'),
        dataIndex: 'planLevel',
        key: 'planLevel',
        width: 150,
        render: (text) => {
          if (text) {
            return <span>{text.name}</span>
          } else {
            return "--"
          }
        }
      }
    ];
    return (
      <ExtLayout renderWidth={({ contentWidth }) => { this.setState({ contentWidth }) }}>
        <Toolbar>
          <TopTags addData={this.addData} data={this.state.rightData} deleteData={this.deleteData} search={this.search} />
        </Toolbar>
        <MainContent contentWidth={this.state.contentWidth} contentMinWidth={1500}>
          <TreeTable
            onRef={this.onRef}
            getData={this.getList}
            pagination={false}
            columns={columns}
            getRowData={this.getRowData}
          />
        </MainContent>
        <RightTags
        
          rightData={this.state.rightData}
          updateSuccess={this.updateSuccess}
          bizType="tmplTask"
          bizId={this.state.rightData? this.state.rightData.id:null}
           menuCode={this.props.menuInfo.menuCode}
          groupCode={this.state.groupCode}
        />

      </ExtLayout>

    )
  }
}

const mapStateToProps = state => {
  return {
    currentLocale: state.localeProviderData,
  }
};
export default connect(mapStateToProps, null)(BasicdTemplated);
