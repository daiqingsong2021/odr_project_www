import React, { Component } from 'react'
import style from './style.less'
import { Table, Form } from 'antd';
// import Search from '../../../../../components/Search'
import { connect } from 'react-redux'
import '../../../../../../../asserts/antd-custom.less'
import axios from "../../../../../../../api/axios"
import * as WorkFolw from '../../../../../../Components/Workflow/Start';
import * as dataUtil from "../../../../../../../utils/dataUtil";
import MyIcon from "../../../../../../../components/public/TopTags/MyIcon";
import {getReleaseMeetingList } from "../../../../../../../api/api";
import {getFlowHolidayList} from '../../../../../api/suzhou-api';
import Search from '../../../../../components/Search';
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
      const {projectId,sectionId,searcher,parentData} = this.props;
        // axios.get(getFlowHolidayList+`?projectId=${projectId}&sectionIds=${sectionId}&searcher=${searcher}&status=INIT`).then(res=>{
        //     this.setState({
        //         data:res.data.data,
        //         initData:res.data.data
        //     })
        // })
        this.setState({
          data:[parentData],
          initData:[parentData]
        })
        this.getInfo(parentData);
        if(parentData){
          const newArr = [];
          newArr.push({"bizId" : parentData.id, "bizType":this.props.bizType});
          this.props.getSubmitData(newArr);
        }
    }
    getInfo = (record) => {
      console.log(record);
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
        let newData = dataUtil.search(initData,[{"key":"peopleName","value":text}],true);
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
            title:"标段名称",
            dataIndex: 'sectionName',
            key: 'sectionName',
          },
          {
              title: '请假人员',
              dataIndex: 'peopleName',
              key: 'peopleName',
          },
          {
              title:'开始时间',
              dataIndex: 'startTime',
              key: 'startTime',
              render:(text,record)=>{
                  return <span>{dataUtil.Dates().formatTimeString(text).substr(0,10)}</span>
              }
          },
          {
              title: '结束时间',
              dataIndex: 'endTime',
              key: 'endTime',
              render:(text,record)=>{
                  return <span>{dataUtil.Dates().formatTimeString(text).substr(0,10)}</span>
              }
          },
          {
              title: '天数',
              dataIndex: 'days',
              key: 'days',
          },
          {
              title: '请假原因',
              dataIndex: 'reason',
              key: 'reason',
          },
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
                selectedItems.push({"bizId" : item.id, "bizType":this.props.bizType});
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
            <div style = {{display:display}}>
              <div className={style.tableMain}>
                <div className={style.search} style={{'marginTop':'10px','marginBottom':'10px'}}>
                  <Search search = {this.search } placeholder={'请假人员'} />
                </div>
                <Table rowKey={record => record.id}
                       defaultExpandAllRows={true}
                       pagination={false}
                       name={this.props.name}
                       columns={columns}
                      //  rowSelection={rowSelection}
                      rowClassName={this.setClassName}
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
