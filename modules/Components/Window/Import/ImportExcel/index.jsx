import React, {Component} from 'react'
import style from './style.less'
import {Modal, Table, Upload, Button, Icon,message} from 'antd';
import {connect} from 'react-redux'
import {baseURL} from '../../../../../api/config'
import * as dataUtil from "../../../../../utils/dataUtil";

import reqwest from 'reqwest'
import axios from "../../../../../api/axios";
import ModelFooter from "../../../../../components/public/Layout/Model/ModelFooter";
import SubmitButton from "../../../../../components/public/TopTags/SubmitButton";
import ModelContent from "../../../../../components/public/Layout/Model/ModelContent";
import BLayout from "../../../../../components/public/Layout/Base/BLayout";
import BHeader from "../../../../../components/public/Layout/Base/BHeader";
import Search from "../../../../../components/public/Search";
import BContent from "../../../../../components/public/Layout/Base/BContent";
import PublicTable from "../../../../../components/PublicTableGrid";
import ModelLayout from "../../../../../components/public/Layout/Model/ModelLayout";
import CustomTmpl from "./CustomTmpl";

export class ImportExcel extends Component {
  constructor(props) {
    super(props)
    this.myRef = React.createRef();
    this.state = {
      showCustomTmpl : false,
      fileList: [],
      uploading: false,
      data: [],
      successtoUp: true,
      downExcelColumns : []
    }
  }

  
  //注册 父组件即可调用子组件方法
  onRef = (ref) => {
    this.table = ref
  }

  initDatas = (callback) =>{
    callback(this.state.fileList);
  }
  componentDidMount() {
    let {customTmpl} = this.props;
    let {defaultColumns,url} = customTmpl || {};
    if(url){
        axios.get(url).then(res => {
            let data = res.data.data;
            let downExcelColumns = new Array();
            if(data){
                data.forEach((item) =>{
                    if(item.check == 1 || !defaultColumns || defaultColumns.indexOf(item.name) > -1){
                        downExcelColumns.push(item);
                    }
                })
            }
            this.setDownExcelColumns(downExcelColumns);
        })
    }
  }
  setDownExcelColumns = (downExcelColumns,callback) =>{
    this.setState({downExcelColumns},() => {
      if(callback){
        callback();
      }
    });
  }

  handleImport = () => {
    const {fileList} = this.state;
    const formData = new FormData();
    fileList.forEach(file => {
      formData.append('files[]', file);
    });
    let {action,sheets,params} = this.props;

    formData.append("action",baseURL + action);
    formData.append("sheets",JSON.stringify(sheets));
    formData.append("params",JSON.stringify(params));
    this.setState({
      uploading: true,
    });
    const hide = message.loading('loading....', 0);
    let url = baseURL + '/api/sys/excel/import';
    reqwest({
      url: url,
      headers: {
        Authorization: sessionStorage.getItem('token')
      },
      method: 'post',
      processData: false,
      data: formData,
      success: (res) => {
        setTimeout(hide, 0);
        this.setState({
          uploading: false,
        });
        if(res.status==200 && (!res.data || res.data.length == 0 ) ){
          dataUtil.success("导入成功!")
          if(this.props.callback){
            this.props.callback();
          }
          this.props.handleCancel();
        }else if(res.data){
          dataUtil.message("导入失败,请查看日志");
          axios.down("api/sys/excel/import/error/down",{errors : res.data});
        }else if(res.message){
          dataUtil.message(res.message);
        }
      },
      error: () => {
        setTimeout(hide, 0);
        this.setState({
          uploading: false
        });
      },
    });

  };

  setClassName = (record, index) => {
    //判断索引相等时添加行的高亮样式
    return record.lastModified === this.state.activeIndex ? `${style['clickRowStyl']}` : "";
  }

  getInfo = (record, index) => {
    this.setState({
      activeIndex: record.lastModified
    })
  }

