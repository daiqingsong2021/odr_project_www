import React, { Component } from 'react';
import style from './style.less';
import { connect } from 'react-redux';
import intl from 'react-intl-universal';
import { Table, Row, Col, TreeSelect, Icon, InputNumber, Modal, Radio, Empty, Button, message } from 'antd';
// 引入 ECharts 主模块
import echarts from 'echarts/lib/echarts';
// 引入柱状图
import 'echarts/lib/chart/bar';
//引入扇形图
import 'echarts/lib/chart/pie';
//引入折线图
import 'echarts/lib/chart/radar';
//引入水球图
import 'echarts-liquidfill';
// 引入提示框和标题等组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend'
import 'echarts/lib/component/title';
import 'echarts/lib/component/graphic';
import axios from '../../../api/axios';
import PubTable from '../../../components/PublicTable'
import {
  dashboardEpsTree,
  getdictTree,
  projectOverview,
  completionListPie,
  progressList,
  questionData,
  meetingAnalyse,
  plandrtnList,
  milestoneList,
  questionTableData,
  meetingTableList,
  summaryAll
} from '../../../api/api';
import * as util from '../../../utils/util';

const TreeNode = TreeSelect.TreeNode;
var date = new Date;

//资源管理
class Resources extends Component {

  state = {
    eps: null,               //项目群
    epsID: '',            //项目群ID
    parentEpsId: '',            //父节点epsId
    planLevelData: null,     //计划级别数据
    planLevelID: null,         //计划级别ID
    statusLampSmall: 5,      //状态灯 绿灯
    statusLampLarge: 10,     //状态灯 红色
    projectOverviewData: null,   //项目总览
    projectOverviewID: '',   //项目总览ID
    completion: null,        //整体完成率
    yearCompletion: null,    //年度完成率
    projectProgress: null,   //项目进展
    projectProgressID: '',   //项目进展ID
    projectMilepost: null,   //项目里程碑
    projectMilepostID: '',   //项目里程碑ID
    projectQuestion: null,   //项目问题
    projectQuestionTableType: '',   //项目问题类型
    meeting: null,           //会议行动项
    mileList: null,            //项目里程碑 图标内查看详情集合
    showBoxMile: false,        //项目里程碑 图标内查看详情集合 显示状态 默认不显示
    questionTableShow: false, //项目问题弹窗显示状态，默认不显示
    meetingTableShow: false,   //会议行动项弹窗显示状态，默认不限时
    questionTable: null,       //项目问题表格数据
    meetingTable: null,        //会议行动项表格数据
    workingHours: null,       //工时
    questionCurrentPageNum: 1, //项目问题默认当前页位置
    questionTotal: 0,
    questionPageSize: 5,      //项目问题默认每页条数
    meetingCurrentPageNum: 1,  //会议行动项默认当前页位置
    meetingPageSize: 10,       //会议行动项默认每页条数
    meetingTotal: 0,
    height: document.documentElement.clientWidth || document.body.clientWidth,   //通过body宽度 按照比例来计算元素的高度
    thisYear: date.getFullYear(),
    thisMonth: date.getMonth() + 1,
    time: date.toLocaleString(),
  }

  componentDidMount() {
    this.getProEPS();           //获取项目群下拉数据
    this.getPlanLevelData();    //获取计划级别下拉数据
  }
  /**
    * 父组件即可调用子组件方法
    * @method
    */
  onRefOne = (ref) => {
    this.tableOne = ref
  }

  /**
    * 父组件即可调用子组件方法
    * @method
    */
  onRefTwo = (ref) => {
    this.tableTwo = ref
  }
  //获取项目群下拉数据 ,因下拉组件需按照指定字段，所以递归修改数据格式
  getProEPS = () => {
    axios.get(dashboardEpsTree).then(res => {
      if (res.data.data.length > 0) {
        this.setState({
          eps: res.data.data,
          epsID: res.data.data[0].id,
          parentEpsId: res.data.data[0].id
        }, () => {
          this.initGauge();           //项目总览
          this.initPie();             //完成率
          this.tableOne.getData();    //项目进展
          this.tableTwo.getData();    //项目里程碑
          this.intProjProblem();      //项目问题
          this.intMetingBall();       //会议行动项
          this.intPlandrtnList();     //获取工时
        })
      }
    })
  }

  //条件渲染 项目群、计划级别
  onChange = (status, value) => {
    if (status == 'epsID') {
      this.setState({
        epsID: value,
        parentEpsId: value
      }, () => {
        this.initGauge();           //项目总览
        this.initPie();             //整体完成率、年度完成率
        this.tableOne.getData();    //项目进展
        this.tableTwo.getData();    //项目里程碑
        this.intProjProblem();      //项目问题
        this.intMetingBall();       //会议行动项
        this.intPlandrtnList();     //获取工时
      })
    } else {
      this.setState({
        planLevelID: value
      }, () => {
        this.initGauge();           //项目总览
        this.initPie();             //整体完成率、年度完成率
        this.tableOne.getData();    //项目进展
        this.tableTwo.getData();    //项目里程碑
        this.intProjProblem();      //项目问题
        this.intMetingBall();       //会议行动项
        this.intPlandrtnList();     //获取工时
      })
    }
  }

  //获取计划级别下拉数据
  getPlanLevelData = () => {
    axios.get(getdictTree('plan.task.planlevel'), '', '', '', false).then(res => {
      if (res.data.data) {
        this.setState({
          planLevelData: res.data.data
        })
      }
    })
  }

  //设置状态灯
  setLamp = (status, value) => {
    if (status == 'small') {
      this.setState({
        statusLampSmall: value
      }, () => {
        this.initGauge();           //项目总览
        this.initPie();             //整体完成率、年度完成率
        this.tableOne.getData();    //项目进展
        this.tableTwo.getData();    //项目里程碑
        this.intProjProblem();      //项目问题
        this.intMetingBall();       //会议行动项
        this.intPlandrtnList();     //获取工时
      })
    } else {
      this.setState({
        statusLampLarge: value
      }, () => {
        this.initGauge();           //项目总览
        this.initPie();             //整体完成率、年度完成率
        this.tableOne.getData();    //项目进展
        this.tableTwo.getData();    //项目里程碑
        this.intProjProblem();      //项目问题
        this.intMetingBall();       //会议行动项
        this.intPlandrtnList();     //获取工时
      })
    }

  }

