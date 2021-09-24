import React, {Component} from 'react';
import dynamic from 'next/dynamic';
import {Modal, message,Select,TreeSelect,DatePicker, Input,Icon} from 'antd';
import moment from 'moment';
import {connect} from 'react-redux';
import {curdCurrentData} from '../../../../../../store/curdData/action';
import Search from '../../../../components/Search';
import SelectProBtn from '../../../../components/SelectBtn/SelectProBtn';
import SelectSectionBtn from '../../../../components//SelectBtn/SelectSectionBtn';
import style from './style.less';
import axios from '../../../../../../api/axios';
import {addPeopleChange,getsectionId} from '../../../../api/suzhou-api';
import PublicButton from '../../../../../../components/public/TopTags/PublicButton';
import notificationFun from '@/utils/notificationTip';
const { Option } = Select;
export class PlanDefineTopTag extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projectId:'',
      projectName:"",
      selectSection:[], //标段
    };
  }
  componentDidMount(){
    
  }
  render() {
    return (
      <div className={style.main}>
        <div className={style.search}>
          标段：
          <TreeSelect
              value={this.props.sectionId?this.props.sectionId:''}
              showSearch
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              treeDefaultExpandAll
              onChange={this.props.onChangeSection}
              treeData={this.props.selectSection}
              style={{marginRight:'10px'}}
              disabled
          />
          派工日期：
          <span>
              <DatePicker 
                  // defaultValue={moment(this.props.myPaigongdan.dispatchTime, 'YYYY-MM-DD')} 
                  disabled
                  value={(!this.props.myPaigongdan||!this.props.myPaigongdan.dispatchTime)?null:moment(this.props.myPaigongdan.dispatchTime, 'YYYY-MM-DD')}
                  style={{marginRight:'10px'}}/>
            </span>
        </div>
        <div className={style.tabMenu}>
            <Icon type="table"/>
            <span style={{color:'#999'}}>{(!this.props.myPaigongdan||!this.props.myPaigongdan.projectName)?null:this.props.myPaigongdan.projectName}</span>
        </div>
      </div>

    );
  }
}

export default PlanDefineTopTag;
