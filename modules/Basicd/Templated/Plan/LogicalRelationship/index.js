import { Table, Input,InputNumber, Tabs, Popconfirm, Form, Select, notification } from 'antd';
import { connect } from 'react-redux';
import DistributionBtn from "../../../../../components/public/TopTags/DistributionBtn"
import DeleteTopBtn from "../../../../../components/public/TopTags/DeleteTopBtn"
import style from "./style.less"
import LogDistribute from "./LogDistribute"
import axios from "../../../../../api/axios"
import { getTmpltaskFollowRelation,getTmpltaskPredRelation,deleteTmpltaskRelation,updateTmpltaskRelation} from "../../../../../api/api"

const Option = Select.Option;
const data = [];
const FormItem = Form.Item;
const EditableContext = React.createContext();
const TabPane = Tabs.TabPane;
const EditableRow = ({ form, index, ...props }) => (
    <EditableContext.Provider value={form}>
        <tr {...props} />
    </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
    getInput = () => {
        if (this.props.inputType === 'relationType') {
            return (
                <Select style={{ width: "100%" }}>
                        <Option value={"FF"} key={"FF"}>FF</Option>
                        <Option value={"FS"} key={"FS"}>FS</Option>
                        <Option value={"SS"} key={"SS"}>SS</Option>
                        <Option value={"SF"} key={"SF"}>SF</Option>
                </Select>
            );
        }

        return <InputNumber style={{width:"100%"}} />;
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
                                                message: `请输入 ${title}!`,
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
            selectedRowKeys: null, //被选中的角色
            activeIndex:null ,
            rightData:null,
            activeKey:"2",
            selectedRowKeys:[]
        };
       
    }

    componentDidMount() {
        axios.get(getTmpltaskPredRelation(this.props.data.id)).then(res=>{
          this.setState({

             data:res.data.data
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
               
                axios.put(updateTmpltaskRelation, {
                    id: item.id,
                    relationType: row.relationType,
                    lagQty: parseInt(row.lagQty)
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
    
        this.setState({
           
            editingKey: record.id
        });
    }
    getInfo = (record, index) => {
      
        const { id } = record;
      
            this.setState({
                rightData: record,
                activeIndex: id,
            });
        
    };

    setClassName = (record, index) => {
        // 判断索引相等时添加行的高亮样式
        return record.id === this.state.activeIndex ? 'tableActivty' : '';
    
      };


    onClickHandle = (name) => {
        const { intl } = this.props.currentLocale

        if (name == "DistributionBtn") {
            this.setState({
                showDistribute: true
            })
        }

        if (name == "DeleteTopBtn") {
            const { data, rightData, activeIndex ,selectedRowKeys} = this.state
            if (selectedRowKeys.length > 0) {
                axios.deleted(deleteTmpltaskRelation, { data: selectedRowKeys }, true).then(res => {
                    selectedRowKeys.forEach(vlaue => {
                        let i = data.findIndex(item => item.id == vlaue)
                        data.splice(i, 1)
                    })
                    this.setState({
                        data,
                        rightData: null,
                        activeIndex: null,
                        selectedRowKeys:[]
                    })

                })
            } else {
                notification.warning(
                    {
                        placement: 'bottomRight',
                        bottom: 50,
                        duration: 2,
                        message: intl.get("wsd.global.tip.title1"),
                        description:  intl.get("wsd.global.tip.content2"),
                    }
                )
                return
            }
        }


    }
    closeDistributeModal = () => {
        this.setState({
            showDistribute: false
        })
    }

    onChange(row, item) {

    }
    //分配数据
    distributeClassify = (value) => {
        const { data } = this.state
        data.push(value)
        this.setState({
            data
        })
    }
    //切换选项卡
    changeActiveKey=(key)=>{
        this.setState({
            activeKey:key
        },()=>{
            if(this.state.activeKey=="1"){
                axios.get(getTmpltaskFollowRelation(this.props.data.id)).then(res=>{
                     this.setState({
                        rightData: null,
                        activeIndex: null,
                        data:res.data.data
                       })
                   })
            }else{
                axios.get(getTmpltaskPredRelation(this.props.data.id)).then(res=>{
                     this.setState({
                        rightData: null,
                        activeIndex: null,
                        data:res.data.data
                       })
                   })
            }
        })
    }
    render() {
        const { intl } = this.props.currentLocale
        const columns1 = [
            {
                title: this.state.activeKey==1?intl.get("wsd.i18n.plan.subTask.subtaskname"):intl.get("wsd.i18n.plan.subTask.subtaskname1"),
                dataIndex: 'taskName',
                render: (text, record) => text ? <div className="editable-row-text">{text}</div> : null,
                editable: false,
            },
            {
                title:this.state.activeKey=="1"? intl.get('wsd.i18n.plan.subTask.subtaskcode'):intl.get('wsd.i18n.plan.subTask.subtaskcode1'),
                dataIndex: 'taskCode',

                render: (text, record) => text ? <div className="editable-row-text">{text}</div> : null,
                editable: false,
            },
            {
                title: intl.get('wsd.i18n.plan.subTask.relationtype'),
                dataIndex: 'relationType',
                width:150,
                render: (text, record) => text ? <div className="editable-row-text">{text}</div> : null,
                editable: true,
            },
            {
                title: intl.get('sd.i18n.plan.subTask.timedelayw'),
                dataIndex: 'lagQty',
                width:150,
                render: (text, record) =>text?  <div className="editable-row-text">{text+"d"}</div>:"--",
                editable: true,
            },
            {
                title:intl.get("wsd.i18n.operate.calendar.operation"),

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
                                    <a onClick={() => this.edit(record)}>编辑</a>
                                )}
                        </div>
                    );
                },
            },
        ];
        const {selectedRowKeys}=this.state
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

        const columns = columns1.map(col => {
            if (!col.editable) {
                return col;
            }
            return {
                ...col,
                onCell: record => ({
                    classifylist: this.state.classifyList,
                    record,
                    inputType: col.dataIndex == 'relationType' ? 'relationType' : "text",
                    dataIndex: col.dataIndex,
                    title: col.title,
                    editing: this.isEditing(record),
                }),
            };
        });

        return (

            <div className={style.main}>

                <div className={style.mainHeight}>
                    <h3 className={style.listTitle}>{intl.get("wbs.global.tags.logicalrelationship")}</h3>
                    <div className={style.rightTopTogs}>
                        <DistributionBtn onClickHandle={this.onClickHandle.bind(this)}></DistributionBtn>
                        <DeleteTopBtn onClickHandle={this.onClickHandle.bind(this)}></DeleteTopBtn>
                        {this.state.showDistribute &&
                          <LogDistribute 
                          handleCancel={this.closeDistributeModal.bind(this)}
                          distributeClassify={this.distributeClassify}
                          changeActiveKey={this.changeActiveKey}
                           data={this.props.data}
                      
                           ></LogDistribute>}

                    </div>
                    <div className={style.mainScorll} >
                        <Tabs
                         type="card" 
                         size="small"
                        tabBarStyle={{ position: 'relative', top: '1px' }}
                        activeKey={this.state.activeKey}
                         onChange={this.changeActiveKey}>
                         {/* 前紧任务 */}
                            <TabPane tab={intl.get("wsd.i18n.plan.subTask.title1")} key="2">
                                <Table
                                    onChange={this.onChange.bind(this)}
                                    pagination={false}
                                    rowClassName={this.setClassName}
                                    size="small"
                                    // type="radio"
                                    rowSelection={rowSelection}
                                    components={components}
                                 
                                    dataSource={this.state.data}
                                    rowKey={record => record.id}
                                    columns={columns}
                                    rowClassName={this.setClassName}
                                    onRow={(record, index) => {
                                        return {
                                            onClick: event => {
                                                this.getInfo(record,index)
                                            },
                                        };
                                    }}
                                />
                            </TabPane>
                            {/* 后续任务 */}
                            <TabPane tab={intl.get("wsd.i18n.plan.subTask.title2")} key="1">
                                <Table
                                    onChange={this.onChange.bind(this)}
                                    pagination={false}
                                    rowClassName={this.setClassName}
                                    size="small"
                                    // type="radio"
                                    rowSelection={rowSelection}
                                    components={components}
                                  
                                    dataSource={this.state.data}
                                    rowKey={record => record.id}
                                    columns={columns}
                                    rowClassName={this.setClassName}
                                    onRow={(record, index) => {
                                        return {
                                            onClick: event => {
                                               this.getInfo(record,index)
                                            },
                                        };
                                    }}
                                />
                            </TabPane>
                         

                        </Tabs>

                    </div>


                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
      currentLocale: state.localeProviderData,
    }
  };
  
  
  export default connect(mapStateToProps, null)(EditableTable);