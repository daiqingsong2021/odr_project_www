import React, { Component } from 'react'
import style from './style.less'
import { Form, Row, Col, Input, Button, Icon, Select, DatePicker, Switch, Slider, TreeSelect } from 'antd';
import DisUser from '../../../Components/Window/SelectUser'
import { connect } from 'react-redux'
import LabelFormLayout from "../../../../components/public/Layout/Labels/Form/LabelFormLayout"
import LabelFormButton from "../../../../components/public/Layout/Labels/Form/LabelFormButton"
import axios from '../../../../api/axios'
import { docCorpInfo, getdictTree, docCompUpdate } from '../../../../api/api'
import * as dataUtil from "../../../../utils/dataUtil"
const FormItem = Form.Item;
const Option = Select.Option
const { TextArea } = Input;
class MenuInfo extends Component {
    constructor(props) {
        super(props)
        this.state = {

            info: {},                        //基本信息
            disUserDataStr: '',
            disUserData: [],
            treeSelectData: [],
            selectData: [],
            task: false,


        }
    }

    getData = () => {
        axios.get(docCorpInfo(this.props.data.id)).then(res => {

            if (res.data.data.scope) {
                let scope = [];
                let data = res.data.data;
                for (let i = 0; i < data.scope.length; i++) {
                    scope.push(data.scope[i].name);
                }
                scope = scope.join(',')
                this.setState({
                    info: data,
                    disUserDataStr: scope
                })
            } else {
                this.setState({
                    info: res.data.data
                })
            }


        })
    }

    componentDidMount() {
        this.getData();
        this.treeSelectFocus();
    }



    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                let data = {
                    ...values,
                    createTime: dataUtil.Dates().formatTimeString(values['createTime']),
//                    scope: this.state.disUserData,
                    id: this.props.data.id,
                    secutyLevel:1
                }

