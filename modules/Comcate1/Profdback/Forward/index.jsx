import React, { Component } from 'react'
import style from './style.less'
import moment from 'moment';
import { Modal, Button, Form, Row, Col, Input, Icon, Select, DatePicker, TreeSelect,Table,Divider} from 'antd';
import PlanTaskModal from "../PlanTaskModal"
import { connect } from 'react-redux'

import { getUserInfoById, orgTree, defineOrgTree,orgPer, getdictTree, docPlanProject } from '../../../../api/api'
import { questionAdd } from '../../../../api/suzhou-api'
import axios from '../../../../api/axios'
import * as dataUtil from "../../../../utils/dataUtil"
import UploadTpl from '../../../Suzhou/components/Upload/uploadTpl';
import MyIcon from '@/components/public/TopTags/MyIcon';

import {getBaseSelectTree,getsectionId,forwardQuestion,getProOrg,getOrg} from '../../../Suzhou/api/suzhou-api';
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
        console.log(this.props.parentData);
        // this.change(this.props.parentData.currentUserOrgVo.id);
        this.setState({
            width: this.props.width,
            parentData:this.props.rightData
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
                    // ...this.props.parentData,
                    ...values,
                    questionId:this.props.parentData.id,
                    projectId:!this.props.parentData.projectId?null:this.props.parentData.projectId,
                    sectionId:!this.props.parentData.sectionId?null:this.props.parentData.sectionId
                }
                // let url = dataUtil.spliceUrlParams(questionAdd,);
                axios.post(forwardQuestion, data, true, '????????????', true).then((res) => {
                    this.props.addData(res.data.data);
                    this.props.handleCancel();
                    this.setState({
                        task: {}
                    })
                })
            }

        })
    }
    // ??????????????????
    getOrgTree = () => {
        if(!this.props.parentData || !this.props.parentData.projectId){
            axios.get(getOrg).then(res => { //??????????????????
                if (res.data.data) {
                    this.setState({ orgTree: res.data.data })
                }
            })
        }else{  //????????????
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
    //?????????????????????????????????
    change = (v) => {
        this.props.form.resetFields('userId', []);
        console.log(v);
        axios.get(orgPer(v)).then(res => {
            this.setState({ orgPer: res.data.data })
        })
    }
    //?????????onChange
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
                callback('???????????????????????????????????????');
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
                            {/* ??????????????? */}
                            <Button key={1} onClick={this.props.handleCancel}>??????</Button>
                            {/* ?????? */}
                            <Button key={2} onClick={this.handleSubmit.bind(this, 'save')} type="primary">??????</Button>
                        </div>
                    }
                >
                    <div>
                        <Form onSubmit={this.handleSubmit}>
                            <div>
                                <Row type='flex'>
                                    <Col span={22}>
                                        <FormItem label={'????????????'} {...formItemLayout1}>
                                            {
                                                getFieldDecorator('remark', {
                                                    initialValue:'?????????????????????????????????',
                                                    rules: [{
                                                        required: true,
                                                        message:'?????????????????????'
                                                    }],
                                                })
                                                    (<TextArea rows={2} />)
                                            }
                                        </FormItem>
                                    </Col>
                                    <Divider orientation="left">?????????</Divider>
                                    <Col span={11}>
                                        <FormItem label={'????????????'} {...formItemLayout}>
                                            {/* ???????????? */}
                                            {getFieldDecorator('orgId', {
                                                initialValue:parentData?parentData.currentUserOrgVo.name:null,
                                                rules: [{
                                                    required: true,
                                                    message:'?????????????????????'
                                                }],
                                            })(
                                                <TreeSelect
                                                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                                    treeData={this.state.orgTree}
                                                    treeDefaultExpandAll
                                                    onChange={this.change}
                                                />
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={11}>
                                        <FormItem label={'?????????'} {...formItemLayout}>
                                            {/* ???????????? */}
                                            {getFieldDecorator('userId', {
                                                initialValue:parentData?parentData.currentUserVo.name:null,
                                                rules: [{
                                                    required: true,
                                                    message:'??????????????????'
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
