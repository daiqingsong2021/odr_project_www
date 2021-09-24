import React from 'react'
import style from './style.less'
import { Table, Modal } from 'antd';
import axios from '@/api/axios'
import { connect } from 'react-redux'
import SubmitButton from "@/components/public/TopTags/SubmitButton"
import {getXyJlSectionList} from '@/api/api'
//分配modal
class SelectUserRole extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      selectedRowKeys: [],
    }
  }
  componentDidMount() {
    this.getList()
  }
  // 获取数据列表
  getList=()=>{
    axios.get(getXyJlSectionList(this.props.sectionId)).then(res => {
      if (res.data.data.length) {
        this.setState({
          data: res.data.data
        }) 
      }
    })
  }
  //确认操作
  handleOk = () => {
    this.props.handleOk(this.state.selectedRowKeys);
    this.props.handleCancel()
  }
  //取消操作
  handleCancel = () => {
    this.props.handleCancel()
  }
  getInfo = (record, index) => {
    this.setState({
      activeIndex: record.id,
      record: record
    })
  }
  setClassName = (record, index) => {
    //判断索引相等时添加行的高亮样式
    return record.id === this.state.activeIndex ? "tableActivty" : "";
  }
  render() {
    const { intl } = this.props.currentLocale
    const columns = [
      {
        title: "序号",
        render: (text, record, index) => `${index + 1}`,
        width:'10%'
      },
      {
        title: "名称",
        dataIndex: 'teamName',
        key: 'teamName',
        width:'70%'
      },
      {
        title: "代码",
        dataIndex: 'teamCode',
        key: 'teamCode',
        width:'20%'
      }
    ]
    let { selectedRowKeys } = this.state
    const rowSelection = {
      selectedRowKeys,
      onChange: (selectedRowKeys) => {
        this.setState({
          selectedRowKeys,
        })
      }
    }

    return (
      <div>
        <Modal className={style.main}
          bodyStyle={{ height: 400 }}
          title="分配"
          width={900}
          onCancel={this.handleCancel}
          mask={false}
          maskClosable={false}
          visible={true}
          footer={<div className="modalbtn">
            <SubmitButton key={1} onClick={this.handleCancel} content="取消" />
            <SubmitButton key={2} onClick={this.handleOk} type="primary" content="保存" />
          </div>}
        >
          <div className={style.box}>
            <Table className={style.tableBox}
              onCancel={this.handleCancel}
              rowKey={record => record.id}
              columns={columns}
              scroll={{ y: 270 }}
              dataSource={this.state.data} 
              pagination={false}
              size="small"
              rowSelection={rowSelection}
              rowClassName={this.setClassName}
              onRow={(record, index) => {
                return {
                  onClick: () => {
                    this.getInfo(record, index)
                  },
                  onDoubleClick: (event) => {
                    event.currentTarget.getElementsByClassName("ant-checkbox-wrapper")[0].click();
                  }
                }
              }}    
            />
          </div>
        </Modal>
      </div>
    )
  }
}

export default connect(state => ({
  currentLocale: state.localeProviderData
}))(SelectUserRole)
