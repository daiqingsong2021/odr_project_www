import React, { Component } from 'react';
import { Row, Col, Table, Icon, Menu, notification, Checkbox } from 'antd';
import AddGroup from './AddGroup';
import TopTags from './TopTags';
import RightTags from '../../../components/public/RightTags/index';
import { connect } from 'react-redux';
import axios from '../../../api/axios';
import PageTable from '../../../components/PublicTable';
import {
  queryDocUserGroup,
  deleteDocUserGroup,
  queryDocUserGroupAssign,
  addDocUserGroupAssign,
  deleteDocUserGroupAssign,
  updateDocUserGroup,
  updateDocUserGroupAssign
} from '../../../api/api';
import { docProjectFolderTree_ } from '../../../api/suzhou-api';
import * as dataUtil from '../../../utils/dataUtil';
import { docProjectSzxm,docGivingList } from '../../Suzhou/api/suzhou-api.js';
import ExtLayout from "../../../components/public/Layout/ExtLayout";
import LeftContent from "../../../components/public/Layout/LeftContent";
import MainContent from "../../../components/public/Layout/MainContent";
import Toolbar from "../../../components/public/Layout/Toolbar";
import PublicButton from "../../../components/public/TopTags/PublicButton";
class ProjectDoc extends Component {
  state = {
    leftData: null,
    rightData: null,
    LeftList: [],
    rightList: [],
    initRightList: [],
    newRightList: [],
  };

  /**
   @method 父组件即可调用子组件方法
   @description 父组件即可调用子组件方法
   */
  onRef = ref => {
    this.leftTable = ref;
  };
  /**
   @method 父组件即可调用子组件方法
   @description 父组件即可调用子组件方法
   */
  onRefR = ref => {
    this.rightTable = ref;
  };

  componentDidMount() {

  }

  // 获取项目文件夹列表
  getLeftDataList = (callBack) => {
    axios.get(queryDocUserGroup).then(res => {
      if (res.data.data) {
          const { data } = res.data;
          callBack(data ? data : []);
          this.setState({
              leftList : data
          })
      } else {
        callBack([]);
      }
    });
  };



  //右侧表格点击行事件
  getInfo = record => {
    this.setState({
      rightData: record,
    });
  };

  //左侧表格点击事件
  getLeftInfo = record => {
    const { projectName } = this.state;
    this.setState(
      {
        leftData: record,
        selectedRowKeys: [],
        rightList: [],
        rightData: null,
      },
      () => {
        this.rightTable.getData();
      }
    );
  };
  /**
   * 获取复选框 选中项、选中行数据
   * @method
   * @param {string} selectedRowKeys 复选框选中项
   * @param {string} selectedRows  行数据
   */
  getSelectedRowKeys = (selectedRowKeys, selectedRows) => {
    this.setState({
      selectedRows,
      selectedRowKeys,
    });
  };


  //获取组成员
  getDataList = (callBack) => {
    let { leftData,newRightList } = this.state;
    if(newRightList.length > 0){
      callBack(newRightList);
      this.setState({
        newRightList : null
      })
      return;
    }
    if (leftData) {
      axios.get(queryDocUserGroupAssign(leftData.id)).then(res => {
          callBack(res.data.data);
          this.setState({
            rightList: res.data.data,
            initRightList: res.data.data,
            selectedRowKeys: [],
            rightData: null,
          });
        });
    } else {
      callBack([]);
    }
  };

    // 查询
    search = (text) => {
        const {initRightList} = this.state;
        let newRightList = dataUtil.search(initRightList,[{"key":"userName","value":text}],true);
        this.setState({
            newRightList:newRightList
        },() =>{
            this.rightTable.getData();
        });
    }


  //刷新项目文档列表列表
  update = () => {
    if (this.state.rightList.length || this.state.leftData) {
      this.rightTable.getData();
    }
  };

  //修改文档列表
  updateData = newData => {
    let { rightList, rightData } = this.state;
    this.rightTable.update(rightData, newData);
  };

