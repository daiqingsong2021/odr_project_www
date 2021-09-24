import React, { Component } from 'react'
import style from './style.less'
import { Icon, Table, message, Modal } from 'antd'
import intl from 'react-intl-universal'
import SysFlowAdd from './../AddModel'
import AddTopBtn from '../../../../components/public/TopTags/AddTopBtn' //新增按钮
import ModifyTopBtn from '../../../../components/public/TopTags/ModifyTopBtn' //修改按钮
import DeleteTopBtn from '../../../../components/public/TopTags/DeleteTopBtn' //删除按钮
import { connect } from 'react-redux'
import { curdCurrentData } from '../../../../store/curdData/action'
const locales = {
    "en-US": require('../../../../api/language/en-US.json'),
    "zh-CN": require('../../../../api/language/zh-CN.json')
}
const confirm = Modal.confirm


 class FlowInfo extends Component {
    constructor(props) {
        super(props)
        this.state = {
            initDone: false,
            addShow: false,  // 控制新增弹窗
            data: [{
                key: 1,
                id: 1,
                wftitle: '质量信息报送流程',
                projectname: 'sjkjkskjsjksj',
                iptname: '市场部',
                category: '1111',
                planlevel: '',
            }]
        }
    }

    componentDidMount() {
        this.loadLocales();
    }

    loadLocales() {
        intl.init({
            currentLocale: 'zh-CN',
            locales,
        })
            .then(() => {
                // After loading CLDR locale data, start to render
                this.setState({ initDone: true });
            });
    }

    onClickHandle = (name) => {
        if (name == "AddTopBtn") {
            this.setState({
                isshow: true,
                modalTitle: "新增流程业务"
            })
            return;
        }
        if (this.state.activeIndex) {
            if (name == "ModifyTopBtn") {
                this.setState({
                    isshow: true,
                    modalTitle: "修改流程业务"
                })
            }
            if (name == "DeleteTopBtn") {
                confirm({
                    title: '您确定要删除？',
                    cancelText: '取消',
                    okText: '确定',
                    onOk() {

                    }
                });
            }
        } else {
            message.warning("请选择数据")
        }

    }
    onCancel = () => {
        this.setState({
            isshow: false
        })
    }
    getInfo = (record, index) => {

        this.setState({
            activeIndex: record.id
        })
    }

    setClassName = (record, index) => {
        //判断索引相等时添加行的高亮样式
        return record.id === this.state.activeIndex ? `${style['clickRowStyl']}` : "";
    }
    render() {
        const columns = [
            {
                title: intl.get('wsd.i18n.plan.activitydefineinfo.wftitle'),
                dataIndex: 'wftitle',
                key: 'wftitle',
            },
            {
                title: intl.get('wsd.i18n.plan.activitydefineinfo.projectname'),
                dataIndex: 'projectname',
                key: 'projectname',
            },
            {
                title: intl.get('wsd.i18n.plan.activitydefineinfo.iptname'),
                dataIndex: 'iptname',
                key: 'iptname',
            },
            {
                title: intl.get('wsd.i18n.plan.activitydefineinfo.category'),
                dataIndex: 'category',
                key: 'category',
            },
            {
                title: intl.get('wsd.i18n.plan.activitydefineinfo.planlevel'),
                dataIndex: 'planlevel',
                key: 'planlevel',
            }
        ];

        // const rowSelection = {
        //     onChange: (selectedRowKeys, selectedRows) => {
        //     },
        //     onSelect: (record, selected, selectedRows) => {
        //     },
        //     onSelectAll: (selected, selectedRows, changeRows) => {
        //     },
        // };


        return (
            <div className={style.main}>

                {this.state.initDone &&
                    <div className={style.mainHeight}>
                        <h3 className={style.listTitle}>基本信息</h3>
                        <div className={style.rightTopTogs}>
                            <AddTopBtn onClickHandle={this.onClickHandle.bind(this)} />
                            <ModifyTopBtn onClickHandle={this.onClickHandle.bind(this)} />
                            <DeleteTopBtn onClickHandle={this.onClickHandle.bind(this)} />
                        </div>
                        <div className={style.mainScorll} >
                            <Table
                                columns={columns}
                                dataSource={this.state.data}
                                // rowSelection={rowSelection}
                                pagination={false}
                                rowKey={record => record.id}
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

                    </div>}
                <SysFlowAdd title={this.state.modalTitle} addShow={this.state.isshow} onCancel={this.onCancel} />
            </div>
        )
    }
}


export default connect(state => ({
    currentLocale: state.localeProviderData
}), {
        curdCurrentData
    })(FlowInfo);