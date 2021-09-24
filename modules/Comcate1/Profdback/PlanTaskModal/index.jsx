
import React, { Component } from 'react'
import { Modal, Form, Input, Button, Icon, Table } from 'antd'
import style from './style.less'
import { connect } from 'react-redux'
import axios from '../../../../api/axios';
import { docProjectTask } from '../../../../api/api'
import * as dataUtil from "../../../../utils/dataUtil"
const { TextArea } = Input;

class PlanPreparedRelease extends Component {

    state = {
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
        if (this.state.activeIndex == id) {
            this.setState({
                activeIndex: null,
                record: null
            })
        } else {
            if (record.type == 'project' || record.type == 'define') {
                this.setState({
                    activeIndex: null,
                    record: null
                })
            } else {
                this.setState({
                    activeIndex: id,
                    record
                })
            }

        }

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
            render: (text, record) => dataUtil.getIconCell(record.type, text,record.taskType)
        },
        {
            title: intl.get('wsd.i18n.sys.menu.menucode'),//代码
            dataIndex: 'code',
            key: 'code',
        }];

        return (
            <div>

                <Modal
                    className={style.main}
                    width="850px"
                    title={intl.get('wsd.i18n.comu.meeting.plantask')}
                    centered={true}
                    visible={this.props.modalVisible}
                    onCancel={this.props.handleCancel}
                    footer={
                        <div className='modalbtn'>
                            <Button key="b" type="submit" onClick={this.props.handleCancel} >关闭</Button>
                            <Button key="saveAndSubmit" type="primary" onClick={this.submitClick} >保存</Button>
                        </div>
                    }
                >

                    <div className={style.content}>

                        {this.state.LeftData.length !== 0 &&
                            <Table rowKey={record => record.id} columns={LeftColumns} dataSource={this.state.LeftData} pagination={false}
                                size='small' rowClassName={this.setClassName} defaultExpandAllRows={true}
                                onRow={(record) => {
                                    return {
                                        onClick: (event) => {
                                            this.getInfo(record)
                                        }
                                    }
                                }}
                            />}

                    </div>


                </Modal>
            </div>
        )
    }

}


const PlanPreparedReleases = Form.create()(PlanPreparedRelease);
export default connect(state => ({
    currentLocale: state.localeProviderData
}))(PlanPreparedReleases);



