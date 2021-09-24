import React, {Component} from 'react';
import {connect} from 'react-redux';
import dynamic from 'next/dynamic';
import TopTags from './TopTags/index';
import ExtLayout from "../../../../components/public/Layout/ExtLayout";
import ExtContent from "../../../../components/public/Layout/ExtContent";
import Toolbar from "../../../../components/public/Layout/Toolbar";

class WorkFlowForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      formDatas: [],
      start:false
    };
  }

  componentDidMount() {
    localStorage.removeItem('workflow');
    const {menuInfo} = this.props
    this.setState({menuInfo});
  }

  search = () => {

  }
  changeStart=(start)=>{
    this.setState({start})
  }
  render() {
    const {proc} = this.props || {};
    const {formDatas} = proc || {};
    const {menuInfo} = proc || {};
    const Form = dynamic(() => import('../../../' + menuInfo.url + '/index'));
    return (
      <ExtLayout>
        <Toolbar>
          <TopTags {...this.props.proc} openWorkFlowMenu={this.props.openWorkFlowMenu} search={this.search} changeStart = {this.changeStart.bind(this)}/>
        </Toolbar>
        <ExtContent>
          <Form {...this.props} menuInfo={menuInfo} formDatas={formDatas} start={this.state.start}  />
        </ExtContent>
      </ExtLayout>
    );
  }
}

const mapStateToProps = state => {
  return {
    currentLocale: state.localeProviderData
  }
};
export default connect(mapStateToProps)(WorkFlowForm);

