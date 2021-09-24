import React, { Component } from 'react'
import style from './style.less'
import { Button, Icon, Modal, Table,notification } from 'antd';
import intl from 'react-intl-universal'
import Search from "../../../../components/public/Search"
import '../../../../asserts/antd-custom.less'
import axios from "../../../../api/axios"
import {
   userAll,
} from '../../../../api/api';
import * as dataUtil from '../../../../utils/dataUtil';

class UploadModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            initDone: false,
            visible: true,
            data: [],
            initData: [],
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
        this.props.assignUser(this.state.activeIndex)
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
        this.getUserAssignList()
    }

    // 获取交付清单分配列表
    getUserAssignList = () => {
      axios.get(userAll).then(res => {
        this.setState({
          data: res.data.data,
          initData: res.data.data,
        })
      })
    }

    // 查询
    search = (text) => {
      const {initData} = this.state;
      let newData = dataUtil.search(initData,[{"key":"actuName","value":text}],true);
      this.setState({
        data:newData
      });
    }


  render() {
        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                this.setState({
                    activeIndex: selectedRowKeys,
                    selectData: selectedRows
                })
            },
            // getCheckboxProps: record => ({
            //     disabled: record.type === "pbs"
            // })
        };
        const columns = [
            {
                title: "用户名",
                dataIndex: 'userName',
                key: 'userName',
            },
            {
                title: "用户姓名",
                dataIndex: 'actuName',
                key: 'actuName',
            }
        ]
        return (
            <div className={style.main}>
                <Modal title="分配用户" visible={true} onCancel={this.props.handleCancel} width="800px"
                    footer={
                        <div className="modalbtn">
                            <Button key="2" type="primary" onClick={this.handleSubmit}>保存</Button>
                        </div>
                    }
                >
                    <div className={style.UploadModal}>
                        <div className={style.operate}>
                            <Search placeholder={"用户姓名"} search = {this.search }></Search>
                        </div>
                        <Table
                            rowKey={record => record.id}
                            className={style.table}
                            rowSelection={rowSelection}
                            columns={columns}
                            dataSource={this.state.data}
                            pagination={false}
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
