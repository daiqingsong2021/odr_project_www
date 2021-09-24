import React, { Component } from 'react';
import { Row, Col} from 'antd';
import style from './style.less';
import PublicButton from '@/components/public/TopTags/PublicButton';
import notificationFun from '@/utils/notificationTip';
import AddModal from "../AddModal"
import axios from '@/api/axios';
import {faultDailyProblemDealDel} from '@/modules/Suzhou/api/suzhou-api';
export class TopTags extends Component{
    constructor(props){
        super(props);
        this.state={
            addModal:false
        }
    }
    componentDidMount(){

    }
    hasRecord=()=>{
        if (this.props.selectedRows.length == 0) {
            notificationFun('未选中数据', '请选择数据进行操作');
            return false;
        } else {
            return true
        }
    }
    btnClicks = (name, type) =>{
        console.log(name)
        const {record,selectedRows,selectedRowKeys} = this.props;
        console.log(selectedRows)
        if(name == 'AddTopBtn'){
            this.setState({
                addModal:true,
                title:'新增',
                type:'add'
            })
        }
        if(name == 'DeleteTopBtn'){
            if (selectedRowKeys.length > 0) {
                axios.deleted(faultDailyProblemDealDel, { data: selectedRowKeys }, true).then(res => {
                    this.props.delSuccess();
                });
            }
        }
    }
    handleCancel=()=>{
        this.setState({
            addModal:false 
        })
    }
    render(){
        return(
            <div className={style.main}>
                <div>
                    {this.props.addInfo && this.props.problemInfo &&(
                        <Row>
                            <Col span={24}>
                                <span>日期：</span>
                                <label>{this.props.addInfo.recordDay} </label>
                                <span>线路：</span>
                                <label>{this.props.addInfo.lineName}</label>
                            </Col>
                            <Col span={24}>
                                <span>故障描述：</span><label>{this.props.problemInfo.problemDesc}</label>
                            </Col>
                            <Col span={24}>
                                <span>故障原因：</span><label>{this.props.problemInfo.problemReason}</label>
                            </Col>
                            <Col span={24}>
                                <span>备注：</span><label>{this.props.problemInfo.remark}</label>
                            </Col>
                        </Row>
                    )}
                </div>
                {!this.props.modifyDisabled && (
                    <div className={style.tabMenu}>
                        {/* <PublicButton name={'新增'} title={'新增'} icon={'icon-add'}
                                afterCallBack={this.btnClicks.bind(this, 'AddTopBtn')}
                                res={'MENU_EDIT'}
                            /> */}
                        <PublicButton name={'删除'} title={'删除'} icon={'icon-shanchu'}
                                useModel={true} edit={true}
                                verifyCallBack={this.hasRecord}
                                afterCallBack={this.btnClicks.bind(this,'DeleteTopBtn')}
                                content={'你确定要删除吗？'}
                                res={'MENU_EDIT'}
                            />
                    </div>
                )}
                {this.state.addModal && (
                    <AddModal 
                        modalVisible = {this.state.addModal} 
                        title={this.state.title} 
                        type={this.state.type}
                        addSuccess={this.props.addSuccess}
                        record={this.props.record}
                        handleCancel={this.handleCancel}
                        delSuccess={this.props.delSuccess}
                        problemInfo={this.props.problemInfo}
                        />
                )}
            </div>
        )
    }
}
export default TopTags;