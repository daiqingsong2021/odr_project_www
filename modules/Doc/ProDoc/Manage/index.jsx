import React, { Component } from 'react'
import { Modal, Button, Row, Col, Input, Icon, Select, Form, Table, notification } from 'antd'
import style from './style.less'
import Drop from './Dropdown/index'
import * as util from '../../../../utils/util'
import MyIcon from '../../../../components/public/TopTags/MyIcon'
import TipModal from "../../../../modules/Components/TipModal"
import { connect } from 'react-redux'
import axios from '../../../../api/axios';
import { docProjectFolderUpdate, docProjectFolderAdd, docProjectFolderDel } from '../../../../api/api'
import * as dataUtil from "../../../../utils/dataUtil"




const { TextArea } = Input;

class Manage extends Component {

    state = {
        initDone: false,
        DroVisible: false,
      
        X: 0,
        Y: 0,
        modalInfo: {
            title: '管理文件夹'
        },
        inputValue: 0,
        tableData: [],
        dataMap: [],
        clickId: null,
        activeIndex: null,
        record: null,
    }

    getData = () => {
        if (!this.props.projectId) {
          dataUtil.message('请选择项目进行操作');
          return;
        }
        let data = dataUtil.clone(this.props.findLeftDataList()) ;
        let dataMap = util.dataMap(data)
        data.type = "project"
        this.setState({
            dataMap,
            tableData: data
        })
    }

    componentDidMount() {
        this.getData();
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

        if(v == 'amend') {
            this.setState({ DroVisible: false, clickId: data.id });
        } else if (v == 'add') {
            this.setState({ DroVisible: false });
            this.addFolder(data);
        } else if (v == 'delete') {
            this.setState({
                DroVisible: false,
                deleteTip: true
            });
            return
        } else {
            this.setState({ DroVisible: false });
        }
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
    addFolder = () => {

        const { record } = this.state
        let data = {
            parentId: !record || record.type === "project" ? 0 : record.id ,
            projectId: this.props.projectId,
            name: this.props.currentLocale.intl.get("wsd.global.btn.newfolder"), //新建文件夹
        }
        let url = dataUtil.spliceUrlParams(docProjectFolderAdd, { "startContent": "项目【" + this.props.projectName + "】" });
        axios.post(url, data, true, "新建文件夹", true).then(res => {

            let { dataMap, tableData } = this.state;
            if (record) {

                util.create(tableData, dataMap, record, res.data.data)
                this.setState({
                    dataMap,
                    tableData
                }, () => {
                    this.setState({
                        clickId: res.data.data.id
                    })
                })
            } else {
                tableData[0].children=tableData[0].children? tableData[0].children:[];
                tableData[0].children.push(res.data.data);
                let dataMap = util.dataMap(tableData);
                this.setState({
                    dataMap,
                    tableData
                }, () => {
                    this.setState({
                        clickId: res.data.data.id
                    })
                })
            }
        })
    }

    //表格 删除文件夹
    deleteFolder = (record) => {
        let url = dataUtil.spliceUrlParams(docProjectFolderDel(record.id), { "startContent": "项目【" + this.props.projectName + "】" });
        axios.deleted(url, {}, true, null, true).then(res => {

            let { dataMap, tableData } = this.state;
            util.deleted(tableData, dataMap, record);
            let dataMap1 = util.dataMap(tableData)
            this.setState({
                dataMap: dataMap1,
                tableData,
                record:null
            })
        })
    }


    //表格 修改名称 input输入框失去焦点事件
    inputBlur = (record, e) => {
        let data = {
            id: record.id,
            name: e.target.value
        }
        let oldRecord = { ...record };
        let url = dataUtil.spliceUrlParams(docProjectFolderUpdate, { "startContent": "项目【" + this.props.projectName + "】" });
        axios.put(url, data, true, null, true).then(res => {
            record.name = res.data.data.name;
            let { dataMap, tableData } = this.state;
            util.modify(tableData, dataMap, oldRecord, record);
            this.setState({
                tableData
            })
        })

        this.setState({ clickId: null });
    }
    handleOk = () => {
        const { record } = this.state
        this.deleteFolder(record)
        this.setState({
            deleteTip: false
        })
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

                        <Input defaultValue={text} onBlur={this.inputBlur.bind(this, record)} style={{ width: '80%' }} autoFocus='autofocus' maxLength={60} />

                    )
                } else {
                    return (<span><MyIcon type="icon-wenjianjia" className={style.leftTableIcon} />{text}</span>)
                }
            }
        }
        ];

        return (
            <div>
                <Modal
                    className={style.main}
                    width="700px"

                    title={this.state.modalInfo.title}
                    centered={true}
                    visible={this.props.modalVisible}
                    onCancel={this.handleCancel.bind(this)}
                    mask={false} maskClosable={false}
                    footer={
                        <div className='modalbtn'>
                            {/* 新建文件夹 */}
                            <Button type="primary" block className={style.btn} onClick={this.addFolder.bind(this, null)} >{intl.get("wsd.global.btn.newfolder")}</Button>
                            {/* 只做占位 不显示 */}
                            <Button type="primary" block className={style.btn1} ></Button>

                        </div>
                    }
                >

                    <div className={style.content} onClick={this.DropHandleCancel} style={{ minHeight: '300px' }}>
                        <Row type="flex">
                            <Col span={24}>

                                <Table rowKey={record => record.id} columns={LeftColumns} dataSource={this.state.tableData} pagination={false}
                                    rowClassName={this.setClassName} defaultExpandAllRows={true} size="small"
                                    onRow={(record) => {
                                        return {
                                            onContextMenu: (event) => {
                                                this.setState({
                                                    DroVisible: true,
                                                    X: event.clientX,
                                                    Y: event.clientY - 110,
                                                    activeIndex: record.id,
                                                    record: record,
                                                });
                                                event.preventDefault();

                                            },
                                            onClick: (event) => {
                                                this.contextMenuGetInfo(record);
                                            }
                                        }
                                    }}
                                />

                            </Col>
                        </Row>
                    </div>
                </Modal>
                {/* 删除提示 */}
                {this.state.deleteTip &&
                    <TipModal onOk={this.handleOk} onCancel={() => this.setState({ deleteTip: !this.state.deleteTip })} />}
                {/* 右击事件 */}
                {this.state.DroVisible && <Drop visible={this.state.DroVisible} handleCancel={this.DropHandleCancel.bind(this)} X={this.state.X} Y={this.state.Y}
                    record={this.state.record} edit={this.state.record.type == "project"} />}
              
            </div>
        )
    }

}

export default connect(state => ({
    currentLocale: state.localeProviderData,
}))(Manage);



