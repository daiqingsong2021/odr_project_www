import React, { Component, Fragment } from 'react'
import { notification,Table, Modal, Input, Button, InputNumber, Form, Spin } from 'antd'
import style from './style.less'
import { connect } from 'react-redux'
import { changeLocaleProvider } from '@/store/localeProvider/action'
import * as util from '@/utils/util';
import * as dataUtil from '@/utils/dataUtil';
import { getDailyDetailPageList, energyDailyUpdate,addDailyChangeVersion } from '@/modules/Suzhou/api/suzhou-api';
import axios from '@/api/axios';
import notificationFun from '@/utils/notificationTip';
import LabelFormLayout from "@/components/public/Layout/Labels/Form/LabelFormLayout"
import EditLogModal from '@/modules/Suzhou/components/EditLogModal/index'
const EditableContext = React.createContext();
const { TextArea } = Input;
const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);
const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
  state = {
    editing: false,
  };
  toggleEdit = () => {
    const editing = !this.state.editing;
    this.setState({ editing }, () => {
      if (editing) {
        this.input.focus();
      }
    });
  };
  save = e => {
    const { record, handleSave } = this.props;
    this.form.validateFields((error, values) => {
      if (error && error[e.currentTarget.id]) {
        return;
      }
      this.toggleEdit();
      handleSave({ ...record, ...values });
    });
  };
  renderCell = form => {
    this.form = form;
    const { children, dataIndex, record, title, showEdit } = this.props;
    const { editing } = this.state;
    return editing ? (
      dataIndex == 'powerConsumption' ?
        <Form.Item style={{ margin: 0 }}>
          {form.getFieldDecorator(dataIndex, {
            rules: [
              {
                required: true,
                message: `${title} is required.`,
              },
            ],
            initialValue: record[dataIndex],
          })(<InputNumber min={0} ref={node => (this.input = node)} onPressEnter={this.save} onBlur={this.save} style={{ width: '100%' }} />)}
        </Form.Item> :
        <Form.Item style={{ margin: 0 }}>
          {form.getFieldDecorator(dataIndex, {
            rules: [

            ],
            initialValue: record[dataIndex],
          })(<Input.TextArea ref={node => (this.input = node)} onPressEnter={this.save} onBlur={this.save} />)}
        </Form.Item>
    ) : (
        <div
          className="editable-cell-value-wrap"
          style={{ paddingRight: 24 }}
          onClick={showEdit ? this.toggleEdit : null}
        >
          {children}
        </div>
      );
  };
  render() {
    const {
      editable,
      dataIndex,
      title,
      record,
      index,
      handleSave,
      children,
      ...restProps
    } = this.props;
    return (
      <td {...restProps}>
        {editable ? (
          <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
        ) : (
            children
          )}
      </td>
    );
  }
}