  //删除校验
  deleteVerifyCallBack = () => {
    let { selectedRowKeys, rightData } = this.state;
    const { intl } = this.props.currentLocale;
    if (selectedRowKeys.length == 0) {
      notification.warning({
        placement: 'bottomRight',
        bottom: 50,
        duration: 2,
        message: intl.get('wsd.global.tip.title2'),
        description: intl.get('wsd.global.tip.content2'),
      });
      return false;
    } else {
      return true;
    }
  };
  //删除校验
  deleteVerifyCallBack2 = () => {
    let { leftData, rightData } = this.state;
    const { intl } = this.props.currentLocale;
    if (leftData.length == 0) {
      notification.warning({
        placement: 'bottomRight',
        bottom: 50,
        duration: 2,
        message: intl.get('wsd.global.tip.title2'),
        description: intl.get('wsd.global.tip.content2'),
      });
      return false;
    } else {
      return true;
    }
  };
  //删除文档
  deleteData = () => {
    let { selectedRowKeys, rightList } = this.state;
    const { intl } = this.props.currentLocale;
    if (selectedRowKeys.length) {
      const { startContent } = this.state;
      let url = dataUtil.spliceUrlParams(docProjectDel, { startContent });
      axios.deleted(url, { data: selectedRowKeys }, true, '删除成功', true).then(res => {
        this.rightTable.getData();
      });
    } else {
      notification.warning({
        placement: 'bottomRight',
        bottom: 50,
        duration: 2,
        message: intl.get('wsd.global.tip.title2'),
        description: intl.get('wsd.global.tip.content1'),
      });
    }
  };

 /**
   * 刷新
   *
   */
  refreshRight = () =>{
    this.rightTable.getData();
  }

  /**
   *  新增分发组
   *
   **/
  addGroup = (newData) => {
    this.leftTable.add(null,newData);
  }

  updateGroup = (updateData) => {
    this.leftTable.update(this.state.leftData,updateData);
  }
  /**
   *  分配分发组员
   *
   **/
  assGroupUser = (newData) => {
    this.rightTable.getData();
  }


  onClickHandle1 = name => {
    const { intl } = this.props.currentLocale
    if (name == 'AddTopBtn') {
      this.setState({
        isShowModal: true,
        wftype: "add",
        ModalTitle: "新增分发组",
      });
      return;
    }
    if (name == 'ModifyTopBtn') {
      const { leftData, groupList } = this.state
      if (!leftData) {
        notification.warning(
          {
            placement: 'bottomRight',
            bottom: 50,
            duration: 2,
            message: '未选数据',
            description: '请选择数据进行操作'
          }
        )
        return false;
      }
      this.setState({
        isShowModal: true,
        wftype: "modify",
        ModalTitle: "修改分发组",
      });
      return;
    }
    if (name = "DeleteTopBtn") {
      let { leftData } = this.state;
      if(leftData){
        axios.deleted(deleteDocUserGroup(leftData.id), null, true).then(res => {
            this.leftTable.deleted(leftData);
        })
      }
    }
  };

  updateUserAuth = (record,param,e) => {
      if (e.target.checked){
        record[param]=1
      }else{
        record[param]=0
      }
    axios.put(updateDocUserGroupAssign, record, true).then(res => {

    })
  }

  //关闭业务弹框
  closeAddGroupModal = () => {
    this.setState({
      isShowModal: false,
    });
  };


  // 分配交付清单
  assignUser = (ids) => {
    const { data } = this.state
      axios.post(addDocUserGroupAssign(this.state.leftData.id), [...ids], true).then(res => {
        this.rightTable.getData()
      })
  }

  //移除分发组
  deleteData = () => {
    let { selectedRowKeys, rightList } = this.state;
    const { intl } = this.props.currentLocale;
    if (selectedRowKeys.length) {
      axios.deleted(deleteDocUserGroupAssign, { data: selectedRowKeys }, true, '删除成功', true).then(res => {
          this.rightTable.getData();
      });
    } else {
      notification.warning({
        placement: 'bottomRight',
        bottom: 50,
        duration: 2,
        message: intl.get('wsd.global.tip.title2'),
        description: intl.get('wsd.global.tip.content1'),
      });
    }
  };


  //===========================================================================================

