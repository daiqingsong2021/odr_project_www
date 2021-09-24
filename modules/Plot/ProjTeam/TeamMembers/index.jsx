import React, { Component } from 'react'
import { Table, notification, Select } from 'antd';
import style from './style.less'
import PublicButton from "../../../../components/public/TopTags/PublicButton"
import { connect } from 'react-redux'
import axios from '../../../../api/axios'
import { roleList, prepaProjectteamUserList, prepaProjectteamUserUpdate, prepaProjectteamUserDel, prepaProjectteamUserTreeAdd } from '../../../../api/api'
import { updateUserByUserIdAndUpOrDown_ } from '../../../../api/suzhou-api'
import SelectUserRole from '../../../Components/Window/SelectUserRole';

class TeamMembers extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      selectedRowKeys: [],
    }
  }

  componentDidMount() {
    this.getRoleList();
    this.getDataList();
  }

  getRoleList = () => {
    //获取用户角色
    axios.get(roleList).then(res => {
      this.setState({
        rolelist: res.data.data
      })
    })
  }

  getDataList = () => {
    let { rightData } = this.props
    axios.get(prepaProjectteamUserList(rightData.id)).then(res => {
      let data = res.data.data;
      if (res.data.data.length) {
        let arr = [];
        for (let i = 0; i < data.length; i++) {
          if (data[i].roles) {
            for (let j = 0; j < data[i].roles.length; j++) {
              arr.push(data[i].roles[j].id);
            }
            data[i].roles = arr;
            arr = [];
          }
        }
      }
      this.setState({
        data: data
      })
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
    let { selectedRowKeys } = this.state;
    axios.deleted(prepaProjectteamUserDel, { data: selectedRowKeys }, true).then(res => {
      //
      let copyData = [...this.state.data]
      selectedRowKeys.map((item) => {
        let ind = copyData.findIndex(val => val.id == item)
        if (ind != -1) {
          copyData = [...copyData.slice(0, ind), ...copyData.slice(ind + 1)]
        }
      })
      this.setState({
        data: copyData,
        selectedRowKeys: []
      })
    })
  }

  //团队成员排序
  updateUserByUserIdAndUpOrDown = (upOrDown) => {
    let { record } = this.state;
    if(record){
      let rightData = this.props.rightData;
      axios.put(updateUserByUserIdAndUpOrDown_(rightData.id,record.id, upOrDown), true).then(res => {
          this.setState({
            data:res.data.data
          })
      })
    }
  }

  handleSelectdata = (record, val) => {
    let userId = record.user ? record.user.id : null;
    axios.put(prepaProjectteamUserUpdate(record.teamId, userId), val, true).then(res => {
      //
    })
  };

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

  assignUserOk = (data) => {
    axios.post(prepaProjectteamUserTreeAdd(this.props.rightData.id), data, true).then(res => {
      this.getDataList();
      this.closeSelectUserRoleModal();
    })
  };

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

  handleOk = (data) => {
    let addData = [];
    for (let i = 0; i < data.length; i++) {
      let dat = data[i];
      let obj = {
        bizId: this.props.bizId,
        bizType: this.props.bizType,
        cprtmId: dat.id,
        cprtmType: dat.type
      }
      addData.push(obj)
    }
    axios.post(cprtmAdd, addData, true).then(res => {
      this.getDataList();
      this.closeDistributeModal();
    })
  }

  render() {
    const { intl } = this.props.currentLocale;
    const columns = [
      {
        title: intl.get("wsd.i18n.plan.prepa.username"),//用户名称
        dataIndex: 'user',
        key: 'actuName',
        render: text => <span>{text.name}</span>
      },
      {
        title: intl.get("wsd.i18n.plan.prepa.userid"),//用户账号
        dataIndex: 'user',
        key: 'userName',
        render: text => <span>{text.code}</span>
      },
      {
        title: intl.get("wsd.i18n.plan.prepa.userrole"),//用户角色
        dataIndex: 'roles',
        key: 'roles',
        render: (text, record) => {
          return <Select style={{ width: "100%" }} defaultValue={text} onChange={this.handleSelectdata.bind(this, record)}
            mode="multiple"
          >
            {this.state.rolelist && this.state.rolelist.map(item => {
              return <Option value={item.id} key={item.id}>{item.roleName}</Option>
            })}
          </Select>
        }
      },
      {
        title: "职务",
        dataIndex: 'position',
        key: 'position',
        render: (text, record) => {
          let ret = text && this.props.positionMap && this.props.positionMap[text] ? this.props.positionMap[text] : text;
          return ret;
        }
      },
      {
        title: "专业",
        dataIndex: 'professional',
        key: 'professional',
        render: (text, record) => {
          //let ret = text && this.state.professionalMap[text] ? this.state.professionalMap[text] : text;
          let ret = '';
          if (text && this.props.professionalMap) {
            let ec5 = text.split(',');
            ec5.map((item, index) => {
              ret = ret == '' ? this.props.professionalMap[item] : ret + ',' + this.props.professionalMap[item];
            }, this)
          }
          return ret;
        }
      }
    ];
    let { selectedRowKeys } = this.state
    const rowSelection = {
      selectedRowKeys,
      onChange: (selectedRowKeys) => {
        this.setState({
          selectedRowKeys,
        })
      }
    };
    return (
      <div className={style.main}>
        <h3 className={style.listTitle}>{this.props.groupCode == '1'?'团队成员':'业主成员'}</h3>
        <div className={style.rightTopTogs}>
          {/*分配*/}
          <PublicButton name={'分配'} title={'分配'} edit={this.props.projectTeamEditAuth} icon={'icon-fenpeirenyuan'} afterCallBack={this.assignUser} />
          {/*删除*/}
          <PublicButton title={"删除"} edit={this.props.projectTeamEditAuth} useModel={true} verifyCallBack={this.deleteVerifyCallBack} afterCallBack={this.delete} icon={"icon-delete"} />
          <PublicButton title={'上移'} icon={'icon-moveUp'}
            afterCallBack={this.updateUserByUserIdAndUpOrDown.bind(this, 'up')} />
          <PublicButton title={'下移'} icon={'icon-moveDown'}
            afterCallBack={this.updateUserByUserIdAndUpOrDown.bind(this, 'down')} />
          {
            this.state.SelectUserRoleType && (
              <SelectUserRole visible={true}
                record={this.state.record}
                handleOk={this.assignUserOk}
                getRightData={this.state.data}
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
}))(TeamMembers)
