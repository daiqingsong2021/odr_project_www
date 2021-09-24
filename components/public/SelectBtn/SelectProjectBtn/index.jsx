/*
 * @Author: wihoo.wanghao 
 * @Date: 2019-01-17 11:35:16 
 * @Last Modified by: wihoo.wanghao
 * @Last Modified time: 2019-03-30 18:42:06
 */

import React from 'react'
import { Icon, Popover, Button, Table } from 'antd';
import style from './style.less'
import Search from "../../../../components/public/Search"
import MyIcon from "../../../../components/public/TopTags/MyIcon"
import * as dataUtil from '../../../../utils/dataUtil'
import axios from "../../../../api/axios";
import {
    getDefineListByUserAuthAndProjectId,
    planProAuthTree,
    projectUserTaskAuthSelectTree
} from "../../../../api/api";
import {getuserauthtree_} from '../../../../api/suzhou-api'


class SelectProjectBtn extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            initDone: false,
            visible: false,
            activeIndex: [],
            data: [],
            initData: []
        }
    }

    openProject = () => {

        const { activeIndex,initData,rightData} = this.state;
        if (!activeIndex && activeIndex.length > 0) {
            notification.warning({
                placement: 'bottomRight',
                bottom: 50,
                duration: 1,
                message: '警告',
                description: '没有选择数据！'
            });
            return
        }
        if (this.props.preCondtion) {
            let parent = dataUtil.getParentByConditions(initData,[{key: "id", value: activeIndex},{ key : "type", value: "define"}]) || {};
            // 缓存
            dataUtil.CacheOpenProjectByType(this.props.typeCode).addLastOpenPlan(activeIndex,activeIndex[0],parent["name"],()=>{},this.props.typeCode);
            this.props.openPlan(activeIndex,activeIndex[0],parent["name"]);
        } else {
            let projectId = activeIndex[0];
            let rightData_ = rightData[0];
            dataUtil.CacheOpenProjectByType(this.props.typeCode).addLastOpenProjectByTask(rightData_["id"], rightData_["name"], () => { },this.props.typeCode);
            this.props.openProject(projectId, { projectId: rightData_["id"], projectName: rightData_["name"] });
        }


        this.setState({
            visible: false,
        });
    }

    handleVisibleChange = (visible) => {
        this.setState({ visible });
        if (visible) {
            this.queryProjectAuthTree();
        }
    }

    queryProjectAuthTree = () => {

        const { haveTaskAuth, useProjectTeam } = this.props;
        let paramstr = "?useProjectTeam=" + (useProjectTeam ? "1" : "0")

        if (!haveTaskAuth) {
            if(this.props.preCondition){
                axios.get(getuserauthtree_(this.props.type)).then(res=>{
                    this.setState({
                        data:res.data.data,
                        initData:res.data.data
                    })
                })
            }else{
                axios.get(planProAuthTree + paramstr).then(res => {
                    const { data } = res.data
                    this.setState({
                        data: data || [],
                        initData: data
                    })
                })
            }
        } else {
            axios.get(projectUserTaskAuthSelectTree + paramstr).then(res => {
                const { data } = res.data
                this.setState({
                    data: data || [],
                    initData: data
                })
            })
        }
    }
    //双击打开
    handleDouble = (record) => {
        if (record.type == "eps") {
            return
        }
        this.setState({
            activeIndex: [record.id],
            rightData: [record]
        }, () => {
            this.openProject()
        })
    }
    getInfo = (record, event) => {
        this.setState({
            activeIndex: [record.id],
            rightData: [record]
        })
    }

    setClassName = (record, index) => {
        //判断索引相等时添加行的高亮样式
        if (record.type == 'project') {
            if (this.state.activeIndex.findIndex(value => record.id === value) > -1) {
                return 'tableActivty'
            } else {
                return "";
            }
        } else {
            return "";
        }
    }

    search = (value) => {
        const { initData } = this.state
        let newData = dataUtil.search(initData, [{ "key": "name", "value": value }], true);
        this.setState({ data: newData })
    }


    render() {

        const columns = [
            {
                title: "名称",
                dataIndex: 'name',
                key: 'name',
                render: (text, record) => {
                    if (record.type == "eps") {
                        return <span><MyIcon type="icon-xiangmuqun" style={{ fontSize: '18px' }} />{text}</span>
                    }
                    if (record.type == "project") {
                        return <span><MyIcon type="icon-xiangmu" style={{ fontSize: '18px' }} /> {text}</span>
                    }
                    if (record.type == "define") {
                        return <span><MyIcon type="icon-jihua1" style={{ fontSize: '18px' }} /> {text}</span>
                    }
                }
            }
        ]
        const content = (
            <div className={style.main}>
                <Search search={this.search} placeholder="名称"></Search>
                <div className={style.project} >
                    <Table columns={columns} dataSource={this.state.data || this.props.projectData} pagination={false}
                        rowClassName={this.setClassName}
                        rowKey={record => record.id}
                        size='small'
                        scroll={{ y: 240 }}
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
                        <Button type="primary" onClick={this.openProject.bind(this)}>打开项目</Button>
                    </div>
                </div>
            </div>
        );
        return (
            <div className={style.main}>
                <Popover
                    placement="bottomLeft"
                    content={content} trigger="click"
                    visible={this.state.visible}
                    onVisibleChange={this.handleVisibleChange}
                >
                    <div className={style.titleass}>
                        <Icon type="table" style={{ paddingRight: "5px" }} />
                        <span>选择项目</span>
                        <Icon type="caret-down" />
                    </div>
                </Popover>
            </div>
        )
    }
}

export default SelectProjectBtn
