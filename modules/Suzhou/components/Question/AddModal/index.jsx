import React, { Component } from 'react'
import style from './style.less'
import { Form, Row, Col, Input, Button, TreeSelect, Select, DatePicker, Modal ,Table} from 'antd';
import SubmitButton from "../../../../../components/public/TopTags/SubmitButton"
import moment from 'moment';
import { connect } from 'react-redux'
import axios from "../../../../../api/axios"
import { updatequestion, addquestion, defineOrgTree, getUserByOrgId, getdictTree, getmeetingupdateinfo ,fileList,orgTree} from "../../../../../api/api"
import { questionAdd,questionUpdate,questionInfo} from "@/api/suzhou-api"

import * as dataUtil from '../../../../../utils/dataUtil';
import UploadTpl from '../../Upload/uploadTpl';
import MyIcon from '@/components/public/TopTags/MyIcon';
const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;
class MenuInfo extends Component {
    constructor(props) {
        super(props)
        this.state = {
            orglist: [],
            visible: true,
            info: {

            },
            fileList:[],
            loginUser:'',
        }
    }

    componentDidMount() {
        let loginUser = JSON.parse(sessionStorage.getItem('userInfo'));
        this.setState({
            loginUser
        })
        const { type } = this.props
        if (type == "modify") {
            axios.get(questionInfo(this.props.data.id)).then(res => {
                this.setState({
                    info: res.data.data
                }, () => {
                    const { info } = this.state
                    this.setState({
                        questiontype1: info.type ? [info.type] : null,
                        priority1: info.priority ? [info.priority] : null,
                        orglist1: info.org ? [{ value: info.org.id, id: info.org.id, title: info.org.name }] : null,
                        userlist1: info.user ? [info.user] : null
                    })
                })
            });
            axios.get(fileList(this.props.data.id, 'ques')).then(res => {
                this.setState({
                  fileList: res.data.data
                })
              })
        }else{
            this.setState({
                fileList: []
              })
        }
    }
    //获取责任人主体、
    getOrgAndUser = () => {
        const rightData = this.props.rightData
        if (!this.state.orglist.length > 0) {
            // defineOrgTree
            axios.get(orgTree).then(res => {
                if (res.data.data) {
                    this.setState({
                        orglist: res.data.data,
                        orglist1: null
                    })
                } else {
                    this.setState({
                        orglist: [],

                    })
                }

            })
        }

    }
    //责任人
    getUser = (id) => {
        axios.get(getUserByOrgId(id)).then(res => {
            const { info } = this.state
            info.user = null
            this.setState({
                userlist: res.data.data,
                userlist1: null,
                info
            })
        })
    }
    //选择责任主体联动责任人
    onTreeChange = (v) => {

        const { info } = this.state
        this.setState({
            userId: null,
            isUserId: false
        }, () => {
            this.getUser(v)
        })

    }
    //获取问题类型
    getquestiontype = () => {
        if (!this.state.questiontype) {
            axios.get(getdictTree("comu.question.type")).then(res => {
                this.setState({
                    questiontype: res.data.data,
                    questiontype1: null
                })
            })
        }

    }
    //获取优先级
    getquestionpriority = () => {
        if (!this.state.priority) {
            axios.get(getdictTree("comu.question.priority")).then(res => {
                this.setState({
                    priority: res.data.data,
                    priority1: null
                })
            })
        }
    }

