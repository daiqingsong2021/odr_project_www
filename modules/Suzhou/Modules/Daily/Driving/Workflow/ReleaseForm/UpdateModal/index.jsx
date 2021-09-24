import React, { Component, Fragment } from 'react';
import { Form, Input, Anchor, Select, Divider, DatePicker, InputNumber, Row, Col } from 'antd';
import moment from 'moment';
import style from './style.less';
import intl from 'react-intl-universal';
import { connect } from 'react-redux';
import { curdCurrentData } from '@/store/curdData/action';
import axios from '@/api/axios';
import { getTrainScheduleList ,trainDailUpdate} from '@/modules/Suzhou/api/suzhou-api';
import { getBaseData } from '@/modules/Suzhou/components/Util/util';
const { Item } = Form;
const { Link } = Anchor
const Option = Select.Option;
import LabelFormLayout from "@/components/public/Layout/Labels/Form/LabelFormLayout"

export class AddModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            treeDataZq: [], //当日时刻表数据
            disabled: true,  //默认输入框不可写入
            lineArr: [], //线路
            line: '',    //线路
            record: {},  //修改前数据
        }
    }
    componentDidMount() {
        const { record } = this.props
        this.setState({ 
            record,
        })
        getBaseData('line').then(data => { this.setState({ lineArr: data }) })
        this.getTrainScheduleList(record.line)
    }
    //获取时刻表数据
    getTrainScheduleList = (line) => {
        axios.get(getTrainScheduleList, { params: { scheduleCode: '', line } }).then(res => {
            let data = res.data.data ? res.data.data : []
            this.setState({
                treeDataZq: data,
            })
        })
    }
    //提交数据
    handleSubmit = (val, e) => {
        e.preventDefault();
        this.setState({ showSubmitModal: true })
    }
    //确认提交按钮
    handleSubmitSign = () => {
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (err) {
                this.setState({ showSubmitModal: false })
            } else {
                const recordTime = moment(values.recordTime).format('YYYY-MM-DD')
                const data = { ...values, recordTime ,id:this.props.record.id}
                axios.put(trainDailUpdate, data, true).then(res => {
                    if (res.data.status === 200) {
                        this.setState({ showSubmitModal: false })
                        // this.props.handleCancel()
                        this.props.success(res.data.data);
                    }
                });
            }
        })
    }
    render() {
        const { lineArr, disabled} = this.state
        const { height, record } = this.props
        const { intl } = this.props.currentLocale
        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
        const formLayout = {
            labelCol: {
                sm: { span: 4 },
            },
            wrapperCol: {
                sm: { span: 20 },
            },
        };
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
            <LabelFormLayout>
            <div>
                <Form onSubmit={this.handleSubmitSign}>
                        <div className={style.tipLayout}>
                            <div className={style.tipBox}>
                                <div className={style.topTags}>
                                    <Row type="flex">
                                        <Col span={12}>
                                            <Item label='日期' {...formItemLayout}>
                                                {getFieldDecorator('recordTime', {
                                                    initialValue: record ? moment(record.recordTime, 'YYYY-MM-DD') : null,
                                                    rules: [
                                                        {
                                                            required: true,
                                                            message: '请选择日期',
                                                        },
                                                    ],
                                                })(
                                                    <DatePicker disabled size='small' style={{ width: 150, marginRight: 10 }} />
                                                )}
                                            </Item>
                                        </Col>
                                        <Col span={12}>
                                            <Item label='线路' {...formItemLayout}>
                                                {getFieldDecorator('line', {
                                                    initialValue: record ? record.line : null,
                                                    rules: [
                                                        {
                                                            required: true,
                                                            message: '请选择线路',
                                                        },
                                                    ],
                                                })(
                                                    <Select disabled allowClear showSearch placeholder="请选择线路" size='small' style={{ minWidth: 150, marginRight: 10 }}
                                                        filterOption={(input, option) =>
                                                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                                                        {lineArr.map(item => {
                                                            return <Option key={item.value} value={item.value}>{item.title}</Option>
                                                        })}
                                                    </Select>
                                                )}
                                            </Item>
                                        </Col>
                                    </Row>

                                </div>
                                <div className={style.topTagsBtn}>
                        
                                </div>
                            </div>
                            {/* <div className={style.anchor} >
                                <Anchor>
                                    <Link href="#info" title="运行" />
                                    <Link href="#payPlan" title="调整" />
                                    <Link href="#tongji" title="统计" />
                                    <Link href="#invoice" title="里程" />
                                    <Link href="#change" title="使用" />
                                </Anchor>
                            </div> */}
                        </div>
                        <div className={style.mainBody} style={{height:height+40,overflow:'auto'}}>
                        <Divider orientation="left" id='info' style={{ fontWeight: 'bold' }}>列车日常运行情况</Divider>
                            <Row type="flex">
                                <Col span={8}>
                                        <Item label='时刻表编码' {...formItemLayout}>
                                        {getFieldDecorator('scheduleId', {
                                            initialValue: record.scheduleId,
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '不能为空',
                                                },
                                            ],
                                        })(<Select  disabled={disabled}
                                            showSearch
                                            allowClear={true}
                                            style={{ width: '100%' }}
                                            placeholder="请选择时刻表"
                                            optionFilterProp="children"
                                            filterOption={(input, option) =>
                                                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            }
                                        >
                                            {this.state.treeDataZq.map((value, index) => {
                                                return <Option value={value.id} key={index}>{value.scheduleCode}</Option>
                                            })}
                                        </Select>)}
                                    </Item>
                                </Col>
                                <Col span={8}>
                                    <Item label='最大上线列车数' {...formItemLayout}>
                                        {getFieldDecorator('maxOnlineTrain', {
                                            initialValue: record.trainScheduleVo.maxOnlineTrain,
                                            rules: [],
                                        })(
                                            <Input disabled style={{ width: '100%' }} />
                                        )}
                                    </Item>
                                </Col>
                                <Col span={8}>
                                    <Item label='最小行车间隔' {...formItemLayout}>
                                        {getFieldDecorator('minDrivingInterval', {
                                            initialValue: record.trainScheduleVo.minDrivingInterval,
                                            rules: [],
                                        })(
                                            <Input disabled style={{ width: '100%' }} />
                                        )}
                                    </Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={8}>
                                    <Item label='备用车数' {...formItemLayout}>
                                        {getFieldDecorator('standbyTrain', {
                                            initialValue: record.trainScheduleVo.standbyTrain,
                                            rules: [],
                                        })(
                                            <Input disabled style={{ width: '100%' }} />
                                        )}
                                    </Item>
                                </Col>
                                <Col span={8}>
                                    <Item label='始发站' {...formItemLayout}>
                                        {getFieldDecorator('startStation', {
                                            initialValue: record.trainScheduleVo.startStation,
                                            rules: [],
                                        })(
                                            <Input disabled style={{ width: '100%' }} />
                                        )}
                                    </Item>
                                </Col>
                                <Col span={8}>
                                    <Item label='终点站' {...formItemLayout}>
                                        {getFieldDecorator('endStation', {
                                            initialValue: record.trainScheduleVo.endStation,
                                            rules: [],
                                        })(
                                            <Input disabled style={{ width: '100%' }} />
                                        )}
                                    </Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={8}>
                                    <Item label='计划开行（列）' {...formItemLayout}>
                                        {getFieldDecorator('plannedOperationColumn', {
                                            initialValue: record.trainScheduleVo.plannedOperationColumn,
                                            rules: [],
                                        })(
                                            <Input disabled style={{ width: '100%' }} />
                                        )}
                                    </Item>
                                </Col>
                                <Col span={8}>
                                    <Item label='首班时间' {...formItemLayout}>
                                        {getFieldDecorator('startDriveTime', {
                                            initialValue: record.trainScheduleVo.startDriveTime,
                                            rules: [],
                                        })(
                                            <Input disabled style={{ width: '100%' }} />
                                        )}
                                    </Item>
                                </Col>
                                <Col span={8}>
                                    <Item label='末班时间' {...formItemLayout}>
                                        {getFieldDecorator('endDriveTime', {
                                            initialValue: record.trainScheduleVo.endDriveTime,
                                            rules: [],
                                        })(
                                            <Input disabled style={{ width: '100%' }} />
                                        )}
                                    </Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <Item label='2-5分钟终到早点列次' {...formItemLayout}>
                                        {getFieldDecorator('startingLateColumn_2_5', {
                                            initialValue: record.startingLateColumn_2_5,
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '不能为空',
                                                },
                                            ],
                                        })(<InputNumber style={{ width: '100%' }} min={0} disabled={disabled} />)}
                                    </Item>
                                </Col>
                                <Col span={12}>
                                    <Item label='2-5分钟终到晚点列次' {...formItemLayout}>
                                        {getFieldDecorator('endingLateColumn_2_5', {
                                            initialValue: record.endingLateColumn_2_5,
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '不能为空',
                                                },
                                            ],
                                        })(<InputNumber style={{ width: '100%' }} min={0} disabled={disabled} />)}
                                    </Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <Item label='5-10分钟终到早点列次' {...formItemLayout}>
                                        {getFieldDecorator('startingLateColumn_5_10', {
                                            initialValue: record.startingLateColumn_5_10,
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '不能为空',
                                                },
                                            ],
                                        })(<InputNumber style={{ width: '100%' }} min={0} disabled={disabled} />)}
                                    </Item>
                                </Col>
                                <Col span={12}>
                                    <Item label='5-10分钟终到晚点列次' {...formItemLayout}>
                                        {getFieldDecorator('endingLateColumn_5_10', {
                                            initialValue: record.endingLateColumn_5_10,
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '不能为空',
                                                },
                                            ],
                                        })(<InputNumber style={{ width: '100%' }} min={0} disabled={disabled} />)}
                                    </Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <Item label='10-15分钟终到早点列次' {...formItemLayout}>
                                        {getFieldDecorator('startingLateColumn_10_15', {
                                            initialValue: record.startingLateColumn_10_15,
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '不能为空',
                                                },
                                            ],
                                        })(<InputNumber style={{ width: '100%' }} min={0} disabled={disabled} />)}
                                    </Item>
                                </Col>
                                <Col span={12}>
                                    <Item label='10-15分钟终到晚点列次' {...formItemLayout}>
                                        {getFieldDecorator('endingLateColumn_10_15', {
                                            initialValue: record.endingLateColumn_10_15,
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '不能为空',
                                                },
                                            ],
                                        })(<InputNumber style={{ width: '100%' }} min={0} disabled={disabled} />)}
                                    </Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <Item label='15分钟以上终到早点列次' {...formItemLayout}>
                                        {getFieldDecorator('startingLateColumn_15', {
                                            initialValue: record.startingLateColumn_15,
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '不能为空',
                                                },
                                            ],
                                        })(<InputNumber style={{ width: '100%' }} min={0} disabled={disabled} />)}
                                    </Item>
                                </Col>
                                <Col span={12}>
                                    <Item label='15分钟以上终到晚点列次' {...formItemLayout}>
                                        {getFieldDecorator('endingLateColumn_15', {
                                            initialValue: record.endingLateColumn_15,
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '不能为空',
                                                },
                                            ],
                                        })(<InputNumber style={{ width: '100%' }} min={0} disabled={disabled} />)}
                                    </Item>
                                </Col>
                            </Row>
                            <Divider orientation="left" id='payPlan' style={{ fontWeight: 'bold' }}>列车运行调整列次</Divider>
                            <Row>
                                <Col span={8}>
                                    <Item label='加开（列）' {...formItemLayout}>
                                        {getFieldDecorator('columnJk', {
                                            initialValue: record.columnJk,
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '不能为空',
                                                },
                                            ],
                                        })(<InputNumber disabled={disabled} style={{ width:'100%' }} min={0} />)}
                                    </Item>
                                </Col>
                                <Col span={8}>
                                    <Item label='抽线（列）' {...formItemLayout}>
                                        {getFieldDecorator('columnCx', {
                                            initialValue: record.columnCx,
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '不能为空',
                                                },
                                            ],
                                        })(<InputNumber style={{ width:'100%' }} min={0} disabled={disabled} />)}
                                    </Item>
                                </Col>
                                <Col span={8}>
                                    <Item label='下线（列）' {...formItemLayout}>
                                        {getFieldDecorator('columnXx', {
                                            initialValue: record.columnXx,
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '不能为空',
                                                },
                                            ],
                                        })(<InputNumber disabled={disabled} style={{ width:'100%' }} min={0} />)}
                                    </Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={8}>
                                    <Item label='清客（故障）' {...formItemLayout}>
                                        {getFieldDecorator('columnQk', {
                                            initialValue: record.columnQk,
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '不能为空',
                                                },
                                            ],
                                        })(<InputNumber disabled={disabled} style={{ width:'100%' }} min={0} />)}
                                    </Item>
                                </Col>
                                <Col span={8}>
                                    <Item label='清客（运营调整）' {...formItemLayout}>
                                        {getFieldDecorator('columnYy', {
                                            initialValue: record.columnYy,
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '不能为空',
                                                },
                                            ],
                                        })(<InputNumber disabled={disabled} style={{ width:'100%' }} min={0} />)}
                                    </Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={8}>
                                    <Item label='救援（列）' {...formItemLayout}>
                                        {getFieldDecorator('columnJy', {
                                            initialValue: record.columnJy,
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '不能为空',
                                                },
                                            ],
                                        })(<InputNumber disabled={disabled} style={{ width:'100%' }} min={0} />)}
                                    </Item>
                                </Col>
                                <Col span={8}>
                                    <Item label='跳停（列）' {...formItemLayout}>
                                        {getFieldDecorator('columnTt', {
                                            initialValue: record.columnTt,
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '不能为空',
                                                }
                                            ],
                                        })(<InputNumber disabled={disabled} style={{ width:'100%' }} min={0} />)}
                                    </Item>
                                </Col>
                            </Row>
                            <Divider orientation="left" id='tongji' style={{ fontWeight: 'bold' }}>列车运行统计</Divider>
                            <Row>
                                <Col span={8}>
                                    <Item label='实际开行（列）' {...formItemLayout}>
                                        {getFieldDecorator('actualOperatingColumn', {
                                            initialValue: record.actualOperatingColumn,
                                            rules: [
                                            ],
                                        })(
                                            <InputNumber min={0} disabled style={{ width: '100%' }} />
                                        )}
                                    </Item>
                                </Col>
                                <Col span={8}>
                                    <Item label='兑现率' {...formItemLayout}>
                                        {getFieldDecorator('fulfillmentRate', {
                                            initialValue: record.fulfillmentRate,
                                            rules: [],
                                        })(
                                            <Input disabled style={{ width: '100%' }} suffix="%"/>
                                        )}
                                    </Item>
                                </Col>
                                <Col span={8}>
                                    <Item label='准点率' {...formItemLayout}>
                                        {getFieldDecorator('onTimeRate', {
                                            initialValue: record.onTimeRate,
                                            rules: [],
                                        })(
                                            <Input disabled style={{ width: '100%' }} suffix="%"/>
                                        )}
                                    </Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={8}>
                                    <Item label='终到早点（列）' {...formItemLayout}>
                                        {getFieldDecorator('arriveEarlyColumn', {
                                            initialValue: record.arriveEarlyColumn,
                                            rules: [],
                                        })(
                                            <InputNumber min={0} disabled style={{ width: '100%' }} />
                                        )}
                                    </Item>
                                </Col>
                                <Col span={8}>
                                    <Item label='终到准点（列）' {...formItemLayout}>
                                        {getFieldDecorator('arriveOntimeColumn', {
                                            initialValue: record.arriveOntimeColumn,
                                            rules: [],
                                        })(
                                            <InputNumber min={0} disabled style={{ width: '100%' }} />
                                        )}
                                    </Item>
                                </Col>
                                <Col span={8}>
                                    <Item label='终到晚点（列）' {...formItemLayout}>
                                        {getFieldDecorator('arriveLateColumn', {
                                            initialValue: record.arriveLateColumn,
                                            rules: [],
                                        })(
                                            <InputNumber min={0} disabled style={{ width: '100%' }} />
                                        )}
                                    </Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={8}>
                                    <Item label='当日晚点（列）' {...formItemLayout}>
                                        {getFieldDecorator('dayLate', {
                                            initialValue: record.dayLate,
                                            rules: [],
                                        })(
                                            <InputNumber min={0} disabled style={{ width: '100%' }} />
                                        )}
                                    </Item>
                                </Col>
                            </Row>
                            <Divider orientation="left" id='invoice' style={{ fontWeight: 'bold' }}>列车运行里程</Divider>
                            <Row>
                                <Col span={8}>
                                    <Item label='载客里程' {...formItemLayout}>
                                        {getFieldDecorator('carryingKilometres', {
                                            initialValue: record.carryingKilometres,
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '不能为空',
                                                },
                                            ],
                                        })(<InputNumber disabled={disabled} style={{ width:'100%' }} min={0} />)}
                                    </Item>            
                                </Col>
                                <Col span={8}>
                                    <Item label='空驶里程' {...formItemLayout}>
                                        {getFieldDecorator('deadheadKilometres', {
                                            initialValue: record.deadheadKilometres,
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '不能为空',
                                                },
                                            ],
                                        })(<InputNumber disabled={disabled} style={{ width:'100%' }} min={0} />)}
                                    </Item>            
                                </Col>
                                <Col span={8}>
                                    <Item label='运营里程' {...formItemLayout}>
                                        {getFieldDecorator('operatingKilometres', {
                                            initialValue: record.operatingKilometres,
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '不能为空',
                                                },
                                            ],
                                        })(<InputNumber disabled style={{ width:'100%' }} min={0} />)}
                                    </Item>            
                                </Col>
                            </Row>
                            <Divider orientation="left" id='change' style={{ fontWeight: 'bold' }}>列车使用情况</Divider>
                            <Row>
                                <Col span={8}>
                                    <Item label='运用车' {...formItemLayout}>
                                        {getFieldDecorator('useCar', {
                                            initialValue: record.useCar,
                                        })(
                                            <Input disabled style={{ width:'100%' }} />
                                        )}
                                    </Item>          
                                </Col>
                                <Col span={8}>
                                    <Item label='备用车' {...formItemLayout}>
                                        {getFieldDecorator('spareCar', {
                                            initialValue: record.spareCar,
                                        })(
                                            <Input disabled style={{ width:'100%' }} />
                                        )}
                                    </Item>          
                                </Col>
                                <Col span={8}>
                                    <Item label='调试车' {...formItemLayout}>
                                        {getFieldDecorator('debugCar', {
                                            initialValue: record.debugCar,
                                        })(
                                            <Input disabled style={{ width:'100%' }} />
                                        )}
                                    </Item>          
                                </Col>
                            </Row>
                            <Row>
                                <Col span={8}>
                                    <Item label='检修车' {...formItemLayout}>
                                        {getFieldDecorator('inspectionCar', {
                                            initialValue: record.inspectionCar,
                                        })(
                                            <Input disabled style={{ width:'100%' }} />
                                        )}
                                    </Item>          
                                </Col>
                                <Col span={8}>
                                    <Item label='备注' {...formItemLayout}>
                                        {getFieldDecorator('other', {
                                            initialValue: record.other,
                                            rules: [

                                            ],
                                        })(
                                            <Input.TextArea disabled={disabled} style={{ width:'100%' }} />
                                        )}
                                    </Item>          
                                </Col>
                            </Row>
                        </div>
                    {/* </Modal> */}
                </Form>
            </div>
            </LabelFormLayout>
        )
    }
}
const AddModals = Form.create()(AddModal);
export default connect(state => ({
    currentLocale: state.localeProviderData,
}))(AddModals);