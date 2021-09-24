import React, { Component } from 'react'
import style from './style.less'
import TreeTable from '../../../components/PublicTable'
import { Table, Spin, notification } from 'antd'
import MyTable from "../../../components/Table"
//引入第三方组件
import MyIcon from "../../../components/public/TopTags/MyIcon"
import NewNextAgency from './NewNextAgency/index'
import TopTags from './TopTags/index'
import RightTags from '../../../components/public/RightTags/index'
/* *********** 引入redux及redux方法 start ************* */
import { connect } from 'react-redux'
import TipModal from "../../Components/TipModal"
// 接口引入
import axios from '../../../api/axios';
import { iptTree, iptDelete, iptTreeSearch } from '../../../api/api';
//处理函数
import ExtLayout from "../../../components/public/Layout/ExtLayout";
import MainContent from "../../../components/public/Layout/MainContent";
import Toolbar from "../../../components/public/Layout/Toolbar";


//系统管理-IPT全局树
class TableComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      record: null,                           //行数据
      nextAgency: false,                      //新增下级机构
      importMod: false,                       //从组织导入显隐
      rightClickShow: false,                  //右击菜单显隐
      data: [{
        id: 0,
        key: 1,
        iptName: 'IPT树',
        children: null,
        isIPT: true
      }],                                     //IPT全局树数据
      groupCode: 1,                           //右侧页签组 默认1
      loading: false,                          //加载状态
      contentMenu: [
        { name: '新增', fun: 'add', type: 'buttom', icon: 'plus-square', isPublic: false },
        { name: '删除', fun: 'delete', type: 'buttom', icon: 'delete', isPublic: false }
      ]
    }

  }

  /**
   @method 获取ipt全局树列表(包含搜索)
   @param callBack(fun) 回调数据
   */
  getTree = (callBack) => {
    this.setState({
      loading: true
    })
    let api = iptTreeSearch
    if (this.state.searcher) {
      api = `${iptTreeSearch}?searcher=${this.state.searcher}`
    }
    axios.get(api).then(res => {
      const data = this.state.data;
      data[0].children = res.data.data;
      callBack(data)
      this.setState({
        data: data,
        loading: false
      })
    });
  }

  /**
   @method 父组件即可调用子组件方法
   @description 父组件即可调用子组件方法
   */
  onRef = (ref) => {
    this.child = ref
  }

  /**
   @method 获取行数据
   @description table 点击行时获取行数据，record.isIPT 为真时则说明选中的是根结点，不存在有右侧页签状态
   @param record {obj} 行数据
   */
  getRowData = (record) => {
    this.setState({
      record: record,
      groupCode: record.isIPT ? -1 : 1, //禁止选择IPT树
      contentMenu: record.isIPT ?
        [
          { name: '新增', fun: 'add', type: 'buttom', icon: 'plus-square', isPublic: false },
        ] :
        [
          { name: '新增', fun: 'add', type: 'buttom', icon: 'plus-square', isPublic: false },
          { name: '删除', fun: 'delete', type: 'buttom', icon: 'delete', isPublic: false }
        ]

    })
  };



  /**
   @method 搜索
   @description 根据用户输入搜索IPT全局树数据
   @param value {string} 搜索关键词
   */
  search = (value) => {
    if (value != null || value.trim() != "") {
      this.setState({
        searcher: value
      }, () => {
        this.getTree()
      })
    } else {
      this.setState({
        searcher: null
      }, () => {
        this.getTree()
      })
    }
  }

  /**
   @method 点击顶部按钮
   @description  功能按钮操作
   @param name {string} AddTopBtn 新增IPT ，DeleteTopBtn 删除IPT
   */
  onClickHandle = (name) => {
    if (name == "AddTopBtn") {
      this.setState({
        nextAgency: true
      })
      return
    }
    if (name == "DeleteTopBtn") {
      this.iptdelete()
      return
    }
  }

  /**
   @method 新增IPT
   @description  新增IPT
   @param newRecord {obj}  新数据
   */
  addSuccess = (newRecord) => {
    this.child.add(this.state.record, newRecord)
  };

  /**
   @method 更新IPT数据
   @description  更新IPT数据
   @param newRecord {obj}  新数据
   */
  updateSuccess = (newRecord) => {
    this.child.update(this.state.record, newRecord)
  };

  /**
   @method 删除本级机构
   @description  删除本级机构，IPT全局树默认数据不可删除，其余可删除
   */
  iptdelete = () => {
    if (this.state.record) {
      if (this.state.record.isIPT) {
        notification.warning(
          {
            placement: 'bottomRight',
            bottom: 50,
            duration: 2,
            message: '警告',
            description: '不能删除IPT树'
          }
        )
        return;
      }
    }
    axios.deleted(iptDelete, { data: [this.state.record.id] }, true, null, true).then(res => {
      this.child.deleted(this.state.record)
      this.setState({
        record: null,
        deleteTip: false
      });
    })
  }

  /**
   @method 右击菜单选项
   @description
   @param menu {string}  add 为 新增，delete 为删除， refresh 为刷新
   */
  rightClickMenu = (menu) => {
    //新增
    if (menu.fun == "add") {
      this.setState({
        nextAgency: true
      })
    }
    //删除
    if (menu.fun == "delete") {
      // 打开删除提示
      if (this.state.record.isIPT) {
        notification.warning(
          {
            placement: 'bottomRight',
            bottom: 50,
            duration: 2,
            message: '警告',
            description: '不能删除IPT树'
          }
        )
        return;
      }
      this.setState({
        deleteTip: true
      })

    }
  }


  /**
   @method 取消新增下级机构
   @description 取消新增下级机构
   */
  closeNextAgency = () => {
    this.setState({
      nextAgency: false
    })
  }

  /**
   @method 移动回调
   @description table移动回调
   @param moveInfo {obj} 被移动数据
   @param positionID {int} 落脚点ID
   @param callback {fun}   回调给table组件，通知是否可以移动
   */
  callBackMoveList = (moveInfo, positionID, callback) => {
    this.setState({
      loading: true
    })
    axios.get(iptTreeSearch).then(res => {
      callback(true)
      this.setState({
        loading: false
      })
    });
  }

  render() {
    const { intl } = this.props.currentLocale
    const columns = [
      {
        title: intl.get('wsd.i18n.sys.menu.menuname'),
        dataIndex: 'iptName',
        key: 'iptName',
        width: 300,
        render: (text, record) => {
          if (record.isIPT) {
            return <span title={text}><MyIcon type="icon-zuzhijigou"
              style={{ fontSize: '18px', marginRight: '8px', verticalAlign: "middle" }} />{text}</span>
          } else {
            return <span title={text} ><MyIcon type="icon-IPT"
              style={{ fontSize: '18px', marginRight: '8px', verticalAlign: "middle" }} />{text}</span>
          }
        }

      },
      {
        title: intl.get('wsd.i18n.sys.ipt.iptcodej'),
        dataIndex: 'iptCode',
        key: 'iptCode',
        width: 300,
        render: text => <span title={text} >{text}</span>
      },
      {
        title: intl.get('wsd.i18n.sys.ipt.level'),
        dataIndex: 'level',
        key: 'level',
        width: 150,
      },
      {
        title: intl.get('wsd.i18n.sys.ipt.remark'),
        dataIndex: 'remark',
        key: 'remark',
        width: 400,
        render: text => <span title={text} >{text}</span>
      }

    ];

    return (
      <ExtLayout renderWidth={({ contentWidth }) => { this.setState({ contentWidth }) }}>
        <Toolbar>
          <TopTags search={this.search} data={this.state.record} onClickHandle={this.onClickHandle} />
        </Toolbar>
        <MainContent contentWidth={this.state.contentWidth} contentMinWidth={1500}>
          <TreeTable contentMenu={this.state.contentMenu} onRef={this.onRef} getData={this.getTree} move={this.callBackMoveList} dnd={true}
            dataSource={this.state.data} pagination={false} columns={columns} loading={this.state.loading}
            scroll={{ x: 1150, y: this.props.height - 50 }}
            getRowData={this.getRowData}
            rightClick={this.rightClickMenu}
          />
        </MainContent>
        <RightTags rightTagList={this.state.rightTags}
          rightData={this.state.record ? this.state.record.isIPT ? null : this.state.record : null}
          updateSuccess={this.updateSuccess}
          menuCode={this.props.menuInfo.menuCode} groupCode={this.state.groupCode} />
        {/* 删除提示 */}
        {this.state.deleteTip &&
          <TipModal onOk={this.iptdelete} onCancel={() => this.setState({ deleteTip: !this.state.deleteTip })} />}
        {/* 新增下级 */}
        {this.state.nextAgency &&
          <NewNextAgency addSuccess={this.addSuccess} data={this.state.record}
            closeNextAgency={this.closeNextAgency.bind(this)}></NewNextAgency>}
      </ExtLayout>

    )
  }
}


/* *********** connect链接state及方法 end ************* */
const mapStateToProps = state => {
  return {
    currentLocale: state.localeProviderData,
  }
};


export default connect(mapStateToProps, null)(TableComponent);
