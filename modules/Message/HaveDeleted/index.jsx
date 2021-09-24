import React, { Component } from 'react'
import { Row, Col, Form, Input, Select, DatePicker, Button, Tooltip, Pagination, Table, notification } from 'antd'
import style from './style.less'
import { connect } from 'react-redux'
import MyIcon from '../../../components/public/TopTags/MyIcon'

import axios from '../../../api/axios'
import { messageDeletedSearch, messageDeleted, messageDel, messageCancleDel } from '../../../api/api'


const Search = Input.Search;

export class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userAllData: [],
            claimdealtypeData: [],
            isNell: false,
            editorHtml: '',
            data: [],
            rightData: null,
            activeIndex: null,
            selectedRowKeys: [],
            selectedRows: [],
            current: 1,
            total: 0,
            searchVal: null,
        };
    }

    getData = () => {
        if (this.state.searchVal) {
            axios.get(messageDeletedSearch(10, this.state.current, this.state.searchVal)).then(res => {
                let data=res.data.data
                if(data.length>0){
                    data.sort((a,b)=>a.sendTime<b.sendTime)
                }
                this.setState({
                    data: data,
                    total: res.data.total
                })
            })

        } else {
            axios.get(messageDeleted(10, this.state.current)).then(res => {
                let data=res.data.data
                if(data.length>0){
                    data.sort((a,b)=>a.sendTime<b.sendTime)
                }
                this.setState({
                    data: data,
                    total: res.data.total
                })
            })
        }

    }

    componentDidMount() {
        this.getData();
    }

    setClassName = (record, index) => {
        //判断索引相等时添加行的高亮样式
        return record.id === this.state.activeIndex ? 'tableActivty' : "";
    }

    getInfo(record) {

        let id = record.id, records = record
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
    //分页回调
    paginationChange = (page) => {
        this.setState({
            current: page
        }, () => {
            this.getData();
        })
    }
    //搜索回调
    searchClick = (val) => {
        this.setState({
            searchVal: val
        }, () => {
            this.getData();
        })
    }
    //刷新
    refreshClick = () => {
        this.getData();
    }

    //删除
    deleteBtn = () => {
        let { selectedRowKeys } = this.state;
        if (selectedRowKeys.length) {
            axios.deleted(messageDel, { data: selectedRowKeys }, true, '已删除').then(res => {
                this.getData();
                this.props.minusDeletedNum(selectedRowKeys.length)
                this.setState({
                    selectedRowKeys: [],
                    selectedRows:[]
                })
               
            })
        } else {
            notification.warning(
                {
                    placement: 'bottomRight',
                    bottom: 50,
                    duration: 2,
                    message: '警告',
                    description: '请勾选数据进行操作'
                }
            )
        }

    }

    //还原
    ifThenBtn = () => {
        let actuName = JSON.parse(sessionStorage.getItem('userInfo'));
        let { selectedRows } = this.state;
        if(selectedRows.length){
            let arr = [];
            selectedRows.map(item => {
                let obj = {
                    id: item.sendUser.id == actuName.id ? item.id : item.sid,
                    type: item.sendUser.id == actuName.id ? 'sendMessage' : 'recvMessage'
                }
    
                arr.push(obj)
            })
    
            axios.put(messageCancleDel, arr, true, '已还原').then(res=>{
                this.getData();
                this.setState({
                    selectedRowKeys: [],
                    selectedRows:[]
                })
                this.props.minusDeletedNum(selectedRows.length)
            })
    
        } else {
            notification.warning(
                {
                    placement: 'bottomRight',
                    bottom: 50,
                    duration: 2,
                    message: '警告',
                    description: '请勾选选数据进行操作'
                }
            )
        }
       
    }



    render() {
        const { intl } = this.props.currentLocale;

        let { selectedRowKeys, selectedRows } = this.state;
        const rowSelection = {
            selectedRowKeys,
            selectedRows,
            onChange: (selectedRowKeys, selectedRows) => {
                this.setState({
                    selectedRowKeys,
                    selectedRows
                })
            },
        };

        const columns = [{
            title: intl.get('wsd.i18n.doc.projectdoc.theme'),//主题
            dataIndex: 'title',
            key: 'title',
            render: (text, record) => <span> {record.source ? (record.source.id ? <MyIcon type='icon-weibiaoti555' /> : null) : null} {text} </span>
        }, {
            title: intl.get('wsd.i18n.doc.message.addresser'),//发件人
            dataIndex: 'sendUser',
            key: 'sendUser',
            render: text => text ? text.name : ''
        }, {
            title: intl.get('wsd.i18n.doc.message.type'),//消息类型
            dataIndex: 'type',
            key: 'type',
            render: text => text ? text.name : ''
        }, {
            title: intl.get('wsd.i18n.doc.projectdoc.needreply'),//需要回复
            dataIndex: 'claimDealType',
            key: 'claimDealType',
            render: text => text ? text.name : ''
        }, {
            title: intl.get('wsd.i18n.doc.message.sendTime'),//发送时间
            dataIndex: 'sendTime',
            key: 'sendTime',
        }];


        return (
            <div className={style.main}>
                {/* 已删除 */}
                <h2>{intl.get('wsd.i18n.doc.message.havedeleted')}</h2>

                <div className={style.head}>
                    <Row>
                        <Col span={5}>
                            <span className={style.spanBtn}>
                                <Button style={{ padding: '0 5px' }} onClick={this.refreshClick} > <MyIcon type='icon-shuaxin2' /> {intl.get('wsd.i18n.doc.message.refresh')} </Button>
                            </span>
                            <span className={style.spanBtn}>
                                <Tooltip title={intl.get('wsd.i18n.doc.message.movedel')}>
                                    <Button onClick={this.deleteBtn} ><MyIcon type='icon-delete' /></Button>
                                </Tooltip>
                            </span>
                            <span>
                                <Tooltip title={intl.get('wsd.i18n.doc.message.ifthen')}>
                                    <Button onClick={this.ifThenBtn} ><MyIcon type='icon-huanyuan' /></Button>
                                </Tooltip>
                            </span>
                        </Col>
                        <Col span={14} offset={5}>
                          
                                    <Search
                                        placeholder={intl.get('wsd.i18n.doc.message.searchplaceholder')}
                                        enterButton={intl.get('wsd.i18n.doc.message.search')}
                                        style={{ width: 'calc(100% - 195px)' }}
                                        onSearch={this.searchClick}
                                    />
                             
                                    <Pagination className={style.pagination} current={this.state.current} onChange={this.paginationChange} total={this.state.total} simple />
                      
                        </Col>
                    </Row>
                </div>

                <Table rowKey={record => record.id} rowSelection={rowSelection} columns={columns}
                    dataSource={this.state.data} pagination={false}
                    rowClassName={this.setClassName} size='small'
                    onRow={(record, index) => {
                        return {
                            onClick: (event) => {
                                this.getInfo(record)
                            }
                        }
                    }}
                />

            </div>
        )
    }

}


export default connect(state => ({
    currentLocale: state.localeProviderData
}))(Index)