  //事件委托
  openFile = () => {
    this.myRef.current.click()
  }

  //上传文件
  uploadFile = (e) => {
    const file = e.target.files[0]
    console.log(file)
    this.setState({
      data: [file],
      file
    })
  }
  downTmpl = () =>{
    const {tmpl,sheets} = this.props;
    const {downExcelColumns} = this.state;
    if(tmpl && sheets){
      if(!downExcelColumns || downExcelColumns.length == 0){
        dataUtil.message("请选择数据后操作");
        return;
      }
      let sheet = sheets[0];
      let {rowStart,index} = sheet || {};
      let column = {
        row : rowStart-1,
        sheet : index,
        columns : downExcelColumns
      }
      setTimeout(function () {
        axios.down(tmpl, column).then((e) => {
        });
      }, 1000)
    }
  }
  render() {
    const columns = [
      {
        title: "文件名称",
        dataIndex: 'name',
        key: 'name',
        width:"300px"
      },
      {
        title: "类型",
        dataIndex: 'type',
        key: 'type',
        width:"200px"
      },
      {
        title: "",
        key: 'close',
        dataIndex: 'close',
        render: () => {
          if (this.state.successtoUp) {
            return <Icon type="check" style={{color: "green"}}/>
          } else {
            return <Icon type="close" style={{color: "red"}}/>
          }
        },
        width:"50px"
      }
    ]
    const {fileList} = this.state;
    const props = {
      onRemove: file => {
        this.setState(state => {
          const index = state.fileList.indexOf(file);
          const newFileList = state.fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList,
          };
        });
      },
      beforeUpload: file => {
        this.setState(state => ({
          fileList: [file],
          successtoUp: true
        }),() =>{
          this.table.getData();
        });
        return false;
      },
      fileList,
      showUploadList: false
    };
    return (

      <ModelLayout width={650} height={500} title = {this.props.title || "导入"} handleCancel = {this.props.handleCancel }>
        <ModelFooter>
          <SubmitButton key="1" onClick={this.props.handleCancel} content = {"取消"}/>
          <SubmitButton key="2" type="primary" onClick={this.handleImport}
                        disabled={fileList.length == 0 || this.state.uploading}
                        content = {"确定"}
          />
        </ModelFooter>
        <ModelContent>
          <BLayout>
            <BHeader height = {75} overflow={"hidden"}>
              <div className={style.fileName}>
                <div >
                  <Upload {...props}>
                    <Button>
                      <Icon type="upload"/> 导入文件
                    </Button>
                  </Upload>
                  <div>备注：xlx、xlxs文件格式</div>
                </div>
                <div className={style.down}>
                  {
                    this.props.tmpl != null &&(
                      <a href="javascript:void(0)" onClick={this.downTmpl}>下载模板</a>
                    )
                  }
                  {/*
                    this.props.customTmpl && (
                      <a href="javascript:void(0)" onClick={()=>{this.setState({showCustomTmpl:true})}}>自定义下载模板</a>
                    )*/
                  }
                </div>
              </div>
            </BHeader>
            <BContent>
              <PublicTable  onRef={this.onRef}
                            getData={this.initDatas}
                            pagination={false}
                            columns={columns}
                            getRowData={this.getInfo}
                            useCheckBox = {false}
                            tableType = {"gantt"}
              />
            </BContent>
          </BLayout>
        </ModelContent>
        {
          this.state.showCustomTmpl && (
            <CustomTmpl {...this.props}
                        handleCancel = {() => {this.setState({showCustomTmpl:false})}}
                        setDownExcelColumns = {this.setDownExcelColumns}
                        downTmpl = {this.downTmpl }>
            </CustomTmpl>
          )
        }
      </ModelLayout>
    )
  }
}

/* *********** connect链接state及方法 start ************* */
export default connect(state => ({
  currentLocale: state.localeProviderData
}))(ImportExcel);
/* *********** connect链接state及方法 end ************* */
