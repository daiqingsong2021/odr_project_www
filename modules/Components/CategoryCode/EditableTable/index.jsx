import {
    Table, Input, InputNumber, Popconfirm, Form, Select
} from 'antd';
import style from "./style.less"
const Option = Select.Option;
const data = [{
    key: "1122",
    categoryCode: "STAGE",
    intro: "设计"
}];

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
        if (this.props.inputType === 'number') {
            return <Select style={{ width: "100%" }}>
                <Option value="设计">设计</Option>
                <Option value="全职">全职</Option>
            </Select>;
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
        this.state = { data, editingKey: '' };
        this.columns = [
            {
                title: '分类码',
                dataIndex: 'categoryCode',
                width: '25%',
                editable: false,
            },
            {
                title: '说明',
                dataIndex: 'intro',
                width: '25%',
                editable: true,
                render: (text, record) => <div className="editable-row-text">{text}</div>
            },
            {
                title: '操作',
                dataIndex: 'operation',
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
                                                onClick={() => this.save(form, record.key)}
                                                style={{ marginRight: 8 }}
                                            >
                                                保存
                        </a>
                                        )}
                                    </EditableContext.Consumer>
                                    <Popconfirm
                                        title="确定取消?"
                                        onConfirm={() => this.cancel(record.key)}
                                        okText="确认"
                                        cancelText="取消"
                                    >
                                        <a>取消</a>
                                    </Popconfirm>
                                </span>
                            ) : (
                                    <a onClick={() => this.edit(record.key)}>编辑</a>
                                )}
                        </div>
                    );
                },
            },
        ];
    }

    isEditing = record => record.key === this.state.editingKey;

    cancel = () => {
        this.setState({ editingKey: '' });
    };

    save(form, key) {
        form.validateFields((error, row) => {
            if (error) {
                return;
            }
            const newData = [...this.state.data];
            const index = newData.findIndex(item => key === item.key);
            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, {
                    ...item,
                    ...row,
                });
                this.setState({ data: newData, editingKey: '' });
            } else {
                newData.push(row);
                this.setState({ data: newData, editingKey: '' });
            }
        });
    }

    edit(key) {
        this.setState({ editingKey: key });
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

                    inputType: col.dataIndex === 'intro' ? 'number' : 'text',
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
        return (
            <div className={style.main}>
                <Table
                    className={style.EditableTable}
                    rowSelection={rowSelection}
                    pagination={false}
                    components={components}
                    bordered
                    dataSource={this.state.data}
                    columns={columns}
                    rowClassName="editable-row"
                    size="small"
                />
            </div>
        );
    }
}

export default EditableTable