import React, { Component } from 'react'
import { Modal, Form, Input, Button, Icon, Table,notification } from 'antd'
import style from './style.less'
import { connect } from 'react-redux'
import axios from '../../../../api/axios';
import { docProjectTask } from '../../../../api/api'
import SubmitButton from "../../../../components/public/TopTags/SubmitButton"
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
        if (this.state.activeIndex == id) {
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

  /**
   * 确定
   */
  submitClick = () => {

        if(!this.state.record){
            notification.warning({
                placement: 'bottomRight',
                bottom: 50,
                duration: 2,
                message: '未选中数据',
                description: '请选择数据进行操作'
            })
            return;
        }

        this.props.handleOk(this.state.record);
    }



    render() {

        const { intl } = this.props.currentLocale;

        const LeftColumns = [{
            title: intl.get('wsd.i18n.sys.menu.menuname'),//名称
            dataIndex: 'name',
            key: 'name',
            width: 200,
            render: text => <span><Icon type="folder" className={style.leftTableIcon} />{text}</span>
        }, {
            title: intl.get('wsd.i18n.sys.menu.menucode'),//代码
            dataIndex: 'code',
            key: 'code',
        }];

        return (
            <div>

                <Modal
                    className={style.main}
                    width={900}
                    title={this.state.modalInfo.title}
                    centered={true}
                    visible={this.props.modalVisible}
                    onCancel={this.props.handleCancel}
                    footer={
                        <div className='modalbtn'>
                            <SubmitButton key="b" type="submit" onClick={this.props.handleCancel} content="取消" />
                            <SubmitButton key="saveAndSubmit" type="primary" onClick={this.submitClick} content="保存" />
                        </div>
                    }
                >

                    <div className={style.content}>

                        <Table rowKey={record => record.id}
                            columns={LeftColumns}
                            dataSource={this.state.LeftData} pagination={false}
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



