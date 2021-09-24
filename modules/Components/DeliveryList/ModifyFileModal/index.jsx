import React, { Component } from 'react'
import style from './style.less'
import { Form, Row, Col, Input, Button, Icon, Select, DatePicker, Modal, Table,TreeSelect } from 'antd';
import intl from 'react-intl-universal'
import moment from 'moment';
import UploadTpl from '../../../../components/public/TopTags/uploadTpl'
import * as dataUtil from '../../../../utils/dataUtil';
import axios from "../../../../api/axios"
import {
    getBaseSelectTree,
    getPbsSelectTree,
    getPlanDelvAssignFileList,
    getPlanDelvAssign,
    fileList
} from "../../../../api/api"

const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;
class MenuInfo extends Component {
    constructor(props) {
        super(props)
        this.state = {
            fileList: [],
            initDone: false,
            visible: true,
            info: {},
            data: [],
            docData: [],
            pbsSelectData: []
        }
    }

    // 获取下拉框字典
    getBaseSelectTree = (typeCode) => {
        axios.get(getBaseSelectTree(typeCode)).then(res => {
            const { data } = res.data
            // 初始化字典-文档类型
            if (typeCode == 'plan.delv.type') {
                this.setState({
                    docData: data
                })
            }
        })
    }
    // 获取下拉计划级别
    getPlanLevelList = () => {
        if (!this.state.dataplanlevelList) {
            axios.get(getBaseSelectTree("plan.task.planlevel")).then(res => {
                const { data } = res.data
                if (data) {
                    this.setState({
                        planlevelList: data
                    })
                }
            })
        }

    }
    //初始化字典-文档类型
    onDocDataChange = () => {
        const { docData } = this.state
        if (!docData.length > 0) {
            this.getBaseSelectTree('plan.delv.type')
        }
    }

    //获取PBS下拉
    getPbsSelectData = () => {
        const { pbsSelectData } = this.state
        let { rightData } = this.props
        const { selectData } = this.state
        Array.isArray(rightData) ? null : rightData = [rightData]
        if (!pbsSelectData.length > 0) {
            axios.get(getPbsSelectTree(rightData[0]['projectId'])).then(res => {
                const { data } = res.data
                this.setState({
                    pbsSelectData: data || []
                })
            })
        }
    }

    //上传的回调
    file = (files) => {
        let { fileList } = this.state;
        if (files.response && files.response.data) {
            let file = files.response.data;
            let name = file.fileName.split('.')[0];
            let type = file.fileName.split('.')[1];
            let obj = {
                id: file.id,
                fileName: name,
                suffix: type
            }
            fileList.push(obj)
        }
        this.setState({
            fileList
        })
    }

    componentDidMount() {
        this.getPlanDelvAssignFileList()
        this.getFormList()
    }
    getFormList = () => {
        axios.get(getPlanDelvAssign(this.props.selectData[0].id)).then(res => {
            if (res.data.data) {
                this.setState({
                    info: res.data.data,
                    pbsSelectData1: res.data.data.parent?[{...res.data.data.parent,value:res.data.data.parent.id,title:res.data.data.parent.name}]:[]
                })
            }

        })
    }
    delete = (record) => {
        let { fileList } = this.state;
        let index = fileList.findIndex(item => item.id == record.id);
        fileList.splice(index, 1);
        this.setState({
            fileList
        })
    }

