import React, { Component } from 'react'
import style from './style.less'
import { Form, Row, Col, Input, Button, Icon, Select, DatePicker, TreeSelect } from 'antd';
import moment from 'moment';
import UploadTpl from '../../../../components/public/TopTags/uploadTpl'
import MyIcon from '../../../../components/public/TopTags/MyIcon'
import UploadTask from '../UploadTask'
import { connect } from 'react-redux'
import axios from '../../../../api/axios'
import { docProjectInfo, getdictTree, docOrgSel, docProjectUpdate } from '../../../../api/api'
import * as dataUtil from "../../../../utils/dataUtil"
import LabelFormLayout from "../../../../components/public/Layout/Labels/Form/LabelFormLayout"
			import LabelFormButton from "../../../../components/public/Layout/Labels/Form/LabelFormButton"
const FormItem = Form.Item;
const Option = Select.Option
const { TextArea } = Input;
class MenuInfo extends Component {
    constructor(props) {
        super(props)
        this.state = {
            info: {},
            fileId: null,
            fileName: '',
            orgSelData: [],
            docclassifyData: [],
            secutylevelData: [],
            professionData: [],
            task: false,
            taskData: { id: 0, name: '' },
        }
    }

    getData = () => {
        axios.get(docProjectInfo(this.props.data.id)).then(res => {
            if (res.data.data.task) {
                this.setState({
                    info: res.data.data,
                    taskData: res.data.data.task
                })
            } else {
                this.setState({
                    info: res.data.data
                })
            }
            if(res.data.data.status && res.data.data.status.id == 'EDIT'){
                this.setState({
                    editAuth: false
                })
            } else{
                this.setState({
                    editAuth: true
                })
            }
        })

        axios.get(docOrgSel(this.props.projectId)).then(res => {
            this.setState({
                orgSelData: res.data.data
            })
        })
    }

    taskHandleCancel = () => {
        this.setState({
            task: false
        })
    }
    click() {
        this.setState({ task: true })
    }

