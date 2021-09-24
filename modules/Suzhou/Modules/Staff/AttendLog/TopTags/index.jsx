import React, {Component} from 'react';
import dynamic from 'next/dynamic';
import {Modal, message,Select,TreeSelect,DatePicker} from 'antd';
import moment from 'moment';
import {connect} from 'react-redux';
import {curdCurrentData} from '../../../../../../store/curdData/action';
import Search from '../../../../components/Search';
import SelectProBtn from '../../../../components/SelectBtn/SelectProBtn';
import SelectSectionBtn from '../../../../components/SelectBtn/SelectSectionBtn';
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
    // if(!this.props.projectId){
    //   notificationFun('提示','请选择项目');
    // }else{
    //   this.setState({
    //     projectId:this.props.projectId
    //   })
    // }
  }
  render() {
    let AttenQus = JSON.parse(localStorage.getItem("AttenQus"));
    return (
      <div className={style.main}>
        <div className={style.search}>
          {/* 选择标段：
          <TreeSelect
              value={this.props.sectionId?this.props.sectionId:''}
              //showSearch
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              treeDefaultExpandAll
              onChange={this.props.onChangeSection}
              treeData={this.props.selectSection}
              style={{marginRight:'10px'}}
              disabled={AttenQus?true:false}
          /> */}
          日期：
          <span><DatePicker 
                  // defaultValue={moment(${this.props.date}, 'YYYY-MM-DD')} 
                  value={this.props.showDate===undefined||this.props.showDate===""?null:moment(this.props.showDate, 'YYYY-MM-DD')}
                  onChange={this.props.selectDate} 
                  //disabled={AttenQus?true:false}
                  style={{marginRight:'10px'}}/></span>
          人员类型：
          <Select   defaultValue={AttenQus?AttenQus.type:'2'}
                  //disabled={AttenQus?true:false}
                  onChange={this.props.selectType}
                  style={{width:'80px', marginRight: 10 }}
                  size="small">
                  <Option key={'0'} value={'0'}>管理人员</Option>
                  <Option key={'1'} value={'1'}>劳务人员</Option>
                  <Option key={'2'} value={'2'}>全部</Option>
          </Select>
          <Search search={this.props.search} placeholder={'姓名/手机号'} />
        </div>
        <div className={style.tabMenu}>
          <SelectProBtn  openPro={this.props.openPro} />
          <SelectSectionBtn openSection={this.props.onChangeSection} data1={this.props.projectId} />
        </div>
      </div>

    );
  }
}

export default PlanDefineTopTag;
