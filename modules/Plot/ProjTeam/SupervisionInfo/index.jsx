import React, { Component } from 'react'
import { Table, notification } from 'antd';
import style from './style.less'
import PublicButton from "../../../../components/public/TopTags/PublicButton"
import { connect } from 'react-redux'
import axios from '@/api/axios'
import { getJlSectionList ,deleteJlSection  ,addJlSection} from '@/api/api'
import SelectUserRole from './SelectUserRole';

class SupervisionInfo extends Component {
  constructor(props) {
    super(props)
    this.state = {
      pageSize: 10,
      currentPage: 1,
      data: [],
      selectedRowKeys: [],
    }
  }

  componentDidMount() {
    this.getDataList();
  }

  getDataList = () => {
    let { rightData } = this.props
    const sectionId = rightData.id
    axios.get(getJlSectionList(sectionId, this.state.pageSize, this.state.currentPage)).then(res => {
      if (res.data.data.length) {
        this.setState({
          data: res.data.data,
          total:res.data.total
        }) 
      }else{
        this.setState({
          data: [],
          total:0
        }) 
      }
    })
  }

  //删除验证
  deleteVerifyCallBack = () => {
    let { selectedRowKeys } = this.state;
    if (selectedRowKeys == 0) {
      notification.warning(
        {
          placement: 'bottomRight',
          bottom: 50,
          duration: 2,
          message: '未选中数据',
          description: '请选择勾选数据进行操作'
        }
      )
      return false
    } else {
      return true
    }
  }
  delete = () => {
    let data = []
    const sgbId = this.props.rightData.id 
    this.state.selectedRowKeys && this.state.selectedRowKeys.map((item)=>{
      data.push({sgbId,jlbId:item})
    })
    axios.deleted(deleteJlSection, {data}, true).then(res => {
      this.getDataList()
    })
  }

  assignUser = () => {
    if (!this.props.rightData) {
      notification.warning({
        placement: 'bottomRight',
        bottom: 50,
        duration: 2,
        message: '未选中数据',
        description: '请选择数据进行操作'
      });
      return;
    }
    this.setState({
      SelectUserRoleType: true
    })
  }
  closeSelectUserRoleModal = () => {
    this.setState({
      SelectUserRoleType: false
    })
  }

  //控制分配弹窗开关
  closeDistributeModal = () => {
    this.setState({
      distributeType: false
    })
  }

  setClassName = (record, index) => {
    //判断索引相等时添加行的高亮样式
    return record.id === this.state.activeIndex ? "tableActivty" : "";
  }
  getInfo = (record, index) => {
    this.setState({
      activeIndex: record.id,
      record: record
    })
  }

  handleOk = (id) => {
    let data = []
    const sgbId = this.props.rightData.id 
    id && id.map((item)=>{
      data.push({sgbId,jlbId:item})
    })
    axios.post(addJlSection, data, true).then(res => {
      this.getDataList();
      this.closeSelectUserRoleModal();
    })
  }

  render() {
    const { intl } = this.props.currentLocale;
    const columns = [
      {
        title: "序号",
        render: (text, record, index) => `${index + 1}`
      },
      {
        title: "名称",
        dataIndex: 'teamName',
        key: 'teamName',
      },
      {
        title: "代码",
        dataIndex: 'teamCode',
        key: 'teamCode',
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
    let pagination = {
      total: this.state.total,
      // hideOnSinglePage: true,
      current: this.state.currentPage,
      pageSize: this.state.pageSize,
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => `总共${this.state.total}条`,
      onShowSizeChange: (current, size) => {
        this.setState({
          pageSize: size,
          currentPage: 1
        }, () => {
          this.getDataList()
        })
      },
      onChange: (page, pageSize) => {
        this.setState({
          currentPage: page
        }, () => {
          this.getDataList()
        })
      }
    }
    return (
      <div className={style.main}>
        <h3 className={style.listTitle}>监理标配置</h3>
        <div className={style.rightTopTogs}>
          {/*分配*/}
          <PublicButton name={'分配'} title={'分配'} edit={this.props.projectTeamEditAuth} icon={'icon-fenpeirenyuan'} afterCallBack={this.assignUser} />
          {/*删除*/}
          <PublicButton title={"删除"} edit={this.props.projectTeamEditAuth} useModel={true} verifyCallBack={this.deleteVerifyCallBack} afterCallBack={this.delete} icon={"icon-delete"} />
          {
            this.state.SelectUserRoleType && (
              <SelectUserRole visible={true}
                sectionId={this.props.rightData.id}
                handleOk={this.handleOk}
                handleCancel={this.closeSelectUserRoleModal.bind(this)} />
            )
          }
        </div>
        <div className={style.mainScorll}>
          <Table
            rowKey={record => record.id}
            className={style.table}
            columns={columns}
            dataSource={this.state.data}
            pagination={false}
            size='small'
            name={this.props.name}
            rowClassName={this.setClassName}
            rowSelection={rowSelection}
            pagination={pagination}
            onRow={(record, index) => {
              return {
                onClick: () => {
                  this.getInfo(record, index)
                },
                onDoubleClick: (event) => {
                  event.currentTarget.getElementsByClassName("ant-checkbox-wrapper")[0].click();
                }
              }
            }
            }
          />
        </div>
      </div>
    )
  }
}

export default connect(state => ({
  currentLocale: state.localeProviderData
}))(SupervisionInfo)
