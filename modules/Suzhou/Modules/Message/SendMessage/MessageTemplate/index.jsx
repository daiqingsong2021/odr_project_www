import React, { Component } from 'react';
import { Modal, Form, Row, Col, Input, Button, Icon, Select, DatePicker, Slider, InputNumber, message, Checkbox, TreeSelect, Divider, Table, AutoComplete } from 'antd';
import style from './style.less';
import intl from 'react-intl-universal';
import { connect } from 'react-redux';
import { curdCurrentData } from '@/store/curdData/action';
import axios from '@/api/axios';
import * as dataUtil from "@/utils/dataUtil"
import SelectSection from '@/modules/Suzhou/components/SelectSection';
import { permissionFun, setRightShow, queryParams } from "@/modules/Suzhou/components/Util/util.js";
import PublicTable from '@/components/PublicTable'
import MainContent from "@/components/public/Layout/MainContent";
import PublicButton from "@/components/public/TopTags/PublicButton"
import notificationFun from '@/utils/notificationTip';
import { getSmsTemplateList, delSmsTemplate } from '@/modules/Suzhou/api/suzhou-api';
import { forEach } from 'lodash';
const { TextArea, Search } = Input;
const Option = Select.Option;
const Option1 = AutoComplete.Option;
const TreeNode = TreeSelect.TreeNode;

const EditableContext = React.createContext();
//单元格
class EditableCell extends React.Component {
    renderCell = (form) => {
        const {
            editing,
            dataIndex,
            title,
            inputType,
            record,
            index,
            children,
            ...restProps
        } = this.props;
        return (
            <td {...restProps}>
                {editing ? (
                    <Form.Item style={{ margin: 0 }}>
                        {form.getFieldDecorator(dataIndex, {
                            rules: [
                                {
                                    required: true,
                                    message: `请输入${title}!`,
                                },
                            ],
                            initialValue: record[dataIndex],
                        })(<InputNumber min={0} style={{}} />)}
                    </Form.Item>
                ) : (
                        children
                    )}
            </td>
        );
    };

    render() {
        return <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>;
    }
}

