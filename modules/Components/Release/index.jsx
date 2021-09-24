import React, { Component } from 'react'
import style from './style.less'
import { Table, Form } from 'antd';
import Search from '../../../components/public/Search'
import { connect } from 'react-redux'
import '../../../asserts/antd-custom.less'
import axios from "../../../api/axios"
import * as WorkFolw from '../Workflow/Start';
import * as dataUtil from "../../../utils/dataUtil";
import MyIcon from "../../../components/public/TopTags/MyIcon";

class PlanPreparedRelease extends Component {
    constructor(props) {
        super(props)
        this.state = {
            initDone: false,
            step: 1,
            columns: [],
            data: [],
            info: {},
            currentData: [],
            activeIndex: []
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.setState((proState) => ({
            step: proState.step + 1
        }), () => {
            if (this.state.step == 3) {
                this.props.handleCancel()
                this.setState({
                    step: 1
                })
            }
        })
    }

    getInfo = (record) => {
        let { id } = record
        if (this.state.activeIndex == id) {
            this.setState({
                currentData: null,
                activeIndex: null,
            })
        } else {
            this.setState({
                activeIndex: [id],
                currentData: [record]
            })
        }
    }

    setClassName = (record) => {
        //判断索引相等时添加行的高亮样式
        return record.id === this.state.activeIndex ? 'tableActivty' : "";
    }

    componentDidMount() {
       this.getFistList()
    }
    getFistList=()=>{
        const {projectId} =this.props;
        axios.post(this.props.firstList(condition),{}).then(res=>{
             this.setState({
                 data:res.data.data
             })
        })
    }

    search = (text) => {

    }

    render() {
        const { intl } = this.props.currentLocale;
        const columns = [
          {
            title: intl.get('wsd.i18n.pre.project1.projectname'),
            dataIndex: 'delvTitle',
            key: 'delvTitle',
            render: (text, record) => {
              let icon = dataUtil.getIcon(record.type);
              return  <span><MyIcon type={icon} style={{ fontSize: '18px' ,verticalAlign:"middle"}}/> { text} </span>
            }
          },
          {
            title: intl.get('wsd.i18n.pre.project1.projectcode'),
            dataIndex: 'delvCode',
            key: 'delvCode'
          },
          {
            title: intl.get("wsd.i18n.plan.delvList.delvtype"),
            dataIndex: 'type',
            key: 'type',
            render: text => text == 'pbs' ? "PBS" : text == 'delv' ? "交付物":null
          },
          {
            title: "交付物类别",
            dataIndex: 'delvTypeVo',
            key: 'delvTypeVo',
            render: (text, record) => {
              let ret = text && record.type === "delv" ? text.name : "";
              return ret;
            }
          }
        ];
        const rowSelection = {
            selectedRowKeys: this.state.activeIndex,
            onChange: (selectedRowKeys, selectedRows) => {
            }
        };
        let display = this.props.visible ? "" : "none";
        return (
            <div style = {{display:display}}>
              <div className={style.tableMain}  >
                <div className={style.search}>
                  <Search placeholder={"会议标题"} search = {this.search } />
                </div>
                <Table rowKey={record => record.id}
                       defaultExpandAllRows={true}
                       pagination={false}
                       name={this.props.name}
                       columns={columns}
                       rowSelection={rowSelection}
                       dataSource={this.state.data}
                       size="small"
                />
              </div>
            </div>
        )
    }
}

const PlanPreparedReleases = Form.create()(PlanPreparedRelease)

const mapStateToProps = state => {
    return {
        currentLocale: state.localeProviderData,
    }
};

const  DelvApporal = connect(mapStateToProps, null)(PlanPreparedReleases);
export default WorkFolw.StartWorkFlow(DelvApporal,{});
// export default connect(mapStateToProps, null)(PlanPreparedReleases);
