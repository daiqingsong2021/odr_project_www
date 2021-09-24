import React, { Component } from 'react'
import { Table, notification,Button } from 'antd'
import style from './style.less'
import { connect } from 'react-redux'
import { changeLocaleProvider } from '@/store/localeProvider/action'
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
import { queryDailyReportList, constructionDailyDetail,updateConstructionDaily } from '@/modules/Suzhou/api/suzhou-api';
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
        axios.get(queryDailyReportList(pageSize, currentPageNum)+`?line=${line}&startTime=${searcher.startTime}&endTime=${searcher.endTime}&reportType=1&reviewStatus=${searcher.reviewStatus}`).then(res => {
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
    //打开详情页面
    openInfo = (record) => {
        this.queryConstructionDailyDetail(record.id);
        this.setState({
            infoId:record.id,
            ConstructionInfoShow: true
        });
    }
    //关闭详情页面
    handleCancel = () => {
        this.setState({
            ConstructionInfoShow: false
        })
    }
    queryConstructionDailyDetail = (id) => {
        axios.get(constructionDailyDetail(id)).then(res => {
            // console.log(res)
            this.setState({
                constructionDailyDetailData:res.data.data
            })
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
    submit = (values, type) => {
        const data = {
            ...values,
            id:this.state.infoId
        };
        if(type == 'update'){
            axios.post(updateConstructionDaily, data, true).then(res => {
                // console.log(res)
                if(res.data && res.data.success){
                    this.handleCancel()
                    this.addSuccess()
                }else{
                    notification.error(
                        {
                        placement: 'bottomRight',
                        bottom: 50,
                        duration: 2,
                        message: '出错了',
                        description: '抱歉，网络开小差了，请稍后重试'
                        }
                    )
                }
            })
        }
    };
    changeRight=(result,msg)=>{
        setRightShow(result,msg).then(res=>{
            this.setState({
                ...res
            })
        })
    }
    downloadFile = (fileId) => {
        axios.down("/api/doc/file/down?fileId="+fileId, {}).then((e) => {
          
        });
    }
    handleViewFile = (fileId) => {
        // console.log(record)
        let arr = ['html', 'txt', 'jpg', 'jpeg', 'gif', 'png', 'art', 'au', 'aiff', 'xbm', 'pdf','doc','docx','rtf','xls','xlsx','csv'];
        if (fileId) {
          const { startContent } = this.state
          let url = dataUtil.spliceUrlParams(docFileInfo(fileId), { startContent });
          axios.get(url).then(res => {
            if (res.data.data && res.data.data.fileUrl) {
              let type = res.data.data.fileName ? res.data.data.fileName.substring(res.data.data.fileName.lastIndexOf(".")+1) : '';
              if(type){
                type = type.toLowerCase();
              }
              let index = arr.findIndex(item => item == type);
              if (index != -1) {
                if (res.data.data.fileViewUrl && (type == 'doc' ||  type == 'docx' ||  type == 'rtf' ||  type == 'xls' ||  type == 'xlsx' ||  type == 'csv')){
                  window.open(res.data.data.fileViewUrl)
                } else{
                  window.open(res.data.data.fileUrl)
                }
              } else {
                dataUtil.message('此文档类型不支持在线查看，请下载查看！');
              }
            }
          })
        } else {
          dataUtil.message('该文件已被服务器大叔吃了!');
        }
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
            // {
            //     title: '日报类型',
            //     dataIndex: 'reportTypeVo.name',
            //     key: 'reportTypeVo.name',
            // },
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
                            <Button size='small' type="primary" onClick={this.handleViewFile.bind(this,record.loadId)}>查看</Button>&nbsp;&nbsp;
                            {/* <Button size='small' type="primary" onClick={()=>window.location.href = record.wordFile}>下载</Button> */}
                            {this.state.permission && this.state.permission.indexOf('LIST-ZH_DOWNLOAD') !== -1 && <Button size='small' type="primary" onClick={this.downloadFile.bind(this,record.loadId)}>下载</Button>}
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
                    {/* {ConstructionInfoShow &&
                        <ConstructionInfo
                            modalVisible={ConstructionInfoShow}
                            handleCancel={this.handleCancel}
                            constructionDailyDetailData={constructionDailyDetailData}
                            submit={this.submit.bind(this)}
                        />} */}
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
                        bizType="DAYREPORT-LIST-ZH"
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