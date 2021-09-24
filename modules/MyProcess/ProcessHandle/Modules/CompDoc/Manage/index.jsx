import React, { Component } from 'react'
import { Modal, Button, Row, Col, Input, Icon, Select, Form, Table } from 'antd'
import style from './style.less'
import Drop from './Dropdown/index'
import Allot from './Allot/index'
import * as util from '../../../../../../utils/util'
import MyIcon from '../../../../../../components/public/TopTags/MyIcon'

import { connect } from 'react-redux'
import axios from "../../../.././../../api/axios"
import { docCompFolderList, docFolderUpdate, docFolderAdd, docFolderDel } from '../../../.././../../api/api'





const { TextArea } = Input;

class Manage extends Component {

    state = {
        initDone: false,
        DroVisible: false,
        AllotVisible: false,
        X: 0,
        Y: 0,
        modalInfo: {
            title: '管理文件夹'
        },
        inputValue: 0,
        LeftData: [],
        dataMap: [],
        clickId: null,
        contextMenuRecord: null,
        activeIndex: null,
        record: null,
    }

    getData = () => {
        axios.get(docCompFolderList).then(res => {
            let data = res.data.data;
            let dataMap = util.dataMap(data)
            this.setState({
                LeftData: data,
                dataMap
            })
        })
    }

    componentDidMount() {
        this.getData();
    }


    handleSubmit = (e) => {
        e.preventDefault()
        this.props.form.validateFieldsAndScroll((err, fieldsValue) => {
            if (!err) {
                const values = {
                    ...fieldsValue,
                    'planStartTime': fieldsValue['planStartTime'].format('YYYY-MM-DD'),
                    'planEndTime': fieldsValue['planEndTime'].format('YYYY-MM-DD'),
                }
                // emitter.emit('noticeUpdateEvents', { status: 'add', data: values })
                this.props.curdCurrentData({
                    title: localStorage.getItem('name'),
                    status: 'add',
                    data: values
                })
                //this.props.curdCurrentData('add', 'status')
                //this.props.curdCurrentData(values, 'data')

                // 清空表单项
                this.props.form.resetFields()
                // 关闭弹窗
                this.props.handleCancel()
            }
        })
    }

    onChange = (value) => {
        this.setState({
            inputValue: value,
        });
    }



    setClassName = (record, index) => {
        //判断索引相等时添加行的高亮样式
        return record.id === this.state.activeIndex ? 'tableActivty' : "";
    }

    handleCancel() {
        this.props.handleCancel('UpgradeVisible')
    }

    DropHandleCancel = (v, data) => {
        if (v == 'temToImport') {
            this.setState({ DroVisible: false, AllotVisible: true });
        } else if (v == 'amend') {
            this.setState({ DroVisible: false, clickId: data.id });
        } else if (v == 'add') {
            this.setState({ DroVisible: false });
            this.addFolder(data);
        } else if (v == 'delete') {
            this.setState({ DroVisible: false });
            this.deleteFolder(data);
        } else {
            this.setState({ DroVisible: false });
        }
    }

    AllotHandleCancel = () => {
        this.setState({ AllotVisible: false })
    }

    //table右击事件
    contextMenuGetInfo = (record) => {
        let id = record.id, records = record;
        if (this.state.activeIndex == id) {
            this.setState({
                activeIndex: null,
                record: null
            })
        } else {

            this.setState({
                activeIndex: id,
                record: record
            })
        }
    }

    //表格 新建文件夹
    addFolder = (record) => {
        
        let data = {
            parentId: record ? record.id : 0,
            name: this.props.currentLocale.intl.get("wsd.global.btn.newfolder") //新建文件夹
        }

        axios.post(docFolderAdd, data, true).then(res => {
            ;
            let { LeftData, dataMap } = this.state;
            if (record) {

                util.create(LeftData, dataMap, record, res.data.data)
                this.setState({
                    LeftData,
                    dataMap,
                }, () => {
                    this.setState({
                        clickId: res.data.data.id
                    })
                })
            } else {
                LeftData.push(res.data.data);
                let dataMap = util.dataMap(LeftData);
                this.setState({
                    LeftData,
                    dataMap,
                }, () => {
                    this.setState({
                        clickId: res.data.data.id
                    })
                })
            }
            this.props.upDate(LeftData)

        })
    }