    // 获取交付清单的文件列表
    getPlanDelvAssignFileList = () => {
        const { activeIndex, selectData } = this.props
        if (activeIndex.length) {
            axios.get(fileList(activeIndex[0], "delv")).then(res => {
                const { data } = res.data
                this.setState({
                    data,
                    fileList: data || [],

                })
            })
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                const data = {
                    ...values,
                    planStartTime:dataUtil.Dates().formatTimeString(values.planStartTime),
                    planEndTime:dataUtil.Dates().formatTimeString(values.planEndTime),
                }
                this.props.updatePlanDelvAssign(data)
                let ids = []
                this.state.fileList.map(v => {
                    ids.push(v.id)
                })
                this.props.updateDocFileRelations(ids)
                this.props.handleCancel()
            }
        });
    }

    render() {
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
        const columns = [
            {
                title: intl.get('wsd.i18n.plan.fileinfo.filename'),
                dataIndex: 'fileName',
                key: 'fileName',
            },
            {
                title: intl.get('wsd.i18n.plan.fileinfo.filetype'),
                dataIndex: 'suffix',
                key: 'suffix',
            },
            {
                title: '操作',
                dataIndex: 'isSucceed',
                render: (text, record) => <Icon onClick={this.delete.bind(this, record)} type="close" />
            }
        ]
        return (
            <div >
                <Modal title="修改交付清单" visible={true} onCancel={this.props.handleCancel} width="800px" footer={
                    <div className="modalbtn">
                        <Button key="1" onClick={this.props.handleCancel}>取消</Button>
                        <Button key="2" type="primary" onClick={this.handleSubmit}>保存</Button>
                    </div>}
                >
                    <div className={style.main}>
                        <Form onSubmit={this.handleSubmit}>
                            <div className={style.content}>
                                <Row type="flex">
                                    <Col span={12}>
                                        <Form.Item label={intl.get('wsd.i18n.plan.delvList.delvname')} {...formItemLayout}>
                                            {getFieldDecorator('delvTitle', {
                                                initialValue: this.state.info.delvTitle,
                                                rules: [{
                                                    required: true,
                                                    message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.plan.delvList.delvname'),
                                                }],
                                            })(
                                                <Input />
                                            )}
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label={intl.get('wsd.i18n.plan.delvList.delvcode')} {...formItemLayout}>
                                            {getFieldDecorator('delvCode', {
                                                initialValue: this.state.info.delvCode,
                                                rules: [{
                                                    required: true,
                                                    message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.plan.delvList.delvcode'),
                                                }],
                                            })(
                                                <Input />
                                            )}
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={12}>
                                        <Form.Item label={intl.get('wsd.i18n.plan.delvList.plandelvnum')} {...formItemLayout}>
                                            {getFieldDecorator('delvNum', {
                                                initialValue: this.state.info.delvNum,
                                                rules: [],
                                            })(
                                                <Input />
                                            )}
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label={intl.get('wsd.i18n.plan.delvList.delvtype')} {...formItemLayout}>
                                            {getFieldDecorator('delvType', {
                                                initialValue: this.state.info.delvType ? this.state.info.delvType.id : '',
                                                rules: [],
                                            })(
                                                <Select onFocus={this.onDocDataChange}>
                                                    {
                                                      this.state.docData.length>0? this.state.docData.map((v, i) => {
                                                            return <Option value={v.value} key={i}>{v.title}</Option>
                                                        }):this.state.info.delvType?<Option value={this.state.info.delvType.id} >{this.state.info.delvType.name}</Option>:null
                                                    }
                                                </Select>
                                            )}
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={12}>
                                        <Form.Item label="PBS" {...formItemLayout}>
                                            {getFieldDecorator('parentId', {
                                                initialValue: this.state.info.parent ? this.state.info.parent.id : null,
                                                rules: [],
                                            })(
                                                // <Select disabled={this.state.info.delvId || false} onFocus={this.getPbsSelectData}>
                                                //     {
                                                //         this.state.pbsSelectData.length ? this.state.pbsSelectData.map(item => {
                                                //             return (
                                                //                 <Option key={item.value} value={item.value}> {item.title} </Option>
                                                //             )
                                                //         }) : this.state.info.parent &&
                                                //             <Option key={this.state.info.parent.id} value={this.state.info.parent.id}> {this.state.info.parent.name} </Option>
                                                //     }
                                                // </Select>
                                                <TreeSelect
                                                style={{width: "100%"}}
                                                dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
                                                treeData={this.state.pbsSelectData.length>0? this.state.pbsSelectData:this.state.pbsSelectData1}
                                                treeDefaultExpandAll
                                                onFocus={this.getPbsSelectData}
                                              />
                                            )}
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label="计划级别" {...formItemLayout}>
                                            {getFieldDecorator('planLevel', {
                                                initialValue: this.state.info.planLevel ? this.state.info.planLevel.id : null,
                                                rules: [],
                                            })(
                                                <Select onDropdownVisibleChange={this.getPlanLevelList}>
                                                    {
                                                        this.state.planlevelList ? this.state.planlevelList.map((v, i) => {
                                                            return <Option value={v.value} key={i}>{v.title}</Option>
                                                        }):this.state.info.planLevel?<Option value={this.state.info.planLevel.id} >{this.state.info.planLevel.name}</Option>:null
                                                    }
                                                </Select>
                                            )}
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label="计划开始时间" {...formItemLayout}>
                                            {getFieldDecorator('planStartTime', {
                                                initialValue: dataUtil.Dates().formatTimeMonent(this.state.info.planStartTime),
                                                rules: [],
                                            })(
                                                <DatePicker style={{ width: "100%" }} format={this.props.projSet.dateFormat}
                                                showTime={{ format: 'HH:mm', defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                                            />
                                            )}
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label="计划完成时间" {...formItemLayout}>
                                            {getFieldDecorator('planEndTime', {
                                                initialValue: dataUtil.Dates().formatTimeMonent(this.state.info.planEndTime),
                                                rules: [],
                                            })(
                                                <DatePicker style={{ width: "100%" }} format={this.props.projSet.dateFormat}
                                                showTime={{ format: 'HH:mm', defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                                            />
                                            )}
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row>

                                </Row>

                            </div>
                        </Form>
                        <div className={style.Modifytable}>
                            <div className={style.tip}>
                                {/* 上传按钮 */}
                                <UploadTpl isBatch={true} file={this.file} />
                                <Button type="submit" style={{ overflow: 'hidden', border: 'none', boxShadow: 'none' }} ></Button>
                            </div>
                            <Table
                                rowKey={record => record.id}
                                columns={columns}
                                dataSource={this.state.fileList}
                                pagination={false}
                                name={this.props.name}
                                size="small"
                            />
                        </div>
                    </div>
                </Modal>
            </div>
        )
    }
}
const MenuInfos = Form.create()(MenuInfo);
export default MenuInfos
