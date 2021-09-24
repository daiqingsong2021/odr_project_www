import React, { Component } from 'react';
import {Modal,Form,Row,Col,Input,Button,Icon,Select,DatePicker,Table,Slider,InputNumber,message,Checkbox,TreeSelect} from 'antd';
import moment from 'moment';
import style from './style.less';
import intl from 'react-intl-universal';
import { connect } from 'react-redux';
import { curdCurrentData } from '../../../../../../store/curdData/action';
import axios from '../../../../../../api/axios';
import {getsectionId,getSwTypeChose,getBaseSelectTree,getOrgPeopleList,addSpecialWorkCert,getCertGlListSelect,updateSpecialWorkCert} from '../../../../api/suzhou-api';
import {fileList} from '../../../../../../api/api';
const { TextArea } = Input;
const Option = Select.Option;
const TreeNode = TreeSelect.TreeNode;
import PublicButton from "../../../../../../components/public/TopTags/PublicButton";
import * as dataUtil from "../../../../../../utils/dataUtil";
import UploadTpl from '../../../../components/UploadSpecialWorker/uploadTpl';
import MyIcon from '../../../../../../components/public/TopTags/MyIcon';

export class PlanDefineAdd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalInfo: {
        title: '新增',
      },
      info:{},
      initDone: false,
      selectSection:'',
      jobTypeOption:[],
      assignFlag:true,
      selectSetion:'',
      projectId:"",
      optionCertCategory:[],
      peopleId:[],
      peopleInfo:'',
      warnPeriod:'',
      orkTypeName:'',
      workTypeId:'',
      fileList:[],
      certList:[], //证书名称
      certInfo:'' ,//证书相关信息
      certChange:false,
    };
  }
  componentDidMount() {
    if (this.props.addOrModify == 'add') {
      this.setState({
        info:{},
        fileList:[]
      })
    } else if (this.props.addOrModify == 'modify') {
      axios.get(fileList(this.props.data.id, 'STAFF-SPECIALTYPE-CERTIFICATE')).then(res => {
        this.setState({
          fileList: res.data.data
        })
      })
      this.setState({
        info: this.props.data
      });

    }
    axios.get(getCertGlListSelect+`?projectId=${this.props.data.projectId}`).then(res=>{
      this.setState({
        certList:res.data.data
      })
    })
    if(!this.props.projectId){

    }else{
      this.setState({
        projectId:this.props.projectId
      })
      // axios.get(getsectionId(this.props.projectId)).then(res=>{
      //   this.getSelectTreeArr(res.data.data,{"id":"value","name":"title"});
      //   this.setState({
      //     selectSection:res.data.data
      //   })
      // })
      // axios.get(getSwTypeChose+`?projectId=${this.props.projectId}`).then(res=>{
      //   this.setState({
      //     jobTypeOption:res.data.data
      //   })
      // });
    }
    axios.get(getBaseSelectTree("szxm.rygl.certtype")).then((res)=>{
      this.setState({
        optionCertCategory:res.data.data
      })
    });
  }
  getSelectTreeArr=(array,keyMap)=>{
    if(array){
      array.forEach((item,index,arr)=>{
        var obj = item;
        for(var key in obj){
          var newKey = keyMap[key];
          if(newKey){
              obj[newKey] = obj[key];
          }
        }
        this.getSelectTreeArr(item.children,keyMap);
      })
    }
  }
  getSelectTreeArr2=(array,keyMap)=>{
    if(array){
      array.forEach((item,index,arr)=>{
        var obj = item;
        if(obj.type == 'people'){
        }else{
          obj.disabled = true;
        };
        for(var key in obj){
          var newKey = keyMap[key];
          if(newKey){
              obj[newKey] = obj[key];
          }
        }
        this.getSelectTreeArr2(item.children,keyMap);
      })
    }
  }
  //新增提交
  handleSubmit = (val, e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      values.certExpirationTime = values.certExpirationTime?dataUtil.Dates().formatTimeString(values.certExpirationTime).substr(0,10):"";
      values.certFirstPublishTime = values.certFirstPublishTime?dataUtil.Dates().formatTimeString(values.certFirstPublishTime).substr(0,10):"";
      if (!err) {
        if (this.props.addOrModify == 'add') {
          let fileIds = [];
          let { fileList } = this.state;
          if (fileList.length) {
            for (let i = 0; i < fileList.length; i++) {
              fileIds.push(fileList[i].id)
            }
          }
          let data = {
            ...values,
            sectionId:this.props.rightData.sectionId,
            projectId:this.props.rightData.projectId,
            certName:this.state.certInfo.certName,
            warnPeriod:this.state.certInfo.warnPeriod,
            certGlId:values.certGlId.key,
            fileIds,
            specialWorkerId:this.props.rightData.id
          }
          axios.post(addSpecialWorkCert, data, true).then(res => {
            this.props.addData(res.data.data)
            if (val == 'save') {
              this.props.handleCancel()
            } else if (val == 'goOn') {
              this.props.form.resetFields();
            }
          })
        } else if (this.props.addOrModify == 'modify') {
          let fileIds = [];
          let { fileList } = this.state;
          if (fileList.length) {
            for (let i = 0; i < fileList.length; i++) {
              fileIds.push(fileList[i].id)
            }
          }
          let data={};
          if(this.state.certChange){
            //修改过
            data = {
              ...values,
              id:this.props.data.id,
              fileIds,
              certGlId:values.certGlId.key,
              certName:this.state.certInfo.certName,
              warnPeriod:this.state.certInfo.warnPeriod,
              specialWorkerId:this.props.rightData.id
            }
          }else{
            data = {
              ...values,
              id:this.props.data.id,
              fileIds,
              certGlId:this.props.data.certGlId,
              certName:this.props.data.certName,
              warnPeriod:this.props.data.warnPeriod,
              specialWorkerId:this.props.rightData.id
            }
          }
          axios.put(updateSpecialWorkCert, data, true).then(res => {
            this.props.updateSuccess(res.data.data)
            this.props.handleCancel()
          })
        }
      }
      
    });
  };
  //选择人员
  onSelect = (selectedKeys, info,e) => {
    this.setState({
      peopleInfo:info.props
    })
  }
  //选择证书名称
  onSelectCert= (selectedKeys, info,e) => {
    this.setState({
      certInfo:info.props.label,
      certChange:true
    })
  }
  //上传列表控制
  operateClick = (record) => {
    let { fileList } = this.state;
    let index = fileList.findIndex(item => item.id == record.id);
    fileList.splice(index, 1);
    this.setState({
      fileList
    })
  }
  //上传回调
  file = (files) => {
    let { fileList } = this.state;
    if (files.response && files.response.data) {
      let file = files.response.data;
      let fileName = file.fileName.substring(0,file.fileName.lastIndexOf("."));
      let suffix = file.fileName.substring(file.fileName.lastIndexOf(".")+1,file.fileName.length);
      let obj = {
        id: file.id,
        fileName,
        suffix
      }
      fileList.push(obj)
    }
    this.setState({
      fileList,
    })
  }
  render() {
    const {optionCompany} = this.state;
    const { intl } = this.props.currentLocale
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const formItemLayout1 = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
    };
    const columns = [
        {
          title: '文件名称',
          dataIndex: 'fileName',
          key: 'fileName',
        },
        {
          title:'文件类型',
          dataIndex: 'suffix',
          key: 'suffix',
        },
        {
          title: "",
          dataIndex: 'operate',
          key: 'operate',
          render: (text, record) => <MyIcon type='icon-exit' onClick={this.operateClick.bind(this, record)} />
        }
      ]
    return (
      <div>
       
        <Modal className={style.main}
          width="850px"
          afterClose={this.props.form.resetFields}
          mask={false}
          maskClosable={false}
          footer={<div className="modalbtn">
            {/* 保存并继续 */}
            <Button key={1} onClick={this.handleSubmit.bind(this, 'goOn')}>{intl.get('wsd.global.btn.saveandcontinue')}</Button>
            {/* 保存 */}
            <Button key={2} onClick={this.handleSubmit.bind(this, 'save')} type="primary">{intl.get('wsd.global.btn.preservation')}</Button>
          </div>}
          centered={true} title={this.state.modalInfo.title} visible={this.props.visible}
          onCancel={this.props.handleCancel}>
          <Form onSubmit={this.handleSubmit} className={style.mainScorll}>
            <div className={style.content}>
              <Row type="flex">
                <Col span={12}>
                  <Form.Item label={'证书名称'} {...formItemLayout}>
                    {getFieldDecorator('certGlId', {
                      initialValue: this.state.info.certName?{key:this.state.info.certName,value:this.state.info.certGlId}:'',
                      rules: [{
                        required: true,
                        message: '请选择证书名称'
                      }],
                    })(
                        <Select onSelect={this.onSelectCert} labelInValue>
                        {
                          this.state.certList.length && this.state.certList.map((item,i) => {
                            return (
                              <Option key={item.certName} label={item} value={item.id}>{item.certName}</Option>
                            )
                          })
                        }
                      </Select>,
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={"证书编号"} {...formItemLayout}>
                    {getFieldDecorator('certNum', {
                      initialValue:this.state.info.certNum,
                      rules:[
                        {required:true,message:'请输入证书编号'},
                        // {pattern: new RegExp(/[0-9|a-z|A-Z]/, "g"),message: '请输入数字或英文字母'},
                        {max:32,message:'最大长度32位'}
                      ],
                      // getValueFromEvent: (event) => {
                      //     return event.target.value.replace(/[^0-9|a-z|A-Z]/g,'')
                      // },
                    })(
                      <Input />,
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={'首次发放日期'} {...formItemLayout}>
                    {getFieldDecorator('certFirstPublishTime', {
                      initialValue:dataUtil.Dates().formatDateMonent( this.state.info.certFirstPublishTime),
                      rules: [{required: true,message: '请输入证书首次发放日期'}],
                    })(
                      <DatePicker style={{ width: '100%' }} />,
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={'证书有效期'} {...formItemLayout}>
                    {getFieldDecorator('certExpirationTime', {
                      initialValue:dataUtil.Dates().formatDateMonent( this.state.info.certExpirationTime),
                      rules: [{
                        required: true,
                        message: '请输入证书有效期'
                      }],
                    })(
                      <DatePicker style={{ width: '100%' }} />,
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={'查询网址'} {...formItemLayout}>
                    {getFieldDecorator('certVerifyUrl', {
                      initialValue:this.state.certInfo.certVerifyUrl?this.state.certInfo.certVerifyUrl:this.state.info.certVerifyUrl,
                      rules: [{
                        message: '请输入查询网址'
                      }],
                    })(
                      <Input disabled />,
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </div>
          </Form>
          <div className={style.Modifytable}>
              <div className={style.tip}>
                {/* <span className={style.span}>备注：文件支持Word、excel格式</span> */}
                <div className={style.upload}>
                  <UploadTpl isBatch={true} file={this.file} />
                </div>
              </div>
              <Table 
                rowKey={record => record.id} 
                columns={columns} 
                dataSource={this.state.fileList} 
                pagination={false} 
                name={this.props.name} />
            </div>
        </Modal>
      </div>
    );
  }
}

const PlanDefineAdds = Form.create()(PlanDefineAdd);
export default connect(state => ({
  currentLocale: state.localeProviderData,
}))(PlanDefineAdds);
