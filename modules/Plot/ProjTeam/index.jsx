import React, { Component } from 'react'
import { Table, notification } from 'antd'
import style from './style.less'
/* *********** 引入redux及redux方法 start ************* */
import { connect } from 'react-redux'
import { changeLocaleProvider } from '../../../store/localeProvider/action'
/* *********** 引入redux及redux方法 end ************* */
import RightTags from '../../../components/public/RightTags/index'
import * as util from '../../../utils/util';
import * as dataUtil from '../../../utils/dataUtil';
import Release from "../../Components/Release"
import TipModal from "../../Components/TipModal"
import AddModal from "./AddModal"
import {firstLoad} from "@/modules/Suzhou/components/Util/firstLoad";

//api
import {
  getBaseSelectTree,
  getproInfo,
  prepaTree,
  prepaProjectteamDel, prepaProjectteamAdd,

} from '../../../api/api';
import { updateProjectTeamSort_ } from '../../../api/suzhou-api'
import axios from '../../../api/axios';
import MyIcon from "../../../components/public/TopTags/MyIcon";
import TopTags from '../ProjTeam/TopTags';
import SelectSection from './SelectSection/index';

class ProjectTeam extends Component {
  constructor(props) {
    super(props)
    this.state = {
      initDone: false,
      activeIndex: [],
      group: 2,
      rightData: null,
      initData: [],
      dataMap: [],
      taskData: [],
      projectId: null,
      addSectionModal: false,//同步标段
      showBtn: false,//同步按钮
      groupCode:1,//页签组
      expandedRowKeys:[] //默认展开行
    }
  }
  componentDidMount() {
    // 初始化业务字典
    this.getBaseSelectTree("proj.section.type");//标段类型
    this.getBaseSelectTree("base.org.type");//单位类型
    this.getBaseSelectTree("base.org.classification");//单位分类
    this.getBaseSelectTree("base.professional.type");//专业
    this.getBaseSelectTree("base.position.type");//职务
    //监听全局点击事件
    document.addEventListener('click', this.closeRight);
    // 初始化数据
    this.initDatas();
    /*
            const {orgType} = this.state.orgType;*/
  }

  componentWillUnmount() {
    //销毁全局点击事件
    document.removeEventListener('click', this.closeRight, false);
  }
  // 关闭右击菜单
  closeRight = () => {
    if (this.state.rightClickShow) {
      this.setState({
        rightClickShow: false
      })
    }
  }
  //右击菜单事件处理
  rightClickMenu = (menu) => {

  }

  // 获取下拉框值
  getBaseSelectTree = (typeCode) => {
    axios.get(getBaseSelectTree(typeCode)).then(res => {
      const { data } = res.data;
      ;
      let map = {};
      for (let index in data) {
        map[data[index].value] = data[index].title;
      }
      //标段类型
      if (typeCode == "proj.section.type") {
        this.setState({
          section: data,
          sectionMap: map
        })
      }
      else if (typeCode == "base.org.type") { //单位类型
        this.setState({
          orgType: data,
          orgTypeMap: map
        })
      }
      else if (typeCode == "base.org.classification") { //单位分类
        this.setState({
          orgClassification: data,
          orgClassificationMap: map
        })
      }
      else if (typeCode == "base.professional.type") { //专业
        this.setState({
          professional: data,
          professionalMap: map
        })
      }
      else if (typeCode == "base.position.type") { //职务
        this.setState({
          position: data,
          positionMap: map
        })
      }
    })
  }

  /**
   * 初始化数据
   *
   */
    initDatas = () => {
      // dataUtil.CacheOpenProjectByType().getLastOpenProject((data) => {
      //   const { projectId } = data;
      //   if (projectId) {
      //     this.getDataList(projectId);
      //   }
      // });
      firstLoad().then(res=>{
        this.setState({
            projectId:res.projectId,
            projectName:res.projectName,
            sectionId:res.sectionId
        })
        if(res.projectId){
          this.getDataList(res.projectId);
        }
      })
    }

