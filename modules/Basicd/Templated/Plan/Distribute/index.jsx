import React from 'react'
import style from './style.less'
import { Table, Modal, Icon, Input, Button, Select } from 'antd';
import _ from 'lodash'
import axios from '../../../../../api/axios'
import { cprtmAdd } from "../../../../../api/api"
import { connect } from 'react-redux'
import MyIcon from "../../../../../components/public/TopTags/MyIcon"
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


      rightData: [],                        //右侧数据
      choiceData: []                         //选中数据
    }
  }
  //选择数据
  handleSelectdata = (record, e, s) => {

    const { rightData } = this.state
    let obj = rightData.find(item => item.id == record.id)
    obj.roleId = e

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
  handleOk = (rightData) => {
    

    let data = []

    for (let i = 0; i < rightData.length; i++) {
      let obj = {
        bizId: this.props.data.id,
        bizType: this.props.bizType,
        cprtmId: rightData[i].id,
        cprtmType: rightData[i].type
      }
      data.push(obj)
    }

    axios.post(cprtmAdd, data, true).then(res => {
      //成功刷新
      this.props.getDataList()
      this.props.handleCancel()
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
    return record.id === this.state.leftActiveKey ? "tableActivty" : "";
  }
  //右侧table，点击时添加背景色
  setRightClassName = (record, index) => {
    //判断索引相等时添加行的高亮样式
    return record.id === this.state.rightActiveKey ? "tableActivty" : "";
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
    if (!name || name.trim() == "") {
      this.setState(preState => ({
        leftData: preState.orgdata
      }))
      return
    }
    const { orgdata } = this.state
    let list = []
    let data = []
    function initStructureCode(data) {
      for (var i = 0; i < data.length; i++) {
        list.push({
          ...data[i]
        })
        if (data[i].children) {
          initStructureCode(data[i].children)
        }
      }
    }
    initStructureCode(orgdata)
    let isarray=[]
    list.forEach((item,i) => {
      
      if ((item.name && item.name.indexOf(name) > -1) || (item.code && item.code.toLocaleLowerCase().indexOf(name.toLocaleLowerCase()) > -1)  ) {
        
        if(item.type=="org"){
          let index=isarray.findIndex(v=>v==item.parentId)
          if(index==-1){
           data.push(item)
           isarray.push(item.id)
          }
       
        }
        if(item.type=="user"){
         let index=isarray.findIndex(v=>v==item.parentId)
         if(index==-1){
           let i=list.findIndex(v=>v.id==item.parentId)
           if(i>-1){
              //是否存在
              let is=data.findIndex(value=>value.id==item.parentId)
              if(is>-1){
                
                if(data[is].children){
                  data[is].children.push(item)
                }
              } else{
                list[i].children=[]
                list[i].children.push(item)
                data.push(list[i])
              }
            
           }else{
            
           }
         
         }
        }
      }

    })
    this.setState({
      leftData: data
    })
  }

  render() {
    const { intl } = this.props.currentLocale

    const leftColumns = [                        //左侧表头
      {
        title: intl.get("wsd.i18n.pre.eps.projectname"), //名称
        dataIndex: 'name',
        key: 'name',
        width: 270,
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
        width: 200
      }
    ];
    const rightColumns = [                       //右侧表头
      {
        title: intl.get("wsd.i18n.pre.eps.projectname"),//名称
        dataIndex: 'name',
        key: 'name',
        width: 100
      },
      {
        title: intl.get("wsd.i18n.sys.menu.menucode"), //代码
        dataIndex: 'code',
        key: 'code',
        width: 100
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
              rowKey={(record, index) => (record.id)}
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
            <Table className={style.tableBoxRight}
              rowKey={(record, index) => (record.id)}
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
  currentLocale: state.localeProviderData
}))(Distribute)
