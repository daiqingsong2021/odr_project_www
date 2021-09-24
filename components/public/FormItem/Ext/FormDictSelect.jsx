import React from 'react';
import {getBaseSelectTree } from "../../../../api/api";
import FormSelect from "../FormSelect";
class FormDictSelect extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      show : false,
      ...this.initProps(this.props)
    }
  }

  initProps = () =>{
    return {
      show : true,
      url : getBaseSelectTree(this.props.dictType)
    }
  }

  componentWillReceiveProps(newProps, state) {
    this.setState({...this.initProps(newProps)});
  }

  componentDidMount() {

  }

  render() {
    return (
      <>
        {
          this.state.show &&
          <FormSelect {...this.props} url ={ this.state.url} ></FormSelect>
        }
      </>
    );
  }
}

export default FormDictSelect;
