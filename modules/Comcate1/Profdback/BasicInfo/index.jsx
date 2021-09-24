import React, { Component } from 'react'
import { Button, Col, Form, Input, Row, Select, Icon, message, TreeSelect, DatePicker,Table} from 'antd'
import style from './index.less'
import moment from 'moment'
import { connect } from 'react-redux'
import axios from '../../../../api/axios'
import { orgTree,defineOrgTree, orgPer, getdictTree, docPlanProject ,fileList} from '../../../../api/api'
import { questionUpdate, questionInfo } from '../../../../api/suzhou-api'
import {getQuestion,updateQuestion,getOrg,getProOrg} from '../../../Suzhou/api/suzhou-api'
import * as dataUtil from "../../../../utils/dataUtil"
import UploadTpl from '@/modules/Suzhou/components/Upload/uploadTpl';
import MyIcon from '@/components/public/TopTags/MyIcon';
const FormItem = Form.Item
const { TextArea } = Input
const Option = Select.Option;

class BasicInfo extends Component {
    constructor(props) {
        super(props)
        this.state = {
            initDone: false,
            data: {},
            orgPerKey: '',
            orgPer: [],
            projectData: [],
            typeData: [],
            priorityData: [],
            task: {},
            questionSourceList:[],//问题来源
            canEdit:true,//可修改
            fileList:[],
        }
    }
    componentDidMount() {
        const {permission,permissionEditBtn}=this.props;
        this.selectFocus('comu.question.type');
        this.selectFocus('comu.question.priority');
        this.selectFocus('comu.question.biztype');
        this.change(this.props.rightData.orgVo.id);//责任人
        this.getQuestionInfo()
        this.setState({
            width: this.props.width
        })
        if(!this.props.loginUser || !this.props.rightData){

        }else{
            if((this.props.loginUser.id == this.props.rightData.createrVo.id)&&this.props.rightData.statusVo.code == '0' && (permission.indexOf(permissionEditBtn)!=-1 )){
                this.setState({canEdit:false})
            }
        }
    }

