import React from 'react'
import { Icon, Popover, Button, Table,notification } from 'antd';

import style from './style.less'
import Search from "@/components/public/Search"
import { throws } from 'assert';
import axios from "@/api/axios"
import {getsectionId} from "@/api/suzhou-api"
import * as dataUtil from "@/utils/dataUtil"
import MyIcon from "@/components/public/TopTags/MyIcon"
import {firstLoadCache} from "@/modules/Suzhou/components/Util/firstLoad";

class SelectPlanBtn extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            data: [],
            initData: [],
            activeIndex: [],
            section:[],
            selectedRowKeys: [],
            selectedRowSections: [],
            cacheSectionId:'', //缓存标段id
            cacheSectionCode:'',//缓存标段code
            sectionCode:'',//当前选择标段code
        }
    }
    
    handleClose = () => {
        this.setState({
            activeIndex:[],
            section:[],
            selectedRowKeys:[],
            selectedRowSections:[],
        })
    }
    handleOpen = () => {
        const { selectedRowKeys,selectedRowSections} = this.state;
        const sectionCode = [];
        if(selectedRowSections.length > 0){
            selectedRowSections.map(item=>{
                sectionCode.push(item.scheduleCode);
            })
            this.props.handleClock(selectedRowSections[0].id)
        }
        this.setState({
            visible: false,
            sectionCode:sectionCode.join('/'),
            cacheSectionCode:sectionCode.join('/'),
        });
    }
    componentDidMount(){
        const {data} = this.props;
        this.setState({data,initData:data})
    }
    componentWillReceiveProps (nextprops){
        if(nextprops.data !== this.props.data){
            this.setState({
                data:nextprops.data,
                initData:nextprops.data,
                selectedRowKeys:[],
                selectedRowSections:[]
            })
        }
    }
    //点击选择框
    handleVisibleChange = (visible) => {
        this.setState({ visible });
        if(visible){
            //请求获取
            const {data} = this.props;
            this.setState({data,initData:data})
        }
    }
    //搜索
    search = (value) => {
        const {initData} = this.state;
        let newData = dataUtil.search(initData,[{"key":"scheduleCode","value":value}],true);
        this.setState({data:newData});
    }
    onSelectChange = (selectedRowKeys, selectedRows) => {
        this.setState({
            selectedRowKeys,
            selectedRowSections:selectedRows,
        })
    }
    render() {
        const { data } = this.state
        const columns = [
            {
                title: '线路',
                dataIndex: 'lineName',
                key: 'lineName',
                width:'20%',
                render: (text, record) => {
                    return <span>{text ? text : ''}</span>
                }
            },
            {
                title: '时刻表编码',
                dataIndex: 'scheduleCode',
                key: 'scheduleCode',
                width:'30%',
                render: (text, record) => {
                    return <span>{text ? text : ''}</span>
                }
            },
            {
                title: '创建人',
                dataIndex: 'createrVo.name',
                key: 'createrVo.name',
                width:'20%',
            },
            {
                title: '创建时间',
                dataIndex: 'creatTime',
                key: 'creatTime',
                width:'30%',
            },
        ];
        const { selectedRowKeys,selectedRowSections } = this.state
        const rowSelection = {
            type:'radio',
            selectedRowKeys,
            selectedRowSections,
            onChange: this.onSelectChange,
        }
        const content = (
            <div className={style.main}>
                <Search search={this.search.bind(this)} placeholder={'编码'}></Search>
                <div className={style.project} >
                    <Table columns={columns}
                        dataSource={data}
                        pagination={false}
                        rowClassName={this.setClassName}
                        rowKey={record => record.id}
                        defaultExpandAllRows={true}
                        scroll={{ y: 240 }}
                        size="small"
                        rowSelection={rowSelection}
                        onRow={(record, index) => {
                            return {
                                onDoubleClick: (event) => {
                                    event.currentTarget.getElementsByClassName("ant-radio-wrapper")[0].click();
                                }
                            };
                        }
                        }
                    />
                </div>
                <div className={style.footer}>
                    <div className={style.btn}>
                        <Button onClick={this.handleClose.bind(this)}>重置</Button>
                        <Button type="primary" onClick={this.handleOpen.bind(this)}>确定</Button>
                    </div>
                </div>
            </div>
        );
        return (
            <div className={style.main}>
                <Popover
                    placement="bottomLeft"
                    content={content}
                    trigger="click"
                    visible={this.state.visible}
                    onVisibleChange={this.handleVisibleChange}
                >
                    <div className={style.titleass}>
                        <Icon type="table" />
                        {/* <span>选择标段</span> */}
                        <span>{this.state.sectionCode?this.state.sectionCode:(this.state.cacheSectionCode?this.state.cacheSectionCode:'请选择时刻表')}</span>
                        <Icon type="caret-down" />
                    </div>
                </Popover>
            </div>
        )
    }
}

export default SelectPlanBtn
