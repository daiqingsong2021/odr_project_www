import React, { Component } from 'react'
import { Table, notification, Modal, message, Icon } from 'antd'
import DownloadTopBtn from "../../../components/public/TopTags/DownloadTopBtn"
import ModifyTopBtn from "../../../components/public/TopTags/ModifyTopBtn"
import DeleteTopBtn from "../../../components/public/TopTags/DeleteTopBtn"
import UploadTopBtn from "../../../components/public/TopTags/UploadTopBtn"
import PublicButton from "../../../components/public/TopTags/PublicButton"
import Upload from "./Upload"
import style from "./style.less"
const confirm = Modal.confirm
import { connect } from 'react-redux'
import * as util from '../../../utils/util'

import { docReationsList, docProjectDel, docFileInfo } from '../../../api/api'
import axios from '../../../api/axios'


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

    getData = () => {
        axios.get(docReationsList(this.props.data.id, this.props.bizType)).then(res => {
            this.setState({
                data: res.data.data
            })
        })
    }

    componentDidMount() {
        this.getData();
    }

    setClassName = (record, index) => {
        return record.id === this.state.activeIndex ? 'tableActivty' : "";
    };

    getInfo = (record, index) => {
        let id = record.id


        this.setState({
            activeIndex: id,
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
                    this.getData();

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
                if(!this.state.rightData.fileId){
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
                        util.download(res.data.data.fileUrl, res.data.data.fileName,res.data.data.id)
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
    onClickHandleCheck = (val, e) => {
        const { intl } = this.props.currentLocale;

        if(!val.fileId){
            notification.warning({
                placement: 'bottomRight',
                bottom: 50,
                duration: 3,
                message: "文件不存在",
                description: "文件不存在!"
            });
            return;
        }

        let arr = ['HTML', 'html', 'txt', 'jpg', 'jpeg', 'gif', 'png', 'art', 'au', 'aiff', 'xbm'];
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
        this.getData()
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
            {
                title: intl.get('wsd.i18n.sys.user1.userlevel'),
                dataIndex: 'secutyLevel',
                key: 'secutyLevel',
                render: text => text ? text.name : ''
            },
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
                render: text => text ? text.substr(0, 10) : ''
            },
        ];
        const { selectedRowKeys } = this.state
        const rowSelection = {
            selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
                this.setState({
                    selectedRowKeys: selectedRowKeys
                })
            },

        };
        return (
            <div className={style.main}>

                <div className={style.mainHeight}>
                    <h3 className={style.listTitle}>{intl.get('wsd.i18n.plan.fileinfo.modaltitle')}</h3>
                    <div className={style.rightTopTogs}>
                        {/* <UploadTopBtn onClickHandle={this.onClickHandle.bind(this)}></UploadTopBtn>
                        <ModifyTopBtn onClickHandle={this.onClickHandle.bind(this)}></ModifyTopBtn>
                        <DeleteTopBtn onClickHandle={this.onClickHandle.bind(this)}></DeleteTopBtn>
                        <DownloadTopBtn onClickHandle={this.onClickHandle.bind(this)}></DownloadTopBtn> */}
                        {/*上传*/}
                        <PublicButton name={'上传'} title={'上传'} icon={'icon-shangchuanwenjian'} afterCallBack={this.onClickHandle.bind(this, 'UploadTopBtn')} />
                        {/*修改*/}
                        <PublicButton name={'修改'} title={'修改'} icon={'icon-xiugaibianji'} afterCallBack={this.onClickHandle.bind(this, 'ModifyTopBtn')} />
                        {/*删除*/}
                        <PublicButton title={"删除"} useModel={true} verifyCallBack={this.deleteVerifyCallBack} afterCallBack={this.onClickHandle.bind(this, "DeleteTopBtn")} icon={"icon-delete"} />
                        {/*下载*/}
                        <PublicButton name={'下载'} title={'下载'} icon={'icon-xiazaiwenjian'} afterCallBack={this.onClickHandle.bind(this, 'DownloadTopBtn')} />
                        {/* {this.state.isShow && <ModifyFileModal title={this.state.ModalTitle} handleCancel={this.closeAddAndModifyModal.bind(this)}></ModifyFileModal>} */}
                    </div>
                    <div className={style.mainScorll} id="checkid">
                        <Table
                            rowKey={record => record.docId} size="small"
                            className={style.table} columns={columns} dataSource={this.state.data} pagination={false} name={this.props.name} rowSelection={rowSelection} rowClassName={this.setClassName}
                            onRow={(record, index) => {
                                return {
                                    onClick: (event) => {
                                        this.getInfo(record, index)
                                    }
                                }
                            }
                            }
                        />
                    </div>
                    {this.state.isShow && <Upload handleCancel={this.closeCheckModal.bind(this)} ModalTitle={this.state.ModalTitle} projectId={this.props.projectId}
                        type={this.state.type} data={this.props.data} bizType={this.props.bizType} record={this.state.rightData} update={this.update} />}
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


export default connect(mapStateToProps, null)(FileInfo);
