import React, { Component } from 'react'
import style from './style.less'
import moment from 'moment';
import { Modal, Button, Form, Row, Col, Input, Icon, Select, DatePicker, TreeSelect,Table ,Divider} from 'antd';
import PlanTaskModal from "../PlanTaskModal"
import { connect } from 'react-redux'

import { getUserInfoById, orgTree,defineOrgTree, orgPer, getdictTree, docPlanProject } from '../../../../api/api'
import { questionAdd } from '../../../../api/suzhou-api'
import axios from '../../../../api/axios'
import * as dataUtil from "../../../../utils/dataUtil"
import UploadTpl from '../../../Suzhou/components/Upload/uploadTpl';
import MyIcon from '@/components/public/TopTags/MyIcon';

import {getBaseSelectTree,getsectionId,handleQuestion,getProOrg,getOrg} from '../../../Suzhou/api/suzhou-api';
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
            fileList:[],
            parentData:''
        }
    }
    componentDidMount() {
        this.getOrgTree();
        // this.change(this.props.parentData.lastUserOrgVo.id);
        this.setState({
            width: this.props.width,
            parentData:this.props.parentData
        })
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
                let data = {
                    ...values,
                    fileIds,
                    questionId:this.props.parentData.id,
                    projectId:!this.props.parentData||!this.props.parentData.projectId?null:this.props.parentData.projectId,
                    sectionId:!this.props.parentData||!this.props.parentData.sectionId?null:this.props.parentData.sectionId,
                }
                // let url = dataUtil.spliceUrlParams(questionAdd,);
                axios.post(handleQuestion, data, true, '????????????', true).then((res) => {
                    this.props.handleCancel();
                    this.props.addData(res.data.data);
                })
            }

        })
    }
    // ??????????????????
    getOrgTree = () => {
        if(!this.props.parentData || !this.props.parentData.projectId){
            axios.get(getOrg).then(res => { //??????????????????
                if (res.data.data) {
                    this.setState({ orgTree: res.data.data },()=>{
                        this.change(this.props.parentData.lastUserOrgVo.id);
                    })
                }
            })
        }else{  //????????????
            axios.get(getProOrg(this.props.parentData.projectId)).then(res=>{
                if(res.data.data){
                    this.setState({orgTree:res.data.data},()=>{
                        this.change(this.props.parentData.lastUserOrgVo.id);
                    })
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
    //??????????????????
    operateClick = (record) => {
        let { fileList } = this.state;
        let index = fileList.findIndex(item => item.id == record.id);
        fileList.splice(index, 1);
        this.setState({
            fileList
        })
    }
    //????????????
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
        const {parentData} = this.state;

        const columns = [
            {
                title: '????????????',
                dataIndex: 'fileName',
                key: 'fileName',
            },
            {
                title: '????????????',
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
                                                initialValue:parentData?parentData.lastUserOrgVo.id.toString():null,
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
                                                initialValue:parentData?parentData.lastUserVo.id.toString():null,
                                                rules: [{
                                                    required: true,
                                                    message:'??????????????????'
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
                    <div className={style.Modifytable}>
                        <div className={style.tip}>
                            {/* <span className={style.span}>?????????????????????Word???excel??????</span> */}
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
