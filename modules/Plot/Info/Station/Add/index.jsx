import React, { Component } from 'react'
import style from './style.less'
import { Form, Row, Col, Input, Button, Modal, Select, notification } from 'antd';
import { connect } from 'react-redux'
import axios from '../../../../../api/axios'
import { getSectionDetailsBySectionId, addStation, updateStation, getdictTree } from '../../../../../api/api'

const { TextArea } = Input;
class StationAdd extends Component {
    constructor(props) {
        super(props)
        this.state = {
            initDone: false,
            visible: false,
            info: {},
            stationTypeList: [],
            stationType: { value: "1", title: "站点" }//默认站点
        }
    }

    getData = (id) => {
        axios.get(getSectionDetailsBySectionId(id)).then(res => {
            this.setState({
                info: res.data.data,
                stationType: { value: res.data.data.stationType.id, title: res.data.data.stationType.name }
            })
        })
    }

    componentDidMount() {

        if (this.props.addstation) {
            this.setState({
                visible: this.props.addstation
            })
        } else if (this.props.modifystation) {
            console.log(this.props.selectedRowKeys)
            this.getData(this.props.selectedRowKeys[0])
            this.setState({
                visible: this.props.modifystation
            })
        }

    }

    //获取站点类型
    getStationTypeList = () => {
        axios.get(getdictTree("proj.station.type")).then(res => {
            if (res.data.data) {
                this.setState({ stationTypeList: res.data.data })
            }
        })
    }

    handleSubmit = (val, e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                if (this.props.opttype == 'add') {
                    let data1 = {
                        ...values,
                        projectId: this.props.projectId,
                    }
                    axios.post(addStation, data1, true).then(res => {

                        this.props.addStationMethod(res.data.data)
                        if (val == 'save') {
                            this.props.handleCancel();
                        } else if (val == 'goOn') {
                            this.props.form.resetFields();
                        }
                    })
                } else if (this.props.opttype == 'modify') {
                    let data2 = {
                        ...values,
                        id: this.props.record.id,
                        projectId: this.props.projectId,
                    }
                    axios.put(updateStation, data2, true).then(res => {
                        this.props.updateStationMethod(res.data.data)
                        if (val == 'save') {
                            this.props.handleCancel();
                        } else if (val == 'goOn') {
                            this.props.form.resetFields();
                        }
                    })
                }
            }

        });
    }
    showModal = () => {
        this.setState({
            visible: true,
        });
    }
    handleOk = (e) => {
        this.setState({
            visible: false,
        });
        this.props.handleCancel()
    }

    render() {
        const { intl } = this.props.currentLocale
        const {
            getFieldDecorator,
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
            <div className={style.main}>
                <div>
                    <Modal title={this.props.title} visible={this.state.visible}
                        onOk={this.handleOk} onCancel={this.props.handleCancel}
                        mask={false}
                        maskClosable={false}
                        width="800px"
                        footer={
                            <div className="modalbtn">
                                {this.props.opttype === 'modify' ?
                                    <Button key={3} onClick={this.props.handleCancel}>取消</Button>
                                    :
                                    <Button key={3} onClick={this.handleSubmit.bind(this, 'goOn')} >保存并继续</Button>
                                }
                                <Button key={2} onClick={this.handleSubmit.bind(this, 'save')} type="primary" >保存</Button>
                            </div>
                        }
                    >
                        <Form onSubmit={this.handleSubmit}>
                            <div className={style.content}>
                                <Row type="flex">
                                    <Col span={12}>
                                        <Form.Item label={intl.get("wsd.i18n.pre.station.name")} {...formItemLayout}>
                                            {/* 站点名称 */}
                                            {getFieldDecorator('name', {
                                                initialValue: this.state.info.name,
                                                rules: [{
                                                    required: true,
                                                    message: intl.get('wsd.i18n.pre.station.name') + intl.get("wsd.i18n.pre.station.name"),
                                                }],
                                            })(
                                                <Input />
                                            )}
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label={intl.get("wsd.i18n.pre.station.code")} {...formItemLayout}>
                                            {/* 编号 */}
                                            {getFieldDecorator('code', {
                                                initialValue: this.state.info.code,
                                                rules: [{
                                                    required: true,
                                                    message: intl.get('wsd.i18n.pre.station.code') + intl.get("wsd.i18n.pre.station.code"),
                                                }],
                                            })(
                                                <Input />
                                            )}
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row >
                                    <Col span={12}>
                                        <Form.Item label={intl.get("wsd.i18n.pre.station.type")} {...formItemLayout}>
                                            {/* 类型 */}
                                            {getFieldDecorator('stationType', {
                                                initialValue: this.state.info.stationType ? this.state.info.stationType.id : "1",
                                                rules: [{
                                                    required: true,
                                                    message: intl.get('wsd.i18n.pre.station.type') + intl.get("wsd.i18n.pre.station.type"),
                                                }],
                                            })(
                                                <Select onDropdownVisibleChange={this.getStationTypeList}>
                                                    {this.state.stationTypeList.length > 0 ? this.state.stationTypeList.map(item => {
                                                        return <Option value={item.value} key={item.value}>{item.title}</Option>
                                                    }) : this.state.stationType &&
                                                        <Option value={this.state.stationType.value} key={this.state.stationType.value}>{this.state.stationType.title}</Option>
                                                    }
                                                </Select>
                                            )}
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={24}>
                                        <Form.Item label={intl.get('wsd.i18n.pre.station.remark')} {...formItemLayout1}>
                                            {getFieldDecorator('remark', {
                                                initialValue: this.state.info.remark,
                                                rules: [],
                                            })(
                                                <TextArea rows={2} />
                                            )}
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </div>
                        </Form>
                    </Modal>
                </div>
            </div>
        )
    }
}
const LinkModals = Form.create()(StationAdd);
export default connect(state => ({
    currentLocale: state.localeProviderData
}))(LinkModals)
