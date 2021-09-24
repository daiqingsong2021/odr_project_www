/*
 * @Author: wihoo.wanghao 
 * @Date: 2019-01-17 11:43:11 
 * @Last Modified by: wihoo.wanghao
 * @Last Modified time: 2019-03-28 18:38:45
 */

import React, { Component } from 'react'
import { notification } from 'antd';
import DeleteTopBtn from "../../../../components/public/TopTags/DeleteTopBtn"
import PublicButton from "../../../../components/public/TopTags/PublicButton"
import SelectProjectBtn from "../../../../components/public/SelectBtn/SelectProjectBtn"
import Search from '../../../../components/public/Search'
import PublicMenuButton from "../../../../components/public/TopTags/PublicMenuButton"
import style from './style.less'
import ImportFromProject from '../../../Components/Labels/ProjectTeam/ImportFromProject';
import ImportFromOrg from "../../../Components/Labels/ProjectTeam/ImportFromOrg"
import SelectProBtn from '@/modules/Suzhou/components/SelectBtn/SelectProBtn';
export class ProjTeamTopTags extends Component {
    constructor(props) {
        super(props)
        this.state = {
            roleBtnData: []
        }
    }

  onClickHandle = (name, type) => {
      let isShowImporTwotModal = false;
      let isShowImportModal = false;
      let importModaltitle = "";
      if(name == "orgImport") {
        isShowImportModal = true;
        importModaltitle = "组织机构导入"
      } else if(name == "iptImport") {
        isShowImportModal = true;
        importModaltitle =  "IPT导入"
      } else if(name == "otherImport") {
        isShowImporTwotModal = true;
        importModaltitle =  "其他项目导入"
      }
      this.setState({
        isShowImporTwotModal: isShowImporTwotModal,
        isShowImportModal:isShowImportModal,
        ImportModaltitle:importModaltitle
      });
  }
  closeImportFromOrg = () => {
    this.setState({
      isShowImportModal: false
    })
  }
  closeImportFromProject = () => {
    this.setState({
      isShowImporTwotModal: false
    })
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
                    <Search search={this.props.search.bind(this)} />
                </div>
                <div className={style.tabMenu}>
                    {/*选择项目*/}
                    {/* <SelectProjectBtn haveTaskAuth = {false} openProject={this.props.openProject }/> */}
                    <SelectProBtn  openPro={this.props.openProject} />
                    {/*新增*/}
                    <PublicButton name={'新增'} title={'新增'} edit={true} icon={'icon-add'} afterCallBack={this.props.addData} />
                    {/* 同步标段 */}
                    <PublicButton name={'同步标段'} show={this.props.showBtn} title={'同步标段'} edit={true} icon={'icon-add'} afterCallBack={this.props.addSection} />
                    {/*删除*/}
                    <PublicButton title={"删除"} useModel={true} verifyCallBack={this.deleteVerifyCallBack} afterCallBack={this.props.deleteData.bind(this, "DeleteTopBtn")} icon={"icon-delete"} edit={this.props.data && this.props.data.type=="project"? false:true}/>
                    {/*导入*/}
                    <PublicMenuButton title={"导入"} edit={true} afterCallBack={this.onClickHandle} icon={"icon-daoru2"}
                                      menus={[{ key: "orgImport", label: "组织机构导入", edit: true,icon:"icon-zuzhijigou"},
                                        // { key: "iptImport", label: "IPT导入", edit: true ,icon:"icon-IPT"},
                                        { key: "otherImport", label: "其他项目导入", edit: true,icon: "icon-xiangmu" }]}
                    />
                     <PublicButton title={'上移'} icon={'icon-moveUp'}
                         afterCallBack={this.props.updateProjectTeamSort.bind(this, 'up')}/>
                     <PublicButton title={'下移'} icon={'icon-moveDown'}
                        afterCallBack={this.props.updateProjectTeamSort.bind(this, 'down')}/>
                    {
                      this.state.isShowImportModal &&
                      (
                        <ImportFromOrg bizType={this.props.bizType} bizId = {this.props.bizId }
                                       title={this.state.ImportModaltitle} visible={true}
                                       handleCancel={this.closeImportFromOrg.bind(this)}
                                       record={this.props.rightData && this.props.rightData.type != 'project' ? this.props.rightData : null}
                                       getDataList={this.props.getList}
                        />
                      )
                    }
                    {
                      this.state.isShowImporTwotModal &&
                      (
                        <ImportFromProject bizType={this.props.bizType} bizId = {this.props.bizId }
                                           title={this.state.ImportModaltitle}
                                           visible={this.state.isShowImporTwotModal}
                                           handleCancel={this.closeImportFromProject.bind(this)}
                                           getDataList={this.props.getList} />
                      )
                    }

                </div>
              
            </div>

        )
    }
}

export default ProjTeamTopTags