  //扇形图 项目总览
  initGauge = () => {
    axios.post(projectOverview, {
      epsId: this.state.epsID,
      planLevel: this.state.planLevelID,
      startVal: this.state.statusLampSmall,
      endVal: this.state.statusLampLarge
    }, '', '', false).then(res => {
      var semicircle = echarts.init(document.getElementById('semicircle'));
      if (Object.keys(res.data.data.series) != 0) {
        let { intl } = this.props.currentLocale
        this.setState({
          projectOverviewData: res.data.data.series
        })
        var data = {
          "series": {
            "order": res.data.data.series.stateLight,
            "total": res.data.data.series.total,
            "projType": res.data.data.series.childEps
          }
        }

        var a = 0;
        var b = 0;
        for (var i = 0; i < data.series.projType.length; i++) {
          if (data.series.projType[i].name.length > 7) {
            data.series.projType[i].name = data.series.projType[i].name.slice(0, 7) + '\n' + data.series.projType[i].name.slice(7)
          }
          a += data.series.projType[i].value;
        }
        for (var i = 0; i < data.series.order.length; i++) {
          b += data.series.order[i].value;
        }
        data.series.projType.push({ value: a, name: '', itemStyle: { normal: { color: 'rgba(0,0,0,0)' } } });
        data.series.order.push({ value: b, type: '', itemStyle: { normal: { color: 'rgba(0,0,0,0)' } } });

        var option = {
          title: {
            text: intl.get('wsd.i18n.static.proj.projectOverview'),
            left: 25,
            top: 15,
            textStyle: {
              color: '#666',
              fontSize: 16
            }
          },
          series: [
            {
              color: function (params) {
                if (params.data.type == 'r') {
                  return '#ea6e67'
                } else if (params.data.type == 'y') {
                  return '#fecc33'
                } else {
                  return '#03c9a0'
                }
              },
              name: '访问来源1',
              type: 'pie',
              hoverAnimation: false,
              startAngle: -180,
              radius: [290, 300],
              center: ['50%', '100%'],
              data: data.series.order,
              label: {
                show: false
              },
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            },
            {
              color: ['#dfe7f6'],
              name: '访问来源2',
              type: 'pie',
              startAngle: -180,
              radius: [120, 285],
              center: ['50%', '100%'],
              data: data.series.projType,
              label: {
                color: '#666',
                fontSize: 16,
                fontWeight: 'bold',
                position: 'inner'
              },
              itemStyle: {
                borderColor: '#b4b4b4',
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            },
            {
              name: '访问来源3',
              type: 'pie',
              startAngle: -180,
              radius: 120,
              center: ['50%', '100%'],
              data: [
                { value: 10, name: data.series.total[0].name, id: '' },
                { value: 10, name: '', itemStyle: { normal: { color: 'rgba(0,0,0,0)' } } }
              ],
              color: ['#f9f9fb'],
              label: {
                color: '#666',
                normal: {
                  fontSize: 16,
                  color: '#666',
                  fontWeight: 'bold',
                  position: 'inner'
                },
              }
            }
          ]
        };
        semicircle.clear();
        semicircle.setOption(option)
        var self = this
        semicircle.on('click', function (res) {
          if (res.data.id != '' && res.data.id != self.state.epsID) {
            self.setState({
              epsID: res.data.id
            }, () => {
              self.initPie();             //整体完成率、年度完成率
              self.tableOne.getData();    //项目进展
              self.tableTwo.getData();    //项目里程碑
              self.intProjProblem();      //项目问题
              self.intMetingBall();       //会议行动项
              self.intPlandrtnList();     //获取工时
            })
          }
          if (res.data.id == '') {
            self.setState({
              epsID: self.state.parentEpsId
            }, () => {
              self.initPie();             //整体完成率、年度完成率
              self.tableOne.getData();    //项目进展
              self.tableTwo.getData();    //项目里程碑
              self.intProjProblem();      //项目问题
              self.intMetingBall();       //会议行动项
              self.intPlandrtnList();     //获取工时
            })
          }
        })
      } else {
        semicircle.clear();
        this.setState({
          projectOverviewData: null
        })
      }


    })
  }

  //整体完成率 饼图
  initPie = () => {
    axios.post(completionListPie, {
      epsId: this.state.epsID,
      planLevel: this.state.planLevelID,
      startVal: this.state.statusLampSmall,
      endVal: this.state.statusLampLarge
    }, '', '', false).then(res => {
      let { intl } = this.props.currentLocale
      var pie = echarts.init(document.getElementById('pie'));
      if (Object.keys(res.data.data.series) != 0) {
        this.setState({
          completion: res.data.data.series
        })
        var option = {
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
          },
          title: [{
            text: intl.get('wsd.i18n.static.proj.overallRate'),
            x: '30%',
            y: 50,
            textStyle: {
              color: '#666',
              fontSize: 16
            },
            textAlign: 'center'
          }, {
            text: this.state.thisYear + intl.get('wsd.i18n.static.proj.overallYearRate'),

            x: '70%',
            y: 50,
            textAlign: 'center',
            textStyle: {
              color: '#666',
              fontSize: 16
            },

          }],
          legend: {
            itemWidth: 5,
            itemHeight: 5,
            right: 20,
            top: 15,
            data: [intl.get('wsd.i18n.static.proj.all'), intl.get('wsd.i18n.static.proj.planComplete'), intl.get('wsd.i18n.static.proj.actComplete')],
            selectedMode: false,
          },
          color: function (params) {
            if (params.name == intl.get('wsd.i18n.static.proj.all')) {
              return '#c5c5c5'
            } else if (params.name == intl.get('wsd.i18n.static.proj.planComplete')) {
              return '#5181d2'
            } else {
              return '#03c9a0'
            }
          },
          series: [
            {
              name: intl.get('wsd.i18n.static.proj.overallRate'),
              type: 'pie',
              radius: [60, 75],
              center: ['30%', 165],
              avoidLabelOverlap: false,
              hoverAnimation: false,
              silent: true,
              color: ['#c5c5c5', '#5181d2', '#03c9a0'],
              label: {
                normal: {
                  show: false
                }
              },
              labelLine: {
                normal: {
                  show: false
                }
              },
              data: [
                { value: res.data.data.series.whole[0].unfinish, name: intl.get('wsd.i18n.static.proj.all') },
                { value: res.data.data.series.whole[0].differ_count, name: intl.get('wsd.i18n.static.proj.planComplete') },
                { value: res.data.data.series.whole[0].remain_count, name: intl.get('wsd.i18n.static.proj.actComplete') },
              ]
            },
            {
              name: intl.get('wsd.i18n.static.proj.overallRate'),
              type: 'pie',
              radius: [61],
              center: ['30%', 165],

              silent: true,
              color: ['white'],
              avoidLabelOverlap: false,
              hoverAnimation: false,
              label: {
                normal: {
                  show: true,
                  position: 'center',
                  textStyle: {
                    fontSize: 18,
                    fontWeight: 'bold',
                    color: '#666'
                  }
                },
              },
              labelLine: {
                normal: {
                  show: false
                }
              },
              data: [
                { value: res.data.data.series.whole[0].unfinish, name: res.data.data.series.whole[0].remain_count + '%' }
              ]
            },
            {
              name: this.state.thisYear + intl.get('wsd.i18n.static.proj.overallYearRate'),
              type: 'pie',
              radius: [60, 75],
              center: ['70%', 165],
              avoidLabelOverlap: false,
              color: ['#c5c5c5', '#5181d2', '#03c9a0'],
              hoverAnimation: false,
              silent: true,
              label: {
                normal: {
                  show: false,
                  position: 'center'
                },
                emphasis: {
                  show: true,
                  textStyle: {
                    fontSize: 16,
                    fontWeight: 'bold'
                  }
                }
              },
              labelLine: {
                normal: {
                  show: false
                }
              },
              data: [
                { value: res.data.data.series.year[0].unfinish, name: intl.get('wsd.i18n.static.proj.all') },
                { value: res.data.data.series.year[0].differ_count, name: intl.get('wsd.i18n.static.proj.planComplete') },
                { value: res.data.data.series.year[0].remain_count, name: intl.get('wsd.i18n.static.proj.actComplete') }
              ]
            }, {
              name: intl.get('wsd.i18n.static.proj.overallRate'),
              type: 'pie',
              radius: [61],
              center: ['70%', 165],
              avoidLabelOverlap: false,
              hoverAnimation: false,
              silent: true,
              color: ['white'],
              label: {
                normal: {
                  show: true,
                  position: 'center',
                  textStyle: {
                    fontSize: 18,
                    fontWeight: 'bold',
                    color: '#666'
                  }
                },
              },
              labelLine: {
                normal: {
                  show: false
                }
              },
              data: [
                { value: res.data.data.series.year[0].unfinish, name: res.data.data.series.year[0].remain_count + '%' }
              ]
            },
          ]
        };
        pie.clear();
        pie.setOption(option)
      } else {
        pie.clear();
        this.setState({
          completion: null
        })
      }
    })

  }

  //项目进展
  getProjProgress = (callBack) => {
    
    if (this.state.epsID) {
      axios.post(progressList, {
        epsId: this.state.epsID,
        planLevel: this.state.planLevelID,
        startVal: this.state.statusLampSmall,
        endVal: this.state.statusLampLarge
      }, '', '', false).then(res => {
        if (Object.keys(res.data.data.series) != 0) {
          let projectProgress = res.data.data.series.projProgress
          this.setState({
            projectProgress
          },()=>{
            callBack(res.data.data.series.projProgress)
          })
        } else {
          callBack([]);
          this.setState({
            projectProgress: null
          })
        }

      })
    } else {
      callBack([]);
    }


  }

  //项目里程碑
  getProjMilepost = (callBack) => {
    if (!this.state.epsID) {
      callBack([]);
      return;
    }
    axios.post(milestoneList, {
      epsId: this.state.epsID,
      planLevel: this.state.planLevelID,
      startVal: this.state.statusLampSmall,
      endVal: this.state.statusLampLarge
    }, '', '', false).then(res => {
     
      let data = res.data.data
      this.setState({
        projectMilepost: data?data:null
      },()=>{
        callBack(res.data.data?res.data.data:[])
      })
      
    })

  }
/**
         * 获取选中集合、复选框
         * @method getListData
         * @description 获取用户列表、或者根据搜索值获取用户列表
         * @param {string} record  行数据
         * @return {array} 返回选中用户列表
         */
        getRowData = (record) => {
          this.setState({
            record
          })
        };
  //项目问题
  intProjProblem = () => {

    axios.post(questionData, {
      epsId: this.state.epsID,
      planLevel: this.state.planLevelID,
      startVal: this.state.statusLampSmall,
      endVal: this.state.statusLampLarge,
      type: 'eps'
    }, '', '', false).then(res => {
      var projProblem = echarts.init(document.getElementById('projProblem'));
      if (Object.keys(res.data.data.series) != 0) {
        this.setState({
          projectQuestion: res.data.data.series
        })
        var indicator = []
        var allData = []
        var solveCount = []
        for (var i = 0; i < res.data.data.series.projQuestion.length; i++) {
          indicator.push({
            value: res.data.data.series.projQuestion[i].type,
            name: res.data.data.series.projQuestion[i].dictName + '-' + res.data.data.series.projQuestion[i].type,
            max: res.data.data.series.projQuestion[i].max,
            id: res.data.data.series.projQuestion[i].id,
            types: res.data.data.series.projQuestion[i].type,
          })
          allData.push(res.data.data.series.projQuestion[i].allCount)
          solveCount.push(res.data.data.series.projQuestion[i].solveCount)
        }
        allData = { value: allData, name: '全部问题' }
        solveCount = { value: solveCount, name: '已解决' }
        var option = {
          title: {
            text: '项目问题',
            left: 20,
            top: 20,
            textStyle: {
              color: '#666',
              fontSize: 16
            },
          },
          color: ['#8543E0', '#00CC00'],
          tooltip: {},
          legend: {
            data: ['全部问题', '已解决'],
            right: 20,
            top: 20,
            itemHeight: 2
          },
          radar: {
            center: ['50%', '50%'],
            radius: 80,
            indicator: indicator,
            triggerEvent: true
          },
          series: [{
            label: { show: false },
            type: 'radar',
            data: [
              allData,
              solveCount
            ]
          }]
        };
        projProblem.clear();
        projProblem.setOption(option)
        var self = this
        projProblem.on('click', function (param) {
          if (param.name != '全部问题' && param.name != '已解决') {
            self.setState({
              projectQuestionTableType: param.name,
              questionCurrentPageNum: 1,
            }, () => {
              self.getQuestionTbale();
            })

          }
        })
      } else {
        projProblem.clear();
        this.setState({
          projectQuestion: null
        })
      }
    })

  }

  //跳转到项目进展模块
  jumpProject = (record) => {
    this.props.callBackBanner({
      menuName: '进展详情',
      url: "Statis/Project",
      id: 99,
      parentId: 0,
      projectId: record
    }, true);
  }

  //跳转到里程碑详情
  jumpMilestone = (record) => {
    this.props.callBackBanner({
      menuName: '里程碑详情',
      url: "Statis/Milestone",
      id: 100,
      parentId: 0,
      projectId: record
    }, true);
  }

