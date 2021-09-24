import React, {Component} from 'react';
import dynamic from 'next/dynamic';
import {Modal, message} from 'antd';
import {connect} from 'react-redux';
import {curdCurrentData} from '../../../../../../store/curdData/action';
import Search from '../../../../components/Search';
import SelectProBtn from '../../../../components/SelectBtn/SelectProBtn';
import style from './style.less';

export class PlanDefineTopTags extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      delModalVisible: false,
      noticeData: '',
      planDefineSelectData: [],
      type: '',
    };
  }
  render() {
    const {modalVisible} = this.state;

    return (
      <div className={style.main}>

        {this.props.deledit}
        <div>
          
        </div>
        <div className={style.search}>
          <Search search={this.props.search} placeholder={'姓名'} />
        </div>
        <div className={style.tabMenu}>
          <SelectProBtn  openPro={this.props.openPro} />
        </div>
      </div>

    );
  }
}

export default PlanDefineTopTags;

