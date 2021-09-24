import React, { Component } from 'react';
import intl from 'react-intl-universal';
import { Table, notification, Modal,Upload } from 'antd';
import style from './style.less';
import Search from '../../../../components/Search';
import PublicButton from '../../../../../../components/public/TopTags/PublicButton';
import PermissionModal from '../PermissionModal';
import CheckModal from "../../../../components/CheckModal/"
import FilesModal from '../Files';
import axios from '../../../../../../api/axios'
import {deletePeople,getPeopleList,dowPeopTemp,dowErrorWb,priInfoBindFile} from '../../../../api/suzhou-api'
import { connect } from 'react-redux';
import UploadDoc from '../Upload/index'
import MyIcon from '../../../../../../components/public/TopTags/MyIcon';
import { baseURL } from '../../../../../../api/config';
import UploadTpl from '../../../../components/Upload/uploadTpl'
const confirm = Modal.confirm;

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
      filesTitle:"文件",
      data: [],
      selectedRowKeys: [],
      selectedRows:[],
      currentPageNum: 1,
      pageSize: 10,
      total:1,
      UploadVisible: false,//上传文件
      isShowFileModal:false,//文件显示
      file: null,
      fileList: [],
      editFlag:true,
      search:'',
    };
  }
  //请求接口函数
  getListData = (searcher) => {
    axios.get(getPeopleList(this.props.data.id,this.state.pageSize,this.state.currentPageNum)+`?searcher=${this.state.search}`).then(res => {
      this.setState({
        data: res.data.data,
        total:res.data.total
      })
    })
  }
  componentDidMount() {
    this.getListData('')

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
        axios.down('api/szxm/rygl/projInfo/dowPeopTemp',{}).then((res)=>{
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
               axios.deleted(deletePeople, { data: selectedRowKeys }, true).then(res => {
              //删除
              const {total,selectedRows,pageSize,currentPageNum} = this.state
              let totalPageNum = Math.ceil((total - selectedRows.length) / pageSize);        //计算总页数
              let PageNum = totalPageNum >= currentPageNum ? currentPageNum : totalPageNum   //总页数大于等于 当前页面，当前页数不变 否则 为1
              this.setState({
                  selectedRows:[],
                  selectedRowKeys:[],
                  currentPageNum:PageNum
              },()=>{
                  this.getListData('');
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
    const index = this.state.data.findIndex(v =>{ return v.id == data.id} );
    this.setState((preState, props) => ({
      data: [...preState.data.slice(0, index), data, ...preState.data.slice(index + 1)],
      record: data
    }));
  }
  //点击行事件
  getInfo = (record, index) => {
    let id = record.id;
    if (this.state.activeIndex == id) {
      this.setState({
        activeIndex: null,
        selectData: null,
        addOrModify: 'add',
        editFlag:true
      });
    } else {
      this.setState({
        activeIndex: id,
        selectData: record,
        record: record,
        editFlag:false
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
  closePermissionModal = () => {
    this.setState({
      isShowModal: false
    });
  };
  //关闭文件弹窗
  closeFilesModal = () => {
    this.setState({
      isShowFileModal: false
    });
  };
  handleCancel = (v) => {
    this.setState({
        UploadVisible: false
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
      this.getListData();
    })
  }
  //文件操作
  onAction = (record) =>{
    this.setState({
      isShowFileModal: true,
      checkRecord: record
    })
  }
  //关闭附件
  closeCheckModal = () => {
    this.setState({
      isShowFileModal: false
    })
  }
 //上传回调
 file = (files) => {
  let { fileList } = this.state;
  let fileIds = [];
  if (files.response && files.response.data) {
    let file = files.response.data;
    let name = file.fileName.split('.')[0];
    let type = file.fileName.split('.')[1];
    let obj = {
      id: file.id,
      name,
      type
    }
    fileList.push(obj);
    fileIds.push(file.id);
  }
  this.setState({
    fileList,
  })
  const data={
    fileIds,
    bizId:this.state.record.id,
    bizType:"STAFF-PROJINFO-PERSON"
  }
  axios.post(priInfoBindFile,data,true).then(res=>{
    if(res.status == 200){
      this.getListData('');
    }
  })
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
          this.getListData(this.state.search)
        })
      },
      onChange: (page, pageSize) => {
        this.setState({
          currentPageNum: page
        }, () => {
          this.getListData(this.state.search)
        })
      }
    }
    const { intl } = this.props.currentLocale;
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
        title:'累计学时',
        dataIndex: 'totalClassHour',
        key: 'totalClassHour',
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
      {
        title: '状态',
        dataIndex: 'statusVo.name',
        key: 'statusVo.name',
      },
      {
        title: "附件",
        dataIndex: 'fileCount',
        key: 'fileCount',
        render: (text, record) => (
          <a onClick={this.onAction.bind(this, record)} style={{ cursor: 'pointer' }}>{`查看(${text})`}</a>
      )
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
  //上传文件
  const _this = this;
    return (
      <div className={style.main}>
     
          <div className={style.mainHeight}>
            <h3 className={style.listTitle}>人员</h3>
            <div className={style.rightTopTogs}>
              <div className={style.search}>
                <Search search={this.search} placeholder={'姓名/联系方式'} />
              </div>
              {/* <Upload {...head} style={{ cursor: 'pointer' }} >
                  <MyIcon type="icon-shangchuanwenjian" />上传
              </Upload> */}
                <UploadTpl isBatch={true} file={this.file.bind(this)}  editFlag ={this.state.editFlag}/>
              {/*新增*/}
              {/* <PublicButton name={'新增'} title={'新增'} icon={'icon-add'} afterCallBack={this.onClickHandle.bind(this, 'AddTopBtn')} /> */}
              {/*修改*/}
              {/* <PublicButton name={'修改'} title={'修改'} icon={'icon-xiugaibianji'} afterCallBack={this.onClickHandle.bind(this, 'ModifyTopBtn')} />
              <PublicButton name={'导入'} title={'导入'} icon={'icon-iconziyuan1'} afterCallBack={this.onClickHandle.bind(this, 'importFile')} />
              <PublicButton name={'导出'} title={'导出模版'} icon={'icon-iconziyuan2'} afterCallBack={this.onClickHandle.bind(this, 'exportFile')} /> */}

              {/*删除*/}
              {/* <PublicButton title={"删除"} useModel={true} verifyCallBack={this.deleteVerifyCallBack} afterCallBack={this.onClickHandle.bind(this,"DeleteTopBtn")} icon={"icon-delete"} /> */}
              {this.state.isShowModal &&
                <PermissionModal
                  visible={this.state.isShowModal}
                  handleCancel={this.closePermissionModal.bind(this)}
                  title={this.state.modalTitle}
                  addOrModify={this.state.addOrModify}
                  data={this.state.addOrModify == 'add' ? this.props.data : this.state.record}
                  parentData={this.props.data}
                  rightData = {this.props.rightData}
                  updateSuccess={this.updateSuccess} addData={this.addData}
                />}
                 {/* 上传文件 */}
                 {this.state.UploadVisible &&
                    <UploadDoc 
                        modalVisible={this.state.UploadVisible} 
                        handleOk={this.handleOk} 
                        handleCancel={this.handleCancel}
                        getListData={this.getListData}
                        projectId={this.props.projectId}
                        sectionId={this.props.rightData.sectionId}
                        enTryId={this.props.rightData.id}
                        // getDataList={this.props.getDataList}
                    />
                }
                {/* {this.state.isShowFileModal &&
                  <FilesModal
                    visible={this.state.isShowFileModal}
                    handleCancel={this.closeFilesModal.bind(this)}
                    title={this.state.filesTitle}
                    personData = {this.state.record}
                  />
                } */}
                {/* 显示附件 */}
                {this.state.isShowFileModal &&
                    <CheckModal
                        visible={this.state.isShowFileModal}
                        handleCancel={this.closeCheckModal.bind(this)}
                        record={this.state.checkRecord}
                        menuCode = {'STAFF-PROJINFO-PERSON'}
                        // extInfo={this.props.extInfo}
                    />}
            </div>
            <div className={style.mainScorll}>
              <Table 
                className={style.table} 
                rowKey={record => record.id} 
                columns={columns} 
                dataSource={this.state.data} 
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