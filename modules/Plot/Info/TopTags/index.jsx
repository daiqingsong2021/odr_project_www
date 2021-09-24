/*
 * @Author: wihoo.wanghao 
 * @Date: 2019-01-17 11:43:11 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2019-02-14 17:35:39
 */

import React, { Component } from 'react'
import { Divider, notification } from 'antd';
import Search from '../../../../components/public/Search'
import style from './style.less'
import PublicButton from "../../../../components/public/TopTags/PublicButton"
import PublicViewButton from "../../../../components/public/TopTags/PublicViewButton"
export class PlanDefineTopTags extends Component {
    constructor(props) {
        super(props)
        this.state = {
            roleBtnData: [
                {
                    id: 1,
                    name: "TreeTileViewBtn",
                    aliasName: "平铺树状切换"
                },
                {
                    id: 2,
                    name: 'AddTopBtn',
                    aliasName: '新增'
                },
                {
                    id: 3,
                    name: 'DeleteTopBtn',
                    aliasName: '删除'
                },
                {
                    id: 4,
                    name: 'MoveTDTopBtn',
                    aliasName: '移动'
                }
            ]
        }
    }
    onClickHandle = (name, menu) => {
        if (name === 'TreeTileViewBtn') {

            this.props.onClickHandle(menu)
            return
        }
      
        if (name == "DeleteTopBtn") {

            this.props.deleteData()
        }
    }
   
    //点击验证
    deleteVerifyCallBack = () => {
        if (!this.props.data) {
            notification.warning(
                {
                    placement: 'bottomRight',
                    bottom: 50,
                    duration: 2,
                    message: '未选中数据',
                    description: '请选择数据进行操作'
                }
            )
            return false
        } else {
            return true
        }
    }

    render() {
        return (
            <div className={style.main}>
                <div className={style.search}>
                    <Search search={this.props.search} />
                </div>
                <div className={style.tabMenu}>
                    {/* <TreeTileViewBtn onClickHandle={this.onClickHandle} /> */}
                    <PublicViewButton afterCallBack={this.props.onClickHandle} icon={"icon-ziyuanshituxuanze"} currentIndex={this.props.view=="tile" ? 1:0}
                        menus={[{ key: "tree", label: "树状视图", edit: true },
                        { key: "tile", label: "平铺视图", edit: true}]}/>
                    <Divider type="vertical" />
                    {/*新增*/}

                    <PublicButton name={'新增'} title={'新增'} icon={'icon-add'} afterCallBack={this.props.onClickHandleAdd} />

                    {/*删除*/}
                    <PublicButton title={"删除"} useModel={true} verifyCallBack={this.deleteVerifyCallBack} 
                    afterCallBack={this.onClickHandle.bind(this, "DeleteTopBtn")} icon={"icon-delete"} 
                    edit={ this.props.data && this.props.data.type=="eps" ? false : true}/>
                </div>
                
            </div>

        )
    }
}

export default PlanDefineTopTags
