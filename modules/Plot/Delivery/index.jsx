import React, { Component } from 'react'
import intl from 'react-intl-universal'
import {  notification } from 'antd'
import Approval from './Approval'
import { connect } from 'react-redux'
import { changeLocaleProvider } from '../../../store/localeProvider/action'
import TopTags from './TopTags/index'
import RightTags from '../../../components/public/RightTags/index'
import * as dataUtil from '../../../utils/dataUtil';
import Public from "./Public"
import CancelPublic from "./CancelPublic"
import TipModal from "../../Components/TipModal"
import AddModal from "./AddModal"
import TreeTable from '../../../components/PublicTable'
//api
import {
  getPlanDelvTreeList,
  getBaseSelectTree,
  deletePlanDelv,
  updatePlanDelv,
  updatePlanPbs,
  getPlanDelvAssignFileList,
  getproInfo,
  getDelvsByPbsId
} from '../../../api/api';
import axios from '../../../api/axios';
import ImportDelivery from "./ImportDelivery"
import ExtLayout from "../../../components/public/Layout/ExtLayout";
import MainContent from "../../../components/public/Layout/MainContent";
import Toolbar from "../../../components/public/Layout/Toolbar";


class Delivery extends Component {
    constructor(props) {
        super(props)
        this.state = {
            initDone: false,
            activeIndex: [],
            currentPage: 1,
            pageSize: 10,
            group: 2,
            rightData: null,
            data: [],
            initData: [],
            dataMap: [],
            delivType: [],
            projectData: [],
            taskData: [],
            projectId: null,
            editAuth: false,
            contentMenu: [
                { name: '新增PBS', fun: 'addPbs', type: 'buttom', icon: 'plus-square', isPublic: false },
                { name: '新增交付物', fun: 'addDelv', type: 'buttom', icon: 'plus-square', isPublic: false },
                { name: '删除', fun: 'delete', type: 'buttom', icon: 'delete', isPublic: false }

            ]
        }
    }
    componentDidMount() {

        // 初始化数据
        this.initDatas();
        // 初始化业务字典
        this.getBaseSelectTree("plan.delv.type");
    }
    //注册 父组件即可调用子组件方法
    onRef = (ref) => {
        this.table = ref
    }
    /**
     * 初始化数据
     *
     */
    initDatas = () => {
        dataUtil.CacheOpenProject().getLastOpenProject((data) => {
            const { projectId, projectName } = data;
            this.setState({
                projectId,
                projectName
            })
        });
    }

    // 获取选中的列表项
    getInfo = (record) => {
        if (record && record.type == "pbs") {
            axios.get(getDelvsByPbsId(record.id)).then(res => {
                let pbsAuth = res.data.data;
                this.setState({
                    editAuth: pbsAuth
                })
            })
        }
        
        const status = record.statusVo ? record.statusVo.id : null;
        let auth = status == 'EDIT' ? true : false;
        let group = record.type == "pbs" ? 1 : record.type == "delv" ? 2 : -1;
        this.setState({
            rightData: record,
            group: group,
            editAuth: auth
        })
    }


    //发布
    onClickHandleRelease = (name) => {
        const { projectId } = this.state
        if (!projectId) {
            notification.warning(
                {
                    placement: 'bottomRight',
                    bottom: 50,
                    duration: 1,
                    message: '警告',
                    description: '没有选择项目！'
                }
            )
            return
        }
        //直接发布
        if (name == "direct") {
            this.setState({
                isShowPublic: true
            })
        }
        //发布审批
        if (name == "approve") {
            this.setState({ isShowRelease: true });
        }
        //取消发布
        if (name == "abolish") {
            this.setState({
                isShowAbolish: true
            })
        }
    }
    //关闭直接发布
    closePublicModal = () => {
        this.setState({
            isShowPublic: false
        })
    }
    //关闭发布审批
    closeReleaseModal = () => {
        this.setState({
            isShowRelease: false
        })
    }
    //关闭取消发布
    closeAbolishModal = () => {
        this.setState({
            isShowAbolish: false
        })
    }
    //获取项目交付物列表
    getList = (callBack) => {

        if(this.state.keywords){
            const { initData } = this.state;
            let newData = dataUtil.search(initData, [{ 'key': 'delvTitle|delvCode', 'value': this.state.keywords }], true);
            callBack(newData)
            return;
        }
        axios.get(getproInfo(this.state.projectId)).then(res => {
          
            if (res.data.data) {
                this.setState({
                    tableData: [{ id: res.data.data.id, delvTitle: res.data.data.name, type: "project" }],
                    // projectName: res.data.data.name ? "【" + res.data.data.name + "】" : ""
                }, () => {
                    axios.get(getPlanDelvTreeList(this.state.projectId)).then(res => {
                        const { data } = res.data
                        const { tableData } = this.state
                        tableData[0].children = data
                        callBack(tableData)
                        this.setState({
                            data: data || [],
                            initData: data || [],
                            rightData:null,
                        })
                    })
                })
            }else{
                callBack([])
            }

        })

    }
    //打开项目
    openProject = (projectId, { projectName }) => {

        this.getPlanDelvTreeList(projectId, projectName);
    }

