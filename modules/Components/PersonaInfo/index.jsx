import React, { Component } from 'react'

import { connect } from 'react-redux';

import { Table, Col, Input, Row, Select } from 'antd';
import MyIcon from "../../../components/public/TopTags/MyIcon"
import style from './style.less';

import axios from "../../../api/axios"
import {userIdprojectinfo} from "../../../api/api"
const Search = Input.Search;
const Option = Select.Option;
class CodeRule extends Component {
    constructor(props) {
        super(props)
        this.state = {
            info:{}
        }
    }

    componentDidMount() {
        let userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
        axios.get(userIdprojectinfo(userInfo.id)).then(res=>{
            this.setState({
                info:res.data.data
            },()=>{
                const {info}=this.state
                let role=!this.state.info.roles?[]:this.state.info.roles;
                let str=""
                if(role.length > 0){
                    str=role[0].roleName
                    role.forEach((item,i)=>{
                        if(i>0){
                            str+=`,${item.roleName}`
                        }
                    })
                    this.setState({
                        data:info.projectInfoVos,
                        rolename:str
                    })
                }
            })
        })
    }
    getInfo = (record, index) => {
      
        let id = record.id, records = record
        /* *********** 点击表格row执行更新state start ************* */
        if (this.state.activeIndex == id) {
       
          id = ''
          records = null
        } 
        /* *********** 点击表格row执行更新state end ************* */
        this.setState({
          activeIndex: id,
          rightData:record
        })
      }
    setClassName = (record, index) => {
        //判断索引相等时添加行的高亮样式
        return record.id === this.state.activeIndex ? `${style['clickRowStyl']}` : "";
    }
    render() {
        const { intl } = this.props.currentLocale
        const columns = [
            {
                title: intl.get('wsd.i18n.pre.project.projectname'),
                dataIndex: 'projectName',
                key: 'projectName',
                width: "30%",
              
            }, {
                title: intl.get('wsd.i18n.plan.prepa.teamName'),
                dataIndex: 'orgName',
                key: 'orgName',
                width: "30%",
            },
            {
                title: intl.get('wsd.i18n.sys.role.rolename'),
                dataIndex: 'roleName',
               
            }]
        return (
            <div className={style.main} style={{ height: this.props.height + 40 }}>
                <div className={style.back}>
                    <main>
                        <h2>用户基本信息</h2>
                        <div>
                            <Row className={style.item}>
                                <Col span={8}><span>用户名：</span>{this.state.info.userName}</Col>
                                <Col span={8}><span>姓名：</span>{this.state.info.actuName}</Col>
                                <Col span={8}><span>性别：</span>{this.state.info.sex?this.state.info.sex.name:null}</Col>
                                <Col span={8}><span>出生日期：</span>{this.state.info.entryDate? this.state.info.entryDate.substr(0,10):null}</Col>
                                <Col span={8}><span>证件号：</span>{this.state.info.cardNum}</Col>
                                <Col span={8}><span>手机号：</span>{this.state.info.phone}</Col>
                            </Row>
                            <Row className={style.item}>
                                <Col span={8}><span>所属机构：</span>{this.state.info.org? this.state.info.org.name:null}</Col>
                                <Col span={8} className={style.role}><span>角色：</span>{this.state.rolename}</Col>
                                <Col span={8}><span>状态：</span>{this.state.info.staffStatus?this.state.info.staffStatus.name:null}</Col>
                            </Row>
                            <Row className={style.item}>
                                <Col span={8}><span>备注：</span>--</Col>
                            </Row>
                        </div>
                    </main>
                    <div className={style.mytable}>
                        <h3>参与项目</h3>
                        <Table
                            rowKey={record => record.id}
                            pagination={false}
                            size="small"
                            columns={columns}
                            scroll={{y:this.props.height-445}}
                            dataSource={this.state.data}
                            rowClassName={this.setClassName}
                            onRow={(record, index) => {
                                return {
                                    onClick: (event) => {

                                        this.getInfo(record, event);
                                    },
                                };
                            }
                            }
                        />
                    </div>

                </div>

            </div>
        )
    }
}
const mapStateToProps = state => {
    return {
        currentLocale: state.localeProviderData,
    }
};


export default connect(mapStateToProps, null)(CodeRule);