import React, { Component } from 'react'
import { Table, notification, Icon ,Input,Form} from 'antd'
import PublicButton from "../../../../components/public/TopTags/PublicButton"
import Upload from "./Upload"
import style from "./style.less"
import { connect } from 'react-redux'
import * as util from '../../../../utils/util'
import { docReationsList, docProjectDel, docFileInfo, docProjectRelease } from '../../../../api/api';
import axios from '../../../../api/axios'
import store from '../../../../store';
import * as dataUtil from "../../../../utils/dataUtil"
import PublicTable from '../../../../components/PublicTable'
import LabelToolbar from '../../../../components/public/Layout/Labels/Table/LabelToolbar'
import LabelTableLayout from '../../../../components/public/Layout/Labels/Table/LabelTableLayout'
import LabelTable from '../../../../components/public/Layout/Labels/Table/LabelTable'
import LabelTableItem from '../../../../components/public/Layout/Labels/Table/LabelTableItem'
import PublicMenuButton from '../../../../components/public/TopTags/PublicMenuButton';
import Publicd from '../Files/Publicd';
import {isInSubjectTemplate,reations,selectSubjectItemScore,updateSubjectScore,deleteSubjectScoreByFileId,selectSubjectTemplate} from '@/modules/Suzhou/api/suzhou-api';


