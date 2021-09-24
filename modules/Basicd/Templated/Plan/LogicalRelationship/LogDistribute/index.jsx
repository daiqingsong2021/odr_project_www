import React, { Component } from 'react'
import style from './style.less'
import { Form, Row, Col, Input, Button, Icon, Select, notification, Modal, Table } from 'antd';
import { connect } from 'react-redux'
import axios from "../../../../../../api/axios"
import {getTmpltaskList,tmpltaskAssignIPred,tmpltaskAssignIFollow} from "../../../../../../api/api"
import Search from "../../../../../../components/public/Search/"
import MyIcon from "../../../../../../components/public/TopTags/MyIcon"
import SubmitButton from "../../../../../../components/public/TopTags/SubmitButton"

class LogDistribute extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: []
        }
    }

    componentDidMount() {
     axios.get(getTmpltaskList(this.props.data.tmplId)).then(res=>{
         this.setState({
             data:res.data.data,
             data1:res.data.data
         })
     })
    }
    search=value=>{
        const {data}=this.state
        
        let arr=[]
        function find(array){
          
            array.forEach(item=>{
              
                if(item.taskName.indexOf(value)>-1){
                    arr.push(item)
                }else{
                    if(item.children){
                        find(item.children)
                    }
                }
            })
        }
       find(data)
       this.setState({
           data1:arr
       })
}
    showModal = () => {
        this.setState({
            visible: true,
        });
    }
    handleOk = (type) => {
        if(!this.state.rightData){
            notification.warning(
                {
                    placement: 'bottomRight',
                    bottom: 50,
                    duration: 2,
                    message: '未选中数据',
                    description: '请选择数据进行操作'
                }
            )
            return
        }
        if(this.state.rightData.type=="tmpl" || this.state.rightData.type=="wbs"){
            notification.warning(
                {
                    placement: 'bottomRight',
                    bottom: 50,
                    duration: 2,
                    message: '警告',
                    description: '请选择task进行操作'
                }
            )
            return
        }
        if(type=="pre"){
            axios.post(tmpltaskAssignIPred(this.props.data.id,this.state.rightData.id),null,true,"分配前紧任务成功").then(res=>{
                //this.props.distributeClassify(res.data.data),
                this.props.changeActiveKey("2")
            })
        }else{
            axios.post(tmpltaskAssignIFollow(this.props.data.id,this.state.rightData.id),null,true,"分配前紧任务成功").then(res=>{
               // this.props.distributeClassify(res.data.data),
                this.props.changeActiveKey("1")
            })
        }
      
       // this.props.handleCancel()
    }
    handleCancel = (e) => {
        this.setState({
            visible: false,
        });
        this.props.handleCancel()
    }
    getInfo = (record, index) => {
        let id = record.id
        let type = record.type
        if (this.state.activeIndex == (id + type)) {
          this.setState({
            activeIndex: null,
            rightData: null
          })
        } else {
          this.setState({
            activeIndex: id + type,
            rightData: record
          })
        }
    
      };
    
    setClassName = (record, index) => {
        //判断索引相等时添加行的高亮样式
        return record.id + record.type == this.state.activeIndex ? 'tableActivty' : "";
      }
    render() {
        const { intl } = this.props.currentLocale
        const columns = [
            {
                title: intl.get('wsd.i18n.sys.menu.menuname'),
                dataIndex: 'taskName',
                key: 'taskName',
                render: (text, record) => {
                    if (record.type == "tmpl") {
                      return <span><MyIcon type="icon-xiangmu" style={{ fontSize: '18px' ,verticalAlign:"middle"}} />&nbsp;{text}</span>
                    }
                    else if (record.type == "wbs") {
                      return <span><MyIcon type="icon-WBS" style={{ fontSize: '18px',verticalAlign:"middle" }} />&nbsp;{text}</span>
                    }
                    else if (record.type == "task") {
                      return <span><MyIcon type="icon-renwu1" style={{ fontSize: '18px' ,verticalAlign:"middle"}} />&nbsp;{text}</span>
                    } else {
                      return
                    }
                  }
            },
            {
                title: intl.get("wsd.i18n.sys.menu.menucode"),
                dataIndex: 'taskCode',
                key: 'taskCode',
            }
        ]
        return (
            <div >
               
                    <Modal title="分配任务" visible={true}
                        onOk={this.handleOk} onCancel={this.handleCancel}
                        mask={false}
                        maskClosable={false}
                        width="700px"
                        className={style.main}
                        footer={[
                            <SubmitButton key="back" type="primary" onClick={this.handleOk.bind(this,"follow")} content="分配后续任务" />,
                            <SubmitButton key="submit" type="primary" onClick={this.handleOk.bind(this,"pre")} content="分配前紧任务" />,
                        ]}
                    >
                        <div className={style.DistributeModal}>
                            <div className={style.function}>
                              
                                <Search search={this.search}></Search>
                                
                            </div>

                            <Table 
                            columns={columns} 
                            dataSource={this.state.data1} 
                            pagination={false} name={this.props.name} 
                            rowKey={record => record.id + record.type}
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
                    </Modal>
                
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
      currentLocale: state.localeProviderData,
    }
  };
  
  
  export default connect(mapStateToProps, null)(LogDistribute);