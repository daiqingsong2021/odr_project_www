import React, { Component } from 'react'
import style from './style.less'
import { Modal, Button, Row, Col, Form, Select, Input, Radio, TreeSelect, Checkbox, message } from 'antd';
import SubmitButton from "../../../../components/public/TopTags/SubmitButton"
import axios from "../../../../api/axios"
import { orgTree, roleList,tmmInfo } from "../../../../api/api"
import { parse } from 'path';
import { connect } from 'react-redux';
const RadioGroup = Radio.Group;
const Option = Select.Option;
const TreeNode = TreeSelect.TreeNode;

// 用户管理 -- 批量新增用户
export class BatchAddModel extends Component {
    constructor(props) {
        super(props);
        userInfo: false,  // 用户信息
        this.state = {
            data: [

            ],
            sameroles: [],
            ischecked: []//标记密码是否同上
        }
    }
    //初始化
    initlData = () => {
        const templedata = []
        for (let i = 0; i < 10; i++) {
            templedata.push({ sex: 1,level:1})
        }
        this.setState({
            data: templedata
        })
    }
    componentDidMount() {
        const { intl } = this.props.currentLocale
        const templedata = []
        let userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
        this.initlData()
        //获取组织机构
        axios.get(orgTree).then(res => {
            let data = []
            if (res.data.data) {
                data = res.data.data

            }
            this.setState({
                orglist: data,
                userInfo,
                orglist1: [{ id: 8848, title: intl.get("wsd.i18n.doc.temp.ditto"), parentId: 0, type: "same", value: "8848" }, ...data]
            })
        })
        this.gettmmInfo()
    }
    //获取密码设置
    gettmmInfo = () => {
        axios.get(tmmInfo).then(res => {
            if (res.data.data) {
                this.setState({
                    passwordSet: res.data.data
                })
            }


        })

    }
    selectDropdown = () => {
        //获取用户角色
        if (!this.state.rolelist) {
            axios.get(roleList).then(res => {
                this.setState({
                    rolelist: res.data.data
                })
            })
        }

    }
    //获取密级
    getSecuty = () => {
        if (!this.state.secutylevellist) {
            axios.get("api/base/dict/comm.secutylevel/select/tree").then(res => {
                this.setState({
                    secutylevellist: res.data.data,
                    secutylevellist1: null
                })
            })
        }
    }
    //onCancel
    onCancel = () => {
        this.initlData()
        this.props.cancelBacth()
    }
    //保存
    handleSubmit = () => {
        const { intl } = this.props.currentLocale
        let data = []
        let isAdd=true;
        let flag = false;
        this.state.data.forEach((item, index) => {
            for (let i in item) {
                if (item[i] && i != "sex" && i!="level") {
                    if (!item.actuName) {
                        message.warning(`第${index + 1}个用户信息的姓名不能为空`)
                        isAdd=false
                        return
                    }
                    if (!item.userName) {
                        message.warning(`第${index + 1}个用户信息的用户名不能为空`)
                        isAdd=false
                        return
                    }
                    if (!item.roles&& this.state.userInfo && this.state.userInfo.isOpen == 0) {
                        message.warning(`第${index + 1}个用户信息的用户角色不能为空`)
                        isAdd=false
                        return
                    }
                    if (!item.password ) {
                        message.warning(`第${index + 1}个用户信息的密码不能为空`)
                        isAdd=false
                        return
                    }
                    if(item.password){
                        let parten=/^[^\u4e00-\u9fa5]{0,}$/
                        if(!parten.test(item.password)){
                            message.warning(`第${index + 1}个用户信息的密码不能包含中文`)
                            isAdd=false
                            return
                        }
                        let reg = new RegExp("^.{"+this.state.passwordSet.length+",32}$"); 
                        if(!reg.test(item.password)){
                            message.warning(`第${index + 1}个用户信息的密码长度不在${this.state.passwordSet.length}~32字符之间`)
                            isAdd=false
                            return
                        }
                    }
                    if (!item.orgId ) {
                        message.warning(`第${index + 1}个用户信息的所属信息不能为空`)
                        isAdd=false
                        return
                    }
                    flag = true
                }
            }
            if (flag) {
                data.push(item)
                flag = false
            }

        })

        if (data.length > 0 && isAdd) {
            data.forEach((item, i) => {
                if (item.roles && item.roles[0] == 8848) {
                    item.roles = this.state.data[0].roles
                }
                if (item.orgId && item.orgId == 8848) {
                    item.orgId = this.state.data[0].orgId
                }
            })
            axios.post("api/sys/user/addBatch", data, true).then(res => {
                //关闭modal
                this.props.cancelBacth()
                //刷新用户列表
                this.props.refresh(data)
                this.initlData()
            })
        }




    }
    //SaveSame同上
    SaveSame = (arg, e, s) => {
        e.stopPropagation();
        const { data, ischecked } = this.state
        if (e.target.checked) {


            if (data[0][arg.attribute]) {
                data[arg.index][arg.attribute] = data[0][arg.attribute]
                this.setState(preState => ({
                    data: [...data]
                }))
            }
            this.setState(preState => ({
                ischecked: [...preState.ischecked, arg.index]
            }))
        } else {
            let current = ischecked.findIndex(item => item == arg.index)
            this.setState((preState, props) => ({
                ischecked: [...preState.ischecked.splice(0, current), ...preState.ischecked.splice(current + 1)]
            }))


        }
    }
    //Select设置数据参数属性名、索引、多选数组id
    onChangeSelect = (attribute, index, array, i) => {
        const { data } = this.state
        let obj = data[index]
        if (array.length > 0) {
            //存在同上选项
            if (array[array.length - 1] == 8848) {
                obj[attribute] = [8848]
                this.setState({
                    data: [...data]
                })
                return
            }
            if (array[0] == 8848) {

                obj[attribute] = array[1]
                this.setState({
                    data: [...data]
                })
                return
            }




        }
        obj[attribute] = array
        this.setState({
            data: [...data]
        })
    }
    //选择密级
    selectSecuty=(attribute,index,value)=>{

        const { data } = this.state
        let currentindex = data.findIndex((v, i) => i == index)
        let obj = data[currentindex]
        obj[attribute] = value
        this.setState({
            data: [...data]
        })
    }
    //Radio设置数据参数属性名、索引、当前对象
    onChangeRadio = (attribute, index, e) => {
        const { data } = this.state
        let currentindex = data.findIndex((v, i) => i == index)
        let obj = data[currentindex]
        obj[attribute] = e.target.value
        this.setState({
            data: [...data]
        })

    }
    //TreeSelect设置数据参数属性名、索引、当前id
    onChangeTreeSelect = (attribute, index, id) => {
        const { data } = this.state
        let currentindex = data.findIndex((v, i) => i == index)
        let obj = data[currentindex]
        obj[attribute] = parseInt(id)
        this.setState({
            data: [...data]
        })
    }
    //input设置数据参数属性名、索引、当前对象
    setData = (attribute, index, e) => {

        const { data } = this.state
        let currentindex = data.findIndex((v, i) => i == index)
        let obj = data[currentindex]
        obj[attribute] = e.currentTarget.value
        this.setState({
            data: [...data]
        }, () => {
            if (index == 0) {
                const { ischecked, data } = this.state
                ischecked.forEach(item => {
                    data[item].password = data[0].password
                })
                this.setState({
                    data: [...data]
                })
            }
        })

    }
    render() {

        const { intl } = this.props.currentLocale
        const items = this.state.data.map((value, index) => {
            let id, start = index + 1
            if (start > 9 && start < 100) {
                id = "0" + start
            } else if (start >= 100) {
                id = start
            } else {
                id = "00" + start
            }
            return <Row gutter={8} key={index}>
                <Col span={1}>
                    {id}
                </Col>
                <Col span={2}>
                    <Form.Item>
                        <Input onChange={this.setData.bind(this, "actuName", index)} value={this.state.data[index].actuName ? this.state.data[index].actuName : null} maxLength={21}/>
                    </Form.Item>
                </Col>
                <Col span={3}>
                    <Form.Item>
                        <Input onChange={this.setData.bind(this, "userName", index)} value={this.state.data[index].userName ? this.state.data[index].userName : null} maxLength={21}/>
                    </Form.Item>
                </Col>
                {this.state.userInfo &&this.state.userInfo.isOpen == 0 && <Col span={3}>
                    <Form.Item>
                        <Select mode="multiple"
                            onChange={this.onChangeSelect.bind(this, "roles", index)}
                            value={this.state.data[index].roles ? this.state.data[index].roles : []}
                            onDropdownVisibleChange={this.selectDropdown}

                        >
                            {index != 0 && <Option value={8848} key={"same"}>{intl.get("wsd.i18n.doc.temp.ditto")}</Option>}
                            {this.state.rolelist && this.state.rolelist.map(item => {
                                return <Option value={item.id} key={id}>{item.roleName}</Option>
                            })}

                        </Select>
                    </Form.Item>
                </Col>}

                <Col span={3}>
                    <Form.Item>
                        <TreeSelect
                            onChange={this.onChangeTreeSelect.bind(this, "orgId", index)}

                            style={{ width: "100%" }}
                            treeData={index == 0 ? this.state.orglist : this.state.orglist1}
                            allowClear
                            treeDefaultExpandAll
                            value={this.state.data[index].orgId ? this.state.data[index].orgId : null}
                        />
                    </Form.Item>
                </Col>
                <Col span={4}>
                    <Form.Item>
                        {/* <Input onChange={this.setData.bind(this, "level", index)} value={this.state.data[index].email ? this.state.data[index].email : null} /> */}
                        <Select onDropdownVisibleChange={this.getSecuty} disabled={this.state.userInfo != null ? (this.state.userInfo.isOpen == 1 ? true : false) : false} onChange={this.selectSecuty.bind(this, "level", index)} value={this.state.data[index].level ? this.state.data[index].level : 1}>
                            { this.state.secutylevellist ? this.state.secutylevellist.map(item => {
                                return <Option value={item.value} key={item.value}>{item.title}</Option>
                            }):<Option value={1} key={1}>{"非密"}</Option>}
                        </Select>
                    </Form.Item>
                </Col>

                <Col span={3}>
                    <Form.Item>
                        <RadioGroup onChange={this.onChangeRadio.bind(this, "sex", index)} value={this.state.data[index].sex}>
                            <Radio value={1}>{intl.get("wsd.i18n.sys.user.male")}</Radio>
                            <Radio value={0}>{intl.get("wsd.i18n.sys.user.female")}</Radio>
                        </RadioGroup>
                    </Form.Item>

                </Col>
                <Col span={5}>
                    <Form.Item>
                        {index == 0 ? <Input onChange={this.setData.bind(this, "password", index)} value={this.state.data[index].password ? this.state.data[index].password : null} maxLength={33}/>
                            :
                            <Input disabled={(this.state.ischecked.findIndex(item => item == index) == -1) ?
                                false : true} addonAfter={<Checkbox onChange={this.SaveSame.bind(this, { index, attribute: "password" })}>{intl.get("wsd.i18n.doc.temp.ditto")}</Checkbox>}
                                onChange={this.setData.bind(this, "password", index)} maxLength={33}
                                value={this.state.data[index].password ? this.state.data[index].password : null} />}
                    </Form.Item>
                </Col>
            </Row>

        })
        return (
            <div >
                <Modal title={intl.get("wsd.i18n.sys.user.mostadd")}
                    className={style.main}
                    visible={true}
                    onCancel={this.onCancel}
                    mask={false}
                    maskClosable={false}
                    centered={true}
                    footer={<div className="modalbtn">
                        <SubmitButton key={1} onClick={this.onCancel} content={intl.get("wsd.global.btn.cancel")}/>
                        <SubmitButton key={2} onClick={this.handleSubmit} type="primary" content={intl.get("wsd.global.btn.preservation")} />
                    </div>}
                    width="80%"
                    bodyStyle={{ padding: '15px' }}
                >

                    <Form>
                        <div>

                            <div style={{ borderBottom: '1px solid #e8e8e8', paddingBottom: '8px', marginBottom: "7px" }}>
                                <Row gutter={8}>
                                    <Col span={1}>ID</Col>
                                    <Col span={2} className={style.head}>{intl.get("wsd.i18n.sys.user.username")}</Col>
                                    <Col span={3} className={style.head}>{intl.get("wsd.i18n.sys.user1.userLoginName")}</Col>
                                   {this.state.userInfo &&this.state.userInfo.isOpen == 0 && <Col span={3} className={style.head}>{intl.get('wsd.i18n.sys.user1.actuname')}</Col>}
                                    <Col span={3} className={style.head} >{intl.get("wsd.i18n.doc.projectdoc.commandorg")}</Col>
                                    <Col span={4} className={style.head}> {intl.get("wsd.i18n.sys.user1.userlevel")}</Col>
                                    <Col span={3}>{intl.get('wsd.i18n.sys.user1.sex')}</Col>
                                    <Col span={5} className={style.head}>{intl.get('wsd.i18n.sys.user.secrect')}</Col>
                                </Row>
                            </div>
                            {items}


                        </div>
                    </Form>


                </Modal>

            </div>
        )
    }
}


const mapStateToProps = state => {
    return {
        currentLocale: state.localeProviderData,
    }
};


export default connect(mapStateToProps, null)(BatchAddModel);
