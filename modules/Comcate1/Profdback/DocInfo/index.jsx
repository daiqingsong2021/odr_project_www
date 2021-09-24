import React, {Component} from 'react'
import styles from './index.less'
import {Table} from 'antd'
import UploadTopBtn from '../../../../components/public/TopTags/UploadTopBtn'
import ModifyTopBtn from '../../../../components/public/TopTags/ModifyTopBtn'
import DeleteTopBtn from '../../../../components/public/TopTags/DeleteTopBtn'
import FileDetailsModal from '../FileDetailsModal/index'
import LoadFileModal from '../LoadFileModal/index'

export default class DocInfo extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeIndex:'',
            detailModal:false,   //文件细节弹窗
            loadFileModal:false, //上传/修改文件Modal
            selectedFile:null,   //选择的文件
            selectedLoad:null,
        }
    }

    setClassName = (record, index) => {
        //判断索引相等时添加行的高亮样式
        return record.id === this.state.activeIndex ? `${style['clickRowStyl']}` : "";
    }

    clickA(){
    }

    handleCancel(){
        this.setState({loadFileModal:false})
    }

    render() {
        const {detailModal,loadFileModal,selectedFile} = this.state
        const columns = [
            {title: '序号', dataIndex: 'id', key: 'id',},
            {title: '文件名称', dataIndex: 'filename', key: 'filename',},
            {title: '版本号', dataIndex: 'version', key: 'version'},
            {title: '上传时间', dataIndex: 'uptime', key: 'uptime'},
            {title: '上传人', dataIndex: 'creator', key: 'creator'},
            {
                title: '附件',
                dataIndex: 'enclosure',
                key: 'enclosure',
                render(text){
                    return <a>{text}</a>
                }
            },
            {title: '备注', dataIndex: 'remark', key: 'remark'},
        ]
        const data = [
            {
                id: '1',
                filename: '01-项目计划发布说明书',
                version: 'A120',
                uptime: '2018-12-21',
                creator: '张三',
                enclosure: '查看(2)',
                remark: '---'
            },
            {
                id: '2',
                filename: '02-审批流程说明',
                version: 'A1201',
                uptime: '2018-12-21',
                creator: '张三',
                enclosure: '查看(2)',
                remark: '---'
            },
            {
                id: '3',
                filename: '03-项目计划发布流程',
                version: 'A120',
                uptime: '2018-12-21',
                creator: '张三',
                enclosure: '查看(2)',
                remark: '---'
            }
        ]
        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                // this.setState({detailModal:true})
                this.setState({loadFileModal:true,selectedFile:selectedRows})
            },
            getCheckboxProps: record => ({
                disabled: record.name === 'Disabled User', // Column configuration not to be checked
                name: record.name,
            }),
        }

        return (
            <div className={styles.main}>
                <div className={styles.header}>文件信息</div>
                <div className={styles.icons}>
                    <UploadTopBtn onClick={()=>{this.setState({loadFileModal:true})}}/>
                    <ModifyTopBtn/>
                    <DeleteTopBtn/>
                </div>

                <Table columns={columns} dataSource={data}
                       rowSelection={rowSelection}
                       rowClassName={this.setClassName}
                       rowKey={record => record.id}
                />
                {/*<FileDetailsModal visible={detailModal}/>*/}
                <LoadFileModal visible={loadFileModal}
                               selectedFile={selectedFile} onCancel={()=>this.handleCancel()}
                />

            </div>
        )
    }
}