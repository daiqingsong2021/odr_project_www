import React, { Component } from 'react';
import { Modal, Form, Row, Col, Input, Button, Icon, Select, Divider, DatePicker, Descriptions, TreeSelect,Tabs } from 'antd';
import moment from 'moment';
import style from './style.less';
import intl from 'react-intl-universal';
import { connect } from 'react-redux';
import { curdCurrentData } from '../../../../../../store/curdData/action';
import axios from '../../../../../../api/axios';
import {faultDailyAdd,faultDailyUpdate} from '@/modules/Suzhou/api/suzhou-api';
const { TextArea } = Input;
const Option = Select.Option;
const TreeNode = TreeSelect.TreeNode;
import PublicButton from "../../../../../../components/public/TopTags/PublicButton";
import * as dataUtil from "../../../../../../utils/dataUtil";
import { getSelectTreeArr } from "@/modules/Suzhou/components/Util/firstLoad";
import SelectSection from '@/modules/Suzhou/components/SelectSection';
const { TabPane } = Tabs;
import { getBaseData } from '@/modules/Suzhou/components/Util/util';
import AddModalComponent from '../AddModal'
export class AddModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            disabled:true,
            lineArr:[],//线路
            tabVisible:true,//true 不能点
            addInfo:{},//新增的数据
            height:0,
            disabledFormEdit:false,
            isSubmitBtn:false
        }
    }
    componentDidMount() {
        // 初始化css样式
		const h = document.documentElement.clientHeight || document.body.clientHeight;   // 浏览器高度，用于设置组件高度
		this.setState({
			height: h - 290,
		});
        getBaseData("line").then((res) => {
            if (Array.isArray(res)) {
                this.setState({
                    lineArr:res
                })
            }
        });
        this.props.addOrModify == 'modify'?this.setState({tabVisible:false,addInfo:this.props.rightData,disabledFormEdit:true}):null
    }
    render() {
        const { intl } = this.props.currentLocale
        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
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
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 18 },
            },
        };
        const formItemLayout1 = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 3 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 21 },
            },
        };
        const { isAdd,addOrModify } = this.props;
        console.log(this.props.modifyDisabled)
        const {addInfo,showEditInfoModal,disabledFormEdit} = this.state;
        return (
            <div>
                <div className={style.main} style={{top:this.props.flowRight?'40px':'0'}} data-contentwidth = {'100%'} id = {this.props.menuCode + "-LabelsGroup"}>
                    <div id={id} className={style.content} style={{ width: '100%' ,height: this.props.height ? parseInt(this.props.height) + 50 +'px' : this.state.height+190}}>
                        <div className={style.subTags}> 
                            {/* <div className={style.content}  style={{ width: '100%' ,height: this.props.height ? parseInt(this.props.height) +10 +'px' : this.state.height+110}}> */}
                                <div className={style.rightClose} onClick={this.props.handleCancel}>
                                    <Icon type="close" />
                                </div>
                                <Tabs defaultActiveKey="1">
                                        <TabPane tab="新增" key="3">
                                            <AddModalComponent
                                                {...this.props}
                                                height={this.state.height} 
                                            />
                                        </TabPane>
                                </Tabs>
                        </div>
                    </div> 
                </div>
            </div>
        )
    }
}
const AddModals = Form.create()(AddModal);
export default connect(state => ({
    currentLocale: state.localeProviderData,
}))(AddModals);