import React, { Component } from 'react'
import { Table, notification } from 'antd'
import style from './style.less'
import { connect } from 'react-redux'
import AddTopBtn from "../../../../components/public/TopTags/AddTopBtn"
import ModifyTopBtn from "../../../../components/public/TopTags/ModifyTopBtn"
import PublicButton from "../../../../components/public/TopTags/PublicButton"
import StationAdd from './Add'
import axios from '../../../../api/axios'
import { getStationByProjectId, deleteStation } from '../../../../api/api'


class FileInfo extends Component {
    constructor(props) {
        super(props)
        this.state = {
            initDone: false,
            data: [],
            record: null,
            selectedRowKeys: [],
            total: null,
        }
    }

    getDataList = () => {
        axios.get(getStationByProjectId(this.props.projectId)).then(res => {
            
            this.setState({
                data: res.data.data
            })
        })
    }

    componentDidMount() {

        this.getDataList()

    }


    showAddStation = () => {
        this.setState({
            addstation: true
        })
    }
    closeAddStation = () => {
        this.setState({
            addstation: false
        })
    }

    showModifyStation = () => {
        if (this.state.selectedRowKeys.length == 0) {
            notification.warning(
                {
                    placement: 'bottomRight',
                    bottom: 50,
                    duration: 2,
                    message: '未选中数据',
                    description: '请勾选数据进行操作'
                }
            )
            return false;
        } else if (this.state.selectedRowKeys.length > 1) {
            notification.warning(
                {
                    placement: 'bottomRight',
                    bottom: 50,
                    duration: 2,
                    message: '选中多条数据',
                    description: '只能勾选一条数据进行操作'
                }
            )
            return false;
        } else {
            this.setState({
                modifystation: true
            })
        }

    }
    closeModifyStation = () => {
        this.setState({
            modifystation: false
        })
    }

    getInfo = (record, index) => {

        let id = record.id;
        this.setState({
            activeIndex: id,
            record
        })

    }

    setClassName = (record, index) => {
        //判断索引相等时添加行的高亮样式
        return record.id === this.state.activeIndex ? "tableActivty" : "";
    }


    //删除验证
    deleteVerifyCallBack = () => {
        const { selectedRowKeys } = this.state
        if (selectedRowKeys.length == 0) {
            notification.warning(
                {
                    placement: 'bottomRight',
                    bottom: 50,
                    duration: 2,
                    message: '未选中数据',
                    description: '请勾选数据进行操作'
                }
            )
            return false;
        } else {
            return true
        }
    }

    //新增
    addStation = (data) => {
        var copyData = [...this.state.data, data]
        this.setState({
            data: copyData
        })
    }

    //更新
    updateStation = (updateData) => {
        const { data } = this.state
        let i = data.findIndex(item => item.id == updateData.id)
        data[i] = updateData
        this.setState({
            data
        })
    }

    //删除
    showDelete = () => {
        // 选中行数据
        const { selectedRowKeys } = this.state

        // 执行删除操作
        axios.deleted(deleteStation, { data: selectedRowKeys }, true).then(res => {

            var copyData = [...this.state.data]
            selectedRowKeys.forEach(item => {
                let index = copyData.findIndex(i => i.id == item)
                copyData.splice(index, 1)
            })
            this.setState({
                selectedRowKeys: [],
                data: copyData,
                record: null
            })
        })
    }


    render() {
        console.log(this.state.selectedRowKeys)
        const { intl } = this.props.currentLocale
        const columns = [
            {
                title: intl.get("wsd.i18n.pre.station.code"),//编号
                dataIndex: 'code',
                key: 'code',
            },
            {
                title: intl.get("wsd.i18n.pre.station.name"),//区站名称
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: intl.get("wsd.i18n.pre.station.type"),//类型
                dataIndex: 'stationType',
                key: 'stationType',
                render: data => data && data.name
            },
            {
                title: intl.get("wsd.i18n.pre.station.remark"),//备注
                dataIndex: 'remark',
                key: 'remark',
            },

        ];
        const { selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
                this.setState({
                    selectedRowKeys
                })
            },
            onSelect: (record, selected, selectedRows) => {
                // console.log(record, selected, selectedRows);
            },
            onSelectAll: (selected, selectedRows, changeRows) => {
                // console.log(selected, selectedRows, changeRows);
            },
        };

        return (
            <div className={style.main}>
                <div className={style.mainHeight}>
                    <h3 className={style.listTitle}>站点信息</h3>
                    <div className={style.rightTopTogs}>
                        {/*新增*/}
                        <PublicButton name={'新增'} title={'新增'} icon={'icon-add'} afterCallBack={this.showAddStation} />
                        {/*修改*/}
                        <PublicButton name={'修改'} title={'修改'} icon={'icon-xiugaibianji'} afterCallBack={this.showModifyStation} />
                        {/*删除*/}
                        <PublicButton title={"删除"} useModel={true} verifyCallBack={this.deleteVerifyCallBack} afterCallBack={this.showDelete.bind(this)} icon={"icon-delete"} />

                        {this.state.addstation &&
                            <StationAdd opttype={"add"}
                                maskClosable={false}
                                mask={false}
                                addstation={this.state.addstation}
                                handleCancel={this.closeAddStation.bind(this)}
                                projectId={this.props.projectId} title="新增站点"
                                addStationMethod={this.addStation}
                            >
                            </StationAdd>}

                        {this.state.modifystation &&
                            <StationAdd opttype={"modify"}
                                maskClosable={false}
                                mask={false}
                                modifystation={this.state.modifystation}
                                handleCancel={this.closeModifyStation.bind(this)}
                                projectId={this.props.projectId}
                                record={this.state.record} title="修改站点"
                                updateStationMethod={this.updateStation}
                                selectedRowKeys={this.state.selectedRowKeys} ></StationAdd>}
                    </div>
                    <div className={style.mainScorll}>
                        <Table columns={columns} dataSource={this.state.data}
                            size='small' rowKey={record => record.id}
                            name={this.props.name}
                            rowSelection={rowSelection}
                            rowClassName={this.setClassName}
                            pagination={false}
                            onRow={(record, index) => {
                                return {
                                    onClick: () => {
                                        this.getInfo(record, index)
                                    }
                                }
                            }}
                        />
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(state => ({
    currentLocale: state.localeProviderData
}))(FileInfo)
