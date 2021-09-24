import React, { Component } from 'react'
import { notification } from 'antd';
import PublicDirect from "../PublicDirect"
import PublicAbolish from '../PublicAbolish'
import Search from '../SearchVeiw/index'
import Approval from '../Workflow/Approval'
import style from './style.less'
import Add from '../Add'
import HandleModal from '../HandleModal'
import ForwartModal from '../Forward'
import VerifyModal from '../VerifyModal'
import ReleaseModal from '../ReleaseModal'

//import SelectProjectBtn from "../../../../components/public/SelectBtn/SelectProjectBtn"
import PublicButton from "../../../../components/public/TopTags/PublicButton"
import PublicMenuButton from "../../../../components/public/TopTags/PublicMenuButton"
import SelectProjectBtn from '@/modules/Suzhou/components/SelectBtn/SelectProBtn';
import SelectSectionBtn from '@/modules/Suzhou/components/SelectBtn/SelectSectionBtn';
export class PlanDefineTopTags extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modalVisible: false,
            reportedVisible: false,
            showApprovalVisible: false,
            modelTitle: '',
            planDefineSelectData: [],
            //传递给public的title
            publicTitle: '',
            directVisible: false,
            abolishVisible: false,
            chuliModal:false,//处理弹窗
            zhuanfaModal:false,//转发弹窗
            shenheModal:false,//审核弹窗
        }
    }


    // modal取消
    handleCancel = () => {
        this.setState({
            modalVisible: false
        })
    }
    handleReportedCancel = () => {
        this.setState({
            reportedVisible: false
        })
    }

    handleDirect = () => {
        this.setState({
            directVisible: false
        })
    }
    handleAbolish = () => {
        this.setState({
            abolishVisible: false
        })
    }
    //处理
    chuliModalCancel = ()=>{
        this.setState({
            chuliModal: false
        })
    }
    //审批
    shenpiModalCancel = ()=>{
        this.setState({
            shenpiModal: false
        })
    }
     //处理
     zhuanfaModalCancel = ()=>{
        this.setState({
            zhuanfaModal: false
        })
    }
    //审核
    shenheModalCancel=()=>{
        this.setState({
            shenheModal: false
        }) 
    }
    render() {
        // 显示表单弹窗
        let showFormModal = (name, menu) => {
            let {projectName} = this.props;
            // 新增
            if (name === 'AddTopBtn') {
                this.setState({
                    modalVisible: true,
                    modelTitle: '新增问题'
                })
            }
            // 删除
            if (name === 'DeleteTopBtn') {
                this.props.deleteQuestion()
            }
            if(name == 'direct'){
                // this.setState({
                //     publicTitle: '直接发布',
                //     directVisible: true,
                //     projectName: "["+projectName+"]"
                // })
                this.setState({
                    shenpiModal:true,
                    modelTitle:'发布'
                })
            }
            // 关闭
            if (name === 'directClose') {
                if (this.props.projectId) {
                    this.setState({
                        reportedVisible: true
                    })
                } else {
                    notification.warning(
                        {
                            placement: 'bottomRight',
                            bottom: 50,
                            duration: 2,
                            message: '未选中数据',
                            description: '请选择项目进行操作'
                        }
                    )
                }
            }
            // 处理
            if (name === 'chuliBtn') {
                // this.props.deleteQuestion()
                this.setState({chuliModal:true,modelTitle: '处理问题'});
            }
            //转发
            if(name == 'zhuanfaBtn'){
                // this.props.zhuanfaQuestion();
                this.setState({zhuanfaModal:true,modelTitle: '转发问题'});
            }
            //审核
            if(name == 'shenheBtn'){
                this.setState({shenheModal:true,modelTitle: '审核问题'});
            }
            // 挂起
            if(name == 'guaqiBtn'){
                this.props.hangUpQuestion();
            }
            //取消挂起
            if(name == 'quxiaoguaqiBtn'){
                this.props.cancelHangUpQuestion();
            }
        }
        const {permission,permissionEditBtn,permissionHandleBtn,permissionReviewBtn
            ,handleGetProjectId,handleOpenSection,projectId} = this.props;
        return (
            <div className={style.main}>
                <div className={style.search}>
                    <Search search={this.props.search} type={this.props.type}/>
                </div>
                <div className={style.tabMenu}>
                    {/*选择项目*/}
                    {/* <SelectProjectBtn openProject={this.props.openProject }  typeCode={"comucate"} /> */}
                    {/* type存在时显示选择项目标段 */}
                    {this.props.type && <SelectProjectBtn openPro={handleGetProjectId} />}                   
                    {this.props.type && <SelectSectionBtn openSection={handleOpenSection} data1={projectId} />}
                    {/*新增*/}
                    {(permission.indexOf(permissionEditBtn)!=-1 )&& <PublicButton name={'新增'} title={'新增'} icon={'icon-add'} afterCallBack={showFormModal.bind(this, 'AddTopBtn')} />}
                    
                    {/*发布*/}
                    {(permission.indexOf(permissionEditBtn)!=-1 )&& <PublicButton name={'发布'} title={'发布'} icon={'icon-fabu'} show={this.props.fabuEdit} 
                    afterCallBack={showFormModal.bind(this,'direct')} />} 
                    {/*删除*/}
                    {(permission.indexOf(permissionEditBtn)!=-1 )&& <PublicButton title={"删除"} edit={this.props.iscreatorAuth  } show={this.props.delEdit}
                        useModel={true} verifyCallBack={this.props.deleteVerifyCallBack} afterCallBack={showFormModal.bind(this, "DeleteTopBtn")} icon={"icon-delete"} />}
                    {/* 处理 */}
                    {(permission.indexOf(permissionHandleBtn)!=-1)&& <PublicButton name={'处理'} title={'处理'} icon={'icon-xiugaibianji'} 
                    show={this.props.handleEdit} afterCallBack={showFormModal.bind(this, 'chuliBtn')} rightData={this.props.rightData} />}
                    {/* 转发 */}
                    {(permission.indexOf(permissionHandleBtn)!=-1)&& <PublicButton name={'转发'} title={'转发'} icon={'icon-zhuanfa'} 
                    show={this.props.zhuanfaEdit} afterCallBack={showFormModal.bind(this, 'zhuanfaBtn')} rightData={this.props.rightData} />}
                    {/* 审核 */}
                    {(permission.indexOf(permissionReviewBtn)!=-1)&& <PublicButton name={'审核'} title={'审核'} icon={'iconshenhe1'} 
                    show={this.props.shenheEdit} afterCallBack={showFormModal.bind(this, 'shenheBtn')} rightData={this.props.rightData} />}
                    {/* 挂起 */}
                    {<PublicButton name={'挂起'} title={'挂起'} icon={'iconguaqi'} 
                    useModel={true} verifyCallBack={this.props.deleteVerifyCallBack} content={'您确定要挂起吗'} show={this.props.guaqiEdit} afterCallBack={showFormModal.bind(this, 'guaqiBtn')} rightData={this.props.rightData} />}
                    {/* 取消挂起*/}
                    {<PublicButton name={'取消挂起'} title={'取消挂起'} icon={'iconquxiaoguaqi'} 
                    useModel={true} verifyCallBack={this.props.deleteVerifyCallBack} content={'您确定要取消挂起吗'} show={this.props.quxiaoguaqiEdit} afterCallBack={showFormModal.bind(this, 'quxiaoguaqiBtn')} rightData={this.props.rightData} />}
                </div>
                {/* 直接发布 */}
                {this.state.directVisible && <PublicDirect
                    modalVisible={this.state.directVisible}
                    handleCancel={this.handleDirect}
                    update={this.props.update}
                    params = {this.props.params}
                />}
                {/* 取消发布 */}
                {this.state.abolishVisible && <PublicAbolish
                    modalVisible={this.state.abolishVisible}
                    handleCancel={this.handleAbolish}
                    projectId={this.props.projectId}
                    update={this.props.update}
                    projectName={this.props.projectName}
                />}
               
                {/* 新增 */}
                {this.state.modalVisible && <Add
                    type={this.props.type}
                    projectId={this.props.projectId}
                    modalVisible={this.state.modalVisible}
                    handleCancel={this.handleCancel}
                    modelTitle={this.state.modelTitle}
                    addData={this.props.addData}
                    loginUserId = {this.props.loginUserId}
                />}
                {/* 审批*/}
                {this.state.shenpiModal && <ReleaseModal
                    modalVisible={this.state.shenpiModal}
                    handleCancel={this.shenpiModalCancel}
                    modelTitle={this.state.modelTitle}
                    parentData = {this.props.rightData}
                    addData={this.props.addData}
                    loginUserId = {this.props.loginUserId}
                />}
                {/* 处理 */}
                {this.state.chuliModal && <HandleModal
                    modalVisible={this.state.chuliModal}
                    handleCancel={this.chuliModalCancel}
                    modelTitle={this.state.modelTitle}
                    parentData = {this.props.rightData}
                    addData={this.props.addData}
                    loginUserId = {this.props.loginUserId}
                />}
                {/* 转发 */}
                {this.state.zhuanfaModal && <ForwartModal
                    modalVisible={this.state.zhuanfaModal}
                    handleCancel={this.zhuanfaModalCancel}
                    modelTitle={this.state.modelTitle}
                    parentData = {this.props.rightData}
                    addData={this.props.addData}
                    loginUserId = {this.props.loginUserId}
                />}
                {/* 审核 */}
                {this.state.shenheModal && <VerifyModal
                    modalVisible={this.state.shenheModal}
                    handleCancel={this.shenheModalCancel}
                    modelTitle={this.state.modelTitle}
                    parentData = {this.props.rightData}
                    addData={this.props.addData}
                    loginUserId = {this.props.loginUserId}
                />}
            </div>

        )
    }
}

export default PlanDefineTopTags
