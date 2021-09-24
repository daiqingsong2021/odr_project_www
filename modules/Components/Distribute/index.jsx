import React from 'react'
import style from './style.less'
import { Table, Modal, Icon, Input, Button, Select } from 'antd';
import _ from 'lodash'
import axios from '../../../api/axios'
import { userAdd } from "../../../api/api"
import * as dataUtil from "../../../utils/dataUtil"
import { connect } from 'react-redux'
import MyIcon from '../../../components/public/TopTags/MyIcon';
const Search = Input.Search;
const Option = Select.Option
//分配modal，用于 组织机构，协作团队，项目团队
class Distribute extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      leftData: [],                             //左侧数据
      leftActiveKey: null,                  //左侧标记用于添加点击行样式
      rightActiveKey: null,                 //右侧标记用于添加点击行样式
      visible: true,                        //modal默认显示
      isMove: 'no',                         //配置按钮事件有效状态，right向右添加，left向左操作 no禁止操作
      locale: { emptyText: '暂无分配数据' },    //table初始化
      leftColumns: [                        //左侧表头
        {
          title: '名称',
          dataIndex: 'name',
          key: 'name',
          width: 100
        },

      ],
      rightColumns: [                       //右侧表头
        {
          title: '用户',
          dataIndex: 'name',
          key: 'name',
          width: 100
        },
        {
          title: '角色',
          dataIndex: 'roleId',
          key: 'roleId',
          width: 100,
          render: (text, record) => {

            return <Select style={{ width: "100%" }} value={text} onChange={this.handleSelectdata.bind(this, record)} mode="multiple">
              {this.state.rolelist && this.state.rolelist.map(item => {
                return <Option value={item.id} key={id}>{item.roleName}</Option>
              })}
            </Select>

          }


        },
      ],
      rightData: [],                        //右侧数据
      choiceData: []                         //选中数据
    }
  }
  //选择数据
  handleSelectdata = (record, e, s) => {

    const { rightData } = this.state
    let i=rightData.findIndex(item => item.id == record.id)
    rightData[i].roleId= e
    this.setRightClassName({
      rightData
    })
  }
  componentDidMount() {
    //获取用户角色
    axios.get("api/sys/role/list").then(res => {
      this.setState({
        rolelist: res.data.data
      })
    })
    //组织数据
    axios.get("api/sys/org/user/tree").then(res => {
      this.setState({
        orgdata: res.data.data
      }, () => {
        this.setState(preState => ({
          leftData: preState.orgdata
        }))
      })
    })

  }

  //确认操作
  handleOk = (e) => {
    const { rightData } = this.state
    this.props.handleCancel()
    let data = rightData.map(item => ({
      userId: item.id,
      roleIds: item.roleId
    }))

    axios.post(userAdd(this.props.iptID), data).then(res => {
      //成功刷新
      this.props.refushList()
    })

  }
  //取消操作
  handleCancel = (e) => {
    this.props.handleCancel()
  }

  //获取选中数据
  getInfo = (record, index, type) => {
    if (type == 'left') {
      let isMove = null;
      if (record.type == "user") {
        var index = _.findIndex(this.state.rightData, function (e) {
          return e.id == record.id
        })
        if (index != '-1') {
          isMove = 'no'
        } else {
          isMove = 'right'
        }
      }
      this.setState({
        leftActiveKey: record.id,
        rightActiveKey: null,
        isMove: isMove,
        choiceData: record
      })
    } else {
      this.setState({
        isMove: 'left',
        leftActiveKey: null,
        rightActiveKey: record.id,
        choiceData: record
      })
    }

  }
  //左侧table，点击时添加背景色
  setLeftClassName = (record, index) => {
    //判断索引相等时添加行的高亮样式
    return record.id === this.state.leftActiveKey ? `${style['clickRowStyl']}` : "";
  }
  //右侧table，点击时添加背景色
  setRightClassName = (record, index) => {
    //判断索引相等时添加行的高亮样式
    return record.id === this.state.rightActiveKey ? `${style['clickRowStyl']}` : "";
  }
  //左右按钮选择操作数据
  moveData = (type) => {
    var rightData = this.state.rightData
    if (type == 'left') {
      var choiceData = this.state.choiceData
      var index = _.findIndex(rightData, function (e) {
        return e.id == choiceData.id
      })
      if (index != '-1') {
        rightData.splice(index, 1);
      }
    } else {
      rightData.unshift(this.state.choiceData)
    }
    this.setState({
      rightData: rightData,
      isMove: 'no'
    })
  }

  //搜索事件回调
  onChange = (name) => {
    const { orgdata } = this.state;
    let searchDatas = dataUtil.search(orgdata,[{"key":"name|code","value" : name}],true);
    this.setState({
      leftData: searchDatas
    })
  }

  render() {
    const { intl } = this.props.currentLocale
    const leftColumns= [                        //左侧表头
      {
        title:intl.get("wsd.i18n.sys.menu.menuname"),
        dataIndex: 'name',
        key: 'name',
        width: 100,
        render: (text, record) =>{
          if(record.type=="org"){
            return <span><MyIcon type="icon-gongsi" style={{fontSize:18,vectorEffect:"middle"}}/>{text}</span>
          }else if(record.type=="user"){
            return <span><MyIcon type="icon-yuangong" style={{fontSize:18,vectorEffect:"middle"}}/>{text}</span>
          }else{
            return <span><MyIcon type="icon-bumen1" style={{fontSize:18,vectorEffect:"middle"}}/>{text}</span>
          }

        }
      },

    ]
    const rightColumns= [                       //右侧表头
      {
        title: intl.get("wsd.i18n.sys.role.username"),
        dataIndex: 'name',
        key: 'name',
        width: 100
      },
      {
        title: intl.get("wsd.i18n.sys.ipt.rolename"),
        dataIndex: 'roleId',
        key: 'roleId',
        width: 200,
        render: (text, record) => {

          return <Select style={{ width: "100%" }} defaultValue={text} onChange={this.handleSelectdata.bind(this, record)} mode="multiple">
            {this.state.rolelist && this.state.rolelist.map(item => {
              return <Option value={item.id} key={id}>{item.roleName}</Option>
            })}
          </Select>

        }

      },
    ]
    return (
      <div>
        <Modal className={style.main}
          bodyStyle={{ height: 400 }}
          title="分配"
          width={800}
          mask={false}
          maskClosable={false}
          onCancel={this.handleCancel}
          visible={this.state.visible}
          footer={<div className="modalbtn">
            <Button key={1} onClick={this.handleCancel}>取消</Button>
            <Button key={2} onClick={this.handleOk} type="primary">保存</Button>
          </div>}
        >
          <div className={style.search}>
            <Search
              placeholder="姓名/用户名"
              enterButton="搜索"
              onSearch={value => { this.onChange(value) }}
            />
          </div>
          <div className={style.box}>
            <Table className={style.tableBox}
              onCancel={this.handleCancel}
              rowKey={(record, index) => `${record.id}${index}`}
              columns={leftColumns}
              scroll={{ y: 270 }}
              dataSource={this.state.leftData} pagination={false}
              size="small"
              bordered
              locale={this.state.locale}
              rowClassName={this.setLeftClassName}
              onRow={(record, index) => {
                return {
                  onClick: (event) => {
                    this.getInfo(record, index, 'left')
                  }
                }
              }
              }
            />
            <div className={style.border}>
              <div>
                <Button onClick={this.moveData.bind(this, 'right')} disabled={this.state.isMove == 'right' ? false : 'disabled'}
                  icon='double-right' style={{ marginBottom: 10 }} />
                <Button onClick={this.moveData.bind(this, 'left')} disabled={this.state.isMove == 'left' ? false : 'disabled'}
                  icon='double-left' />
              </div>
            </div>
            <Table className={style.tableBox}
              rowKey={(record, index) => record.id}
              columns={rightColumns}
              scroll={{ y: 260 }}
              size="small"
              dataSource={this.state.rightData} pagination={false}
              bordered
              locale={this.state.locale}
              rowClassName={this.setRightClassName}
              onRow={(record, index) => {
                return {
                  onClick: (event) => {
                    this.getInfo(record, index, 'right')
                  }
                }
              }
              }
            />
          </div>
        </Modal>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
      currentLocale: state.localeProviderData,
  }
};


export default connect(mapStateToProps, null)(Distribute);
