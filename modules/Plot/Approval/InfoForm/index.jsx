import React, {Component} from 'react'
import style from './style.less'
import {Form, Row, Col, Input, Button, Icon, Select, DatePicker, TreeSelect, InputNumber} from 'antd';
import axios from '../../../../api/axios'
import {
  prepaBas,
  epsTree,
  orgTree,
  orgPer,
  planPrepa,
  getdictTree,
  calendarList,
  caculateWorkHour,
  getTimeInfo,
  defaultCurrencyInfo, defineAdd,
} from '../../../../api/api';
import * as dataUtil from '../../../../utils/dataUtil'
import LabelFormLayout from "../../../../components/public/Layout/Labels/Form/LabelFormLayout"
import LabelFormButton from "../../../../components/public/Layout/Labels/Form/LabelFormButton"
import {connect} from 'react-redux'
import moment from 'moment'

const Option = Select.Option;
const {TextArea} = Input;

class MenuInfo extends Component {
  constructor(props) {
    super(props)
    this.state = {
      baseSet: {dateFormat: 'YYYY-MM-DD', drtnUnit: 'h', timeUnit : 'h', precision : 2, moneyUnit: '¥'},
      _workTime: {},
      initDone: false,
      runnDone: true, //是否计算完成
      optId: null,
      info: {},
      epsTree: [],
      orgTree: [],
      orgPer: [],
    }
  }

  //开始计算
  startCaculate = () => {
    this.setState({runnDone: false}) //标识计算开始
  }

