import React, { Component } from 'react'
import dynamic from 'next/dynamic'
import Search from '../../../../../components/public/Search/index'
import style from './style.less'
import AddTask from '../AddTask'
import AddWbs from '../AddWbs'
import PublicMenuButton from '../../../../../components/public/TopTags/PublicMenuButton'
import PublicButton from '../../../../../components/public/TopTags/PublicButton'
import AddTemplate from "../AddTemplate"
import { notification } from "antd"
import { connect } from 'react-redux'
export class BasicdTemplatePlanTopTags extends Component {
    constructor(props) {
        super(props)
        this.state = {
            roleBtnData: [
                {
                    id: 5,
                    name: 'NewTemplateBtn',
                    aliasName: '新增模板'
                },
                {
                    id: 1,
                    name: 'WbsTopBtn',
                    aliasName: 'WBS'
                },
                {
                    id: 2,
                    name: 'TaskTopBtn',
                    aliasName: '任务'
                },
                {
                    id: 3,
                    name: 'DeleteTopBtn',
                    aliasName: '删除'
                },
                {
                    id: 4,
                    name: "ImportTopBtn",
                    aliasName: '导入'
                }

            ],
            modalVisible: false,
            modalVisible1: false
        }
    }

    handleCancel = () => {
        this.setState({
            modalVisible: false
        })
    };
    handleCancelWbs = () => {
        this.setState({
            modalVisible1: false
        })
    };
    handleCancelTemplate = () => {
        this.setState({
            modalVisible2: false
        })
    };

    showFormModal = (name, e) => {
        const { intl } = this.props.currentLocale
        let that = this;
        const { data } = this.props
        // 新增任务AddTask
        if (name === 'TaskTopBtn') {
            if (!data) {
                notification.warning(
                    {
                        placement: 'bottomRight',
                        bottom: 50,
                        duration: 1,
                        message: intl.get("wsd.global.tip.title2"),
                        description: intl.get("wsd.global.tip.title1"),
                    }
                )
                return
            }
            if (data.type && data.type == "task") {
                notification.warning(
                    {
                        placement: 'bottomRight',
                        bottom: 50,
                        duration: 1,
                        message: "警告",
                        description: "不能在任务下新增任务",
                    }
                )
                return
            }
            this.setState({
                taskTitle: intl.get("wsd.i18n.base.planTemAddtask.title"),
                modalVisible: true
            })
            return
        }
        // 新增任务AddWBS
        if (name === 'WbsTopBtn') {
            if (!data) {
                notification.warning(
                    {
                        placement: 'bottomRight',
                        bottom: 50,
                        duration: 1,
                        message: intl.get("wsd.global.tip.title2"),
                        description: intl.get("wsd.global.tip.title1"),
                    }
                )
                return
            }
            if (data.type && data.type == "task") {
                notification.warning(
                    {
                        placement: 'bottomRight',
                        bottom: 50,
                        duration: 1,
                        message: "警告",
                        description: "不能在任务下新增WBS",
                    }
                )
                return
            }
            this.setState({

                modalVisible1: true
            })
            return
        }
        // 新增模板
        if (name === 'NewTemplateBtn') {

            this.setState({
                modalVisible2: true
            })
            return
        }
        if (name == "DeleteTopBtn") {

            if (!data) {
                notification.warning(
                    {
                        placement: 'bottomRight',
                        bottom: 50,
                        duration: 1,
                        message: intl.get("wsd.global.tip.title2"),
                        description: intl.get("wsd.global.tip.title1"),
                    }
                )
                return
            } else {
                this.props.deleteData()
            }

        }
    }

    //判断是否有选中数据
    hasRecord = () => {
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
            return false;
        } else {
            return true
        }
    }

    render() {
        const { intl } = this.props.currentLocale
        let topTags = this.state.roleBtnData.map((v, i) => {
            return dynamic(
                import('../../../../../components/public/TopTags/' + v.name))
        })



        return (
            <div className={style.main}>
                {/*搜索框*/}
                <div className={style.search}>
                    <Search search={this.props.search} />
                </div>
                <div className={style.tabMenu}>
                    <PublicButton name={'新增模板'} title={'新增模板'} icon={'icon-add'}
                        afterCallBack={this.showFormModal.bind(this, 'NewTemplateBtn')}
                        res={'MENU_EDIT'}
                    />
                    <PublicButton name={'WBS'} title={'WBS'} icon={'icon-WBS_'}
                        afterCallBack={this.showFormModal.bind(this, 'WbsTopBtn')}
                        res={'MENU_EDIT'}
                    />
                    <PublicButton name={'任务'} title={'任务'} icon={'icon-renwu-'}
                        afterCallBack={this.showFormModal.bind(this, 'TaskTopBtn')}
                        res={'MENU_EDIT'}
                    />
                    <PublicButton name={'删除'} title={'删除'} icon={'icon-shanchu'}
                        useModel={true} edit={true}
                        verifyCallBack={this.hasRecord}
                        afterCallBack={this.showFormModal.bind(this, 'DeleteTopBtn')}
                        content={'你确定要删除吗？'}
                        res={'MENU_EDIT'}
                    />
                    <PublicMenuButton title={"导入"} afterCallBack={this.showFormModal}
                        icon={"icon-daoru2"}
                        menus={[{ key: "ImportTopBtn", label: "从组织导入", edit: true,icon:"icon-zuzhijigou"}]}
                    />


                </div>
                {/*计划模板->添加任务*/}
                {this.state.modalVisible && <AddTask handleCancel={this.handleCancel} addData={this.props.addData} data={this.props.data} taskTitle={this.state.taskTitle} tasktype={this.state.tasktype} />}

                {/*计划模板->WBS*/}
                {this.state.modalVisible1 && <AddWbs handleCancel={this.handleCancelWbs} addData={this.props.addData} data={this.props.data} />}

                {/*新增模板*/}
                {this.state.modalVisible2 && <AddTemplate handleCancel={this.handleCancelTemplate} addData={this.props.addData} />}

            </div>)
    }
}

const mapStateToProps = state => {
    return {
        currentLocale: state.localeProviderData,
    }
};


export default connect(mapStateToProps, null)(BasicdTemplatePlanTopTags);
