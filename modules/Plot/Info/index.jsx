import React, { Component } from 'react'
import { Table, Icon, Spin, notification } from 'antd'
import style from './style.less'
import TopTags from './TopTags/index'
import RightTags from '../../../components/public/RightTags/index'
import { connect } from 'react-redux';
import axios from "../../../api/axios"
import { getproTileInfo, getproTree, deleteprolist, getDefineListByUserAuthAndProjectId } from "../../../api/api"
import { getPermission} from "@/modules/Suzhou/api/suzhou-api"
import * as util from '../../../utils/util';
import TipModal from "../../Components/TipModal"
import AddModal from "./AddModal"
import * as dataUtil from "../../../utils/dataUtil"
import PubTable from '../../../components/PublicTable'
import ExtLayout from "../../../components/public/Layout/ExtLayout";
import MainContent from "../../../components/public/Layout/MainContent";
import Toolbar from "../../../components/public/Layout/Toolbar";

class TableComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            currentPageNum: 1,
            pageSize: 10,
            view: "tree",
            data: [],
            initData: [],
            activeIndex: "",
            rightData: null,
            rightTags: [

            ],
            userId: null,
            groupCode: 1,
            contentMenu: [
                { name: '新增', fun: 'add', type: 'buttom', icon: 'plus-square', isPublic: false },
                { name: '删除', fun: 'delete', type: 'buttom', icon: 'delete', isPublic: false },
                { name: '打开交付物', fun: 'openprojectdelv', type: 'buttom', icon: 'login', isPublic: false },
                { name: '打开计划定义', fun: 'openplandefine', type: 'buttom', icon: 'login', isPublic: false },
                { name: '打开项目计划', fun: 'openplanprepared', type: 'buttom', icon: 'login', isPublic: false }
            ],
            editAuth: false,
            permission:[]
        }
    }

    /**
      @method 父组件即可调用子组件方法
      @description 父组件即可调用子组件方法
      */
    onRef = (ref) => {
        this.table = ref
    }
    getTileData = (currentPageNum, pageSize, callBack) => {
        if(this.state.keywords){
            let newData = dataUtil.search(this.state.initData, [{ 'key': 'code|name', 'value': this.state.keywords }], true);
            callBack(newData)
            return;
        }
        let { searcher } = this.state;
        axios.post(getproTileInfo(pageSize, currentPageNum), { "name": searcher }).then(res => {
            callBack(res.data.data ? res.data.data : [])
            this.setState({
                data: res.data.data,
                initData: res.data.data,
                total: res.data.total,
                rightData:null
            })
        })
    }
    getTreeData = (callBack) => {
        let { searcher } = this.state;
        if(this.state.keywords){
            let newData = dataUtil.search(this.state.initData, [{ 'key': 'code|name', 'value': this.state.keywords }], true);
            callBack(newData)
            return;
        }
        axios.post(getproTree, { "name": searcher }).then(res => {
            callBack(res.data.data ? res.data.data : [])
            const dataMap = util.dataMap(res.data.data);
            this.setState({
                data: res.data.data,
                initData: res.data.data,
                dataMap: dataMap,
                rightData:null
            })
        })
    }
   
    componentDidMount() {
        let userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
        let view = localStorage.getItem("projectInfoView") ? localStorage.getItem("projectInfoView") : 'tree'
        this.setState({
            userId: userInfo.id,
            view
        })
        axios.get(getPermission(this.props.menuInfo.menuCode)).then((res)=>{
            let permission = []
            res.data.data.map((item,index)=>{
              permission.push(item.code)
            })
            this.setState({
              permission
            })
          })
    }
  
    getInfo = (record, index) => {
        this.setState({
            groupCode: record.type == "project" ? 1 : -1,
            rightData: record
        },() => {
            if (record && record["type"] == "project" && (record.creator && record.creator.id == this.state.userId) || (record.user && record.user.id == this.state.userId)){
                this.setState({
                  editAuth:true,
                })
            }else{
                this.setState({
                  editAuth:false,
                })
            }
        })
    }

    TreeTileViewBtnevent = (menu) => {
        this.setState({
            view: menu
        }, () => {
            //存储本地记忆
            localStorage.setItem("projectInfoView", menu)
            this.table.getData()
        })
    }

    search = (value) => {
        const { initData, resource, data } = this.state;
        let newData = initData;
        this.setState({
            keywords:value
        },()=>{
            this.table.getData();
        })
      
    };


    //删除
    deleteData = () => {
        const { data, dataMap, rightData } = this.state;
        if (!rightData || rightData["type"] != "project") {
            notification.warning(
                {
                    placement: 'bottomRight',
                    bottom: 50,
                    duration: 2,
                    message: '未选数据',
                    description: '请选择项目进行操作'
                }
            )
            this.setState({
              deleteTip: false
            })
            return;
        }
        if (rightData) {
            if (!this.state.editAuth){
              notification.warning(
                {
                  placement: 'bottomRight',
                  bottom: 50,
                  duration: 2,
                  message: '',
                  description: '您不具有删除权限！'
                }
              )
              this.setState({
                deleteTip: false
              })
              return;
            }
        }
        if (this.state.view == "tile") {
            if (rightData) {
                axios.deleted(deleteprolist(rightData.id), null, true).then(res => {
                    this.table.deleted(rightData);
                    this.setState({
                        rightData: null,
                    });
                })

            }
        } else {
            axios.deleted(deleteprolist(rightData.id), null, true).then(res => {
                this.table.deleted(rightData);
                this.setState({
                    rightData: null,
                });
            })

        }
        this.setState({
            deleteTip: false
        })
    }
    //新增
    addprojectinfo = (info) => {
        this.table.getData();
    }
    updateSuccess = (info) => {
        const {rightData } = this.state
        this.table.update(rightData,info);
    }

    //右击菜单事件处理
    rightClickMenu = (menu) => {
        //新增
        if (menu.fun == "add") {
            this.onClickHandleAdd()
        }
        //删除
        if (menu.fun == "delete") {
            // this.delData();
            // 打开删除提示
            if (this.state.rightData.type == "eps") {
                notification.warning(
                    {
                        placement: 'bottomRight',
                        bottom: 50,
                        duration: 2,
                        message: '警告',
                        description: '不能删除项目群'
                    }
                )
                return;
            }
            this.setState({
                deleteTip: true
            })
        }
        //打开计划编制
        if (menu.fun == "openplanprepared" || menu.fun == "openplandefine" || menu.fun == "openprojectdelv") {
            if (this.state.rightData.type == "eps") {
                notification.warning(
                    {
                        placement: 'bottomRight',
                        bottom: 50,
                        duration: 2,
                        message: '提示',
                        description: '请选择项目进行操作'
                    }
                )
                return;
            }
            const { id, name } = this.state.rightData;

            dataUtil.CacheOpenProject().addLastOpenProject(id, name, () => {
                let menuCode = null;
                if (menu.fun == "openprojectdelv") {
                    menuCode = "IM-DELV";
                } else if (menu.fun == "openplanprepared") {
                    menuCode = "PM-TASK";
                } else if (menu.fun == "openplandefine") {
                    menuCode = "PM-DEFINE";
                }
                this.props.openMenuByMenuCode(menuCode, true);
            });
        }

      
    }
    //关闭删除提示框
    closeDeleteTipModal = () => {
        this.setState({
            deleteTip: false
        })
    }
    //关闭新增弹框
    closeAddModal = () => {
        this.setState({
            showAddModal: false
        })
    }
    //处理新增点击
    onClickHandleAdd = () => {
        if (this.state.view == "tree") {
            if (!this.state.rightData || this.state.rightData.type == "project") {
                notification.warning(
                    {
                        placement: 'bottomRight',
                        bottom: 50,
                        duration: 2,
                        message: '未选中数据',
                        description: '请选择EPS进行操作'
                    }
                )
                return
            }
            this.setState({
                showAddModal: true
            })
            return

        }
        if (this.state.view == "tile") {
            this.setState({
                showAddModal: true
            })
            return
        }
    }
    render() {
        const { intl } = this.props.currentLocale

        const columns = [
            {
                title: intl.get('wsd.i18n.pre.project1.projectname'),
                dataIndex: 'name',
                key: 'name',
                width: 300,
                render: (text, record) => dataUtil.getIconCell(record.type, text)
            },
            {
                title: intl.get('wsd.i18n.pre.project1.projectcode'),
                dataIndex: 'code',
                key: 'code',

            },
            {
                title: intl.get('wsd.i18n.pre.project1.iptname'),
                dataIndex: 'org',
                key: 'org',
                render: (text) => {
                    if (text) {
                        return <span>{text.name}</span>
                    } else {
                        return null
                    }
                }
            },
            {
                title: intl.get('wsd.i18n.pre.project1.username'),
                dataIndex: 'user',
                key: 'user',
                render: (text) => {
                    if (text) {
                        return <span>{text.name}</span>
                    } else {
                        return null
                    }
                }
            },
            {
                title: intl.get('wsd.i18n.pre.project1.starttime'),
                dataIndex: 'planStartTime',
                key: 'planStartTime',
                render: (text) => dataUtil.Dates().formatDateString(text)
            },
            {
                title: intl.get('wsd.i18n.pre.project1.endtime'),
                dataIndex: 'planEndTime',
                key: 'planEndTime',
                render: (text) => dataUtil.Dates().formatDateString(text)
            },
            // {
            //     title: "进展状况",
            //     dataIndex: 'actRate',
            //     key: 'actRate',
            //     render: (text) => {
            //         if (text) {
            //             return <span>{text + "%"}</span>
            //         } else {
            //             return null
            //         }
            //     }
            // },
            {
                title: intl.get('wsd.i18n.comu.meeting.status'),
                dataIndex: 'status',
                key: 'status',
                render: (text) => {
                    if (text) {
                        return <span>{text.name}</span>
                    } else {
                        return null
                    }
                }
            },
            // {
            //     title: "密级",
            //     dataIndex: 'secutyLevel',
            //     key: 'secutyLevel',
            //     render: text => <span>{text ? (text.name ? text.name : '') : ''}</span>
            // }
        ];
        const tileColumns = [
            {
                title: intl.get('wsd.i18n.pre.project1.projectname'),
                dataIndex: 'name',
                key: 'name',
                width: 300,
                render: (text, record) => dataUtil.getIconCell(record.type, text)
            },
            {
                title: intl.get('wsd.i18n.pre.project1.projectcode'),
                dataIndex: 'code',
                key: 'code',

            },
            {
                title: intl.get('wsd.i18n.pre.project1.epsname'),
                dataIndex: 'parentName',
                key: 'parentName'
            },
            {
                title: intl.get('wsd.i18n.pre.project1.iptname'),
                dataIndex: 'org',
                key: 'org',
                render: (text) => {
                    if (text) {
                        return <span>{text.name}</span>
                    } else {
                        return null
                    }
                }
            },
            {
                title: intl.get('wsd.i18n.pre.project1.username'),
                dataIndex: 'user',
                key: 'user',
                render: (text) => {
                    if (text) {
                        return <span>{text.name}</span>
                    } else {
                        return null
                    }
                }
            },
            {
                title: intl.get('wsd.i18n.pre.project1.starttime'),
                dataIndex: 'planStartTime',
                key: 'planStartTime',
                render: (text) => dataUtil.Dates().formatDateString(text)
            },
            {
                title: intl.get('wsd.i18n.pre.project1.endtime'),
                dataIndex: 'planEndTime',
                key: 'planEndTime',
                render: (text) => dataUtil.Dates().formatDateString(text)
            },
            // {
            //     title: "进展状况",
            //     dataIndex: 'actRate',
            //     key: 'actRate',
            // },
            {
                title: intl.get('wsd.i18n.comu.meeting.status'),
                dataIndex: 'status',
                key: 'status',
                render: (text) => {
                    if (text) {
                        return <span>{text.name}</span>
                    } else {
                        return null
                    }
                }
            },
            // {
            //     title: "密级",
            //     dataIndex: 'secutyLevel',
            //     width: 100,
            //     key: 'secutyLevel',
            //     render: text => <span>{text ? (text.name ? text.name : '') : ''}</span>
            // },
        ];
        return (

          <ExtLayout windowSize = {this.props.windowSize} renderWidth = {({contentWidth}) => { this.setState({contentWidth}) }}>
            <Toolbar>
              <TopTags onClickHandle={this.TreeTileViewBtnevent}
                       onClickHandleAdd={this.onClickHandleAdd}
                       deleteData={this.deleteData}
                       addprojectinfo={this.addprojectinfo}
                       view={this.state.view} data={this.state.rightData}
                       search={this.search} />
            </Toolbar>
            <MainContent contentWidth = {this.state.contentWidth} contentMinWidth = {1500}>

              {this.state.view == "tile" && (
                <PubTable contentMenu={this.state.contentMenu}
                          onRef={this.onRef} getData={this.getTileData}
                          pagination={true}
                          columns={tileColumns} loading={this.state.loading}
                          scroll={{ x: 1150, y: this.props.height - 50 }}
                          getRowData={this.getInfo}
                          rightClick={this.rightClickMenu}
                />
              )}
              {this.state.view != "tile" && (
                <PubTable contentMenu={this.state.contentMenu}
                          onRef={this.onRef} getData={this.getTreeData}
                          dataSource={this.state.data}
                          columns={columns}
                          scroll={{ x: 1150, y: this.props.height - 50 }}
                          getRowData={this.getInfo}
                          rightClick={this.rightClickMenu}
                />
              )}
            </MainContent>
            <RightTags
              fileRelease={true}
              menuId = {this.props.menuInfo.id}
              menuCode={this.props.menuInfo.menuCode}
              groupCode={this.state.groupCode}
              bizType="project"
              bizId={this.state.rightData ? this.state.rightData.id : null}
              projectId={this.state.rightData ? this.state.rightData.id : null}
              projectTeamEditAuth={true}
              fileEditAuth={true}
              linkManEditAuth={true}
              rightTagList={this.state.rightTags}
              rightData={this.state.rightData}
              updateSuccess={this.updateSuccess}
              editAuth={this.state.editAuth}
              rangePermission ={'PROJECT_TEAM-EDIT'}
              permission = {this.state.permission}
              extInfo={{
                startContent: "项目【" + (this.state.rightData ? this.state.rightData.name : null) + "】"
              }}
            />
            {/* 删除提示 */}
            {this.state.deleteTip && <TipModal onOk={this.deleteData} onCancel={this.closeDeleteTipModal} />}
            {/* 新增项目信息 */}
            {this.state.showAddModal
            && <AddModal title="新增项目信息"
                         maskClosable={false}
                         mask={false}
                         handleCancel={this.closeAddModal}
                         view={this.state.view}
                         addprojectinfo={this.addprojectinfo}
                         data={this.state.rightData}></AddModal>}
          </ExtLayout>
        )
    }
}


/* *********** connect链接state及方法 start ************* */
export default connect(state => ({
    currentLocale: state.localeProviderData,
    windowSize : state.windowSizeData
}))(TableComponent);
