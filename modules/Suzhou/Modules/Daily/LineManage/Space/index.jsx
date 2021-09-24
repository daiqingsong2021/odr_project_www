import React from 'react'
import { Table, Button, InputNumber, Form, Spin, Select, Divider } from 'antd'
import style from './style.less'
import { connect } from 'react-redux'
import { changeLocaleProvider } from '@/store/localeProvider/action'
import * as util from '@/utils/util';
import * as dataUtil from '@/utils/dataUtil';
import { queryStationDistanceFoundationList, updateStationDistanceFoundationList } from '@/modules/Suzhou/api/suzhou-api';
import axios from '@/api/axios';
import notificationFun from '@/utils/notificationTip';
import LabelFormLayout from "@/components/public/Layout/Labels/Form/LabelFormLayout"

class Space extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource1: [], //正线数据
      dataSource2: [],  //辅助线数据
      pageSize: 10,
      currentPageNum: 1,
      activeIndex: '',
      record: '',
      rightData: '',
      loading: false,
    };
  }
  componentDidMount() {
    this.getList()
  }
  //获取主数据
  getList = () => {
    this.setState({ loading: true })
    const { line } = this.props.rightData
    axios.get(queryStationDistanceFoundationList + `?line=${line}`).then(res => {
      let data = res.data.data ? res.data.data : [];
      let dataSource1 = [],  //正线站点
        dataSource2 = []  //辅助线站点
      data.map(value => {
        if(line == '1'){
          if (value.distanceType == '0') {
            dataSource1.push(value)
          } else {
            dataSource2.push(value)
          }
        }else if(line == '3'){
          if (value.distanceType == '0') {
            dataSource1.push(value)
          } else if(value.distanceType == '3'){
            dataSource2.push(value)
          }
        }
      })
      this.setState({
        loading: false,
        dataSource1,
        dataSource2,
        rightData: null,
        selectedRowKeys: [],
      })
    })
  }
  //获取点击行数据
  getInfo = (record) => {
    const { activeIndex } = this.state;
    const { id } = record;
    this.setState({
      activeIndex: id,
      record: record,
      rightData: record
    });
  }
  //输入上行间距
  setChange1 = (value, record, type) => { //type:1为正线里程，2为辅助线里程
    if (type == '1') {
      const newData = [...this.state.dataSource1];
      const index = newData.findIndex(item => record.id === item.id);
      const item = newData[index];
      newData.splice(index, 1, {
        ...item,
        stationUpDistance: value.value,
      });
      this.setState({ dataSource1: newData });
    } else {
      const newData = [...this.state.dataSource2];
      const index = newData.findIndex(item => record.id === item.id);
      const item = newData[index];
      newData.splice(index, 1, {
        ...item,
        stationUpDistance: value.value,
      });
      this.setState({ dataSource2: newData });
    }
  }
  //输入下行间距
  setChange2 = (value, record, type) => { //type:1为正线里程，2为辅助线里程
    if (type == '1') {
      const newData = [...this.state.dataSource1];
      const index = newData.findIndex(item => record.id === item.id);
      const item = newData[index];
      newData.splice(index, 1, {
        ...item,
        stationDownDistance: value.value,
      });
      this.setState({ dataSource1: newData });
    } else {
      const newData = [...this.state.dataSource2];
      const index = newData.findIndex(item => record.id === item.id);
      const item = newData[index];
      newData.splice(index, 1, {
        ...item,
        stationDownDistance: value.value,
      });
      this.setState({ dataSource2: newData });
    }
  }
  //是否为新线里程
  selectChange = (value, record, type) => { //type:1为正线里程，2为辅助线里程
    if (type == '1') {
      const newData = [...this.state.dataSource1];
      const index = newData.findIndex(item => record.id === item.id);
      const item = newData[index];
      newData.splice(index, 1, {
        ...item,
        isNewLine: value.value,
      });
      this.setState({ dataSource1: newData });
    } else {
      const newData = [...this.state.dataSource2];
      const index = newData.findIndex(item => record.id === item.id);
      const item = newData[index];
      newData.splice(index, 1, {
        ...item,
        isNewLine: value.value,
      });
      this.setState({ dataSource2: newData });
    }
  }
  //提交保存
  handleSubmit = () => {
    this.setState({ loading: true })
    const { dataSource1, dataSource2 } = this.state
    const data = [...dataSource1, ...dataSource2]
    if(!data){
      notificationFun("提示","无新增数据！")
      this.getList()
    }
    else{
      axios.put(updateStationDistanceFoundationList, data, true).then(res => {
        this.getList()
      })
    }
   
  }
  //设置table的选中行class样式
  setClassName = (record, index) => {
    return record.id === this.state.activeIndex ? 'tableActivty' : '';
  };
  render() {
    const { dataSource1, dataSource2 } = this.state;
    const { height, record, permission } = this.props
    //正线里程
    const columns = [
      {
        title: '序号',
        dataIndex: 'index',
        width: '10%',
        render: (text, record, index) => index + 1
      },
      {
        title: '站点-站点',
        dataIndex: 'stationUpName',
        width: '10%',
        render: (text, record) => {
          return <span>{`${record.stationUpName}-${record.stationDownName}`}</span>
        }
      },
      {
        title: '上行间距/km',
        dataIndex: 'stationUpDistance',
        width: '10%',
        render: (text, record) => {
          return <InputNumber value={text ? text : 0} step={0.001} min={0} id={'a' + record.id} style={{ width: '100%' }} onChange={(value) => this.setChange1({ value }, record, '1')} />
        }
      },
      {
        title: '下行间距/km',
        dataIndex: 'stationDownDistance',
        width: '15%',
        render: (text, record) => {
          return <InputNumber value={text ? text : 0} step={0.001} min={0} id={'b' + record.id} style={{ width: '100%' }} onChange={(value) => this.setChange2({ value }, record, '1')} />
        }
      },
      {
        title: '是否为新线里程',
        dataIndex: 'isNewLine',
        width: '15%',
        render: (text, record) => {
          return <Select defaultValue={text} id={'c' + record.id} style={{ width: '100%' }} onChange={(value) => this.selectChange({ value }, record, '1')}>
            <Select.Option value={1}>是</Select.Option>
            <Select.Option value={0}>否</Select.Option>
            <Select.Option value={2}>不区分</Select.Option>
          </Select>
        }
      },
    ];
    //辅助线里程
    const columns2 = [
      {
        title: '序号',
        dataIndex: 'index',
        width: '10%',
        render: (text, record, index) => index + 1
      },
      {
        title: '站点-站点',
        dataIndex: 'stationUpName',
        width: '10%',
        render: (text, record) => {
          return <span>{record.line == '3' ? record.stationUpName : `${record.stationUpName}-${record.stationDownName}`}</span>
        }
      },
      {
        title: '上行间距/km',
        dataIndex: 'stationUpDistance',
        width: '10%',
        render: (text, record) => {
          return <InputNumber value={text ? text : 0} step={0.001} min={0} id={'a' + record.id} style={{ width: '100%' }} onChange={(value) => this.setChange1({ value }, record, '2')} />
        }
      },
      {
        title: '下行间距/km',
        dataIndex: 'stationDownDistance',
        width: '15%',
        render: (text, record) => {
          return <InputNumber value={text ? text : 0} step={0.001} min={0} id={'b' + record.id} style={{ width: '100%' }} onChange={(value) => this.setChange2({ value }, record, '2')} />
        }
      },
      {
        title: '是否为新线里程',
        dataIndex: 'isNewLine',
        width: '15%',
        render: (text, record) => {
          return <Select defaultValue={text} id={'c' + record.id} style={{ width: '100%' }} onChange={(value) => this.selectChange({ value }, record, '2')}>
            <Select.Option value={1}>是</Select.Option>
            <Select.Option value={0}>否</Select.Option>
            <Select.Option value={2}>不区分</Select.Option>
          </Select>
        }
      },
    ];
    let pagination = {  //分页
      total: this.state.total,
      // hideOnSinglePage: true,
      size: "small",
      current: this.state.currentPageNum,
      pageSize: this.state.pageSize,
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => `总共${total}条`,
      onShowSizeChange: (current, size) => {
        this.setState({
          pageSize: size,
          currentPageNum: 1
        }, () => {
          this.getList()
        })
      },
      onChange: (page, pageSize) => {
        this.setState({
          currentPageNum: page
        }, () => {
          this.getList()
        })
      }
    }
    return (
      <LabelFormLayout title=''>
        <Spin spinning={this.state.loading}>
          <div>
            <div className={style.search} style={{ background: 'white', position: 'sticky', top: -15, zIndex: 999 }}>
              <div className={style.tipBox}>
                <span className={style.tipSpan}><b>线路：</b>{record.lineName ? record.lineName : ''}</span>
              </div>
              <div>
                {permission.indexOf('LINEMANAGE_TURNING') !== -1 &&
                  <Button type="primary" icon="check" size='small' style={{ marginRight: 10 }} onClick={this.handleSubmit} >保存</Button>}
              </div>
            </div>
            <div style={{ height: height + 30, overflow: 'auto' }}>
              <Divider orientation="left">正线区域站点</Divider>
              <Table
                rowKey={record => record.id}
                rowClassName={this.setClassName}
                bordered
                size="small"
                dataSource={dataSource1}
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
              <Divider orientation="left">正线区域站点-辅助线/车辆段站点</Divider>
              <Table
                rowKey={record => record.id}
                rowClassName={this.setClassName}
                bordered
                size="small"
                dataSource={dataSource2}
                columns={columns2}
                pagination={false}
                onRow={(record, index) => {
                  return {
                    onClick: () => {
                      this.getInfo(record, index)
                    },
                  }
                }}
              />
            </div>
          </div>
        </Spin>
      </LabelFormLayout>
    );
  }
}
const Spaces = Form.create()(Space)
export default connect(state => ({
  currentLocale: state.localeProviderData
}), {
  changeLocaleProvider
})(Spaces);