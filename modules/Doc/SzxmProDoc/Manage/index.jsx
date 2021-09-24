import React, { Component } from 'react'
import { Modal, Button, Row, Col, Input, Icon, Select, Form, Table, notification, TreeSelect } from 'antd'
import style from './style.less'
import Drop from './Dropdown/index'
import Allot from './Allot/index'
import * as util from '../../../../utils/util'
import MyIcon from '../../../../components/public/TopTags/MyIcon'
import TipModal  from "../../../Components/TipModal"
import { connect } from 'react-redux'
import axios from '../../../../api/axios';
import { menuMenuTree, docProjectFolderAdd_,getDocProjectFolderById_,docProjectFolderUpdate_,docFolderDetete_} from '../../../../api/suzhou-api'
import * as dataUtil from "../../../../utils/dataUtil"




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
        tableData: [],
        dataMap: [],
        menuTree: [],
        clickId: null,
        activeIndex: null,
        record: null,
        editKey: null,
        defaultFile: {
            id: "editkey",
            name: "新建文件夹"
        },//默认新增
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
        if (v == 'temToImport') {
            this.setState({ DroVisible: false, AllotVisible: true });
        } else if (v == 'amend') {

            this.setState({
                DroVisible: false,
                oprratetType: "modify",
                modalType:"modify"
            }, () => {
                const { record } = this.state
                this.setState({
                    editKey: record.id,
                    folderName: record.name,
                    menuId: !record.menu ? '' : record.menu.value,
                })
            });
        } else if (v == 'add') {

            const { defaultFile } = this.state
            this.setState({
                DroVisible: false,
                modalType:"add"
            }, () => {
                this.addFolder(data);
            });

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

    //选中行事件
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
            },) 
        }
    }
    addFolder = () => {
        if (this.state.editKey) {
            return
        }
        const { record } = this.state
        let { dataMap, tableData, defaultFile } = this.state;
        if (record) {
            util.create(tableData, dataMap, record, defaultFile)
            this.setState({
                dataMap,
                oprratetType: "add",
                editKey: defaultFile.id,
                folderName: defaultFile.name,
                tableData,
                modalType:"add"
            })
        } else {
            tableData[0].children=tableData[0].children? tableData[0].children:[];
            tableData[0].children.push(defaultFile);
            let dataMap = util.dataMap(tableData);
            this.setState({
                dataMap,
                oprratetType: "add",
                editKey: defaultFile.id,
                folderName: defaultFile.name,
                tableData,
                modalType:"add"
            })
        }
    }
    
    addFile = () => {
       
        const { record, folderName, menuId, defaultFile } = this.state
        if (!folderName) {
            notification.warning(
                {
                    placement: 'bottomRight',
                    bottom: 50,
                    duration: 2,
                    message: '提示',
                    description: '请输入文件名'
                }
            )
            return
        }
        if (!menuId) {
            notification.warning(
                {
                    placement: 'bottomRight',
                    bottom: 50,
                    duration: 2,
                    message: '提示',
                    description: '请选择业务模块'
                }
            )
            return
        }
        let data = {
            parentId: record ? record.type == 'folder' ? record.id : 0 : 0,
            projectId: this.props.projectId,
            name: folderName,
            menuId
        }
        let url = dataUtil.spliceUrlParams(docProjectFolderAdd_, { "startContent": "项目【" + this.props.projectName + "】" });
        axios.post(url, data, true, null, true).then(res => {

            let { dataMap, tableData } = this.state;
            util.modify(tableData, dataMap, defaultFile, res.data.data);
            this.setState({
                tableData,
            })
            this.props.upDate(tableData)

        })
        this.setState({ editKey: null ,menuId : null});
    }

    //表格 删除文件夹
    deleteFolder = () => {
        const {record} = this.state
        let url = dataUtil.spliceUrlParams(docFolderDetete_(record.id), { "startContent": "项目【" + this.props.projectName + "】" });
        axios.deleted(url, {}, true, null, true).then(res => {
            let { dataMap, tableData } = this.state;
            util.deleted(tableData, dataMap, record);
            let dataMap1 = util.dataMap(tableData)
            this.setState({
                dataMap: dataMap1,
                tableData,
                record:null
            })
            this.props.deleteFile(tableData)

        })
          this.closeDeleteTipModal()
    }

    openDeleteModal = () =>{
        this.setState({
            deleteTip: true,
            DroVisible:false
        })
    }

    //关闭删除提示框
    closeDeleteTipModal = () => {
        this.setState({
            deleteTip: false
        })
    }

    //表格 修改名称 input输入框失去焦点事件
    upFile = (record, e) => {
        const { folderName, menuId } = this.state
        let data = {
            id: record.id,
            name: folderName,
            menuId:menuId
        }
        let url = dataUtil.spliceUrlParams(docProjectFolderUpdate_, { "startContent": "项目【" + this.props.projectName + "】" });
        axios.put(url, data, true, null, true).then(res => {
            let { dataMap, tableData } = this.state;
            util.modify(tableData, dataMap, record, res.data.data);
            this.setState({
                tableData,
            })
            this.props.upDate(tableData)
        })

        this.setState({ editKey: null });
    }

    menuSelect = () => {
        const {record,modalType} = this.state
        if(record){
           if("add" == modalType){
            axios.get(getDocProjectFolderById_(record.id)).then(res =>{
                let menuId = res.data.data ?  res.data.data.menu ? res.data.data.menu.value : 0 : 0
                axios.get(menuMenuTree(menuId)).then(res => {
                 this.setState({
                     menuTree: res.data.data
                 })
             })
            })
           }else if("modify" == modalType){
            axios.get(getDocProjectFolderById_(record.parentId)).then(res =>{
                let menuId = res.data.data ?  res.data.data.menu ? res.data.data.menu.value : 0 : 0
                axios.get(menuMenuTree(menuId)).then(res => {
                 this.setState({
                     menuTree: res.data.data
                 })
             })
            })
           }
        }else{
            axios.get(menuMenuTree(0)).then(res => {
                this.setState({
                    menuTree: res.data.data
                })
            })
        }
    }

    menuChange = (e) => {
        this.setState({ menuId: e })
    }

    folderNameChange = (e, k) => {
        this.setState({ folderName: e.currentTarget.value })
    }

    render() {
        const { intl } = this.props.currentLocale;
        const LeftColumns = [{
            title: intl.get("wsd.i18n.doc.compdoc.foldername"),//文件夹名称
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => {
                if (record.id == this.state.editKey) {
                    return (
                        <span>
                            <Input defaultValue={text} style={{ width: '200px' }} autoFocus='autofocus' onChange={this.folderNameChange} />
                        </span>
                    )
                } else {
                    return (<span><MyIcon type="icon-wenjianjia" className={style.leftTableIcon} />{text}</span>)
                }
            }
        },
        {
            title: '所属业务',//所属业务
            dataIndex: 'menu',
            key: 'menu',
            render: (text, record) => {
                if (record.id == this.state.editKey) {
                    return (
                        <span>
                            <TreeSelect
                                defaultValue={text ? text.value : null}
                                style={{ width: '200px' }}
                                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                treeData={this.state.menuTree ? this.state.menuTree.length == 0 ? text ? [text] : [] : this.state.menuTree :[]}
                                placeholder="请选择"
                                treeDefaultExpandAll
                                onFocus={this.menuSelect}
                                onChange={this.menuChange}
                            />
                        </span>
                    )
                } else {
                    return (<span>{text ? text.title : ""}</span>)
                }
            }
        },
        {
            title: '操作',
            dataIndex: 'opreate',
            key: 'opreate',
            render: (text, record) => {
                if (record.id == this.state.editKey) {
                    return <Button size="small" type="primary" onClick={this.state.oprratetType == "add" ? this.addFile : this.upFile.bind(this, record)}>保存</Button>
                } else {
                    return ""
                }
            }
        }
        ];
        if (!this.state.editKey) {
            LeftColumns.splice(LeftColumns.length - 1, 1)
        }

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
                                                event.preventDefault();
                                                if (this.state.editKey) {
                                                    return
                                                }
                                                this.setState({
                                                    DroVisible: true, X: event.clientX, Y: event.clientY - 110, activeIndex: id,
                                                    record: record,
                                                });


                                            },
                                            onClick: (event) => {
                                                if (this.state.editKey) {
                                                    return
                                                }
                                                this.contextMenuGetInfo(record);
                                            }
                                        }
                                    }}
                                />

                            </Col>
                        </Row>
                    </div>
                </Modal>
                {/* 右击事件 */}
                {this.state.DroVisible && <Drop visible={this.state.DroVisible} handleCancel={this.DropHandleCancel.bind(this)} X={this.state.X} Y={this.state.Y}
                    record={this.state.record} edit={this.state.record.type == "project"} openDeleteModal={this.openDeleteModal}/>}
                {/* 模板导入 */}
                <Allot modalVisible={this.state.AllotVisible} handleCancel={this.AllotHandleCancel.bind(this)} />
                {/* 删除提示 */}
                {this.state.deleteTip && <TipModal onOk={this.deleteFolder} onCancel={this.closeDeleteTipModal} />}
                
            </div>
        )
    }

}

export default connect(state => ({
    currentLocale: state.localeProviderData,
}))(Manage);



