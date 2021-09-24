import React, { Component } from 'react'
import { Modal, Button, Table, Input, Popconfirm, Form, Select, TreeSelect, notification } from 'antd'
import style from './style.less'
import { connect } from 'react-redux'
import { docTempFile, docPlanProject, getdictTree, docCorpSel, docOrgSel, docProjectSel, docTempAdd } from '../../../../api/api'
import axios from '../../../../api/axios'
import SubmitButton from "../../../../components/public/TopTags/SubmitButton"
const Option = Select.Option;
const FormItem = Form.Item;

class CompleteMessage extends Component {

    state = {
        initDone: false,
        modalInfo: {
            title: '完善信息'
        },
        inputVal: '',
        dataSource: [],
        disabled: [], //选择项目是否禁用
        //下拉框的数据
        treeData: [],
        projectTreeData: [],
        docClassifyList: [],
        professionList: [],
        folderTreeData: [],
        //下拉框的选中值
        docTypeData: [],
        projectData: [],
        folderData: [],
        docClassifyData: [],
        professionData: [],
        orgData: [],
        //输入框修改的值
        docTitleVal: [],
        versionVal: [],
        authorVal: [],
    }



    getDataList = (name) => {
        let str = this.props.dataArr.join(',');
        axios.get(docTempFile(str)).then(res => {
            let { docTypeData, projectData,
                folderData, docClassifyData, professionData, orgData, docTitleVal, versionVal, authorVal } = this.state;
            let data = res.data.data;
            let arr = [];
            for (let i = 0; i < data.length; i++) {
                let obj = {
                    ...data[i],
                    fileId: data.id,
                    author: name,
                    version: '1.0'
                }
                arr.push(obj)
                if (i == 0) {
                    docTypeData.push('')
                    projectData.push('')
                    folderData.push('')
                    docClassifyData.push('')
                    professionData.push('')
                    orgData.push('')
                    docTitleVal.push(data[i].fileName)
                    versionVal.push('1.0')
                    authorVal.push(name)
                } else {
                    docTypeData.push('同上')
                    projectData.push('同上')
                    folderData.push('同上')
                    docClassifyData.push('同上')
                    professionData.push('同上')
                    orgData.push('同上')
                    docTitleVal.push(data[i].fileName)
                    versionVal.push('同上')
                    authorVal.push('同上')
                }

            }
            this.setState({
                dataSource: arr,
                docTypeData,
                projectData,
                folderData,
                docClassifyData,
                professionData,
                orgData
            })
        })
    }

    componentDidMount() {

        let name = JSON.parse(sessionStorage.getItem('userInfo')).actuName
        this.getDataList(name);

    }

    handleCancel() {
        this.props.handleCancel('ComMessageVidible')
    }


    save = () => {
        const { intl } = this.props.currentLocale
        let { disabled, dataSource, docTitleVal, docTypeData, projectData,
            folderData, docClassifyData, professionData, orgData, versionVal, authorVal } = this.state;

       
        if(docTypeData[0] === '' || folderData[0] === ''){
            notification.warning(
                {
                    placement: 'bottomRight',
                    bottom: 50,
                    duration: 2,
                    message: intl.get('wsd.global.tip.title2'),
                    description: intl.get('wsd.i18n.doc.tempdoc.pleaseselectdoctype')
                }
            )
            return
        }

        let arr = [];
        for (let i = 0; i < dataSource.length; i++) {
            let obj = {
                ...dataSource[i],
                fileId: dataSource[i].id,
                docTitle: docTitleVal[i],
                docType: docTypeData[i] == '同上' ? docTypeData[0] : docTypeData[i],
                projectId: disabled[i] ? '' : (projectData[i] == '同上' ? (disabled[i] == disabled[0] ? projectData[0] : '') : projectData[i]),
                folderId: folderData[i] == '同上' ? folderData[0] : folderData[i],
                docClassify: docClassifyData[i] == '同上' ? docClassifyData[0] : docClassifyData[i],
                profession: professionData[i] == '同上' ? professionData[0] : professionData[i],
                orgId: disabled[i] ? '' : (orgData[i] == '同上' ? (disabled[i] == disabled[0] ? orgData[0] : '') : orgData[i]),
                version: versionVal[i] == '同上' ? versionVal[0] : versionVal[i],
                author: authorVal[i] == '同上' ? authorVal[0] : authorVal[i]
            }
            arr.push(obj)
        }
     
        axios.post(docTempAdd, arr, true).then(res => {
           
            this.setState({
                dataSource: [],
            })
            this.props.update();
            this.props.getDataList();
            this.handleCancel();
        })

    }

  

