import React, { Component } from 'react'
import { Table,notification, Select } from 'antd'
import PublicButton from "../../../../components/public/TopTags/PublicButton"
import PublicMenuButton from "../../../../components/public/TopTags/PublicMenuButton"
import AddTeam from "./Add"
import ImportFromOrg from "./ImportFromOrg"
import ImportFromProject from "./ImportFromProject"
import SelectUserRole from '../../Window/SelectUserRole'
import { connect } from 'react-redux'
import axios from '../../../../api/axios'
import {
  prepaTree,
  prepaProjectteamDel,
  prepaProjectteamUserList,
  prepaProjectteamUserUpdate,
  prepaProjectteamUserDel,
  prepaProjectteamUserTreeAdd
} from '../../../../api/api'
import * as util from '../../../../utils/util'
import MyIcon from "../../../../components/public/TopTags/MyIcon";
import * as dataUtil from "../../../../utils/dataUtil";
import LabelToolbar from '../../../../components/public/Layout/Labels/Table/LabelToolbar'
import LabelTableLayout from '../../../../components/public/Layout/Labels/Table/LabelTableLayout'
import LabelTable from '../../../../components/public/Layout/Labels/Table/LabelTable'
import LabelTableItem from '../../../../components/public/Layout/Labels/Table/LabelTableItem'
import PublicTable from "../../../../components/PublicTable";


const Option = Select.Option;

class TeamInfo extends Component {
    constructor(props) {
        super(props)
        this.state = {
            initDone: false,
            modify: false,
            addmodal: false,
            activeIndex1: null,
            record1: null,
            activeIndex2: null,
            record2: null,
            isShowImportModal: false,
            isShowImporTwotModal: false,
            selectedRowKeys: []
        }
    }

    /**
     *
     * @param callback
     */
    getDataList = (callback) => {
        axios.get(prepaTree(this.props.data.id, this.props.bizType)).then(res => {
            callback(res.data.data || []);
            this.setState({record1:null,selectedRowKeys:[]},() => {
              this.userTable.getData();
            });
        })
    }

    componentDidMount() {
      // 加载角色
      this.loadRoleList();
    }

    /**
     * 加载角色
     */
    loadRoleList = () =>{
      //获取用户角色
      axios.get("api/sys/role/list").then(res => {
        this.setState({
          rolelist: res.data.data
        })
      })
    }

    getRightData = (callback) => {

        let { record1 } = this.state;
        if (record1) {
            axios.get(prepaProjectteamUserList(record1.id)).then(res => {
                let data = res.data.data;
                if (res.data.data.length) {
                    let arr = [];
                    for (let i = 0; i < data.length; i++) {
                        if (data[i].roles) {
                            for (let j = 0; j < data[i].roles.length; j++) {
                                arr.push(data[i].roles[j].id);
                            }
                            data[i].roles = arr;
                            arr = [];
                        }
                    }
                }
                callback(data);
                this.setState({
                    data2: data
                })
            })
        }else{
            callback([]);
        }
    }

    //删除验证
    deleteVerifyCallBack1=()=>{
        let { record1 } = this.state;
        if(!record1){
            notification.warning(
                {
                    placement: 'bottomRight',
                    bottom: 50,
                    duration: 2,
                    message: '未选中数据',
                    description: '请选择数据进行操作'
                }
            )
            return false
        }else{
            return true
        }
    }

    assignUser = () => {

        if (!this.state.record1) {
            notification.warning({
                placement: 'bottomRight',
                bottom: 50,
                duration: 2,
                message: '未选中数据',
                description: '请选择数据进行操作'
            });
            return;
        }
        this.setState({
            SelectUserRoleType: true
        })
    }

