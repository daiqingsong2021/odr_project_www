import React, { Component } from 'react'
import style from './style.less'
import moment from 'moment';
import { Modal, Button, Form, Row, Col, Input, Icon, Select, DatePicker, TreeSelect,Table } from 'antd';
import PlanTaskModal from "../PlanTaskModal"
import { connect } from 'react-redux'

import { getUserInfoById, orgTree,defineOrgTree, orgPer, getdictTree, docPlanProject } from '../../../../api/api'
import { questionAdd } from '../../../../api/suzhou-api'
import axios from '../../../../api/axios'
import * as dataUtil from "../../../../utils/dataUtil"
import UploadTpl from '../../../Suzhou/components/Upload/uploadTpl';
import MyIcon from '@/components/public/TopTags/MyIcon';
import notificationFun from '@/utils/notificationTip';

import {getBaseSelectTree,planProAuthTree,getsectionId,addQuestion,station,getProOrg,getOrg} from '../../../Suzhou/api/suzhou-api';
import { getMapData ,getMapSectionData} from '@/modules/Suzhou/components/Util/util';
import SelectSection from '@/modules/Suzhou/components/SelectSection';
const FormItem = Form.Item;
const { TextArea } = Input
const Option = Select.Option;


class Add extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: {},
            orgPerKey: null,
            task: {},
            orgPer: [],
            orgTree: [],
            typeData: [],
            priorityData: [],
            projectData: [],
            fileList:[],
            stationList:[],//站点信息
            bizType:'',
            editBtn:false //控制选择项目，问题来源是否置灰
        }
    }
    componentDidMount() {
        // this.getOrgTree();
        if(this.props.type && this.props.type==2){  //菜单为现场问题协调时调用
            this.setState({
                bizType:'SCENE-CONSTRUCTIONQUES',
                editBtn:true,
                projectId:this.props.projectId
            })
        }else if(this.props.type && this.props.type==3){
                this.setState({
                    bizType:'SCENE-CONTROLQUES',
                    editBtn:true,
                    projectId:this.props.projectId
                })
        }
        this.setState({
            width: this.props.width
        })
        this.questionSource();//问题来源
         //选择项目
         axios.get(planProAuthTree).then(res=>{
            this.props.form.setFieldsValue({ sectionIds:''});
            this.getSelectTreeArr2(res.data.data,{"id":"value","name":"title"});
            this.setState({
                selectProject:res.data.data,
            })
        })
    }
    getSelectTreeArr2=(array,keyMap)=>{
        if(array){
          array.forEach((item,index,arr)=>{
            var obj = item;
            if(obj.type == 'project'){
            }else{
              obj.disabled = true;
            };
            for(var key in obj){
              var newKey = keyMap[key];
              if(newKey){
                  obj[newKey] = obj[key];
              }
            }
            this.getSelectTreeArr2(item.children,keyMap);
          })
        }
    }
    handleSubmit = (val, e) => {
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
                values.station = values.station?values.station.join(','):null;
                const data = {
                    ...values,
                    handleTime: dataUtil.Dates().formatTimeString(values.handleTime),
                    fileIds,
                }
                // console.log(this.props.type)
                if(this.props.type && (this.props.type== '2' || this.props.type== '3') && !values.sectionId){
                    notificationFun('提示','请选择标段');
                }else{
                    // let url = dataUtil.spliceUrlParams(questionAdd,);
                    axios.post(addQuestion, data, true, '新增成功', true).then((res) => {
                        this.props.addData(res.data.data);
                        if (val == 'save') {
                            this.props.handleCancel();
                            this.setState({
                                task: {}
                            })
                        } else {
                            this.props.form.resetFields();
                            this.setState({
                                task: {}
                            })
                        }
                    })
                }
            }

        })
    }

    // 获取责任主题
    getOrgTree = () => {
        if(!this.state.projectId){
            //orgTree
            axios.get(getOrg).then(res => { //组织机构下的
                if (res.data.data) {
                    this.setState({ orgTree: res.data.data })
                }
            })
        }else{  //项目下的
            // defineOrgTree
            axios.get(getProOrg(this.state.projectId)).then(res=>{
                if(res.data.data){
                    this.setState({orgTree:res.data.data})
                }
            })
        }
        
    }
    taskData = (val) => {
        this.setState({
            task: val
        })
    }
    //根据责任主体改变责任人
    change = (v) => {
        this.props.form.resetFields('userId', []);
        axios.get(orgPer(v)).then(res => {
            this.setState({ orgPer: res.data.data })
        })
    }
    //责任人onChange
    userChange = (val) => {
        this.setState({
            orgPerKey: val,
        })
    }
    //选择项目
    getProject =(selectedKeys, info,e)=>{
        this.props.form.setFieldsValue({
            'sectionId': '',
            'station':[],
            'orgId':[],
            'userId':'',
            
        })
        this.setState({
           projectId:info.props.id ,
           sectionCode:'',
           orgTree:[]
        })
    }
    //选择标段
     getsectionId=(val)=>{
        if(this.state.projectId){
            axios.get(getsectionId(this.state.projectId)).then(res=>{
                if(res.data.data){
                    getMapSectionData(res.data.data);
                }
                this.setState({
                  selectSection:res.data.data,
                })
            })
        }else{
            notificationFun('提示','请先选择项目');
        }
    }
    //获得站点
    getStation = (val)=>{
        if(this.state.projectId){
            axios.get(station(this.state.projectId)).then(res=>{
                const { data } = res.data;
                this.setState({
                    stationList: data,
                });
            })
        }else{
            notificationFun('提示','请先选择项目');
        }
    }
    selectSectionId=(val,info,e)=>{
        console.log(info);
        this.setState({sectionCode:info.props.code})
    }
    //选择下拉
    selectFocus = (val) => {
        let { typeData, priorityData } = this.state;
        if (typeData.length && priorityData.length) return;

        axios.get(getdictTree(val)).then(res => {
            if (res.data.data) {
                if (val === 'comu.question.type') {
                    this.setState({
                        typeData: res.data.data
                    })
                } else if (val === 'comu.question.priority') {
                    this.setState({
                        priorityData: res.data.data
                    })
                }
            }

        })

    }

    questionSource = () => {
        axios.get(getdictTree('comu.question.biztype'), {}, null, null, false).then(res => {
            this.setState({
                questionSourceList: res.data.data
            })
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
        const { intl } = this.props.currentLocale;
        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched, } = this.props.form;
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
        const { data } = this.state;

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
            if (val == this.props.loginUserId) {
                callback('问题责任人不能是问题创建人');
            } else {
                callback();
            }
        }
       
        return (
            <div >
                <Modal
                    title={'新增问题'}
                    visible={this.props.modalVisible}
                    onCancel={this.props.handleCancel}
                    footer={null}
                    width="850px"
                    centered={true}
                    className={style.main}
                    mask={false}
                    maskClosable={false}
                    footer={
                        <div className="modalbtn">
                            {/* 保存并继续 */}
                            <Button key={1} onClick={this.handleSubmit.bind(this, 'goOn')}>{intl.get('wsd.global.btn.saveandcontinue')}</Button>
                            {/* 保存 */}
                            <Button key={2} onClick={this.handleSubmit.bind(this, 'save')} type="primary">确定</Button>
                        </div>
                    }
                >
                    <div>
                        <Form onSubmit={this.handleSubmit}>
                            <div>
                                <Row type='flex'>
                                    <Col span={11}>
                                        <FormItem label={'项目名称'} {...formItemLayout}>
                                            {getFieldDecorator('projectId', {
                                                initialValue: this.props.projectId,
                                                rules: [{
                                                    required: this.state.editBtn?this.state.editBtn:false,
                                                    message: '请选择项目'
                                                 }],
                                            })(
                                                <TreeSelect
                                                    disabled={this.state.editBtn}
                                                    treeDefaultExpandAll
                                                    treeData={this.state.selectProject}
                                                    onSelect = {this.getProject}
                                                />
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={11}>
                                        <Form.Item label="选择标段" {...formItemLayout}>
                                        {getFieldDecorator('sectionId', {
                                            //rules: [{ validator: selectProjectId}],
                                            rules: [{
                                               required: this.state.editBtn?this.state.editBtn:false,
                                               message: '请选择标段'
                                            }],
                                        })(
                                            <TreeSelect
                                                treeDefaultExpandAll
                                                treeData={this.state.selectSection}
                                                onFocus={this.getsectionId.bind(this)}
                                                onSelect={this.selectSectionId}
                                            />
                                        )}
                                        </Form.Item>
                                    </Col>
                                    <Col span={11}>
                                        <Form.Item label="标段号" {...formItemLayout}>
                                        <Input disabled={true} value={this.state.sectionCode} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={11}>
                                        <FormItem label={'站点/区间'} {...formItemLayout}>
                                            {getFieldDecorator('station', {
                                               // rules: [{ validator: isLoginUser}],
                                            })(
                                                <Select
                                                    mode="multiple"
                                                    style={{ width: '100%' }}
                                                    placeholder="请选择站点"
                                                    onFocus={this.getStation.bind(this)}
                                                    >
                                                    {this.state.stationList && this.state.stationList.map(item => {
                                                        return (
                                                        <Option key={item.id} value={item.code}>
                                                            {item.name}
                                                        </Option>
                                                        );
                                                    })}
                                                </Select>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={11}>
                                        <FormItem label={intl.get("wsd.i18n.comu.question.title")} {...formItemLayout}>
                                            {/* 问题标题 */}
                                            {getFieldDecorator('title', {
                                                rules: [{
                                                    required: true,
                                                    message: intl.get('wsd.i18n.message.enter') + intl.get("wsd.i18n.comu.question.title")
                                                }],
                                            })(
                                                <Input style={{ overflow: 'hidden', textOverflow: 'ellipsis' }} />
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={11}>
                                        <FormItem label={intl.get("wsd.i18n.comu.question.questiontype")} {...formItemLayout}>
                                            {/* 问题类型 */}
                                            {getFieldDecorator('type', {
                                                rules: [{
                                                    required: true,
                                                    message: '请选择问题类型',
                                                }],
                                                // initialValue: data.questionType,
                                            })(
                                                <Select onFocus={this.selectFocus.bind(this, 'comu.question.type')}>
                                                    {
                                                        this.state.typeData.length != 0 && this.state.typeData.map(item => {
                                                            return <Option key={item.value} value={item.value}>{item.title}</Option>
                                                        })
                                                    }
                                                </Select>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={11}>
                                        <FormItem label={intl.get("wsd.i18n.comu.meetingaction.iptname")} {...formItemLayout}>
                                            {/* 责任主体 */}
                                            {getFieldDecorator('orgId', {
                                                // initialValue: data.repGroup,
                                                rules: [{
                                                    required: true,
                                                    message: intl.get('wsd.i18n.message.select') + intl.get("wsd.i18n.comu.meetingaction.iptname")
                                                }],
                                            })(
                                                <TreeSelect
                                                    showSearch
                                                    treeData={this.state.orgTree}
                                                    treeDefaultExpandAll
                                                    onFocus = {this.getOrgTree.bind(this)}
                                                    onChange={this.change}
                                                />
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={11}>
                                        <FormItem label={intl.get("wsd.i18n.comu.question.username")} {...formItemLayout}>
                                            {/* 责任人 */}
                                            {getFieldDecorator('userId', {
                                                // initialValue: this.state.orgPerKey,
                                                rules: [{
                                                    validator: isLoginUser
                                                }, {
                                                    required: true,
                                                    message: intl.get('wsd.i18n.message.select') + "责任人",
                                                }],
                                            })(
                                                <Select onChange={this.userChange} allowClear showSearch
                                                    optionFilterProp="children">
                                                    {
                                                        this.state.orgPer.length != 0 && this.state.orgPer.map(item => {
                                                            return <Option key={item.id} value={item.id}>{item.title}</Option>
                                                        })
                                                    }
                                                </Select>
                                            )}
                                        </FormItem>
                                    </Col>
                                    {/* 优先级 */}
                                    {/* <Col span={11}>
                                        <FormItem label={intl.get("wsd.i18n.comu.question.questionpriority")} {...formItemLayout}>
                                            {getFieldDecorator('priority', {
                                                // initialValue: data.questionPriority,
                                                rules: [{
                                                    message: intl.get('wsd.i18n.message.select') + intl.get('wsd.i18n.comu.question.questionpriority'),
                                                }],
                                            })(
                                                <Select onFocus={this.selectFocus.bind(this, 'comu.question.priority')}>
                                                    {
                                                        this.state.priorityData.length != 0 && this.state.priorityData.map(item => {
                                                            return <Option key={item.value} value={item.value}>{item.title}</Option>
                                                        })
                                                    }
                                                </Select>
                                            )}
                                        </FormItem>
                                    </Col> */}
                                    <Col span={11}>
                                        <Form.Item label={'问题来源'} {...formItemLayout}>
                                            <div className={style.list}>
                                                {getFieldDecorator('bizType', {
                                                    initialValue:this.state.bizType,
                                                    rules: [{
                                                    required: true,
                                                    message: '请选择项目来源',
                                                }],
                                                })(
                                                    <Select disabled={this.state.editBtn}>
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
                                    <Col span={11}>
                                        <FormItem label={intl.get("wsd.i18n.comu.question.handletime")} {...formItemLayout}>
                                            {/* 要求处理日期 */}
                                            {getFieldDecorator('handleTime', {
                                                // initialValue: moment(data.handleTime),
                                                rules: [{
                                                    required: true,
                                                    message: '请输入要求处理日期',
                                                }],
                                            })(
                                                <DatePicker style={{ width: '100%' }} />
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={22}>
                                        <FormItem label={intl.get("wsd.i18n.comu.question.questionremark")} {...formItemLayout1}>
                                            {/* 问题说明 */}
                                            {
                                                getFieldDecorator('remark', {
                                                    // initialValue: data.questionRemark,
                                                    rules: [{
                                                        required: true,
                                                        message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.comu.question.questionremark'),
                                                    }],
                                                })
                                                    (<TextArea rows={2} />)
                                            }
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row >
                                    <Col span={22}>
                                        <FormItem label={intl.get("wsd.i18n.comu.question.questionhandle")}{...formItemLayout1}>
                                            {/* 处理要求 */}
                                            {
                                                getFieldDecorator('handle', {
                                                    // initialValue: data.additionRequest,
                                                    rules: [{
                                                        required: true,
                                                        message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.comu.question.questionhandle'),
                                                    }],
                                                })
                                                    (<TextArea rows={2} />)
                                            }
                                        </FormItem>
                                    </Col>
                                </Row>
                            </div>
                        </Form>
                    </div>
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
const Adds = Form.create()(Add);
export default connect(state => ({
    currentLocale: state.localeProviderData
}))(Adds)
