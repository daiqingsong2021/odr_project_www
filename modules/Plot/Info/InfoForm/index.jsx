import React, { Component } from 'react'
import style from './style.less'
import { Form, Row, Col, Input, Button, Icon, Select, DatePicker, TreeSelect, InputNumber } from 'antd';

import { connect } from 'react-redux'

import moment from 'moment'
import * as dataUtil from '../../../../utils/dataUtil'
import axios from "../../../../api/axios"
import MapModal from '../MapModal'
import {
  getproInfo,
  orgTree,
  getUserByOrgId,
  updateproInfo,
  getdictTree,
  calendarList,
  caculateWorkHour,
  getvariable,
} from '../../../../api/api';
import LabelFormLayout from "../../../../components/public/Layout/Labels/Form/LabelFormLayout"
import LabelFormButton from "../../../../components/public/Layout/Labels/Form/LabelFormButton"

const Option = Select.Option;
const { TextArea } = Input;

class MenuInfo extends Component {
  constructor(props) {
    super(props)
    this.state = {
      projSet: { dateFormat: 'YYYY-MM-DD', drtnUnit: 'h', timeUnit: 'h', precision: 2, moneyUnit: '¥' },
      _workTime: {},
      runnDone: true, //是否计算完成
      orglist: [],
      info: {},
    }
  }

  //开始计算
  startCaculate = () => {
    this.setState({ runnDone: false }) //标识计算开始
  }

  //计划日期工期计算(开始(修改)+工期=完成，完成(修改)-开始=工期，工期(修改)+开始=完成）
  caculateStartOrEndOrDrtn = (opeType, calendarId) => {
    let param = {
      calendarId: calendarId || this.props.form.getFieldValue("calendarId"),
      startTime: dataUtil.Dates().formatTimeString(this.props.form.getFieldValue("planStartTime")),
      endTime: dataUtil.Dates().formatTimeString(this.props.form.getFieldValue("planEndTime")),
      drtn: dataUtil.WorkTimes().toHour(this.props.form.getFieldValue("totalDrtn"), this.state.projSet.drtnUnit, this.state._workTime.calendar),
      opeType: opeType
    }
    if (param.calendarId && (param.startTime || param.endTime)) {
      axios.post(caculateWorkHour, param).then(res => {
        const data = res.data.data || {};
        const workTime = { calendar: data.calendar, planStartTime: data.startTime, planEndTime: data.endTime, totalDrtn: data.drtn };
        this.props.form.setFieldsValue({ ["planStartTime"]: dataUtil.Dates().formatTimeMonent(workTime.planStartTime) });
        this.props.form.setFieldsValue({ ["planEndTime"]: dataUtil.Dates().formatTimeMonent(workTime.planEndTime) });
        this.props.form.setFieldsValue({ ["totalDrtn"]: dataUtil.WorkTimes().hourTo(workTime.totalDrtn, this.state.projSet.drtnUnit, workTime.calendar) });
        this.setState({ _workTime: workTime, runnDone: true }) //标识计算完成
      })
    }
  }

  //开始(修改)+工期=完成
  caculateByStartTime = (status) => {
    if (status) {
      return; //只有关闭时才调用
    }
    const dateStart = dataUtil.Dates().formatTimeString(this.props.form.getFieldValue("planStartTime"));
    if (dateStart && this.state._workTime.planStartTime != dateStart) {
      this.caculateStartOrEndOrDrtn("StartTime");
    }
  }

  //完成(修改)-开始=工期
  caculateByEndTime = (status) => {
    if (status) {
      return; //只有关闭时才调用
    }
    const dateEnd = dataUtil.Dates().formatTimeString(this.props.form.getFieldValue("planEndTime"));
    if (dateEnd && this.state._workTime.planEndTime != dateEnd) {
      this.caculateStartOrEndOrDrtn("EndTime");
    }
  }

