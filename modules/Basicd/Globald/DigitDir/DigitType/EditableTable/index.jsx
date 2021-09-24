import {
    Table, Input, InputNumber, Popconfirm, Form, Select
} from 'antd';
import style from "./style.less"
import { updateDictTypeCode } from '../../../../../../api/api'
import axios from '../../../../../../api/axios';
const Option = Select.Option;

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
            return <Input />
        }
        return <Input />;
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

class EditableTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            editingKey: '',
            activeIndex: '',
            currentRow: {}
        };
        this.columns = [
            {
                title: "码值",
                dataIndex: 'dictCode',
                width: '30%',
                editable: true,
            },
            {
                title: "说明",
                dataIndex: 'dictName',
                width: '30%',
                editable: true,
            },

            {
                title: '操作',
                dataIndex: 'operation',
                width: '40%',
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
                                    <a onClick={() => this.edit(record.id)}>修改</a>
                                )}
                        </div>
                    );
                },
            },
        ];
    }

    isEditing = record => record.id === this.state.editingKey;

    cancel = () => {
        this.setState({ editingKey: '' });
    };

    save(form, id) {
        form.validateFields((error, row) => {
            if (error) {
                return;
            }

            const newData = [...this.props.data];
            const index = newData.findIndex(item => id === item.id);
            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, {
                    ...item,
                    ...row,
                });
                axios.put(updateDictTypeCode, newData[index], true).then(res => {
                    this.setState({ data: newData, editingKey: '' });
                })
            }
        });
    }

    edit(id) {
        this.setState({ editingKey: id });
    }

    componentDidMount() {
        this.props.getDictTypeCodeList()
    }


    getInfo = (record, index) => {
        let id = record.id, records = record
        if (this.state.activeIndex == id) {
            id = ''
            records = ''
        }
        this.setState({
            activeIndex: id,
            currentRow: record
        })
    }

    setClassName = (record, index) => {
        //判断索引相等时添加行的高亮样式
        return record.id === this.state.activeIndex ? `${style['clickRowStyl']}` : "";
    }

    render() {
        const components = {
            body: {
                row: EditableFormRow,
                cell: EditableCell,
            },
        };

        const columns = this.columns.map((col) => {
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
                    editing: this.isEditing(record),
                }),
            };
        });
        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
            },
            getCheckboxProps: record => ({
                disabled: record.name === 'Disabled User', // Column configuration not to be checked
                name: record.name,
            }),
        };

        const { data } = this.state
        return (
            <div className={style.main}>
                <Table
                    rowKey={record => record.id}
                    className={style.EditableTable}
                    rowSelection={rowSelection}
                    pagination={false}
                    components={components}
                    bordered
                    dataSource={data.length > 0 ? data : this.props.data}
                    columns={columns}
                    rowClassName="editable-row"
                    size="small"
                    rowClassName={this.setClassName}
                    onRow={(record, index) => {
                        return {
                            onClick: (event) => {
                                this.getInfo(record, index)
                            }
                        }
                    }}
                />
            </div>
        );
    }
}

export default EditableTable
