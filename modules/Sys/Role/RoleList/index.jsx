import React, { Component } from 'react'
import style from './style.less'
import { Icon, Table, Modal, message, notification } from 'antd'
import AddStaffModel from './AddModal'  // 新增用户列表弹窗
import ModifyModal from './ModifyModal';

import PublicButton from "../../../../components/public/TopTags/PublicButton"
import axios from '../../../../api/axios'
import { userList, deleteUser, getBaseSelectTree } from "../../../../api/api";

import { connect } from 'react-redux'

const confirm = Modal.confirm


export class RoleList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      initDone: false,
      selectedRowKeys: [],
      addStaffShow: false,  // 控制新增用户列表弹窗
      total: '',
      current: '',
      pageSize: 10,
      currentPage: 1,
      data: [],
      submit: '',
      record: null
    }
  }

  componentDidMount() {
    this.getUserList();
    this.getBaseSelectTree("base.position.type");//职务
    this.getBaseSelectTree("base.professional.type");//专业
    this.getBaseSelectTree("base.education.type");//学历
  }


  // 获取下拉框值
  getBaseSelectTree = (typeCode) => {
    axios.get(getBaseSelectTree(typeCode)).then(res => {
      const { data } = res.data;
      let map = {};
      for (let index in data) {
        map[data[index].value] = data[index].title;
      }
      //职位
      if (typeCode == "base.position.type") {
        this.setState({
          position: data,
          positionMap: map
        })
      } else if (typeCode == "base.professional.type") { //专业
        this.setState({
          professional: data,
          professionalMap: map
        })
      } else if (typeCode == "base.education.type") {
        this.setState({
          education: data,
          educationMap: map
        })
      }
    })
  }

  getUserList = () => {
    axios.get(userList(this.props.rightData.id, this.state.pageSize, this.state.currentPage), {}).then(res => {
      this.setState({
        data: res.data.data,
        total: res.data.total
      })
    })
  }
  onCancel = () => {
    this.setState({
      addStaffShow: false
    })
  }
  onClickHandle = (name) => {

    const { intl } = this.props.currentLocale;

    if (name == "AddTopBtn") {
      this.setState({
        addStaffShow: true,
        title: intl.get('wsd.i18n.comu.profdback.newlyincreased'),
        submit: 'add'
      })
      return
    }

    if (name == "ModifyTopBtn") {
      if (!this.state.record) {
        notification.warning(
          {
            placement: 'bottomRight',
            bottom: 50,
            duration: 2,
            message: intl.get('wsd.global.tip.title2'),
            description: intl.get('wsd.global.tip.content1')
          }
        )
      } else {
        this.setState({
          title: "修改用户",
          modifyStaffShow: true,
          submit: 'put'
        })
      }
      return;
    }
    if (name == "DeleteTopBtn") {
      const { selectedRowKeys, selectedRows, data, currentPage, total, pageSize } = this.state;
      axios.deleted(deleteUser, { data: selectedRowKeys }, true).then(res => {
        //是不是最后一页
        let changecurrentPageNum = Math.ceil(total / pageSize) == currentPage;
        selectedRowKeys.forEach(item => {
          let index = data.findIndex(i => i.id == item);
          data.splice(index, 1);
        });
        let deleteLength = selectedRowKeys.length;
        //不是是最后一页
        if (!changecurrentPageNum) {
          this.setState({
            record: null,
            activeIndex: null,
            selectedRowKeys: [],
          }, () => {
            this.getUserList();
          });
        } else {
          //是最后一页
          //如果最后一页删光，还要上一页
          if (currentPage > 1 && data.length == 0) {
            this.setState({
              data,
              activeIndex: null,
              record: null,
              currentPage: currentPage - 1,
              selectedRowKeys: [],
            }, () => {
              this.getUserList();
            });
          } else {
            this.setState({
              data,
              activeIndex: null,
              record: null,
              selectedRowKeys: [],
              total: total - deleteLength,
            });
          }
        }
      })
    }

  }
  //点击行
  getInfo = (record, index) => {
    this.setState({
      activeIndex: record.id,
      record
    })
  }

  //设置class
  setClassName = (record, index) => {
    //判断索引相等时添加行的高亮样式
    return record.id === this.state.activeIndex ? 'tableActivty' : "";
  }
  addUser = (value, type) => {
    const { data, total } = this.state
    this.setState({
      data: [value, ...data],
      total: total + 1
    })


  }
  updateUser = (value) => {
    var data = this.state.data;
    for (var i = 0; i < this.state.data.length; i++) {
      if (this.state.data[i].id === value.id) {
        data[i] = value
      }
    }
    this.setState({
      data: data,
      rightData: value,
      addStaffShow: false
    });
  }
  //删除前校验
  hasRecord = () => {
    const { selectedRowKeys } = this.state;
    if (selectedRowKeys.length == 0) {
      notification.warning(
        {
          placement: 'bottomRight',
          bottom: 50,
          duration: 2,
          message: '未选中数据',
          description: '请勾选数据进行操作'
        }
      )
      return false
    } else {
      return true
    }
  }
  render() {
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
          this.getUserList()
        })
      },
      onChange: (page, pageSize) => {
        this.setState({
          currentPage: page
        }, () => {
          this.getUserList()
        })
      }
    }
    const { intl } = this.props.currentLocale;
    const columns = [
      {
        title: intl.get('wsd.i18n.sys.user.username'),
        dataIndex: 'actuName',
        key: 'actuName',
      },
      {
        title: "用户名",
        dataIndex: 'userName',
        key: 'userName',
      },
      {
        title: intl.get('wsd.i18n.sys.user.rolename'),
        dataIndex: 'retRole',
        key: 'retRole',
      },
      {
        title: intl.get('wsd.i18n.sys.user.sex'),
        dataIndex: 'sex',
        key: 'sex',
        render: text => text ? <span>{text.name} </span> : ''
      },
      {
        title: intl.get('wsd.i18n.sys.user.staffStatues'),
        dataIndex: 'staffStatus',
        key: 'staffStatus',
        render: text => text ? text.name : ''
      },
      {
        title: intl.get('wsd.i18n.sys.user.status'),
        dataIndex: 'status',
        key: 'status',
        render: text => text ? text.name : ''
      },
    ];

    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({
          selectedRowKeys,
          selectedRows,
        });
      },
    };

    return (
      <div className={style.main}>
        <div className={style.mainHeight}>
          {/* 用户列表 */}
          <h3 className={style.listTitle}> {intl.get('wsd.i18n.sys.rolelist.employeelist')} </h3>

          <div className={style.rightTopTogs}>
            {/* <AddTopBtn onClickHandle={this.onClickHandle}></AddTopBtn>
            <ModifyTopBtn onClickHandle={this.onClickHandle}></ModifyTopBtn>
            <DeleteTopBtn onClickHandle={this.onClickHandle.bind(this)}></DeleteTopBtn> */}
            <PublicButton name={'新增'} title={'新增'} icon={'icon-add'}
              afterCallBack={this.onClickHandle.bind(this, 'AddTopBtn')}

            />
            <PublicButton name={'修改'} title={'修改'} icon={'icon-xiugaibianji'}
              afterCallBack={this.onClickHandle.bind(this, 'ModifyTopBtn')}

            />
            <PublicButton name={'删除'} title={'删除'} icon={'icon-shanchu'}
              useModel={true} edit={true}
              verifyCallBack={this.hasRecord}
              afterCallBack={this.onClickHandle.bind(this, 'DeleteTopBtn')}
              content={'你确定要删除吗？'}

            />
          </div>
          <div className={style.mainScorll}>
            <Table
              columns={columns}
              size='small'
              dataSource={this.state.data}
              rowSelection={rowSelection}
              pagination={pagination}
              rowKey={record => record.id}
              rowClassName={this.setClassName}
              onRow={(record, index) => {
                return {
                  onClick: (event) => {
                    this.getInfo(record, index)
                  }
                }
              }
              }

            />
          </div>
          {
            this.state.addStaffShow && (
              <AddStaffModel addUser={this.addUser} selectData={this.state.record} rightData={this.props.rightData}
                submit={this.state.submit} title={this.state.title}
                staffModelShow={this.state.addStaffShow} position={this.state.position} positionMap={this.state.positionMap}
                professional={this.state.professional} professionalMap={this.state.professionalMap}
                education={this.state.education} educationMap={this.state.educationMap}
                handleCancel={() => this.setState({ addStaffShow: false })} />
            )
          }
          {this.state.modifyStaffShow &&
            <ModifyModal addUser={this.addUser} selectData={this.state.record} rightData={this.props.rightData}
              updateUser={this.updateUser}
              submit={this.state.submit} title={this.state.title}
              staffModelShow={this.state.addStaffShow}
              staffModelShow={this.state.addStaffShow} position={this.state.position} positionMap={this.state.positionMap}
              professional={this.state.professional} professionalMap={this.state.professionalMap}
              education={this.state.education} educationMap={this.state.educationMap}
              handleCancel={() => this.setState({ modifyStaffShow: false })} />
          }

        </div>

      </div>
    )
  }
}

export default connect(state => ({
  currentLocale: state.localeProviderData
}))(RoleList)
