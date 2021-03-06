/**
 * Created by WUWEI on 2019/1/17.
 */
import React, { Component } from 'react'
import { Collapse, Table, Radio, Icon, Input, InputNumber, Popconfirm, Form } from 'antd'
import style from './style.less'
import Calendar from './Calendar'
import StandardSetModal from "./StandardSetModal"
import TopTags from './TopTags/index'
import { connect } from 'react-redux'
import axios from '../../../../api/axios'
import { calendarList, calendarDef, calendarUpdate } from '../../../../api/api'
// import { object } from 'prop-types';



const RadioGroup = Radio.Group;
const Panel = Collapse.Panel

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
            return <InputNumber />;
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
                                            message: `Please Input ${title}!`,
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


class BasicdGlobald extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            editingKey: '',
            data1: [],
            activeIndex: null,
            record: null,
            calendarDel: [],
            standData: null,
            selectedRowKeys: [],
        }
    }
    //????????????
    reqfun = () => {
        axios.get(calendarList).then(res => {
            if(res.data.data){
                const {data}=res.data
               let Default=data.find(item=>item.isDefault==1);
                let defaultId = null;
                if(Default){
                  defaultId = Default.id;
                }
                this.setState({
                    record: Default,
                    activeIndex: defaultId,
                    data1: res.data.data
                })
            }
           
        })
    }

    componentDidMount() {
        this.reqfun()
    }

    radio = (record) => {

        axios.put(calendarDef(record.id), {}, true).then(res => {
            if (res.data.status == 200) {
                var radIndex = this.state.data1.findIndex(v => v.id == record.id)
                record.isDefault = 1;
                var Data = [];

                this.state.data1.map((item, i) => {
                    if (i !== radIndex) {
                        item.isDefault = 0;
                        Data.push(item);
                    } else {
                        Data.push(record)
                    }
                })
                this.setState({
                    data1: Data
                })
            }
        })
    }

    collapseCallback = (key) => {
    }
    handleClick = (record) => {
        this.setState({
            isShowStandardSet: true,
            standData: record
        })
    }
    closeStandardSet = () => {
        this.setState({
            isShowStandardSet: false
        })
    }

    isEditing = record => record.id === this.state.editingKey;

    cancel = () => {
        this.setState({ editingKey: '' });
    };

    save(form, key) {
        form.validateFields((error, row) => {
            if (error) {
                return;
            }
            const newData = [...this.state.data1];
            let reqdata = {
                id: key,
                calName: row.calName
            }
            axios.put(calendarUpdate, reqdata, true).then(res => {
                const index = newData.findIndex(item => key === item.id);
                if (index > -1) {
                    const item = newData[index];
                    newData.splice(index, 1, {
                        ...item,
                        ...row,
                    });
                    this.setState({ data1: newData, editingKey: '' }, () => {


                    });
                } else {
                    newData.push(row);
                    this.setState({ data1: newData, editingKey: '' });
                }
            })


        });
    }

    edit(key) {
        this.setState({ editingKey: key });
    }

    setClassName = (record, index) => {
        return record.id === this.state.activeIndex ? 'tableActivty' : '';
    }

    //??????
    calendarAdd = (v) => {
        let data1 = this.state.data1
        data1.unshift(v)
        this.setState({
            data1:data1
        })
    }
    //??????
    del = (v) => {
        if(this.state.data1.length==1){
            notification.warning(
                {
                    placement: 'bottomRight',
                    bottom: 50,
                    duration: 2,
                    message: "??????",
                    description: '?????????????????????????????????'
                }
            )
        }
        if (Array.isArray(v)) {     //????????????
            var copyData = [...this.state.data1]
            for (var i = 0; i < v.length; i++) {
                var ind = copyData.findIndex(val => val.id == v[i])
                if (ind != -1) {   //??????
                    copyData = [...copyData.slice(0, ind), ...copyData.slice(ind + 1)]
                }
            }
            this.setState({
                data1: copyData,
                selectedRowKeys: []
            }, () => {
               let i=v.findIndex(item=>item==this.state.record.id)
               if(i>-1){
                this.setState({
                    record:copyData[copyData.length-1],
                    activeIndex:copyData[copyData.length-1].id
                })
               }
            
            })

        }

    }
    getInfo = (record, index) => {  //table????????????????????????
      
        const { id } = record;

        this.setState({
            record,
            activeIndex: id,
        });

    }
    //????????????????????????
    updateCalName=(id,name)=>{
        const {data1}=this.state
        let i=data1.findIndex(item=>item.id==id)
        data1[i].calName=name
        this.setState({
            data1
        })
    }

    render() {
        const { intl } = this.props.currentLocale;
        const columns1 = [
            {
                title: intl.get('wsd.i18n.operate.calendar.calendarname'), //????????????
                dataIndex: 'calName',
                key: 'calName',
                editable: true,
            },
            {
                title: intl.get('wsd.i18n.base.planTem.isglobal'),//????????????
                dataIndex: 'isDefault',
                key: 'isDefault',
                align:"center",
                render: (text, record) => (
                    <span className={text == 1 ? style.radioT : style.radioF} onClick={this.radio.bind(this, record)}></span>
                )
            },
            // {
            //   title: '????????????',
            //   dataIndex: 'builtIn',
            //   key: 'builtIn',
            //   render: text => text ? intl.get('wsd.i18n.sys.menu.yes') : intl.get('wsd.i18n.sys.menu.no')
            // },
            {
                title: intl.get('wsd.i18n.operate.calendar.standardset'),//????????????
                dataIndex: 'setStandard',
                key: 'setStandard',
                align:"center",
                render: (text, record) => (
                    <Icon type="form" onClick={this.handleClick.bind(this, record)} />
                )
            },
            // {
            //     title: intl.get('wsd.i18n.operate.calendar.operation'),//??????
            //     dataIndex: 'operation',
            //     render: (text, record) => {
            //         const editable = this.isEditing(record);
            //         return (
            //             <div>
            //                 {editable ? (
            //                     <span>
            //                         <EditableContext.Consumer>
            //                             {form => (
            //                                 <a
            //                                     href="javascript:;"
            //                                     onClick={() => this.save(form, record.id)}
            //                                     style={{ marginRight: 8 }}
            //                                 >
            //                                     ?????? </a>
            //                             )}
            //                         </EditableContext.Consumer>
            //                         <a
            //                             href="javascript:;"
            //                             onClick={() => this.cancel(record.id)}
            //                         >??????</a>
            //                     </span>
            //                 ) : (
            //                         <a onClick={() => this.edit(record.id)}>??????</a>
            //                     )}
            //             </div>
            //         );
            //     },
            // },
        ];
        const components = {
            body: {
                row: EditableFormRow,
                cell: EditableCell,
            },
        };

        const columns = columns1.map((col) => {
            if (!col.editable) {
                return col;
            }
            return {
                ...col,
                onCell: record => ({
                    record,
                    inputType: col.dataIndex === 'age' ? 'number' : 'text',
                    dataIndex: col.dataIndex,
                    title: col.title,
                    editing: this.isEditing(record),
                }),
            };
        });

        let { selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
                this.setState({
                    // calendarDel: selectedRowKeys
                    selectedRowKeys
                })
            },
            onSelect: (record, selected, selectedRows) => {
            },
            onSelectAll: (selected, selectedRows, changeRows) => {
            },
          getCheckboxProps: record => ({
            disabled: record.builtIn == 1
          })
        };


        return (
            <div className={style.main}>
                <TopTags calendarAdd={this.calendarAdd}
                    copy={this.state.record}
                    selectedRowKeys={this.state.selectedRowKeys}
                    del={this.del} />
                <div style={{ height: this.props.height }} className={style.calendarSet}>


                    <div className={style.caleft}>
                        {/* ???????????? */}
                        <h3 className={style.listTitle2}>{intl.get('wsd.i18n.sys.basicd.templated.calendartype')}</h3>
                        <div className={style.tablescroll}>
                            <Table
                                components={components}
                                rowKey={record => record.id}
                                size="small"
                                rowClassName={this.setClassName}
                                rowSelection={rowSelection}
                                dataSource={this.state.data1} columns={columns}
                                pagination={false}
                                // pagination={{
                                //     onChange: this.cancel,
                                // }}
                                onRow={(record) => {
                                    return {
                                        onClick: this.getInfo.bind(this, record),
                                        // onDoubleClick: (event) => {
                                        //     event.currentTarget.getElementsByClassName("ant-checkbox-wrapper")[0].click();
                                        // }
                                    }
                                }}
                            ></Table>
                        </div>
                        {this.state.isShowStandardSet && <StandardSetModal data={this.state.standData} handleCancel={this.closeStandardSet.bind(this)} refreshRight={(time)=>this.setState({isrefreshRight:time})} refresh={this.updateCalName}></StandardSetModal>}
                    </div>
                    <div className={style.caright}>
                        {/* ???????????? */}

                      
                            <Calendar data={this.state.record} isrefreshRight={this.state.isrefreshRight}/>
                      
                    </div>
                </div>



            </div>

        )
    }
}

const BasicdGlobalds = Form.create()(BasicdGlobald)
export default connect(state => ({
    currentLocale: state.localeProviderData
}))(BasicdGlobalds);
