/*
 * @Author: wihoo.wanghao 
 * @Date: 2019-01-17 11:35:16 
 * @Last Modified by: wihoo.wanghao
 * @Last Modified time: 2019-03-30 18:42:06
 */

import React from 'react'
import { Icon, Popover, Button, Table } from 'antd';
import intl from 'react-intl-universal'
import style from './style.less'
import Search from "../../../../components/public/Search"
import { throws } from 'assert';
import MyIcon from "../../../../components/public/TopTags/MyIcon"
import * as dataUtil from  '../../../../utils/dataUtil'


class SelectProjectBtn extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            initDone: false,
            visible: false,
            activeIndex: [],
            data: null,
        }
    }

    handleKeyPress = (e) => {}
    
    handleKeyup = (e) => {}

    handleClose = () => {
        this.setState({
            visible: false,
        });
    }

    handleOpen = () => {
        const { rightData } = this.state
        if(rightData) {
            this.props.getPlanDelvTreeList(rightData.id,rightData)
        } else {
            
        }
        return
        this.setState({
            visible: false,
        });
    }

    handleVisibleChange = (visible) => {
        this.setState({ visible });
    }

    getInfo = (record, event) => {
        if(record.type=="eps"){
            return 
        }
        this.setState({
            activeIndex:record.id,
            rightData:record
        })
    }

    setClassName = (record, index) => {
        //判断索引相等时添加行的高亮样式
        return record.id === this.state.activeIndex ? "tableActivty" : "";
    }


    search = (value) =>{
        const { projectData } = this.props
        let newData = projectData;
        newData = dataUtil.search(projectData,[{"key": "name","value":value},{"key":"type","value":"project"}],true);
        this.setState({data:newData})
    }


    render() {
        
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
                <Search search={this.search}></Search>
                <div className={style.project} >
                    <Table columns={columns} dataSource={this.state.data || this.props.projectData} pagination={false}
                        rowClassName={this.setClassName}
                        rowKey={record => record.id}
                        size = 'small'
                        scroll={{ y: 240 }}
                        onRow={(record, index) => {
                            return {
                                onClick: (event) => {
                                
                                    this.getInfo(record, event)

                                }

                            }
                        }
                        }  />
                </div>
                <div className={style.footer}>
                    {/* <span>按住ctr或shift可同时选择多个项目</span> */}
                    <div className={style.btn}>
                        {/* <Button onClick={this.handleClose.bind(this)}>关闭项目</Button> */}
                        <Button type="primary" onClick={this.handleOpen.bind(this)}>打开项目</Button>
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