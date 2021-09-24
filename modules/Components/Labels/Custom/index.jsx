import React, { Component } from 'react';
import { connect } from 'react-redux';
import FormCustom from '../../../../modules/Components/Custom/FormCustom';
import {getCustomInfo, saveCustomValue} from '../../../../api/api'
import axios from "../../../../api/axios";
import * as dataUtil from "../../../../utils/dataUtil";
import moment from 'moment';
import intl from 'react-intl-universal'

export class Custom extends Component {

  constructor(props) {
    super(props);
    this.state = {
      show : false,
      formItems : [],
      formItemLayoutOne : {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 8 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        }
      },
      formItemLayoutTwo : {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 4 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 20 },
        }
      }
    };
  }

  componentDidMount() {
    this.initCustomFormData();
  }

  initProps = (props) =>{
    return {
      ...props
    }
  }

  /**
   *  初始化自定义表单内容
    */
  initCustomFormData = () =>{
    this.getCustomData((list) => {
      if(list){
        let itemIndex = 0;
        let colIndex = 0;
        let formItems = new Array();
        
        list.forEach((item,index) => {

          let {title,fieldName,dataType,formType,required,maxLength,precision,colspan,customValue,dictType} = item || {};
          let {value,displayName} = customValue || {};
          let col = {
            label : title,
            name : fieldName,
            required : required === 1,
            value,
            displayValue : displayName,
            dictType : (dictType ? dictType.id : null),
            formType : (formType ? formType.id : null),
            span : 12
          }

          if(formType.id != "InputNumber" && maxLength){
             col["maxLength"] = maxLength;
          }

          if(formType.id == "Checkbox"){
            if(value){
              col["value"] = value.split(",");
            }
          }else if(formType.id == "Date"){
            if(value){
              col = {...col,value : dataUtil.Dates().formatDateMonent(value),format : "YYYY-MM-DD" };
            }
          }else if(formType.id == "DateTime"){
            if(value){
              col = {...col,value : dataUtil.Dates().formatTimeMonent(value),format : "YYYY-MM-DD HH:mm", showTime :{ format: 'HH:mm', defaultValue: moment('00:00:00', 'HH:mm:ss')} };
            }
          }

          let message = this.getMessage(col);
          col["message"] = message;

          if(colIndex === 1){
            if(!colspan || colspan == 1){
              if(formItems[itemIndex]){
                formItems[itemIndex]["cols"].push(col);
              }
            }
            colIndex = 0;
            itemIndex ++;
          }else if(colIndex === 0){
            // 如果占用两列，直接占满一行。
            if(colspan && colspan > 1){
              col["span"] = 24;
              col["formItemLayout"] = this.state.formItemLayoutTwo;
              colIndex = 0;
              itemIndex ++;
            }else{
              colIndex++;
            }
            formItems.push({cols : [col]});
          }
        });
        this.setState({show : true, formItems});
      }
    })
  }
  /**
   * 获取自定义数据
   *
   * @param calllback
   */
  getCustomData = (calllback) =>{
    
    axios.get(getCustomInfo(this.props.customLabel.tableName, this.props.bizId)).then(res => {
      
      calllback(res.data.data);
    })
  }

  /**
   * 处理数据
   *
   * @param values
   * @returns {*}
   */
  treatFormData = (values) => {

    let formItems = this.state.formItems;
    for(let i = 0, len = formItems.length; i < len; i++){

      let row =  formItems[i];
      let {cols} = row;

      if(cols){
        for(let j = 0, len = cols.length; j < len; j++ ){

          let col = cols[j];
          let {name,formType} = col;
          let v = values[name];

          if(v){

            if(formType == "Date"){
              values[name] = dataUtil.Dates().formatDateString(v);
            }else if(formType == "DateTime"){
              values[name] = dataUtil.Dates().formatTimeString(v);
            }else if(formType == "Checkbox"){
              if(v instanceof Array){
                let newValue = dataUtil.Arr().toString(v);
                values[name] = newValue;
              }
            }
          }
        }
      }
    }
    return values;
  }

  getMessage = (col) => {
    let opt = "";
    let {label,formType} = col;
    if(formType == "Input"  || formType == "InputNumber" || formType == "TextArea" ){
      opt = intl.get('wsd.i18n.message.enter') + label;
    }else {
      opt = intl.get('wsd.i18n.message.select') + label;
    }
    return opt;
  }

  // 表单提交
  handleSubmit = (values,form,error) => {
    
    // 处理数据
    values = this.treatFormData(values || {});
    // 保存数据
    this.saveCustom(values);
  }

  saveCustom = (values) =>{
    axios.post(saveCustomValue, {...values ,id:this.props.bizId, tableName:this.props.customLabel.tableName  }, true).then(res => {
      //
    });
  }


  handleCancel = (e) =>{
      this.props.closeRightBox();
  }

  // 关闭
  closeRightBox = () => {
    this.props.rightIconBtn ? this.props.rightIconBtn() : null;
    this.setState({
      content: false,
      currentIndex: null,
    });
  };

  render() {
    return (
      <>
        {
          this.state.show &&
          (
            <FormCustom {...this.props} title = {"自定义"} edit = {this.props.customLabel.edit } handleSubmit = {this.handleSubmit} handleCancel = {this.handleCancel } formItems = {this.state.formItems} ></FormCustom>
          )
        }
      </>
    )
  }
}

const mapStateToProps = state => {
  return {
    currentLocale: state.localeProviderData,
  }
};
export default connect(mapStateToProps, null)(Custom);
