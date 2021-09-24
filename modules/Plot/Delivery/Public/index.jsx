import React, { Component } from 'react'
import style from './style.less'
import { Modal, Table ,Button, notification} from 'antd';

import Search from '../../../../components/public/Search'
import SubmitButton from "../../../../components/public/TopTags/SubmitButton"
import {deletePlanDelv, getDelvEditTree, updateDelvpublic} from '../../../../api/api'
import axios from '../../../../api/axios'
import { connect } from 'react-redux'
import MyIcon from "../../../../components/public/TopTags/MyIcon"
import * as dataUtil from '../../../../utils/dataUtil';
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
        axios.get(getDelvEditTree(this.props.projectId)).then(res=>{
            this.setState({
                data:res.data.data,
                initData:res.data.data,
            })
        })
    }
    search=(value)=>{
        const { initData } = this.state;
        let newData = dataUtil.search(initData, [{ "key": "delvTitle|delvCode", "value": value }], true);
        this.setState({ data: newData });
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

        let url = dataUtil.spliceUrlParams(updateDelvpublic,{"startContent":"项目【"+this.props.projectName+"】"});
        axios.put(url,activeIndex,true,null,true).then(res=>{
            this.setState({
                activeIndex:[],
                rightData:[]
            })
            this.props.handleCancel()
            this.props.refresh()
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
                title: intl.get('wsd.i18n.pre.project1.projectname'),
                dataIndex: 'delvTitle',
                key: 'delvTitle',
                render: (text, record) => {
                    return (
                        record.type == "pbs" ? (
                            <span> <MyIcon type='icon-PBS' /> {text} </span>
                        ) : (
                                <span> <MyIcon type='icon-jiaofuwu1' /> {text} </span>
                            )
                    )
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
                render: text => text == 'pbs' ? "PBS" : "交付物"
            },
            {
                title: "交付物类别",
                dataIndex: 'delvTypeVo',
                key: 'delvTypeVo',
                render: (text, record) => {
                    let ret = text && record.type === "delv" ? text.name : "";
                    return ret;
                }
            },
        ]
        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
               
                this.setState({
                  activeIndex:selectedRowKeys,
                  rightData:selectedRows,
                })
              },
              getCheckboxProps: record => ({
                disabled: record.type==null ||  record.type=="pbs", // Column configuration not to be checked
               
              }),
        };
        return (
            <Modal className={style.main} width="850px"  centered={true} visible={true}
                title={intl.get("wsd.i18n.comu.profdback.directrelease")}
                mask={false}
                maskClosable={false}
                 onOk={this.handleOk} onCancel={this.props.handleCancel} bodyStyle={{ padding: 0 }}
                 footer={ 
                    <div className="modalbtn">
                    <SubmitButton key={2}  onClick={this.props.handleCancel} content={intl.get("wsd.global.btn.cancel")} />
                    <SubmitButton key={3} onClick={this.handleOk} type="primary" content={intl.get("wsd.global.btn.sure")} />
                    </div>
                }>
                <div className={style.tableMain}>
                    <div className={style.search}>
                        <Search search={this.search}/>
                    </div>
                    <Table rowKey={record => record.id} defaultExpandAllRows={true} pagination={false} rowClassName={this.setClassName} columns={columns} rowSelection={rowSelection} dataSource={this.state.data} size="small"
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
