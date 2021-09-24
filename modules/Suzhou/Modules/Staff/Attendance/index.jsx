import React, { Component } from 'react';
import { Table, notification } from 'antd';
import style from './style.less';
import { connect } from 'react-redux';
import { changeLocaleProvider } from '@/store/localeProvider/action';
import RightTags from '@/components/public/RightTags/index';
import * as util from '@/utils/util';
import * as dataUtil from '@/utils/dataUtil';
import Release from '@/modules/Components/Release';
import TipModal from '@/modules/Components/TipModal';
import { getKqRecordReport ,getPermission} from '@/modules/Suzhou/api/suzhou-api';
import axios from '@/api/axios';
import MyIcon from '@/components/public/TopTags/MyIcon';
import TopTags from './TopTags/index';
import { firstLoad } from '@/modules/Suzhou/components/Util/firstLoad';
import {isChina,permissionFun} from "@/modules/Suzhou/components/Util/util.js";
import ExtLayout from "@/components/public/Layout/ExtLayout";
import MainContent from "@/components/public/Layout/MainContent";
import Toolbar from "@/components/public/Layout/Toolbar";
import PublicTable from '@/components/PublicTable'

class SpecialType extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rightTags: [],
      selectedRowKeys: [],
      selectedRows: [],
      pageSize: 10,
      currentPageNum: 1,
      total: '',
      projectId: '',
      sectionId: '',
      search: '',
      manageFlag: true,
      type: 0,
      startTime: '',
      endTime: '',
      searcher: '',
      projectName: '', //项目名称
      permission:[]
    };
  }
  getList = (projectId, sectionIds, type, startTime, endTime, searcher) => {
    axios
      .get(
        getKqRecordReport(this.state.pageSize, this.state.currentPageNum) +
          `?projectId=${projectId}&sectionIds=${sectionIds}&type=${type}&startTime=${startTime}&endTime=${endTime}&searcher=${searcher}`
      )
      .then(res => {
        if (res.data.status == 200) {
          const dataMap = util.dataMap(res.data.data.list);
          var maps = new Object();
          this.setState({
            total: res.data.data.total,
            data: res.data.data.list,
            dataMap: dataMap,
          });
        } else {
          this.setState({
            total: '',
            data: [],
            dataMap: null,
          });
        }
      });
  };
  componentDidMount() {
    // let menuCode = 'STAFF-ATTENDANCE'
    //     axios.get(getPermission(menuCode)).then((res)=>{
    //         let permission = []
    //         res.data.data.map((item,index)=>{
    //         permission.push(item.code)
    //         })
    //         this.setState({
    //         permission
    //         })
    //     })
        permissionFun(this.props.menuInfo.menuCode).then(res=>{
          this.setState({
              permission:!res.permission?[]:res.permission
          })
        });
    let firstDate = new Date();
    firstDate.setDate(1); //第一天
    let endDate = new Date(firstDate);
    endDate.setMonth(firstDate.getMonth() + 1);
    endDate.setDate(0);
    const firstDay =
      (new Date(firstDate).getDate() + '').length == 1
        ? '0' + new Date(firstDate).getDate()
        : new Date(firstDate).getDate();
    const endDay =
      (new Date(endDate).getDate() + '').length == 1
        ? '0' + new Date(endDate).getDate()
        : new Date(endDate).getDate();
    const startTime = `${new Date(firstDate).getFullYear()}-${new Date(firstDate).getMonth() +
      1}-${firstDay}`;
    const endTime = `${new Date(endDate).getFullYear()}-${new Date(endDate).getMonth() +
      1}-${endDay}`;
    this.setState({
      startTime: startTime,
      endTime: endTime,
    });
    firstLoad().then(res => {
      this.setState(
        {
          projectId: res.projectId,
          projectName: res.projectName,
          sectionId: res.sectionId,
        },
        () => {
          this.getList(this.state.projectId, this.state.sectionId, 0, startTime, endTime, '');
        }
      );
    });
  }
  // 删除回调
  delSuccess = () => {
    const { total, selectedRows, pageSize, currentPageNum } = this.state;
    let totalPageNum = Math.ceil((total - selectedRows.length) / pageSize); //计算总页数
    let PageNum = totalPageNum >= currentPageNum ? currentPageNum : totalPageNum; //总页数大于等于 当前页面，当前页数不变 否则 为1
    this.setState(
      {
        selectedRows: [],
        currentPageNum: PageNum,
      },
      () => {
        this.getList(
          this.state.projectId,
          this.state.sectionId,
          this.state.type,
          this.state.startTime,
          this.state.endTime,
          ''
        );
      }
    );
  };
  // 选择人员类型
  selectPeopleType = (value, e) => {
    if (value == '0') {
      //管理人员
      this.setState({
        manageFlag: true,
        type: 0,
        currentPageNum:1
      },()=>{
        this.getList(
          this.state.projectId,
          this.state.sectionId,
          0,
          this.state.startTime,
          this.state.endTime,
          this.state.searcher
        );
      });
    } else {
      //劳务人员
      this.setState({
        manageFlag: false,
        type: 1,
        currentPageNum:1
      },()=>{
        this.getList(
          this.state.projectId,
          this.state.sectionId,
          1,
          this.state.startTime,
          this.state.endTime,
          this.state.searcher
        );
      });
    }
  };
  //搜索
  successSearch = (searcher,startTime,endTime)=>{
    this.setState({
      searcher:isChina(searcher),startTime,endTime,
      currentPageNum:1
    },()=>{
      this.getList(
        this.state.projectId,
        this.state.sectionId,
        this.state.type,
        startTime,
        endTime,
        isChina(searcher)
      );
    })
  }
  // 选择项目
  openPro = (data1, data2, projectName) => {
    this.setState({
      projectId: data1[0],
      projectName,
      currentPageNum:1
    },()=>{
      this.getList(
        data1[0],
        '',
        this.state.type,
        this.state.startTime,
        this.state.endTime,
        this.state.searcher
      );
    });
  };
  getIds = (dats, idArr) => {
    if (dats) {
      dats.forEach((item, index, arr) => {
        idArr.push(item.id);
        this.getIds(item.children, idArr);
      });
    }
  };
  // 选择标段
  openSection = (sectionId, section) => {
    const { projectId } = this.state;
    this.setState({
      sectionId: sectionId,
      section: section,
      currentPageNum:1
    },()=>{
      this.getList(
        projectId,
        sectionId,
        this.state.type,
        this.state.startTime,
        this.state.endTime,
        this.state.searcher
      );
    });
  };
  // 更新回调
  updateSuccess = v => {
    const { data, dataMap, record } = this.state;
    util.modify(data, dataMap, record, v);
    this.setState({
      data,
      dataMap,
    });
  };
  render() {
    const { data, rightTags, itemMaps } = this.state;
    const { height, record } = this.props;
    const { intl } = this.props.currentLocale;
    const columns = [
      {
        title: '姓名',
        dataIndex: 'PEOPLE_NAME',
        key: 'PEOPLE_NAME',
      },
      {
        title: '身份证号',
        dataIndex: 'ID_CARD',
        key: 'ID_CARD',
      },
      {
        title: '项目名称',
        dataIndex: 'PROJECT_NAME',
        key: 'PROJECT_NAME',
      },
      {
        title: '标段名称',
        dataIndex: 'SECTION_NAME',
        key: 'SECTION_NAME',
      },
      {
        title: '应出勤天数',
        dataIndex: 'DAYS',
        key: 'DAYS',
      },
      {
        title: '缺勤天数',
        dataIndex: 'QQDAYS',
        key: 'QQDAYS',
      },
      {
        title: '请假天数',
        dataIndex: 'QJDAYS',
        key: 'QJDAYS',
      },
      {
        title: '实际出勤天数',
        dataIndex: 'ACTDAYS',
        key: 'ACTDAYS',
      },
      {
        title: '迟到天数',
        dataIndex: 'CDDAYS',
        key: 'CDDAYS',
      },
      {
        title: '早退天数',
        dataIndex: 'ZTDAYS',
        key: 'ZTDAYS',
      },
      {
        title: '异常天数',
        dataIndex: 'YCDAYS',
        key: 'YCDAYS',
      },
    ];
    const columns1 = [
      {
        title: '单位',
        dataIndex: 'ORG_NAME',
        key: 'ORG_NAME',
      },
      {
        title: '项目名称',
        dataIndex: 'PROJECT_NAME',
        key: 'PROJECT_NAME',
      },
      {
        title: '标段名称',
        dataIndex: 'SECTION_NAME',
        key: 'SECTION_NAME',
      },
      {
        title: '应出勤人次',
        dataIndex: 'ALLRS',
        key: 'ALLRS',
      },
      {
        title: '缺勤人次',
        dataIndex: 'QQRS',
        key: 'QQRS',
      },
      {
        title: '实际出勤人次',
        dataIndex: 'ACTRS',
        key: 'ACTRS',
      },
    ];
    let pagination = {
      total: this.state.total,
      // hideOnSinglePage: true,
      current: this.state.currentPageNum,
      pageSize: this.state.pageSize,
      showSizeChanger: true,
      size: 'small',
      showQuickJumper: true,
      showTotal: total => `总共${this.state.total}条`,
      onShowSizeChange: (current, size) => {
        this.setState(
          {
            pageSize: size,
            currentPageNum: 1,
          },
          () => {
            this.getList(this.state.projectId, this.state.sectionId,this.state.type,this.state.startTime,this.state.endTime, this.state.searcher);
          }
        );
      },
      onChange: (page, pageSize) => {
        this.setState(
          {
            currentPageNum: page,
          },
          () => {
            this.getList(this.state.projectId, this.state.sectionId,this.state.type,this.state.startTime,this.state.endTime, this.state.searcher);
          }
        );
      },
    };
    let { selectedRowKeys, selectedRows } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({
          selectedRowKeys,
          selectedRows,
        });
      },
    };
    return (
      <div>
        <TopTags
          projectName={this.state.projectName}
          record={this.state.record}
          success={this.addSuccess}
          delSuccess={this.delSuccess}
          openPro={this.openPro}
          openSection={this.openSection}
          data1={this.state.projectId}
          sectionId={this.state.sectionId}
          selectedRows={this.state.selectedRows}
          selectPeopleType={this.selectPeopleType}
          manageFlag={this.state.manageFlag}
          getList={this.getList.bind(this)}
          startTime={this.state.startTime}
          endTime={this.state.endTime}
          successSearch={this.successSearch}
          permission={this.state.permission}
        />
        <div className={style.main}>
          <div className={style.leftMain} style={{ height: this.props.height }}>
            <div style={{ minWidth: 'calc(100vw - 60px)' }}>
              <Table
                style={{ display: this.state.manageFlag ? 'block' : 'none' }}
                size="small"
                pagination={pagination}
                columns={columns}
                rowKey={record => record.id}
                name={this.props.name}
                dataSource={data}
                rowSelection={rowSelection}
              />
              <Table
                style={{ display: this.state.manageFlag ? 'none' : 'block' }}
                size="small"
                pagination={pagination}
                columns={columns1}
                rowKey={record => record.id}
                name={this.props.name}
                dataSource={data}
                rowSelection={rowSelection}
              />
            </div>
          </div>
          {/* <div className={style.rightBox} style={{ height }}>
                    <RightTags
                    rightTagList={rightTags}
                    rightData={this.state.rightData}
                    itemMaps = {itemMaps}
                    updateSuccess={this.updateSuccess}
                    menuCode = {this.props.menuInfo.menuCode}
                    groupCode={1}
                    />
                </div> */}
        </div>
      </div>
    );
  }
}
export default connect(
  state => ({
    currentLocale: state.localeProviderData,
  }),
  {
    changeLocaleProvider,
  }
)(SpecialType);