    //选择项目下来列表
    projectData = () => {
        axios.get(docPlanProject).then(res => {
            this.setState({
                projectTreeData: res.data.data
            })
        })
    }

    //文档分类 文档专业 下拉列表
    focusSel = (val) => {
        axios.get(getdictTree(val)).then(res => {
            if (val == 'doc.docclassify') {
                this.setState({
                    docClassifyList: res.data.data
                })
            } else if (val == 'doc.profession') {
                this.setState({
                    professionList: res.data.data
                })
            }
        })
    }

    //文件夹列表
    folderFocusSel = (index) => {
        let { disabled, projectData, dataSource, folderTreeData } = this.state;

        if (!folderTreeData.length) {
            let data = []
            for (let i = 0; i < dataSource.length; i++) {
                data.push([]);
            }
            this.setState({
                folderTreeData: data
            })
        }


        let datas = folderTreeData;
        if (disabled[index]) {  //判断选择的是企业还是项目
            axios.get(docCorpSel).then(res => {
                datas[index] = res.data.data
                this.setState({
                    folderTreeData: datas
                })
            })
        } else {
            if (projectData[index] && projectData[index] != '同上') { //判断是否选择项目
                axios.get(docProjectSel(projectData[index])).then(res => {
                    datas[index] = res.data.data
                    this.setState({
                        folderTreeData: datas
                    })
                })
            }
        }

    }
    //部门下拉列表
    orgFocusSel = (index) => {
        let { disabled, projectData } = this.state;
        if (!disabled[index]) {//判断是文档类型
            if (projectData[index] && projectData[index] != '同上') { //判断是否选择项目
                axios.get(docOrgSel(projectData[index])).then(res => {
                    this.setState({
                        treeData: res.data.data
                    })
                })
            }
        }

    }

    //文档标题
    docTitleInput = (index, e) => {
        let val = e.target.value;   //获取input输入框的值
        let { dataSource, docTitleVal } = this.state;
        let datas = docTitleVal;
        datas[index] = val;
        this.setState({
            docTitleVal: datas
        })
    }

    //文档类型onChange事件
    docTypeSel = (index, val) => {
        if (val != 'corp') {
            if (!this.state.projectTreeData.length) {
                this.projectData()
            }

        }
        let { dataSource, docTypeData, disabled, folderData } = this.state;
        if (!disabled.length) { //数组是否有值
            let data = [];
            for (let i = 0; i < dataSource.length; i++) { //循环数据条数
                if (val == 'corp' && i == index) {  //选择企业文档
                    data.push(true);
                } else {
                    data.push(false);
                }
            }
            this.setState({
                disabled: data
            })
        } else {    //若数组有值
            let datas = disabled;
            index ? folderData[index] = '同上' : folderData[index] = ''
            if (val == 'corp') { //当前选择企业文档
                datas[index] = true
            } else { //当前从企业文档改为其他选项
                datas[index] = false
            }
            this.setState({
                disabled: datas,
                folderData
            })
        }
        let datas = docTypeData;
        datas[index] = val; //更改已选择的数据
        this.setState({
            docTypeData: datas
        })
    }

