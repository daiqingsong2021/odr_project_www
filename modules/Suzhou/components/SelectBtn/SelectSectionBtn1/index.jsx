/*
 * @Author: wihoo.wanghao 
 * @Date: 2019-01-17 11:35:16 
 * @Last Modified by: wihoo.wanghao
 * @Last Modified time: 2019-03-30 18:42:06
 */

import React from 'react'
import { Icon, Popover, Button, Table,notification } from 'antd';

import style from './style.less'
import Search from "../../../../../components/public/Search"
import { throws } from 'assert';
import axios from "../../../../../api/axios"
import {getsectionId} from "../../../../../api/suzhou-api"
import * as dataUtil from "../../../../../utils/dataUtil"
import MyIcon from "../../../../../components/public/TopTags/MyIcon"

class SelectPlanBtn extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            activeIndex: [],
            rightData:[],
            data: [],
            initData: [],
            section:[]
        }
    }

    handleClose = () => {
        // this.setState({
        //     visible: false,
        // });
        this.setState({
            activeIndex:[],
            section:[]
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
        // if(activeIndex.length > 0) {
            // 记录本次打开的计划
            let lastOpenPlan = new Object();
            lastOpenPlan["sectionId"] = activeIndex;
            sessionStorage.setItem('lastOpenSection', JSON.stringify({ sectionId: activeIndex}));
            let addArr = [{ bizType: "lastOpenSection", bizs:activeIndex}];
            dataUtil.Favorites().listRest(addArr);
            const newArr =[];
            this.uniq(section,newArr);
            this.props.openSection(activeIndex,section);

        // } else {
        //     notification.warning(
        //         {
        //             placement: 'bottomRight',
        //             bottom: 50,
        //             duration: 1,
        //             message: '警告',
        //             description: '没有选择数据！'
        //         }
        //     )
        //     return
        // }
        this.setState({
            visible: false,
        });
    }
    componentDidMount(){
        const {data1} = this.props;
        this.setState({
            projectId:data1
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
            const lastOpenProjectByTask = JSON.parse(sessionStorage.getItem('lastOpenProjectByTask') || "{}");
            const projectId = this.state.projectId;
            if(projectId){
                axios.get(getsectionId(projectId)).then(res=>{
                    this.setState({
                        data:res.data.data,
                        initData:res.data.data
                    })
                })
            }else{
                if(!lastOpenProjectByTask.projectId){
                    dataUtil.Favorites().list("lastOpenProjectByTask",(res) => {  
                        if(!res.data.data){
                          //收藏  无项目
                          notification.warning(
                                {
                                    placement: 'bottomRight',
                                    bottom: 50,
                                    duration: 1,
                                    message: '警告',
                                    description: '请选择项目'
                                }
                          )
                          return
                        }else{
                            sessionStorage.setItem('lastOpenProjectByTask', JSON.stringify({ projectId:res.data.data[0]}));
                            this.setState({
                                projectId:res.data.data[0]
                            });
                            axios.get(getsectionId(res.data.data[0])).then(res=>{
                                this.setState({
                                    data:res.data.data,
                                    initData:res.data.data
                                })
                            })
                        }
                    });
                }else{
                    axios.get(getsectionId(lastOpenProjectByTask.projectId)).then(res=>{
                        this.setState({
                            data:res.data.data,
                            initData:res.data.data
                        })
                    })
                }
            }
        }
    }
    search = (value) => {
        const {initData} = this.state;
        let newData = dataUtil.search(initData,[{"key":"name|code","value":value}],true);
        this.setState({data:newData});
    }
    getInfo = (record, event) => {
        let i = this.state.activeIndex.findIndex((value) => value === record.id)
        // 选择项目
        if(record.type=="project"){

            // return
        }
        //选择标段
        if(record.type=="section"){
            
            // return
        }
        if (event.ctrlKey || event.shiftKey) {
            if (i != -1) {
                this.setState((preState, props) => {
                    preState.activeIndex.splice(i, 1);
                    return {
                        activeIndex: preState.activeIndex,
                        section:[preState.section]
                    }
                })
            } else {
                const idsArr = [];
                this.getIds([record],idsArr);
                this.setState((prevState, props) => ({
                    activeIndex: [...prevState.activeIndex, idsArr],
                    section:[...prevState.section,record]
                }));
            }
        } else {
            if (i != -1) {
                this.setState({
                    activeIndex: [],
                    section:[]
                })
            } else {
                const idsArr = [];
                this.getIds([record],idsArr);
                this.setState({
                    activeIndex: idsArr,
                    section:[record]
                })
            }
        }
    }
    getIds = (dats,idArr) => {
        if(dats){
          dats.forEach((item,index,arr) => {
            idArr.push(item.id);
            this.getIds(item.children,idArr)
          });
        }
    };
    setClassName = (record, index) => {
        //判断索引相等时添加行的高亮样式
        if (this.state.activeIndex.findIndex(value => record.id === value) > -1) {
            return 'tableActivty'
        } else {
            return "";
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
        const content = (
            <div className={style.main}>
                <Search search={this.search.bind(this)} placeholder={'编号/名称'}></Search>
                <div className={style.project} >
                    <Table columns={columns}
                        dataSource={data}
                        pagination={false}
                        rowClassName={this.setClassName}
                        rowKey={record => record.id}
                        scroll={{ y: 240 }}
                        size="small"
                        onRow={(record, index) => {
                            return {
                                onClick: (event) => {
                                    this.getInfo(record, event)
                                }
                            }
                        }
                        } />
                </div>
                <div className={style.footer}>
                    <span>按住ctrl或shift可同时选择多个标段</span>
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
                        <span>选择标段</span>
                        <Icon type="caret-down" />
                    </div>
                </Popover>
            </div>
        )
    }
}

export default SelectPlanBtn
