import React, { Component } from 'react';
import dynamic from 'next/dynamic';
import { Modal, message, Select, DatePicker } from 'antd';
import moment from 'moment';
import { connect } from 'react-redux';
import { curdCurrentData } from '@/store/curdData/action';
import Search from '@/modules/Suzhou/components/Search';
import SelectProBtn from '@/modules/Suzhou/components/SelectBtn/SelectProBtn';
import SelectSectionBtn from '@/modules/Suzhou/components/SelectBtn/SelectSectionBtn';
import AddForm from '../Add/index';
import style from './style.less';
import axios from '@/api/axios';
import { addPeopleChange, deletePeopleChange } from '@/modules/Suzhou/api/suzhou-api';
import { notification } from 'antd';
import PublicButton from '@/components/public/TopTags/PublicButton';
import * as dataUtil from '@/utils/dataUtil';
const Option = Select.Option;
const { RangePicker } = DatePicker;
export class PlanDefineTopTags extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      delModalVisible: false,
      noticeData: '',
      planDefineSelectData: [],
      type: '',
      startTime: '',
      endTime: '',
      search: '',
    };
  }
  componentWillReceiveProps() {
    this.props.startTime
      ? this.setState({ startTime: this.props.startTime, showStartTime: this.props.startTime })
      : '';
    this.props.endTime
      ? this.setState({ endTime: this.props.endTime, showEndTime: this.props.endTime })
      : '';
  }
  //关闭model
  handleCancel = () => {
    this.setState({
      modalVisible: false,
    });
  };
  //判断是否有选中数据
  hasRecord = () => {
    if (this.props.selectedRows.length == 0) {
      notification.warning({
        placement: 'bottomRight',
        bottom: 50,
        duration: 2,
        message: '未选中数据',
        description: '请选择数据进行操作',
      });
      return false;
    } else {
      return true;
    }
  };
  btnClicks = (v, type) => {
    const { delSuccess, record, section, data1, selectedRows } = this.props;
    switch (v) {
      case 'AddTopBtn':
        if (!data1) {
          notification.warning({
            placement: 'bottomRight',
            bottom: 50,
            duration: 2,
            message: '未选中数据',
            description: '请选择数据进行操作',
          });
        } else {
          this.setState({
            modalVisible: true,
            type: 'ADD',
          });
        }
        break;
      case 'ExportFile':
        const { data1, sectionId, manageFlag } = this.props;
        let data = {
          projectId: data1,
          sectionIds: sectionId,
          type: manageFlag ? 0 : 1,
          startTime: this.state.startTime,
          endTime: this.state.endTime,
          searcher: this.state.search,
        };
        axios
          .down(
            'api/szxm/rygl/attenter/getKqRecordReport/export' +
              `?projectId=${data1}&sectionIds=${sectionId}&type=${manageFlag ? 0 : 1}&startTime=${
                this.state.startTime
              }&endTime=${this.state.endTime}&searcher=${this.state.search}`
          )
          .then(res => {});
        break;
      // case 'MoveTDTopBtn':
      default:
        return;
    }
  };

  submit = (values, type) => {
    const data = {
      ...values,
      projectId: this.props.data1,
    };
    axios.post(addPeopleChange, data, true).then(res => {
      if (res.data.status === 200) {
        if (type == 'save') {
          this.handleCancel();
        }

        this.props.success(res.data.data);
      }
    });
  };

  //搜索
  search = val => {
    const { data1, sectionId, manageFlag } = this.props;
    const { showStartTime, showEndTime } = this.state;
    const type = manageFlag ? 0 : 1;
    this.setState(
      {
        search: val,
        startTime: showStartTime,
        endTime: showEndTime,
      },
      () => {
        this.props.successSearch(val,showStartTime,showEndTime)
      }
    );
  };
  onChangeTime = (times, dateString) => {
    this.setState({
      showStartTime: !dateString[0]
        ? ''
        : dataUtil
            .Dates()
            .formatTimeString(dateString[0])
            .substr(0, 10),
      showEndTime: !dateString[1]
        ? ''
        : dataUtil
            .Dates()
            .formatTimeString(dateString[1])
            .substr(0, 10),
    });
  };
  render() {
    const { modalVisible } = this.state;
    const dateFormat = 'YYYY-MM-DD';
    const {permission} = this.props
    return (
      <div className={style.main}>
        <div className={style.search}>
          <Search
            search={this.search}
            placeholder={this.props.manageFlag == '0' ? '单位' : '姓名'}
          />
        </div>
        <div className={style.search}>
          <span>
            考勤时间：
            <RangePicker
              format="YYYY-MM-DD "
              placeholder={['开始时间', '结束时间']}
              size="small"
              onChange={this.onChangeTime}
              style={{ width: 250 }}
              value={
                this.state.showStartTime === undefined ||
                this.state.showEndTime === undefined ||
                this.state.showStartTime === '' ||
                this.state.showEndTime === ''
                  ? null
                  : [
                      moment(this.state.showStartTime, dateFormat),
                      moment(this.state.showEndTime, dateFormat),
                    ]
              }
            />
          </span>
        </div>
        <div className={style.tabMenu}>
          <SelectProBtn openPro={this.props.openPro} />
          <SelectSectionBtn openSection={this.props.openSection} data1={this.props.data1} />
          {permission.indexOf('ATTENDANCE_EXPORT-ATTENDANCE')!==-1 && (
          <PublicButton
            name={'导出'}
            title={'导出'}
            icon={'icon-iconziyuan2'}
            afterCallBack={this.btnClicks.bind(this, 'ExportFile')}
            res={'MENU_EDIT'}
          />)}
          <span>
            人员类型：{' '}
            <Select
              onChange={this.props.selectPeopleType}
              defaultValue="0"
              size="small"
              style={{ width: 150, marginRight: 10 }}
            >
              <Option value="0" key="0">
                管理人员
              </Option>
              <Option value="1" key="1">
                劳务人员
              </Option>
            </Select>
          </span>
        </div>
        {modalVisible && (
          <AddForm
            record={this.props.record}
            modalVisible={modalVisible}
            success={this.props.success}
            submit={this.submit.bind(this)}
            section={this.props.section}
            handleCancel={this.handleCancel.bind(this)}
          />
        )}
      </div>
    );
  }
}

export default PlanDefineTopTags;