    //表格 删除文件夹
    deleteFolder = (record) => {
        axios.deleted(docFolderDel(record.id), {}, true).then(res => {
            
            let { LeftData, dataMap } = this.state;
            util.deleted(LeftData, dataMap, record);
            this.setState({
                LeftData
            })
            this.props.upDate(LeftData)
        })
    }


    //表格 修改名称 input输入框失去焦点事件
    inputBlur = (record, e) => {
        let data = {
            id: record.id,
            name: e.target.value
        }
        let oldRecord = { ...record };
        axios.put(docFolderUpdate, data, true).then(res => {
            record.name = res.data.data.name;
            let { LeftData, dataMap } = this.state;
            util.modify(LeftData, dataMap, oldRecord, record);
            this.setState({
                LeftData
            })
            this.props.upDate(LeftData)
        })

        this.setState({ clickId: null });
    }

    render() {
        const { intl } = this.props.currentLocale;
        const LeftColumns = [{
            title: intl.get("wsd.i18n.doc.compdoc.foldername"),//文件夹名称
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => {
                if (record.id == this.state.clickId) {
                    return (
                        <span>
                            <Input defaultValue={text} onBlur={this.inputBlur.bind(this, record)} style={{ width: '200px' }} autoFocus='autofocus' />
                        </span>
                    )
                } else {
                    return (<span><MyIcon type="icon-wenjianjia" className={style.leftTableIcon} />{text}</span>)
                }
            }
        }, {
            title: intl.get('wsd.i18n.doc.compdoc.sequence'),//排序号
            dataIndex: 'num',
            key: 'num'
        }];

        return (
            <div>
                <Modal
                    className={style.main}
                    width="850px"
                    title={this.state.modalInfo.title}
                    centered={true}
                    visible={this.props.modalVisible}
                    onCancel={this.handleCancel.bind(this)}
                    footer={
                        <div className='modalbtn'>
                            {/* 新建文件夹 */}
                            <Button type="primary" block className={style.btn} onClick={this.addFolder.bind(this, null)} >{intl.get("wsd.global.btn.newfolder")}</Button>
                            {/* 只做占位 不显示 */}
                            <Button type="primary" block className={style.btn1} ></Button>

                        </div>
                    }
                >

                    <div className={style.content}>
                        <div className={style.content} onClick={this.DropHandleCancel} >
                            <Row type="flex">
                                <Col span={24}>

                                    {this.state.LeftData.length && <Table rowKey={record => record.id} columns={LeftColumns} dataSource={this.state.LeftData} pagination={false}
                                        rowClassName={this.setClassName} defaultExpandAllRows={true}
                                        size='small'
                                        onRow={(record) => {
                                            return {
                                                onContextMenu: (event) => {
                                                    this.setState({ DroVisible: true, X: event.clientX, Y: event.clientY - 110, contextMenuRecord: record });
                                                    event.preventDefault();
                                                    this.contextMenuGetInfo(record);
                                                }
                                            }
                                        }}
                                    />}

                                </Col>
                            </Row>
                        </div>
                    </div>
                </Modal>
                {/* 右击事件 */}
                {this.state.DroVisible && <Drop handleCancel={this.DropHandleCancel.bind(this)} X={this.state.X} Y={this.state.Y}
                    record={this.state.contextMenuRecord} />}
                {/* 模板导入 */}
                <Allot modalVisible={this.state.AllotVisible} handleCancel={this.AllotHandleCancel.bind(this)} />
            </div>
        )
    }

}

export default connect(state => ({
    currentLocale: state.localeProviderData,
}))(Manage);



