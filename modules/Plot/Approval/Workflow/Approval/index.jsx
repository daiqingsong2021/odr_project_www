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
import {prepaReleaseList } from "../../../../../api/api";

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

    initDatas =()=>{
      axios.get(prepaReleaseList).then(res=>{
        this.setState({
          data:res.data.data,
          initData:res.data.data
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
        const {initData} = this.state;
        let newData = dataUtil.search(initData,[{"key":"paName|paCode","value":text}],true);
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
              title: intl.get('wsd.i18n.plan.feedback.name'),
              dataIndex: 'paName',
              width:'200px',
              key: 'paName',
              render: (text, record) => dataUtil.getIconCell(record.nodeType,text,record.taskType)
          },
          {
              title: intl.get('wsd.i18n.pre.project1.projectcode'),
              dataIndex: 'paCode',
              key: 'paCode'
          },
          {
              title: intl.get("wsd.i18n.pre.proreview.epsname"),
              dataIndex: 'epsName',
              key: 'epsName',
          },
          {
              title: intl.get('wsd.i18n.pre.proreview.iptname'),
              dataIndex: 'org',
              key: 'org',
              render: data => data && data.name
          },
          {
              title: intl.get('wsd.i18n.pre.proreview.username'),
              dataIndex: 'user',
              key: 'user',
              render: data => data && data.name
          },
          {
              title: intl.get('wsd.i18n.operate.prepared.planstarttime'),
              dataIndex: 'planStartTime',
              key: 'planStartTime',
              render: (text) =>  dataUtil.Dates().formatDateString(text)
          },
          {
              title: intl.get('wsd.i18n.operate.prepared.planendtime'),
              dataIndex: 'planEndTime',
              key: 'planEndTime',
              render: (text) =>  dataUtil.Dates().formatDateString(text)
          },
          {
              title: intl.get("wsd.i18n.pre.project1.totalBudget"),
              dataIndex: 'totalBudget',
              key: 'totalBudget',
          },
          {
              title: intl.get('wsd.i18n.pre.proreview.creator'),
              dataIndex: 'creator',
              key: 'creator',
              render: data => data && data.name
          },
          {
              title: intl.get('wsd.i18n.pre.proreview.creattime'),
              dataIndex: 'creatTime',
              key: 'creatTime',
              render: (text) =>  dataUtil.Dates().formatDateString(text)
          }
      ];
        let { selectedRowKeys } = this.state;
        const rowSelection = {
          selectedRowKeys,
          onChange: (selectedRowKeys,selectedRow) => {
            this.setState({
              selectedRowKeys
            });
            let selectedItems = new Array();
            if(selectedRow){
              for(let i = 0, len = selectedRow.length; i < len; i++){
                let item =   selectedRow[i];
                selectedItems.push({"bizId" : item.id, "bizType": "prepa"});
              }
            }
            this.props.getSubmitData(selectedItems);
          },
          getCheckboxProps: record => ({
            //disabled: record.type != "project"
          })
        };

        let display = this.props.visible ? "" : "none";
        return (
            <div style = {{display:display}}>
              <div className={style.tableMain}>
                <div className={style.search}>
                  <Search search = {this.search } />
                </div>
                <Table rowKey={record => record.id}
                       defaultExpandAllRows={true}
                       pagination={false}
                       name={this.props.name}
                       columns={columns}
                       scroll={{x:1300}}
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

const  DelvApporal = connect(mapStateToProps, null)(PlanPreparedReleases);
export default WorkFolw.StartWorkFlow(DelvApporal);