    /**
     * 获取选中的列表项
     **/
    getInfo = (record) => {
      this.setState({
        activeIndex: record.id,
        rightData: record
      })
      if (record.extendedColumn1 == 'org' && record.extendedColumn3 == 1) { //组织
        this.setState({ showBtn: true, extendedColumn2: 'supervisor' })
      } else if (record.extendedColumn1 == 'section' && record.extendedColumn2 == 'supervisor') {
        this.setState({ showBtn: true, extendedColumn2: 'construction' })
      } else {
        this.setState({ showBtn: true, extendedColumn2: '' })
      }
      if(record.extendedColumn1 == 'section'){
        if(record.extendedColumn2 == 'supervisor'){
          this.setState({groupCode:3})
        }else{
          this.setState({groupCode:2})
        }
      }else{
        this.setState({groupCode:1})
      }
    }

    // 选中行高亮
    setClassName = (record, index) => {
      //判断索引相等时添加行的高亮样式
      return record.id === this.state.activeIndex ? "tableActivty" : "";
    }

    //获取项目团队列表
    getList = () => {
      this.getProjectInfo(this.state.projectId, () => {
        axios.get(prepaTree(this.state.projectId, 'project')).then(res => {
          const { data } = res.data
          const { tableData } = this.state
          tableData[0].children = data
          const dataMap = util.dataMap(tableData);
          this.setState({
            initData: tableData || [],
            dataMap,
            tableData
          })
        })
      })
    }

    getProjectInfo = (projectId, callback) => {

      axios.get(getproInfo(projectId)).then(res => {
        if (res.data.data) {
          this.setState({
            tableData: [{ id: res.data.data.id, teamName: res.data.data.name, teamCode: res.data.data.code, type: "project", extendedColumn1: "", extendedColumn2: "" }]
          }, () => {
            callback();
          })
        }
      })

    }

    //项目团队排序
    updateProjectTeamSort = (upOrDown) => {
      let { rightData } = this.state;
      if (rightData) {
        if (rightData.bizType) {
          axios.put(updateProjectTeamSort_(rightData.id, upOrDown), true).then(res => {
            const { tableData } = this.state
            tableData[0].children = res.data.data
            const dataMap = util.dataMap(tableData);
            this.setState({
              initData: tableData || [],
              dataMap,
              tableData
            })
          })
        }
      }
    }



    /**
    * 打开项目
    * @param projectId 项目ID
    */
    openProject = (projectId) => {
      this.getDataList(projectId[0]);
    }

    /**
     * 获取团队列表
     * @param
     */
    getDataList = (id) => {
      this.setState({ projectId: id || 0 }, () => {
        this.getList()
      });
    }

    // 新增团队
    addProjTeam = (ndata, bo) => {
      const { dataMap, rightData, tableData } = this.state;
      util.create(tableData, dataMap, rightData, ndata);
      this.setState({
        tableData,
        dataMap
      });
    }

    //点击新增处理
    addData = () => {
      const { projectId, rightData } = this.state
      if (!projectId) {
        notification.warning(
          {
            placement: 'bottomRight',
            bottom: 50,
            duration: 2,
            message: '提醒',
            description: '请选择项目!'
          }
        );
        return;
      }

      if (!rightData) {
        notification.warning(
          {
            placement: 'bottomRight',
            bottom: 50,
            duration: 2,
            message: '未选中数据',
            description: '请选择数据进行操作'
          }
        );
        return;
      }
      this.setState({
        showAddModal: true,
        modalTitile: "新增"
      })

    }

    // 修改
    updateData = (ndata) => {
      axios.put(prepaProjectteamAdd, ndata, true).then(res => {
        const { dataMap, rightData, tableData } = this.state;
        util.modify(tableData, dataMap, rightData, res.data.data);
        this.setState({
          dataMap,
          tableData
        })
      })
    }

    // 删除
    deleteData = (ids) => {
      let { rightData } = this.state;
      if (rightData) {
        axios.deleted(prepaProjectteamDel, { data: [rightData.id] }, true).then(res => {
          // 
          let { dataMap, tableData } = this.state
          util.deleted(tableData, dataMap, rightData);
          let dataMap1 = util.dataMap(tableData);
          this.setState({
            dataMap: dataMap1,
            rightData: null,
            activeIndex: [],
            deleteTip: false,
            tableData
          })
        })
      }
    }

