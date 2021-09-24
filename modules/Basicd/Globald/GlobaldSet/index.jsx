import React, { Component } from 'react'
import intl from 'react-intl-universal'
import style from './style.less'
import { Layout, Menu } from 'antd';
import _ from 'lodash'
import TimeSet from './TimeSet'
import ProjectSet from "./ProjectSet"
import DocumentSet from "./DocumentSet"
import OperationSet from './OperationSet'   //运营设置
//导入国际化
const locales = {
    "en-US": require('../../../../api/language/en-US.json'),
    "zh-CN": require('../../../../api/language/zh-CN.json')
}

// api
import { updateSetProject, updateSetDoc, updateSetTime, getProjectInfo, getDocInfo, getTimeInfo, getBaseSelectTree } from '../../../../api/api'
import axios from '../../../../api/axios';
import { getTrainTime, setTrainTime } from "@/modules/Suzhou/api/suzhou-api"
import { type } from 'os';

const {
    Header, Footer, Sider, Content,
} = Layout;
export class BasicdGlobaldGlobalSet extends Component {
    constructor(props) {
        super(props)
        this.state = {
            initDone: false,
            currentIndex: '2',
            projectData: {},  //项目数据
            timeData: {},  //时间数据
            docData: {}, //文档数据
            trainTimeData:{line1:0,line2:0,line3:0},   //运营数据
            projectSelectData: {
                taskDrtnType: [],
                cpmType: []
            }, //项目数据select数据
            timeSelectData: {
                timeType: [],
                dateType: [],
                dateFormate: []
            }
        }
    }

    componentDidMount() {
        this.loadLocales();
    }

    // 初始化国际化
    loadLocales() {
        intl.init({
            currentLocale: 'zh-CN',
            locales,
        }).then(() => {
            this.setState({ initDone: true });
        });
    }

    //切换菜单
    onchangeCurrentIndex = (index) => {
        this.setState({
            currentIndex: index
        })
    }

    // 获取下拉框字典
    getBaseSelectTree = (typeCode) => {
        axios.get(getBaseSelectTree(typeCode)).then(res => {
            const { data } = res.data
            // 初始化字典-工期类型
            if(typeCode == 'plan.project.taskdrtntype') {
                this.setState((provState, state) => ({
                    projectSelectData: {cpmType: provState.projectSelectData.cpmType, taskDrtnType: data}
                }))
            }
            // 初始化字典-关键路径
            if(typeCode == 'plan.project.cpmtype') {
                this.setState((provState, state) => ({
                    projectSelectData: {taskDrtnType: provState.projectSelectData.taskDrtnType, cpmType: data}
                }))
            }
            // 初始化字典-工时单位
            if(typeCode == 'plan.project.timeunit') {
                this.setState((provState, state) => ({
                    timeSelectData: {dateType: provState.timeSelectData.dateType, dateFormate: provState.timeSelectData.dateFormate, timeType: data}
                }))
            }
            // 初始化字典-工期单位
            if(typeCode == 'plan.project.drtnunit') {
                this.setState((provState, state) => ({
                    timeSelectData: {timeType: provState.timeSelectData.timeType, dateFormate: provState.timeSelectData.dateFormate, dateType: data}
                }))
            }
            // 初始化字典-日期格式
            if(typeCode == 'base.date.formate') {
                this.setState((provState, state) => ({
                    timeSelectData: {timeType: provState.timeSelectData.timeType, dateType: provState.timeSelectData.dateType, dateFormate: data}
                }))
            }
        })
    }

    // 修改更新全局设置
    updateSetProject = (data) => {
        axios.post(updateSetProject, data, true).then(res => {
        })
    }

    // 修改文档全局设置
    updateSetDoc = (data) => {
        axios.post(updateSetDoc, data, true).then(res => {
        })
    }

    // 修改时间全局设置
    updateSetTime = (data) => {
        axios.post(updateSetTime, data, true).then(res => {
        })
    }

    //修改运营设置
    updateSetTrainTime = (data) => {
        axios.post(setTrainTime, data, true).then(res => {
        })
    }

    // 获取项目全局设置信息
    getProjectInfo = () => {
        axios.get(getProjectInfo).then(res => {
            const { data } = res.data
            this.setState({
                projectData: data
            })
        })
    }

    // 获取文档全局设置信息
    getDocInfo = () => {
        axios.get(getDocInfo).then(res => {
            const { data } = res.data
            this.setState({
                docData: data
            })
        })
    }

    // 获取时间全局设置信息
    getTimeInfo = () => {
        axios.get(getTimeInfo).then(res => {
            const { data } = res.data
            this.setState({
                timeData: data
            })
        })
    }

    //获取运营设置数据
    getTrainTime=()=>{
        axios.get(getTrainTime).then(res => {
            const data = res.data.data
            if(data.length>0){
                let line1,line2,line3
                data.map(item => {
                    if(item.boCode == 'line1'){
                        line1 = item.boName
                    }else if(item.boCode == 'line2'){
                        line2 = item.boName
                    }else if(item.boCode == 'line3'){
                        line3 = item.boName
                    }else{
                        return
                    }
                })
                this.setState({
                    trainTimeData:{
                        line1,
                        line2,
                        line3
                    }  
                })
            }else{
                return
            }
        })
    }

    render() {
        const { projectData, timeData, docData, projectSelectData, timeSelectData, trainTimeData } = this.state
        return (
            <div className={style.main}>
                {this.state.initDone &&
                    <Layout style={{ height: this.props.height }}>
                        <Sider style={{ height: "100%", borderRight: "1px solid #d9d9d9", backgroundColor: "white" }}>
                            <Menu className={style.menulist} style={{ borderRight: 0 }} mode="inline" defaultSelectedKeys={[this.state.currentIndex]}>
                                {/* <Menu.Item key="1" onClick={this.onchangeCurrentIndex.bind(this, '1')}>项目设置</Menu.Item> */}
                                <Menu.Item key="2" onClick={this.onchangeCurrentIndex.bind(this, '2')}>时间设置</Menu.Item>
                                <Menu.Item key="3" onClick={this.onchangeCurrentIndex.bind(this, '3')}>文档设置</Menu.Item>
                                <Menu.Item key="4" onClick={this.onchangeCurrentIndex.bind(this, '4')}>运营设置</Menu.Item>
                            </Menu>
                        </Sider>
                        <Content style={{ backgroundColor: "white" }}>
                            <div className={style.rightcotnet}>
                                {/* {this.state.currentIndex == 1 && <ProjectSet getBaseSelectTree={this.getBaseSelectTree} getProjectInfo={this.getProjectInfo} data={projectData} selectData={projectSelectData} updateSetProject={this.updateSetProject}></ProjectSet>} */}
                                {this.state.currentIndex == 2 && <TimeSet getBaseSelectTree={this.getBaseSelectTree} data={timeData} timeSelectData={timeSelectData} getTimeInfo={this.getTimeInfo} selectData={timeSelectData} updateSetTime={this.updateSetTime}></TimeSet>}
                                {this.state.currentIndex == 3 && <DocumentSet data={docData} getDocInfo={this.getDocInfo} updateSetDoc={this.updateSetDoc}></DocumentSet>}
                                {this.state.currentIndex == 4 && <OperationSet data={trainTimeData} getTrainTime={this.getTrainTime} updateSetTrainTime={this.updateSetTrainTime}/>}
                            </div>
                        </Content>
                    </Layout>
                }
            </div>
        )
    }
}

export default BasicdGlobaldGlobalSet