  //工期(修改)+开始=完成
  caculateByPlanDrtn = (value) => {
    const totalDrtn = dataUtil.WorkTimes().toHour(this.props.form.getFieldValue("totalDrtn"), this.state.projSet.drtnUnit, this.state._workTime.calendar);
    if (totalDrtn > 0 && this.state._workTime.totalDrtn != totalDrtn) {
      this.caculateStartOrEndOrDrtn("Drtn");
    }
  }

  //日历(修改)=完成-开始=工期
  caculateByCalendar = (value, option) => {
    this.startCaculate()
    this.caculateStartOrEndOrDrtn("calendarId", value);
  }

  //获取状态
  getStatus = () => {
    if (this.state.statusList) {
      axios.get(getdictTree("plan.project.status")).then(res => {
        if (res.data.data) {
          this.setState({
            statusList: res.data.data
          })
        }
      })
    }
  }

  //获取责任人主体、
  getOrgAndUser = () => {
    axios.get(orgTree).then(res => {
      if (res.data.data) {
        this.setState({
          orglist: res.data.data
        }, () => {
          this.getUser(this.state.info.org.id)
        })
      }
    })
  }

  //责任人
  getUser = (id) => {
    axios.get(getUserByOrgId(id)).then(res => {
      this.setState({
        userlist: res.data.data
      })
    })
  }

  //获取列表
  intilData = () => {
    axios.get(getvariable(this.props.data.id)).then(res => {
      const set = res.data.data || {};
      const projSet = {
        dateFormat: (set.dateFormat || {}).id || "YYYY-MM-DD",
        drtnUnit: (set.drtnUnit || {}).id || "h",
        timeUnit: (set.timeUnit || {}).id || "h",
        precision: set.precision || 2,
        moneyUnit: (set.currency || {}).symbol || "¥",
      }
      axios.get(getproInfo(this.props.data.id)).then(res => {
        const { data } = res.data
        const totalDrtn = dataUtil.WorkTimes().hourTo(data.totalDrtn, projSet.drtnUnit, data.calendar);
        this.setState({
          projSet, _workTime: { ...data }, info: { ...data, totalDrtn: totalDrtn },
        }, () => {
          this.getOrgAndUser()
        })
      })
    })
  }

  componentDidMount() {
    this.intilData();
    // this.getStatus()
  }


  //选择责任主体联动责任人
  onTreeChange = (v) => {
    this.getUser(v)
    this.props.form.setFieldsValue({ ["userId"]: null });
  }

  //获取日历列表
  getCalendarList = () => {
    if (!this.state.calendarList) {
      axios.get(calendarList).then(res => {
        if (res.data.data) {
          this.setState({
            calendarList: res.data.data
          })
        }
      })
    }
  }

  //获取密级
  getSecutyLevelList = () => {
    if (!this.state.secutyLevelList) {
      axios.get(getdictTree("comm.secutylevel")).then(res => {
        if (res.data.data) {
          this.setState({
            secutyLevelList: res.data.data,
          })
        }
      })
    }
  }

