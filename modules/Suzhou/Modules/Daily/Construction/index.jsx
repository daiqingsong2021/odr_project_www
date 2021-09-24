import React, { Component } from 'react'
import { notification } from 'antd'
import { connect } from 'react-redux'
import { changeLocaleProvider } from '@/store/localeProvider/action'
import RightTags from '@/modules/Suzhou/components/RightTags/index';
import { } from '@/modules/Suzhou/api/suzhou-api';
import axios from '@/api/axios';
import TopTags from './TopTags/index';
//二级详情页面
import ConstructionInfo from './AddModal/index'
// 布局
import ExtLayout from "@/components/public/Layout/ExtLayout";
import MainContent from "@/components/public/Layout/MainContent";
import Toolbar from "@/components/public/Layout/Toolbar";
import PublicTable from '@/components/PublicTable'
import { firstLoad } from "@/modules/Suzhou/components/Util/firstLoad";
import { permissionFun,setRightShow } from "@/modules/Suzhou/components/Util/util.js";
import { constructionDailyList, constructionDailyDetail,updateConstructionDaily } from '@/modules/Suzhou/api/suzhou-api';
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
                line:''
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
        console.log(selectedRowKeys)
        this.setState({
            selectedRows,
            selectedRowKeys
        })
    }
    getInfo = (record) => {
        console.log('record',record)
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
        axios.get(constructionDailyList(pageSize, currentPageNum)+`?line=${line}&startTime=${searcher.startTime}&endTime=${searcher.endTime}`).then(res => {
            callBack(res.data.data ? res.data.data : [])
            let data = res.data.data;
            this.setState({
                data,
                total: res.data.total,
                rightData: null,
                selectedRowKeys: [],
            })
            if(this.state.addRecord && this.state.addRecord.id){
                console.log(10086)
                this.getInfo(this.state.addRecord)
                this.changeRight(this.state.addRecord,true)
            }
        })
    }
    componentDidMount() {
        // console.log(this.props)
        permissionFun(this.props.menuInfo.menuCode).then(res => {
            this.setState({
                permission: !res.permission ? [] : res.permission
            })
        });
    }
    //增加回调
    addSuccess = (val,record) => {
        this.setState({
            addRecord:val,
            // lineName:record.lineName,
            // createName:record.createVo.name
        })
        this.table.recoveryPage(1)
        this.table.getData();
        // console.log(this.state.lineName,this.state.createName)
    }
    //流程审批回调
    updateFlow = () => {
        this.table.getData();
    }
    //删除回调
    delSuccess = () => {
        this.table.getData();
    }
    approveSuccess = () => {
        this.table.getData();
    }
    //更新回调
    updateSuccess = (val) => {
        this.table.getData();
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
            ConstructionInfoShow: true,
            canModifyInit:this.state.permission && this.state.permission.indexOf('CONSTRUCTIONMANAGE_CONSTRUCTION-EDIT-I') !== -1 && record.reviewStatusVo.code == 'INIT',
            canModifyApproved:this.state.permission && this.state.permission.indexOf('CONSTRUCTIONMANAGE_CONSTRUCTION-EDIT-A') !== -1 && record.reviewStatusVo.code == 'APPROVED'
        });
    }
    //关闭详情页面
    handleCancel = () => {
        this.setState({
            ConstructionInfoShow: false
        })
    }
      //关闭详情页刷新列表
      closeInfo =() =>{
          this.setState({
              addRecord:{}
          })
        this.table.getData();
    }
    queryConstructionDailyDetail = (id) => {
        axios.get(constructionDailyDetail(id)).then(res => {
            console.log(res)
            this.setState({
                constructionDailyDetailData:res.data.data
            })
        })
    }
    //搜索
    search = (startTime,endTime,line,treeDataXl) => {
        //true ? this.table.recoveryPage(1) : '';
        const {  } = this.state;
        this.setState({
            searcher: {startTime,endTime,line,treeDataXl},
        }, () => {
            console.log(this.state.searcher)
                this.table.getData();
        })
    }
    changeRight=(result,msg)=>{
        console.log(result,msg)
        setRightShow(result,msg).then(res=>{
            this.setState({
                ...res,
                infoId:this.state.rightData.id,
                canModifyInit:this.state.permission && this.state.permission.indexOf('CONSTRUCTIONMANAGE_CONSTRUCTION-EDIT-I') !== -1 && this.state.rightData.reviewStatusVo.code == 'INIT',
                canModifyApproved:this.state.permission && this.state.permission.indexOf('CONSTRUCTIONMANAGE_CONSTRUCTION-EDIT-A') !== -1 && this.state.rightData.reviewStatusVo.code == 'APPROVED'
            })
        })
    }
    //设置table的选中行class样式
    setClassName = (record) => {
        return record.id === this.state.activeIndex ? 'tableActivty' : '';
    };
    submit = (values, type) => {
        const data = {
            ...values,
            id:this.state.infoId
        };
        
        if(type == 'update'){
            console.log(12323)
            axios.post(updateConstructionDaily, data, true).then(res => {
                console.log(res)
                if(res.data && res.data.success){
                    this.handleCancel()
                    // this.addSuccess()
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
    render() {
        const columns = [
            // {
            //     title: "序号",
            //     render: (text, record, index) => index + 1
            // },
            {
                title: '日期',
                dataIndex: 'recordTime',
                key: 'recordTime',
                render: (text, record) => {
                    return <span onClick={this.changeRight.bind(this, record)} style={{ color: 'rgb(45,182,244)', cursor: 'pointer' }}>{text}</span>
                }
            },
            {
                title: '线路',
                dataIndex: 'lineName',
                key: 'lineName',
            },
            {
                title: '周计划施工数',
                dataIndex: 'weeklyPlanConstructionQuantity',
                key: 'weeklyPlanConstructionQuantity',
                render:(text,record)=>{
                    return <span>{record.weeklyPlanConstructionQuantity}</span>
                }
            },
            {
                title: '周计划实际完成数',
                dataIndex: 'weeklyActualConstructionQuantity',
                key: 'weeklyActualConstructionQuantity',
                render:(text,record)=>{
                    return <span>{record.weeklyActualConstructionQuantity}</span>
                }
            },
            {
                title: '抢修施工计划完成数',
                dataIndex: 'repairPlanConstructionQuantity',
                key: 'repairPlanConstructionQuantity',
                render:(text,record)=>{
                    return <span>{record.repairPlanConstructionQuantity}</span>
                }
            },
            {
                title: '抢修施工实际完成数',
                dataIndex: 'repairActualConstructionQuantity',
                key: 'repairActualConstructionQuantity',
                render:(text,record)=>{
                    return <span>{record.repairActualConstructionQuantity}</span>
                }
            },
            {
                title: '计划施工数',
                dataIndex: 'totalPlanConstructionQuantity',
                key: 'totalPlanConstructionQuantity',
            },
            {
                title: '计划施工实际完成数',
                dataIndex: 'totalActualConstructionQuantity',
                key: 'totalActualConstructionQuantity',
            },
            {
                title: '情况说明',
                dataIndex: 'description',
                key: 'description',
            },
            {
                title: '状态',
                dataIndex: 'reviewStatusVo.name',
                key: 'reviewStatusVo.name',
            }
        ];
        const { ConstructionInfoShow,constructionDailyDetailData } = this.state
        return (
            <ExtLayout renderWidth={({ contentWidth }) => { this.setState({ contentWidth }) }}>
                <Toolbar>
                    <TopTags
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
                        approveSuccess={this.approveSuccess}
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
                    />
                    {ConstructionInfoShow &&
                        <ConstructionInfo
                            modalVisible={ConstructionInfoShow}
                            rightData={this.state.rightData}
                            handleCancel={this.handleCancel}
                            constructionDailyDetailData={constructionDailyDetailData}
                            submit={this.submit.bind(this)}
                        />}
                </MainContent>
                <RightTags
                        submit={this.submit.bind(this)}
                        canModifyApproved={this.state.canModifyApproved}
                        canModifyInit={this.state.canModifyInit}
                        fileRelease={true}
                        rightData={this.state.rightData}
                        record={this.state.record}
                        updateSuccess={this.updateSuccess}
                        groupCode={1}
                        isCheckWf={true}  //流程查看
                        openWorkFlowMenu = {this.props.openWorkFlowMenu}
                        menuCode = {this.props.menuInfo.menuCode}
                        menuId = {this.props.menuInfo.id}
                        bizType="DAILYMANAGE-CONSTRUCTIONMANAGE"
                        bizId = {this.state.rightData ? this.state.rightData.id : null}
                        fileEditAuth={true}
                        extInfo={{startContent: "施工日况"}}
                        permission={this.state.permission}
                        refreshList={this.refreshList}
                        rightTagShow={this.state.rightTagShow}
                        handleDouble={this.changeRight}
                        closeInfo={this.closeInfo}
                        id={this.state.infoId}
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