  //计划日期工期计算(开始(修改)+工期=完成，完成(修改)-开始=工期，工期(修改)+开始=完成）
  caculateStartOrEndOrDrtn = (opeType, calendarId) => {
    let param = {
      calendarId: calendarId || this.props.form.getFieldValue("calendarId"),
      startTime: dataUtil.Dates().formatTimeString(this.props.form.getFieldValue("planStartTime")),
      endTime: dataUtil.Dates().formatTimeString(this.props.form.getFieldValue("planEndTime")),
      drtn: dataUtil.WorkTimes().toHour(this.props.form.getFieldValue("totalDrtn"), this.state.baseSet.drtnUnit, this.state._workTime.calendar),
      opeType: opeType
    }
    if (param.calendarId && (param.startTime || param.endTime)) {
      axios.post(caculateWorkHour, param).then(res => {
        const data = res.data.data || {};
        const workTime = {calendar: data.calendar, planStartTime: data.startTime, planEndTime: data.endTime, totalDrtn: data.drtn};
        this.props.form.setFieldsValue({["planStartTime"]: dataUtil.Dates().formatTimeMonent(workTime.planStartTime)});
        this.props.form.setFieldsValue({["planEndTime"]: dataUtil.Dates().formatTimeMonent(workTime.planEndTime)});
        this.props.form.setFieldsValue({["totalDrtn"]: dataUtil.WorkTimes().hourTo(workTime.totalDrtn, this.state.baseSet.drtnUnit, workTime.calendar)});
        this.setState({_workTime: workTime, runnDone: true}) //标识计算完成
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
    const totalDrtn = dataUtil.WorkTimes().toHour(this.props.form.getFieldValue("totalDrtn"), this.state.baseSet.drtnUnit, this.state._workTime.calendar);
    if (totalDrtn > 0 && this.state._workTime.totalDrtn != totalDrtn) {
      this.caculateStartOrEndOrDrtn("Drtn");
    }
  }

  //日历(修改)=完成-开始=工期
  caculateByCalendar = (value, option) => {
    this.startCaculate()
    this.caculateStartOrEndOrDrtn("calendarId", value);
  }

  reqUrl = () => {
    axios.get(epsTree).then(res => {
      this.setState({epsTree: res.data.data});
    })
    axios.get(orgTree).then(res => {
      this.setState({orgTree: res.data.data});
    })
  }

  //获取默认配置
  getBaseSetInfo = () => {
    axios.get(getTimeInfo).then(res => {
      const data = res.data.data || {};
      axios.get(defaultCurrencyInfo).then(res1 => {
        const baseSet = {
            dateFormat: (data.dateFormat || {}).code || "YYYY-MM-DD",
            drtnUnit: (data.drtnUnit || {}).code || "h",
            timeUnit: (data.timeUnit || {}).code || "h",
            precision: data.precision || 2,
            moneyUnit: (res1.data.data || {}).currencySymbol || "¥",
        }
        this.getData(this.props.data.id, baseSet);
      })
    })
  }

  getData = (id, baseSet) => {
    axios.get(prepaBas(id), {}).then(res => {
      const data = res.data.data || {};
      const totalDrtn = dataUtil.WorkTimes().hourTo(data.totalDrtn, baseSet.drtnUnit, data.calendar);
      this.setState({optId: id, baseSet, _workTime: {...data}, info: {...data, totalDrtn: totalDrtn}}, () => {
        axios.get(orgPer(this.state.info.org.id)).then(res => {
          this.setState({orgPer: res.data.data})
        })
      })
    })
  }

  componentDidMount() {
    this.reqUrl();
    this.getCalendarList();
    this.getBaseSetInfo();
  }

  handleSubmit = (e) => {
    const that = this
    if(this.state.runnDone){
      e.preventDefault();
      this.props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          let data = {
            ...values,
            id: this.state.optId,
            planEndTime: dataUtil.Dates().formatTimeString(values.planEndTime),
            planStartTime: dataUtil.Dates().formatTimeString(values.planStartTime),
            totalDrtn: this.state._workTime.totalDrtn,
            creatTime: dataUtil.Dates().formatTimeString(values.creatTime),
          }
          let url = dataUtil.spliceUrlParams(planPrepa,{"startContent":this.props.projectName});
          axios.put(url, data, true, null, true).then(res => {
            this.props.upData(res.data.data)
          })
        }
      })
    } else {
      setTimeout(function () {
        that.handleSubmit(e)
      }, 100)
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

  orgChange = (v) => {
    axios.get(orgPer(v)).then(res => {
      this.setState({orgPer: res.data.data});
      this.props.form.setFieldsValue({["userId"]: null});
    })
  }

  render() {
    const {intl} = this.props.currentLocale;
    const {
      getFieldDecorator, getFieldsError, getFieldError, isFieldTouched,
    } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 8},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 16},
      },
    };
    const formItemLayout1 = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 4},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 20},
      },
    };
    return (

      <LabelFormLayout title = {this.props.title} >
        <Form onSubmit={this.handleSubmit}>
          <Row type="flex">
            <Col span={12}>
              <Form.Item label={intl.get('wsd.i18n.pre.project.projectname')} {...formItemLayout}>
                {/* 项目名称 */}
                {getFieldDecorator('paName', {
                  initialValue: this.state.info.paName,
                  rules: [{
                    required: true,
                    message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.pre.project.projectname'),
                  }],
                })(
                  <Input maxLength={82}/>
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={intl.get('wsd.i18n.pre.project.projectcode')} {...formItemLayout}>
                {/* 项目代码 */}
                {getFieldDecorator('paCode', {
                  initialValue: this.state.info.paCode,
                  rules: [],
                })(
                  <Input disabled maxLength={33}/>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item label={intl.get('wsd.i18n.pre.project.iptname')} {...formItemLayout}>
                {/*责任主体 */}
                {getFieldDecorator('orgId', {
                  initialValue: this.state.info.org ? this.state.info.org.id : null,
                  rules: [{
                    required: true,
                    message: intl.get('wsd.i18n.message.select') + intl.get('wsd.i18n.pre.project.iptname')
                  }
                  ],
                })(
                  <TreeSelect
                    style={{width: "100%"}}
                    dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
                    treeData={this.state.orgTree.length ? this.state.orgTree : (this.state.info.org && [{value: this.state.info.org.id, title: this.state.info.org.name}])}
                    treeDefaultExpandAll
                    onChange={this.orgChange}
                  />
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={intl.get('wsd.i18n.pre.project.username')} {...formItemLayout}>
                {/* 责任人 */}
                {getFieldDecorator('userId', {
                  initialValue: this.state.info.user ? this.state.info.user.id : null,
                  rules: [],
                })(
                  <Select
                    allowClear
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >
                    {
                      this.state.orgPer.length ?
                        this.state.orgPer.map((val) => {
                          return (
                            <Option key={val.id} value={val.id}>{val.title}</Option>
                          )
                        }) : this.state.info.user &&
                        <Option key={this.state.info.user.id} value={this.state.info.user.id}>{this.state.info.user.name}</Option>
                    }
                  </Select>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item label="计划开始时间" {...formItemLayout}>
                {/* 计划开始时间 */}
                {getFieldDecorator('planStartTime', {
                  initialValue: dataUtil.Dates().formatTimeMonent(this.state.info.planStartTime),
                  rules: [{
                    required: true,
                    message: intl.get('wsd.i18n.message.select') + "计划开始时间",
                  }],
                })(
                  <DatePicker style={{width: "100%"}} format={this.state.baseSet.dateFormat}
                              showTime={{format: 'HH:mm', defaultValue: moment('00:00:00', 'HH:mm:ss')}}
                              disabledDate={(current) => dataUtil.Dates().disabledMaxDate(current, this.props.form.getFieldValue("planEndTime"))}
                              disabledTime={(current) => dataUtil.Dates().disabledMaxDateTime(current, this.props.form.getFieldValue("planEndTime"))}
                              onChange={this.startCaculate}
                              onOpenChange={this.caculateByStartTime}
                  />
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="计划完成时间" {...formItemLayout}>
                {/* 计划完成时间 */}
                {getFieldDecorator('planEndTime', {
                  initialValue: dataUtil.Dates().formatTimeMonent(this.state.info.planEndTime),
                  rules: [{
                    required: true,
                    message: intl.get('wsd.i18n.message.select') + "计划完成时间",
                  }],
                })(
                  <DatePicker style={{width: "100%"}} format={this.state.baseSet.dateFormat}
                              showTime={{format: 'HH:mm', defaultValue: moment('00:00:00', 'HH:mm:ss')}}
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
                    message: intl.get('wsd.i18n.message.select') + "日历",
                  }],
                })(
                  <Select onChange={this.caculateByCalendar}>
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
              <Form.Item label="预计工期" {...formItemLayout}>
                {/* 预计工期 */}
                {getFieldDecorator('totalDrtn', {
                  initialValue: this.state.info.totalDrtn,
                  rules: [{
                    required: true,
                    message: intl.get('wsd.i18n.message.enter') + "预计工期",
                  }],
                })(
                  <InputNumber style={{width: "100%"}} max={999999999999} min={0} precision={this.state.baseSet.precision}
                               formatter={value => `${value}` + this.state.baseSet.drtnUnit}
                               parser={value => value.replace(this.state.baseSet.drtnUnit, '')}
                               onChange={this.startCaculate}
                               onBlur={this.caculateByPlanDrtn}
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item label={intl.get('wsd.i18n.pre.project.epsname')} {...formItemLayout}>
                {/* 所属项目群 */}
                {getFieldDecorator('epsId', {
                  initialValue: this.state.info.eps ? this.state.info.eps.id : null,
                  rules: [{
                    required: true,
                    message: intl.get('wsd.i18n.message.select') + intl.get('wsd.i18n.pre.project.epsname'),
                  }],
                })(
                  <TreeSelect
                    disabled
                    dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
                    treeData={this.state.epsTree}
                    treeDefaultExpandAll
                  />
                )}
              </Form.Item>
            </Col>
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
                    {this.state.secutyLevelList ? this.state.secutyLevelList.map(item => {
                      return <Option value={item.value} key={item.value}>{item.title}</Option>
                    }) : this.state.info.secutyLevel &&
                      <Option value={this.state.info.secutyLevel.id} key={this.state.info.secutyLevel.id}>{this.state.info.secutyLevel.name}</Option>
                    }
                  </Select>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item label={intl.get("wsd.i18n.pre.project1.totalBudget")} {...formItemLayout}>
                {/* 项目投资额(元) */}
                {getFieldDecorator('totalBudget', {
                  initialValue: this.state.info.totalBudget ? this.state.info.totalBudget : 0,
                  rules: [{
                    required: false,
                    message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.pre.project.plantotalcost'),
                  }],
                })(
                  <InputNumber style={{width: "100%"}} max={999999999999} min={0} precision={2}
                               formatter={value => this.state.baseSet.moneyUnit + `${value}`}
                               parser={value => value.replace(this.state.baseSet.moneyUnit, '')}/>
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={intl.get("wsd.i18n.pre.project1.budgetEstimate")} {...formItemLayout}>
                {/* 项目概算(元) */}
                {getFieldDecorator('budgetEstimate', {
                  initialValue: this.state.info.budgetEstimate ? this.state.info.budgetEstimate : 0,
                  rules: [],
                })(
                  <InputNumber style={{width: "100%"}} max={999999999999} min={0} precision={2}
                               formatter={value => this.state.baseSet.moneyUnit + `${value}`}
                               parser={value => value.replace(this.state.baseSet.moneyUnit, '')}/>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item label={intl.get("wsd.i18n.pre.project1.projectEstimate")} {...formItemLayout}>
                {/* 项目预算(元) */}
                {getFieldDecorator('projectEstimate', {
                  initialValue: this.state.info.projectEstimate ? this.state.info.projectEstimate : 0,
                  rules: [{
                    required: false,
                    message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.pre.project.plantotalcost'),
                  }],
                })(
                  <InputNumber style={{width: "100%"}} max={999999999999} min={0} precision={2}
                               formatter={value => this.state.baseSet.moneyUnit + `${value}`}
                               parser={value => value.replace(this.state.baseSet.moneyUnit, '')}/>
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={intl.get("wsd.i18n.pre.project1.constructionScale")} {...formItemLayout}>
                {/* 建设规模 */}
                {getFieldDecorator('constructionScale', {
                  initialValue: this.state.info.constructionScale,
                  rules: [],
                })(
                  <Input maxLength={82}/>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item label={intl.get("wsd.i18n.pre.project1.projectLocation")} {...formItemLayout1}>
                {/* 项目地点 */}
                {getFieldDecorator('projectLocation', {
                  initialValue: this.state.info.projectLocation,
                  rules: [],
                })(
                  <Input rows={2} maxLength={82}/>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item label={intl.get('wsd.i18n.pre.project.projecttarget')} {...formItemLayout1}>
                {/* 项目目标 */}
                {getFieldDecorator('projectTarget', {
                  initialValue: this.state.info.projectTarget,
                  rules: [],
                })(
                  <TextArea rows={2} maxLength={666}/>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item label={intl.get('wsd.i18n.pre.project.projectpurpose')} {...formItemLayout1}>
                {/* 项目概况 */}
                {getFieldDecorator('projectOverview', {
                  initialValue: this.state.info.projectOverview ? this.state.info.projectOverview : '',
                  rules: [],
                })(
                  <TextArea rows={2} maxLength={666}/>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item label={intl.get("wsd.i18n.sys.ipt.remark")} {...formItemLayout1}>
                {/* 备注 */}
                {getFieldDecorator('remark', {
                  initialValue: this.state.info.remark ? this.state.info.remark : "",
                  rules: [],
                })(
                  <TextArea rows={2} maxLength={666}/>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item label={intl.get('wsd.i18n.base.planTem.creator')} {...formItemLayout}>
                {/* 创建人 */}
                {getFieldDecorator('creator', {
                  initialValue: this.state.info.creator ? this.state.info.creator.name : '',
                  rules: [],
                })(
                  <Input disabled/>
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={intl.get("wsd.i18n.sys.menu.creattime")} {...formItemLayout}>
                {/* 创建日期 */}
                {getFieldDecorator('creatTime', {
                  initialValue: dataUtil.Dates().formatDateMonent(this.state.info.creatTime),
                  rules: [],
                })(
                  <DatePicker style={{width: "100%"}} disabled/>
                )}
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <LabelFormButton>
          <Button disabled={this.props.wfeditAuth} onClick={this.handleSubmit} style={{width: "100px"}} disabled={!this.props.edit} type="primary">保存</Button>
          <Button onClick={this.props.closeRightBox} style={{width: "100px", marginLeft: "20px"}}>取消</Button>
        </LabelFormButton>
      </LabelFormLayout>
    )
  }
}

const MenuInfos = Form.create()(MenuInfo);
export default connect(state => ({
  currentLocale: state.localeProviderData
}), {
 
})(MenuInfos);
