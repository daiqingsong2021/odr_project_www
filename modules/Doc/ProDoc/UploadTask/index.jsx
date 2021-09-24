import React, { Component } from 'react'
import { Modal, Form, Input, Button, Icon, Table } from 'antd'
import style from './style.less'
import { connect } from 'react-redux'
import MyIcon from '../../../../components/public/TopTags/MyIcon'
import axios from '../../../../api/axios';
import { docProjectTask } from '../../../../api/api'

const { TextArea } = Input;

class UploadDoc extends Component {

    state = {
        initDone: false,
        modalInfo: {
            title: 'WBS/任务'
        },

        LeftData: [],
        activeIndex: null,
        record: null,

    }

    getData = () => {
        axios.get(docProjectTask(this.props.projectId)).then(res => {
            this.setState({
                LeftData: res.data.data
            })
        })
    }

    componentDidMount() {
        this.getData();
    }

    setClassName = (record, index) => {
        //判断索引相等时添加行的高亮样式
        return record.id === this.state.activeIndex ? 'tableActivty' : "";
    }

    getInfo(record) {

        let id = record.id, records = record

        if(record.type == 'project' || record.type == 'define'){
            return
        }

        this.setState({
            activeIndex: id,
            record
        })


    }

    submitClick = () => {

        if (this.state.record) {

            this.props.taskData(this.state.record);
            this.props.handleCancel();

        }


    }



    render() {

        const { intl } = this.props.currentLocale;

        const LeftColumns = [{
            title: intl.get('wsd.i18n.sys.menu.menuname'),//名称
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => {
                if (record.type == "project") {
                    return <span><MyIcon type="icon-xiangmu" className={style.leftTableIcon} />{text}</span>
                } else if (record.type == "define") {
                    return <span><MyIcon type="icon-jihua1" className={style.leftTableIcon} />{text}</span>
                } else if (record.type == "wbs") {
                    return <span><MyIcon type="icon-WBS" className={style.leftTableIcon} />{text}</span>
                } else if (record.type == "task") {
                    return <span><MyIcon type="icon-renwu1" className={style.leftTableIcon} />{text}</span>
                }
            }
        }, {
            title: intl.get('wsd.i18n.sys.menu.menucode'),//代码
            dataIndex: 'code',
            key: 'code',
        }];

        return (
            <div>

                <Modal
                    className={style.main}
                    width="850px"
                    title={this.state.modalInfo.title}
                    centered={true}
                    visible={this.props.modalVisible}
                    onCancel={this.props.handleCancel}
                    mask={false} maskClosable={false}
                    footer={
                        <div className='modalbtn'>
                            {/* 关闭 */}
                            <Button key="b" type="submit" onClick={this.props.handleCancel} >{intl.get('wsd.global.btn.close')}</Button>
                            {/* 保存 */}
                            <Button key="saveAndSubmit" type="primary" onClick={this.submitClick} >{intl.get('wsd.global.btn.preservation')}</Button>
                        </div>
                    }
                >

                    <div className={style.content}>

                        <Table rowKey={record => record.id} columns={LeftColumns} dataSource={this.state.LeftData} pagination={false}
                            size='small' rowClassName={this.setClassName}
                            onRow={(record) => {
                                return {
                                    onClick: (event) => {
                                        this.getInfo(record)
                                    }
                                }
                            }}
                        />

                    </div>


                </Modal>
            </div>
        )
    }

}


const UploadDocs = Form.create()(UploadDoc);
export default connect(state => ({
    currentLocale: state.localeProviderData
}))(UploadDocs);



