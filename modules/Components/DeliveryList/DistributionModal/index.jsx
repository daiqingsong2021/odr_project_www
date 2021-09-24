import React, { Component } from 'react'
import style from './style.less'
import { Button, Icon, Modal, Table,notification } from 'antd';
import intl from 'react-intl-universal'
import Search from "../../../../components/public/Search"
import '../../../../asserts/antd-custom.less'

import axios from "../../../../api/axios"
import {
    getPlanDelvAssignList
} from "../../../../api/api"
import MyIcon from "../../../../components/public/TopTags/MyIcon";

class UploadModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            initDone: false,
            visible: true,
            data: [],
            activeIndex: [],
            selectData: []
        }
    }

    showModal = () => {
        this.setState({
            visible: true,
        });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const {activeIndex} = this.state;
        if(!activeIndex ||activeIndex.length == 0){

          notification.warning(
            {
              placement: 'bottomRight',
              bottom: 50,
              duration: 2,
              message: '未选中数据',
              description: '请勾选数据进行操作'
            }
          )
          return;
        }

        this.props.planDelvTaskAssign(this.state.activeIndex)
        this.props.handleCancel()
    }

    getInfo = (record, index) => {
        let currentIndex = this.state.activeIndex.findIndex(item => item == record.id)
        if (currentIndex > -1) {
            this.setState((preState, props) => {
                preState.activeIndex.splice(currentIndex, 1)
                preState.selectData.splice(currentIndex, 1)
                return {
                    activeIndex: preState.activeIndex,
                    selectData: null
                }
            })
        } else {
            this.setState({
                activeIndex: [record.id],
                selectData: [record]
            })
        }
    }

    setClassName = (record, index) => {
        //判断索引相等时添加行的高亮样式
        return record.id === this.state.activeIndex[0] ? `${style['clickRowStyl']}` : "";
    }

    handleCancel = (e) => {
        this.setState({
            visible: false,
        });
        this.props.handleCancel()
    }

    componentDidMount() {
        this.getPlanDelvAssignList()
    }

    // 获取交付清单分配列表
    getPlanDelvAssignList = () => {
        let { rightData } = this.props
        Array.isArray(rightData) ? null : rightData = [rightData]
        axios.get(getPlanDelvAssignList(rightData[0]['projectId'],rightData[0]['id'])).then(res => {
            const { data } = res.data
            this.setState({
                data
            })
        })
    }

    render() {
        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                this.setState({
                    activeIndex: selectedRowKeys,
                    selectData: selectedRows
                })
            },
            getCheckboxProps: record => ({
                disabled: record.type === "pbs"
            })
        };
        const columns = [
            {
                title: intl.get("wsd.i18n.plan.delvList.delvname"),
                dataIndex: 'delvTitle',
                key: 'delvTitle',
                render: (text, record) => {
                  return (
                    record.type == "pbs" ? (
                      <span> <MyIcon type='icon-PBS' /> {text} </span>
                    ) : (
                      <span> <MyIcon type='icon-jiaofuwu1' /> {text} </span>
                    )
                  )
                }
            },
            {
                title: intl.get("wsd.i18n.plan.delvList.delvcode"),
                dataIndex: 'delvCode',
                key: 'delvCode',
            },
            {
                title: intl.get("wsd.i18n.plan.delvList.delvtype"),
                dataIndex: 'type',
                key: 'type',
                render: text => text == 'pbs' ? "PBS" : text == 'delv' ? "交付物":null
            },
            {
                title: intl.get("wsd.i18n.plan.delvList.creattime"),
                dataIndex: 'creatTime',
                key: 'creatTime',
            }
        ]
        return (
            <div className={style.main}>
                <Modal title="分配交付清单" visible={true} onCancel={this.props.handleCancel} width="800px"
                    footer={
                        <div className="modalbtn">
                            {/* <Button key="1" onClick={this.handleSubmit}>保存并继续</Button> */}
                            <Button key="2" type="primary" onClick={this.handleSubmit}>保存</Button>
                        </div>
                    }
                >
                    <div className={style.UploadModal}>
                        <div className={style.operate}>
                            <Search></Search>
                        </div>
                        <Table
                            rowKey={record => record.id}
                            className={style.table}
                            rowSelection={rowSelection}
                            columns={columns}
                            dataSource={this.state.data}
                            pagination={false}
                            name={this.props.name}
                            size="small"
                            rowClassName={this.setClassName}
                            onRow={(record, index) => {
                                return {
                                    onClick: (event) => {
                                        this.getInfo(record, index)
                                    }
                                }
                            }
                            }
                        />
                    </div>
                </Modal>
            </div>
        )
    }
}

export default UploadModal
