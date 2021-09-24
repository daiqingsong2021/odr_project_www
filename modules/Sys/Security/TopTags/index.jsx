/*
 * @Author: wihoo.wanghao 
 * @Date: 2019-01-17 11:43:11 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2019-01-26 11:08:53
 */

import React, { Component } from 'react'
import Search1 from '../../../../components/public/Search'
import style from './style.less'
import { Select, Input, TreeSelect } from "antd"
import axios from "../../../../api/axios"
import { getdictTree, orgTree, getOrgTree } from "../../../../api/api"
import MyIcon from "../../../../components/public/TopTags/MyIcon"
const Option = Select.Option
const Search = Input.Search;
export class PlanDefineTopTags extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }

    //获取密级
    getSecutyLevelList = () => {
        if (!this.state.secutyLevelList) {
            axios.get(getdictTree("comm.secutylevel")).then(res => {
                if (res.data.data) {
                    this.setState({
                        secutyLevelList: res.data.data,
                    })
                }
            })
        }

    }
    //获取部门
    getOrg = () => {
        if(!this.state.orgTree){
            axios.get(orgTree).then(res => {
                if (res.data.data) {
                    let data=res.data.data
                   
                    let loop=(array)=>{
                        array.forEach(item=>{
                           
                            if(item.type == 0){
                                item.title= <span><MyIcon type="icon-gongsi" style={{fontSize:14,marginRight:5}}/>{item.title}</span>
                            }
                            if(item.type ==1){
                                item.title= <span><MyIcon type="icon-bumen1" style={{fontSize:14,marginRight:5}}/>{item.title}</span>
                            }
                            if(item.children){
                                loop(item.children)
                            }
                        })
                    }
                    loop(data)
                    this.setState({ orgTree: data })
                }
    
            })
        }
        
    }
    //获取组织
    getOrgList = () => {
        if(!this.state.orgTreeList){
            axios.get(getOrgTree).then(res => {
                if (res.data.data) {
                    let data=res.data.data
                 
                    this.setState({ orgTreeList: data })
                    
                }
    
            })
        }
       
    }
    render() {


        return (
            <div className={style.main}>
               
                <div className={style.tabMenu}>
                    <span>密级:  <Select onDropdownVisibleChange={this.getSecutyLevelList}
                        size="small" style={{ width: 150, marginRight: 20 }} onChange={this.props.selectLevel} allowClear
                    >
                        {this.state.secutyLevelList && this.state.secutyLevelList.map(item => {
                            return <Option value={item.value} key={item.value}>{item.title}</Option>
                        })}
                    </Select></span>
                
                    <span>归属部门:  <TreeSelect size="small" style={{ width: 150, marginRight: 20 }}
                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                        treeData={this.state.orgTree ? this.state.orgTree : []}
                        allowClear
                    
                        treeDefaultExpandAll
                        onChange={this.props.selectDepartment}
                        onFocus={this.getOrg}
                    /></span>
                    <span>搜索: <Search size="small" placeholder="姓名/用户名" onSearch={this.props.searchName} style={{ width: 150 }} /></span>
                </div>

            </div>

        )
    }
}

export default PlanDefineTopTags
