import React from 'react';
import {Form,TreeSelect} from 'antd';
import axios from "../../../api/axios";
import {getBaseSelectTree } from "../../../api/api";

class FormTreeSelect extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      items : [],
      load : false,
      ...this.initProps(props,false)
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

    this.setState({...this.initProps(newProps,resetData ? false : this.state.load)});
  }

  componentDidMount() {

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

  onChange = (v,d) =>{
    let displayValue = null;
    if(d instanceof Array && d.length > 0){
      displayValue = d[0];
    }else{
      displayValue = d;
    }
    if(this.props.onChange){
      this.props.onChange(v,displayValue);
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
          {getFieldDecorator(props.name, {
            initialValue: value || null,
            rules: [{
              required: props.required || false,
              message: props.message
            }]
          })(
            <TreeSelect
              style={{ width: '100%' }}
              dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
              placeholder="请选择"
              treeDefaultExpandAll
              showSearch = {true}
              loading = {true}
              allowClear = {true}
              treeData={this.state.items}
              {...props}
              onChange={this.onChange}
              onFocus={this.loadItems}
            />
          )}
        </Form.Item>
      </>
    );
  }
}

export default FormTreeSelect;
