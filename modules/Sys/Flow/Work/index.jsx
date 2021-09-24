import React, { Component } from 'react'
import style from './style.less'
import { Icon, Table, message, Modal } from 'antd'
import intl from 'react-intl-universal'
import AddWork from './../AddWork'
import DistributionBtn from '../../../../components/public/TopTags/DistributionBtn' //分配按钮
import DeleteTopBtn from '../../../../components/public/TopTags/DeleteTopBtn' //删除按钮
const locales = {
    "en-US": require('../../../../api/language/en-US.json'),
    "zh-CN": require('../../../../api/language/zh-CN.json')
}
const confirm = Modal.confirm


export class FlowWork extends Component {
    constructor(props) {
        super(props)
        this.state = {
            initDone: false,
            addWork: false,  // 控制新增弹窗
            data: [{
                id: 1,
                title: '是否超过支付限制',
                xpath: '/overvalue',
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
        if (this.state.activeIndex) {
            if (name == "DistributionBtn") {
                this.setState({
                    addWork: true
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
            addWork: false
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
                title:"名称",
                dataIndex: 'title',
                key: 'title',
            },
            {
                title: intl.get('wsd.i18n.sys.wfbizvar.xpath'),
                dataIndex: 'xpath',
                key: 'xpath',
            }
        ];

        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
            },
            onSelect: (record, selected, selectedRows) => {
            },
            onSelectAll: (selected, selectedRows, changeRows) => {
            },
        };
        return (
            <div className={style.main}>

                {this.state.initDone &&
                      <div className={style.mainHeight}>
                        <h3 className={style.listTitle}>业务变量</h3>
                        <div className={style.rightTopTogs} >
                            <DistributionBtn onClickHandle={this.onClickHandle.bind(this)} />
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
                <AddWork addWork={this.state.addWork} onCancel={this.onCancel} />
            </div>
        )
    }
}

export default FlowWork