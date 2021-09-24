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
import { getOrgTree, getPeople } from '@/api/suzhou-api';
import axios from '@/api/axios';
import axiosNoMsg from '../../../components/Axios/axios';
import MyIcon from '@/components/public/TopTags/MyIcon';
import TopTags from './TopTags/index';
import Search from '@/components/public/Search';
import { firstLoad } from '@/modules/Suzhou/components/Util/firstLoad';

class SpecialType extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rightTags: [],
      pageSize: 10,
      currentPageNum: 1,
      total: '1',
      leftdata: [],
      projectId: '',
      sectionId: '',
      search: '',
      activeIndexLeft: '',
      activeIndex: '',
      searchOrgs: [],
      searcher: '',
      initLeftData: '',
      expandedRowKeys: [],
      projectName: '',
      source:'',
      type:'',
      orgId:'',
    };
  }
  getInfoleft = leftrecord => {
    const { activeIndexLeft } = this.state;
    const { id } = leftrecord;
    const data = {
      projectId: this.state.projectId,
      searcher: '',
      source:leftrecord.source,
      type:leftrecord.type,
      orgId:leftrecord.orgId,
    };
    this.setState({
      activeIndexLeft: id,
      leftrecord: leftrecord,
      source:leftrecord.source,
      type:leftrecord.type,
      orgId:leftrecord.orgId,
      currentPageNum:1,
    },()=>{
      this.getList(data);
    });
  };
  getSearchOrgs = (dats, orgArr) => {
    if (!dats) {
    } else {
     
          const obj = new Object();
          obj['orgId'] = dats.id;
          obj['source'] = dats.source;
          obj['type'] = dats.type
          orgArr.push(obj);
        //this.getSearchOrgs(item.children, orgArr);
 
    }
  };
  getList = data => {
    axios.post(getPeople(this.state.pageSize, this.state.currentPageNum)+`?orgId=${data.orgId}&projectId=${data.projectId}&source=${data.source}&type=${data.type}&searcher=${data.searcher}`).then(res => {
      if (!res.data.data) {
        notification.warning({
          placement: 'bottomRight',
          bottom: 50,
          duration: 1,
          message: '警告',
          description: '没有数据',
        });
        return;
      } else {
        this.setState({
          data: res.data.data,
          total: res.data.total,
        });
      }
    });
  };
  getListTree = projectId => {
    axios.get(getOrgTree(projectId)).then(res => {
      let arr = dataUtil.getExpandKeys(res.data.data, 3);
      this.setState({
        leftdata: res.data.data,
        initLeftData: res.data.data,
        expandedRowKeys: arr,
      });
      const orgArr = [];
      this.getSearchOrgs(res.data.data[0], orgArr);
      const data = {
        projectId: this.state.projectId,
        searcher: '',
        source:orgArr[0].source,
        type:orgArr[0].type,
        orgId:orgArr[0].orgId,
      };
      this.setState({
        source:orgArr[0].source,
        type:orgArr[0].type,
        orgId:orgArr[0].orgId,
        currentPageNum:1
      },()=>{
        this.getList(data);
      });
    });
  };
  componentDidMount() {
    firstLoad().then(res => {
      this.setState(
        {
          projectId: res.projectId,
          projectName: res.projectName,
          sectionId: res.sectionId,
        },
        () => {
          this.getListTree(this.state.projectId);
        }
      );
    });
  }
  // 搜索
  search = val => {
    this.setState({
      searcher: val,
    });
    if (!this.state.projectId) {
      notification.warning({
        placement: 'bottomRight',
        bottom: 50,
        duration: 1,
        message: '警告',
        description: '请选择项目',
      });
      return;
    } else if (!this.state.orgId) {
      notification.warning({
        placement: 'bottomRight',
        bottom: 50,
        duration: 1,
        message: '警告',
        description: '清选择组织机构',
      });
      return;
    } else {
      const data = {
        projectId: this.state.projectId,
        searcher: val,
        source:this.state.source,
        type:this.state.type,
        orgId:this.state.orgId,
      };
      this.setState({
        currentPageNum:1
      },()=>{
        this.getList(data);
      })
    }
  };
  //搜索组织机构
  searchOrgs = val => {
    const { initLeftData } = this.state;
    let newData = dataUtil.search(initLeftData, [{ key: 'orgName', value: val }], true);
    this.setState({
      leftdata: newData,
    });
  };
  // 选择项目
  openPro = (data1, data2, projectName) => {
    this.setState({
      projectId: data1[0],
      projectName,
      currentPageNum:1
    },()=>{
      this.getListTree(data1[0]);
    });
  };
  // getIds = (dats, idArr) => {
  //   if (dats) {
  //     dats.forEach((item, index, arr) => {
  //       idArr.push(item.id);
  //       this.getIds(item.children, idArr);
  //     });
  //   }
  // };
  //设置table的选中行class样式
  setClassName = (record, index) => {
    return record.id === this.state.activeIndex ? 'tableActivty' : '';
  };
  setleftClassName = (leftrecord, index) => {
    return leftrecord.id === this.state.activeIndexLeft ? 'tableActivty' : '';
  };
  /**
     @method 展开行事件
    @description  操作表格数据，删除数据
    @param record {object} 行数据
    */
  handleOnExpand = (expanded, record) => {
    const { expandedRowKeys } = this.state;
    if (expanded) {
      expandedRowKeys.push(record.id);
    } else {
      let i = expandedRowKeys.findIndex(item => item == record.id);
      expandedRowKeys.splice(i, 1);
    }
    this.setState({
      expandedRowKeys,
    });
  };
  render() {
    const { data, rightTags, itemMaps, leftdata } = this.state;
    const { height, record } = this.props;
    const { intl } = this.props.currentLocale;
    const leftColumns = [
      {
        title: '名称',
        dataIndex: 'orgName',
        key: 'orgName',
        render: (text, record) => {
          return (
            <span>
              <MyIcon type="icon-yeqianzu" style={{ fontSize: '18px', marginRight: '8px' }} />
              {record.sectionCode?(record.sectionCode+' '+record.orgName):record.orgName}
            </span>
          );
        },
      },
    ];
    const columns = [
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
        width: '10%',
      },
      {
        title: '职务',
        dataIndex: 'jobVo.name',
        key: 'jobVo.name',
        width: '10%',
      },
      {
        title: '性别',
        dataIndex: 'sexVo.name',
        key: 'sexVo.name',
        width: '10%',
      },
      {
        title: '单位',
        dataIndex: 'orgName',
        key: 'orgName',
        width: '15%',
      },
      {
        title: '联系方式',
        dataIndex: 'telPhone',
        key: 'telPhone',
        width: '15%',
      },
    ];
    let pagination = {
      total: this.state.total,
      // hideOnSinglePage: true,
      currentPageNum: this.state.currentPageNum,
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
            this.getList({
              projectId: this.state.projectId,
              searcher: this.state.searcher,
              source:this.state.source,
              type:this.state.type,
              orgId:this.state.orgId,
            });
          }
        );
      },
      onChange: (page, pageSize) => {
        this.setState(
          {
            currentPageNum: page,
          },
          () => {
            this.getList({
              projectId: this.state.projectId,
              searcher: this.state.searcher,
              source:this.state.source,
              type:this.state.type,
              orgId:this.state.orgId,
            });
          }
        );
      },
    };
    return (
      <div>
        <TopTags
          projectName={this.state.projectName}
          record={this.state.record}
          search={this.search}
          openPro={this.openPro}
          data1={this.state.projectId}
        />
        <div className={style.main}>
          <div className={style.sectionBox}>
            <div className={style.searchBox}>
              <Search search={this.searchOrgs} placeholder={'组织名称/标段名称'} />
            </div>
            <Table
              size="small"
              pagination={false}
              showHeader={false}
              columns={leftColumns}
              scroll={{ y: parseInt(this.props.height) - 50 }}
              rowKey={leftrecord => leftrecord.id}
              dataSource={leftdata}
              rowClassName={this.setleftClassName}
              expandedRowKeys={this.state.expandedRowKeys}
              onExpand={this.handleOnExpand.bind(this)}
              onRow={(record, index) => {
                return {
                  onClick: event => {
                    this.getInfoleft(record, event);
                  },
                };
              }}
            />
          </div>
          <div className={style.leftMain} style={{ height: this.props.height }}>
            <div>
              <Table
                size="small"
                pagination={pagination}
                columns={columns}
                rowKey={record => record.id}
                name={this.props.name}
                dataSource={data}
                rowClassName={this.setClassName}
              />
            </div>
          </div>
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
