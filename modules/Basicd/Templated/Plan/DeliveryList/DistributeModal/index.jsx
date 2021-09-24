import React, { Component } from 'react'
import style from './style.less'
import { Modal, Table, Form, Input, Icon, DatePicker, Select, notification, Col, Steps, Button } from 'antd';
import { connect } from 'react-redux'
import Search from '../../../../../../components/public/Search'
import axios from "../../../../../../api/axios"
import {getTmpldelvTreeList,getTmpldelvTree,addTmpltaskAssign} from "../../../../../../api/api"
import '../../../../../../asserts/antd-custom.less'
import MyIcon from  "../../../../../../components/public/TopTags/MyIcon"
import * as dataUtil from '../../../../../../utils/dataUtil'
import SubmitButton from "../../../../../../components/public/TopTags/SubmitButton"
const Option = Select.Option;
const Step = Steps.Step;
const { TextArea } = Input;

export class PlanPreparedRelease extends Component {
    constructor(props) {
        super(props)
        this.state = {
          
            step: 1,
            columns: [],
            data: [],
            info: {
                receiver: '巫启贤、赵帅、徐文豪',
                sender: 'WSD',
                sendTime: '2019-01-25'
            },
            selectedRowKeys:[]
        }
    }

    componentDidMount() {
       axios.get(getTmpldelvTreeList).then(res=>{
           let array=[]
           if(res.data.data){
            res.data.data.forEach(item=>{
                delete item.children
                array.push(item)
                this.setState({
                    data:array,
                    data1:array
                })
            })
           }
       })
    }
    //搜索
    search=value=>{
        const {data1}=this.state
        let arr=[]
        function find(array){
          
            array.forEach(item=>{
              
                if(item.delvTitle.indexOf(value)>-1){
                    arr.push(item)
                }else{
                    if(item.children){
                        find(item.children)
                    }
                }
            })
        }
       find(data1)
       this.setState({
           data:arr
       })
}
    getInfo = (record, index) => {


        let id = record.id
        /* *********** 点击表格row执行更新state start ************* */
        if (this.state.activeIndex == id) {

            this.setState({
                activeIndex: null,
                rightData: null
            })
        } else {

            this.setState({
                activeIndex: id,
                rightData: record
            })
        }


    }
    getInfo1 = (record, index) => {
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
          if(record.type!="delv"){
              return
          }
          this.setState((preState, props) => ({
            activeIndex: [id],
            rightData: [record],
            selectedRowKeys:[id]
          }))
        }
      };
    setClassName = (record, index) => {
        //判断索引相等时添加行的高亮样式
        return record.id === this.state.activeIndex ? 'tableActivty' : "";
    }
    setClassName1 = (record, index) => {
        // 判断索引相等时添加行的高亮样式
         //判断索引相等时添加行的高亮样式
         if (this.state.activeIndex.findIndex(value => record.id === value) > -1) {
          return 'tableActivty'
        } else {
          return "";
        }
    
      };

    handleSubmit = () => {
      
        if(!this.state.rightData ||this.state.rightData.length==0){
            notification.warning(
                {
                    placement: 'bottomRight',
                    bottom: 50,
                    duration: 1,
                    message: '警告',
                    description: '没有选择数据！'
                }
            )
            return
        }
        let id
        if(this.state.step==1){
            id=this.state.rightData.id
        }
        if(this.state.step==2){
            axios.post(addTmpltaskAssign(this.props.taskId),this.state.activeIndex,true,"分配成功").then(res=>{
                this.props.distributeSucess(res.data.data)
            })
        }
        this.setState((proState, state) => ({
            step: proState.step + 1,
            activeIndex:[],
            rightData:[]
        }), () => {
           
            if(this.state.step==2){
                axios.get(getTmpldelvTree(id)).then(res=>{
                    this.setState({
                        data:res.data.data,
                        data1:res.data.data,
                    })
                })
            }
            if (this.state.step == 3) {
                this.props.handleCancel()
                this.setState({
                    step: 1
                })
            }
        })
    }

    backone = () => {
      
        this.setState((proState, state) => ({
            step: proState.step - 1
        }),()=>{
            if(this.state.step==1){
                axios.get(getTmpldelvTreeList).then(res=>{
                    let array=[]
                    if(res.data.data){
                     res.data.data.forEach(item=>{
                         delete item.children
                         array.push(item)
                         this.setState({
                             data:array,
                             data1:array,
                             activeIndex:null,
                             rightData:null
                         })
                     })
                    }
                })
            }
        })
    }

    render() {
        const { intl } = this.props.currentLocale
        const columns1= [
            {
                title: intl.get('wsd.i18n.base.docTem.doctitle'),
                dataIndex: 'delvTitle',
                key: 'delvTitle',
            },
            {
                title: intl.get('wsd.i18n.base.docTem.docnum'),
                dataIndex: 'delvNum',
                key: 'delvNum',
            },
            {
                title: intl.get('wsd.i18n.base.docTem.docversion'),
                dataIndex: 'delvVersion',
                key: 'delvVersion',
              
            },
            {
                title: intl.get('wsd.i18n.base.tmpldelv1.delvtype'),
                dataIndex: 'delvType',
                key: 'delvType',
                render: (text) => {
                    if (text) {
                      return <span>{text.name}</span>
                    } else {
                      return ""
                    }
                  }
            },
            {
                title: intl.get('wsd.i18n.plan.plandefine.creator'),
                dataIndex: 'creator',
                key: 'creator',
                render: (text) => {
                    if (text) {
                      return <span>{text.name}</span>
                    } else {
                      return "--"
                    }
                  }
            },
            {
                title: intl.get('wsd.i18n.sys.menu.creattime'),
                dataIndex: 'creatTime',
                key: 'creatTime',
                render: (text) =>  dataUtil.Dates().formatDateString(text)
            },
            {
                title: intl.get('wsd.i18n.sys.ipt.remark'),
                dataIndex: 'delvDesc',
                key: 'delvDesc',
            },
        ]
        const columns2= [
            {
                title: intl.get('wsd.i18n.plan.delvList.delvname'),
                dataIndex: 'delvTitle',
                key: 'delvTitle',
                render: (text, record) => {
                  
                    if (record.type == "delv") {
                      return <span><MyIcon type="icon-jiaofuwu1" style={{ fontSize: '18px' }} />&nbsp;{text}</span>
                    } else{
                      return <span><MyIcon type="icon-PBS" style={{ fontSize: '18px' }} />&nbsp;{text}</span>
                    }
                  }
            },
            {
                title: intl.get('wsd.i18n.base.docTem.docnum'),
                dataIndex: 'delvNum',
                key: 'delvNum',
            },
            {
                title: intl.get('wsd.i18n.plan.projectquestion.questiontype'),
                dataIndex: 'delvType',
                key: 'delvType',
                render: (text) => {
                    if (text) {
                      return <span>{text.name}</span>
                    } else {
                      return ""
                    }
                  }
            },
            {
                title: intl.get('wsd.i18n.plan.plandefine.creator'),
                dataIndex: 'creator',
                key: 'creator',
                render: (text) => {
                    if (text) {
                      return <span>{text.name}</span>
                    } else {
                      return "--"
                    }
                  }
            },
            {
                title: intl.get('wsd.i18n.sys.menu.creattime'),
                dataIndex: 'creatTime',
                key: 'creatTime',
                render: (text) =>  dataUtil.Dates().formatDateString(text)
            }
        ]
        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 3 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 21 },
            },
        };
        const {selectedRowKeys}=this.state
        const rowSelection = {
            selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
              
                let array=[]
                let array1=[]
                selectedRows.forEach(item=>{
                    if(item.type=="delv"){
                       array.push(item.id)
                       array1.push(item)
                    }
                })
               this.setState({
                   activeIndex:array,
                   selectedRowKeys:array,
                   rightData:array1
                 })
            }
           
          };
        return (
            <Modal className={style.main} width="850px"  centered={true}
                title="分配交付清单" visible={true} onCancel={this.props.handleCancel} footer={
                    <div className="modalbtn">
                        {this.state.step > 1 && <span style={{ float: 'left' }}><SubmitButton key="backone" onClick={this.backone} content="上一步" /></span>}
                        <SubmitButton key="back" onClick={this.props.handleCancel} content="取消" />
                        {this.state.step == 1 && <SubmitButton key="submit" type="primary" onClick={this.handleSubmit} content="下一步" />}
                        {this.state.step == 2 && <SubmitButton key="submit" type="primary" onClick={this.handleSubmit} content="提交" />}
                        {this.state.step == 3 && <SubmitButton key="submit" type="primary" onClick={this.handleSubmit} content="完成" />}
                    </div>
                }>
                <div className={style.steps}>
                    <Steps size="small" current={this.state.step - 1}>
                        <Step title="选择模板" />
                        <Step title="选择交付物" />
                        <Step title="完成" />
                    </Steps>
                </div>
               <div className={style.tableMain}>
                    <div className={style.search}>
                        <Search search={this.search} placeholder="标题/编号" />
                    </div>
                    <Table 
                    rowClassName={this.state.step==1?this.setClassName:this.setClassName1}
                    rowSelection={this.state.step==1?null:rowSelection}
                    rowKey={record => record.id}
                    defaultExpandAllRows={true} 
                    pagination={false} 
                    name={this.props.name} 
                    columns={this.state.step==1?columns1:columns2 }
                     dataSource={this.state.data} 
                     onRow={(record, index) => {
                        return {
                            onClick: (event) => {
                                if(this.state.step==1){
                                    this.getInfo(record, index)
                                }else{
                                    this.setState({
                                        activeIndex:[],
                                        rightData:[]
                                    },()=>{
                                        this.getInfo1(record, index)
                                    })
                                  
                                }
                                
                            }
                        }
                    }
                    }
                     />
                </div>
               
            </Modal>

        )
    }
}

const PlanPreparedReleases = Form.create()(PlanPreparedRelease)

const mapStateToProps = state => {
    return {
      currentLocale: state.localeProviderData,
    }
  };
  
  
  export default connect(mapStateToProps, null)(PlanPreparedReleases);