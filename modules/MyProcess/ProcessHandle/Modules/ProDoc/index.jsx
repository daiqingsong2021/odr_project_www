import React, { Component } from 'react'
import { Row, Col, Table, Icon, Menu, notification } from 'antd'
import intl from 'react-intl-universal'
import style from './style.less'
import Collect from '../CompDoc/Collect/index'
import Drop from './Dropdown/index'
import Manage from './Manage/index'
import RightTags from '../../../../../components/public/RightTags'
import MyIcon from '../../../../../components/public/TopTags/MyIcon'
import { connect } from 'react-redux'
import * as util from '../../../../../utils/util'
import axios from '../../../../../api/axios'
import { planProAuthTree, docProjectFolderTree, docProjectList, docProjectDel, docFileInfo } from '../../../../../api/api'



class ProjectDoc extends Component {

  state = {
    activeIndex: null,
    LeftActiveIndex: null,
    collectVisible: false,
    DroVisible: false,
    MangageDocVisible: false,
    rowKey: '',
    rightHide: true,
    rightData: null,
    rightTags: [
      { icon: 'iconjibenxinxi', title: '基本信息', fielUrl: 'Doc/ProDoc/Edit' },
      { icon: 'iconlishibanben', title: '历史版本', fielUrl: 'Doc/CompDoc/History' },
      { icon: 'iconfenleima', title: '分类码', fielUrl: 'Components/CategoryCode' },
     
    ],
    LeftData: [],
    leftData: null,
    RightData: [],
    projectData: [],
    projectId: null,
    total: 0,
    pageSize: 10,
    currentPage: 1,
    selectedRowKeys: [],
    selectedRows: [],
    collectReact: null,

  }

  componentDidMount() {
    this.planProAuthTree();
  }



  collect(record) {
    this.setState({ collectVisible: true, collectReact: record })
  }

  collectHandleCancel = () => {
    this.setState({
      collectVisible: false
    })
  }

  manageHandleCancel = () => {
    this.setState({
      MangageDocVisible: false
    })
  }


