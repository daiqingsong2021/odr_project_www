import React, { Component } from 'react';
import intl from 'react-intl-universal';
import style from './style.less'
import { Table, notification, Modal ,Button} from 'antd';
import Search from '../../../../components/Search';
import PublicButton from '../../../../../../components/public/TopTags/PublicButton';
import axios from '../../../../../../api/axios'
import * as dataUtil from "../../../../../../utils/dataUtil"
import {deletePeopleEntryDetail,getPeopleEntryDetailList,dowPeopTemp,uploadPeoEntryDetailFile,getPeopleInfos,addOutPeoEntryDe} from '../../../../api/suzhou-api'
import { connect } from 'react-redux';
const confirm = Modal.confirm;

//人员
class Permission extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys:[],
      selectedRows:[],  
    }
  }
  //请求接口函数
  getListData = () => {
    axios.get(getPeopleInfos+`?projectId=${this.props.projectId}&projInfoId=${this.props.projInfoId}&status=${this.props.status}`).then(res => {
      this.setState({
        data: res.data.data,
        initData:res.data.data,
      })
    })
  }
  componentDidMount(){
    this.getListData()
  }
  //关闭弹窗
  handleCancelSelectPeople = (v) =>{
    this.setState({
      SelectPeople:false
    })
  }
  //搜索
  search = (val) => {
    this.setState({
      name:val
    })
    const {initData} = this.state;
    let newData = dataUtil.search(initData,[{"key":"name|telPhone","value":val}],true);
    this.setState({data:newData});
  }
  handleCancel = (e) => {
    this.props.handleCancel();
  };
  handleSubmit = (val, e) => {
    if (this.state.selectedRowKeys.length) {
      const dataArr = [];
      this.state.selectedRows.forEach((currentValue, index, arr)=>{
        let obj = {
          enTryId:this.props.enTryId,
          sectionId:currentValue.sectionId,
          projectId:currentValue.projectId,
          name:currentValue.name,
          type:!currentValue.typeVo?'':currentValue.typeVo.code,
          job:!currentValue.job?"":currentValue.jobVo.code,
          bornDate:!currentValue.bornDate?'':currentValue.bornDate,
          sex:!currentValue.sexVo?"":currentValue.sexVo.code,
          telPhone:currentValue.telPhone,
          idCard:currentValue.idCard,
          peoType:!currentValue.peoTypeVo?"":currentValue.peoTypeVo.code,
          classHour:!currentValue.totalClassHour?"":currentValue.totalClassHour,
          score:!currentValue.score?"":currentValue.score,
          peopleId:currentValue.id,
          score:!currentValue.score?'':currentValue.score,
          gzkh:!currentValue.gzkh?'':currentValue.gzkh
        };
        dataArr.push(obj);
      })
      axios.post(addOutPeoEntryDe,dataArr,true).then(res=>{
        if(res.data.status == 200){
          this.props.handleCancel();
          this.props.getListData('');
          this.props.addPerson();
        }
      })
    }else{
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
    const columns = [
      {
        title:'姓名',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title:'联系方式',
        dataIndex: 'telPhone',
        key: 'telPhone',
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
    return (
      <div className={style.main}>
        <div>
        <Modal title={'选择人员'} visible={this.props.visible}
            onCancel={this.handleCancel}
            width="800px"
            footer={<div className="modalbtn">
              <Button key={1} onClick={this.handleCancel}>取消</Button>
              <Button key={2} onClick={this.handleSubmit.bind(this, 'save')} type="primary">确定</Button>
            </div>}
          >
              <div className={style.search} style={{'margin-bottom':'10px'}}>
                <Search search={this.search} placeholder={'姓名/联系方式'} />
              </div>
              <Table className={style.table} rowKey={record => record.id} columns={columns} dataSource={this.state.data} pagination={false}
                name={this.props.name}
                size='small'
                pagination={false}
                rowSelection={rowSelection}
                onRow={(record, index) => {
                  return {
                    // onClick: (event) => {
                    //   this.getInfo(record, index);
                    // },
                    onDoubleClick: (event) => {
                      event.currentTarget.getElementsByClassName("ant-checkbox-wrapper")[0].click();
                    }
                  };
                }
                } />
          </Modal>
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