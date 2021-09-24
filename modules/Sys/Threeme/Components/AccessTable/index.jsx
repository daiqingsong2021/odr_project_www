import { Table, Input, notification, Popconfirm, Form, Select } from 'antd';
import style from './style.less';
import axios from '../../../../../api/axios';
import { tmmList, tmmUpdate, tmmDelete } from '../../../../../api/api';
import AddTopBtn from '../../../../../components/public/TopTags/AddTopBtn';
import PublicButton from '../../../../../components/public/TopTags/PublicButton';
import AddIp from '../AddIP';
import * as dataUtil from "../../../../../utils/dataUtil"
import { connect } from 'react-redux'
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

    if (this.props.inputType === 'accessRule') {
      return (
        <Select style={{ width: "100%" }} size="small">
          <Option value={"0"}>禁止访问</Option>
          <Option value={"1"}>允许访问</Option>
        </Select>
      );
    }
    if (this.props.inputType === 'isEffect') {
      return (
        <Select style={{ width: "100%" }} size="small">
          <Option value={0}>否</Option>
          <Option value={1}>是</Option>
        </Select>
      );
    }
    return <Input size="small" maxLength={this.props.dataIndex=="remark"? 66:20 }/>;
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
                    rules:(dataIndex=="startIP" ||  dataIndex=="endIP")?[{
                      required: true,
                      message: "请输入"+(dataIndex=="startIP"?"起始IP":"结束IP"),
                    }, {
                      pattern: /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,
                      message: "IP格式不对",
                    }]:[],
                    initialValue: record[dataIndex],
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
      total: 0,
      selectedRowKeys: [], //被选中的角色
      activeIndex: '',
      selectData: [],
      pageSize: 10,
      currentPageNum: 1,
    };
    const { intl } = this.props.currentLocale
    this.columns = [
      {
        title: intl.get("wsd.i18n.sys.three.startIP"),
        dataIndex: 'startIP',

        render: (text, record) => <div className="editable-row-text">{text}</div>,
        editable: true,
      },
      {
        title: intl.get("wsd.i18n.sys.three.endIP"),
        dataIndex: 'endIP',

        render: (text, record) => <div className="editable-row-text">{text}</div>,
        editable: true,
      },
      {
        title: intl.get("wsd.i18n.sys.three.rule"),
        dataIndex: 'accessRule',

        render: (text, record) => text == 0 ? <div className="editable-row-text">{intl.get("wsd.i18n.sys.three.rule1")}</div> : <div className="editable-row-text">{intl.get("wsd.i18n.sys.three.rule2")}</div>,
        editable: true,
      },
      {
        title: intl.get("wsd.i18n.sys.three.effect"),
        dataIndex: 'isEffect',
        width: '15%',
        render: (text, record) => {
          if (text == 0) {
            return <span>{intl.get("wsd.i18n.sys.three.effect1")}</span>
          }
          if (text == 1) {
            return <span>{intl.get("wsd.i18n.sys.three.effect2")}</span>
          }
        },
        editable: true,
      },
      {
        title: intl.get("wsd.i18n.sys.ipt.remark"),
        dataIndex: 'remark',

        render: (text, record) => <div className="editable-row-text">{text}</div>,
        editable: true,
      },
      {
        title: intl.get("wsd.i18n.operate.calendar.operation"),

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
                        {intl.get("wsd.global.btn.preservation")}
                      </a>
                    )}
                  </EditableContext.Consumer>
                  <Popconfirm
                    title={intl.get("wsd.global.tip.suresd") + "?"}
                    onConfirm={() => this.cancel(record.id)}
                    okText={intl.get("wsd.global.btn.sure")}
                    cancelText={intl.get("wsd.global.btn.cancel")}
                  >
                    <a>{intl.get("wsd.global.btn.cancel")}</a>
                  </Popconfirm>
                </span>
              ) : (
                  <a onClick={() => this.edit(record.id)}>{intl.get("wsd.i18n.plan.activitydefineinfo.edit")}</a>
                )}
            </div>
          );
        },
      },
    ];
  }

  componentDidMount() {
    this.getListData()

    // this.getTree();
  }
  getListData = () => {
    axios
      .get(tmmList(this.state.pageSize, this.state.currentPageNum))
      .then(res => {

        this.setState({
          data: res.data.data,
          total: res.data.total
        });
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
        axios.put(tmmUpdate, {
          ...item,
          ...row,
        }, true).then(res => {
          newData.splice(index, 1, {
            ...item,
            ...row,
          });
          this.setState({ data: newData, editingKey: '' });
        });


      } else {
        newData.push(row);
        this.setState({ data: newData, editingKey: '' });
      }
    });
    return false;
    //ip保存接口
    // const data={
    //   "id": 0,
    //   "startIP": "string",
    //   "endIP": "string",
    //   "accessRule": 0,
    //   "remark": "string"
    // }

  }

  edit(key) {
    this.setState({ editingKey: key });
  }
  getInfo = (record, index) => {
    const { activeIndex } = this.state;
    const { id } = record;
    if (activeIndex === record.id) {
      this.setState({
        record: null,
        activeIndex: null,
      });
    } else {
      this.setState({
        record,
        activeIndex: id,
      });
    }
  };

  setClassName = (record, index) => {
    //判断索引相等时添加行的高亮样式
    return record.id === this.state.activeIndex ? 'tableActivty' : '';
  };

  // rowSelection = {
  //   onChange: (selectedRowKeys, selectedRows) => {
  //   },
  // };

  onChange(row, item) {
    // this.props.deleteFn(item)
  }
  showAddIpModal = () => {
    this.setState({
      isaddip: true,
    });
  };
  handleOk = e => {
    this.setState({
      visible: false,
    });
  };
  closeAddIpModal = () => {
    this.setState({
      isaddip: false,
    });
  };
  delete = () => {
    const { intl } = this.props.currentLocale
    const { selectedRowKeys, data, pageSize, currentPageNum, total } = this.state
    let changecurrentPageNum = (data.length == selectedRowKeys.length) && currentPageNum > 1
    if (selectedRowKeys.length > 0) {
      axios
        .deleted(tmmDelete, { data: selectedRowKeys }, true)
        .then(res => {
          selectedRowKeys.forEach(item => {

            let i = data.findIndex(v => v.id == item)
            if (i > -1) {
              data.splice(i, 1)
            }
          })
          if (changecurrentPageNum) {
            if (Math.ceil(total / this.state.pageSize) == currentPageNum) {
              this.setState({
                data: data,
                record: null,
                activeIndex: null,
                selectedRowKeys: [],
                currentPageNum: currentPageNum - 1
              }, () => {
                this.getListData()
              })
            } else {
              this.setState({
                data: data,
                record: null,
                activeIndex: null,
                selectedRowKeys: [],
              }, () => {
                this.getListData()
              })
            }
          } else {
            this.setState({
              data: data,
              record: null,
              activeIndex: null,
              selectedRowKeys: [],
              total
            })
          }

        })
    } else {
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

  }
  AddIpdata = (ipdata) => {
    const { data, total } = this.state
    data.push(ipdata)
    this.setState({
      data,
      total: total + 1
    })
  }
  //删除校验
  deleteVerifyCallBack = () => {
    const { selectedRowKeys } = this.state
    if (selectedRowKeys.length == 0) {
      dataUtil.message("请勾选数据进行操作")
      return false
    } else {
      return true
    }
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
      onSelect: (record, selected, selectedRows) => {
      },
      onSelectAll: (selected, selectedRows, changeRows) => {
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
      if (col.dataIndex == 'accessRule') {
        return {
          ...col,
          onCell: record => ({
            record,

            inputType: 'accessRule',
            dataIndex: col.dataIndex,
            title: col.title,
            editing: this.isEditing(record),
          }),
        };
      }
      if (col.dataIndex == "isEffect") {
        return {
          ...col,
          onCell: record => ({
            record,

            inputType: 'isEffect',
            dataIndex: col.dataIndex,
            title: col.title,
            editing: this.isEditing(record),
          }),
        };
      }
      return {
        ...col,
        onCell: record => ({
          record,

          inputType: 'text',
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
      size: "small",
      showQuickJumper: true,
      showTotal: total => `总共${this.state.total}条`,
      onShowSizeChange: (current, size) => {
        this.setState({
          pageSize: size,
          currentPageNum: 1
        }, () => {
          this.getListData()
        })
      },
      onChange: (page, pageSize) => {
        this.setState({
          currentPageNum: page
        }, () => {
          this.getListData()
        })
      }
    }
    return (
      <div className={style.main}>
        <div className={style.setroleAccessOperate}>

          {/*新增*/}

          <PublicButton name={'新增'} title={'新增'} icon={'icon-add'} afterCallBack={this.showAddIpModal} />

          {/*删除*/}
          <PublicButton title={"删除"} useModel={true} verifyCallBack={this.deleteVerifyCallBack}
            afterCallBack={this.delete} icon={"icon-delete"}
          />
        </div>
        <Table
          onChange={this.onChange.bind(this)}
          pagination={pagination}
          rowClassName={this.setClassName}
          scroll={{ x: true }}
          size="small"
          rowSelection={rowSelection}
          components={components}
          bordered
          dataSource={this.state.data}
          rowKey={record => record.id}
          columns={columns}
          rowClassName={this.setClassName}
          onRow={(record, index) => {
            return {
              onClick: event => {
                this.getInfo(record, index);
              },
            };
          }}
        />
        <AddIp
          AddIp={this.AddIpdata}
          visible={this.state.isaddip}
          handleOk={this.handleOk.bind(this)}
          handleCancel={this.closeAddIpModal.bind(this)}
        />
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