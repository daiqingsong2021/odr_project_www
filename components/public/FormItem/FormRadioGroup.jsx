import React from 'react';
import {Form,Radio,Col} from 'antd';
import axios from "../../../api/axios";
import {getBaseSelectTree } from "../../../api/api";
class FormRadioGroup extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      items : [],
      load : false,
      ...this.initProps(props,true)
    }
  }


  initProps = (props,isload) =>{

    let load = isload;
    if(!load){
      let items = props.items;
      if(!props.items && props.value && props.displayValue ){
        items = [{value : props.value,title : props.displayValue}];

      }else if(props.items && props.items.length > 0){
        load = true;
      }
      return {
        load,
        items : items || []
      }
    }
  }

  componentWillReceiveProps(newProps, state) {

    let {items,url,dictType} = newProps || {};
    let resetData = false;
    if(items || this.state.url != url || this.state.dictType != dictType){
      resetData = true
    }
    this.setState({...this.initProps(newProps,resetData ? false : this.state.load)},() => {
      this.loadItems();
    });
  }

  componentDidMount() {
    this.loadItems();
  }

  loadItems = () => {

    if(!this.state.load){
      if(this.props.dictType){
        axios.get(getBaseSelectTree(this.props.dictType),{...this.props.urlparams}).then(res => {
          this.setState({items : res.data.data ,load : true,dictType :this.props.dictType });
        })
      }
      else if(this.props.url){
        axios.get(this.props.url,{...this.props.urlparams}).then(res => {
          this.setState({items : res.data.data ,load : true, url : this.props.url});
        })
      }else if(this.props.loadDatas ){
        this.props.loadDatas((data) => {
          this.setState({items : data, load : true});
        })
      }
    }else{

    }
    if(this.props.resetLoadDatas ){
      this.props.resetLoadDatas((data) => {
        this.setState({items : data});
      })
    }
  }

  onChange = (v) =>{
    if(this.props.onChange){
      this.props.onChange(v);
    }
  }
  filterProps =(props) =>{
    let ret = new Object();
    if(props){
      let keys = Object.keys(props);
      for(let i = 0,len = keys.length; i < len; i++){
        let key = keys[i];
        if(key != "value" && key != "formType" && key != "dictType" && key != "displayValue" && key !="formItemLayout" && key != "getFieldDecorator"){
          ret[key] = props[key];
        }
      }
    }
    return ret;
  }
  render() {
    let {value,getFieldDecorator,formItemLayout} = this.props || {};
    let props = this.filterProps(this.props);
    return (
      <>
        <Form.Item label={props.label } {...formItemLayout }>
          {getFieldDecorator(this.props.name, {
            initialValue: value || null,
            rules: [{
              required: props.required || false,
              message: props.message
            }]
          })(
            <Radio.Group style={{ width: '100%' }} {...props} onChange={this.onChange}>
              {
                this.state.items.map(item => {
                    return (
                        <Radio key = {item.value} value = {item.value}>{item.title}</Radio>
                    )
                  }
                )
              }
            </Radio.Group>
          )}
        </Form.Item>
      </>
    );
  }
}

export default FormRadioGroup;