class ContractAdd extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modalInfo: {
                title: '选择短信模板',
            },
            searchValue: '',//搜索合同名称
            ifConfirm: false,//是否显示搜索
            firmsList: [],//搜索返回内容
            editingKey: '',
            detailList: [],//初始设置数据
            selectData: null,//选中数据
            isShowModal: false,//显示新增和修改
            ImportVisible: false,//显示引入
            rightData: null,//查询选择的合同
            columns: [
                {
                    title: '模板标题',
                    dataIndex: 'templateTitle',
                    key: 'templateTitle',
                    width: '30%',
                    render: (text, record) => {
                        return <span className={style.tdSpan}>{text ? text : ''}</span>
                    }
                },
                {
                    title: '模板内容',
                    dataIndex: 'templateContent',
                    key: 'templateContent',
                    width: '70%',
                    render: (text, record) => {
                        return <div style={{ display: 'inline-block', wordWrap: 'break-word', wordBreak: 'break-word' }}>{text ? text : ''}</div>
                    }
                }
            ],
        }
    }
    componentDidMount() {
        //获取合同台账信息
        // axios.get(getContractListForShare).then(res => {
        //     this.setState({
        //         contractList: res.data.data
        //     })
        // })
    }
    /**
    * 父组件即可调用子组件方法
    * @method
    * @description 获取用户列表、或者根据搜索值获取用户列表
    * @param {string} record  行数据
    * @return {array} 返回选中用户列表
    */
    onRef = (ref) => {
        this.table = ref
    }
    //获取主数据
    getList = (currentPageNum, pageSize, callBack) => {
        const { searchstr } = this.state;
        axios.get(getSmsTemplateList(pageSize, currentPageNum), { params: { searchstr } }).then(res => {
            callBack(!res.data.data ? [] : res.data.data)
            let data = res.data.data;
            this.setState({
                data,
                total: res.data.total,
                rightData: null,
                selectedRowKeys: [],
            })
        })
    }

    getSelectedRowKeys = (selectedRowKeys, selectedRows) => {
        this.setState({
            selectedRows,
            selectedRowKeys
        })
    }

    handleSubmit = (val, e) => {
        const { selectedRows } = this.state;
        if (selectedRows) {
            const chooseArray = [];
            selectedRows.forEach((value, item) => {
                chooseArray.push(value)
            });
            if (chooseArray.length === 1) {
                this.props.submitChooseTemplate(chooseArray);
            } else if (chooseArray.length === 0) {
                notificationFun('提示', '请选择数据操作')
            } else {
                notificationFun('提示', '请勿选择多条数据')
            }
        }
    }
    onClickHandle = (name) => {
        const { selectedRows } = this.state;
        if (name == 'btnDelete') {//删除
            if (selectedRows) {
                const deleteArray = [];
                selectedRows.forEach((value, item) => {
                    deleteArray.push(value.id);
                })
                axios.deleted(delSmsTemplate, { data: deleteArray }, true).then(res => {
                    this.table.getData()

                }).catch(err => {
                });
            } else {
                notificationFun('提示', '请选择数据操作')

            }
        }
    };


    //关闭权限弹框modal
    handleCancel = () => {
        this.setState({
            isShowModal: false,
        });
    };

    //设置table的选中行class样式
    setClassName = (record, index) => {
        return record.id === this.state.activeIndex ? 'tableActivty' : '';
    };
    /**
     * 获取选择清单数据
     */
    getInfo = (record, index) => {
        this.setState({
            activeIndex: record.id,
            selectData: record,
            record: record
        })
    }
    onChange = (val) => {
        this.setState({
            searchstr:val?val.target.value :''
        })
    }
    search = (val,searchStr) => {
        this.setState({
            searchstr:val
        }, () => {
            this.table.getData();
        })
    }

    render() {
        const { intl } = this.props.currentLocale;
        const { getFieldDecorator } = this.props.form;
        const { searchstr, columns, treeData } = this.state;
        const { permission } = this.props 
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 10 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 14 },
            },
        };
        const formItemLayout1 = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 4 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 20 },
            },
        };
        const components = {
            body: {
                cell: EditableCell,
            },
        };

        return (
            <div>
                <Modal className={style.main}
                    width="1200px"
                    afterClose={this.props.form.resetFields}
                    mask={false}
                    maskClosable={false}
                    footer={<div className="modalbtn">
                        {/* 取消 */}
                        <Button key={1} onClick={this.props.handleCancel}>取消</Button>
                        {/* 确定 */}
                        <Button key={2} onClick={this.handleSubmit.bind(this)} type="primary">确定</Button>
                    </div>}
                    centered={true} title={this.state.modalInfo.title} visible={this.props.modalVisible}
                    onCancel={this.props.handleCancel}>
                    <Form onSubmit={this.handleSubmit} className={style.mainScorll}>
                        <div className={style.main}>
                            <div className={style.search}>
                                <Input type="text" size="small" style={{ width: '200px' }} placeholder="请输入模板关键字" onChange={this.onChange}/>
                                <Button type="primary" icon="search" size='small' onClick={this.search.bind(this,searchstr)}>搜索</Button>
                            </div>
                            <div style={{ display: 'inline-block' }}>
                            {permission && permission.indexOf('SENDMESSAGE_DEL_TEMPLATE') !== -1 &&(
                            <PublicButton name={'删除'} title={'删除'} icon={'icon-delete'}
                                    afterCallBack={this.onClickHandle.bind(this, 'btnDelete')}
                                    res={'MENU_EDIT'} />)}
                            </div>

                            <div className={style.mainScorll}>
                                <PublicTable onRef={this.onRef}
                                    pagination={true}
                                    getData={this.getList}
                                    columns={columns}
                                    rowSelection={true}
                                    onChangeCheckBox={this.getSelectedRowKeys}
                                    useCheckBox={true}
                                    getRowData={this.getInfo}
                                    total={this.state.total}
                                    pageSize={10}
                                    styleName={'cursorP'}
                                />
                            </div>
                        </div>
                    </Form>
                </Modal>
            </div>
        )
    }
}
const ContractAdds = Form.create()(ContractAdd);
export default connect(state => ({
    currentLocale: state.localeProviderData,
}))(ContractAdds);