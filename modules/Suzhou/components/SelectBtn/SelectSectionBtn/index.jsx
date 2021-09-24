import React from 'react'
import { Icon, Popover, Button, Table,notification } from 'antd';

import style from './style.less'
import Search from "../../../../../components/public/Search"
import { throws } from 'assert';
import axios from "../../../../../api/axios"
import {getsectionId} from "../../../../../api/suzhou-api"
import * as dataUtil from "../../../../../utils/dataUtil"
import MyIcon from "../../../../../components/public/TopTags/MyIcon"
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
    uniq=(array,temp)=>{
        for(var i = 0; i < array.length; i++){
            if(temp.indexOf(array[i]) == -1){
                temp.push(array[i]);
            }
        }
    }
    handleOpen = () => {
        const { activeIndex,projectId ,section} = this.state;
        const { selectedRowKeys,selectedRowSections} = this.state;
        const sectionCode = [];
        if(selectedRowSections.length > 0){
            selectedRowSections.map(item=>{
                sectionCode.push(item.code);
            })
        }
        sessionStorage.setItem('lastOpenSection', JSON.stringify({ sectionId: selectedRowKeys,sectionCode:sectionCode}));
        let addArr = [{ bizType: "lastOpenSection", bizs:selectedRowKeys},{ bizType: "lastOpenSectionCode", bizs:sectionCode}];
        dataUtil.Favorites().listRest(addArr);
        this.props.openSection(selectedRowKeys,selectedRowSections);
        this.setState({
            visible: false,
            sectionCode:sectionCode.join('/'),
            cacheSectionCode:sectionCode.join('/'),
        });
    }
    componentDidMount(){
        const {data1} = this.props;
        this.setState({
            projectId:data1,
        }) 
        firstLoadCache().then(res=>{
            this.setState({
                cacheSectionId:res.sectionId,
                cacheSectionCode:res.sectionCode,
            },()=>{
                const dataStrArr = !this.state.cacheSectionId?[]:this.state.cacheSectionId.split(",");
                if(dataStrArr.length > 0){
                    const dataIntArr = [];
                    dataStrArr.map(item => {  
                        dataIntArr.push(+item);  
                    });
                    this.setState({
                        selectedRowKeys:dataIntArr
                    })
                }
            })
        })
    }
    componentWillReceiveProps (nextprops){
        if(nextprops.data1 !== this.props.data1){
            this.setState({
                projectId:nextprops.data1
            })
        }
    }
    handleVisibleChange = (visible) => {
        this.setState({ visible });
        if(visible){
            //请求获取标段
            const projectId = this.state.projectId;
            if(projectId){
                axios.get(getsectionId(projectId)).then(res=>{
                    this.setState({
                        data:res.data.data,
                        initData:res.data.data
                    },()=>{
                        firstLoadCache().then(res=>{
                            const {selectedRowKeys} = this.state;
                            const row = [];
                            if(selectedRowKeys.length > 0){
                                selectedRowKeys.map(item=>{
                                    const {initData} = this.state;
                                    let record = initData.find(data=>data.id == item)
                                    row.push(record);
                                })
                            }
                            this.setState({
                                selectedRowSections:row
                            })
                        })
                    })
                })
            }else{
                notification.warning(
                    {
                        placement: 'bottomRight',
                        bottom: 50,
                        duration: 1,
                        message: '警告',
                        description: '请选择项目'
                    }
                )
            }
        }
    }
    search = (value) => {
        const {initData} = this.state;
        let newData = dataUtil.search(initData,[{"key":"name|code","value":value}],true);
        this.setState({data:newData});
    }
    onSelectChange = (record, selected, selectedRows, event) => {
        //record        选择的数据包括子集
        //selected      true
        //selectedRows  仅仅是选择的当前条数据
        const { selectedRowKeys,selectedRowSections } = this.state;
        const index = selectedRowKeys.findIndex(key => key === record.id)
        if (index >= 0) {
            selectedRowKeys.splice(index, 1)
            selectedRowSections.splice(index,1);
            if (record.children) {
                record.children.map(v => {
                    const index2 = selectedRowKeys.findIndex(key => key === v.id)
                    selectedRowKeys.splice(index2, 1)
                    selectedRowSections.splice(index2,1);
                })
            }
        } else {
            selectedRowKeys.push(record.id);
            selectedRowSections.push(record);
            if (record.children) {
                record.children.map(v => {
                    const index2 = selectedRowKeys.findIndex(key => key === v.id)
                    index2 >= 0 ? null : selectedRowKeys.push(v.id) , selectedRowSections.push(v)
                })
            }
        }
        this.setState({
            selectedRowKeys,
            selectedRowSections,
        })
    }
    //全选
    onSelectAll = (selected, selectedRows, changeRows) => {
        const { selectedRowKeys, data ,selectedRowSections} = this.state
        if (selectedRowKeys.length > 0) {
            this.setState({
                selectedRowKeys: [],
                selectedRowSections:[]
            })
        } else {
            selectedRows.map(v => {
                selectedRowKeys.push(v.id);
                selectedRowSections.push(v);
            })
            this.setState({
                selectedRowKeys,
                selectedRowSections
            })
        }
    }
    render() {
        const { data } = this.state
        const columns = [
            {
                title: "编号",
                dataIndex: 'code',
                key: 'code',
                width:'40%',
                render: (text,record)=>{
                    return <span><MyIcon type="icon-xiangmuqun" style={{ fontSize: '18px' }} /> {text}</span>
                    // if(record.typeCode=="project"){
                    //     return <span><MyIcon type="icon-xiangmuqun" style={{ fontSize: '18px' }} />{text}</span>
                    // }
                    // if(record.typeCode=="section"){
                    //     return <span><MyIcon type="icon-xiangmu" style={{ fontSize: '18px' }} /> {text}</span>
                    // }
                    // if(record.typeCode=="define"){
                    //     return <span><MyIcon type="icon-jihua1" style={{ fontSize: '18px' }} /> {text}</span>
                    // }
                }
            },
            {
                title: "名称",
                dataIndex: 'name',
                key: 'name',
                width:'40%',
            },
            {
                title: "类型",
                dataIndex: 'typeName',
                key: 'typeName',
                width:'20%',
            }
        ]
        const { selectedRowKeys,selectedRowSections } = this.state
        const rowSelection = {
            selectedRowKeys,
            selectedRowSections,
            onSelect: this.onSelectChange,
            getCheckboxProps: record => ({}),
            onSelectAll: this.onSelectAll
        }
        const content = (
            <div className={style.main}>
                <Search search={this.search.bind(this)} placeholder={'编号/名称'}></Search>
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
                                    event.currentTarget.getElementsByClassName("ant-checkbox-wrapper")[0].click();
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
                        <span>{this.state.sectionCode?this.state.sectionCode:(this.state.cacheSectionCode?this.state.cacheSectionCode:'请选择标段')}</span>
                        <Icon type="caret-down" />
                    </div>
                </Popover>
            </div>
        )
    }
}

export default SelectPlanBtn