  handleSubmit = (e) => {
    const that = this
    if (this.state.runnDone) {
      e.preventDefault();
      this.props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          let data = {
            ...values,
            id: this.props.data.id,
            parentId: this.state.info.parent.id,
            planStartTime: dataUtil.Dates().formatTimeString(values.planStartTime),
            planEndTime: dataUtil.Dates().formatTimeString(values.planEndTime),
            totalDrtn: this.state._workTime.totalDrtn,
          }
          axios.put(updateproInfo, data, true, null, true).then(res => {
            this.props.updateSuccess(res.data.data)
          })
        }
      })
    } else {
      setTimeout(function () {
        that.handleSubmit(e)
      }, 100)
    }
  }

  openMapModal = () => {
    this.setState({
      isMapModal: true
    })
  }
  MapModalCancel = () => {
    this.setState({
      isMapModal: false
    })
  }

  refreshState = (data) => {
    this.setState({
      ...data
    })

    this.setState({
      isMapModal: false
    })
  }



  render() {
    const { intl } = this.props.currentLocale
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

      <LabelFormLayout title={this.props.title} >
        <Form onSubmit={this.handleSubmit}>
          <Row type="flex">
            <Col span={12}>
              <Form.Item label={intl.get('wsd.i18n.pre.project.projectname')} {...formItemLayout}>
                {getFieldDecorator('name', {
                  initialValue: this.state.info.name,
                  rules: [{
                    required: true,
                    message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.pre.project.projectname'),
                  }],
                })(
                  <Input maxLength={82} />
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={intl.get('wsd.i18n.pre.project1.projectcode')} {...formItemLayout}>
                {getFieldDecorator('code', {
                  initialValue: this.state.info.code,
                  rules: [{
                    required: true,
                    message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.pre.project1.projectcode'),
                  }],
                })(
                  <Input maxLength={33} />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item label={intl.get('wsd.i18n.pre.project.iptname')} {...formItemLayout}>
                {getFieldDecorator('orgId', {
                  initialValue: this.state.info.org ? this.state.info.org.id : null,
                  rules: [{
                    required: true,
                    message: intl.get('wsd.i18n.message.select') + intl.get('wsd.i18n.pre.project.iptname'),
                  }],
                })(
                  <TreeSelect
                    showSearch
                    style={{ width: "100%" }}
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    treeData={this.state.orglist.length ? this.state.orglist : (this.state.info.org && [{ value: this.state.info.org.id, title: this.state.info.org.name }])}
                    treeDefaultExpandAll
                    onChange={this.onTreeChange}
                  />
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={intl.get('wsd.i18n.pre.project.username')} {...formItemLayout}>
                {getFieldDecorator('userId', {
                  initialValue: this.state.info.user ? this.state.info.user.id : null,
                  rules: [{
                    required: true,
                    message: intl.get('wsd.i18n.message.select') + intl.get('wsd.i18n.pre.project1.username'),
                  }],
                })(
                  <Select allowClear
                    showSearch
                    ref={this.textInput}>
                    {this.state.userlist ? this.state.userlist.map(item => {
                      return (
                        <Option key={item.id} value={item.id}> {item.title} </Option>
                      )
                    }) : this.state.info.user &&
                      <Option key={this.state.info.user.id} value={this.state.info.user.id}> {this.state.info.user.name} </Option>
                    }
                  </Select>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item label={intl.get('wsd.i18n.pre.project1.starttime')} {...formItemLayout}>
                {getFieldDecorator('planStartTime', {
                  initialValue: dataUtil.Dates().formatTimeMonent(this.state.info.planStartTime),
                  rules: [{
                    required: true,
                    message: intl.get('wsd.i18n.message.select') + intl.get('wsd.i18n.pre.project1.starttime'),
                  }],
                })(
                  <DatePicker style={{ width: "100%" }} format={this.state.projSet.dateFormat}
                    showTime={{ format: 'HH:mm', defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                    disabledDate={(current) => dataUtil.Dates().disabledMaxDate(current, this.props.form.getFieldValue("planEndTime"))}
                    disabledTime={(current) => dataUtil.Dates().disabledMaxDateTime(current, this.props.form.getFieldValue("planEndTime"))}
                    onChange={this.startCaculate}
                    onOpenChange={this.caculateByStartTime}
                  />
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={intl.get("wsd.i18n.pre.project1.endtime")} {...formItemLayout}>
                {getFieldDecorator('planEndTime', {
                  initialValue: dataUtil.Dates().formatTimeMonent(this.state.info.planEndTime),
                  rules: [{
                    required: true,
                    message: intl.get('wsd.i18n.message.select') + intl.get('wsd.i18n.pre.project1.endtime'),
                  }],
                })(
                  <DatePicker style={{ width: "100%" }} format={this.state.projSet.dateFormat}
                    showTime={{ format: 'HH:mm', defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                    disabledDate={(current) => dataUtil.Dates().disabledMinDate(current, this.props.form.getFieldValue("planStartTime"))}
                    disabledTime={(current) => dataUtil.Dates().disabledMinDateTime(current, this.props.form.getFieldValue("planStartTime"))}
                    onChange={this.startCaculate}
                    onOpenChange={this.caculateByEndTime}
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item label="日历" {...formItemLayout}>
                {getFieldDecorator('calendarId', {
                  initialValue: this.state.info.calendar ? this.state.info.calendar.id : null,
                  rules: [{
                    required: true,
                    message: intl.get('wsd.i18n.message.select') + intl.get('wsd.i18n.pre.project.projectname'),
                  }],
                })(
                  <Select onDropdownVisibleChange={this.getCalendarList} onChange={this.caculateByCalendar}>
                    {this.state.calendarList ? this.state.calendarList.map(item => {
                      return <Option value={item.id} key={item.id}>{item.calName}</Option>
                    }) : this.state.info.calendar &&
                      <Option value={this.state.info.calendar.id} key={this.state.info.calendar.id}>{this.state.info.calendar.calName}</Option>
                    }
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={intl.get('wsd.i18n.pre.project.plandrtn')} {...formItemLayout}>
                {getFieldDecorator('totalDrtn', {
                  initialValue: this.state.info.totalDrtn || 0,
                  rules: [{
                    required: true,
                    message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.pre.project.plandrtn'),
                  }],
                })(
                  <InputNumber style={{ width: "100%" }} max={999999999999} min={0} precision={this.state.projSet.precision}
                    formatter={value => `${value}` + this.state.projSet.drtnUnit}
                    parser={value => value.replace(this.state.projSet.drtnUnit, '')}
                    onChange={this.startCaculate}
                    onBlur={this.caculateByPlanDrtn}
                  />
                )}
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col span={12}>
              <Form.Item label="项目投资额(元)" {...formItemLayout}>
                {getFieldDecorator('totalBudget', {
                  initialValue: this.state.info.totalBudget || 0,
                  rules: [],
                })(
                  <InputNumber style={{ width: "100%" }} max={999999999999} min={0} precision={2}
                    formatter={value => this.state.projSet.moneyUnit + `${value}`}
                    parser={value => value.replace(this.state.projSet.moneyUnit, '')} />
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="项目概算(元)" {...formItemLayout}>
                {getFieldDecorator('projectEstimate', {
                  initialValue: this.state.info.projectEstimate || 0,
                  rules: [],
                })(
                  <InputNumber style={{ width: "100%" }} max={999999999999} min={0} precision={2}
                    formatter={value => this.state.projSet.moneyUnit + `${value}`}
                    parser={value => value.replace(this.state.projSet.moneyUnit, '')} />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item label="项目预算(元)" {...formItemLayout}>
                {getFieldDecorator('projectBudget', {
                  initialValue: this.state.info.projectBudget || 0,
                  rules: [],
                })(
                  <InputNumber style={{ width: "100%" }} max={999999999999} min={0} precision={2}
                    formatter={value => this.state.projSet.moneyUnit + `${value}`}
                    parser={value => value.replace(this.state.projSet.moneyUnit, '')} />
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="建设规模" {...formItemLayout}>
                {getFieldDecorator('scale', {
                  initialValue: this.state.info.scale,
                  rules: [],
                })(
                  <Input maxLength={82} />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item label="项目地点" {...formItemLayout}>
                {getFieldDecorator('address', {
                  initialValue: this.state.info.address,
                  rules: [],
                })(
                  <Input maxLength={82} addonAfter={<Button type="danger" onClick={this.openMapModal.bind(this)}>地图</Button>} />
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={intl.get('wsd.i18n.pre.project.epsname')} {...formItemLayout}>
                {getFieldDecorator('parentId', {
                  initialValue: this.state.info.parent ? this.state.info.parent.name : null,
                  rules: [],
                })(
                  <Input disabled />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            {/* <Col span={12}>
              <Form.Item label="密级" {...formItemLayout}>
                {getFieldDecorator('secutyLevel', {
                  initialValue: this.state.info.secutyLevel ? this.state.info.secutyLevel.id : null,
                  rules: [{
                    required: true,
                    message: intl.get('wsd.i18n.message.select') + "密级",
                  }],
                })(
                  <Select onDropdownVisibleChange={this.getSecutyLevelList}>
                    {this.state.secutyLevelList ? this.state.secutyLevelList.map(item => {
                      return <Option value={item.value} key={item.value}>{item.title}</Option>
                    }) : this.state.info.secutyLevel &&
                      <Option value={this.state.info.secutyLevel.id} key={this.state.info.secutyLevel.id}>{this.state.info.secutyLevel.name}</Option>
                    }
                  </Select>
                )}
              </Form.Item>
            </Col> */}
            <Col span={12}>
              <Form.Item label="状态" {...formItemLayout}>
                {getFieldDecorator('status', {
                  initialValue: this.state.info.status ? this.state.info.status.id : null,
                  rules: [{
                    required: true,
                    message: intl.get('wsd.i18n.message.select') + "状态",
                  }],
                })(
                  <Select onDropdownVisibleChange={this.getStatus}>
                    {this.state.statusList ? this.state.statusList.map(item => {
                      return <Option key={item.value} value={item.value}>{item.title}</Option>
                    }) : this.state.info.status &&
                      <Option key={this.state.info.status.id} value={this.state.info.status.id}>{this.state.info.status.name}</Option>
                    }
                  </Select>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item label={intl.get('wsd.i18n.pre.project.projecttarget')} {...formItemLayout1}>
                {getFieldDecorator('projectTarget', {
                  initialValue: this.state.info.projectTarget,
                  rules: [],
                })(
                  <TextArea rows={2} maxLength={666} />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item label={intl.get('wsd.i18n.pre.project.projectpurpose')} {...formItemLayout1}>
                {getFieldDecorator('projectOverview', {
                  initialValue: this.state.info.projectOverview,
                  rules: [],
                })(
                  <TextArea rows={2} maxLength={666} />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item label="备注" {...formItemLayout1}>
                {getFieldDecorator('remark', {
                  initialValue: this.state.info.remark,
                  rules: [],
                })(
                  <TextArea rows={2} maxLength={666} />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item label={intl.get('wsd.i18n.base.planTem.creator')} {...formItemLayout}>
                {getFieldDecorator('creator', {
                  initialValue: this.state.info.creator ? this.state.info.creator.name : null,
                  rules: [],
                })(
                  <Input disabled />
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="创建日期" {...formItemLayout}>
                {getFieldDecorator('creatTime', {
                  initialValue: dataUtil.Dates().formatDateMonent(this.state.info.creatTime),
                  rules: [],
                })(
                  <DatePicker style={{ width: "100%" }} disabled />
                )}
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <LabelFormButton>
          <Button disabled={!this.props.editAuth} onClick={this.handleSubmit} style={{ width: "100px" }} type="primary">保存</Button>
          <Button onClick={this.props.closeRightBox} style={{ width: "100px", marginLeft: "20px" }}>取消</Button>
        </LabelFormButton>
        {this.state.isMapModal && <MapModal
          mapObj={this.state.mapObj}
          refreshState={this.refreshState}
          stateP={this.state}
          MapModalCancel={this.MapModalCancel}
        ></MapModal>}
      </LabelFormLayout>
    )
  }
}

const MenuInfos = Form.create()(MenuInfo);
export default connect(state => ({
  currentLocale: state.localeProviderData
}), {})(MenuInfos);
