import React from 'react'
import style from './style.less'
import { Table, Modal, Icon, Input, Button } from 'antd';
import _ from 'lodash'
import { connect } from 'react-redux'
import axios from '../../../../api/axios'
import * as dataUtil from "../../../../utils/dataUtil"
import MyIcon from "../../../../components/public/TopTags/MyIcon"
const Search = Input.Search;
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

      rightData: [],                        //右侧数据
      choiceData: []                         //选中数据
    }
  }
  componentDidMount() {
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
    let { rightData } = this.state;
    this.props.disUserData(rightData);
    this.setState({ rightData: [] });
    this.handleCancel();
  }


  //获取选中数据
  getInfo = (record, index, type) => {
    if (type == 'left') {
      if(record.type!="user"){
        return 
      }
      let isMove = null;
      // if (record.orgId) {
      var index = this.state.rightData.findIndex(item => item.id == record.id)
      if (index != '-1') {
        isMove = 'no'
      } else {
        isMove = 'right'
      }
      // }
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
  //搜索
  onChange = (val) => {
  }

  handleCancel = () => {
    this.setState({ rightData: [] });
    this.props.handleCancel();
  }

  render() {
    const { intl } = this.props.currentLocale;
    const leftColumns = [                        //左侧表头
      {
        title: intl.get("wsd.i18n.sys.menu.menuname"),//名称
        dataIndex: 'name',
        key: 'name',
        width: 200,
        render: (text, record) => {
          if (record.type == "org") {
            if(record.orgType=="0"){
              return <span><MyIcon type="icon-gongsi" style={{ fontSize: 18, vectorEffect: "middle" }} />{text}</span>
            }else{
              return <span><MyIcon type="icon-bumen1" style={{ fontSize: 18, vectorEffect: "middle" }} />{text}</span>
            }
           
          } 
          if (record.type == "user") {
            return <span><MyIcon type="icon-yuangong" style={{ fontSize: 18, vectorEffect: "middle" }} />{text}</span>
          }
        }
      },
      {
        title: intl.get("wsd.i18n.sys.menu.menucode"),//代码
        dataIndex: 'code',
        key: 'code',
     
      },
    ]
    const rightColumns = [                       //右侧表头
      {
        title: intl.get("wsd.i18n.sys.menu.menuname"),
        dataIndex: 'name',
        key: 'name',
        width: 200
      },
      {
        title: intl.get("wsd.i18n.sys.menu.menucode"),
        dataIndex: 'code',
        key: 'code',
     
      },
    ]

    return (
      <div>
        <Modal className={style.main}
          bodyStyle={{ height: 400 }}
          title="分配用户"
          width={850} centered={true}
          visible={this.props.modalVisible}
          onCancel={this.props.handleCancel}
          footer={
            <div className='modalbtn'>
              <Button key="b" type="submit" onClick={this.handleCancel} >关闭</Button>
              <Button key="saveAndSubmit" type="primary" onClick={this.handleOk} >保存</Button>
            </div>
          }
        >
          <div className={style.search}>
            <Search
              placeholder="名称/代码"
              enterButton="搜索"
              onSearch={value => { this.onChange(value) }}
            />
          </div>
          <div className={style.main1}>
            <Table className={style.tableBox}
              rowKey={(record, index) => (record.id + 'left' + index)}
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
              rowKey={(record, index) => (record.id + 'right' + index)}
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

export default connect(state => ({
  currentLocale: state.localeProviderData,
}))(Distribute)
