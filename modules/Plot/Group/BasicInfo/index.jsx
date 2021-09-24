import React, { Component } from 'react'
import { Form, Row, Col, Input, Button, Select, DatePicker, TreeSelect } from 'antd';
import * as dateUtil from '../../../../utils/dataUtil'
import { connect } from 'react-redux'
import { curdCurrentData } from '../../../../store/curdData/action'
import axios from '../../../../api/axios'
import { epsInfo, orgPer, orgTree, epsAlter, getdictTree } from '../../../../api/api'
import LabelFormLayout from "../../../../components/public/Layout/Labels/Form/LabelFormLayout"
import LabelFormButton from "../../../../components/public/Layout/Labels/Form/LabelFormButton"

const Option = Select.Option;
const { TextArea } = Input;
class MenuInfo extends Component {
    constructor(props) {
        super(props)
        this.state = {
            info: {},
            orgTree: [],
            orgPer: [],
            orgPerKey: '',

        }
    }

    getDataList = () => {
        axios.get(epsInfo(this.props.data.id)).then(res => {
            this.setState({
                info: res.data.data,
                orgPerKey: res.data.data.user ? res.data.data.user.id : ''
            }, () => {
                axios.get(orgPer(res.data.data.org.id)).then(res => {
                    this.setState({ orgPer: res.data.data })
                })
                const { info } = this.state
                this.setState({
                    secutyLevelList1: info.secutyLevel ? [info.secutyLevel] : null
                })
            })
        })

        //获取责任主体下拉列表
        axios.get(orgTree).then(res => {
            this.setState({ orgTree: res.data.data })
        })
    }

    componentDidMount() {
        this.getDataList();
        this.setState({
            width: this.props.width,
        })

    }
    //获取密级
    getSecutyLevelList = () => {
        if (!this.state.secutyLevelList) {
            axios.get(getdictTree("comm.secutylevel")).then(res => {
                if (res.data.data) {
                    this.setState({
                        secutyLevelList: res.data.data,
                        secutyLevelList1: null
                    })
                }
            })
        }

    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                let data = {
                    ...values,
                    id: this.state.info.id,
                    creatTime: values['creatTime'] ? values['creatTime'].format('YYYY-MM-DD') : ''
                }
                axios.put(epsAlter, data, true).then(res => {
                    this.props.updata(res.data.data)
                })
            }
        });
    }

    change = (v) => {
        this.setState({
            orgPerKey: ''
        })

        axios.get(orgPer(v)).then(res => {
            this.setState({ orgPer: res.data.data })
            this.props.form.resetFields(`userId`, []);
        })
    }

    render() {
        const { intl } = this.props.currentLocale
        const {
            getFieldDecorator
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

          <LabelFormLayout title = {this.props.title} >
            <Form onSubmit={this.handleSubmit}>
              <Row type="flex">
                <Col span={12}>
                  <Form.Item label={intl.get('wsd.i18n.pre.epsInfo.projectname')} {...formItemLayout}>
                    {getFieldDecorator('name', {
                      initialValue: this.state.info.name,
                      rules: [{
                        required: true,
                        message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.pre.epsInfo.projectname'),
                      }],
                    })(
                      <Input maxLength={85}/>
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={intl.get('wsd.i18n.pre.epsInfo.projectcode')} {...formItemLayout}>
                    {getFieldDecorator('code', {
                      initialValue: this.state.info.code,
                      rules: [{
                        required: true,
                        message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.pre.epsInfo.projectcode'),
                      }],
                    })(
                      <Input maxLength={33}/>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row >
                <Col span={12}>
                  <Form.Item label={intl.get('wsd.i18n.pre.epsInfo.iptname')} {...formItemLayout}>
                    {getFieldDecorator('orgId', {
                      initialValue: this.state.info.org ? this.state.info.org.id : '',
                      rules: [{
                        required: true,
                        message: intl.get('wsd.i18n.message.select') + intl.get('wsd.i18n.pre.epsInfo.iptname'),
                      }],
                    })(
                      <TreeSelect
                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                        treeData={this.state.orgTree}
                        treeDefaultExpandAll
                        onChange={this.change}
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={intl.get('wsd.i18n.base.planTemAddTask.username')} {...formItemLayout}>
                    {getFieldDecorator('userId', {
                      initialValue: this.state.orgPerKey,
                      rules: [],
                    })(
                      <Select allowClear
                              showSearch
                              optionFilterProp="children"
                              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                      >
                        {this.state.orgPer.length ?
                          this.state.orgPer.map((val) => {
                            return (
                              <Option key={val.id} value={val.id}>{val.title}</Option>
                            )
                          }) : (
                            this.state.info.user ? (
                              <Option key={this.state.info.user.id} value={this.state.info.user.id}>{this.state.info.user.title}</Option>
                            ) : null
                          )
                        }
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              </Row>

              {/* <Row>
                <Col span={12}>
                  <Form.Item label="密级" {...formItemLayout}>
                    {getFieldDecorator('secutyLevel', {
                      initialValue: this.state.info.secutyLevel ? this.state.info.secutyLevel.id : null,
                      rules: [{
                        required: true,
                        message: intl.get('wsd.i18n.message.select') + "密级",
                      }],
                    })(
                      <Select onDropdownVisibleChange={this.getSecutyLevelList}>
                        {this.state.secutyLevelList1 ? this.state.secutyLevelList1.map(item => {
                          return <Option value={item.id} key={item.id}>{item.name}</Option>
                        }) : this.state.secutyLevelList && this.state.secutyLevelList.map(item => {
                          return <Option value={item.value} key={item.value}>{item.title}</Option>
                        })}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              </Row> */}
              <Row >
                <Col span={24}>
                  <Form.Item label={intl.get('wsd.i18n.pre.epsInfo.remark')} {...formItemLayout1}>
                    {getFieldDecorator('remark', {
                      initialValue: this.state.info.remark,
                      rules: [],
                    })(
                      <TextArea maxLength={333} rows={2} />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row >

                <Col span={12}>
                  <Form.Item label={intl.get('wsd.i18n.pre.epsInfo.creator')} {...formItemLayout}>
                    {getFieldDecorator('creator', {
                      initialValue: this.state.info.creator ? (this.state.info.creator.name ? this.state.info.creator.name : '') : '',
                      rules: [],
                    })(
                      <Input disabled />
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={intl.get('wsd.i18n.pre.epsInfo.creattime')} {...formItemLayout}>
                    {getFieldDecorator('creatTime', {

                      initialValue:  dateUtil.Dates().formatDateMonent(this.state.info.creatTime),
                      rules: [],
                    })(
                      <DatePicker style={{ width: "100%" }} disabled />
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </Form>
            <LabelFormButton>
              <Button onClick={this.handleSubmit} style={{ width: "100px" }} type="primary">保存</Button>
              <Button onClick={this.props.closeRightBox} style={{ width: "100px", marginLeft: "20px" }}>取消</Button>
            </LabelFormButton>
          </LabelFormLayout>
        )
    }
}
const MenuInfos = Form.create()(MenuInfo);
export default connect(state => ({
    currentLocale: state.localeProviderData
}), {
        curdCurrentData
    })(MenuInfos);
