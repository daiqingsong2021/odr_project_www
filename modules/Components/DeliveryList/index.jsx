import React, { Component } from 'react'
import intl from 'react-intl-universal'
import { Table, Spin, Modal, Popover, notification, Calendar, Button, DatePicker } from 'antd'
import dynamic from 'next/dynamic'
import style from "./style.less"
import axios from "../../../api/axios"
import AddModal from './AddModal/index'
import ModifyFileModal from './ModifyFileModal'
import DistributionModal from './DistributionModal'
import UploadModal from "./UploadModal"
import CheckModal from "./CheckModal"
import PublicTable from '../../../components/PublicTable'
import LabelToolbar from '../../../components/public/Layout/Labels/Table/LabelToolbar'
import LabelTableLayout from '../../../components/public/Layout/Labels/Table/LabelTableLayout'
import LabelTable from '../../../components/public/Layout/Labels/Table/LabelTable'
import LabelTableItem from '../../../components/public/Layout/Labels/Table/LabelTableItem'



import {
    getPlanDelvAssignTaskList,
    addPlanDelvAssign,
    updatePlanDelvAssign,
    deletePlanDelvAssign,
    addDocFileRelations,
    updateDocFileRelations,
    planDelvTaskAssign,
    assignComplete, deleteclassifyassign,
    getvariable
} from "../../../api/api"
import * as dataUtil from '../../../utils/dataUtil';
import PublicButton from "../../../components/public/TopTags/PublicButton";
import MyIcon from '../../../components/public/TopTags/MyIcon';
class DeliveryList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            initDone: false,
            selectStatus: 0,//选中状态 0 , 1, 2 no,单选，多选
            seletData: [], //选中数据
            addModal: false,//显示新增
            upfileModal: false,//显示上传
            modifyFile: false,//显示修改
            showDistribute: false,//显示分配
            data: [],
            activeIndex: [],
            selectData: [],
            dataMap: [],
            checkRecord: null,
            currentData: [],
            visible: false,
            isUnComplete: true,//是否未完成
            projSet: { dateFormat: 'YYYY-MM-DD', drtnUnit: 'h', timeUnit: 'h', precision: 2, moneyUnit: '¥' },
        }
    }
    //注册 父组件即可调用子组件方法
    onRef = (ref) => {
        this.table = ref
    }
    deleteVerifyCallBack = () => {
        const { selectData } = this.state;

        if (selectData.length == 0) {
            notification.warning({
                placement: 'bottomRight',
                bottom: 50,
                duration: 2,
                message: '未选中数据',
                description: '请勾选数据进行操作'
            })
            return false;
        }
        return true;
    }

    closeDistributionModal = () => {
        this.setState({
            showDistribute: false
        })
    }

    closeAddModal = () => {
        this.setState({
            addModal: false
        })
    }


    closeModifyFileModal = () => {
        this.setState({
            modifyFile: false
        })
    }

    openCkeck = (text) => {
        this.setState({
            isShowCheckModal: true,
            filenum: text
        })
    }

    closeCheckModal = () => {
        this.setState({
            isShowCheckModal: false
        })
    }

    getInfo = (record, index) => {

        this.setState({
            activeIndex: [record.id],
            currentData: [record],
            isUnComplete: record.delvStatus && record.delvStatus.id == "ACCEPTANCE" ? false : true
        })

    }

   
    componentDidMount() {
        this.getProjSetInfo()
    }
    getProjSetInfo = () => {
        let { rightData } = this.props
        Array.isArray(rightData) ? null : rightData = [rightData]
        axios.get(getvariable(rightData[0].projectId)).then(res => {

            const data = res.data.data || {};
            const projSet = {
                dateFormat: (data.dateFormat || {}).id || "YYYY-MM-DD",
                drtnUnit: (data.drtnUnit || {}).id || "h",
                timeUnit: (data.timeUnit || {}).id || "h",
                precision: data.precision || 2,
                moneyUnit: (data.currency || {}).symbol || "¥",
            }
            this.setState({
                projSet
            })
        })
    }
    refresh=()=>{
        this.table.getData();
    }
    //获取交付清单列表
    getPlanDelvAssignTaskList = (callBack) => {
        let { rightData } = this.props
        Array.isArray(rightData) ? null : rightData = [rightData]
        if (rightData && ((rightData[0]['nodeType'] == 'wbs' || rightData[0]['type'] == 'wbs') || (rightData[0]['nodeType'] == 'task' || rightData[0]['type'] == 'task'))) {
            axios.get(getPlanDelvAssignTaskList(rightData[0]['id'])).then(res => {
                const { data } = res.data
                callBack(data?data:[])
                this.setState({
                    data,
                    activeIndex: [],
                    currentData: [],
                })
            })
        }
    }

    //显示附件
    onClickHandleCheck = (record) => {
        this.setState({
            isShowCheckModal: true,
            checkRecord: record
        })
    }

    // 分配交付清单
    planDelvTaskAssign = (ids) => {
        let { rightData } = this.props
        Array.isArray(rightData) ? null : rightData = [rightData]
        const { data } = this.state
        if (rightData && ((rightData[0]['nodeType'] == 'wbs' || rightData[0]['type'] == 'wbs') || (rightData[0]['nodeType'] == 'task' || rightData[0]['type'] == 'task'))) {
            let { startContent } = this.props.extInfo || {};
            let url = dataUtil.spliceUrlParams(planDelvTaskAssign(rightData[0]['id']), { startContent });
            axios.post(url, [...ids], true).then(res => {
                this.table.getData()
                //util.create(data, dataMap, rightData[0], res.data.data)
            })
        }
    }

    // 新增交付清单
    addPlanDelvAssign = (ndata) => {
        let { rightData } = this.props
        const { data } = this.state
        Array.isArray(rightData) ? null : rightData = [rightData]
        const newdata = {
            ...ndata,
            projectId: rightData[0]['projectId'],
            taskId: rightData[0]['id'],
            planStartTime: dataUtil.Dates().formatTimeString(ndata.planStartTime),
            planEndTime: dataUtil.Dates().formatTimeString(ndata.planEndTime),

        }
        if (rightData && ((rightData[0]['nodeType'] == 'wbs' || rightData[0]['type'] == 'wbs') || (rightData[0]['nodeType'] == 'task' || rightData[0]['type'] == 'task'))) {

            let { startContent } = this.props.extInfo || {};
            let url = dataUtil.spliceUrlParams(addPlanDelvAssign, { startContent });

            axios.post(url, newdata, true).then(res => {
                this.table.getData();
            })
        }
    }

    // 修改交付清单
    updatePlanDelvAssign = (ndata) => {

        let { rightData } = this.props
        const { selectData, activeIndex } = this.state
        Array.isArray(rightData) ? null : rightData = [rightData]
        if (rightData && ((rightData[0]['nodeType'] == 'wbs' || rightData[0]['type'] == 'wbs') || (rightData[0]['nodeType'] == 'task' || rightData[0]['type'] == 'task'))) {

            let { startContent } = this.props.extInfo || {};
            let url = dataUtil.spliceUrlParams(updatePlanDelvAssign, { startContent });

            axios.put(url, { ...ndata, id: activeIndex[0] }, true).then(res => {
            
                this.table.getData()
            
            })
        }
    }

    // 删除交付清单
    deletePlanDelvAssign = () => {
        const { selectData } = this.state;
        if (!selectData && selectData.length == 0) {
            notification.warning({
                placement: 'bottomRight',
                bottom: 50,
                duration: 2,
                message: '未选中数据',
                description: '请选择数据进行操作'
            })
            return;
        }
        const data = selectData.map(v => {
            return v.id
        })
        let { rightData } = this.props
        Array.isArray(rightData) ? null : rightData = [rightData]
        if (rightData && ((rightData[0]['nodeType'] == 'wbs' || rightData[0]['type'] == 'wbs') || (rightData[0]['nodeType'] == 'task' || rightData[0]['type'] == 'task'))) {
            let { startContent } = this.props.extInfo || {};
            let url = dataUtil.spliceUrlParams(deletePlanDelvAssign, { startContent });
            axios.deleted(url, { data }, true).then(res => {
                this.table.getData()
                this.setState({
                    activeIndex: [],
                    currentIndex: [],
                    currentData: [],
                    selectData:[],
                    selectedRowKeys:[]
                });
            })
        }
    }



    // 上传交付清单
    addDocFileRelations = (fileList) => {
        let { rightData } = this.props
        const { selectData, activeIndex } = this.state
        Array.isArray(rightData) ? null : rightData = [rightData]
        if (rightData && ((rightData[0]['nodeType'] == 'wbs' || rightData[0]['type'] == 'wbs') || (rightData[0]['nodeType'] == 'task' || rightData[0]['type'] == 'task'))) {
            let { startContent } = this.props.extInfo || {};
            let url = dataUtil.spliceUrlParams(addDocFileRelations(activeIndex, 'delv'), { startContent });
            axios.post(url, fileList).then(res => {
                this.setState({
                    upfileModal: false
                })
                this.table.getData()
            })
        }
    }

    // 修改交付清单列表
    updateDocFileRelations = (fileList) => {

        let { rightData } = this.props
        const { selectData, activeIndex } = this.state
        Array.isArray(rightData) ? null : rightData = [rightData]
        if (rightData && ((rightData[0]['nodeType'] == 'wbs' || rightData[0]['type'] == 'wbs') || (rightData[0]['nodeType'] == 'task' || rightData[0]['type'] == 'task'))) {
            let { startContent } = this.props.extInfo || {};
            let url = dataUtil.spliceUrlParams(updateDocFileRelations(activeIndex, 'delv'), { startContent });
            axios.put(url, fileList).then(res => {
                this.closeModifyFileModal()
            })
        }
    }

    /**
        * 获取复选框 选中项、选中行数据
        * @method updateSuccess
        * @param {string} selectedRowKeys 复选框选中项
        * @param {string} selectedRows  行数据
        */
    getSelectedRowKeys = (selectedRowKeys, selectedRows) => {
        this.setState({
            selectData:selectedRows,
            selectedRowKeys
        })
    }

    //打开上传弹框
    openUpFile = () => {
        const { currentData } = this.state
        if (currentData.length == 0) {
            notification.warning({
                placement: 'bottomRight',
                bottom: 50,
                duration: 2,
                message: '未选中数据',
                description: '请选择数据进行操作'
            })
            return;
        }
        this.setState({
            upfileModal: true
        })
    }
    //打开修改Modal
    openModify = () => {
        const { currentData } = this.state
        if (currentData.length == 0) {
            notification.warning({
                placement: 'bottomRight',
                bottom: 50,
                duration: 2,
                message: '未选中数据',
                description: '请选择数据进行操作'
            })
            return;
        }
        this.setState({ modifyFile: true })
    }
    //完成
    completeEdit = (time) => {

        const { selectData } = this.state;

        const ids = selectData.map(v => {
            return v.id
        })
        let obj = {
            ids,
            completeTime: time.format("YYYY-MM-DD")
        }
        let { startContent } = this.props.extInfo || {};
        let url = dataUtil.spliceUrlParams(assignComplete, { startContent });
        axios.put(url, obj, true, null, true).then(res => {

            this.table.getData();
            this.setState({
                activeIndex: [],
                currentIndex: [],
                currentData: [],
                selectData: [],
                visible: false
            });
        })
    }
    seleDate = (value) => {
        this.setState({
            time: value
        })
    }
    handleVisibleChange = visible => {
        if (!this.props.delvEditAuth) {
            return
        }
        if (!visible) {
            this.setState({
                time: null,
                visible
            })
        } else {
            const { selectData } = this.state;
            if (selectData.length == 0) {
                notification.warning({
                    placement: 'bottomRight',
                    bottom: 50,
                    duration: 2,
                    message: '未选中数据',
                    description: '请勾选数据进行操作'
                })
                return;
            }
            this.setState({ visible });
        }

    };
    render() {



        const columns = [
            {
                title: "名称",
                dataIndex: 'delvTitle',
                key: 'delvTitle',
                width:"15%",
            },
            {
                title: intl.get('wsd.i18n.plan.delvList.delvcode'),
                dataIndex: 'delvCode',
                key: 'delvCode',
                width:"15%",
            },
            {
                title: intl.get('wsd.i18n.plan.delvList.delvtype'),
                dataIndex: 'delvType',
                key: 'delvType',
                width:"15%",
                render: data => data ? data.name : ''
            },
            {
                title: "计划级别",
                dataIndex: 'planLevel',
                key: 'planLevel',
                width:"18%",
                render: data => data ? data.name : ''
            },
            {
                title: intl.get('wsd.i18n.plan.delvList.plandelvnum'),
                dataIndex: 'delvNum',
                key: 'delvNum',
                width:"18%",
            },
            {
                title: "计划开始时间",
                dataIndex: 'planStartTime',
                key: 'planStartTime',
                width:"18%",
                render: (text) => text ? dataUtil.Dates().formatTimeString(text, this.state.projSet.dateFormat) : ""
            },
            {
                title: "计划完成时间",
                dataIndex: 'planEndTime',
                key: 'planEndTime',
                width:"18%",
                render: (text) => text ? dataUtil.Dates().formatTimeString(text, this.state.projSet.dateFormat) : ""
            },
            {
                title: intl.get('wsd.i18n.plan.delvList.completestatus'),
                dataIndex: 'delvStatus',
                key: 'delvStatus',
                width:"18%",
                render: data => data && data.name
            },
            {
                title: intl.get('wsd.i18n.plan.delvList.completetime'),
                dataIndex: 'completeTime',
                key: 'completeTime',
                width:"18%",
                render: (text) => text ? dataUtil.Dates().formatTimeString(text, this.state.projSet.dateFormat) : ""
            },
            {
                title: intl.get('wsd.i18n.plan.delvList.actdelvnum'),
                dataIndex: 'actulDelvNum',
                key: 'actulDelvNum',
                width:"18%",
                render: (text, record) => text ? <span> <a style={{ color: "#1890ff" }} onClick={this.onClickHandleCheck.bind(this, record)}>{`查看(${text})`}</a></span> : "--"
            },
        ];

        const content = (
            <div>
                <DatePicker onChange={this.seleDate} style={{ width: "100%", marginBottom: 10 }} value={this.state.time} />
                <Button onClick={() => this.completeEdit(this.state.time)} type="primary" disabled={!this.state.time}>确定</Button>
            </div>
        )
        return (
          <LabelTableLayout title = {this.props.title} menuCode = {this.props.menuCode}>
            <LabelToolbar>
              {/*分配*/}
              <PublicButton title={"分配"} edit={this.props.delvEditAuth || false} useModel={false}
                            afterCallBack={() => { this.setState({ showDistribute: true }) }} icon={"icon-fenpei"} />

              <PublicButton title={"新增"} edit={this.props.delvEditAuth || false} useModel={false}
                            afterCallBack={() => { this.setState({ addModal: true }) }} icon={"icon-add"} />

              <PublicButton title={"修改"} edit={(this.props.delvEditAuth || false) && this.state.isUnComplete} useModel={false}
                            afterCallBack={this.openModify} icon={"icon-xiugaibianji"} />

              <PublicButton title={"上传"} edit={(this.props.delvEditAuth || false) && this.state.isUnComplete} useModel={false}
                            afterCallBack={this.openUpFile} icon={"icon-shangchuanwenjian"} />

              <PublicButton title={"删除"} edit={this.props.delvEditAuth || false} useModel={true} verifyCallBack={this.deleteVerifyCallBack}
                            afterCallBack={this.deletePlanDelvAssign} icon={"icon-delete"} />

              <Popover placement="bottom" title={"请选择日期"} content={content} trigger="click"
                       visible={this.state.visible}
                       onVisibleChange={this.handleVisibleChange}
              >
                {this.props.delvEditAuth ?
                  <span style={{ cursor: "pointer" }} className="topBtnActivity sadd"><MyIcon type="icon-chuli" style={{ fontSize: 15, verticalAlign: "middle" }} className="my-btnback" /> <a className="ant-dropdown-link" href="#"> 完成</a></span>
                  : <span className="= sadd"><MyIcon type="icon-chuli" style={{ fontSize: 15, verticalAlign: "middle" }} />  完成</span>}

              </Popover>
            </LabelToolbar>
            <LabelTable labelWidth = {this.props.labelWidth } contentMinWidth = {1000}>
              <PublicTable onRef={this.onRef} getData={this.getPlanDelvAssignTaskList}
                           pagination={false} columns={columns}
                           getRowData={this.getInfo}
                           useCheckBox={true}
                           rowSelection={true}
                           closeContentMenu={true}
                           onChangeCheckBox={this.getSelectedRowKeys}
                           checkboxStatus={record=>record.delvStatus && record.delvStatus.id == "ACCEPTANCE" ? true : false}
              />
            </LabelTable>
            {this.state.showDistribute && <DistributionModal
              rightData={this.props.rightData}
              planDelvTaskAssign={this.planDelvTaskAssign}
              handleCancel={this.closeDistributionModal.bind(this)}
            />}
            {this.state.addModal && <AddModal
              handleCancel={this.closeAddModal.bind(this)}
              addPlanDelvAssign={this.addPlanDelvAssign}
              rightData={this.props.rightData}
              projSet={this.state.projSet}
            />}
            {this.state.upfileModal && <UploadModal
              handleCancel={() => this.setState({ upfileModal: false })}
              addDocFileRelations={this.addDocFileRelations}
            >
            </UploadModal>}
            {this.state.modifyFile && <ModifyFileModal
              rightData={this.props.rightData}
              selectData={this.state.currentData}
              activeIndex={this.state.activeIndex}
              updatePlanDelvAssign={this.updatePlanDelvAssign}
              updateDocFileRelations={this.updateDocFileRelations}
              handleCancel={this.closeModifyFileModal.bind(this)}
              projSet={this.state.projSet}
            />}
            {this.state.isShowCheckModal &&
            <CheckModal
              refresh={this.refresh}
              visible={this.state.isShowCheckModal}
              handleCancel={this.closeCheckModal.bind(this)}
              record={this.state.checkRecord}
              closeAuth={this.state.checkRecord.delvStatus && this.state.checkRecord.delvStatus.id == "ACCEPTANCE" ? false : true}
            />}

          </LabelTableLayout>
        )
    }
}

export default DeliveryList
