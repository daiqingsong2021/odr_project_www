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
import { dailyRepresentationList,addDailyRepresentation,updateDailyRepresentation } from '@/modules/Suzhou/api/suzhou-api';
import AddModal from './AddModal'
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
        axios.get(dailyRepresentationList(pageSize, currentPageNum)+`?line=${line}&startTime=${searcher.startTime}&endTime=${searcher.endTime}`).then(res => {
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
        // console.log(this.props)
        permissionFun(this.props.menuInfo.menuCode).then(res => {
            this.setState({
                permission: !res.permission ? [] : res.permission
            })
        });
        // firstLoad().then(() => {

        // })
    }
    //增加回调
    addSuccess = () => {
        this.table.recoveryPage(1)
        this.table.getData();
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
            // ConstructionInfoShow: true,
            canModifyInit:this.state.permission && this.state.permission.indexOf('CONSTRUCTIONMANAGE_CONSTRUCTION-EDIT-I') !== -1 && record.reviewStatusVo.code == 'INIT',
            canModifyApproved:this.state.permission && this.state.permission.indexOf('CONSTRUCTIONMANAGE_CONSTRUCTION-EDIT-A') !== -1 && record.reviewStatusVo.code == 'APPROVED'
        });
    }
    //关闭详情页面
    handleCancel = () => {
        this.setState({
            modalVisible: false
        })
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
    changeRight=(record)=>{
        this.setState({
            record:record,
            modalVisible:true
        })
    }
    //设置table的选中行class样式
    setClassName = (record) => {
        return record.id === this.state.activeIndex ? 'tableActivty' : '';
    };
    submit = (values, type) => {
        const data = {
            ...values,
            id:this.state.record.id
        };
        if(type == 'save'){
            axios.post(addDailyRepresentation, data, true).then(res => {
                console.log(res)
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
        if(type == 'update'){
            axios.put(updateDailyRepresentation, data, true).then(res => {
                console.log(res)
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
                dataIndex: 'line',
                key: 'line',
                render:(text,record) => {
                    return <span>{text}号线</span>
                }
            },
            {
                title: '情况说明',
                dataIndex: 'description',
                key: 'description',
                width: 600,
                render:(text,record) => {
                    let textNew = text.replace(/(\r\n|\n|\r)/gm, " ").replace(/\s+/g,'<br />');
                    return <div style={{ wordWrap: 'break-word', wordBreak: 'break-word',whiteSpace: 'normal' }} dangerouslySetInnerHTML={{__html: textNew}}></div>;
                }
            },
            {
                title: '上报人',
                dataIndex: 'createrVo.name',
                key: 'createrVo.name',
            },
            // {
            //     title: '状态',
            //     dataIndex: 'reviewStatusVo.name',
            //     key: 'reviewStatusVo.name',
            // }
        ];
        return (
            <ExtLayout renderWidth={({ contentWidth }) => { this.setState({ contentWidth }) }}>
                <Toolbar>
                    <TopTags
                        record={this.state.record}
                        selectedRows={this.state.selectedRows}
                        selectedRowKeys={this.state.selectedRowKeys}
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
                </MainContent>
                {/* 新增 */}
                {this.state.modalVisible && <AddModal
                    isAdd={false}
                    record={this.state.record}
                    modalVisible={this.state.modalVisible}
                    submit={this.submit.bind(this)}
                    handleCancel={this.handleCancel.bind(this)} />}
                <RightTags
                        submit={this.submit.bind(this)}
                        canModifyApproved={this.state.canModifyApproved}
                        canModifyInit={this.state.canModifyInit}
                        fileRelease={true}
                        rightData={this.state.rightData}
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