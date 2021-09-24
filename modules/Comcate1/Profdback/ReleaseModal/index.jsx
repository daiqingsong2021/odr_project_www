import React, { Component } from 'react'
import style from './style.less'
import moment from 'moment';
import { Modal, Button, Form, Row, Col, Input, Icon, Select, DatePicker, TreeSelect,Table,Divider} from 'antd';
import PlanTaskModal from "../PlanTaskModal"
import { connect } from 'react-redux'

import { getUserInfoById, orgTree,defineOrgTree, orgPer, getdictTree, docPlanProject } from '../../../../api/api'
import { questionAdd } from '../../../../api/suzhou-api'
import axios from '../../../../api/axios'
import * as dataUtil from "../../../../utils/dataUtil"
import UploadTpl from '../../../Suzhou/components/Upload/uploadTpl';
import MyIcon from '@/components/public/TopTags/MyIcon';

import {getBaseSelectTree,getsectionId,publishQuestion,getProOrg,getOrg} from '../../../Suzhou/api/suzhou-api';
import { getMapData } from '@/modules/Suzhou/components/Util/util';
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
            parentData:''
        }
    }
    componentDidMount() {
        this.getOrgTree();
        this.change(this.props.parentData.orgVo.id);
        this.setState({
            width: this.props.width,
            parentData:this.props.parentData
        })
    }
   
    closeTaskModal = () => {
        this.setState({
            isShowTaskmodal: false
        })
    }

    handleSubmit = (val, e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                let data = {
                    ...values,
                    questionId:this.props.parentData.id,
                    projectId:!this.props.parentData.projectId?null:this.props.parentData.projectId,
                    sectionId:!this.props.parentData.sectionId?null:this.props.parentData.sectionId
                }
                // let url = dataUtil.spliceUrlParams(questionAdd,);
                axios.post(publishQuestion, data, true, '发布成功', true).then((res) => {
                    this.props.addData(res.data.data);
                    this.props.handleCancel();
                    this.setState({
                        task: {}
                    })
                })
            }

        })
    }
    // 获取责任主题
    getOrgTree = () => {
        if(!this.props.parentData || !this.props.parentData.projectId){
            axios.get(getOrg).then(res => { //组织机构下的
                if (res.data.data) {
                    this.setState({ orgTree: res.data.data })
                }
            })
        }else{  //项目下的
            axios.get(getProOrg(this.props.parentData.projectId)).then(res=>{
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
        const {parentData} = this.state;

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
                    title={this.props.modelTitle}
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
                            <Button key={1} onClick={this.props.handleCancel}>取消</Button>
                            {/* 保存 */}
                            <Button key={2} onClick={this.handleSubmit.bind(this, 'save')} type="primary">确定</Button>
                        </div>
                    }
                >
                    <div>
                        <Form onSubmit={this.handleSubmit}>
                            <div>
                                <Row type='flex'>
                                    <Col span={22}>
                                        <FormItem label={'处理说明'} {...formItemLayout1}>
                                            {
                                                getFieldDecorator('remark', {
                                                    initialValue:'',
                                                    rules: [{
                                                        required: true,
                                                        message:'请输入处理说明'
                                                    }],
                                                })
                                                    (<TextArea rows={2} />)
                                            }
                                        </FormItem>
                                    </Col>
                                    <Divider orientation="left">下一步</Divider>
                                    <Col span={11}>
                                        <FormItem label={'处理机构'} {...formItemLayout}>
                                            {/* 问题标题 */}
                                            {getFieldDecorator('orgId', {
                                                initialValue:parentData?parentData.orgVo.id.toString():null,
                                                rules: [{
                                                    required: true,
                                                    message:'请输入处理机构'
                                                }],
                                            })(
                                                <TreeSelect
                                                    showSearch
                                                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                                    treeData={this.state.orgTree}
                                                    treeDefaultExpandAll
                                                    onChange={this.change}
                                                />
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={11}>
                                        <FormItem label={'处理人'} {...formItemLayout}>
                                            {/* 问题类型 */}
                                            {getFieldDecorator('userId', {
                                                initialValue:parentData?parentData.userVo.id.toString():null,
                                                rules: [{
                                                    required: true,
                                                    message:'请输入处理人'
                                                }],
                                            })(
                                                <Select onChange={this.userChange} allowClear showSearch
                                                    optionFilterProp="children">
                                                    {
                                                        this.state.orgPer.length != 0 && this.state.orgPer.map(item => {
                                                            return <Option key={item.value} value={item.value}>{item.title}</Option>
                                                        })
                                                    }
                                                </Select>
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                            </div>
                        </Form>
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
