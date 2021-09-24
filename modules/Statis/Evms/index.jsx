import React, { Component } from 'react'
import { Table, Icon, Spin, Modal, Empty, notification } from 'antd'
import style from './style.less'
import TopTags from './TopTags/index'
import RightTags from '../../../components/public/RightTags/index'
import _ from 'lodash'
import { connect } from 'react-redux'
import * as util from '../../../utils/util'
import axios from '../../../api/axios'
import { getEarnedvalueTree, getBaseSelectTree, getEcharsLine, getvariable } from '../../../api/api'
import * as dataUtil from "../../../utils/dataUtil"
// 引入 ECharts 主模块
import echarts from 'echarts/lib/echarts';
//引入曲线图
import 'echarts/lib/chart/line'
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend'
import 'echarts/lib/component/title';
import 'echarts/lib/component/graphic'
import 'echarts/lib/component/markLine'
import PubTable from '../../../components/PublicTable'
//项目群
class TableComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      activeIndex: "",
      rightData: null,
      data: [],
      dataMap: [],
      echarsInfo: null,                  //echars 折线图
      visible: false,                 //echars modal 默认不显示
      baseLineTime: new Date(),
      projSet: { dateFormat: 'YYYY-MM-DD', drtnUnit: 'h', timeUnit: 'h', precision: 2, moneyUnit: '¥', complete: '%' },
    }
  }

  componentDidMount() {
    dataUtil.CacheOpenProject().getLastOpenPlan((define) => {
      const { planId, projectId } = define;
      axios.get(getvariable(projectId || 0)).then(res => {
        const data = res.data.data || {};
        this.setState({
          projSet: {
            dateFormat: (data.dateFormat || {}).id || "YYYY-MM-DD",
            drtnUnit: (data.drtnUnit || {}).id || "h",
            timeUnit: (data.timeUnit || {}).id || "h",
            complete: (data.complete || {}).id || "%",
            precision: data.precision || 2,
            moneyUnit: (data.currency || {}).symbol || "¥",
          }
        }, () => {
          if (Object.keys(define).length > 0) {
            this.openPlan(planId, projectId);
          }
        });
      });
    });
  }
  /**
      * 父组件即可调用子组件方法
      * @method
      */
  onRef = (ref) => {
    this.table = ref
  }
  //关闭、开启 echars modal
  handleCancel = () => {
    this.setState({
      visible: !this.state.visible
    })
  }

  // 获取选择计划列表
  openPlan = (selectArray, projectId) => {
    this.setState({
      selectArray: selectArray,
      selectProjectId: projectId
    }, () => {
      this.table.getData();
    })
  }

  // 获取计划编制列表
  getPreparedTreeList = (callBack) => {
    if (this.state.keywords) {
      const { copyData } = this.state;
      let newData = dataUtil.search(copyData, [{ "key": "name|code", "value": this.state.keywords }], true);
      callBack(newData);
      return;
    }
    const defineId = this.state.selectArray
    if(defineId){
      axios.post(getEarnedvalueTree, { defineIds: defineId }).then(res => {
        let { data } = res.data;
        callBack(data ? data : [])
        this.setState({ data, rightData: null });
      })
    }else{
      callBack([])
    }
 
  }

  //table表格单行点击回调
  getInfo = (record, index) => {
    let id = record.id, records = record
    if (record.nodeType == "wbs") {
      this.setState({ groupCode: 1 })
    } else if (record.nodeType == "task") {
      this.setState({ groupCode: 2 })
    } else {
      this.setState({ groupCode: -1 })
    }
    this.setState({
      activeIndex: id,
      rightData: record
    })
  }

  //搜索
  search = (value) => {
    this.setState({
      keywords: value,
    }, () => {
      this.table.getData();
    });
  }


  //增加函数
  addData = (val) => {
    let { rightData } = this.state
    this.table.add(rightData, val);
  }

  //删除函数
  delData = () => {
    let { rightData } = this.state
    axios.deleted(epsDel(rightData.id), {}, true).then(res => {
      this.table.deleted(rightData);
      this.setState({
        rightData: null,
      })
    })
    this.setState({
      deleteTip: false
    })
  }

  //关闭删除提示框
  closeDeleteTipModal = () => {
    this.setState({
      deleteTip: false
    })
  }

  //更新函数
  updata = (val) => {
    let { data, dataMap, rightData } = this.state;
    this.table.updata(rightData, val);
  }

  // 获取下拉框字典
  getBaseSelectTree = (typeCode) => {
    axios.get(getBaseSelectTree(typeCode)).then(res => {
      const { data } = res.data
      // 初始化字典-计划-计划类型
      if (typeCode == 'plan.define.plantype') {
        this.setState({
          planTypeData: data
        })
      }
      // 初始化字典-计划-计划级别
      if (typeCode == 'plan.task.planlevel') {
        this.setState({
          planLevelData: data
        })
      }
      // 初始化字典-任务-作业类型
      if (typeCode == 'plan.project.tasktype') {
        this.setState({
          planTaskTypeData: data
        })
      }
      // 初始化字典-项目-工期类型
      if (typeCode == 'plan.project.taskdrtntype') {
        this.setState({
          planTaskDrtnTypeData: data
        })
      }
    })
  }

  //查看曲线图
  lookEchars = () => {
    if (!this.state.rightData) {
      notification.warning(
        {
          placement: 'bottomRight',
          bottom: 50,
          duration: 2,
          message: '未选中数据',
          description: '请选择数据进行操作'
        }
      )
      return false;
    }
    axios.get(getEcharsLine(this.state.rightData.id), '', '', '', true).then(res => {
      if (Object.keys(res.data.data).length > 0) {
        this.setState({
          visible: true,
          echarsInfo: 1,
        }, () => {
          setTimeout(echarsInit, 100);
          function echarsInit() {
            var echarsDom = echarts.init(document.getElementById('echarsDom'));
            var max = Math.ceil(res.data.data.props.maxValue * 1.2 / 6) * 6
            var option = {
              title: {
                text: '挣值曲线',
              },
              tooltip: {
                trigger: 'axis'
              },
              legend: {
                data: ['ACWP', 'BCWS', 'BCWP', '当前时间']
              },
              toolbox: {
                show: true,
                feature: {
                  dataZoom: {
                    yAxisIndex: 'none'
                  },
                  dataView: { readOnly: false },
                  magicType: { type: ['line', 'bar'] },
                  restore: {},
                  saveAsImage: {}
                }
              },
              xAxis: {
                type: 'category',
                boundaryGap: false,
                data: res.data.data.categories
              },
              yAxis: {
                type: 'value',
                max: max,
                interval: max / 6,
                axisLabel: {
                  formatter: '{value} ¥'
                }
              },
              series: [
                {
                  name: 'ACWP',
                  type: 'line',
                  smooth: true,
                  data: res.data.data.series.ac
                },
                {
                  name: 'BCWS',
                  type: 'line',
                  smooth: true,
                  data: res.data.data.series.pv
                },
                {
                  name: 'BCWP',
                  type: 'line',
                  smooth: true,
                  data: res.data.data.series.ev
                },
                {
                  name: '当前时间',
                  type: 'line',
                  markLine: {
                    symbol: 'none',//去掉箭头
                    name: 'aa',
                    data: [[
                      { coord: [res.data.data.props.currentDate, 0] },
                      { coord: [res.data.data.props.currentDate, max] }
                    ]]
                  }
                },
              ]
            };
            echarsDom.clear();
            echarsDom.setOption(option);
          }
        })
      } else {
        notification.warning(
          {
            placement: 'bottomRight',
            bottom: 50,
            duration: 2,
            message: '暂无数据',
            description: '暂时没有数据'
          }
        )
      }
    }
    )
  }

  render() {
    const { intl } = this.props.currentLocale;
    const columns = [
      {
        title: "名称",
        dataIndex: 'name',
        width: 300,
        key: 'name',
        render: (text, record) => dataUtil.getIconCell(record.nodeType, text, record.taskType)
      },
      {
        title: "代码",
        dataIndex: 'code',
        width: 200,
        key: 'code',
      },
      {
        title: "责任主体",
        dataIndex: 'org',
        width: 200,
        key: 'org',
        render: text => <span>{text ? (text.name ? text.name : '') : ''}</span>
      },
      {
        title: "责任人",
        dataIndex: 'user',
        width: 100,
        key: 'user',
        render: text => <span>{text ? (text.name ? text.name : '') : ''}</span>
      },
      {
        title: "计划开始时间",
        dataIndex: 'planStartTime',
        key: 'planStartTime',
        width: 200,
        render: (text) => dataUtil.Dates().formatDateString(text)
      },
      {
        title: "计划完成时间",
        dataIndex: 'planEndTime',
        width: 200,
        key: 'planEndTime',
        render: (text) => dataUtil.Dates().formatDateString(text)
      },
      {
        title: "计划工期",
        dataIndex: 'planDrtn',
        key: 'planDrtn',
        width: 200,
        render: (text, record) => dataUtil.Numbers().fomat(dataUtil.WorkTimes().hourTo(text, this.state.projSet.drtnUnit, record.calendar), { precision: this.state.projSet.precision }) + this.state.projSet.drtnUnit
      },
      {
        title: "计划工时",
        dataIndex: 'planQty',
        key: 'planQty',
        width: 200,
        render: (text, record) => dataUtil.Numbers().fomat(dataUtil.WorkTimes().hourTo(text, this.state.projSet.timeUnit, record.calendar), { precision: this.state.projSet.precision }) + this.state.projSet.timeUnit
      },
      {
        title: "任务完成",
        dataIndex: 'completeRate',
        key: 'completeRate',
        width: 200,
        render: (text, record) => dataUtil.Numbers().fomat(text || 0, { precision: this.state.projSet.precision })
      },
      {
        title: "计划完成%",
        dataIndex: 'planCompletePct',
        key: 'planCompletePct',
        width: 200,
        render: (text, record) => dataUtil.Numbers().fomat(text || 0, { precision: this.state.projSet.precision })
      },
      {
        title: "实际完成%",
        dataIndex: 'completePct',
        key: 'completePct',
        width: 200,
        render: (text, record) => dataUtil.Numbers().fomat(text || 0, { precision: this.state.projSet.precision })
      },
      {
        title: "进度偏差率",
        dataIndex: 'svRate',
        key: 'svRate',
        width: 200,
        render: (text, record) => dataUtil.Numbers().fomat(text || 0, { precision: this.state.projSet.precision })
      },
      {
        title: "预计费用",
        dataIndex: 'budgetCost',
        key: 'budgetCost',
        width: 200,
        render: (text, record) => dataUtil.Numbers().fomat(text || 0, { precision: this.state.projSet.precision })
      },
      {
        title: "计划值(PV)",
        dataIndex: 'pv',
        key: 'pv',
        width: 200,
        render: (text, record) => dataUtil.Numbers().fomat(text || 0, { precision: this.state.projSet.precision })
      },
      {
        title: "挣值(EV)",
        dataIndex: 'ev',
        key: 'ev',
        width: 200,
        render: (text, record) => dataUtil.Numbers().fomat(text || 0, { precision: this.state.projSet.precision })
      },
      {
        title: "实际费用(AC)",
        dataIndex: 'ac',
        key: 'ac',
        width: 200,
        render: (text, record) => dataUtil.Numbers().fomat(text || 0, { precision: this.state.projSet.precision })
      },
      {
        title: "进度偏差",
        dataIndex: 'sv',
        
        key: 'sv',
        width: 200,
        render: (text, record) => dataUtil.Numbers().fomat(text || 0, { precision: this.state.projSet.precision })
      },
      // {
      //   title: "进度状态灯",
      //   dataIndex: 'scheduleStatusLight',
      //   width: 100,
      //   key: 'scheduleStatusLight',
      //   align:"center",
      //   render:(text,record)=>{
      //     if(text=="red"){
      //       return <div className={style.redLight}></div>
      //     }
      //     if(text=="green"){
      //       return <div className={style.greenLight}></div>
      //     }
      //     if(text=="yellow"){
      //       return <div className={style.yellowLight}></div>
      //     }
      //     if(text=="white"){
      //       return <div className={style.whiteLight}></div>
      //     }
      //   }


      // },
      {
        title: "费用偏差(CV)",
        dataIndex: 'cv',
        key: 'cv',
        width: 200,
        render: (text, record) => dataUtil.Numbers().fomat(text || 0, { precision: this.state.projSet.precision })
      },
      {
        title: "进度绩效指数",
        dataIndex: 'spi',
        key: 'spi',
        width: 200,
        render: (text, record) => dataUtil.Numbers().fomat(text || 0, { precision: this.state.projSet.precision })
      },
      {
        title: "费用绩效指数",
        dataIndex: 'cpi',
        key: 'cpi',
        width: 200,
        render: (text, record) => dataUtil.Numbers().fomat(text || 0, { precision: this.state.projSet.precision })
      },
      // {
      //   title: "费用状态灯",
      //   dataIndex: 'costStatusLight',
      //   width: 100,
      //   key: 'costStatusLight',
      //   align:"center",
      //   render:(text,record)=><div className={style.greenLight}></div>
      // },
      // {
      //   title: "复合状态灯",
      //   dataIndex: 'mixStatusLight',
      //   width: 100,
      //   key: 'mixStatusLight',
      //   align:"center",
      //   render:(text,record)=>{
      //     if(text=="red"){
      //       return <div className={style.redLight}></div>
      //     }
      //     if(text=="green"){
      //       return <div className={style.greenLight}></div>
      //     }
      //     if(text=="yellow"){
      //       return <div className={style.yellowLight}></div>
      //     }
      //     if(text=="white"){
      //       return <div className={style.whiteLight}></div>
      //     }
      //   }
      // },
      {
        title: "费用完成预期",
        dataIndex: 'eac',
        key: 'eac',
        width:100,
        render: (text, record) => dataUtil.Numbers().fomat(text || 0, { precision: this.state.projSet.precision })
      },
    ];

    return (
      <div>
        <TopTags see={this.lookEchars} data={this.state.rightData} search={this.search} openPlan={this.openPlan} />
        <div className={style.main}>
          <div className={style.leftMain} style={{ height: this.props.height }}>
            <div style={{ minWidth: 'calc(100vw - 60px)' }}>

              <PubTable onRef={this.onRef}
                getData={this.getPreparedTreeList}
                columns={columns}
                getRowData={this.getInfo}
                scroll={{ x: 4100, y: this.props.height-100 }}
              />
          
            </div>
          </div>
          <div className={style.rightBox} style={{ height: this.props.height }} onContextMenu={e => e.stopPropagation()}>
            <RightTags
              bizType={"task"}
              bizId={this.state.rightData ? this.state.rightData.id : null}
              projectId={this.state.selectProjectId}
              rightData={this.state.rightData ? [this.state.rightData] : null}
              data={this.state.rightData}
              getBaseSelectTree={this.getBaseSelectTree} //获取下拉框字典
              updatePlanWbs={this.updatePlanWbs}
              updatePlanTask={this.updatePlanTask}
              menuCode={this.props.menuInfo.menuCode}
              groupCode={this.state.groupCode}
              editAuth={this.state.editAuth}
              delvEditAuth={this.state.editAuth}
              fileEditAuth={this.state.editAuth}
              cprtmEditAuth={this.state.cprtmEditAuth}
            // taskEditAuth={taskEditAuth}
            />
          </div>
        </div>
        <Modal
          visible={this.state.visible}
          onCancel={this.handleCancel}
          width={'90%'}
          footer={null}
          maskClosable={false}
        >
          <div id="echarsDom" style={{ height: 450 }}></div>
          {this.state.echarsInfo == null && (
            <div className={style.noData}>
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            </div>
          )}
        </Modal>
      </div>
    )
  }
}

/* *********** connect链接state及方法 start ************* */
export default connect(state => ({
  currentLocale: state.localeProviderData
}))(TableComponent);
/* *********** connect链接state及方法 end ************* */
