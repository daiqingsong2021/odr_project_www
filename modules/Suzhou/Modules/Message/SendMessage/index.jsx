import React, { Component } from 'react';
import { Form, Row, Col, Input, Button, Icon, Select, Divider, DatePicker, TreeSelect, Radio, Table, Tag ,Spin } from 'antd';
import moment from 'moment';
import style from './style.less';
import intl from 'react-intl-universal';
import { connect } from 'react-redux';
import axios from '@/api/axios';
import { addSmsTemplate, getSmsGroupDetailListNoPage, smsSend } from '@/modules/Suzhou/api/suzhou-api';
import * as dataUtil from '@/utils/dataUtil';
const { TextArea } = Input;
const Option = Select.Option;
const TreeNode = TreeSelect.TreeNode;
import { getBaseData,permissionFun } from '@/modules/Suzhou/components/Util/util';
// 布局
import LabelFormLayout from "./Form/LabelFormLayout"
import LabelFormButton from "./Form/LabelFormButton"
import ImportModal from './MessageTemplate/index'
import SaveTemplateModal from './SaveTemplate/index'
import ImportGroupModal from './MessageGroupModal/index'
import notificationFun from '@/utils/notificationTip';
import PublicTable from '@/components/PublicTable'
import { forEach } from 'lodash';
import { element } from 'prop-types';
const { CheckableTag } = Tag;

