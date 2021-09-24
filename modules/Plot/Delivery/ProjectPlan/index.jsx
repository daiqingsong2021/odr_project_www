import React, { Component } from 'react'
import intl from 'react-intl-universal'
import Search from "../../../../components/public/Search"
import PublicButton from "../../../../components/public/TopTags/PublicButton"
import {
    getPlanDelvListByConds, getPlanDelvAssignFileList
} from '../../../../api/api'
import axios from '../../../../api/axios';
import PublicTable from '../../../../components/PublicTable'
import * as dataUtil from '../../../../utils/dataUtil'
import * as util from '../../../../utils/util'
import LabelToolbar from '../../../../components/public/Layout/Labels/Table/LabelToolbar'
import LabelTableLayout from '../../../../components/public/Layout/Labels/Table/LabelTableLayout'
import LabelTable from '../../../../components/public/Layout/Labels/Table/LabelTable'
import LabelTableItem from '../../../../components/public/Layout/Labels/Table/LabelTableItem'

class ProjectPlan extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            activeIndex: [],
            data1: [],
            record1: null
        }
    }

    //注册 父组件即可调用子组件方法
    onRef = (ref) => {
        this.table = ref
    }
    //注册 父组件即可调用子组件方法
    onRefR = (ref) => {
        this.tableR = ref
    }
    // 获取项目交付物相关的任务列表 - 查询条件
    getPlanDelvListByConds = (callBack) => {
        const delvId = this.props.rightData.id
        axios.get(getPlanDelvListByConds(delvId)).then(res => {
            callBack(res.data.data ? res.data.data : [])
            const { data } = res.data
            this.setState({
                data
            })
        })
    }

    onClickHandle = () => { }


    //左侧table 点击
    getInfo = (record, index) => {
        this.setState({
            activeIndex: [record.id],
            record1: record
        }, () => {
            this.tableR.getData()
        })
    }

    //右侧table 获取数据
    getRightData = (callBack) => {
        let { record1 } = this.state;
        if(!record1){
            callBack([])
            return;
        }
        axios.get(getPlanDelvAssignFileList(record1.id)).then(res => {
            callBack(res.data.data ? res.data.data : [])
            this.setState({
                data1: res.data.data
            })
        })

    }

    //右侧table 点击
    getInfo2 = (record, index) => {
        this.setState({
            selectFile: record,
            activeIndex2: record.id
        })
    }
    //下载
    downLoad = () => {
        if (!this.state.selectFile) {
            return
        }
        util.download(this.state.selectFile.fileUrl, this.state.selectFile.fileName)
    }
    render() {
        const columns = [
            {
                title: intl.get("wsd.i18n.base.planTem.name"),
                dataIndex: 'taskName',
                key: 'taskName',
            },
            {
                title: intl.get("wsd.i18n.pre.eps.projectcode"),
                dataIndex: 'taskCode',
                key: 'taskCode',
            },
            {
                title: "计划开始",
                dataIndex: 'planStartTime',
                key: 'planStartTime',
                render: (text) => dataUtil.Dates().formatDateString(text)
            },
            {
                title: "计划完成",
                dataIndex: 'planEndTime',
                key: 'planEndTime',
                render: (text) => dataUtil.Dates().formatDateString(text)
            },
            {
                title: "实际开始",
                dataIndex: 'actStartTime',
                key: 'actStartTime',
                render: (text) => dataUtil.Dates().formatDateString(text)
            },
            {
                title: "实际完成",
                dataIndex: 'actEndTime',
                key: 'actEndTime',
                render: (text) => dataUtil.Dates().formatDateString(text)
            },
            {
                title: "交付状态",
                dataIndex: 'delvStatus',
                key: 'delvStatus',
                render: data => data && data.name
            },
            {
                title: "交付时间",
                dataIndex: 'completeTime',
                key: 'completeTime',
                render: (text) => dataUtil.Dates().formatDateString(text)
            },
        ];
        const columns1 = [
            {
                title: "名称",
                dataIndex: 'fileName',
                key: 'fileName',
                width: '150px',
                render: data => data.split(".")[0]
            },
            {
                title: "文件类型",
                dataIndex: 'suffix',
                key: 'suffix',
            },
            {
                title: "创建日期",
                dataIndex: 'creatTime',
                key: 'creatTime',
                render: (text) => dataUtil.Dates().formatDateString(text)
            }
        ]
        return (
          <LabelTableLayout menuCode = {this.props.menuCode}>
            <LabelTableItem title = {"计划"}>
              <LabelToolbar>
                <Search></Search>
              </LabelToolbar>
              <LabelTable labelWidth = {this.props.labelWidth } contentMinWidth = {300}>
                <PublicTable
                  onRef={this.onRef} getData={this.getPlanDelvListByConds}
                  columns={columns}
                  getRowData={this.getInfo}
                />
              </LabelTable>
            </LabelTableItem>
            <LabelTableItem title = {"文件"}>
              <LabelToolbar>
                {/*下载*/}
                <PublicButton name={'下载'} title={'下载'} icon={'icon-xiazaiwenjian'} afterCallBack={this.downLoad} />
              </LabelToolbar>
              <LabelTable labelWidth = {this.props.labelWidth } contentMinWidth = {300}>
                <PublicTable
                  onRef={this.onRefR} getData={this.getRightData}
                  columns={columns1}
                  getRowData={this.getInfo2}
                />
              </LabelTable>
            </LabelTableItem>
          </LabelTableLayout>
        )
    }
}

export default ProjectPlan
