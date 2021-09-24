import React, { Component } from 'react';
import {  Modal, Form, Table, Input, Button, Select, InputNumber } from 'antd';
import moment from 'moment';
import _ from 'lodash'
import style from './style.less';
import intl from 'react-intl-universal';
import { connect } from 'react-redux';
import { curdCurrentData } from '../../../../../../store/curdData/action';
import axios from '../../../../../../api/axios';
import { getTrainScheduleList, checkTrainCreatTime,queryTrainList } from '../../../../api/suzhou-api';
import { getBaseData } from '@/modules/Suzhou/components/Util/util';
const { Item } = Form;
const Option = Select.Option;
import PublicButton from "../../../../../../components/public/TopTags/PublicButton";
import * as dataUtil from "../../../../../../utils/dataUtil";
import FormItem from 'antd/lib/form/FormItem';

export class AddModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            metroList:[],   //数据
            sumbitData:''   //提交的数据
        }
    }
 
    componentDidMount() {
        this.setState({
            selectedRowKeys:this.props.lineChoose
        })
        const {line} = this.props
        // getBaseData(`metro${line}.code`).then(data => { 
        //     data.map((item,index)=>{
        //         item.id = index
        //     })
        //     
        //     this.setState({ metroList: data }) 
        // })
        axios.get(queryTrainList+`?line=${line}`).then(res => {
            let data = res.data.data ? res.data.data : []
            //筛选掉已选择的列车
                // if(this.props.checkList){
                //     const oldList =  Array.from(this.props.checkList)
                //     oldList.map(item=>{
                //         const index = _.findIndex(data,(e)=>{
                //             return e.trainCode == item
                //         })
                //         index >-1?data.splice(index,1):null
                //     })
                // }
            this.setState({
                metroList: data,
            })
            })
    }
    onSelectChange=(selectedRowKeys,selectedRows)=>{
        let listAtt = [],
        lineAtt = []//已选择车辆编号
        console.log(selectedRows)
        selectedRows.map(item=>{
            listAtt.push(item.trainCode)
            lineAtt.push(item.id)
        })
        console.log(33,listAtt)
        this.setState({
            sumbitData:listAtt.join(','),
            selectedRowKeys,
            lineAtt
        })
    }
    //提交数据
    handleSubmit = (val, e) => {
        e.preventDefault();
        const {sumbitData,lineAtt} = this.state
        this.props.addSuccess(sumbitData,lineAtt)
        this.props.handleCancel()
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
    render() {
        const { intl } = this.props.currentLocale
        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
        const formLayout = {
            labelCol: {
                sm: { span: 4 },
            },
            wrapperCol: {
                sm: { span: 20 },
            },
        };
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };
        const formItemLayout1 = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 4 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 20 },
            },
        };
        const columns = [
            {
                title: '车辆编号',
                dataIndex: 'trainCode',
                key: 'trainCode',
                align:'center'
            },
        ]
        console.log(1212,this.props.lineChoose)
        const rowSelection = {
            onChange: this.onSelectChange,
            selectedRowKeys:this.state.selectedRowKeys
        
          };
        const {  metroList } = this.state
        return (
                    <Modal className={style.main}
                        width="500px"
                        afterClose={this.props.form.resetFields}
                        mask={false}
                        maskClosable={false}
                        footer={<div className="modalbtn">
                            {/* 关闭 */}
                            <Button key={1} onClick={this.props.handleCancel}>关闭</Button>
                            {/* 保存 */}
                            <Button key={2} onClick={this.handleSubmit.bind(this, 'save')} type="primary">保存</Button>
                        </div>}
                        centered={true} title={'新增车辆'} visible={this.props.modalVisible}
                        onCancel={this.props.handleCancel}>
                        <div className={style.mainBody}>
                            <Table className={style.myTable}
                                rowKey={record => record.id}
                                key={99}
                                size="small"
                                bordered
                                rowSelection={rowSelection}
                                rowClassName={this.setClassName}
                                columns={columns}
                                dataSource={metroList}
                                expanderLevel={"ALL"}
                                pagination={false}
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
        )
    }
}
const AddModals = Form.create()(AddModal);
export default connect(state => ({
    currentLocale: state.localeProviderData,
}))(AddModals);