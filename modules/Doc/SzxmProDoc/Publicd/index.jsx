import React, { Component } from 'react'
import { Modal, Button, Input, Icon, Table, notification } from 'antd';
import style from './style.less'
import PageTable from "../../../../components/PublicTable"
import { connect } from 'react-redux'
import axios from '../../../../api/axios'
import { docProjectRelease } from '../../../../api/api'
import { docProjectReleaseList } from '../../../Suzhou/api/suzhou-api.js';
import SubmitButton from "../../../../components/public/TopTags/SubmitButton"
import * as dataUtil from "../../../../utils/dataUtil"


const { TextArea } = Input;

class Publicd extends Component {

    state = {
        selectedRowKeys: [],
    }

    getDataList = (callBack) => {
        axios.get(docProjectReleaseList(this.props.projectId,this.props.folderId,this.props.sectionIds ? this.props.sectionIds : 0)).then(res=>{
           
            if(res.data.data){
                callBack(res.data.data)
            }else{
                callBack([])
            }
          
        })
    }

  

    handleCancel() {
        this.props.handleCancel('PublicdVisible')
    }

    submitClick = () => {
        let { selectedRowKeys } = this.state;
        if (selectedRowKeys == 0) {
          dataUtil.message("请勾选数据进行操作！")
          return false
        }
        const { startContent } = this.props
        let url = dataUtil.spliceUrlParams(docProjectRelease, { startContent });
        axios.put(url, selectedRowKeys, true, '发布成功', true).then(res => {
            this.props.refreshRight();
            this.props.handleCancel();
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

  //右侧表格点击行事件
  getInfo = (record) => {
    this.setState({
      rightData: record

    })
  }
    render() {
        const { intl } = this.props.currentLocale;

        let { selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
                this.setState({
                    selectedRowKeys,
                })
            },
        }

        const columns = [{
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
            width:"25%"
        }];

        return (
            <div>

                <Modal
                    className={style.main}
                    width="850px"
                    // 文档发布
                    title={intl.get('wsd.i18n.doc.projectdoc.docpublicd')}
                    centered={true}
                    visible={true}
                    onCancel={this.handleCancel.bind(this)}
                    footer={
                        <div className='modalbtn'>
                            <SubmitButton key="b" type="submit" onClick={this.handleCancel.bind(this)} content="取消" />
                            <SubmitButton key="saveAndSubmit" type="primary" onClick={this.submitClick} content="保存" />
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
                            columns={columns}
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
    currentLocale: state.localeProviderData
}))(Publicd)



