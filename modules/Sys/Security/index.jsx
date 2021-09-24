import React, { Component } from 'react'
import { Table, Progress, Spin, Modal, Input, Form, InputNumber, Popconfirm, Select, notification } from 'antd'
import intl from 'react-intl-universal'
import style from './style.less'
import TopTags from "./TopTags"
import axios from "../../../api/axios"
import {
    getLevelList,getdictTree,updateLevel
} from "../../../api/api"
import * as dataUtil from '../../../utils/dataUtil';
const Confirm = Modal.confirm;
const Option = Select.Option

const FormItem = Form.Item;
const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
    <EditableContext.Provider value={form}>
        <tr {...props} />
    </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }
    //获取密级
    getSecutyLevelList = () => {
        if (!this.state.secutyLevelList) {
            axios.get(getdictTree("comm.secutylevel")).then(res => {
                if (res.data.data) {
                    this.setState({
                        secutyLevelList: res.data.data,
                    })
                }
            })
        }

    }
    getInput = () => {
        if (this.props.inputType === 'select') {
            return <Select onDropdownVisibleChange={this.getSecutyLevelList}
            size="small" style={{ width:"100%" }}  
        >
            {this.state.secutyLevelList ? this.state.secutyLevelList.map(item => {
                return <Option value={item.value} key={item.value}>{item.title}</Option>
            }):this.props.record.level?<Option value={this.props.record.level.id} key={this.props.record.level.id}>{this.props.record.level.name}</Option>:null}
        </Select>
        }
        return <Input size="small" style={{ width: 80 }} />;
    };

    render() {
        const {
            editing,
            dataIndex,
            title,
            inputType,
            record,
            index,
            ...restProps
        } = this.props;
        return (
            <EditableContext.Consumer>
                {(form) => {
                    const { getFieldDecorator } = form;
                    return (
                        <td {...restProps}>
                            {editing ? (
                                <FormItem style={{ margin: 0 }}>
                                    {getFieldDecorator(dataIndex, {
                                        rules: [{
                                            required: true,
                                            message: `请输入 ${title}!`,
                                        }],
                                        initialValue:dataIndex=="level"? record[dataIndex]?record[dataIndex].id:null: record[dataIndex],
                                    })(this.getInput())}
                                </FormItem>
                            ) : restProps.children}
                        </td>
                    );
                }}
            </EditableContext.Consumer>
        );
    }
}

export class PlanComponentsLog extends Component {
    constructor(props) {
        super(props)
        this.state = {
           
            initDone: false,
            columns: [
                {
                    title: "序号",
                    dataIndex: 'sort',
                    key: 'sort',
                    render: (text, record, index) => index+1
                },
                {
                    title: "归属组织",
                    dataIndex: 'org',
                    key: 'org',
                    render: (text) => text ? text.name : null
                },
                {
                    title: "归属部门",
                    dataIndex: 'department',
                    key: 'department',
                    render: (text) => text ? text.name : null
                },
                {
                    title: "姓名",
                    dataIndex: 'name',
                    key: 'name',

                },
                {
                    title: "用户名",
                    dataIndex: 'userName',
                    key: 'userName',
                },

                {
                    title: "密级",
                    dataIndex: 'level',
                    key: 'level',
                    editable: true,
                    render: (text, record) => <div className="editable-row-text">{text ? text.name : null}</div>
                },
                {
                    title: '操作',
                    key: 'action',
                    render: (text, record) => {
                        const editable = this.isEditing(record);
                        return (
                            <div className="editable-row-operations">
                                {editable ? (
                                    <span>
                                        <EditableContext.Consumer>
                                            {form => (
                                                <a
                                                    href="javascript:;"
                                                    onClick={() => this.save(form, record.id)}
                                                    style={{ marginRight: 8 }}
                                                >
                                                    保存
                                                </a>
                                            )}
                                        </EditableContext.Consumer>
                                        <Popconfirm
                                            title="确定取消?"
                                            onConfirm={() => this.cancel(record.id)}
                                            okText="确认"
                                            cancelText="取消"
                                        >
                                            <a>取消</a>
                                        </Popconfirm>
                                    </span>
                                ) : (
                                        <a onClick={() => this.edit(record.id)}>编辑</a>
                                    )}
                            </div>
                        );
                    },
                }
            ],
            data: [],
            editingKey: '',
            distributionModaVisible: false,
            activeStyle: 1,
            activeIndex: [],
            selectData: [],
            selectedRowKeys: [],
            pageSize: 10,
            currentPageNum: 1

        }
    }

