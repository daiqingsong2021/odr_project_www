import React, { Component } from 'react'
import intl from 'react-intl-universal'
import { Table, notification } from 'antd'
import style from './style.less'
import { connect } from 'react-redux'
import { changeLocaleProvider } from '../../../../../../../store/localeProvider/action'
import RightTags from '../../../../../../../components/public/RightTags/index'
import * as util from '../../../../../../../utils/util';
import * as dataUtil from '../../../../../../../utils/dataUtil';
import {getFlowFaultDailyList,getPermission} from '../../../../../api/suzhou-api';
import axios from '../../../../../../../api/axios';
import MyIcon from "../../../../../../../components/public/TopTags/MyIcon";
import {permissionFun} from "@/modules/Suzhou/components/Util/util.js";
//二级详情页面
import AddModal from '../../AddModal/index'
class Delivery extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeIndex: [],
            rightData: [],
            data: [],
            initData: [],
            dataMap: [],
            projectData: [],
            taskData: [],
            permission:[]
        }
    }
    componentDidMount() {
        // permissionFun('MATERIEL-SORT').then(res=>{
        //     this.setState({
        //         permission:!res.permission?[]:res.permission
        //     })
        //   });
        //监听全局点击事件
        document.addEventListener('click', this.closeRight);
        // 初始化数据
        this.initDatas();
    }

    /**
     * 初始化数据
     *
     */
    initDatas = () => {
        this.getComuMeetListByBizs();
    }

    componentWillUnmount() {
        //销毁全局点击事件
        document.removeEventListener('click', this.closeRight, false);
    }

    // 获取选中的列表项
    getInfo = (record) => {
        this.setState({
            activeIndex: [record.id],
            rightData: [record],
        })
    }

    // 选中行高亮
    setClassName = (record) => {
        let activeId = this.state.activeIndex.length > 0 ? this.state.activeIndex[0] : -1;
        //判断索引相等时添加行的高亮样式
        return record.id === activeId ? "tableActivty" : "";
    }

    //获取发布列表
    getComuMeetListByBizs=()=>{
        const {formDatas} = this.props;
        let ids = dataUtil.Arr().toStringByObjectArr(formDatas,"bizId");
        if(ids && ids.length > 0){
            axios.get(getFlowFaultDailyList+`?ids=${ids}`).then(res=>{
                const { data } = res.data;
                const dataMap = util.dataMap(data);
                this.setState({
                  data: data || [],
                  initData: data || [],
                  dataMap
                })
            });
        }
         else{
          this.setState({
            data: [],
            initData: [],
            dataMap: {}
          })
        }
    }
    /**
     * 查询条件
     *
     * @param value
     */
    search = (value) => {
        const { initData ,tableData} = this.state;
        let newData = dataUtil.search(initData, [{ "key": "title", "value": value }], true);
        const dataMap = util.dataMap(newData);
        tableData[0].children=data
        this.setState({
            data: newData ,
            dataMap
        });
    }
    updateSuccess = data => {
        this.setState({
          rightData: {  ...data },
          data: this.state.data.map(item => (item.id === data.id ? { ...item, ...data } : item)),
        });
    };
      //打开详情页面
    openInfo = (record) => {   
        this.setState({
            infoId:record.id,
            addModalShow: true,
            addOrModify:'modify',
            rightDataFlow:record,
            modifyDisabled:true
        });
        
    }
    handleCancel=()=>{
        this.setState({
            addModalShow: false
        })
    }
    render() {
        const columns = [
            {
                title: '日期',
                dataIndex: 'recordDay',
                key: 'recordDay',
                render: (text, record) => {
                    return <span onClick={this.openInfo.bind(this, record)} style={{ color: 'rgb(45,182,244)', cursor: 'pointer' }}>{text}</span>
                }
            },
            {
                title: '线路',
                dataIndex: 'lineName',
                key: 'lineName',
            },
            {
                title: '新增问题',
                dataIndex: 'newProblem',
                key: 'newProblem',
            },
            {
                title: '遗留问题',
                dataIndex: 'legacyProblem',
                key: 'legacyProblem',
            },
            {
                title: '状态',
                dataIndex: 'statusDesc',
                key: 'statusDesc',
            }
        ];
        const {addModalShow} = this.state;
        return (
            <div className={style.main}>
                <div className={style.leftMain} style={{ height: this.props.height }}>
                    <div style={{ minWidth: 'calc(100vw - 60px)' }}>
                        <Table className={style.Infotable1}
                            columns={columns}
                            pagination={false}
                            dataSource={this.state.data}
                            rowClassName={this.setClassName}
                            rowKey={record => record.id}
                            defaultExpandAllRows={true}
                            size={"small"}
                            onRow={(record, index) => {
                                return {
                                    onClick: () => {
                                        this.getInfo(record, index)
                                    }
                                }
                            }} />
                    </div>
                </div>
                {/* 修改 */}
                {addModalShow && <AddModal
                        rightData={this.state.rightDataFlow}
                        handleCancel={this.handleCancel.bind(this)} 
                        addOrModify={this.state.addOrModify}
                        modifyDisabled={this.state.modifyDisabled}
                        updateSuccess={this.updateSuccess}
                    />}
            </div>
        )
    }
}


/* *********** connect链接state及方法 start ************* */
export default connect(state => ({
    currentLocale: state.localeProviderData
}), {changeLocaleProvider})(Delivery);

