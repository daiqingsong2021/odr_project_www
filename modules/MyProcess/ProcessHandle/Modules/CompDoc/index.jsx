import React, { Component } from 'react'
import { Row, Col, Table, Icon, notification } from 'antd'
import style from './style.less'
import Collect from './Collect/index'

import RightTags from '../../../../../components/public/RightTags'
import Drop from './Dropdown/index'
import Manage from './Manage/index'
import MyIcon from '../../../../../components/public/TopTags/MyIcon'
import { connect } from 'react-redux'

import * as util from '../../../../../utils/util'
import axios from '../../../../../api/axios'
import { docCompFolderList, docCompList, docCompDel, docFileInfo } from '../../../../../api/api'



class CompDoc extends Component {

  state = {
    activeIndex: '',
    activeLeftIndex: '',
    collectVisible: false,
    DroVisible: false,
    rightHide: true,
    pageSize: 10,
    currentPage: 1,
    expandedRowKeys: [],
    rowKey: '',
    X: '',
    Y: '',
    rightData: null,
    rightTags: [
      { icon: 'iconjibenxinxi', title: '基本信息', fielUrl: 'Doc/CompDoc/Edit' },
      { icon: 'iconfenleima', title: '历史版本', fielUrl: 'Doc/CompDoc/History' },
      { icon: 'iconliuchengxinxi', title: '流程信息', fielUrl: 'Doc/CompDoc/ProcessInformation' }
    ],

    LeftData: [],
    dataMap: [],
    RightData: [],
    leftRecord: null,
    selectedRowKeys: [],
    total: 0,
    collectReact: null,

  }

  //请求左边文件夹列表
  getFolderList = () => {
    axios.get(docCompFolderList).then(res => {
      ;
      let dataMap = util.dataMap(res.data.data)
      this.setState({
        LeftData: res.data.data,
        dataMap
      })
    })
  }


  componentDidMount() {
    this.getFolderList();
  }

  //请求右边文档列表
  getRightList = () => {
    let { leftRecord, pageSize, currentPage } = this.state;
    let id = leftRecord ? leftRecord.id : null;
    if (id) {
      axios.get(docCompList(id, pageSize, currentPage), { code: '' }).then(res => {
        ;
        this.setState({
          RightData: res.data.data,
          total: res.data.total
        })
      })
    }

  }


  //收藏
  collect = (record) => {
    
    this.setState({ collectVisible: true, collectReact: record })
  }

  collectHandleCancel = () => {
    this.setState({
      collectVisible: false
    })
  }


  setClassName = (record, index) => {
    //判断索引相等时添加行的高亮样式
    return record.id === this.state.activeIndex ? 'tableActivty' : "";
  }
  setLeftClassName = (record, index) => {
    //判断索引相等时添加行的高亮样式
    return record.id === this.state.activeLeftIndex ? 'tableActivty' : "";
  }

  leftGetInfo(record) {
    
    let id = record.id, records = record;
    if (this.state.activeLeftIndex == id) {
      this.setState({
        activeLeftIndex: null,
        leftRecord: null,
        RightData: [],
        selectedRowKeys: [],
      })
    } else {

      this.setState({
        activeLeftIndex: id,
        leftRecord: record,
        selectedRowKeys: [],
      }, () => {
        this.getRightList();
      })
    }

  }

  getInfo(record) {
    

    let id = record.id, records = record

    if (this.state.activeIndex == id) {
      this.setState({
        activeIndex: null,
        rightData: null
      })
    } else {
      this.setState({
        activeIndex: id,
        rightData: record
      })
    }

  }

  manageHandleCancel = () => {
    this.setState({
      MangageDocVisible: false
    })
  }


  RightHide = (v) => {
    this.setState({ rightHide: false })

  }
  rightIconBtn = () => {
    this.setState({ rightHide: true })
  }
  DropHandleCancel = (v, id) => {

    if (v == 'mangageDoc') {
      this.setState({ DroVisible: false, MangageDocVisible: true })
    } else {
      this.setState({ DroVisible: false })
    }
  }


  //文件夹名称修改
  forceNameUpdate = (newData) => {
    // let { LeftData, dataMap } = this.state;
    this.setState({
      LeftData: newData
    })
  }
  //修改右侧列表
  updateData = (newData) => {
    let { RightData } = this.state;
    if (Array.isArray(newData)) {

      newData.map(item => {
        let index = RightData.findIndex(val => val.id == item.id)

        RightData.splice(index, 1, item)
      })
      this.setState({
        RightData
      })

    } else {

      let index = RightData.findIndex(val => val.id == newData.id)
      RightData.splice(index, 1, newData)
      this.setState({
        RightData
      })

    }
  }

  //文档列表删除
  delete = () => {
    let { selectedRowKeys, RightData } = this.state;

    if (selectedRowKeys.length) {

      axios.deleted(docCompDel, { data: selectedRowKeys }, true, '删除成功').then(res => {
        // selectedRowKeys.map(item => {
        //   let index = RightData.findIndex(val => val.id == item);
        //   RightData.splice(index, 1)
        // })
        // this.setState({
        //   RightData,
        //   selectedRowKeys: [],

        // })
        this.getRightList();
        this.setState({
          selectedRowKeys: [],
        })

      })


    } else {
      notification.warning(
        {
          placement: 'bottomRight',
          bottom: 50,
          duration: 2,
          message: '未选中数据',
          description: '请选择数据进行操作'
        }
      )
    }

  }

  //上传后文档列表操作
  addList = (newData) => {

    this.setState({
      RightData: [newData, ...this.state.RightData],
      total: this.state.total + 1
    })
  }


