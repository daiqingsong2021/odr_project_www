/*
 * @Author: wihoo.wanghao 
 * @Date: 2019-01-17 11:43:11 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2019-01-26 11:08:53
 */

import React, { Component } from 'react'
import dynamic from 'next/dynamic'
import Search from '../../../../components/public/Search'
import style from './style.less'
import emitter from '../../../../api/ev'
import VarAdd from '../Add'
export class PlanDefineTopTags extends Component {
    constructor (props) {
        super(props)
        this.state = {
            roleBtnData: [
                {
                    id: 1,
                    name: 'AddTopBtn',
                    aliasName: '新增'
                },
                {
                    id: 2,
                    name: 'DeleteTopBtn',
                    aliasName: '删除'
                }
                
            ],
            modelTitle:'',
            modalVisible:false
        }
    }
    // modal取消
    handleCancel = () => {
        this.setState({
            modalVisible: false
        })
    }
    onClickHandle=(value,menu)=>{
        if(value === 'ImportTopBtn') {
            if(menu=="从组织导入")
            emitter.emit('noticeUpdateEvents', {status: 'import', data: {}})
            
        }
        if(value === 'AddTopBtn'){
            this.setState({modalVisible:true,modelTitle:'新增流程变量定义'});
        }
    }
    render() {
        let topTags = this.state.roleBtnData.map((v, i) => {
            return dynamic(import('../../../../components/public/TopTags/' + v.name))
        })
         // 显示表单弹窗
    let showFormModal = () => {
        this.setState({
            modalVisible: true
        })
    }
        return (
            <div className={style.main}>
                <div className={style.search}>
                    <Search />
                </div>
                <div className={style.tabMenu}>
                    {
                        topTags.map((Component, i) => {
                            return <Component key={i} onClickHandle={this.onClickHandle}/>
                        })
                    }
                </div>
                <VarAdd modalVisible={this.state.modalVisible} handleCancel={this.handleCancel} modelTitle={this.state.modelTitle}/>
            </div>
            
        )
    }
}

export default PlanDefineTopTags
