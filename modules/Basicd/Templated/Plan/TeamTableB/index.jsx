import React, { Component } from 'react'
import { Table, Checkbox, Spin, Modal, notification } from 'antd'
import style from './style.less'
import DistributionBtn from "../../../../../components/public/TopTags/DistributionBtn"
import DeleteTopBtn from "../../../../../components/public/TopTags/DeleteTopBtn"
import SelectOrgUser from "../../../../Components/Window/SelectOrgUser"
import { connect } from 'react-redux'
import axios from '../../../../../api/axios'
import { cprtmList, cprtmDel, cprtmAdd } from '../../../../../api/api'
import PublicButton from '../../../../../components/public/TopTags/PublicButton'

const confirm = Modal.confirm

class TeamInfo extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            selectedRowKeys: [],
        }
    }
    onClickHandle = (name) => {
        if (name == "DistributionBtn") {
            this.setState({
                distributeType: true
            })
        }
        if (name == "DeleteTopBtn") {
            let { selectedRowKeys } = this.state;
            if (selectedRowKeys.length) {


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
                })

            } else {
                //没有选择数据点击删除，提示
                notification.warning(
                    {
                        placement: 'bottomRight',
                        bottom: 50,
                        duration: 2,
                        message: '未选中数据',
                        description: '请选择数据进行操作'
                    }
                )
            }
        }
    }
    //控制分配弹窗开关
    closeDistributeModal = () => {
        this.setState({
            distributeType: false
        })
    }

    getDataList = () => {

        let { data, bizType } = this.props
        axios.get(cprtmList(data.id, bizType)).then(res => {
            this.setState({
                data: res.data.data
            })
        })
    }
    //确认操作
    handleOk = (rightData) => {


        let data = []

        for (let i = 0; i < rightData.length; i++) {
            let obj = {
                bizId: this.props.data.id,
                bizType: this.props.bizType,
                cprtmId: rightData[i].id,
                cprtmType: rightData[i].type
            }
            data.push(obj)
        }

        axios.post(cprtmAdd, data, true).then(res => {
            //成功刷新
            this.getDataList();
            this.closeDistributeModal();
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
    render() {
        const { intl } = this.props.currentLocale;
        const columns = [
            {
                title: intl.get("wsd.i18n.operate.prepared.name"),//名称
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: intl.get("wsd.i18n.sys.menu.menucode"),//代码
                dataIndex: 'code',
                key: 'code',
            }


        ];
        let { selectedRowKeys } = this.state
        const rowSelection = {
            selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
                this.setState({
                    selectedRowKeys,
                })
            }
        };

        return (
            <div className={style.main}>
                <div className={style.TeamTableB}>
                    <div className={style.listIcon}>
                        <DistributionBtn onClickHandle={this.onClickHandle}></DistributionBtn>
                        {/* <DeleteTopBtn onClickHandle={this.onClickHandle}></DeleteTopBtn> */}

                        <PublicButton name={'删除'} title={'删除'} icon={'icon-delete'}
                            useModel={true} edit={true}
                            verifyCallBack={this.hasRecord}
                            afterCallBack={this.onClickHandle.bind(this, 'DeleteTopBtn')}
                            content={'你确定要删除吗？'}
                            res={'MENU_EDIT'}
                            />

                        {this.state.distributeType && (
                            <SelectOrgUser visible={this.state.distributeType} handleCancel={this.closeDistributeModal.bind(this)}
                                bizType={this.props.bizType} data={this.props.data} handleOk={this.handleOk} />
                        )}
                    </div>
                    <Table
                        rowKey={record => record.id}
                        className={style.table}
                        columns={columns}
                        dataSource={this.state.data}
                        pagination={false}
                        size='small'
                        name={this.props.name}
                        rowClassName={this.setClassName}
                        rowSelection={rowSelection}
                        onRow={(record, index) => {
                            return {
                                onClick: (event) => {
                                    this.getInfo(record, index)
                                },

                            }
                        }
                        }
                    />

                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        currentLocale: state.localeProviderData,
    }
};


export default connect(mapStateToProps, null)(TeamInfo);