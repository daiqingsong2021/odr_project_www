import React, {Component} from 'react'
import style from './style.less'
import {Form, Row, Col, Input, Button, InputNumber, Select, Checkbox} from 'antd';
import {connect} from 'react-redux';
import axios from "../../../../api/axios"
import {getvariable, getCurrency, calendarList, updateproVariable, getdictTree} from "../../../../api/api"
import LabelFormLayout from "../../../../components/public/Layout/Labels/Form/LabelFormLayout"
import LabelFormButton from "../../../../components/public/Layout/Labels/Form/LabelFormButton"
const Option = Select.Option;

class VariableSet extends Component {
  constructor(props) {
    super(props)
    this.state = {
      info: {}
    }
  }

  componentDidMount() {
    
    axios.get(getvariable(this.props.data.id)).then(res => {
      this.setState({
        info: res.data.data
      }, () => {
        const {info} = this.state
        this.setState({
          calendardata1: info.calendar ? [info.calendar] : null,
          FormateList1: info.dateFormat ? [info.dateFormat] : null,
          taskdrtntypeData1: info.taskDrtnType ? [info.taskDrtnType] : null,
          drtnunitData1: info.drtnUnit ? [info.drtnUnit] : null,
          timeunitData1: info.timeUnit ? [info.timeUnit] : null,
          cpmtypeData1: info.cpmType ? [info.cpmType] : null,
          Currencydata1: info.currency ? [info.currency] : null
        })
      })
    })
  }

