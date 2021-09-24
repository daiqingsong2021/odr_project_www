import React, { Component } from 'react'
import { Row, Col, Form, Input, Select, DatePicker, Button, Tooltip, Pagination, Table } from 'antd'
import style from './style.less'
import { connect } from 'react-redux'
import MyIcon from '../../../components/public/TopTags/MyIcon'

import axios from '../../../api/axios'
import { messageCollectSearch, messageCollectList, messageCollect, messageCancleCollect } from '../../../api/api'


const Search = Input.Search;

export class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            rightData: null,
            activeIndex: null,
            selectedRowKeys: [],
            current: 1,
            total: 0,
            searchVal: null,
            actuName: ''
        };
    }

    getData = () => {
        if (this.state.searchVal) {
            axios.get(messageCollectSearch(10, this.state.current, this.state.searchVal)).then(res => {
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
            axios.get(messageCollectList(10, this.state.current)).then(res => {
                let data=res.data.data
                if(data.length>0){
                    data.sort((a,b)=>a.sendTime<b.sendTime)
                }
                this.setState({
                    data: data,
                    total: res.data.total,

                })
            })
        }

    }

    componentDidMount() {
        this.getData();
        let obj = JSON.parse(sessionStorage.getItem('userInfo'))
        this.setState({
            actuName: obj
        })
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


    //收藏
    collectClick = (record) => {
        if (record.sendUser.id == this.state.actuName.id) {
            axios.put(messageCancleCollect(record.id, 'sendMessage'), {}, true, '取消收藏成功', false).then(res => {
                this.getData();
            })
        } else {
            axios.put(messageCancleCollect(record.sid, 'recvMessage'), {}, true, '取消收藏成功', false).then(res => {
                this.getData();
            })
        }
       
    }


    render() {
        const { intl } = this.props.currentLocale;

        let { selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
                this.setState({
                    selectedRowKeys,
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
        }, {
            title: '',//收藏
            dataIndex: 'collect',
            key: 'collect',
            render: (text, record) => <MyIcon type='icon-shoucang1' onClick={this.collectClick.bind(this, record)} />
        }];


        return (
            <div className={style.main}>
                {/* 重要消息 */}
                <h2>{intl.get('wsd.i18n.doc.message.importantmessage')}</h2>

                <div className={style.head}>
                    <Row>
                        <Col span={5}>
                            <span className={style.spanBtn}>
                                <Button style={{ padding: '0 5px' }} onClick={this.refreshClick} > <MyIcon type='icon-shuaxin2' /> {intl.get('wsd.i18n.doc.message.refresh')} </Button>
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