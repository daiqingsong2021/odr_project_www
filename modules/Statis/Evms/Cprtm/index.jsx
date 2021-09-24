import React, { Component } from 'react'
import { Table, notification } from 'antd'
import style from './style.less'

import { connect } from 'react-redux'
import axios from '../../../../api/axios'
import {cprtmList, cprtmDel, cprtmAdd} from '../../../../api/api'
import MyIcon from "../../../../components/public/TopTags/MyIcon";
import * as dataUtil from "../../../../utils/dataUtil"

class TeamInfo extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            selectedRowKeys: [],
        }
    }
    //删除验证
    deleteVerifyCallBack=()=>{
        let { selectedRowKeys } = this.state;
        if(selectedRowKeys==0){
            notification.warning(
                {
                    placement: 'bottomRight',
                    bottom: 50,
                    duration: 2,
                    message: '未选中数据',
                    description: '请选择勾选数据进行操作'
                }
            )
            return false
        }else{
            return true
        }
    }
    delete = () => {
        let { selectedRowKeys } = this.state;
        axios.deleted(cprtmDel, { data: selectedRowKeys }, true).then(res => {

            //删除
            let copyData = [...this.state.data]
            selectedRowKeys.map((item) => {
                let ind = copyData.findIndex(val => val.id == item)
                if (ind != -1) {
                    copyData = [...copyData.slice(0, ind), ...copyData.slice(ind + 1)]
                }
            })
            this.setState({
                data: copyData,
                selectedRowKeys: []
            })
        });
    }
    //控制分配弹窗开关
    closeDistributeModal = () => {
        this.setState({
            distributeType: false
        })
    }

    getDataList = () => {

        let { bizId, bizType } = this.props
        axios.get(cprtmList(bizId, bizType)).then(res => {
            this.setState({
                data: res.data.data
            })
        })
    }

    componentDidMount() {
        this.getDataList();
    }

    setClassName = (record, index) => {
        //判断索引相等时添加行的高亮样式
        return record.id === this.state.activeIndex ? "tableActivty" : "";
    }
    getInfo = (record, index) => {
        this.setState({
            activeIndex: record.id
        })
    }

    handleOk = (data) =>{
        let addData = [];
        for (let i = 0; i < data.length; i++) {
            let dat = data[i];
            let obj = {
                bizId: this.props.bizId,
                bizType: this.props.bizType,
                cprtmId: dat.id,
                cprtmType: dat.type
            }
            addData.push(obj)
        }
        axios.post(cprtmAdd, addData, true).then(res => {
            this.getDataList();
            this.closeDistributeModal();
        })
    }

    render() {
        const { intl } = this.props.currentLocale;
        const columns = [
            {
                title: intl.get("wsd.i18n.operate.prepared.name"),//名称
                dataIndex: 'name',
                key: 'name',
                render: (text, record) => {
                    if (record.type == "org") {
                        return <span><MyIcon type="icon-gongsi" style={{ fontSize: 18, vectorEffect: "middle" }} />{text}</span>
                    } else if (record.type == "user") {
                        return <span><MyIcon type="icon-yuangong" style={{ fontSize: 18, vectorEffect: "middle" }} />{text}</span>
                    } else {
                        return <span><MyIcon type="icon-bumen1" style={{ fontSize: 18, vectorEffect: "middle" }} />{text}</span>
                    }
                }
            },
            {
                title: intl.get("wsd.i18n.sys.menu.menucode"),//代码
                dataIndex: 'code',
                key: 'code',
            }
        ];
       
        return (
            <div className={style.main}>
                <h3 className={style.listTitle}>协作团队</h3>
             
                <div className={style.mainScorll}>
                    <Table
                        rowKey={record => record.id}
                        className={style.table}
                        columns={columns}
                        dataSource={this.state.data}
                        pagination={false}
                        size='small'
                        name={this.props.name}
                        rowClassName={this.setClassName}
                      
                        onRow={(record, index) => {
                              return {
                                  onClick: () => {
                                      this.getInfo(record, index)
                                  }
                              }
                          }
                        }
                    />
                </div>
            </div>
        )
    }
}

export default connect(state => ({
    currentLocale: state.localeProviderData
}))(TeamInfo)