  //获取货币
  getCurrencyList = () => {
    if (!this.state.Currencydata) {
      axios.get(getCurrency).then(res => {
        if (res.data.data) {
          this.setState({
            Currencydata: res.data.data
          }, () => {
            this.setState(preState => ({
              Currencydata1: null
            }))
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
            calendardata: res.data.data
          }, () => {
            this.setState(preState => ({
              calendardata1: null
            }))
          })
        }
      })
    }
  }
  //获取日期格式
  getFormateList = () => {
    if (!this.state.FormateList) {
      axios.get(getdictTree("base.date.formate")).then(res => {
        if (res.data.data) {
          this.setState({
            FormateList: res.data.data
          }, () => {
            this.setState(preState => ({
              FormateList1: null
            }))
          })
        }
      })
    }
  }
  //获取工期类型
  getTaskdrtntypeList = () => {
    if (!this.state.taskdrtntypeData) {
      axios.get(getdictTree("plan.project.taskdrtntype")).then(res => {
        if (res.data.data) {
          this.setState({
            taskdrtntypeData: res.data.data
          }, () => {
            this.setState(preState => ({
              taskdrtntypeData1: null
            }))
          })
        }
      })
    }

  }
  //工期单位：
  getDrtnunitList = () => {
    if (!this.state.drtnunitData) {
      axios.get(getdictTree("plan.project.drtnunit")).then(res => {
        if (res.data.data) {
          this.setState({
            drtnunitData: res.data.data
          }, () => {
            this.setState(preState => ({
              drtnunitData1: null
            }))
          })
        }
      })
    }
  }
  //工时单位：
  getTimeunitList = () => {
    if (!this.state.timeunitData) {
      axios.get(getdictTree("plan.project.timeunit")).then(res => {
        if (res.data.data) {
          this.setState({
            timeunitData: res.data.data
          }, () => {
            this.setState(preState => ({
              timeunitData1: null
            }))
          })
        }
      })
    }
  }
  //获取关键路径
  getCpmtypeList = () => {
    if (!this.state.cpmtypeData) {
      axios.get(getdictTree("plan.project.cpmtype")).then(res => {
        if (res.data.data) {
          this.setState({
            cpmtypeData: res.data.data
          }, () => {
            this.setState(preState => ({
              cpmtypeData1: null
            }))
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
          enableProjectTeam: values.enableProjectTeam ? 1 : 0,
          taskDrtnType:'FixedRate'
        }
    
        axios.put(updateproVariable, data, true,null,true).then(res => {
       
        })
      }
    });
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

      <LabelFormLayout title = {this.props.title} >
        <Form onSubmit={this.handleSubmit}>
          <Row>
            <Col span={12}>
              <Form.Item label="时间格式" {...formItemLayout}>
                {getFieldDecorator('dateFormat', {
                  initialValue: this.state.info.dateFormat ? this.state.info.dateFormat.id : null,
                  rules: [{
                    required: true,
                    message: intl.get('wsd.i18n.message.select') + intl.get('wsd.i18n.pre.project.projectcode'),
                  }],
                })(
                  <Select onDropdownVisibleChange={this.getFormateList}>
                    {this.state.FormateList1 ? this.state.FormateList1.map(item => {
                      return <Option value={item.id} key={item.id}>{item.name}</Option>
                    }) : this.state.FormateList && this.state.FormateList.map(item => {
                      return <Option value={item.value} key={item.value}>{item.title}</Option>
                    })}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="总浮时" {...formItemLayout}>
                {getFieldDecorator('cpmFloat', {
                  initialValue: this.state.info.cpmFloat ? this.state.info.cpmFloat : 0,
                  rules: [],
                })(
                  <InputNumber style={{width: "100%"}}
                               formatter={value => `${value}h`}
                               parser={value => value.replace('h', '')}
                               min={0}
                               max={100}
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item label="工期单位" {...formItemLayout}>
                {getFieldDecorator('drtnUnit', {
                  initialValue: this.state.info.drtnUnit ? this.state.info.drtnUnit.id : null,
                  rules: [],
                })(
                  <Select onDropdownVisibleChange={this.getDrtnunitList}>
                    {this.state.drtnunitData1 ? this.state.drtnunitData1.map(item => {
                      return <Option value={item.id} key={item.id}>{item.name}</Option>
                    }) : this.state.drtnunitData && this.state.drtnunitData.map(item => {
                      return <Option value={item.value} key={item.value}>{item.title}</Option>
                    })}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="工时单位" {...formItemLayout}>
                {getFieldDecorator('timeUnit', {
                  initialValue: this.state.info.timeUnit ? this.state.info.timeUnit.id : null,
                  rules: [],
                })(
                  <Select onDropdownVisibleChange={this.getTimeunitList}>
                    {this.state.timeunitData1 ? this.state.timeunitData1.map(item => {
                      return <Option value={item.id} key={item.id}>{item.name}</Option>
                    }) : this.state.timeunitData && this.state.timeunitData.map(item => {
                      return <Option value={item.value} key={item.value}>{item.title}</Option>
                    })}
                  </Select>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row> <Col span={12}>
            <Form.Item label="关键路径" {...formItemLayout}>
              {getFieldDecorator('cpmType', {
                initialValue: this.state.info.cpmType ? this.state.info.cpmType.id : null,
                rules: [],
              })(
                <Select onDropdownVisibleChange={this.getCpmtypeList}>
                  {this.state.cpmtypeData1 ? this.state.cpmtypeData1.map(item => {
                    return <Option value={item.id} key={item.id}>{item.name}</Option>
                  }) : this.state.cpmtypeData && this.state.cpmtypeData.map(item => {
                    return <Option value={item.value} key={item.value}>{item.title}</Option>
                  })}
                </Select>
              )}
            </Form.Item>
          </Col>
            {/* <Col span={12}>
              <Form.Item label="工期类型" {...formItemLayout}>
                {getFieldDecorator('taskDrtnType', {
                  initialValue: this.state.info.taskDrtnType ? this.state.info.taskDrtnType.id : null,
                  rules: [],
                })(
                  <Select onDropdownVisibleChange={this.getTaskdrtntypeList}>
                    {this.state.taskdrtntypeData1 ? this.state.taskdrtntypeData1.map(item => {
                      return <Option value={item.id} key={item.id}>{item.name}</Option>
                    }) : this.state.taskdrtntypeData && this.state.taskdrtntypeData.map(item => {
                      return <Option value={item.value} key={item.value}>{item.title}</Option>
                    })}
                  </Select>
                )}
              </Form.Item>
            </Col> */}
            <Col span={12}>
              <Form.Item label="币种" {...formItemLayout}>
                {getFieldDecorator('currencyId', {
                  initialValue: this.state.info.currency ? this.state.info.currency.id : null,
                  rules: [],
                })(
                  <Select onDropdownVisibleChange={this.getCurrencyList}>
                    {this.state.Currencydata1 ? this.state.Currencydata1.map(item => {
                      return <Option value={item.id} key={item.id}>{item.name}</Option>
                    }) : this.state.Currencydata && this.state.Currencydata.map(item => {
                      return <Option value={item.id} key={item.id}>{item.currencyName}</Option>
                    })}
                  </Select>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item label="开启项目团队" {...formItemLayout}>
                {getFieldDecorator('enableProjectTeam', {
                  valuePropName: 'checked',
                  initialValue: this.state.info.enableProjectTeam == 1 ? true : false,
                  rules: [],
                })(
                  <Checkbox/>
                )}
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <LabelFormButton>
          <Button onClick={this.handleSubmit} style={{width: "100px"}} type="primary">保存</Button>
          <Button onClick={this.props.closeRightBox} style={{width: "100px", marginLeft: "20px"}}>取消</Button>
        </LabelFormButton>
      </LabelFormLayout>
    )
  }
}

const mapStateToProps = state => {
  return {
    currentLocale: state.localeProviderData,
  }
};
const VariableSets = Form.create()(VariableSet);
export default connect(mapStateToProps, null)(VariableSets);
