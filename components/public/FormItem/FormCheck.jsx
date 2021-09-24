import React from 'react';
import { Input} from 'antd';
import {Form} from "antd/lib/form";

class FormCheck extends React.Component {

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

  render() {
    const {getFieldDecorator} = this.props;
    return (
      <>
        <Form.Item label={this.props.label } {...this.props.formItemLayout }>{
           getFieldDecorator(this.props.name, {
              initialValue: this.props.initialValue || null,
              rules: [{
                required: this.props.required || false,
                message: this.props.message
              }],
            })(
              <Input   />,
            )
        }
        </Form.Item>
      </>
    );
  }
}

export default FormCheck;
