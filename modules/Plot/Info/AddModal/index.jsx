import React, {Component} from 'react'
import style from './style.less'
import {Form, Row, Col, Input, Button, Select, Modal, DatePicker, TreeSelect, InputNumber} from 'antd';
import SubmitButton from "../../../../components/public/TopTags/SubmitButton"
import {
  epsTree,
  orgTree,
  getdictTree,
  getDefaultCalendar,
  getOrgAndUser,
  getUserByOrgId,
  addproject,
  calendarList,
  caculateWorkHour,
  getTimeInfo, defaultCurrencyInfo,
} from '../../../../api/api';
import axios from '../../../../api/axios'
import * as dataUtil from '../../../../utils/dataUtil'
import moment from 'moment';

import {connect} from 'react-redux'
import intl from "react-intl-universal";
//import moment from '../../../Plan/Prepared/AddTask';
const Option = Select.Option;
const {TextArea} = Input;
const FormItem = Form.Item;

class AddSameLevel extends Component {
  constructor(props) {
    super(props)
    this.state = {
      baseSet: {dateFormat: 'YYYY-MM-DD', drtnUnit: 'h', timeUnit: 'h', precision: 2, moneyUnit: '¥'},
      _workTime: {},
      runnDone: true, //是否计算完成
      userId: null,
      orglist: [],
      epsList: [],
      info: {},
      defaultSecutyLevel: {value: "1", title: "非密"}//默认密级
    }
  }

  componentDidMount() {
    // this.getOrgAndUser();
    // this.getEps();
    this.getProjSetInfo();
    this.getDefaultCalendarInfo();
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

  ////日历(修改)=完成-开始=工期
  caculateByCalendar = (value, option) => {
    this.startCaculate()
    this.caculateStartOrEndOrDrtn("calendarId", value);
  }

  //获取默认全局配置
  getProjSetInfo = () => {
    axios.get(getTimeInfo).then(res => {
      const data = res.data.data || {};
      axios.get(defaultCurrencyInfo).then(res1 => {
        this.setState({
          baseSet: {
            dateFormat: (data.dateFormat || {}).code || "YYYY-MM-DD",
            drtnUnit: (data.drtnUnit || {}).code || "h",
            timeUnit: (data.timeUnit || {}).code || "h",
            precision: data.precision || 2,
            moneyUnit: (res1.data.data || {}).currencySymbol || "¥",
          }
        })
      })
    })
  }

  //获取默认日历
  getDefaultCalendarInfo = () => {
    axios.get(getDefaultCalendar).then(res => {
      const {data} = res.data
      if (data) {
        this.setState({
          defaultCalendar: data,
          _workTime: {calendar: res.data.data},
        })
      }
    })
  }

  //获取责任人主体、
  getOrgAndUser = () => {
    if(this.state.orglist.length==0){
      axios.get(orgTree).then(res => {
        if (res.data.data) {
          this.setState({
            orglist: res.data.data,
          })
        } else {
          this.setState({
            orglist: []
          })
        }
      })
    }
  
  }

  //责任人
  getUser = (id) => {
    axios.get(getUserByOrgId(id)).then(res => {
      this.setState({
        userlist: res.data.data
      })
      this.props.form.resetFields(`userId`, []);
    })
  }

  //选择责任主体联动责任人
  onTreeChange = (v) => {
    this.getUser(v)
    this.props.form.setFieldsValue({["userId"]: null});
  }

  //获取项目群
  getEps = () => {
    if (!this.state.epsList.length) {
      axios.get(epsTree).then(res => {
        this.setState({epsList: res.data.data})
      })
    }
  }

  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
    this.props.form.resetFields();
    this.props.handleCancel()
  }

