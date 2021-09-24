import React from 'react';
import {Form, Input} from 'antd';

class FormSwitch extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      ...this.initProps(this.props)
    }
  }

  initProps = () =>{
    return {

    }
  }

  componentWillReceiveProps(newProps, state) {
    this.setState({...this.initProps(newProps)});
  }

  componentDidMount() {

  }

  getInitialValue = (v) => {
    if (this.props.getInitialValue) {
      return this.props.getInitialValue(v);
    }
    return v;
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
        <Form.Item label={props.label } {...formItemLayout}>
          {getFieldDecorator(props.name,{
            initialValue: value,
            valuePropName: props.valuePropName || 'checked',
          })(
            <Switch {...props} checkedChildren={props.checkedChildren || "开"} unCheckedChildren={props.unCheckedChildren || "关"}/>
          )}
        </Form.Item>
      </>
    );
  }
}
export default FormSwitch;
