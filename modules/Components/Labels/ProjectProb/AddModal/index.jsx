import React, { Component } from 'react'
import style from './style.less'
import { Form, Row, Col, Input, Button, TreeSelect, Select, DatePicker, Modal, Table } from 'antd';
import SubmitButton from "../../../../../components/public/TopTags/SubmitButton"
import moment from 'moment';
import { connect } from 'react-redux'
import axios from "../../../../../api/axios"
import { updatequestion, addquestion, defineOrgTree, getUserByOrgId, getdictTree, getmeetingupdateinfo, fileList ,orgTree} from "../../../../../api/api"
import { questionAdd, questionUpdate, questionInfo ,addQuestion ,updateQuestion ,getQuestion,getStationInfo} from "@/api/suzhou-api"

import * as dataUtil from '../../../../../utils/dataUtil';
import UploadTpl from '../../../../Suzhou/components/Upload/uploadTpl';
import {getProOrg,getOrg} from '../../../../Suzhou/api/suzhou-api';
import MyIcon from '@/components/public/TopTags/MyIcon';
import notificationFun from '@/utils/notificationTip';
import { getMapSectionData } from '@/modules/Suzhou/components/Util/util';
import SelectSectionMultiple from '@/modules/Suzhou/components/SelectSectionMultiple';

const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;
class MenuInfo extends Component {
    constructor(props) {
        super(props)
        this.state = {
            orglist: [],
            orgTree:[],//责任主体
            orgPer:[],//责任人
            visible: true,
            info: {

            },
            fileList: [],
            // station:'',
            questionSourceList:[{title:this.props.menuInfo.menuName,value:this.props.menuInfo.menuCode}]
        }
    }

    componentDidMount() {
        const { type } = this.props
        this.getOrgAndUser();//责任主体
        this.getquestiontype();//问题类型
        this.getStationInfo();//站点/区间
        if (type == "modify") {
            axios.get(getQuestion(this.props.data.id)).then(res => {
                // console.log(res.data.data);
                this.setState({
                    info: res.data.data
                }, () => {
                    // const { info } = this.state
                    // this.setState({
                        // questiontype1: info.type ? [info.type] : null,
                        // priority1: info.priority ? [info.priority] : null,
                        // orglist1: info.org ? [{ value: info.org.id, id: info.org.id, title: info.org.name }] : null,
                        // userlist1: info.user ? [info.user] : null
                    // })
                    this.getUser(res.data.data.orgVo.id);
                })
            });
            // axios.get(fileList(this.props.data.id, 'question')).then(res => {
            //     this.setState({
            //         fileList: res.data.data
            //     })
            // })
            axios.get(fileList(this.props.data.id, 'question')).then(res => {
                console.log(res.data.data);
                this.setState({
                  fileList: res.data.data
                })
              })
        } else {
            this.setState({
                fileList: [],
                info:{}
            })
        }
    }
   
