import React, { Component, Fragment } from 'react';
import { Form, Modal, Row, Col, Input, Button, DatePicker, TreeSelect, Select, TimePicker } from 'antd';
import { checkAddScheduleCode, trainScheduleAdd } from '@/modules/Suzhou/api/suzhou-api';
import { getBaseData } from '@/modules/Suzhou/components/Util/util';
import moment from 'moment'
import axios from '@/api/axios';
import style from './style.less';
import * as dataUtil from "@/utils/dataUtil";
const { Item } = Form;
const { TextArea } = Input;
const { Option } = Select
const { SHOW_PARENT } = TreeSelect;
const { RangePicker } = DatePicker
class AddTimeTable1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lineArr: [],  //线路表
      startStation: [], //始发站
      endStation: [], //终点站
      disabled:false
    }
  }

  componentWillReceiveProps({ visibleModal, projectId }) {
  }
  componentDidMount() {
    const { record, type } = this.props
    getBaseData('line').then(data => { this.setState({ lineArr: data }) })
    if (type == 'info') {
      this.selectOnChange(record.line.code)
    }
  }
  selectOnChange = (value) => {
    getBaseData(`line${value}.station`).then(data => {
      this.setState(
        {
          startStation: data,
          endStation: data
        })
    })
  }
  //始发站校验
  checkstartStation = (rule, value, callBack) => {
    if (this.props.form.getFieldValue('endStation') == value) {
      callBack('始发站点不能与终点站点相同')
    } else {
      callBack()
    }
  }
  //终点站校验
  checkendStation = (rule, value, callBack) => {
    if (this.props.form.getFieldValue('startStation') == value) {
      callBack('终点站点不能与始发站点相同')
    } else {
      callBack()
    }
  }
  //校验名称是否存在
  checkAddScheduleCode = (rule, value, callBack) => {
    if (value) {
      axios.get(checkAddScheduleCode + `?scheduleCode=${value}`).then(res => {
        const isCheckCode = res.data.data
        if (isCheckCode == 'true') {
          callBack('时刻表已存在')
        } else {
          callBack()
        }
      })
    } else {
      callBack()
    }
  }
  //校验最大上线列
  checkOnlineTrain = (rule, value, callBack) => {
    if (value) {
    const plannedOperationColumn = this.props.form.getFieldValue('plannedOperationColumn')
      if( plannedOperationColumn!=null && (value > plannedOperationColumn)){
        callBack('最大上线列不能大于计划列')
      }else{
        callBack()
      }
    }else{
      callBack()
    }
  }
  //校验计划列
  checkPlanTrain = (rule, value, callBack) => {
    if (value) {
    const maxOnlineTrain = this.props.form.getFieldValue('maxOnlineTrain')
      if(maxOnlineTrain!=null && (value < maxOnlineTrain)){
        callBack('计划列不能小于最大上线列')
      }else{
        callBack()
      }
    }else{
      callBack()
    }
  }
  handleOk = (type, e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (err) {
      } else {
        this.setState({disabled:true})
        const startDriveTime = moment(values.startDriveTime).format('HH:mm:ss')
        const endDriveTime = moment(values.endDriveTime).format('HH:mm:ss')
        const typeCode = `line${values.line}.station`
        const data = { ...values, startDriveTime, endDriveTime, typeCode }
        axios.post(trainScheduleAdd, data, true).then(res => {
          if (res.data.status === 200) {
              this.setState({disabled:false})
              if (type == 'save') {
                  this.props.handleCancel();
              }
              if (type == 'goOn') {
                this.props.form.setFieldsValue({
                  line: undefined,
                  scheduleCode: null,
                  maxOnlineTrain: null,
                  minDrivingInterval: null,
                  standbyTrain: null,
                  plannedOperationColumn: null,
                  startStation: undefined,
                  endStation: undefined,
                  startDriveTime: null,
                  endDriveTime: null
                })
              }
              this.props.success(res.data.data);
          }
        });
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { lineArr, startStation, endStation } = this.state
    const { record, type } = this.props
    return (
      <Modal
        title={type == 'add' ? '新增' : '详情'}
        width={800}
        className={style.main}
        destroyOnClose={true}
        centered={true}
        maskClosable={false}
        mask={false}
        visible={this.props.modalVisible}
        onCancel={this.props.handleCancel}
        footer={
          <div className="modalbtn">
            {type == 'add' ?
              // 保存并继续
              <Fragment><Button key={1} disabled={this.state.disabled} onClick={this.handleOk.bind(this, 'goOn')}>
                保存并继续
            </Button>
                {/* 保存 */}
                <Button key={2} disabled={this.state.disabled} onClick={this.handleOk.bind(this, 'save')} type="primary">
                  保存
            </Button></Fragment> :
              <Button key={3} onClick={this.props.handleCancel} type="primary">
                关闭
            </Button>}
          </div>
        }
      >
        <Form {...formLayout} onSubmit={this.handleOk} className={style.mainScorll}>
          <div className={style.content}>
            <Row key={1} type="flex">
              <Col span={12} key="line">
                <Item {...formItemLayout} label="线路">
                  {getFieldDecorator('line', {
                    initialValue: type == 'info' ? record.line : undefined,
                    rules: [
                      {
                        required: true,
                        message: '请选择线路',
                      },
                    ],
                  })(
                    <Select showSearch placeholder="请选择线路" disabled={type == 'add' ? false : true}
                      onChange={this.selectOnChange} filterOption={(input, option) =>
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                      {lineArr.map(item => {
                        return <Option key={item.value} value={item.value}>{item.title}</Option>
                      })}
                    </Select>)}
                </Item>
              </Col>
              <Col span={12} key="scheduleCode">
                <Item {...formItemLayout} label="时刻表编码">
                  {getFieldDecorator('scheduleCode', {
                    initialValue: type == 'info' ? record.scheduleCode : null,
                    rules: [
                      {
                        required: true,
                        message: '请输入时刻表编码',
                      },
                      {
                        max: 20,
                        message: '不能超过20个字符',
                      },
                      {
                        validator: this.checkAddScheduleCode
                      },
                    ],
                    validateTrigger: 'onBlur'
                  })(<Input placeholder='请输入时刻表名称' disabled={type == 'add' ? false : true} />)}
                </Item>
              </Col>
            </Row>
            <Row key={2} type="flex">
              <Col span={12} >
                <Item label="最大上线列车数" {...formItemLayout}>
                  {getFieldDecorator('maxOnlineTrain', {
                    initialValue: type == 'info' ? record.maxOnlineTrain : null,
                    rules: [
                      {
                        required: true,
                        message: '请输入最大上线列车数',
                      },
                      {
                        validator: this.checkOnlineTrain
                      },
                    ],
                  })(<Input placeholder='请输入最大上线列车数' disabled={type == 'add' ? false : true} />)}
                </Item>
              </Col>
              <Col span={12} key="minDrivingInterval">
                <Item label="最小行车间隔" {...formItemLayout}>
                  {getFieldDecorator('minDrivingInterval', {
                    initialValue: type == 'info' ? record.minDrivingInterval : null,
                    rules: [
                      {
                        required: true,
                        message: '请输入最小行车间隔',
                      },
                    ],
                  })(<Input placeholder='请输入最小行车间隔' disabled={type == 'add' ? false : true} />)}
                </Item>
              </Col>
            </Row>
            <Row key={3}>
              <Col span={12} key="standbyTrain">
                <Item label="备用车数" {...formItemLayout}>
                  {getFieldDecorator('standbyTrain', {
                    initialValue: type == 'info' ? record.standbyTrain : null,
                    rules: [
                      {
                        required: true,
                        message: '请输入备用车数',
                      },
                    ]
                  })(<Input placeholder='请输入备用车数' disabled={type == 'add' ? false : true} />)}
                </Item>
              </Col>
              <Col span={12} key='plannedOperationColumn'>
                <Item label='计划开行(列)' {...formItemLayout}>
                  {getFieldDecorator("plannedOperationColumn", {
                    initialValue: type == 'info' ? record.plannedOperationColumn : null,
                    rules: [
                      {
                        required: true,
                        message: '请输入计划开行',
                      },
                      {
                        validator: this.checkPlanTrain
                      },
                    ]
                  })(
                    <Input placeholder='请输入计划开行' disabled={type == 'add' ? false : true} />
                  )}
                </Item>
              </Col>
            </Row>
            <Row key={4}>
              <Col span={12} key="startStation">
                <Item label="始发站" {...formItemLayout}>
                  {getFieldDecorator('startStation', {
                    initialValue: type == 'info' ? record.startStation : undefined,
                    rules: [
                      {
                        required: true,
                        message: '请选择始发站',
                      },
                      {
                        validator: this.checkstartStation
                      },
                    ]
                  })(<Select showSearch placeholder="请选择始发站" disabled={type == 'add' ? false : true}
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                    {startStation.map(item => {
                      return <Option key={item.value} value={item.title}>{item.title}</Option>
                    })}
                  </Select>)}
                </Item>
              </Col>
              <Col span={12} key="endStation">
                <Item label="终点站" {...formItemLayout}>
                  {getFieldDecorator('endStation', {
                    initialValue: type == 'info' ? record.endStation : undefined,
                    rules: [
                      {
                        required: true,
                        message: '请选择终点站',
                      },
                      {
                        validator: this.checkendStation
                      },
                    ]
                  })(<Select showSearch placeholder="请选择终点站" disabled={type == 'add' ? false : true}
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                    {endStation.map(item => {
                      return <Option key={item.value} value={item.title}>{item.title}</Option>
                    })}
                  </Select>)}
                </Item>
              </Col>
            </Row>
            <Row key={5}>
              <Col span={12} key="startDriveTime">
                <Item label="首班车时间" {...formItemLayout}>
                  {getFieldDecorator('startDriveTime', {
                    initialValue: type == 'info' ? moment(record.startDriveTime, 'HH:mm:ss') : null,
                    rules: [
                      {
                        required: true,
                        message: '请选择首班车时间',
                      },
                    ]
                  })(<TimePicker defaultOpenValue={moment('00:00:00', 'HH:mm:ss')} placeholder='首班时间' style={{ width: '100%' }} disabled={type == 'add' ? false : true} />)}
                </Item>
              </Col>
              <Col span={12} key="endDriveTime">
                <Item label="末班车时间" {...formItemLayout}>
                  {getFieldDecorator('endDriveTime', {
                    initialValue: type == 'info' ? moment(record.endDriveTime, 'HH:mm:ss') : null,
                    rules: [
                      {
                        required: true,
                        message: '请选择末班车时间',
                      },
                    ]
                  })(<TimePicker defaultOpenValue={moment('00:00:00', 'HH:mm:ss')} placeholder='末班时间' style={{ width: '100%' }} disabled={type == 'add' ? false : true} />)}
                </Item>
              </Col>
            </Row>
          </div>
        </Form>
      </Modal>
    );
  }
}

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

const formLayout = {
  labelCol: {
    sm: { span: 4 },
  },
  wrapperCol: {
    sm: { span: 20 },
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

const AddTimeTable = Form.create()(AddTimeTable1);
export default AddTimeTable;
