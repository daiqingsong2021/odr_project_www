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
import {planProAuthTree} from "../../../../../api/suzhou-api"
import * as dataUtil from "../../../../../utils/dataUtil"
import MyIcon from "../../../../../components/public/TopTags/MyIcon"
import {firstLoadCache} from "@/modules/Suzhou/components/Util/firstLoad";
import {tree2list} from "@/modules/Suzhou/components/Util/util.js";

class SelectPlanBtn extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            activeIndex: [],   //projectId
            rightData:[],
            data: [],
            initData: [],
            projectName:'', //项目名称
            cacheProjectId:'',
            cacheProjectName:''
        }
    }
    componentDidMount(){
        firstLoadCache().then(res=>{
            this.setState({
                cacheProjectId:res.projectId,
                cacheProjectName:res.projectName,
            })
        })
    }
    handleClose = () => {
        this.setState({
            visible: false,
        });
    }

    handleOpen = () => {
        const { activeIndex,projectId,projectName } = this.state;
        if(activeIndex.length > 0) {
            // 记录本次打开的计划
            let lastOpenPlan = new Object();
            lastOpenPlan["projectId"] = activeIndex;
            sessionStorage.setItem('lastOpenSection','');
            const addArr = [{ bizType: "lastOpenProjectByTask", bizs:activeIndex},{ bizType: "lastOpenProjectName", bizs:[projectName]},{ bizType: "lastOpenSection", bizs:[]},{ bizType: "lastOpenSectionCode", bizs:[]}];
            dataUtil.Favorites().listRest(addArr);
            sessionStorage.setItem('lastOpenProjectByTask', JSON.stringify({ projectId: activeIndex[0],projectName:projectName}));
            this.props.openPro(activeIndex,projectId,projectName);
        } else {
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
        this.setState({
            visible: false,
        });
    }

    handleVisibleChange = (visible) => {
        this.setState({ visible });
        if(visible){
            //获取项目内容
            axios.get(planProAuthTree).then(res=>{
                if(res.data.data.length == 0){
                    notification.warning(
                        {
                          placement: 'bottomRight',
                          bottom: 50,
                          duration: 2,
                          message: '没有数据',
                          description: '无项目数据'
                        }
                      )
                }else{
                    this.setState({
                        data:tree2list(res.data.data,[]),
                        initData:tree2list(res.data.data,[])
                    })
                }
            })
        }
    }
    // //树=>列表
    //  tree2list=(array,newList)=>{
    //   if(array){
    //     array.forEach((item,index,arr)=>{
    //       var obj = item;
    //       if(item.type == 'project'){
    //         newList.push(item)
    //       }
    //       if(item.children){
    //         this.tree2list(item.children,newList);
    //       }
    //     })
    //     return newList
    //   }
    // }
    search = (value) => {
        const {initData} = this.state;
        let newData = dataUtil.search(initData,[{"key":"name","value":value}],true);
        this.setState({data:newData});
    }
    getInfo = (record, event) => {
        let i = this.state.activeIndex.findIndex((value) => value === record.id)
        // 选择项目
        if(record.type=="eps"){
            return
        }
        //选择标段
        if(record.type=="section"){
            return
        }
        if (i != -1) {
            this.setState({
                activeIndex: [],
                projectName:''
            })
        } else {
            this.setState({
                activeIndex: [record.id],   //项目id
                projectId : record.parentId,
                projectName:record.name
            })
        }
    }

    setClassName = (record, index) => {
        //判断索引相等时添加行的高亮样式
        if (this.state.activeIndex.findIndex(value => record.id === value) > -1) {
            return 'tableActivty'
        } else {
            return "";
        }

    }
    //双击
    handleDouble = (record)=>{
        if (record.parentId == 0) {
            return
        }
        this.setState({
            activeIndex: [record.id],   //项目id
            projectId : record.parentId,
            projectName:record.name
        }, () => {
            this.handleOpen()
        })
    }
    render() {
        const { data } = this.state
        const columns = [
            {
                title: "名称",
                dataIndex: 'name',
                key: 'name',
                render: (text,record)=>{
                    if(record.type=="eps"){
                        return <span><MyIcon type="icon-xiangmuqun" style={{ fontSize: '18px' }} />{text}</span>
                    }
                    if(record.type=="project"){
                        return <span><MyIcon type="icon-xiangmu" style={{ fontSize: '18px' }} /> {text}</span>
                    }
                    if(record.type=="define"){
                        return <span><MyIcon type="icon-jihua1" style={{ fontSize: '18px' }} /> {text}</span>
                    }
                }
            }
        ]
        const content = (
            <div className={style.main}>
                <Search search={this.search.bind(this)} placeholder={'项目'}></Search>
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
                                }, onDoubleClick: (event) => {
                                    this.handleDouble(record)
                                }
                            }
                        }
                        } />
                </div>
                <div className={style.footer}>
                    <div className={style.btn}>
                        <Button onClick={this.handleClose.bind(this)}>关闭</Button>
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
                    <div className={style.titleass} style={{ marginRight: "8px" }} >
                        <Icon type="table"/>
                        <span>{this.state.projectName?this.state.projectName:(this.state.cacheProjectName?this.state.cacheProjectName:'请选择项目')}</span>
                        <Icon type="caret-down" />
                    </div>
                </Popover>
            </div>
        )
    }
}

export default SelectPlanBtn