class Files extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeIndex: [],
            rightData: null,
            selectedRowKeys: [],
            selectedRows:[],
            data: [],
            type: '',
            showApprovalVisible: false,
            showCalcApprovalVisible: false,
            editAuth: true,
            isRated:false,//是否需主观考核
            load:false,//可加载表格
            loadTable:false,
            editable:false,//打分权限
        }
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
    getData = (callBack) => {
        const {rightData} = this.props;
        const {projectId,sectionId} = rightData;
        if(this.state.isRated){
            axios.get(reations(this.props.bizId, this.props.bizType)).then(res=>{
                callBack(res.data.data ? res.data.data : [])
                this.setState({
                    selectedRowKeys:[],
                    selectedRows:[],
                    rightData:null
                })
            })
        }else{
            axios.get(docReationsList(this.props.bizId, this.props.bizType)).then(res => {
                callBack(res.data.data ? res.data.data : [])
                this.setState({
                    selectedRowKeys:[],
                    selectedRows:[],
                    rightData:null
                })
            })
        }
    }
    componentDidMount(){
        axios.get(selectSubjectTemplate,{params:{moduleCode:this.props.bizType}}).then(res=>{
            var newData = [];
            if(res.data.data.length > 0){
                if(res.data.data[0].rolesVo.length > 0){
                    const roleList = [];
                    res.data.data[0].rolesVo.map(item=>{
                        roleList.push(item.id);
                    })
                    let loginUser = JSON.parse(sessionStorage.getItem('userInfo'));
                    if(!loginUser.roles){

                    }else if(loginUser.roles.length>0){
                        loginUser.roles.map(item=>{
                            // console.log(roleList.indexOf(item.id) !==-1);
                            if(roleList.indexOf(item.id) !==-1){
                                newData.push(item.id);
                            }
                            
                        })
                    }
                }
            }
            if(newData.length>0){
                this.setState({editable:true,loadTable:true})  
            }else{
                this.setState({editable:false,loadTable:true})
            }
        })
        axios.get(isInSubjectTemplate(this.props.bizType)).then(res=>{
            res.data.data.isRated == 1?this.setState({isRated:true,load:true}):this.setState({load:true});
        });
    }
    /**
     * 获取复选框 选中项、选中行数据
     * @method updateSuccess
     * @param {string} selectedRowKeys 复选框选中项
     * @param {string} selectedRows  行数据
     */
    getSelectedRowKeys = (selectedRowKeys, selectedRows) => {
        this.setState({
            selectedRows,
            selectedRowKeys
        })
    }

    getInfo = (record, index) => {
        if(record.status && record.status.id != 'EDIT'){
            this.setState({
              editAuth: false,
            })
        }
        this.setState({
            rightData: record,
        })
    };
    //删除验证
    deleteVerifyCallBack = () => {
        const { intl } = this.props.currentLocale
        let { selectedRowKeys, rightData } = this.state;
        if (selectedRowKeys.length == 0) {
            notification.warning(
                {
                    placement: 'bottomRight',
                    bottom: 50,
                    duration: 2,
                    message: intl.get('wsd.global.tip.title2'),
                    description: intl.get('wsd.global.tip.content2')
                }
            )
            return false
        } else {
            return true
        }
    }

    onClickHandle = (name) => {

        const { intl } = this.props.currentLocale
        if (name == "UploadTopBtn") {
            this.setState({
                isShow: true,
                ModalTitle: intl.get("wsd.i18n.doc.tempdoc.uploaddoc"),
                type: 'upload'
            })
            return
        }
        if (name == "ModifyTopBtn") {
            if (this.state.rightData) {

                this.setState({
                    isShow: true,
                    ModalTitle: intl.get("wsd.i18n.doc.tempdoc.modifydoc"),
                    type: 'modify'
                })
            } else {
                notification.warning(
                    {
                        placement: 'bottomRight',
                        bottom: 50,
                        duration: 2,
                        message: intl.get('wsd.global.tip.title2'),
                        description: intl.get('wsd.global.tip.title1')
                    }
                )

            }
        }

        if (name == "DeleteTopBtn") {
            let { selectedRowKeys, rightData,selectedRows } = this.state;
            if (selectedRowKeys.length) {
                let { startContent } = this.props.extInfo || {};
                let url = dataUtil.spliceUrlParams(docProjectDel, { startContent });
                axios.deleted(url, { data: selectedRowKeys }, true, null, true).then(res => {
                
                    this.table.getData();
                    let index = rightData ? selectedRowKeys.findIndex(item => item == rightData.id) : -1;
                    if (index !== -1) {
                        this.setState({
                            selectedRowKeys: [],
                            selectedRows:[],
                            rightData: null,
                        })
                    } else {
                        this.setState({
                            selectedRowKeys: [],
                            selectedRows:[],
                        })
                    }
                })
                const obj = [];
                selectedRows.map(item=>{
                    obj.push(item.fileId);
                })
                let url2 = dataUtil.spliceUrlParams(deleteSubjectScoreByFileId, { startContent });
                if(obj.length > 0){
                    axios.deleted(url2,{data:obj},true,null,true).then(res=>{
                        console.log(res)
                    })
                }
                
            } else {
                notification.warning(
                    {
                        placement: 'bottomRight',
                        bottom: 50,
                        duration: 2,
                        message: intl.get('wsd.global.tip.title2'),
                        description: intl.get('wsd.global.tip.content2')
                    }
                )
            }
        }
    }

    download = () => {
        const { intl } = this.props.currentLocale
        if (!this.state.rightData) {
            notification.warning({
                placement: 'bottomRight',
                bottom: 50,
                duration: 2,
                message: intl.get('wsd.global.tip.title2'),
                description: intl.get('wsd.global.tip.title1')
            });
            return;
        }

        if (!this.state.rightData.fileId) {
            notification.warning({
                placement: 'bottomRight',
                bottom: 50,
                duration: 3,
                message: "文件不存在",
                description: "文件不存在!"
            });
            return;
        }

        axios.get(docFileInfo(this.state.rightData.fileId)).then(res => {
            if (res.data.data) {
                util.download(res.data.data.fileUrl, res.data.data.fileName, res.data.data.id)
            }
        })
    }

    closeAddAndModifyModal = () => {
        this.setState({
            isShow: false,
        })
    }
    //点击显示查看
    onClickHandleCheck = (record) => {
        const { intl } = this.props.currentLocale;

        let arr = ['html', 'txt', 'jpg', 'jpeg', 'gif', 'png', 'art', 'au', 'aiff', 'xbm', 'pdf','doc','docx','rtf','xls','xlsx','csv'];
        if (record.fileId) {
          const { startContent } = this.state
          let url = dataUtil.spliceUrlParams(docFileInfo(record.fileId), { startContent });
          axios.get(url).then(res => {
            if (res.data.data && res.data.data.fileUrl) {
              let type = res.data.data.fileName ? res.data.data.fileName.substring(res.data.data.fileName.lastIndexOf(".")+1) : '';
              if(type){
                type = type.toLowerCase();
              }
              let index = arr.findIndex(item => item == type);
              if (index != -1) {
                if (res.data.data.fileViewUrl && (type == 'doc' ||  type == 'docx' ||  type == 'rtf' ||  type == 'xls' ||  type == 'xlsx' ||  type == 'csv')){
                  window.open(res.data.data.fileViewUrl)
                } else{
                  window.open(res.data.data.fileUrl)
                }
              } else {
                dataUtil.message(intl.get('wsd.global.hint.docwarning'));
              }
            }
          })
        } else {
          dataUtil.message(intl.get('wsd.i18n.doc.compdoc.hinttext'));
        }

    }
    //关闭
    closeCheckModal = () => {
        this.setState({
            isShow: false
        })
    }

    //更改
    update = () => {
        this.table.getData()
    }

    //刷新
    refresh = () =>{
        this.table.getData();
    }
    showReleaseModal = (name) => {
        if (name == "direct"){
            this.setState({
              showApprovalVisible: true,
            })
        }else if(name == "abolish"){
            this.setState({
              showCalcApprovalVisible: true,
            })
        }
    }

    //复选框限制
    checkboxStatus =(record) => {
      if (record.status && record.status.id != "EDIT") {
        return true
      }else{
        return false
      }
    }
    handleSave = row => {
        const obj = {
            fileId:row.fileId,
            score:row.score
        }
        axios.put(updateSubjectScore,obj,true).then(res=>{
            this.table.getData();
        })
    }
    render() {
        const { intl } = this.props.currentLocale;
        const columns = [
            {
                title: intl.get('wsd.i18n.doc.temp.title'),
                dataIndex: 'docTitle',
                key: 'docTitle',
                width:150,
                render: (text, record) => (
                    <span> <Icon type="eye" onClick={this.onClickHandleCheck.bind(this, record)} style={{ marginRight: "5px", cursor: 'pointer' }} />{text}</span>
                )
            },
            {
                title: intl.get('wsd.i18n.doc.compdoc.docserial'),
                dataIndex: 'docNum',
                key: 'docNum',
                width:100,
            },
            {
                title: intl.get('wsd.i18n.doc.temp.versions'),
                dataIndex: 'version',
                key: 'version',
                width:100,
            },
            {
                title: intl.get('wsd.i18n.doc.compdoc.babelte'),
                dataIndex: 'creator',
                key: 'creator',
                width:100,
                render: text => text ? text.name : ''
            },
            {
                title: intl.get('wsd.i18n.plan.fileinfo.creattime'),
                dataIndex: 'creatTime',
                key: 'creatTime',
                width:100,
                render: (text) => dataUtil.Dates().formatDateString(text)
            },
            {
              title: intl.get('wsd.i18n.sys.ipt.statusj'),
              dataIndex: 'status',
              key: 'status',
              width:100,
              render: text => text ? text.name : ''
            },
        ];
        const columns1 = [
            {
                title: intl.get('wsd.i18n.doc.temp.title'),
                dataIndex: 'docTitle',
                key: 'docTitle',
                width:150,
                render: (text, record) => (
                    <span> <Icon type="eye" onClick={this.onClickHandleCheck.bind(this, record)} style={{ marginRight: "5px", cursor: 'pointer' }} />{text}</span>
                )
            },
            {
                title: intl.get('wsd.i18n.doc.compdoc.docserial'),
                dataIndex: 'docNum',
                key: 'docNum',
                width:100,
            },
            {
                title: intl.get('wsd.i18n.doc.temp.versions'),
                dataIndex: 'version',
                key: 'version',
                width:100,
            },
            {
                title: intl.get('wsd.i18n.doc.compdoc.babelte'),
                dataIndex: 'creator',
                key: 'creator',
                width:100,
                render: text => text ? text.name : ''
            },
            {
                title: '上传日期',
                dataIndex: 'creatTime',
                key: 'creatTime',
                width:100,
                render: (text) => dataUtil.Dates().formatDateString(text)
            },
            {
              title: intl.get('wsd.i18n.sys.ipt.statusj'),
              dataIndex: 'status',
              key: 'status',
              width:70,
              render: text => text ? text.name : ''
            },
            {
                title: '评 分',
                dataIndex: 'score',
                key: 'score',
                width:80,
                render: text => !text ? 4: text,
                edit:{editable:this.state.editable,formType:"InputNumber",handleSave:this.handleSave,min:0,max:5},
                
              },
              {
                title: '评分人',
                dataIndex: 'rater',
                key: 'rater',
                width:80,
                render: text => text ? text : ''
              },
              {
                title: '评分日期',
                dataIndex: 'scoreTime',
                key: 'scoreTime',
                width:100,
                // render: (text) => dataUtil.Dates().formatDateString(text)
              },
        ];
        const { selectedRowKeys,selectedRows } = this.state
        const rowSelection = {
            selectedRowKeys,
            selectedRows,
            onChange: (selectedRowKeys,selectedRows) => {
                this.setState({
                    selectedRowKeys: selectedRowKeys,
                    selectedRows
                })
            }
        };
        return (
          <LabelTableLayout title = {this.props.title} menuCode = {this.props.menuCode}>
            <LabelToolbar>
              {/*上传*/}
              {this.props.isShow && <PublicButton name={'上传'} title={'上传'} edit={this.props.fileEditAuth || false} 
              icon={'icon-shangchuanwenjian'} afterCallBack={this.onClickHandle.bind(this, 'UploadTopBtn')} />}
              {/*修改*/}
              {this.props.isShow && <PublicButton name={'修改'} title={'修改'} edit={this.props.fileEditAuth && this.state.editAuth || false} 
              icon={'icon-xiugaibianji'} afterCallBack={this.onClickHandle.bind(this, 'ModifyTopBtn')} />}
              {/*发布*/}
              {this.props.fileRelease &&  <PublicMenuButton title={"发布"} afterCallBack={this.showReleaseModal} icon={"icon-fabu"}
                                menus={[{ key: "direct", label: "直接发布", icon: "icon-fabu", edit: true },
                                  { key: "abolish", label: "取消发布", icon: "icon-mianfeiquxiao", edit: true }]}
              />}
              {/*删除*/}
              {this.props.isShow && <PublicButton title={"删除"} edit={this.props.fileEditAuth || false} useModel={true} verifyCallBack={this.deleteVerifyCallBack} 
              afterCallBack={this.onClickHandle.bind(this, "DeleteTopBtn")} icon={"icon-delete"} />}
              
              {/*下载*/}
              <PublicButton name={'下载'} title={'下载'} icon={'icon-xiazaiwenjian'} afterCallBack={this.download} />
            </LabelToolbar>
            <LabelTable labelWidth = {this.props.labelWidth } contentMinWidth = {400}>
                {this.state.load && this.state.loadTable &&(
                    this.state.isRated?(
                        <PublicTable 
                        onRef={this.onRef}
                        getData={this.getData}
                        columns={columns1}
                        istile={true}
                        rowSelection={true}
                        onChangeCheckBox={this.getSelectedRowKeys}
                        checkboxStatus={this.checkboxStatus}
                        useCheckBox={true}
                        // scroll={{ x: '100%', y: this.props.height - 100 }}
                        getRowData={this.getInfo} 
                        formType={'Input'}
                        />
                    ):
                    (
                        <PublicTable istile={true} onRef={this.onRef}
                           getData={this.getData}
                           columns={columns}
                           istile={true}
                           rowSelection={true}
                           onChangeCheckBox={this.getSelectedRowKeys}
                           checkboxStatus={this.checkboxStatus}
                           useCheckBox={true}
                        //    scroll={{ x: '100%', y: this.props.height - 100 }}
                           getRowData={this.getInfo} />
                    )
                )}
            </LabelTable>
            {this.state.isShow && <Upload handleCancel={this.closeCheckModal.bind(this)} ModalTitle={this.state.ModalTitle} projectId={this.props.projectId} extInfo={this.props.extInfo}
                                    isRated={this.state.isRated} type={this.state.type} menuId = {this.props.menuId ? this.props.menuId : 0} sectionId={this.props.data && this.props.data.sectionId ? this.props.data.sectionId : this.props.sectionId ? this.props.sectionId : null} data={this.props.data} bizId={this.props.bizId} bizType={this.props.bizType} record={this.state.rightData} update={this.update} />}
            {/* 发布 */}
            {this.state.showApprovalVisible && <Publicd modalVisible={this.state.PublicdVisible} handleOk={this.handleOk} projectId={this.props.projectId}
                                                    handleCancel={() => { this.setState({ showApprovalVisible: false }) }} extInfo={this.props.extInfo} refresh={this.refresh} type={"approval"} bizId={this.props.bizId} bizType={this.props.bizType}/>}

            {/* 发布 */}
            {this.state.showCalcApprovalVisible && <Publicd modalVisible={this.state.PublicdVisible} handleOk={this.handleOk} projectId={this.props.projectId}
                                                    handleCancel={() => { this.setState({ showCalcApprovalVisible: false }) }} extInfo={this.props.extInfo} refresh={this.refresh} type={"calcApproval"} bizId={this.props.bizId} bizType={this.props.bizType}/>}

          </LabelTableLayout>
        )
    }
}



const mapStateToProps = state => {
    return {
        currentLocale: state.localeProviderData,
    }
};


export default connect(mapStateToProps, null)(Files);