    componentDidMount() {

        this.getData();
    }


    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                var data = {
                    ...values,
                    fileId: this.state.fileName,
                    id: this.props.data.id,
//                    bizId: values['bizId'] ? (this.state.taskData.id ? this.state.taskData.id : null) : '',
                    bizType: this.props.bizType,
                    secutyLevel:1
                }
                const {startContent}=this.props
                let url = dataUtil.spliceUrlParams(docProjectUpdate,{startContent});
                axios.put(url, data, true, '修改成功',true).then(res => {
                    this.props.updateData(res.data.data)
                })


            }
        });
    }


    //任务选择回调
    taskData = (task) => {
        let obj = {
            id: task.id,
            name: task.name,
        }
        this.setState({
            taskData: obj
        })
    }

    //请求下拉列表
    onFocusSelect = (value) => {
        let { docclassifyData, secutylevelData, professionData } = this.state;
        if (docclassifyData.length && secutylevelData.length && professionData.length) {
            return;
        }

        axios.get(getdictTree(value)).then(res => {
            if (value == 'doc.docclassify') {
                this.setState({
                    docclassifyData: res.data.data
                })
            } else if (value == 'comm.secutylevel') {
                this.setState({
                    secutylevelData: res.data.data
                })
            } else if (value == 'doc.profession') {
                this.setState({
                    professionData: res.data.data
                })
            }
        })


    }

    //上传回调
    file = (files) => {
        this.setState({
            fileId: files.response ? (files.response.data ? files.response.data.id : null) : null,
            fileName: files.response ? (files.response.data ? files.response.data.fileName : '') : ''
        })
    }



    render() {
        const { intl } = this.props.currentLocale;
        const {
            getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
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
        const formItemLayout2 = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 4 },
            },
            wrapperCol: {
                xs: { span: 22 },
                sm: { span: 20 },
            },
        };

        let formData = {}
        const {editPermission} = this.props;
        return (
            <LabelFormLayout title = {this.props.title} >
				<Form onSubmit={this.handleSubmit}>
				
                <Row type="flex">
                                    <Col span={12}>
                                        <Form.Item label={intl.get('wsd.i18n.doc.temp.title')} {...formItemLayout}>
                                            {/* 文档标题 */}
                                            <div className={style.list}>
                                                {getFieldDecorator('docTitle', {
                                                    initialValue: this.state.info.docTitle,
                                                    rules: [{
                                                        required: true,
                                                        message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.doc.temp.title')
                                                    }],
                                                })(
                                                    <Input maxLength={60}/>
                                                )}
                                            </div>
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label={intl.get('wsd.i18n.doc.compdoc.docserial')} {...formItemLayout}>
                                            {/* 文档编号 */}
                                            <div className={style.list}>
                                                {getFieldDecorator('docNum', {
                                                    initialValue: this.state.info.docNum,
                                                    rules: [{
                                                        required: true,
                                                        message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.doc.compdoc.docserial')
                                                    }],
                                                })(
                                                    <Input maxLength={30}/>
                                                )}
                                            </div>
                                        </Form.Item>
                                    </Col>
                                    {/*<Col span={12}>*/}
                                    {/*    <Form.Item label={intl.get('wsd.i18n.doc.compdoc.docclassify')} {...formItemLayout}>*/}
                                    {/*        /!* 文档类别 *!/*/}
                                    {/*        <div className={style.list}>*/}
                                    {/*            {getFieldDecorator('docClassify', {*/}
                                    {/*                initialValue: this.state.info.docClassify ? this.state.info.docClassify.id : null,*/}
                                    {/*                rules: [],*/}
                                    {/*            })(*/}
                                    {/*                <Select onFocus={this.onFocusSelect.bind(this, 'doc.docclassify')}>*/}
                                    {/*                    {*/}
                                    {/*                        this.state.docclassifyData.length ? this.state.docclassifyData.map(item => {*/}
                                    {/*                            return (*/}
                                    {/*                                <Select.Option key={item.value} value={item.value}>{item.title}</Select.Option>*/}
                                    {/*                            )*/}
                                    {/*                        }) :*/}
                                    {/*                            (this.state.info.docClassify ? <Select.Option key={this.state.info.docClassify.id} value={this.state.info.docClassify.id}>{this.state.info.docClassify.name}</Select.Option> : null)*/}
                                    {/*                    }*/}
                                    {/*                </Select>*/}
                                    {/*            )}*/}
                                    {/*        </div>*/}
                                    {/*    </Form.Item>*/}
                                    {/*</Col>*/}
                                    <Col span={12}>
                                      <Form.Item label={intl.get('wsd.i18n.doc.compdoc.docauthor')} {...formItemLayout}>
                                        {/* 文档作者 */}
                                        <div className={style.list}>
                                          {getFieldDecorator('author', {
                                            initialValue: this.state.info.author,
                                            rules: [],
                                          })(
                                            <Input maxLength={9}/>
                                          )}
                                        </div>
                                      </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label={intl.get('wsd.i18n.doc.projectdoc.commandorg')} {...formItemLayout}>
                                            {/* 所属部门 */}
                                            <div className={style.list}>
                                                {getFieldDecorator('orgId', {
                                                    initialValue: this.state.info.org ? this.state.info.org.id : null,
                                                    rules: [],
                                                })(
                                                    <TreeSelect
                                                        onFocus={this.onFocusSelect.bind(this, 'org')}
                                                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                                        treeData={this.state.orgSelData}
                                                        treeDefaultExpandAll
                                                    />
                                                )}
                                            </div>
                                        </Form.Item>
                                    </Col>
                                    {/*<Col span={12}>*/}
                                    {/*    <Form.Item label={intl.get('wsd.i18n.sys.user1.userlevel')} {...formItemLayout}>*/}
                                    {/*        /!* 密级 *!/*/}
                                    {/*        <div className={style.list}>*/}
                                    {/*            {getFieldDecorator('secutyLevel', {*/}
                                    {/*                initialValue: this.state.info.secutyLevel ? this.state.info.secutyLevel.id : null,*/}
                                    {/*                rules: [{*/}
                                    {/*                    required: true,*/}
                                    {/*                }],*/}
                                    {/*            })(*/}
                                    {/*                <Select onFocus={this.onFocusSelect.bind(this, 'comm.secutylevel')}>*/}
                                    {/*                    {*/}
                                    {/*                        this.state.secutylevelData.length ? this.state.secutylevelData.map(item => {*/}
                                    {/*                            return (*/}
                                    {/*                                <Select.Option key={item.value} value={item.value}>{item.title}</Select.Option>*/}
                                    {/*                            )*/}
                                    {/*                        }) :*/}
                                    {/*                            (this.state.info.secutyLevel ? <Select.Option key={this.state.info.secutyLevel.id} value={this.state.info.secutyLevel.id}>{this.state.info.secutyLevel.name}</Select.Option> : null)*/}
                                    {/*                    }*/}
                                    {/*                </Select>*/}
                                    {/*            )}*/}
                                    {/*        </div>*/}
                                    {/*    </Form.Item>*/}
                                    {/*</Col>*/}
                                    {/*<Col span={12}>*/}
                                    {/*    <Form.Item label={intl.get('wsd.i18n.doc.temp.major')} {...formItemLayout}>*/}
                                    {/*        /!* 文档专业 *!/*/}
                                    {/*        <div className={style.list}>*/}
                                    {/*            {getFieldDecorator('profession', {*/}
                                    {/*                initialValue: this.state.info.profession ? this.state.info.profession.id : null,*/}
                                    {/*                rules: [],*/}
                                    {/*            })(*/}
                                    {/*                <Select onFocus={this.onFocusSelect.bind(this, 'doc.profession')}>*/}
                                    {/*                    {*/}
                                    {/*                        this.state.professionData.length ? this.state.professionData.map(item => {*/}
                                    {/*                            return (*/}
                                    {/*                                <Select.Option key={item.value} value={item.value}>{item.title}</Select.Option>*/}
                                    {/*                            )*/}
                                    {/*                        }) :*/}
                                    {/*                            (this.state.info.profession ? <Select.Option key={this.state.info.profession.id} value={this.state.info.profession.id}>{this.state.info.profession.name}</Select.Option> : null)*/}
                                    {/*                    }*/}
                                    {/*                </Select>*/}
                                    {/*            )}*/}
                                    {/*        </div>*/}
                                    {/*    </Form.Item>*/}
                                    {/*</Col>*/}
                                    {/*<Col span={12} className={style.upload}>*/}
                                    {/*    <Form.Item label={intl.get('wsd.i18n.doc.projectdoc.task')} {...formItemLayout}>*/}
                                    {/*        /!* WBS/任务 *!/*/}
                                    {/*        <div className={style.list}>*/}
                                    {/*            {getFieldDecorator('bizId', {*/}
                                    {/*                initialValue: this.state.taskData.name,*/}

                                    {/*            })(*/}
                                    {/*                <Input addonAfter={<MyIcon type="icon-liuchengguanli-" onClick={this.click.bind(this)} />} disabled={true} />*/}
                                    {/*            )}*/}
                                    {/*        </div>*/}
                                    {/*    </Form.Item>*/}
                                    {/*</Col>*/}

                                    <Col span={12}>
                                        <Form.Item label={intl.get('wsd.i18n.doc.temp.versions')} {...formItemLayout}>
                                            {/* 版本 */}
                                            <div className={style.list}>
                                                {getFieldDecorator('version', {
                                                    initialValue: this.state.info.version,
                                                    rules: [],
                                                })(
                                                    <Input disabled />
                                                )}
                                            </div>
                                        </Form.Item>
                                    </Col>

                                    <Col span={12}>
                                        <Form.Item label={intl.get('wsd.i18n.sys.ipt.statusj')} {...formItemLayout}>
                                            {/* 状态 */}
                                            <div className={style.list}>
                                                {getFieldDecorator('status', {
                                                    initialValue: this.state.info.status ? this.state.info.status.name : '',

                                                })(
                                                    <Input disabled={true} />
                                                )}
                                            </div>
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label={intl.get('wsd.i18n.doc.compdoc.babelte')} {...formItemLayout}>
                                            {/* 上传人 */}
                                            <div className={style.list}>
                                                {getFieldDecorator('creator', {
                                                    initialValue: this.state.info.creator ? this.state.info.creator.name : '',

                                                })(
                                                    <Input disabled={true} />
                                                )}
                                            </div>
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label={intl.get('wsd.i18n.plan.feedback.creattime')} {...formItemLayout}>
                                            {/* 上传时间 */}
                                            <div className={style.list}>
                                                {getFieldDecorator('createTime', {
                                                    initialValue: this.state.info.createTime ,

                                                })(
                                                    <Input disabled={true} />
                                                )}
                                            </div>
                                        </Form.Item>
                                    </Col>

                                    <Col span={24}>
                                        <Form.Item label={intl.get('wsd.i18n.operate.fdback.remark')} {...formItemLayout2}>
                                            {/* 备注 */}
                                            <div className={style.list}>
                                                {getFieldDecorator('remark', {
                                                    initialValue: this.state.info.remark
                                                })(
                                                    <TextArea maxLength={200}/>
                                                )}
                                            </div>
                                        </Form.Item>

                                    </Col>

                                </Row>
				</Form>
				<LabelFormButton>
                <Button onClick={this.props.closeRightBox} style={{ width: "100px", marginRight: "20px" }}>取消</Button>
                <Button disabled = {!this.props.editAuth && this.props.permission.indexOf(editPermission)!==-1} onClick={this.handleSubmit} style={{ width: "100px" }} type="primary">保存</Button>
				</LabelFormButton>
                {this.state.task && <UploadTask modalVisible={this.state.task} handleCancel={this.taskHandleCancel} projectId={this.props.projectId} taskData={this.taskData} />}
			</LabelFormLayout>
           
        )
    }
}

const MenuInfos = Form.create()(MenuInfo);
export default connect(state => ({
    currentLocale: state.localeProviderData
}))(MenuInfos);
