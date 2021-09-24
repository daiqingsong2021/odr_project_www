import Approval from '../Workflow/Approval'
import React, { Component } from 'react'
import Search from '../../../../components/public/Search'
import style from './style.less'
import PublicButton from "../../../../components/public/TopTags/PublicButton"
import PublicMenuButton from "../../../../components/public/TopTags/PublicMenuButton"
import UploadDoc from '../Upload/index'
import Publicd from '../Publicd/index'
import Upgrade from '../Upgrade/index'
import Distribute from '../Distribute/index'
import Mail from '../Mail/index'
import * as dataUtil from "../../../../utils/dataUtil";

export class DocTempDoc extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modalVisible: false,
            UploadVisible: false,
            PublicdVisible: false,
            UpgradeVisible: false,
            DistributeVisible: false,
            showApprovalVisible: false,
            MailVisible: false,
            visible: false
        }
    }

    /**
     * 打开发布/发布审批窗口
     * @param name
     */
    showReleaseModal = (name) => {
        let { selectProjectName } = this.props;
        if (name == "approve") {
            this.setState({ showApprovalVisible: true, projectName: "[" + selectProjectName + "]" });
        }
        if (name == "direct") {
            this.setState({ PublicdVisible: true, projectName: "[" + selectProjectName + "]" });
        }
    }
    /**
     *  打开上传文件窗口
     *
     **/
    showUpLoadModal = () => {
        if (!this.props.leftData) {
            dataUtil.message('请选择文件夹进行操作');
            return;
        }
        this.setState({ UploadVisible: true })
    }
    /**
     * 打开分发窗口
     *
     **/
    showOutgivingModal = () => {
        if (!this.props.leftData) {
            dataUtil.message('请选择文件夹进行操作');
            return;
        }
        this.setState({ DistributeVisible: true })
    }
    /**
     * 升版功能
     **/
    upgrade = () => {
        if (!this.props.rightData) {
            dataUtil.message('请选择文档进行操作');
            return;
        }
        if (this.props.rightData.status.id != "RELEASE") {
            dataUtil.message("请选择已发布的文档进行升版!");
            return;
        }
        this.setState({ UpgradeVisible: true });
    }
    /**
     * 打开发送邮件功能
     **/
    showMailModal = () => {
        this.setState({ MailVisible: true })
    }

    render() {

        return (
            <div className={style.main}>
                <div className={style.search}>
                    <Search search={this.props.search} placeholder="文档标题/文档编号" />
                </div>
                <div className={style.tabMenu}>
                    {/*上传*/}
                    <PublicButton name={'上传'} title={'上传'} icon={'icon-shangchuanwenjian'} afterCallBack={this.showUpLoadModal} />
                    {/*发布*/}
                    <PublicMenuButton title={"发布"} afterCallBack={this.showReleaseModal} icon={"icon-fabu"}
                        menus={[{ key: "direct", label: "直接发布", icon: "icon-fabu", edit: true },
                        { key: "approve", label: "发布审批", icon: "icon-shenpi1", edit: true }]} />
                    {/*分发*/}
                    <PublicButton name={'分发'} title={'分发'} icon={'icon-fenfa'} afterCallBack={this.showOutgivingModal} />
                    {/*升级*/}
                    <PublicButton name={'升版'} title={'升版'} icon={'icon-shengjibanben'} afterCallBack={this.upgrade} />
                    {/*邮件*/}
                    {/* <PublicButton name={'邮件'} title={'邮件'} icon={'icon-message'} afterCallBack={this.showMailModal} /> */}
                    {/*下载*/}
                    <PublicButton name={'下载'} title={'下载'} icon={'icon-xiazaiwenjian'} afterCallBack={this.props.download} />
                    {/*删除*/}
                    <PublicButton title={"删除"} useModel={true} verifyCallBack={this.props.deleteVerifyCallBack} afterCallBack={this.props.deleteData} icon={"icon-delete"} />
                </div>

                {/* 上传文档 */}
                {this.state.UploadVisible && <UploadDoc handleCancel={() => { this.setState({ UploadVisible: false }) }}
                    projectId={this.props.projectId} data={this.props.leftData} addData={this.props.rightAddData} folderUpdate={this.props.folderUpdate}
                    bizType={this.props.bizType} startContent={this.props.startContent}
                />}
                {/* 发布 */}
                {this.state.PublicdVisible && <Publicd modalVisible={this.state.PublicdVisible} handleOk={this.handleOk} projectId={this.props.projectId}
                    handleCancel={() => { this.setState({ PublicdVisible: false }) }} refreshRight={this.props.refreshRight} startContent={this.props.startContent} />}
                {/* 分发 */}
                {this.state.DistributeVisible && <Distribute modalVisible={this.state.DistributeVisible} handleOk={this.handleOk}
                    handleCancel={() => { this.setState({ DistributeVisible: false }) }} getDocGivingList={this.props.getDocGivingList}
                    startContent={this.props.startContent} />}
                {/* 升版 */}
                {this.state.UpgradeVisible && <Upgrade modalVisible={this.state.UpgradeVisible} handleOk={this.handleOk} handleCancel={() => { this.setState({ UpgradeVisible: false }) }}
                    rightData={this.props.rightData} rightUpdateData={this.props.rightUpdateData} startContent={this.props.startContent} />}
                {/* 邮件 */}
                {this.state.MailVisible && <Mail modalVisible={this.state.MailVisible} handleOk={this.handleOk} handleCancel={() => { this.setState({ MailVisible: false }) }}
                    selectedRows={this.props.selectedRows} updateSelectedRows={this.props.updateSelectedRows} />}
                {this.state.showApprovalVisible &&
                    <Approval
                        visible={true}
                        width={"1200px"}
                        proc={{ "vars": {}, "procDefKey": "", "bizTypeCode": "plan_prodoc-approve", "title": this.state.projectName + "项目文档发布审批" }}
                        projectId={this.props.projectId}
                        handleCancel={() => { this.setState({ showApprovalVisible: false }) }}
                        refreshData={this.props.refreshRight}
                    />}
            </div>

        )
    }
}

export default DocTempDoc
