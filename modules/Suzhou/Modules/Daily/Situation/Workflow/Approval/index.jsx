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
import {queryFlowTrafficMainList} from '../../../../../api/suzhou-api';
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
      const {projectId,sectionId,searcher} = this.props;
        axios.get(queryFlowTrafficMainList+`?status=INIT`).then(res=>{
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
          {
              title: "序号",
              align:'center',
              render: (text, record, index) => index + 1
          },
          {
              title: '日期',
              dataIndex: 'recordTime',
              key: 'recordTime',
              align:'center',
              render: (text, record) => {
                  return <span>{text}</span>
              }
          },
          {
              title: '本日客运量(人次)',
              dataIndex: 'trafficVolumeToday',
              key: 'trafficVolumeToday',
              align:'center',
              render: (text, record) => {
                  return <span className={style.tdRight}>{text.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>
              }
          },
          {
              title: '月累计客运量(万人次)',
              dataIndex: 'trafficVolumeMonth',
              key: 'trafficVolumeMonth',
              align:'center',
              render: (text, record) => {
                  return <span className={style.tdRight}>{text.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>
              }
          },
          {
              title: '本月日均客运量(万人次)',
              dataIndex: 'trafficVolumeMonthAverage',
              key: 'trafficVolumeMonthAverage',
              align:'center',
              render: (text, record) => {
                  return <span className={style.tdRight}>{text.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>
              }
          },
          {
              title: '年累计客运量(万人次)',
              dataIndex: 'trafficVolumeYear',
              key: 'trafficVolumeYear',
              align:'center',
              render: (text, record) => {
                  return <span className={style.tdRight}>{text.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>
              }
          },
          {
              title: '年累计日均客运量(万人次)',
              dataIndex: 'trafficVolumeYearAverage',
              key: 'trafficVolumeYearAverage',
              align:'center',
              render: (text, record) => {
                  return <span className={style.tdRight}>{text.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>
              }
          },
          {
              title: '上报人',
              dataIndex: 'reportMan',
              key: 'reportMan',
              align:'center',
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
