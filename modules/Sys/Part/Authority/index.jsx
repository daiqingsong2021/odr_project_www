import react, { Component } from 'react'
import style from './index.less'
import { Button, Checkbox, Table, Row, Col, message } from 'antd'
import intl from 'react-intl-universal'

let rowKeys = [], funcKeys = []

/* api */
import * as util from '../../../../utils/util';
import axios from '../../../../api/axios';
import { getAuthListByRoleId, updateRoleAuth } from '../../../../api/api';

export class Authority extends Component {
    constructor(props) {
        super(props)
        this.state = {
            columns: [{
                title: intl.get('wsd.i18n.sys.part.fucModule'),
                width: 150,
                dataIndex: 'menuName',
            }, {
                title: intl.get('wsd.i18n.sys.part.fucPower'),
                width: 650,
                dataIndex: 'funcList',
                render: (data, record, index) => {
                    return (
                        <Row>
                            {
                                data && data.map((v, i) => {
                                    return <Col span={10} key={i}><Checkbox checked={this.state.selectedFuncKeys.findIndex(key => key === v.funcCode) >= 0 ? true : false} onChange={this.getCheckboxValue.bind(this, v, record)}>{v.funcName}</Checkbox></Col>
                                })
                            }
                        </Row>
                    )
                }
            }],
            data: [],
            selectedRowKeys: [],
            selectedFuncKeys: []
        }
    }

    componentDidMount() {
        this.props.rightData ? this.getAuthListByRoleId(this.props.rightData.id) : null;
    }

    // 获取checkbox值
    getCheckboxValue = (v, record, event) => {
        const { selectedRowKeys, selectedFuncKeys } = this.state
        const index = selectedFuncKeys.findIndex(key => key === v.funcCode);
        const index2 = selectedRowKeys.findIndex(key => key === record.menuCode);
        if (index > -1) {
            selectedFuncKeys.splice(index, 1)
        } else {
            selectedFuncKeys.push(v.funcCode)
            if (index2 > -1) {
                index > -1 ? selectedRowKeys.splice(index2, 1) : null
            } else {
                selectedRowKeys.push(record.menuCode)
            }
        }
        this.setState({
            selectedRowKeys,
            selectedFuncKeys
        })
    }

    // 初始化state数据
    initStateData = (data) => {
        data.map(v => {
            if (v.check != 0) {
                v.menuCode ? rowKeys.push(v.menuCode) : funcKeys.push(v.funcCode)
            }
            if (v.children) {
                this.initStateData(v.children)
            }
            if (v.funcList) {
                this.initStateData(v.funcList)
            }
        })
        return {
            rowKeys,
            funcKeys
        }
    }

    // 根据Roleid获取权限
    getAuthListByRoleId = (id) => {
        axios.get(getAuthListByRoleId(id)).then(res => {
            rowKeys = []
            funcKeys = []
            const { data } = res.data
            const adata = this.initStateData(data)
            this.setState({
                data,
                selectedRowKeys: adata.rowKeys,
                selectedFuncKeys: adata.funcKeys
            })
        });
    }

    onSelectChange = (record, selected, selectedRows, event) => {
        const { selectedRowKeys, selectedFuncKeys } = this.state
 
        const index = selectedRowKeys.findIndex(key => key === record.menuCode)
        if (index >= 0) {
            selectedRowKeys.splice(index, 1)
            if (record.children) {
                record.children.map(v => {
                    const index2 = selectedRowKeys.findIndex(key => key === v.menuCode)
                    selectedRowKeys.splice(index2, 1)
                    if (v.funcList) {
                        v.funcList.map(vc => {
                            const index3 = selectedFuncKeys.findIndex(key => key === vc.funcCode)
                            selectedFuncKeys.splice(index3, 1)
                        })
                    }
                })
            }
            if (record.funcList) {
                record.funcList.map(v => {
                    const index = selectedFuncKeys.findIndex(key => key === v.funcCode)
                    if(index >-1){
                        selectedFuncKeys.splice(index, 1)
                    }
                })
            }
        } else {
            selectedRowKeys.push(record.menuCode)
            if (record.children) {
                record.children.map(v => {
                    const index2 = selectedRowKeys.findIndex(key => key === v.menuCode)
                    index2 >= 0 ? null : selectedRowKeys.push(v.menuCode)
                    if (v.funcList) {
                        v.funcList.map(vc => {
                            const index3 = selectedFuncKeys.findIndex(key => key === vc.funcCode)
                            index3 >= 0 ? null : selectedFuncKeys.push(vc.funcCode)
                        })
                    }
                })
            }
            if (record.funcList) {
                record.funcList.map(v => {
                    const index = selectedFuncKeys.findIndex(key => key === v.funcCode)
                    selectedFuncKeys.push(v.funcCode)
                })
            }
        }
        this.setState({
            selectedRowKeys,
            selectedFuncKeys
        })
    }

    // 提交数据
    doUpdateRoleAuth = () => {
        const { selectedRowKeys, selectedFuncKeys } = this.state
        const { rightData } = this.props
        const values = []
        selectedRowKeys.map(v => {
            values.push({
                roleId: rightData.id,
                resCode: v,
                resType: 'menu'
            })
        })
        selectedFuncKeys.map(v => {
            values.push({
                roleId: rightData.id,
                resCode: v,
                resType: 'func'
            })
        })
        axios.put(updateRoleAuth(rightData.id), values, true).then(res => {
            //this.props.closeRightBox();
        });
    }

    //全选
    onSelectAll = (selected, selectedRows, changeRows) => {
        const { selectedRowKeys, selectedFuncKeys, data } = this.state
        if (selectedRowKeys.length > 0) {
            this.setState({
                selectedRowKeys: [],
                selectedFuncKeys: []
            })
        } else {
            selectedRows.map(v => {
                selectedRowKeys.push(v.menuCode)
                if (v.funcList) {
                    v.funcList.map(vs => {
                        selectedFuncKeys.push(vs.funcCode)
                    })
                }
            })
            this.setState({
                selectedRowKeys,
                selectedFuncKeys
            })
        }
    }

    render() {
        const { selectedRowKeys } = this.state
        const rowSelection = {
            selectedRowKeys,
            onSelect: this.onSelectChange,
            getCheckboxProps: record => ({}),
            onSelectAll: this.onSelectAll
        }

        return (
            <div className={style.main}>
                <div className={style.tablescroll}>
                    <Table
                        rowKey={_r => _r.menuCode}
                        columns={this.state.columns}
                        dataSource={this.state.data}
                        defaultExpandAllRows={true}
                        pagination={false}
                        bordered={true}
                        rowSelection={rowSelection}
                        scroll={{ x: 650 }}
                    />
                </div>

                <div className={style.footBtn}>
                    {/* <div className={style.allCheckBox}><Checkbox onChange={this.onCheckAllChange} indeterminate={this.state.data.length !== this.state.selectedRowKeys.length && this.state.selectedRowKeys.length !== 0} checked={this.state.data.length === this.state.selectedRowKeys.length}>全选</Checkbox></div> */}
                    <div className={style.btn}>
                        <Button type="primary" onClick={this.doUpdateRoleAuth}>保存</Button>
                        <Button className={style.ml10} onClick={this.props.closeRightBox}>取消</Button>
                    </div>
                </div>
            </div>
        )
    }


}


export default Authority

