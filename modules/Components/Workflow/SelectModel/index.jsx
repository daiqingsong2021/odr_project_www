import React, {Component} from 'react'
import style from './style.less'
import {Modal, Table, Button} from 'antd';
import Search from '../../../../components/public/Search'
import '../../../../asserts/antd-custom.less'
import MyIcon from '../../../../components/public/TopTags/MyIcon'
import axios from "../../../../api/axios"
import * as dataUtil from "../../../../utils/dataUtil"
import {getWorkflowModels} from '../../../../api/api'

export class SelectModel extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      initData: [],
      currentData: [],
      activeIndex: []
    }
  }

  setClassName = (record) => {
    //判断索引相等时添加行的高亮样式
    return record.id === this.state.activeIndex ? 'tableActivty' : "";
  }

  componentDidMount() {
    this.initDatas();
  }

  initDatas = () => {
    axios.get(getWorkflowModels(this.props.bizTypeCode)).then(res => {
      let data = res.data.data;
      this.setState({
        data,
        initData: data
      });
    })
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const {activeIndex} = this.state;
    if (!activeIndex || activeIndex.length == 0) {
      dataUtil.message("请勾选数据再操作");
      return;
    }
    this.props.handleOk(this.state.selectData[0]);
    this.props.handleCancel();
  }

  search = (value) => {
    const {initData} = this.state;
    let newData = dataUtil.search(initData, [{"key": "name|code", "value": value}], true);
    this.setState({data: newData});
  }

  render() {
    const columns = [
      {
        title: "流程标题",
        dataIndex: 'name',
        key: 'name',
        render: (text, record) => {
          return <span><MyIcon type="icon-liuchengguanli-" style={{fontSize: '18px', marginRight: '8px'}}/>{text}</span>
        }
      }
    ]
    const rowSelection = {
      selectedRowKeys: this.state.activeIndex,
      type: "radio",
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({
          activeIndex: selectedRowKeys,
          selectData: selectedRows
        })
      }
    };
    return (
      <Modal className={style.main} width="650px" centered={true}
             title={"选择流程"} visible={true} onCancel={this.props.handleCancel} bodyStyle={{padding: 0}} footer={
        <div className="modalbtn">
          <Button key="1" onClick={this.props.handleCancel}>取消</Button>
          <Button key="2" type="primary" onClick={this.handleSubmit}>确定</Button>
        </div>
      }>
        <div className={style.tableMain}>
          <Table
            rowKey={record => record.id}
            defaultExpandAllRows={true}
            pagination={false}
            name={this.props.name}
            columns={columns}
            rowSelection={rowSelection}
            dataSource={this.state.data}
            rowClassName={this.setClassName}
            onRow={() => {
              return {
                onClick: (event) => {
                }
              }
            }
            }
          />
        </div>
      </Modal>
    )
  }
}

export default SelectModel