  //会议行动项
  intMetingBall = () => {
    axios.post(meetingAnalyse, {
      epsId: this.state.epsID,
      planLevel: this.state.planLevelID,
      startVal: this.state.statusLampSmall,
      endVal: this.state.statusLampLarge,
      type: 'eps'
    }, '', '', false).then(res => {
      var meetingBall = echarts.init(document.getElementById('meetingBall'));
      if (Object.keys(res.data.data.series) != 0) {
        this.setState({
          meeting: res.data.data.series
        })

        var option = {
          title: {
            text: "会议行动项",
            left: 20,
            top: 20,
            textStyle: {
              color: '#666',
              fontSize: 16
            },
          },
          legend: {
            data: ['总数', '已完成', '未完成'],
            right: 20,
            top: 20,
            itemHeight: 5,
            itemWidth: 5,
            borderRadius: 5,
            selectedMode: false
          },
          series: [
            {
              name: '访问来源',
              type: 'pie',
              radius: ['53%', '54%'],
              center: ['50%', '60%'],
              color: ['#5182D2', '#2EBA07', '#D7D7D7'],
              label: { show: false },
              data: [
                { value: 335, name: '总数' },
                { value: 310, name: '已完成' },
                { value: 310, name: '未完成' }
              ],
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            },
            {
              radius: '55%',
              center: ['50%', '60%'],
              type: 'liquidFill',
              zlevel: 1,
              data: [{
                value: res.data.data.series.projMeeting[0].finishCount / res.data.data.series.projMeeting[0].allCount,
                name: '已完成',
                itemStyle: {
                  color: new echarts.graphic.LinearGradient(
                    1, 0, 0, 1,
                    [
                      { offset: 0, color: '#478cd2' },
                      { offset: 0.2, color: '#02cacc' },
                      { offset: 0.4, color: '#478cd2' },
                      { offset: 0.6, color: '#02cacc' },
                      { offset: 0.8, color: '#478cd2' },
                      { offset: 1, color: '#02cacc' }
                    ]
                  ),
                }
              }, { value: '0', name: '已解决' }],
              outline: {
                show: false
              },
              backgroundStyle: {
                color: '#f2f2f2',
                borderColor: '#478cd2',
                borderWidth: 1,
              },
              label: {
                normal: {
                  textStyle: {
                    color: '#333',
                    insideColor: 'yellow',
                    fontSize: 38,

                  }
                }
              }
            }
          ]
        };
        meetingBall.clear();
        meetingBall.setOption(option);
        var self = this
        meetingBall.on('click', function (param) {
          self.getMeetingTable();
          self.setState({
            meetingTableShow: true
          })
        })

      } else {
        meetingBall.clear();
        this.setState({
          meeting: null
        })
      }
    })
  }

  //获取会议行动项 table
  getMeetingTable = () => {
    axios.post(meetingTableList(this.state.meetingCurrentPageNum, this.state.meetingPageSize), {
      epsId: this.state.epsID,
      planLevel: this.state.planLevelID,
      startVal: this.state.statusLampSmall,
      endVal: this.state.statusLampLarge,
      type: 'eps'
    }, '', '', false).then(res => {
      this.setState({
        meetingTable: res.data.data,
        meetingTotal: res.data.total
      })
    })
  }
  //工时
  intPlandrtnList = () => {
    axios.post(plandrtnList, {
      epsId: this.state.epsID,
      planLevel: this.state.planLevelID,
      startVal: this.state.statusLampSmall,
      endVal: this.state.statusLampLarge,
    }, '', '', false).then(res => {
      if (Object.keys(res.data.data.series) != 0) {
        this.setState({
          workingHours: res.data.data.series.projDrtn
        })
      } else {
        this.setState({
          workingHours: null
        })
      }
    })
  }
  //关闭modal弹窗 项目问题、行动项
  closeModal = (dom) => {
    if (dom == 'questionModal') {
      this.setState({
        questionTableShow: false
      })
    } else {
      this.setState({
        meetingTableShow: false
      })
    }
  }

  //获取项目问题表格数据
  getQuestionTbale = () => {

    axios.post(questionTableData(this.state.questionCurrentPageNum, this.state.questionPageSize, this.state.projectQuestionTableType), {
      epsId: this.state.epsID,
      planLevel: this.state.planLevelID,
      startVal: this.state.statusLampSmall,
      endVal: this.state.statusLampLarge,
      type: 'eps',
    }, '', '', false).then(res => {
      if (Object.keys(res.data.data) != 0) {
        this.setState({
          questionTableShow: true,
          questionTable: res.data.data,
          questionTotal: res.data.total
        })
      } else {
        this.setState({
          questionTableShow: true,
          questionTable: null,
          questionTotal: 0
        })
      }
    })
  }