    // 获取项目交付物列表
    getPlanDelvTreeList = (id, projectName) => {
        this.setState({ projectId: id || 0, projectName }, () => {
            this.table.getData()
        });
    }
    //刷新列表
    refresh=()=>{
        this.table.getData()
    }
    // 获取下拉框值
    getBaseSelectTree = (typeCode) => {
        axios.get(getBaseSelectTree(typeCode)).then(res => {
            const { data } = res.data
            // 初始化字典-工期类型
            if (typeCode == 'plan.delv.type') {
                this.setState({
                    delivType: data
                })
            }
        })
    }

    /**
     * 新增PBS
     * @params ndata 新数据
     
     */
    addPlanPbs = (ndata) => {
        const { rightData } = this.state;
        //新增下级
        if (rightData.type == "pbs") {
            this.table.add(this.state.rightData, ndata)

        } else {
            //新增同级
            this.table.add(this.state.rightData, ndata, 'same')
        }

    }

    // 修改PBS
    updatePlanPbs = (ndata) => {

        let url = dataUtil.spliceUrlParams(updatePlanPbs, { "startContent": "项目【" + this.state.projectName + "】" });
        axios.put(url, ndata, true).then(res => {
            this.table.update(this.state.rightData, ndata)
        })
    }

    // 获取PBS
    getPlanPbsById = (id) => {
        axios.get(getPlanPbsById(id)).then(res => {
            const { data } = res.data
        })
    }

    // 新增新增交付物
    addPlanDelv = (ndata) => {
        const {rightData}  = this.state
        if (rightData.type == "pbs") {
            this.table.add(this.state.rightData, ndata)
        } else {
            //新增同级
            this.table.add(this.state.rightData, ndata,'same')
        }
    }

    // 导入交付物
    importDelvTmpl = (ndata) => {
      const {rightData}  = this.state
      this.table.getData();
/*      if (rightData.type == "pbs") {
        this.table.add(this.state.rightData, ndata)
      } else {
        //新增同级
        this.table.add(this.state.rightData, ndata,'same')
      }*/
    }
    /**
     * 查询条件
     *
     * @param value
     */
    search = (value) => {
           this.setState({
            keywords: value,
           },()=>{
               this.table.getData();
           });
    }

    // 修改交付物
    updatePlanDelv = (ndata) => {

        let url = dataUtil.spliceUrlParams(updatePlanDelv, { "startContent": "项目【" + this.state.projectName + "】" });
        axios.put(url, ndata, true).then(res => {
            this.table.update(this.state.rightData, ndata)
        })
    }

    // 删除交付列表包括（PBS，交付物）
    deletePlanDelv = (ids) => {
        const { rightData } = this.state;
        if (!rightData) {
            notification.warning(
                {
                    placement: 'bottomRight',
                    bottom: 50,
                    duration: 2,
                    message: '未选中数据',
                    description: '请选择数据进行操作'
                }
            )
            return;
        }
        let url = dataUtil.spliceUrlParams(deletePlanDelv(rightData.id), { "startContent": "项目【" + this.state.projectName + "】" });
        axios.deleted(url, null, true).then(res => {
            this.table.deleted(this.state.rightData)
            this.setState({
                rightData: null
            });
        })
        this.setState({
            deleteTip: false
        })
    }

