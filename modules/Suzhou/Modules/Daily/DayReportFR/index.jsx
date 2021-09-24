import React, { Component } from 'react'
import { Table, notification,Button } from 'antd'
import style from './style.less'
import { connect } from 'react-redux'
import { changeLocaleProvider } from '@/store/localeProvider/action'
import { getBaseData } from '@/modules/Suzhou/components/Util/util';
import RightTags from '@/modules/Suzhou/components/RightTags/index';
import * as util from '@/utils/util';
import * as dataUtil from '@/utils/dataUtil';
import { } from '@/modules/Suzhou/api/suzhou-api';
import axios from '@/api/axios';
import TopTagsForm from './TopTags/index';
import { docFileInfo} from '../../../../../api/api';
import notificationFun from '@/utils/notificationTip';
//二级详情页面
import ConstructionInfo from './AddModal/index'
// 布局
import ExtLayout from "@/components/public/Layout/ExtLayout";
import MainContent from "@/components/public/Layout/MainContent";
import Toolbar from "@/components/public/Layout/Toolbar";
import PublicTable from '@/components/PublicTable'
import { firstLoad } from "@/modules/Suzhou/components/Util/firstLoad";
import { isChina, columnsCreat, permissionFun,setRightShow } from "@/modules/Suzhou/components/Util/util.js";
import { queryFineDailyReportList } from '@/modules/Suzhou/api/suzhou-api';
import { thresholdFreedmanDiaconis } from 'd3'
class Driving extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedRowKeys: [],
            pageSize: 10,
            currentPageNum: 1,
            total: '',
            selectedRows: [],
            data: [],
            activeIndex: null,
            searcher: {
                startTime:'',
                endTime:'',
                line:'',
                reviewStatus:'',
                reportType:''
            }, //搜索
            status: '', //状态
            ConstructionInfoShow: false,  //详情页展示
        }
    }
    /**
    * 父组件即可调用子组件方法
    * @method
    * @description 获取用户列表、或者根据搜索值获取用户列表
    * @param {string} record  行数据
    * @return {array} 返回选中用户列表
    */
    onRef = (ref) => {
        this.table = ref
    }
    //获取复选框 选中项、选中行数据
    getSelectedRowKeys = (selectedRowKeys, selectedRows) => {
        // console.log(selectedRowKeys)
        this.setState({
            selectedRows,
            selectedRowKeys
        })
    }
    getInfo = (record) => {
        const { activeIndex } = this.state;
        const { id } = record;
        this.setState({
            activeIndex: id,
            record: record,
            rightData: record
        });
    }
    getList = (currentPageNum, pageSize, callBack) => {
        const {searcher} = this.state;
        let line = '';
        if(searcher.line == '全部'){
            line = searcher.treeDataXl[0].children.map(item => item.value).join(',')
        }else{
            line = searcher.line
        }
        axios.get(queryFineDailyReportList(pageSize, currentPageNum)+`?line=${line}&startTime=${searcher.startTime}&endTime=${searcher.endTime}&reviewStatus=${searcher.reviewStatus}`).then(res => {
            callBack(res.data.data ? res.data.data : [])
            let data = res.data.data;
            this.setState({
                data,
                total: res.data.total,
                rightData: null,
                selectedRowKeys: [],
            })
        })
    }
    componentDidMount() {
        permissionFun(this.props.menuInfo.menuCode).then(res => {
            this.setState({
                permission: !res.permission ? [] : res.permission
            })
        });
    }
    //增加回调
    addSuccess = (val) => {
        this.table.recoveryPage(1)
        this.table.getData();
    }
    //流程审批回调
    updateFlow = () => {
        this.table.getData();
    }
    //删除回调
    delSuccess = (del) => {
        this.table.getData();
    }
    //更新回调
    updateSuccess = (val) => {
        this.table.update(this.state.rightData, val)
    }
    //导入更新
    updateImportFile = () => {
        this.table.getData();
    }
    //关闭详情页面
    handleCancel = () => {
        this.setState({
            ConstructionInfoShow: false
        })
    }
    
    //搜索
    search = (startTime,endTime,line,treeDataXl,reportType,reviewStatus) => {
        //true ? this.table.recoveryPage(1) : '';
        const {  } = this.state;
        // console.log(this.state.searcher)
        this.setState({
            searcher: {startTime,endTime,line,treeDataXl,reportType,reviewStatus},
        }, () => {
            // console.log(this.state.searcher)
                this.table.getData();
        })
    }
    //设置table的选中行class样式
    setClassName = (record, index) => {
        return record.id === this.state.activeIndex ? 'tableActivty' : '';
    };
    
    changeRight=(result,msg)=>{
        setRightShow(result,msg).then(res=>{
            this.setState({
                ...res
            })
        })
    }
    downloadFile = (record) => {
        // axios.down("/api/doc/file/down?fileId="+fileId, {}).then((e) => {
          

        // });
        getBaseData('fr_url').then(data =>{//
            const url = `http://${data[0].value}/webroot/decision/view/form?viewlet=%25E7%2594%259F%25E6%2588%2590%25E6%2597%25A5%25E6%258A%25A5%252F%25E8%25BF%2590%25E8%2590%25A5%25E6%2597%25A5%25E6%258A%25A5-%25E5%2588%2597%25E8%25A1%25A8%25E7%2594%259F%25E6%2588%2590.frm&para_record_time=${record.reportName}&line=${record.line}&initMan=${record.initMan?record.initMan:''}&creatTime=${record.creatTime?record.creatTime:''}&reviewor=${record.reviewor?record.reviewor:''}&recordId=${record.id}&__filename__=运营日报 ${record.line}号线 ${record.reportName}&op=export&format=word`
            window.location.href = url
        })
    }
    handleViewFile = (record) => {
        getBaseData('fr_url').then(data => { window.open(`http://${data[0].value}/webroot/decision/view/form?viewlet=%25E7%2594%259F%25E6%2588%2590%25E6%2597%25A5%25E6%258A%25A5%252F%25E8%25BF%2590%25E8%2590%25A5%25E6%2597%25A5%25E6%258A%25A5-%25E5%2588%2597%25E8%25A1%25A8%25E7%2594%259F%25E6%2588%2590.frm&para_record_time=${record.reportName}&line=${record.line}&initMan=${record.initMan?record.initMan:''}&creatTime=${record.creatTime?record.creatTime:''}&reviewor=${record.reviewor?record.reviewor:''}&recordId=${record.id}`) })
    }
    render() {
        const columns = [
            {
                title: '日报日期',
                dataIndex: 'reportName',
                key: 'reportName',
                render: (text, record) => {
                    // return <span>{text}</span>
                    return <span onClick={this.changeRight.bind(this, record)} style={{ color: 'rgb(45,182,244)', cursor: 'pointer' }}>{text}</span>
                }
            },
            {
                title: '生成人',
                dataIndex: 'initMan',
                key: 'initMan',
            },
            {
                title: '生成日期',
                dataIndex: 'creatTime',
                key: 'creatTime',
            },
            {
                title: '线路',
                dataIndex: 'line',
                key: 'line',
                render:(text,record)=>{
                    return <span>{text}号线</span>
                }
            },
            {
                title: '审批状态',
                dataIndex: 'reviewStatusVo.name',
                key: 'reviewStatusVo.name',
            },
            {
                title: '审批人',
                dataIndex: 'reviewor',
                key: 'reviewor',
            },
            {
                title: '日报备注',
                dataIndex: 'description',
                key: 'description',
            },
            {
                title: '操作',
                dataIndex: 'pdfFile',
                key: 'pdfFile',
                render:(text,record)=>{
                    return(
                        <div>
                            <Button size='small' type="primary" onClick={this.handleViewFile.bind(this,record)}>查看</Button>&nbsp;&nbsp;
                            {/* <Button size='small' type="primary" onClick={()=>window.location.href = record.wordFile}>下载</Button> */}
                            {this.state.permission && record.reviewStatus == 'APPROVED' && this.state.permission.indexOf('LIST-FR_DOWNLOAD') !== -1 && <Button size='small' type="primary" onClick={this.downloadFile.bind(this,record)}>下载</Button>}
                        </div>
                    )
                }
            }
        ];
        const { ConstructionInfoShow,constructionDailyDetailData } = this.state
        return (
            <ExtLayout renderWidth={({ contentWidth }) => { this.setState({ contentWidth }) }}>
                <Toolbar>
                    <TopTagsForm
                        record={this.state.record}
                        selectedRows={this.state.selectedRows}
                        success={this.addSuccess}
                        delSuccess={this.delSuccess}
                        search={this.search}
                        searcher={this.state.search}
                        updateFlow={this.updateFlow}
                        bizType={this.props.menuInfo.menuCode}
                        updateImportFile={this.updateImportFile}
                        permission={this.state.permission}
                    />
                </Toolbar>
                <MainContent contentWidth={this.state.contentWidth} contentMinWidth={1100}>
                    <PublicTable onRef={this.onRef}
                        pagination={true}
                        getData={this.getList}
                        columns={columns}
                        rowSelection={true}
                        onChangeCheckBox={this.getSelectedRowKeys}
                        useCheckBox={true}
                        getRowData={this.getInfo}
                        total={this.state.total}
                        pageSize={10}
                        isReport={true}
                    />
                </MainContent>
                <RightTags
                        fileRelease={true}
                        rightData={this.state.rightData}
                        updateSuccess={this.updateSuccess}
                        groupCode={1}
                        isCheckWf={true}  //流程查看
                        openWorkFlowMenu = {this.props.openWorkFlowMenu}
                        menuCode = {this.props.menuInfo.menuCode}
                        menuId = {this.props.menuInfo.id}
                        bizType="DAYREPORT-LIST-FR"
                        bizId = {this.state.rightData ? this.state.rightData.id : null}
                        fileEditAuth={true}
                        extInfo={{startContent: "日报管理"}}
                        permission={this.state.permission}
                        refreshList={this.refreshList}
                        rightTagShow={this.state.rightTagShow}
                        handleDouble={this.changeRight}
                    />
            </ExtLayout>
        )
    }
}
export default connect(state => ({
    currentLocale: state.localeProviderData
}), {
    changeLocaleProvider
})(Driving);