export class AddModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showChooseGroupBtn: true,
            changeButtonShow: true,  //调整按钮
            height: 0,
            loading: false,
            selectedRowKeys: [],
            sendChannel: 'NW',
            sendLine: '',
            messageContent: '',
            sendPerson: 'GROUP',
            sendTimeWay: '1',
            channelList: [], //发送通道 做数据字典
            lineList: [],//线路列表
            sendPersonList: [{ value: 'GROUP', title: '群组' }, { value: 'HAND_CHOOSE', title: '手动' }],
            sendTimeWayList: [{ value: '1', title: '立即发送' }, { value: '2', title: '定时发送' }],
            tipMessage: '已输入0个字，还剩470个字',
            messageLength: 0,//message已输入字数
            messageCanInput: 470,//message剩余可输入字数
            showTemplateModal: false,//展示短信模板页
            showSaveTemplateModal: false,//展示设为模板弹框
            chooseGroupModal: true,//默认选择群组发送
            showGroupModal: false,//展示群组选择弹框
            chooseGroupTags: [],//选中的群组
            groupIdDetailList: [],//群组Id与详情列表
        }
    }
    componentDidMount() {
        permissionFun('SYSTEMFUNC-SENDMESSAGE').then(res => {
            this.setState({
                permission: !res.permission ? [] : res.permission
            })
        });
        getBaseData('sms.send.channel').then(data => {
            if (data && data.length) {
                this.setState({
                    channelList: data
                })
            }
        })
        getBaseData('line').then(data => {
            if (data && data.length) {
                let allObj = { value: '', title: '无' }
                data.splice(0, 0, allObj)
                this.setState({
                    lineList: data
                })
            }
        })
        const h = document.documentElement.clientHeight || document.body.clientHeight;   // 浏览器高度，用于设置组件高度
        this.setState({
            height: h - 290,
        });
        if(this.props.rightData){
            this.setState({
                messageContent:this.props.rightData.messageContent
            },()=>{
                this.setTipMessage()
            })
            this.props.form.setFieldsValue({ messageContent: this.props.rightData.messageContent })
        }
    }

    //取消
    handleCancel = () => {
        this.setState({ showTemplateModal: false, showSaveTemplateModal: false, showGroupModal: false })
    }

    //切换发送通道
    changeChannel = () => {

    }
    //切换线路
    changeLine = () => {

    }
    //选择短信模板
    getSmsTempalte = (val) => {
        this.setState({
            showTemplateModal: true
        })
    }
    //设为短信模板
    setSmsTemplate = (val) => {
        //判断短信内容是否有值
        if (this.state.messageContent) {
            this.setState({
                showSaveTemplateModal: true
            })
        } else {
            notificationFun('提示', '请先输入短信内容')
            return
        }

    }
    //切换发送对象
    changeSendPerson = (val) => {
        if (val.target.value === 'HAND_CHOOSE') {
            this.setState({
                chooseGroupModal: false
            });
        } else {
            this.setState({
                chooseGroupModal: true
            })
        }
    }

    //选择群组，打开群组列表弹框
    getSendGroup = () => {
        this.setState({
            showGroupModal: true
        })
    }

    //修改短信模板内容
    changeMessageContent = (type, val) => {
        if (type === 'messageContent') {
            val.persist();
            this.setState({
                messageContent: val.target.value ? val.target.value : ''
            }, () => {
                //提示信息
                this.setTipMessage();
            })
        }
    }
    /**
     * 短信内容字数提示
     */
    setTipMessage = () => {
        if (!this.state.messageContent) {
            this.setState({
                messageLength: 0,
                messageCanInput: 470
            })
            return
        } else {
            const { messageContent } = this.state
            this.setState({
                messageLength: messageContent.length,
                messageCanInput: 470 - messageContent.length
            })

        }
    }
    /**
     * 切换发送时间
     * @param {发送时间方式} val  1-立即发送  2-定时发送
     */
    changeSendTimeWay = (val) => {
        this.setState({
            sendTimeWay: val.target.value ? val.target.value : ''
        }, () => {
            if (this.state.sendTimeWay === '2') {
                this.setState({
                    showDatePick: true
                })
            } else {
                this.setState({
                    showDatePick: false
                })
            }
        })
    }
    /**
     * 发送短信
     * @param {*} val 
     */
    handleSubmit = (val) => {
        const { chooseGroupTags, groupIdDetailList } = this.state
        this.props.form.validateFieldsAndScroll((err, fieldsValue) => {
            if (!err) {
                const data = {
                    ...fieldsValue
                }
                let mobiles = [];
                if (fieldsValue.sendPerson === 'GROUP') {
                    //群组发送
                    if (!chooseGroupTags || chooseGroupTags.length <= 0) {
                        notificationFun('提示', '请选择群组')
                        return
                    }
                    let smsTargetGroup = [];
                    chooseGroupTags.forEach((item, index) => {
                        smsTargetGroup.push(item.id)
                    })
                    data.smsTargetGroup = smsTargetGroup.join(',')
                    groupIdDetailList.forEach((item, index) => {
                        // item.groupDetailDataSubmit.forEach((item, index) => {
                        //     mobiles.push({ targetNumber: item.personMobile })
                        // })
                        item.groupDetailData.forEach((obj,i)=>{
                            const str = item.selectedRowKeys.findIndex(element => element === obj.id );
                            if(str!==-1){
                                mobiles.push({ targetNumber: obj.personMobile })
                            }
                        })
                        
                    })
                    //mobile为空，提示群组下无发送人员
                    if(!mobiles || mobiles.length<=0){
                        notificationFun('提示', '群组下无发送人员')
                        return
                    }
                } else if (fieldsValue.sendPerson === 'HAND_CHOOSE') {
                    //手动发送，处理发送手机号
                    if (fieldsValue.handMobiles) {
                        let splitMobiles = fieldsValue.handMobiles.split(',')
                        try{
                            splitMobiles.forEach((item, index) => {
                                //校验手机号正确性
                                let reg = /^1(3\d|47|5((?!4)\d)|7\d|8\d|9\d)\d{8,8}$/
                                if (!reg.test(splitMobiles[index])) {
                                    let num = Number(index)+Number(1)
                                    dataUtil.errorConfirm('提示','录入号码有误：第' + num  + '个手机号格式有误')
                                    throw new Error("ending");
                                }else{
                                    mobiles.push({targetNumber: item})
                                }
                            })
                        }catch(e){
                            return
                        }
                        
                    } else {
                        dataUtil.errorConfirm('提示','请输入手机号')
                        return
                    }
                }
                data.mobiles = mobiles
                if (fieldsValue.sendTimeWay === '1') {
                    //立即发送
                    data.sendTime = dataUtil.Dates().formatTimeString(moment(moment().format('YYYY-MM-DD HH:mm:ss'),'YYYY-MM-DD HH:mm:ss'))
                } else {
                    //定时发送，检验时间
                    let currentDate = new Date()
                    data.sendTime = dataUtil.Dates().formatTimeString(fieldsValue.sendTime)
                    if(new Date(Date.parse(data.sendTime)) < currentDate){
                        dataUtil.errorConfirm('提示','定时发送时间不得早于当前时间')
                        return
                    }  
                }
                this.setState({
                    loading: true
                  })
                axios.post(smsSend, data, true).then(res => {
                    this.setState({
                        loading: false
                    })
                    if (res.data.status === 200) {
                        //发送成功，重置表单信息
                        this.props.form.resetFields();
                        this.setState({
                            groupIdDetailList:[],
                            chooseGroupTags:[],
                            messageContent:'',
                            groupDetailData:[],
                            handMobiles:''
                        },()=>{
                            this.setTipMessage()
                        })
                    }else{
                        
                    }
                    
                });
            }
        })
    }
    /**
     * 保存模板
     * @param {短信内容} val 
     */
    submitSaveTemplate = (val) => {
        if (val) {
            val.templateContent = this.state.messageContent
        }
        axios.post(addSmsTemplate, val, true).then(res => {
            if (res.data.status === 200) {
                this.setState({
                    showSaveTemplateModal: false
                })
            }
        });
    }

    onRef = (ref) => {
        this.table = ref
    }

    getSelectedRowKeys = (selectedRowKeys, selectedRows) => {
        this.setState({
            selectedRows,
            selectedRowKeys
        })
    }

    /**
     * 根据选中的群组获取群组下人员详细信息，默认选中所有记录
     * @param {群组Id} id 
     */
    getList = (id) => {
        const { searcher, groupIdDetailList } = this.state;
        const findIndex = groupIdDetailList.findIndex(item => item.groupId === id)
        if (findIndex === -1) {
            axios.get(getSmsGroupDetailListNoPage, { params: { searcher, groupId: id } }).then(res => {
                if (res.data.data) {
                    let groupDetailData = res.data.data;
                    let selectedRowKeys = []
                    groupDetailData.forEach((item, index) => {
                        selectedRowKeys.push(item.id)
                    })
                    groupIdDetailList.push({
                        groupId: id,
                        groupDetailData: groupDetailData,
                        // groupDetailDataSubmit: groupDetailData,
                        selectedRowKeys: selectedRowKeys
                    })
                    this.setState({
                        groupDetailData,
                        total: res.data.total,
                        rightData: null,
                        selectedRowKeys: selectedRowKeys
                    })
                }
            })
        } else {
            this.setState({
                groupDetailData: groupIdDetailList[findIndex].groupDetailData,
                selectedRowKeys: groupIdDetailList[findIndex].selectedRowKeys
            })
        }
    }

    setClassName = (record, index) => {
        return record.id === this.state.activeIndex ? 'tableActivty' : '';
    };

    getInfo = (record, index) => {
        this.setState({
            activeIndex: record.id,
            selectData: record,
            record: record
        })
    }

    /**
     * 监听列表多选框是否被选中
     * @param {*} selectedRowKeys 
     * @param {*} selectedRows 
     */
    onSelectChange = (selectedRowKeys, selectedRows) => {
        const { groupIdDetailList,groupDetailData } = this.state
        //处理groupIdDetailList数组，获取选中的数组
        const groupId = groupDetailData[0].groupId
        if (groupIdDetailList && groupIdDetailList.length > 0) {
            let index = groupIdDetailList.findIndex(item => item.groupId === groupId)
            // groupIdDetailList[index].groupDetailDataSubmit = selectedRows
            groupIdDetailList[index].selectedRowKeys = selectedRowKeys
            this.state.selectedRowKeys = [];
            this.setState({
                selectedRowKeys: selectedRowKeys
            })
        }

    };
    onChangeInput = (val) => {
        this.setState({
            searchstr: val ? val.target.value : ''
        })
    }
    /**
     * 根据人员姓名或手机号搜索
     * @param {*} val 
     */
    search = (val) => {
        const {groupDetailData} = this.state;
        const groupId = groupDetailData[0].groupId;
        if(val){
            let newData = dataUtil.search(groupDetailData,[{"key":"personName|personMobile","value":val}],true);
            this.setState({
                groupDetailData: newData
            });
        }else{
            this.getList(groupId);
        }
        
    }

    /**
     * 删除选中的群组
     * @param {} type 
     * @param {*} id 
     * @param {*} e 
     */
    handleClose = (type, id, e) => {
        const { chooseGroupTags,groupIdDetailList } = this.state
        const index = chooseGroupTags.findIndex(item => item.id === id)
        if (chooseGroupTags[index].isSelect === true) {
            this.setState({
                groupDetailData: null
            })
        }
        chooseGroupTags.splice(index, 1);
        //删除groupIdDetailList数据
        const detailIndex = groupIdDetailList.findIndex(item=>item.groupId === id)
        groupIdDetailList.splice(detailIndex,1)
        if(chooseGroupTags && chooseGroupTags.length<10){
            this.setState({
                showChooseGroupBtn:true
            })
        }
    };

    /**
     * 点击选中的群组
     * @param {*} type 
     * @param {*} id 
     * @param {*} e 
     */
    handleClickGroup = (type, id, e) => {
        const { chooseGroupTags } = this.state
        const index = chooseGroupTags.findIndex(item => item.id === id)
        if (index !== -1) {
            chooseGroupTags.forEach((item, index) => {
                if (item.id === id) {
                    item.isSelect = true;
                } else {
                    item.isSelect = false;
                }
            })
            this.getList(id);
        }

    }

    /**
     * 选择短信模板回调函数
     * @param {*} chooseArray 
     */
    submitChooseTemplate = (chooseArray) => {
        this.setState({
            showTemplateModal: false,
            messageContent: chooseArray[0].templateContent
        }, () => {
            this.setTipMessage();
        })
        this.props.form.setFieldsValue({ messageContent: chooseArray[0].templateContent })
    }

    /**
     * 选择群组后回调
     * @param {*} chooseArray 
     */
    submitChooseGroup = (chooseArray) => {
        const { chooseGroupTags,groupIdDetailList } = this.state
        //判断群组是否已存在
        if(chooseArray && chooseArray.length>0){
            chooseGroupTags.forEach((item,index)=>{
                const i = chooseArray.findIndex(element=>element.id === item.id)
                if(i!==-1){
                    chooseArray.splice(i,1)
                }
            })
        }
        let newArray = [...chooseGroupTags,...chooseArray]
        this.setState({
            chooseGroupTags: newArray,
            showGroupModal: false
        })
        if(newArray.length>=10){
            this.setState({
                showChooseGroupBtn:false
            })
        }
        newArray.forEach((item,index)=>{
            this.setDetailList(item.id)
        })
    }
    /**
     * 选择群组后，获取所有选择的群组下的详细列表信息
     * @param {*} id 
     */
    setDetailList = (id)=>{
        const { searcher, groupIdDetailList } = this.state;
        const findIndex = groupIdDetailList.findIndex(item => item.groupId === id)
        if(findIndex === -1){
            axios.get(getSmsGroupDetailListNoPage, { params: { searcher, groupId: id } }).then(res => {
                if (res.data.data) {
                    let groupDetailData = res.data.data;
                    let selectedRowKeys = []
                    groupDetailData.forEach((item, index) => {
                        selectedRowKeys.push(item.id)
                    })
                    groupIdDetailList.push({
                        groupId: id,
                        groupDetailData: groupDetailData,
                        // groupDetailDataSubmit: groupDetailData,
                        selectedRowKeys: selectedRowKeys
                    })
                }
            })
        }
    }

    render() {
        const { intl } = this.props.currentLocale
        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched, getFieldValue } = this.props.form;
        const formItemLayout0 = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 18 },
            },
        };
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 10 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 12 },
            },
        };
        const formItemLayout1 = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 5 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 18 },
            },
        };
        const columns = [
            {
                title: '姓名',
                dataIndex: 'personName',
                key: 'personName',
                render: (text, record) => {
                    return <span className={style.tdSpan}>{text ? text : ''}</span>
                }
            },
            {
                title: '手机号',
                dataIndex: 'personMobile',
                key: 'personMobile',
                render: (text, record) => {
                    return <span className={style.tdSpan}>{text ? text : ''}</span>
                }
            }
        ];
        const { isAdd, smsData, canModify } = this.props;
        const { changeButtonShow, groupDetailData, chooseGroupTags, selectedRowKeys,searchstr } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        return (
            <div>
                <Spin spinning={this.state.loading}>
                <div style={{ width: '100%', height: this.state.height + 200 }}>
                    <div className={style.topTagsBtn}>

                    </div>
                    <LabelFormLayout>
                        <Form onSubmit={this.handleSubmit} style={{ marginTop: '20px' }}>
                            <div>
                                <Row type="flex">
                                    <Col span={12}>
                                        <Form.Item label="选择通道：" {...formItemLayout}>
                                            {getFieldDecorator('sendChannel', {
                                                rules: [{ required: true, message: '请选择通道' }],
                                                initialValue: this.state.sendChannel
                                            })(
                                                <Radio.Group onChange={this.changeChannel.bind(this)}>
                                                    {this.state.channelList && this.state.channelList.map(item => {
                                                        return (
                                                            <Radio key={item.value} value={item.value}>{item.title}</Radio>
                                                        )
                                                    })
                                                    }
                                                </Radio.Group>
                                            )}
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row type="flex">
                                    <Col span={12}>
                                        <Form.Item label="选择线路：" {...formItemLayout}>
                                            {getFieldDecorator('line', {
                                                rules: [],
                                                initialValue: this.state.sendLine
                                            })(
                                                <Radio.Group onChange={this.changeLine.bind(this)}>
                                                    {this.state.lineList && this.state.lineList.map(item => {
                                                        return (
                                                            <Radio key={item.value} value={item.value}>{item.title}</Radio>
                                                        )
                                                    })
                                                    }
                                                </Radio.Group>
                                            )}
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row type="flex">
                                    <Col span={24}>
                                        <Form.Item label="短信内容：" {...formItemLayout1}>
                                            {getFieldDecorator('messageContentLable', {
                                                rules: [{ required: true, message: '请输入短信内容' }],
                                                initialValue: 'messageContentLable'
                                            })(
                                                <div>
                                                    <Form.Item style={{ display: 'inline-block', width: '100%' }}>
                                                        {getFieldDecorator('messageContent', {
                                                            initialValue: this.state.messageContent,
                                                            rules: [{ required: true, message: '请输入短信内容' }],
                                                        })(
                                                            <TextArea placeholder="请输入" maxLength={470} rows={5} onChange={this.changeMessageContent.bind(this, 'messageContent')} />
                                                        )}
                                                    </Form.Item>
                                                    <span style={{ display: 'block' }}>已输入{this.state.messageLength}个字，还剩{this.state.messageCanInput}个字</span>
                                                    <Button size="small" onClick={this.getSmsTempalte}>选择短信模板</Button>
                                                    <Button type="primary" size="small" onClick={this.setSmsTemplate} style={{ marginLeft: '20px' }}>设为短信模板</Button>
                                                </div>
                                            )}
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row type="flex">
                                    <Col span={24}>
                                        <Form.Item label="发送对象：" {...formItemLayout1}>
                                            {getFieldDecorator('sendPersonItem', {
                                                initialValue: 'sendPersonItem',
                                                rules: [],
                                            })(
                                                <div>
                                                    <Form.Item style={{ display: 'inline-block', width: '100%' }}>
                                                        {getFieldDecorator('sendPerson', {
                                                            initialValue: this.state.sendPerson,
                                                        })(
                                                            <Radio.Group onChange={this.changeSendPerson.bind(this)}>
                                                                {this.state.sendPersonList && this.state.sendPersonList.map(item => {
                                                                    return (
                                                                        <Radio key={item.value} value={item.value}>{item.title}</Radio>
                                                                    )
                                                                })
                                                                }
                                                            </Radio.Group>
                                                        )}
                                                    </Form.Item>
                                                    {this.state.chooseGroupModal && <div>
                                                        <div style={{ display: 'flex', flexDirection: 'row' }}>
                                                            <div className={style.divTags} >
                                                                {chooseGroupTags.map((item, index) => {
                                                                    const tag = item.groupName
                                                                    const isLongTag = tag.length > 20;
                                                                    const tagElem = (
                                                                        <Tag color={item.isSelect ? 'orange' : 'geekblue'} className={style.antTag} key={item.id} closable onClose={this.handleClose.bind(this, 'chooseCloseTags', item.id)} onClick={this.handleClickGroup.bind(this, 'chooseTags', item.id)}>
                                                                            {isLongTag ? `${tag.slice(0, 20)}...` : tag}
                                                                        </Tag>
                                                                    );
                                                                    return isLongTag ? (
                                                                        <Tooltip title={tag} key={item.id}>
                                                                            {tagElem}
                                                                        </Tooltip>
                                                                    ) : (
                                                                            tagElem
                                                                        );
                                                                })}
                                                            </div>
                                                            <div className={style.search}>
                                                                <Input type="text" size="small" style={{ width: '200px', marginLeft: '8px' }} placeholder="请输入姓名或手机号关键字" onChange={this.onChangeInput}/>
                                                                <Button type="primary" icon="search" size='small' onClick={this.search.bind(this,searchstr)}>搜索</Button>
                                                                <Table
                                                                    rowKey={record => record.id}
                                                                    defaultExpandAllRows={true}
                                                                    pagination={true}
                                                                    name={this.props.name}
                                                                    columns={columns}
                                                                    rowClassName={this.setClassName}
                                                                    size="small"
                                                                    loading={false}
                                                                    dataSource={groupDetailData}
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
                                                        {this.state.showChooseGroupBtn && <Button size="small" onClick={this.getSendGroup}>选择群组</Button>}
                                                    </div>}
                                                    {!this.state.chooseGroupModal &&
                                                        <Form.Item style={{ display: 'inline-block', width: '100%' }}>
                                                            {getFieldDecorator('handMobiles', {
                                                                initialValue: this.state.handMobiles,
                                                                rules: [{ required: true, message: '请输入手机号，多个手机号使用英文“,”隔开，如：15658744639,18611326424' }],
                                                            })(
                                                                <TextArea placeholder="请输入手机号，多个手机号请使用英文逗号“,”隔开，如：15658744639,18611326424" rows={10} style={{ width: '50%' }} />
                                                            )}
                                                        </Form.Item>
                                                    }
                                                </div>

                                            )}
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row type="flex">
                                    <Col span={24}>
                                        <Form.Item label="发送时间：" {...formItemLayout1}>
                                            {getFieldDecorator('sendTimeWay', {
                                                initialValue: this.state.sendTimeWay,
                                                rules: [{ required: true, message: '请选择或输入发送对象' }],
                                            })(
                                                <div>
                                                    <Radio.Group onChange={this.changeSendTimeWay.bind(this)}>
                                                        {this.state.sendTimeWayList && this.state.sendTimeWayList.map(item => {
                                                            return (
                                                                <Radio key={item.value} value={item.value}>{item.title}</Radio>
                                                            )
                                                        })
                                                        }
                                                    </Radio.Group>
                                                    {this.state.showDatePick &&
                                                        <Form.Item style={{ display: 'inline-block', width: '50%' }}>
                                                            {getFieldDecorator('sendTime', {
                                                                initialValue: this.state.sendTime,
                                                                rules: [{ required: true, message: '请选择定时发送时间' }],
                                                            })(
                                                                <DatePicker showTime placeholder="选择时间" style={{minWidth:'200px'}}/>
                                                            )}
                                                        </Form.Item>}
                                                </div>
                                            )}
                                        </Form.Item>
                                    </Col>
                                </Row>
                                {this.state.showTemplateModal &&
                                    <ImportModal
                                        modalVisible={this.state.showTemplateModal}
                                        handleCancel={this.handleCancel.bind(this)}
                                        rightData={this.state.rightData}
                                        selectData={this.state.selectData}
                                        submitChooseTemplate={this.submitChooseTemplate}
                                        permission={this.state.permission}
                                    />}
                                {this.state.showSaveTemplateModal &&
                                    <SaveTemplateModal
                                        modalVisible={this.state.showSaveTemplateModal}
                                        handleCancel={this.handleCancel.bind(this)}
                                        rightData={this.state.rightData}
                                        selectData={this.state.selectData}
                                        submitSaveTemplate={this.submitSaveTemplate}
                                    />}
                                {this.state.showGroupModal &&
                                    <ImportGroupModal
                                        modalVisible={this.state.showGroupModal}
                                        handleCancel={this.handleCancel.bind(this)}
                                        rightData={this.state.rightData}
                                        selectData={this.state.selectData}
                                        submitChooseGroup={this.submitChooseGroup}
                                        chooseGroupTags={this.state.chooseGroupTags}
                                    />}
                            </div>
                        </Form>
                        <LabelFormButton>
                            <Button onClick={this.handleSubmit.bind(this)} style={{ width: "100px" }} type="primary">发送</Button>
                        </LabelFormButton>
                    </LabelFormLayout>
                </div>
                </Spin>
            </div>
        )
    }
}
const AddModals = Form.create()(AddModal);
export default connect(state => ({
    currentLocale: state.localeProviderData,
}))(AddModals);