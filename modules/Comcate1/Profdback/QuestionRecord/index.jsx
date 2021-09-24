import React, { Component } from 'react';
import { Table, notification, Modal } from 'antd';
import style from './style.less';

import axios from '@/api/axios'
import {queryQuestionRecordList} from '@/api/suzhou-api'
import { connect } from 'react-redux';
const confirm = Modal.confirm;
import { baseURL } from '@/api/config';
import * as dataUtil from '@/utils/dataUtil';
import CheckModal from "./CheckModal"
//问题记录
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
      UploadVisible: false,//上传文件
      isShowCheckModal:false,//查看附件
    };
  }
  //请求接口函数
  getListData = (id) => {
    axios.get(queryQuestionRecordList(id)).then(res => {
      this.setState({
        data: res.data.data,
      })
    });
  }
  componentDidMount() {
    const {rightData} = this.props;
    this.setState({
      projectId:rightData.projectId,
      sectionId:rightData.sectionId,
      biztype:rightData.bizTypeVo,
    })
    rightData ? this.getListData(rightData.id): null;
  }
    //动作
  getActionName=(value)=>{
    switch(value.code){
      case '0':
        return '新建';
        break
      case '1':
        return '发布';
        break
      case '2':
        return '处理';
          break
      case '3':
        return '转发';
        break
      case '4':
        return '驳回';
        break
      case '5':
        return '确认';
        break
      case '6':
        return '挂起';
        break
      case '7':
        return '取消挂起';
        break
      case '8':
        return '关闭';
        break
      default:
        return '无'
    }  
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
   //设置table的选中行class样式
   setClassName = (record, index) => {
    return record.id === this.state.activeIndex ? 'tableActivty' : '';
  };
  //显示附件
  onClickHandleCheck = (record) => {
    this.setState({
        isShowCheckModal: true,
        checkRecord: record
    })
  }
  //关闭附件
  closeCheckModal = () => {
    this.setState({
        isShowCheckModal: false
    })
  }
  render() {
    const columns = [
        {
            title: "序号",
            render: (text, record, index) => `${index + 1}`
        },
        {
            title: '处理说明',
            dataIndex: 'remark',
            key: 'remark',
            render: (text) => {
                if (text) {
                    return <span title={text}>{text}</span>
                } else {
                    return null
                }
            }
        },
        {
            title: '动作',
            dataIndex: 'actionVo',
            key: 'actionVo',
            render: (text) => {
                if (text) {
                    return <span title={this.getActionName(text)}>{this.getActionName(text)}</span>
                } else {
                    return null
                }
            }
        },
        {
            title: '创建人',
            dataIndex: 'createrVo',
            key: 'createrVo',
            render: (text) => {
                if (text) {
                    return <span title={text.name}>{text.name}</span>
                } else {
                    return null
                }
            }
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            key: 'createTime',
            render: (text) => {
                if (text) {
                    return <span title={dataUtil.Dates().formatDateString(text)}>{dataUtil.Dates().formatDateString(text)}</span>
                } else {
                    return null
                }
            }       
        },
        {
            title: '所属组织',
            dataIndex: 'createrOrgVo',
            key: 'createrOrgVo',
            render: (text) => {
                if (text) {
                    return <span title={text.name}>{text.name}</span>
                } else {
                    return null
                }
            }
        },
        {
            title: '联系方式',
            dataIndex: 'createrVo.phone',
            key: 'createrVo.phone',
            render: (text) => {
                if (text) {
                    return <span title={text}>{text}</span>
                } else {
                    return null
                }
            }
        },
        {
          title: '下一步处理人',
          dataIndex: 'userVo',
          key: 'userVo',
          render: (text) => {
              if (text) {
                  return <span title={text.name}>{text.name}</span>
              } else {
                  return null
              }
          }
        },
        {
            title: '所属组织',
            dataIndex: 'orgVo',
            key: 'orgVo',
            render: (text) => {
                if (text) {
                    return <span title={text.name}>{text.name}</span>
                } else {
                    return null
                }
            }
        },
        {
            title: '联系方式',
            dataIndex: 'userVo.phone',
            key: 'userVo.phone',
            render: (text) => {
                if (text) {
                    return <span title={text}>{text}</span>
                } else {
                    return null
                }
            }
        },
        {
            title: '附件',
            dataIndex: 'fileCount',
            key: 'fileCount',
            render:(text,record)=>{
                return <a onClick={this.onClickHandleCheck.bind(this, record)} style={{ cursor: 'pointer' }}>{`查看(${text})`}</a>
              }
        },
    ];
    return (
      <div className={style.main}>
     
          <div className={style.mainHeight}>
            <h3 className={style.listTitle}>问题记录</h3>
            <div className={style.rightTopTogs}>
             
                {/* 查看附件 */}
                {this.state.isShowCheckModal &&
                    <CheckModal
                        visible={this.state.isShowCheckModal}
                        handleCancel={this.closeCheckModal.bind(this)}
                        record={this.state.checkRecord}
                        menuCode = {'STAFF-SPECIALTYPE-CERTIFICATE'}
                        deleteFlag = {'hide'}
                        biztype={this.state.biztype}
                        // extInfo={this.props.extInfo}
                />}
            </div>
            <div className={style.mainScorll}>
              <Table className={style.table} rowKey={record => record.id} columns={columns} dataSource={this.state.data} pagination={false}
                  name={this.props.name}
                  size='small'
                  pagination={false}
                  rowClassName={this.setClassName}
                  onRow={(record, index) => {
                      }
                  }
                  scroll={{x:'1000px'}}
                />
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



        