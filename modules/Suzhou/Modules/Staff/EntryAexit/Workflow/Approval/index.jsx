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
import {getPeopleEntryList,getFlowPeopleEntryList} from '../../../../../api/suzhou-api';
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
      const {projectId,sectionId,type,peoEntryType,status,startTime,endTime,parentData} = this.props;
        // axios.get(getFlowPeopleEntryList+`?projectId=${projectId}&sectionIds=${sectionId}&type=${type}&peoEntryType=${peoEntryType}&status=INIT&startTime=${startTime}&endTime=${endTime}`).then(res=>{
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
        initData.map((item,i)=>{
          item.myType = item.typeVo.name
        })
        let newData = dataUtil.search(initData,[{"key":"code|myType","value":text}],true);
        this.setState({
          data: newData
        });
    }

    getSubmitData = () => {

    }
    setClassName = (record) => {
      //判断索引相等时添加行的高亮样式
      return record.id === this.state.activeIndex ? 'tableActivty' : "";
    }
    render() {
        const { intl } = this.props.currentLocale;
        const columns = [
          {
              title: '编号',
              dataIndex: 'code',
              key: 'code',
          },
          {
              title:'标段名称',
              dataIndex: 'sectionName',
              key: 'sectionName',
          },
          {
              title:'类别',
              dataIndex: 'typeVo.name',
              key: 'typeVo.name',
          },
          {
              title: '单位名称',
              dataIndex: 'orgName',
              key: 'orgName',
          },
          {
              title: '人数',
              dataIndex: 'peoNums',
              key: 'peoNums',
          },
          {
            title:'人员类型',
            dataIndex: 'peoEntryTypeVo.name',
            key: 'peoEntryTypeVo.name',
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
                selectedItems.push({"bizId" : item.id, "bizType": 'STAFF-ENTRYAEXIT'});
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
                <div className={style.search}>
                  <Search search = {this.search } placeholder={'编号/类别'} />
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