                axios.put(docCompUpdate, data, true, '修改成功').then(res => {
                    this.props.updateData(res.data.data)

                })

            }
        });
    }


    //密级 select onFocus事件 请求下拉列表数据
    selectFocus = () => {

        if (this.state.selectData.length == 0) {
            axios.get(getdictTree('comm.secutylevel')).then(res => {
                if (res.data.data) {
                    this.setState({
                        selectData: res.data.data
                    })
                }

            })
        }

    }

    //文档类型 请求下拉列表数据
    treeSelectFocus = () => {
        if (this.state.treeSelectData.length == 0) {
            axios.get(getdictTree('doc.docclassify')).then(res => {
                if (res.data.data) {
                    this.setState({
                        treeSelectData: res.data.data
                    })
                }

            })
        }

    }

    //发布弹窗
    taskHandleCancel = () => {
        this.setState({
            task: false
        })
    }
    click() {
        this.setState({ task: true })
    }

    //发布范围 分配用户的回调函数
    disUserData = (val) => {
        let str = [];
        let data = [];
        val.map(item => {
            str.push(item.name)
            let obj = {
                id: item.id,
                type: item.type
            }
            data.push(obj)
        })
        str = str.join(',')
        this.setState({
            disUserData: data,
            disUserDataStr: str
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

        return (
            <LabelFormLayout title={this.props.title} >
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
                                        <Input maxLength={60} />
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
                                        <Input maxLength={30} />
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
                        {/*                // <Select>*/}
                        {/*                //     <Select.Option value="1">一类</Select.Option>*/}
                        {/*                //     <Select.Option value="2">二类</Select.Option>*/}
                        {/*                //     <Select.Option value="3">三类</Select.Option>*/}
                        {/*                // </Select>*/}

                        {/*                <TreeSelect*/}
                        {/*                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}*/}
                        {/*                    treeData={this.state.treeSelectData}*/}
                        {/*                    treeDefaultExpandAll*/}
                        {/*                    onFocus={this.treeSelectFocus}*/}
                        {/*                />*/}

                        {/*            )}*/}
                        {/*        </div>*/}
                        {/*    </Form.Item>*/}
                        {/*</Col>*/}
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
                        {/*                // <Select>*/}
                        {/*                //     <Select.Option value="1">非密</Select.Option>*/}
                        {/*                //     <Select.Option value="2">保密</Select.Option>*/}
                        {/*                //     <Select.Option value="3">绝密</Select.Option>*/}
                        {/*                // </Select>*/}
                        {/*                <Select onFocus={this.selectFocus}>*/}
                        {/*                    {this.state.selectData.length ? this.state.selectData.map(item => {*/}
                        {/*                        return (*/}
                        {/*                            <Select.Option key={item.value} value={item.value}>{item.title}</Select.Option>*/}
                        {/*                        )*/}
                        {/*                    }) :*/}
                        {/*                        (this.state.info.secutyLevel ? <Select.Option value={this.state.info.secutyLevel.id}>{this.state.info.secutyLevel.name}</Select.Option> : null)*/}
                        {/*                    }*/}
                        {/*                </Select>*/}
                        {/*            )}*/}
                        {/*        </div>*/}
                        {/*    </Form.Item>*/}
                        {/*</Col>*/}
                        {/*<Col span={12} className={style.scope}>*/}
                        {/*    <Form.Item label={intl.get('wsd.i18n.doc.compdoc.scope')} {...formItemLayout}>*/}
                        {/*        /!* 发布范围 *!/*/}
                        {/*        <div className={style.list}>*/}
                        {/*            {getFieldDecorator('scope', {*/}
                        {/*                initialValue: this.state.disUserDataStr,*/}

                        {/*            })(*/}
                        {/*                <Input disabled addonAfter={<Icon type="user-add" onClick={this.click.bind(this)} style={{ color: "#1890ff" }} />} />*/}
                        {/*            )}*/}
                        {/*        </div>*/}
                        {/*    </Form.Item>*/}
                        {/*</Col>*/}
                        <Col span={12}>
                            <Form.Item label={intl.get('wsd.i18n.doc.compdoc.docauthor')} {...formItemLayout}>
                                {/* 作者 */}
                                <div className={style.list}>
                                    {getFieldDecorator('author', {
                                        initialValue: this.state.info.author,
                                        rules: [],
                                    })(
                                        <Input maxLength={9} />
                                    )}
                                </div>
                            </Form.Item>
                        </Col>
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
                            <Form.Item label={intl.get('wsd.i18n.doc.compdoc.babelte')} {...formItemLayout}>
                                {/* 上传人 */}
                                <div className={style.list}>
                                    {getFieldDecorator('creator', {
                                        initialValue: this.state.info.creator ? this.state.info.creator.name : '',
                                        rules: [],
                                    })(
                                        <Input disabled />
                                    )}
                                </div>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label={intl.get('wsd.i18n.plan.feedback.creattime')} validateStatus="success" {...formItemLayout} >
                                {/* 上传时间 */}
                                <div className={style.list}>
                                    {getFieldDecorator('createTime', {
                                        initialValue: dataUtil.Dates().formatDateMonent(this.state.info.createTime),
                                        rules: [],
                                    })(
                                        <DatePicker style={{ width: '100%' }} disabled />
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
                                        rules: [],
                                    })(
                                        <Input disabled />
                                    )}
                                </div>
                            </Form.Item>
                        </Col>




                        <Col span={24}>
                            <Form.Item label={intl.get('wsd.i18n.sys.ipt.remark')} {...formItemLayout2}>
                                {/* 备注 */}
                                <div className={style.list}>
                                    {getFieldDecorator('remark', {
                                        initialValue: this.state.info.remark
                                    })(
                                        <TextArea maxLength={200} />
                                    )}


                                </div>
                            </Form.Item>

                        </Col>

                    </Row>

                </Form>
                <LabelFormButton>
                    <Button disabled={this.props.wfeditAuth} onClick={this.props.closeRightBox} style={{ width: "100px", marginRight: "20px" }}>取消</Button>
                    <Button disabled={this.props.wfeditAuth && this.props.permission(editPermission)!==-1 } onClick={this.handleSubmit} style={{ width: "100px" }} type="primary">保存</Button>
                </LabelFormButton>
                {this.state.task && <DisUser visible={this.state.task} handleCancel={this.taskHandleCancel} handleOk={this.disUserData} />}
            </LabelFormLayout>



        )
    }
}

const MenuInfos = Form.create()(MenuInfo);
export default connect(state => ({
    currentLocale: state.localeProviderData,
}))(MenuInfos);
