import React, { Component } from 'react'
import { Modal, Button, Row, Col, Input, Icon, Select, Form, Table, notification } from 'antd'
import style from './style.less'
import { connect } from 'react-redux'
import MyIcon from '../../../../components/public/TopTags/MyIcon'
import SubmitButton from "../../../../components/public/TopTags/SubmitButton"
import * as util from '../../../../utils/util'
import axios from '../../../../api/axios'
import { docFavoriteTree, docFavoriteUpdate, docFavoriteAdd, docFavoriteDoc } from '../../../../api/api'


const { TextArea } = Input;

class UploadDoc extends Component {

    state = {

        inputValue: 0,

        LeftData: [],
        dataMap: [],
        activeIndex: null,
        rightData: null,
        clickId: null,

    }

    getData = () => {
        axios.get(docFavoriteTree).then(res => {
            if (res.data.data) {
                let dataMap = util.dataMap(res.data.data)
                this.setState({
                    LeftData: res.data.data,
                    dataMap
                })
            }
        })
    }

    componentDidMount() {
        this.getData();
    }


    handleSubmit = () => {
        if (this.state.rightData) {
            axios.post(docFavoriteDoc(this.props.record.id, this.state.rightData.id), {}, true, '收藏成功',true).then(res => {
                this.props.update();
                this.handleCancel();
            })
        } else {
            notification.warning(
                {
                    placement: 'bottomRight',
                    bottom: 50,
                    duration: 2,
                    message: '未选中数据',
                    description: '请选择收藏夹进行操作'
                }
            )
        }

    }

    onChange = (value) => {
        this.setState({
            inputValue: value,
        });
    }

    setClassName = (record, index) => {
        //判断索引相等时添加行的高亮样式
        return record.id === this.state.activeIndex ? 'tableActivty' : "";
    }

    getInfo = (record) => {

        let id = record.id, records = record

        if (this.state.activeIndex == id) {
            this.setState({
                activeIndex: null,
                rightData: null
            })
        } else {
            this.setState({
                activeIndex: id,
                rightData: record
            })
        }
    }

    //表格 新建文件夹
    addFolder = () => {
        let { rightData } = this.state;
        let data = {
            parentId: rightData ? rightData.id : 0,
            name: this.props.currentLocale.intl.get("wsd.global.btn.newfolder") //新建文件夹
        }

        axios.post(docFavoriteAdd, data, true, '新增成功',true).then(res => {
            let { LeftData, dataMap } = this.state;
            if (rightData) {

                util.create(LeftData, dataMap, rightData, res.data.data)
                this.setState({
                    LeftData,
                    dataMap,
                }, () => {
                    this.setState({
                        clickId: res.data.data.id
                    })
                })
            } else {
                LeftData.push(res.data.data);
                let dataMap = util.dataMap(LeftData);
                this.setState({
                    LeftData,
                    dataMap,
                }, () => {
                    this.setState({
                        clickId: res.data.data.id
                    })
                })
            }

        })
    }

    //表格 修改名称 input输入框失去焦点事件
    inputBlur = (record, e) => {
        let data = {
            id: record.id,
            name: e.target.value
        }
        let oldRecord = { ...record };
        axios.put(docFavoriteUpdate, data, true, '修改成功',true).then(res => {
            record.name = res.data.data.name;
            let { LeftData, dataMap } = this.state;
            util.modify(LeftData, dataMap, oldRecord, record);
            this.setState({
                LeftData
            })
        })

        this.setState({ clickId: null });
    }


    handleCancel() {
        this.props.handleCancel('UpgradeVisible')
    }

    render() {

        const { intl } = this.props.currentLocale;

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

        const LeftColumns = [{
            title: intl.get('wsd.i18n.doc.compdoc.foldername'),//文件夹名称
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => {
                if (record.id == this.state.clickId) {
                    return (
                        <span>
                            <Input defaultValue={text} onBlur={this.inputBlur.bind(this, record)} style={{ width: '200px' }} autoFocus='autofocus' />
                        </span>
                    )
                } else {
                    return (<span><MyIcon type="icon-wenjianjia" className={style.leftTableIcon} />{text}</span>)
                }
            }
        }];

        return (
            <div>
                <Modal
                    className={style.main}
                    width="850px"
                    title={intl.get('wsd.i18n.doc.projectdoc.doccollect')}
                    centered={true}
                    visible={this.props.modalVisible}
                    onCancel={this.handleCancel.bind(this)}
                    mask={false}
                    maskClosable={false}
                    footer={
                        <div className='modalbtn'>
                            {/* 新建文件夹 */}
                            <SubmitButton key="bwee" type="primary" block className={style.btn} onClick={this.addFolder} content={intl.get('wsd.global.btn.newfolder')} />
                            <SubmitButton key="b" type="submit" onClick={this.handleCancel.bind(this)} content={"取消"} />
                            {/* 保存 */}
                            <SubmitButton key="saveAndSubmit" onClick={this.handleSubmit} type="primary" content={intl.get('wsd.global.btn.preservation')} />
                        </div>
                    }
                >

                    <div className={style.content}>
                        <Form>
                            <div className={style.content}>
                                <Row type="flex">
                                    <Col span={24}>
                                        {/* 文档标题 */}
                                        <Form.Item label={intl.get('wsd.i18n.doc.temp.title')} {...formItemLayout2}>
                                            <div className={style.list}>
                                                {getFieldDecorator('docTitle', {
                                                    initialValue: this.props.record ? this.props.record.docTitle  : '',
                                                    rules: [],
                                                })(
                                                    <Input />
                                                )}
                                            </div>
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>

                                        <Table rowKey={record => record.id} columns={LeftColumns} dataSource={this.state.LeftData} pagination={false}
                                            rowClassName={this.setClassName}
                                            onRow={(record) => {
                                                return {
                                                    onClick: (event) => {
                                                        this.getInfo(record)
                                                    }
                                                }
                                            }}
                                        />

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



