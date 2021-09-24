import React, { Component } from 'react'
import style from './style.less'
import { Table, Form,Modal,Button } from 'antd';
import intl from 'react-intl-universal';
import { connect } from 'react-redux'
import '../../../../../../asserts/antd-custom.less'
import axios from "../../../../../../api/axios"
import * as dataUtil from "../../../../../../utils/dataUtil";
import MyIcon from "../../../../../../components/public/TopTags/MyIcon";
import {getReleaseMeetingList } from "../../../../../../api/api";
import {getFlowHolidayList,updateHolidayStatus} from '../../../../api/suzhou-api';
import Search from '../../../../components/Search';
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
        axios.get(getFlowHolidayList+`?projectId=${projectId}&sectionIds=${sectionId}&searcher=${searcher}&status=INIT`).then(res=>{
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
        let newData = dataUtil.search(initData,[{"key":"peopleName","value":text}],true);
        this.setState({
          data: newData
        });
    }
    getSubmitData = () => {

    }
    updateRelease = ()=>{
        const {selectedRowKeys,selectedRows} = this.state;
        if(selectedRowKeys.length > 0){
            axios.put(updateHolidayStatus,selectedRowKeys,true).then(res=>{
                if(res.data.status == 200){
                    this.props.updateReleaseModal();
                    this.props.handleCancel();
                }
            })
        }else{
            notification.warning(
                {
                  placement: 'bottomRight',
                  bottom: 50,
                  duration: 1,
                  message: '警告',
                  description: '请选择数据进行发布'
                }
              )
              return
        }
        
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
        let { selectedRowKeys,selectedRows} = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
              this.setState({
                selectedRowKeys,
                selectedRows
              })
            }
        };
        return (
            <div>
            <Modal
                width="850px"
                afterClose={this.props.form.resetFields}
                mask={false}
                maskClosable={false}
                centered={true} title={'直接发布'} visible={this.props.releaseModal}
                onOk = {this.updateRelease}
                onCancel={this.props.handleCancel}>
                <div className={style.tableMain}>
                    <div className={style.search} style={{'margigTop':'10px','marginBottom':'10px'}}>
                    <Search search = {this.search } placeholder={'请假人员'} />
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
              </Modal>
            </div>
        )
    }
}
const PlanPreparedReleases = Form.create()(PlanPreparedRelease);
export default connect(state => ({
  currentLocale: state.localeProviderData,
}))(PlanPreparedReleases);