    //获取站点/区间信息
    getStationInfo = () =>{
        const projectId = this.props.projectId?this.props.projectId:' ';
        if(projectId){
            axios.get(getStationInfo(projectId)).then(res=>{
                this.setState({
                    stationInfo:res.data.data
                })
            })
        }else{
            notificationFun('提示','站点/区间必须在项目下')
        }
    }
    //获取责任人主体、
    getOrgAndUser = () => {
        const rightData = this.props.rightData;
        const projectId = this.props.projectId;
        if (!this.state.orglist.length > 0) {
        }
        if(!projectId){
            axios.get(getOrg).then(res => {
                if (res.data.data) {
                    this.setState({
                        // orglist: res.data.data,
                        // orglist1: null,
                        orgTree:res.data.data
                    })
                } else {
                    this.setState({
                        // orglist: [],
                        orgTree:[]
                    })
                }
            })
        }else{
            axios.get(getProOrg(rightData.projectId)).then(res => {
                if (res.data.data) {
                    this.setState({
                        // orglist: res.data.data,
                        // orglist1: null,
                        orgTree:res.data.data
                    })
                } else {
                    this.setState({
                        // orglist: [],
                        orgTree:[]
                    })
                }

            })
        }
    }
    //责任人
    getUser = (id) => {
        axios.get(getUserByOrgId(id)).then(res => {
            // const { info } = this.state
            // info.user = null
            this.setState({
                // userlist: res.data.data,
                // userlist1: null,
                // info
                orgPer:res.data.data
            })
        })
    }
    //选择责任主体联动责任人
    onTreeChange = (v) => {
        const { info } = this.state
        this.setState({
            userId: null,
        }, () => {
            this.getUser(v)
        })
    }
    //获取问题类型
    getquestiontype = () => {
        // if (!this.state.questiontype) {
            
        // }
        axios.get(getdictTree("comu.question.type")).then(res => {
            this.setState({
                questiontype: res.data.data,
                // questiontype1: null
            })
        })
    }
    //获取优先级
    // getquestionpriority = () => {
    //     if (!this.state.priority) {
    //         axios.get(getdictTree("comu.question.priority")).then(res => {
    //             this.setState({
    //                 priority: res.data.data,
    //                 priority1: null
    //             })
    //         })
    //     }
    // }
    questionSource = () => {
        axios.get(getdictTree('comu.question.biztype'), {}, null, null, false).then(res => {
            this.setState({
                questionSourceList: res.data.data
            })
        })
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
                values.station = values.station?values.station.join(','):null;
                let obj = {
                    ...values,
                    handleTime: dataUtil.Dates().formatTimeString(values.handleTime),
                    projectId: this.props.projectId,
                    taskId: this.props.taskId,
                    //bizType: this.props.bizType,
                    bizId: this.props.bizId,
                    fileIds,
                    // sectionId:this.props.rightData.sectionId?this.props.rightData.sectionId:'',
                }
                this.props.sectionType=='multiple'?null:(obj.sectionId = this.props.rightData.sectionId?this.props.rightData.sectionId:'');
                // console.log(obj);
                if (this.props.type == "add") {
                    let { startContent } = this.props.extInfo || {};
                    let url = dataUtil.spliceUrlParams(addQuestion, { startContent });
                    axios.post(url, obj, true, null, true).then(res => {
                        this.props.addHandle()
                        this.props.form.resetFields();
                        this.props.handleCancel()
                    })
                } else {
                    obj.id = this.props.data.id
                    let { startContent } = this.props.extInfo || {};
                    let url = dataUtil.spliceUrlParams(updateQuestion, { startContent });
                    axios.put(url, obj, true, null, true).then(res => {
                        this.props.updatedata()
                        this.props.handleCancel()
                    })
                }

            }
        });
    }
    handleSubmit1 = () => {
        this.props.form.validateFieldsAndScroll((err, values) => {
           if (!err) {
            values.station = values.station?values.station.join(','):null;
                let obj = {
                    ...values,
                    handleTime: dataUtil.Dates().formatTimeString(values.handleTime),
                    projectId: this.props.projectId,
                    taskId: this.props.taskId,
                    bizId: this.props.bizId,
                    // station:this.state.station,
                    //bizType: this.props.bizType
                    sectionId:this.props.rightData.sectionId?this.props.rightData.sectionId:'',
                }

                if (this.props.type == "add") {
                    axios.post(addQuestion, obj, true).then(res => {
                        this.props.addHandle()
                        this.props.form.resetFields();
                        // this.setState({
                        //     userlist: null
                        // })
                    })
                } else {
                    obj.id = this.props.data.id
                    axios.put(updateQuestion, obj, true).then(res => {
                        this.props.updatedata()

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
            let fileName = file.fileName.substring(0,file.fileName.lastIndexOf("."));
            let suffix = file.fileName.substring(file.fileName.lastIndexOf(".")+1,file.fileName.length);
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
                title: '文件类型',
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
        const isLoginUser = (rule, val, callback) => {
            let userId = this.props.loginUser? this.props.loginUser.id:'';
            if (val == userId) {
                callback('问题责任人不能是问题创建人');
            } else {
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
                                <SubmitButton key="submit1" onClick={this.props.handleCancel} content={'取消'} />
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
                                <Col span={12} style={{display:this.props.projectName?'block':'none'}}>
                                    <FormItem label={intl.get("wsd.i18n.comu.meeting.projectname")} {...formItemLayout}>
                                        {getFieldDecorator('projectname', {
                                            initialValue: this.props.projectName,
                                        })(
                                            <Input disabled />
                                        )}
                                    </FormItem>
                                </Col>
                                {this.props.sectionType == 'multiple'?(
                                        <Col span={12} style={{display:(!this.props.rightData || !this.props.rightData.sectionName )?'none':'block'}}>
                                            <FormItem label={'选择标段'} {...formItemLayout}>
                                                {getFieldDecorator('sectionId', {
                                                    initialValue: this.state.sectionName,
                                                })(
                                                    <SelectSectionMultiple
                                                        projectId={this.props.rightData.projectId}
                                                        sectionIds={this.props.rightData.sectionIds}
                                                        callBack={({ sectionId ,sectionCode}) => {
                                                            // setTimeout(()=>{
                                                            //     this.props.form.setFieldsValue({
                                                            //         sectionId
                                                            //     });
                                                            //     this.setState({sectionCode})
                                                            // },0)
                                                            this.props.form.setFieldsValue({ sectionId});
                                                            this.setState({sectionCode})
                                                        }}
                                                    />
                                                )}
                                            </FormItem>
                                        </Col>
                                        
                                ):(
                                        <Col span={12} style={{display:(!this.props.rightData || !this.props.rightData.sectionName )?'none':'block'}}>
                                            <FormItem label={'选择标段'} {...formItemLayout}>
                                                {getFieldDecorator('sectionName', {
                                                    initialValue:(!this.props.rightData || !this.props.rightData.sectionName )?'':this.props.rightData.sectionName ,
                                                })(
                                                    <Input disabled />
                                                )}
                                            </FormItem>
                                        </Col>
                                       
                                )}
                                {this.props.sectionType == 'multiple'?(
                                    <Col span={12} style={{display:(!this.props.rightData || !this.props.rightData.sectionCode)?'none':'block'}}>
                                        <FormItem label={'标段号'} {...formItemLayout}>
                                            {getFieldDecorator('sectionCode', {
                                                initialValue:this.state.sectionCode
                                            })(
                                                <Input disabled />
                                            )}
                                        </FormItem>
                                    </Col>
                                ):(
                                    <Col span={12} style={{display:(!this.props.rightData || !this.props.rightData.sectionCode)?'none':'block'}}>
                                        <FormItem label={'标段号'} {...formItemLayout}>
                                            {getFieldDecorator('sectionCode', {
                                                initialValue:(!this.props.rightData || !this.props.rightData.sectionCode)?'':this.props.rightData.sectionCode,
                                            })(
                                                <Input disabled />
                                            )}
                                        </FormItem>
                                    </Col>
                                )}
                                <Col span={12}>
                                    <Form.Item label={'站点/区间'} {...formItemLayout}>
                                        <div className={style.list}>
                                            {getFieldDecorator('station', {
                                                initialValue:(!this.state.info || !this.state.info.stationVo)?[]:(this.state.info.stationVo.map((item,i)=>{
                                                    return item.code
                                                })),
                                                rules: [],
                                            })(
                                                <Select showArrow mode="multiple" allowClear 
                                                disabled={this.props.type == 'add'?false:true}
                                                // onChange={(...args) => {
                                                //         let station = ''
                                                //         station = args[0].join(',')
                                                //       this.setState({station},()=>{
                                                //       })
                                                //   }}
                                                  >
                                                    {this.state.stationInfo ? this.state.stationInfo.map(item => {
                                                        return (
                                                            <Option key={item.code} value={item.code}>{item.name}</Option>
                                                        )
                                                    }) : null}
                                                </Select>
                                            )}
                                        </div>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label="问题标题" {...formItemLayout}>
                                        {getFieldDecorator('title', {
                                            initialValue: this.state.info? this.state.info.title : null,
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
                                            initialValue: (!this.state.info || !this.state.info.typeVo || !this.state.info.typeVo.code.toString())? null:this.state.info.typeVo.code.toString() ,
                                            rules: [{
                                                required: true,
                                                message: intl.get('wsd.i18n.message.enter') + "问题类型",
                                            }],
                                        })(
                                            <Select>
                                                {/* {this.state.questiontype1 ? this.state.questiontype1.map(item => {
                                                    return <Option value={item.id} key={item.id}>{item.name}</Option>
                                                }) : this.state.questiontype && this.state.questiontype.map(item => {
                                                    return <Option value={item.value} key={item.value}>{item.title}</Option>
                                                })} */}
                                                {this.state.questiontype && this.state.questiontype.map(item => {
                                                    return <Option value={item.value} key={item.value}>{item.title}</Option>
                                                })}
                                            </Select>
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label="责任主体" {...formItemLayout}>
                                        {getFieldDecorator('orgId', {
                                            initialValue: (!this.state.info || !this.state.info.orgVo || !this.state.info.orgVo.id)? null:this.state.info.orgVo.id,
                                            rules: [{
                                                required: true,
                                                message: intl.get('wsd.i18n.message.select') + "责任主体",
                                            }],
                                        })(
                                            <TreeSelect
                                                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                                placeholder="请选择"
                                                // onFocus={this.getOrgAndUser}
                                                // treeData={this.state.orglist1 ? this.state.orglist1 : this.state.orglist}
                                                treeData = {this.state.orgTree}
                                                treeDefaultExpandAll
                                                onChange={this.onTreeChange}
                                            />
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label="责任人" {...formItemLayout}>
                                        {getFieldDecorator('userId', {
                                            initialValue: (!this.state.info ||!this.state.info.userVo|| !this.state.info.userVo.id)? null:this.state.info.userVo.id,
                                            rules: [{
                                                required: true,
                                                message: intl.get('wsd.i18n.message.select') + "责任人",
                                            }, {
                                                validator: isLoginUser
                                            }],
                                        })(

                                            <Select>
                                                {/* {this.state.userlist1 ? this.state.userlist1.map(item => {
                                                    return <Option value={item.id} key={item.id}>{item.name}</Option>
                                                }) : this.state.userlist &&
                                                    this.state.userlist.map((val) => {
                                                        return (
                                                            <Option key={val.id} value={val.id}>{val.title}</Option>
                                                        )
                                                    })
                                                } */}
                                                {this.state.orgPer.map((val) => {
                                                        return (
                                                            <Option key={val.id} value={val.id}>{val.title}</Option>
                                                        )
                                                    })}
                                            </Select>
                                        )}
                                    </Form.Item>
                                </Col>
                                {/* <Col span={12}>
                                    <Form.Item label="优先级" {...formItemLayout}>
                                        {getFieldDecorator('priority', {
                                            initialValue: this.state.info.priority ? this.state.info.priority.id : null,
                                            rules: [{
                                                required: true,
                                                message: intl.get('wsd.i18n.message.select') + "优先级",
                                            }],
                                        })(
                                            <Select onDropdownVisibleChange={this.getquestionpriority} placeholder="请选择">
                                                {this.state.priority1 ? this.state.priority1.map(item => {
                                                    return <Option value={item.id} key={item.id}>{item.name}</Option>
                                                }) : this.state.priority && this.state.priority.map(item => {
                                                    return <Option value={item.value} key={item.value}>{item.title}</Option>
                                                })}
                                            </Select>
                                        )}
                                    </Form.Item>
                                </Col> */}
                                <Col span={12}>
                                    <Form.Item label={'问题来源'} {...formItemLayout}>
                                        <div className={style.list}>
                                            {getFieldDecorator('bizType', {
                                                initialValue: this.props.menuInfo? this.props.menuInfo.menuCode : '',
                                                rules: [],
                                            })(
                                                <Select onFocus={this.questionSource} disabled>
                                                    {this.state.questionSourceList ? this.state.questionSourceList.map(item => {
                                                        return (
                                                            <Option key={item.value} value={item.value}>{item.title}</Option>
                                                        )
                                                    }) : null}
                                                </Select>
                                            )}
                                        </div>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label="要求处理日期" {...formItemLayout}>
                                        {getFieldDecorator('handleTime', {
                                            initialValue: this.state.info?dataUtil.Dates().formatDateMonent(this.state.info.handleTime):'',
                                            rules: [{
                                                required: true,
                                                message: intl.get('wsd.i18n.message.select') + "要求处理日期",
                                            }],
                                        })(
                                            <DatePicker style={{ width: "100%" }} />
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Form.Item label="问题说明" {...formItemLayout1}>
                                        {getFieldDecorator('remark', {
                                            initialValue: this.state.info? this.state.info.remark : null,
                                            rules: [{
                                                required: true,
                                                message: intl.get('wsd.i18n.message.enter') + "问题说明",
                                            }],
                                        })(
                                            <TextArea rows={2} />
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Form.Item label="处理要求" {...formItemLayout1}>
                                        {getFieldDecorator('handle', {
                                            initialValue: this.state.info? this.state.info.handle : null,
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
