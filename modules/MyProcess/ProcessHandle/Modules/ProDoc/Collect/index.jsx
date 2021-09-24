import React, { Component } from 'react'
import { Modal, Button, Row, Col, Input, Icon, Select, Form, Table } from 'antd'
import style from './style.less'
import { connect } from 'react-redux'




const { TextArea } = Input;

class UploadDoc extends Component {

    state = {
        initDone: false,
        modalInfo: {
            title: '文档收藏'
        },
        inputValue: 0,
        LeftColumns: [{
            title: '文件夹名称',
            dataIndex: 'name',
            key: 'name',
            render: text => <span><Icon type="folder" className={style.leftTableIcon} />{text}</span>
        }],
        LeftData: [{
            key: 1,
            name: '项目招投标文件',
            quantity: 1,
            children: [{
                key: 11,
                name: '工程图纸文件',

            }]
        }, {
            key: 2,
            name: '工程合同文件',

            children: [{
                key: 21,
                name: '工程图纸文件',

            }, {
                key: 22,
                name: '工程图纸文件',

            }]
        }],

    }


    handleSubmit = (e) => {
        e.preventDefault()
        this.props.form.validateFieldsAndScroll((err, fieldsValue) => {
            if (!err) {
                const values = {
                    ...fieldsValue,
                    'planStartTime': fieldsValue['planStartTime'].format('YYYY-MM-DD'),
                    'planEndTime': fieldsValue['planEndTime'].format('YYYY-MM-DD'),
                }
                // emitter.emit('noticeUpdateEvents', { status: 'add', data: values })
                this.props.curdCurrentData({
                    title: localStorage.getItem('name'),
                    status: 'add',
                    data: values
                })
                //this.props.curdCurrentData('add', 'status')
                //this.props.curdCurrentData(values, 'data')

                // 清空表单项
                this.props.form.resetFields()
                // 关闭弹窗
                this.props.handleCancel()
            }
        })
    }

    onChange = (value) => {
        this.setState({
            inputValue: value,
        });
    }

    handleSubmit = (e) => {
        e.preventDefault()
        this.props.form.validateFieldsAndScroll((err, fieldsValue) => {
            if (!err) {
                // const values = {
                //     ...fieldsValue,
                //     'planStartTime': fieldsValue['planStartTime'].format('YYYY-MM-DD'),
                //     'planEndTime': fieldsValue['planEndTime'].format('YYYY-MM-DD'),
                // }
                // emitter.emit('noticeUpdateEvents', { status: 'add', data: values })
                // this.props.curdCurrentData({
                //     title: localStorage.getItem('name'),
                //     status: 'add',
                //     data: values
                // })
                //this.props.curdCurrentData('add', 'status')
                //this.props.curdCurrentData(values, 'data')

                // 清空表单项
                this.props.form.resetFields()
                // 关闭弹窗
                // this.props.handleCancel('UploadVisible')
                this.handleCancel.bind(this)
            }
        })
    }



    handleCancel() {
        this.props.handleCancel('UpgradeVisible')
    }

    render() {
        const { intl } = this.props.currentLocale;
        let formData = {
            docTitle: 'EC00620-pmis.xls',
            docNum: '000',
            classification: '非密',
            docName: '请输入文件名称',
            versions: '1.0',
            authors: '任正华'
        }

        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };
        const formItemLayout2 = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 2 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 22 },
            },
        };

        return (
            <div>

                <Modal
                    className={style.main}
                    width="850px"
                    title={this.state.modalInfo.title}
                    forceRender={true} centered={true}
                    visible={this.props.modalVisible}
                    onCancel={this.handleCancel.bind(this)}
                    footer={
                        <div className='modalbtn'>
                            <Button key="bsf" type="primary" block className={style.btn} ghost>新建文件夹</Button>
                            <Button key="b" type="submit" onClick={this.handleCancel.bind(this)} >关闭</Button>
                            <Button key="saveAndSubmit" onClick={this.handleSubmit} type="primary">保存</Button>
                        </div>
                    }
                >

                    <div className={style.content}>
                        <Form>
                            <div className={style.content}>
                                <Row type="flex">
                                    <Col span={24}>
                                        <Form.Item label='文档标题' {...formItemLayout2}>
                                            <div className={style.list}>
                                                {getFieldDecorator('docTitle', {
                                                    initialValue: formData.docTitle,
                                                    rules: [],
                                                })(
                                                    <Input />
                                                )}
                                            </div>
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>

                                        <Table rowKey={record => record.key} columns={this.state.LeftColumns} dataSource={this.state.LeftData} pagination={false} />

                                    </Col>



                                </Row>
                            </div>
                        </Form>

                    </div>

                </Modal>

            </div>
        )
    }

}


const UploadDocs = Form.create()(UploadDoc);
export default connect(state => ({
    currentLocale: state.localeProviderData,
}))(UploadDocs);

