import React, { Component } from 'react'
import { Table, Icon, Spin, Modal } from 'antd'
import style from './style.less'
import TopTags from './TopTags/index'
import RightTags from '../../../components/public/RightTags/index'
import _ from 'lodash'
import { connect } from 'react-redux'
import * as util from '../../../utils/util'
import axios from '../../../api/axios'
import { epsTreeList, epsDel } from '../../../api/api'
import AddSameLevel from "./AddSameLevel"
import TipModal from "../../Components/TipModal"
import * as dataUtil from "../../../utils/dataUtil"
import TreeTable from '../../../components/PublicTable'
import ExtLayout from "../../../components/public/Layout/ExtLayout";
import MainContent from "../../../components/public/Layout/MainContent";
import Toolbar from "../../../components/public/Layout/Toolbar";

//项目群
class TableComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            initDone: false,
            activeIndex: "",
            rightData: null,
            rightTags: [
                { icon: 'iconjibenxinxi', title: '基本信息', fielUrl: 'Plot/Group/BasicInfo' },
                { icon: 'iconwenjian', title: '文件信息', fielUrl: 'Components/FileInfo' },
                { icon: 'icontuandui', title: '协作团队', fielUrl: 'Plot/Group/TeamInfo' },
            ],
            contentMenu: [
                { name: '新增', fun: 'add', type: 'buttom', icon: 'plus-square', isPublic: false },
                { name: '删除', fun: 'delete', type: 'buttom', icon: 'delete', isPublic: false }
            ],
            data: [],
            dataMap: [],

        }

    }

    /**
  @method 父组件即可调用子组件方法
  @description 父组件即可调用子组件方法
  */
    onRef = (ref) => {
        this.table = ref
    }

    //获取列表信息
    getDataList = (callBack) => {
        if (this.state.keyWords) {
            const { copyData } = this.state;
            let newData = dataUtil.search(copyData, [{ "key": "name|code", "value": this.state.keyWords }], true);
            callBack(newData);
            return;
        }
        axios.get(epsTreeList).then(res => {
            callBack(res.data.data ? res.data.data : [])
            if (res.data.data) {
                this.setState({
                    data: res.data.data,
                    copyData: res.data.data,
                    activeIndex: null,
                    rightData: null
                })
            }

        })
    }

    //点击空白右击事件
    openContextmenu = (event) => {
        event.preventDefault();
        this.setState({
            rightClickShow: true,
            activeIndex: null,
            rightData: null,
            x: event.clientX,
            y: event.clientY - 120,
        })
    }

    //table表格单行点击回调
    getInfo = (record, index) => {
        this.setState({
            rightData: record
        })
    }
    //搜索
    search = (value) => {

        this.setState({
            keyWords: value
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
        let { rightData } = this.state
        this.table.update(rightData, val);
    }

    //右击菜单事件处理
    rightClickMenu = (menu) => {
        //新增
        if (menu.fun == "add") {
            this.setState({
                addSameLevel: true
            })
        }
        //删除
        if (menu.fun == "delete") {
            // this.delData();
            // 打开删除提示
            this.setState({
                deleteTip: true
            })
        }
    }
    //取消新增
    closeAddSameLevel = () => {
        this.setState({
            addSameLevel: false,
        })
    }
    //打开新增
    openAddModal = () => {
        this.setState({
            addSameLevel: true,
        })
    }
    render() {
        const { intl } = this.props.currentLocale;
        const columns = [
            {
                title: intl.get('wsd.i18n.pre.eps.projectname'),
                dataIndex: 'name',
                width: 300,
                key: 'name',
                render: (text, record) => dataUtil.getIconCell("eps", text)
            },
            {
                title: intl.get('wsd.i18n.pre.eps.projectcode'),
                dataIndex: 'code',
                width: 200,
                key: 'code',
            },
            {
                title: intl.get('wsd.i18n.pre.proreview.iptname'),
                dataIndex: 'org',
                width: 200,
                key: 'org',
                render: text => <span>{text ? (text.name ? text.name : '') : ''}</span>
            },
            {
                title: intl.get('wsd.i18n.pre.proreview.username'),
                dataIndex: 'user',
                width: 100,
                key: 'user',
                render: text => <span>{text ? (text.name ? text.name : '') : ''}</span>
            },
            {
                title: intl.get('wsd.i18n.pre.eps.remark'),
                dataIndex: 'remark',
                width: 100,
                key: 'remark',
            },
            // {
            //     title: "密级",
            //     dataIndex: 'secutyLevel',
            //     width: 200,
            //     key: 'secutyLevel',
            //     render: text => <span>{text ? (text.name ? text.name : '') : ''}</span>
            // },
        ];

        return (

          <ExtLayout renderWidth = {({contentWidth}) => { this.setState({contentWidth}) }}>
            <Toolbar>
              <TopTags data={this.state.rightData} openAddModal={this.openAddModal} delData={this.delData} rightClickShow={this.state.rightClickShow} search={this.search} />
            </Toolbar>
            <MainContent contentWidth = {this.state.contentWidth} contentMinWidth = {1500}>
              <TreeTable
                contentMenu={this.state.contentMenu}
                onRef={this.onRef}
                getData={this.getDataList}
                columns={columns}
                getRowData={this.getInfo}
                rightClick={this.rightClickMenu}
              />
            </MainContent>
            <RightTags menuCode={this.props.menuInfo.menuCode}
                       rightTagList={this.state.rightTags}
                       rightData={this.state.rightData}
                       updata={this.updata}
                       bizType='eps'
                       bizId={this.state.rightData ? this.state.rightData.id : null}
                       fileEditAuth={true}
                       extInfo={{
                         startContent: "EPS【" + (this.state.rightData ? this.state.rightData.name : null) + "】"
                       }}
            />
            {/* 新增 */}
            {this.state.addSameLevel && <AddSameLevel handleCancel={this.closeAddSameLevel}
                                                      data={this.state.rightData} addData={this.addData} />}
            {/* 删除提示 */}
            {this.state.deleteTip && <TipModal onOk={this.delData} onCancel={this.closeDeleteTipModal} />}
          </ExtLayout>
        )
    }
}


/* *********** connect链接state及方法 start ************* */
export default connect(state => ({
    currentLocale: state.localeProviderData
}))(TableComponent);
/* *********** connect链接state及方法 end ************* */
