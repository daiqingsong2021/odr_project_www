import React, { Component } from 'react';
import { Modal, Form, Row, Col, Input, Button, Icon, Select, DatePicker, Slider, InputNumber, message, Checkbox, TreeSelect, Divider, Table, AutoComplete } from 'antd';
import style from './style.less';
import intl from 'react-intl-universal';
import { connect } from 'react-redux';
import { curdCurrentData } from '@/store/curdData/action';
import axios from '@/api/axios';
import { getSmsGroupListNoPage } from '@/modules/Suzhou/api/suzhou-api';
import * as dataUtil from "@/utils/dataUtil"
import SelectSection from '@/modules/Suzhou/components/SelectSection';
import { permissionFun, setRightShow, queryParams } from "@/modules/Suzhou/components/Util/util.js";
import PublicTable from '@/components/PublicTable'
import MainContent from "@/components/public/Layout/MainContent";
import PublicButton from "@/components/public/TopTags/PublicButton"
import notificationFun from '@/utils/notificationTip';
import { forEach } from 'lodash';
const { TextArea, Search } = Input;
const Option = Select.Option;
const Option1 = AutoComplete.Option;
const TreeNode = TreeSelect.TreeNode;

const EditableContext = React.createContext();
class ContractAdd extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modalInfo: {
                title: '选择群组',
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
            selectedRowKeys: [],
            columns: [
                {
                    title: '群组Id',
                    dataIndex: 'groupCode',
                    key: 'groupCode',
                    width: '30%',
                    render: (text, record) => {
                        return <span className={style.tdSpan}>{text ? text : ''}</span>
                    }
                },
                {
                    title: '群组名称',
                    dataIndex: 'groupName',
                    key: 'groupName',
                    width: '70%',
                    render: (text, record) => {
                        return <div style={{ display: 'inline-block', wordWrap: 'break-word', wordBreak: 'break-word' }}>{text ? text : ''}</div>
                    }
                }
            ],
        }
    }
    componentDidMount() {
        this.getList();
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
    getList = () => {
        const { searcher } = this.state;
        const { chooseGroupTags } = this.props
        axios.get(getSmsGroupListNoPage, { params: { searcher, status: 'NORMAL' } }).then(res => {
            if (res.data.data) {
                let groupData = res.data.data;
                let selectedRowKeys = []
                chooseGroupTags.forEach((item, index) => {
                    const i = groupData.findIndex(element => element.id === item.id)
                    if (i !== -1) {
                        selectedRowKeys.push(item.id)
                    }
                })
                this.setState({
                    groupData,
                    total: res.data.total,
                    rightData: null,
                    selectedRowKeys: selectedRowKeys
                })
            }
        })
    }

    getSelectedRowKeys = (selectedRowKeys, selectedRows) => {
        this.setState({
            selectedRows,
            selectedRowKeys
        })
    }

    handleSubmit = (val) => {
        const { selectedRows } = this.state;
        if (selectedRows && selectedRows.length > 0) {
            const chooseArray = [];
            selectedRows.forEach((value, item) => {
                chooseArray.push(value)
            });
            if (chooseArray.length > 10) {
                notificationFun('提示', '一次最多选择10个群组')
                return
            }
            if (chooseArray.length > 0) {
                this.props.submitChooseGroup(chooseArray);
            }
        } else {
            notificationFun('提示', '请选择数据后操作')
            return
        }
    }

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
    search = (val) => {
        // return
        const {groupData} = this.state;
        if(val){
            let newData = dataUtil.search(groupData,[{"key":"groupName","value":val}],true);
            this.setState({
                groupData: newData
            });
        }else{
            this.getList();
        }
        
    }
    onSelectChange = (selectedRowKeys, selectedRows) => {
        this.setState({ selectedRowKeys, selectedRows });
    };
    onChangeInput = (val) => {
        this.setState({
            searchstr: val ? val.target.value : ''
        })
    }
    render() {
        const { intl } = this.props.currentLocale;
        const { getFieldDecorator } = this.props.form;
        const { searchstr, selectData, detailList, aar, rightData, groupData, columns, treeData, selectedRowKeys } = this.state;
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
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
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
                                <Input type="text" size="small" style={{ width: '200px' }} placeholder="请输入模板关键字" onChange={this.onChangeInput} />
                                <Button type="primary" icon="search" size='small' onClick={this.search.bind(this, searchstr)}>搜索</Button>
                            </div>
                            <div style={{ display: 'inline-block' }}>
                                {/* <PublicButton name={'删除'} title={'删除'} icon={'icon-delete'}
                                    afterCallBack={this.onClickHandle.bind(this, 'btnDelete')}
                                    res={'MENU_EDIT'} /> */}
                            </div>

                            <div className={style.mainScorll}>
                                <Table
                                    rowKey={record => record.id}
                                    defaultExpandAllRows={true}
                                    pagination={true}
                                    name={this.props.name}
                                    columns={columns}
                                    rowClassName={this.setClassName}
                                    size="small"
                                    bordered
                                    loading={false}
                                    dataSource={groupData}
                                    rowSelection={rowSelection}
                                    onRow={(record, index) => {
                                        return {
                                            onClick: (event) => {
                                                this.getInfo(record, index);
                                            },
                                        };
                                    }}
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