import React, { Component } from 'react'
import style from './style.less'
import { Table, Row, Col, TreeSelect, Icon, DatePicker, Modal, Select, Empty,Radio  } from 'antd';
// 引入 ECharts 主模块
import echarts from 'echarts/lib/echarts';
// 引入柱状图
import 'echarts/lib/chart/bar';
//引入扇形图
import 'echarts/lib/chart/pie'
//引入折线图
import 'echarts/lib/chart/radar'
//引入水球图
import 'echarts-liquidfill'
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend'
import 'echarts/lib/component/title';
import 'echarts/lib/component/graphic'
import { connect } from 'react-redux'
import axios from '../../../api/axios'
import { projProgressInfo, projYearCount, getdictTree, projgressList, defineOrgTree, meetingAnalyse, questionData, questionTableData, meetingTableList } from '../../../api/api'
import * as util from '../../../utils/util'
const { RangePicker } = DatePicker;
import PubTable from '../../../components/PublicTable'
const TreeNode = TreeSelect.TreeNode;
var date = new Date()
//项目进展详情
class projectModules extends Component {

  state = {
    projectInfo: null,       //项目详情
    projCompletion: null,    //项目完成率
    annualTask: null,        //年度任务信息
    eps: null,               //项目群
    completion: null,
    status: '',               //项目群ID
    orgData: null,            //责任主体数据
    orgDataID: '',          //责任主体ID
    date: '',                //查询日期
    planList: null,          //计划清单
    projectQuestion: null,   //项目问题
    questionTableShow: false, //项目问题弹窗显示状态，默认不显示
    questionTable: null,       //项目问题表格数据
    meetingTable: null,        //会议行动项表格数据
    meeting: null,           //会议行动项
    meetingTableShow: false,   //会议行动项弹窗显示状态，默认不限时
    height: document.documentElement.clientWidth || document.body.clientWidth,
    thisYear: date.getFullYear(),
    thisMonth: date.getMonth() + 1,
    time: date.toLocaleString(),
    startTime: null,
    endTime: null,
    questionCurrentPageNum: 1, //项目问题默认当前页位置
    questionTotal: 0,
    questionPageSize: 5,      //项目问题默认每页条数
    meetingCurrentPageNum: 1,  //会议行动项默认当前页位置
    meetingPageSize: 10,       //会议行动项默认每页条数
    meetingTotal: 0,
  }

