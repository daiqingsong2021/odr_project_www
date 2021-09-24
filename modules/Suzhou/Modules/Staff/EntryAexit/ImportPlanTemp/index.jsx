import React, { Component } from 'react'
import style from './style.less'
import { Modal, Table, Upload, Button, Icon,notification,message } from 'antd';
import { connect } from 'react-redux'
import reqwest from 'reqwest'
import { baseURL } from '../../../../../../api/config';
import {dowErrorWb,uploadPeoEntryDetailFile} from '../../../../api/suzhou-api';

export class PlanPreparedRelease extends Component {
    constructor(props) {
        super(props)
        this.myRef = React.createRef();
        this.state = {
            fileList: [],
            uploading: false,
            data: [],
            successtoUp:true
        }
    }

    componentDidMount() {
    }
    handleUpload = () => {
        const {projectId,sectionId,enTryId} = this.props;
        const { fileList } = this.state;
        const formData = new FormData();
        fileList.forEach(file => {
            formData.append('files[]', file);
        });
        this.setState({
            uploading: true,
        });
        const hide = message.loading('loading....', 0);
        // You can use any AJAX library you like
        reqwest({
            name: 'file',
            url: baseURL+'/' + uploadPeoEntryDetailFile+  `?projectId=${projectId}&sectionId=${sectionId}&enTryId=${enTryId}`,
            headers: {
                Authorization: sessionStorage.getItem('token')
            },
            method: 'post',
            processData: false,
            data: formData,
            success: (res) => {
                if(res.status == 200){
                    this.setState({
                        fileList: [],
                        uploading: false,
                    });
                    notification.success({
                        placement: 'bottomRight',
                        bottom: 50,
                        duration: 2,
                        message: '提示',
                        description: '导入成功'
                    })
                    setTimeout(hide, 0);
                    this.props.handleCancel();
                    // this.props.getList();
                }else{
                    notification.error({
                        placement: 'bottomRight',
                        bottom: 50,
                        duration: 2,
                        message: '提示',
                        description: res.message
                    })
                }
            },
            error: (err) => {
                this.setState({
                    uploading: false,
                    successtoUp:false
                });
                setTimeout(hide, 0);
                notification.error({
                    placement: 'bottomRight',
                    bottom: 50,
                    duration: 2,
                    message: '提示',
                    description: '导入失败'
                })
            },
        });
    };
    setClassName = (record, index) => {
        //判断索引相等时添加行的高亮样式
        return record.lastModified === this.state.activeIndex ? `${style['clickRowStyl']}` : "";
    }
    getInfo = (record, index) => {
        this.setState({
            activeIndex: record.lastModified
        })
    }
    //事件委托
    openFile = () => {

        this.myRef.current.click()
    }
    render() {
        const { intl } = this.props.currentLocale;
        const columns = [
            {
                title: "文件名称",
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: "类型",
                dataIndex: 'type',
                key: 'type',
            },
            {
                title: "",
                key: 'close',
                dataIndex: '',
                render: () =>{
                    if(this.state.successtoUp){
                        return   <Icon type="check" style={{color:"green"}} />
                    }else{
                        return   <Icon type="close" style={{color:"red"}}/>
                    }
                }


            },
        ]
        const { uploading, fileList } = this.state;
        const props = {
            onRemove: file => {
                this.setState(state => {
                    const index = state.fileList.indexOf(file);
                    const newFileList = state.fileList.slice();
                    newFileList.splice(index, 1);
                    return {
                        fileList: newFileList,
                    };
                });
            },
            beforeUpload: file => {
                this.setState(state => ({
                    fileList: [ file],
                    successtoUp:true
                }));
                return false;
            },
            fileList,
            showUploadList:false
        };
        return (

            <Modal className={style.main} width="550px" centered={true}  onCancel={this.props.handleCancel}
                title="导入计划模板" visible={true}
                footer={
                    <div className="modalbtn">
                        <Button key="1" onClick={this.props.handleCancel}>取消</Button>
                        <Button key="2" type="primary" onClick={this.handleUpload}  disabled={fileList.length === 0 && this.state.uploading}>确定</Button>
                    </div>
                }>
                <div className={style.tableMain}>
                    <div className={style.fileName}>
                        <Upload {...props}>
                            <Button>
                                <Icon type="upload" /> 选择文件
                            </Button>
                        </Upload>
                     {/* Excel，Project*/}
                    </div>
                    <Table rowKey={record => record.lastModified} pagination={false} name={this.props.name} columns={columns} dataSource={this.state.fileList}
                    size="small"
                        rowClassName={this.setClassName} onRow={(record, index) => {
                            return {
                                onClick: (event) => {
                                    this.getInfo(record, index)
                                }
                            }
                        }
                        }
                    />
                </div>
            </Modal>

        )
    }
}



/* *********** connect链接state及方法 start ************* */
export default connect(state => ({
    currentLocale: state.localeProviderData
}))(PlanPreparedRelease);
/* *********** connect链接state及方法 end ************* */