  showMileList = (data, key) => {
    this.setState({
      mileList: data,
      showBoxMile: key,
    })
  }
  closeMileList = () => {
    this.setState({
      showBoxMile: null
    })
  }
  //汇总
  summaryData = () => {
    let obj = {}

    axios.post(summaryAll, obj, true, "汇总成功", true).then(res => {
      this.getProEPS();           //获取项目群下拉数据
      this.getPlanLevelData();    //获取计划级别下拉数据
      setTimeout(hide, 0);
    })
  }
  render() {
    const { intl } = this.props.currentLocale;
    const temp = {}; // 当前重复的值,支持多列
    //合并单元格方法
    const mergeCells = (text, array, columns) => {
      let i = 0;
      if (text !== temp[columns]) {
        temp[columns] = text;
        array.forEach((item) => {
          if (item.epsName === temp[columns]) {
            i += 1;
          }
        });
      }
      return i;
    };
    const temp2 = {}; // 当前重复的值,支持多列
    const mergeCells2 = (text, array, columns) => {
      let i = 0;
      if (text !== temp2[columns]) {
        temp2[columns] = text;
        array.forEach((item) => {
          if (item.epsName === temp2[columns]) {
            i += 1;
          }
        });
      }
      return i;
    };
    const temp3 = {}; // 当前重复的值,支持多列
    const mergeCells3 = (text, array, columns) => {
      let i = 0;
      if (text !== temp2[columns]) {
        temp2[columns] = text;
        array.forEach((item) => {
          if (item.type === temp2[columns]) {
            i += 1;
          }
        });
      }
      return i;
    };
    let DomInit = (text, record, key) => {
      return (
        <div>
          {text && (
            <div>
              <Icon onClick={this.showMileList.bind(this, text.mileList, record.id + key)} type="caret-up" style={{
                marginTop: -10,
                left: '50%',
                marginLeft: '-10px',
                fontSize: 22,
                position: 'absolute',
                zIndex: 999,
                color: text.isOver ? 'rgb(78, 203, 115)' : 'rgb(255, 204, 51)'
              }} />
              {this.state.showBoxMile == record.id + key && (
                <div className={style.mileList}>
                  <Icon onClick={this.closeMileList} type="close-circle"
                    style={{ position: 'absolute', right: 0, top: 0, fontSize: 18 }} />
                  {this.state.mileList && this.state.mileList.map((item, index) => {
                    return (<p key={index}>{item.title}</p>)
                  })
                  }
                </div>
              )}
            </div>
          )}
          <div className={style.starbgBlueTd}></div>
        </div>
      )
    }
    //项目进展 表头
    const projectColumns = [{
      title: intl.get('wsd.i18n.static.proj.selectEps'),
      dataIndex: 'epsName',
      width: 300,
      align: 'center',
      render: (text, record) => {
        const obj = {
          children: <div onClick={this.jumpProject.bind(this, record)}
            style={{ wordWrap: 'break-word', wordBreak: 'break-all' }}>
            {text}
          </div>,
          props: {},
        };
        obj.props.rowSpan = mergeCells(record.epsName, this.state.projectProgress, 'epsName');
        return obj;
      }
    }, {
      title: '项目名称',
      dataIndex: 'name',
      width: 300,
      render: (text, record) => {
        return (
          <div onClick={this.jumpProject.bind(this, record)} style={{ wordWrap: 'break-word', cursor: 'pointer', wordBreak: 'break-all' }}>
            {text}
          </div>)
      }
    }, {
      title: '代码',
      dataIndex: 'code',
      width: 150,
      render: (text, record) => {
        return (
          <div onClick={this.jumpProject.bind(this, record)} style={{ wordWrap: 'break-word', cursor: 'pointer', wordBreak: 'break-all' }}>
            {text}
          </div>)
      }
    }, {
      title: '计划完成率',
      dataIndex: 'planRate',
      width: 100,
      render: (text, record) => {
        return (
          <span onClick={this.jumpProject.bind(this, record)} className={style.radioBg}><span
            className={`${style.radioBgActivty} ${style.greenBg}`}
            style={{ width: text + '%' }}>{text}% </span></span>
        )
      }
    }, {
      title: '实际完成率',
      dataIndex: 'actRate',
      width: 100,
      render: (text, record) => {
        //根据项目状态 显示实际完成率效果 1为 完成 2为未完成 3为超时
        if (record.projStatus == 'green') {
          return (<span onClick={this.jumpProject.bind(this, record)} className={style.radioBg}><span
            className={`${style.radioBgActivty} ${style.greenBg}`}
            style={{ width: text + '%' }}>{text}% </span></span>)
        } else if (record.projStatus == 'yellow') {
          return (<span onClick={this.jumpProject.bind(this, record)} className={style.radioBg}><span
            className={`${style.radioBgActivty} ${style.yellowBg}`}
            style={{ width: text + '%' }}>{text}% </span></span>)
        } else {
          return (<span onClick={this.jumpProject.bind(this, record)} className={style.radioBg}><span
            className={`${style.radioBgActivty} ${style.redBg}`}
            style={{ width: text + '%' }}>{text}% </span></span>)
        }
      }
    }, {
      title: '项目状态',
      dataIndex: 'projStatus',
      width: 100,
      align: 'center',
      render: (text, record) => {
        if (text == 'green') {
          return <Icon onClick={this.jumpProject.bind(this, record)} type="smile" style={{ fontSize: 24 }} theme="twoTone"
            twoToneColor="rgb(61, 204, 166)" />
        } else if (text == 'yellow') {
          return <Icon onClick={this.jumpProject.bind(this, record)} type="meh" theme="twoTone" style={{ fontSize: 24 }}
            twoToneColor="rgb(251, 205, 52)" />
        } else {
          return <Icon onClick={this.jumpProject.bind(this, record)} type="frown" theme="twoTone" style={{ fontSize: 24 }}
            twoToneColor="rgb(236, 122, 97)" />
        }
      }
    }, {
      title: '开始时间',
      dataIndex: 'planStartTime',
      width: 150,
    }, {
      title: '完成时间',
      dataIndex: 'planEndTime',
      width: 150,
    }, {
      title: '项目牵头单位',
      dataIndex: 'orgName',
      width: 200,
      render: (text, record) => {
        return (<div style={{ wordWrap: 'break-word', wordBreak: 'break-all' }}>
          {text}
        </div>)
      }
    }, {
      title: '责任人',
      dataIndex: 'userName',
    }];
    let year = 2019
    //项目里程碑表格 表头集合
    const milepostColumns = [{
      title: '项目',
      dataIndex: 'epsName',
      width: 150,
      render: (text, record) => {
        const obj = {
          children: <div style={{ wordWrap: 'break-word', wordBreak: 'break-all' }}>
            {text}
          </div>,
          props: {},
        };
        obj.props.rowSpan = mergeCells2(record.epsName, this.state.projectMilepost, 'epsName');
        return obj;
      }
    }, {
      title: '名称',
      dataIndex: 'name',
      width: 150,
      render: (text, record) => {
        return (
          <div onClick={this.jumpMilestone.bind(this, record)} style={{ wordWrap: 'break-word', cursor: 'pointer', wordBreak: 'break-all' }}>
            {text}
          </div>)
      }
    }, {
      title: '项目状态',
      dataIndex: 'projStatus',
      width: 80,
      align: 'center',
      render: (text, record) => {
        if (text == 'green') {
          return <Icon type="smile" style={{ fontSize: 24 }} theme="twoTone"
            twoToneColor="rgb(61, 204, 166)" />
        } else if (text == 'yellow') {
          return <Icon type="meh" theme="twoTone" style={{ fontSize: 24 }}
            twoToneColor="rgb(251, 205, 52)" />
        } else {
          return <Icon type="frown" theme="twoTone" style={{ fontSize: 24 }}
            twoToneColor="rgb(236, 122, 97)" />
        }
      }
    }, {
      title: '年度状态',
      dataIndex: 'yearStatus',
      width: 80,
      align: 'center',
      render: (text, record) => {
        if (text == 'green') {
          return <Icon type="smile" style={{ fontSize: 24 }} theme="twoTone"
            twoToneColor="rgb(61, 204, 166)" />
        } else if (text == 'yellow') {
          return <Icon type="meh" theme="twoTone" style={{ fontSize: 24 }}
            twoToneColor="rgb(251, 205, 52)" />
        } else {
          return <Icon type="frown" theme="twoTone" style={{ fontSize: 24 }}
            twoToneColor="rgb(236, 122, 97)" />
        }
      }
    }, {
      title: this.state.thisYear - 3,
      dataIndex: 'threeYear',
      align: 'center',
      width: 240,
      children: [
        {
          title: '1季度', dataIndex: 'threeYearsOne', width: 60,
          render: (text, record, index) => {
            return (
              //3年前 1季度
              //开始年份小于等于 当前年份，并且 结束年份大于等于当前年份
              record.starYear <= this.state.thisYear - 3 && record.endYear >= this.state.thisYear - 3 && (
                //判断是否是1年之内的任务
                record.starYear == record.endYear ? (
                  Math.ceil(record.startMonth / 3) == 1 && Math.ceil(record.endMonth / 3) >= 1 && (
                    DomInit(text, record, 'threeYearsOne')
                  )
                ) : (
                    //判断是否是当年开始的
                    record.starYear == this.state.thisYear - 3 ? (
                      Math.ceil(record.startMonth / 3) == 1 && (
                        DomInit(text, record, 'threeYearsOne')
                      )
                    ) : (

                        record.endYear == this.state.thisYear - 3 ?
                          (
                            Math.ceil(record.endMonth / 3) >= 1 && (
                              DomInit(text, record, 'threeYearsOne')
                            )
                          ) : (
                            DomInit(text, record, 'threeYearsOne')
                          )
                      )
                  )
              )
            )
          }
        },
        {
          title: '2季度', dataIndex: 'threeYearsTwo', width: 60,
          render: (text, record, index) => {
            return (
              //3年前 2季度
              //开始年份小于等于 当前年份，并且 结束年份大于等于当前年份
              record.starYear <= this.state.thisYear - 3 && record.endYear >= this.state.thisYear - 3 && (
                //判断是否是1年之内的任务
                record.starYear == record.endYear ? (
                  Math.ceil(record.startMonth / 3) <= 2 && Math.ceil(record.endMonth / 3) >= 2 && (
                    DomInit(text, record, 'threeYearsTwo')
                  )
                ) : (
                    //判断是否是当年开始的
                    record.starYear == this.state.thisYear - 3 ? (
                      Math.ceil(record.startMonth / 3) <= 2 && (
                        DomInit(text, record, 'threeYearsTwo')
                      )
                    ) : (
                        record.endYear == this.state.thisYear - 3 ?
                          (
                            Math.ceil(record.endMonth / 3) >= 2 && (
                              DomInit(text, record, 'threeYearsTwo')
                            )
                          ) : (
                            DomInit(text, record, 'threeYearsTwo')
                          )
                      )
                  )
              )
            )
          }
        },
        {
          title: '3季度', dataIndex: 'threeYearsThree', width: 60,
          render: (text, record, index) => {
            return (
              //3年前 3季度
              //开始年份小于等于 当前年份，并且 结束年份大于等于当前年份
              record.starYear <= this.state.thisYear - 3 && record.endYear >= this.state.thisYear - 3 && (
                //判断是否是1年之内的任务
                record.starYear == record.endYear ? (
                  Math.ceil(record.startMonth / 3) <= 3 && Math.ceil(record.endMonth / 3) >= 3 && (
                    DomInit(text, record, 'threeYearsThree')
                  )
                ) : (
                    //判断是否是当年开始的
                    record.starYear == this.state.thisYear - 3 ? (
                      Math.ceil(record.startMonth / 3) <= 3 && (
                        DomInit(text, record, 'threeYearsThree')
                      )
                    ) : (

                        record.endYear == this.state.thisYear - 3 ?
                          (
                            Math.ceil(record.endMonth / 3) >= 3 && (
                              DomInit(text, record, 'threeYearsThree')
                            )
                          ) : (
                            DomInit(text, record, 'threeYearsThree')
                          )
                      )
                  )
              )
            )
          }
        },
        {
          title: '4季度', dataIndex: 'threeYearsFour', width: 60, align: 'center',
          render: (text, record, index) => {
            return (
              //3年前 4季度
              //开始年份小于等于 当前年份，并且 结束年份大于等于当前年份
              record.starYear <= this.state.thisYear - 3 && record.endYear >= this.state.thisYear - 3 && (
                //判断是否是1年之内的任务
                record.starYear == record.endYear ? (
                  Math.ceil(record.startMonth / 3) <= 4 && Math.ceil(record.endMonth / 3) >= 4 && (
                    DomInit(text, record, 'threeYearsFour')
                  )
                ) : (
                    //判断是否是当年开始的
                    record.starYear == this.state.thisYear - 3 ? (
                      Math.ceil(record.startMonth / 3) <= 4 && (
                        DomInit(text, record, 'threeYearsFour')
                      )
                    ) : (

                        record.endYear == this.state.thisYear - 3 ?
                          (
                            Math.ceil(record.endMonth / 3) >= 4 && (
                              DomInit(text, record, 'threeYearsFour')
                            )
                          ) : (
                            DomInit(text, record, 'threeYearsFour')
                          )
                      )
                  )
              )
            )
          }
        }
      ]
    }, {
      title: this.state.thisYear - 2,
      dataIndex: 'twoYear',
      width: 240,
      children: [
        {
          title: '1季度', dataIndex: 'twoYearsOne', width: 60,
          render: (text, record, index) => {
            return (
              //2年前 1季度
              //开始年份小于等于 当前年份，并且 结束年份大于等于当前年份
              record.starYear <= this.state.thisYear - 2 && record.endYear >= this.state.thisYear - 2 && (
                //判断是否是1年之内的任务
                record.starYear == record.endYear ? (
                  Math.ceil(record.startMonth / 3) <= 1 && Math.ceil(record.endMonth / 3) >= 1 && (
                    DomInit(text, record, 'twoYearsOne')
                  )
                ) : (
                    //判断是否是当年开始的
                    record.starYear == this.state.thisYear - 2 ? (
                      Math.ceil(record.startMonth / 3) == 1 && (
                        DomInit(text, record, 'twoYearsOne')
                      )
                    ) : (
                        record.endYear == this.state.thisYear - 2 ?
                          (
                            Math.ceil(record.endMonth / 3) >= 1 && (
                              DomInit(text, record, 'twoYearsOne')
                            )
                          ) : (
                            <div>
                              {text && (
                                DomInit(text, record, 'twoYearsOne')
                              )}
                              <div className={style.starbgBlueTd}></div>
                            </div>
                          )
                      )
                  )
              )
            )
          }
        },
        {
          title: '2季度', dataIndex: 'twoYearsTwo', width: 60,
          render: (text, record, index) => {
            return (
              //2年前 2季度
              //开始年份小于等于 当前年份，并且 结束年份大于等于当前年份
              record.starYear <= this.state.thisYear - 2 && record.endYear >= this.state.thisYear - 2 && (
                //判断是否是1年之内的任务
                record.starYear == record.endYear ? (
                  Math.ceil(record.startMonth / 3) <= 2 && Math.ceil(record.endMonth / 3) >= 2 && (
                    DomInit(text, record, 'twoYearsTwo')
                  )
                ) : (
                    //判断是否是当年开始的
                    record.starYear == this.state.thisYear - 2 ? (
                      Math.ceil(record.startMonth / 3) <= 2 && (
                        DomInit(text, record, 'twoYearsTwo')
                      )
                    ) : (
                        record.endYear == this.state.thisYear - 2 ?
                          (
                            Math.ceil(record.endMonth / 3) >= 2 && (
                              DomInit(text, record, 'twoYearsTwo')
                            )
                          ) : (
                            DomInit(text, record, 'twoYearsTwo')
                          )
                      )
                  )
              )
            )
          }
        },
        {
          title: '3季度', dataIndex: 'twoYearsThree', width: 60,
          render: (text, record, index) => {
            return (
              //2年前 3季度
              //开始年份小于等于 当前年份，并且 结束年份大于等于当前年份
              record.starYear <= this.state.thisYear - 2 && record.endYear >= this.state.thisYear - 2 && (
                //判断是否是1年之内的任务
                record.starYear == record.endYear ? (
                  Math.ceil(record.startMonth / 3) <= 3 && Math.ceil(record.endMonth / 3) >= 3 && (
                    DomInit(text, record, 'twoYearsThree')
                  )
                ) : (
                    //判断是否是当年开始的
                    record.starYear == this.state.thisYear - 2 ? (
                      Math.ceil(record.startMonth / 3) <= 3 && (
                        DomInit(text, record, 'twoYearsThree')
                      )
                    ) : (

                        record.endYear == this.state.thisYear - 2 ?
                          (
                            Math.ceil(record.endMonth / 3) >= 3 && (
                              DomInit(text, record, 'twoYearsThree')
                            )
                          ) : (
                            DomInit(text, record, 'twoYearsThree')
                          )
                      )
                  )
              )
            )
          }
        },
        {
          title: '4季度', dataIndex: 'twoYearsFour', width: 60,
          render: (text, record, index) => {
            return (
              //3年前 4季度
              //开始年份小于等于 当前年份，并且 结束年份大于等于当前年份
              record.starYear <= this.state.thisYear - 2 && record.endYear >= this.state.thisYear - 2 && (
                //判断是否是1年之内的任务
                record.starYear == record.endYear ? (
                  Math.ceil(record.startMonth / 3) <= 4 && Math.ceil(record.endMonth / 3) >= 4 && (
                    DomInit(text, record, 'twoYearsFour')
                  )
                ) : (
                    //判断是否是当年开始的
                    record.starYear == this.state.thisYear - 2 ? (
                      Math.ceil(record.startMonth / 3) <= 4 && (
                        DomInit(text, record, 'twoYearsFour')
                      )
                    ) : (

                        record.endYear == this.state.thisYear - 2 ?
                          (
                            Math.ceil(record.endMonth / 3) >= 4 && (
                              DomInit(text, record, 'twoYearsFour')
                            )
                          ) : (
                            DomInit(text, record, 'twoYearsFour')
                          )
                      )
                  )
              )
            )
          }
        }
      ]
    }, {
      title: this.state.thisYear - 1,
      dataIndex: 'oneYears',

      width: 240,
      children: [
        {
          title: '1季度', dataIndex: 'oneYearsOne', width: 60,
          render: (text, record, index) => {
            return (
              //1年前 1季度
              //开始年份小于等于 当前年份，并且 结束年份大于等于当前年份
              record.starYear <= this.state.thisYear - 1 && record.endYear >= this.state.thisYear - 1 && (
                //判断是否是1年之内的任务
                record.starYear == record.endYear ? (
                  Math.ceil(record.startMonth / 3) <= 1 && Math.ceil(record.endMonth / 3) >= 1 && (
                    DomInit(text, record, 'oneYearsOne')
                  )
                ) : (
                    //判断是否是当年开始的
                    record.starYear == this.state.thisYear - 1 ? (
                      Math.ceil(record.startMonth / 3) == 1 && (
                        DomInit(text, record, 'oneYearsOne')
                      )
                    ) : (

                        record.endYear == this.state.thisYear - 1 ?
                          (
                            Math.ceil(record.endMonth / 3) >= 1 && (
                              DomInit(text, record, 'oneYearsOne')
                            )
                          ) : (
                            DomInit(text, record, 'oneYearsOne')
                          )
                      )
                  )
              )
            )
          }
        },
        {
          title: '2季度', dataIndex: 'oneYearsTwo', width: 60,
          render: (text, record, index) => {
            return (
              //1年前 2季度
              //开始年份小于等于 当前年份，并且 结束年份大于等于当前年份
              record.starYear <= this.state.thisYear - 1 && record.endYear >= this.state.thisYear - 1 && (
                //判断是否是1年之内的任务
                record.starYear == record.endYear ? (
                  Math.ceil(record.startMonth / 3) <= 2 && Math.ceil(record.endMonth / 3) >= 2 && (
                    DomInit(text, record, 'oneYearsTwo')
                  )
                ) : (
                    //判断是否是当年开始的
                    record.starYear == this.state.thisYear - 1 ? (
                      Math.ceil(record.startMonth / 3) <= 2 && (
                        DomInit(text, record, 'oneYearsTwo')
                      )
                    ) : (

                        record.endYear == this.state.thisYear - 1 ?
                          (
                            Math.ceil(record.endMonth / 3) >= 2 && (
                              DomInit(text, record, 'oneYearsTwo')
                            )
                          ) : (
                            DomInit(text, record, 'oneYearsTwo')
                          )
                      )
                  )
              )
            )
          }
        },
        {
          title: '3季度', dataIndex: 'oneYearsThree', width: 60,
          render: (text, record, index) => {
            return (
              //1年前 3季度
              //开始年份小于等于 当前年份，并且 结束年份大于等于当前年份
              record.starYear <= this.state.thisYear - 1 && record.endYear >= this.state.thisYear - 1 && (
                //判断是否是1年之内的任务
                record.starYear == record.endYear ? (
                  Math.ceil(record.startMonth / 3) <= 3 && Math.ceil(record.endMonth / 3) >= 3 && (
                    DomInit(text, record, 'oneYearsThree')
                  )
                ) : (
                    //判断是否是当年开始的
                    record.starYear == this.state.thisYear - 1 ? (
                      Math.ceil(record.startMonth / 3) <= 3 && (
                        DomInit(text, record, 'oneYearsThree')
                      )
                    ) : (

                        record.endYear == this.state.thisYear - 1 ?
                          (
                            Math.ceil(record.endMonth / 3) >= 3 && (
                              DomInit(text, record, 'oneYearsThree')
                            )
                          ) : (
                            DomInit(text, record, 'oneYearsThree')
                          )
                      )
                  )
              )
            )
          }
        },
        {
          title: '4季度', dataIndex: 'oneYearsFour', width: 60,
          render: (text, record, index) => {
            return (
              //3年前 1季度
              //开始年份小于等于 当前年份，并且 结束年份大于等于当前年份
              record.starYear <= this.state.thisYear - 1 && record.endYear >= this.state.thisYear - 1 && (
                //判断是否是1年之内的任务
                record.starYear == record.endYear ? (
                  Math.ceil(record.startMonth / 3) <= 4 && Math.ceil(record.endMonth / 3) >= 4 && (
                    DomInit(text, record, 'oneYearsFour')
                  )
                ) : (
                    //判断是否是当年开始的
                    record.starYear == this.state.thisYear - 1 ? (
                      Math.ceil(record.startMonth / 3) <= 4 && (
                        DomInit(text, record, 'oneYearsFour')
                      )
                    ) : (

                        record.endYear == this.state.thisYear - 1 ?
                          (
                            Math.ceil(record.endMonth / 3) >= 4 && (
                              DomInit(text, record, 'oneYearsFour')
                            )
                          ) : (
                            DomInit(text, record, 'oneYearsFour')
                          )
                      )
                  )
              )
            )
          }
        }
      ]
    },
    {
      title: year,
      dataIndex: 'thisYear',
      children: [
        {
          title: '1月', dataIndex: 'January', width: 60,
          render: (text, record) => {
            return (

              <div>
                <div className={this.state.thisMonth == 1 ? style.nowRed : ''}></div>
                {
                  //开始年份小于等于 当前年份，并且 结束年份大于等于当前年份
                  record.starYear <= this.state.thisYear && record.endYear >= this.state.thisYear && (
                    //判断是否是1年之内的任务
                    record.starYear == record.endYear ? (
                      record.startMonth == 1 && record.endMonth >= 1 && (
                        DomInit(text, record, 'January')
                      )
                    ) : (
                        //判断是否是当年开始的
                        record.starYear == this.state.thisYear ? (
                          record.startMonth == 1 && (
                            DomInit(text, record, 'January')
                          )
                        ) : (
                            record.endYear == this.state.thisYear ?
                              (
                                record.endMonth >= 1 && (
                                  DomInit(text, record, 'January')
                                )
                              ) : (
                                DomInit(text, record, 'January')
                              )
                          )
                      )
                  )
                }
              </div>

            )
          }
        },
        {
          title: '2月', dataIndex: 'February', width: 60,
          render: (text, record) => {
            return (

              <div>
                <div className={this.state.thisMonth == 2 ? style.nowRed : ''}></div>
                {
                  //开始年份小于等于 当前年份，并且 结束年份大于等于当前年份
                  record.starYear <= this.state.thisYear && record.endYear >= this.state.thisYear && (
                    //判断是否是1年之内的任务
                    record.starYear == record.endYear ? (
                      record.startMonth <= 2 && record.endMonth >= 2 && (
                        DomInit(text, record, 'February')
                      )
                    ) : (
                        //判断是否是当年开始的
                        record.starYear == this.state.thisYear ? (
                          record.startMonth <= 2 && (
                            DomInit(text, record, 'February')
                          )
                        ) : (
                            record.endYear == this.state.thisYear ?
                              (
                                record.endMonth >= 2 && (
                                  DomInit(text, record, 'February')
                                )
                              ) : (
                                DomInit(text, record, 'February')
                              )
                          )
                      )
                  )
                }
              </div>
            )
          }
        },
        {
          title: '3月', dataIndex: 'March', width: 60,
          render: (text, record) => {
            return (

              <div>
                <div className={this.state.thisMonth == 3 ? style.nowRed : ''}></div>
                {
                  //开始年份小于等于 当前年份，并且 结束年份大于等于当前年份
                  record.starYear <= this.state.thisYear && record.endYear >= this.state.thisYear && (
                    //判断是否是1年之内的任务
                    record.starYear == record.endYear ? (
                      record.startMonth <= 3 && record.endMonth >= 3 && (
                        DomInit(text, record, 'March')
                      )
                    ) : (
                        //判断是否是当年开始的
                        record.starYear == this.state.thisYear ? (
                          record.startMonth <= 3 && (
                            DomInit(text, record, 'March')
                          )
                        ) : (
                            record.endYear == this.state.thisYear ?
                              (
                                record.endMonth >= 3 && (
                                  DomInit(text, record, 'March')
                                )
                              ) : (
                                DomInit(text, record, 'March')
                              )
                          )
                      )
                  )
                }
              </div>
            )
          }
        },
        {
          title: '4月', dataIndex: 'April', width: 60,
          render: (text, record) => {
            return (

              <div>
                <div className={this.state.thisMonth == 4 ? style.nowRed : ''}></div>
                {
                  //开始年份小于等于 当前年份，并且 结束年份大于等于当前年份
                  record.starYear <= this.state.thisYear && record.endYear >= this.state.thisYear && (
                    //判断是否是1年之内的任务
                    record.starYear == record.endYear ? (
                      record.startMonth <= 4 && record.endMonth >= 4 && (
                        DomInit(text, record, 'April')
                      )
                    ) : (
                        //判断是否是当年开始的
                        record.starYear == this.state.thisYear ? (
                          record.startMonth <= 4 && (
                            DomInit(text, record, 'April')
                          )
                        ) : (
                            record.endYear == this.state.thisYear ?
                              (
                                record.endMonth >= 4 && (
                                  DomInit(text, record, 'April')
                                )
                              ) : (
                                DomInit(text, record, 'April')
                              )
                          )
                      )
                  )
                }
              </div>

            )
          }
        },
        {
          title: '5月', dataIndex: 'May', width: 60,
          render: (text, record) => {
            return (

              <div>
                <div className={this.state.thisMonth == 5 ? style.nowRed : ''}></div>
                {
                  //开始年份小于等于 当前年份，并且 结束年份大于等于当前年份
                  record.starYear <= this.state.thisYear && record.endYear >= this.state.thisYear && (
                    //判断是否是1年之内的任务
                    record.starYear == record.endYear ? (
                      record.startMonth <= 5 && record.endMonth >= 5 && (
                        DomInit(text, record, 'May')
                      )
                    ) : (
                        //判断是否是当年开始的
                        record.starYear == this.state.thisYear ? (
                          record.startMonth <= 5 && (
                            DomInit(text, record, 'May')
                          )
                        ) : (
                            record.endYear == this.state.thisYear ?
                              (
                                record.endMonth >= 5 && (
                                  DomInit(text, record, 'May')
                                )
                              ) : (
                                DomInit(text, record, 'May')
                              )
                          )
                      )
                  )
                }
              </div>


            )
          }
        },
        {
          title: '6月', dataIndex: 'June', width: 60,
          render: (text, record) => {
            return (
              <div>
                <div className={this.state.thisMonth == 6 ? style.nowRed : ''}></div>
                {
                  //开始年份小于等于 当前年份，并且 结束年份大于等于当前年份
                  record.starYear <= this.state.thisYear && record.endYear >= this.state.thisYear && (
                    //判断是否是1年之内的任务
                    record.starYear == record.endYear ? (
                      record.startMonth <= 6 && record.endMonth >= 6 && (
                        DomInit(text, record, 'June')
                      )
                    ) : (
                        //判断是否是当年开始的
                        record.starYear == this.state.thisYear ? (
                          record.startMonth <= 6 && (
                            DomInit(text, record, 'June')
                          )
                        ) : (
                            record.endYear == this.state.thisYear ?
                              (
                                record.endMonth >= 6 && (
                                  DomInit(text, record, 'June')
                                )
                              ) : (
                                DomInit(text, record, 'June')
                              )
                          )
                      )
                  )
                }
              </div>
            )
          }
        },
        {
          title: '7月', dataIndex: 'July', width: 60,
          render: (text, record) => {
            return (
              <div>
                <div className={this.state.thisMonth == 7 ? style.nowRed : ''}></div>
                {
                  //开始年份小于等于 当前年份，并且 结束年份大于等于当前年份
                  record.starYear <= this.state.thisYear && record.endYear >= this.state.thisYear && (
                    //判断是否是1年之内的任务
                    record.starYear == record.endYear ? (
                      record.startMonth <= 7 && record.endMonth >= 7 && (
                        DomInit(text, record, 'July')
                      )
                    ) : (
                        //判断是否是当年开始的
                        record.starYear == this.state.thisYear ? (
                          record.startMonth <= 7 && (
                            DomInit(text, record, 'July')
                          )
                        ) : (
                            record.endYear == this.state.thisYear ?
                              (
                                record.endMonth >= 7 && (
                                  DomInit(text, record, 'July')
                                )
                              ) : (
                                DomInit(text, record, 'July')
                              )
                          )
                      )
                  )
                }
              </div>
            )
          }
        },
        {
          title: '8月', dataIndex: 'August', width: 60,
          render: (text, record) => {
            return (
              <div>
                <div className={this.state.thisMonth == 8 ? style.nowRed : ''}></div>
                {
                  //开始年份小于等于 当前年份，并且 结束年份大于等于当前年份
                  record.starYear <= this.state.thisYear && record.endYear >= this.state.thisYear && (
                    //判断是否是1年之内的任务
                    record.starYear == record.endYear ? (
                      record.startMonth <= 8 && record.endMonth >= 8 && (
                        DomInit(text, record, 'August')
                      )
                    ) : (
                        //判断是否是当年开始的
                        record.starYear == this.state.thisYear ? (
                          record.startMonth <= 8 && (
                            DomInit(text, record, 'August')
                          )
                        ) : (
                            record.endYear == this.state.thisYear ?
                              (
                                record.endMonth >= 8 && (
                                  DomInit(text, record, 'August')
                                )
                              ) : (
                                DomInit(text, record, 'August')
                              )
                          )
                      )
                  )
                }
              </div>
            )
          }
        },
        {
          title: '9月', dataIndex: 'September', width: 60,
          render: (text, record) => {
            return (

              <div>
                <div className={this.state.thisMonth == 9 ? style.nowRed : ''}></div>
                {
                  //开始年份小于等于 当前年份，并且 结束年份大于等于当前年份
                  record.starYear <= this.state.thisYear && record.endYear >= this.state.thisYear && (
                    //判断是否是1年之内的任务
                    record.starYear == record.endYear ? (
                      record.startMonth <= 9 && record.endMonth >= 9 && (
                        DomInit(text, record, 'September')
                      )
                    ) : (
                        //判断是否是当年开始的
                        record.starYear == this.state.thisYear ? (
                          record.startMonth <= 9 && (
                            DomInit(text, record, 'September')
                          )
                        ) : (
                            record.endYear == this.state.thisYear ?
                              (
                                record.endMonth >= 9 && (
                                  DomInit(text, record, 'September')
                                )
                              ) : (
                                DomInit(text, record, 'September')
                              )
                          )
                      )
                  )
                }
              </div>


            )
          }
        },
        {
          title: '10月', dataIndex: 'October', width: 60,
          render: (text, record) => {
            return (
              <div>
                <div className={this.state.thisMonth == 10 ? style.nowRed : ''}></div>
                {
                  //开始年份小于等于 当前年份，并且 结束年份大于等于当前年份
                  record.starYear <= this.state.thisYear && record.endYear >= this.state.thisYear && (
                    //判断是否是1年之内的任务
                    record.starYear == record.endYear ? (
                      record.startMonth <= 10 && record.endMonth >= 10 && (
                        DomInit(text, record, 'October')
                      )
                    ) : (
                        //判断是否是当年开始的
                        record.starYear == this.state.thisYear ? (
                          record.startMonth <= 10 && (
                            DomInit(text, record, 'October')
                          )
                        ) : (
                            record.endYear == this.state.thisYear ?
                              (
                                record.endMonth >= 10 && (
                                  DomInit(text, record, 'October')
                                )
                              ) : (
                                DomInit(text, record, 'October')
                              )
                          )
                      )
                  )
                }
              </div>
            )
          }
        },
        {
          title: '11月', dataIndex: 'November', width: 60,
          render: (text, record) => {
            return (

              <div>
                <div className={this.state.thisMonth == 11 ? style.nowRed : ''}></div>
                {
                  //开始年份小于等于 当前年份，并且 结束年份大于等于当前年份
                  record.starYear <= this.state.thisYear && record.endYear >= this.state.thisYear && (
                    //判断是否是1年之内的任务
                    record.starYear == record.endYear ? (
                      record.startMonth <= 11 && record.endMonth >= 11 && (
                        DomInit(text, record, 'November')
                      )
                    ) : (
                        //判断是否是当年开始的
                        record.starYear == this.state.thisYear ? (
                          record.startMonth <= 11 && (
                            DomInit(text, record, 'November')
                          )
                        ) : (
                            record.endYear == this.state.thisYear ?
                              (
                                record.endMonth >= 11 && (
                                  DomInit(text, record, 'November')
                                )
                              ) : (
                                DomInit(text, record, 'November')
                              )
                          )
                      )
                  )
                }
              </div>
            )
          }
        },
        {
          title: '12月', dataIndex: 'December', width: 60,
          render: (text, record) => {
            return (

              <div>
                <div className={this.state.thisMonth == 12 ? style.nowRed : ''}></div>
                {
                  //开始年份小于等于 当前年份，并且 结束年份大于等于当前年份
                  record.starYear <= this.state.thisYear && record.endYear >= this.state.thisYear && (
                    //判断是否是1年之内的任务
                    record.starYear == record.endYear ? (
                      record.startMonth <= 12 && record.endMonth >= 12 && (
                        DomInit(text, record, 'December')
                      )
                    ) : (
                        //判断是否是当年开始的
                        record.starYear == this.state.thisYear ? (
                          record.startMonth <= 12 && (
                            DomInit(text, record, 'December')
                          )
                        ) : (
                            record.endYear == this.state.thisYear ?
                              (
                                record.endMonth >= 12 && (
                                  DomInit(text, record, 'December')
                                )
                              ) : (
                                DomInit(text, record, 'December')
                              )
                          )
                      )
                  )
                }
              </div>
            )
          }
        }
      ]
    },
    {
      title: this.state.thisYear + 1,
      dataIndex: 'lastYear',
      width: 240,
      children: [
        {
          title: '1季度', dataIndex: 'lastYearsOne', width: 60,
          render: (text, record, index) => {
            return (
              //3年前 1季度
              //开始年份小于等于 当前年份，并且 结束年份大于等于当前年份
              record.starYear <= this.state.thisYear + 1 && record.endYear >= this.state.thisYear + 1 && (
                //判断是否是1年之内的任务
                record.starYear == record.endYear ? (
                  Math.ceil(record.startMonth / 3) <= 1 && Math.ceil(record.endMonth / 3) >= 1 && (
                    DomInit(text, record, 'lastYearsOne')
                  )
                ) : (
                    //判断是否是当年开始的
                    record.starYear == this.state.thisYear + 1 ? (
                      Math.ceil(record.startMonth / 3) <= 1 && (
                        DomInit(text, record, 'lastYearsOne')
                      )
                    ) : (

                        record.endYear == this.state.thisYear + 1 ?
                          (
                            Math.ceil(record.endMonth / 3) >= 1 && (
                              DomInit(text, record, 'lastYearsOne')
                            )
                          ) : (
                            DomInit(text, record, 'lastYearsOne')
                          )
                      )
                  )
              )
            )
          }
        },
        {
          title: '2季度', dataIndex: 'lastYearsTwo', width: 60,
          render: (text, record, index) => {
            return (
              //开始年份小于等于 当前年份，并且 结束年份大于等于当前年份
              record.starYear <= this.state.thisYear + 1 && record.endYear >= this.state.thisYear + 1 && (
                //判断是否是1年之内的任务
                record.starYear == record.endYear ? (
                  Math.ceil(record.startMonth / 3) <= 2 && Math.ceil(record.endMonth / 3) >= 2 && (
                    DomInit(text, record, 'lastYearsTwo')
                  )
                ) : (
                    //判断是否是当年开始的
                    record.starYear == this.state.thisYear + 1 ? (
                      Math.ceil(record.startMonth / 3) <= 2 && (
                        DomInit(text, record, 'lastYearsTwo')
                      )
                    ) : (

                        record.endYear == this.state.thisYear + 1 ?
                          (
                            Math.ceil(record.endMonth / 3) >= 2 && (
                              DomInit(text, record, 'lastYearsTwo')
                            )
                          ) : (
                            DomInit(text, record, 'lastYearsTwo')
                          )
                      )
                  )
              )
            )
          }
        },
        {
          title: '3季度', dataIndex: 'lastYearsThree', width: 60,
          render: (text, record, index) => {
            return (
              //3年前 1季度
              //开始年份小于等于 当前年份，并且 结束年份大于等于当前年份
              record.starYear <= this.state.thisYear + 1 && record.endYear >= this.state.thisYear + 1 && (
                //判断是否是1年之内的任务
                record.starYear == record.endYear ? (
                  Math.ceil(record.startMonth / 3) <= 3 && Math.ceil(record.endMonth / 3) >= 3 && (
                    DomInit(text, record, 'lastYearsThree')
                  )
                ) : (
                    //判断是否是当年开始的
                    record.starYear == this.state.thisYear + 1 ? (
                      Math.ceil(record.startMonth / 3) <= 1 && (
                        DomInit(text, record, 'lastYearsThree')
                      )
                    ) : (

                        record.endYear == this.state.thisYear + 1 ?
                          (
                            Math.ceil(record.endMonth / 3) >= 4 && (
                              DomInit(text, record, 'lastYearsThree')
                            )
                          ) : (
                            DomInit(text, record, 'lastYearsThree')
                          )
                      )
                  )
              )
            )
          }
        },
        {
          title: '4季度', dataIndex: 'lastYearsFour', width: 60,
          render: (text, record, index) => {
            return (
              //3年前 1季度
              //开始年份小于等于 当前年份，并且 结束年份大于等于当前年份
              record.starYear <= this.state.thisYear + 1 && record.endYear >= this.state.thisYear + 1 && (
                //判断是否是1年之内的任务
                record.starYear == record.endYear ? (
                  Math.ceil(record.startMonth / 3) <= 4 && Math.ceil(record.endMonth / 3) >= 4 && (
                    DomInit(text, record, 'lastYearsFour')
                  )
                ) : (
                    //判断是否是当年开始的
                    record.starYear == this.state.thisYear + 1 ? (
                      Math.ceil(record.startMonth / 3) <= 1 && (
                        DomInit(text, record, 'lastYearsFour')
                      )
                    ) : (

                        record.endYear == this.state.thisYear + 1 ?
                          (
                            Math.ceil(record.endMonth / 3) >= 4 && (
                              DomInit(text, record, 'lastYearsFour')
                            )
                          ) : (
                            DomInit(text, record, 'lastYearsFour')
                          )
                      )
                  )
              )
            )
          }
        }
      ]
    }
    ];

    //项目问题表头
    const questionColumns = [{
      title: '类型',
      dataIndex: 'type',
      width: '15%',
      align: 'center',
      render: (text, record) => {
        const obj = {
          children: <div style={{ wordWrap: 'break-word', wordBreak: 'break-all' }}>
            {text}
          </div>,
          props: {},
        };
        obj.props.rowSpan = mergeCells3(record.type, this.state.questionTable, 'type');
        return obj;
      }
    }, {
      title: '标题',
      dataIndex: 'title',
      width: '20%',
      render: (text, record) => {
        return (
          <div style={{ wordWrap: 'break-word', wordBreak: 'break-all' }}>
            {text}
          </div>)
      }
    }, {
      title: '责任人',
      dataIndex: 'userName',
      width: '5%',
      render: (text, record) => {
        return (
          <div style={{ wordWrap: 'break-word', wordBreak: 'break-all' }}>
            {text}
          </div>)
      }
    }, {
      title: '优先级',
      dataIndex: 'priority',
      width: '10%',
      render: (text, record) => {
        return (
          <div style={{ wordWrap: 'break-word', wordBreak: 'break-all' }}>
            {text}
          </div>
        )
      }
    }, {
      title: '问题说明',
      dataIndex: 'remark',
      width: '10%',
      render: (text, record) => {
        return (
          <div style={{ wordWrap: 'break-word', wordBreak: 'break-all' }}>
            {text}
          </div>
        )
      }
    }, {
      title: '要求',
      dataIndex: 'handle',
      width: '6%',
      render: (text, record) => {
        return (
          <div style={{ wordWrap: 'break-word', wordBreak: 'break-all' }}>
            {text}
          </div>
        )
      }
    }, {
      title: '状态',
      dataIndex: 'status',
      width: '6%',
      render: (text, record) => {
        return (
          text == '已处理' ? (
            <Radio checked={true}>已处理</Radio>
          ) : (
              <Radio checked={false}>未处理</Radio>
            )
        )
      }
    }];

    //会议行动项表头
    const mettingColumns = [{
      title: '名称',
      dataIndex: 'projectName',
      width: '15%',
      align: 'center',
      render: (text, record) => {
        return (
          <div style={{ wordWrap: 'break-word', wordBreak: 'break-all' }}>
            {text}
          </div>
        )
      }
    }, {
      title: '计划开始时间',
      dataIndex: 'planStartTime',
      width: '20%',
      render: (text, record) => {
        return (
          <div style={{ wordWrap: 'break-word', wordBreak: 'break-all' }}>
            {text}
          </div>)
      }
    }, {
      title: '计划完成时间',
      dataIndex: 'planEndTime',
      width: '5%',
      render: (text, record) => {
        return (
          <div style={{ wordWrap: 'break-word', wordBreak: 'break-all' }}>
            {text}
          </div>)
      }
    }, {
      title: '责任主体',
      dataIndex: 'orgName',
      width: '10%',
      render: (text, record) => {
        return (
          <div style={{ wordWrap: 'break-word', wordBreak: 'break-all' }}>
            {text}
          </div>
        )
      }
    }, {
      title: '责任人',
      dataIndex: 'userName',
      width: '10%',
      render: (text, record) => {
        return (
          <div style={{ wordWrap: 'break-word', wordBreak: 'break-all' }}>
            {text}
          </div>
        )
      }
    }, {
      title: '进展进度',
      dataIndex: 'complete',
      width: '6%',
      render: (text, record) => {
        //根据项目状态 显示实际完成率效果 1为 完成 2为未完成 3为超时
        if (record.statusName == '按期进行中') {
          return (text && <span className={style.radioBg}><span
            className={`${style.radioBgActivty} ${style.aqjx}`}
            style={{ width: text + '%' }}>{text}% </span></span>)
        } else if (record.statusName == '按期完成') {
          return (text && <span className={style.radioBg}><span
            className={`${style.radioBgActivty} ${style.aqwc}`}
            style={{ width: text + '%' }}>{text}% </span></span>)
        } else if (record.statusName == '拖期完成') {
          return (text && <span className={style.radioBg}><span
            className={`${style.radioBgActivty} ${style.tqwc}`}
            style={{ width: text + '%' }}>{text}% </span></span>)
        } else if (record.statusName == '拖期未完成') {
          return (text && <span className={style.radioBg}><span
            className={`${style.radioBgActivty} ${style.tqwwc}`}
            style={{ width: text + '%' }}>{text}% </span></span>)
        } else {
          return (text && <span className={style.radioBg}><span
            className={`${style.radioBgActivty} ${style.wcs}`}
            style={{ width: text + '%' }}>{text}% </span></span>)
        }
      }
    }, {
      title: '进展状态',
      dataIndex: 'statusName',
      width: '10%',
      render: (text, record) => {
        return (
          <div style={{ wordWrap: 'break-word', wordBreak: 'break-all' }}>
            {text}
          </div>
        )
      }
    },];

    //分页调用
    let pagination = (data, current, pageSize, type, total) => {
      return {
        total: total,
        current: current ? current : 1,
        pageSize: pageSize ? pageSize : 10,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: total => `总共${total}条`,
        onShowSizeChange: (current, size) => {
          if (type == 'question') {
            this.setState({
              questionPageSize: size,
              questionCurrentPageNum: current
            }, () => {
              //获取问题详情
              this.getQuestionTbale()
            })
          } else {
            this.setState({
              meetingPageSize: size,
              meetingCurrentPageNum: current
            }, () => {
              //获取项目行动项详情
              this.getMeetingTable()
            })
          }

        },
        onChange: (page, pageSize) => {
          if (type == 'question') {
            this.setState({
              questionPageSize: pageSize,
              questionCurrentPageNum: page
            }, () => {
              //获取问题详情
              this.getQuestionTbale()
            })
          } else {
            this.setState({
              meetingPageSize: pageSize,
              meetingCurrentPageNum: page
            }, () => {
              //获取项目行动项详情
              this.getMeetingTable()
            })
          }
        }
      }

    }

    return (
      <div>
        <div className={style.main}>
          <div className={style.leftMain} style={{ height: this.props.height }}>
            <Row gutter={16} type="flex" className={style.selectBox}>
              <Col span={4} id='area'>
                {/*项目群下拉*/}
                <label>{intl.get('wsd.i18n.static.proj.selectEps')} </label>
                <TreeSelect
                  style={{ width: '50%' }}
                  size={'small'}
                  treeData={this.state.eps}
                  value={this.state.parentEpsId}
                  dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
                  placeholder="选择项目"
                  getPopupContainer={() => document.getElementById('area')}
                  onChange={this.onChange.bind(this, 'epsID')}
                >
                </TreeSelect>
              </Col>
              {/*<Col span={4}>*/}
              {/*/!*计划级别下拉*!/*/}
              {/*<label>{intl.get('wsd.i18n.static.proj.planLevel')} </label>*/}
              {/*<TreeSelect*/}
              {/*style={{width: '50%'}}*/}
              {/*size={'small'}*/}
              {/*allowClear*/}
              {/*treeData={this.state.planLevelData}*/}
              {/*dropdownStyle={{maxHeight: 300, overflow: 'auto'}}*/}
              {/*placeholder="全部"*/}
              {/*treeDefaultExpandAll*/}
              {/*onChange={this.onChange.bind(this, 'planLevelID')}*/}
              {/*>*/}
              {/*</TreeSelect>*/}
              {/*</Col>*/}
              <Col span={7}>
                <div className={style.statusLight}>
                  {/*状态灯*/}
                  {intl.get('wsd.i18n.static.proj.statusLight')} <i className={style.green}></i>
                  <InputNumber style={{ width: 60 }}
                    defaultValue={this.state.statusLampSmall}
                    min={0}
                    max={this.state.statusLampLarge - 1}
                    size={'small'}
                    formatter={value => `≤${value}%`}
                    onChange={this.setLamp.bind(this, 'small')}
                  />
                  <i className={style.yellow}></i>{this.state.statusLampSmall}%~{this.state.statusLampLarge}%
                  <i className={style.red}></i>
                  <InputNumber
                    style={{ width: 60 }}
                    defaultValue={this.state.statusLampLarge}
                    min={this.state.statusLampSmall + 1}
                    max={100}
                    size={'small'}
                    formatter={value => `≥${value}%`}
                    onChange={this.setLamp.bind(this, 'large')}
                  />
                  <Button style={{ marginLeft: 10 }} size="small" onClick={this.summaryData}>汇总</Button>
                </div>
              </Col>
              <Col span={9}>
                {/*状态更新时间*/}
                <div style={{ textAlign: 'right' }}>{intl.get('wsd.i18n.static.proj.updateTime')} ：{this.state.time}</div>
              </Col>
            </Row>
            <Row type="flex" justify="space-around" gutter={16} row-flex='center' style={{ textAlign: 'center' }}>
              {/*第一排左侧 半圆图 项目总览*/}
              <Col span={15}>
                <Row>
                  {/*项目总览 半圆图*/}
                  <Col span={24}>
                    <div className={style.ber}>
                      <div id="semicircle" style={{ height: 320 }}></div>
                      {this.state.projectOverviewData == null && (
                        <div className={style.noData}>
                          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                        </div>
                      )}
                    </div>
                  </Col>
                </Row>
              </Col>
              {/*第一排右侧 双圆图 完成率*/}
              <Col span={9}>
                <Row>
                  <Col span={24}>
                    <div className={style.ber} style={{ marginTop: 16 }}>
                      <div id="pie" style={{ height: 320 }}>
                        {this.state.completion != null && (
                          <div>
                            <div className={style.pieDescL}>
                              <p>计划完成:{this.state.completion.whole[0].plan}%</p>
                              <p>实际完成:{this.state.completion.whole[0].act}%</p>
                            </div>
                            <div className={style.pieDescR}>
                              <p>计划完成:{this.state.completion.year[0].plan}%</p>
                              <p>实际完成:{this.state.completion.year[0].act}%</p>
                            </div>
                          </div>

                        )}
                      </div>

                      {this.state.completion == null && (
                        <div className={style.noData}>
                          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                        </div>
                      )}
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <div className={style.ber}>
                  <Row gutter={16} type={'flex'} justify={'space-between'}>
                    <Col span={12}> <p className={style.title}>项目进展</p></Col>
                    {/*<Col span={12} className={style.milepostSpan}>*/}
                    {/*<span><Icon  type="smile" style={{fontSize: 16,marginRight: 5}} theme="twoTone"*/}
                    {/*twoToneColor="rgb(61, 204, 166)"/>正常</span>*/}
                    {/*<span><Icon type="meh" theme="twoTone" style={{fontSize: 16,marginRight: 5}}*/}
                    {/*twoToneColor="rgb(251, 205, 52)"/>预警</span>*/}
                    {/*<span><Icon type="frown" theme="twoTone" style={{fontSize: 16,marginRight: 5}}*/}
                    {/*twoToneColor="rgb(236, 122, 97)"/>超期</span>*/}
                    {/*</Col>*/}
                  </Row>

                  <PubTable onRef={this.onRefOne}
                    getData={this.getProjProgress}
                    bordered={true}
                    columns={projectColumns}
                    scroll={{ x: 1600, y: 320 }}
                    getRowData={this.getRowData}
                  />

                </div>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <div className={style.ber}>

                  <Row gutter={16} type={'flex'} justify={'space-between'}>
                    <Col span={12}><p className={style.title}>项目里程碑</p></Col>
                    <Col span={12} className={style.milepostSpan}>
                      {/*<Col span={12} className={style.milepostSpan}>*/}
                      {/*<span><Icon  type="smile" style={{fontSize: 16,marginRight: 5}} theme="twoTone"*/}
                      {/*twoToneColor="rgb(61, 204, 166)"/>正常</span>*/}
                      {/*<span><Icon type="meh" theme="twoTone" style={{fontSize: 16,marginRight: 5}}*/}
                      {/*twoToneColor="rgb(251, 205, 52)"/>预警</span>*/}
                      {/*<span><Icon type="frown" theme="twoTone" style={{fontSize: 16,marginRight: 5}}*/}
                      {/*twoToneColor="rgb(236, 122, 97)"/>超期</span>*/}
                      {/*</Col>*/}
                      <span><Icon type="caret-up"
                        style={{ color: '#4ecb73', fontSize: 16, marginRight: 5 }} />里程碑已完成</span>
                      <span><Icon type="caret-up"
                        style={{ color: '#ffcc33', fontSize: 16, marginRight: 5 }} />里程碑未完成</span>
                      <span><Icon type="minus" style={{ color: '#f53540', fontSize: 16, marginRight: 5 }} />当前时间</span>
                    </Col>
                  </Row>

                  <PubTable onRef={this.onRefTwo}
                    getData={this.getProjMilepost}
                    bordered={true}
                    columns={milepostColumns}
                    getRowData={this.getRowData}
                    scroll={{ x: 2140, y: 320 }}
                  />
                
                </div>
              </Col>
            </Row>
            <Row gutter={16} >
              <Col span={8}>
                {/*项目问题*/}
                <div className={style.ber}>
                  <div id="projProblem" style={{ height: 320 }}></div>
                  {this.state.projectQuestion == null && (
                    <div className={style.noData}>
                      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    </div>
                  )}

                </div>
              </Col>
              <Col span={8}>
                {/*会议行动项*/}
                <div className={style.ber}>
                  {this.state.meeting != null && (
                    <div className={style.mettingTagBox}>
                      <p><i
                        className={style.blueTag}></i>总数:{this.state.meeting ? this.state.meeting.projMeeting[0].allCount : 0}
                      </p>
                      <p><i
                        className={style.greeTag}></i>已完成:{this.state.meeting ? this.state.meeting.projMeeting[0].finishCount : 0}
                      </p>
                      <p><i
                        className={style.blackTag}></i>未完成:{this.state.meeting ? this.state.meeting.projMeeting[0].unfinishCount : 0}
                      </p>
                    </div>
                  )}
                  <div id="meetingBall" style={{ height: 320 }}></div>
                  {this.state.meeting == null && (
                    <div className={style.noData}>
                      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    </div>
                  )}
                </div>
              </Col>
              <Col span={8}>
                <div className={style.ber}>
                  <div className={style.timeBox} style={{ height: 320 }}>

                    {this.state.workingHours != null ? (
                      <div>
                        <Row type={'flex'} justify="space-between">
                          <Col span={4} className={style.timeTitle}>工时</Col>
                          <Col>
                            <span className={style.timeLegend}><i className={style.greeTag}></i>计划工时</span>
                            <span className={style.timeLegend}><i className={style.blueTag}></i>实际工时</span>
                          </Col>
                        </Row>
                        <Row gutter={16}>
                          <Col span={24}>
                            <div className={style.times}>计划工时</div>
                            <div>{this.state.workingHours ? this.state.workingHours[0].planDrtn : 0}</div>
                            <div className={style.timeDiv}>
                              <span className={style.timeBg}
                                style={{ width: this.state.workingHours ? (this.state.workingHours[0].planDrtn / this.state.workingHours[0].allDrtn) * 100 + '%' : 0 }}></span>
                              <i className={style.timeBorder}
                                style={{ left: this.state.workingHours ? (this.state.workingHours[0].actDrtn / this.state.workingHours[0].allDrtn) * 100 + '%' : 0 }}></i>
                              <span style={{
                                top: 25,
                                position: 'absolute',
                                display: 'inline-block',
                                left: this.state.workingHours ? (this.state.workingHours[0].actDrtn / this.state.workingHours[0].allDrtn) * 100 + '%' : 0
                              }}>
                                {this.state.workingHours ? this.state.workingHours[0].actDrtn : 0}
                              </span>
                            </div>
                          </Col>
                        </Row>
                      </div>
                    ) : (
                        this.state.workingHours == null && (
                          <div className={style.noData}>
                            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                          </div>
                        )
                      )}

                  </div>
                </div>
              </Col>
            </Row>
            {/*项目问题table弹窗*/}
            <Modal width={'99%'}
              visible={this.state.questionTableShow}
              footer={null}
              maskClosable={false}
              onCancel={this.closeModal.bind(this, 'questionModal')}
            >
              <h4>项目问题</h4>
              <Table className={style.table} size={'small'} columns={questionColumns}
                rowKey={record => record.id}
                dataSource={this.state.questionTable}
                pagination={pagination(this.state.questionTable, this.state.questionCurrentPageNum, this.state.questionPageSize, 'question', this.state.questionTotal)}
                bordered
              />
            </Modal>
            {/*会议行动项table弹窗*/}
            <Modal width={'99%'}
              visible={this.state.meetingTableShow}
              footer={null}
              maskClosable={false}
              rowKey={record => record.id}
              onCancel={this.closeModal.bind(this, 'meetingModal')}
            >
              <h4>会议行动项</h4>
              <Table className={style.table} size={'small'} columns={mettingColumns}
                dataSource={this.state.meetingTable}
                pagination={pagination(this.state.meetingTable, this.state.meetingCurrentPageNum, this.state.meetingPageSize, 'metting', this.state.meetingTotal)}
                bordered
                rowKey={record => record.id}

              />
            </Modal>
          </div>
        </div>
      </div>
    )
  }
}


/* *********** connect链接state及方法 start ************* */
export default connect(state => ({
  currentLocale: state.localeProviderData
}))(Resources);
/* *********** connect链接state及方法 end ************* */