  componentDidMount() {
    this.setState({
      projectInfo: this.props.menuInfo.projectId
    }, () => {
      this.initPie();
      this.getOrgData();
      this.table.getData();
      this.intyearTaskBar();
      this.intProjProblem();
      this.intMetingBall();
    })

  }
  /**
      * 父组件即可调用子组件方法
      * @method
      */
  onRef = (ref) => {
    this.table = ref
  }
  //整体完成率 饼图
  initPie = () => {
    axios.post(projProgressInfo(this.state.projectInfo.id), '', '', '', false).then(res => {
      var pie = echarts.init(document.getElementById('Completion'));
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
            text: '整体完成率',
            x: '30%',
            y: 50,
            textStyle: {
              color: '#666',
              fontSize: 16
            },
            textAlign: 'center'
          }, {
            text: this.state.thisYear + '年度完成率',

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
            data: ['全部', '计划完成', '实际完成'],
            selectedMode: false,
          },
          color: function (params) {
            if (params.name == '全部') {
              return '#c5c5c5'
            } else if (params.name == '计划完成') {
              return '#5181d2'
            } else {
              return '#03c9a0'
            }
          },
          series: [
            {
              name: '整体完成率',
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
                { value: res.data.data.series.projProgInfo[0].unfinish, name: '全部' },
                { value: res.data.data.series.projProgInfo[0].differ_count, name: '计划完成' },
                { value: res.data.data.series.projProgInfo[0].remain_count, name: '实际完成' },
              ]
            },
            {
              name: '整体完成率',
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
                { value: res.data.data.series.projProgInfo[0].unfinish, name: res.data.data.series.projProgInfo[0].remain_count + '%' }
              ]
            },
            {
              name: this.state.thisYear + '年完成率',
              type: 'pie',
              radius: [60, 75],
              center: ['70%', 165],
              color: ['#c5c5c5', '#5181d2', '#03c9a0'],
              avoidLabelOverlap: false,
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
                { value: res.data.data.series.projProgInfo[0].curr_unfinish, name: '全部' },
                { value: res.data.data.series.projProgInfo[0].curr_differ_count, name: '计划完成' },
                { value: res.data.data.series.projProgInfo[0].curr_remain_count, name: '实际完成' },
              ]
            }, {
              name: '整体完成率',
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
                { value: res.data.data.series.projProgInfo[0].curr_unfinish, name: res.data.data.series.projProgInfo[0].curr_remain_count + '%' }
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

  //条件渲染 任务状态、责任主体
  onChange = (status, value) => {
    if (status == 'status') {
      this.setState({
        status: value
      }, () => {
        //获取计划清单
        this.table.getData();
      })
    } else if (status == 'orgID') {
      this.setState({
        orgDataID: value
      }, () => {
        //获取计划清单
        this.table.getData();
      })
    } else {


      this.setState({
        startTime: value.length > 0 ? value[0].format('YYYY-MM-DD') : '',
        endTime: value.length > 0 ? value[1].format('YYYY-MM-DD') : '',
      }, () => {
        //获取计划清单
        this.table.getData();
      })
    }
  }
  //获取责任主体下拉数据
  getOrgData = () => {
    axios.get(defineOrgTree(this.state.projectInfo.id), '', '', '', false).then(res => {
      if (res.data.data) {
        this.setState({
          orgData: res.data.data
        })
      }
    })
  }
  //获取计划清单
  getPlanList = (callBack) => {
    if (this.state.projectInfo) {
      
      axios.post(projgressList(this.state.projectInfo.id), { status: this.state.status, orgId: this.state.orgDataID, startTime: this.state.startTime, endTime: this.state.endTime }, '', '', false).then(res => {
        if (Object.keys(res.data.data.series).length > 0) {
          this.setState({
            planList: res.data.data.series.projPregressTask
          }, () => {
            callBack(res.data.data.series.projPregressTask)
          })
        } else {
          this.setState({
            planList: []
          })
          callBack([])
        }
   
      })
    } else {
      callBack([])
    }

  }
  //设置table选中行样式
  setClassName = (record, index) => {
    //判断索引相等时添加行的高亮样式
    return record.id === this.state.activeIndex ? 'tableActivty' : "";
  }


  //项目问题
  intProjProblem = () => {

    axios.post(questionData, {
      projectId: this.state.projectInfo.id,
      type: 'proj'
    }, '', '', false).then(res => {
      var projProblem = echarts.init(document.getElementById('projProblemProj'));
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
  //获取项目问题表格数据
  getQuestionTbale = () => {

    axios.post(questionTableData(this.state.questionCurrentPageNum, this.state.questionPageSize, this.state.projectQuestionTableType), {
      projectId: this.state.projectInfo.id,
      type: 'proj',
    }, '', '', false).then(res => {
      this.setState({
        questionTableShow: true,
      })
      if (Object.keys(res.data.data) != 0) {
        this.setState({

          questionTable: res.data.data,
          questionTotal: res.data.total
        })
      }
    })
  }
  //年度任务信息
  intyearTaskBar = () => {
    axios.post(projYearCount(this.state.projectInfo.id), '', '', '', false).then(res => {
      var yearBar = echarts.init(document.getElementById('yearBar'));
      if (Object.keys(res.data.data.series) != 0) {
        this.setState({
          annualTask: res.data.data.series
        })
        var option = {

          title: {
            text: this.state.thisYear + '年度任务信息(64)',
            left: 20,
            top: 20,
            textStyle: {
              color: '#666',
              fontSize: 16
            },
          },
          tooltip: {

          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              data: ['按期进行中', '按期完成', '拖期完成', '拖期未完成', '未开始'],
              axisTick: {
                alignWithLabel: true
              }
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ],
          series: [
            {
              name: '任务数',
              type: 'bar',
              barWidth: '20%',
              color: function (params) {
                var colorList = [
                  '#5182d2', '#3ccca6', '#f5ca3e', '#ea6f67', '#d7d7d7'
                ];
                return colorList[params.dataIndex]
              },
              data: [{ value: res.data.data.series.projPregressCount[0].aqjx, },
              { value: res.data.data.series.projPregressCount[0].aqwc },
              { value: res.data.data.series.projPregressCount[0].tqwc },
              { value: res.data.data.series.projPregressCount[0].tqww },
              { value: res.data.data.series.projPregressCount[0].wks },
              ]
            },
          ]
        };
        yearBar.clear()
        yearBar.setOption(option);
      } else {
        yearBar.clear()
        this.setState({
          annualTask: null
        })
      }

    })


  }
  //会议行动项
  intMetingBall = () => {
    axios.post(meetingAnalyse, {
      projectId: this.state.projectInfo.id,
      type: 'proj'
    }, '', '', false).then(res => {
      var meetingBall = echarts.init(document.getElementById('meetingBallProj'));
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
                    fontSize: 34,

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
      projectId: this.state.projectInfo.id,
      type: 'proj'
    }, '', '', false).then(res => {
      if (Object.keys(res.data.data)) {
        this.setState({
          meetingTable: res.data.data,
          meetingTotal: res.data.total
        })
      }
    })
  }
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
  onChangeSelect = () => {

  }
  render() {

    const temp = {}; // 当前重复的值,支持多列
    //合并单元格方法
    const mergeCells = (text, array, columns) => {
      let i = 0;
      if (text !== temp[columns]) {
        temp[columns] = text;
        array.forEach((item) => {
          if (item.project === temp[columns]) {
            i += 1;
          }
        });
      }
      return i;
    };

    //计划清单 表头
    const projectColumns = [{
      title: '任务名称',
      dataIndex: 'taskName',
      width: 200,
      align: 'center',
      render: (text, record) => {
        return (<div style={{ wordWrap: 'break-word', wordBreak: 'break-all' }}>
          {text}
        </div>)
      }
    }, {
      title: '代码',
      dataIndex: 'code',
      width: 150,
      render: (text, record) => {
        return (<div style={{ wordWrap: 'break-word', wordBreak: 'break-all' }}>
          {text}
        </div>)
      }
    }, {
      title: '计划名称',
      dataIndex: 'defineName',
      width: 250,
      render: (text, record) => {
        return (<div style={{ wordWrap: 'break-word', wordBreak: 'break-all' }}>
          {text}
        </div>)
      }
    }, {
      title: '任务进度',
      dataIndex: 'complete',
      width: 150,
      render: (text, record) => {
        return (<span className={style.radioBg}><span className={`${style.radioBgActivty} ${style.greenBg}`}
          style={{ width: text + '%' }}>{text}% </span></span>)
      }
    }, {
      title: '任务状态',
      dataIndex: 'statusName',
      width: 150,
      align: 'center',
      render: (text, record) => {
        return (<div style={{ wordWrap: 'break-word', wordBreak: 'break-all' }}>
          {text}
        </div>)
      }
    }, {
      title: '计划开始时间',
      dataIndex: 'planStartTime',
      width: 150,
      render: (text, record) => {
        return (<div style={{ wordWrap: 'break-word', wordBreak: 'break-all' }}>
          {text}
        </div>)
      }
    }, {
      title: '计划完成时间',
      dataIndex: 'planEndTime',
      width: 150,
      render: (text, record) => {
        return (<div style={{ wordWrap: 'break-word', wordBreak: 'break-all' }}>
          {text}
        </div>)
      }
    }, {
      title: '实际开始时间',
      dataIndex: 'actStartTime',
      width: 150,
      render: (text, record) => {
        return (<div style={{ wordWrap: 'break-word', wordBreak: 'break-all' }}>
          {text}
        </div>)
      }
    }, {
      title: '实际完成时间',
      dataIndex: 'actEndTime',
      width: 150,
      render: (text, record) => {
        return (<div style={{ wordWrap: 'break-word', wordBreak: 'break-all' }}>
          {text}
        </div>)
      }
    }, {
      title: '项目牵头单位',
      dataIndex: 'orgName',
      width: 150,
      render: (text, record) => {
        return (<div style={{ wordWrap: 'break-word', wordBreak: 'break-all' }}>
          {text}
        </div>)
      }
    }, {
      title: '责任人',
      dataIndex: 'userName',
      width: 100,
      render: (text, record) => {
        return (<div style={{ wordWrap: 'break-word', wordBreak: 'break-all' }}>
          {text}
        </div>)
      }
    }, {
      title: '交付物',
      dataIndex: 'devName',

    }];
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
        obj.props.rowSpan = mergeCells(record.type, this.state.questionTable, 'type');
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
              questionCurrentPageNum: current
            }, () => {
              //获取问题详情
              this.getQuestionTbale()
            })
          } else {
            this.setState({
              meetingPageSize: pageSize,
              meetingCurrentPageNum: current
            }, () => {
              //获取项目行动项详情
              this.getMeetingTable()
            })
          }
        }
      }

    }
    const { intl } = this.props.currentLocale

    return (
      <div>
        <div className={style.main}>
          <div className={style.leftMain} style={{ height: this.props.height }}>
            <Row gutter={16} type="flex" justify="space-around">
              <Col span={23}>
                <h3>{this.state.projectInfo ? this.state.projectInfo.name : ''}</h3>
              </Col>
              <Col span={18}>
                <div className={style.projectTitle}>
                  <span>责任主体：</span>{this.state.projectInfo ? this.state.projectInfo.orgName : ''}
                  <span>责任人：</span>{this.state.projectInfo ? this.state.projectInfo.userName : ''}
                  <span>计划开始时间：</span>{this.state.projectInfo ? this.state.projectInfo.planStartTime : ''}
                  <span>计划完成时间：</span>{this.state.projectInfo ? this.state.projectInfo.planEndTime : ''}
                </div>
              </Col>
              <Col span={6}>
                <div style={{ textAlign: 'right' }}>
                  <span>状态更新：{this.state.time}</span>
                </div>
              </Col>
            </Row>
            <Row type="flex" justify="space-around" gutter={16} row-flex='center'>
              {/*第一排左侧  项目完成率*/}
              <Col span={9}>
                <Row>
                  <Col span={24}>
                    <div className={style.ber} style={{ marginTop: 16 }}>
                      <div id="Completion" style={{ height: 320 }}>
                        {this.state.completion != null && (
                          <div>
                            <div className={style.pieDescL}>
                              <p>计划完成:{this.state.completion.projProgInfo[0].planRate}%</p>
                              <p>实际完成:{this.state.completion.projProgInfo[0].actRate}%</p>
                            </div>
                            <div className={style.pieDescR}>
                              <p>计划完成:{this.state.completion.projProgInfo[0].currPlanRate}%</p>
                              <p>实际完成:{this.state.completion.projProgInfo[0].currActRate}%</p>
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
              {/*第一排右侧 年度任务信息 完成率*/}
              <Col span={15}>
                <Row>
                  <Col span={24}>
                    <div className={style.ber}>
                      {this.state.annualTask != null && (
                        <div className={style.legend}>
                          <span><i style={{ backgroundColor: '#5182d2' }}></i>按期进行中</span>
                          <span><i style={{ backgroundColor: '#3ccca6' }}></i>按期完成</span>
                          <span><i style={{ backgroundColor: '#f5ca3e' }}></i>拖期完成</span>
                          <span><i style={{ backgroundColor: '#ea6f67' }}></i>拖期未完成</span>
                          <span><i style={{ backgroundColor: '#d7d7d7' }}></i>未开始</span>
                        </div>
                      )}
                      {this.state.annualTask == null && (
                        <div className={style.noData}>
                          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                        </div>
                      )}
                      <div id="yearBar" style={{ height: 320 }}></div>
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={4} style={{ marginTop: 20, marginLeft: 20 }}>
                <label>任务状态 </label>
                <Select allowClear={true} placeholder="全部" style={{ width: '60%' }} size={'small'} onChange={this.onChange.bind(this, 'status')}>
                  <Option value="按期进行中">按期进行中</Option>
                  <Option value="按期完成">按期完成</Option>
                  <Option value="拖期完成">拖期完成</Option>
                  <Option value="拖期未完成">拖期未完成</Option>
                  <Option value="未开始">未开始</Option>
                </Select>
              </Col>
              <Col span={4} style={{ marginTop: 20 }}>
                <label>责任主体 </label>
                <TreeSelect
                  style={{ width: '60%' }}
                  size={'small'}
                  allowClear
                  treeData={this.state.orgData}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  placeholder="选择项目"
                  onChange={this.onChange.bind(this, 'orgID')}
                >
                </TreeSelect>
              </Col>
              <Col span={4} style={{ marginTop: 20 }}>
                <RangePicker size={'small'} onChange={this.onChange.bind(this, 'rangePicker')} />
              </Col>
              <Col span={24}>
                <div className={style.ber}>
                  <p className={style.title}>计划清单</p>

                  <PubTable onRef={this.onRef}
                    getData={this.getPlanList}
                    bordered={true}
                    columns={projectColumns}
                    getRowData={this.getRowData}
                    scroll={{ x: 1900, y: 320 }}
                  />

                </div>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                {/*项目问题*/}
                <div className={style.ber}>
                  <div id="projProblemProj" style={{ height: 320 }}></div>
                  {this.state.projectQuestion == null && (
                    <div className={style.noData}>
                      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    </div>
                  )}
                </div>
              </Col>
              <Col span={12}>
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
                  <div id="meetingBallProj" style={{ height: 320 }}></div>
                  {this.state.meeting == null && (
                    <div className={style.noData}>
                      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    </div>
                  )}
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
                dataSource={this.state.questionTable} pagination={pagination(this.state.questionTable, this.state.questionCurrentPageNum, this.state.questionPageSize, 'question', this.state.questionTotal)} bordered
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
                dataSource={this.state.meetingTable} pagination={pagination(this.state.meetingTable, this.state.meetingCurrentPageNum, this.state.meetingPageSize, 'metting', this.state.meetingTotal)} bordered
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
}))(projectModules);
/* *********** connect链接state及方法 end ************* */
