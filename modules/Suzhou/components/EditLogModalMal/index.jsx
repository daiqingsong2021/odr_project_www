import React, { Component } from 'react';
import {  Modal, Form, Table, Input, Button, Select, Row, Col, DatePicker } from 'antd';
import moment from 'moment';
import style from './style.less';
import intl from 'react-intl-universal';
import { connect } from 'react-redux';
import { curdCurrentData } from '@/store/curdData/action';
import axios from '@/api/axios';
import { getTrainScheduleList, checkTrainCreatTime } from '@/modules/Suzhou/api/suzhou-api';
import { getBaseData } from '@/modules/Suzhou/components/Util/util';
import { findAcmlog } from "@/api/api"
const { Item } = Form;
const Option = Select.Option;
import PublicButton from "@/components/public/TopTags/PublicButton";
import * as dataUtil from "@/utils/dataUtil";
import FormItem from 'antd/lib/form/FormItem';

export class AddModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pageSize:50,
            currentPageNum:1,
            total:0,
            data:[],
            lineArr:[],
            statusArr:[]
        }
    }
    componentDidMount() {
        getBaseData('line').then(data => { this.setState({ lineArr: data }) })
        getBaseData('base.flow.status').then(data => { this.setState({ statusArr: data }) })
        this.getList()
    }
    //获取日志分页
    getList=()=>{
        const {id} = this.props.record
        let url = `?recordId=${id}`
        axios.get(findAcmlog(this.state.pageSize, this.state.currentPageNum) + url).then(res => {
            this.setState({
                data: res.data.data,
            })
        })
    }
    onSelectChange=(selectedRowKeys,selectedRows)=>{
        let listAtt = []
        selectedRows.map(item=>{
            listAtt.push(item.value)
        })
        this.setState({sumbitData:listAtt.join(',')})
    }
    getInfo = (record) => {
        this.setState({
            activeIndex: record.id
        })
    }
    //判断索引相等时添加行的高亮样式
    setClassName = (record) => {
        return record.id === this.state.activeIndex ? 'tableActivty' : "";
    }
    //上一页
    toUP = () => {
        const { currentPageNum } = this.state
        const seleEm=document.querySelector(".mainBody")
         //滚动条回到顶部
        // seleEm.scrollTop=0
        this.setState({
            currentPageNum: currentPageNum - 1
        }, () => {
            this.getList()
        })

    }
    //下一页
    toNext = () => {
        const seleEm=document.querySelector(".mainBody")
        //滚动条回到顶部
        // seleEm.scrollTop=0
        const { currentPageNum } = this.state
        this.setState({
            currentPageNum: currentPageNum + 1
        }, () => {
            this.getList()
        })
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
            // {
            //     title: intl.get("wsd.i18n.sys.three.sort"),
            //     dataIndex: 'id',
            //     key: 'id',

            //     title: intl.get("wsd.i18n.sys.three.swname"),
            //     dataIndex: 'applicationName',
            //     key: 'applicationName',
            // },
            // {
            //     title: intl.get("wsd.i18n.sys.three.logtype"),
            //     dataIndex: 'loggerType',
            //     key: 'loggerType',
            // },
            {
                title: intl.get("wsd.i18n.sys.three.modename"),
                dataIndex: 'moduleName',
                key: 'moduleName',
            },
            {
                title: '线路',
                dataIndex: 'line',
                key: 'line',
                render: (text, record) => {
                    return <span >{text?text + '号线':''}</span>
                }
            },
            {
                title: '日期',
                dataIndex: 'recordTime',
                key: 'recordTime',
                render: (text, record) => {
                    return <span >{text?text:''}</span>
                }
            },
            {
                title: '状态',
                dataIndex: 'recordStatusVo.name',
                key: 'recordStatusVo.name',
                render: (text, record) => {
                    return <span >{text?text:''}</span>
                }
            },
            {
                title: intl.get("wsd.i18n.sys.three.opratename"),
                dataIndex: 'operationName',
                key: 'operationName',
            },
            
          
            {
                title: intl.get("wsd.i18n.sys.three.oprater"),
                dataIndex: 'operationUser',
                key: 'operationUser',
            },
            {
                title: intl.get("wsd.i18n.sys.three.opratetime"),
                dataIndex: 'creatTime',
                key: 'creatTime',
                // render: (text) => dataUtil.Dates().formatDateString(text)
            },
            {
                title: intl.get("wsd.i18n.sys.three.accessIP"),
                dataIndex: 'ipAddress',
                key: 'ipAddress',
            },
            {
                title: intl.get("wsd.i18n.sys.three.descr"),
                dataIndex: 'operationDesc',
                key: 'operationDesc',
            },
            {
                title: intl.get("wsd.i18n.sys.three.result"),
                dataIndex: 'operationResult',
                key: 'operationResult',
            },
            {
                title: intl.get("wsd.i18n.sys.three.error"),
                dataIndex: 'exception',
                key: 'exception',
            },
        ];
        const rowSelection = {
            onChange: this.onSelectChange,
          };
        let pagination = {  //分页
          total: this.state.total,
          // hideOnSinglePage: true,
          size: "small",
          current: this.state.currentPageNum,
          pageSize: this.state.pageSize,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: total => `总共${total}条`,
          onShowSizeChange: (current, size) => {
            this.setState({
              pageSize: size,
              currentPageNum: 1
            }, () => {
              this.getList()
            })
          },
          onChange: (page, pageSize) => {
            this.setState({
              currentPageNum: page
            }, () => {
              this.getList()
            })
          }
        }
        const { data, lineArr, statusArr } = this.state
        const { record } = this.props
        const statusVo = record.status ? record.status : 'INIT'
        return (
                    <Modal className={style.main}
                        width="70%"
                        afterClose={this.props.form.resetFields}
                        mask={false}
                        maskClosable={false}
                        footer={<div className="modalbtn">
                            {/* 关闭 */}
                            <Button key={1} onClick={this.props.handleCancel}>关闭</Button>
                            {/* 保存 */}
                            {/* <Button key={2} onClick={this.handleSubmit.bind(this, 'save')} type="primary">保存</Button> */}
                        </div>}
                        centered={true} title={statusVo =='INIT'?'修改日志':'调整日志'} visible={this.props.modalVisible}
                        onCancel={this.props.handleCancel}>
                        <div className={style.tipLayout}>
                            <div className={style.tipBox}>
                                <div className={style.topTags}>
                                    <Row type="flex">
                                        <Col span={8}>
                                            <Item label='日期' {...formItemLayout}>
                                                {getFieldDecorator('recordTime', {
                                                    initialValue: record ? moment(record.recordDay, 'YYYY-MM-DD') : null,
                                                    rules: [
                                                        {
                                                            required: true,
                                                            message: '请选择日期',
                                                        },
                                                    ],
                                                })(
                                                    <DatePicker disabled size='small' style={{ width: 150, marginRight: 10 }} />
                                                )}
                                            </Item>
                                        </Col>
                                        <Col span={8}>
                                            <Item label='线路' {...formItemLayout}>
                                                {getFieldDecorator('line', {
                                                    initialValue: record ? record.line : null,
                                                    rules: [
                                                        {
                                                            required: true,
                                                            message: '请选择线路',
                                                        },
                                                    ],
                                                })(
                                                    <Select disabled allowClear showSearch placeholder="请选择线路" size='small' style={{ minWidth: 150, marginRight: 10 }}
                                                        filterOption={(input, option) =>
                                                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                                                        {lineArr.map(item => {
                                                            return <Option key={item.value} value={item.value}>{item.title}</Option>
                                                        })}
                                                    </Select>
                                                )}
                                            </Item>
                                        </Col>
                                        <Col span={8}>
                                            <Item label='状态' {...formItemLayout}>
                                                {getFieldDecorator('status', {
                                                    initialValue: record ? record.status : null,
                                                    rules: [
                                                        {
                                                            required: true,
                                                            message: '请选择状态',
                                                        },
                                                    ],
                                                })(
                                                    <Select disabled allowClear showSearch placeholder="请选择状态" size='small' style={{ minWidth: 150, marginRight: 10 }}
                                                        filterOption={(input, option) =>
                                                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                                                        {statusArr.map(item => {
                                                            return <Option key={item.value} value={item.value}>{item.title}</Option>
                                                        })}
                                                    </Select>
                                                )}
                                            </Item>
                                        </Col>
                                    </Row>
                                </div>
                            </div>
                        </div>
                        <div className={style.mainBody}>
                            <Table className={style.myTable}
                                // rowKey={record => record.id}
                                key={99}
                                size="small"
                                bordered
                                // rowSelection={rowSelection}
                                // rowClassName={this.setClassName}
                                columns={columns}
                                dataSource={data}
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
                            <div style={{padding:"10px 0"}}>
                            <Button size="small" onClick={this.toUP} disabled={this.state.currentPageNum == 1} style={{marginRight:10}}>上一页</Button>
                            <Button size="small" onClick={this.toNext} disabled={this.state.data.length < this.state.pageSize}>下一页</Button>
                        </div>
                        </div>
                    </Modal>
        )
    }
}
const AddModals = Form.create()(AddModal);
export default connect(state => ({
    currentLocale: state.localeProviderData,
}))(AddModals);