class Energy extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: '??????',
        dataIndex: 'lineName',
        width: '10%',
      },
      {
        title: '????????????',
        dataIndex: 'linePeriod',
        width: '10%',
      },
      {
        title: '????????????',
        dataIndex: 'powerTypeVo.name',
        width: '10%',
      },
      {
        title: '??????/?????????',
        dataIndex: 'subStation',
        width: '10%',
      },
      {
        title: '??????',
        dataIndex: 'switchgear',
        width: '10%',
      },
      {
        title: '?????????',
        dataIndex: 'powerConsumption',
        width: '15%',
        editable: true,
      },
      {
        title: '??????',
        dataIndex: 'description',
        width: '25%',
        editable: true,
      }
    ];
    this.state = {
      dataSource: [],
      pageSize: 100,
      currentPageNum: 1,
      dailyId: '', //??????id
      count: 1,
      activeIndex: '',
      record: '',
      rightData: '',
      sumbitData: [],  //?????????????????????
      tipArr:[],
      editInfoArr:[], //????????????????????????
      changeButtonShow: true,
      showEditInfoModal:false,    //??????????????????
      submitShow: 0,
      showSubmitModal: false,
      loading: false,
      showEdit:false,
      modifyRemark:''
    };
  }
  componentDidMount() {
    this.setState({
      dailyId: this.props.record.id
    }, () => {
      this.getList()
    })
  }
  //???????????????
  getList = () => {
    this.setState({ loading: true })
    const { dailyId, pageSize, currentPageNum, sumbitData } = this.state
    axios.get(getDailyDetailPageList(dailyId, pageSize, currentPageNum)).then(res => {
      let data = res.data.data;
      if(sumbitData.length>0){
        data.map((item,index)=>{
          const indexs = sumbitData.findIndex(val=>val.id==item.id)
          if(indexs>-1){
            data[index].powerConsumption = sumbitData[indexs].powerConsumption
            data[index].description = sumbitData[indexs].description
          }
        })
      }
      this.setState({
        loading: false,
        oldData: data,
        dataSource: data,
        total: res.data.total,
        rightData: null,
        selectedRowKeys: [],
      })
    })
  }
  //????????????
  handleAdd = () => {
    const { count, dataSource } = this.state;
    const newData = {
      key: count,
      id: count,
      name: '1??????',
      age: '??????',
      type: '????????????',
      station: '???????????????',
      eleTable: '??????',
      sum: 2548 + count,
      address: '3????????????',
    };
    this.setState({
      dataSource: [...dataSource, newData],
      count: count + 1,
    });
  };
  //????????????
  currentSave = (row) => {
    const newData = [...this.state.dataSource];
    const index = newData.findIndex(item => row.id === item.id);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    this.setState({ dataSource: newData });
  }
  //??????????????????
  editInfoArrFun=(item,row)=>{
    let { tipArr, editInfoArr } = this.state
    if (tipArr.indexOf(row.id) > -1) {
      if (item.powerConsumption == row.powerConsumption && item.description == row.description) {
        tipArr = tipArr.filter(item => item !== row.id )
        editInfoArr = editInfoArr.filter(item => item.title !== row.id )
      }else{
          editInfoArr.map((item, index) => {
            if(item.title == row.id){
              editInfoArr[index].powerValue = row.powerConsumption
              editInfoArr[index].desValue = row.description
            }
          })  
        }
      } else if(tipArr.indexOf(row.id) < 0 && (item.powerConsumption !== row.powerConsumption || item.description !== row.description)){
          tipArr.push(row.id)
          editInfoArr.push({ title:row.id,name:`${row.subStation}???${row.switchgear}-${row.powerTypeVo.name}`, powerValueBefore: item.powerConsumption, powerValue: row.powerConsumption,
            desValueBefore: item.description, desValue: row.description
          })
      }
      this.setState({
        tipArr, 
        editInfoArr
      })
  }
  //??????
  handleSave = row => {
    this.currentSave(row)
    const { oldData, sumbitData } = this.state
    const index = oldData.findIndex(item => row.id == item.id)
    const item = oldData[index];
    let newData = [...sumbitData]
    this.editInfoArrFun(item,row)
    if (Number(item.powerConsumption) !== Number(row.powerConsumption) || item.description !== row.description) {
      const editIndex = newData.findIndex(val => val.id == item.id)
      if (editIndex > -1) {
        newData.map((vals, index) => {
          if (vals.id == item.id) {
            newData[index].powerConsumption = row.powerConsumption
            newData[index].description = row.description
          }
        })
      } else {
        newData.push({ id: item.id, dailyId: item.dailyId, powerConsumption: row.powerConsumption, description: row.description })
      }
    }else{
      newData = newData.filter(item => item.id !== row.id )
    }
    this.setState({ sumbitData: newData })
  };
  //?????????????????????
  getInfo = (record) => {
    const { activeIndex } = this.state;
    const { id } = record;
    this.setState({
      activeIndex: id,
      record: record,
      rightData: record
    });
  }
  //????????????????????????
  editInfoFun=()=>{
    const { showEditInfoModal } = this.state
    this.setState({
        showEditInfoModal: !showEditInfoModal,
    })
  }
  //??????????????????
  changeButton = () => {
    let submitShow = this.state.submitShow
    submitShow++
    this.setState({
      changeButtonShow: false,
      showEdit:true,
      submitShow
    }, () => {
      if (this.state.changeButtonShow == false && this.state.submitShow > 1) {
        this.setState({
          showSubmitModal: true
        })
      }
    })
  }
  //??????
  handleSubmit=()=>{
    this.handleCancel()
    const { changeButtonShow, sumbitData } = this.state
    if (changeButtonShow == false && sumbitData.length>0) {
      this.setState({
        loading: true
      })
      let f1 = new Promise((resolve, reject) => {
        axios.put(energyDailyUpdate, sumbitData, true).then(res => {
          if (res.data.status === 200) {
            resolve('success')
            this.setState({
              tipArr:[], 
              editInfoArr:[],
              sumbitData:[]
            })
            // this.getList()
          }
        });
      })
      let f2 = new Promise((resolve, reject) => {
        const params = {
            moudleRecordId:this.props.record.id,
            moudleName:'????????????',
            modifyRemark:this.state.modifyRemark,
            modifyContent:document.getElementById('modifyContent').innerText
        }
        axios.post(addDailyChangeVersion,params,true).then(res => {
            if (res.data.status === 200) {
                resolve('success')
                // this.setState({ showSubmitModal: false })
                // this.props.handleCancel()
                // this.getList()
            }else{
                notification.error(
                    {
                      placement: 'bottomRight',
                      bottom: 50,
                      duration: 2,
                      message: '?????????',
                      description: res.data.msg
                    }
                  )
            }
        })
      })
      Promise.all([f1, f2]).then( (results) => {
        // console.log(results)// ["p1 data", ""p2 data""]
        if(results && results.length > 1 && results[0] == 'success' && results[1] == 'success'){
            // this.props.updateSuccess()
            this.setState({ showSubmitModal: false })
            this.getList()
        }else{
            notification.error(
                {
                  placement: 'bottomRight',
                  bottom: 50,
                  duration: 2,
                  message: '?????????',
                  description: '?????????'
                }
              )
        }
    })
      
    }else if(changeButtonShow == false &&sumbitData.length <1){
      notification.warning(
        {
            placement: 'bottomRight',
            bottom: 50,
            duration: 1,
            message: '??????',
            description: '??????????????????'
        })
    }

  }
  handleCancel=()=>{
    this.setState({
      showSubmitModal: false
    })
  }
  changeRemark = (e) => {
    this.setState({
        modifyRemark: e.target.value
    })
    // console.log(e.target.value)
}
  render() {
    const { dataSource, changeButtonShow, showEditInfoModal, editInfoArr } = this.state;
    const { height, record, permission } = this.props
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };
    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          showEdit:this.state.showEdit,
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
        }),
      };
    });
    let pagination = {  //??????
      total: this.state.total,
      // hideOnSinglePage: true,
      size: "small",
      current: this.state.currentPageNum,
      pageSize: this.state.pageSize,
      showSizeChanger: true,
      showQuickJumper: true,
      pageSizeOptions:['10','20','30','40','50','100'],
      showTotal: total => `??????${total}???`,
      onShowSizeChange: (current, size) => {
        this.setState({
          pageSize: size,
          currentPageNum: 1
        }, () => {
          this.getList()
        })
      },
      onChange: (page, pageSize) => {
        this.setState({
          currentPageNum: page
        }, () => {
          this.getList()
        })
      }
    }
    return (
      // <Modal title="????????????"
      //   visible={this.props.EnergyInfoShow}
      //   onOk={this.props.handleCancel}
      //   onCancel={this.props.handleCancel}
      //   width='1000px'
      //   mask={false}
      //   maskClosable={false}
      //   footer={[
      //     <Button type="primary" onClick={this.props.handleCancel}>
      //       ??????
      //     </Button>
      //   ]}>
        <LabelFormLayout title=''>
        <Modal title="????????????"
          visible={this.state.showSubmitModal}
          onOk={this.handleSubmit}
          onCancel={this.handleCancel}
          width='500px'>
          <div id='modifyContent'>
          {editInfoArr.length < 1 ? <p>&nbsp;&nbsp;???????????????</p> : editInfoArr.map((item) => {
            if((item.powerValueBefore == item.powerValue) && (item.desValueBefore!==item.desValue)){
              return <p style={{'marginLeft':'8px'}}>{item.name}????????????{item.desValueBefore}??????<i style={{ color: 'red' }}>{item.desValue}</i></p>
            }else if((item.powerValueBefore !== item.powerValue) && (item.desValueBefore==item.desValue)){
              return <p style={{'marginLeft':'8px'}}>{item.name}???????????????{item.powerValueBefore}??????<i style={{ color: 'red' }}>{item.powerValue}</i></p>
            }else{
              return <p style={{'marginLeft':'8px'}}>{item.name}???????????????{item.powerValueBefore}??????<i style={{ color: 'red' }}>{item.powerValue}</i>,?????????{item.desValueBefore}??????<i style={{ color: 'red' }}>{item.desValue}</i></p>
            }
          })}
          </div>
          <span style={{'fontWeight':'bold','verticalAlign':'top'}}>???????????????</span><TextArea style={{ width: 400 }} onChange={this.changeRemark.bind(this)}/>
        </Modal>
        <Spin spinning={this.state.loading}>
          <div>
            <div className={style.search} style={{ background: 'white', position: 'sticky', top: -15, zIndex: 999 }}>
              <div className={style.tipBox}>
                <span className={style.tipSpan}><b>?????????</b>{record.recordTime ? record.recordTime.substring(0, 10) : ''}</span>
                <span className={style.tipSpan}><b>?????????</b>{record.lineName ? record.lineName : ''}</span>
                <span className={style.tipSpan}><b>????????????</b>{record.createVo ? record.createVo.name : ''}</span>
                <span className={style.tipSpan}><b>???????????????</b>{record.creatTime ? record.creatTime : ''}</span>
                <span className={style.tipSpan}><b>????????????</b>{record.reviewerVo.name ? record.reviewerVo.name : '??????'}</span>
                <span className={style.tipSpan}><b>???????????????</b>{record.reviewTime ? record.reviewTime : '??????'}</span>
                <span className={style.tipSpan}><b>?????????</b>{record.reviewStatusVo ? record.reviewStatusVo.name : ''}</span>
              </div>
              <div>
                <Button type="primary" icon='profile' size='small' style={{ marginRight: 15 }} onClick={this.editInfoFun}>{record.reviewStatusVo.code=='INIT'?'????????????':'????????????'}</Button> 
              {((record.reviewStatusVo.code == 'INIT' && permission.indexOf('ENERGYMANAGE_ENERGY-EDIT-I')!==-1) || (record.reviewStatusVo.code == 'APPROVED' && permission.indexOf('ENERGYMANAGE_ENERGY-EDIT-A')!==-1)) && ( <Fragment>
                <Button type="primary" icon={changeButtonShow ? "edit" : "check"} size='small' style={{ marginRight: 10 }} onClick={this.changeButton} >{changeButtonShow ? (record.reviewStatusVo.code=='INIT'?'??????':'??????') : "??????"}</Button></Fragment>)}
              </div>
            </div>
            <div style={{height:height+60,overflow:'auto'}}>
            <Table
              components={components}
              rowKey={record => record.id}
              rowClassName={changeButtonShow?'':'editable-row'}
              bordered
              size="small"
              dataSource={dataSource}
              columns={columns}
              pagination={pagination}
              onRow={(record, index) => {
                return {
                  onClick: () => {
                    this.getInfo(record, index)
                  },
                }
              }}
            />
            </div>
          </div>
        </Spin>
        {showEditInfoModal && <EditLogModal record={record} handleCancel={this.editInfoFun} modalVisible={showEditInfoModal}/>}
        </LabelFormLayout>
      // </Modal>
    );
  }
}
export default connect(state => ({
  currentLocale: state.localeProviderData
}), {
  changeLocaleProvider
})(Energy);