    onClickHandle = (name, type) => {

        if (name == "DistributionBtn") {


            return
        }
  
        if(name == "orgImport") {
            this.setState({
                isShowImportModal: true,
                ImportModaltitle: "组织机构导入"
            })
            return
        }
        if(name == "iptImport") {
            this.setState({
                isShowImportModal: true,
                ImportModaltitle: "IPT导入"
            })
            return
        }
        if(name == "otherImport") {
            this.setState({
                isShowImporTwotModal: true,
                ImportModaltitle: "其他项目导入"
            })
            return
        }

    }
    // 修改
    modifyProjectTeam = () => {

        if (!this.state.record1) {
            notification.warning({
                placement: 'bottomRight',
                bottom: 50,
                duration: 2,
                message: '未选中数据',
                description: '请选择数据进行操作'
            });
            return ;
        }
        this.setState({
          modify: true
        });
    }
    // 删除
    deleteProjectTeam = () => {

        let { record1 } = this.state;
        if (record1) {

            let extInfo = this.props.extInfo || {};
            let url = dataUtil.spliceUrlParams(prepaProjectteamDel,{"startContent":extInfo.startContent});

            axios.deleted(url, { data: [record1.id] }, true).then(res => {

                this.orgTable.deleted(record1);
                this.setState({
                  record1: null,
                  record2: null,
                  selectedRowKeys:[]
                },() => {
                  this.userTable.getData();
                })
            })
        }

    }

    //删除验证
    deleteVerifyCallBack2=()=>{
        let { selectedRowKeys } = this.state;
        if(selectedRowKeys.length==0){
            notification.warning(
                {
                    placement: 'bottomRight',
                    bottom: 50,
                    duration: 2,
                    message: '未选中数据',
                    description: '请勾选数据进行操作'
                }
            )
            return false
        }else{
            return true
        }
    }
    clickHandle = (name) => {

        if (name == 'DeleteTopBtn') {
            let { selectedRowKeys } = this.state;
            if (selectedRowKeys.length) {
                let extInfo = this.props.extInfo || {};
                let url = dataUtil.spliceUrlParams(prepaProjectteamUserDel,{"startContent":extInfo.startContent});
                axios.deleted(url, { data: selectedRowKeys }, true).then(res => {
                  this.setState({
                    selectedRowKeys: []
                  },() => {
                    this.userTable.getData();
                  })
                })
            } else {
                notification.warning(
                    {
                        placement: 'bottomRight',
                        bottom: 50,
                        duration: 2,
                        message: '未选中数据',
                        description: '请选择数据进行操作'
                    }
                )
            }
            return
        }
    }
    closeImportFromOrg = () => {
        this.setState({
            isShowImportModal: false
        })
    }
    closeImportFromProject = () => {
        this.setState({
            isShowImporTwotModal: false
        })
    }
    closeAddModal = () => {
        this.setState({
            addmodal: false
        })
    }
    closeModifyModal = () => {
        this.setState({
            modify: false
        })
    }
    closeSelectUserRoleModal = () => {
        this.setState({
            SelectUserRoleType: false
        })
    }

    getInfo1 = (record, index) => {
        this.setState({
            activeIndex1: record.id,
            record1: record
        }, () => {
            this.userTable.getData();
        })
    }

    getInfo2 = (record, index) => {
        this.setState({
            activeIndex2: record.id,
            record2: record.id
        })
    }

    /**
     *新增
     * @val 新增的数据
     */
    addData = (val, subType) => {
        const { record1 } = this.state;
        this.orgTable.add(record1,val);
        if (subType == "save") {
            this.setState({ addmodal: false });
        }
    }

    //修改
    upData = (val) => {
        const { record1 } = this.state;
        this.orgTable.update(record1,val);
    };

    handleSelectdata = (record, val) => {
        let userId = record.user ? record.user.id : null;
        let extInfo = this.props.extInfo || {};
        let url = dataUtil.spliceUrlParams(prepaProjectteamUserUpdate(record.teamId, userId),{"startContent":extInfo.startContent});
        axios.put(url, val, true).then(res => {
        })
    };

