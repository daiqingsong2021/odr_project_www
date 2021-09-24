import React, { Component } from 'react'
import style from './style.less'
import { Modal, Table ,Button, notification} from 'antd';
import Search from '../../../../../../components/public/Search'
import { getReleaseMeetingList,updateReleaseMeetingList} from '../../../../../../api/api'
import {getPeopleEntryList} from '../../../../api/suzhou-api';
import axios from '../../../../../../api/axios'
import { connect } from 'react-redux'
import * as dataUtil from "../../../../../../utils/dataUtil"
export class PlanPreparedRelease extends Component {
    constructor(props) {
        super(props)
        this.state = {
          
            data: [],
            activeIndex:[],
            rightData:[]
        }
    }

    componentDidMount() {
       
       this.getList()
    }
    getList=()=>{
        const {projectId,sectionId,type,peoEntryType,status,startTime,endTime} = this.props;
        axios.get(getPeopleEntryList(1000,1)+`?projectId=${projectId}&sectionIds=${sectionId}&type=${type}&peoEntryType=${peoEntryType}&status=INIT&startTime=${startTime}&endTime=${endTime}`).then(res=>{
            this.setState({
                data:res.data.data
            })
        })
    }
    search=(value)=>{
        if(value!="" && !value.trim()){
            return
        }
        this.setState({
            title:value
        },()=>{
            this.getList()
        })
    }
    handleOk=()=>{
        const {activeIndex}=this.state
        if(activeIndex.length==0){
            notification.warning(
                {
                    placement: 'bottomRight',
                    bottom: 50,
                    duration: 1,
                    message: '警告',
                    description: '没有勾选数据！'
                }
            )
            return
        }
        let url = dataUtil.spliceUrlParams(updateReleaseMeetingList,{"startContent": "项目【"+ this.props.projectName +"】"});
        axios.put(url,activeIndex,true,null,true).then(res=>{
            this.setState({
                activeIndex:[],
                rightData:[]
            })
            this.props.handleCancel()
            this.props.reflesh()
        })
    }

   
    setClassName = (record, index) => {
        // 判断索引相等时添加行的高亮样式
         //判断索引相等时添加行的高亮样式
         if (this.state.activeIndex.findIndex(value => record.id === value) > -1) {
          return 'tableActivty'
        } else {
          return "";
        }
    
      };
    
   

    render() {
        const { intl } = this.props.currentLocale
        const columns= [
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
            }
        ]
        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
               
                this.setState({
                  activeIndex:selectedRowKeys,
                  rightData:selectedRows,
                })
              },
        };
        return (
            <Modal className={style.main} width="850px"  centered={true} visible={true}
                title={'发布人员进退场'}
                mask={false}
                maskClosable={false}
                 onOk={this.handleOk} onCancel={this.props.handleCancel} bodyStyle={{ padding: 0 }}
                 footer={ 
                    <div className="modalbtn">
                    <Button key={2}  onClick={this.handleCancel} >{intl.get("wsd.global.btn.cancel")}</Button>
                    <Button key={3} onClick={this.handleOk} type="primary">{intl.get("wsd.global.btn.sure")}</Button>
                    </div>
                }>
                <div className={style.tableMain}>
                    <div className={style.search}>
                        <Search search={this.search}/>
                    </div>
                    <Table 
                        rowKey={record => record.id} 
                        defaultExpandAllRows={true} 
                        pagination={false} 
                        rowClassName={this.setClassName} 
                        columns={columns} 
                        rowSelection={rowSelection} 
                        dataSource={this.state.data} 
                        size="small"
                      onRow={(record, index) => {
                        return {
                          onClick: (event) => {
                            event.currentTarget.getElementsByClassName("ant-checkbox-wrapper")[0].click()
                          
                          },
                        };
                      }
                      } />
                </div>
            </Modal>
        )
    }
}

const mapStateToProps = state => {
    return {
        currentLocale: state.localeProviderData,
    }
};


export default connect(mapStateToProps, null)(PlanPreparedRelease);