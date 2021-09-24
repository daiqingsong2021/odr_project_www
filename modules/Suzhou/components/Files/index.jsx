import React, { Component } from 'react'
import { Table, notification, Icon } from 'antd'
import PublicButton from "@/components/public/TopTags/PublicButton"
import Upload from "./Upload"
import style from "./style.less"
import { connect } from 'react-redux'
import * as util from '@/utils/util'
import { docReationsList, docProjectDel, docFileInfo } from '@/api/api'
import axios from '@/api/axios'
import store from '@/store';
import * as dataUtil from "@/utils/dataUtil"
import PublicTable from '@/components/PublicTable'
import LabelToolbar from '@/components/public/Layout/Labels/Table/LabelToolbar'
import LabelTableLayout from '@/components/public/Layout/Labels/Table/LabelTableLayout'
import LabelTable from '@/components/public/Layout/Labels/Table/LabelTable'
import LabelTableItem from '@/components/public/Layout/Labels/Table/LabelTableItem'


class Files extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeIndex: [],
            rightData: null,
            selectedRowKeys: [],
            data: [],
            type: '',
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
        axios.get(docReationsList(this.props.bizId, this.props.bizType)).then(res => {
            callBack(res.data.data ? res.data.data : [])
            this.setState({
                selectedRowKeys:[],
                rightData:null
            })
        })
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
            let { selectedRowKeys, rightData } = this.state;
            if (selectedRowKeys.length) {
                let { startContent } = this.props.extInfo || {};
                let url = dataUtil.spliceUrlParams(docProjectDel, { startContent });
                axios.deleted(url, { data: selectedRowKeys }, true, null, true).then(res => {
                
                    this.table.getData();

                    let index = rightData ? selectedRowKeys.findIndex(item => item == rightData.id) : -1;
                    if (index !== -1) {
                        this.setState({
                            selectedRowKeys: [],
                            rightData: null,
                        })
                    } else {
                        this.setState({
                            selectedRowKeys: [],
                        })
                    }
                })
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
    onClickHandleCheck = (val, e) => {
        const { intl } = this.props.currentLocale;
        if (!val.fileId) {
            notification.warning({
                placement: 'bottomRight',
                bottom: 50,
                duration: 3,
                message: "文件不存在",
                description: "文件不存在!"
            });
            return;
        }

        let arr = ['HTML', 'html', 'txt', 'jpg', 'jpeg', 'gif', 'png', 'art', 'au', 'aiff', 'xbm','xlsx'];
        axios.get(docFileInfo(val.fileId)).then(res => {
            if (res.data.data && res.data.data.fileUrl) {
                let type = res.data.data.fileName ? res.data.data.fileName.substring(res.data.data.fileName.lastIndexOf(".")+1) : '';
                let index = arr.findIndex(item => item == type);
                if (index != -1) {
                    window.open(res.data.data.fileUrl)
                } else {
                    notification.warning(
                        {
                            placement: 'bottomRight',
                            bottom: 50,
                            duration: 3,
                            message: intl.get('wsd.global.tip.title2'),
                            description: intl.get('wsd.global.hint.docwarning')
                        }
                    )
                }

            }
        })

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



    render() {

        const { intl } = this.props.currentLocale;
        const columns = [
            {
                title: intl.get('wsd.i18n.doc.temp.title'),
                dataIndex: 'docTitle',
                key: 'docTitle',
                width:150,
                render: (text, record) => (
                    <span> 
                        {/* <Icon type="eye" onClick={this.onClickHandleCheck.bind(this, record)} style={{ marginRight: "5px", cursor: 'pointer' }} /> */}
                        {text}</span>
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
        ];
        const { selectedRowKeys } = this.state
        const rowSelection = {
            selectedRowKeys,
            onChange: (selectedRowKeys) => {
                this.setState({
                    selectedRowKeys: selectedRowKeys
                })
            }
        };
        return (


          <LabelTableLayout title = {this.props.title} menuCode = {this.props.menuCode}>
            <LabelToolbar>
              {/*上传*/}
              <PublicButton name={'上传'} title={'上传'} edit={this.props.fileEditAuth || false} icon={'icon-shangchuanwenjian'} afterCallBack={this.onClickHandle.bind(this, 'UploadTopBtn')} />
              {/*修改*/}
              <PublicButton name={'修改'} title={'修改'} edit={this.props.fileEditAuth || false} icon={'icon-xiugaibianji'} afterCallBack={this.onClickHandle.bind(this, 'ModifyTopBtn')} />
              {/*删除*/}
              <PublicButton title={"删除"} edit={this.props.fileEditAuth || false} useModel={true} verifyCallBack={this.deleteVerifyCallBack} afterCallBack={this.onClickHandle.bind(this, "DeleteTopBtn")} icon={"icon-delete"} />
              {/*下载*/}
              <PublicButton name={'下载'} title={'下载'} icon={'icon-xiazaiwenjian'} afterCallBack={this.download} />
            </LabelToolbar>
            <LabelTable labelWidth = {this.props.labelWidth } contentMinWidth = {400}>
              <PublicTable istile={true} onRef={this.onRef}
                           getData={this.getData}
                           columns={columns}
                           istile={true}
                           rowSelection={true}
                           onChangeCheckBox={this.getSelectedRowKeys}
                           useCheckBox={true}
                           scroll={{ x: '100%', y: this.props.height - 100 }}
                           getRowData={this.getInfo} />
            </LabelTable>
            {this.state.isShow && <Upload handleCancel={this.closeCheckModal.bind(this)} ModalTitle={this.state.ModalTitle} projectId={this.props.projectId} extInfo={this.props.extInfo}
                                          type={this.state.type} data={this.props.data} bizId={this.props.bizId} bizType={this.props.bizType} record={this.state.rightData} update={this.update} 
                                          menuId = {this.props.menuId} parentData = {this.props.rightData} 
                                          />}
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
