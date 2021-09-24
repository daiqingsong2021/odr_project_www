import React, { Component } from 'react'
import { Table, Spin, notification } from 'antd'
import style from './style.less'
import _ from 'lodash'
import TopTags from './TopTags/index'
import RightTags from '../../../components/public/RightTags/index'
import TreeTable from '../../../components/PublicTable'
import { connect } from 'react-redux'
import axios from '../../../api/axios'
import { wfAssignList, wfAssignDel } from '../../../api/api'
import MyIcon from '../../../components/public/TopTags/MyIcon'


class TableComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      initDone: false,
      activeIndex: null,
      rightData: null,
      rightTags: [
        // { icon: 'iconjibenxinxi', title: '基本信息', fielUrl: 'Sys/Flow/BasicInfo' },
      ],
      data: [],
      addEdit: true,
      releaseEdit: true,
      deleteEdit: true,
    }
  }
  //注册 父组件即可调用子组件方法
  onRef = (ref) => {
    this.table = ref
  }


  //获取菜单list
  getList = (callBack) => {
    axios.get(wfAssignList).then(res => {
      if (res.data.data) {
        callBack(res.data.data)
      }
    })
  };

  

  //更新回调
  updateSuccess = (newData) => {
    this.table.update(this.state.record, newData)
  };
  //移动回调
  callBackMoveList = (moveInfo, positionID, callback) => {
   
  }

  

  
  //table组件回调的点击 行数据
  getRowData = (record ) => {
    this.setState({
      record: record,
      addEdit: record.type == "bussi" ? true : false,
      releaseEdit: record.type == "bussi" ? false : true,
      deleteEdit: record.type == "bussi" ? false : true,
    })
  }

  //新增
  addSuccess = (newData) => {
    this.table.add(this.state.record, newData)
  }

  //修改
  updateData = (newData) => {
    let { data } = this.state;
    let index = data.findIndex(item => item.id == newData.id);
    data.splice(index, 1, newData);
    this.setState({
      data
    })
  }

  //删除
  deleteData = () => {
    this.table.deleted(this.state.record)
   
  }




  render() {
    const { intl } = this.props.currentLocale;
    const columns = [
      {
        title: intl.get('wsd.i18n.plan.activitydefine.wftitle'),
        dataIndex: 'wfTitle',
        key: 'wfTitle',
        render: (text, record) => {
          if (record.type == "bussi") {
            return <span><MyIcon type="icon-wenjianjia" style={{ fontSize: '18px', marginRight: '8px' }} />{text}</span>
          } else {
            return <span><MyIcon type="icon-liuchengguanli-" style={{ fontSize: '18px', marginRight: '8px' }} />{text}</span>
          }
        },
        width:'35%',
      },
      {
        title: intl.get('wsd.i18n.plan.activitydefine.wfdefname'),
        dataIndex: 'wfDefName',
        key: 'wfDefName',
        width:'25%',
      },
      {
        title: intl.get('wsd.i18n.plan.plandefine.status'),
        dataIndex: 'status',
        key: 'status',
        width:'10%',
      },
      {
        title: intl.get('wsd.i18n.plan.activitydefine.remark'),
        dataIndex: 'remark',
        key: 'remark',
      },
    ];

    return (
      <div>
        <TopTags addSuccess={this.addSuccess}
         deleteData={this.deleteData} 
         rightData={this.state.record} 
         addEdit={this.state.addEdit} 
         releaseEdit={this.state.releaseEdit} 
         deleteEdit={this.state.deleteEdit}
         update={this.updateSuccess}
          />
        <div className={style.main}>
          <div className={style.leftMain} style={{height: this.props.height}}>
               <TreeTable onRef={this.onRef} getData={this.getList} move={this.callBackMoveList} dnd={true}
                        pagination={false} columns={columns}
                        scroll={{x:'100%',y:this.props.height-40}}
                        getRowData={this.getRowData}
              />
          </div>
          <div className={style.rightBox} style={{ height: this.props.height }}>
            <RightTags rightTagList={this.state.rightTags} rightData={this.state.record} updateData={this.updateData} menuCode={this.props.menuInfo.menuCode} />
          </div>
        </div>
      </div>
    )
  }
}

/* *********** connect链接state及方法 start ************* */
export default connect(state => ({
  currentLocale: state.localeProviderData
}))(TableComponent);
/* *********** connect链接state及方法 end ************* */
