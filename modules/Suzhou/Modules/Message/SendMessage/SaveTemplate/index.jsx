import React, { Component } from 'react';
import { Modal, Form, Row, Col, Input, Button, Icon, Select, DatePicker, Slider, InputNumber, message, Checkbox, TreeSelect, Divider, Table, AutoComplete } from 'antd';
import style from './style.less';
import intl from 'react-intl-universal';
import { connect } from 'react-redux';
import { curdCurrentData } from '@/store/curdData/action';
import axios from '@/api/axios';
import * as dataUtil from "@/utils/dataUtil"
import SelectSection from '@/modules/Suzhou/components/SelectSection';
import { permissionFun, setRightShow, queryParams } from "@/modules/Suzhou/components/Util/util.js";
import notificationFun from '@/utils/notificationTip';
import { forEach } from 'lodash';
const { TextArea, Search } = Input;
const Option = Select.Option;

class ContractAdd extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modalInfo: {
                title: '设为模板',
            },
            isShowModal: false,//显示新增和修改           
        }
    }
    componentDidMount() {

    }

    handleSubmit = (val) => {
        const { rightData } = this.state
        this.props.form.validateFieldsAndScroll((err, fieldsValue) => {
            if (!err) {
                const data = {
                    ...fieldsValue
                }
                this.props.submitSaveTemplate(data);
            }
        })
    }

    //关闭权限弹框modal
    handleCancel = () => {
        this.setState({
            isShowModal: false,
            ImportVisible: false,
        });
    };

    render() {
        const { intl } = this.props.currentLocale;
        const { getFieldDecorator } = this.props.form;
        const { selectData, detailList, aar, rightData, data, treeData } = this.state;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 10 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 14 },
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
                        <Button key={2} onClick={this.handleSubmit.bind(this)} type="primary">{intl.get('wsd.global.btn.preservation')}</Button>
                    </div>}
                    centered={true} title={this.state.modalInfo.title} visible={this.props.modalVisible}
                    onCancel={this.props.handleCancel}>
                    <Form onSubmit={this.handleSubmit} className={style.mainScorll}>
                        <div className={style.content}>
                            <Row type="flex">
                                <Col span={24}>
                                    <Form.Item label={'模板名称'} {...formItemLayout1}>{
                                        getFieldDecorator('templateTitle', {
                                            rules: [{ required: true, message: '请输入模板名称' }],
                                            initialValue: '',
                                        })(
                                            <Input maxLength={20} style={{width:'100%'}}/>
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
const ContractAdds = Form.create()(ContractAdd);
export default connect(state => ({
    currentLocale: state.localeProviderData,
}))(ContractAdds);