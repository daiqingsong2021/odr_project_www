import React, { Component } from 'react'
import RightTags from "../../../Components/RightDragAndDrop"
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as codeRuleAction from '../../../../store/base/codeRule/action';
import { Table, Icon, notification } from 'antd';
import AddTopBtn from '../../../../components/public/TopTags/AddTopBtn';
import ModifyTopBtn from '../../../../components/public/TopTags/ModifyTopBtn';
import DeleteTopBtn from '../../../../components/public/TopTags/DeleteTopBtn';
import AddBusinessObject from './AddBusinessObject';
import CheckBtn from '../../../../components/public/TopTags/CheckBtn';
import MaintRuleTypeTopBtn from '../../../../components/public/TopTags/MaintRuleTypeTopBtn';
import AddRule from './AddRule/';
import ModifyRule from "./ModifyRule"
import CheckModal from './CheckModal';
import style from './style.less';
import { baseCoderuleboList, deleteCoderulebo, ruleList, deleteRule, checkRule } from "../../../../api/api";
import axios from "../../../../api/axios"
import MyIcon from '../../../../components/public/TopTags/MyIcon';
import PublicButton from "../../../../components/public/TopTags/PublicButton"
class CodeRule extends Component {
    constructor(props) {
        super(props)
        this.state = {
            wfList: [],//业务列表

            leftmenu: null,//业务列表选择对象
            wftype: "add",
            ruleList: [],
            activeIndex2: null,//规则选择行颜色标记
            rightData: null,//规则选择数据
            selectedRowKeys2: []//规则勾选项
        }
    }
    //获取业务列表
    getWfList = () => {
        axios.get(baseCoderuleboList).then(res => {
            if(res.data.data && res.data.data.length>0 ){
              this.setState({
                wfList: res.data.data,
                activeIndex1: res.data.data ? res.data.data[0].id : null,
                leftmenu: res.data.data ? res.data.data[0] : null,
              }, () => {
                this.getRuleList()
                this.props.actions.saveCodeRuleBo(this.state.leftmenu)
              })
            }
        })
    }
    //获取右侧数据
    getRuleList = () => {
        const { leftmenu } = this.state
        axios.get(ruleList(leftmenu.id)).then(res => {
            this.setState({
                ruleList: res.data.data
            })
        })
    }
    componentDidMount() {
        this.getWfList()


    }
    //业务列表选择
    getInfo1 = (record, event) => {
        let id = record.id
        record = record;
        /* *********** 点击表格row执行更新state start ************* */
        if (this.state.activeIndex1 == id) {
            return
        } else {
            this.setState({
                activeIndex1: id,
                leftmenu: record,
                activeIndex2: null,//规则选择行颜色标记
                rightData: null,//规则选择数据
            }, () => {
                this.props.actions.saveCodeRuleBo(record)
                this.getRuleList()
            });
        }

    };
    //业务表行颜色
    setClassName1 = (record, index) => {
        //判断索引相等时添加行的高亮样式
        return record.id === this.state.activeIndex1 ? 'tableActivty' : '';
    };
    //点击行事件
    getInfo2 = (record, index) => {
        let id = record.id, records = record

        this.setState({
            activeIndex2: id,
            rightData: record
        })
    }
    //规则表行颜色
    setClassName2 = (record, index) => {
        // 判断索引相等时添加行的高亮样式
        //判断索引相等时添加行的高亮样式
        return record.id === this.state.activeIndex2 ? 'tableActivty' : '';

    };
    //新增业务对象
    addCoderulebo = (data) => {
        const { wfList } = this.state
        wfList.push(data)
        this.setState({
            wfList,

        })
    }
    //更新业务对象
    updateCoderulebo = (data) => {
        const { wfList } = this.state
        let index = wfList.findIndex(item => item.id == data.id)
        wfList[index] = data
        this.setState({
            wfList,
            //更新当前数据
            leftmenu: data
        })
    }
    deleteVerifyCallBack = () => {
        const { leftmenu, wfList } = this.state
        if (!leftmenu) {
            notification.warning(
                {
                    placement: 'bottomRight',
                    bottom: 50,
                    duration: 2,
                    message: '未选数据',
                    description: '请选择数据进行操作'
                }
            )
            return false;
        } else {
            return true
        }
    }
    deleteVerifyCallBack2 = () => {
        const { activeIndex2, ruleList, selectedRowKeys2, rightData } = this.state
        const { intl } = this.props.currentLocale
        if (selectedRowKeys2.length == 0) {
            notification.warning(
                {
                    placement: 'bottomRight',
                    bottom: 50,
                    duration: 1,
                    message: intl.get("wsd.global.tip.title1"),
                    description: intl.get("wsd.global.tip.content2")
                }
            )
            return false
        } else {
            return true
        }
    }
    onClickHandle1 = name => {
        const { intl } = this.props.currentLocale
        if (name == 'AddTopBtn') {
            this.setState({
                isShowModal: true,
                wftype: "add",
                ModalTitle: intl.get("wsd.i18n.base.coderulde.addwfobj"),
            });
            return;
        }
        if (name == 'ModifyTopBtn') {
            const { leftmenu, wfList } = this.state
            if (!leftmenu) {
              notification.warning(
                {
                  placement: 'bottomRight',
                  bottom: 50,
                  duration: 2,
                  message: '未选数据',
                  description: '请选择数据进行操作'
                }
              )
              return false;
            }
            this.setState({
                isShowModal: true,
                wftype: "modify",
                ModalTitle: intl.get("wsd.i18n.base.coderulde.modifywfobj"),
            });
            return;
        }
        if (name = "DeleteTopBtn") {
            const { leftmenu, wfList } = this.state
            let index = wfList.findIndex(item => item.id == leftmenu.id)

            axios.deleted(deleteCoderulebo(leftmenu.id), null, true).then(res => {
                this.setState(preState => ({
                    wfList: [...preState.wfList.slice(0, index), ...preState.wfList.slice(index + 1)]
                }), () => {
                    if (index > 1) {
                        this.setState({
                            activeIndex1: wfList[index - 1].id,
                            leftmenu: wfList[index - 1],
                            selectedRowKeys1: [wfList[index - 1].id]
                        }, () => {
                            this.getRuleList()
                        })
                        return
                    }
                    if (index == 0 && wfList.length > 1) {
                        this.setState({
                            activeIndex1: wfList[0].id,
                            leftmenu: wfList[0],
                            selectedRowKeys1: [wfList[0].id]
                        }, () => {
                            this.getRuleList()
                        })
                        return
                    }
                })
            })
        }
    };
    //关闭业务弹框
    closeAddBusinessObjectModal = () => {
        this.setState({
            isShowModal: false,
        });
    };
    //新增规则
    AddRule = (data) => {
        const { ruleList } = this.state
        ruleList.push(data)
        this.setState({
            ruleList
        })
    }
    //修改规则
    updateData = (value) => {
        const { ruleList } = this.state
        let i = ruleList.findIndex(item => item.id == value.id)
        if (i > -1) {
            ruleList[i] = value
            this.setState({
                ruleList
            })
        }
    }
    onClickHandle2 = name => {

        const { intl } = this.props.currentLocale
        if (name == 'AddTopBtn') {
            if(!this.state.leftmenu){
              notification.warning(
                {
                  placement: 'bottomRight',
                  bottom: 50,
                  duration: 1,
                  message: "提示",
                  description: "请选择业务对象进行操作!"
                }
              )
              return
            }
            this.setState({
                isShowAddRule: true,
            });
            return;
        }

        if (name == 'ModifyTopBtn') {
            const { rightData } = this.state
            if (!rightData) {
                notification.warning(
                    {
                        placement: 'bottomRight',
                        bottom: 50,
                        duration: 1,
                        message: intl.get("wsd.global.tip.title1"),
                        description: intl.get("wsd.global.tip.content1")
                    }
                )
                return
            }
            this.setState({
                isModifyAddRule: true,
            });
            return;
        }
        if (name == 'DeleteTopBtn') {
            const { activeIndex2, ruleList, selectedRowKeys2, rightData } = this.state
            if (selectedRowKeys2.length == 0) {
                notification.warning(
                    {
                        placement: 'bottomRight',
                        bottom: 50,
                        duration: 1,
                        message: intl.get("wsd.global.tip.title1"),
                        description: intl.get("wsd.global.tip.content2")
                    }
                )
                return
            }
            let array = ruleList
            axios.deleted(deleteRule, { data: selectedRowKeys2 }, true).then(res => {

                selectedRowKeys2.forEach(item => {
                    let index = ruleList.findIndex(v => v.id == item)
                    if (index > -1) {
                        array.splice(index, 1)
                    }
                })
                this.setState({
                    ruleList: array,
                    activeIndex2: null,
                    rightData: null,
                    selectedRowKeys2
                })
            })

            return;
        }
        if (name == "CheckBtn") {
            const { rightData, ruleList } = this.state
            if (!rightData) {
                notification.warning(
                    {
                        placement: 'bottomRight',
                        bottom: 50,
                        duration: 1,
                        message: intl.get("wsd.global.tip.title1"),
                        description: intl.get("wsd.global.tip.content1")
                    }
                )
                return
            }
            if (rightData) {
                axios.put(checkRule(rightData.id), {}).then(res => {
                    let index = ruleList.findIndex(item => item.id == rightData.id)
                    if (res.data.data.status == "ERROR") {
                        notification.error(
                            {
                                placement: 'bottomRight',
                                bottom: 50,
                                duration: 1,
                                message: intl.get("wsd.global.tip.title2"),
                                description: res.data.data.error
                            }
                        )
                        ruleList[index].status = "ERROR"
                    }
                    if (res.data.data.status == "CORRECT") {
                        notification.success(
                            {
                                placement: 'bottomRight',
                                bottom: 50,
                                duration: 1,
                                message: intl.get("wsd.i18n.sys.basicd.templated.reminder"),
                                description: intl.get("wsd.global.tip.checked"),
                            }
                        )
                        ruleList[index].status = "CORRECT"
                    }

                    this.setState({
                        ruleList
                    })
                })
            }

            return
        }
        if ((name == 'MaintRuleTypeTopBtn')) {
            const { rightData } = this.state
            if (!rightData) {
              notification.warning(
                {
                  placement: 'bottomRight',
                  bottom: 50,
                  duration: 1,
                  message: intl.get("wsd.global.tip.title1"),
                  description: intl.get("wsd.global.tip.content1")
                }
              )
              return
            }
            this.props.callBackBanner({ menuName: intl.get("wsd.i18n.sys.three.rule"), url: "Basicd/Coded/MaintainCodeRule", id: 450, parentId: 140 });
            return;
        }
    };
    closeAddRule = () => {
        this.setState({
            isShowAddRule: false,
        });
    };
    //关闭修改规则
    closeModifyAddRule = () => {
        this.setState({
            isModifyAddRule: false
        })
    }
    //查看节点新增
    onClickCheck1 = (ruleId, position, e) => {
        e.stopPropagation()
        this.setState({
            isShowCheckModal: true,
            nodetype: "add",
            position: position,
            ruleId: ruleId,
        });
    }
    //查看节点修改
    onClickCheck = (ruleId, position, e) => {
        e.stopPropagation()
        this.setState({
            isShowCheckModal: true,
            ruleId: ruleId,
            position: position,
            nodetype: "modify"
        });
    };
    closeCheckModal = () => {
        this.setState({
            isShowCheckModal: false,

        });
    };
    //刷新节点
    updateNode = (value) => {
        const { ruleList, ruleId, position } = this.state
        let index = ruleList.findIndex(item => item.id == ruleId)
        ruleList[index][`position${position}`] = { id: value.id, name: value.ruleCellName }
    }
    render() {
        const { intl } = this.props.currentLocale
        const columns1 = [
            {
                title: intl.get("wsd.i18n.base.docTem.docobject1"),
                dataIndex: 'boName',
                key: 'boName',

            },
        ]
        const columns2 = [
            {
                title: intl.get("wsd.i18n.sys.ipt.statusj"),
                dataIndex: 'status',
                key: 'status',
                render: text => {
                    if (text == "ERROR") {
                        return <MyIcon type="icon-exit" style={{ fontSize: 18, verticalAlign: "middle" }} />
                    } else if (text == "CORRECT") {
                        return <MyIcon type="icon--zhengque" style={{ fontSize: 18, verticalAlign: "middle" }} />

                    } else {
                        return intl.get("wsd.i18n.base.coderulde.other")

                    }
                }
            },
            {
                title: intl.get("wsd.i18n.base.coderule.name1"),
                dataIndex: 'ruleName',
                key: 'ruleName',
            },
            {
                title: intl.get("wsd.i18n.base.coderule.position1"),
                dataIndex: 'position1',
                key: 'position1',
                render: (text, record) => {
                    if (text) {
                        return <a onClick={this.onClickCheck.bind(this, record.id, 1)}>{text.name}</a>
                    } else {
                        return <a onClick={this.onClickCheck1.bind(this, record.id, 1)}>{intl.get("wsd.i18n.base.coderulde.addparam")}</a>
                    }
                }
            },
            {
                title: intl.get("wsd.i18n.base.coderule.position2"),
                dataIndex: 'position2',
                key: 'position2',
                render: (text, record) => {
                    if (text) {
                        return <a onClick={this.onClickCheck.bind(this, record.id, 2)}>{text.name}</a>
                    } else {
                        return <a onClick={this.onClickCheck1.bind(this, record.id, 2)}>{intl.get("wsd.i18n.base.coderulde.addparam")}</a>
                    }
                }
            },

            {
                title: intl.get("wsd.i18n.base.coderule.position3"),
                dataIndex: 'position3',
                key: 'position3',
                render: (text, record) => {
                    if (text) {
                        return <a onClick={this.onClickCheck.bind(this, record.id, 3)}>{text.name}</a>
                    } else {
                        return <a onClick={this.onClickCheck1.bind(this, record.id, 3)}>{intl.get("wsd.i18n.base.coderulde.addparam")}</a>
                    }
                }
            },
            {
                title: intl.get("wsd.i18n.base.coderule.position4"),
                dataIndex: 'position4',
                key: 'position4',
                render: (text, record) => {
                    if (text) {
                        return <a onClick={this.onClickCheck.bind(this, record.id, 4)}>{text.name}</a>
                    } else {
                        return <a onClick={this.onClickCheck1.bind(this, record.id, 4)}>{intl.get("wsd.i18n.base.coderulde.addparam")}</a>
                    }
                }
            },
            {
                title: intl.get("wsd.i18n.base.coderule.position5"),
                dataIndex: 'position5',
                key: 'position5',
                render: (text, record) => {
                    if (text) {
                        return <a onClick={this.onClickCheck.bind(this, record.id, 5)}>{text.name}</a>
                    } else {
                        return <a onClick={this.onClickCheck1.bind(this, record.id, 5)}>{intl.get("wsd.i18n.base.coderulde.addparam")}</a>
                    }
                }
            },
            {
                title: intl.get("wsd.i18n.base.coderule.position6"),
                dataIndex: 'position6',
                key: 'position6',
                render: (text, record) => {
                    if (text) {
                        return <a onClick={this.onClickCheck.bind(this, record.id, 6)}>{text.name}</a>
                    } else {
                        return <a onClick={this.onClickCheck1.bind(this, record.id, 6)}>{intl.get("wsd.i18n.base.coderulde.addparam")}</a>
                    }
                }
            },
            {
                title: intl.get("wsd.i18n.base.coderule.position7"),
                dataIndex: 'position7',
                key: 'position7',
                render: (text, record) => {
                    if (text) {
                        return <a onClick={this.onClickCheck.bind(this, record.id, 7)}>{text.name}</a>
                    } else {
                        return <a onClick={this.onClickCheck1.bind(this, record.id, 7)}>{intl.get("wsd.i18n.base.coderulde.addparam")}</a>
                    }
                }
            },
        ]
        const { selectedRowKeys2 } = this.state

        const rowSelection2 = {
            selectedRowKeys2,
            onChange: (selectedRowKeys, selectedRows) => {
                this.setState({
                    selectedRowKeys2: selectedRowKeys
                })
            },

        };
        return (
            <div className={style.main}>
                <section className={style.leftbox}  >
                    <div className={style.topButton}>

                        {/*新增*/}
                        <PublicButton name={'新增'} title={'新增'} icon={'icon-add'} afterCallBack={this.onClickHandle1.bind(this, 'AddTopBtn')} />
                        {/*新增*/}
                        <PublicButton name={'修改'} title={'修改'} icon={'icon-xiugaibianji'}  afterCallBack={this.onClickHandle1.bind(this, 'ModifyTopBtn')} />
                        {/*删除*/}
                        <PublicButton title={"删除"} useModel={true} content={'你确定要删除吗？'} verifyCallBack={this.deleteVerifyCallBack} afterCallBack={this.onClickHandle1.bind(this, "DeleteTopBtn")} icon={"icon-delete"} />

                        {this.state.isShowModal && <AddBusinessObject
                            data={this.state.leftmenu}
                            type={this.state.wftype}
                            title={this.state.ModalTitle}
                            handleCancel={this.closeAddBusinessObjectModal.bind(this)}
                            addCoderulebo={this.addCoderulebo}
                            updateCoderulebo={this.updateCoderulebo}
                        />}

                    </div>
                    <Table
                        rowKey={record => record.id}
                        columns={columns1}
                        size="small"
                        dataSource={this.state.wfList}
                        pagination={false}
                        rowClassName={this.setClassName1}
                        onRow={(record, index) => {
                            return {
                                onClick: event => {

                                    this.getInfo1(record, event);
                                },
                            };
                        }}
                    />
                </section>
                <div>
                    <RightTags height={this.props.height+40}>
                        <section className={style.rightbox} >
                            {/* <RightBox callBackBanner={this.props.callBackBanner} data={this.state.leftValues}></RightBox> */}
                            <div className={style.topButton}>
                                {/* <AddTopBtn onClickHandle={this.onClickHandle2} />
                                <ModifyTopBtn onClickHandle={this.onClickHandle2} />
                                <DeleteTopBtn onClickHandle={this.onClickHandle2} /> */}
                                {/*新增*/}
                                <PublicButton name={'新增'} title={'新增'} icon={'icon-add'} afterCallBack={this.onClickHandle2.bind(this, 'AddTopBtn')} />
                                {/*修改*/}
                                <PublicButton name={'修改'} title={'修改'} icon={'icon-xiugaibianji'} afterCallBack={this.onClickHandle2.bind(this, 'ModifyTopBtn')} />
                                {/*删除*/}
                                <PublicButton title={"删除"} useModel={true} content={'你确定要删除吗？'} verifyCallBack={this.deleteVerifyCallBack2} afterCallBack={this.onClickHandle2.bind(this, "DeleteTopBtn")} icon={"icon-delete"} />
                                {/* <CheckBtn onClickHandle={this.onClickHandle2} /> */}
                                 {/*校验*/}
                                <PublicButton name={'校验'} title={'校验'} icon={'icon-yanzheng'} afterCallBack={this.onClickHandle2.bind(this, 'CheckBtn')} />
                                  {/*新增*/}
                                <PublicButton name={'维护编码规则'} title={'维护编码规则'} icon={'icon-houqiweihuweihuweihuguanli'} afterCallBack={this.onClickHandle2.bind(this, 'MaintRuleTypeTopBtn')} />

                                {this.state.isModifyAddRule && <ModifyRule data={this.state.rightData}
                                    handleCancel={this.closeModifyAddRule.bind(this)} updateData={this.updateData} />}
                              {this.state.isShowAddRule && <AddRule handleCancel={this.closeAddRule.bind(this)} ruleBoId={this.state.leftmenu.id} AddRule={this.AddRule} />}

                            </div>
                            <Table
                                size="small"
                                columns={columns2}
                                rowKey={record => record.id}
                                rowSelection={rowSelection2}
                                dataSource={this.state.ruleList}

                                pagination={false}
                                rowClassName={this.setClassName2}
                                onRow={(record, index) => {
                                    return {
                                        onClick: event => {
                                            this.getInfo2(record, event);
                                        },
                                    };
                                }}
                            />
                            {this.state.isShowCheckModal && (
                                <CheckModal
                                    updateNode={this.updateNode}
                                    boId={this.state.leftmenu.id}
                                    position={this.state.position}
                                    ruleId={this.state.ruleId}
                                    handleCancel={this.closeCheckModal.bind(this)}
                                    type={this.state.nodetype}
                                />
                            )}
                        </section>
                    </RightTags>
                </div>

            </div>
        )
    }
}
const mapStateToProps = state => {
    return {
        currentLocale: state.localeProviderData,
    }
};
const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(Object.assign({}, codeRuleAction), dispatch)
});
// export default connect(state => ({ currentLocale: state.localeProviderData }))(CodeRule);
export default connect(mapStateToProps, mapDispatchToProps)(CodeRule);
