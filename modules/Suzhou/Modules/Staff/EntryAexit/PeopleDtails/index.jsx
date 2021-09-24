import React, { Component } from 'react';
import intl from 'react-intl-universal';
import { Table, notification, Modal } from 'antd';
import style from './style.less';
import Search from '../../../../components/Search';
import PublicButton from '../../../../../../components/public/TopTags/PublicButton';
import AddModal from '../PeopleDtailsAdd';
import axios from '../../../../../../api/axios'
import {deletePeopleEntryDetail,getPeopleEntryDetailList,dowPeopTemp,uploadPeoEntryDetailFile} from '../../../../api/suzhou-api'
import { connect } from 'react-redux';
import UploadDoc from '../Upload/index'
import ImportPeople from '../ImportPlanTemp';
const confirm = Modal.confirm;
import { baseURL } from '../../../../../../api/config';
import SelectPeople from '../SelectPeople';
// 布局
import ExtLayout from "@/components/public/Layout/ExtLayout";
import MainContent from "@/components/public/Layout/MainContent";
import Toolbar from "@/components/public/Layout/Toolbar";
import PublicTable from '@/components/PublicTable'

//人员
class Permission extends Component {
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
      total:1,
      UploadVisible: false,//上传文件
      SelectPeople:false,  //选择人员
      search:"",//搜索  姓名/联系方式
    };
  }
  //请求接口函数
  getListData = (searcher) => {
    axios.get(getPeopleEntryDetailList(this.props.data.id,this.state.pageSize,this.state.currentPageNum)+`?searcher=${this.state.search}`).then(res => {
      this.setState({
        data: res.data.data,
        total:res.data.total
      })
    });
  }
  componentDidMount() {
    const {rightData} = this.props;
    if(rightData){
      if(rightData.typeVo.code == 0){
        //进场
        this.setState({
          typeFlag:true
        })
      }else if(rightData.typeVo.code == 1){
        this.setState({
          typeFlag:false
        })
      }
      this.setState({
        projectId:rightData.projectId,
        sectionId:rightData.sectionId,
        enTryId:rightData.id
      })
      this.getListData('')
    }
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
        modalTitle: '新增人员',
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
          modalTitle: '修改人员信息',
        });
      }
    }
    //导入
    if(name == 'importFile'){
      this.setState({
        UploadVisible:true
      })
    }
    //导出
    if(name == 'exportFile'){
        axios.down(dowPeopTemp,{}).then((res)=>{
        })
    }
    //选择人员
    if(name == 'ChosePeopleBtn'){
      this.setState({
        SelectPeople:true
      })
    }
    if (name == 'DeleteTopBtn') {
      let { selectedRowKeys, data,selectedRows } = this.state;
      if (selectedRowKeys.length) {
        selectedRows.forEach((item,index) =>{
           if(item.hasOwnProperty("userId")){
            notification.warning(
              {
                placement: 'bottomRight',
                bottom: 50,
                duration: 2,
                message: '该数据不能删除',
                description: '该人员为项目团队用户，不允许删除'
              }
            )
            return false;
           }else{
               axios.deleted(deletePeopleEntryDetail, { data: selectedRowKeys }, true).then(res => {
              //删除
              const {total,selectedRows,pageSize,currentPageNum} = this.state
              const obj = {
                ...this.props.rightData,
                peoNums:total - selectedRows.length
              }
              let totalPageNum = Math.ceil((total - selectedRows.length) / pageSize);        //计算总页数
              let PageNum = totalPageNum >= currentPageNum ? currentPageNum : totalPageNum   //总页数大于等于 当前页面，当前页数不变 否则 为1
              this.setState({
                  selectedRows:[],
                  selectedRowKeys:[],
                  currentPageNum:PageNum
              },()=>{
                  this.getListData(this.state.search);
                  this.props.updateSuccess(obj);
              })
            })
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
  };
  //更新
  updateSuccess = (data) => {
    let index = this.state.data.findIndex(v => {return v.id == data.id})
    this.setState((preState, props) => ({
      data: [...preState.data.slice(0, index), data, ...preState.data.slice(index + 1)],
      record:data
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
    const obj = {
      ...this.props.rightData,
      peoNums:this.state.total+1
    }
    this.props.updateSuccess(obj);
    this.getListData(this.state.search);
  }
  //关闭权限弹框modal
  closePermissionModal = () => {
    this.setState({
      isShowModal: false
    });
  };
  handleCancel = (v) => {
    this.setState({
        UploadVisible: false
    })
  }
  //关闭弹窗
  handleCancelSelectPeople = (v) =>{
    this.setState({
      SelectPeople:false
    })
  }
   //设置table的选中行class样式
   setClassName = (record, index) => {
    return record.id === this.state.activeIndex ? 'tableActivty' : '';
  };
  //搜索
  search = (val) => {
    this.setState({
      search:val,
      currentPageNum:1
    },()=>{
      this.getListData(val);
    })
  }
  //选择人员回调
  addPerson = (v) =>{
    this.props.addPerson();
  }

  //导入回调
  getListData1 = ()=>{
    axios.get(getPeopleEntryDetailList(this.props.data.id,this.state.pageSize,this.state.currentPageNum)+`?searcher=${this.state.search}`).then(res => {
      this.setState({
        data: res.data.data,
        total:res.data.total
      },()=>{
        const obj = {
          ...this.props.rightData,
          peoNums:this.state.total
        }
        this.props.updateSuccess(obj);
      })
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
          this.getListData('')
        })
      },
      onChange: (page, pageSize) => {
        this.setState({
          currentPageNum: page
        }, () => {
          this.getListData('')
        })
      }
    }
    const { intl } = this.props.currentLocale;
    const titleFlag = this.state.typeFlag? '培训学时':"累计学时"
    const columns = [
      {
        title:'姓名',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title:'人员分类',
        dataIndex: 'typeVo.name',
        key: 'typeVo.name',
      },
      {
        title:'职务',
        dataIndex: 'jobVo.name',
        key: 'jobVo.name',
      },
      {
        title:'性别',
        dataIndex: 'sexVo.name',
        key: 'sexVo.name',
      },
      {
        title:'年龄',
        dataIndex: 'age',
        key: 'age',
      },
      {
        title:'联系方式',
        dataIndex: 'telPhone',
        key: 'telPhone',
      },
      {
        title: '身份证号',
        dataIndex: 'idCard',
        key: 'idCard',
      },
      {
        title:titleFlag,
        dataIndex: 'classHour',
        key: 'classHour',
      },
      {
        title:'培训成绩',
        dataIndex: 'score',
        key: 'score',
      },
      {
        title: '人员类型',
        dataIndex: 'peoTypeVo.name',
        key: 'peoTypeVo.name',
      },
      {
        title: '工资卡号',
        dataIndex: 'gzkh',
        key: 'gzkh',
      },
      
    ];
    let { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({
          selectedRowKeys,
          selectedRows
        })
      }
    };
    const {permission} = this.props;
    return (
      <div className={style.main}>
          <div className={style.mainHeight}>
            <h3 className={style.listTitle}>人员</h3>
            <div className={style.rightTopTogs}>
              <div className={style.search}>
                <Search search={this.search} placeholder={'姓名/联系方式'} />
              </div>
              {/*新增*/}
              {this.state.typeFlag &&
                <div style={{display:'inline-block'}}>
                  {permission.indexOf('ENTRYAEXIT_EDIT-ENTRYPERSONINFO')!==-1 && (
                  <PublicButton edit={((this.props.rightData.statusVo &&this.props.rightData.statusVo.code == 'INIT') || (this.props.rightData.statusVo && this.props.rightData.statusVo.code == 'REJECT' && this.props.taskFlag))?true:false} name={'新增'} title={'新增'} icon={'icon-add'} afterCallBack={this.onClickHandle.bind(this, 'AddTopBtn')} addPerson = {this.props.addPerson}/>)}
                  {permission.indexOf('ENTRYAEXIT_EDIT-ENTRYPERSONINFO')!==-1 && (
                  <PublicButton edit={((this.props.rightData.statusVo &&this.props.rightData.statusVo.code == 'INIT') || (this.props.rightData.statusVo && this.props.rightData.statusVo.code == 'REJECT' && this.props.taskFlag))?true:false} name={'修改'} title={'修改'} icon={'icon-xiugaibianji'} afterCallBack={this.onClickHandle.bind(this, 'ModifyTopBtn')} />)}
                  {permission.indexOf('ENTRYAEXIT_IMPORT-ENTRY-PERSON')!==-1 && (
                  <PublicButton edit={((this.props.rightData.statusVo &&this.props.rightData.statusVo.code == 'INIT') || (this.props.rightData.statusVo && this.props.rightData.statusVo.code == 'REJECT' && this.props.taskFlag))?true:false} name={'导入'} title={'导入'} icon={'icon-daoru1'} afterCallBack={this.onClickHandle.bind(this, 'importFile')} />)}
                  {permission.indexOf('ENTRYAEXIT_IMPORT-ENTRY-PERSON')!==-1 && (
                  <PublicButton edit={((this.props.rightData.statusVo &&this.props.rightData.statusVo.code == 'INIT') || (this.props.rightData.statusVo && this.props.rightData.statusVo.code == 'REJECT' && this.props.taskFlag))?true:false} name={'导出'} title={'导出模版'} icon={'icon-iconziyuan2'} afterCallBack={this.onClickHandle.bind(this, 'exportFile')} />)}
                </div>}
              { !this.state.typeFlag &&
                <span>
                <PublicButton  edit={((this.props.rightData.statusVo &&this.props.rightData.statusVo.code == 'INIT') || (this.props.rightData.statusVo && this.props.rightData.statusVo.code == 'REJECT' && this.props.taskFlag))?true:false}  name={'选择退场人员'} title={'选择退场人员'} icon={'icon-xiugaibianji'} afterCallBack={this.onClickHandle.bind(this, 'ChosePeopleBtn')}/>
                </span>
              }
              {/*删除*/}
              {permission.indexOf('ENTRYAEXIT_EDIT-ENTRYPERSONINFO')!==-1 && (
              <PublicButton edit={((this.props.rightData.statusVo &&this.props.rightData.statusVo.code == 'INIT') || (this.props.rightData.statusVo && this.props.rightData.statusVo.code == 'REJECT' && this.props.taskFlag))?true:false} title={"删除"} useModel={true} verifyCallBack={this.deleteVerifyCallBack} afterCallBack={this.onClickHandle.bind(this,"DeleteTopBtn")} icon={"icon-delete"} />)}
              {this.state.isShowModal &&
                <AddModal
                  visible={this.state.isShowModal}
                  handleCancel={this.closePermissionModal.bind(this)}
                  title={this.state.modalTitle}
                  addOrModify={this.state.addOrModify}
                  data={this.state.addOrModify == 'add' ? this.props.data : this.state.record}
                  parentData={this.props.data}
                  rightData = {this.props.rightData}
                  updateSuccess={this.updateSuccess} addData={this.addData}
                />}
                 {/* 选择人员 */}
                  {this.state.SelectPeople && 
                    <SelectPeople
                        visible = {this.state.SelectPeople}
                        handleCancel = {this.handleCancelSelectPeople}
                        projectId={this.state.projectId}
                        sectionId = {this.state.sectionId}
                        projInfoId = {this.props.data.projInfoId}
                        status = {'1'}
                        enTryId={this.state.enTryId}
                        getListData={this.getListData}
                        addPerson = {this.addPerson}
                    />
                  }
                {/* 上传文件 */}
                {this.state.UploadVisible &&
                    <UploadDoc 
                        modalVisible={this.state.UploadVisible} 
                        handleOk={this.handleOk} 
                        getListData1 = {this.getListData1}
                        handleCancel={this.handleCancel}
                        projectId={this.state.projectId}
                        sectionId={this.state.sectionId}
                        enTryId={this.state.enTryId}
                    />
                }
            </div>
            <div className={style.mainScorll}>
              <Table className={style.table} rowKey={record => record.id} columns={columns} dataSource={this.state.data} pagination={false}
                name={this.props.name}
                // size='small'
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

export default connect(mapStateToProps, null)(Permission);