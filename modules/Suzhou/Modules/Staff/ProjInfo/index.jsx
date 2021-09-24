import React, { Component } from 'react';
import intl from 'react-intl-universal';
import { Table ,Modal, message, notification} from 'antd';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { changeLocaleProvider } from '../../../../../store/localeProvider/action'
import style from './style.less';
import axios from '../../../../../api/axios';
import { menuTree, menuAdd,getProjInfoList,getsectionId,getPermission } from '../../../api/suzhou-api';
import TopTags from './TopTags/index';
import RightTags from '../../../../../components/public/RightTags/index';
import * as util from '../../../../../utils/util';
import * as dataUtil from  '../../../../../utils/dataUtil'
import StandardTable from '../../../../../components/Table/index';
import MyIcon from '../../../../../components/public/TopTags/MyIcon';
import SelectPlanBtn from "../../../../../components/public/SelectBtn/SelectPlanBtn"
import {firstLoad} from "@/modules/Suzhou/components/Util/firstLoad";
import {permissionFun} from "@/modules/Suzhou/components/Util/util";

class ProjInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initDone: false,
      activeIndex: null,
      rightData: null,
      rightTags: [],
      data: [],
      initData:[],
      dataMap: [],
      record: null,
      projectId:'',
      sectionId:'',
      search:'',
      expandedRowKeys:[],
      groupCode:1,
      projectName:'',
      permission:[]
    };

  }
  //点击Table行事件
  getInfo = (record) => {
    const { activeIndex } = this.state;
    const { id } = record;
    if(record.isProject == 1){
      this.setState({
        activeIndex: null,
        record: null,
        rightData: null
      });
    }else{
      this.setState({
        activeIndex: id,
        record: record,
        rightData: record
      });
    }
    if(record.orgTypeVo.code == 2){
      this.setState({
        groupCode:1
      })
    }else{
      this.setState({
        groupCode:2
      })
    }
  };

  //获取菜单list
  getList = (projectId,sectionIds) => {
    axios.get(getProjInfoList+`?projectId=${projectId}&sectionIds=${sectionIds}&projView=1`).then(res => {
      if(res.data.data[0].children.length > 0){
        let arr = dataUtil.getExpandKeys(res.data.data[0].children,3);
        const dataMap = util.dataMap(res.data.data[0].children);
        var maps = new Object();
        // this.getMaps(res.data,maps);
        this.setState({
          data: res.data.data[0].children,
          initData:res.data.data[0].children,
          dataMap:dataMap,
          expandedRowKeys:arr
          // itemMaps:maps
        });
      }
      
    });
  };

  getMaps = (dats,maps) => {
    if(dats){
      dats.forEach((item,index,arr) => {
        maps[item.id] = item;
        this.getMaps(item.children,maps);
      })
    }
  }

  componentDidMount() {
    // let menuCode = 'STAFF-PROJINFO'
    // axios.get(getPermission(menuCode)).then((res)=>{
    //   let permission = []
    //   res.data.data.map((item,index)=>{
    //     permission.push(item.code)
    //   })
    //   this.setState({
    //     permission
    //   })
    // })
    permissionFun(this.props.menuInfo.menuCode).then(res=>{
        this.setState({
            permission:!res.permission?[]:res.permission
        })
    });
    firstLoad().then(res=>{
      this.setState({
          projectId:res.projectId,
          projectName:res.projectName,
          sectionId:res.sectionId
      },()=>{
        this.getList(res.projectId,res.sectionId);
      })
    })
  }
  //设置table的选中行class样式
  setClassName = (record, index) => {
    return record.id === this.state.activeIndex ? 'tableActivty' : '';
  };

  //新增回调
  addSuccess = (value, type) => {
    const { data, dataMap,record } = this.state;
    util.create(data, dataMap, record, value);
    let arr = dataUtil.getExpandKeys(data);
    this.setState({
      data,
      dataMap,
      expandedRowKeys:arr
    });
  };

  //删除回调
  delSuccess = () => {
    const { data, dataMap,record } = this.state;
    util.deleted(data, dataMap, record);
    let dataMap1 = util.dataMap(data);
    this.setState({
      data,
      dataMap: dataMap1,
      activeIndex: null,
      record: null,
      rightData: null
    });
  };

  //更新回调
  updateSuccess = (v) => {
    const { data, dataMap ,record} = this.state;
    util.modify(data, dataMap, record, v);
    this.setState({
      data,
      dataMap
    });
  };
  //搜索
  search = (val) => {
    if(val){
      this.setState({
        search:val
      })
    }
    const {initData} = this.state;
    let newData = dataUtil.search(initData,[{"key":"orgName","value":val}],true);
    this.setState({data:newData});
  }

  openPro = (data1,data2,projectName) => {
    this.setState({
      projectId:data1[0],
      projectName
    })
    this.getList(data1[0],'');
  }
  getIds = (dats,idArr) => {
    if(dats){
      dats.forEach((item,index,arr) => {
        idArr.push(item.id);
        this.getIds(item.children,idArr)
      });
    }
  };
  openSection=(sectionId,section)=>{
    const {projectId} = this.state;
    this.setState({
      sectionId:sectionId,
      section:section
    })
    this.getList(projectId,sectionId);
  }
  /**
   @method 展开行事件
   @description  操作表格数据，删除数据
   @param record {object} 行数据
   */
  handleOnExpand = (expanded, record) => {
    const {expandedRowKeys} = this.state
    if (expanded) {
      expandedRowKeys.push(record.id)
    } else {
      let i = expandedRowKeys.findIndex(item => item == record.id)
      expandedRowKeys.splice(i, 1)
    }
    this.setState({
      expandedRowKeys
    })
  }
  render() {
    const { intl } = this.props.currentLocale;
    const columns = [
      {
        title:'标段号',
        dataIndex: 'sectionCode',
        key: 'sectionCode',
      },
      {
        title:'标段名称',
        dataIndex: 'sectionName',
        key: 'sectionName',
      },
      {
        title:'标段类型',
        dataIndex: 'sectionType',
        key: 'sectionType',
      },
      {
        title:'单位名称',
        dataIndex: 'orgName',
        key: 'orgName',
        render:(text,record)=>{
          return <span><MyIcon type="icon-yeqianzu" style={{fontSize: '18px', marginRight: '8px'}} />{text}</span>
        }
        // render: (text, record) => {
        //   if(record.menuType.id==1){
        //     return <span><MyIcon type="icon-zujian" style={{fontSize: '18px', marginRight: '8px'}} />{text}</span>
        //   }else if(record.menuType.id==2){
        //     return <span><MyIcon type="icon-caidan" style={{fontSize: '18px', marginRight: '8px'}} />{text}</span>
        //   }else if(record.menuType.id==3){
        //     return <span><MyIcon type="icon-yeqian" style={{fontSize: '18px', marginRight: '8px'}} />{text}</span>
        //   }else {
        //     return <span><MyIcon type="icon-yeqianzu" style={{fontSize: '18px', marginRight: '8px'}} />{text}</span>
        //   }
        // }
      },
      {
        title:'单位分类',
        dataIndex: 'orgCategoryVo.name',
        key: 'orgCategoryVo.name',
      },
      // {
      //   title:'单位类型',
      //   dataIndex: 'orgTypeVo.name',
      //   key: 'orgTypeVo.name',
      // },
      {
        title:'项目部名称',
        dataIndex: 'projUnitName',
        key: 'projUnitName',
      },
      {
        title: '法人代表',
        dataIndex: 'corporationer',
        key: 'corporationer',
      },
      {
        title:'分管项目部领导',
        dataIndex: 'leader',
        key: 'leader',
      },
      {
        title:'责任人电话',
        dataIndex: 'telPhone',
        key: 'telPhone',
      }
    ];

    const { data, rightTags,itemMaps } = this.state;
    const { height, record } = this.props;
    return (
      <div>
        <TopTags
          projectName = {this.state.projectName}
          record={this.state.record}
          success={this.addSuccess}
          delSuccess={this.delSuccess}
          search={this.search}
          openPro={this.openPro}
          openSection={this.openSection}
          data1={this.state.projectId}
          sectionId = {this.state.sectionId}
          permission={this.state.permission}
        />
        <div className={style.main}>
          <div className={style.leftMain} style={{ height: this.props.height }}>
            <div style={{ minWidth: 'calc(100vw - 60px)' }}>
              {/* <Table  
              pagination={false} 
              dataSource={data} 
              columns={columns} 
              callBackMoveList={this.callBackMoveList}
               getInfo={this.getInfo} setClassName={this.setClassName}/> */}
               <Table
                    size="small"
                    pagination={false}
                    columns={columns}
                    rowKey={record => record.id}
                    name={this.props.name}
                    dataSource={data}
                    rowClassName={this.setClassName}
                    expandedRowKeys={this.state.expandedRowKeys}
                    onExpand={this.handleOnExpand.bind(this)}
                    onRow={(record, index) => {
                      return {
                          onClick: (event) => {
                            this.getInfo(record, event);
                          },
                        };
                      }
                    }
                />
            </div>
          </div>
          <div className={style.rightBox} style={{ height }}>
            <RightTags
              fileRelease={true}
              rightTagList={rightTags}
              rightData={this.state.rightData}
              projectId={this.state.projectId}
              sectionId={this.state.sectionId}
              itemMaps = {itemMaps}
              updateSuccess={this.updateSuccess}
              groupCode={1}
              menuCode = {this.props.menuInfo.menuCode}
              menuId = {this.props.menuInfo.id}
              bizType={this.props.menuInfo.menuCode}
              bizId = {this.state.rightData ? this.state.rightData.id : null}
              fileEditAuth={true}
              extInfo={{
                  startContent: "人员基础信息"
              }}
              groupCode={this.state.groupCode}
              isShow={this.state.permission.indexOf('PROJINFO_FILE-EDIT')==-1?false:true} //文件权限
              fileRelease={this.state.permission.indexOf('PROJINFO_FILE-RELEASE')==-1?false:true}//文件发布权限
              permission={this.state.permission}
            />
          </div>
        </div>

      </div>
    );
  }
}
export default connect(state => ({
  currentLocale: state.localeProviderData
}), {
      changeLocaleProvider
  })(ProjInfo);

