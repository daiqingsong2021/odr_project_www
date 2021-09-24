import React, { Component } from 'react'
import { Table, Spin, Icon } from 'antd'
import style from './style.less'
import { connect } from 'react-redux'
import RightTags from "../../../../../components/public/RightTags"
import axios from '../../../../../api/axios'
import { prepaList, prepaSeek } from '../../../../../api/api'


class Approval extends Component {
    constructor(props) {
        super(props)
        this.state = {
           
            activeIndex: "",
            currentPage: 1,
            pageSize: 10,
            currentPageNum: '',
            total: '',
            rightData: null,
            delectData: [],
            rightTags: [

                { icon: 'iconjibenxinxi', title: '基本信息', fielUrl: 'Plot/Approval/InfoForm' },
                { icon: 'iconlianxiren1', title: '联系人信息', fielUrl: 'Plot/Approval/LinkManInfo' },
                { icon: 'icontuandui', title: '协作团队', fielUrl: 'Plot/Approval/TeamInfo' },
                { icon: 'iconwenjian', title: '文件信息', fielUrl: 'Components/FileInfo' },
                { icon: 'iconliuchengxinxi', title: '流程信息', fielUrl: 'MyProcess/ProcessInfo' },
            ],
            data: []
        }
    }
    getDataList = () => {
        axios.get(prepaList(this.state.pageSize, this.state.currentPage)).then(res => {
        
            this.setState({
                data: res.data.data,
                total: res.data.total,
                currentPageNum: this.state.pageSize
            })
        })
    }

    componentDidMount() {
        this.getDataList();//列表请求函数

    }
    getInfo = (record, index) => {
        //table点击事件调用函数
        let id = record.id, records = record
        const { activeIndex } = this.state
        if (activeIndex === record.id) {
            this.setState({
                activeIndex: null,
                rightData: null
            })
        } else {
            this.setState({
                activeIndex: id,
                rightData: record
            })
        }

    }


    setClassName = (record, index) => {
        //判断索引相等时添加行的高亮样式
        return record.id === this.state.activeIndex ? "tableActivty" : "";
    }

    //新增函数
    addData = (val) => {
      
        this.setState({
            data: [val, ...this.state.data],
            total: this.state.total + 1
            // currentPage: v
        })
    }
    //删除数据函数
    delectData = (v) => {

        this.getDataList()

    }
    //修改函数
    upData = (data) => {
        let index = this.state.data.findIndex(val => val.id == data.id)
        if (index > -1) {
            this.setState({
                data: [...this.state.data.slice(0, index), data, ...this.state.data.slice(index + 1)]
            })
        }
    }

    //搜索
    search = (val) => {
        axios.get(prepaSeek(10, 1, val)).then(res => {
            // 
            this.setState({
                data: res.data.tableData.rows
            })
        })
    }



    render() {
        const { intl } = this.props.currentLocale;
        const columns = [
            {
                title: intl.get('wsd.i18n.pre.proreview.name'),
                dataIndex: 'paName',
                key: 'paName',
                render: text => <span> <Icon type="folder" /> {text}</span>
            },
            {
                title: intl.get('wsd.i18n.pre.proreview.code'),
                dataIndex: 'paCode',
                key: 'paCode',
            },
            {
                title: intl.get('wsd.i18n.pre.proreview.epsname'),
                dataIndex: 'eps',
                key: 'eps',
                render: (text) => <span>{text.name}</span>
            },
            {
                title: intl.get('wsd.i18n.pre.proreview.iptname'),
                dataIndex: 'org',
                key: 'org',
                render: (text) => <span>{text.name}</span>
            },
            {
                title: intl.get('wsd.i18n.pre.proreview.username'),
                dataIndex: 'user',
                key: 'user',
                render: (text) => <span>{text.name}</span>
            },
            {
                title: intl.get('wsd.i18n.pre.proreview.starttime'),
                dataIndex: 'planStartTime',
                key: 'planStartTime',
            },
            {
                title: intl.get('wsd.i18n.pre.proreview.endtime'),
                dataIndex: 'planEndTime',
                key: 'planEndTime',
            },
            {
                title: intl.get('wsd.i18n.pre.proreview.creattime'),
                dataIndex: 'creatTime',
                key: 'creatTime',
            },
            {
                title: intl.get('wsd.i18n.pre.proreview.creator'),
                dataIndex: 'creator',
                key: 'creator',
                render: (text) => {
                    return text ? <span>{text.name}</span> : ''
                }
            },
            {
                title: intl.get('wsd.i18n.pre.proreview.status'),
                dataIndex: 'status',
                key: 'status',
                render: (text) => <span>{text.name}</span>
            },
        ];
        //分页调用
        let pagination = {
            total: this.state.total,
            // hideOnSinglePage: true,
            current: this.state.currentPage,
            pageSize: this.state.pageSize,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: total => `每页${this.state.pageSize}条/共${Math.ceil(this.state.total / this.state.pageSize)}页`,
            onShowSizeChange: (current, size) => {
                this.setState({
                    pageSize: size,
                    currentPage: 1
                }, () => {
                    this.getDataList()
                })
            },
            onChange: (page, pageSize) => {
                this.setState({
                    currentPage: page
                }, () => {
                    this.getDataList()
                })
            }
        }
        return (
            <div>
               
                <div className={style.main}>
                    <div className={style.leftMain} style={{ height: this.props.height }}>
                    
                        <div style={{ minWidth: 'calc(100vw - 60px)' }}>
                            {this.state.data &&

                                <Table columns={columns} dataSource={this.state.data}
                                    pagination={pagination}
                                    size='small'
                                    // rowSelection={this.rowSelection}
                                    rowKey={record => record.id}
                                    rowClassName={this.setClassName}
                                    onRow={(record, index) => {
                                        return {
                                            onClick: (event) => {
                                                this.getInfo(record, index)
                                            }
                                        }
                                    }}
                                />
                            }
                        </div>

                        {/* </div> */}
                    </div>
                    <div className={style.rightBox} style={{ height: this.props.height }}>
                        <RightTags rightTagList={this.state.rightTags} rightData={this.state.rightData} upData={this.upData} callBackBanner={this.props.callBackBanner} menuInfo={this.props.menuInfo}/>
                    </div>
                </div>

            </div>
        )
    }
}



/* *********** connect链接state及方法 end ************* */
const mapStateToProps = state => {
    return {
        currentLocale: state.localeProviderData
    }
};


export default connect(mapStateToProps, null)(Approval)