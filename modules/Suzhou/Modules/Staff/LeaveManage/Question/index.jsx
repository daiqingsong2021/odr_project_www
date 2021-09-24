import React, { Component } from 'react';
import intl from 'react-intl-universal';
import { Table, notification, Modal } from 'antd';
import style from './style.less';

import PublicButton from '../../../../../../components/public/TopTags/PublicButton';
import axios from '../../../../../../api/axios'
import QuestionModal from '../QuestionAdd'
import { funcFuncs,deleteTsPlat,getTsPlatList} from '../../../../api/suzhou-api'
import { connect } from 'react-redux';
const confirm = Modal.confirm;

//调试平台
class DebugPlatform extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initDone: false,
      isShowModal: false,
      activeIndex: '',
      record: '',
      selectData: null,
      addOrModify: 'add',//新增或修改
      modalTitle: null,
      data: [],
      selectedRowKeys: [],
      selectedRows:[],
      currentPageNum: 1,
      pageSize: 10,
      total:1
    };
  }
  //请求接口函数
  getListData = () => {
    // axios.get(getTsPlatList(this.props.data.id,this.state.pageSize,this.state.currentPageNum)).then(res => {
    //   this.setState({
    //     data: res.data.data,
    //     total:res.data.total
    //   })
    // });
    this.setState({
        data:[{
            id: 71062,
            name: "调试平台2",
            projInfoId: 71056,
            address:"aaa"
        }],
        total:1
    })
  }
  componentDidMount() {
    this.getListData()
  }
  //删除验证
  deleteVerifyCallBack=()=>{
    let { selectedRowKeys, data } = this.state;
    if (selectedRowKeys.length==0) {
      notification.warning(
        {
          placement: 'bottomRight',
          bottom: 50,
          duration: 2,
          message: '未选中数据',
          description: '请勾选数据进行操作'
        }
      )
      return false
    }else{
      return true
    }
  }
  onClickHandle = (name) => {
    if (name == 'AddTopBtn') {
      this.setState({
        isShowModal: true,
        addOrModify: 'add',
        modalTitle: '问题跟踪',
      });
    }
    if (name == 'ModifyTopBtn') {
      if (!this.state.activeIndex) {
        notification.warning(
          {
            placement: 'bottomRight',
            bottom: 50,
            duration: 2,
            message: '未选中数据',
            description: '请选择数据进行操作'
          }
        )
      } else {
        this.setState({
          isShowModal: true,
          addOrModify: 'modify',
          modalTitle: '修改调试平台',
        });
      }
    }
    if (name == 'DeleteTopBtn') {
      let { selectedRowKeys, data } = this.state;
      if (selectedRowKeys.length) {
        axios.deleted(deleteTsPlat, { data: selectedRowKeys }, true).then(res => {
          //删除
          const {total,selectedRows,pageSize,currentPageNum} = this.state
          let totalPageNum = Math.ceil((total - selectedRows.length) / pageSize);        //计算总页数
          let PageNum = totalPageNum >= currentPageNum ? currentPageNum : totalPageNum   //总页数大于等于 当前页面，当前页数不变 否则 为1
          this.setState({
              selectedRows:[],
              selectedRowKeys:[],
              currentPageNum:PageNum
          },()=>{
              this.getListData();
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
  };
  //更新
  updateSuccess = (data) => {
    let index = this.state.data.findIndex(v => v.id == data.id)
    this.setState((preState, props) => ({
      data: [...preState.data.slice(0, index), data, ...preState.data.slice(index + 1)],
    }))
  }
  //点击行事件
  getInfo = (record, index) => {
    let id = record.id;
    if (this.state.activeIndex == id) {
      this.setState({
        activeIndex: null,
        selectData: null,
        addOrModify: 'add',
      });
    } else {
      this.setState({
        activeIndex: id,
        selectData: record,
        record: record
      });
    }

  };
  //新增处理
  addData = (v) => {
    this.setState({
      data: [v, ...this.state.data],
      total: this.state.total + 1
    });
  }
  //关闭权限弹框modal
  closeDebugAdd = () => {
    this.setState({
      isShowModal: false
    });
  };
   //设置table的选中行class样式
   setClassName = (record, index) => {
    return record.id === this.state.activeIndex ? 'tableActivty' : '';
  };
  onTest = () =>{
      this.setState({
        isShowModal: true,
        addOrModify: 'add',
        modalTitle: '问题跟踪',
      });
  }
  render() {
    let pagination = {
      total: this.state.total,
      // hideOnSinglePage: true,
      current: this.state.currentPageNum,
      pageSize: this.state.pageSize,
      showSizeChanger: true,
      size:"small",
      showQuickJumper: true,
      showTotal: total => `总共${this.state.total}条`,
      onShowSizeChange: (current, size) => {
        this.setState({
          pageSize: size,
          currentPageNum: 1
        }, () => {
          this.getListData()
        })
      },
      onChange: (page, pageSize) => {
        this.setState({
          currentPageNum: page
        }, () => {
          this.getListData()
        })
      }
    }
    const { intl } = this.props.currentLocale;
    const columns = [
      {
        title: '平台名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title:'平台地址',
        dataIndex: 'address',
        key: 'address',
      },
      {
        title: "问题详情",
        // render:()=>{
        //   return "查看"
        // }
        render: () => <a href="javascript:;" onClick={this.onTest}>action</a>,
      }
    ];
    let { selectedRowKeys,selectedRows} = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({
          selectedRowKeys,
          selectedRows
        })
      }
    };

    return (
      <div className={style.main}>
     
          <div className={style.mainHeight}>
            <h3 className={style.listTitle}>调试平台</h3>
            <div className={style.rightTopTogs}>
              {/*新增*/}
              <PublicButton name={'新增'} title={'新增'} icon={'icon-add'} afterCallBack={this.onClickHandle.bind(this, 'AddTopBtn')} />
              {/*修改*/}
              <PublicButton name={'修改'} title={'修改'} icon={'icon-xiugaibianji'} afterCallBack={this.onClickHandle.bind(this, 'ModifyTopBtn')} />
              {/*删除*/}
              <PublicButton title={"删除"} useModel={true} verifyCallBack={this.deleteVerifyCallBack} afterCallBack={this.onClickHandle.bind(this,"DeleteTopBtn")} icon={"icon-delete"} />
              {this.state.isShowModal &&
                <QuestionModal
                  visible={this.state.isShowModal}
                  handleCancel={this.closeDebugAdd.bind(this)}
                  title={this.state.modalTitle}
                  addOrModify={this.state.addOrModify}
                  data={this.state.addOrModify == 'add' ? this.props.data : this.state.record}
                  parentData={this.props.data}
                  rightData = {this.props.rightData}
                  updateSuccess={this.updateSuccess} addData={this.addData}
                />}
            </div>
            <div className={style.mainScorll}>
              <Table className={style.table} rowKey={record => record.id} columns={columns} dataSource={this.state.data} pagination={false}
                name={this.props.name}
                size='small'
                pagination={pagination}
                rowSelection={rowSelection}
                rowClassName={this.setClassName}
                onRow={(record, index) => {
                  return {
                    onClick: (event) => {
                      this.getInfo(record, index);
                    },
                    onDoubleClick: (event) => {
                      event.currentTarget.getElementsByClassName("ant-checkbox-wrapper")[0].click();
                    }
                  };
                }
                } />
            </div>
          </div>
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    currentLocale: state.localeProviderData,
  }
};
export default connect(mapStateToProps, null)(DebugPlatform);