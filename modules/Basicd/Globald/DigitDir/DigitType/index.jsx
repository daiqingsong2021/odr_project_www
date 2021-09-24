import React, { Component } from 'react'
import intl from 'react-intl-universal'
import { Table, Icon, Select, Spin, Checkbox, notification, Input, Popconfirm, Form } from 'antd'
import style from './style.less'
import EditGtModal from "./EditGtModal"
import PublicButton from '../../../../../components/public/TopTags/PublicButton'
import * as util from '../../../../../utils/util';
import {updateDictSortNum_} from '../../../../../api/suzhou-api'
//api
import {
    getDictTypeCodeList,
    addDictTypeCode,
    getDictTypeCodeInfoById,
    updateDictTypeCode,
    deleteDictTypeCode
} from '../../../../../api/api'
import axios from '../../../../../api/axios';
const FormItem = Form.Item;
const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
    <EditableContext.Provider value={form}>
        <tr {...props} />
    </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
    getInput = () => {
        if (this.props.inputType === 'text') {
            return <Input maxLength={10} type="number" />
        }
        return <Input maxLength={10} type="number" />;
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
                                        initialValue: record[dataIndex],
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



class DigitTypeTable extends Component {
    constructor(props) {
        super(props)
        this.state = {
            initDone: false,
            visible: false,
            title: '',
            data: [],
            currentRow: null,
            dataMap: [],
            editingKey: '',
            activeIndex: null,
            amendData: {},
            dictCodeChangeVal: '',
            dictNameChange: '',
            editAuth: true
        }
    }

    onClickHandle = (name) => {
        if (name == "AddSameBtn") {
            this.setState(
                { title: '新增码值', visible: true })
        }
        // if (name == "AddNextBtn") {
        //     this.setState(
        //         { title: '新增下级', visible: true })
        // }
        if (name == 'DeleteTopBtn') {
            this.deleteDictTypeCode()
        }
        if(name == 'up' || name == 'down'){
            this.updateDictSortNum(name)
        }
    }

    handleCancel = (e) => {
        this.setState({ visible: false })
    }

    componentDidMount() {
        this.getDictTypeCodeList();
    }

    // 获取字典码值列表
    getDictTypeCodeList = () => {
        axios.get(getDictTypeCodeList(this.props.data.typeCode)).then(res => {
            const { data } = res.data
            const dataMap = util.dataMap(data ? data : []);
            this.setState({
                data: data,
                dataMap
            })
        })
    }


    // 字典码值基本信息
    getDictTypeCodeInfoById = (id) => {
        axios.get(getDictTypeCodeInfoById(id)).then(res => {
        })
    }

    // 删除字典码值
    deleteDictTypeCode = () => {
        let { currentRow } = this.state;
        axios.deleted(deleteDictTypeCode, { data: [currentRow.id] }, true).then(res => {
            const { data, dataMap } = this.state;
            util.deleted(data, dataMap, currentRow);
            let dataMap1 = util.dataMap(data)
            this.setState({
                data,
                dataMap: dataMap1,
                currentRow: null
            });
        })
    }


    //码值排序
    updateDictSortNum = (upOrDown) => {
        this.hasRecord();
        let { currentRow } = this.state;
        axios.put(updateDictSortNum_(currentRow.id,upOrDown),true).then(res => {
            this.setState({
                data:res.data.data
            })
        })

    }

    // 新增同级及新增下级更新表格数据
    updateDictTableData = (ndata) => {
        axios.post(addDictTypeCode, ndata, true).then(res => {
            this.getDictTypeCodeList()
        })

    }



    setClassName = (record, index) => {
        //判断索引相等时添加行的高亮样式
        return record.id === this.state.activeIndex ? 'tableActivty' : "";
    }

    getInfo = (record, index) => {
        let id = record.id, records = record, builtIn = record.builtIn || 0;
        let editAuth = builtIn == 0 ? true : false;

        this.setState({
            editAuth: editAuth,
            activeIndex: id,
            currentRow: record
        })

    }


    //判断是否有选中数据
    hasRecord = () => {
        if (!this.state.currentRow) {
            notification.warning(
                {
                    placement: 'bottomRight',
                    bottom: 50,
                    duration: 2,
                    message: '警告',
                    description: '请勾选数据操作'
                }
            )
            return false;
        } else {
            return true
        }
    }

    //表格修改
    amendClick = (data) => {
        this.setState({
            amendData: data
        })
    }

    //表格修改取消
    amendCancelClick = (data) => {
        this.setState({
            amendData: {}
        })
    }

    dictCodeChange = (e) => {
        this.setState({
            dictCodeChangeVal: e.target.value
        })
    }

    dictNameChange = (e) => {
        this.setState({
            dictNameChange: e.target.value
        })
    }

    //表格修改确认
    amendAmendClick = (record) => {
        let { dictCodeChangeVal, dictNameChange, data, dataMap } = this.state;
        if (dictCodeChangeVal == '' && dictNameChange == '') {
            this.setState({
                amendData: {},
            })
            return
        } else {
            let obj = {
                ...record,
                dictCode: dictCodeChangeVal == '' ? record.dictCode : dictCodeChangeVal,
                dictName: dictNameChange == '' ? record.dictName : dictNameChange
            }

            axios.put(updateDictTypeCode, obj, true, '修改成功').then(res => {
                util.modify(data, dataMap, record, res.data.data);
                this.setState({
                    data,
                    amendData: {},
                    dictCodeChangeVal: '',
                    dictNameChange: ''
                })
            })
        }

    }

    render() {

        let columns = [
            {
                title: "码值",
                dataIndex: 'dictCode',
                width: "35%",
                render: (text, render) => {
                    if (this.state.amendData.id == render.id) {
                        return <Input defaultValue={text} style={{ width: '66%' }} onChange={this.dictCodeChange} maxLength={33} minLength={1} />
                    } else {
                        return text
                    }
                }
            },
            {
                title: "说明",
                dataIndex: 'dictName',
                width: "35%",
                render: (text, render) => {
                    if (this.state.amendData.id == render.id) {
                        return <Input defaultValue={text} style={{ width: '66%' }} onChange={this.dictNameChange} maxLength={33} minLength={1} />
                    } else {
                        return text
                    }
                }
            },
            {
                title: '是否内置',
                dataIndex: 'builtIn',
                key: 'builtIn',
                width: "10%",
                render: text => text ? intl.get('wsd.i18n.sys.menu.yes') : intl.get('wsd.i18n.sys.menu.no')
            },
            {
                title: '操作',
                dataIndex: 'operation',
                width: "20%",
                render: (text, record) => {
                    if (this.state.editAuth == true) {
                        if (this.state.amendData.id == record.id) {
                            return (
                                <span>
                                    <a className={style.amendClick} onClick={this.amendAmendClick.bind(this, record)} style={{ marginRight: 5 }}>确认</a>
                                    <a onClick={this.amendCancelClick.bind(this, record)} className={style.amendClick}>取消</a>
                                </span>
                            )
                        } else {
                            return (
                                <a onClick={this.amendClick.bind(this, record)} className={style.amendClick}>修改</a>
                            )
                        }
                    } else {
                        return (
                            <span className={style.amendClick}>修改</span>
                        )
                    }
                },
            },
        ];
        const components = {
            body: {
                row: EditableFormRow,
                cell: EditableCell,
            },
        };

        const column = columns.map((col) => {
            if (!col.editable) {
                return col;
            }
            return {
                ...col,
                onCell: record => ({
                    record,
                    inputType: col.dataIndex === 'relationtype' ? 'number' : 'text',
                    dataIndex: col.dataIndex,
                    title: col.title,
                    width: 220,
                    editing: this.isEditing(record),
                }),
            };
        });

        return (
            <div className={style.main}>
                <h3 className={style.listTitle}>字典码值</h3>
                <div className={style.rightTopTogs}>
                    <PublicButton title={'新增'} icon={'icon-add'}
                        afterCallBack={this.onClickHandle.bind(this, 'AddSameBtn')}
                        res={'MENU_EDIT'} />

                    {/* <DeleteTopBtn onClickHandle={this.onClickHandle} /> */}
                    <PublicButton name={'删除'} title={'删除'} icon={'icon-shanchu'}
                        useModel={true} edit={this.state.editAuth}
                        verifyCallBack={this.hasRecord}
                        afterCallBack={this.onClickHandle.bind(this, 'DeleteTopBtn')}
                        content={'你确定要删除吗？'}
                        res={'MENU_EDIT'}
                    />
                    <PublicButton title={'上移'} icon={'icon-moveUp'}
                        res={'MENU_EDIT'} afterCallBack={this.onClickHandle.bind(this, 'up')}/>
                    <PublicButton title={'下移'} icon={'icon-moveDown'}
                        res={'MENU_EDIT'} afterCallBack={this.onClickHandle.bind(this, 'down')}/>
                </div>
                {/* <EditableTable data={this.state.dictTypeCodeList} currentLData={this.props.data} getDictTypeCodeList={this.getDictTypeCodeList}
                    ref={r => this.editableTable = r}></EditableTable> */}

                <Table
                    rowKey={record => record.id}
                    className={style.EditableTable}
                    pagination={false}
                    components={components}
                    bordered
                    dataSource={this.state.data}
                    columns={column}
                    size="small"
                    scroll={{ x: 900 }}
                    rowClassName={this.setClassName}
                    onRow={(record, index) => {
                        return {
                            onClick: (event) => {
                                this.getInfo(record, index)
                            }
                        }
                    }}
                />

                {this.state.visible && <EditGtModal
                    title={this.state.title}
                    handleCancel={this.handleCancel}
                    record={this.state.currentRow}
                    updateDictTableData={this.updateDictTableData}
                    currentLData={this.props.data}
                    visible={this.state.visible}
                />}
            </div>
        )
    }
}

export default DigitTypeTable

