import React, { Component } from 'react'
import style from './style.less'
import { Button, Icon, Modal, Table } from 'antd';
import intl from 'react-intl-universal'
import UploadTpl from '../../../../components/public/TopTags/uploadTpl'

class UploadModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            initDone: false,
            visible: true,
            data: []
        }
    }

    showModal = () => {
        this.setState({
            visible: true,
        });
    }

    handleSubmit = (e) => {
        const ids = this.state.data.map(v => {
            return v.id
        })
        this.props.addDocFileRelations(ids)
    }

    handleCancel = (e) => {
        this.setState({
            visible: false,
        });
        this.props.handleCancel()
    }

    //上传的回调
    file = (files) => {
        if (files.response && files.response.data) {
            let obj = {
                id: files.response.data.id,
                fileName: files.response.data.fileName.split('.')[0],
                size: files.response.data.size,
                type: files.response.data.suffix,
                isSucceed: files.response.status
            }
            this.setState({
                data: [obj, ...this.state.data]
            })
        } else {
            let obj = {
                fileName: files.name.split('.')[0],
                type: files.response.data.suffix,
                isSucceed: files.response.status
            }
            this.setState({
                data: [obj, ...this.state.data]
            })

        }
    }

    render() {
        const columns = [
            {
                title: intl.get('wsd.i18n.plan.fileinfo.filename'),
                dataIndex: 'fileName',
                key: 'fileName',
            },
            {
                title: intl.get('wsd.i18n.plan.fileinfo.filetype'),
                dataIndex: 'type',
                key: 'type',
            },
            {
                title: '',
                dataIndex: 'isSucceed',
                render: (text, record) => <Icon type={text == 200 ? "check" : "close"} />
            }
        ]
        return (
            <div >
                <Modal title="上传文件" visible={this.state.visible}
                    className={style.main}
                    onOk={this.handleOk} onCancel={this.handleCancel}
                    okText="确定"
                    cancelText="取消"
                    width="800px"
                    footer={[
                        <Button key="back" onClick={this.handleCancel}>取消</Button>,
                        <Button key="submit" type="primary" onClick={this.handleSubmit}>
                            确定
                        </Button>
                    ]}
                >
                    <div className={style.UploadModal}>
                        <div className={style.tip}>
                            {/* 上传按钮 */}
                            <UploadTpl isBatch={true} file={this.file} />
                            <Button type="submit" style={{ overflow: 'hidden', border: 'none', boxShadow: 'none' }} ></Button>
                        </div>
                        <Table
                            columns={columns}
                            dataSource={this.state.data}
                            pagination={false}
                            name={this.props.name}
                            size="small"
                        />
                    </div>
                </Modal>
            </div>
        )
    }
}

export default UploadModal
