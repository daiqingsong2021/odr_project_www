import { Table, Input, Popconfirm, Form, Select, notification } from 'antd';
import style from "./style.less"
import Assign from "./Assign"
import axios from "../../../../api/axios"
import {
    getClassifyTags,
    deleteclassifyassign,
    getclassifybyId,
    updateclassify,
    prepaContactsDel
} from "../../../../api/api"
import PublicButton from "../../../../components/public/TopTags/PublicButton"
import * as dataUtil from "../../../../utils/dataUtil";
import PublicTable from '../../../../components/PublicTable'
import LabelToolbar from '../../../../components/public/Layout/Labels/Table/LabelToolbar'
import LabelTableLayout from '../../../../components/public/Layout/Labels/Table/LabelTableLayout'
import LabelTable from '../../../../components/public/Layout/Labels/Table/LabelTable'
import LabelTableItem from '../../../../components/public/Layout/Labels/Table/LabelTableItem'

const Option = Select.Option;
const data = [];
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
        if (this.props.inputType === 'classify') {
            return (
                <Select style={{ width: "100%" }} size="small">
                    {this.props.classifylist && this.props.classifylist.map(item => {
                        return <Option value={item.id} key={item.id}>{item.classifyName}</Option>
                    })}
                </Select>
            );
        }

        return <Input size="small" />;
    };

    render() {
        const { editing, dataIndex, title, inputType, record, index, ...restProps } = this.props;
        return (
            <EditableContext.Consumer>
                {form => {
                    const { getFieldDecorator } = form;
                    return (
                        <td {...restProps}>
                            {editing ? (
                                <FormItem style={{ margin: 0 }}>
                                    {getFieldDecorator(dataIndex, {
                                        rules: [
                                            {
                                                required: true,
                                                message: `????????? ${title}!`,
                                            },
                                        ],
                                        initialValue: inputType == "classify" ? record[dataIndex]["id"] : record[dataIndex],
                                    })(this.getInput())}
                                </FormItem>
                            ) : (
                                    restProps.children
                                )}
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
            isaddip: false,
            data,
            editingKey: '',
            selectedRowKeys: [], //??????????????????
            activeIndex: null,
            rightData: null,
        };
        this.columns = [
            {
                title: "?????????",
                dataIndex: 'classifyType',
                render: (text, record) => text ? <div className="editable-row-text">{text.classifyName}</div> : null,
                editable: false,
            },
            {
                title: '??????',
                dataIndex: 'classify',

                render: (text, record) => text ? <div className="editable-row-text">{text.classifyName}</div> : null,
                editable: true,
            },

            {
                title: '??????',

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
                                                onClick={() => this.save(form, record)}
                                                style={{ marginRight: 8 }}
                                            >
                                                ??????
                      </a>
                                        )}
                                    </EditableContext.Consumer>
                                    <Popconfirm
                                        title="?????????????"
                                        onConfirm={() => this.cancel(record.id)}
                                        okText="??????"
                                        cancelText="??????"
                                    >
                                        <a>??????</a>
                                    </Popconfirm>
                                </span>
                            ) : (
                                    <a onClick={() => this.edit(record)}>??????</a>
                                )}
                        </div>
                    );
                },
            },
        ];
    }

    componentDidMount() {
        axios.get(getClassifyTags(this.props.bizType, this.props.data.id)).then(res => {
            this.setState({

                data: res.data.data
            })
        })
    }
    isEditing = record => record.id === this.state.editingKey;

    cancel = () => {
        this.setState({ editingKey: '' });
    };

    save(form, record) {
        form.validateFields((error, row) => {
            if (error) {
                return;
            }
            const newData = [...this.state.data];
            const index = newData.findIndex(item => record.id === item.id);
            if (index > -1) {
                const item = newData[index];
                let extInfo = this.props.extInfo || {};
                let url = dataUtil.spliceUrlParams(updateclassify, { "startContent": extInfo.startContent });
                axios.put(url, {
                    id: item.id,
                    classifyId: row.classify,
                }, true).then(res => {
                    newData.splice(index, 1, {
                        ...res.data.data
                    });
                    this.setState({ data: newData, editingKey: '' });
                });


            } else {
                newData.push(row);
                this.setState({ data: newData, editingKey: '' });
            }
        });
        return false;


    }

    edit(record) {
        axios.get(getclassifybyId(record.classifyType.id)).then(res => {
            this.setState({
                classifyList: res.data.data,
                editingKey: record.id
            });
        })

    }
    getInfo = (record, index) => {

        this.setState({
            rightData: record,
            activeIndex: id,
        });

    };

    setClassName = (record, index) => {
        //?????????????????????????????????????????????
        return record.id + record.type == this.state.activeIndex ? 'tableActivty' : "";
    }


    onClickHandle = (name) => {
        if (name == "DeleteTopBtn") {
            const { data, rightData, activeIndex, selectedRowKeys } = this.state;
            let extInfo = this.props.extInfo || {};
            let url = dataUtil.spliceUrlParams(deleteclassifyassign, { "startContent": extInfo.startContent });
            axios.deleted(url, { data: selectedRowKeys }, true).then(res => {
                selectedRowKeys.forEach(vlaue => {
                    let i = data.findIndex(item => item.id == vlaue)
                    data.splice(i, 1)
                })
                this.setState({
                    data,
                    rightData: null,
                    activeIndex: null,
                    selectedRowKeys: []
                })
            })
        }


    }

    //????????????
    deleteVerifyCallBack = () => {
        const { selectedRowKeys } = this.state
        if (selectedRowKeys == 0) {
            notification.warning(
                {
                    placement: 'bottomRight',
                    bottom: 50,
                    duration: 2,
                    message: '???????????????',
                    description: '???????????????????????????'
                }
            )
            return false
        } else {
            return true
        }
    }

    //????????????
    distributeClassify = (value) => {
        const { data } = this.state
        data.push(value)
        this.setState({
            data
        })
    }

    render() {
        const { selectedRowKeys } = this.state
        const rowSelection = {
            selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {

                this.setState({
                    selectedRowKeys
                })
            },
        };
        const components = {
            body: {
                row: EditableFormRow,
                cell: EditableCell,
            },
        };

        const columns = this.columns.map(col => {
            if (!col.editable) {
                return col;
            }
            return {
                ...col,
                onCell: record => ({
                    classifylist: this.state.classifyList,
                    record,
                    inputType: col.dataIndex == 'classify' ? 'classify' : "text",
                    dataIndex: col.dataIndex,
                    title: col.title,
                    editing: this.isEditing(record),
                }),
            };
        });

        return (
            <LabelTableLayout title={this.props.title} menuCode = {this.props.menuCode}>
                <LabelToolbar>
                    <PublicButton onClickHandle={this.onClickHandle.bind(this)}></PublicButton>
                    {/*??????*/}
                    <PublicButton name={'??????'} extInfo={this.props.extInfo} edit={this.props.cprtmEditAuth} title={'??????'} icon={'icon-fenpei'} afterCallBack={() => { this.setState({ showDistribute: true }) }} />
                    {/*??????*/}
                    <PublicButton title={"??????"} extInfo={this.props.extInfo} edit={this.props.wfPubliceditAuth} useModel={true} verifyCallBack={this.deleteVerifyCallBack} afterCallBack={this.onClickHandle.bind(this, "DeleteTopBtn")} icon={"icon-delete"} />
                </LabelToolbar>
                <LabelTable labelWidth={this.props.labelWidth} contentMinWidth={400}>
                    <Table
                        pagination={false}
                        rowClassName={this.setClassName}
                        size="small"
                        // type="radio"
                        rowSelection={rowSelection}
                        components={components}
                        bordered
                        dataSource={this.state.data}
                        rowKey={record => record.id}
                        columns={columns}
                        onRow={(record, index) => {
                            return {
                                onClick: event => {
                                    this.getInfo(record, index)
                                },
                            };
                        }}
                    />
                </LabelTable>
                {
                    this.state.showDistribute &&
                    <Assign
                        handleCancel={()=>this.setState({showDistribute:false})}
                        bizType={this.props.bizType}
                        data={this.props.data}
                        distributeClassify={this.distributeClassify}
                        extInfo={this.props.extInfo}
                    ></Assign>
                }
            </LabelTableLayout>
        );
    }
}

export default EditableTable;
