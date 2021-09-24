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
import {getDelvEditTree } from "../../../../../api/api";

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
      axios.get(getDelvEditTree(this.props.projectId)).then(res=>{
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
        let newData = dataUtil.search(initData,[{"key":"delvTitle|delvCode","value":text}],true);
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
            title: intl.get('wsd.i18n.pre.project1.projectname'),
            dataIndex: 'delvTitle',
            key: 'delvTitle',
            render: (text, record) => {
              let icon = dataUtil.getIcon(record.type);
              return  <span><MyIcon type={icon} style={{ fontSize: '18px' ,verticalAlign:"middle"}}/> { text} </span>
            }
          },
          {
            title: intl.get('wsd.i18n.pre.project1.projectcode'),
            dataIndex: 'delvCode',
            key: 'delvCode'
          },
          {
            title: intl.get("wsd.i18n.plan.delvList.delvtype"),
            dataIndex: 'type',
            key: 'type',
            render: text => text == 'pbs' ? "PBS" : text == 'delv' ? "交付物":null
          },
          {
            title: "交付物类别",
            dataIndex: 'delvTypeVo',
            key: 'delvTypeVo',
            render: (text, record) => {
              let ret = text && record.type === "delv" ? text.name : "";
              return ret;
            }
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
                selectedItems.push({"bizId" : item.id, "bizType": "delv"});
              }
            }
            this.props.getSubmitData(selectedItems);
          },
          getCheckboxProps: record => ({
            disabled: record.type != "delv"
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