  render() {
    const { intl } = this.props.currentLocale;
    const LeftColumns = [{
      title: '组名',
      dataIndex: 'groupName',
      key: 'groupName',

    }];

    const RightColumns = [{
      title: intl.get("wsd.i18n.sys.user.actuName"),
      dataIndex: 'userName',
      key: 'userName',
    },
      {
        title: '查看',
        dataIndex: 'onlineLookup',
        key: 'onlineLookup',
        render: (text, record) => {
            return <Checkbox checked={record && record.onlineLookup == 1 ? true : false} onChange={this.updateUserAuth.bind(this,record,"onlineLookup")}/>
        }
      },
      {
        title: '升版',
        dataIndex: 'upgrad',
        key: 'upgrad',
        render: (text, record) => {
            return <Checkbox checked={record && record.upgrad == 1 ? true : false} onChange={this.updateUserAuth.bind(this,record,"upgrad")}/>
        }
      },
      // {
      //   title: '覆盖',
      //   dataIndex: 'cover',
      //   key: 'cover',
      //   render: (text, record) => {
      //       return <Checkbox checked={record && record.cover == 1 ? true : false} onChange={this.updateUserAuth.bind(this,record,"cover")}/>
      //   }
      // },

      {
        title: '下载',
        dataIndex: 'download',
        key: 'download',
        render: (text, record) => {
            return <Checkbox checked={record && record.download == 1 ? true : false} onChange={this.updateUserAuth.bind(this,record,"download")}/>
        }
      },
      {
        title: '分发',
        dataIndex: 'outgiving',
        key: 'outgiving',
        render: (text, record) => {
            return <Checkbox checked={record && record.outgiving == 1 ? true : false} onChange={this.updateUserAuth.bind(this,record,"outgiving")}/>
        }
      },
      // {
      //   title: '邮件分发',
      //   dataIndex: 'mail',
      //   key: 'mail',
      //   render: (text, record) => {
      //       return <Checkbox checked={record && record.mail == 1 ? true : false} onChange={this.updateUserAuth.bind(this,record,"mail")}/>
      //   }
      // },
      // {
      //   title: '关联文档',
      //   dataIndex: 'relevance',
      //   key: 'relevance',
      //   render: (text, record) => {
      //       return <Checkbox checked={record && record.relevance == 1 ? true : false} onChange={this.updateUserAuth.bind(this,record,"relevance")}/>
      //   }
      // }
      ];

    return (
      <ExtLayout renderWidth={({ contentWidth }) => { this.setState({ contentWidth }) }}>
        <LeftContent width={300}>
          <Toolbar>
              {/*新增*/}
              <PublicButton name={'新增'} title={'新增'} icon={'icon-add'} afterCallBack={this.onClickHandle1.bind(this, 'AddTopBtn')} />
              {/*新增*/}
              <PublicButton name={'修改'} title={'修改'} icon={'icon-xiugaibianji'}  afterCallBack={this.onClickHandle1.bind(this, 'ModifyTopBtn')} />
              {/*删除*/}
              <PublicButton title={"删除"} useModel={true} content={'你确定要删除吗？'} verifyCallBack={this.deleteVerifyCallBack2} afterCallBack={this.onClickHandle1.bind(this, "DeleteTopBtn")} icon={"icon-delete"} />

              {this.state.isShowModal && <AddGroup
                data={this.state.leftData}
                type={this.state.wftype}
                title={this.state.ModalTitle}
                handleCancel={this.closeAddGroupModal.bind(this)}
                addGroup={this.addGroup}
                updateGroup={this.updateGroup}
              />}
          </Toolbar>
          <PageTable
            onRef={this.onRef}
            getData={this.getLeftDataList}
            columns={LeftColumns}
            contentMenu={this.state.contentMenu}
            scroll={{ x: '100%', y: this.props.height - 100 }}
            getRowData={this.getLeftInfo}
          />
        </LeftContent>
        <MainContent contentWidth={this.state.contentWidth} contentMinWidth={600}>
          <PageTable
            onRef={this.onRefR}
            rowSelection={true}
            useCheckBox={true}
            dataSource={this.state.rightList}
            onChangeCheckBox={this.getSelectedRowKeys}
            getData={this.getDataList}
            columns={RightColumns}
            scroll={{ x: '1500px', y: this.props.height - 100 }}
            getRowData={this.getInfo}
          />
        </MainContent>
        <Toolbar>
            <TopTags
              assignUser={this.assignUser}
              deleteVerifyCallBack={this.deleteVerifyCallBack}
              deleteData={this.deleteData}
              rightUpdateData = {this.rightUpdateData}
              rightAddData = {this.rightAddData }
              leftData={this.state.leftData}
              rightData={this.state.rightData}
              selectedRows={this.state.selectedRows}
              updateSelectedRows={this.updateSelectedRows}
              search={this.search}
            />
        </Toolbar>
        <RightTags
          rightTagList={this.state.rightTags}
          rightData={this.state.rightData}
          rightIconBtn={this.rightIconBtn}
          projectId={this.state.projectId}
          updateData={this.updateData}
          callBackBanner={this.props.callBackBanner}
          menuCode={this.props.menuInfo.menuCode}
          menuInfo={this.props.menuInfo}
        />
      </ExtLayout>
    )
  }
}

/* *********** connect链接state及方法 start ************* */
export default connect(state => ({
  currentLocale: state.localeProviderData,
}))(ProjectDoc);
/* *********** connect链接state及方法 end ************* */