    /**
     * 查询条件
     *
     * @param value
     */
    search = (value) => {
      const { tableData, childrenData } = this.state;
      let data = childrenData ? childrenData : tableData[0].children;
      let newData = dataUtil.search(data, [{ "key": "teamName|teamCode", "value": value }, { "key": "type", "value": "" }], true);
      if (!value)
        newData = childrenData;
      const dataMap = util.dataMap(newData);
      tableData[0].children = newData
      this.setState({
        dataMap,
        tableData,
        childrenData: data
      });
    }

    //关闭新增按钮
    closeAddModal = () => {
      this.setState({
        showAddModal: false
      })
    }

    // 同步标段
    addSection = () => {
      this.setState({
        addSectionModal: true
      })
    }
    closeSelectSectionModal = () => {
      this.setState({
        addSectionModal: false
      })
    }
    //默认展开行
    handleOnExpand = (expanded, record) => {
      const { expandedRowKeys } = this.state
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
      const columns = [
        {
          title: '名称',
          dataIndex: 'teamName',
          key: 'teamName',
          render: (text, record) => {
            if (record.type == "project") {
              return <span> <MyIcon type='icon-xiangmu' style={{ fontSize: '18px', verticalAlign: "middle" }} /> {text} </span>
            } else {
              return <span><MyIcon type="icon-gongsi" style={{ fontSize: '18px', verticalAlign: "middle" }} /> {text}</span>
            }
          }
        },
        {
          title: '代码',
          dataIndex: 'teamCode',
          key: 'teamCode'
        },
        {
          title: "类别",
          dataIndex: 'extendedColumn1',
          key: 'extendedColumn1',
          render: (text, record) => {
            let ret = text && text == "org" ? "组织" : text == "section" ? "标段" : text;
            return ret;
          }
        },
        {
          title: "单位类型",
          dataIndex: 'extendedColumn3',
          key: 'extendedColumn3',
          render: (text, record) => {
            let ret = text && this.state.orgTypeMap[text] ? this.state.orgTypeMap[text] : text;
            return ret;
          }
        },
        {
          title: "单位分类",
          dataIndex: 'extendedColumn4',
          key: 'extendedColumn4',
          render: (text, record) => {
            let ret = text && this.state.orgClassificationMap[text] ? this.state.orgClassificationMap[text] : text;
            return ret;
          }
        },
        {
          title: "标段类型",
          dataIndex: 'extendedColumn2',
          key: 'extendedColumn2',
          render: (text, record) => {
            let ret = text && this.state.sectionMap[text] ? this.state.sectionMap[text] : text;
            return ret;
          }
        },
        {
          title: "专业",
          dataIndex: 'extendedColumn5',
          key: 'extendedColumn5',
          render: (text, record) => {
            //let ret = text && this.state.professionalMap[text] ? this.state.professionalMap[text] : text;
            let ret = '';
            if (text && this.state.professionalMap) {
              let ec5 = text.split(',');
              ec5.map((item, index) => {
                ret = ret == '' ? this.state.professionalMap[item] : ret + ',' + this.state.professionalMap[item];
              }, this)
            }
            return ret;
          }
        },
        {
          title: "标段状态",
          dataIndex: 'sectionStatusVo.name',
          key: 'sectionStatusVo',
        },
        {
          title: "开工日期",
          dataIndex: 'startDate',
          key: 'startDate',
        },
        {
          title: "完工日期",
          dataIndex: 'endDate',
          key: 'endDate',
        },
        {
          title: "派工单开始日期",
          dataIndex: 'pgdStartDate',
          key: 'pgdStartDate',
        },
        {
          title: "派工单结束日期",
          dataIndex: 'pgdEndDate',
          key: 'pgdEndDate',
        },
        {
          title: "考核开始日期",
          dataIndex: 'examStartDate',
          key: 'examStartDate',
        },
        {
          title: "考核结束日期",
          dataIndex: 'examEndDate',
          key: 'examEndDate',
        },
      ];

      return (
        <div>
          {/*工具栏*/}
          <TopTags
            search={this.search}
            data={this.state.rightData ? this.state.rightData : null}
            parentState={this.state}
            addData={this.addData}
            deleteData={this.deleteData}
            bizType="project"
            bizId={this.state.projectId}
            getList={this.getList}
            rightData={this.state.rightData}
            openProject={this.openProject}
            updateProjectTeamSort={this.updateProjectTeamSort}
            addSection={this.addSection}
            showBtn={this.state.showBtn}
          />

          <div className={style.main}>
            <div className={style.leftMain} style={{ height: this.props.height }}>
              <div style={{ minWidth: 'calc(100vw - 60px)' }}>

                <Table className={style.Infotable1}
                  columns={columns}
                  pagination={false}
                  dataSource={this.state.tableData}
                  rowClassName={this.setClassName}
                  rowKey={record => record.id}
                  defaultExpandAllRows={true}
                  expandedRowKeys={this.state.expandedRowKeys}
                  onExpand={this.handleOnExpand.bind(this)} 
                  size={"small"}
                  onRow={(record, index) => {
                    return {
                      onClick: (event) => {
                        this.getInfo(record, index)
                      },
                      //右击事件
                      onContextMenu: (event) => {
                        //取消事件的默认动作
                        event.preventDefault()

                      }
                    }
                  }} />

              </div>
            </div>

            <div className={style.rightBox} style={{ height: this.props.height }}>
              <RightTags
                menuCode={this.props.menuInfo.menuCode}
                groupCode={this.state.groupCode}
                menuId={this.props.menuInfo.id}
                bizType="project"
                bizId={this.state.projectId}
                rightTagList={this.state.rightTags}
                updateData={this.updateData}
                section={this.state.section} orgType={this.state.orgType} orgClassification={this.state.orgClassification}
                professional={this.state.professional} professionalMap={this.state.professionalMap} position={this.state.position} positionMap={this.state.positionMap}
                rightData={this.state.rightData && this.state.rightData.type != "project" ? this.state.rightData : null}
                updateSuccess={this.updateSuccess} />
            </div>
          </div>
          {this.state.isShowPublic && <Public handleCancel={this.closePublicModal} projectId={this.state.projectId} reflesh={this.getList} />}
          {this.state.isShowRelease && <Release handleCancel={this.closeReleaseModal} projectId={this.state.projectId} firstColums={columns} />}
          {this.state.isShowAbolish && <CancelPublic handleCancel={this.closeAbolishModal} projectId={this.state.projectId} reflesh={this.getList} />}
          {/* 右击菜单 */}
          {this.state.rightClickShow &&
            <RightClickMenu name={this.state.clickTreeName} x={this.state.x} y={(this.state.y > this.props.height - 100) ? this.props.height - 100 : this.state.y}
              handleClick={this.rightClickMenu} />}
          {/* 删除提示 */}
          {this.state.deleteTip && <TipModal onOk={this.prepaProjectteamDel} onCancel={this.closeDeleteTipModal} />}
          {/* 新增弹窗 */}
          {this.state.showAddModal && <AddModal title={this.state.modalTitile}
            addProjTeam={this.addProjTeam} section={this.state.section} orgType={this.state.orgType} orgClassification={this.state.orgClassification}
            professional={this.state.professional} professionalMap={this.state.professionalMap}
            handleCancel={this.closeAddModal} projectId={this.state.projectId} rightData={this.state.rightData}
          />}
          {this.state.addSectionModal && (
            <SelectSection visible={true}
              record={this.state.rightData}
              extendedColumn2={this.state.extendedColumn2}
              successSection={this.getList}
              handleCancel={this.closeSelectSectionModal.bind(this)} />
          )}
        </div>
      )
  }
}

/* *********** connect链接state及方法 start ************* */
export default connect(state => ({
  currentLocale: state.localeProviderData
}), {
  changeLocaleProvider
})(ProjectTeam);
/* *********** connect链接state及方法 end ************* */