  //下载
  downloadDoc = () => {
    let { rightData } = this.state;
    if (rightData) {
      axios.get(docFileInfo(rightData.id)).then(res => {
        if (res.data.data) {
          util.download(res.data.data.fileUrl, res.data.data.fileName,res.data.data.id)
        }
      })

    } else {

      notification.warning(
        {
          placement: 'bottomRight',
          bottom: 50,
          duration: 2,
          message: '未选中数据',
          description: '请选择数据进行操作'
        }
      )

    }

  }


  render() {

    const { intl } = this.props.currentLocale;

    const LeftColumns = [{
      title: intl.get("wsd.i18n.doc.compdoc.foldername"),//文件夹名称
      dataIndex: 'name',
      key: 'name',
      render: text => <span><MyIcon type="icon-wenjianjia" className={style.leftTableIcon} />{text}</span>
    }, {
      title: intl.get("wsd.i18n.doc.compdoc.docnumber"),//文档数量
      dataIndex: 'docNum',
      key: 'docNum',
    }];

    const RightColumns = [{
      title: intl.get('wsd.i18n.doc.temp.title'), //文档标题
      dataIndex: 'docTitle',
      key: 'docTitle',
      render: (text, record) => <span> <MyIcon type={ record.isFavorite ? "icon-shoucang1" : "icon-shoucang2" } onClick={this.collect.bind(this, record)} className={style.icon} /> <MyIcon
        type="icon-chakan" className={style.icon} />{text}</span>
    }, {
      title: intl.get("wsd.i18n.doc.compdoc.docserial"),//文档编号
      dataIndex: 'docNum',
      key: 'docNum',
    }, {
      title: intl.get("wsd.i18n.sys.user1.userlevel"),//密级
      dataIndex: 'secutyLevel',
      key: 'secutyLevel',
      render: text => text ? text.name : ''
    }, {
      title: intl.get("wsd.i18n.doc.temp.versions"),//版本
      dataIndex: 'version',
      key: 'version',
    }, {
      title: intl.get("wsd.i18n.plan.feedback.creattime"),//创建时间
      dataIndex: 'creatTime',
      key: 'creatTime',
    }, {
      title: intl.get("wsd.i18n.plan.baseline.lastupdtime"),//更新时间
      dataIndex: 'lastUpdTime',
      key: 'lastUpdTime',
    }, {
      title: intl.get("wsd.i18n.doc.compdoc.docstate"),//文档状态
      dataIndex: 'status',
      key: 'status',
      render: text => text ? text.name : ''
    }];

    let pagination = {
      total: this.state.total,
      // hideOnSinglePage: true,
      current: this.state.currentPage,
      pageSize: this.state.pageSize,
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => `每页${this.state.pageSize}条/共${Math.ceil(this.state.total / this.state.pageSize)}页`,
      onShowSizeChange: (current, size) => {
        this.setState({
          pageSize: size,
          currentPage: 1
        }, () => {
          this.getRightList()
        })
      },
      onChange: (page, pageSize) => {
        this.setState({
          currentPage: page
        }, () => {
          this.getRightList()
        })
      }
    };

    let { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({
          selectedRowKeys
        })
      },

    }

    return (
      <div>
      

        <div className={style.main}>
          {this.state.rightHide &&
            <div className={style.leftMain} style={{ height: this.props.height }} onClick={this.DropHandleCancel} >
              <Table rowKey={record => record.id} columns={LeftColumns} dataSource={this.state.LeftData}
                pagination={false} size='small'
                rowClassName={this.setLeftClassName}
                onRow={(record) => {
                  return {
                    onContextMenu: (event) => {
                      this.setState({ DroVisible: true, X: event.clientX, Y: event.clientY - 110, rowKey: record.id })
                      event.preventDefault()
                    },
                    onClick: (event) => {
                      this.leftGetInfo(record);
                    }
                  }
                }

                }
              />
            </div>}
          {!this.state.rightHide &&
            <div className={style.rightIconBtn} onClick={this.rightIconBtn}><Icon type="double-right" /></div>
          }
          <div className={style.conMain} style={{ height: this.props.height }}>
            <Table rowKey={record => record.id} rowSelection={rowSelection} columns={RightColumns}
              dataSource={this.state.leftRecord ? this.state.RightData : []} pagination={this.state.leftRecord ? (this.state.RightData.length ? pagination : false) : false} size='small'
              rowClassName={this.setClassName}
              onRow={(record) => {
                return {
                  onClick: (event) => {
                    this.getInfo(record)
                  },
                  onDoubleClick: (event) => {
                    event.currentTarget.getElementsByClassName("ant-checkbox-wrapper")[0].click();
                  }
                }
              }}
            />
            {/* 文档收藏 */}
            {this.state.collectVisible && <Collect modalVisible={this.state.collectVisible} handleCancel={this.collectHandleCancel} record={this.state.collectReact}
            update={this.getRightList} />}
            {/* 右击弹出框 */}
            {this.state.DroVisible && <Drop handleCancel={this.DropHandleCancel.bind(this)} X={this.state.X}
              Y={this.state.Y} rowKey={this.state.rowKey} />}
            {/* 管理文件夹 */}
            {this.state.MangageDocVisible && <Manage modalVisible={this.state.MangageDocVisible} handleCancel={this.manageHandleCancel}
              upDate={this.forceNameUpdate} />}
          </div>
          <div className={style.rightBox} style={{ height: this.props.height }}>
            <RightTags rightTagList={this.state.rightTags} rightData={this.state.rightData} rightHide={this.RightHide} rightIconBtn={this.rightIconBtn}
              updateData={this.updateData} />
          </div>
        </div>
      </div>
    )
  }
}


/* *********** connect链接state及方法 start ************* */
export default connect(state => ({
  currentLocale: state.localeProviderData,
}))(CompDoc);
/* *********** connect链接state及方法 end ************* */
