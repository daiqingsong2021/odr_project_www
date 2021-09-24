import React, { Component ,Fragment} from 'react'
import style from './style.less'
import { Form, Row, Col, Input, Button, Select ,DatePicker,Checkbox,Switch} from 'antd';
import intl from 'react-intl-universal'
import { connect } from 'react-redux'
import { curdCurrentData } from '../../../../store/curdData/action'
import * as dataUtil from "../../../../utils/dataUtil";
import axios from '@/api/axios'
import {getdictTree} from '@/api/api'
import moment from 'moment'
const Option = Select.Option;
class MenuInfo extends Component {
    constructor(props) {
      super(props);
      this.state = {
        initDone: false,
        info: {},
        visiable:true,
        sectionStatusList:[], //标段状态列表
        openPgd:'0',  //是否启用派工单 1 是 0 否
        openExam:'0', //是否启用考核
      };
    }

    componentDidMount() {
      const { rightData } = this.props;
      let flag = "org"== rightData.extendedColumn1 ? true : false;
      this.setState({
        info: rightData,
        visiable:flag,
        openPgd:rightData.openPgd?rightData.openPgd:'0', 
        openExam:rightData.openExam?rightData.openExam:'0',
      })
      this.getSectionStatus()
    }

  // 点击下拉框
  onTypeChange = (bo, e) => {
    let flag = "org"== bo ? true : false;
    this.setState({
      visiable:flag
    });
  }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            const { rightData } = this.props
            if (!err) {
                let ec5 = values['extendedColumn5'];
                if(this.state.visiable == false){ // 节点为标段时
                  values['startDate']= values['startDate'] ? dataUtil.Dates().formatTimeString(values.startDate).substr(0,10):null
                  values['endDate']= values['endDate'] ? dataUtil.Dates().formatTimeString(values.endDate).substr(0,10):null
                  values['pgdStartDate']= values['pgdStartDate'] ? dataUtil.Dates().formatTimeString(values.pgdStartDate).substr(0,10):null
                  values['pgdEndDate']= values['pgdEndDate'] ? dataUtil.Dates().formatTimeString(values.pgdEndDate).substr(0,10):null
                  values['examStartDate']= values['examStartDate'] ? dataUtil.Dates().formatTimeString(values.examStartDate).substr(0,10):null
                  values['examEndDate']= values['examEndDate'] ? dataUtil.Dates().formatTimeString(values.examEndDate).substr(0,10):null
                  values['openPgd'] = this.state.openPgd
                  values['openExam'] = this.state.openExam
                }
                values['extendedColumn5'] = dataUtil.Arr().toString(ec5);
                const data = {
                    ...rightData,
                    ...values
                }
                //修改信息
                this.props.updateData(data)
            }
        });
    }
  //获取标段状态
    getSectionStatus = () => {
      axios.get(getdictTree('proj.section.status')).then(res => {
          this.setState({
            sectionStatusList: res.data.data
          })
      })
    }
  //是否启用派工单
    openPgd=(checked,e)=>{
      this.setState({
        openPgd:checked ? '1':'0'
      })
    }
  //是否启用考核
    openExam=(checked,e)=>{
      this.setState({
        openExam:checked ? '1':'0'
      })
    }
    render() {
        const { rightData } = this.props
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
        return (
            <div className={style.main}>
                <div className={style.mainHeight}>
                    <h3 className={style.listTitle}>基本信息</h3>
                    <div className={style.mainScorll}>
                        <Form onSubmit={this.handleSubmit}>
                            <div className={style.content}>
                              <Row type="flex">
                                <Col span={12}>
                                  <Form.Item label={intl.get('wsd.i18n.base.planTemAddTask.name')} {...formItemLayout}>
                                    {getFieldDecorator('teamName', {
                                      initialValue: this.state.info.teamName,
                                      rules: [{
                                        required: true,
                                        message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.base.planTemAddTask.name'),
                                      }],
                                    })(
                                      <Input />
                                    )}
                                  </Form.Item>
                                </Col>
                                <Col span={12}>
                                  <Form.Item label={intl.get('wsd.i18n.base.planTemAddTask.code')} {...formItemLayout}>
                                    {getFieldDecorator('teamCode', {
                                      initialValue: this.state.info.teamCode,
                                      rules: [{
                                        required: true,
                                        message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.base.planTemAddTask.code'),
                                      }],
                                    })(
                                      <Input />
                                    )}
                                  </Form.Item>
                                </Col>
                              </Row>
                              <Row type="flex">
                                <Col span={12}>
                                  <Form.Item label="类别" {...formItemLayout}>
                                    {getFieldDecorator('extendedColumn1', {
                                      initialValue: this.state.info.extendedColumn1,
                                      rules: [{
                                        required: true,
                                        message: '类别必有值',
                                      }],
                                    })(
                                      <Select onChange={this.onTypeChange}>
                                        <Option value='org' key='org'>组织</Option>
                                        <Option value='section' key='section'>标段</Option>
                                      </Select>
                                    )}
                                  </Form.Item>
                                </Col>
                                {this.state.visiable &&
                                <Col span={12}>
                                  <Form.Item label="单位类型" {...formItemLayout}>
                                    {getFieldDecorator('extendedColumn3', {
                                      initialValue: this.state.info.extendedColumn3,
                                      rules: [{
                                        required: true,
                                        message: '单位类型必有值',
                                      }],
                                    })(
                                      <Select>
                                        {
                                          this.props.orgType.map((v, i) => {
                                            return <Option value={v.value} key={i}>{v.title}</Option>
                                          })
                                        }
                                      </Select>
                                    )}
                                  </Form.Item>
                                </Col>
                                }
                                {!this.state.visiable &&
                                <Col span={12}>
                                  <Form.Item label="标段类型" {...formItemLayout}>
                                    {getFieldDecorator('extendedColumn2', {
                                      initialValue: this.state.info.extendedColumn2,
                                      rules: [],
                                    })(
                                      <Select>
                                        {
                                          this.props.section.map((v, i) => {
                                            return <Option value={v.value} key={i}>{v.title}</Option>
                                          })
                                        }
                                      </Select>
                                    )}
                                  </Form.Item>
                                </Col>
                                }
                              </Row>
                              <Row type="flex">
                                {this.state.visiable &&
                                <Col span={12}>
                                  <Form.Item label="单位分类" {...formItemLayout}>
                                    {getFieldDecorator('extendedColumn4', {
                                      initialValue: this.state.info.extendedColumn4,
                                      rules: [],
                                    })(
                                      <Select>
                                        {
                                          this.props.orgClassification.map((v, i) => {
                                            return <Option value={v.value} key={i}>{v.title}</Option>
                                          })
                                        }
                                      </Select>
                                    )}
                                  </Form.Item>
                                </Col>
                                }
                                {!this.state.visiable &&
                                <Col span={12}>
                                  <Form.Item label="专业" {...formItemLayout} >
                                    {getFieldDecorator('extendedColumn5', {
                                      initialValue: this.state.info.extendedColumn5 ? this.state.info.extendedColumn5.split(',').map(item => item) : [],
                                      rules: [],
                                    })(
                                      <Select mode="multiple">
                                        {
                                          this.props.professional&&this.props.professional.map((v, i) => {
                                            return <Option value={v.value} key={i}>{v.title}</Option>
                                          })
                                        }
                                      </Select>
                                    )}
                                  </Form.Item>
                                </Col>
                                }
                              </Row>
                              {!this.state.visiable &&(
                              <Fragment>
                              <Row type="flex">
                                <Col span={12}>
                                  <Form.Item label="标段状态" {...formItemLayout}>
                                    {getFieldDecorator('sectionStatus', {
                                      initialValue: this.state.info.sectionStatusVo.code,
                                      rules: [{
                                        required: true,
                                        message: '请选择标段状态',
                                      }],
                                    })(
                                      <Select defaultValue={this.state.info?this.state.info.sectionStatusVo.code:null} onChange={this.onSectionStatus} placeholder='请选择状态'>
                                        {
                                          this.state.sectionStatusList.length != 0 && this.state.sectionStatusList.map(item => {
                                              return <Option key={item.value} value={item.value}>{item.title}</Option>
                                          })
                                        }
                                      </Select>
                                    )}
                                  </Form.Item>
                                </Col>
                              </Row>
                              <Row type="flex">
                                <Col span={12}>
                                  <Form.Item label="开工日期" {...formItemLayout}>
                                    {getFieldDecorator('startDate', {
                                      initialValue: dataUtil.Dates().formatDateMonent(this.state.info.startDate),//moment(this.state.info.startDate),
                                      rules: [{
                                        required: true,
                                        message: '请选择开工日期',
                                      }],
                                    })(
                                      <DatePicker format='YYYY-MM-DD' placeholder="请选择日期"/>
                                    )}
                                  </Form.Item>
                                </Col>
                                <Col span={12}>
                                  <Form.Item label="完工日期" {...formItemLayout}>
                                    {getFieldDecorator('endDate', {
                                      initialValue: dataUtil.Dates().formatDateMonent(this.state.info.endDate),
                                      rules: [{
                                        required: true,
                                        message: '请选择完工日期',
                                      }],
                                    })(
                                      <DatePicker format='YYYY-MM-DD' placeholder="请选择日期"/>
                                    )}
                                  </Form.Item>
                                </Col>
                              </Row>
                              <Row type="flex">
                                <Col span={12}>
                                  <Form.Item label="是否启用派工单" {...formItemLayout}>
                                    {getFieldDecorator('openPgd', {
                                      initialValue: this.state.openPgd,
                                      // rules: [{
                                      //   required: true,
                                      //   message: '请选择',
                                      // }],
                                    })(
                                      // <Checkbox checked={this.state.openPgd == '1'?true:false} onChange={this.openPgd}/>
                                      <Switch defaultChecked={this.state.openPgd == '1'?true:false} 
                                      checkedChildren="是" unCheckedChildren="否" onChange={this.openPgd}/>
                                    )}
                                  </Form.Item>
                                </Col>
                              </Row>
                                {(this.state.openPgd == '1'?true:false) && (
                                <Row type="flex">
                                  <Col span={12}>
                                  <Form.Item label="派工单开始日期" {...formItemLayout}>
                                    {getFieldDecorator('pgdStartDate', {
                                      initialValue: dataUtil.Dates().formatDateMonent(this.state.info.pgdStartDate),
                                      rules: [{
                                        required: true,
                                        message: '请选择开工日期',
                                      }],
                                    })(
                                      <DatePicker format='YYYY-MM-DD' placeholder="请选择日期"/>
                                    )}
                                  </Form.Item>
                                  </Col>
                                  <Col span={12}>
                                    <Form.Item label="派工单结束日期" {...formItemLayout}>
                                      {getFieldDecorator('pgdEndDate', {
                                        initialValue: dataUtil.Dates().formatDateMonent(this.state.info.pgdEndDate),
                                        rules: [{
                                          required: true,
                                          message: '请选择完工日期',
                                        }],
                                      })(
                                        <DatePicker format='YYYY-MM-DD' placeholder="请选择日期"/>
                                      )}
                                    </Form.Item>
                                  </Col>
                                </Row>
                                )}
                                <Row type="flex">
                                  <Col span={12}>
                                    <Form.Item label="是否启用信息化考核" {...formItemLayout}>
                                      {getFieldDecorator('openExam', {
                                        initialValue: this.state.openExam,
                                        // rules: [{
                                        //   required: true,
                                        //   message: '请选择',
                                        // }],
                                      })(
                                        // <Checkbox checked={this.state.openExam == '1'?true:false} onChange={this.openExam}/>
                                        <Switch defaultChecked={this.state.openExam == '1'?true:false} 
                                        checkedChildren="是" unCheckedChildren="否" onChange={this.openExam}/>
                                      )}
                                    </Form.Item>
                                  </Col>
                                </Row>
                                {(this.state.openExam == '1'?true:false) && (
                                <Row type="flex">
                                  <Col span={12}>
                                  <Form.Item label="信息化考核开始日期" {...formItemLayout}>
                                    {getFieldDecorator('examStartDate', {
                                      initialValue: dataUtil.Dates().formatDateMonent(this.state.info.examStartDate),
                                      rules: [{
                                        required: true,
                                        message: '请选择开工日期',
                                      }],
                                    })(
                                      <DatePicker format='YYYY-MM-DD' placeholder="请选择日期"/>
                                    )}
                                  </Form.Item>
                                </Col>
                                <Col span={12}>
                                  <Form.Item label="信息化考核结束日期" {...formItemLayout}>
                                    {getFieldDecorator('examEndDate', {
                                      initialValue: dataUtil.Dates().formatDateMonent(this.state.info.examEndDate),
                                      rules: [{
                                        required: true,
                                        message: '请选择完工日期',
                                      }],
                                    })(
                                      <DatePicker format='YYYY-MM-DD' placeholder="请选择日期"/>
                                    )}
                                  </Form.Item>
                                </Col>
                                </Row>)}
                              </Fragment>)}
                            </div>

                        </Form>
                    </div>
                    <div className={style.mybtn}>
                        <Row >
                            <Col span={24}>
                                <Col offset={4} >
                                    <Button onClick={this.handleSubmit} style={{ width: "100px" }} type="primary">保存</Button>
                                    <Button onClick={this.props.closeRightBox} style={{ width: "100px", marginLeft: "20px" }}>取消</Button>
                                </Col>
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>
        )
    }
}
const MenuInfos = Form.create()(MenuInfo);
export default connect(state => ({
    currentLocale: state.localeProviderData
}), {
        curdCurrentData
    })(MenuInfos);
