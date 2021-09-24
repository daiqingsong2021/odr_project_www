import React, { Component } from 'react';
import { Row, Col} from 'antd';
import style from './style.less';
import PublicButton from '@/components/public/TopTags/PublicButton';
import QuesAdd from "../QuesAdd"
import axios from '@/api/axios';
import notificationFun from '@/utils/notificationTip';
import {faultDailyProblemDel} from '@/modules/Suzhou/api/suzhou-api';

export class SubTopTags extends Component{
    constructor(props){
        super(props);
        this.state={
            quesAdd:false,
        }
    }
    btnClicks = (name, type) =>{
        const {record,selectedRows,selectedRowKeys} = this.props;
        console.log(selectedRows)
        if(name == 'AddTopBtn'){
            this.setState({
                quesAdd:true,
                title:'新增',
                type:'add'
            })
        }
        if(name == 'ModifyTopBtn'){
            !record?notificationFun("提示",'请选择数据进行操作'):this.setState({
                quesAdd:true,
                title:'修改',
                type:'modify'
            })
        }
        if(name == 'DeleteTopBtn'){
            if (selectedRowKeys.length > 0) {
                axios.deleted(faultDailyProblemDel, { data: selectedRowKeys }, true).then(res => {
                    this.props.delSuccess();
                });
            }
        }
    }
    //判断是否选中数据
    hasRecord=()=>{
        console.log(this.props.selectedRows)
        if (this.props.selectedRows.length == 0) {
            notificationFun('未选中数据', '请选择数据进行操作');
            return false;
        } else {
            return true
        }
    }
    cancelQuestion=()=>{
        this.setState({
            quesAdd:false
        })
    }
    render(){
        const {addInfo,modifyDisabled} = this.props;
        return(
            <div className={style.main}>
                <div>
                    <Row>
                        {addInfo && (
                            <Col span={24}>
                                <span>日期：</span>
                                <label>{addInfo.recordDay}</label>
                                <span style={{marginLeft:'8px'}}>线路：</span>
                                <label>{addInfo.lineName}</label>
                            </Col>
                        )}
                    </Row>        
                </div>
                {!modifyDisabled &&(
                    <div className={style.tabMenu}>
                        <PublicButton name={'新增'} title={'新增'} icon={'icon-add'}
                        afterCallBack={this.btnClicks.bind(this, 'AddTopBtn')}
                        res={'MENU_EDIT'}
                        />
                        {/* <PublicButton name={'修改'} title={'修改'} icon={'icon-xiugaibianji'}
                            afterCallBack={this.btnClicks.bind(this, 'ModifyTopBtn')}
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
                {this.state.quesAdd && (
                    <QuesAdd 
                        modalVisible = {this.state.quesAdd} 
                        title={this.state.title} 
                        type={this.state.type}
                        addSuccess={this.props.addSuccess}
                        record={this.props.record}
                        addInfo={this.props.addInfo}
                        handleCancel={this.cancelQuestion}
                        updateSuccess={this.props.updateSuccess}
                        delSuccess={this.props.delSuccess}
                        />
                )}
            </div>
        )
    }
}
export default SubTopTags;