    handleSubmit = () => {
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                let fileIds = [];
                let { fileList } = this.state;
                if (fileList.length) {
                  for (let i = 0; i < fileList.length; i++) {
                    fileIds.push(fileList[i].id)
                  }
                }
                let obj = {
                    ...values,
                    handleTime: dataUtil.Dates().formatTimeString(values.handleTime),
                    projectId: this.props.projectId,
                    taskId: this.props.taskId,
                    bizType:this.props.bizType,
                    bizId:this.props.bizId,
                    fileIds,
                    sectionId:this.props.rightData.sectionId,
                    source:this.props.menuInfo?this.props.menuInfo.menuName:''
                }
                if (this.props.type == "add") {
                    let {startContent} = this.props.extInfo  || {};
                    let url = dataUtil.spliceUrlParams(questionAdd,{startContent});
                    axios.post(url, obj, true,null,true).then(res => {
                        this.props.addHandle(res.data.data)
                        this.props.form.resetFields();
                        this.props.handleCancel()
                    })
                } else {
                    obj.id = this.props.data.id
                    let {startContent} = this.props.extInfo  || {};
                    let url = dataUtil.spliceUrlParams(questionUpdate,{startContent});
                    axios.put(url, obj, true,null,true).then(res => {
                        this.props.updatedata(res.data.data)
                        this.props.handleCancel()
                    })
                }

            }
        });
    }
    handleSubmit1 = () => {
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                let obj = {
                    ...values,
                    handleTime: dataUtil.Dates().formatTimeString(values.handleTime),
                    projectId: this.props.projectId,
                    taskId: this.props.taskId,
                    bizId:this.props.bizId,
                    bizType:this.props.bizType
                }

                if (this.props.type == "add") {
                    axios.post(questionAdd, obj, true).then(res => {
                        this.props.addHandle(res.data.data)
                        this.props.form.resetFields();
                        this.setState({
                            userlist : null
                        })
                    })
                } else {
                    obj.id = this.props.data.id
                    axios.put(questionUpdate, obj, true).then(res => {
                        this.props.updatedata(res.data.data)

                    })
                }

            }
        });
    }
    //上传列表控制
    operateClick = (record) => {
        let { fileList } = this.state;
        let index = fileList.findIndex(item => item.id == record.id);
        fileList.splice(index, 1);
        this.setState({
        fileList
        })
    }
    //上传回调
    file = (files) => {
        let { fileList } = this.state;
        if (files.response && files.response.data) {
        let file = files.response.data;
        let fileName = file.fileName.split('.')[0];
        let suffix = file.fileName.split('.')[1];
        let obj = {
            id: file.id,
            fileName,
            suffix
        }
        fileList.push(obj)
        }
        this.setState({
        fileList,
        })
    }
    render() {
        const { intl } = this.props.currentLocale
        const {
            getFieldDecorator, getFieldsError, getFieldError, isFieldTouched,
        } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };
        const formItemLayout1 = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 4 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 20 },
            },
        };
        const columns = [
            {
              title: '文件名称',
              dataIndex: 'fileName',
              key: 'fileName',
            },
            {
              title:'文件类型',
              dataIndex: 'suffix',
              key: 'suffix',
            },
            {
              title: "",
              dataIndex: 'operate',
              key: 'operate',
              render: (text, record) => <MyIcon type='icon-exit' onClick={this.operateClick.bind(this, record)} />
            }
          ]
        const isLoginUser = (rule, val, callback) =>{
            let userId = this.state.loginUser? this.state.loginUser.id:'';
            if(val == userId){
            callback('问题责任人不能是问题创建人');
            }else{
            callback();
            }
        }
        return (
            <div className={style.main}>

                <Modal title={this.props.type == "add" ? "新增项目问题" : "修改项目问题"} visible={true}
                    onCancel={this.props.handleCancel}
                    width="800px"
                    mask={false}
                    maskClosable={false}
                    footer={
                        this.props.type == "add" ?
                            <div className='modalbtn'>
                                <SubmitButton key="submit1" onClick={this.handleSubmit1} content={intl.get("wsd.global.btn.saveandcontinue")} />
                                <SubmitButton key="submit2" type="primary" onClick={this.handleSubmit} content={intl.get("wsd.global.btn.preservation")} />
                            </div>
                            :
                            <div className='modalbtn'>
                                <SubmitButton key="submit1" onClick={this.props.handleCancel} content={intl.get("wsd.global.btn.cancel")} />
                                <SubmitButton key="submit2" type="primary" onClick={this.handleSubmit} content={intl.get("wsd.global.btn.preservation")} />
                            </div>
                    }>

                    <Form onSubmit={this.handleSubmit}>
                        <div className={style.content}>
                            <Row type="flex">
                                <Col span={12}>
                                    <Form.Item label="问题标题" {...formItemLayout}>
                                        {getFieldDecorator('title', {
                                            initialValue: this.state.info.title ? this.state.info.title : null,
                                            rules: [{
                                                required: true,
                                                message: intl.get('wsd.i18n.message.enter') + "问题标题",
                                            }],
                                        })(
                                            <Input />
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label="问题类型" {...formItemLayout}>
                                        {getFieldDecorator('type', {
                                            initialValue: this.state.info.type ? this.state.info.type.id : null,
                                            rules: [],
                                        })(
                                            <Select onDropdownVisibleChange={this.getquestiontype}>
                                                {this.state.questiontype1 ? this.state.questiontype1.map(item => {
                                                    return <Option value={item.id} key={item.id}>{item.name}</Option>
                                                }) : this.state.questiontype && this.state.questiontype.map(item => {
                                                    return <Option value={item.value} key={item.value}>{item.title}</Option>
                                                })}
                                            </Select>
                                        )}
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <Form.Item label="责任主体" {...formItemLayout}>
                                        {getFieldDecorator('orgId', {
                                            initialValue: this.state.info.org ? this.state.info.org.id : null,
                                            rules: [{
                                                required: true,
                                                message: intl.get('wsd.i18n.message.select') + "责任主体",
                                            }],
                                        })(
                                            <TreeSelect
                                                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                                placeholder="请选择"
                                                onFocus={this.getOrgAndUser}
                                                treeData={this.state.orglist1 ? this.state.orglist1 : this.state.orglist}
                                                // allowClear
                                                treeDefaultExpandAll
                                                onChange={this.onTreeChange}
                                            />
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label="责任人" {...formItemLayout}>
                                        {getFieldDecorator('userId', {
                                            // initialValue: this.state.info.user ? this.state.info.user.id : null,
                                            rules: [{
                                                validator: isLoginUser
                                            },{
                                                required: true,
                                                message: intl.get('wsd.i18n.message.select') + "责任人",
                                            }],
                                        })(

                                            <Select placeholder="请选择项目负责"
                                                disabled={this.state.isUserId}
                                            >
                                                {this.state.userlist1 ? this.state.userlist1.map(item => {
                                                    return <Option value={item.id} key={item.id}>{item.name}</Option>
                                                }) : this.state.userlist &&
                                                    this.state.userlist.map((val) => {
                                                        return (
                                                            <Option key={val.id} value={val.id}>{val.title}</Option>
                                                        )
                                                    })
                                                }
                                            </Select>
                                        )}
                                    </Form.Item>
                                </Col>
                            </Row >
                            <Row >
                                <Col span={12}>
                                    <Form.Item label="优先级" {...formItemLayout}>
                                        {getFieldDecorator('priority', {
                                            initialValue: this.state.info.priority ? this.state.info.priority.id : null,
                                            rules: [{
                                                required: true,
                                                message: intl.get('wsd.i18n.message.select') + "优先级",
                                            }],
                                        })(
                                            <Select onDropdownVisibleChange={this.getquestionpriority}>
                                                {this.state.priority1 ? this.state.priority1.map(item => {
                                                    return <Option value={item.id} key={item.id}>{item.name}</Option>
                                                }) : this.state.priority && this.state.priority.map(item => {
                                                    return <Option value={item.value} key={item.value}>{item.title}</Option>
                                                })}
                                            </Select>
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label="要求处理日期" {...formItemLayout}>
                                        {getFieldDecorator('handleTime', {
                                            initialValue: dataUtil.Dates().formatDateMonent(this.state.info.handleTime),
                                            rules: [{
                                                required: true,
                                                message: intl.get('wsd.i18n.message.select') + "要求处理日期",
                                            }],
                                        })(
                                            <DatePicker style={{ width: "100%" }} />
                                        )}
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row >
                                <Col span={24}>
                                    <Form.Item label="问题说明" {...formItemLayout1}>
                                        {getFieldDecorator('remark', {
                                            initialValue: this.state.info.remark ? this.state.info.remark : null,
                                            rules: [{
                                                required: true,
                                                message: intl.get('wsd.i18n.message.enter') + "问题说明",
                                            }],
                                        })(
                                            <TextArea rows={2} />
                                        )}
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row >
                                <Col span={24}>
                                    <Form.Item label="处理要求" {...formItemLayout1}>
                                        {getFieldDecorator('handle', {
                                            initialValue: this.state.info.handle ? this.state.info.handle : null,
                                            rules: [{
                                                required: true,
                                                message: intl.get('wsd.i18n.message.enter') + "处理要求",
                                            }],
                                        })(
                                            <TextArea rows={2} />
                                        )}
                                    </Form.Item>
                                </Col>
                            </Row>

                        </div>

                    </Form>
                    <div className={style.Modifytable}>
                        <div className={style.tip}>
                            {/* <span className={style.span}>备注：文件支持Word、excel格式</span> */}
                            <div className={style.upload}>
                            <UploadTpl isBatch={true} file={this.file} />
                            </div>
                        </div>
                        <Table 
                            rowKey={record => record.id} 
                            columns={columns} 
                            dataSource={this.state.fileList} 
                            pagination={false} 
                            name={this.props.name} />
                    </div>
                </Modal>

            </div>
        )
    }
}
const MenuInfos = Form.create()(MenuInfo);
const mapStateToProps = state => {
    return {
        currentLocale: state.localeProviderData,
    }
};


export default connect(mapStateToProps, null)(MenuInfos);
