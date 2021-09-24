import React from 'react'
import style from './style.less'
import {Table, Input, Button, notification,Select,Row,Col} from 'antd';
import _ from 'lodash'
import axios from '../../../../api/axios'
import {getStartNextParticipant, getAgreeNextParticipant,getBaseSelectTree} from "../../../../api/api"
import * as dataUtil from "../../../../utils/dataUtil"
import Search from '../../../../components/public/Search'
import {connect} from 'react-redux'
import MyIcon from "../../../../components/public/TopTags/MyIcon";
import TimelineItem from 'antd/lib/timeline/TimelineItem';
const Option = Select.Option;
const {TextArea} = Input;

class Participant extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      leftData: [],                         //左侧数据
      leftActiveKey: null,                  //左侧标记用于添加点击行样式
      rightActiveKey: null,                 //右侧标记用于添加点击行样式
      visible: true,                        //modal默认显示
      isMove: 'no',                         //配置按钮事件有效状态，right向右添加，left向左操作 no禁止操作
      locale: {emptyText: '暂无分配数据'},    //table初始化
      initData: [],                         //用于搜索的初始化数据
      rightData: [],                        //右侧数据
      choiceData: [],                        //选中数据
      optionTxt:[],                          //常用审批意见
    }
  }

  componentDidMount() {
    this.initDatas();
    axios.get(getBaseSelectTree("wf.general.opinion")).then((res)=>{
      if(res.data.data.length > 0){
        this.setState({
          optionTxt:res.data.data,
          defaultSelectTxt:res.data.data[0].title,
          defaultTextareaTxt:res.data.data[0].title,
          content:res.data.data[0].title,
        })
      }
      
    });
  }
  initDatas = () => {
    if (this.props.type && this.props.type === "agree") {
      //组织数据
      axios.get(getAgreeNextParticipant(this.props.taskId), null, false, null, true).then(res => {
        this.setActivityIdAndName(res.data.data)
        let defaluts = this.getDefaultChoiceData(res.data.data) //得到默认参与者
        this.setState({
          initData: [...res.data.data],
          leftData: res.data.data,
          rightData: defaluts,
        }, () => {
          this.setData();
        })
      })
    } else {
      //组织数据
      const {vars, formData, bizTypeCode, procDefKey} = this.props
      const form = {vars, formData, bizTypeCode, procDefKey}
      axios.post(getStartNextParticipant(this.props.bizTypeCode, this.props.procDefKey), form, false, null, true).then(res => {
      //axios.get(getStartNextParticipant(this.props.bizTypeCode, this.props.procDefKey), null, false, null, true).then(res => {
        this.setActivityIdAndName(res.data.data)
        let defaluts = this.getDefaultChoiceData(res.data.data) //得到默认参与者
        this.setState({
          initData: [...res.data.data],
          leftData: res.data.data,
          rightData: defaluts,
        }, () => {
          this.setData();
        })
      })
    }
  }

  // 设置节点ID和节点名称
  setActivityIdAndName = (list) => {
    if (list && list.length > 0 ) {
      for (var i = 0; i < list.length; i++) {
        this.setActivityIdAndName2(list[i].children, list[i]);
      }
    }
  }

  // 设置节点ID和节点名称
  setActivityIdAndName2 = (list, activity) => {
    if (list && list.length > 0 && activity) {
      for (var i = 0; i < list.length; i++) {
        list[i].activityId = activity.id;
        list[i].activityName = activity.name;
        this.setActivityIdAndName2(list[i].children, activity);
      }
    }
  }

  // 得到默认选中的数据
  getDefaultChoiceData = (list) => {
    let partItems = this.getDefaultParticipant(list)
    if (!partItems || partItems.length == 0) {
      let userItems = this.getUserParticipant(list)
      if (userItems && userItems.length == 1) {
        partItems.push(userItems[0])
      }
    }
    return partItems;
  }

  //得到默认参与者
  getDefaultParticipant = (list) => {
    let partItems = new Array();
    if (list && list.length > 0) {
      list.forEach((item) => {
        if (item.defaultPart) {
          partItems.push({...item, children: null})
        }
        let children = this.getDefaultParticipant(item.children)
        if (children && children.length > 0) {
          partItems = partItems.concat(children)
        }
      })
    }
    return partItems;
  }

  //得到默认参与者
  getDefaultParticipant = (list) => {
    let partItems = new Array();
    if (list && list.length > 0) {
      list.forEach((item) => {
        if (item.defaultPart) {
          partItems.push({...item, children: null})
        }
        let children = this.getDefaultParticipant(item.children)
        if (children && children.length > 0) {
          partItems = partItems.concat(children)
        }
      })
    }
    return partItems;
  }

  //得到默认参与者
  getUserParticipant = (list) => {
    let userItems = new Array()
    if (list && list.length > 0) {
      list.forEach((item) => {
        if (item.type == "user") {
          userItems.push({...item, children: null})
        }
        let children = this.getUserParticipant(item.children)
        if (children && children.length > 0) {
          userItems = userItems.concat(children)
        }
      })
    }
    return userItems;
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
        return ((e.activityId || "0") + "-" + e.type + "-" + e.id) == ((record.activityId || "0") + "-" + record.type + "-" + record.id)
      })
      if (index != '-1' || record.type == "group" || record.type == "activiti") {
        isMove = 'no'
      } else {
        isMove = 'right'
      }
      this.setState({
        leftActiveKey: ((record.activityId || "0") + "-" + record.type + "-" + record.id),
        rightActiveKey: null,
        isMove: isMove,
        choiceData: shoiceData
      })
    } else {
      this.setState({
        isMove: 'left',
        leftActiveKey: null,
        rightActiveKey: ((record.activityId || "0") + "-" + record.type + "-" + record.id),
        choiceData: shoiceData
      })
    }
  }

  //左侧table，点击时添加背景色
  setLeftClassName = (record, index) => {
    //判断索引相等时添加行的高亮样式
    return ((record.activityId || "0") + "-" + record.type + "-" + record.id) === this.state.leftActiveKey ? "tableActivty" : "";
  }

  //右侧table，点击时添加背景色
  setRightClassName = (record, index) => {
    //判断索引相等时添加行的高亮样式
    return ((record.activityId || "0") + "-" + record.type + "-" + record.id) === this.state.rightActiveKey ? "tableActivty" : "";
  }

  //双击处理
  handleDoubleClick = (type, record) => {
    let rightData = this.state.rightData
    let choiceData = {...record}
    choiceData.children = null;
    if (type == 'left') {
      let index = _.findIndex(rightData, function (e) {
        return ((e.activityId || "0") + "-" + e.type + "-" + e.id) == ((record.activityId || "0") + "-" + record.type + "-" + record.id)
      })
      if (index != '-1') {
        rightData.splice(index, 1);
      }
    } else {
      let index = _.findIndex(rightData, function (e) {
        return ((e.activityId || "0") + "-" + e.type + "-" + e.id) == ((record.activityId || "0") + "-" + record.type + "-" + record.id)
      })
      if (index == -1) { //验证是否只能选择同一活动下的参与者
        this.isActivityOnly(choiceData)
        rightData.unshift(choiceData)
      }
    }
    this.setState({
      rightData: rightData,
      isMove: 'no'
    }, () => {
      this.setData();
    })
  }

  //左右按钮选择操作数据
  moveData = (type) => {
    let rightData = this.state.rightData
    let choiceData = this.state.choiceData
    if (type == 'left') {
      let index = _.findIndex(rightData, function (e) {
        return ((e.activityId || "0") + "-" + e.type + "-" + e.id) == ((choiceData.activityId || "0") + "-" + choiceData.type + "-" + choiceData.id)
      })
      if (index != '-1') {
        rightData.splice(index, 1);
      }
    } else { //验证是否只能选择同一活动下的参与者
      this.isActivityOnly(choiceData)
      rightData.unshift(choiceData)
    }
    this.setState({
      rightData: rightData,
      isMove: 'no'
    }, () => {
      this.setData();
    })
  }

  //判段是否必选同一活动下的参与者
  isActivityOnly = (seletData) => {
    if (seletData.activityOnly) {
      const rightData = this.state.rightData
      for (var i = rightData.length - 1; i >= 0; i--) {
        if (seletData.activityId != rightData[i].activityId) {
          rightData.splice(i, 1);        //执行后aa.length会减一
        }
      }
    }
  }

  //搜索事件回调
  search = (text) => {
    const {initData} = this.state;
    let newData = dataUtil.search(initData, [{"key": "code|name", "value": text}], true);
    this.setState({
      leftData: newData
    })
  }

  setData = () => {
    const {initData, rightData, content} = this.state;
    this.props.setData({"validateParticipant": initData.length > 0, "participant": rightData, "content": content});
  }

  setContent = (obj) => {
    let text = obj.currentTarget.value;
    this.setState({content: text}, () => {
      this.setData();
    });
  }
  // 选择处理意见
  selectTxt=(val)=>{
    this.setState({
      defaultSelectTxt:val,
      defaultTextareaTxt:val,
      content: val
    },()=>{
      this.setData();
    })
  }
  //改变处理意见的值
  changeTxt = (val)=>{
    let text = val.currentTarget.value;
    this.setState({
      defaultTextareaTxt:text
    })
  }
  render() {
    const {intl} = this.props.currentLocale
    const leftColumns = [                        //左侧表头
      {
        title: intl.get("wsd.i18n.pre.eps.projectname"), //名称
        dataIndex: 'name',
        key: 'name',
        width: 240,
        render: (text, record) => dataUtil.getIconCell(record.type, text)
      },
      {
        title: intl.get("wsd.i18n.sys.menu.menucode"), //代码
        dataIndex: 'code',
        key: 'code',
      }
    ];
    const rightColumns = [                       //右侧表头
      {
        title: "节点名称",//名称
        dataIndex: 'activityName',
        key: 'activityName',
        width: 150,
        //render: (text, record) => dataUtil.getIconCell("anticon", text)
      },
      {
        title: intl.get("wsd.i18n.pre.eps.projectname"),//名称
        dataIndex: 'name',
        key: 'name',
        width: 140,
        render: (text, record) => dataUtil.getIconCell(record.type, text)
      },
      {
        title: intl.get("wsd.i18n.sys.menu.menucode"), //代码
        dataIndex: 'code',
        key: 'code'
      }
    ];
    return (
      this.props.visible && <div className={style.main}>
        {
          this.state.initData.length > 0 && <div>
            <div className={style.search}>
              <Search search={this.search}/>
            </div>
            <div className={style.box}>
              <Table className={style.tableBox}
                     onCancel={this.handleCancel}
                     rowKey={(record, index) => ((record.uuid))}
                     columns={leftColumns}
                     scroll={{y: 208}}
                     dataSource={this.state.leftData} pagination={false}
                     size="small"
                     bordered
                     locale={this.state.locale}
                     rowClassName={this.setLeftClassName}
                     defaultExpandAllRows={true}
                     onRow={(record, index) => {
                       return {
                         onClick: () => {
                           this.getInfo(record, index, 'left')
                         },
                         onDoubleClick: event => {
                           if (record.type == "user") {
                             this.handleDoubleClick('right', record)
                           }
                         }
                       }
                     }
                     }
              />
              <div className={style.border}>
                <div>
                  <Button onClick={this.moveData.bind(this, 'right')} disabled={this.state.isMove == 'right' ? false : 'disabled'}
                          icon='double-right' style={{marginBottom: 10}}/>
                  <Button onClick={this.moveData.bind(this, 'left')} disabled={this.state.isMove == 'left' ? false : 'disabled'}
                          icon='double-left'/>
                </div>
              </div>
              <Table className={style.tableBoxRight}
                     rowKey={(record) => (record.uuid)}
                     columns={rightColumns}
                     scroll={{y: 208}}
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
                         }
                       }
                     }
                     }
              />
            </div>
          </div>
        }
        <div style={{marginTop: '15px'}}>
          <div style={{width:'100%','marginBottom':'20px'}}>
            <p>选择常用意见：</p>
            {this.state.optionTxt && (
              <Select style={{width:'100%'}} value ={this.state.defaultSelectTxt} onSelect={this.selectTxt}>
                {this.state.optionTxt.map((item,i)=>{
                  return(
                    <Option key={item.value} value={item.title}>{item.title}</Option>
                  )
                })}
            </Select>
            )}
          </div>
          <div style={{width:'100%'}}>
            <p>请输入审批意见：</p>
            <TextArea onBlur={this.setContent} onChange={this.changeTxt} value={this.state.defaultTextareaTxt} maxLength={85} rows={this.state.initData.length > 0 ? 3 : 7}></TextArea>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(state => ({
  currentLocale: state.localeProviderData
}))(Participant)