    //选择项目
    projectSel = (index, val) => {
        let { projectData, dataSource } = this.state;
        let datas = projectData;
        datas[index] = val; //更改已选择的数据
        this.setState({
            projectData: datas
        })
    }
    //文件夹
    folderSel = (index, val) => {
        let { folderData, dataSource } = this.state;
        let datas = folderData;
        datas[index] = val; //更改已选择的数据
        this.setState({
            folderData: datas
        })
    }
    //文档分类
    docClassifySel = (index, val) => {
        let { docClassifyData, dataSource } = this.state;
        let datas = docClassifyData;
        datas[index] = '同上'
        datas[index] = val; //更改已选择的数据
        this.setState({
            docClassifyData: datas
        })
    }
    //文档专业
    professionSel = (index, val) => {
        let { professionData, dataSource } = this.state;
        let datas = professionData;
        datas[index] = val; //更改已选择的数据
        this.setState({
            professionData: datas
        })
    }
    //部门
    orgSel = (index, val) => {
        let { orgData, dataSource } = this.state;
        let datas = orgData;
        datas[index] = val; //更改已选择的数据
        this.setState({
            orgData: datas
        })
    }
    //版本
    versionInput = (index, e) => {
        let val = e.target.value;
        let { dataSource, versionVal } = this.state;

        let datas = versionVal;
        datas[index] = val;
        this.setState({
            versionVal: datas
        })
    }
    //作者
    authorInput = (index, e) => {
        let val = e.target.value;
        let { dataSource, authorVal } = this.state;

        let datas = authorVal;
        datas[index] = val;
        this.setState({
            authorVal: datas
        })
    }


