import React, { Component } from 'react'
import { Modal, Button, Input, Icon, Table, notification } from 'antd';
import style from './style.less'
import { connect } from 'react-redux'
import SubmitButton from "../../../../components/public/TopTags/SubmitButton"
import axios from '../../../../api/axios'
import { docReleaseList, docCorpRelease,docReleaseListByFolderId } from '../../../../api/api'
import PageTable from '../../../../components/PublicTable';
import * as dataUtil from '../../../../utils/dataUtil';


const { TextArea } = Input;

class Publicd extends Component {

    state = {
        initDone: false,
        modalInfo: {
            title: '文档发布'
        },
        inputValue: 0,
        RightData: [],
        activeIndex: null,
        record: null,
        selectedRowKeys: [],

    }

    /**
     @method 父组件即可调用子组件方法
     @description 父组件即可调用子组件方法
     */
    onRef = (ref) => {
       this.table = ref
    }

    getDataList = (callBack) => {
        axios.get(docReleaseListByFolderId(this.props.folderId ?this.props.folderId : 0)).then(res => {
            if(res.data.data){
                callBack(res.data.data)
                this.setState({
                  RightData: res.data.data
                })
            }else{
              callBack([])
            }
        })
    }

    componentDidMount() {
//        this.getDataList();
    }


    handleCancel() {
        this.props.handleCancel('PublicdVisible')
    }

    setClassName = (record, index) => {
        //判断索引相等时添加行的高亮样式
        return record.id === this.state.activeIndex ? 'tableActivty' : "";
    }
    getInfo = (record) => {
        this.setState({
            rightData: record
        })

    }

    /**
     * 获取复选框 选中项、选中行数据
     * @method
     * @param {string} selectedRowKeys 复选框选中项
     * @param {string} selectedRows  行数据
     */
    getSelectedRowKeys = (selectedRowKeys, selectedRows) => {
        this.setState({
          selectedRows,
          selectedRowKeys
        })
    }


  submit = () => {
        let { selectedRowKeys } = this.state;
        if (selectedRowKeys == 0) {
          dataUtil.message("请勾选数据进行操作！")
          return false
        }
     
        axios.put(docCorpRelease, selectedRowKeys, true, '发布成功').then(res => {

            this.props.update(res.data.data)
            this.setState({
                selectedRowKeys: []
            })
            this.handleCancel();
        })
    }

    render() {

        const { intl } = this.props.currentLocale;
        let { selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
                this.setState({
                    selectedRowKeys
                })
            },

        }

        const RightColumns = [{
            title: intl.get('wsd.i18n.doc.temp.title'),//文档标题
            dataIndex: 'docTitle',
            key: 'docTitle',
            width:"35%"
        }, {
            title: intl.get('wsd.i18n.doc.compdoc.docserial'),//文档编号
            dataIndex: 'docNum',
            key: 'docNum',
            width:"35%"
        }, {
            title: intl.get('wsd.i18n.doc.temp.versions'),//版本
            dataIndex: 'version',
            key: 'version',
            width:"35%"
        }];

        return (
            <div>

                <Modal
                    className={style.main}
                    width="850px"
                    title={this.state.modalInfo.title}
                    centered={true}
                    visible={this.props.modalVisible}
                    onCancel={this.handleCancel.bind(this)}
                    mask={false} maskClosable={false}
                    footer={
                        <div className='modalbtn'>
                            <SubmitButton key="b" type="submit" onClick={this.handleCancel.bind(this)} content="取消" />
                            <SubmitButton key="saveAndSubmit" type="primary" onClick={this.submit} content="确认" />
                        </div>
                    }
                >

                    <div className={style.content}>

                      <PageTable onRef={this.onRefR}
                           rowSelection={true}
                           pagination={false}
                           useCheckBox={true}
                           onChangeCheckBox={this.getSelectedRowKeys}
                           getData={this.getDataList}
                           closeContentMenu={true}
                           columns={RightColumns}
                           getRowData={this.getInfo}
                           scroll={{ x: '100%', y: 400 }}
                      />


                    </div>

                </Modal>

            </div>
        )
    }

}


export default connect(state => ({
    currentLocale: state.localeProviderData,
}))(Publicd)



