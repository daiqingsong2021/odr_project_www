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
import {constructionDailyListNoPage} from '../../../../../api/suzhou-api';
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
      // const {projectId,sectionId,searcher} = this.props;
        axios.get(constructionDailyListNoPage+`?reviewStatus=INIT`).then(res=>{
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
        let newData = dataUtil.search(initData,[{"key":"recordTime","value":text}],true);
        this.setState({
          data: newData
        });
    }
    getSubmitData = () => {

    }
    render() {
        const { intl } = this.props.currentLocale;
        const columns = [
        //   {
        //       title: "序号",
        //       render: (text, record, index) => index + 1
        //   },
          {
              title: '日期',
              dataIndex: 'recordTime',
              key: 'recordTime',
          },
          {
              title: '线路',
              dataIndex: 'lineName',
              key: 'lineName',
          },
          {
              title: '周计划',
              dataIndex: 'weeklyPlanConstructionQuantity',
              key: 'weeklyPlanConstructionQuantity',
              render:(text,record)=>{
                  return <span>{record.weeklyActualConstructionQuantity}/{record.weeklyPlanConstructionQuantity}</span>
              }
          },
          {
              title: '日补充',
              dataIndex: 'dailyPlanConstructionQuantity',
              key: 'dailyPlanConstructionQuantity',
              render:(text,record)=>{
                  return <span>{record.dailyActualConstructionQuantity}/{record.dailyPlanConstructionQuantity}</span>
              }
          },
          {
              title: '临补充',
              dataIndex: 'tempPlanConstructionQuantity',
              key: 'tempPlanConstructionQuantity',
              render:(text,record)=>{
                  return <span>{record.tempActualConstructionQuantity}/{record.tempPlanConstructionQuantity}</span>
              }
          },
          {
              title: '抢修施工',
              dataIndex: 'repairPlanConstructionQuantity',
              key: 'repairPlanConstructionQuantity',
              render:(text,record)=>{
                  return <span>{record.repairActualConstructionQuantity}/{record.repairPlanConstructionQuantity}</span>
              }
          },
          {
              title: '计划总数',
              dataIndex: 'totalPlanConstructionQuantity',
              key: 'totalPlanConstructionQuantity',
          },
          {
              title: '完成总数',
              dataIndex: 'totalActualConstructionQuantity',
              key: 'totalActualConstructionQuantity',
          },
          {
              title: '情况说明',
              dataIndex: 'description',
              key: 'description',
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
                selectedItems.push({"bizId" : item.id, "bizType":this.props.bizType,origData:item});
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
                  <Search search = {this.search } placeholder={'日期'} />
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