    // 根据delvId获取文件信息列表
    getPlanDelvAssignFileList = () => {
        const { rightData } = this.state;
        if (rightData) {
            axios.get(getPlanDelvAssignFileList(rightData.id)).then(res => {
                const { data } = res.data
               
            })
        }
    }
    //右击菜单事件处理
    rightClickMenu = (menu) => {
        //新增PBS
        if (menu.fun == "addPbs") {
            if (this.state.rightData.type == "delv") {
                notification.warning(
                    {
                        placement: 'bottomRight',
                        bottom: 50,
                        duration: 2,
                        message: '提醒',
                        description: '不能再交付物下新增PBS!'
                    }
                );
                return;
            }
            this.setState({
                showAddModal: true,
                addtype: "nextpbs",
                modalTitile: "新增PBS",
            })
        }
        //新增交付物
        if (menu.fun == "addDelv") {
            if (this.state.rightData.type == "delv") {
                notification.warning(
                    {
                        placement: 'bottomRight',
                        bottom: 50,
                        duration: 2,
                        message: '提醒',
                        description: '不能再交付物下新增交付物!'
                    }
                );
                return;
            }

            this.setState({
                showAddModal: true,
                modalTitile: "新增交付物",
                addtype: "adddelv"
            })
        }
        //删除
        if (menu.fun == "delete") {
            // this.delData();
            // 打开删除提示
            if (this.state.rightData.type == "project") {
                notification.warning(
                    {
                        placement: 'bottomRight',
                        bottom: 50,
                        duration: 2,
                        message: '提示',
                        description: '不能删除项目'
                    }
                );
                return;
            }
            if (this.state.editAuth == false) {
                notification.warning(
                    {
                        placement: 'bottomRight',
                        bottom: 50,
                        duration: 2,
                        message: '提示',
                        description: '已发布交付物不允许删除！'
                    }
                );
                return;
            }
            this.setState({
                deleteTip: true
            })
        }
    }
    //点击新增处理
    onClickHandleAdd = (name) => {

        const { projectId, rightData } = this.state
        if (!projectId) {
            notification.warning(
                {
                    placement: 'bottomRight',
                    bottom: 50,
                    duration: 2,
                    message: '提醒',
                    description: '请选择项目!'
                }
            );
            return;
        }
        // 新增下级PBS
        if (name == 'AddPBSNextBtn') {

            if (!rightData) {
                notification.warning(
                    {
                        placement: 'bottomRight',
                        bottom: 50,
                        duration: 2,
                        message: '未选中数据',
                        description: '请选择数据进行操作'
                    }
                );
                return;
            }
            this.setState({
                showAddModal: true,
                modalTitile: "新增PBS",
                addtype: "nextpbs"
            })
        }
        // 新增交付物
        if (name == "AddDeliveryBtn") {
            if (!rightData) {
                notification.warning(
                    {
                        placement: 'bottomRight',
                        bottom: 50,
                        duration: 2,
                        message: '未选中数据',
                        description: '请选择数据进行操作'
                    }
                );
                return;
            }

            this.setState({
                showAddModal: true,
                modalTitile: "新增交付物",
                addtype: "adddelv"
            })
        }
    }
    //关闭删除提示框
    closeDeleteTipModal = () => {
        this.setState({
            deleteTip: false
        })
    }
    //关闭新增按钮
    closeAddModal = () => {
        this.setState({
            showAddModal: false
        })
    }

    //导入操作
    onClickHandle = (name) => {
      if (name == "ImportBtn"){
        this.setState({
          isShowImportModal: true,
        })
      }
    }

    //关闭导入
    closeImport = () => {
      this.setState({
        isShowImportModal: false
      })
    }


