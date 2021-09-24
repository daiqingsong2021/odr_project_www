/*
 * @Author: wihoo.wanghao 
 * @Date: 2019-01-17 11:35:16 
 * @Last Modified by: wihoo.wanghao
 * @Last Modified time: 2019-03-30 18:42:06
 */

import React from 'react'
import { Icon, Popover, Button, Table,notification } from 'antd';

import style from './style.less'
import Search from "../../../../components/public/Search"
import { throws } from 'assert';
import axios from "../../../../api/axios"
import {getuserauthtree_} from '../../../../api/suzhou-api'
import * as dataUtil from "../../../../utils/dataUtil"
import MyIcon from "../../../../components/public/TopTags/MyIcon"

class SelectPlanBtn extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            activeIndex: [],
            rightData:[],
            data: [],
            initData: []
        }
    }

    //判断数组a中是否包含b
  isContained = (a, b) =>{
    if (!(a instanceof Array) || !(b instanceof Array)){
      return false;
    }
    if(a.length < b.length){
      return false;
    }
    var aStr = a.toString();
    for (var i =0,len = b.length; i < len; i++){
      if (aStr.indexOf(b[i]) == -1){
        return false;
      }
      return true;
    }
  }


  handleClose = () => {
      //获取已经打开的计划
      let lastOpenPlanId = JSON.parse(sessionStorage.getItem("lastOpenPlan")) ? JSON.parse(sessionStorage.getItem("lastOpenPlan")).planId : "-1";
      let openPlanIds = [];

      const { activeIndex, projectId, initData} = this.state;
      if(!activeIndex || activeIndex.length == 0) {
        notification.warning({
          placement: 'bottomRight',
          bottom: 50,
          duration: 1,
          message: '警告',
          description: '没有选择数据！'
        });
        return
      }
      if(!this.isContained(lastOpenPlanId,activeIndex)) {
        notification.warning({
          placement: 'bottomRight',
          bottom: 50,
          duration: 1,
          message: '警告',
          description: '存在没有打开的计划！'
        });
        return
      }
      //本次打开的计划 = 上次打开的计划 - 本次关闭的计划
      lastOpenPlanId.forEach( planId => {
        if(activeIndex.indexOf(planId) === -1){
          openPlanIds.push(planId);
        }
      })

      let parent = dataUtil.getParentByConditions(initData,[{key: "id", value: openPlanIds},{ key : "type", value: "define"}]) || {};
      // 缓存
      dataUtil.CacheOpenProjectByType(this.props.typeCode).addLastOpenPlan(openPlanIds,projectId,parent["name"],()=>{},this.props.typeCode);
      this.props.openPlan(openPlanIds,projectId,parent["name"]);

      this.setState({
            visible: false,
        });
    }

    handleOpen = () => {
        const { activeIndex, projectId, initData} = this.state;
        if(!activeIndex || activeIndex.length == 0) {
            notification.warning({
                placement: 'bottomRight',
                bottom: 50,
                duration: 1,
                message: '警告',
                description: '没有选择数据！'
            });
            return
        }
        let parent = dataUtil.getParentByConditions(initData,[{key: "id", value: activeIndex},{ key : "type", value: "define"}]) || {};
        // 缓存
        dataUtil.CacheOpenProjectByType().addLastOpenPlan(activeIndex,projectId,parent["name"],()=>{},this.props.typeCode);
        this.props.openPlan(activeIndex,projectId,parent["name"]);

        this.setState({
            visible: false,
        });
    }

    handleVisibleChange = (visible) => {
        this.setState({ visible });
        if(visible){
            axios.get(getuserauthtree_(this.props.type)).then(res=>{
                this.setState({
                    data:res.data.data,
                    initData:res.data.data
                })
            })
        }
    }
    search = (value) => {
        const {initData} = this.state;
        let newData = dataUtil.search(initData,[{"key":"name","value":value}],true);
        this.setState({data:newData});
    }
    //双击打开
    handleDouble=(record)=>{
        let i = this.state.activeIndex.findIndex((value) => value === record.id)
        if(record.type=="eps"){
            return
        }
        //选择项目
        if(record.type=="project"){
            return
        }
        this.setState({
            activeIndex: [record.id],
            projectId : record.parentId
        },()=>{
            this.handleOpen()
        })
    }
    getInfo = (record, event) => {

        let i = this.state.activeIndex.findIndex((value) => value === record.id)
        if(record.type=="eps"){
            return
        }
        //选择项目
        if(record.type=="project"){
            return
        }
        if (event.ctrlKey || event.shiftKey) {
            if (i != -1) {
                this.setState((preState, props) => {
                    preState.activeIndex.splice(i, 1)

                    return {
                        activeIndex: preState.activeIndex,
                        projectId : record.parentId
                    }
                })
            } else {
                this.setState((prevState, props) => ({
                    activeIndex: [...prevState.activeIndex, record.id],
                    projectId : record.parentId
                }));
            }

        } else {
            if (i != -1) {
                this.setState({
                    activeIndex: []
                })
            } else {
                this.setState({
                    activeIndex: [record.id],
                    projectId : record.parentId
                })
            }
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
                <Search search={this.search.bind(this)} placeholder="名称"></Search>
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
                                },
                                onDoubleClick:(event)=>{
                                    this.handleDouble(record)
                                }

                            }
                        }
                        } />
                </div>
                <div className={style.footer}>
                    <span>按住ctr可同时选择多个计划</span>
                    <div className={style.btn}>
                        <Button onClick={this.handleClose.bind(this)}>关闭计划</Button>
                        <Button type="primary" onClick={this.handleOpen.bind(this)}>打开计划</Button>
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
                        <Icon type="table" style={{ paddingRight: "5px" }} />
                        <span>选择计划</span>
                        <Icon type="caret-down" />
                    </div>
                </Popover>
            </div>
        )
    }
}

export default SelectPlanBtn
