import React, { Component } from 'react';
import { Modal, Form, Row, Col, Input,InputNumber, Button, Icon, Select, Divider, DatePicker, Descriptions, TreeSelect } from 'antd';
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
import { getBaseData } from '@/modules/Suzhou/components/Util/util';

export class AddModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            disabled:true,
            changeButtonShow:true,  //调整按钮
        }
    }
    componentDidMount() {
        console.log(this.props)
     getBaseData('line').then(data => { 
        if(data && data.length){
            this.setState({
                lineList:data
            })
        }
     })
    }
    //选择日期
    handleDate = () => { }

    handleSubmitSign = () => { console.log(this.state.submitData) }
    handleCancelClose = () => {
        this.setState({ showSubmitModal: false })
    }
      //新增提交
  handleSubmit = (val) => {
    // e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, fieldsValue) => {
        
    //   values.entryTime = dataUtil.Dates().formatTimeString(values.entryTime).substr(0,10);
      if (!err) {
        const data={
          ...fieldsValue,
          recordTime: val == 'save' ? fieldsValue['recordTime'].format('YYYY-MM-DD') : fieldsValue['recordTime'],
        }
        console.log(data,this.props)
        if (val == 'save') {
            this.props.submit(data, 'save');
        }
        if (val == 'update') {
            this.props.submit(data, 'update');
        }
      }
    });
  };
  editFun = () => {
    this.setState({
        disabled: false,
        changeButtonShow: false,
    })
  }
    render() {
        const { intl } = this.props.currentLocale
        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched ,getFieldValue} = this.props.form;
        const formItemLayout0 = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 9 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 15 },
            },
        };
        const formItemLayout1 = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 18 },
            },
        };
        const formItemLayout2 = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 5 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 19 },
            },
        };
        const { isAdd, constructionDailyDetailData,canModify } = this.props;
        const { changeButtonShow } = this.state;
        return (
            <div>
                <Modal className={style.main}
                    width="600px"
                    afterClose={this.props.form.resetFields}
                    mask={false}
                    maskClosable={false}
                    footer={<div className="modalbtn">
                        {/* 取消 */}
                        <Button key={1} onClick={this.props.handleCancel}>取消</Button>
                        {/* 保存 */}
                        {isAdd && <Button key={2} onClick={this.handleSubmit.bind(this, 'save')} type="primary">保存</Button>}
                        {!isAdd && <Button key={2} onClick={this.handleSubmit.bind(this, 'update')} type="primary">更新</Button>}
                    </div>}
                    centered={true} title={!isAdd ? '查看' : '新增'} visible={this.props.modalVisible}
                    onCancel={this.props.handleCancel}>
                
                    <Form>
                    <div>
                        <Row type="flex">
                        <Col span={9}>
                        <Form.Item label="日期" {...formItemLayout0}>
                            {getFieldDecorator('recordTime', {
                            initialValue:this.props.isAdd ? '' : (moment(this.props.record && this.props.record.recordTime) || ''),
                            rules: [{required: true,message: '请选择日期'}],
                            })(
                                <DatePicker format='YYYY-MM-DD' disabled={isAdd ? false: true}/>
                            )}
                        
                        </Form.Item>
                        </Col>
                        <Col span={9}>
                        <Form.Item label="线路" {...formItemLayout0}>
                            {getFieldDecorator('line', {
                            initialValue:this.props.isAdd ? '' : (this.props.record && this.props.record.line || ''),
                            rules: [{required: true,message: '请选择线路'}],
                            })(
                                <Select
                                disabled={isAdd ? false: true}
                                showSearch
                                // mode='multiple'
                                allowClear={true}
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
                            {this.state.lineList && this.state.lineList.map(item => {
                                            return (
                                                <Option value={item.value} key={item.value}>{item.title}</Option>
                                            )
                                        })
                                        }
                            </Select>
                            )}
                        </Form.Item>
                        </Col>
                        </Row>
                        <Row type="flex">
                            <Col span={18}>
                                <Form.Item label="模块标题" {...formItemLayout1}>
                                {getFieldDecorator('moudleTitle', {
                                initialValue:this.props.isAdd ? '其他情况说明' : (this.props.record && this.props.record.moudleTitle || ''),
                                rules: [{required: true,message: '请输入模块标题'}],
                                })(
                                    <Input  />
                                // <InputNumber min={0} precision={0} placeholder="请输入" disabled={isAdd ? false : this.state.disabled} style={{width:'243px'}}/>
                                )}
                                </Form.Item>
                            </Col>
                        </Row>
   
                        <Row type="flex">
                            <Col span={22}>
                                <Form.Item label="情况说明" {...formItemLayout2}>
                                {getFieldDecorator('description', {
                                initialValue:this.props.isAdd ? '' : (this.props.record && this.props.record.description || ''),
                                rules: [{required: true,message: '请输入情况说明'}],
                                })(
                                    <TextArea placeholder="请输入" style={{height:'360px'}} />
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