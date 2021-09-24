import React from 'react'
import style from './style.less'
import { Table, Modal, Icon, Input, Button } from 'antd';
import _ from 'lodash'

const Search = Input.Search;
//分配modal，用于 组织机构，协作团队，项目团队
class Distribute extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            leftData: [],                             //左侧数据
            leftActiveKey: null,                  //左侧标记用于添加点击行样式
            rightActiveKey: null,                 //右侧标记用于添加点击行样式
            visible: true,                        //modal默认显示
            isMove: 'no',                         //配置按钮事件有效状态，right向右添加，left向左操作 no禁止操作
            locale: { emptyText: '暂无分配数据' },    //table初始化
            leftColumns: [                        //左侧表头
                {
                    title: '名称',
                    dataIndex: 'name',
                    key: 'name',
                    width: 100
                },
                {
                    title: '代码',
                    dataIndex: 'code',
                    key: 'code',
                    width: 100
                },
            ],
            rightColumns: [                       //右侧表头
                {
                    title: '名称',
                    dataIndex: 'name',
                    key: 'name',
                    width: 100
                },
                {
                    title: '账号',
                    dataIndex: 'code',
                    key: 'code',
                    width: 100
                },
            ],
            rightData: [],                        //右侧数据
            choiceData: []                         //选中数据
        }
    }
    componentDidMount() {
        this.setState({
            leftData: [{
                id: 1,
                name: '部门1',
                code: '100',
                children: [{
                    orgId: 1,
                    id: 101,
                    name: '张三',
                    code: 'qwqwewqewqe'
                }, {
                    orgId: 1,
                    id: 102,
                    name: '李四',
                    code: 'cadsdasdasd'
                }, {
                    orgId: 1,
                    id: 103,
                    name: '王五',
                    code: 'zcxczdqdqwd'
                }, {
                    orgId: 1,
                    id: 107,
                    name: '张三',
                    code: 'qwqwewqewqe'
                }, {
                    orgId: 1,
                    id: 108,
                    name: '李四',
                    code: 'cadsdasdasd'
                }, {
                    orgId: 1,
                    id: 109,
                    name: '王五',
                    code: 'zcxczdqdqwd'
                }]
            }, {
                id: 2,
                name: '部门1',
                code: '100',
                children: [{
                    orgId: 2,
                    id: 104,
                    name: '周六',
                    code: 'zxcqwdqwddsa'
                }, {
                    orgId: 2,
                    id: 105,
                    name: '马七',
                    code: 'weqsczcxzcxz'
                }, {
                    orgId: 2,
                    id: 106,
                    name: '老八',
                    code: '123dsdasdascd'
                }]
            }],
        })
    }

    //获取选中数据
    getInfo = (record, index, type) => {
        if (type == 'left') {
            let isMove = null;
            if (record.orgId) {
                var index = _.findIndex(this.state.rightData, function (e) {
                    return e.id == record.id
                })
                if (index != '-1') {
                    isMove = 'no'
                } else {
                    isMove = 'right'
                }
            }
            this.setState({
                leftActiveKey: record.id,
                rightActiveKey: null,
                isMove: isMove,
                choiceData: record
            })
        } else {
            this.setState({
                isMove: 'left',
                leftActiveKey: null,
                rightActiveKey: record.id,
                choiceData: record
            })
        }

    }
    //左侧table，点击时添加背景色
    setLeftClassName = (record, index) => {
        //判断索引相等时添加行的高亮样式
        return record.id === this.state.leftActiveKey ? `${style['clickRowStyl']}` : "";
    }
    //右侧table，点击时添加背景色
    setRightClassName = (record, index) => {
        //判断索引相等时添加行的高亮样式
        return record.id === this.state.rightActiveKey ? `${style['clickRowStyl']}` : "";
    }
    //左右按钮选择操作数据
    moveData = (type) => {
        var rightData = this.state.rightData
        if (type == 'left') {
            var choiceData = this.state.choiceData
            var index = _.findIndex(rightData, function (e) {
                return e.id == choiceData.id
            })
            if (index != '-1') {
                rightData.splice(index, 1);
            }
        } else {
            rightData.unshift(this.state.choiceData)
        }
        this.setState({
            rightData: rightData,
            isMove: 'no'
        })
    }
    //搜索
    onChange = (e) => {
        this.setState({
            leftData: [{
                orgId: 2,
                id: 104,
                name: '周六',
                code: 'zxcqwdqwddsa'
            }, {
                orgId: 2,
                id: 105,
                name: '马七',
                code: 'weqsczcxzcxz'
            }, {
                orgId: 2,
                id: 106,
                name: '老八',
                code: '123dsdasdascd'
            }]
        })
    }
    render() {
        return (
            <div className={style.main}>
                <div className={style.box}>
                    <Table className={style.tableBox}
                        rowKey={(record, index) => record.id}
                        columns={this.state.leftColumns}
                        scroll={{ y: 270 }}
                        dataSource={this.state.leftData} pagination={false}
                        size="small"
                        bordered
                        locale={this.state.locale}
                        rowClassName={this.setLeftClassName}
                        onRow={(record, index) => {
                            return {
                                onClick: (event) => {
                                    this.getInfo(record, index, 'left')
                                }
                            }
                        }
                        }
                    />
                    <div className={style.border}>
                        <div>
                            <Button onClick={this.moveData.bind(this, 'right')} disabled={this.state.isMove == 'right' ? false : 'disabled'}
                                icon='double-right' style={{ marginBottom: 10 }} />
                            <Button onClick={this.moveData.bind(this, 'left')} disabled={this.state.isMove == 'left' ? false : 'disabled'}
                                icon='double-left' />
                        </div>
                    </div>
                    <Table className={style.tableBox}
                        rowKey={(record, index) => record.id}
                        columns={this.state.rightColumns}
                        scroll={{ y: 260 }}
                        size="small"
                        dataSource={this.state.rightData} pagination={false}
                        bordered
                        locale={this.state.locale}
                        rowClassName={this.setRightClassName}
                        onRow={(record, index) => {
                            return {
                                onClick: (event) => {
                                    this.getInfo(record, index, 'right')
                                }
                            }
                        }
                        }
                    />
                </div>
            </div>
        )
    }
}

export default Distribute