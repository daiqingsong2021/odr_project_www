import React, {Component} from 'react'
import {connect} from 'react-redux'
import * as dataUtil from "../../../../../../utils/dataUtil";
import ModelFooter from "../../../../../../components/public/Layout/Model/ModelFooter";
import SubmitButton from "../../../../../../components/public/TopTags/SubmitButton";
import ModelContent from "../../../../../../components/public/Layout/Model/ModelContent";
import PublicTable from "../../../../../../components/PublicTableGrid";
import ModelLayout from "../../../../../../components/public/Layout/Model/ModelLayout";
import axios from "../../../../../../api/axios";

export default class CustomTmpl extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  //注册 父组件即可调用子组件方法
  onRef = (ref) => {
    this.table = ref
  }

  initDatas = (callback) =>{
    const {customTmpl} = this.props;
    const {url,defaultColumns} = customTmpl || {};
    if(!url){
      callback([]);
      return ;
    }
    //组织数据
    axios.get(url).then(res => {
      let data = res.data.data;
      callback(data);
    })
  }

  componentDidMount() {

  }

  handleOk = () => {
    let selecteds = this.table.getSelecteds();
    if(!selecteds || selecteds.length == 0){
      dataUtil.message("请选择数据后操作");
      return;
    }
    this.props.setDownExcelColumns(selecteds);
  };

  handleDown = () =>{
    let selecteds = this.table.getSelecteds();
    if(!selecteds || selecteds.length == 0){
      dataUtil.message("请选择数据后操作");
      return;
    }
    this.props.setDownExcelColumns(selecteds,()=>{
      this.props.downTmpl();
    });
  }

  checkboxStatus = (record) =>{
    if(record){
      return record.check == 1;
    }
    return false;
  }

  setDefaultSelected = (record) =>{
    const {customTmpl} = this.props;
    const {url,defaultColumns} = customTmpl || {};
    if(record){
      if(defaultColumns && defaultColumns.indexOf(record.name) > -1){
        return true;
      }
      return record.check == 1;
    }
    return false;
  }

  render() {
    const columns = [
      {
        title: "标题",
        dataIndex: 'title',
        key: 'title',
        width:"100%"
      }
    ]
    return (

      <ModelLayout width={500} height={500} overflowY = "hidden" title = {this.props.title || "自定义"} handleCancel = {this.props.handleCancel }>
        <ModelFooter>
          <SubmitButton key="2"  onClick={this.handleDown}content = {"下载"}/>
          <SubmitButton key="1" onClick={this.props.handleCancel} content = {"取消"}/>
          <SubmitButton key="3" type="primary" onClick={this.props.handleOk} content = {"确定"}/>
        </ModelFooter>
        <ModelContent>
            <PublicTable  onRef={this.onRef}
                          getData={this.initDatas}
                          pagination={false}
                          columns={columns}
                          useCheckBox = {true}
                          tableType = {"gantt"}
                          checkboxStatus = {this.checkboxStatus }
                          setDefaultSelected = {this.setDefaultSelected}
            />
        </ModelContent>
      </ModelLayout>
    )
  }
}
