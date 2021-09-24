import React, { Component } from 'react'
import style from './style.less'
import { Table, Form } from 'antd';
import Search from '../../../../../components/public/Search'
import { connect } from 'react-redux'
import '../../../../../asserts/antd-custom.less'
import axios from "../../../../../api/axios"
import * as WorkFolw from '../../../../Components/Workflow/Start';
import * as dataUtil from "../../../../../utils/dataUtil";
import MyIcon from "../../../../../components/public/TopTags/MyIcon";
import { questionReleaseList } from "../../../../../api/suzhou-api";

class PlanPreparedRelease extends Component {

  constructor(props) {
    super(props);
    this.state = {
      initDone: false,
      step: 1,
      columns: [],
      data: [],
      info: {},
      selectedRowKeys: [],
      currentData: [],
      activeIndex: []
    }
  }

  initDatas = () => {
    let data ={}
    axios.post(questionReleaseList(this.props.projectId),data).then(res => {
      this.setState({
        data: res.data.data,
        initData: res.data.data
      })
    })
  }

  getInfo = (record) => {
    this.setState({
      activeIndex: record.id
    })
  }

  setClassName = (record) => {
    //判断索引相等时添加行的高亮样式
    return record.id === this.state.activeIndex ? 'tableActivty' : "";
  }

  componentDidMount() {
    // 初始化数据
    this.initDatas();
  }
  // 查询
  search = (text) => {
    const { initData } = this.state;
    let newData = dataUtil.search(initData, [{ "key": "title", "value": text }], true);
    this.setState({
      data: newData
    });
  }

  getSubmitData = () => {

  }

  render() {
    const { intl } = this.props.currentLocale;
    const columns = [
      {
        title: intl.get('wsd.i18n.comu.question.title'),
        dataIndex: 'title',
        key: 'title',
      },
      {
        title: intl.get('wsd.i18n.comu.question.questiontype'),
        dataIndex: 'type',
        key: 'type',
        render: data => data && data.name
      },
      {
        title: intl.get("wsd.i18n.comu.question.questionpriority"),
        dataIndex: 'priority',
        key: 'priority',
        render: data => data && data.name
      },
      {
        title: intl.get("wsd.i18n.comu.question.username"),
        dataIndex: 'user',
        key: 'user',
        render: data => data && data.name
      },
      {
        title: intl.get('wsd.i18n.comu.question.questionremark'),
        dataIndex: 'remark',
        key: 'remark'
      },
      {
        title: intl.get('wsd.i18n.comu.question.questionhandle'),
        dataIndex: 'handle',
        key: 'handle'
      },
      {
        title: intl.get('wsd.i18n.comu.question.handletime'),
        dataIndex: 'handleTime',
        key: 'handleTime',
        render: (text) => dataUtil.Dates().formatDateString(text)
      },
      {
        title: "提出人",
        dataIndex: 'creator',
        key: 'creator',
        render: data => data && data.name
      },
      {
        title: intl.get('wsd.i18n.comu.question.creattime'),
        dataIndex: 'creatTime',
        key: 'creatTime',
        render: (text) => dataUtil.Dates().formatDateString(text)
      }
    ];
    let { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: (selectedRowKeys, selectedRow) => {
        this.setState({
          selectedRowKeys
        });
        let selectedItems = new Array();
        if (selectedRow) {
          for (let i = 0, len = selectedRow.length; i < len; i++) {
            let item = selectedRow[i];
            selectedItems.push({ "bizId": item.id, "bizType": "question" });
          }
        }
        this.props.getSubmitData(selectedItems);
      },
      getCheckboxProps: record => ({
        //disabled: record.type != "delv"
      })
    };

    let display = this.props.visible ? "" : "none";
    return (
      <div style={{ display: display }}>
        <div className={style.tableMain}>
          <div className={style.search}>
            <Search search={this.search} />
          </div>
          <Table rowKey={record => record.id}
            defaultExpandAllRows={true}
            pagination={false}
            name={this.props.name}
            columns={columns}
            rowSelection={rowSelection}
            dataSource={this.state.data}
            size="small"
            onRow={(record, index) => {
              return {
                onClick: () => {
                  this.getInfo(record, index)
                },
                onDoubleClick: (event) => {
                  event.currentTarget.getElementsByClassName("ant-checkbox-wrapper")[0].click();
                }
              }
            }
            }
          />
        </div>
      </div>
    )
  }
}

const PlanPreparedReleases = Form.create()(PlanPreparedRelease)

const mapStateToProps = state => {
  return {
    currentLocale: state.localeProviderData,
  }
};

const DelvApporal = connect(mapStateToProps, null)(PlanPreparedReleases);
export default WorkFolw.StartWorkFlow(DelvApporal);