  handleSubmit = (type) => {
    const that = this
    if(this.state.runnDone){
    
      this.props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          //平铺
          if (this.props.view == "tile") {
            let data = {
              ...values,
              planStartTime: dataUtil.Dates().formatTimeString(values.planStartTime),
              planEndTime: dataUtil.Dates().formatTimeString(values.planEndTime),
              totalDrtn: this.state._workTime.totalDrtn,
            }
            axios.post(addproject, data, true, null, true).then(res => {
              this.props.addprojectinfo(res.data.data)
              this.props.form.resetFields();
              if (type == "new") {
                this.props.handleCancel()
              }
            })
          } else {
            //树形
            let data = {
              ...values,
              parentId: this.props.data.id,
              planStartTime: dataUtil.Dates().formatTimeString(values.planStartTime),
              planEndTime: dataUtil.Dates().formatTimeString(values.planEndTime),
              totalDrtn: this.state._workTime.totalDrtn,
            }
            axios.post(addproject, data, true, null, true).then(res => {
              this.props.addprojectinfo(res.data.data)
              this.props.form.resetFields();
              if (type == "new") {
                this.props.handleCancel()
              }
            })
          }
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

  //获取日历列表
  getCalendarList = () => {
    if (!this.state.calendardata) {
      axios.get(calendarList).then(res => {
        if (res.data.data) {
          this.setState({
            calendarList: res.data.data
          })
        }
      })
    }
  }

  render() {
    const {intl} = this.props.currentLocale
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
      <div>

        <Modal className={style.main}
               title={this.props.title}
               visible={true}
               onOk={this.handleOk}
               onCancel={this.handleCancel}
               okText="确定"
               cancelText="取消"
               width="850px"
               footer={
                 <div className="modalbtn">
                   <SubmitButton key={3} onClick={this.handleSubmit.bind(this, "go")} content="保存并继续" />
                   <SubmitButton key={2} onClick={this.handleSubmit.bind(this, "new")} type="primary" content="保存" />
                 </div>
               }
        >
          <Form onSubmit={this.handleSubmit} className={style.info}>
            <div className={style.content}>
              <Row>
                <Col span={12}>
                  <Form.Item label={intl.get('wsd.i18n.pre.project.projectname')} {...formItemLayout}>
                    {getFieldDecorator('name', {
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
                    {getFieldDecorator('code', {
                      rules: [{
                        required: true,
                        message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.pre.project.projectcode'),
                      }],
                    })(
                      <Input maxLength={33}/>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Form.Item label={intl.get('wsd.i18n.pre.project1.iptname')} {...formItemLayout}>
                    {getFieldDecorator('orgId', {
                      rules: [{
                        required: true,
                        message: intl.get('wsd.i18n.message.select') + intl.get('wsd.i18n.pre.project1.iptname'),
                      }],
                    })(
                      <TreeSelect
                        showSearch     
                        treeNodeFilterProp="title"
                        style={{width: "100%"}}
                        dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
                        onFocus={this.getOrgAndUser}
                        treeData={this.state.copyOrgList? this.state.copyOrgList:this.state.orglist}
                        treeDefaultExpandAll
                        onChange={this.onTreeChange}
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={intl.get('wsd.i18n.pre.project1.username')} {...formItemLayout}>
                    {getFieldDecorator('userId', {
                      initialValue: this.state.userId,
                      rules: [{
                        required: true,
                        message: intl.get('wsd.i18n.message.select') + intl.get('wsd.i18n.pre.project1.username'),
                      }],
                    })(
                      <Select>
                        {this.state.userlist &&
                        this.state.userlist.map((val) => {
                          return (
                            <Option key={val.id} value={val.id}>{val.title}</Option>
                          )
                        })
                        }
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Form.Item label={intl.get("wsd.i18n.pre.project1.starttime")} {...formItemLayout}>
                    {getFieldDecorator('planStartTime', {
                      rules: [{
                        required: true,
                        message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.pre.project1.starttime'),
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
                  <Form.Item label={intl.get("wsd.i18n.pre.project1.endtime")} {...formItemLayout}>
                    {getFieldDecorator('planEndTime', {
                      rules: [{
                        required: true,
                        message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.pre.project1.endtime'),
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
                  <Form.Item label={intl.get("wsd.i18n.pre.epsInfo.calnid")} {...formItemLayout}>
                    {getFieldDecorator('calendarId', {
                      initialValue: this.state.defaultCalendar ? this.state.defaultCalendar.id : null,
                      rules: [{
                        required: true,
                        message: intl.get('wsd.i18n.message.select') + intl.get('wsd.i18n.pre.epsInfo.calnid'),
                      }],
                    })(
                      <Select onDropdownVisibleChange={this.getCalendarList} onChange={this.caculateByCalendar}>
                        {this.state.calendarList ? this.state.calendarList.map(item => {
                          return <Option value={item.id} key={item.id}>{item.calName}</Option>
                        }) : this.state.defaultCalendar &&
                          <Option value={this.state.defaultCalendar.id} key={this.state.defaultCalendar.id}>{this.state.defaultCalendar.calName}</Option>
                        }
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="预计工期" {...formItemLayout}>
                    {getFieldDecorator('totalDrtn', {
                      initialValue: 0,
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
                    {getFieldDecorator('parentId', {
                      initialValue: this.props.view == "tile" ? null : (this.props.data ? this.props.data.name : null),
                      rules: [{
                        required: true,
                        message: intl.get('wsd.i18n.message.select') + intl.get('wsd.i18n.pre.project.epsname'),
                      }],
                    })(
                      this.props.view == "tile" ?
                        <TreeSelect
                          onDropdownVisibleChange={this.getEps}
                          style={{width: '100%'}}
                          dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
                          treeData={this.state.epsList}
                        />
                        :
                        <Input disabled/>
                    )}
                  </Form.Item>
                </Col>
                {/* <Col span={12}>
                  <Form.Item label="密级" {...formItemLayout}>
                    {getFieldDecorator('secutyLevel', {
                      initialValue: "1",
                      rules: [{
                        required: true,
                        message: intl.get('wsd.i18n.message.select') + "密级",
                      }],
                    })(
                      <Select onDropdownVisibleChange={this.getSecutyLevelList}>
                        {this.state.secutyLevelList ? this.state.secutyLevelList.map(item => {
                          return <Option value={item.value} key={item.value}>{item.title}</Option>
                        }) : this.state.defaultSecutyLevel &&
                          <Option value={this.state.defaultSecutyLevel.value} key={this.state.defaultSecutyLevel.value}>{this.state.defaultSecutyLevel.title}</Option>
                        }
                      </Select>
                    )}
                  </Form.Item>
                </Col> */}
              </Row>
              <Row>
                <Col span={24}>
                  <Form.Item label={intl.get("wsd.i18n.pre.epsInfo.remark")} {...formItemLayout1}>
                    {getFieldDecorator('remark', {
                      rules: [],
                    })(
                      <TextArea rows={2} maxLength={666}/>
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

const AddSameLevels = Form.create()(AddSameLevel);
export default connect(state => ({
  currentLocale: state.localeProviderData
}), {})(AddSameLevels);