    // 更新问题
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {

            if (!err) {
                let fileIds = [];
                let { fileList } = this.state;
                if (fileList.length) {
                  for (let i = 0; i < fileList.length; i++) {
                    fileIds.push(fileList[i].id)
                  }
                }
                let data = {
                    ...values,
                    id: this.props.data.id,
                    handleTime: dataUtil.Dates().formatTimeString(values.handleTime),
                    createTime:dataUtil.Dates().formatTimeString(values.createTime),
                    endTime:dataUtil.Dates().formatTimeString(values.endTime),
                    station:this.state.data.station,//values.station.join(',')||
                    fileIds
                }
                axios.put(updateQuestion, data, true, '更新成功', true).then((result) => {
                    this.props.updateData(result.data.data)
                })
            }
        });
    }
    // 获取到当前点击的一条问题的数据
    getQuestionInfo = () => {
        axios.get(getQuestion(this.props.data.id)).then((res) => {
            this.setState({
                data: res.data.data,
                task: res.data.data.taskName ? res.data.data.taskName : {}
            })
        })
        //获取文件
        axios.get(fileList(this.props.rightData.id, 'question')).then(res => {
            this.setState({
              fileList: res.data.data
            })
          })
        //获取责任主体下拉列表
        if(!this.props.rightData || !this.props.rightData.projectId){
            axios.get(getOrg).then(res => { //组织机构下的
                if (res.data.data) {
                    this.setState({ orgTree: res.data.data })
                }
            })
        }else{  //项目下的
            axios.get(getProOrg(this.props.rightData.projectId)).then(res=>{
                if(res.data.data){
                    this.setState({orgTree:res.data.data})
                }
            })
        }
        //获取项目下拉
        axios.get(docPlanProject).then(res => {
            if (res.data.data) {
                this.setState({
                    projectData: res.data.data
                })
            }

        })

    }
    //选择责任主体
    change = (v) => {
        this.props.form.resetFields('userId', []);
        axios.get(orgPer(v)).then(res => {
            this.setState({ orgPer: res.data.data })
        })
    }
    selectFocus = (val) => {
        let { typeData, priorityData } = this.state;
        if (typeData.length && priorityData.length) return;
        axios.get(getdictTree(val)).then(res => {
            if (res.data.data) {
                if (val === 'comu.question.type') {
                    this.setState({
                        typeData: res.data.data
                    })
                } else if(val === 'comu.question.priority') {
                    this.setState({
                        priorityData: res.data.data
                    })
                }else if(val == 'comu.question.biztype'){
                    this.setState({
                        questionSourceList: res.data.data
                    })
                }
            }

        })

    }

    taskData = (val) => {
        this.setState({
            task: val
        })
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
        const { intl } = this.props.currentLocale;
        const { form } = this.props
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
        }
        const { getFieldDecorator } = form
        const { data } = this.state
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
              render: (text, record) =>{
                    if(this.state.canEdit == false){
                        return (<MyIcon type='icon-exit' onClick={this.operateClick.bind(this, record)} />)
                    }
              } 
            }
          ]
        return (
            <div className={style.main}>
                <div className={style.mainHeight}>
                    <h3 className={style.listTitle}>基本信息</h3>
                    <div className={style.mainScorll}>
                        <Form onSubmit={this.handleSubmit}>
                            <div className={style.content}>
                                <Row type='flex'>
                                    <Col span={12}>
                                        <FormItem label={'项目名称'} {...formItemLayout}>
                                            {getFieldDecorator('projectname', {
                                                initialValue: data.projectName,
                                            })(
                                                <Input disabled/>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem label={'标段名称'} {...formItemLayout}>
                                            {getFieldDecorator('sectionName', {
                                                initialValue: data.sectionName,
                                            })(
                                                <Input disabled/>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem label={'标段号'} {...formItemLayout}>
                                            {getFieldDecorator('sectionCode', {
                                                initialValue: data.sectionCode,
                                            })(
                                                <Input disabled/>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem label={'站点/区间'} {...formItemLayout}>
                                            {getFieldDecorator('station', {
                                                initialValue: !data.stationVo?null:(data.stationVo.map((item,i)=>{
                                                    return item.name
                                                })),
                                            })(
                                                <Input disabled/>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem label={intl.get('wsd.i18n.comu.question.title')} {...formItemLayout}>
                                            {/* 问题标题 */}
                                            {getFieldDecorator('title', {
                                                initialValue: data.title,
                                                rules: [{
                                                    required: true,
                                                    message:'请输入问题标题'
                                                }],
                                            })(
                                                <Input disabled={this.state.canEdit} style={{ overflow: 'hidden', textOverflow: 'ellipsis' }} />
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem label={intl.get('wsd.i18n.comu.question.questiontype')} {...formItemLayout}>
                                            {/* 问题类型 */}
                                            {getFieldDecorator('type', {
                                                initialValue: data.typeVo ? data.typeVo.code: null,
                                                rules: [{
                                                    required: true,
                                                    message:'请输入问题类型'
                                                }],
                                            })(
                                                <Select disabled={this.state.canEdit}>
                                                    {
                                                        this.state.typeData.length != 0 ? this.state.typeData.map(item => {
                                                            return <Option key={item.value} value={item.value}>{item.title}</Option>
                                                        }) : (
                                                                data.type ? (
                                                                    <Option key={data.type.id} value={data.type.id}>{data.type.name}</Option>
                                                                ) : null
                                                            )
                                                    }
                                                </Select>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem label={intl.get("wsd.i18n.comu.meetingaction.iptname")} {...formItemLayout}>
                                            {/* 责任主体 */}
                                            {getFieldDecorator('orgId', {
                                                initialValue: data.orgVo ? data.orgVo.id : null,
                                                rules: [{
                                                    required: true,
                                                    message: intl.get('wsd.i18n.message.select') + intl.get("wsd.i18n.comu.meetingaction.iptname")
                                                }],
                                            })(
                                                <TreeSelect
                                                     disabled={this.state.canEdit}
                                                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                                    treeData = {this.state.orgTree}
                                                    // treeData={this.state.orgTree?this.state.orgTree:data.orgVo ? [{value:data.orgVo.id,title:data.orgVo.name}] : []}
                                                    treeDefaultExpandAll
                                                    onChange={this.change}
                                                />
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem label={intl.get('wsd.i18n.comu.question.username')} {...formItemLayout}>
                                            {/* 责任人 */}
                                            {getFieldDecorator('userId', {
                                                initialValue: data.userVo ? data.userVo.id : null,
                                                rules: [{
                                                    required: true,
                                                    message:'请输入责任人'
                                                }],
                                            })(
                                                <Select disabled={this.state.canEdit}>
                                                    {this.state.orgPer.length ?
                                                        this.state.orgPer.map((val) => {
                                                            return (
                                                                <Option key={val.id} value={val.id}>{val.title}</Option>
                                                            )
                                                        }) : (
                                                            data.user ? (
                                                                <Option key={data.userVo.id} value={data.userVo.id}>{data.userVo.name}</Option>
                                                            ) : null
                                                        )
                                                    }
                                                </Select>
                                            )}
                                        </FormItem>
                                    </Col>
                                    {/* <Col span={12}>
                                        <FormItem label={'所属组织'} {...formItemLayout}>
                                            {getFieldDecorator('currentUserOrg', {
                                                initialValue: data.currentUserOrgVo ? data.currentUserOrgVo.name : null,
                                                rules: [],
                                            })(
                                                <Input disabled />
                                            )}
                                        </FormItem>
                                    </Col> */}
                                    <Col span={12}>
                                        <FormItem label={'联系方式'} {...formItemLayout}>
                                            {getFieldDecorator('userPhone', {
                                                initialValue: !data.userVo||!data.userVo.phone ?'':data.userVo.phone,
                                                rules: [],
                                            })(
                                                <Input disabled />
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem label={'当前处理人'} {...formItemLayout}>
                                            {getFieldDecorator('currentUser', {
                                                initialValue: data.currentUserVo ? data.currentUserVo.name : null,
                                                rules: [],
                                            })(
                                                <Input disabled />
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem label={'所属组织'} {...formItemLayout}>
                                            {getFieldDecorator('currentUserOrg', {
                                                initialValue: data.currentUserOrgVo ? data.currentUserOrgVo.name : null,
                                                rules: [],
                                            })(
                                                <Input disabled />
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem label={'联系方式'} {...formItemLayout}>
                                            {getFieldDecorator('currentUserPhone', {
                                                initialValue: !data.currentUserVo||!data.currentUserVo.phone ?null: data.currentUserVo.phone,
                                                rules: [],
                                            })(
                                                <Input disabled />
                                            )}
                                        </FormItem>
                                    </Col>
                                    {/* 优先级 */}
                                    {/* <Col span={12}>
                                        <FormItem label={intl.get('wsd.i18n.comu.question.questionpriority')} {...formItemLayout}>
                                            {getFieldDecorator('priority', {
                                                initialValue: data.priorityVo ? data.priorityVo.code : null,
                                                rules: [{
                                                    message: intl.get('wsd.i18n.message.select') + intl.get("wsd.i18n.comu.question.questionpriority")
                                                }],
                                            })(
                                                <Select  disabled={this.state.canEdit}>
                                                    {
                                                        this.state.priorityData.length != 0 ? this.state.priorityData.map(item => {
                                                            return <Option key={item.value} value={item.value}>{item.title}</Option>
                                                        }) : (
                                                                data.priorityVo ? (
                                                                    <Option key={data.priorityVo.id} value={data.priorityVo.id}>{data.priorityVo.name}</Option>
                                                                ) : null
                                                            )
                                                    }
                                                </Select>
                                            )}
                                        </FormItem>
                                    </Col> */}
                                    <Col span={12}>
                                        <FormItem label={intl.get('wsd.i18n.comu.question.handletime')} {...formItemLayout}>
                                            {/* 要求处理日期 */}
                                            {getFieldDecorator('handleTime', {
                                                initialValue: dataUtil.Dates().formatDateMonent(data.handleTime),
                                                rules: [{
                                                    required: true,
                                                    message: intl.get('wsd.i18n.message.select') + intl.get('wsd.i18n.comu.question.handletime'),
                                                }],
                                            })(
                                                <DatePicker style={{ width: '100%' }} disabled={this.state.canEdit} />
                                            )}
                                        </FormItem>
                                    </Col>
                                <Col span={12} >
                                    <FormItem label={'问题来源'} {...formItemLayout}>
                                        {getFieldDecorator('bizType', {
                                            initialValue: data.bizTypeVo ? data.bizTypeVo.code.toString() : '',
                                            rules: [{
                                                    required: true,
                                                    message: '请选择项目来源',
                                                }],
                                        })(
                                            <Select disabled={this.state.canEdit || (this.props.type?true:false)}>
                                                {this.state.questionSourceList ? this.state.questionSourceList.map(item => {
                                                    return (
                                                        <Option key={item.value} value={item.value}>{item.title}</Option>
                                                    )
                                                }) : null}
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col>
                                    <Col span={12}>
                                        <FormItem label={intl.get("wsd.i18n.comu.question.status")} {...formItemLayout}>
                                            {/* 状态 */}
                                            {getFieldDecorator('status', {
                                                initialValue: data.statusVo ? data.statusVo.name : '',
                                            })(
                                                <Input disabled />
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem label={intl.get('wsd.i18n.plan.projectquestion.introducer')} {...formItemLayout}>
                                            {/* 提出人 */}
                                            {getFieldDecorator('creator', {
                                                initialValue: data.createrVo ? data.createrVo.name : '',
                                            })(
                                                <Input disabled />
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem label={'所属组织'} {...formItemLayout}>
                                            {getFieldDecorator('createrOrg', {
                                                initialValue: data.createrOrgVo ? data.createrOrgVo.name : '',
                                            })(
                                                <Input disabled/>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem label={'联系方式'} {...formItemLayout}>
                                            {getFieldDecorator('createrVoPhone', {
                                                initialValue: !data.createrVo || !data.createrVo.phone ? '':data.createrVo.phone ,
                                            })(
                                                <Input disabled/>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem label={intl.get('wsd.i18n.comu.question.creattime')} {...formItemLayout}>
                                            {/* 提出日期 */}
                                            {getFieldDecorator('createTime', {
                                                initialValue: data.createTime ? data.createTime.substr(0, 10) : null,
                                            })(
                                                <Input disabled={true} />
                                            )}
                                        </FormItem>
                                    </Col>
                                    {/* <Col span={12}>
                                        <FormItem label={'解决日期'} {...formItemLayout}>
                                            {getFieldDecorator('endTime', {
                                                initialValue: data.endTime?data.endTime.substr(0, 10) : null,
                                            })(
                                                <Input disabled={true} />
                                            )}
                                        </FormItem>
                                    </Col> */}
                                    <Col span={24}>
                                        <FormItem label={intl.get('wsd.i18n.comu.question.questionremark')}{...formItemLayout1}>
                                            {/* 问题说明 */}
                                            {
                                                getFieldDecorator('remark', {
                                                    initialValue: data.remark,
                                                    rules: [{
                                                        required: true,
                                                        message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.sys.role.roledesc'),
                                                    }],
                                                })
                                                    (<TextArea rows={2}  disabled={this.state.canEdit} />)
                                            }
                                        </FormItem>
                                    </Col>
                                    <Col span={24}>
                                        <FormItem label={intl.get('wsd.i18n.comu.question.questionhandle')}{...formItemLayout1}>
                                            {/* 处理要求 */}
                                            {
                                                getFieldDecorator('handle', {
                                                    initialValue: data.handle,
                                                    rules: [{
                                                        required: true,
                                                        message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.sys.role.roledesc'),
                                                    }],
                                                })
                                                    (<TextArea rows={2} disabled={this.state.canEdit} />)
                                            }
                                        </FormItem>
                                    </Col>
                                </Row>
                            </div>
                        </Form>
                        <div className={style.Modifytable}>
                            <div className={style.tip}>
                                <div className={style.upload}>
                                <UploadTpl isBatch={true} file={this.file} />
                                </div>
                            </div>
                            <Table 
                                rowKey={record => record.id} 
                                columns={columns} 
                                dataSource={this.state.fileList} 
                                pagination={false} 
                                // name={this.props.name} 
                                />
                        </div>
                    </div>
                    <div className={style.mybtn}>
                        <Row >
                            <Col span={22}>
                                <Col offset={4} >
                                    {/* 保存 */}
                                    <Button onClick={this.handleSubmit} style={{ width: "100px" }} type="primary"  disabled={this.state.canEdit}> {intl.get('wsd.global.btn.preservation')} </Button>
                                    {/* 取消 */}
                                    <Button onClick={this.props.closeRightBox} style={{ width: "100px", marginLeft: "20px" }}> {intl.get('wsd.global.btn.cancel')} </Button>
                                </Col>
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>
        )
    }
}
const BasicInfos = Form.create()(BasicInfo)
export default connect(state => ({
    currentLocale: state.localeProviderData
}))(BasicInfos)
