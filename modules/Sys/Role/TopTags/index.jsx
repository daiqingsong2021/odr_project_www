
import React, { Component } from 'react'
import dynamic from 'next/dynamic'
import Search from '../../../../components/public/Search'
import style from './style.less'
import PublicButton from '../../../../components/public/TopTags/PublicButton'
import axios from '../../../../api/axios'
import { orgSearch } from '../../../../api/api'

export class SysRoleTopTags extends Component {
    constructor(props) {
        super(props)
        this.state = {
            roleBtnData: [
                {
                    id: 1,
                    name: 'ValidTopBtn',
                    aliasName: '有效'
                },
                {
                    id: 2,
                    name: 'ImportTableTopBtn',
                    aliasName: '导入表格'
                },
                {
                    id: 3,
                    name: 'ExportTableTopBtn',
                    aliasName: '导出表格'
                },
            ]
        }
    }

    search = (val) => {
            this.props.search(val)
    }
    // btnClicks = (name) => {
    // }

    render() {
        let topTags = this.state.roleBtnData.map((v, i) => {
            return dynamic(import('../../../../components/public/TopTags/' + v.name))
        })
        return (
            <div className={style.main}>
                <div className={style.search}>
                    <Search search={this.search} />
                </div>
                <div className={style.tabMenu}>
                    {/* <PublicButton name={'同步组织'} title={'同步组织'} icon={'icon-add'}
                        afterCallBack={this.props.importData.bind(this, 'addOrg')}
                        res={'MENU_EDIT'}
                    />
                    <PublicButton name={'同步人员'} title={'同步人员'} icon={'icon-add'}
                        afterCallBack={this.props.importData.bind(this, 'addPeople')}
                        res={'MENU_EDIT'}
                    /> */}
                    {/* <PublicButton name={'导入表格'} title={'导入表格'} icon={'icon-daorubiaoge'}
                        afterCallBack={this.btnClicks.bind(this, 'ImportTableTopBtn')}
                        res={'MENU_EDIT'}
                    />
                    <PublicButton name={'导出表格'} title={'导出表格'} icon={'icon-daochubiaoge'}
                        afterCallBack={this.btnClicks.bind(this, 'ExportTableTopBtn')}
                        res={'MENU_EDIT'}
                    /> */}
                </div>

            </div>
        )
    }
}

export default SysRoleTopTags