  render() {
        const columns = [
            {
                title: intl.get('wsd.i18n.pre.project1.projectname'),
                dataIndex: 'delvTitle',
                key: 'delvTitle',
                render: (text, record) => dataUtil.getIconCell(record.type, text)
            },
            {
                title: intl.get('wsd.i18n.pre.project1.projectcode'),
                dataIndex: 'delvCode',
                key: 'delvCode'
            },
            {
                title: intl.get("wsd.i18n.plan.delvList.delvtype"),
                dataIndex: 'type',
                key: 'type',
                render: text => text == 'pbs' ? "PBS" : text == 'delv' ? "交付物" : null
            },
            {
                title: "交付物类别",
                dataIndex: 'delvTypeVo',
                key: 'delvTypeVo',
                render: (text, record) => {
                    let ret = text && record.type === "delv" ? text.name : "";
                    return ret;
                }
            },
            {
                title: "编制状态",
                dataIndex: 'statusVo',
                key: 'statusVo',
                render: (text, record) => {
                    let ret = text && record.type === "delv" ? text.name : "";
                    return ret;
                }
            },
        ];
        let rdata = this.state.rightData  ? this.state.rightData : {};
        let startContent = "项目【" + this.state.projectName + "】," + (rdata.type == "pbs" ? "PBS" : "交付物") + "【" + rdata.delvTitle + "】";

        return (

          <ExtLayout renderWidth = {({contentWidth}) => { this.setState({contentWidth}) }}>
            <Toolbar>
              <TopTags
                search={this.search}
                onClickHandleAdd={this.onClickHandleAdd}
                data={this.state.rightData}
                getBaseSelectTree={this.getBaseSelectTree}
                delivType={this.state.delivType}
                deletePlanDelv={this.deletePlanDelv}
                parentState={this.state}
                projectId={this.state.projectId}
                projectData={this.state.projectData}
                getPlanDelvTreeList={this.getPlanDelvTreeList}
                openProject={this.openProject}
                onClickHandleRelease={this.onClickHandleRelease}
                onClickHandle={this.onClickHandle}
                editAuth={this.state.editAuth}
                projectNamee={this.state.projectName}
              />
            </Toolbar>
            <MainContent contentWidth = {this.state.contentWidth} contentMinWidth = {1500}>
              {this.state.projectId && (
                <TreeTable contentMenu={this.state.contentMenu}
                           onRef={this.onRef} getData={this.getList}
                           columns={columns}
                           scroll={{ x: 1150, y: this.props.height - 50 }}
                           getRowData={this.getInfo}
                           rightClick={this.rightClickMenu}
                />
              )}
            </MainContent>
            <RightTags
              editAuth={this.state.editAuth}
              menuId = {this.props.menuInfo.id}
              menuCode={this.props.menuInfo.menuCode}
              projectName={this.state.projectName}
              groupCode={this.state.group}
              rightTagList={this.state.rightTags}
              rightData={this.state.rightData }
              getBaseSelectTree={this.getBaseSelectTree}
              bizType="delv"
              bizId={this.state.rightData  ? this.state.rightData.id : null}
              fileEditAuth={true}
              projectId={this.state.projectId}
              updatePlanPbs={this.updatePlanPbs}
              delivType={this.state.delivType}
              updatePlanDelv={this.updatePlanDelv}
              openWorkFlowMenu={this.props.openWorkFlowMenu}
              initFileInfoList={this.getPlanDelvAssignFileList} //初始化文件信息列表
              extInfo={{
                startContent: startContent
              }}
            />
            {this.state.isShowPublic && <Public handleCancel={this.closePublicModal} projectId={this.state.projectId} refresh={this.refresh} />}

            {this.state.isShowRelease && <Approval proc={{ "procDefKey": "model_20190513_2687523", "bizTypeCode": "plan-delv-release", "title": "[" + this.state.projectName + "]项目交付物发布审批" }}
                                                   handleCancel={this.closeReleaseModal} visible={true} projectId={this.state.projectId} refreshData={this.refresh} />}
            {this.state.isShowAbolish && <CancelPublic handleCancel={this.closeAbolishModal} projectId={this.state.projectId} refresh={this.refresh} />}

            {/* 删除提示 */}
            {this.state.deleteTip && <TipModal onOk={this.deletePlanDelv} onCancel={this.closeDeleteTipModal} />}
            {/* 新增弹窗 */}
            {this.state.showAddModal && <AddModal title={this.state.modalTitile}
                                                  projectName={this.state.projectName}
                                                  addPlanPbs={this.addPlanPbs} delivType={this.state.delivType}
                                                  addPlanDelv={this.addPlanDelv} getBaseSelectTree={getBaseSelectTree}
                                                  handleCancel={this.closeAddModal} addtype={this.state.addtype}
                                                  projectId={this.state.projectId} rightData={this.state.rightData}
            />}
            {
              this.state.isShowImportModal &&
              (
                <ImportDelivery title={"导入交付物模板"} visible={true}
                                handleCancel={this.closeImport.bind(this)}
                                projectId={this.state.projectId}
                                rightData={this.state.rightData}
                                importDelvTmpl={this.importDelvTmpl}
                                getDataList={this.getDataList}
                                extInfo={{
                                  startContent: "项目【" + this.state.projectName + "】"
                                }}
                />
              )
            }
          </ExtLayout>
        )
    }
}


/* *********** connect链接state及方法 start ************* */
export default connect(state => ({
    currentLocale: state.localeProviderData
}), {
        changeLocaleProvider
    })(Delivery);
/* *********** connect链接state及方法 end ************* */
