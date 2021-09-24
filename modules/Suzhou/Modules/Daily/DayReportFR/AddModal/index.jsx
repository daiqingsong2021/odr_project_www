import React, { Component } from 'react';
import { Modal, Form, Row, Col, Input, Button, Icon, Select, Radio, Checkbox, DatePicker, Descriptions, TreeSelect } from 'antd';
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
import { getBaseData } from '@/modules/Suzhou/components/Util/util';

export class AddModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            disabled: true,
            dayReportType: 1
        }
    }
    componentDidMount() {
        getBaseData('line').then(data => {
            if (data && data.length) {
                this.setState({
                    lineList: data
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
    handleSubmit = (val, e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, fieldsValue) => {

            if (!err) {
                const data = {
                    ...fieldsValue,
                    reportDay: val == 'save' ? fieldsValue['reportDay'].format('YYYY-MM-DD') : fieldsValue['reportDay'],
                }
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
            disabled: false
        })
    }
    changeDayReportType = (e) => {
        // console.log(e);
        this.setState({
            dayReportType: e.target.value
        })
    }
    getCurrentData = () => {
        // return new Date().toLocaleDateString();
        let today = {};
        let _today = moment();
        today.yesterday = _today.subtract(1, 'days').format('YYYY-MM-DD'); /*前一天的时间*/
        let formatDate = moment(today.yesterday).format('YYYY-MM-DD'); /*格式化时间*/
        return formatDate
    }
    //当天之后的日期不可选
    disabledDate = (current) => {
        return current && current > moment().endOf('day')

    }
    render() {
        const { intl } = this.props.currentLocale
        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
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
        const { isAdd, constructionDailyDetailData } = this.props;
        const { dayReportType, lineList } = this.state;
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
                        {isAdd && <Button key={2} onClick={this.handleSubmit.bind(this, 'save')} type="primary">生成</Button>}
                    </div>}
                    centered={true} title={!isAdd ? '查看' : '新增'} visible={this.props.modalVisible}
                    onCancel={this.props.handleCancel}>
                    <Form>
                        <div>
                           
                            <Row type="flex">
                                <Col span={24}>
                                    <Form.Item label="线路选择" {...formItemLayout}>
                                        {getFieldDecorator('line', {
                                            initialValue: '1',
                                            rules: [{ required: true, message: '请选择线路' }],
                                        })(
                                            <Radio.Group>
                                                {lineList && lineList.map(item => {
                                                    return (
                                                        <Radio key={item.value} value={item.value}>{item.title}</Radio>
                                                    )
                                                })}
                                            </Radio.Group>
                                        )}
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row type="flex">
                                <Col span={24}>
                                    <Form.Item label="日期" {...formItemLayout}>
                                        {getFieldDecorator('reportDay', {
                                            initialValue: moment(this.getCurrentData(), 'YYYY-MM-DD'),
                                            rules: [{ required: true, message: '请选择日期' }],
                                        })(
                                            <DatePicker format='YYYY-MM-DD' style={{ width: 200 }}
                                                disabledDate={this.disabledDate}
                                            />
                                        )}
                                    </Form.Item>
                                </Col>
                            </Row>
                            
                            <Row type="flex">
                                <Col span={24}>
                                    <Form.Item label="备注信息" {...formItemLayout}>
                                        {getFieldDecorator('description', {
                                            initialValue: '',
                                            rules: [],
                                        })(
                                            <TextArea placeholder="请输入" maxLength={255} style={{ width: 360 }} />
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