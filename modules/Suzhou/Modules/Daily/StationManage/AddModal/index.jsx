import React, { Component, Fragment } from 'react'
import { Modal, Input, Row, Form, Col, Select, Button, Table, Divider } from 'antd'
import moment from 'moment'
import style from './style.less'
import { connect } from 'react-redux'
import { changeLocaleProvider } from '@/store/localeProvider/action'
import * as util from '@/utils/util';
import * as dataUtil from '@/utils/dataUtil';
import { getBaseData } from '@/modules/Suzhou/components/Util/util';
import { addStationFoundationList, getStationList ,checkStationFoundationIsHave,queryStationFoundationList,addStationRoute,queryStationListByParam} from '@/modules/Suzhou/api/suzhou-api';
import axios from '@/api/axios';
import notificationFun from '@/utils/notificationTip';
import { contractLaborOfflineadd } from '../../../../../../api/api'

const { Item } = Form
const { Option } = Select
class AddModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lineArr: [],
      stationType: [],
      stationArr: [],
      dataSource:[
        {
          id: 1, rowType: 'title',  startStationName: '', endStationName: '', 
        }
      ],
      idTemp:1,
      stationFZArr:[]
    };
  }
  componentDidMount() {
    getBaseData('station.type').then(data => { this.setState({ stationType: data }) })
    getBaseData('line').then(data => { this.setState({ lineArr: data }) })
  }
  //获取正线站点
  getStationList = (line) => {
    axios.get(getStationList + `?line=${line}&status=0`).then(res => {
      this.setState({ stationArr: res.data.data })
    })
  }
  //获取3号线所有正线和辅助线站点
  getStationFZ=()=>{
  //   axios.get(queryStationFoundationList, { params: { line:3, stationType:'' } }).then(res => {
  //     let data = res.data.data ? res.data.data : []
  //     this.setState({
  //         stationFZArr:data,
  //     })
  // })
  const line = '3',
  stationType = '0,1,2',
  stationCode = '',
  startStationCode = ''
  axios.get(queryStationListByParam + `?line=${line}&stationType=${stationType}&stationCode=${stationCode}&startStationCode=${startStationCode}`).then(res => {
    const data = res.data.data ? res.data.data : []
    this.setState({
        stationFZArr:data,
    })
  })
  }
  //选择线路
  selectLineFun = (value) => {
    if (this.props.tabKey !== '1') {
      this.getStationList(value)
    }
    if(this.props.tabKey == '3'){
      this.getStationFZ()
    }
  }
  //提交
  handleSubmit = (type, e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (err) {
      } else {
        if(this.props.tabKey == '3'){
          const data = {
            stationCode:values.stationCode,
            stationName:values.stationName,
            line:values.line,
            stationList:this.state.dataSource
          }
          if (type == 'goOn') {
            this.props.form.resetFields()
          } else if (type == 'save') {
            this.props.handleCancel()
          }
          axios.post(addStationRoute,data).then(res=>{
            this.props.success()
          })
        }else{
          const relationStation = values.relationStation ? values.relationStation.join(',') : ''
          const data = [{ ...values, relationStation }]
          if (type == 'goOn') {
            this.props.form.resetFields()
          } else if (type == 'save') {
            this.props.handleCancel()
          }
          axios.get(checkStationFoundationIsHave + `?stationCode=${data[0].stationCode}&line=${data[0].line}&stationType=${data[0].stationType}`).then(res => {
            if (res.data.data == '0') {
              notificationFun('警告','该线路中列车编号已存在');
            } else {
              axios.post(addStationFoundationList, data, true).then(() => {
                this.props.success()
              });
            }
          })
        }
  
      }
      
    })
  }
  //新增一行
  addFun = () => {
    let { idTemp } = this.state
        let { dataSource } = this.state
        idTemp++
        dataSource.push({
          id: idTemp, rowType:'body',  startStationName: '', endStationName: ''
        })

        this.setState({ dataSource, idTemp })
  }
  // 删除一行
  deleteFun = (record) => {
        let { dataSource } = this.state
        const index= dataSource.findIndex(item => record.id == item.id)
        dataSource.splice(index, 1)
        this.setState({ dataSource })
  }
  //数据录入
  selectLines = (value, option, record, dataType) => {
    let { dataSource } = this.state
    if(value == undefined){
      value = ''
    }
    console.log(option)
        const index = dataSource.findIndex(item => record.id == item.id)
        if (dataType == 'endStation') {
          dataSource[index].endStationName = option.props.stationName
          dataSource[index].endStationId = value
          
        } else if (dataType == 'startStation') {
          dataSource[index].startStationName = option.props.stationName
          dataSource[index].startStationId = value
        } 
        this.setState({ dataSource })
  }
  //获取点击行数据
  getInfo = (record) => {
    const { id } = record;
    this.setState({
      activeIndex: id,
      record: record,
    });
  }
   //设置table的选中行class样式
   setClassName = (record, index) => {
    return record.id === this.state.activeIndex ? 'tableActivty' : '';
  };
  render() {
    const { lineArr, stationArr, stationType, dataSource,stationFZArr } = this.state;
    const { height, record, permission } = this.props
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
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
    const columns = [
      {
        title: '序号',
        dataIndex: 'index',
        render: (text, record,index) => {
          return index + 1 
        }
      },
      {
        title: '线路首站',
        dataIndex: 'startStationName',
        render: (text, record) => {
          return <span><Item style={{ margin: 0 }}>
            {this.props.form.getFieldDecorator(`startStationName${record.id}`, {
              initialValue: text ? text : '',
              rules: [
                {
                  
                },
              ],
            })(<Select showSearch placeholder="请选择" disabled={false} allowClear
              style={{ width: 150 }}
              onChange={(value,option) => this.selectLines(value, option, record, 'startStation')} filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
              {stationFZArr.map(item => {
                return <Option key={item.stationCode} stationName={item.stationName} value={item.stationCode}>{item.stationName}</Option>
              })}
            </Select>)}
          </Item></span>
        }
      },
      {
        title: '线路末站',
        dataIndex: 'endStationName',
        render: (text, record) => {
          return <span><Item style={{ margin: 0 }}>
            {this.props.form.getFieldDecorator(`endStationName${record.id}`, {
              initialValue: text ? text : '',
              rules: [

              ],
            })(<Select showSearch placeholder="请选择" disabled={false} allowClear
              style={{ width: 150 }}
              onChange={(value,option) => this.selectLines(value, option, record, 'endStation')} filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
              {stationFZArr.map((item, index) => {
                return <Option key={item.stationCode} stationName={item.stationName} value={item.stationCode}>{item.stationName}</Option>
              })}
            </Select>)}
          </Item></span>
        }
      },
      {
        title: '操作',
        dataIndex: 'operation',
        render: (text, record, index) => {
          return <span>
                {record.rowType == 'title' && <a onClick={() => this.addFun(record)} style={{ marginRight: 5 }}>新增</a>}
                {record.rowType == 'body' && <a onClick={() => this.deleteFun(record)}>删除</a>}
          </span>
        }
      },
    ]
    return (
      <Modal title={this.props.tabKey == '3'? '新建辅线线路' :"新增站点"}
        visible={this.props.modalVisible}
        onOk={this.handleSubmit}
        onCancel={this.props.handleCancel}
        width='500px'
        mask={false}
        maskClosable={false}
        footer={[
          <Button key={1} onClick={this.handleSubmit.bind(this, 'goOn')}>
            保存并继续
            </Button>,
          <Button key={2} onClick={this.handleSubmit.bind(this, 'save')} type="primary">
            保存
            </Button>
        ]}>
        <Form onSubmit={this.handleSubmit}>
          <Row type="flex">
            <Col span={24}>
              <Item label={this.props.tabKey == '3'?'线路编号':'站点编号'} {...formItemLayout}>
                {getFieldDecorator('stationCode', {
                  rules: [
                    {
                      required: true,
                      message: '请输入站点编号',
                    },
                  ],
                })(
                  <Input placeholder="请输入站点编号" />
                )}
              </Item>
            </Col>
            <Col span={24}>
              <Item label={this.props.tabKey == '3'?'线路名称':'站点名称'} {...formItemLayout}>
                {getFieldDecorator('stationName', {
                  rules: [
                    {
                      required: true,
                      message: '请输入站点名称',
                    },
                  ],
                })(
                  <Input placeholder="请输入站点名称" />
                )}
              </Item>
            </Col>
            {this.props.tabKey !== '3' && <Col span={24}>
              <Item label='站点类型' {...formItemLayout}>
                {getFieldDecorator('stationType', {
                  rules: [
                    {
                      required: true,
                      message: '请选择站点类型',
                    },
                  ],
                })(
                  <Select allowClear showSearch placeholder="请选择站点类型" style={{ width: '100%' }}
                    onChange={this.selectOnChange} filterOption={(input, option) =>
                      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                    {stationType.map(item => {
                      return <Option key={item.value} value={item.value}>{item.title}</Option>
                    })}
                  </Select>
                )}
              </Item>
            </Col>}
            <Col span={24}>
              <Item label='所属线路' {...formItemLayout}>
                {getFieldDecorator('line', {
                  rules: [
                    {
                      required: true,
                      message: '请选择所属线路',
                    },
                  ],
                })(
                  <Select allowClear showSearch placeholder="请选择线路" style={{ width: '100%' }}
                    onChange={this.selectLineFun} filterOption={(input, option) =>
                      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                    {lineArr.map(item => {
                      return <Option key={item.value} value={item.value}>{item.title}</Option>
                    })}
                  </Select>
                )}
              </Item>
            </Col>
            {/* {this.props.tabKey == '1' && <Col span={24}>
              <Item label='上行线站点序号' {...formItemLayout}>
                {getFieldDecorator('stationNum', {
                  rules: [
                    {
                      required: true,
                      message: '请输入',
                    },
                  ],
                })(
                  <InputNumber min={0} placeholder="请输入" style={{ width: '100%' }} />
                )}
              </Item>
            </Col>} */}
            {this.props.tabKey == '1' && <Col span={24}>
              <Item label='是否换乘站' {...formItemLayout}>
                {getFieldDecorator('isChangeStation', {
                  rules: [
                    {
                      required: true,
                      message: '请选择',
                    },
                  ],
                })(
                  <Select allowClear showSearch placeholder="请选择" style={{ width: '100%' }}
                    onChange={this.selectOnChange} filterOption={(input, option) =>
                      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                    <Option key='0' value='0'>否</Option>
                    <Option key='1' value='1'>是</Option>
                  </Select>
                )}
              </Item>
            </Col>}
            {this.props.tabKey == '2' && <Col span={24}>
              <Item label='关联站点' {...formItemLayout}>
                {getFieldDecorator('relationStation', {
                  rules: [
                    // {
                    //   required: true,
                    //   message: '请选择关联站点',
                    // },
                  ],
                })(
                  <Select mode='multiple' allowClear showSearch placeholder="请选择关联站点" style={{ width: '100%' }}
                    onChange={this.selectOnChange} filterOption={(input, option) =>
                      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                    {stationArr.map(item => {
                      return <Option key={item.id} value={item.stationCode}>{item.stationName}</Option>
                    })}
                  </Select>
                )}
              </Item>
            </Col>}
          </Row>
            {
              this.props.tabKey == '3' && 
              <Row key={5}>
                <Divider orientation="left">录入辅助线路</Divider>
                <Table
                  rowKey={record => record.id}
                  rowClassName={this.setClassName}
                  bordered
                  size="small"
                  dataSource={dataSource}
                  columns={columns}
                  pagination={false}
                  onRow={(record, index) => {
                    return {
                      onClick: () => {
                        this.getInfo(record, index)
                      },
                    }
                  }}
                />
              </Row>
            }
        </Form>
      </Modal>
    );
  }
}
const AddModals = Form.create()(AddModal);
export default connect(state => ({
  currentLocale: state.localeProviderData
}), {
  changeLocaleProvider
})(AddModals);