    render() {
        const { intl } = this.props.currentLocale
        const column = [{
            title: intl.get('wsd.i18n.plan.fileinfo.filename'),//文件名称
            dataIndex: 'fileName',
            key: 'fileName',
        }, {
            title: intl.get("wsd.i18n.doc.temp.title"),//文档标题
            dataIndex: 'docTitle',
            key: 'docTitle',
            render: (text, record, index) => <Input defaultValue={record.fileName} style={{ width: '100px' }} onChange={this.docTitleInput.bind(this, index)} />
        }, {
            title: intl.get("wsd.i18n.doc.temp.type"),//文档类型
            dataIndex: 'docType',
            key: 'docType',
            render: (text, record, index) => {

                return (
                    <Select style={{ width: 120 }}
                        onChange={this.docTypeSel.bind(this, index)}
                        defaultValue='corp'
                        value={this.state.docTypeData[index]}>

                        <Option key='project' value="project">项目文档</Option>
                        <Option key='corp' value="corp">企业文档</Option>

                    </Select>
                )
            }
        }, {
            title: intl.get("wsd.i18n.doc.temp.project"),//选择项目
            dataIndex: 'projectId',
            key: 'projectId',
            render: (text, record, index) => {
                return (

                    <TreeSelect

                        disabled={this.state.disabled[index]}
                        style={{ width: 150 }}
                        value={this.state.projectData[index]}
                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                        treeData={this.state.projectTreeData}
                        treeDefaultExpandAll
                        onChange={this.projectSel.bind(this, index)}
                    />
                )
            }
        }, {
            title: intl.get("wsd.i18n.doc.temp.folder"),//文件夹
            dataIndex: 'folderId',
            width: 100,
            key: 'folderId',
            render: (text, record, index) => {
                return (
                    <TreeSelect
                        placeholder={index ? intl.get("wsd.i18n.doc.temp.ditto") : intl.get("wsd.i18n.doc.temp.select")}
                        style={{ width: 100 }}
                        value={this.state.folderData[index]}
                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                        treeData={this.state.folderTreeData[index]}
                        onFocus={this.folderFocusSel.bind(this, index)}
                        treeDefaultExpandAll
                        onChange={this.folderSel.bind(this, index)}
                    />
                )

            }
        }, {
            title: intl.get("wsd.i18n.doc.temp.classify"),//文档分类
            dataIndex: 'docClassify',
            key: 'docClassify',
            render: (text, record, index) => {
                return (

                    <Select style={{ width: 100 }} placeholder={index ? intl.get("wsd.i18n.doc.temp.ditto") : intl.get("wsd.i18n.doc.temp.select")}
                        onChange={this.docClassifySel.bind(this, index)}
                        onFocus={this.state.docClassifyList.length ? null : this.focusSel.bind(this, 'doc.docclassify')}
                        value={this.state.docClassifyData[index]} >
                        {this.state.docClassifyList.length && this.state.docClassifyList.map(item => {
                            return (
                                <Option key={item.value} value={item.value}>{item.title}</Option>
                            )
                        })}
                    </Select>
                )

            }
        }, {
            title: intl.get("wsd.i18n.doc.temp.major"),//文档专业
            dataIndex: 'profession',
            key: 'profession',
            render: (text, record, index) => {
                return (
                    <Select style={{ width: 100 }} placeholder={index ? intl.get("wsd.i18n.doc.temp.ditto") : intl.get("wsd.i18n.doc.temp.select")}
                        onChange={this.professionSel.bind(this, index)}
                        onFocus={this.state.professionList.length ? null : this.focusSel.bind(this, 'doc.profession')}
                        value={this.state.professionData[index]}>
                        {this.state.professionList.length && this.state.professionList.map(item => {
                            return (
                                <Option key={item.value} value={item.value}>{item.title}</Option>
                            )
                        })}
                    </Select>

                )

            }
        }, {
            title: intl.get("wsd.i18n.plan.activitydefineinfo.iptname"),//部门
            dataIndex: 'orgId',
            key: 'orgId',
            render: (text, record, index) => {
                return (
                    <TreeSelect
                        placeholder={index ? intl.get("wsd.i18n.doc.temp.ditto") : intl.get("wsd.i18n.doc.temp.select")}
                        disabled={this.state.disabled[index]}
                        value={this.state.orgData[index]}
                        style={{ width: 130 }}
                        onFocus={this.orgFocusSel.bind(this, index)}
                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                        treeData={this.state.treeData}
                        treeDefaultExpandAll
                        onChange={this.orgSel.bind(this, index)}
                    />
                )

            }
        }, {
            title: intl.get("wsd.i18n.doc.temp.versions"),//版本
            dataIndex: 'version',
            key: 'version',
            width: '100px',
            render: (text, record, index) => <Input defaultValue={index ? '同上' : text} style={{ width: '100px' }} onChange={this.versionInput.bind(this, index)} />
        }, {
            title: intl.get("wsd.i18n.doc.temp.author"),//作者
            dataIndex: 'author',
            key: 'author',
            width: '100px',
            render: (text, record, index) => <Input defaultValue={index ? '同上' : text} style={{ width: '100px' }} onChange={this.authorInput.bind(this, index)} />
        }];

        const { dataSource } = this.state;

        return (
            <div>
                <Modal
                    className={style.main}
                    width="92%"
                    title={this.state.modalInfo.title}
                    centered={true}
                    visible={this.props.modalVisible}
                    mask={false} maskClosable={false}
                    onCancel={this.handleCancel.bind(this)}
                    footer={
                        <div className='modalbtn'>
                            <SubmitButton key="b" type="submit" onClick={this.handleCancel.bind(this)} content="取消" />
                            <SubmitButton key="saveAndSubmit" type="primary" onClick={this.save} content="保存" />
                        </div>
                    }
                >
                    <div className={style.content} style={{ minHeight: '300px' }}>
                        <Table
                            rowKey={record => record.id}
                            // rowClassName={() => 'editable-row'}
                            size='small'
                            bordered
                            dataSource={dataSource}
                            columns={column}
                            pagination={false}
                        />
                    </div>
                </Modal>
            </div>
        )
    }

}


export default connect(state => ({
    currentLocale: state.localeProviderData
}))(CompleteMessage)





