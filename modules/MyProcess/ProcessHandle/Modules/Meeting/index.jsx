import React, { Component } from 'react'
import style from './style.less'
import { Table } from 'antd'
import StandardTable from '../../../../../components/public/Table'

import RightTags from '../../../../../components/public/RightTags'


import {getMeetingWf} from '../../../../../api/api'
import axios from '../../../../../api/axios'


/* *********** 引入redux及redux方法 start ************* */
import { connect } from 'react-redux'
export class ComcateMeeting extends Component {
    constructor(props) {
        super(props)
        this.state = {
         
            columns: [],
            date: new Date(),
            currentPage: 1,
            pageSize: 10,
            selectedDeleId:'',
            data: [],
            activeIndex: [],
            rightData: [],
            selectedRowKeys:[],
            rightTags: [
                { icon: 'iconjibenxinxi', title: '基本信息', fielUrl: 'Comcate/Meeting/MeetInfo' },
                { icon: 'iconwenjian', title: '文件信息', fielUrl: 'Components/FileInfo' },
                { icon: 'iconicon-1', title: '会议行动项', fielUrl: 'Comcate/Meeting/MeetAction' },
            
              
            ],
           

        }

       
    }
    componentDidMount(){
        this.getMeetingList()
    }
   
    setClassName = (record, index) => {
        // 判断索引相等时添加行的高亮样式
         //判断索引相等时添加行的高亮样式
         if (this.state.activeIndex.findIndex(value => record.id === value) > -1) {
          return 'tableActivty'
        } else {
          return ""
        }
    
      };
    
      getInfo = (record, index) => {
        let id = record.id
        let currentIndex = this.state.activeIndex.findIndex(item => item == id)
        /* *********** 点击表格row执行更新state start ************* */
        if (currentIndex > -1) {
          this.setState((preState, props) => ({
            activeIndex: [...preState.activeIndex.slice(0, currentIndex), ...preState.activeIndex.slice(currentIndex + 1)],
            rightData: [...preState.rightData.slice(0, currentIndex), ...preState.rightData.slice(currentIndex + 1)],
            selectedRowKeys:[...preState.activeIndex.slice(0, currentIndex), ...preState.activeIndex.slice(currentIndex + 1)],
          }))
        } else {
          this.setState({
            activeIndex: [id],
            rightData: [record],
            selectedRowKeys:[id]
          },()=>{
          })
        }
      };


    
    
    // 获取会议管理列表
    getMeetingList = ()=>{
      
        
        axios.get(getMeetingWf(this.props.projectId, this.state.pageSize,this.state.currentPage)).then((result) => {
            let data = result.data.data;
         
                this.setState({
                    data,
                    total:result.data.total
                })
            
        })
    }

    
    //新增
    addData=(value,id)=>{
      
        const {data,projectId}=this.state
        if(id!=projectId){
            return
        }
        data.push(value)
        this.setState({
            data
        })
    }
    //修改
    updateSuccess=(value)=>{
        const {data}=this.state
        let i =data.findIndex(item=>item.id==value.id)
        if(i>-1){
            data[i]=value
            this.setState({
                data
            })
        }
    }
    //删除
    deleteData=()=>{
        const {rightData,data,total,currentPage}=this.state
        let changecurrentPageNum=(this.state.data.length==this.state.rightData.length)&&this.state.currentPage>1&&Math.ceil(this.state.total / this.state.pageSize)==this.state.currentPage
        rightData.forEach(item=>{
            let i=data.findIndex(v=>v.id==item.id)
            if(i>-1){
                data.splice(i,1)
            }
        })
        if(changecurrentPageNum){
            this.setState({
                data,
                rightData:[],
                activeIndex:[],
                currentPage:currentPage-1
            },()=>{
                this.getMeetingList()
            })
        }
        this.setState({
            data,
            rightData:[],
            activeIndex:[],
            total:total-1
        })
    }
    render() {
        const { intl } = this.props.currentLocale
        const columns= [
            {
                title: intl.get('wsd.i18n.comu.meeting.title'),
                dataIndex: 'title',
                key: 'title',
            },

            {
                title: intl.get('wsd.i18n.comu.meeting.projectname'),
                dataIndex: 'project',
                key: 'project',
            },
            {
                title: intl.get('wsd.i18n.plan.plandefine.orgname'),
                dataIndex: 'org',
                key: 'org',
                render:text=>text? text.name : null
            },
            {
                title: intl.get('wsd.i18n.comu.meeting.meetingaddress'),
                dataIndex: 'meetingAddress',
                key: 'meetingAddress',
                render:text=>text? text.substr(0,10) : null
            },
            {
                title: intl.get('wsd.i18n.comu.meeting.meettime'),
                dataIndex: 'meetingTime',
                key: 'meetingTime',
                render:text=>text? text.substr(0,10) : null
            },
            {
                title: intl.get('wsd.i18n.comu.meeting.meetingtype'),
                dataIndex: 'meetingType',
                key: 'meetingType',
                render:text=>text? text.name : null
            },
            {
                title: intl.get('wsd.i18n.comu.meeting.status'),
                dataIndex: 'status',
                key: 'status',
                render:text=>text? text.name : null
            },
        ]
        const {selectedRowKeys}=this.state
        const rowSelection = {
            selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
              this.setState({
                activeIndex:selectedRowKeys,
                rightData:selectedRows,
                selectedRowKeys
              })
            },
        
          };

        let pagination = {
            total: this.state.total ? this.state.total : 0 ,
            // hideOnSinglePage:true,
            current: this.state.currentPage,
            pageSize: this.state.pageSize,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: total => `总共${this.state.total}条`,
            onChange: (page, pageSize) => {
      
              this.setState({
                currentPage: page,
                pageSize
              })
      
            }
          }

        return (
            <div>
             
                <div className={style.main}>
                    <div className={style.leftMain} style={{ height: this.props.height }}>
                        <div style={{ minWidth: 'calc(100vw - 60px)' }}>
                          
                                <StandardTable
                                    rowKey={record => record.id}
                                    rowSelection={rowSelection}
                                    defaultExpandAllRows={true}
                                    name={this.props.name}
                                    columns={columns}
                                    dataSource={this.state.data}
                                    pagination={pagination}
                                    rowClassName={this.setClassName}
                                    onRow={(record, index) => {
                                        return {
                                            onClick: (event) => {
                                                this.getInfo(record, index)
                                            }
                                        }
                                    }}
                                />
                            
                        </div>


                    </div>
                    <div className={style.rightBox} style={{ height: this.props.height }}>
                        <RightTags rightTagList={this.state.rightTags} rightData={this.state.rightData.length==1?this.state.rightData[0]:null} updateSuccess={this.updateSuccess} callBackBanner={this.props.callBackBanner} menuInfo={this.props.menuInfo}/>
                    </div>
                </div>

            </div>

        )
    }
}

/* *********** connect链接state及方法 start ************* */

const mapStateToProps = state => {
    return {
        currentLocale: state.localeProviderData,
    }
};


export default connect(mapStateToProps, null)(ComcateMeeting);