    assignUserOk = (data) =>{
        let extInfo = this.props.extInfo || {};
        let url = dataUtil.spliceUrlParams(prepaProjectteamUserTreeAdd(this.state.record1.id),{"startContent":extInfo.startContent});
        axios.post(url, data,{}, true).then(res => {
            this.userTable.getData();
            this.closeSelectUserRoleModal();
        })
    };
    //注册 父组件即可调用子组件方法
    onOrgRef = (ref) => {
      this.orgTable = ref
    }

    //注册 父组件即可调用子组件方法
    onUserRef = (ref) => {
      this.userTable = ref
    }

    /**
     * 获取复选框 选中项、选中行数据
     * @method updateSuccess
     * @param {string} selectedRowKeys 复选框选中项
     * @param {string} selectedRows  行数据
     */
    getSelectedRowKeys = (selectedRowKeys, selectedRows) => {
      this.setState({
        selectedRowKeys
      })
    }
    render() {
        const { intl } = this.props.currentLocale;
        const columns1 = [
            {
                title: intl.get("wsd.i18n.plan.prepa.teamName"),//部门名称
                dataIndex: 'teamName',
                key: 'teamName',
                render: (text) => {
                    return (<span> <MyIcon type='icon-gongsi' /> {text} </span>)
                }
            },
            {
                title: intl.get("wsd.i18n.plan.prepa.teamCode"),//部门代码
                dataIndex: 'teamCode',
                key: 'teamCode',
            }
        ];
        const columns2 = [
            {
                title: intl.get("wsd.i18n.plan.prepa.username"),//用户名称
                dataIndex: 'user',
                key: 'actuName',
                render: text => <span>{text.name}</span>
            },
            {
                title: intl.get("wsd.i18n.plan.prepa.userid"),//用户账号
                dataIndex: 'user',
                key: 'userName',
                render: text => <span>{text.code}</span>
            },

            {
                title: intl.get("wsd.i18n.plan.prepa.userrole"),//用户角色
                dataIndex: 'roles',
                key: 'roles',
                render: (text, record) => {
                    return <Select style={{ width: "100%" }} defaultValue={text} onChange={this.handleSelectdata.bind(this, record)}
                        mode="multiple" size="small"
                    >
                        {this.state.rolelist && this.state.rolelist.map(item => {
                            return <Option value={item.id} key={item.id}>{item.roleName}</Option>
                        })}
                    </Select>
                }
            }
        ];

        return (
          <LabelTableLayout menuCode = {this.props.menuCode} menuCode = {this.props.menuCode}>
            <LabelTableItem title = {"部门"}>
              <LabelToolbar>
                {/*新增*/}
                <PublicButton name={'新增'} title={'新增'} edit={this.props.projectTeamEditAuth && this.props.edit || false} icon={'icon-add'} afterCallBack={()=>{this.setState({addmodal:true})}} />
                {/*修改*/}
                <PublicButton name={'修改'} title={'修改'} edit={this.props.projectTeamEditAuth && this.props.edit || false} icon={'icon-xiugaibianji'} afterCallBack={this.modifyProjectTeam} />
                {/*删除*/}
                <PublicButton title={"删除"} edit={this.props.projectTeamEditAuth && this.props.edit || false} useModel={true} verifyCallBack={this.deleteVerifyCallBack1} afterCallBack={this.deleteProjectTeam} icon={"icon-delete"} />
                {/*导入*/}
                <PublicMenuButton title={"导入"} edit={this.props.projectTeamEditAuth && this.props.edit || false} afterCallBack={this.onClickHandle} icon={"caret-down"} icon="icon-zititubiaoxiugai-"
                                  menus={[{ key: "orgImport", label: "组织机构导入", edit: this.props.menuEdit ? this.props.edit : this.props.menuEdit,icon:"icon-zuzhijigou"},
                                    { key: "iptImport", label: "IPT导入", edit: this.props.menuEdit ? this.props.edit : this.props.menuEdit ,icon:"icon-IPT"},
                                    { key: "otherImport", label: "其他项目导入", edit: this.props.menuEdit ? this.props.edit : this.props.menuEdit ,icon: "icon-xiangmu"}]}
                />
              </LabelToolbar>
              <LabelTable labelWidth = {this.props.labelWidth } contentMinWidth = {500}>
                <PublicTable istile={true}
                             onRef={this.onOrgRef}
                             getData={this.getDataList}
                             columns={columns1}
                             rowSelection={true}
                             getRowData={this.getInfo1} />
              </LabelTable>
            </LabelTableItem>
            <LabelTableItem title = {"用户"}>
              <LabelToolbar>
                {/*分配*/}
                <PublicButton  name={'分配'} title={'分配'} edit={this.props.projectTeamEditAuth && this.props.edit || false} icon={'icon-fenpeirenyuan'} afterCallBack={this.assignUser} />
                {/*删除*/}
                <PublicButton title={"删除"} edit={this.props.projectTeamEditAuth && this.props.edit || false} useModel={true} verifyCallBack={this.deleteVerifyCallBack2} afterCallBack={this.clickHandle.bind(this, "DeleteTopBtn")} icon={"icon-delete"} />
              </LabelToolbar>
              <LabelTable labelWidth = {this.props.labelWidth } contentMinWidth = {500}>
                <PublicTable istile={true}
                             onRef={this.onUserRef}
                             getData={this.getRightData}
                             columns={columns2}
                             rowSelection={true}
                             onChangeCheckBox={this.getSelectedRowKeys}
                             useCheckBox={true}
                             getRowData={this.getInfo2} />

              </LabelTable>
            </LabelTableItem>
            {
              this.state.addmodal &&
              (
                <AddTeam title="新增部门"
                         visible = {true}
                         extInfo = {this.props.extInfo}
                         handleCancel={this.closeAddModal}
                         record={this.state.record1}
                         addData={this.addData}
                         bizType={this.props.bizType }
                         bizId = {this.props.bizId }
                         opttype={"add"}
                />
              )
            }
            {
              this.state.modify &&
              (
                <AddTeam title="修改部门"
                         visible = {true}
                         extInfo = {this.props.extInfo}
                         handleCancel={this.closeModifyModal}
                         visible={this.state.modify}
                         record={this.state.record1}
                         upData={this.upData}
                         opttype={"modify"}
                />
              )
            }
            {
              this.state.isShowImportModal &&
              (
                <ImportFromOrg bizType={this.props.bizType} bizId = {this.props.bizId }
                               title={this.state.ImportModaltitle} visible={true}
                               extInfo = {this.props.extInfo}
                               handleCancel={this.closeImportFromOrg.bind(this)}
                               record={this.state.record1}
                               getDataList={() => {  this.orgTable.getData(); }}
                />
              )
            }
            {
              this.state.isShowImporTwotModal &&
              (
                <ImportFromProject bizType={this.props.bizType} bizId = {this.props.bizId }
                                   title={this.state.ImportModaltitle}
                                   extInfo = {this.props.extInfo}
                                   visible={this.state.isShowImporTwotModal}
                                   handleCancel={this.closeImportFromProject.bind(this)}
                                   getDataList={() => {  this.orgTable.getData(); }} />
              )
            }
            {
              this.state.SelectUserRoleType && (
                <SelectUserRole visible={true}
                                extInfo = {this.props.extInfo}
                                record={this.state.record1}
                                handleOk = {this.assignUserOk}
                                getRightData={() => {this.userTable.getData();}}
                                handleCancel={this.closeSelectUserRoleModal.bind(this)} />
              )
            }
          </LabelTableLayout>
        )
    }
}

export default connect(state => ({
    currentLocale: state.localeProviderData
}))(TeamInfo)
