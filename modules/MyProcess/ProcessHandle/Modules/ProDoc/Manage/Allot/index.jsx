import React, { Component } from 'react'
import { Modal, Button, Row, Col, Input, Icon, Table, Form } from 'antd'
import style from './style.less'

import { connect } from 'react-redux'





class Allot extends Component {

    state = {
        initDone: false,
        modalInfo: {
            title: '模板导入'
        },
        inputValue: 0,
        task: false,
        columns: [{
            title: '分类码',
            dataIndex: 'name',
        }, {
            title: '码值',
            dataIndex: 'age',
        }, {
            title: '说明',
            dataIndex: 'address',
        }],
        data: []

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




    taskHandleCancel = () => {
        this.setState({
            task: false
        })
    }

    handleCancel() {
        this.props.handleCancel()
    }

    render() {
        const { intl } = this.props.currentLocale;
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
                                <Button key="b" type="submit" onClick={this.handleCancel.bind(this)} >关闭</Button>
                                <Button key="saveAndSubmit" type="primary" >保存</Button>
                            </div>
                        }
                    >

                        <div className={style.content}>
                            <div className={style.search}>
                                <span>
                                    <Icon type="search" className={style.icon} />
                                    <input type="text" placeholder="代码/名称" />
                                </span>
                                <span>搜索</span>
                            </div>

                            <Table columns={this.state.columns} dataSource={this.state.data} size="middle" />

                        </div>

                    </Modal>
          
            </div>
        )
    }

}



const mapStateToProps = state => {
    return {
        currentLocale: state.localeProviderData,
        
    }
};


export default connect(mapStateToProps, null)(Allot);

