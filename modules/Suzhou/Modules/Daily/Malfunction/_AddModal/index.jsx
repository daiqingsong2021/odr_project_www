import React, { Component } from 'react';
import { Modal, Form, Row, Col, Input, Button, Icon, Select, Divider, DatePicker, Descriptions, TreeSelect } from 'antd';
import moment from 'moment';
import style from './style.less';
import intl from 'react-intl-universal';
import { connect } from 'react-redux';
import { curdCurrentData } from '../../../../../../store/curdData/action';
import axios from '../../../../../../api/axios';
import { getsectionId, getBaseSelectTree } from '../../../../api/suzhou-api';
const { TextArea } = Input;
const Option = Select.Option;
const TreeNode = TreeSelect.TreeNode;
import PublicButton from "../../../../../../components/public/TopTags/PublicButton";
import * as dataUtil from "../../../../../../utils/dataUtil";
import { getSelectTreeArr } from "@/modules/Suzhou/components/Util/firstLoad";
import SelectSection from '@/modules/Suzhou/components/SelectSection';

export class AddModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            disabled:true
        }
    }
    componentDidMount() {

    }
    //选择日期
    handleDate = () => { }

    //提交数据
    handleSubmit = (val, e) => {
        e.preventDefault();
        this.setState({ showSubmitModal: true })
        // this.props.form.validateFieldsAndScroll((err, values) => {
        //     if (!err) {
        //         const data = {
        //             ...values,
        //             projectId: this.props.projectId
        //         }
        //         if (val == 'save') {
        //             this.props.submit(data, 'save');
        //         } else {
        //             this.props.submit(data, 'goOn');
        //             this.props.form.resetFields();
        //         }
        //     }
        // })
    }
    handleSubmitSign = () => { console.log(this.state.submitData) }
    handleCancelClose = () => {
        this.setState({ showSubmitModal: false })
    }
      //新增提交
  handleSubmit = (val, e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      values.entryTime = dataUtil.Dates().formatTimeString(values.entryTime).substr(0,10);
      if (!err) {
        const data={
          ...values,
          projInfoId:this.state.projInfoId,
          orgName:this.state.orgName
        }
        if (val == 'save') {
          this.props.submit(data, 'save' );
        } else {
          this.props.submit(data, 'goOn' );
          this.props.form.resetFields();
        }

      }
    });
  };
  editFun = () => {
    this.setState({
        disabled: false
    })
  }
    render() {
        const { intl } = this.props.currentLocale
        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
        const formItemLayout0 = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 18 },
            },
        };
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 18 },
            },
        };
        const formItemLayout1 = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 3 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 21 },
            },
        };
        const { isAdd } = this.props;
        return (
            <div>
                <Modal className={style.main}
                    width="850px"
                    afterClose={this.props.form.resetFields}
                    mask={false}
                    maskClosable={false}
                    footer={<div className="modalbtn">
                        {/* 取消 */}
                        <Button key={1} onClick={this.props.handleCancel}>取消</Button>
                        {/* 保存 */}
                        <Button key={2} onClick={this.handleSubmit.bind(this, 'save')} type="primary">{intl.get('wsd.global.btn.preservation')}</Button>
                    </div>}
                    centered={true} title={'新增'} visible={this.props.modalVisible}
                    onCancel={this.props.handleCancel}>
                    {!isAdd && <div style={{textAlign:'right'}}><Button type="primary" icon="edit" size='small' onClick={this.editFun} style={{ marginRight: 30 }}>修改</Button></div>}
                    {!isAdd && <div style={{marginBottom:10,marginTop:20}}><Descriptions column={6}>
                        <Descriptions.Item label="日期">Zhou Maomao</Descriptions.Item>
                        <Descriptions.Item label="线路">1810000000</Descriptions.Item>
                        <Descriptions.Item label="填报人">Hangzhou</Descriptions.Item>
                        <Descriptions.Item label="填报时间">empty</Descriptions.Item>
                        <Descriptions.Item label="审核人">empty</Descriptions.Item>
                        <Descriptions.Item label="审核时间">empty</Descriptions.Item>
                    </Descriptions></div>}
                    <Form onSubmit={this.handleSubmit}>
                        <div style={{marginTop:'20px'}}>
                        {isAdd && <Row type="flex">
                        <Col span={6}>
                        <Form.Item label="日期" {...formItemLayout0}>
                            {getFieldDecorator('date', {
                            rules: [{required: true,message: '请选择日期'}],
                            })(
                                <DatePicker size='small' style={{ width: 150, marginRight: 10 }} onChange={this.handleDate} />
                            )}
                        
                        </Form.Item>
                        </Col>
                        <Col span={6}>
                        <Form.Item label="线路" {...formItemLayout0}>
                            {getFieldDecorator('train', {
                            rules: [{required: true,message: '请选择线路'}],
                            })(
                                <Select
                                showSearch
                                mode='multiple'
                                allowClear={true}
                                size='small'
                                style={{ minWidth: 150, marginRight: 10 }}
                                placeholder="请选择线路"
                                optionFilterProp="children"
                                required
                                //onChange={this.selectOnChange}
                                // onFocus={onFocus}
                                // onBlur={onBlur}
                                //onSearch={onSearch}
                                filterOption={(input, option) =>
                                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                <Option value="1" key="1">哈尔滨1号线</Option>
                                {/* <Option value="2" key="2">哈尔滨2号线</Option> */}
                            </Select>
                            )}
                        
                        </Form.Item>
                        </Col>
                        </Row>}
                        <Row type="flex">
                            <Col span={12}>
                                <Form.Item label="车辆" {...formItemLayout}>
                                {getFieldDecorator('orgName', {
                                rules: [{required: true,message: '请输入车辆'}],
                                getValueFromEvent: (event) => {
                                    return (event.target.value.length < 2)?event.target.value.replace(/[^1-9]/g,''):event.target.value.replace(/\D/g,'')
                                },
                                })(
                                <Input placeholder="请输入" disabled={isAdd ? false : this.state.disabled}/>
                                )}
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="供电" {...formItemLayout}>
                                {getFieldDecorator('orgName', {
                                rules: [{required: true,message: '请输入供电'}],
                                getValueFromEvent: (event) => {
                                    return (event.target.value.length < 2)?event.target.value.replace(/[^1-9]/g,''):event.target.value.replace(/\D/g,'')
                                },
                                })(
                                <Input placeholder="请输入" disabled={isAdd ? false : this.state.disabled}/>
                                )}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row type="flex">
                            <Col span={12}>
                                <Form.Item label="信号" {...formItemLayout}>
                                {getFieldDecorator('orgName', {
                                rules: [{required: true,message: '请输入信号'}],
                                getValueFromEvent: (event) => {
                                    return (event.target.value.length < 2)?event.target.value.replace(/[^1-9]/g,''):event.target.value.replace(/\D/g,'')
                                },
                                })(
                                <Input placeholder="请输入" disabled={isAdd ? false : this.state.disabled}/>
                                )}
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="通信" {...formItemLayout}>
                                {getFieldDecorator('orgName', {
                                rules: [{required: true,message: '请输入通信'}],
                                getValueFromEvent: (event) => {
                                    return (event.target.value.length < 2)?event.target.value.replace(/[^1-9]/g,''):event.target.value.replace(/\D/g,'')
                                },
                                })(
                                <Input placeholder="请输入" disabled={isAdd ? false : this.state.disabled}/>
                                )}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row type="flex">
                            <Col span={12}>
                                <Form.Item label="工建" {...formItemLayout}>
                                {getFieldDecorator('orgName', {
                                rules: [{required: true,message: '请输入工建'}],
                                getValueFromEvent: (event) => {
                                    return (event.target.value.length < 2)?event.target.value.replace(/[^1-9]/g,''):event.target.value.replace(/\D/g,'')
                                },
                                })(
                                <Input placeholder="请输入" disabled={isAdd ? false : this.state.disabled}/>
                                )}
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="机电" {...formItemLayout}>
                                {getFieldDecorator('orgName', {
                                rules: [{required: true,message: '请输入机电'}],
                                getValueFromEvent: (event) => {
                                    return (event.target.value.length < 2)?event.target.value.replace(/[^1-9]/g,''):event.target.value.replace(/\D/g,'')
                                },
                                })(
                                <Input placeholder="请输入" disabled={isAdd ? false : this.state.disabled}/>
                                )}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row type="flex">
                            <Col span={12}>
                                <Form.Item label="AFC" {...formItemLayout}>
                                {getFieldDecorator('orgName', {
                                rules: [{required: true,message: '请输入AFC'}],
                                getValueFromEvent: (event) => {
                                    return (event.target.value.length < 2)?event.target.value.replace(/[^1-9]/g,''):event.target.value.replace(/\D/g,'')
                                },
                                })(
                                <Input placeholder="请输入" disabled={isAdd ? false : this.state.disabled}/>
                                )}
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="其他" {...formItemLayout}>
                                {getFieldDecorator('orgName', {
                                rules: [],
                                })(
                                <Input placeholder="请输入" disabled={isAdd ? false : this.state.disabled}/>
                                )}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row type="flex">
                            <Col span={24}>
                                <Form.Item label="新增问题" {...formItemLayout1}>
                                {getFieldDecorator('orgName', {
                                rules: [],
                                })(
                                <TextArea placeholder="请输入" disabled={isAdd ? false : this.state.disabled}/>
                                )}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row type="flex">
                            <Col span={24}>
                                <Form.Item label="遗留问题" {...formItemLayout1}>
                                {getFieldDecorator('orgName', {
                                rules: [],
                                })(
                                <TextArea placeholder="请输入" disabled={isAdd ? false : this.state.disabled}/>
                                )}
                                </Form.Item>
                            </Col>
                        </Row>
                        </div>
                    </Form>

                </Modal>
            </div>
        )
    }
}
const AddModals = Form.create()(AddModal);
export default connect(state => ({
    currentLocale: state.localeProviderData,
}))(AddModals);