    isEditing = record => record.id === this.state.editingKey;

    cancel = () => {
        this.setState({ editingKey: '' });
    };

    componentDidMount() {
        this.getList()
        axios.get(getdictTree("comm.secutylevel")).then(res => {
            if (res.data.data) {
                this.setState({
                    secutyLevelList: res.data.data,
                })
            }
        })
    }
    getList = () => {
        const {level,departmentId,name,orgId}=this.state
        let data={
            level,
            departmentId,
            name,
            orgId,
           
        }
        axios.post(getLevelList(this.state.pageSize, this.state.currentPageNum), data ).then(res => {
            if (res.data.data) {
              
                this.setState({
                    data: res.data.data,
                    total:res.data.total
                })
            }
        })
    }


    save(form, key) {
        form.validateFields((error, row) => {
            if (error) {
                return;
            }
            const newData = [...this.state.data];
            const index = newData.findIndex(item => key === item.id);
            axios.put(updateLevel, { ...row, id: newData[index]['id'] }, true).then(res => {
                if (index > -1) {
                   
                    let i=this.state.secutyLevelList.findIndex(item=>item.value==row.level)
               
                    let newLevel=this.state.secutyLevelList[i]
                    newData[index].level={id:newLevel.value,name:newLevel.title};
                  
                    this.setState({ data: newData, editingKey: '' });
                } else {
                    newData.push(row);
                    this.setState({ data: newData, editingKey: '' });
                }
            })
        });
       
    }

    edit(key) {
        this.setState({ editingKey: key });
    }

    getInfo = (record, index) => {

        this.setState({
            activeIndex: record.id,
            selectData: record
        })

    };

    setClassName = (record, index) => {
        //判断索引相等时添加行的高亮样式
        return record.id === this.state.activeIndex ? 'tableActivty' : "";
    }

    //设置密级
    selectLevel = (value, e) => {
        this.setState({
            level: value,
            currentPageNum:1
        },()=>{
            this.getList()
        })
    }
    //选择组织
    selectOrg=(value)=>{
        this.setState({
            orgId: value,
            currentPageNum:1
        },()=>{
            this.getList()
        })
    }
    //选择部门
    selectDepartment = (value, e) => {
        this.setState({
            departmentId: value,
            currentPageNum:1
        },()=>{
            this.getList()
        })
    }
    //搜索姓名
    searchName=(value)=>{
        this.setState({
            name: value,
            currentPageNum:1
        },()=>{
            this.getList()
        })
    }

    render() {
        const components = {
            body: {
                row: EditableFormRow,
                cell: EditableCell,
            },
        };
        const { selectedRowKeys } = this.state
        const rowSelection = {
            selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
                this.setState({
                    selectedRowKeys: selectedRowKeys
                })
            }

        };

        const columns = this.state.columns.map((col) => {
            if (!col.editable) {
                return col;
            }
            return {
                ...col,
                onCell: record => ({
                    record,
                    inputType: col.dataIndex === 'level' ? 'select' : 'text',
                    dataIndex: col.dataIndex,
                    title: col.title,
                    editing: this.isEditing(record),
                }),
            };
        });
        let pagination = {
            total: this.state.total,
            // hideOnSinglePage: true,
            current: this.state.currentPageNum,
            pageSize: this.state.pageSize,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: total => `每页${this.state.pageSize},共${this.state.total}条`,
            onShowSizeChange: (current, size) => {
                this.setState({
                    pageSize: size,
                    currentPageNum: 1
                }, () => {
                    this.getList()
                })
            },
            onChange: (page, pageSize) => {
                this.setState({
                    currentPageNum: page
                }, () => {
                    this.getList()
                })
            }
        }
        return (
            <div className={style.main}>
                <TopTags
                    selectLevel={this.selectLevel} selectDepartment={this.selectDepartment} searchName={this.searchName}
                    selectOrg={this.selectOrg}
                    search={this.search} />
                <div  style={{ height: this.props.height }}>
                    <div className={style.leftMain}>
                        <div style={{ minWidth: 'calc(100vw - 60px)' }}></div>
                        <Table
                            rowKey={record => record.id}
                            components={components}
                            columns={columns}
                            dataSource={this.state.data}
                            size="small"
                            pagination={pagination}
                            rowClassName={this.setClassName}
                            rowSelection={rowSelection}
                            onRow={record => {
                                return {
                                    onClick: this.getInfo.bind(this, record),
                                };
                            }}
                        />
                    </div>
                </div>
            </div>
        )
    }
}

export default PlanComponentsLog