  setClassName = (record, index) => {
    //判断索引相等时添加行的高亮样式
    return record.id === this.state.activeIndex ? 'tableActivty' : "";
  }
  setLeftClassName = (record, index) => {
    //判断索引相等时添加行的高亮样式
    return record.id === this.state.LeftActiveIndex ? 'tableActivty' : "";
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

  getLeftInfo(record) {
    

    let id = record.id, records = record
    if (this.state.LeftActiveIndex == id) {
      this.setState({
        LeftActiveIndex: null,
        leftData: null,
        RightData: [],
        selectedRowKeys: [],
      })
    } else {
      this.setState({
        LeftActiveIndex: id,
        leftData: record,
        selectedRowKeys: [],
      }, () => {
        this.getDataList();
      })
    }

  }

  DropHandleCancel = (v) => {

    if (v == 'mangageDoc') {
      this.setState({ DroVisible: false, MangageDocVisible: true })
    } else {
      this.setState({ DroVisible: false })
    }
  }

  RightHide = (v) => {
    this.setState({ rightHide: false })

  }
  rightIconBtn = () => {
    this.setState({ rightHide: true })
  }

  //============================================================================================

  // 获取项目列表
  planProAuthTree = () => {
    axios.get(planProAuthTree).then(res => {
      const { data } = res.data
      this.setState({
        projectData: data ? data : []
      })


    })
  }


  // 获取项目文件夹列表
  getPlanDelvTreeList = (id) => {
    axios.get(docProjectFolderTree(id)).then(res => {
      const { data } = res.data
      
      if (res.data.data) {
        const dataMap = util.dataMap(data);
        this.setState({
          LeftData: data,
          dataMap,
          projectId: id
        })
      } else {
        this.setState({
          LeftData: [],
          projectId: id
        })
      }

    })
  }

  //文件夹数据修改
  forceNameUpdate = (newData) => {
    // let { LeftData, dataMap } = this.state;
    this.setState({
      LeftData: newData
    })
  }


  //获取项目文档列表
  getDataList = () => {
    let { leftData, pageSize, currentPage } = this.state;
    axios.post(docProjectList(leftData.id, pageSize, currentPage)).then(res => {
      
      this.setState({
        RightData: res.data.data,
        total: res.data.total
      })
    })
  }

  //刷新项目文档列表列表
  update = () => {
    if (this.state.RightData.length || this.state.leftData) {
      this.getDataList();
    }
  }

  //修改文档列表
  updateData = (newData) => {
    let { RightData } = this.state;
    let index = RightData.findIndex(item => item.id == newData.id);
    RightData.splice(index, 1, newData);
    this.setState({
      RightData
    })
  }

  //删除文档
  deleteData = () => {
    let { selectedRowKeys } = this.state;
    if (selectedRowKeys.length) {
      axios.deleted(docProjectDel, { data: selectedRowKeys }, true, '删除成功').then(res => {
        
        this.setState({
          selectedRowKeys: [],
        })
        this.getDataList();
      })
    }


  }

  //下载
  download = () => {
    let { rightData } = this.state;
    if (rightData) {
      axios.get(docFileInfo(rightData.id)).then(res => {
        
        if (res.data.data) {
          util.download(res.data.data.fileUrl, res.data.data.fileName,res.data.data.id)
        }
      })
    }

  }

  //分发回调
  distribute = () => {
    this.setState({
      selectedRows: [],
    })
  }

  //更改勾选项
  updateSelectedRows = (newData) => {
    this.setState({
      selectedRows: newData
    })
  }
  //右击事件
  contextMenuModul = (event) => {
    event.preventDefault()
    if (this.state.projectId) {
      this.setState({ DroVisible: true, X: event.clientX, Y: event.clientY - 110 })
    } else {
      notification.warning(
        {
          placement: 'bottomRight',
          bottom: 50,
          duration: 2,
          message: '未选中数据',
          description: '请选择项目进行操作'
        }
      )
    }

  }

  folderUpdate = (newData) => {

    let data = newData.docProjectFolderTreeVo;
    let { LeftData, dataMap, leftData } = this.state;
    util.modify(LeftData, dataMap, leftData, data);
    this.setState({
      LeftData
    })

  }


  //===========================================================================================


  render() {
    const { intl } = this.props.currentLocale;

    let { selectedRowKeys, selectedRows } = this.state;
    const rowSelection = {
      selectedRowKeys,
      selectedRows,
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({
          selectedRowKeys,
          selectedRows,
        })
      },
    }

    const LeftColumns = [{
      title: intl.get('wsd.i18n.doc.compdoc.foldername'),//文件夹名称
      dataIndex: 'name',
      key: 'name',
      render: text => <span><MyIcon type="icon-wenjianjia" className={style.leftTableIcon} />{text}</span>
    }, {
      title: intl.get('wsd.i18n.doc.compdoc.docnumber'),//文档数量
      dataIndex: 'docNum',
      key: 'docNum',
    }];

    const RightColumns = [{
      title: intl.get('wsd.i18n.doc.temp.title'),//文档标题
      dataIndex: 'docTitle',
      key: 'docTitle',
      render: (text, record) => <span> <MyIcon type={record.isFavorite ? "icon-shoucang1" : "icon-shoucang2"} onClick={this.collect.bind(this, record)} className={style.icon} /> <MyIcon
        type="icon-chakan" className={style.icon} />{text}</span>
    }, {
      title: intl.get('wsd.i18n.doc.compdoc.docserial'),//文档编号
      dataIndex: 'docNum',
      key: 'docNum',
    }, {
      title: intl.get('wsd.i18n.doc.compdoc.docclassify'),//文档类别
      dataIndex: 'docClassify',
      key: 'docClassify',
      render: text => text ? text.name : ''
    }, {
      title: intl.get('wsd.i18n.doc.temp.author'),//作者
      dataIndex: 'author',
      key: 'author',
    }, {
      title: intl.get('wsd.i18n.doc.temp.versions'),//版本
      dataIndex: 'version',
      key: 'version',
    }, {
      title: intl.get('wsd.i18n.plan.feedback.creattime'),//创建时间
      dataIndex: 'creatTime',
      key: 'creatTime',
    }, {
      title: intl.get('wsd.i18n.doc.compdoc.babelte'),//上传人
      dataIndex: 'creator',
      key: 'creator',
      render: text => text ? text.name : ''
    }, {
      title: intl.get('wsd.i18n.doc.compdoc.docstate'),//文档状态
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
          this.getDataList()
        })
      },
      onChange: (page, pageSize) => {
        this.setState({
          currentPage: page
        }, () => {
          this.getDataList()
        })
      }
    };

    return (
      <div>
        
        <div className={style.main} onClick={this.DropHandleCancel} >

          {this.state.rightHide &&
            <div className={style.leftMain} style={{ height: this.props.height }} onContextMenu={this.contextMenuModul} >
              <Table rowKey={record => record.id} columns={LeftColumns} dataSource={this.state.LeftData}
                pagination={false}
                rowClassName={this.setLeftClassName} size='small'
                onRow={(record) => {
                  return {
                    onContextMenu: (event) => {
                      this.contextMenuModul(event);

                      event.preventDefault()
                      // this.getRightInfo(record);
                    },
                    onClick: (event) => {
                      
                      this.getLeftInfo(record)
                    }
                  }
                }} />
            </div>}
          {!this.state.rightHide &&
            <div className={style.rightIconBtn} onClick={this.rightIconBtn}><Icon type="double-right" /></div>
          }

          <div className={style.conMain} style={{ height: this.props.height }}>
            <Table rowKey={record => record.id} rowSelection={rowSelection} columns={RightColumns}
              dataSource={this.state.leftData ? this.state.RightData : []} pagination={this.state.leftData ? (this.state.RightData.length ? pagination : false) : false}
              rowClassName={this.setClassName} size='small'
              onRow={(record, index) => {
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


            {/* 收藏 */}

            {this.state.collectVisible && <Collect modalVisible={this.state.collectVisible} handleCancel={this.collectHandleCancel} record={this.state.collectReact}
              update={this.getDataList} />}
            {/* 右击弹出框 */}
            {this.state.DroVisible && <Drop handleCancel={this.DropHandleCancel.bind(this)} X={this.state.X}
              Y={this.state.Y} rowKey={this.state.rowKey} />}
            {/* 管理文件夹 */}
            {/* <Manage modalVisible={this.state.MangageDocVisible} handleCancel={this.manageHandleCancel} /> */}
            {this.state.MangageDocVisible && <Manage modalVisible={this.state.MangageDocVisible} data={this.state.LeftData}
              handleCancel={this.manageHandleCancel} upDate={this.forceNameUpdate} projectId={this.state.projectId} />}
          </div>
          <div className={style.rightBox} style={{ height: this.props.height }}>
            <RightTags rightTagList={this.state.rightTags} rightData={this.state.rightData} rightHide={this.RightHide} rightIconBtn={this.rightIconBtn}
              projectId={this.state.projectId} updateData={this.updateData} bizType="projectdoc" />
          </div>
        </div>
      </div>
    )
  }
}


/* *********** connect链接state及方法 start ************* */
export default connect(state => ({
  currentLocale: state.localeProviderData
}))(ProjectDoc);
/* *********** connect链接state及方法 end ************* */
