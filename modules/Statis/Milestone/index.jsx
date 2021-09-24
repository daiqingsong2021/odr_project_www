import React, { Component } from 'react'
import style from './style.less'
import { Table, Row, Col, TreeSelect, Icon, DatePicker, Modal, Select } from 'antd';
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
import { projProgressInfo, projYearCount, getdictTree, projgressList, defineOrgTree, meetingAnalyse, questionData, questionTableData, meetingTableList, milestoneProjList, milestoneCount } from '../../../api/api'
import * as util from '../../../utils/util'
const { RangePicker } = DatePicker;
const TreeNode = TreeSelect.TreeNode;
import PubTable from '../../../components/PublicTable'
var date = new Date()
//项目进展详情
class projectModules extends Component {

  state = {
    projectInfo: null,       //项目详情
    projCompletion: null,    //项目完成率
    annualTask: null,        //年度任务信息
    eps: null,               //项目群
    status: '',               //类别
    orgData: null,            //责任主体数据
    orgDataID: '',          //责任主体ID
    date: '',                //查询日期
    milesList: null,          //计划清单
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
      this.getOrgData();
      this.table.getData();
      this.intyearTaskBar();
    })

  }
  /**
     * 父组件即可调用子组件方法
     * @method
     */
  onRef = (ref) => {
    this.table = ref
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

  //条件渲染 任务状态、责任主体、时间
  onChange = (status, value) => {

    if (status == 'status') {
      this.setState({
        status: value
      }, () => {
        this.table.getData();
      })
    } else if (status == 'zhuti') {
      this.setState({
        orgDataID: value
      }, () => {
        this.table.getData();
      })
    } else {
      this.setState({
        startTime: value.length > 0 ? value[0].format('YYYY-MM-DD') : '',
        endTime: value.length > 0 ? value[1].format('YYYY-MM-DD') : '',
      }, () => {
        this.table.getData();
      })
    }
  }

  //获取里程碑列表
  getMilestoneList = (callBack) => {
    if (this.state.projectInfo) {
      axios.post(milestoneProjList(this.state.projectInfo.id), { status: this.state.status, orgId: this.state.orgDataID, startTime: this.state.startTime, endTime: this.state.endTime }, '', '', false).then(res => {
        if (Object.keys(res.data.data.series).length > 0) {
          this.setState({
            milesList: res.data.data.series.projMilestoneList
          }, () => {
            callBack(res.data.data.series.projMilestoneList)
          })
        } else {
          this.setState({
            milesList: []
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
  //年度任务信息
  intyearTaskBar = () => {
    axios.post(milestoneCount(this.state.projectInfo.id), '', '', '', false).then(res => {

      if (Object.keys(res.data.data.series).length > 0) {
        var yearBar = echarts.init(document.getElementById('yearBar2'));
        var option = {
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
              data: ['按期完成', '拖期完成', '拖期未完成', '未开始'],
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
                  '#3ccca6', '#f5ca3e', '#ea6f67', '#d7d7d7'
                ];
                return colorList[params.dataIndex]
              },
              data: [
                { value: res.data.data.series.projMilestoneCount[0].aqwc },
                { value: res.data.data.series.projMilestoneCount[0].tqwc },
                { value: res.data.data.series.projMilestoneCount[0].tqww },
                { value: res.data.data.series.projMilestoneCount[0].wks },
              ]
            },
          ]
        };

        yearBar.setOption(option);
      }

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
    //里程碑 表头
    const projectColumns = [{
      title: '编号',
      dataIndex: 'code',
      width: 100,
      align: 'center',
      render: (text, record) => {
        return (<div style={{ wordWrap: 'break-word', wordBreak: 'break-all' }}>
          {text}
        </div>)
      }
    }, {
      title: '名称',
      dataIndex: 'taskName',
      width: 250,
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
      title: '进展状态',
      dataIndex: 'statusName',
      width: 150,
    }, {
      title: '责任主体',
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
      render: (text, record) => {
        return (<div style={{ wordWrap: 'break-word', wordBreak: 'break-all' }}>
          {text}
        </div>)
      }
    }];

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
          this.setState({
            currentPage: page
          }, () => {
            if (type == 'question') {
              //获取问题详情
              this.getQuestionTbale()
            } else {
              //获取项目行动项详情
              this.getMeetingTable()
            }
          })
        }
      }

    }
    const { intl } = this.props.currentLocale;
    return (
      <div>
        <div className={style.main}>
          <div className={style.leftMain} style={{ height: this.props.height }}>
            <Row type="flex" justify="space-around" gutter={16} row-flex='center'>

              {/*第一排 年度任务信息 完成率*/}
              <Col span={24}>
                <Row gutter={16}>
                  <Col span={18}>
                    <h3>{this.state.projectInfo ? this.state.projectInfo.name : ''}</h3>
                  </Col>
                  <Col span={6}>
                    <div style={{ textAlign: 'right' }}>
                      <span>状态更新：{this.state.time}</span>
                    </div>
                  </Col>

                </Row>
                <Row>
                  <Col span={24}>
                    <div className={style.ber}>
                      <div className={style.legend}>
                        <span><i style={{ backgroundColor: '#3ccca6' }}></i>按期完成</span>
                        <span><i style={{ backgroundColor: '#f5ca3e' }}></i>拖期完成</span>
                        <span><i style={{ backgroundColor: '#ea6f67' }}></i>拖期未完成</span>
                        <span><i style={{ backgroundColor: '#d7d7d7' }}></i>未开始</span>
                      </div>
                      <div id="yearBar2" style={{ height: (this.state.height / 2) / 2.5 }}></div>
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={4} style={{ marginTop: 20, marginLeft: 20 }}>
                <label>任务状态 </label>
                <Select allowClear={true} placeholder="全部" style={{ width: '60%' }} size={'small'} onChange={this.onChange.bind(this, 'status')}>
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
                  onChange={this.onChange.bind(this, 'zhuti')}
                >
                </TreeSelect>
              </Col>
              <Col span={4} style={{ marginTop: 20 }}>
                <RangePicker size={'small'} onChange={this.onChange.bind(this, 'rangePicker')} />
              </Col>
              <Col span={24}>
                <div className={style.ber}>
                  <p className={style.title}>里程碑清单</p>


                  <PubTable onRef={this.onRef}
                    getData={this.getMilestoneList}
                    bordered={true}
                    columns={projectColumns}
                    getRowData={this.getRowData}
                    scroll={{ x: 1000, y: 240 }}
                  />
                </div>
              </Col>
            </Row>
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
