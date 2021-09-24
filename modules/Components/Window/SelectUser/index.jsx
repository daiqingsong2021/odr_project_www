import React from 'react'
import style from './style.less'
import { Table, Modal, Input, Button,notification } from 'antd';
import _ from 'lodash'
import axios from '../../../../api/axios'
import {getOrgUserTree } from "../../../../api/api"
import * as dataUtil from "../../../../utils/dataUtil"
import { connect } from 'react-redux'
import MyIcon from "../../../../components/public/TopTags/MyIcon";
import SubmitButton from "../../../../components/public/TopTags/SubmitButton"
const Search = Input.Search;

//分配modal，用于 组织机构，协作团队，项目团队
class SelectUser extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      leftData: [],                             //左侧数据
      leftActiveKey: null,                  //左侧标记用于添加点击行样式
      rightActiveKey: null,                 //右侧标记用于添加点击行样式
      visible: true,                        //modal默认显示
      isMove: 'no',                         //配置按钮事件有效状态，right向右添加，left向左操作 no禁止操作
      locale: { emptyText: '暂无分配数据' },    //table初始化
      initData: [],
      rightData: [],                        //右侧数据
      choiceData: []                         //选中数据
    }
  }
  componentDidMount() {
    //组织数据
    axios.get(getOrgUserTree).then(res => {
      this.setState({
        orgdata: res.data.data,
        initData: res.data.data
      }, () => {
        this.setState(preState => ({
          leftData: preState.orgdata,
          initData: preState.orgdata
        }))
      })
    })

  }

  //确认操作
  handleOk = () => {
      const { rightData } = this.state;
      if(!rightData || rightData.length == 0){
          notification.warning({
              placement: 'bottomRight',
              bottom: 50,
              duration: 2,
              message: '未选中数据',
              description: '请选择数据进行操作'
          })
          return;
      }
      this.props.handleOk(rightData);
      this.props.handleCancel()
  }
  //取消操作
  handleCancel = () => {
    this.props.handleCancel()
  }

  //获取选中数据
  getInfo = (record, index, type) => {

    let shoiceData = {...record};
    shoiceData.children = null;
    if (type == 'left') {
      let isMove = null;
      let index = _.findIndex(this.state.rightData, function (e) {
        return e.id == record.id
      })

      if (index != '-1' || record.type == "org") {
        isMove = 'no'
      } else {
        isMove = 'right'
      }
      this.setState({
        leftActiveKey: record.id+record.type,
        rightActiveKey: null,
        isMove: isMove,
        choiceData: shoiceData
      })
    } else {
      this.setState({
        isMove: 'left',
        leftActiveKey: null,
        rightActiveKey: record.id,
        choiceData: shoiceData
      })
    }

  }
  //左侧table，点击时添加背景色
  setLeftClassName = (record, index) => {
    //判断索引相等时添加行的高亮样式
    return record.id+record.type === this.state.leftActiveKey ? "tableActivty" : "";
  }
  //右侧table，点击时添加背景色
  setRightClassName = (record, index) => {
    //判断索引相等时添加行的高亮样式
    return record.id === this.state.rightActiveKey ? "tableActivty" : "";
  }
   //双击处理
   handleDoubleClick = (type, record) => {
    var rightData = this.state.rightData
   let shoiceData={...record}
   shoiceData.children = null;
    if (type == 'left') {

      var index = _.findIndex(rightData, function (e) {
        return e.id == shoiceData.id
      })
      if (index != '-1') {
        rightData.splice(index, 1);
      }
    } else {
      let index=rightData.findIndex(item=>item.id==shoiceData.id)
      if(index==-1){
        rightData.unshift(shoiceData)
      }
    
    }
    this.setState({
      rightData: rightData,
      isMove: 'no'
    })
  }
  //左右按钮选择操作数据
  moveData = (type) => {
    let rightData = this.state.rightData
    if (type == 'left') {
      let choiceData = this.state.choiceData
      let index = _.findIndex(rightData, function (e) {
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
    const {initData} = this.state;
    let newData = dataUtil.search(initData,[{"key":"code|name","value":name}],true);
    this.setState({
      leftData: newData
    })
  }

  render() {
    const { intl } = this.props.currentLocale

    const leftColumns = [                        //左侧表头
      {
        title: intl.get("wsd.i18n.pre.eps.projectname"), //名称
        dataIndex: 'name',
        key: 'name',
        width: 200,
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
      {
        title: intl.get("wsd.i18n.sys.menu.menucode"), //代码
        dataIndex: 'code',
        key: 'code',
    
      }
    ];
    const rightColumns = [                       //右侧表头
      {
        title: intl.get("wsd.i18n.sys.user1.name"),//名称
        dataIndex: 'name',
        key: 'name',
        width: 200,
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
      {
        title: intl.get("wsd.i18n.sys.user.actuName"), //代码
        dataIndex: 'code',
        key: 'code',
       
      }
    ];


    return (
      <div>
        <Modal className={style.main}
          bodyStyle={{ height: 400 }}
          title="分配"
          width={900}
          mask={false}
          maskClosable={false}
          onCancel={this.handleCancel}
          visible={this.props.visible}
          footer={<div className="modalbtn">
            <SubmitButton key={1} onClick={this.handleCancel} content="取消"/>
            <SubmitButton key={2} onClick={this.handleOk} type="primary" content="保存"/>
          </div>}
        >
          <div className={style.search}>
            <Search
              placeholder="名称/代码"
              enterButton="搜索"
              onSearch={value => { this.onChange(value) }}
            />
          </div>
          <div className={style.box}>
            <Table className={style.tableBox}
              onCancel={this.handleCancel}
              rowKey={(record, index) => (record.id+record.type)}
              columns={leftColumns}
              scroll={{ y: 270 }}
              dataSource={this.state.leftData} pagination={false}
              size="small"
              bordered
              locale={this.state.locale}
              rowClassName={this.setLeftClassName}
              onRow={(record, index) => {
                return {
                  onClick: () => {
                    this.getInfo(record, index, 'left')
                  },
                  onDoubleClick: event => {
                    if (record.type == "user") {
                      this.handleDoubleClick('right', record)
                    }
                  },
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
            <Table className={style.tableBoxRight}
              rowKey={(record) => (record.id)}
              columns={rightColumns}
              scroll={{ y: 270 }}
              size="small"
              dataSource={this.state.rightData} pagination={false}
              bordered
              locale={this.state.locale}
              rowClassName={this.setRightClassName}
              onRow={(record, index) => {
                return {
                  onClick: () => {
                    this.getInfo(record, index, 'right')
                  },
                  onDoubleClick: event => {
                    this.handleDoubleClick('left', record)
                  },
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
  currentLocale: state.localeProviderData
}))(SelectUser)
