import React, { Component } from 'react';
import intl from 'react-intl-universal';
import style from './style.less'
import { Table, notification, Modal ,Button,Checkbox} from 'antd';
import Search from '../../../Suzhou/components/Search';
import PublicButton from '@/components/public/TopTags/PublicButton';
import axios from '@/api/axios'
import * as dataUtil from "@/utils/dataUtil"
import {getPeopleInfos,addOutPeoEntryDe} from '../../../Suzhou/api/suzhou-api'
import { connect } from 'react-redux';
const confirm = Modal.confirm;

//人员
class Permission extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys:[],
      selectedRows:[], 
      loading:false, 
    }
  }
  //请求接口函数
  getListData = () => {
    this.setState({loading:true});
    axios.get('api/sys/org/getGcSections').then(res=>{
      res.data.data.map((item,index)=>{
        item.isSupervise = '0'
      })
      this.setState({
        data:res.data.data,
        initData:res.data.data,
        loading:false
      })
    });
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
    let newData = dataUtil.search(initData,[{"key":"name|code","value":val}],true);
    this.setState({data:newData});
  }
  handleCancel = (e) => {
    this.props.handleCancel();
  };
  handleSubmit = (val, e) => {
    if (this.state.selectedRowKeys.length) {
      const dataArr = [];
      const {record,extendedColumn2} = this.props;
      this.state.selectedRows.forEach((currentValue, index, arr)=>{
        let obj = {
          teamCode:currentValue.code,
          teamName:currentValue.name,
          parentId:record.id,
          bizType:record.bizType,
          bizId:record.bizId,
          extendedColumn1:'section',
          extendedColumn2,
          pgSectionId:currentValue.pgSectionId,
          isSupervise:currentValue.isSupervise
        };
        dataArr.push(obj);
      })
      axios.post('api/sys/org/addGcSections ',dataArr,true).then(res=>{
        if(res.data.status == 200){
          this.props.handleCancel();
          this.props.successSection();
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
  checkSupervise=(keyIndex,e)=>{
    let newData = this.state.data
    newData[keyIndex].isSupervise=e.target.checked ? '1':'0'
    this.setState({
      data:newData
    })
  }
  checkSuperviseAll=(e)=>{
    let newData = this.state.data
    newData.map((item,index)=>{
      item.isSupervise=e.target.checked ? '1':'0'
    })
    this.setState({
      data:newData
    })
  }
  render() {
    const { intl } = this.props.currentLocale;
    const Supervise = ()=>{
      return(
        <Checkbox onChange={this.checkSuperviseAll}>是否为监理</Checkbox>
      )
  }
    const columns = [
      {
        title:'标段名称',
        dataIndex: 'name',
        key: 'name',
        width:'60%',
      },
      {
        title:'标段号',
        dataIndex: 'code',
        key: 'code',
        width:'20%',
      },
      {
        title:Supervise,
        dataIndex:'isSupervise',
        key:'isSupervise',
        width:'20%',
        render:(text, record, index)=>{
          return(
            <Checkbox checked={this.state.data[index].isSupervise == '1'?true:false} onChange={this.checkSupervise.bind(this,index)}></Checkbox>
          )
        }
      }
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
        <Modal title={'选择标段'} visible={this.props.visible}
            onCancel={this.handleCancel}
            width="1000px"
            footer={<div className="modalbtn">
              <Button key={1} onClick={this.handleCancel}>取消</Button>
              <Button key={2} onClick={this.handleSubmit.bind(this, 'save')} type="primary">确定</Button>
            </div>}
          >
              <div className={style.search} style={{'margin-bottom':'10px'}}>
                <Search search={this.search} placeholder={'标段号/标段名称'} />
              </div>
              <Table className={style.table} rowKey={record => record.id} columns={columns} dataSource={this.state.data} pagination={false}
                name={this.props.name}
                size='small'
                pagination={false}
                rowSelection={rowSelection}
                loading = {this.state.loading}
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