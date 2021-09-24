import React, { Component } from 'react'
import { notification, Icon } from 'antd'
import PublicButton from "../../../../components/public/TopTags/PublicButton"
import Upload from "./Upload"
import style from "./style.less"
import { connect } from 'react-redux'
import * as util from '../../../../utils/util'
import { docReationsList, docProjectDel, docFileInfo } from '../../../../api/api'
import axios from '../../../../api/axios'
import * as dataUtil from "../../../../utils/dataUtil"
import PublicTable from '../../../../components/PublicTable'
import LabelToolbar from '../../../../components/public/Layout/Labels/Table/LabelToolbar'
import LabelTableLayout from '../../../../components/public/Layout/Labels/Table/LabelTableLayout'
import LabelTable from '../../../../components/public/Layout/Labels/Table/LabelTable'


class FileInfo extends Component {
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

    getData = (callBack) => {
        axios.get(docReationsList(this.props.bizId, this.props.bizType)).then(res => {
            callBack(res.data.data ? res.data.data : [])
            this.setState({
                data: res.data.data
            })
        })
    }
    /**
    @method 父组件即可调用子组件方法
    @description 父组件即可调用子组件方法
    */
    onRef = (ref) => {
        this.table = ref
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
                axios.deleted(docProjectDel, { data: selectedRowKeys }).then(res => {
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

        if (name == 'DownloadTopBtn') {

            if (this.state.rightData) {
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
    render() {
        const { intl } = this.props.currentLocale

        const columns = [
            {
                title: intl.get('wsd.i18n.doc.temp.title'),
                dataIndex: 'docTitle',
                key: 'docTitle',
                render: (text, record) => (
                    <span> <Icon type="eye" onClick={this.onClickHandleCheck.bind(this, record)} style={{ marginRight: "5px", cursor: 'pointer' }} />{text}</span>
                )
            },
            {
                title: intl.get('wsd.i18n.doc.compdoc.docserial'),
                dataIndex: 'docNum',
                key: 'docNum',
            },
            // {
            //     title: intl.get('wsd.i18n.sys.user1.userlevel'),
            //     dataIndex: 'secutyLevel',
            //     key: 'secutyLevel',
            //     render: text => text ? text.name : ''
            // },
            {
                title: intl.get('wsd.i18n.doc.temp.versions'),
                dataIndex: 'version',
                key: 'version',
            },
            {
                title: intl.get('wsd.i18n.doc.compdoc.babelte'),
                dataIndex: 'creator',
                key: 'creator',
                render: text => text ? text.name : ''
            },
            {
                title: intl.get('wsd.i18n.plan.fileinfo.creattime'),
                dataIndex: 'creatTime',
                key: 'creatTime',
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

        return (

          <LabelTableLayout title = {this.props.title} menuCode = {this.props.menuCode}>
            <LabelToolbar>
              {/*上传*/}
              {this.props.isShow && 
              (<PublicButton name={'上传'} title={'上传'} edit={this.props.fileEditAuth || false} icon={'icon-shangchuanwenjian'} afterCallBack={this.onClickHandle.bind(this, 'UploadTopBtn')} />)}
              {/*修改*/}
              {this.props.isShow && 
              (<PublicButton name={'修改'} title={'修改'} edit={this.props.fileEditAuth || false} icon={'icon-xiugaibianji'} afterCallBack={this.onClickHandle.bind(this, 'ModifyTopBtn')} />)}
              {/*删除*/}
              {this.props.isShow && 
              (<PublicButton title={"删除"} edit={this.props.fileEditAuth || false} useModel={true} verifyCallBack={this.deleteVerifyCallBack} afterCallBack={this.onClickHandle.bind(this, "DeleteTopBtn")} icon={"icon-delete"} />)}
              {/*下载*/}
              <PublicButton name={'下载'} title={'下载'} icon={'icon-xiazaiwenjian'} afterCallBack={this.onClickHandle.bind(this, 'DownloadTopBtn')} />
            </LabelToolbar>
            <LabelTable labelWidth = {this.props.labelWidth } contentMinWidth = {1000}>
              <PublicTable onRef={this.onRef}
                           getData={this.getData}
                           dataSource={this.state.data}
                           columns={columns}
                           rowSelection={true}
                           onChangeCheckBox={this.getSelectedRowKeys}
                           useCheckBox={true}
                           scroll={{ x: 1200, y: this.props.height - 100 }}
                           getRowData={this.getInfo} />
            </LabelTable>
            {this.state.isShow &&
            <Upload handleCancel={this.closeCheckModal.bind(this)}
                    ModalTitle={this.state.ModalTitle}
                    projectId={this.props.projectId}
                    type={this.state.type}
                    data={this.props.data}
                    bizType={this.props.bizType}
                    bizId={this.props.bizId}
                    record={this.state.rightData}
                    update={this.update} />
            }
          </LabelTableLayout>
        )
    }
}



const mapStateToProps = state => {
    return {
        currentLocale: state.localeProviderData,
    }
};


export default connect(mapStateToProps, null)(FileInfo);
